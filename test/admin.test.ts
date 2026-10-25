import { test } from "node:test";
import assert from "node:assert/strict";
import { admin, organization } from "better-auth/plugins";
import type { MultiTenantOptions, Tenant } from "../src/index.js";
import { codeOf, setup } from "./helpers.js";

/**
 * Better Auth's `admin` plugin with the organization bridge: on a tenant's host
 * the admin routes only reach that tenant's members and sessions.
 */

const ORG_OF: Record<string, string> = { acme: "org_acme", globex: "org_globex" };
const getOrganizationId = (tenant: Tenant) => ORG_OF[tenant.slug];

async function adminSetup(overrides: Partial<MultiTenantOptions> = { getOrganizationId }) {
  const warnings: string[] = [];
  const ctx = setup(overrides, {
    plugins: [organization(), admin()],
    auth: { logger: { level: "warn", log: (level, message) => void (level === "warn" && warnings.push(message)) } },
  });
  const now = new Date();
  ctx.db.organization!.push(
    { id: "org_acme", name: "Acme", slug: "acme", createdAt: now },
    { id: "org_globex", name: "Globex", slug: "globex", createdAt: now },
  );
  const join = (email: string, organizationId: string) => {
    const userId = ctx.db.user!.find((u) => u.email === email)!.id as string;
    ctx.db.member!.push({ id: `m_${email}_${organizationId}`, organizationId, userId, role: "member", createdAt: now });
    return userId;
  };

  const adminCookie = await ctx.signUp("acme.example.com", "root@example.com");
  ctx.db.user!.find((u) => u.email === "root@example.com")!.role = "admin";
  join("root@example.com", "org_acme");
  await ctx.signUp("acme.example.com", "alice@example.com");
  const alice = join("alice@example.com", "org_acme");
  await ctx.signUp("globex.example.com", "bob@example.com");
  const bob = join("bob@example.com", "org_globex");

  const post = (path: string, body: Record<string, unknown>, host = "acme.example.com") =>
    ctx.request(host, path, { method: "POST", body, cookie: adminCookie });
  const get = (path: string, host = "acme.example.com") => ctx.request(host, path, { cookie: adminCookie });
  return { ...ctx, warnings, adminCookie, alice, bob, post, get };
}

const refused = async (res: Response, code: string) => {
  assert.equal(res.status, 403, await res.clone().text());
  assert.equal(await codeOf(res), code);
};

test("list-users on a tenant's host lists and counts only its members", async () => {
  const { get } = await adminSetup();
  const res = await get("/admin/list-users");
  assert.equal(res.status, 200, await res.clone().text());
  const body = (await res.json()) as { users: { email: string }[]; total: number };
  assert.deepEqual(body.users.map((u) => u.email).sort(), ["alice@example.com", "root@example.com"]);
  assert.equal(body.total, 2);
});

test("list-users keeps the caller's search on top of the tenant scope", async () => {
  const { get } = await adminSetup();
  const res = await get("/admin/list-users?searchValue=b&searchField=email");
  const body = (await res.json()) as { users: unknown[]; total: number };
  assert.equal(body.total, 0, "bob matches the search but is not a member");
});

test("a route that names another tenant's user is refused", async () => {
  const { alice, bob, get, post } = await adminSetup();
  assert.equal((await get(`/admin/get-user?id=${alice}`)).status, 200);
  await refused(await get(`/admin/get-user?id=${bob}`), "ADMIN_TENANT_MISMATCH");
  for (const [path, body] of [
    ["/admin/set-role", { userId: bob, role: "admin" }],
    ["/admin/update-user", { userId: bob, data: { name: "Mallory" } }],
    ["/admin/ban-user", { userId: bob }],
    ["/admin/unban-user", { userId: bob }],
    ["/admin/impersonate-user", { userId: bob }],
    ["/admin/remove-user", { userId: bob }],
    ["/admin/set-user-password", { userId: bob, newPassword: "another-long-password" }],
    ["/admin/list-user-sessions", { userId: bob }],
    ["/admin/revoke-user-sessions", { userId: bob }],
  ] as const) {
    await refused(await post(path, body), "ADMIN_TENANT_MISMATCH");
  }
});

