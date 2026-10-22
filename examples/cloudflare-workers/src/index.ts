import { betterAuth } from "better-auth";
import { memoryAdapter } from "@better-auth/memory-adapter";
import { Hono } from "hono";
import { multiTenant, tenantSessionHooks, type Tenant } from "better-auth-multi-tenant";

interface Env {
  /** `wrangler secret put BETTER_AUTH_SECRET` in a real deployment. */
  BETTER_AUTH_SECRET?: string;
}

const tenants: Record<string, Tenant> = {
  acme: { id: "t_acme", slug: "acme", status: "active" },
  globex: { id: "t_globex", slug: "globex", status: "active" },
};

// The memory adapter lives as long as the isolate; swap it for D1 (via a Kysely
// D1 dialect or Drizzle) when sessions must survive a restart.
let auth: ReturnType<typeof createAuth> | undefined;

const createAuth = (env: Env) =>
  betterAuth({
    secret: env.BETTER_AUTH_SECRET ?? "example-only-secret-0123456789-abcdefghij",
    database: memoryAdapter({ user: [], session: [], account: [], verification: [] }),
    emailAndPassword: { enabled: true },
    plugins: [multiTenant({ baseDomain: "localhost", getTenant: (slug) => tenants[slug] ?? null })],
    databaseHooks: tenantSessionHooks(),
  });

const app = new Hono<{ Bindings: Env }>();

app.on(["GET", "POST"], "/api/auth/*", (c) => (auth ??= createAuth(c.env)).handler(c.req.raw));

export default app;
