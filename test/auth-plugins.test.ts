import { test } from "node:test";
import assert from "node:assert/strict";
import { anonymous, emailOTP, phoneNumber, twoFactor, username } from "better-auth/plugins";
import type { MultiTenantOptions } from "../src/index.js";
import { codeOf, cookiesOf, setup } from "./helpers.js";

/**
 * Better Auth's authentication plugins next to this one, in a single database:
 * the sessions they create are stamped with the tenant and refused on another,
 * `canAccessTenant` gates them, and what is global (usernames, phone numbers) is
 * pinned down so the README can say what it leaks.
 */

const ACME = "acme.example.com";
const GLOBEX = "globex.example.com";
const EMAIL = "user@example.com";
const PASSWORD = "correct-horse-battery";
const PHONE = "+15550100";

function pluginSetup(overrides: Partial<MultiTenantOptions> = {}) {
  const linked: { anonymous: string; user: string }[] = [];
  const sent = { emailOtps: [] as string[], twoFactorOtps: [] as string[] };
  const ctx = setup(overrides, {
    trustedOrigins: ["http://*.example.com", "http://example.com"],
    plugins: [
      username(),
      anonymous({ onLinkAccount: ({ anonymousUser, newUser }) => void linked.push({ anonymous: anonymousUser.user.id, user: newUser.user.id }) }),
      phoneNumber({ sendOTP: () => {} }),
      emailOTP({ sendVerificationOTP: async ({ otp }) => void sent.emailOtps.push(otp) }),
      twoFactor({ skipVerificationOnEnable: true, otpOptions: { sendOTP: async ({ otp }) => void sent.twoFactorOtps.push(otp) } }),
    ],
  });
  const signUpWith = async (host: string, extra: Record<string, unknown>, email = EMAIL, cookie?: string) => {
    const res = await ctx.request(host, "/sign-up/email", {
      method: "POST",
      cookie,
      body: { email, password: PASSWORD, name: "User", ...extra },
    });
    assert.equal(res.status, 200, await res.clone().text());
    return cookiesOf(res);
  };
  return { ...ctx, linked, sent, signUpWith };
}

const expectCrossTenant = async (res: Response) => {
  assert.equal(res.status, 403, await res.clone().text());
  assert.equal(await codeOf(res), "CROSS_TENANT_SESSION");
};

test("username: a sign-in session is stamped and refused on another tenant", async () => {
  const { db, request, signUpWith } = pluginSetup();
  await signUpWith(ACME, { username: "alice" });
  const res = await request(ACME, "/sign-in/username", { method: "POST", body: { username: "alice", password: PASSWORD } });
  assert.equal(res.status, 200, await res.clone().text());
  assert.equal(db.session.at(-1)!.tenantId, "t_acme");
  await expectCrossTenant(await request(GLOBEX, "/get-session", { cookie: cookiesOf(res) }));
});

test("username: usernames are global, so another tenant can sign in with one and can see it is taken", async () => {
  const { db, request, signUpWith } = pluginSetup();
  await signUpWith(ACME, { username: "alice" });

  // The account is the same on every tenant; only canAccessTenant can tell them apart.
  const res = await request(GLOBEX, "/sign-in/username", { method: "POST", body: { username: "alice", password: PASSWORD } });
  assert.equal(res.status, 200, await res.clone().text());
  assert.equal(db.session.at(-1)!.tenantId, "t_globex");

  const taken = await request(GLOBEX, "/is-username-available", { method: "POST", body: { username: "alice" } });
  assert.deepEqual(await taken.json(), { available: false });
  const clash = await request(GLOBEX, "/sign-up/email", {
    method: "POST",
    body: { email: "other@example.com", password: PASSWORD, name: "Other", username: "alice" },
  });
  assert.equal(clash.status, 400);
});

test("username: canAccessTenant refuses the session", async () => {
  const { db, request, signUpWith } = pluginSetup({ canAccessTenant: (_user, tenant) => tenant.slug === "acme" });
  await signUpWith(ACME, { username: "alice" });
  const denied = await request(GLOBEX, "/sign-in/username", { method: "POST", body: { username: "alice", password: PASSWORD } });
  assert.equal(denied.status, 403);
  assert.equal(await codeOf(denied), "TENANT_ACCESS_DENIED");
  assert.equal(db.session.filter((s) => s.tenantId === "t_globex").length, 0);
});

test("phoneNumber: a password sign-in session is stamped and refused on another tenant; the number is global", async () => {
  const { db, request, signUpWith } = pluginSetup();
  await signUpWith(ACME, { phoneNumber: PHONE });
  const res = await request(ACME, "/sign-in/phone-number", { method: "POST", body: { phoneNumber: PHONE, password: PASSWORD } });
  assert.equal(res.status, 200, await res.clone().text());
  assert.equal(db.session.at(-1)!.tenantId, "t_acme");
  await expectCrossTenant(await request(GLOBEX, "/get-session", { cookie: cookiesOf(res) }));

  const other = await request(GLOBEX, "/sign-in/phone-number", { method: "POST", body: { phoneNumber: PHONE, password: PASSWORD } });
  assert.equal(other.status, 200, "the number belongs to one account on every tenant");
  assert.equal(db.session.at(-1)!.tenantId, "t_globex");
});

