import { test } from "node:test";
import assert from "node:assert/strict";
import { betterAuth, type BetterAuthOptions } from "better-auth";
import { memoryAdapter } from "better-auth/adapters/memory";
import { magicLink } from "better-auth/plugins";
import {
  multiTenant,
  tenantPathRequest,
  tenantSessionHooks,
  withTenantPaths,
  type MultiTenantOptions,
} from "../src/index.js";
import { codeOf, cookiesOf, TENANTS } from "./helpers.js";

/** Path-based tenancy: `example.com/api/auth/t/<slug>/…`. */

function pathSetup(overrides: Partial<MultiTenantOptions> = {}, authOverrides: Partial<BetterAuthOptions> = {}) {
  const db: Record<string, Record<string, unknown>[]> = { user: [], session: [], account: [], verification: [], rateLimit: [] };
  const links: string[] = [];
  const auth = withTenantPaths(
    betterAuth({
      secret: "test-secret-0123456789-abcdefghijklmnop",
      baseURL: "http://example.com",
      trustedOrigins: ["http://example.com"],
      database: memoryAdapter(db),
      emailAndPassword: { enabled: true },
      logger: { disabled: true },
      plugins: [
        multiTenant({ pathPrefix: "/t", getTenant: (slug) => TENANTS[slug] ?? null, ...overrides }),
        magicLink({ sendMagicLink: async ({ url }) => void links.push(url) }),
      ],
      databaseHooks: tenantSessionHooks(),
      ...authOverrides,
    }),
  );

  const request = (path: string, init: { method?: string; body?: unknown; cookie?: string; headers?: Record<string, string> } = {}) =>
    auth.handler(
      new Request(`http://example.com/api/auth${path}`, {
        method: init.method ?? "GET",
        body: init.body === undefined ? undefined : JSON.stringify(init.body),
        headers: {
          origin: "http://example.com",
          "content-type": "application/json",
          ...(init.cookie ? { cookie: init.cookie } : {}),
          ...init.headers,
        },
      }),
    );

  const signUp = async (slug: string, email = "user@example.com", cookie?: string) => {
    const res = await request(`/t/${slug}/sign-up/email`, {
      method: "POST",
      body: { email, password: "correct-horse-battery", name: "User" },
      cookie,
    });
    assert.equal(res.status, 200, await res.clone().text());
    return cookiesOf(res);
  };

  return { auth, db, links, request, signUp };
}

const sessionOf = async (res: Response) => ((await res.json()) as { session?: { tenantId?: string } } | null)?.session;

test("a session made under a tenant's path is stamped with that tenant and has its own cookie name", async () => {
  const { db, request, signUp } = pathSetup();
  const cookie = await signUp("acme");
  assert.equal(db.session![0]!.tenantId, "t_acme");
  assert.match(cookie, /^better-auth\.acme\.session_token=/);

  const res = await request("/t/acme/get-session", { cookie });
  assert.equal(res.status, 200);
  assert.equal((await sessionOf(res))?.tenantId, "t_acme");
});

test("one browser stays signed in to two tenants on the same host", async () => {
  const { request, signUp } = pathSetup();
  const acme = await signUp("acme", "a@example.com");
  const globex = await signUp("globex", "g@example.com", acme);
  const jar = `${acme}; ${globex}`;

  assert.equal((await sessionOf(await request("/t/acme/get-session", { cookie: jar })))?.tenantId, "t_acme");
  assert.equal((await sessionOf(await request("/t/globex/get-session", { cookie: jar })))?.tenantId, "t_globex");
});

test("a tenant's session cookie presented under another tenant's name is refused", async () => {
  const { request, signUp } = pathSetup();
  const acme = await signUp("acme");
  const forged = acme.replace("better-auth.acme.", "better-auth.globex.");
  const res = await request("/t/globex/get-session", { cookie: forged });
  assert.equal(res.status, 403);
  assert.equal(await codeOf(res), "CROSS_TENANT_SESSION");
});

test("a request without the tenant prefix has no tenant", async () => {
  const required = pathSetup();
  const res = await required.request("/get-session");
  assert.equal(res.status, 400);
  assert.equal(await codeOf(res), "TENANT_REQUIRED");

  const optional = pathSetup({ requireTenant: (path) => path !== "/ok" });
  assert.equal((await optional.request("/ok")).status, 200);
});

