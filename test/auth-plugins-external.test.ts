import { test, afterEach } from "node:test";
import assert from "node:assert/strict";
import { createHash, generateKeyPairSync, randomUUID, sign, type KeyObject } from "node:crypto";
import { passkey } from "@better-auth/passkey";
import { exportJWK, SignJWT } from "jose";
import { memoryAdapter } from "better-auth/adapters/memory";
import { genericOAuth, oneTap, siwe } from "better-auth/plugins";
import { createTenantAuth, type MultiTenantOptions } from "../src/index.js";
import { codeOf, cookiesOf, setup, TENANTS } from "./helpers.js";

/**
 * Plugins that talk to something outside Better Auth: Sign In With Ethereum,
 * passkeys (driven by a software authenticator), a generic OAuth provider and
 * Google One Tap (both against a stubbed identity provider).
 */

const ACME = "acme.example.com";
const GLOBEX = "globex.example.com";
const WALLET = `0x${"a".repeat(40)}`;
const trustedOrigins = ["http://*.example.com", "http://example.com"];

const b64url = (data: Buffer | Uint8Array) => Buffer.from(data).toString("base64url");

// ---------------------------------------------------------------- SIWE

const siweMessage = (domain: string, nonce: string) =>
  [
    `${domain} wants you to sign in with your Ethereum account:`,
    WALLET,
    "",
    "Sign in",
    "",
    `URI: https://${domain}`,
    "Version: 1",
    "Chain ID: 1",
    `Nonce: ${nonce}`,
    `Issued At: ${new Date().toISOString()}`,
  ].join("\n");

function siweSetup(overrides: Partial<MultiTenantOptions> = {}, domain = "example.com") {
  const ctx = setup(overrides, {
    trustedOrigins,
    plugins: [siwe({ domain, getNonce: async () => randomUUID().replaceAll("-", ""), verifyMessage: async () => true })],
  });
  const nonce = async (host: string) => ((await (await ctx.request(host, "/siwe/nonce", { method: "POST", body: {} })).json()) as { nonce: string }).nonce;
  const verify = (host: string, message: string) =>
    ctx.request(host, "/siwe/verify", { method: "POST", body: { message, signature: "0xsig" } });
  return { ...ctx, nonce, verify };
}

test("siwe: a session is stamped with the tenant and refused on another", async () => {
  const { db, nonce, verify, request } = siweSetup();
  const res = await verify(ACME, siweMessage("example.com", await nonce(ACME)));
  assert.equal(res.status, 200, await res.clone().text());
  assert.equal(db.session[0]!.tenantId, "t_acme");
  const other = await request(GLOBEX, "/get-session", { cookie: cookiesOf(res) });
  assert.equal(await codeOf(other), "CROSS_TENANT_SESSION");
});

test("siwe: a nonce issued on one tenant cannot be used on another", async () => {
  const { db, nonce, verify } = siweSetup();
  const issued = await nonce(ACME);
  const other = await verify(GLOBEX, siweMessage("example.com", issued));
  assert.equal(other.status, 403, await other.clone().text());
  assert.equal(await codeOf(other), "VERIFICATION_TENANT_MISMATCH");
  assert.equal(db.session.length, 0);
  assert.equal(db.user.length, 0);

  const own = await verify(ACME, siweMessage("example.com", issued));
  assert.equal(own.status, 200, await own.clone().text());
});

test("siwe: canAccessTenant refuses the session, but the wallet account is still created", async () => {
  const { db, nonce, verify } = siweSetup({ canAccessTenant: () => false });
  const res = await verify(ACME, siweMessage("example.com", await nonce(ACME)));
  assert.equal(await codeOf(res), "TENANT_ACCESS_DENIED");
  assert.equal(db.session.length, 0);
  // Account creation is not gated, only session creation: say so in the README.
  assert.equal(db.user.length, 1);
});

test("siwe: one configured domain serves every tenant in a single instance", async () => {
  // The message domain is compared with the plugin's `domain` option, not the host.
  const { nonce, verify } = siweSetup({}, ACME);
  const refused = await verify(GLOBEX, siweMessage(GLOBEX, await nonce(GLOBEX)));
  assert.equal(refused.status, 401, "a message for the tenant's own host is refused");
  const accepted = await verify(GLOBEX, siweMessage(ACME, await nonce(GLOBEX)));
  assert.equal(accepted.status, 200, "a message for the configured domain works on any tenant");
});

