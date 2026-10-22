import assert from "node:assert/strict";
import test from "node:test";
import { createAuthClient } from "better-auth/client";
import { getTenant, multiTenantClient, type TenantClient, type TenantErrorCode } from "../src/client.js";
import { setup } from "./helpers.js";

/** A real client whose requests go straight to the auth instance, addressed to `host`. */
function clientFor(host: string) {
  const { auth } = setup();
  return createAuthClient({
    baseURL: `http://${host}`,
    plugins: [multiTenantClient()],
    fetchOptions: {
      customFetchImpl: (url, init) => {
        const request = new Request(url, init);
        request.headers.set("host", host);
        return auth.handler(request);
      },
    },
  });
}

test("getTenant returns the tenant of the host", async () => {
  const result = await getTenant(clientFor("acme.example.com"));
  assert.deepEqual(result, {
    tenant: { id: "t_acme", slug: "acme", origin: "https://acme.example.com" },
    error: null,
  });
});

test("getTenant types the plugin's error codes", async () => {
  const unknown = await getTenant(clientFor("nope.example.com"));
  assert.equal(unknown.tenant, null);
  assert.equal(unknown.error?.status, 404);
  assert.equal(unknown.error?.code, "TENANT_NOT_FOUND");

  const suspended = await getTenant(clientFor("initech.example.com"));
  assert.equal(suspended.error?.code, "TENANT_INACTIVE");

  const apex = await getTenant(clientFor("example.com"));
  assert.equal(apex.error?.code, "TENANT_REQUIRED");

  // The union narrows: a code exists only on the error branch.
  if (suspended.error) {
    const code: TenantErrorCode | undefined = suspended.error.code;
    assert.ok(code);
  }
});

test("getTenant drops an error code that is not the plugin's", async () => {
  const client: TenantClient = {
    multiTenant: {
      current: async () => ({ data: null, error: { status: 429, statusText: "Too Many Requests", code: "RATE_LIMITED" } }),
    },
  };
  const { error } = await getTenant(client);
  assert.deepEqual(error, { status: 429, statusText: "Too Many Requests", message: undefined, code: undefined });
});

test("getTenant fails closed on a network error or an unexpected body", async () => {
  const offline: TenantClient = {
    multiTenant: {
      current: async () => {
        throw new TypeError("fetch failed");
      },
    },
  };
  const down = await getTenant(offline);
  assert.equal(down.tenant, null);
  assert.deepEqual(down.error, { status: 0, statusText: "Network Error", message: "fetch failed" });

  // A 200 from something that is not this plugin (a captive portal, a proxy page).
  const html: TenantClient = { multiTenant: { current: async () => ({ data: "<html>" as never, error: null }) } };
  const weird = await getTenant(html);
  assert.equal(weird.tenant, null);
  assert.equal(weird.error?.status, 0);
});