test("bob's account is untouched by the refused routes", async () => {
  const { db, bob, post } = await adminSetup();
  await post("/admin/ban-user", { userId: bob });
  await post("/admin/remove-user", { userId: bob });
  const row = db.user.find((u) => u.id === bob);
  assert.ok(row);
  assert.notEqual(row.banned, true);
});

test("the tenant's own members can still be managed", async () => {
  const { db, alice, post } = await adminSetup();
  const res = await post("/admin/ban-user", { userId: alice });
  assert.equal(res.status, 200, await res.clone().text());
  assert.equal(db.user.find((u) => u.id === alice)!.banned, true);
});

test("an impersonation session is bound to the tenant it was started on", async () => {
  const { db, alice, post } = await adminSetup();
  const res = await post("/admin/impersonate-user", { userId: alice });
  assert.equal(res.status, 200, await res.clone().text());
  const session = db.session.find((s) => s.userId === alice && s.impersonatedBy);
  assert.equal(session?.tenantId, "t_acme");
});

test("list-user-sessions and revoke-user-sessions only see the tenant's sessions", async () => {
  const { db, alice, post, request } = await adminSetup();
  const signIn = await request("globex.example.com", "/sign-in/email", {
    method: "POST",
    body: { email: "alice@example.com", password: "correct-horse-battery" },
  });
  assert.equal(signIn.status, 200);
  const aliceSessions = () => db.session.filter((s) => s.userId === alice).map((s) => s.tenantId).sort();
  assert.deepEqual(aliceSessions(), ["t_acme", "t_globex"]);

  const listed = (await (await post("/admin/list-user-sessions", { userId: alice })).json()) as { sessions: { tenantId: string }[] };
  assert.deepEqual(listed.sessions.map((s) => s.tenantId), ["t_acme"]);

  assert.equal((await post("/admin/revoke-user-sessions", { userId: alice })).status, 200);
  assert.deepEqual(aliceSessions(), ["t_globex"]);
});

test("revoke-user-session refuses another tenant's session token", async () => {
  const { db, bob, post } = await adminSetup();
  const token = db.session.find((s) => s.userId === bob)!.token as string;
  await refused(await post("/admin/revoke-user-session", { sessionToken: token }), "CROSS_TENANT_SESSION");
  assert.ok(db.session.find((s) => s.token === token));
});

test("a tenant with no organization has no members to manage", async () => {
  const { get, alice } = await adminSetup({ getOrganizationId: (t) => (t.slug === "globex" ? "org_globex" : null) });
  const body = (await (await get("/admin/list-users")).json()) as { users: unknown[]; total: number };
  assert.equal(body.total, 0);
  await refused(await get(`/admin/get-user?id=${alice}`), "ADMIN_TENANT_MISMATCH");
});

test("a caller with no session gets the admin plugin's 401, not a membership answer", async () => {
  const { alice, bob, request } = await adminSetup();
  for (const id of [alice, bob]) {
    const res = await request("acme.example.com", `/admin/get-user?id=${id}`);
    assert.equal(res.status, 401, await res.clone().text());
  }
});

test("admin: false leaves the admin plugin unscoped", async () => {
  const { get } = await adminSetup({ getOrganizationId, admin: false });
  const body = (await (await get("/admin/list-users")).json()) as { total: number };
  assert.equal(body.total, 3);
});

test("without an organization bridge the plugin warns that admin routes are unscoped", async () => {
  const unscoped = await adminSetup({});
  await unscoped.get("/ok");
  assert.ok(unscoped.warnings.some((w) => w.includes("admin plugin is installed")), String(unscoped.warnings));

  const silenced = await adminSetup({ admin: false });
  await silenced.get("/ok");
  assert.ok(!silenced.warnings.some((w) => w.includes("admin plugin is installed")));
});

test("admin: true without getOrganizationId throws at startup", () => {
  assert.throws(() => setup({ admin: true }), /admin: true needs getOrganizationId/);
});