test("siwe: createTenantAuth gives each tenant its own domain", async () => {
  const dbs = { acme: db(), globex: db() };
  const tenantAuth = createTenantAuth({
    baseDomain: "example.com",
    getTenant: (slug) => TENANTS[slug] ?? null,
    createAuth: (tenant) => ({
      secret: "test-secret-0123456789-abcdefghijklmnop",
      baseURL: `http://${tenant.slug}.example.com`,
      trustedOrigins,
      database: memoryAdapter(dbs[tenant.slug as "acme" | "globex"]),
      logger: { disabled: true },
      plugins: [siwe({ domain: `${tenant.slug}.example.com`, getNonce: async () => randomUUID().replaceAll("-", ""), verifyMessage: async () => true })],
    }),
  });
  const call = (host: string, path: string, body: unknown) =>
    tenantAuth.handler(
      new Request(`http://${host}/api/auth${path}`, {
        method: "POST",
        body: JSON.stringify(body),
        headers: { host, origin: `http://${host}`, "content-type": "application/json" },
      }),
    );
  for (const [host, domain, status] of [
    [ACME, ACME, 200],
    [ACME, GLOBEX, 401],
    [GLOBEX, GLOBEX, 200],
    [GLOBEX, ACME, 401],
  ] as const) {
    const { nonce } = (await (await call(host, "/siwe/nonce", {})).json()) as { nonce: string };
    const res = await call(host, "/siwe/verify", { message: siweMessage(domain, nonce), signature: "0xsig" });
    assert.equal(res.status, status, `${host} with a message for ${domain}: ${await res.clone().text()}`);
  }
});

// ---------------------------------------------------------------- passkey

const RP_ID = "example.com";

/** A software authenticator: a P-256 key, and the passkey row that Better Auth would store for it. */
function authenticator() {
  const { privateKey, publicKey } = generateKeyPairSync("ec", { namedCurve: "P-256" });
  const { x, y } = publicKey.export({ format: "jwk" }) as { x: string; y: string };
  const coordinate = (v: string) => Buffer.concat([Buffer.from([0x58, 0x20]), Buffer.from(v, "base64url")]);
  // COSE_Key as CBOR: {1: 2, 3: -7, -1: 1, -2: x, -3: y}
  const cose = Buffer.concat([
    Buffer.from([0xa5, 0x01, 0x02, 0x03, 0x26, 0x20, 0x01, 0x21]),
    coordinate(x),
    Buffer.from([0x22]),
    coordinate(y),
  ]);
  const credentialID = b64url(Buffer.from(randomUUID()));
  let counter = 0;
  return {
    credentialID,
    row: (userId: string) => ({
      id: randomUUID(),
      name: "test key",
      publicKey: cose.toString("base64"),
      userId,
      credentialID,
      counter: 0,
      deviceType: "singleDevice",
      backedUp: false,
      createdAt: new Date(),
    }),
    /** What a browser sends back for `challenge`, from a page on `origin` that uses relying party `rpID`. */
    assertion: (challenge: string, origin: string, rpID = RP_ID, key: KeyObject = privateKey) => {
      const clientDataJSON = Buffer.from(JSON.stringify({ type: "webauthn.get", challenge, origin, crossOrigin: false }));
      const counterBytes = Buffer.alloc(4);
      counterBytes.writeUInt32BE(++counter);
      const authenticatorData = Buffer.concat([createHash("sha256").update(rpID).digest(), Buffer.from([0x05]), counterBytes]);
      const signature = sign("sha256", Buffer.concat([authenticatorData, createHash("sha256").update(clientDataJSON).digest()]), key);
      return {
        id: credentialID,
        rawId: credentialID,
        type: "public-key",
        clientExtensionResults: {},
        response: { clientDataJSON: b64url(clientDataJSON), authenticatorData: b64url(authenticatorData), signature: b64url(signature) },
      };
    },
  };
}

function passkeySetup(overrides: Partial<MultiTenantOptions> = {}, rpID = RP_ID) {
  const ctx = setup(overrides, { trustedOrigins, plugins: [passkey({ rpID, rpName: "Test" })] });
  const key = authenticator();
  /** An account whose passkey is already registered. */
  const enroll = async () => {
    await ctx.signUp(ACME);
    ctx.db.passkey!.push(key.row(ctx.db.user[0]!.id as string));
  };
  const challenge = async (host: string) => {
    const res = await ctx.request(host, "/passkey/generate-authenticate-options");
    assert.equal(res.status, 200, await res.clone().text());
    return { challenge: ((await res.json()) as { challenge: string }).challenge, cookie: cookiesOf(res) };
  };
  const verify = (host: string, cookie: string, response: unknown) =>
    ctx.request(host, "/passkey/verify-authentication", { method: "POST", cookie, body: { response } });
  return { ...ctx, key, enroll, challenge, verify };
}

