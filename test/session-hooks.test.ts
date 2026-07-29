import { test } from "node:test";
import assert from "node:assert/strict";
import { tenantSessionHooks } from "../src/session-hooks.js";
import { setTenantOnContext, type ResolvedTenant } from "../src/context.js";

const acme: ResolvedTenant = {
  slug: "acme",
  tenant: { id: "t_acme", slug: "acme", status: "active" },
  source: "host",
};

/** A stand-in for the `GenericEndpointContext` better-auth passes the hook. */
function ctxWithTenant(resolved?: ResolvedTenant) {
  const inner: Record<string, unknown> = {};
  if (resolved) setTenantOnContext(inner, resolved);
  return { context: inner };
}

const session = { id: "s_1", userId: "u_1", token: "tok" };

test("stamps the resolved tenant onto a new session", async () => {
  const hook = tenantSessionHooks().session.create.before;
  const result = await hook({ ...session }, ctxWithTenant(acme));
  assert.ok(result && typeof result === "object", "expected the hook to return data");
  assert.equal(result.data.tenantId, "t_acme");
});

test("preserves the fields better-auth already set", async () => {
  const hook = tenantSessionHooks().session.create.before;
  const result = await hook({ ...session }, ctxWithTenant(acme));
  assert.equal(result!.data.id, "s_1");
  assert.equal(result!.data.userId, "u_1");
  assert.equal(result!.data.token, "tok");
});

// Fail closed: an untagged session is one the cross-tenant guard cannot check,
// so by default we refuse to mint it rather than create a credential that works
// on every tenant.
test("refuses to create an unbound session by default", async () => {
  const hook = tenantSessionHooks().session.create.before;
  await assert.rejects(
    () => hook({ ...session }, ctxWithTenant()),
    (err: { statusCode?: number; body?: { code?: string } }) => {
      assert.equal(err.body?.code, "TENANT_REQUIRED");
      return true;
    },
  );
});

test("allows an unbound session when explicitly opted in", async () => {
  const hook = tenantSessionHooks({ onMissingTenant: "allow" }).session.create.before;
  const result = await hook({ ...session }, ctxWithTenant());
  assert.equal(result, undefined, "expected the hook to pass the session through");
});

test("tolerates a null context", async () => {
  const hook = tenantSessionHooks({ onMissingTenant: "allow" }).session.create.before;
  assert.equal(await hook({ ...session }, null), undefined);
});
