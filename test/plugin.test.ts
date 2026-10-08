import { test } from "node:test";
import assert from "node:assert/strict";
import { betterAuth } from "better-auth";
import { memoryAdapter } from "better-auth/adapters/memory";
import {
  multiTenant,
  tenantSessionHooks,
  type MultiTenantOptions,
  type Tenant,
} from "../src/index.js";

/**
 * End-to-end tests against a real Better Auth instance. The unit tests cover
 * the resolver in isolation; these check that the hooks actually gate requests.
 */

const TENANTS: Record<string, Tenant> = {
  acme: { id: "t_acme", slug: "acme", status: "active" },
  globex: { id: "t_globex", slug: "globex", status: "active" },
  initech: { id: "t_initech", slug: "initech", status: "suspended" },
};

function setup(overrides: Partial<MultiTenantOptions> = {}) {
  const db: { [model: string]: Record<string, unknown>[]; session: Record<string, unknown>[] } = {
    user: [],
    session: [],
    account: [],
    verification: [],
  };
  const auth = betterAuth({
    secret: "test-secret-0123456789-abcdefghijklmnop",
    baseURL: "http://acme.example.com",
    trustedOrigins: ["http://*.example.com"],
    database: memoryAdapter(db),
    emailAndPassword: { enabled: true },
    logger: { disabled: true },
    plugins: [
      multiTenant({
        baseDomain: "example.com",
        getTenant: (slug) => TENANTS[slug] ?? null,
        ...overrides,
      }),
    ],
    databaseHooks: tenantSessionHooks(),
  });

  const request = (host: string, path: string, init: { method?: string; body?: unknown; cookie?: string } = {}) =>
    auth.handler(
      new Request(`http://${host}/api/auth${path}`, {
        method: init.method ?? "GET",
        body: init.body === undefined ? undefined : JSON.stringify(init.body),
        headers: {
          host,
          origin: `http://${host}`,
          "content-type": "application/json",
          ...(init.cookie ? { cookie: init.cookie } : {}),
        },
      }),
    );

  /** Sign up on `host` and return the session cookie. */
  const signUp = async (host: string, email = "user@example.com") => {
    const res = await request(host, "/sign-up/email", {
      method: "POST",
      body: { email, password: "correct-horse-battery", name: "User" },
    });
    assert.equal(res.status, 200, await res.clone().text());
    const cookie = res.headers.get("set-cookie")?.split(";")[0];
    assert.ok(cookie, "expected a session cookie");
    return cookie;
  };

  return { auth, db, request, signUp };
}

const codeOf = async (res: Response) => ((await res.json()) as { code?: string }).code;

test("a new session is bound to the tenant it was created on", async () => {
  const { db, signUp } = setup();
  await signUp("acme.example.com");
  assert.equal(db.session.length, 1);
  assert.equal(db.session[0]!.tenantId, "t_acme");
});

test("a session works on its own tenant", async () => {
  const { request, signUp } = setup();
  const cookie = await signUp("acme.example.com");
  const res = await request("acme.example.com", "/get-session", { cookie });
  assert.equal(res.status, 200);
});

test("a session is refused on another tenant's host", async () => {
  const { request, signUp } = setup();
  const cookie = await signUp("acme.example.com");
  const res = await request("globex.example.com", "/get-session", { cookie });
  assert.equal(res.status, 403);
  assert.equal(await codeOf(res), "CROSS_TENANT_SESSION");
});

test("an unbound session is refused by default", async () => {
  const { db, request, signUp } = setup();
  const cookie = await signUp("acme.example.com");
  delete db.session[0]!.tenantId; // e.g. a session that predates the plugin
  const res = await request("globex.example.com", "/get-session", { cookie });
  assert.equal(res.status, 403);
  assert.equal(await codeOf(res), "UNBOUND_SESSION");
});

test("an unbound session is allowed when explicitly opted in", async () => {
  const { db, request, signUp } = setup({ unboundSessions: "allow" });
  const cookie = await signUp("acme.example.com");
  delete db.session[0]!.tenantId;
  const res = await request("globex.example.com", "/get-session", { cookie });
  assert.equal(res.status, 200);
});

test("an unknown tenant is a 404", async () => {
  const { request } = setup();
  const res = await request("nobody.example.com", "/multi-tenant/current");
  assert.equal(res.status, 404);
  assert.equal(await codeOf(res), "TENANT_NOT_FOUND");
});

test("an inactive tenant is a 403", async () => {
  const { request } = setup();
  const res = await request("initech.example.com", "/multi-tenant/current");
  assert.equal(res.status, 403);
  assert.equal(await codeOf(res), "TENANT_INACTIVE");
});

test("the apex domain fails closed by default", async () => {
  const { request } = setup();
  const res = await request("example.com", "/ok");
  assert.equal(res.status, 400);
  assert.equal(await codeOf(res), "TENANT_REQUIRED");
});

test("requireTenant can exempt a path", async () => {
  const { request } = setup({ requireTenant: (path) => path !== "/ok" });
  const res = await request("example.com", "/ok");
  assert.equal(res.status, 200);
});

test("/multi-tenant/current reports the resolved tenant", async () => {
  const { request } = setup();
  const res = await request("globex.example.com", "/multi-tenant/current");
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), {
    id: "t_globex",
    slug: "globex",
    origin: "https://globex.example.com",
  });
});

test("/multi-tenant/current honours protocol and port", async () => {
  const { request } = setup({ protocol: "http", port: 3000 });
  const res = await request("globex.example.com", "/multi-tenant/current");
  const body = (await res.json()) as { origin: string };
  assert.equal(body.origin, "http://globex.example.com:3000");
});

test("the x-tenant header is ignored unless enabled", async () => {
  const { auth } = setup();
  const res = await auth.handler(
    new Request("http://example.com/api/auth/multi-tenant/current", {
      headers: { host: "example.com", "x-tenant": "acme" },
    }),
  );
  assert.equal(res.status, 400);
});

test("onTenantResolved sees each resolution", async () => {
  const seen: string[] = [];
  const { request } = setup({ onTenantResolved: (r, path) => void seen.push(`${r.slug} ${path}`) });
  await request("acme.example.com", "/multi-tenant/current");
  assert.deepEqual(seen, ["acme /multi-tenant/current"]);
});