test("passkey: a session is stamped with the tenant and refused on another", async () => {
  const { db, enroll, challenge, verify, key, request } = passkeySetup();
  await enroll();
  const { challenge: c, cookie } = await challenge(GLOBEX);
  const res = await verify(GLOBEX, cookie, key.assertion(c, `http://${GLOBEX}`));
  assert.equal(res.status, 200, await res.clone().text());
  assert.equal(db.session.at(-1)!.tenantId, "t_globex");
  assert.equal(await codeOf(await request(ACME, "/get-session", { cookie: cookiesOf(res) })), "CROSS_TENANT_SESSION");
});

test("passkey: a challenge issued on one tenant cannot be answered on another", async () => {
  const { db, enroll, challenge, verify, key } = passkeySetup();
  await enroll();
  const sessions = db.session.length;
  const { challenge: c, cookie } = await challenge(ACME);

  // A valid assertion, for an origin the relying party covers, sent to the other tenant.
  const other = await verify(GLOBEX, cookie, key.assertion(c, `http://${GLOBEX}`));
  assert.equal(other.status, 403, await other.clone().text());
  assert.equal(await codeOf(other), "VERIFICATION_TENANT_MISMATCH");
  assert.equal(db.session.length, sessions);

  const own = await verify(ACME, cookie, key.assertion(c, `http://${ACME}`));
  assert.equal(own.status, 200, await own.clone().text());
});

test("passkey: canAccessTenant refuses the session", async () => {
  const { db, enroll, challenge, verify, key } = passkeySetup({ canAccessTenant: (_user, tenant) => tenant.slug === "acme" });
  await enroll();
  const sessions = db.session.length;
  const { challenge: c, cookie } = await challenge(GLOBEX);
  const res = await verify(GLOBEX, cookie, key.assertion(c, `http://${GLOBEX}`));
  assert.equal(await codeOf(res), "TENANT_ACCESS_DENIED");
  assert.equal(db.session.length, sessions);
});

test("passkey: the relying party id decides which hosts a passkey works on", async () => {
  // rpID "example.com" covers every tenant subdomain: one credential, all tenants.
  // A single instance has one rpID; pinning it to a tenant's host leaves the others without passkeys.
  const { enroll, challenge, verify, key } = passkeySetup({}, ACME);
  await enroll();
  const { challenge: c, cookie } = await challenge(GLOBEX);
  const res = await verify(GLOBEX, cookie, key.assertion(c, `http://${GLOBEX}`, GLOBEX));
  assert.equal(res.status, 400, "a browser on globex hashes globex as the rp id, which the instance does not expect");
});

test("passkey: createTenantAuth gives each tenant its own rpID and credentials", async () => {
  const dbs = { acme: db(), globex: db() };
  const key = authenticator();
  const tenantAuth = createTenantAuth({
    baseDomain: "example.com",
    getTenant: (slug) => TENANTS[slug] ?? null,
    createAuth: (tenant) => ({
      secret: "test-secret-0123456789-abcdefghijklmnop",
      baseURL: `http://${tenant.slug}.example.com`,
      trustedOrigins,
      database: memoryAdapter(dbs[tenant.slug as "acme" | "globex"]),
      emailAndPassword: { enabled: true },
      logger: { disabled: true },
      plugins: [passkey({ rpID: `${tenant.slug}.example.com`, rpName: tenant.slug })],
    }),
  });
  const call = (host: string, path: string, init: { body?: unknown; cookie?: string } = {}) =>
    tenantAuth.handler(
      new Request(`http://${host}/api/auth${path}`, {
        method: init.body === undefined ? "GET" : "POST",
        body: init.body === undefined ? undefined : JSON.stringify(init.body),
        headers: { host, origin: `http://${host}`, "content-type": "application/json", ...(init.cookie ? { cookie: init.cookie } : {}) },
      }),
    );
  for (const slug of ["acme", "globex"] as const) {
    const host = `${slug}.example.com`;
    await call(host, "/sign-up/email", { body: { email: "user@example.com", password: "correct-horse-battery", name: "User" } });
    dbs[slug].passkey!.push(key.row(dbs[slug].user![0]!.id as string));
  }

  // The same credential id is enrolled on both; each host answers only for its own rp id.
  for (const [host, rpID, status] of [
    [ACME, ACME, 200],
    [ACME, GLOBEX, 400],
    [GLOBEX, GLOBEX, 200],
    [GLOBEX, ACME, 400],
  ] as const) {
    const options = await call(host, "/passkey/generate-authenticate-options");
    const { challenge } = (await options.json()) as { challenge: string };
    const res = await call(host, "/passkey/verify-authentication", {
      cookie: cookiesOf(options),
      body: { response: key.assertion(challenge, `http://${host}`, rpID) },
    });
    assert.equal(res.status, status, `${host} with rp id ${rpID}: ${await res.clone().text()}`);
  }
});

