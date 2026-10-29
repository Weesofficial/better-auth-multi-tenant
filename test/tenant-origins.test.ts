import { test } from "node:test";
import assert from "node:assert/strict";
import { magicLink } from "better-auth/plugins";
import type { Tenant } from "../src/index.js";
import { TENANTS, codeOf, setup } from "./helpers.js";

/**
 * Each tenant's own host is trusted without listing it in `trustedOrigins`
 * (`trustTenantOrigins`), and links can follow the tenant's host
 * (`tenantBaseURL`). Custom domains live in a database, so they cannot be
 * listed up front.
 */

const DOMAINS: Record<string, Tenant> = {
  "app.acme.test": TENANTS.acme!,
  "portal.globex.test": TENANTS.globex!,
};
const getTenantByDomain = (domain: string) => DOMAINS[domain] ?? null;

const signUpBody = (callbackURL?: string) => ({
  email: "user@example.com",
  password: "correct-horse-battery",
  name: "User",
  ...(callbackURL ? { callbackURL } : {}),
});

test("a custom domain is trusted without being listed in trustedOrigins", async () => {
  const { request } = setup({ getTenantByDomain }, { trustedOrigins: [] });
  const res = await request("app.acme.test", "/sign-up/email", { method: "POST", body: signUpBody() });
  assert.equal(res.status, 200, await res.clone().text());
});

test("a tenant subdomain is trusted without a wildcard in trustedOrigins", async () => {
  const { request } = setup({}, { trustedOrigins: [] });
  const res = await request("globex.example.com", "/sign-up/email", { method: "POST", body: signUpBody() });
  assert.equal(res.status, 200, await res.clone().text());
});

test("another tenant's custom domain is not trusted as a callbackURL", async () => {
  const { request } = setup({ getTenantByDomain }, { trustedOrigins: [] });
  const res = await request("app.acme.test", "/sign-up/email", {
    method: "POST",
    body: signUpBody("http://portal.globex.test/dashboard"),
  });
  assert.equal(res.status, 403);
});

test("the tenant's own host is accepted as a callbackURL", async () => {
  const { request } = setup({ getTenantByDomain }, { trustedOrigins: [] });
  const res = await request("app.acme.test", "/sign-up/email", {
    method: "POST",
    body: signUpBody("http://app.acme.test/dashboard"),
  });
  assert.equal(res.status, 200, await res.clone().text());
});

test("an inactive tenant's host is not trusted", async () => {
  const { request } = setup({}, { trustedOrigins: [] });
  const res = await request("initech.example.com", "/sign-up/email", { method: "POST", body: signUpBody() });
  assert.notEqual(res.status, 200);
});

test("trustTenantOrigins: false leaves trustedOrigins as configured", async () => {
  const { request } = setup({ getTenantByDomain, trustTenantOrigins: false }, { trustedOrigins: [] });
  const res = await request("app.acme.test", "/sign-up/email", { method: "POST", body: signUpBody() });
  assert.equal(res.status, 403);
  assert.equal(await codeOf(res), "INVALID_ORIGIN");
});

test("the tenant is looked up once per request, not again for trustedOrigins", async () => {
  let calls = 0;
  const { request } = setup(
    {
      getTenantByDomain: (domain) => {
        calls++;
        return getTenantByDomain(domain);
      },
    },
    { trustedOrigins: [] },
  );
  const res = await request("app.acme.test", "/sign-up/email", { method: "POST", body: signUpBody() });
  assert.equal(res.status, 200, await res.clone().text());
  assert.equal(calls, 1);
});

const magicLinkSetup = (tenantBaseURL: boolean) => {
  const links: string[] = [];
  const r = setup(
    { getTenantByDomain, tenantBaseURL },
    { plugins: [magicLink({ sendMagicLink: async ({ url }) => void links.push(url) })] },
  );
  const send = (host: string) =>
    r.request(host, "/sign-in/magic-link", { method: "POST", body: { email: "user@example.com" } });
  return { ...r, links, send };
};

test("tenantBaseURL: links are built on the tenant's subdomain", async () => {
  const { send, links } = magicLinkSetup(true);
  const res = await send("globex.example.com");
  assert.equal(res.status, 200, await res.clone().text());
  assert.equal(new URL(links[0]!).origin, "http://globex.example.com");
});

test("tenantBaseURL: links are built on the tenant's custom domain", async () => {
  const { send, links } = magicLinkSetup(true);
  const res = await send("app.acme.test");
  assert.equal(res.status, 200, await res.clone().text());
  assert.equal(new URL(links[0]!).origin, "http://app.acme.test");
});

test("without tenantBaseURL, links keep the configured baseURL", async () => {
  const { send, links } = magicLinkSetup(false);
  const res = await send("globex.example.com");
  assert.equal(res.status, 200, await res.clone().text());
  assert.equal(new URL(links[0]!).origin, "http://acme.example.com");
});

test("tenantBaseURL honours the protocol option", async () => {
  const links: string[] = [];
  const { request } = setup(
    { tenantBaseURL: true, protocol: "https" },
    { plugins: [magicLink({ sendMagicLink: async ({ url }) => void links.push(url) })] },
  );
  const res = await request("globex.example.com", "/sign-in/magic-link", { method: "POST", body: { email: "user@example.com" } });
  assert.equal(res.status, 200, await res.clone().text());
  assert.equal(new URL(links[0]!).origin, "https://globex.example.com");
});
