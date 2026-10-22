import assert from "node:assert/strict";
import test from "node:test";
import { memoryAdapter } from "better-auth/adapters/memory";
import { createTenantAuth, requestHost, type TrustProxy } from "../src/index.js";
import { codeOf, setup, TENANTS } from "./helpers.js";

const hostOf = (headers: Record<string, string>, trustProxy?: TrustProxy) => {
  const result = requestHost({ headers: new Headers(headers) }, trustProxy);
  return result.ok ? result.host : "rejected";
};

test("trustProxy off ignores every forwarding header", () => {
  const spoof = { host: "app.internal", "x-forwarded-host": "acme.example.com", forwarded: "host=acme.example.com" };
  assert.equal(hostOf(spoof), "app.internal");
  assert.equal(hostOf(spoof, false), "app.internal");
  assert.equal(hostOf(spoof, 0), "app.internal");
  assert.equal(hostOf(spoof, () => false), "app.internal");
  // Only an exact `true` from the predicate trusts the proxy.
  assert.equal(hostOf(spoof, (() => "yes") as unknown as TrustProxy), "app.internal");
});

test("trustProxy takes the right-most entry, so client-prepended values lose", () => {
  const xfh = { host: "app.internal", "x-forwarded-host": "evil.example.com, acme.example.com" };
  assert.equal(hostOf(xfh, true), "acme.example.com");
  assert.equal(hostOf(xfh, 1), "acme.example.com");
  assert.equal(hostOf({ host: "app.internal", "x-forwarded-host": "acme.example.com" }, true), "acme.example.com");
});

test("trustProxy with several hops takes the left-most trusted entry", () => {
  const chain = { host: "app.internal", "x-forwarded-host": "evil.example.com, acme.example.com, edge.internal" };
  assert.equal(hostOf(chain, 2), "acme.example.com");
  assert.equal(hostOf(chain, 3), "evil.example.com");
  // Fewer entries than trusted hops: the request skipped a proxy, so refuse it.
  assert.equal(hostOf(chain, 4), "rejected");
  assert.equal(hostOf({ host: "app.internal", "x-forwarded-host": "acme.example.com" }, 2), "rejected");
});

test("trustProxy reads the Forwarded header, quoted and in a list", () => {
  const forwarded = (value: string) => ({ host: "app.internal", forwarded: value });
  assert.equal(hostOf(forwarded("host=acme.example.com"), true), "acme.example.com");
  assert.equal(hostOf(forwarded('for=1.2.3.4;Host="acme.example.com:8443";proto=https'), true), "acme.example.com:8443");
  assert.equal(hostOf(forwarded("host=evil.example.com, for=10.0.0.1;host=acme.example.com"), true), "acme.example.com");
  assert.equal(hostOf(forwarded("host=evil.example.com, host=acme.example.com, host=x.internal"), 2), "acme.example.com");
  // The right-most hop named no host: nothing to trust.
  assert.equal(hostOf(forwarded("host=acme.example.com, for=10.0.0.1"), true), "rejected");
  assert.equal(hostOf(forwarded('host="acme.example.com'), true), "rejected");
});

test("trustProxy refuses two headers that name different hosts", () => {
  const both = (a: string, b: string) => ({ host: "app.internal", "x-forwarded-host": a, forwarded: `host=${b}` });
  assert.equal(hostOf(both("acme.example.com", "globex.example.com"), true), "rejected");
  assert.equal(hostOf(both("acme.example.com", "ACME.example.com"), true), "acme.example.com");
});

test("trustProxy falls back to Host when no forwarding header is present", () => {
  assert.equal(hostOf({ host: "acme.example.com" }, true), "acme.example.com");
  assert.equal(hostOf({}, true), null);
});

test("trustProxy rejects malformed hosts", () => {
  for (const bad of [
    "",
    " ",
    "acme.example.com,",
    "acme.example.com, ",
    "acme.example.com/path",
    "acme.example.com?x=1",
    "user@acme.example.com",
    "acme.example.com\\evil.com",
    "acme example.com",
    "acme.example.com:",
    "acme.example.com:99999",
    "acme.example.com:80:80",
    "-acme.example.com",
    "[::1",
    "[::1]x",
    "[zz]",
    `${"a".repeat(256)}.example.com`,
  ]) {
    assert.equal(hostOf({ host: "app.internal", "x-forwarded-host": bad }, true), "rejected", JSON.stringify(bad));
  }
  assert.equal(hostOf({ host: "app.internal", "x-forwarded-host": "a".repeat(5000) }, true), "rejected");
});

test("trustProxy keeps an IPv6 host and its port in one piece", () => {
  assert.equal(hostOf({ host: "app.internal", "x-forwarded-host": "[2001:db8::1]:3000" }, true), "[2001:db8::1]:3000");
  assert.equal(hostOf({ host: "app.internal", forwarded: 'host="[2001:db8::1]:3000"' }, true), "[2001:db8::1]:3000");
  assert.equal(hostOf({ host: "app.internal", "x-forwarded-host": "evil.example.com, [::1]" }, true), "[::1]");
});