// ---------------------------------------------------------------- generic OAuth

const IDP = "http://idp.test";
const realFetch = globalThis.fetch;
afterEach(() => {
  globalThis.fetch = realFetch;
});

/** Stand in for the identity provider's token and userinfo endpoints. */
function stubIdp(user: Record<string, unknown>) {
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input instanceof Request ? input.url : input);
    if (url.startsWith(`${IDP}/token`)) return Response.json({ access_token: "at", token_type: "Bearer" });
    if (url.startsWith(`${IDP}/userinfo`)) return Response.json(user);
    return realFetch(input, init);
  }) as typeof fetch;
}

function oauthSetup(overrides: Partial<MultiTenantOptions> = {}) {
  const ctx = setup(overrides, {
    trustedOrigins,
    plugins: [
      genericOAuth({
        config: [
          {
            providerId: "mock",
            clientId: "client",
            clientSecret: "secret",
            authorizationUrl: `${IDP}/authorize`,
            tokenUrl: `${IDP}/token`,
            userInfoUrl: `${IDP}/userinfo`,
            scopes: ["email"],
            pkce: false,
          },
        ],
      }),
    ],
  });
  stubIdp({ id: "idp-user-1", email: "user@example.com", name: "User", emailVerified: true });
  /** Start the flow on `host`: the state and the cookies the browser would hold. */
  const start = async (host: string) => {
    const res = await ctx.request(host, "/sign-in/social", {
      method: "POST",
      body: { provider: "mock", callbackURL: `http://${host}/dashboard`, errorCallbackURL: `http://${host}/error` },
    });
    assert.equal(res.status, 200, await res.clone().text());
    const { url } = (await res.json()) as { url: string };
    return { state: new URL(url).searchParams.get("state")!, cookie: cookiesOf(res) };
  };
  const callback = (host: string, state: string, cookie: string) =>
    ctx.request(host, `/callback/mock?code=abc&state=${state}`, { cookie });
  return { ...ctx, start, callback };
}

test("genericOAuth: a session is stamped with the tenant of the callback and refused on another", async () => {
  const { db, start, callback, request } = oauthSetup();
  const { state, cookie } = await start(GLOBEX);
  const res = await callback(GLOBEX, state, cookie);
  assert.equal(res.status, 302, await res.clone().text());
  assert.equal(res.headers.get("location"), `http://${GLOBEX}/dashboard`);
  assert.equal(db.session.at(-1)!.tenantId, "t_globex");
  assert.equal(await codeOf(await request(ACME, "/get-session", { cookie: cookiesOf(res) })), "CROSS_TENANT_SESSION");
});

test("genericOAuth: state started on one tenant is refused on another's callback", async () => {
  const { db, start, callback } = oauthSetup();
  const { state, cookie } = await start(ACME);

  // The state cookie is host-only; a client that replays it on another host still meets the stamp.
  const other = await callback(GLOBEX, state, cookie);
  assert.equal(db.session.length, 0, "no session on the other tenant");
  assert.equal(db.user.length, 0, "no account on the other tenant");
  // Better Auth turns any error in a callback into a redirect to its error page.
  assert.equal(other.status, 302);
  assert.match(other.headers.get("location") ?? "", /\/error\?error=/);

  // The row was not consumed, so the tenant that started the flow can finish it.
  const own = await callback(ACME, state, cookie);
  assert.equal(own.status, 302);
  assert.equal(own.headers.get("location"), `http://${ACME}/dashboard`);
  assert.equal(db.session.at(-1)!.tenantId, "t_acme");
});

test("genericOAuth: canAccessTenant refuses the session", async () => {
  const { db, start, callback } = oauthSetup({ canAccessTenant: () => false });
  const { state, cookie } = await start(ACME);
  const res = await callback(ACME, state, cookie);
  assert.equal(db.session.length, 0);
  assert.doesNotMatch(res.headers.get("location") ?? "", /dashboard/);
});