test("phoneNumber: canAccessTenant refuses a phone OTP session", async () => {
  const sent: string[] = [];
  const { db, request } = setup(
    { canAccessTenant: () => false },
    {
      trustedOrigins: ["http://*.example.com"],
      plugins: [phoneNumber({ sendOTP: ({ code }) => void sent.push(code), signUpOnVerification: { getTempEmail: (n) => `${n}@p.example.com`, getTempName: (n) => n } })],
    },
  );
  await request(ACME, "/phone-number/send-otp", { method: "POST", body: { phoneNumber: PHONE } });
  const res = await request(ACME, "/phone-number/verify", { method: "POST", body: { phoneNumber: PHONE, code: sent.at(-1) } });
  assert.equal(res.status, 403, await res.clone().text());
  assert.equal(await codeOf(res), "TENANT_ACCESS_DENIED");
  assert.equal(db.session.length, 0);
});

test("emailOTP: a session is stamped, refused on another tenant, and gated by canAccessTenant", async () => {
  const open = pluginSetup();
  await open.request(ACME, "/email-otp/send-verification-otp", { method: "POST", body: { email: EMAIL, type: "sign-in" } });
  const res = await open.request(ACME, "/sign-in/email-otp", { method: "POST", body: { email: EMAIL, otp: open.sent.emailOtps.at(-1) } });
  assert.equal(res.status, 200, await res.clone().text());
  assert.equal(open.db.session[0]!.tenantId, "t_acme");
  await expectCrossTenant(await open.request(GLOBEX, "/get-session", { cookie: cookiesOf(res) }));

  const closed = pluginSetup({ canAccessTenant: () => false });
  await closed.request(ACME, "/email-otp/send-verification-otp", { method: "POST", body: { email: EMAIL, type: "sign-in" } });
  const denied = await closed.request(ACME, "/sign-in/email-otp", { method: "POST", body: { email: EMAIL, otp: closed.sent.emailOtps.at(-1) } });
  assert.equal(await codeOf(denied), "TENANT_ACCESS_DENIED");
  assert.equal(closed.db.session.length, 0);
});

test("twoFactor: the session after the challenge is stamped, refused elsewhere, and gated by canAccessTenant", async () => {
  const ctx = pluginSetup({ canAccessTenant: (_user, tenant) => tenant.slug === "acme" });
  const cookie = await ctx.signUp(ACME);
  const enabled = await ctx.request(ACME, "/two-factor/enable", { method: "POST", cookie, body: { password: PASSWORD, method: "otp" } });
  assert.equal(enabled.status, 200, await enabled.clone().text());

  // The enable route swaps the session for a fresh one: it keeps the tenant.
  assert.equal(ctx.db.session.every((s) => s.tenantId === "t_acme"), true);
  await expectCrossTenant(await ctx.request(GLOBEX, "/get-session", { cookie: cookiesOf(enabled) }));

  const signIn = await ctx.request(ACME, "/sign-in/email", { method: "POST", body: { email: EMAIL, password: PASSWORD } });
  const pending = cookiesOf(signIn);
  await ctx.request(ACME, "/two-factor/send-otp", { method: "POST", cookie: pending, body: {} });
  const verified = await ctx.request(ACME, "/two-factor/verify-otp", { method: "POST", cookie: pending, body: { code: ctx.sent.twoFactorOtps.at(-1) } });
  assert.equal(verified.status, 200, await verified.clone().text());
  assert.equal(ctx.db.session.at(-1)!.tenantId, "t_acme");

  // On the other tenant the password step itself is refused: no challenge starts.
  const other = await ctx.request(GLOBEX, "/sign-in/email", { method: "POST", body: { email: EMAIL, password: PASSWORD } });
  assert.equal(await codeOf(other), "TENANT_ACCESS_DENIED");
  assert.equal(other.headers.getSetCookie().length, 0);
});

test("anonymous: a session from one tenant is not linked to an account created on another", async () => {
  const { db, linked, request, signUpWith } = pluginSetup();
  const anon = await request(ACME, "/sign-in/anonymous", { method: "POST", body: {} });
  assert.equal(anon.status, 200, await anon.clone().text());

  // The cookie is host-only, so a browser would not send it; a client that does is ignored.
  await signUpWith(GLOBEX, {}, "other@example.com", cookiesOf(anon));
  assert.deepEqual(linked, [], "an anonymous user of one tenant must not be linked on another");
  assert.equal(db.user.filter((u) => u.isAnonymous).length, 1, "the anonymous user must not be deleted by another tenant's sign-up");
});

test("anonymous: linking still works on the tenant that issued the session", async () => {
  const { linked, request, signUpWith } = pluginSetup();
  const anon = await request(ACME, "/sign-in/anonymous", { method: "POST", body: {} });
  await signUpWith(ACME, {}, "other@example.com", cookiesOf(anon));
  assert.equal(linked.length, 1);
});
