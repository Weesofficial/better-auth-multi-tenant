import { test } from "node:test";
import assert from "node:assert/strict";
import { organization } from "better-auth/plugins";
import type { Tenant } from "../src/index.js";
import { codeOf, setup } from "./helpers.js";

/**
 * Teams in Better Auth's `organization` plugin, with the organization bridge on:
 * a tenant's host only works on teams of that tenant's organization.
 */

const ORG_OF: Record<string, string> = { acme: "org_acme", globex: "org_globex" };
const getOrganizationId = (tenant: Tenant) => ORG_OF[tenant.slug];

function teamSetup(withBridge = true) {
  const ctx = setup(withBridge ? { getOrganizationId } : {}, { plugins: [organization({ teams: { enabled: true } })] });
  const now = new Date();
  ctx.db.organization!.push(
    { id: "org_acme", name: "Acme", slug: "acme", createdAt: now },
    { id: "org_globex", name: "Globex", slug: "globex", createdAt: now },
  );
  ctx.db.team!.push(
    { id: "team_acme", name: "Acme Eng", organizationId: "org_acme", createdAt: now, updatedAt: now },
    { id: "team_globex", name: "Globex Eng", organizationId: "org_globex", createdAt: now, updatedAt: now },
  );
  /** Make the (only) user an owner of both organizations and a member of both teams. */
  const joinBoth = () => {
    const userId = ctx.db.user![0]!.id as string;
    ctx.db.member!.push(
      { id: "m_acme", organizationId: "org_acme", userId, role: "owner", createdAt: now },
      { id: "m_globex", organizationId: "org_globex", userId, role: "owner", createdAt: now },
    );
    ctx.db.teamMember!.push(
      { id: "tm_acme", teamId: "team_acme", userId, createdAt: now },
      { id: "tm_globex", teamId: "team_globex", userId, createdAt: now },
    );
    return userId;
  };
  const post = (cookie: string, path: string, body: Record<string, unknown>) =>
    ctx.request("acme.example.com", path, { method: "POST", body, cookie });
  const get = (cookie: string, path: string) => ctx.request("acme.example.com", path, { cookie });
  return { ...ctx, joinBoth, post, get };
}

const refused = async (res: Response, code: string) => {
  assert.equal(res.status, 403, await res.clone().text());
  assert.equal(await codeOf(res), code);
};

const ids = async (res: Response) => ((await res.json()) as { id: string }[]).map((t) => t.id);

test("a team is created in the tenant's organization", async () => {
  const { db, joinBoth, post, signUp } = teamSetup();
  const cookie = await signUp("acme.example.com");
  joinBoth();
  const res = await post(cookie, "/organization/create-team", { name: "Ops" });
  assert.equal(res.status, 200, await res.clone().text());
  assert.equal(db.team!.find((t) => t.name === "Ops")!.organizationId, "org_acme");
});

test("a team cannot be created in another tenant's organization", async () => {
  const { db, joinBoth, post, signUp } = teamSetup();
  const cookie = await signUp("acme.example.com");
  joinBoth();
  await refused(await post(cookie, "/organization/create-team", { name: "Ops", organizationId: "org_globex" }), "ORGANIZATION_TENANT_MISMATCH");
  assert.equal(db.team!.length, 2);
});

test("a team of another tenant's organization cannot be updated or removed", async () => {
  const { db, joinBoth, post, signUp } = teamSetup();
  const cookie = await signUp("acme.example.com");
  joinBoth();
  await refused(
    await post(cookie, "/organization/update-team", { teamId: "team_globex", data: { name: "x", organizationId: "org_globex" } }),
    "ORGANIZATION_TENANT_MISMATCH",
  );
  await refused(await post(cookie, "/organization/update-team", { teamId: "team_globex", data: { name: "x" } }), "TEAM_TENANT_MISMATCH");
  await refused(await post(cookie, "/organization/remove-team", { teamId: "team_globex", organizationId: "org_globex" }), "ORGANIZATION_TENANT_MISMATCH");
  assert.equal(db.team!.find((t) => t.id === "team_globex")!.name, "Globex Eng");
});

