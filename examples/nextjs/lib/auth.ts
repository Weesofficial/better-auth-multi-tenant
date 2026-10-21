import { betterAuth } from "better-auth";
import { multiTenant, tenantSessionHooks } from "better-auth-multi-tenant";
import { db, findTenant } from "./db";

export const ORIGIN_PORT = 3000;

export const auth = betterAuth({
  database: db,
  emailAndPassword: { enabled: true },
  // Every tenant subdomain of localhost:3000. Browsers resolve *.localhost to
  // 127.0.0.1, so no /etc/hosts edits are needed.
  trustedOrigins: [`http://*.localhost:${ORIGIN_PORT}`],
  plugins: [
    multiTenant({
      baseDomain: "localhost",
      getTenant: findTenant,
      protocol: "http",
      port: ORIGIN_PORT,
      // The apex (http://localhost:3000) is a tenant picker, not a tenant.
      requireTenant: (path) => path !== "/ok",
    }),
  ],
  databaseHooks: tenantSessionHooks(),
});
