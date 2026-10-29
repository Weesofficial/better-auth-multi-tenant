# Database per tenant

The plugin above is single-database multi-tenancy: shared tables, with a
`tenantId` on each session. If every tenant should have its own database,
Better Auth cannot switch databases per request (one instance binds one
database), so `createTenantAuth` keeps one instance per tenant:

```ts
import { createTenantAuth } from "better-auth-multi-tenant";

export const tenantAuth = createTenantAuth({
  baseDomain: "example.com",
  getTenant: (slug) => registry.tenant.findUnique({ where: { slug } }),
  // Called once per tenant while its instance stays cached.
  createAuth: (tenant) => ({
    secret: process.env.BETTER_AUTH_SECRET,
    database: new Pool({ connectionString: urlFor(tenant) }),
    emailAndPassword: { enabled: true },
    trustedOrigins: ["https://*.example.com"],
  }),
  maxSize: 100,
  onEvict: (_tenant, auth) => auth.$context.then((ctx) => closeDatabase(ctx.options.database)),
});

// Mount it where you would mount `auth.handler`, e.g. in Next.js:
export const GET = tenantAuth.handler;
export const POST = tenantAuth.handler;

// In your own server code:
const auth = await tenantAuth.getAuth(await headers());
const session = await auth.api.getSession({ headers: await headers() });
```

The tenant is resolved from the request host with the same resolver as the
plugin, and every option of [Options](../README.md#options) except `requireTenant` applies
(including `getTenantByDomain` and `getOrganizationId`). An unknown tenant is
`404 TENANT_NOT_FOUND`, an inactive one `403 TENANT_INACTIVE`, and a host that
names no tenant `400 TENANT_REQUIRED`; none of them creates an instance or
opens a database. Auth routes need a tenant on every path, because there is no
database to fall back to.

- **Isolation comes from the database.** A user or session created for one
  tenant does not exist in another tenant's database.
- **Sessions are still stamped.** Each instance has the `multiTenant` plugin
  and `tenantSessionHooks()` installed for you, so a session or token that is
  copied to another tenant's host is still refused with `CROSS_TENANT_SESSION`.
  Do not add them to `createAuth` yourself.
- **Caching.** Instances are keyed by tenant id and reused. With `maxSize`, the
  least recently used one is evicted when the cache is full and `onEvict` runs
  so you can close its connections. Requests still running on an evicted
  instance are not waited for, so size the cache above your concurrent tenants.
  `tenantAuth.evict(tenantId)` drops one instance (after a tenant's database
  moved) and `tenantAuth.evict()` drops all of them, e.g. on shutdown.
- **`createAuth` options are fixed at creation.** Changing a tenant's database
  needs an `evict`. The tenant's status and slug are re-read on every request.
- **Migrate every tenant database.** Better Auth's schema (plus
  `session.tenantId`, and `verification.tenantId` unless you pass
  `bindVerifications: false`) must exist in each one; run your migrations when
  you create a tenant. With a database per tenant the verification binding adds
  nothing, since a code issued in one tenant's database does not exist in
  another's; it only matters when instances share a database.

## Schema per tenant (Postgres)

A schema per tenant uses the same helper: one database, a `search_path` per
instance. With `pg`, set it as a connection startup option:

```ts
createAuth: (tenant) => ({
  database: new Pool({
    connectionString: process.env.DATABASE_URL,
    options: `-c search_path=${schemaFor(tenant)}`,
  }),
  // ...
}),
```

`schemaFor` must return an identifier you built and validated yourself (for
example `tenant_${tenant.id}` after checking `/^[a-z0-9_]+$/`), never a raw
request value. Create the schema and run the migrations inside it for each
tenant. Each cached instance holds its own pool, so keep `maxSize` and the pool
`max` within your connection limit. Poolers in transaction mode (PgBouncer)
often ignore startup options; use `SET search_path` per connection instead, or
a database per tenant.
