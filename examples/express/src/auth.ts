import { betterAuth } from "better-auth";
import { memoryAdapter } from "better-auth/adapters/memory";
import { multiTenant, tenantSessionHooks, type Tenant } from "better-auth-multi-tenant";

const tenants: Record<string, Tenant> = {
  acme: { id: "t_acme", slug: "acme", status: "active" },
  globex: { id: "t_globex", slug: "globex", status: "active" },
};

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET ?? "example-only-secret-0123456789-abcdefghij",
  database: memoryAdapter({ user: [], session: [], account: [], verification: [] }),
  emailAndPassword: { enabled: true },
  plugins: [multiTenant({ baseDomain: "localhost", getTenant: (slug) => tenants[slug] ?? null })],
  databaseHooks: tenantSessionHooks(),
});
