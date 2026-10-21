import { test } from "node:test";
import assert from "node:assert/strict";
import { organization } from "better-auth/plugins";
import type { Tenant } from "../src/index.js";
import { codeOf, setup } from "./helpers.js";

/**
 * Bridge to Better Auth's `organization` plugin: each tenant maps to one
 * organization, new sessions start with it active, and a tenant's host will
 * not switch the session to any other organization.
 */

const ORG_OF: Record<string, string> = { acme: "org_acme", globex: "org_globex" };
const getOrganizationId = (tenant: Tenant) => ORG_OF[tenant.slug];

function orgSetup(withBridge = true) {
  const ctx = setup(withBridge ? { getOrganizationId } : {}, { plugins: [organization()] });
  const now = new Date();
  ctx.db.organization!.push(
    { id: "org_acme", name: "Acme", slug: "acme", createdAt: now },
    { id: "org_globex", name: "Globex", slug: "globex", createdAt: now },
  );
  /** Make the (only) user a member of both organizations. */
  const joinBoth = () => {
    const userId = ctx.db.user![0]!.id;
    ctx.db.member!.push(
      { id: "m_acme", organizationId: "org_acme", userId, role: "owner", createdAt: now },
      { id: "m_globex", organizationId: "org_globex", userId, role: "owner", createdAt: now },
    );
  };
  const setActive = (cookie: string, body: Record<string, unknown>) =>
    ctx.request("acme.example.com", "/organization/set-active", { method: "POST", body, cookie });
  return { ...ctx, joinBoth, setActive };
}

test("a new session starts with the tenant's organization active", async () => {
  const { db, signUp } = orgSetup();
  await signUp("acme.example.com");
  assert.equal(db.session[0]!.activeOrganizationId, "org_acme");
});

test("the tenant's own organization can be set active", async () => {
  const { joinBoth, setActive, signUp } = orgSetup();
  const cookie = await signUp("acme.example.com");
  joinBoth();
  const res = await setActive(cookie, { organizationId: "org_acme" });
  assert.equal(res.status, 200, await res.clone().text());
});

test("another organization cannot be set active on a tenant's host", async () => {
  const { joinBoth, setActive, signUp } = orgSetup();
  const cookie = await signUp("acme.example.com");
  joinBoth();
  const res = await setActive(cookie, { organizationId: "org_globex" });
  assert.equal(res.status, 403);
  assert.equal(await codeOf(res), "ORGANIZATION_TENANT_MISMATCH");
});

test("another organization cannot be set active by slug either", async () => {
  const { joinBoth, setActive, signUp } = orgSetup();
  const cookie = await signUp("acme.example.com");
  joinBoth();
  const res = await setActive(cookie, { organizationSlug: "globex" });
  assert.equal(res.status, 403);
  assert.equal(await codeOf(res), "ORGANIZATION_TENANT_MISMATCH");
});

test("the active organization cannot be cleared on a tenant's host", async () => {
  const { joinBoth, setActive, signUp } = orgSetup();
  const cookie = await signUp("acme.example.com");
  joinBoth();
  const res = await setActive(cookie, { organizationId: null });
  assert.equal(res.status, 403);
  assert.equal(await codeOf(res), "ORGANIZATION_TENANT_MISMATCH");
});

test("without getOrganizationId the organization plugin behaves as usual", async () => {
  const { db, joinBoth, setActive, signUp } = orgSetup(false);
  const cookie = await signUp("acme.example.com");
  assert.equal(db.session[0]!.activeOrganizationId ?? null, null);
  joinBoth();
  const res = await setActive(cookie, { organizationId: "org_globex" });
  assert.equal(res.status, 200, await res.clone().text());
});