test("teams are listed for the tenant's organization only", async () => {
  const { get, joinBoth, signUp } = teamSetup();
  const cookie = await signUp("acme.example.com");
  joinBoth();
  await refused(await get(cookie, "/organization/list-teams?organizationId=org_globex"), "ORGANIZATION_TENANT_MISMATCH");
  assert.deepEqual(await ids(await get(cookie, "/organization/list-teams")), ["team_acme"]);

  // Without an organization, list-user-teams would return every organization's teams.
  await refused(await get(cookie, "/organization/list-user-teams?organizationId=org_globex"), "ORGANIZATION_TENANT_MISMATCH");
  assert.deepEqual(await ids(await get(cookie, "/organization/list-user-teams")), ["team_acme"]);
});

test("members of another tenant's team cannot be listed, added or removed", async () => {
  const { joinBoth, get, post, signUp } = teamSetup();
  const cookie = await signUp("acme.example.com");
  const userId = joinBoth();
  await refused(await get(cookie, "/organization/list-team-members?teamId=team_globex"), "TEAM_TENANT_MISMATCH");
  await refused(await post(cookie, "/organization/add-team-member", { teamId: "team_globex", userId }), "TEAM_TENANT_MISMATCH");
  await refused(
    await post(cookie, "/organization/add-team-member", { teamId: "team_globex", userId, organizationId: "org_globex" }),
    "ORGANIZATION_TENANT_MISMATCH",
  );
  await refused(await post(cookie, "/organization/remove-team-member", { teamId: "team_globex", userId }), "TEAM_TENANT_MISMATCH");

  const own = await get(cookie, "/organization/list-team-members?teamId=team_acme");
  assert.equal(own.status, 200, await own.clone().text());
});

test("only the tenant's own team can become the active team", async () => {
  const { db, joinBoth, post, signUp } = teamSetup();
  const cookie = await signUp("acme.example.com");
  joinBoth();
  await refused(await post(cookie, "/organization/set-active-team", { teamId: "team_globex" }), "TEAM_TENANT_MISMATCH");
  assert.equal(db.session[0]!.activeTeamId ?? null, null);

  const res = await post(cookie, "/organization/set-active-team", { teamId: "team_acme" });
  assert.equal(res.status, 200, await res.clone().text());
  assert.equal(db.session[0]!.activeTeamId, "team_acme");
});

test("accepting an invitation to another organization's team is refused", async () => {
  const { db, post, signUp } = teamSetup();
  const cookie = await signUp("acme.example.com");
  db.invitation!.push({
    id: "inv_globex",
    organizationId: "org_globex",
    email: "user@example.com",
    role: "member",
    status: "pending",
    teamId: "team_globex",
    inviterId: "someone",
    expiresAt: new Date(Date.now() + 3_600_000),
    createdAt: new Date(),
  });
  const res = await post(cookie, "/organization/accept-invitation", { invitationId: "inv_globex" });
  assert.equal(res.status, 403, await res.clone().text());
  assert.equal(db.session[0]!.activeTeamId ?? null, null);
  assert.equal(db.session[0]!.activeOrganizationId, "org_acme");
});

test("clearing the active organization clears the active team", async () => {
  const { db, joinBoth, post, signUp } = teamSetup();
  const cookie = await signUp("acme.example.com");
  joinBoth();
  await post(cookie, "/organization/set-active-team", { teamId: "team_acme" });
  assert.equal(db.session[0]!.activeTeamId, "team_acme");
  // Leaving the organization is how it gets cleared: set-active refuses null on a tenant's host.
  db.member!.find((m) => m.id === "m_acme")!.role = "member";
  const res = await post(cookie, "/organization/leave", { organizationId: "org_acme" });
  assert.equal(res.status, 200, await res.clone().text());
  assert.equal(db.session[0]!.activeOrganizationId ?? null, null);
  assert.equal(db.session[0]!.activeTeamId ?? null, null);
});

test("a session left with another organization active cannot use team routes", async () => {
  const { db, joinBoth, post, signUp } = teamSetup();
  const cookie = await signUp("acme.example.com");
  joinBoth();
  db.session[0]!.activeOrganizationId = "org_globex";
  await refused(await post(cookie, "/organization/create-team", { name: "Ops" }), "ORGANIZATION_TENANT_MISMATCH");
});

test("without getOrganizationId teams behave as usual", async () => {
  const { joinBoth, get, post, signUp } = teamSetup(false);
  const cookie = await signUp("acme.example.com");
  joinBoth();
  const res = await post(cookie, "/organization/set-active-team", { teamId: "team_globex" });
  assert.notEqual(await codeOf(res), "TEAM_TENANT_MISMATCH");
  assert.equal((await ids(await get(cookie, "/organization/list-user-teams"))).length, 2);
});
