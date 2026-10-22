import { test } from "node:test";
import assert from "node:assert/strict";
import { emailOTP, magicLink, phoneNumber, twoFactor } from "better-auth/plugins";
import type { MultiTenantOptions } from "../src/index.js";
import { betterAuth17, codeOf, cookiesOf, setup } from "./helpers.js";

/**
 * A code, token or pending cookie that a plugin hands out on one tenant is bound
 * to it: redeeming it on another tenant's host is refused, and it stays usable on
 * the host that issued it.
 */

const EMAIL = "user@example.com";
const PHONE = "+15550100";
const PASSWORD = "correct-horse-battery";
const ACME = "acme.example.com";
const GLOBEX = "globex.example.com";

function pluginSetup(overrides: Partial<MultiTenantOptions> = {}) {
  const sent = { links: [] as string[], emailOtps: [] as string[], phoneOtps: [] as string[], twoFactorOtps: [] as string[] };
  const ctx = setup(overrides, {
    trustedOrigins: ["http://*.example.com", "http://example.com"],
    plugins: [
      magicLink({ sendMagicLink: async ({ token }) => void sent.links.push(token) }),
      emailOTP({ sendVerificationOTP: async ({ otp }) => void sent.emailOtps.push(otp) }),
      phoneNumber({
        sendOTP: ({ code }) => void sent.phoneOtps.push(code),
        signUpOnVerification: { getTempEmail: (n) => `${n}@phone.example.com`, getTempName: (n) => n },
      }),
      twoFactor({ skipVerificationOnEnable: true, otpOptions: { sendOTP: async ({ otp }) => void sent.twoFactorOtps.push(otp) } }),
    ],
  });
  return { ...ctx, sent };
}

test("a magic link followed on another tenant is refused, and still works on its own", async () => {
  const { request, sent, db } = pluginSetup();
  await request(ACME, "/sign-in/magic-link", { method: "POST", body: { email: EMAIL } });
  const token = sent.links.at(-1);

  const other = await request(GLOBEX, `/magic-link/verify?token=${token}`);
  assert.equal(other.status, 403, await other.clone().text());
  assert.equal(await codeOf(other), "VERIFICATION_TENANT_MISMATCH");
  assert.equal(db.session.length, 0);

  const own = await request(ACME, `/magic-link/verify?token=${token}`);
  assert.equal(own.status, 200, await own.clone().text());
  assert.equal(db.session[0]!.tenantId, "t_acme");
});

test("an email OTP issued on one tenant cannot sign in on another", async () => {
  const { request, sent, db } = pluginSetup();
  await request(ACME, "/email-otp/send-verification-otp", { method: "POST", body: { email: EMAIL, type: "sign-in" } });
  const otp = sent.emailOtps.at(-1);

  const other = await request(GLOBEX, "/sign-in/email-otp", { method: "POST", body: { email: EMAIL, otp } });
  assert.equal(other.status, 403, await other.clone().text());
  assert.equal(await codeOf(other), "VERIFICATION_TENANT_MISMATCH");
  assert.equal(db.session.length, 0);

  const own = await request(ACME, "/sign-in/email-otp", { method: "POST", body: { email: EMAIL, otp } });
  assert.equal(own.status, 200, await own.clone().text());
  assert.equal(db.session[0]!.tenantId, "t_acme");
});

test("an email OTP password reset issued on one tenant cannot be used on another", async () => {
  const { request, signUp, sent } = pluginSetup();
  await signUp(ACME);
  await request(ACME, "/email-otp/request-password-reset", { method: "POST", body: { email: EMAIL } });
  const otp = sent.emailOtps.at(-1);

  const other = await request(GLOBEX, "/email-otp/reset-password", {
    method: "POST",
    body: { email: EMAIL, otp, password: "another-long-password" },
  });
  assert.equal(other.status, 403, await other.clone().text());
  assert.equal(await codeOf(other), "VERIFICATION_TENANT_MISMATCH");
  const signIn = await request(ACME, "/sign-in/email", { method: "POST", body: { email: EMAIL, password: PASSWORD } });
  assert.equal(signIn.status, 200, "the password must be unchanged");
});

test("a phone-number OTP issued on one tenant cannot be verified on another", async () => {
  const { request, sent, db } = pluginSetup();
  await request(ACME, "/phone-number/send-otp", { method: "POST", body: { phoneNumber: PHONE } });
  const code = sent.phoneOtps.at(-1);

  const other = await request(GLOBEX, "/phone-number/verify", { method: "POST", body: { phoneNumber: PHONE, code } });
  assert.equal(other.status, 403, await other.clone().text());
  assert.equal(await codeOf(other), "VERIFICATION_TENANT_MISMATCH");
  assert.equal(db.session.length, 0);
  assert.equal(db.user.length, 0, "no account may be created from another tenant's code");

  const own = await request(ACME, "/phone-number/verify", { method: "POST", body: { phoneNumber: PHONE, code } });
  assert.equal(own.status, 200, await own.clone().text());
  assert.equal(db.session[0]!.tenantId, "t_acme");
});

