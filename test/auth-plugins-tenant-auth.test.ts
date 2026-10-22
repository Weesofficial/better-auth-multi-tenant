import { test } from "node:test";
import assert from "node:assert/strict";
import { memoryAdapter } from "better-auth/adapters/memory";
import { magicLink, twoFactor } from "better-auth/plugins";
import { createTenantAuth, type Tenant } from "../src/index.js";
import { codeOf, cookiesOf, TENANTS } from "./helpers.js";

/**
 * `createTenantAuth` with the plugins whose codes and cookies matter most. With a
 * database per tenant the other tenant's instance has never seen a code; with one
 * database shared by every instance, the verification binding is what refuses it.
 */

const ACME = "acme.example.com";
const GLOBEX = "globex.example.com";
const EMAIL = "user@example.com";
const PASSWORD = "correct-horse-battery";
const MODELS = ["user", "session", "account", "verification", "twoFactor"];

type Rows = Record<string, unknown>[];
const newDb = () => Object.fromEntries(MODELS.map((m) => [m, [] as Rows])) as Record<string, Rows>;

function tenantSetup(shared: boolean) {
  const dbs: Record<string, Record<string, Rows>> = shared ? { acme: newDb(), globex: undefined as never } : { acme: newDb(), globex: newDb() };
  if (shared) dbs.globex = dbs.acme!;
  const sent = { links: [] as string[], otps: [] as string[] };
  const tenantAuth = createTenantAuth({
    baseDomain: "example.com",
    getTenant: (slug) => TENANTS[slug] ?? null,
    createAuth: (tenant: Tenant) => ({
      secret: "test-secret-0123456789-abcdefghijklmnop",
      baseURL: `http://${tenant.slug}.example.com`,
      trustedOrigins: ["http://*.example.com"],
      database: memoryAdapter(dbs[tenant.slug]!),
      emailAndPassword: { enabled: true },
      logger: { disabled: true },
      plugins: [
        magicLink({ sendMagicLink: async ({ token }) => void sent.links.push(token) }),
        twoFactor({ skipVerificationOnEnable: true, otpOptions: { sendOTP: async ({ otp }) => void sent.otps.push(otp) } }),
      ],
    }),
  });
  const request = (host: string, path: string, init: { body?: unknown; cookie?: string; method?: string } = {}) =>
    tenantAuth.handler(
      new Request(`http://${host}/api/auth${path}`, {
        method: init.method ?? (init.body === undefined ? "GET" : "POST"),
        body: init.body === undefined ? undefined : JSON.stringify(init.body),
        headers: { host, origin: `http://${host}`, "content-type": "application/json", ...(init.cookie ? { cookie: init.cookie } : {}) },
      }),
    );
  return { dbs, sent, request };
}

for (const shared of [false, true]) {
  const label = shared ? "one shared database" : "a database per tenant";

  test(`${label}: a magic link followed on another tenant creates no session`, async () => {
    const { dbs, sent, request } = tenantSetup(shared);
    await request(ACME, "/sign-in/magic-link", { body: { email: EMAIL } });
    const other = await request(GLOBEX, `/magic-link/verify?token=${sent.links.at(-1)}`);
    assert.ok(other.status === 403 || other.status === 302, String(other.status));
    assert.equal(dbs.globex!.session!.length, 0);
    assert.equal(dbs.acme!.session!.length, 0);

    const own = await request(ACME, `/magic-link/verify?token=${sent.links.at(-1)}`);
    assert.equal(own.status, 200, await own.clone().text());
  });

  test(`${label}: a two-factor challenge cannot be completed on another tenant`, async () => {
    const { dbs, sent, request } = tenantSetup(shared);
    const signUp = await request(ACME, "/sign-up/email", { body: { email: EMAIL, password: PASSWORD, name: "User" } });
    const enabled = await request(ACME, "/two-factor/enable", { cookie: cookiesOf(signUp), body: { password: PASSWORD, method: "otp" } });
    assert.equal(enabled.status, 200, await enabled.clone().text());
    const signIn = await request(ACME, "/sign-in/email", { body: { email: EMAIL, password: PASSWORD } });
    const pending = cookiesOf(signIn);
    await request(ACME, "/two-factor/send-otp", { cookie: pending, body: {} });
    const code = sent.otps.at(-1);

    const sessions = dbs.acme!.session!.length;
    const other = await request(GLOBEX, "/two-factor/verify-otp", { cookie: pending, body: { code } });
    assert.ok(other.status >= 400, await other.clone().text());
    assert.equal(dbs.acme!.session!.length, sessions);
    assert.equal(dbs.globex!.session!.length, shared ? sessions : 0);

    const own = await request(ACME, "/two-factor/verify-otp", { cookie: pending, body: { code } });
    assert.equal(own.status, 200, await own.clone().text());
  });
}

test("one shared database: the refusal comes from the verification binding", async () => {
  const { sent, request } = tenantSetup(true);
  await request(ACME, "/sign-in/magic-link", { body: { email: EMAIL } });
  const other = await request(GLOBEX, `/magic-link/verify?token=${sent.links.at(-1)}`);
  assert.equal(other.status, 403);
  assert.equal(await codeOf(other), "VERIFICATION_TENANT_MISMATCH");
});
