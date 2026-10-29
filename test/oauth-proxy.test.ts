import { afterEach, beforeEach, test } from "node:test";
import assert from "node:assert/strict";
import { oAuthProxy } from "better-auth/plugins";
import type { MultiTenantOptions, TenantPolicy } from "../src/index.js";
import { codeOf, cookiesOf, setup } from "./helpers.js";

/**
 * OAuth across tenant hosts. Google and GitHub accept no wildcard redirect URIs,
 * so every tenant subdomain or custom domain would have to be registered. With
 * Better Auth's `oAuthProxy`, the provider returns to one host
 * (`oauthProxyHost`), which hands the profile to the tenant the flow started
 * on; the session is created there and bound to it.
 */

const ACME = "acme.example.com";
const GLOBEX = "globex.example.com";
const PROXY = "auth.example.com";

// A stand-in for Google's token endpoint: any code returns an ID token for one user.
const realFetch = globalThis.fetch;
beforeEach(() => {
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
    if (!url.startsWith("https://oauth2.googleapis.com/token")) return realFetch(input, init);
    const claims = { sub: "google-user-1", email: "person@gmail.com", email_verified: true, name: "Person", iss: "https://accounts.google.com" };
    const part = (value: object) => Buffer.from(JSON.stringify(value)).toString("base64url");
    const idToken = `${part({ alg: "none", typ: "JWT" })}.${part(claims)}.sig`;
    return Response.json({ access_token: "at", id_token: idToken, token_type: "Bearer", expires_in: 3600 });
  }) as typeof fetch;
});
afterEach(() => {
  globalThis.fetch = realFetch;
});

function proxySetup(overrides: Partial<MultiTenantOptions> = {}) {
  const r = setup(
    { oauthProxyHost: PROXY, ...overrides },
    {
      trustedOrigins: [],
      plugins: [oAuthProxy({ productionURL: `http://${PROXY}` })],
      auth: { socialProviders: { google: { clientId: "google-id", clientSecret: "google-secret" } } },
    },
  );
  const pathOf = (location: string) => {
    const url = new URL(location);
    return url.pathname.replace("/api/auth", "") + url.search;
  };

  /** Start on `host`, come back through the proxy host, and return the hand-off URL to the tenant. */
  const startAndReturn = async (host: string) => {
    const started = await r.request(host, "/sign-in/social", {
      method: "POST",
      body: { provider: "google", callbackURL: `http://${host}/dashboard`, disableRedirect: true },
    });
    assert.equal(started.status, 200, await started.clone().text());
    const authorize = new URL(((await started.json()) as { url: string }).url);
    assert.equal(authorize.searchParams.get("redirect_uri"), `http://${PROXY}/api/auth/callback/google`);
    const state = authorize.searchParams.get("state")!;

    const atProxy = await r.request(PROXY, `/callback/google?code=code-1&state=${encodeURIComponent(state)}`);
    assert.equal(atProxy.status, 302, await atProxy.clone().text());
    return atProxy.headers.get("location")!;
  };
  return { ...r, pathOf, startAndReturn };
}

test("a flow started on a tenant comes back through the proxy host and signs in on that tenant", async () => {
  const { request, startAndReturn, pathOf, db } = proxySetup();
  const handOff = await startAndReturn(ACME);
  assert.equal(new URL(handOff).host, ACME);

  const done = await request(ACME, pathOf(handOff));
  assert.equal(done.status, 302, await done.clone().text());
  assert.equal(done.headers.get("location"), `http://${ACME}/dashboard`);
  const cookie = cookiesOf(done);
  assert.ok(cookie);
  assert.equal(db.session.at(-1)?.tenantId, "t_acme");

  const session = (await (await request(ACME, "/get-session", { cookie })).json()) as { user?: { email?: string } } | null;
  assert.equal(session?.user?.email, "person@gmail.com");
});

test("a hand-off for one tenant is refused on another", async () => {
  const { request, startAndReturn, pathOf, db } = proxySetup();
  const handOff = await startAndReturn(ACME);
  const replayed = await request(GLOBEX, pathOf(handOff));
  assert.equal(replayed.status, 302);
  assert.match(replayed.headers.get("location") ?? "", /error=state_mismatch/);
  assert.equal(cookiesOf(replayed), "");
  assert.equal(db.session.length, 0);
});

test("the proxy host serves only the OAuth callback", async () => {
  const { request } = proxySetup();
  const res = await request(PROXY, "/sign-in/email", {
    method: "POST",
    body: { email: "user@example.com", password: "correct-horse-battery" },
  });
  assert.equal(res.status, 404);
  assert.equal(await codeOf(res), "TENANT_REQUIRED");
  // The hand-off route (`/oauth-proxy-callback` before Better Auth 1.7) is the tenant's, not the proxy host's.
  for (const path of ["/callback/google/oauth-proxy?callbackURL=x&profile=y", "/oauth-proxy-callback?callbackURL=x&profile=y"]) {
    const handOff = await request(PROXY, path);
    assert.ok(handOff.status === 404 || handOff.status === 400, `${path}: ${handOff.status}`);
    assert.equal(cookiesOf(handOff), "");
  }
});

test("without oauthProxyHost the proxy host is not a tenant and the callback is refused", async () => {
  const { request } = proxySetup({ oauthProxyHost: undefined });
  const res = await request(PROXY, "/callback/google?code=code-1&state=anything");
  assert.equal(res.status, 404);
  assert.equal(await codeOf(res), "TENANT_REQUIRED");
});

test("the tenant's policy applies to the hand-off", async () => {
  const policies: Record<string, TenantPolicy> = {};
  const { request, startAndReturn, pathOf } = proxySetup({ getTenantPolicy: (t) => policies[t.slug] });
  const handOff = await startAndReturn(ACME);
  policies.acme = { methods: ["email-password"] };
  const done = await request(ACME, pathOf(handOff));
  assert.equal(done.status, 403);
  assert.equal(await codeOf(done), "AUTH_METHOD_NOT_ALLOWED");
});

test("the deprecated /oauth-proxy-callback needs every social provider allowed", async () => {
  const { request } = proxySetup({ getTenantPolicy: () => ({ methods: ["social:google"] }) });
  const res = await request(ACME, "/oauth-proxy-callback?callbackURL=x&profile=y");
  assert.equal(res.status, 403);
  assert.equal(await codeOf(res), "AUTH_METHOD_NOT_ALLOWED");
});
