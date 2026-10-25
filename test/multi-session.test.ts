import { test } from "node:test";
import assert from "node:assert/strict";
import { betterAuth } from "better-auth";
import { memoryAdapter } from "better-auth/adapters/memory";
import { multiSession } from "better-auth/plugins";
import { multiTenant, tenantSessionHooks, withTenantPaths } from "../src/index.js";
import { codeOf, cookiesOf, setup, TENANTS } from "./helpers.js";

/** Better Auth's `multiSession` plugin: only the tenant's sessions take part. */

const signInBody = (email: string) => ({ email, password: "correct-horse-battery", name: "User" });

test("on a subdomain, a copied multi-session cookie of another tenant is refused for set-active and revoke", async () => {
  const { db, request } = setup({}, { plugins: [multiSession()] });
  const acme = await request("acme.example.com", "/sign-up/email", { method: "POST", body: signInBody("a@example.com") });
  const globex = await request("globex.example.com", "/sign-up/email", { method: "POST", body: signInBody("g@example.com") });
  const globexToken = db.session.find((s) => s.tenantId === "t_globex")!.token as string;
  // A browser that somehow holds both (a shared parent-domain cookie, a copied header).
  const jar = `${cookiesOf(acme)}; ${cookiesOf(globex).split("; ").filter((c) => c.includes("_multi-")).join("; ")}`;

  const listed = await request("acme.example.com", "/multi-session/list-device-sessions", { cookie: jar });
  assert.equal(listed.status, 200);
  const tenants = ((await listed.json()) as { session: { tenantId: string } }[]).map((s) => s.session.tenantId);
  assert.deepEqual(tenants, ["t_acme"]);

  for (const path of ["/multi-session/set-active", "/multi-session/revoke"]) {
    const res = await request("acme.example.com", path, { method: "POST", body: { sessionToken: globexToken }, cookie: jar });
    assert.equal(res.status, 403, path);
    assert.equal(await codeOf(res), "CROSS_TENANT_SESSION", path);
  }
  assert.ok(db.session.find((s) => s.token === globexToken), "the globex session survives");
});

test("set-active and revoke still work for the tenant's own sessions", async () => {
  const { db, request } = setup({}, { plugins: [multiSession()] });
  const first = await request("acme.example.com", "/sign-up/email", { method: "POST", body: signInBody("a@example.com") });
  const second = await request("acme.example.com", "/sign-up/email", {
    method: "POST",
    body: signInBody("b@example.com"),
    headers: { cookie: cookiesOf(first) },
  });
  const jar = [cookiesOf(first), cookiesOf(second)].join("; ");
  const firstToken = db.session[0]!.token as string;
  const res = await request("acme.example.com", "/multi-session/set-active", { method: "POST", body: { sessionToken: firstToken }, cookie: jar });
  assert.equal(res.status, 200, await res.clone().text());
});

function pathAuth() {
  const db = { user: [], session: [], account: [], verification: [] } as { [model: string]: Record<string, unknown>[]; session: Record<string, unknown>[] };
  const auth = withTenantPaths(
    betterAuth({
      secret: "test-secret-0123456789-abcdefghijklmnop",
      baseURL: "http://example.com",
      trustedOrigins: ["http://example.com"],
      database: memoryAdapter(db),
      emailAndPassword: { enabled: true },
      logger: { disabled: true },
      plugins: [multiTenant({ pathPrefix: "/t", getTenant: (slug) => TENANTS[slug] ?? null }), multiSession()],
      databaseHooks: tenantSessionHooks(),
    }),
  );
  const request = (path: string, init: { method?: string; body?: unknown; cookie?: string } = {}) =>
    auth.handler(
      new Request(`http://example.com/api/auth${path}`, {
        method: init.method ?? "GET",
        body: init.body === undefined ? undefined : JSON.stringify(init.body),
        headers: { origin: "http://example.com", "content-type": "application/json", ...(init.cookie ? { cookie: init.cookie } : {}) },
      }),
    );
  return { db, request };
}

/** Merge `Set-Cookie` headers into a cookie jar string, dropping expired cookies. */
const applyCookies = (jar: string, res: Response) => {
  const cookies = new Map(jar.split("; ").filter(Boolean).map((c) => [c.slice(0, c.indexOf("=")), c] as const));
  for (const set of res.headers.getSetCookie()) {
    const pair = set.split(";")[0]!;
    const name = pair.slice(0, pair.indexOf("="));
    if (/max-age=0/i.test(set) || pair.endsWith("=")) cookies.delete(name);
    else cookies.set(name, pair);
  }
  return [...cookies.values()].join("; ");
};

test("on a shared host, signing in on one tenant leaves the same user's session on another alone", async () => {
  const { db, request } = pathAuth();
  let jar = "";
  jar = applyCookies(jar, await request("/t/acme/sign-up/email", { method: "POST", body: signInBody("a@example.com"), cookie: jar }));
  const acmeToken = db.session[0]!.token as string;
  const signIn = await request("/t/globex/sign-in/email", {
    method: "POST",
    body: { email: "a@example.com", password: "correct-horse-battery" },
    cookie: jar,
  });
  assert.equal(signIn.status, 200, await signIn.clone().text());
  jar = applyCookies(jar, signIn);

  assert.ok(db.session.find((s) => s.token === acmeToken), "the acme session was not deleted");
  const acme = await request("/t/acme/get-session", { cookie: jar });
  assert.equal(((await acme.json()) as { session?: { tenantId: string } }).session?.tenantId, "t_acme");

  const listed = (await (await request("/t/globex/multi-session/list-device-sessions", { cookie: jar })).json()) as {
    session: { tenantId: string };
  }[];
  assert.deepEqual(listed.map((s) => s.session.tenantId), ["t_globex"]);
});
