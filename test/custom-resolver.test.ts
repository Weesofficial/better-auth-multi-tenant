import { test } from "node:test";
import assert from "node:assert/strict";
import type { TenantSlugRequest } from "../src/index.js";
import { codeOf, setup } from "./helpers.js";

/** `getTenantSlug`: the app decides which tenant a request is for. */

const fromWorkspaceHeader = ({ headers }: TenantSlugRequest) => headers.get("x-workspace");

test("the tenant comes from a custom resolver and binds the session to it", async () => {
  const { db, request } = setup({ baseDomain: undefined, getTenantSlug: fromWorkspaceHeader });
  const res = await request("app.example.com", "/sign-up/email", {
    method: "POST",
    body: { email: "user@example.com", password: "correct-horse-battery", name: "User" },
    headers: { "x-workspace": "acme" },
  });
  assert.equal(res.status, 200, await res.clone().text());
  assert.equal(db.session[0]!.tenantId, "t_acme");
  const cookie = res.headers.get("set-cookie")!.split(";")[0]!;
  assert.match(cookie, /^better-auth\.session_token=/, "tenantCookies is off outside path mode");

  const own = await request("app.example.com", "/get-session", { cookie, headers: { "x-workspace": "acme" } });
  assert.equal(own.status, 200);
  const other = await request("app.example.com", "/get-session", { cookie, headers: { "x-workspace": "globex" } });
  assert.equal(other.status, 403);
  assert.equal(await codeOf(other), "CROSS_TENANT_SESSION");
});

test("the resolver gets the headers, the request and the route", async () => {
  const seen: TenantSlugRequest[] = [];
  const { request } = setup({ baseDomain: undefined, getTenantSlug: (req) => (seen.push(req), "acme") });
  await request("app.example.com", "/multi-tenant/current");
  assert.equal(seen[0]!.path, "/multi-tenant/current");
  assert.equal(seen[0]!.headers.get("host"), "app.example.com");
  assert.ok(seen[0]!.request instanceof Request);
});

test("a resolver that finds nothing leaves the request without a tenant", async () => {
  const required = setup({ baseDomain: undefined, getTenantSlug: () => null });
  const res = await required.request("app.example.com", "/get-session");
  assert.equal(res.status, 400);
  assert.equal(await codeOf(res), "TENANT_REQUIRED");

  const optional = setup({ baseDomain: undefined, getTenantSlug: () => null, requireTenant: (path) => path !== "/ok" });
  assert.equal((await optional.request("app.example.com", "/ok")).status, 200);
});

test("a resolved slug must still pass reserved and slugPattern, and name a known, active tenant", async () => {
  const cases: [string, number, string][] = [
    ["Not A Slug", 400, "TENANT_REQUIRED"],
    ["www", 404, "TENANT_REQUIRED"],
    ["nope", 404, "TENANT_NOT_FOUND"],
    ["initech", 403, "TENANT_INACTIVE"],
  ];
  for (const [slug, status, code] of cases) {
    const { request } = setup({ baseDomain: undefined, getTenantSlug: () => slug });
    const res = await request("app.example.com", "/get-session");
    assert.equal(res.status, status, slug);
    assert.equal(await codeOf(res), code, slug);
  }
});

test("with baseDomain set, /multi-tenant/current reports the tenant's subdomain origin", async () => {
  const { request } = setup({ getTenantSlug: fromWorkspaceHeader, protocol: "http" });
  const res = await request("app.example.com", "/multi-tenant/current", { headers: { "x-workspace": "acme" } });
  assert.deepEqual(await res.json(), { id: "t_acme", slug: "acme", origin: "http://acme.example.com" });
});

test("tenantCookies: true gives each resolved tenant its own cookie names", async () => {
  const { request } = setup({ baseDomain: undefined, getTenantSlug: fromWorkspaceHeader, tenantCookies: true });
  const res = await request("app.example.com", "/sign-up/email", {
    method: "POST",
    body: { email: "user@example.com", password: "correct-horse-battery", name: "User" },
    headers: { "x-workspace": "globex" },
  });
  assert.match(res.headers.get("set-cookie")!, /^better-auth\.globex\.session_token=/);
});
