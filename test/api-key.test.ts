import { test } from "node:test";
import assert from "node:assert/strict";
import { apiKey } from "@better-auth/api-key";
import { organization } from "better-auth/plugins";
import { multiTenant, type MultiTenantOptions, type Tenant } from "../src/index.js";
import { codeOf, setup, TENANTS } from "./helpers.js";

/** `@better-auth/api-key` with `apiKeys: true`: a key belongs to the tenant it was made on. */

function keySetup(overrides: Partial<MultiTenantOptions> = {}, { apiKeyFirst = false, enableSessionForAPIKeys = true } = {}) {
  const warnings: string[] = [];
  const options = { apiKeys: true, ...overrides };
  const plugins = [apiKey({ enableSessionForAPIKeys })];
  const ctx = setup(options, {
    plugins,
    auth: {
      logger: { level: "warn", log: (level, message) => void (level === "warn" && warnings.push(message)) },
      ...(apiKeyFirst
        ? { plugins: [plugins[0]!, multiTenant({ baseDomain: "example.com", getTenant: (slug) => TENANTS[slug] ?? null, ...options })] }
        : {}),
    },
  });
  ctx.db.apikey = [];

  const createKey = async (host: string, cookie: string, body: Record<string, unknown> = {}) => {
    const res = await ctx.request(host, "/api-key/create", { method: "POST", body, cookie });
    assert.equal(res.status, 200, await res.clone().text());
    return (await res.json()) as { id: string; key: string };
  };
  return { ...ctx, warnings, createKey };
}

const sessionTenant = async (res: Response) => ((await res.json()) as { session?: { tenantId?: string } } | null)?.session?.tenantId;

test("a key is stamped with the tenant it was created on", async () => {
  const { db, signUp, createKey } = keySetup();
  const cookie = await signUp("acme.example.com");
  const { id } = await createKey("acme.example.com", cookie);
  assert.equal(db.apikey!.find((k) => k.id === id)!.tenantId, "t_acme");
});

for (const apiKeyFirst of [false, true]) {
  test(`a key used as a session works on its tenant and is refused on another (api-key plugin ${apiKeyFirst ? "first" : "second"})`, async () => {
    const { request, signUp, createKey } = keySetup({}, { apiKeyFirst });
    const cookie = await signUp("acme.example.com");
    const { key } = await createKey("acme.example.com", cookie);

    const own = await request("acme.example.com", "/get-session", { headers: { "x-api-key": key } });
    assert.equal(own.status, 200, await own.clone().text());
    assert.equal(await sessionTenant(own), "t_acme");

    const other = await request("globex.example.com", "/get-session", { headers: { "x-api-key": key } });
    assert.equal(other.status, 403);
    assert.equal(await codeOf(other), "CROSS_TENANT_SESSION");

    const write = await request("globex.example.com", "/update-user", { method: "POST", body: { name: "Mallory" }, headers: { "x-api-key": key } });
    assert.equal(write.status, 403);
  });

  test(`a request with a key resolves its tenant once (api-key plugin ${apiKeyFirst ? "first" : "second"})`, async () => {
    const seen: string[] = [];
    const { request, signUp, createKey } = keySetup({ onTenantResolved: (r, path) => void seen.push(`${r.slug} ${path}`) }, { apiKeyFirst });
    const cookie = await signUp("acme.example.com");
    const { key } = await createKey("acme.example.com", cookie);
    seen.length = 0;

    const res = await request("acme.example.com", "/get-session", { headers: { "x-api-key": key } });
    assert.equal(res.status, 200, await res.clone().text());
    assert.deepEqual(seen, ["acme /get-session"]);
  });
}

test("a key with no tenant is refused as a session unless unboundSessions is allow", async () => {
  const strict = keySetup();
  const cookie = await strict.signUp("acme.example.com");
  const { id, key } = await strict.createKey("acme.example.com", cookie);
  delete strict.db.apikey!.find((k) => k.id === id)!.tenantId;
  const res = await strict.request("acme.example.com", "/get-session", { headers: { "x-api-key": key } });
  assert.equal(res.status, 403);
  assert.equal(await codeOf(res), "UNBOUND_SESSION");

  const lax = keySetup({ unboundSessions: "allow" });
  const laxCookie = await lax.signUp("acme.example.com");
  const created = await lax.createKey("acme.example.com", laxCookie);
  delete lax.db.apikey!.find((k) => k.id === created.id)!.tenantId;
  assert.equal((await lax.request("acme.example.com", "/get-session", { headers: { "x-api-key": created.key } })).status, 200);
});

