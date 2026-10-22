import { test } from "node:test";
import assert from "node:assert/strict";
import { organization } from "better-auth/plugins";
import type { Tenant } from "../src/index.js";
import { codeOf, setup } from "./helpers.js";

/**
 * Organization routes that take an organization, member or invitation from the
 * request, with the organization bridge on: a tenant's host only reaches that
 * tenant's organization.
 */

const ORG_OF: Record<string, string> = { acme: "org_acme", globex: "org_globex" };
const getOrganizationId = (tenant: Tenant) => ORG_OF[tenant.slug];
const EMAIL = "user@example.com";

function scopeSetup() {
  const ctx = setup({ getOrganizationId }, { plugins: [organization({ teams: { enabled: true } })] });
  const now = new Date();
  const later = new Date(Date.now() + 3600_000);
  ctx.db.organization!.push(
    { id: "org_acme", name: "Acme", slug: "acme", createdAt: now },
    { id: "org_globex", name: "Globex", slug: "globex", createdAt: now },
  );
  ctx.db.team!.push(
    { id: "team_acme", name: "Acme Eng", organizationId: "org_acme", createdAt: now, updatedAt: now },
    { id: "team_globex", name: "Globex Eng", organizationId: "org_globex", createdAt: now, updatedAt: now },
  );
  const invitation = (id: string, organizationId: string) => ({
    id,
    organizationId,
    email: EMAIL,
    role: "member",
    status: "pending",
    expiresAt: later,
    inviterId: "someone",
    createdAt: now,
  });
  ctx.db.invitation!.push(invitation("inv_acme", "org_acme"), invitation("inv_globex", "org_globex"));
  /** Make the (only) user an owner of both organizations, and of a second member in each. */
  const joinBoth = () => {
    const userId = ctx.db.user![0]!.id as string;
    ctx.db.user![0]!.emailVerified = true;
    for (const inv of ctx.db.invitation!) inv.inviterId = userId;
    for (const id of ["other_1", "other_2"]) {
      ctx.db.user!.push({ id, email: `${id}@example.com`, name: id, emailVerified: true, createdAt: now, updatedAt: now });
    }
    ctx.db.member!.push(
      { id: "m_acme", organizationId: "org_acme", userId, role: "owner", createdAt: now },
      { id: "m_globex", organizationId: "org_globex", userId, role: "owner", createdAt: now },
      { id: "m_acme_2", organizationId: "org_acme", userId: "other_1", role: "member", createdAt: now },
      { id: "m_globex_2", organizationId: "org_globex", userId: "other_2", role: "member", createdAt: now },
    );
  };
  const post = (cookie: string, path: string, body: Record<string, unknown>) =>
    ctx.request("acme.example.com", path, { method: "POST", body, cookie });
  const get = (cookie: string, path: string) => ctx.request("acme.example.com", path, { cookie });
  return { ...ctx, joinBoth, post, get };
}

const refused = async (res: Response, code = "ORGANIZATION_TENANT_MISMATCH") => {
  assert.equal(res.status, 403, await res.clone().text());
  assert.equal(await codeOf(res), code);
};

async function signedIn() {
  const s = scopeSetup();
  const cookie = await s.signUp("acme.example.com");
  s.joinBoth();
  return { ...s, cookie };
}

test("invite-member refuses another tenant's organization and accepts its own", async () => {
  const { cookie, post, db } = await signedIn();
  await refused(await post(cookie, "/organization/invite-member", { email: "new@example.com", role: "member", organizationId: "org_globex" }));
  assert.equal(db.invitation!.length, 2);
  const own = await post(cookie, "/organization/invite-member", { email: "new@example.com", role: "member" });
  assert.equal(own.status, 200, await own.clone().text());
});

test("invite-member refuses a team of another organization", async () => {
  const { cookie, post } = await signedIn();
  await refused(await post(cookie, "/organization/invite-member", { email: "new@example.com", role: "member", teamId: "team_globex" }), "TEAM_TENANT_MISMATCH");
  await refused(
    await post(cookie, "/organization/invite-member", { email: "new@example.com", role: "member", teamId: ["team_acme", "team_globex"] }),
    "TEAM_TENANT_MISMATCH",
  );
  const own = await post(cookie, "/organization/invite-member", { email: "new@example.com", role: "member", teamId: "team_acme" });
  assert.equal(own.status, 200, await own.clone().text());
});

