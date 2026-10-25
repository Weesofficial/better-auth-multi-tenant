import { test } from "node:test";
import assert from "node:assert/strict";
import { apiKey } from "@better-auth/api-key";
import { admin, organization } from "better-auth/plugins";
import { organizationMembersOnly, type MultiTenantOptions, type Tenant } from "../src/index.js";
import { codeOf, cookiesOf, setup } from "./helpers.js";

/**
 * Attacks found in the pre-0.6.0 review, each of which worked before the fix:
 * the admin role crossing tenants, admin changes to a user shared between
 * tenants, cross-tenant requests through a wildcard trustedOrigins, and API keys
 * kept in secondary storage escaping their tenant.
 */

const ORG_OF: Record<string, string> = { acme: "org_acme", globex: "org_globex" };
const getOrganizationId = (tenant: Tenant) => ORG_OF[tenant.slug];

async function world(overrides: Partial<MultiTenantOptions> = {}) {
  const ctx = setup({ getOrganizationId, ...overrides }, { plugins: [organization(), admin()] });
  const now = new Date();
  ctx.db.organization!.push(
    { id: "org_acme", name: "Acme", slug: "acme", createdAt: now },
    { id: "org_globex", name: "Globex", slug: "globex", createdAt: now },
  );
  const join = (email: string, organizationId: string, role = "member") => {
    const userId = ctx.db.user.find((u) => u.email === email)!.id as string;
    ctx.db.member!.push({ id: `m_${email}_${organizationId}`, organizationId, userId, role, createdAt: now });
    return userId;
  };
  const signIn = async (host: string, email: string, password = "correct-horse-battery") =>
    ctx.request(host, "/sign-in/email", { method: "POST", body: { email, password } });
  return { ...ctx, join, signIn };
}

const refused = async (res: Response, code: string) => {
  assert.equal(res.status, 403, await res.clone().text());
  assert.equal(await codeOf(res), code);
};

/** root administers acme and is an ordinary member of globex; bob owns globex. */
async function rootAndBob(overrides: Partial<MultiTenantOptions> = {}, { membersOnly = false } = {}) {
  // Seed the users first, then let only members in, as a real app would.
  let seeding = true;
  const ctx = await world({
    ...overrides,
    ...(membersOnly ? { canAccessTenant: (user, tenant, context) => seeding || organizationMembersOnly(user, tenant, context) } : {}),
  });
  await ctx.signUp("acme.example.com", "root@example.com");
  ctx.db.user.find((u) => u.email === "root@example.com")!.role = "admin";
  ctx.join("root@example.com", "org_acme", "owner");
  ctx.join("root@example.com", "org_globex");
  await ctx.signUp("globex.example.com", "bob@example.com");
  const bob = ctx.join("bob@example.com", "org_globex", "owner");
  seeding = false;
  const signedIn = await ctx.signIn("globex.example.com", "root@example.com");
  assert.equal(signedIn.status, 200);
  return { ...ctx, bob, cookie: cookiesOf(signedIn) };
}

test("the global admin role does not make an admin of one tenant an admin of another", async () => {
  const { db, request, bob, cookie } = await rootAndBob({}, { membersOnly: true });
  await refused(await request("globex.example.com", "/admin/list-users", { cookie }), "ADMIN_NOT_TENANT_ADMIN");
  for (const [path, body] of [
    ["/admin/ban-user", { userId: bob }],
    ["/admin/set-user-password", { userId: bob, newPassword: "attacker-chosen-password" }],
  ] as const) {
    await refused(await request("globex.example.com", path, { method: "POST", body, cookie }), "ADMIN_NOT_TENANT_ADMIN");
  }
  assert.notEqual(db.user.find((u) => u.id === bob)!.banned, true);
});

