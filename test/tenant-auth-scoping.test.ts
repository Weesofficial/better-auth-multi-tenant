import { test } from "node:test";
import assert from "node:assert/strict";
import { sso } from "@better-auth/sso";
import { memoryAdapter } from "better-auth/adapters/memory";
import { organization } from "better-auth/plugins";
import { createTenantAuth, type Tenant } from "../src/index.js";
import { codeOf, TENANTS } from "./helpers.js";

/**
 * Database-per-tenant together with organization teams and SSO: each tenant's
 * database holds its own organization, team and provider, and none of them work
 * from another tenant's host.
 */

type Rows = Record<string, unknown>[];
const MODELS = ["user", "session", "account", "verification", "organization", "member", "invitation", "team", "teamMember", "ssoProvider"];
const newDb = () => Object.fromEntries(MODELS.map((m) => [m, [] as Rows])) as Record<string, Rows>;

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
const provider = (slug: string) => ({
  id: `row_${slug}-idp`,
  providerId: `${slug}-idp`,
  issuer: IDP,
  domain: `${slug}.com`,
  organizationId: `org_${slug}`,
  userId: "admin",
  oidcConfig: oidcConfig(`client_${slug}-idp`),
  samlConfig: null,
});

const now = new Date();
const organizationRow = (slug: string) => ({ id: `org_${slug}`, name: slug, slug, createdAt: now });
const teamRow = (slug: string) => ({ id: `team_${slug}`, name: `${slug} Eng`, organizationId: `org_${slug}`, createdAt: now, updatedAt: now });

function setup() {
  const dbs: Record<string, Record<string, Rows>> = { acme: newDb(), globex: newDb() };
  // Each database holds its own tenant's organization, team and provider.
  for (const slug of ["acme", "globex"]) {
    dbs[slug]!.organization!.push(organizationRow(slug));
    dbs[slug]!.team!.push(teamRow(slug));
    dbs[slug]!.ssoProvider!.push(provider(slug));
  }
  const tenantAuth = createTenantAuth({
    baseDomain: "example.com",
    getTenant: (slug) => TENANTS[slug] ?? null,
    getOrganizationId: (tenant: Tenant) => `org_${tenant.slug}`,
    createAuth: (tenant) => ({
      secret: "test-secret-0123456789-abcdefghijklmnop",
      baseURL: "http://acme.example.com",
      trustedOrigins: ["http://*.example.com", IDP],
      database: memoryAdapter(dbs[tenant.slug]!),
      emailAndPassword: { enabled: true },
      logger: { disabled: true },
      plugins: [organization({ teams: { enabled: true } }), sso()],
    }),
  });

  const request = (host: string, path: string, init: { body?: unknown; cookie?: string; method?: string } = {}) =>
    tenantAuth.handler(
      new Request(`http://${host}/api/auth${path}`, {
        method: init.method ?? (init.body === undefined ? "GET" : "POST"),
        body: init.body === undefined ? undefined : JSON.stringify(init.body),
        headers: {
          host,
          origin: `http://${host}`,
          "content-type": "application/json",
          ...(init.cookie ? { cookie: init.cookie } : {}),
        },
      }),
    );

  /** Sign up on `slug`'s host and make the user an owner of that tenant's organization and a member of its team. */
  const signUpOwner = async (slug: string) => {
    const res = await request(`${slug}.example.com`, "/sign-up/email", {
      body: { email: "user@example.com", password: "correct-horse-battery", name: "User" },
    });
    assert.equal(res.status, 200, await res.clone().text());
    const userId = dbs[slug]!.user![0]!.id as string;
    dbs[slug]!.member!.push({ id: `m_${slug}`, organizationId: `org_${slug}`, userId, role: "owner", createdAt: now });
    dbs[slug]!.teamMember!.push({ id: `tm_${slug}`, teamId: `team_${slug}`, userId, createdAt: now });
    return res.headers.get("set-cookie")!.split(";")[0]!;
  };

  const signIn = (host: string, providerId: string) =>
    request(host, "/sign-in/sso", { body: { callbackURL: "/", providerId } });

  return { dbs, request, signUpOwner, signIn };
}

