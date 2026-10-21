import { test } from "node:test";
import assert from "node:assert/strict";
import { sso } from "@better-auth/sso";
import { organization } from "better-auth/plugins";
import { createTenantAuth, multiTenant, type MultiTenantOptions, type Tenant } from "../src/index.js";
import { TENANTS, codeOf, setup } from "./helpers.js";

/** The `teams` and `sso` options: explicit on or off, over defaults that follow the mapping options. */

const ORG_OF: Record<string, string> = { acme: "org_acme", globex: "org_globex" };
const getOrganizationId = (tenant: Tenant) => ORG_OF[tenant.slug];
const DOMAINS_OF: Record<string, string[]> = { acme: ["acme.io"], globex: ["globex.io"] };
const getSSODomains = (tenant: Tenant) => DOMAINS_OF[tenant.slug];
const base = { baseDomain: "example.com", getTenant: (slug: string) => TENANTS[slug] ?? null };

function teamSetup(overrides: Partial<MultiTenantOptions>) {
  const ctx = setup({ getOrganizationId, ...overrides }, { plugins: [organization({ teams: { enabled: true } })] });
  const now = new Date();
  ctx.db.organization!.push(
    { id: "org_acme", name: "Acme", slug: "acme", createdAt: now },
    { id: "org_globex", name: "Globex", slug: "globex", createdAt: now },
  );
  ctx.db.team!.push(
    { id: "team_acme", name: "Acme Eng", organizationId: "org_acme", createdAt: now, updatedAt: now },
    { id: "team_globex", name: "Globex Eng", organizationId: "org_globex", createdAt: now, updatedAt: now },
  );
  const signUpMember = async () => {
    const cookie = await ctx.signUp("acme.example.com");
    const userId = ctx.db.user![0]!.id as string;
    ctx.db.member!.push(
      { id: "m_acme", organizationId: "org_acme", userId, role: "owner", createdAt: now },
      { id: "m_globex", organizationId: "org_globex", userId, role: "owner", createdAt: now },
    );
    ctx.db.teamMember!.push(
      { id: "tm_acme", teamId: "team_acme", userId, createdAt: now },
      { id: "tm_globex", teamId: "team_globex", userId, createdAt: now },
    );
    return cookie;
  };
  const get = (cookie: string, path: string) => ctx.request("acme.example.com", path, { cookie });
  const post = (cookie: string, path: string, body: Record<string, unknown>) =>
    ctx.request("acme.example.com", path, { method: "POST", body, cookie });
  return { ...ctx, signUpMember, get, post };
}

const teamIds = async (res: Response) => ((await res.json()) as { id: string }[]).map((t) => t.id).sort();

test("teams scoping follows getOrganizationId by default and with teams: true", async () => {
  for (const overrides of [{}, { teams: true }]) {
    const { signUpMember, get, post } = teamSetup(overrides);
    const cookie = await signUpMember();
    const res = await get(cookie, "/organization/list-team-members?teamId=team_globex");
    assert.equal(res.status, 403);
    assert.equal(await codeOf(res), "TEAM_TENANT_MISMATCH");
    assert.deepEqual(await teamIds(await get(cookie, "/organization/list-user-teams")), ["team_acme"]);
    assert.equal(await codeOf(await post(cookie, "/organization/set-active-team", { teamId: "team_globex" })), "TEAM_TENANT_MISMATCH");
  }
});

test("teams: false leaves teams unscoped", async () => {
  const { signUpMember, get, post } = teamSetup({ teams: false });
  const cookie = await signUpMember();
  const members = await get(cookie, "/organization/list-team-members?teamId=team_globex");
  assert.equal(members.status, 200, await members.clone().text());
  assert.deepEqual(await teamIds(await get(cookie, "/organization/list-user-teams")), ["team_acme", "team_globex"]);
  const active = await post(cookie, "/organization/set-active-team", { teamId: "team_globex" });
  assert.notEqual(await codeOf(active), "TEAM_TENANT_MISMATCH");
});

test("teams: false keeps the organization checks", async () => {
  const { signUpMember, post } = teamSetup({ teams: false });
  const cookie = await signUpMember();
  const res = await post(cookie, "/organization/create-team", { name: "Ops", organizationId: "org_globex" });
  assert.equal(res.status, 403);
  assert.equal(await codeOf(res), "ORGANIZATION_TENANT_MISMATCH");
});