test("a client-sent header cannot name a path tenant", async () => {
  const { request } = pathSetup();
  const res = await request("/get-session", { headers: { "x-tenant": "acme" } });
  assert.equal(res.status, 400);
  assert.equal(await codeOf(res), "TENANT_REQUIRED");
});

test("unknown, inactive, reserved and malformed path slugs are refused", async () => {
  const { request } = pathSetup();
  const cases: [string, number, string][] = [
    ["nope", 404, "TENANT_NOT_FOUND"],
    ["initech", 403, "TENANT_INACTIVE"],
    ["admin", 404, "TENANT_REQUIRED"],
    ["Acme", 400, "TENANT_REQUIRED"],
    ["ac%2Fme", 400, "TENANT_REQUIRED"],
  ];
  for (const [slug, status, code] of cases) {
    const res = await request(`/t/${slug}/get-session`);
    assert.equal(res.status, status, slug);
    assert.equal(await codeOf(res), code, slug);
  }
});

test("a prefix with a slug but no route is not found", async () => {
  const { request } = pathSetup();
  assert.equal((await request("/t/acme")).status, 404);
  assert.equal((await request("/t/acme/")).status, 404);
});

test("disabledPaths still apply under a tenant's prefix", async () => {
  const { request } = pathSetup({}, { disabledPaths: ["/sign-up/email"] });
  const res = await request("/t/acme/sign-up/email", {
    method: "POST",
    body: { email: "user@example.com", password: "correct-horse-battery", name: "User" },
  });
  assert.equal(res.status, 404);
});

test("Better Auth's sign-in rate limit counts one bucket across every tenant's prefix", async () => {
  const { request, signUp } = pathSetup({}, { rateLimit: { enabled: true, storage: "memory" } });
  await signUp("acme");
  const statuses: number[] = [];
  for (const slug of ["acme", "globex", "acme", "globex"]) {
    const res = await request(`/t/${slug}/sign-in/email`, {
      method: "POST",
      body: { email: "user@example.com", password: "wrong-password-123" },
      headers: { "x-forwarded-for": "203.0.113.7" },
    });
    statuses.push(res.status);
  }
  assert.equal(statuses.at(-1), 429, String(statuses));
});

test("a magic link comes back under the tenant's prefix and is refused under another", async () => {
  const { db, links, request } = pathSetup();
  const sent = await request("/t/acme/sign-in/magic-link", { method: "POST", body: { email: "user@example.com" } });
  assert.equal(sent.status, 200, await sent.clone().text());
  const link = new URL(links.at(-1)!);
  assert.match(link.pathname, /^\/api\/auth\/t\/acme\/magic-link\/verify$/);

  const elsewhere = await request(`${link.pathname.replace("/api/auth/t/acme", "/t/globex")}${link.search}`);
  assert.equal(elsewhere.status, 403);
  assert.equal(await codeOf(elsewhere), "VERIFICATION_TENANT_MISMATCH");

  const res = await request(`${link.pathname.replace("/api/auth", "")}${link.search}`);
  assert.equal(res.status, 302, await res.clone().text());
  assert.equal(db.session!.at(-1)!.tenantId, "t_acme");
});

test("/multi-tenant/current reports the tenant and the site's origin", async () => {
  const { request } = pathSetup();
  const res = await request("/t/acme/multi-tenant/current");
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { id: "t_acme", slug: "acme", origin: "http://example.com" });
});

test("tenantPathRequest names the tenant for an auth.api call", async () => {
  const { auth, signUp } = pathSetup();
  const cookie = await signUp("acme");
  const headers = new Headers({ cookie });
  const session = await auth.api.getSession({
    headers,
    request: tenantPathRequest(new Request("http://example.com/acme/dashboard", { headers }), "acme"),
    asResponse: false,
  });
  assert.equal((session?.session as { tenantId?: string } | undefined)?.tenantId, "t_acme");

  await assert.rejects(
    auth.api.getSession({ headers, request: tenantPathRequest(new Request("http://example.com/x", { headers }), "nope"), asResponse: false }),
    (error: { body?: { code?: string } }) => error.body?.code === "TENANT_NOT_FOUND",
  );
});