test("canAdministerTenant decides who administers a tenant, and a throwing check refuses", async () => {
  const allowed = await rootAndBob({ canAdministerTenant: (user) => user.email === "root@example.com" });
  const ok = await allowed.request("globex.example.com", "/admin/list-users", { cookie: allowed.cookie });
  assert.equal(ok.status, 200, await ok.clone().text());

  const throwing = await rootAndBob({
    canAdministerTenant: () => {
      throw new Error("boom");
    },
  });
  await refused(await throwing.request("globex.example.com", "/admin/list-users", { cookie: throwing.cookie }), "ADMIN_NOT_TENANT_ADMIN");
});

test("stop-impersonating works for an impersonated user who administers nothing", async () => {
  const ctx = await world();
  const rootCookie = await ctx.signUp("acme.example.com", "root@example.com");
  ctx.db.user.find((u) => u.email === "root@example.com")!.role = "admin";
  ctx.join("root@example.com", "org_acme", "owner");
  await ctx.signUp("acme.example.com", "alice@example.com");
  const alice = ctx.join("alice@example.com", "org_acme");
  const started = await ctx.request("acme.example.com", "/admin/impersonate-user", { method: "POST", body: { userId: alice }, cookie: rootCookie });
  assert.equal(started.status, 200, await started.clone().text());
  const stopped = await ctx.request("acme.example.com", "/admin/stop-impersonating", { method: "POST", body: {}, cookie: cookiesOf(started) });
  assert.equal(stopped.status, 200, await stopped.clone().text());
});

async function sharedCarol(overrides: Partial<MultiTenantOptions> = {}) {
  const ctx = await world(overrides);
  const adminCookie = await ctx.signUp("acme.example.com", "root@example.com");
  ctx.db.user.find((u) => u.email === "root@example.com")!.role = "admin";
  ctx.join("root@example.com", "org_acme", "owner");
  await ctx.signUp("globex.example.com", "carol@example.com");
  const carol = ctx.join("carol@example.com", "org_globex", "owner");
  ctx.join("carol@example.com", "org_acme");
  const post = (path: string, body: Record<string, unknown>) => ctx.request("acme.example.com", path, { method: "POST", body, cookie: adminCookie });
  return { ...ctx, carol, post };
}

test("an admin cannot change a user who also belongs to another tenant", async () => {
  const { db, carol, post, signIn } = await sharedCarol();
  for (const [path, body] of [
    ["/admin/set-user-password", { userId: carol, newPassword: "attacker-chosen-password" }],
    ["/admin/update-user", { userId: carol, data: { email: "attacker@evil.test" } }],
    ["/admin/set-role", { userId: carol, role: "admin" }],
    ["/admin/ban-user", { userId: carol }],
    ["/admin/unban-user", { userId: carol }],
    ["/admin/remove-user", { userId: carol }],
  ] as const) {
    await refused(await post(path, body), "ADMIN_SHARED_USER");
  }
  assert.equal((await signIn("globex.example.com", "carol@example.com", "attacker-chosen-password")).status, 401);
  assert.equal(db.user.find((u) => u.id === carol)!.email, "carol@example.com");
});

test("a shared user's tenant sessions can still be managed, and adminSharedUsers: allow lifts the refusal", async () => {
  const strict = await sharedCarol();
  assert.equal((await strict.post("/admin/list-user-sessions", { userId: strict.carol })).status, 200);
  assert.equal((await strict.post("/admin/revoke-user-sessions", { userId: strict.carol })).status, 200);

  const lax = await sharedCarol({ adminSharedUsers: "allow" });
  const res = await lax.post("/admin/ban-user", { userId: lax.carol });
  assert.equal(res.status, 200, await res.clone().text());
});

