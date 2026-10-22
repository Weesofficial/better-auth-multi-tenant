import { getMigrations } from "better-auth/db/migration";
import { auth } from "../lib/auth";
import { ensureTenants } from "../lib/db";

// Create Better Auth's tables (including the plugin's session.tenantId column)
// and seed three demo tenants.
const { runMigrations, toBeCreated, toBeAdded } = await getMigrations(auth.options);
await runMigrations();
ensureTenants();
console.log(
  `Database ready (${toBeCreated.length} tables created, ${toBeAdded.length} tables altered). ` +
    "Run `npm run dev` and open http://acme.localhost:3000",
);