test("startup refuses options that do not pick exactly one way to resolve tenants", () => {
  const getTenant = () => null;
  assert.throws(() => multiTenant({ getTenant }), /set baseDomain/);
  assert.throws(() => multiTenant({ getTenant, baseDomain: "example.com", pathPrefix: "/t" }), /pathPrefix and baseDomain/);
  assert.throws(() => multiTenant({ getTenant, pathPrefix: "/t", getTenantSlug: () => null }), /pathPrefix and getTenantSlug/);
  assert.throws(() => multiTenant({ getTenant, pathPrefix: "/t", getTenantByDomain: () => null }), /getTenantByDomain/);
  assert.throws(() => multiTenant({ getTenant, pathPrefix: "/t", trustProxy: true }), /trustProxy/);
  assert.throws(() => multiTenant({ getTenant, getTenantSlug: () => null, allowHeaderOverride: true }), /allowHeaderOverride/);
  for (const prefix of ["", "t", "/t/", "/t//x", "/"]) {
    assert.throws(() => multiTenant({ getTenant, pathPrefix: prefix }), /pathPrefix must look like/, prefix);
  }
  assert.doesNotThrow(() => multiTenant({ getTenant, pathPrefix: "/workspaces/by-slug" }));
});

test("withTenantPaths needs the plugin with a pathPrefix", () => {
  const auth = betterAuth({
    secret: "test-secret-0123456789-abcdefghijklmnop",
    database: memoryAdapter({ user: [], session: [], account: [], verification: [] }),
    logger: { disabled: true },
    plugins: [multiTenant({ baseDomain: "example.com", getTenant: () => null, bindVerifications: false })],
  });
  assert.throws(() => withTenantPaths(auth), /pathPrefix/);
});

test("a custom basePath is honoured", async () => {
  const { auth } = pathSetup({}, { basePath: "/auth" });
  const res = await auth.handler(
    new Request("http://example.com/auth/t/acme/multi-tenant/current", { headers: { origin: "http://example.com" } }),
  );
  assert.equal(res.status, 200);
  assert.equal(((await res.json()) as { slug: string }).slug, "acme");
});

test("createTenantAuth serves path tenants, each from its own instance and database", async () => {
  const { createTenantAuth } = await import("../src/index.js");
  const dbs: Record<string, Record<string, Record<string, unknown>[]>> = {};
  const tenantAuth = createTenantAuth({
    pathPrefix: "/t",
    getTenant: (slug) => TENANTS[slug] ?? null,
    bindVerifications: false,
    createAuth: (tenant) => ({
      secret: "test-secret-0123456789-abcdefghijklmnop",
      baseURL: "http://example.com",
      trustedOrigins: ["http://example.com"],
      database: memoryAdapter((dbs[tenant.slug] = { user: [], session: [], account: [], verification: [] })),
      emailAndPassword: { enabled: true },
      logger: { disabled: true },
    }),
  });
  const call = (path: string, init: { method?: string; body?: unknown; cookie?: string } = {}) =>
    tenantAuth.handler(
      new Request(`http://example.com/api/auth${path}`, {
        method: init.method ?? "GET",
        body: init.body === undefined ? undefined : JSON.stringify(init.body),
        headers: { origin: "http://example.com", "content-type": "application/json", ...(init.cookie ? { cookie: init.cookie } : {}) },
      }),
    );

  const res = await call("/t/acme/sign-up/email", {
    method: "POST",
    body: { email: "user@example.com", password: "correct-horse-battery", name: "User" },
  });
  assert.equal(res.status, 200, await res.clone().text());
  assert.equal(dbs.acme!.session!.length, 1);
  assert.equal(dbs.acme!.session![0]!.tenantId, "t_acme");
  const cookie = cookiesOf(res);
  assert.match(cookie, /^better-auth\.acme\.session_token=/);

  assert.equal((await call("/t/acme/get-session", { cookie })).status, 200);
  const unprefixed = await call("/get-session", { cookie });
  assert.equal(unprefixed.status, 400);
  assert.equal(await codeOf(unprefixed), "TENANT_REQUIRED");
  const unknown = await call("/t/nope/get-session");
  assert.equal(unknown.status, 404);
  assert.equal(dbs.nope, undefined);
});

test("trailing slashes are trimmed without a backtracking regex", async () => {
  const { trimTrailingSlashes } = await import("../src/path.js");
  assert.equal(trimTrailingSlashes("/api/auth///"), "/api/auth");
  assert.equal(trimTrailingSlashes("/"), "");
  assert.equal(trimTrailingSlashes("http://example.com/api/auth"), "http://example.com/api/auth");
  const long = `${"/".repeat(100_000)}x`;
  const started = Date.now();
  assert.equal(trimTrailingSlashes(long), long);
  assert.ok(Date.now() - started < 100);
});