// ---------------------------------------------------------------- One Tap

const GOOGLE_CLIENT = "google-client.apps.example";

/** A Google ID token signed by a key that the stubbed certificate endpoint publishes. */
async function googleIdToken(audience = GOOGLE_CLIENT) {
  const { privateKey, publicKey } = generateKeyPairSync("rsa", { modulusLength: 2048 });
  const jwk = { ...(await exportJWK(publicKey)), kid: "test-key", alg: "RS256", use: "sig" };
  const realFetchRef = globalThis.fetch;
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input instanceof Request ? input.url : input);
    if (url.startsWith("https://www.googleapis.com/oauth2/v3/certs")) return Response.json({ keys: [jwk] });
    return realFetchRef(input, init);
  }) as typeof fetch;
  return new SignJWT({ email: "user@example.com", email_verified: true, name: "User" })
    .setProtectedHeader({ alg: "RS256", kid: "test-key" })
    .setIssuer("https://accounts.google.com")
    .setAudience(audience)
    .setSubject("google-sub-1")
    .setIssuedAt()
    .setExpirationTime("5m")
    .sign(privateKey);
}

const oneTapSetup = (overrides: Partial<MultiTenantOptions> = {}) =>
  setup(overrides, { trustedOrigins, plugins: [oneTap({ clientId: GOOGLE_CLIENT })] });

test("oneTap: a session is stamped with the tenant and refused on another", async () => {
  const { db, request } = oneTapSetup();
  const res = await request(ACME, "/one-tap/callback", { method: "POST", body: { idToken: await googleIdToken() } });
  assert.equal(res.status, 200, await res.clone().text());
  assert.equal(db.session[0]!.tenantId, "t_acme");
  assert.equal(await codeOf(await request(GLOBEX, "/get-session", { cookie: cookiesOf(res) })), "CROSS_TENANT_SESSION");
});

test("oneTap: an ID token is a bearer proof from Google and works on any tenant of the instance", async () => {
  // Nothing in the token names the page or the tenant, only the client id (audience).
  const { db, request } = oneTapSetup();
  const idToken = await googleIdToken();
  assert.equal((await request(ACME, "/one-tap/callback", { method: "POST", body: { idToken } })).status, 200);
  assert.equal((await request(GLOBEX, "/one-tap/callback", { method: "POST", body: { idToken } })).status, 200);
  assert.deepEqual(db.session.map((s) => s.tenantId), ["t_acme", "t_globex"]);
});

test("oneTap: canAccessTenant refuses the session", async () => {
  const { db, request } = oneTapSetup({ canAccessTenant: () => false });
  const res = await request(ACME, "/one-tap/callback", { method: "POST", body: { idToken: await googleIdToken() } });
  assert.equal(await codeOf(res), "TENANT_ACCESS_DENIED");
  assert.equal(db.session.length, 0);
});

test("oneTap: createTenantAuth gives each tenant its own Google client id", async () => {
  const dbs = { acme: db(), globex: db() };
  const tenantAuth = createTenantAuth({
    baseDomain: "example.com",
    getTenant: (slug) => TENANTS[slug] ?? null,
    createAuth: (tenant) => ({
      secret: "test-secret-0123456789-abcdefghijklmnop",
      baseURL: `http://${tenant.slug}.example.com`,
      trustedOrigins,
      database: memoryAdapter(dbs[tenant.slug as "acme" | "globex"]),
      logger: { disabled: true },
      plugins: [oneTap({ clientId: `${tenant.slug}-client` })],
    }),
  });
  const call = (host: string, idToken: string) =>
    tenantAuth.handler(
      new Request(`http://${host}/api/auth/one-tap/callback`, {
        method: "POST",
        body: JSON.stringify({ idToken }),
        headers: { host, origin: `http://${host}`, "content-type": "application/json" },
      }),
    );
  const forAcme = await googleIdToken("acme-client");
  assert.equal((await call(ACME, forAcme)).status, 200);
  const refused = await call(GLOBEX, forAcme);
  assert.equal(refused.status, 400, "a token minted for acme's client id is not accepted for globex");
  assert.equal(dbs.globex.session!.length, 0);
});

function db() {
  const models = ["user", "session", "account", "verification", "passkey", "walletAddress", "twoFactor"];
  return Object.fromEntries(models.map((m) => [m, [] as Record<string, unknown>[]])) as Record<string, Record<string, unknown>[]>;
}
