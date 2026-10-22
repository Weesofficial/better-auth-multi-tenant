import { test } from "node:test";
import assert from "node:assert/strict";
import type { MultiTenantOptions } from "../src/index.js";
import { setup } from "./helpers.js";

/**
 * Bulk session revocation. Users are global, so Better Auth's revoke routes
 * would end the user's sessions on every tenant; here they end the current
 * tenant's only.
 */

const EMAIL = "user@example.com";
const PASSWORD = "correct-horse-battery";

async function revokeSetup(overrides: Partial<MultiTenantOptions> = {}) {
  const ctx = setup(overrides);
  const signIn = async (host: string) => {
    const res = await ctx.request(host, "/sign-in/email", { method: "POST", body: { email: EMAIL, password: PASSWORD } });
    assert.equal(res.status, 200, await res.clone().text());
    return res.headers.get("set-cookie")!.split(";")[0]!;
  };
  /** Whether the session behind `cookie` still works on `host`. */
  const alive = async (host: string, cookie: string) => {
    const res = await ctx.request(host, "/get-session", { cookie });
    return res.status === 200 && (await res.json()) !== null;
  };
  const acmeA = await ctx.signUp("acme.example.com");
  const acmeB = await signIn("acme.example.com");
  const globex = await signIn("globex.example.com");
  assert.equal(ctx.db.session.length, 3);
  return { ...ctx, signIn, alive, acmeA, acmeB, globex };
}

test("revoke-other-sessions only ends the tenant's other sessions", async () => {
  const { request, alive, acmeA, acmeB, globex } = await revokeSetup();
  const res = await request("acme.example.com", "/revoke-other-sessions", { method: "POST", cookie: acmeA });
  assert.equal(res.status, 200, await res.clone().text());
  assert.equal(await alive("acme.example.com", acmeA), true);
  assert.equal(await alive("acme.example.com", acmeB), false);
  assert.equal(await alive("globex.example.com", globex), true);
});

test("revoke-sessions only ends the tenant's sessions", async () => {
  const { request, alive, acmeA, acmeB, globex } = await revokeSetup();
  const res = await request("acme.example.com", "/revoke-sessions", { method: "POST", cookie: acmeA });
  assert.equal(res.status, 200, await res.clone().text());
  assert.equal(await alive("acme.example.com", acmeA), false);
  assert.equal(await alive("acme.example.com", acmeB), false);
  assert.equal(await alive("globex.example.com", globex), true);
});

test("a session with no tenant counts as the tenant's", async () => {
  // `unboundSessions: "allow"` lets it work on every tenant, so revoking here must end it.
  const { request, db, acmeA } = await revokeSetup({ unboundSessions: "allow" });
  db.session[1]!.tenantId = null;
  await request("acme.example.com", "/revoke-sessions", { method: "POST", cookie: acmeA });
  assert.deepEqual(db.session.map((s) => s.tenantId), ["t_globex"]);
});

test("change-password with revokeOtherSessions ends the tenant's other sessions only", async () => {
  const { request, alive, db, acmeA, acmeB, globex } = await revokeSetup();
  const res = await request("acme.example.com", "/change-password", {
    method: "POST",
    cookie: acmeA,
    body: { currentPassword: PASSWORD, newPassword: "another-long-password", revokeOtherSessions: true },
  });
  assert.equal(res.status, 200, await res.clone().text());
  assert.equal(await alive("acme.example.com", acmeA), false);
  assert.equal(await alive("acme.example.com", acmeB), false);
  assert.equal(await alive("globex.example.com", globex), true);

  // The new session is the tenant's and works.
  const fresh = res.headers.get("set-cookie")!.split(";")[0]!;
  assert.equal(await alive("acme.example.com", fresh), true);
  assert.equal(db.session.filter((s) => s.tenantId === "t_acme").length, 1);
  const login = await request("acme.example.com", "/sign-in/email", {
    method: "POST",
    body: { email: EMAIL, password: "another-long-password" },
  });
  assert.equal(login.status, 200);
});

test("change-password without revokeOtherSessions keeps every session", async () => {
  const { request, alive, acmeA, acmeB, globex } = await revokeSetup();
  const res = await request("acme.example.com", "/change-password", {
    method: "POST",
    cookie: acmeA,
    body: { currentPassword: PASSWORD, newPassword: "another-long-password" },
  });
  assert.equal(res.status, 200, await res.clone().text());
  for (const [host, cookie] of [["acme.example.com", acmeA], ["acme.example.com", acmeB], ["globex.example.com", globex]] as const) {
    assert.equal(await alive(host, cookie), true);
  }
});

test('revokeScope: "all" keeps Better Auth\'s behaviour', async () => {
  const { request, alive, acmeA, globex } = await revokeSetup({ revokeScope: "all" });
  await request("acme.example.com", "/revoke-sessions", { method: "POST", cookie: acmeA });
  assert.equal(await alive("globex.example.com", globex), false);
});
