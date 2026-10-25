import { test } from "node:test";
import assert from "node:assert/strict";
import { admin, jwt, oneTimeToken, organization } from "better-auth/plugins";
import type { MultiTenantOptions, Tenant } from "../src/index.js";
import { codeOf, setup } from "./helpers.js";

/** The second pre-0.6.0 review: JWT tenant claim, admin role assignment, startup warnings. */

const claims = (token: string) => JSON.parse(Buffer.from(token.split(".")[1]!, "base64url").toString()) as Record<string, unknown>;

function jwtSetup(plugin: ReturnType<typeof jwt>, overrides: Partial<MultiTenantOptions> = {}) {
  const warnings: string[] = [];
  const ctx = setup(overrides, {
    plugins: [plugin],
    auth: { logger: { level: "warn", log: (level, message) => void (level === "warn" && warnings.push(message)) } },
  });
  ctx.db.jwks = [];
  const token = async (host: string, cookie: string) => {
    const res = await ctx.request(host, "/token", { cookie });
    assert.equal(res.status, 200, await res.clone().text());
    return claims(((await res.json()) as { token: string }).token);
  };
  return { ...ctx, warnings, token };
}

test("a jwt carries the tenant it was minted on", async () => {
  const { signUp, token } = jwtSetup(jwt({}));
  assert.equal((await token("acme.example.com", await signUp("acme.example.com"))).tenantId, "t_acme");
  assert.equal((await token("globex.example.com", await signUp("globex.example.com", "g@example.com"))).tenantId, "t_globex");
});

test("the tenant claim is added on top of the app's own definePayload, under the chosen name", async () => {
  const { signUp, token } = jwtSetup(jwt({ jwt: { definePayload: ({ user }) => ({ email: user.email, custom: true }) } }), {
    jwtTenantClaim: "tid",
  });
  const payload = await token("acme.example.com", await signUp("acme.example.com"));
  assert.equal(payload.tid, "t_acme");
  assert.equal(payload.custom, true);
  assert.equal(payload.name, undefined, "the app's payload is kept, not replaced by the user");
});

test("jwtTenantClaim: false leaves tokens alone", async () => {
  const { signUp, token, warnings } = jwtSetup(jwt({}), { jwtTenantClaim: false });
  assert.equal((await token("acme.example.com", await signUp("acme.example.com"))).tenantId, undefined);
  assert.ok(!warnings.some((w) => w.includes("jwt plugin")));
});

test("jwt() without options cannot carry the tenant, and the plugin warns", async () => {
  const { signUp, token, warnings } = jwtSetup(jwt());
  assert.equal((await token("acme.example.com", await signUp("acme.example.com"))).tenantId, undefined);
  assert.ok(warnings.some((w) => w.includes("jwt plugin was created without options")), String(warnings));
});

const ORG_OF: Record<string, string> = { acme: "org_acme", globex: "org_globex" };

async function adminSetup(overrides: Partial<MultiTenantOptions> = {}, adminOptions: Parameters<typeof admin>[0] = {}) {
  const ctx = setup({ getOrganizationId: (t: Tenant) => ORG_OF[t.slug], ...overrides }, { plugins: [organization(), admin(adminOptions)] });
  const now = new Date();
  ctx.db.organization!.push({ id: "org_acme", name: "Acme", slug: "acme", createdAt: now });
  const cookie = await ctx.signUp("acme.example.com", "root@example.com");
  const root = ctx.db.user.find((u) => u.email === "root@example.com")!;
  root.role = "admin";
  ctx.db.member!.push({ id: "m_root", organizationId: "org_acme", userId: root.id, role: "owner", createdAt: now });
  await ctx.signUp("acme.example.com", "alice@example.com");
  const alice = ctx.db.user.find((u) => u.email === "alice@example.com")!.id as string;
  ctx.db.member!.push({ id: "m_alice", organizationId: "org_acme", userId: alice, role: "member", createdAt: now });
  const post = (path: string, body: Record<string, unknown>) => ctx.request("acme.example.com", path, { method: "POST", body, cookie });
  return { ...ctx, alice, post };
}

const newUser = (role: unknown) => ({ email: "new@example.com", password: "correct-horse-battery", name: "New", role });

test("a tenant's admin cannot hand out the global admin role", async () => {
  const { db, alice, post } = await adminSetup();
  for (const role of ["admin", ["user", "admin"], "user,ADMIN"]) {
    const created = await post("/admin/create-user", newUser(role));
    assert.equal(created.status, 403, await created.clone().text());
    assert.equal(await codeOf(created), "ADMIN_ROLE_NOT_ASSIGNABLE");
  }
  assert.ok(!db.user.some((u) => u.email === "new@example.com"));
  const promoted = await post("/admin/set-role", { userId: alice, role: "admin" });
  assert.equal(await codeOf(promoted), "ADMIN_ROLE_NOT_ASSIGNABLE");
  assert.notEqual(db.user.find((u) => u.id === alice)!.role, "admin");
});

test("other roles can still be given out, and adminRoleAssignment: allow lifts the refusal", async () => {
  const strict = await adminSetup();
  assert.equal((await strict.post("/admin/create-user", newUser("user"))).status, 200);
  assert.equal((await strict.post("/admin/set-role", { userId: strict.alice, role: "user" })).status, 200);

  const lax = await adminSetup({ adminRoleAssignment: "allow" });
  const res = await lax.post("/admin/set-role", { userId: lax.alice, role: "admin" });
  assert.equal(res.status, 200, await res.clone().text());
});

test("the admin plugin's own adminRoles decide which roles are refused", async () => {
  const { post, alice } = await adminSetup({}, { adminRoles: ["admin", "user"] });
  const res = await post("/admin/set-role", { userId: alice, role: "user" });
  assert.equal(await codeOf(res), "ADMIN_ROLE_NOT_ASSIGNABLE");
});

test("unscoped OAuth provider and SCIM plugins are reported at startup", async () => {
  const warnings: string[] = [];
  const fake = (id: string) => ({ id }) as never;
  const ctx = setup({}, {
    plugins: [fake("oauth-provider"), fake("scim")],
    auth: { logger: { level: "warn", log: (level, message) => void (level === "warn" && warnings.push(message)) } },
  });
  await ctx.request("acme.example.com", "/ok");
  assert.ok(warnings.some((w) => w.includes("@better-auth/oauth-provider is installed but not tenant-scoped")), String(warnings));
  assert.ok(warnings.some((w) => w.includes("@better-auth/scim is installed but not tenant-scoped")), String(warnings));
});

test("a one-time token is bound to the tenant that issued it", async () => {
  const ctx = setup({}, { plugins: [oneTimeToken()] });
  const cookie = await ctx.signUp("acme.example.com");
  const issue = async () => ((await (await ctx.request("acme.example.com", "/one-time-token/generate", { cookie })).json()) as { token: string }).token;
  const other = await ctx.request("globex.example.com", "/one-time-token/verify", { method: "POST", body: { token: await issue() } });
  assert.equal(other.status, 403);
  assert.equal(await codeOf(other), "VERIFICATION_TENANT_MISMATCH");
  const own = await ctx.request("acme.example.com", "/one-time-token/verify", { method: "POST", body: { token: await issue() } });
  assert.equal(own.status, 200, await own.clone().text());
});