const clientIdOf = async (res: Response) => {
  assert.equal(res.status, 200, await res.clone().text());
  return new URL(((await res.json()) as { url: string }).url).searchParams.get("client_id");
};

const refused = async (res: Response, code: string) => {
  assert.equal(res.status, 403, await res.clone().text());
  assert.equal(await codeOf(res), code);
};

test("each tenant's team works on its own host", async () => {
  const { request, signUpOwner } = setup();
  for (const slug of ["acme", "globex"]) {
    const host = `${slug}.example.com`;
    const cookie = await signUpOwner(slug);

    const list = await request(host, "/organization/list-teams", { cookie });
    assert.equal(list.status, 200, await list.clone().text());
    assert.deepEqual(((await list.json()) as { id: string }[]).map((t) => t.id), [`team_${slug}`]);

    const active = await request(host, "/organization/set-active-team", { cookie, body: { teamId: `team_${slug}` } });
    assert.equal(active.status, 200, await active.clone().text());

    const created = await request(host, "/organization/create-team", { cookie, body: { name: "Ops" } });
    assert.equal(created.status, 200, await created.clone().text());
  }
});

test("each tenant's SSO provider works on its own host", async () => {
  const { signIn } = setup();
  assert.equal(await clientIdOf(await signIn("acme.example.com", "acme-idp")), "client_acme-idp");
  assert.equal(await clientIdOf(await signIn("globex.example.com", "globex-idp")), "client_globex-idp");
});

test("another tenant's session is refused", async () => {
  const { dbs, request, signUpOwner } = setup();
  const cookie = await signUpOwner("acme");

  // The cookie is no session in globex's database.
  const unknown = await request("globex.example.com", "/organization/list-teams", { cookie });
  assert.equal(unknown.status, 401);

  // Copied into globex's database, it is still bound to acme.
  dbs.globex!.user!.push(...dbs.acme!.user!);
  dbs.globex!.session!.push(...dbs.acme!.session!);
  await refused(await request("globex.example.com", "/organization/list-teams", { cookie }), "CROSS_TENANT_SESSION");
  await refused(
    await request("globex.example.com", "/organization/set-active-team", { cookie, body: { teamId: "team_globex" } }),
    "CROSS_TENANT_SESSION",
  );
});

test("another tenant's team id is refused", async () => {
  const { dbs, request, signUpOwner } = setup();
  const cookie = await signUpOwner("acme");
  const host = "acme.example.com";

  // A team id from globex's database does not exist in acme's.
  const absent = await request(host, "/organization/set-active-team", { cookie, body: { teamId: "team_globex" } });
  assert.ok(absent.status >= 400, await absent.clone().text());
  const absentMembers = await request(host, "/organization/list-team-members?teamId=team_globex", { cookie });
  assert.ok(absentMembers.status >= 400, await absentMembers.clone().text());

  // A row for it that does exist in acme's database is still not the tenant's.
  dbs.acme!.team!.push(teamRow("globex"));
  await refused(await request(host, "/organization/set-active-team", { cookie, body: { teamId: "team_globex" } }), "TEAM_TENANT_MISMATCH");
  await refused(await request(host, "/organization/list-team-members?teamId=team_globex", { cookie }), "TEAM_TENANT_MISMATCH");
  await refused(
    await request(host, "/organization/create-team", { cookie, body: { name: "Ops", organizationId: "org_globex" } }),
    "ORGANIZATION_TENANT_MISMATCH",
  );
});

test("another tenant's SSO provider id is refused", async () => {
  const { dbs, signIn } = setup();

  // Globex's provider does not exist in acme's database.
  await refused(await signIn("acme.example.com", "globex-idp"), "SSO_PROVIDER_TENANT_MISMATCH");

  // A row for it that does exist there belongs to globex's organization.
  dbs.acme!.ssoProvider!.push(provider("globex"));
  await refused(await signIn("acme.example.com", "globex-idp"), "SSO_PROVIDER_TENANT_MISMATCH");
  assert.equal(await clientIdOf(await signIn("acme.example.com", "acme-idp")), "client_acme-idp");
});
