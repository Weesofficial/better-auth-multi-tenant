import { test, afterEach } from "node:test";
import assert from "node:assert/strict";
import { sso } from "@better-auth/sso";
import { organization } from "better-auth/plugins";
import type { MultiTenantOptions, Tenant } from "../src/index.js";
import { codeOf, setup } from "./helpers.js";

/**
 * `@better-auth/sso` with the organization bridge (or tenant domains): SSO on
 * a tenant's host only uses that tenant's providers, and a callback that lands
 * on another tenant's host is refused.
 */

const ORG_OF: Record<string, string> = { acme: "org_acme", globex: "org_globex" };
const getOrganizationId = (tenant: Tenant) => ORG_OF[tenant.slug];
const DOMAINS_OF: Record<string, string[]> = { acme: ["acme.io"], globex: ["globex.io"] };
const getSSODomains = (tenant: Tenant) => DOMAINS_OF[tenant.slug];

const IDP = "https://idp.example.org";

const oidcConfig = (clientId: string) =>
  JSON.stringify({
    issuer: IDP,
    clientId,
    clientSecret: "secret",
    authorizationEndpoint: `${IDP}/authorize`,
    tokenEndpoint: `${IDP}/token`,
    userInfoEndpoint: `${IDP}/userinfo`,
    jwksEndpoint: `${IDP}/jwks`,
    discoveryEndpoint: `${IDP}/.well-known/openid-configuration`,
    pkce: false,
  });

const provider = (providerId: string, extra: Record<string, unknown>) => ({
  id: `row_${providerId}`,
  providerId,
  issuer: IDP,
  domain: "",
  userId: "admin",
  oidcConfig: oidcConfig(`client_${providerId}`),
  samlConfig: null,
  ...extra,
});

function ssoSetup(overrides: Partial<MultiTenantOptions> = { getOrganizationId }, ssoOptions: Parameters<typeof sso>[0] = {}) {
  const ctx = setup(overrides, {
    trustedOrigins: ["http://*.example.com", IDP],
    plugins: [organization(), sso(ssoOptions)],
  });
  const now = new Date();
  ctx.db.organization!.push(
    { id: "org_acme", name: "Acme", slug: "acme", createdAt: now },
    { id: "org_globex", name: "Globex", slug: "globex", createdAt: now },
  );
  ctx.db.ssoProvider!.push(
    // Globex first: a lookup by a shared domain would find it before Acme's.
    provider("globex-idp", { organizationId: "org_globex", domain: "shared.com" }),
    provider("acme-idp", { organizationId: "org_acme", domain: "shared.com" }),
    provider("acme-only", { organizationId: "org_acme", domain: "acme.com" }),
    provider("acme-by-domain", { domain: "acme.io" }),
    provider("globex-by-domain", { domain: "globex.io" }),
    provider("mixed-domain", { domain: "acme.io,evil.com" }),
  );
  const signIn = (host: string, body: Record<string, unknown>) =>
    ctx.request(host, "/sign-in/sso", { method: "POST", body: { callbackURL: "/", ...body } });
  return { ...ctx, signIn };
}

const refused = async (res: Response) => {
  assert.equal(res.status, 403, await res.clone().text());
  assert.equal(await codeOf(res), "SSO_PROVIDER_TENANT_MISMATCH");
};

const clientIdOf = async (res: Response) => {
  assert.equal(res.status, 200, await res.clone().text());
  const { url } = (await res.json()) as { url: string };
  return new URL(url).searchParams.get("client_id");
};

test("sign-in uses a provider of the tenant's organization", async () => {
  const { signIn } = ssoSetup();
  assert.equal(await clientIdOf(await signIn("acme.example.com", { providerId: "acme-idp" })), "client_acme-idp");
});

test("sign-in refuses a provider of another tenant's organization", async () => {
  const { signIn } = ssoSetup();
  await refused(await signIn("acme.example.com", { providerId: "globex-idp" }));
  await refused(await signIn("acme.example.com", { organizationSlug: "globex" }));
  await refused(await signIn("acme.example.com", { email: "who@unknown.org" }));
  await refused(await signIn("acme.example.com", { providerId: "no-such-provider" }));
});

test("sign-in by email or organization picks the tenant's own provider, not the first match", async () => {
  const { signIn } = ssoSetup();
  // Globex's provider has the same domain and comes first in the table.
  assert.equal(await clientIdOf(await signIn("acme.example.com", { email: "me@shared.com" })), "client_acme-idp");
  assert.equal(await clientIdOf(await signIn("acme.example.com", { domain: "shared.com" })), "client_acme-idp");
  assert.equal(await clientIdOf(await signIn("globex.example.com", { email: "me@shared.com" })), "client_globex-idp");
  assert.equal(await clientIdOf(await signIn("acme.example.com", { organizationSlug: "acme" })), "client_acme-idp");
});