test("teams: true needs getOrganizationId", () => {
  assert.throws(() => multiTenant({ ...base, teams: true }), /teams: true needs getOrganizationId/);
  assert.throws(() => multiTenant({ ...base, teams: true, getSSODomains }), /teams: true needs getOrganizationId/);
  assert.throws(
    () => createTenantAuth({ ...base, teams: true, createAuth: () => ({}) }),
    /teams: true needs getOrganizationId/,
  );
});

const IDP = "https://idp.example.org";

const provider = (providerId: string, extra: Record<string, unknown>) => ({
  id: `row_${providerId}`,
  providerId,
  issuer: IDP,
  domain: "",
  userId: "admin",
  oidcConfig: JSON.stringify({
    issuer: IDP,
    clientId: `client_${providerId}`,
    clientSecret: "secret",
    authorizationEndpoint: `${IDP}/authorize`,
    tokenEndpoint: `${IDP}/token`,
    userInfoEndpoint: `${IDP}/userinfo`,
    jwksEndpoint: `${IDP}/jwks`,
    discoveryEndpoint: `${IDP}/.well-known/openid-configuration`,
    pkce: false,
  }),
  samlConfig: null,
  ...extra,
});

function ssoSetup(overrides: Partial<MultiTenantOptions>) {
  const ctx = setup(overrides, { trustedOrigins: ["http://*.example.com", IDP], plugins: [organization(), sso()] });
  const now = new Date();
  ctx.db.organization!.push(
    { id: "org_acme", name: "Acme", slug: "acme", createdAt: now },
    { id: "org_globex", name: "Globex", slug: "globex", createdAt: now },
  );
  ctx.db.ssoProvider!.push(
    provider("acme-idp", { organizationId: "org_acme", domain: "acme.com" }),
    provider("globex-idp", { organizationId: "org_globex", domain: "globex.com" }),
  );
  const signIn = (providerId: string) =>
    ctx.request("acme.example.com", "/sign-in/sso", { method: "POST", body: { callbackURL: "/", providerId } });
  return { ...ctx, signIn };
}

const clientIdOf = async (res: Response) => {
  assert.equal(res.status, 200, await res.clone().text());
  return new URL(((await res.json()) as { url: string }).url).searchParams.get("client_id");
};

test("sso scoping follows the mapping options by default and with sso: true", async () => {
  for (const overrides of [{ getOrganizationId }, { getSSODomains }, { getOrganizationId, sso: true }]) {
    const { signIn } = ssoSetup(overrides);
    const res = await signIn("globex-idp");
    assert.equal(res.status, 403, await res.clone().text());
    assert.equal(await codeOf(res), "SSO_PROVIDER_TENANT_MISMATCH");
  }
});

test("sso: false leaves SSO unscoped even with a mapping", async () => {
  const { signIn } = ssoSetup({ getOrganizationId, sso: false });
  assert.equal(await clientIdOf(await signIn("globex-idp")), "client_globex-idp");
  assert.equal(await clientIdOf(await signIn("acme-idp")), "client_acme-idp");
});

test("sso: false keeps the organization checks", async () => {
  const { request, signUp } = ssoSetup({ getOrganizationId, sso: false });
  const cookie = await signUp("acme.example.com");
  const res = await request("acme.example.com", "/organization/get-full-organization?organizationId=org_globex", { cookie });
  assert.equal(res.status, 403);
  assert.equal(await codeOf(res), "ORGANIZATION_TENANT_MISMATCH");
});

test("sso: true needs getOrganizationId or getSSODomains", () => {
  assert.throws(() => multiTenant({ ...base, sso: true }), /sso: true needs getOrganizationId or getSSODomains/);
  assert.throws(
    () => createTenantAuth({ ...base, sso: true, createAuth: () => ({}) }),
    /sso: true needs getOrganizationId or getSSODomains/,
  );
  assert.doesNotThrow(() => multiTenant({ ...base, sso: true, getSSODomains }));
});

test("sso: false cannot be combined with ssoRequireTenantMapping", () => {
  assert.throws(() => multiTenant({ ...base, sso: false, ssoRequireTenantMapping: true }), /contradicts ssoRequireTenantMapping/);
  assert.doesNotThrow(() => multiTenant({ ...base, sso: false }));
});
