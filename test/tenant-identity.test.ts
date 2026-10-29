import { test } from "node:test";
import assert from "node:assert/strict";
import { emailOTP } from "better-auth/plugins";
import { codeOf, setup } from "./helpers.js";

/**
 * Tenant-scoped identity (`identity: "tenant"`): the same email on two tenants
 * is two users, with separate passwords, accounts, codes and sessions.
 */

const ACME = "acme.example.com";
const GLOBEX = "globex.example.com";
const EMAIL = "same@example.com";

function identitySetup() {
  const sent = { resets: [] as { token: string; email: string }[], otps: [] as { email: string; otp: string }[] };
  const r = setup(
    { identity: "tenant" },
    {
      plugins: [emailOTP({ sendVerificationOTP: async ({ email, otp }) => void sent.otps.push({ email, otp }) })],
      auth: {
        emailAndPassword: {
          enabled: true,
          sendResetPassword: async ({ user, token }) => void sent.resets.push({ token, email: user.email }),
        },
      },
    },
  );
  const signUpWith = (host: string, password: string) =>
    r.request(host, "/sign-up/email", { method: "POST", body: { email: EMAIL, password, name: "Same" } });
  const signIn = (host: string, password: string) =>
    r.request(host, "/sign-in/email", { method: "POST", body: { email: EMAIL, password } });
  return { ...r, sent, signUpWith, signIn };
}

test("the same email signs up on two tenants as two users", async () => {
  const { signUpWith, db } = identitySetup();
  assert.equal((await signUpWith(ACME, "acme-password-1")).status, 200);
  assert.equal((await signUpWith(GLOBEX, "globex-password-1")).status, 200);
  const users = db.user.filter((u) => u.email === EMAIL);
  assert.equal(users.length, 2);
  assert.deepEqual(users.map((u) => u.tenantId).sort(), ["t_acme", "t_globex"]);
  assert.deepEqual(db.account!.map((a) => a.tenantId).sort(), ["t_acme", "t_globex"]);
});

test("each tenant's user has its own password", async () => {
  const { signUpWith, signIn } = identitySetup();
  await signUpWith(ACME, "acme-password-1");
  await signUpWith(GLOBEX, "globex-password-1");
  assert.equal((await signIn(ACME, "acme-password-1")).status, 200);
  assert.equal((await signIn(GLOBEX, "globex-password-1")).status, 200);
  assert.equal((await signIn(ACME, "globex-password-1")).status, 401);
});

test("a user of one tenant does not exist on another", async () => {
  const { signUpWith, signIn } = identitySetup();
  await signUpWith(ACME, "acme-password-1");
  assert.equal((await signIn(GLOBEX, "acme-password-1")).status, 401);
});

test("signing up twice on one tenant is still refused", async () => {
  const { signUpWith } = identitySetup();
  await signUpWith(ACME, "acme-password-1");
  const again = await signUpWith(ACME, "acme-password-2");
  assert.equal(again.status, 422);
});

test("a password reset on one tenant changes only that tenant's user", async () => {
  const { signUpWith, signIn, request, sent } = identitySetup();
  await signUpWith(ACME, "acme-password-1");
  await signUpWith(GLOBEX, "globex-password-1");

  const asked = await request(ACME, "/request-password-reset", { method: "POST", body: { email: EMAIL, redirectTo: "/" } });
  assert.equal(asked.status, 200, await asked.clone().text());
  const reset = await request(ACME, "/reset-password", {
    method: "POST",
    body: { token: sent.resets.at(-1)!.token, newPassword: "acme-password-2" },
  });
  assert.equal(reset.status, 200, await reset.clone().text());

  assert.equal((await signIn(ACME, "acme-password-2")).status, 200);
  assert.equal((await signIn(GLOBEX, "globex-password-1")).status, 200);
  assert.equal((await signIn(GLOBEX, "acme-password-2")).status, 401);
});

test("one-time codes for the same email on two tenants do not overwrite each other", async () => {
  const { signUpWith, request, sent } = identitySetup();
  await signUpWith(ACME, "acme-password-1");
  await signUpWith(GLOBEX, "globex-password-1");
  const send = (host: string) =>
    request(host, "/email-otp/send-verification-otp", { method: "POST", body: { email: EMAIL, type: "sign-in" } });
  assert.equal((await send(ACME)).status, 200);
  const acmeOtp = sent.otps.at(-1)!.otp;
  assert.equal((await send(GLOBEX)).status, 200);
  const globexOtp = sent.otps.at(-1)!.otp;

  const signIn = (host: string, otp: string) => request(host, "/sign-in/email-otp", { method: "POST", body: { email: EMAIL, otp } });
  assert.equal((await signIn(ACME, acmeOtp)).status, 200);
  assert.equal((await signIn(GLOBEX, globexOtp)).status, 200);
});

test("a user query with no tenant is refused, not run across tenants", async () => {
  const { auth, signUpWith } = identitySetup();
  await signUpWith(ACME, "acme-password-1");
  await assert.rejects(
    auth.api.signInEmail({ body: { email: EMAIL, password: "acme-password-1" } }),
    (error: { body?: { code?: string } }) => error.body?.code === "TENANT_REQUIRED",
  );
});

test("server calls with a tenant host's headers are scoped to it", async () => {
  const { auth, signUpWith } = identitySetup();
  await signUpWith(GLOBEX, "globex-password-1");
  const result = await auth.api.signInEmail({
    body: { email: EMAIL, password: "globex-password-1" },
    headers: new Headers({ host: GLOBEX }),
  });
  assert.equal(result.user.email, EMAIL);
});

test("the default global identity keeps one user per email", async () => {
  const { request } = setup();
  const body = { email: EMAIL, password: "password-1234", name: "Same" };
  assert.equal((await request(ACME, "/sign-up/email", { method: "POST", body })).status, 200);
  const second = await request(GLOBEX, "/sign-up/email", { method: "POST", body });
  assert.equal(second.status, 422);
  assert.equal(await codeOf(second), "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL");
});