test("key routes on a tenant's host only find that tenant's keys", async () => {
  const { request, signUp, createKey } = keySetup();
  const acmeCookie = await signUp("acme.example.com");
  const acmeKey = await createKey("acme.example.com", acmeCookie);
  const globexCookie = (
    await request("globex.example.com", "/sign-in/email", {
      method: "POST",
      body: { email: "user@example.com", password: "correct-horse-battery" },
    })
  ).headers
    .get("set-cookie")!
    .split(";")[0]!;
  const globexKey = await createKey("globex.example.com", globexCookie);

  const listed = (await (await request("acme.example.com", "/api-key/list", { cookie: acmeCookie })).json()) as {
    apiKeys: { id: string }[];
    total: number;
  };
  assert.deepEqual(listed.apiKeys.map((k) => k.id), [acmeKey.id]);
  assert.equal(listed.total, 1);

  assert.equal((await request("acme.example.com", `/api-key/get?id=${acmeKey.id}`, { cookie: acmeCookie })).status, 200);
  assert.equal((await request("acme.example.com", `/api-key/get?id=${globexKey.id}`, { cookie: acmeCookie })).status, 404);
  const del = await request("acme.example.com", "/api-key/delete", { method: "POST", body: { keyId: globexKey.id }, cookie: acmeCookie });
  assert.equal(del.status, 404);
  const update = await request("acme.example.com", "/api-key/update", {
    method: "POST",
    body: { keyId: globexKey.id, name: "stolen" },
    cookie: acmeCookie,
  });
  assert.equal(update.status, 404);
});

test("auth.api.verifyApiKey with a tenant's headers only finds that tenant's keys", async () => {
  const { auth, signUp, createKey } = keySetup();
  const { key } = await createKey("acme.example.com", await signUp("acme.example.com"));
  const verify = (host: string) =>
    (auth.api as unknown as { verifyApiKey: (input: unknown) => Promise<{ valid: boolean }> }).verifyApiKey({
      body: { key },
      headers: new Headers({ host }),
    });
  assert.equal((await verify("acme.example.com")).valid, true);
  assert.equal((await verify("globex.example.com")).valid, false);
});

test("an organization's keys must belong to the tenant's organization", async () => {
  const ORG_OF: Record<string, string> = { acme: "org_acme", globex: "org_globex" };
  const getOrganizationId = (tenant: Tenant) => ORG_OF[tenant.slug];
  const plugins = [organization(), apiKey({ references: "organization" })];
  const ctx = setup({ apiKeys: true, getOrganizationId }, { plugins });
  ctx.db.apikey = [];
  const cookie = await ctx.signUp("acme.example.com");
  const userId = ctx.db.user[0]!.id as string;
  const now = new Date();
  ctx.db.organization!.push({ id: "org_acme", name: "Acme", slug: "acme", createdAt: now }, { id: "org_globex", name: "Globex", slug: "globex", createdAt: now });
  ctx.db.member!.push(
    { id: "m1", organizationId: "org_acme", userId, role: "owner", createdAt: now },
    { id: "m2", organizationId: "org_globex", userId, role: "owner", createdAt: now },
  );

  const other = await ctx.request("acme.example.com", "/api-key/create", { method: "POST", body: { organizationId: "org_globex" }, cookie });
  assert.equal(other.status, 403);
  assert.equal(await codeOf(other), "ORGANIZATION_TENANT_MISMATCH");
  const list = await ctx.request("acme.example.com", "/api-key/list?organizationId=org_globex", { cookie });
  assert.equal(list.status, 403);

  const own = await ctx.request("acme.example.com", "/api-key/create", { method: "POST", body: { organizationId: "org_acme" }, cookie });
  assert.equal(own.status, 200, await own.clone().text());
});

test("the plugin warns when api-key is installed and apiKeys is not set", async () => {
  const unset = keySetup({ apiKeys: undefined });
  await unset.request("acme.example.com", "/ok");
  assert.ok(unset.warnings.some((w) => w.includes("apiKeys is not set")), String(unset.warnings));

  const off = keySetup({ apiKeys: false });
  await off.request("acme.example.com", "/ok");
  assert.ok(!off.warnings.some((w) => w.includes("apiKeys is not set")));
});

test("apiKeys: true without the api-key plugin fails at startup", async () => {
  const { request } = setup({ apiKeys: true });
  await assert.rejects(async () => {
    const res = await request("acme.example.com", "/ok");
    if (res.status >= 500) throw new Error(await res.text());
  }, /apiKeys: true needs/);
});
