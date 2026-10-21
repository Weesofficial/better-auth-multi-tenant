import assert from "node:assert/strict";
import { betterAuth, type BetterAuthOptions, type BetterAuthPlugin } from "better-auth";
import { memoryAdapter } from "better-auth/adapters/memory";
import { multiTenant, tenantSessionHooks, type MultiTenantOptions, type Tenant } from "../src/index.js";

/** Shared fixtures for the end-to-end tests: a real Better Auth instance with the plugin installed. */

export const TENANTS: Record<string, Tenant> = {
  acme: { id: "t_acme", slug: "acme", status: "active" },
  globex: { id: "t_globex", slug: "globex", status: "active" },
  initech: { id: "t_initech", slug: "initech", status: "suspended" },
};

export function setup(
  overrides: Partial<MultiTenantOptions> = {},
  {
    trustedOrigins = ["http://*.example.com"],
    auth: authOverrides = {},
    plugins = [],
  }: { trustedOrigins?: string[]; auth?: Partial<BetterAuthOptions>; plugins?: BetterAuthPlugin[] } = {},
) {
  const db: { [model: string]: Record<string, unknown>[]; session: Record<string, unknown>[] } = {
    user: [],
    session: [],
    account: [],
    verification: [],
    organization: [],
    member: [],
    invitation: [],
  };
  const auth = betterAuth({
    secret: "test-secret-0123456789-abcdefghijklmnop",
    baseURL: "http://acme.example.com",
    trustedOrigins,
    database: memoryAdapter(db),
    emailAndPassword: { enabled: true },
    logger: { disabled: true },
    plugins: [
      multiTenant({
        baseDomain: "example.com",
        getTenant: (slug) => TENANTS[slug] ?? null,
        ...overrides,
      }),
      ...plugins,
    ],
    databaseHooks: tenantSessionHooks(),
    ...authOverrides,
  });

  const request = (host: string, path: string, init: { method?: string; body?: unknown; cookie?: string; authorization?: string } = {}) =>
    auth.handler(
      new Request(`http://${host}/api/auth${path}`, {
        method: init.method ?? "GET",
        body: init.body === undefined ? undefined : JSON.stringify(init.body),
        headers: {
          host,
          origin: `http://${host}`,
          "content-type": "application/json",
          ...(init.cookie ? { cookie: init.cookie } : {}),
          ...(init.authorization ? { authorization: init.authorization } : {}),
        },
      }),
    );

  /** Sign up on `host` and return the session cookie. */
  const signUp = async (host: string, email = "user@example.com") => {
    const res = await request(host, "/sign-up/email", {
      method: "POST",
      body: { email, password: "correct-horse-battery", name: "User" },
    });
    assert.equal(res.status, 200, await res.clone().text());
    const cookie = res.headers.get("set-cookie")?.split(";")[0];
    assert.ok(cookie, "expected a session cookie");
    return cookie;
  };

  return { auth, db, request, signUp };
}

export const codeOf = async (res: Response) => ((await res.json()) as { code?: string }).code;