test("invitations of another organization cannot be read, accepted, rejected or cancelled", async () => {
  const { cookie, post, get, db } = await signedIn();
  await refused(await get(cookie, "/organization/get-invitation?id=inv_globex"));
  for (const path of ["accept-invitation", "reject-invitation", "cancel-invitation"]) {
    await refused(await post(cookie, `/organization/${path}`, { invitationId: "inv_globex" }));
  }
  assert.equal(db.invitation!.find((i) => i.id === "inv_globex")!.status, "pending");
});

test("an invitation of the tenant's organization still works", async () => {
  const { cookie, post, get } = await signedIn();
  assert.equal((await get(cookie, "/organization/get-invitation?id=inv_acme")).status, 200);
  const res = await post(cookie, "/organization/cancel-invitation", { invitationId: "inv_acme" });
  assert.equal(res.status, 200, await res.clone().text());
});

test("an unknown invitation is left to Better Auth", async () => {
  const { cookie, post } = await signedIn();
  const res = await post(cookie, "/organization/cancel-invitation", { invitationId: "nope" });
  assert.equal(res.status, 400);
});

test("list-user-invitations only returns the tenant's invitations", async () => {
  const { cookie, get } = await signedIn();
  const res = await get(cookie, "/organization/list-user-invitations");
  assert.equal(res.status, 200, await res.clone().text());
  assert.deepEqual(((await res.json()) as { id: string }[]).map((i) => i.id), ["inv_acme"]);
});

test("members of another organization cannot be removed or have their role changed", async () => {
  const { cookie, post, db } = await signedIn();
  await refused(await post(cookie, "/organization/remove-member", { memberIdOrEmail: "m_globex_2" }));
  await refused(await post(cookie, "/organization/remove-member", { memberIdOrEmail: "m_globex_2", organizationId: "org_globex" }));
  await refused(await post(cookie, "/organization/update-member-role", { memberId: "m_globex_2", role: "admin" }));
  await refused(await post(cookie, "/organization/update-member-role", { memberId: "m_globex_2", role: "admin", organizationId: "org_globex" }));
  assert.equal(db.member!.find((m) => m.id === "m_globex_2")!.role, "member");

  const role = await post(cookie, "/organization/update-member-role", { memberId: "m_acme_2", role: "admin" });
  assert.equal(role.status, 200, await role.clone().text());
  const removed = await post(cookie, "/organization/remove-member", { memberIdOrEmail: "m_acme_2" });
  assert.equal(removed.status, 200, await removed.clone().text());
});

test("check-slug does not tell whether another organization exists", async () => {
  const { cookie, post } = await signedIn();
  await refused(await post(cookie, "/organization/check-slug", { slug: "globex" }));
  await refused(await post(cookie, "/organization/check-slug", { slug: "free-slug" }));
});

test("an explicit organization other than the tenant's is refused on the other routes too", async () => {
  const { cookie, post, get } = await signedIn();
  // Older Better Auth releases lack some routes (get-organization is new in 1.7),
  // and an unknown route is a 404 from the router before any hook runs.
  const exposed = new Set(Object.values(organization().endpoints).map((e) => (e as { path: string }).path));
  const paths = ["list-members", "list-invitations", "get-organization", "get-full-organization", "get-active-member-role"].filter((p) =>
    exposed.has(`/organization/${p}`),
  );
  assert.ok(paths.length >= 4, paths.join());
  for (const query of ["organizationId=org_globex", "organizationSlug=globex"]) {
    for (const path of paths) {
      await refused(await get(cookie, `/organization/${path}?${query}`));
    }
  }
  await refused(await post(cookie, "/organization/delete", { organizationId: "org_globex" }));
  await refused(await post(cookie, "/organization/update", { organizationId: "org_globex", data: { name: "Hacked" } }));
});

test("the tenant's own organization works on the other routes", async () => {
  const { cookie, get } = await signedIn();
  for (const query of ["", "?organizationId=org_acme", "?organizationSlug=acme"]) {
    const res = await get(cookie, `/organization/list-members${query}`);
    assert.equal(res.status, 200, await res.clone().text());
  }
});

test("a session that predates the bridge cannot use implicit-organization routes", async () => {
  const { cookie, post, db } = await signedIn();
  db.session[0]!.activeOrganizationId = "org_globex";
  await refused(await post(cookie, "/organization/invite-member", { email: "new@example.com", role: "member" }));
});
