import { test } from "node:test";
import assert from "node:assert/strict";
import { anonymous, magicLink } from "better-auth/plugins";
import type { MultiTenantOptions } from "../src/index.js";
import { codeOf, setup } from "./helpers.js";

/**
 * Sessions that other plugins create through Better Auth's internal adapter
 * (magic link, anonymous, and so on) get the same tenant stamp as a password
 * sign-in, are refused on any other tenant, and are never minted without one.
 *
 * `@better-auth/api-key` is a separate package that this repository does not
 * install, so it is not tested here; with `session.enableSessionForAPIKeys` it
 * resolves a session from the key without writing one, see the README.
 */

const EMAIL = "user@example.com";

function pluginSetup(overrides: Partial<MultiTenantOptions> = {}) {
  const links: string[] = [];
  const ctx = setup(overrides, {
    trustedOrigins: ["http://*.example.com", "http://example.com"],
    plugins: [anonymous(), magicLink({ sendMagicLink: async ({ token }) => void links.push(token) })],
  });
  /** Ask for a link on `host` and follow it on `verifyHost`. */
  const magicSignIn = async (host: string, verifyHost = host) => {
    const sent = await ctx.request(host, "/sign-in/magic-link", { method: "POST", body: { email: EMAIL } });
    assert.equal(sent.status, 200, await sent.clone().text());
    return ctx.request(verifyHost, `/magic-link/verify?token=${links.at(-1)}`);
  };
  const cookieOf = (res: Response) => res.headers.get("set-cookie")?.split(";")[0] ?? "";
  return { ...ctx, magicSignIn, cookieOf };
}

test("a magic-link session is stamped with its tenant and refused on another", async () => {
  const { db, request, magicSignIn, cookieOf } = pluginSetup();
  const res = await magicSignIn("acme.example.com");
  assert.equal(res.status, 200, await res.clone().text());
  assert.equal(db.session[0]!.tenantId, "t_acme");

  const cookie = cookieOf(res);
  assert.equal((await request("acme.example.com", "/get-session", { cookie })).status, 200);
  const other = await request("globex.example.com", "/get-session", { cookie });
  assert.equal(other.status, 403);
  assert.equal(await codeOf(other), "CROSS_TENANT_SESSION");
});

test("a magic link followed on another tenant is refused", async () => {
  const { db, magicSignIn } = pluginSetup();
  const res = await magicSignIn("acme.example.com", "globex.example.com");
  assert.equal(res.status, 403);
  assert.equal(await codeOf(res), "VERIFICATION_TENANT_MISMATCH");
  assert.equal(db.session.length, 0);
});

test("with bindVerifications: false a magic link followed on another tenant gets that tenant's stamp", async () => {
  const { db, magicSignIn } = pluginSetup({ bindVerifications: false });
  assert.equal((await magicSignIn("acme.example.com", "globex.example.com")).status, 200);
  assert.equal(db.session[0]!.tenantId, "t_globex");
});

test("canAccessTenant also covers a magic-link session", async () => {
  const { db, magicSignIn } = pluginSetup({ canAccessTenant: () => false });
  const res = await magicSignIn("acme.example.com");
  assert.equal(res.status, 403);
  assert.equal(await codeOf(res), "TENANT_ACCESS_DENIED");
  assert.equal(db.session.length, 0);
});

test("no magic-link session is minted on a request without a tenant", async () => {
  const { db, magicSignIn } = pluginSetup({ requireTenant: () => false });
  const res = await magicSignIn("example.com");
  assert.equal(res.status, 400);
  assert.equal(await codeOf(res), "TENANT_REQUIRED");
  assert.equal(db.session.length, 0);
});

test("an anonymous session is stamped with its tenant and refused on another", async () => {
  const { db, request, cookieOf } = pluginSetup();
  const res = await request("acme.example.com", "/sign-in/anonymous", { method: "POST", body: {} });
  assert.equal(res.status, 200, await res.clone().text());
  assert.equal(db.session[0]!.tenantId, "t_acme");

  const other = await request("globex.example.com", "/get-session", { cookie: cookieOf(res) });
  assert.equal(await codeOf(other), "CROSS_TENANT_SESSION");
});

test("no anonymous session is minted on a request without a tenant or for a user the tenant refuses", async () => {
  const bare = pluginSetup({ requireTenant: () => false });
  const res = await bare.request("example.com", "/sign-in/anonymous", { method: "POST", body: {} });
  assert.equal(await codeOf(res), "TENANT_REQUIRED");
  assert.equal(bare.db.session.length, 0);

  const closed = pluginSetup({ canAccessTenant: () => false });
  const denied = await closed.request("acme.example.com", "/sign-in/anonymous", { method: "POST", body: {} });
  assert.equal(await codeOf(denied), "TENANT_ACCESS_DENIED");
  assert.equal(closed.db.session.length, 0);
});
