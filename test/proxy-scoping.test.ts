import { test } from "node:test";
import assert from "node:assert/strict";
import { sso } from "@better-auth/sso";
import { memoryAdapter } from "better-auth/adapters/memory";
import { magicLink } from "better-auth/plugins";
import { createTenantAuth, type Tenant } from "../src/index.js";
import { codeOf, setup, TENANTS } from "./helpers.js";

/**
 * With `trustProxy`, the tenant named by the forwarded host is the one every
 * later check sees: session binding, `canAccessTenant`, verification binding,
 * SSO and `createTenantAuth`. The real `Host` is an internal name throughout.
 */

const INTERNAL = "app.internal";
const EMAIL = "user@example.com";
const PASSWORD = "correct-horse-battery";

/** Headers of a request that a proxy forwarded for `tenantHost`. */
const via = (tenantHost: string, cookie?: string) => ({
  headers: { "x-forwarded-host": tenantHost, origin: `http://${tenantHost}` },
  ...(cookie ? { cookie } : {}),
});

const signUpVia = async (request: ReturnType<typeof setup>["request"], tenantHost: string) => {
  const res = await request(INTERNAL, "/sign-up/email", {
    method: "POST",
    body: { email: EMAIL, password: PASSWORD, name: "User" },
    ...via(tenantHost),
  });
  assert.equal(res.status, 200, await res.clone().text());
  return res.headers.get("set-cookie")!.split(";")[0]!;
};

test("a session made behind a proxy is stamped with, and bound to, the forwarded tenant", async () => {
  const { request, db } = setup({ trustProxy: true });
  const cookie = await signUpVia(request, "acme.example.com");
  assert.equal(db.session[0]!.tenantId, "t_acme");

  assert.equal((await request(INTERNAL, "/get-session", via("acme.example.com", cookie))).status, 200);
  const other = await request(INTERNAL, "/get-session", via("globex.example.com", cookie));
  assert.equal(other.status, 403);
  assert.equal(await codeOf(other), "CROSS_TENANT_SESSION");
});

test("canAccessTenant is asked about the forwarded tenant", async () => {
  const seen: string[] = [];
  const { request } = setup({
    trustProxy: true,
    canAccessTenant: (_user, tenant) => {
      seen.push(tenant.slug);
      return tenant.slug === "acme";
    },
  });
  await signUpVia(request, "acme.example.com");
  const res = await request(INTERNAL, "/sign-in/email", {
    method: "POST",
    body: { email: EMAIL, password: PASSWORD },
    ...via("globex.example.com"),
  });
  assert.equal(res.status, 403);
  assert.equal(await codeOf(res), "TENANT_ACCESS_DENIED");
  assert.deepEqual(seen, ["acme", "globex"]);
});

test("a magic link is bound to the forwarded tenant that issued it", async () => {
  const links: string[] = [];
  const { request, db } = setup(
    { trustProxy: true },
    {
      trustedOrigins: ["http://*.example.com", "http://example.com"],
      plugins: [magicLink({ sendMagicLink: async ({ token }) => void links.push(token) })],
    },
  );
  await request(INTERNAL, "/sign-in/magic-link", { method: "POST", body: { email: EMAIL }, ...via("acme.example.com") });
  const token = links.at(-1);

  const other = await request(INTERNAL, `/magic-link/verify?token=${token}`, via("globex.example.com"));
  assert.equal(other.status, 403, await other.clone().text());
  assert.equal(await codeOf(other), "VERIFICATION_TENANT_MISMATCH");
  assert.equal(db.session.length, 0);

  const own = await request(INTERNAL, `/magic-link/verify?token=${token}`, via("acme.example.com"));
  assert.equal(own.status, 200, await own.clone().text());
  assert.equal(db.session[0]!.tenantId, "t_acme");
});

test("SSO checks apply on the forwarded tenant's host", async () => {
  const { request } = setup(
    { trustProxy: true, ssoRequireTenantMapping: true },
    { plugins: [sso()] },
  );
  const res = await request(INTERNAL, "/sign-in/sso", {
    method: "POST",
    body: { providerId: "any", callbackURL: "/" },
    ...via("acme.example.com"),
  });
  assert.equal(res.status, 403, await res.clone().text());
  assert.equal(await codeOf(res), "SSO_PROVIDER_TENANT_MISMATCH");
});

test("without trustProxy a forwarded host cannot move a request to another tenant", async () => {
  const { request, db } = setup();
  const res = await request("acme.example.com", "/sign-up/email", {
    method: "POST",
    body: { email: EMAIL, password: PASSWORD, name: "User" },
    headers: { "x-forwarded-host": "globex.example.com" },
  });
  assert.equal(res.status, 200, await res.clone().text());
  assert.equal(db.session[0]!.tenantId, "t_acme");
});

test("createTenantAuth picks the instance, and enforces canAccessTenant, from the forwarded host", async () => {
  const dbs: Record<string, { user: unknown[]; session: Record<string, unknown>[]; account: unknown[]; verification: unknown[] }> = {};
  const tenantAuth = createTenantAuth({
    baseDomain: "example.com",
    getTenant: (slug) => TENANTS[slug] ?? null,
    trustProxy: 1,
    canAccessTenant: (_user, tenant) => tenant.slug === "acme",
    createAuth: (tenant: Tenant) => ({
      secret: "test-secret-0123456789-abcdefghijklmnop",
      baseURL: "http://acme.example.com",
      trustedOrigins: ["http://*.example.com"],
      database: memoryAdapter((dbs[tenant.slug] ??= { user: [], session: [], account: [], verification: [] })),
      emailAndPassword: { enabled: true },
      logger: { disabled: true },
    }),
  });
  const post = (tenantHost: string, path: string, body: unknown, forwarded = tenantHost) =>
    tenantAuth.handler(
      new Request(`http://${INTERNAL}/api/auth${path}`, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          host: INTERNAL,
          origin: `http://${tenantHost}`,
          "content-type": "application/json",
          "x-forwarded-host": forwarded,
        },
      }),
    );

  const signUp = await post("acme.example.com", "/sign-up/email", { email: EMAIL, password: PASSWORD, name: "User" });
  assert.equal(signUp.status, 200, await signUp.clone().text());
  assert.equal(dbs.acme!.session[0]!.tenantId, "t_acme");
  assert.equal(dbs.globex, undefined, "no instance for a tenant that was not named");

  // A client-prepended entry loses to the proxy's own, which is the right-most.
  const spoofed = await post("acme.example.com", "/sign-in/email", { email: EMAIL, password: PASSWORD }, "globex.example.com, acme.example.com");
  assert.equal(spoofed.status, 200, await spoofed.clone().text());
  assert.equal(dbs.globex, undefined);

  // Globex's instance has its own database, so canAccessTenant is what answers here.
  const denied = await post("globex.example.com", "/sign-up/email", { email: "other@example.com", password: PASSWORD, name: "Other" });
  assert.equal(denied.status, 403, await denied.clone().text());
  assert.equal(await codeOf(denied), "TENANT_ACCESS_DENIED");
  assert.equal(dbs.globex!.session.length, 0);
});