/** Sign up on `host`, turn two-factor on, sign in again and stop at the challenge. */
async function twoFactorChallenge(ctx: ReturnType<typeof pluginSetup>, host = ACME) {
  const cookie = await ctx.signUp(host);
  const enabled = await ctx.request(host, "/two-factor/enable", { method: "POST", cookie, body: { password: PASSWORD, method: "otp" } });
  assert.equal(enabled.status, 200, await enabled.clone().text());
  const enabledTotp = await ctx.request(host, "/two-factor/enable", {
    method: "POST",
    cookie: cookiesOf(enabled),
    body: { password: PASSWORD },
  });
  const backupCodes = ((await enabledTotp.json()) as { backupCodes?: string[] }).backupCodes ?? [];

  const signIn = await ctx.request(host, "/sign-in/email", { method: "POST", body: { email: EMAIL, password: PASSWORD } });
  assert.equal(((await signIn.clone().json()) as { twoFactorRedirect?: boolean }).twoFactorRedirect, true);
  return { pending: cookiesOf(signIn), backupCodes };
}

test("a two-factor challenge started on one tenant cannot be completed on another", async () => {
  const ctx = pluginSetup();
  const { pending } = await twoFactorChallenge(ctx);
  const sessions = ctx.db.session.length;

  const sendOtp = await ctx.request(ACME, "/two-factor/send-otp", { method: "POST", cookie: pending, body: {} });
  assert.equal(sendOtp.status, 200, await sendOtp.clone().text());
  const code = ctx.sent.twoFactorOtps.at(-1);

  const other = await ctx.request(GLOBEX, "/two-factor/verify-otp", { method: "POST", cookie: pending, body: { code } });
  assert.ok(other.status >= 400, "the challenge must not complete on another tenant");
  assert.equal(ctx.db.session.length, sessions, "no session may be created on another tenant");

  const own = await ctx.request(ACME, "/two-factor/verify-otp", { method: "POST", cookie: pending, body: { code } });
  assert.equal(own.status, 200, await own.clone().text());
  assert.equal(ctx.db.session.at(-1)!.tenantId, "t_acme");
});

test("a backup code cannot complete a challenge started on another tenant", async () => {
  const ctx = pluginSetup();
  const { pending, backupCodes } = await twoFactorChallenge(ctx);
  assert.ok(backupCodes[0], "expected backup codes");
  const sessions = ctx.db.session.length;

  const other = await ctx.request(GLOBEX, "/two-factor/verify-backup-code", { method: "POST", cookie: pending, body: { code: backupCodes[0] } });
  assert.ok(other.status >= 400, await other.clone().text());
  assert.equal(ctx.db.session.length, sessions);

  const own = await ctx.request(ACME, "/two-factor/verify-backup-code", { method: "POST", cookie: pending, body: { code: backupCodes[0] } });
  assert.equal(own.status, 200, await own.clone().text());
});

test("a trusted-device cookie from one tenant does not skip two-factor on another", async () => {
  const ctx = pluginSetup();
  const { pending } = await twoFactorChallenge(ctx);
  await ctx.request(ACME, "/two-factor/send-otp", { method: "POST", cookie: pending, body: {} });
  const verified = await ctx.request(ACME, "/two-factor/verify-otp", {
    method: "POST",
    cookie: pending,
    body: { code: ctx.sent.twoFactorOtps.at(-1), trustDevice: true },
  });
  assert.equal(verified.status, 200, await verified.clone().text());
  const trust = cookiesOf(verified)
    .split("; ")
    .filter((c) => c.includes("trust_device"))
    .join("");
  assert.ok(trust, "expected a trusted-device cookie");

  // The cookie is single-use (it rotates on each sign-in), so the refusal comes first.
  const other = await ctx.request(GLOBEX, "/sign-in/email", { method: "POST", cookie: trust, body: { email: EMAIL, password: PASSWORD } });
  const body = (await other.clone().json()) as { twoFactorRedirect?: boolean; token?: string };
  assert.ok(other.status >= 400 || body.twoFactorRedirect === true, "the trusted-device cookie must not skip two-factor");
  assert.equal(body.token, undefined);
  assert.equal(
    other.headers.getSetCookie().some((c) => /session_token=[^;]/.test(c)),
    false,
    "no session cookie may be set",
  );

  // On its own tenant the cookie skips the challenge.
  const own = await ctx.request(ACME, "/sign-in/email", { method: "POST", cookie: trust, body: { email: EMAIL, password: PASSWORD } });
  assert.equal(own.status, 200);
  assert.equal(((await own.clone().json()) as { twoFactorRedirect?: boolean }).twoFactorRedirect, undefined);
});