test("a predicate decides per request and sees the headers", () => {
  const fromLoadBalancer: TrustProxy = ({ headers }) => headers.get("x-lb-secret") === "s3cret";
  const forwarded = { host: "app.internal", "x-forwarded-host": "acme.example.com" };
  assert.equal(hostOf({ ...forwarded, "x-lb-secret": "s3cret" }, fromLoadBalancer), "acme.example.com");
  assert.equal(hostOf({ ...forwarded, "x-lb-secret": "guess" }, fromLoadBalancer), "app.internal");
  assert.equal(hostOf(forwarded, fromLoadBalancer), "app.internal");
});

test("an invalid trustProxy value fails at setup", () => {
  for (const bad of [-1, 1.5, Number.NaN, Number.POSITIVE_INFINITY, "true", null]) {
    assert.throws(() => setup({ trustProxy: bad as never }), RangeError, String(bad));
  }
});

// End to end: the plugin, through a real Better Auth instance.
const current = (overrides: Parameters<typeof setup>[0], host: string, headers: Record<string, string>) =>
  setup(overrides).request(host, "/multi-tenant/current", { headers });

test("by default a client-supplied x-forwarded-host does not pick the tenant", async () => {
  const res = await current({}, "app.internal", { "x-forwarded-host": "acme.example.com" });
  assert.equal(res.status, 400);
  assert.equal(await codeOf(res), "TENANT_REQUIRED");

  // It cannot override the real host either.
  const res2 = await current({}, "acme.example.com", { "x-forwarded-host": "globex.example.com" });
  assert.equal(((await res2.json()) as { slug: string }).slug, "acme");
});

test("with trustProxy the forwarded host picks the tenant", async () => {
  const res = await current({ trustProxy: true }, "app.internal", { "x-forwarded-host": "globex.example.com" });
  assert.equal(res.status, 200);
  assert.equal(((await res.json()) as { slug: string }).slug, "globex");
});

test("with trustProxy a spoofed leading hop does not pick the tenant", async () => {
  const res = await current({ trustProxy: 1 }, "app.internal", {
    "x-forwarded-host": "globex.example.com, acme.example.com",
  });
  assert.equal(((await res.json()) as { slug: string }).slug, "acme");
});

test("with trustProxy a malformed forwarded host is a 400, even where no tenant is required", async () => {
  for (const requireTenant of [() => true, () => false]) {
    const res = await current({ trustProxy: true, requireTenant }, "acme.example.com", {
      "x-forwarded-host": "globex.example.com/evil",
    });
    assert.equal(res.status, 400);
    assert.equal(await codeOf(res), "INVALID_FORWARDED_HOST");
  }
});

test("a predicate that says no keeps using Host", async () => {
  const res = await current({ trustProxy: () => false }, "acme.example.com", { "x-forwarded-host": "globex.example.com" });
  assert.equal(((await res.json()) as { slug: string }).slug, "acme");
});

test("a predicate receives the Request when there is one", async () => {
  let seen: Request | undefined;
  const { request } = setup({
    trustProxy: (req) => {
      seen = req.request;
      return true;
    },
  });
  await request("app.internal", "/multi-tenant/current", { headers: { "x-forwarded-host": "acme.example.com" } });
  assert.ok(seen instanceof Request);
});

test("a custom domain resolves from the forwarded host too", async () => {
  const { request } = setup({
    trustProxy: true,
    getTenantByDomain: (domain) => (domain === "app.acme.com" ? { id: "t_acme", slug: "acme", status: "active" } : null),
  });
  const res = await request("app.internal", "/multi-tenant/current", { headers: { "x-forwarded-host": "app.acme.com" } });
  assert.equal(res.status, 200);
  assert.equal(((await res.json()) as { origin: string }).origin, "https://app.acme.com");
});

test("createTenantAuth honors trustProxy and ignores the header without it", async () => {
  const make = (trustProxy?: TrustProxy) =>
    createTenantAuth({
      baseDomain: "example.com",
      getTenant: (slug) => TENANTS[slug] ?? null,
      trustProxy,
      createAuth: () => ({
        secret: "test-secret-0123456789-abcdefghijklmnop",
        baseURL: "http://acme.example.com",
        database: memoryAdapter({ user: [], session: [], account: [], verification: [] }),
        logger: { disabled: true },
      }),
    });
  const get = (tenantAuth: ReturnType<typeof make>) =>
    tenantAuth.handler(
      new Request("http://app.internal/api/auth/multi-tenant/current", {
        headers: { host: "app.internal", "x-forwarded-host": "acme.example.com" },
      }),
    );

  assert.equal((await get(make())).status, 400);
  const res = await get(make(true));
  assert.equal(((await res.json()) as { slug: string }).slug, "acme");
  assert.throws(() => make(-1), RangeError);
});