test("providers from the plugin's defaultSSO option belong to no tenant", async () => {
  const { signIn } = ssoSetup(
    { getOrganizationId },
    {
      defaultSSO: [
        {
          providerId: "default-idp",
          domain: "default.com",
          oidcConfig: {
            issuer: IDP,
            clientId: "client_default",
            clientSecret: "secret",
            authorizationEndpoint: `${IDP}/authorize`,
            tokenEndpoint: `${IDP}/token`,
            discoveryEndpoint: `${IDP}/.well-known/openid-configuration`,
            pkce: false,
          },
        },
      ],
    },
  );
  await refused(await signIn("acme.example.com", { providerId: "default-idp" }));
  await refused(await signIn("acme.example.com", { email: "me@default.com" }));
});

test("unlinked providers belong to the tenant that owns their domain", async () => {
  const { signIn } = ssoSetup({ getSSODomains });
  assert.equal(await clientIdOf(await signIn("acme.example.com", { email: "me@acme.io" })), "client_acme-by-domain");
  assert.equal(await clientIdOf(await signIn("acme.example.com", { email: "me@team.acme.io" })), "client_acme-by-domain");
  await refused(await signIn("acme.example.com", { email: "me@globex.io" }));
  await refused(await signIn("acme.example.com", { providerId: "globex-by-domain" }));
  await refused(await signIn("globex.example.com", { providerId: "acme-by-domain" }));
  // Every domain of the provider has to be the tenant's.
  await refused(await signIn("acme.example.com", { providerId: "mixed-domain" }));
  // Linked to an organization the domain mode does not know.
  await refused(await signIn("acme.example.com", { providerId: "acme-idp" }));
});

test("without the options SSO behaves as usual", async () => {
  const { signIn } = ssoSetup({});
  assert.equal(await clientIdOf(await signIn("acme.example.com", { providerId: "globex-idp" })), "client_globex-idp");
});

test("provider management only reaches the tenant's providers", async () => {
  // The domain verification routes only exist when the option is on.
  const { request, signUp } = ssoSetup({ getOrganizationId }, { domainVerification: { enabled: true } });
  const cookie = await signUp("acme.example.com");
  const get =(id: string) => request("acme.example.com", `/sso/get-provider?providerId=${id}`, { cookie });
  const post = (path: string, body: Record<string, unknown>) => request("acme.example.com", path, { method: "POST", body, cookie });

  await refused(await get("globex-idp"));
  await refused(await post("/sso/update-provider", { providerId: "globex-idp", issuer: IDP }));
  await refused(await post("/sso/delete-provider", { providerId: "globex-idp" }));
  await refused(await post("/sso/request-domain-verification", { providerId: "globex-idp" }));
  await refused(await post("/sso/verify-domain", { providerId: "globex-idp" }));
  // Own provider: passes the tenant check (the plugin's own admin check answers).
  assert.notEqual(await codeOf(await get("acme-idp")), "SSO_PROVIDER_TENANT_MISMATCH");
});

test("a domain-owned provider's domain cannot move outside the tenant", async () => {
  const { db, request, signUp } = ssoSetup({ getSSODomains });
  const cookie = await signUp("acme.example.com");
  db.ssoProvider!.find((p) => p.providerId === "acme-by-domain")!.userId = db.user![0]!.id;
  const update = (domain: string) =>
    request("acme.example.com", "/sso/update-provider", { method: "POST", body: { providerId: "acme-by-domain", domain }, cookie });
  await refused(await update("globex.io"));
  const ok = await update("sales.acme.io");
  assert.equal(ok.status, 200, await ok.clone().text());
});

test("registration is linked to the tenant's organization", async () => {
  const { db, request, signUp } = ssoSetup();
  const cookie = await signUp("acme.example.com");
  const userId = db.user![0]!.id as string;
  const now = new Date();
  db.member!.push(
    { id: "m_acme", organizationId: "org_acme", userId, role: "owner", createdAt: now },
    { id: "m_globex", organizationId: "org_globex", userId, role: "owner", createdAt: now },
  );
  const register = (body: Record<string, unknown>) =>
    request("acme.example.com", "/sso/register", {
      method: "POST",
      cookie,
      body: {
        issuer: IDP,
        domain: "new.example.org",
        oidcConfig: {
          clientId: "new-client",
          clientSecret: "secret",
          skipDiscovery: true,
          authorizationEndpoint: `${IDP}/authorize`,
          tokenEndpoint: `${IDP}/token`,
          jwksEndpoint: `${IDP}/jwks`,
        },
        ...body,
      },
    });

  await refused(await register({ providerId: "new-globex", organizationId: "org_globex" }));
  assert.equal(db.ssoProvider!.some((p) => p.providerId === "new-globex"), false);

  // Left out, the organization is filled in.
  const res = await register({ providerId: "new-acme" });
  assert.equal(res.status, 200, await res.clone().text());
  assert.equal(db.ssoProvider!.find((p) => p.providerId === "new-acme")!.organizationId, "org_acme");
});

