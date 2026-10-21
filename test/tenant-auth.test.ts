import { test } from "node:test";
import assert from "node:assert/strict";
import { memoryAdapter } from "better-auth/adapters/memory";
import { APIError } from "better-auth/api";
import { createTenantAuth, type Tenant } from "../src/index.js";
import { codeOf, TENANTS } from "./helpers.js";

/**
 * Database-per-tenant: each tenant gets its own memory adapter, so what one
 * tenant stores is physically absent from the other.
 */

type Rows = Record<string, unknown>[];
type Db = { user: Rows; session: Rows; account: Rows; verification: Rows };
const newDb = (): Db => ({ user: [], session: [], account: [], verification: [] });

function setup(extra: { maxSize?: number } = {}) {
  const dbs: Record<string, Db> = {};
  const created: string[] = [];
  const evicted: string[] = [];
  const tenantAuth = createTenantAuth({
    baseDomain: "example.com",
    getTenant: (slug) => TENANTS[slug] ?? null,
    createAuth: (tenant: Tenant) => {
      created.push(tenant.slug);
      return {
        secret: "test-secret-0123456789-abcdefghijklmnop",
        baseURL: "http://acme.example.com",
        trustedOrigins: ["http://*.example.com"],
        database: memoryAdapter((dbs[tenant.slug] ??= newDb())),
        emailAndPassword: { enabled: true },
        logger: { disabled: true },
      };
    },
    onEvict: (tenant) => {
      evicted.push(tenant.slug);
    },
    ...extra,
  });

  const request = (host: string, path: string, init: { body?: unknown; cookie?: string } = {}) =>
    tenantAuth.handler(
      new Request(`http://${host}/api/auth${path}`, {
        method: init.body === undefined ? "GET" : "POST",
        body: init.body === undefined ? undefined : JSON.stringify(init.body),
        headers: {
          host,
          origin: `http://${host}`,
          "content-type": "application/json",
          ...(init.cookie ? { cookie: init.cookie } : {}),
        },
      }),
    );

  const credentials = { email: "user@example.com", password: "correct-horse-battery" };
  const signUp = async (host: string) => {
    const res = await request(host, "/sign-up/email", { body: { ...credentials, name: "User" } });
    assert.equal(res.status, 200, await res.clone().text());
    return res.headers.get("set-cookie")!.split(";")[0]!;
  };

  return { tenantAuth, dbs, created, evicted, request, signUp, credentials };
}

test("a user and session in one tenant database do not exist in the other", async () => {
  const { dbs, request, signUp, credentials } = setup();
  const cookie = await signUp("acme.example.com");

  assert.equal(dbs.acme!.user.length, 1);
  assert.equal(dbs.acme!.session.length, 1);

  // Globex has never seen this user: its database is empty, and sign-in fails.
  const signIn = await request("globex.example.com", "/sign-in/email", { body: credentials });
  assert.equal(signIn.status, 401);
  assert.equal(dbs.globex!.user.length, 0);
  assert.equal(dbs.globex!.session.length, 0);

  // The cookie is not a session in globex's database.
  const res = await request("globex.example.com", "/get-session", { cookie });
  assert.equal(res.status, 200);
  assert.equal(await res.json(), null);

  const own = await request("acme.example.com", "/get-session", { cookie });
  assert.equal(((await own.json()) as { session: { tenantId: string } }).session.tenantId, "t_acme");
});

test("a session row copied into another tenant's database is still refused", async () => {
  const { dbs, request, signUp } = setup();
  const cookie = await signUp("acme.example.com");
  await request("globex.example.com", "/ok"); // Create globex's database.

  dbs.globex!.user.push(...dbs.acme!.user);
  dbs.globex!.session.push(...dbs.acme!.session);

  const res = await request("globex.example.com", "/get-session", { cookie });
  assert.equal(res.status, 403);
  assert.equal(await codeOf(res), "CROSS_TENANT_SESSION");
});

test("an instance is reused for the same tenant", async () => {
  const { created, request, tenantAuth } = setup();
  await request("acme.example.com", "/ok");
  await request("acme.example.com", "/ok");
  const a = await tenantAuth.getAuth(new Headers({ host: "acme.example.com" }));
  const b = await tenantAuth.getAuth(new Headers({ host: "acme.example.com" }));
  assert.equal(a, b);
  assert.deepEqual(created, ["acme"]);

  await request("globex.example.com", "/ok");
  assert.deepEqual(created, ["acme", "globex"]);
});

test("the least recently used instance is evicted past maxSize", async () => {
  const { created, evicted, request, signUp, credentials } = setup({ maxSize: 1 });
  await signUp("acme.example.com");
  await request("globex.example.com", "/ok");
  assert.deepEqual(evicted, ["acme"]);

  // Acme is rebuilt on the next request, over the same database.
  const res = await request("acme.example.com", "/sign-in/email", { body: credentials });
  assert.equal(res.status, 200);
  assert.deepEqual(created, ["acme", "globex", "acme"]);
  assert.deepEqual(evicted, ["acme", "globex"]);
});

test("evict() drops one tenant or all of them", async () => {
  const { created, evicted, request, tenantAuth } = setup();
  await request("acme.example.com", "/ok");
  await request("globex.example.com", "/ok");

  await tenantAuth.evict("t_acme");
  assert.deepEqual(evicted, ["acme"]);
  await tenantAuth.evict("t_unknown"); // Nothing cached: a no-op.
  await tenantAuth.evict();
  assert.deepEqual(evicted, ["acme", "globex"]);

  await request("acme.example.com", "/ok");
  assert.deepEqual(created, ["acme", "globex", "acme"]);
});

test("unknown, inactive and tenant-less hosts are refused without creating an instance", async () => {
  const { created, request } = setup();

  const unknown = await request("nope.example.com", "/ok");
  assert.equal(unknown.status, 404);
  assert.equal(await codeOf(unknown), "TENANT_NOT_FOUND");

  const inactive = await request("initech.example.com", "/ok");
  assert.equal(inactive.status, 403);
  assert.equal(await codeOf(inactive), "TENANT_INACTIVE");

  for (const host of ["example.com", "www.example.com", "other.test"]) {
    const res = await request(host, "/ok");
    assert.ok(res.status === 400 || res.status === 404, host);
    assert.equal(await codeOf(res), "TENANT_REQUIRED");
  }

  assert.deepEqual(created, []);
});

test("getAuth throws the plugin's APIError for an unknown tenant", async () => {
  const { tenantAuth } = setup();
  await assert.rejects(tenantAuth.getAuth(new Headers({ host: "nope.example.com" })), (e: unknown) => {
    assert.ok(e instanceof APIError);
    assert.equal(e.statusCode, 404);
    return true;
  });
});

test("maxSize must be a positive integer", () => {
  for (const maxSize of [0, -1, 1.5, Number.NaN]) {
    assert.throws(() => setup({ maxSize }), RangeError);
  }
});
