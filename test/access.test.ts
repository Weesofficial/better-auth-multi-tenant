import { test } from "node:test";
import assert from "node:assert/strict";
import { organization } from "better-auth/plugins";
import { organizationMembersOnly, type Tenant } from "../src/index.js";
import { codeOf, setup } from "./helpers.js";

/**
 * `canAccessTenant`: users are global in Better Auth, so a tenant has to be
 * able to say who may get a session on its host.
 */

const EMAIL = "user@example.com";
const PASSWORD = "correct-horse-battery";

const signIn = (request: ReturnType<typeof setup>["request"], host: string, email = EMAIL) =>
  request(host, "/sign-in/email", { method: "POST", body: { email, password: PASSWORD } });

const signUpBody = (email: string) => ({ email, password: PASSWORD, name: "User" });

/** Allow `acme` only. */
const acmeOnly = (_user: unknown, tenant: Tenant) => tenant.slug === "acme";

test("without the option a user signs in on any tenant", async () => {
  const { request, signUp } = setup();
  await signUp("acme.example.com");
  assert.equal((await signIn(request, "globex.example.com")).status, 200);
});

test("sign-in on a tenant the user may not access is 403 and creates no session", async () => {
  const { request, signUp, db } = setup({ canAccessTenant: acmeOnly });
  await signUp("acme.example.com");
  const res = await signIn(request, "globex.example.com");
  assert.equal(res.status, 403);
  assert.equal(await codeOf(res), "TENANT_ACCESS_DENIED");
  assert.equal(db.session.length, 1);
  assert.equal((await signIn(request, "acme.example.com")).status, 200);
});

test("a wrong password is still the ordinary error, not TENANT_ACCESS_DENIED", async () => {
  const { request, signUp } = setup({ canAccessTenant: acmeOnly });
  await signUp("acme.example.com");
  const res = await request("globex.example.com", "/sign-in/email", {
    method: "POST",
    body: { email: EMAIL, password: "wrong-password-123" },
  });
  assert.equal(res.status, 401);
});

test("the check can be async and gets the user and the tenant", async () => {
  const seen: unknown[] = [];
  const { request, signUp } = setup({
    canAccessTenant: async (user, tenant) => {
      seen.push([user.email, tenant.id]);
      return tenant.slug === "acme";
    },
  });
  await signUp("acme.example.com");
  assert.equal((await signIn(request, "globex.example.com")).status, 403);
  assert.deepEqual(seen.at(-1), [EMAIL, "t_globex"]);
});

test("a sign-up the check refuses does not hand out a session", async () => {
  const { request, db } = setup({ canAccessTenant: () => false });
  const res = await request("acme.example.com", "/sign-up/email", { method: "POST", body: signUpBody(EMAIL) });
  assert.equal(res.status, 403);
  assert.equal(await codeOf(res), "TENANT_ACCESS_DENIED");
  assert.equal(res.headers.get("set-cookie"), null);
  assert.equal(db.session.length, 0);
});

test("a check that throws fails closed", async () => {
  const { request, signUp } = setup({
    canAccessTenant: (_user, tenant) => {
      if (tenant.slug === "globex") throw new Error("lookup failed");
      return true;
    },
  });
  await signUp("acme.example.com");
  assert.ok((await signIn(request, "globex.example.com")).status >= 400);
});

// Sign-up on another tenant must look the same whether or not the email is
// registered. Better Auth only does that when it creates no session at sign-up.
for (const [name, emailAndPassword] of [
  ["autoSignIn: false", { enabled: true, autoSignIn: false }],
  ["requireEmailVerification", { enabled: true, requireEmailVerification: true }],
] as const) {
  test(`sign-up does not reveal an existing email (${name})`, async () => {
    const { request } = setup({ canAccessTenant: acmeOnly }, { auth: { emailAndPassword } });
    const signUp = (host: string, email: string) =>
      request(host, "/sign-up/email", { method: "POST", body: signUpBody(email) });
    assert.equal((await signUp("acme.example.com", EMAIL)).status, 200);

    const existing = await signUp("globex.example.com", EMAIL);
    const fresh = await signUp("globex.example.com", "new@example.com");
    assert.equal(existing.status, 200);
    assert.equal(fresh.status, 200);
    const [a, b] = [await existing.json(), await fresh.json()] as { token: unknown; user: Record<string, unknown> }[];
    assert.equal(a!.token, null);
    assert.equal(b!.token, null);
    // Better Auth's stand-in user always carries `image`; a real one omits it when empty.
    const keys = (user: Record<string, unknown>) => Object.keys(user).filter((k) => k !== "image").sort();
    assert.deepEqual(keys(a!.user), keys(b!.user));
  });
}

test("with auto sign-in, sign-up on another tenant still answers 422 for a known email", async () => {
  // Documented limit: Better Auth returns a session for a fresh sign-up, so the
  // plugin cannot make the duplicate answer look the same.
  const { request, signUp } = setup({ canAccessTenant: acmeOnly });
  await signUp("acme.example.com");
  const res = await request("globex.example.com", "/sign-up/email", { method: "POST", body: signUpBody(EMAIL) });
  assert.equal(res.status, 422);
});

const ORG_OF: Record<string, string> = { acme: "org_acme", globex: "org_globex" };

function membersSetup() {
  const ctx = setup(
    { getOrganizationId: (tenant) => ORG_OF[tenant.slug], canAccessTenant: organizationMembersOnly },
    { plugins: [organization()], auth: { emailAndPassword: { enabled: true, autoSignIn: false } } },
  );
  ctx.db.organization!.push(
    { id: "org_acme", name: "Acme", slug: "acme", createdAt: new Date() },
    { id: "org_globex", name: "Globex", slug: "globex", createdAt: new Date() },
  );
  const join = (orgId: string) =>
    ctx.db.member!.push({ id: `m_${orgId}`, organizationId: orgId, userId: ctx.db.user![0]!.id, role: "member", createdAt: new Date() });
  return { ...ctx, join };
}

test("organizationMembersOnly lets in members of the tenant's organization only", async () => {
  const { request, join } = membersSetup();
  await request("acme.example.com", "/sign-up/email", { method: "POST", body: signUpBody(EMAIL) });

  const denied = await signIn(request, "acme.example.com");
  assert.equal(denied.status, 403);
  assert.equal(await codeOf(denied), "TENANT_ACCESS_DENIED");

  join("org_acme");
  assert.equal((await signIn(request, "acme.example.com")).status, 200);
  assert.equal(await codeOf(await signIn(request, "globex.example.com")), "TENANT_ACCESS_DENIED");
});

test("organizationMembersOnly refuses everyone on a tenant without an organization", async () => {
  const ctx = setup(
    { getOrganizationId: () => undefined, canAccessTenant: organizationMembersOnly },
    { plugins: [organization()], auth: { emailAndPassword: { enabled: true, autoSignIn: false } } },
  );
  await ctx.request("acme.example.com", "/sign-up/email", { method: "POST", body: signUpBody(EMAIL) });
  assert.equal(await codeOf(await signIn(ctx.request, "acme.example.com")), "TENANT_ACCESS_DENIED");
});
