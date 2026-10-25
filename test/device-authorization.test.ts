import { test } from "node:test";
import assert from "node:assert/strict";
import { deviceAuthorization } from "better-auth/plugins";
import type { MultiTenantOptions } from "../src/index.js";
import { setup } from "./helpers.js";

/** Better Auth's `deviceAuthorization` with `deviceCodes: true`: a code belongs to the tenant that issued it. */

const ACME = "acme.example.com";
const GLOBEX = "globex.example.com";
const GRANT = "urn:ietf:params:oauth:grant-type:device_code";

function deviceSetup(overrides: Partial<MultiTenantOptions> = { deviceCodes: true }) {
  const warnings: string[] = [];
  const ctx = setup(overrides, {
    plugins: [deviceAuthorization({ verificationUri: "/device" })],
    auth: { logger: { level: "warn", log: (level, message) => void (level === "warn" && warnings.push(message)) } },
  });
  ctx.db.deviceCode = [];

  /** Start a device flow on `host` and have a user of `approveOn` claim and approve it. */
  const approvedCode = async (host: string, approveOn = host) => {
    const cookie = await ctx.signUp(approveOn, `user-${Math.random()}@example.com`);
    const res = await ctx.request(host, "/device/code", { method: "POST", body: { client_id: "cli" } });
    assert.equal(res.status, 200, await res.clone().text());
    const code = (await res.json()) as { device_code: string; user_code: string };
    const claim = await ctx.request(approveOn, `/device?user_code=${code.user_code}`, { cookie });
    const approve = await ctx.request(approveOn, "/device/approve", { method: "POST", body: { userCode: code.user_code }, cookie });
    return { ...code, claim, approve };
  };
  const redeem = (host: string, deviceCode: string) =>
    ctx.request(host, "/device/token", { method: "POST", body: { grant_type: GRANT, device_code: deviceCode, client_id: "cli" } });
  return { ...ctx, warnings, approvedCode, redeem };
}

test("a device code is stamped with the tenant that issued it", async () => {
  const { db, approvedCode } = deviceSetup();
  const { device_code } = await approvedCode(ACME);
  assert.equal(db.deviceCode!.find((c) => c.deviceCode === device_code)!.tenantId, "t_acme");
});

test("a code approved on its tenant is redeemed there, and is invalid on another", async () => {
  const { approvedCode, redeem } = deviceSetup();
  const { device_code, approve } = await approvedCode(ACME);
  assert.equal(approve.status, 200, await approve.clone().text());

  const other = await redeem(GLOBEX, device_code);
  assert.equal(other.status, 400, await other.clone().text());
  assert.equal(((await other.json()) as { error?: string }).error, "invalid_grant");

  const own = await redeem(ACME, device_code);
  assert.equal(own.status, 200, await own.clone().text());
  assert.ok(((await own.json()) as { access_token?: string }).access_token);
});

test("another tenant cannot claim or approve a tenant's code", async () => {
  const { approvedCode } = deviceSetup();
  const { claim, approve } = await approvedCode(ACME, GLOBEX);
  assert.notEqual(claim.status, 200, await claim.clone().text());
  assert.notEqual(approve.status, 200, await approve.clone().text());
});

test("without deviceCodes the plugin warns, and deviceCodes: false silences it", async () => {
  const unset = deviceSetup({});
  await unset.request(ACME, "/ok");
  assert.ok(unset.warnings.some((w) => w.includes("deviceCodes is not set")), String(unset.warnings));

  const off = deviceSetup({ deviceCodes: false });
  await off.request(ACME, "/ok");
  assert.ok(!off.warnings.some((w) => w.includes("deviceCodes is not set")));
});

test("deviceCodes: true without the deviceAuthorization plugin fails at startup", async () => {
  const { request } = setup({ deviceCodes: true });
  await assert.rejects(async () => {
    const res = await request(ACME, "/ok");
    if (res.status >= 500) throw new Error(await res.text());
  }, /deviceCodes: true needs/);
});
