import { test } from "node:test";
import assert from "node:assert/strict";
import { magicLink, twoFactor } from "better-auth/plugins";
import type { TenantPolicy } from "../src/index.js";
import { codeOf, cookiesOf, setup } from "./helpers.js";

/**
 * Per-tenant auth policy (`getTenantPolicy`): which sign-in methods a tenant
 * allows, whether it allows sign-up, and whether it requires two-factor
 * authentication. Enforced on the server, so hiding a button is not the only
 * thing standing between a user and a disallowed method.
 */

const ACME = "acme.example.com";
const GLOBEX = "globex.example.com";
const PASSWORD = "correct-horse-battery";

function policySetup(policies: Record<string, TenantPolicy>) {
  const links: string[] = [];
  const r = setup(
    { getTenantPolicy: (tenant) => policies[tenant.slug] ?? null },
    {
      plugins: [
        magicLink({ sendMagicLink: async ({ url }) => void links.push(url) }),
        twoFactor({ skipVerificationOnEnable: true }),
      ],
      auth: {
        socialProviders: {
          google: { clientId: "google-id", clientSecret: "google-secret" },
          github: { clientId: "github-id", clientSecret: "github-secret" },
        },
      },
    },
  );
  const signIn = (host: string, email = "user@example.com") =>
    r.request(host, "/sign-in/email", { method: "POST", body: { email, password: PASSWORD } });
  const social = (host: string, provider: string) =>
    r.request(host, "/sign-in/social", { method: "POST", body: { provider, disableRedirect: true } });
  const sendMagicLink = (host: string, email = "user@example.com") =>
    r.request(host, "/sign-in/magic-link", { method: "POST", body: { email } });
  return { ...r, links, signIn, social, sendMagicLink };
}

test("a method the tenant allows works, one it does not is refused", async () => {
  const { signUp, signIn, sendMagicLink } = policySetup({ acme: { methods: ["email-password"] } });
  await signUp(GLOBEX);
  assert.equal((await signIn(ACME)).status, 200);
  const res = await sendMagicLink(ACME);
  assert.equal(res.status, 403);
  assert.equal(await codeOf(res), "AUTH_METHOD_NOT_ALLOWED");
});

test("the policy is per tenant", async () => {
  const { signUp, sendMagicLink } = policySetup({ acme: { methods: ["email-password"] } });
  await signUp(GLOBEX);
  assert.equal((await sendMagicLink(GLOBEX)).status, 200);
});

test("an SSO-only tenant refuses password sign-in and sign-up", async () => {
  const { signUp, request, signIn } = policySetup({ acme: { methods: ["sso"] } });
  await signUp(GLOBEX);
  const signInRes = await signIn(ACME);
  assert.equal(signInRes.status, 403);
  assert.equal(await codeOf(signInRes), "AUTH_METHOD_NOT_ALLOWED");
  const signUpRes = await request(ACME, "/sign-up/email", {
    method: "POST",
    body: { email: "new@example.com", password: PASSWORD, name: "New" },
  });
  assert.equal(signUpRes.status, 403);
  assert.equal(await codeOf(signUpRes), "AUTH_METHOD_NOT_ALLOWED");
});

test("social providers can be allowed one by one", async () => {
  const { social } = policySetup({ acme: { methods: ["social:google"] } });
  assert.equal((await social(ACME, "google")).status, 200);
  const res = await social(ACME, "github");
  assert.equal(res.status, 403);
  assert.equal(await codeOf(res), "AUTH_METHOD_NOT_ALLOWED");
});

test("\"social\" allows every social provider", async () => {
  const { social } = policySetup({ acme: { methods: ["social"] } });
  assert.equal((await social(ACME, "google")).status, 200);
  assert.equal((await social(ACME, "github")).status, 200);
});

test("an OAuth callback for a disallowed provider is refused", async () => {
  const { request } = policySetup({ acme: { methods: ["social:google"] } });
  const res = await request(ACME, "/callback/github?code=x&state=y");
  assert.equal(res.status, 403);
  assert.equal(await codeOf(res), "AUTH_METHOD_NOT_ALLOWED");
});

test("signUp: false refuses new users from any method, and existing users still sign in", async () => {
  const { signUp, request, signIn, sendMagicLink, links, db } = policySetup({ acme: { signUp: false } });
  const res = await request(ACME, "/sign-up/email", {
    method: "POST",
    body: { email: "new@example.com", password: PASSWORD, name: "New" },
  });
  assert.equal(res.status, 403);
  assert.equal(await codeOf(res), "SIGN_UP_DISABLED");

  // A magic link for an unknown email would create the user when followed.
  assert.equal((await sendMagicLink(ACME, "stranger@example.com")).status, 200);
  const verify = await request(ACME, new URL(links.at(-1)!).pathname.replace("/api/auth", "") + new URL(links.at(-1)!).search);
  assert.notEqual(verify.status, 200);
  assert.equal(db.user.some((u) => u.email === "stranger@example.com"), false);

  await signUp(GLOBEX);
  assert.equal((await signIn(ACME)).status, 200);
});

test("requireTwoFactor: without 2FA, get-session is empty and other routes are refused", async () => {
  const { signUp, request, signIn } = policySetup({ acme: { requireTwoFactor: true } });
  await signUp(GLOBEX);
  const cookie = cookiesOf(await signIn(ACME));

  const session = await request(ACME, "/get-session", { cookie });
  assert.equal(session.status, 200);
  assert.equal(await session.json(), null);

  const listed = await request(ACME, "/list-sessions", { cookie });
  assert.equal(listed.status, 403);
  assert.equal(await codeOf(listed), "TWO_FACTOR_REQUIRED");
});

test("requireTwoFactor: enrolment stays open, and the session works once 2FA is on", async () => {
  const { signUp, request, signIn } = policySetup({ acme: { requireTwoFactor: true } });
  await signUp(GLOBEX);
  const cookie = cookiesOf(await signIn(ACME));

  const enabled = await request(ACME, "/two-factor/enable", { method: "POST", cookie, body: { password: PASSWORD } });
  assert.equal(enabled.status, 200, await enabled.clone().text());

  const session = await request(ACME, "/get-session", { cookie: cookiesOf(enabled) || cookie });
  const body = (await session.json()) as { user?: { twoFactorEnabled?: boolean } } | null;
  assert.equal(body?.user?.twoFactorEnabled, true);
});

test("requireTwoFactor does not touch tenants that do not require it", async () => {
  const { signUp, request } = policySetup({ acme: { requireTwoFactor: true } });
  const cookie = await signUp(GLOBEX);
  const session = (await (await request(GLOBEX, "/get-session", { cookie })).json()) as { user?: unknown } | null;
  assert.ok(session?.user);
});

test("/multi-tenant/current reports the tenant's policy", async () => {
  const { request } = policySetup({ acme: { methods: ["sso", "social:google"], signUp: false, requireTwoFactor: true } });
  const body = (await (await request(ACME, "/multi-tenant/current")).json()) as { policy?: TenantPolicy };
  assert.deepEqual(body.policy, { methods: ["sso", "social:google"], signUp: false, requireTwoFactor: true });
});

test("no policy means no restriction", async () => {
  const { signUp, signIn, sendMagicLink, request } = policySetup({});
  await signUp(GLOBEX);
  assert.equal((await signIn(ACME)).status, 200);
  assert.equal((await sendMagicLink(ACME)).status, 200);
  const body = (await (await request(ACME, "/multi-tenant/current")).json()) as { policy?: unknown };
  assert.deepEqual(body.policy, {});
});