test("registration in domain mode needs a domain the tenant owns", async () => {
  const { request, signUp } = ssoSetup({ getSSODomains });
  const cookie = await signUp("acme.example.com");
  const register = (domain: string) =>
    request("acme.example.com", "/sso/register", {
      method: "POST",
      cookie,
      body: {
        providerId: `new-${domain}`,
        issuer: IDP,
        domain,
        oidcConfig: {
          clientId: "new-client",
          clientSecret: "secret",
          skipDiscovery: true,
          authorizationEndpoint: `${IDP}/authorize`,
          tokenEndpoint: `${IDP}/token`,
          jwksEndpoint: `${IDP}/jwks`,
        },
      },
    });
  await refused(await register("globex.io"));
  await refused(await register("acme.io,globex.io"));
  const res = await register("acme.io");
  assert.equal(res.status, 200, await res.clone().text());
});

// --- callbacks -------------------------------------------------------------

const realFetch = globalThis.fetch;
afterEach(() => {
  globalThis.fetch = realFetch;
});

/** Stand in for the identity provider's token and userinfo endpoints. */
function stubIdp(email: string) {
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = new URL(typeof input === "string" || input instanceof URL ? input : input.url);
    if (url.origin !== IDP) return realFetch(input, init);
    if (url.pathname === "/token") return Response.json({ access_token: "at", token_type: "Bearer" });
    if (url.pathname === "/userinfo") return Response.json({ sub: "idp-user-1", email, name: "Sso User", email_verified: true });
    return new Response("not found", { status: 404 });
  }) as typeof fetch;
}

/** Start a flow on `host` and return what the identity provider would send back. */
async function startFlow(ctx: ReturnType<typeof ssoSetup>, host: string, providerId: string) {
  const res = await ctx.signIn(host, { providerId });
  assert.equal(res.status, 200, await res.clone().text());
  const { url } = (await res.json()) as { url: string };
  const state = new URL(url).searchParams.get("state");
  assert.ok(state, "expected a state");
  const cookie = res.headers.getSetCookie().map((c) => c.split(";")[0]).join("; ");
  return { state, cookie };
}

const callback = (ctx: ReturnType<typeof ssoSetup>, host: string, providerId: string, flow: { state: string; cookie: string }) =>
  ctx.request(host, `/sso/callback/${providerId}?code=abc&state=${flow.state}`, { cookie: flow.cookie });

test("a callback creates a session stamped with the tenant of its host", async () => {
  const ctx = ssoSetup();
  stubIdp("sso@acme.com");
  const flow = await startFlow(ctx, "acme.example.com", "acme-idp");
  const res = await callback(ctx, "acme.example.com", "acme-idp", flow);
  assert.equal(res.status, 302, await res.clone().text());
  assert.match(res.headers.get("location") ?? "", /^\/(\?|$)/);
  assert.equal(ctx.db.session.length, 1);
  assert.equal(ctx.db.session[0]!.tenantId, "t_acme");
  assert.equal(ctx.db.session[0]!.activeOrganizationId, "org_acme");
});

test("a callback that lands on another tenant's host is refused", async () => {
  const ctx = ssoSetup();
  stubIdp("sso@acme.com");
  const flow = await startFlow(ctx, "acme.example.com", "acme-idp");
  await refused(await callback(ctx, "globex.example.com", "acme-idp", flow));
  assert.equal(ctx.db.session.length, 0);
  assert.equal(ctx.db.user!.length, 0);
});

test("a callback for a provider of another tenant is refused even with a valid state", async () => {
  const ctx = ssoSetup();
  stubIdp("sso@globex.com");
  const flow = await startFlow(ctx, "globex.example.com", "globex-idp");
  await refused(await callback(ctx, "acme.example.com", "globex-idp", flow));
  assert.equal(ctx.db.session.length, 0);
});

test("a callback for a provider that is not in the table is refused on a tenant's host", async () => {
  const ctx = ssoSetup();
  await refused(await ctx.request("acme.example.com", "/sso/callback/default-idp?code=abc&state=x"));
});

test("the shared callback cannot be checked, so a tenant's host refuses it", async () => {
  const ctx = ssoSetup({ getOrganizationId }, { redirectURI: "http://acme.example.com/api/auth/sso/callback" });
  await refused(await ctx.request("acme.example.com", "/sso/callback?code=abc&state=x"));
});
