import { test } from "node:test";
import assert from "node:assert/strict";
import { organization } from "better-auth/plugins";
import type { Tenant } from "../src/index.js";
import { codeOf, setup } from "./helpers.js";

/**
 * Regression tests for the white-box security review: one user signed in to
 * two tenants must not be able to reach the other tenant's sessions or
 * organization from either host.
 */

const signIn = async (ctx: ReturnType<typeof setup>, host: string, email = "user@example.com") => {
  const res = await ctx.request(host, "/sign-in/email", {
    method: "POST",
    body: { email, password: "correct-horse-battery" },
  });
  assert.equal(res.status, 200, await res.clone().text());
  return res.headers.get("set-cookie")!.split(";")[0]!;
};

test("list-sessions only returns the current tenant's sessions", async () => {
  const ctx = setup();
  const acme = await ctx.signUp("acme.example.com");
  await signIn(ctx, "globex.example.com");

  const res = await ctx.request("acme.example.com", "/list-sessions", { cookie: acme });
  assert.equal(res.status, 200);
  const sessions = (await res.json()) as { tenantId?: string; token?: string }[];
  assert.equal(sessions.length, 1);
  assert.equal(sessions[0]!.tenantId, "t_acme");
  const globexToken = ctx.db.session.find((s) => s.tenantId === "t_globex")!.token;
  assert.ok(!sessions.some((s) => s.token === globexToken), "leaked another tenant's session token");
});

test("revoke-session refuses another tenant's session", async () => {
  const ctx = setup();
  const acme = await ctx.signUp("acme.example.com");
  await signIn(ctx, "globex.example.com");
  const globexToken = ctx.db.session.find((s) => s.tenantId === "t_globex")!.token;

  const res = await ctx.request("acme.example.com", "/revoke-session", {
    method: "POST",
    body: { token: globexToken },
    cookie: acme,
  });
  assert.equal(res.status, 403);
  assert.equal(await codeOf(res), "CROSS_TENANT_SESSION");
  assert.ok(ctx.db.session.some((s) => s.token === globexToken));
});

const ORG_OF: Record<string, string> = { acme: "org_acme", globex: "org_globex" };

function orgSetup() {
  const ctx = setup({ getOrganizationId: (t: Tenant) => ORG_OF[t.slug] }, { plugins: [organization()] });
  const now = new Date();
  ctx.db.organization!.push(
    { id: "org_acme", name: "Acme", slug: "acme", createdAt: now },
    { id: "org_globex", name: "Globex", slug: "globex", createdAt: now },
  );
  const joinBoth = () => {
    const userId = ctx.db.user![0]!.id;
    ctx.db.member!.push(
      { id: "m_acme", organizationId: "org_acme", userId, role: "owner", createdAt: now },
      { id: "m_globex", organizationId: "org_globex", userId, role: "owner", createdAt: now },
    );
  };
  return { ...ctx, joinBoth };
}

test("organization endpoints refuse another tenant's organizationId", async () => {
  const ctx = orgSetup();
  const cookie = await ctx.signUp("acme.example.com");
  ctx.joinBoth();

  const update = await ctx.request("acme.example.com", "/organization/update", {
    method: "POST",
    body: { organizationId: "org_globex", data: { name: "Pwned" } },
    cookie,
  });
  assert.equal(update.status, 403);
  assert.equal(await codeOf(update), "ORGANIZATION_TENANT_MISMATCH");
  assert.equal(ctx.db.organization!.find((o) => o.id === "org_globex")!.name, "Globex");

  const read = await ctx.request("acme.example.com", "/organization/get-full-organization?organizationSlug=globex", { cookie });
  assert.equal(read.status, 403);

  const members = await ctx.request("acme.example.com", "/organization/list-members?organizationId=org_globex", { cookie });
  assert.equal(members.status, 403);

  const own = await ctx.request("acme.example.com", "/organization/get-full-organization?organizationId=org_acme", { cookie });
  assert.equal(own.status, 200);
});

test("organization invitations of another tenant cannot be used", async () => {
  const ctx = orgSetup();
  const cookie = await ctx.signUp("acme.example.com");
  ctx.db.invitation!.push({
    id: "inv_globex",
    organizationId: "org_globex",
    email: "user@example.com",
    role: "member",
    status: "pending",
    inviterId: "someone",
    expiresAt: new Date(Date.now() + 60_000),
    createdAt: new Date(),
  });

  const res = await ctx.request("acme.example.com", "/organization/accept-invitation", {
    method: "POST",
    body: { invitationId: "inv_globex" },
    cookie,
  });
  assert.equal(res.status, 403);
  assert.equal(await codeOf(res), "ORGANIZATION_TENANT_MISMATCH");
  assert.equal(ctx.db.member!.length, 0, "membership in another tenant's organization was created");
});

test("organization/list only returns the tenant's organization", async () => {
  const ctx = orgSetup();
  const cookie = await ctx.signUp("acme.example.com");
  ctx.joinBoth();
  const res = await ctx.request("acme.example.com", "/organization/list", { cookie });
  assert.equal(res.status, 200);
  assert.deepEqual(((await res.json()) as { id: string }[]).map((o) => o.id), ["org_acme"]);
});
