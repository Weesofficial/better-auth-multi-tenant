import { test } from "node:test";
import assert from "node:assert/strict";
import { bearer, organization } from "better-auth/plugins";
import type { Tenant } from "../src/index.js";
import { codeOf, setup } from "./helpers.js";

/**
 * Regression tests for ways around tenant isolation found in review: bearer
 * tokens, and organization endpoints other than set-active.
 */

const signUpWithToken = async (ctx: ReturnType<typeof setup>, host: string) => {
  const res = await ctx.request(host, "/sign-up/email", {
    method: "POST",
    body: { email: "user@example.com", password: "correct-horse-battery", name: "User" },
  });
  assert.equal(res.status, 200, await res.clone().text());
  const token = res.headers.get("set-auth-token");
  assert.ok(token, "expected a bearer token");
  return token;
};

test("a bearer token works on its own tenant", async () => {
  const ctx = setup({}, { plugins: [bearer()] });
  const token = await signUpWithToken(ctx, "acme.example.com");
  const res = await ctx.request("acme.example.com", "/get-session", { authorization: `Bearer ${token}` });
  assert.equal(res.status, 200);
});

test("a bearer token from another tenant is refused", async () => {
  const ctx = setup({}, { plugins: [bearer()] });
  const token = await signUpWithToken(ctx, "acme.example.com");
  const res = await ctx.request("globex.example.com", "/get-session", { authorization: `Bearer ${token}` });
  assert.equal(res.status, 403);
  assert.equal(await codeOf(res), "CROSS_TENANT_SESSION");
});

test("a foreign bearer token is refused even alongside a valid cookie", async () => {
  const ctx = setup({}, { plugins: [bearer()] });
  const globexToken = await signUpWithToken(ctx, "globex.example.com");
  const acmeCookie = await ctx.signUp("acme.example.com", "other@example.com");
  const res = await ctx.request("acme.example.com", "/get-session", {
    cookie: acmeCookie,
    authorization: `Bearer ${globexToken}`,
  });
  assert.equal(res.status, 403);
  assert.equal(await codeOf(res), "CROSS_TENANT_SESSION");
});

test("a bearer token cannot change data on another tenant", async () => {
  const ctx = setup({}, { plugins: [bearer()] });
  const token = await signUpWithToken(ctx, "acme.example.com");
  const res = await ctx.request("globex.example.com", "/update-user", {
    method: "POST",
    authorization: `Bearer ${token}`,
    body: { name: "changed" },
  });
  assert.equal(res.status, 403);
  assert.equal(ctx.db.user![0]!.name, "User");
});

const ORG_OF: Record<string, string> = { acme: "org_acme", globex: "org_globex" };
const getOrganizationId = (tenant: Tenant) => ORG_OF[tenant.slug];

function orgSetup() {
  const ctx = setup({ getOrganizationId }, { plugins: [organization()] });
  const now = new Date();
  ctx.db.organization!.push({ id: "org_acme", name: "Acme", slug: "acme", createdAt: now });
  return ctx;
}

test("creating an organization on a tenant host cannot move the active organization", async () => {
  const ctx = orgSetup();
  const cookie = await ctx.signUp("acme.example.com");
  const res = await ctx.request("acme.example.com", "/organization/create", {
    method: "POST",
    cookie,
    body: { name: "Other", slug: "other" },
  });
  assert.equal(res.status, 403);
  assert.equal(await codeOf(res), "ORGANIZATION_TENANT_MISMATCH");
  assert.equal(ctx.db.organization!.length, 1, "no half-created organization");
  assert.equal(ctx.db.session[0]!.activeOrganizationId, "org_acme");
});

test("creating an organization that keeps the current one active still works", async () => {
  const ctx = orgSetup();
  const cookie = await ctx.signUp("acme.example.com");
  const res = await ctx.request("acme.example.com", "/organization/create", {
    method: "POST",
    cookie,
    body: { name: "Other", slug: "other", keepCurrentActiveOrganization: true },
  });
  assert.equal(res.status, 200, await res.clone().text());
  assert.equal(ctx.db.session[0]!.activeOrganizationId, "org_acme");
});

test("accepting an invitation to another organization cannot move the active organization", async () => {
  const ctx = orgSetup();
  const cookie = await ctx.signUp("acme.example.com");
  const now = new Date();
  ctx.db.organization!.push({ id: "org_other", name: "Other", slug: "other", createdAt: now });
  ctx.db.invitation!.push({
    id: "inv_1",
    organizationId: "org_other",
    email: "user@example.com",
    role: "member",
    status: "pending",
    inviterId: ctx.db.user![0]!.id,
    expiresAt: new Date(Date.now() + 86_400_000),
    createdAt: now,
  });
  await ctx.request("acme.example.com", "/organization/accept-invitation", {
    method: "POST",
    cookie,
    body: { invitationId: "inv_1" },
  });
  assert.equal(ctx.db.session[0]!.activeOrganizationId, "org_acme");
});
