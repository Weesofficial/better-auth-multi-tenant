import { test } from "node:test";
import assert from "node:assert/strict";
import type { Tenant } from "../src/index.js";
import { TENANTS, codeOf, setup } from "./helpers.js";

/**
 * Custom domains: a tenant can be served from its own domain (`app.acme.test`)
 * as well as from its subdomain. The mapping comes from `getTenantByDomain`.
 */

const DOMAINS: Record<string, Tenant> = {
  "app.acme.test": TENANTS.acme!,
  "portal.globex.test": TENANTS.globex!,
  "old.initech.test": TENANTS.initech!,
};

const getTenantByDomain = (domain: string) => DOMAINS[domain] ?? null;

const trustedOrigins = ["http://*.example.com", "http://app.acme.test", "http://portal.globex.test"];

test("a custom domain resolves to its tenant", async () => {
  const { request } = setup({ getTenantByDomain });
  const res = await request("app.acme.test", "/multi-tenant/current");
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), {
    id: "t_acme",
    slug: "acme",
    origin: "https://app.acme.test",
  });
});

test("custom domains are not looked up unless getTenantByDomain is set", async () => {
  const { request } = setup();
  const res = await request("app.acme.test", "/multi-tenant/current");
  assert.equal(res.status, 400);
  assert.equal(await codeOf(res), "TENANT_REQUIRED");
});

test("an unknown custom domain is a 404", async () => {
  const { request } = setup({ getTenantByDomain });
  const res = await request("nobody.test", "/multi-tenant/current");
  assert.equal(res.status, 404);
  assert.equal(await codeOf(res), "TENANT_NOT_FOUND");
});

test("an unknown custom domain passes through on a path that does not require a tenant", async () => {
  const { request } = setup({ getTenantByDomain, requireTenant: (path) => path !== "/ok" });
  const res = await request("nobody.test", "/ok");
  assert.equal(res.status, 200);
});

test("an inactive tenant on its custom domain is a 403", async () => {
  const { request } = setup({ getTenantByDomain });
  const res = await request("old.initech.test", "/multi-tenant/current");
  assert.equal(res.status, 403);
  assert.equal(await codeOf(res), "TENANT_INACTIVE");
});

test("the domain is normalised before lookup", async () => {
  const seen: string[] = [];
  const { request } = setup({
    getTenantByDomain: (domain) => {
      seen.push(domain);
      return getTenantByDomain(domain);
    },
  });
  const res = await request("App.Acme.Test:8443", "/multi-tenant/current");
  assert.equal(res.status, 200);
  assert.deepEqual(seen, ["app.acme.test"]);
});

test("subdomains keep working and never hit getTenantByDomain", async () => {
  let calls = 0;
  const { request } = setup({
    getTenantByDomain: (domain) => {
      calls++;
      return getTenantByDomain(domain);
    },
  });
  const res = await request("globex.example.com", "/multi-tenant/current");
  assert.equal(res.status, 200);
  assert.equal(calls, 0);
});

test("a session created on a custom domain is bound to that tenant", async () => {
  const { db, signUp } = setup({ getTenantByDomain }, { trustedOrigins });
  await signUp("app.acme.test");
  assert.equal(db.session[0]!.tenantId, "t_acme");
});

test("a session works on its tenant's subdomain and custom domain", async () => {
  const { request, signUp } = setup({ getTenantByDomain }, { trustedOrigins });
  const cookie = await signUp("acme.example.com");
  assert.equal((await request("app.acme.test", "/get-session", { cookie })).status, 200);
});

test("a session is refused on another tenant's custom domain", async () => {
  const { request, signUp } = setup({ getTenantByDomain }, { trustedOrigins });
  const cookie = await signUp("acme.example.com");
  const res = await request("portal.globex.test", "/get-session", { cookie });
  assert.equal(res.status, 403);
  assert.equal(await codeOf(res), "CROSS_TENANT_SESSION");
});

test("onTenantResolved reports the custom-domain source", async () => {
  const seen: string[] = [];
  const { request } = setup({
    getTenantByDomain,
    onTenantResolved: (r) => void seen.push(`${r.slug} ${r.source} ${r.domain}`),
  });
  await request("app.acme.test", "/multi-tenant/current");
  assert.deepEqual(seen, ["acme custom-domain app.acme.test"]);
});

test("/multi-tenant/current honours protocol and port on a custom domain", async () => {
  const { request } = setup({ getTenantByDomain, protocol: "http", port: 3000 });
  const body = (await (await request("app.acme.test", "/multi-tenant/current")).json()) as {
    origin: string;
  };
  assert.equal(body.origin, "http://app.acme.test:3000");
});