test("verification rows are stamped with the tenant of the request that created them", async () => {
  const { request, db } = pluginSetup();
  await request(ACME, "/sign-in/magic-link", { method: "POST", body: { email: EMAIL } });
  await request(GLOBEX, "/email-otp/send-verification-otp", { method: "POST", body: { email: EMAIL, type: "sign-in" } });
  assert.deepEqual(db.verification.map((v) => v.tenantId).sort(), ["t_acme", "t_globex"]);
});

test("bindVerifications: false leaves verification rows alone", async () => {
  const { request, sent, db } = pluginSetup({ bindVerifications: false });
  await request(ACME, "/sign-in/magic-link", { method: "POST", body: { email: EMAIL } });
  assert.equal(db.verification[0]!.tenantId, undefined);
  const res = await request(GLOBEX, `/magic-link/verify?token=${sent.links.at(-1)}`);
  assert.equal(res.status, 200);
});

test("with a baseURL that follows the host, a magic link opens on the tenant that sent it", async () => {
  const urls: string[] = [];
  const { request, db } = setup(
    {},
    {
      trustedOrigins: ["http://*.example.com"],
      auth: { baseURL: { allowedHosts: ["*.example.com"], protocol: "http", fallback: "http://acme.example.com" } },
      plugins: [magicLink({ sendMagicLink: async ({ url }) => void urls.push(url) })],
    },
  );
  for (const host of [ACME, GLOBEX]) {
    await request(host, "/sign-in/magic-link", { method: "POST", body: { email: EMAIL } });
    const link = new URL(urls.at(-1)!);
    assert.equal(link.host, host);
    const res = await request(link.host, `${link.pathname.replace("/api/auth", "")}${link.search}`);
    assert.equal(res.status, 302, await res.clone().text()); // on to the callback URL, signed in
  }
  assert.deepEqual(db.session.map((s) => s.tenantId), ["t_acme", "t_globex"]);
});

test("a row with no tenant stamp is refused on a tenant's host", async () => {
  const { request, sent, db } = pluginSetup();
  await request(ACME, "/sign-in/magic-link", { method: "POST", body: { email: EMAIL } });
  delete db.verification[0]!.tenantId; // written before the column existed
  const res = await request(ACME, `/magic-link/verify?token=${sent.links.at(-1)}`);
  assert.equal(await codeOf(res), "VERIFICATION_TENANT_MISMATCH");
  assert.equal(db.session.length, 0);
});

test("expired rows of another tenant are still cleaned up", { skip: !betterAuth17 }, async () => {
  const { request, db } = pluginSetup();
  await request(ACME, "/sign-in/magic-link", { method: "POST", body: { email: EMAIL } });
  db.verification[0]!.expiresAt = new Date(Date.now() - 1000);
  // Any lookup of a verification row sweeps expired ones, from whichever host.
  await request(GLOBEX, "/magic-link/verify?token=unknown");
  assert.equal(db.verification.length, 0);
});

test("warns when verification lives only in secondary storage, where the binding cannot be enforced", async () => {
  const warnings: string[] = [];
  const logger = { level: "warn" as const, log: (level: string, message: string) => void (level === "warn" && warnings.push(message)) };
  const store = new Map<string, string>();
  const secondaryStorage = {
    get: async (key: string) => store.get(key) ?? null,
    set: async (key: string, value: string) => void store.set(key, value),
    delete: async (key: string) => void store.delete(key),
    increment: async (key: string) => {
      const next = Number(store.get(key) ?? 0) + 1;
      store.set(key, String(next));
      return next;
    },
    getAndDelete: async (key: string) => {
      const value = store.get(key) ?? null;
      store.delete(key);
      return value;
    },
  };
  const { auth } = setup({}, { auth: { logger, secondaryStorage } });
  await auth.$context;
  const ours = warnings.filter((w) => w.includes("secondaryStorage"));
  assert.equal(ours.length, 1, JSON.stringify(warnings));

  const { auth: quiet } = setup({ bindVerifications: false }, { auth: { logger, secondaryStorage } });
  await quiet.$context;
  assert.equal(warnings.filter((w) => w.includes("secondaryStorage")).length, 1);
});