test("another tenant's origin cannot make a state-changing request", async () => {
  const ctx = await world();
  const cookie = await ctx.signUp("acme.example.com", "victim@example.com");
  const attack = await ctx.request("acme.example.com", "/update-user", {
    method: "POST",
    body: { name: "pwned" },
    cookie,
    headers: { origin: "http://globex.example.com" },
  });
  await refused(attack, "CROSS_TENANT_ORIGIN");
  const byReferer = await ctx.request("acme.example.com", "/update-user", {
    method: "POST",
    body: { name: "pwned" },
    cookie,
    headers: { origin: "", referer: "http://globex.example.com/page" },
  });
  await refused(byReferer, "CROSS_TENANT_ORIGIN");
  assert.notEqual(ctx.db.user.find((u) => u.email === "victim@example.com")!.name, "pwned");

  const own = await ctx.request("acme.example.com", "/update-user", { method: "POST", body: { name: "ok" }, cookie });
  assert.equal(own.status, 200, await own.clone().text());
  const read = await ctx.request("acme.example.com", "/get-session", { cookie, headers: { origin: "http://globex.example.com" } });
  assert.equal(read.status, 200, "safe methods are not refused");
});

test("sameOriginOnly: false leaves the origin to Better Auth's trustedOrigins", async () => {
  const ctx = await world({ sameOriginOnly: false });
  const cookie = await ctx.signUp("acme.example.com", "victim@example.com");
  const res = await ctx.request("acme.example.com", "/update-user", {
    method: "POST",
    body: { name: "fine" },
    cookie,
    headers: { origin: "http://globex.example.com" },
  });
  assert.equal(res.status, 200);
});

function storageKeys(mode: "secondary-storage" | "fallback") {
  const store = new Map<string, string>();
  const secondaryStorage = {
    get: async (k: string) => store.get(k) ?? null,
    set: async (k: string, v: string) => void store.set(k, v),
    delete: async (k: string) => void store.delete(k),
  };
  const ctx = setup(
    { apiKeys: true },
    {
      plugins: [apiKey({ storage: "secondary-storage", fallbackToDatabase: mode === "fallback" })],
      auth: { secondaryStorage: secondaryStorage as never },
    },
  );
  ctx.db.apikey = [];
  return ctx;
}

test("an api key in secondary storage only is refused at creation instead of being left unbound", async () => {
  const ctx = storageKeys("secondary-storage");
  const cookie = await ctx.signUp("acme.example.com");
  const created = await ctx.request("acme.example.com", "/api-key/create", { method: "POST", body: {}, cookie });
  assert.equal(created.status, 500);
  assert.equal(await codeOf(created), "API_KEY_NOT_IN_DATABASE");
});

test("with secondary storage and fallbackToDatabase, a key stays on its tenant", async () => {
  const ctx = storageKeys("fallback");
  const cookie = await ctx.signUp("acme.example.com");
  const created = await ctx.request("acme.example.com", "/api-key/create", { method: "POST", body: {}, cookie });
  assert.equal(created.status, 200, await created.clone().text());
  const { key, id } = (await created.json()) as { key: string; id: string };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const api = ctx.auth.api as any;
  const own = await api.verifyApiKey({ body: { key }, headers: new Headers({ host: "acme.example.com" }) });
  assert.equal(own.valid, true, JSON.stringify(own));
  const other = await api.verifyApiKey({ body: { key }, headers: new Headers({ host: "globex.example.com" }) });
  assert.equal(other.valid, false, JSON.stringify(other));

  const signedIn = await ctx.request("globex.example.com", "/sign-in/email", {
    method: "POST",
    body: { email: "user@example.com", password: "correct-horse-battery" },
  });
  const globex = cookiesOf(signedIn);
  assert.equal((await ctx.request("globex.example.com", `/api-key/get?id=${id}`, { cookie: globex })).status, 404);
  const listed = (await (await ctx.request("globex.example.com", "/api-key/list", { cookie: globex })).json()) as { apiKeys: unknown[] };
  assert.deepEqual(listed.apiKeys, []);
  assert.equal((await ctx.request("globex.example.com", "/api-key/delete", { method: "POST", body: { keyId: id }, cookie: globex })).status, 404);
  assert.equal((await ctx.request("acme.example.com", `/api-key/get?id=${id}`, { cookie })).status, 200);
});
