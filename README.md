# better-auth-multi-tenant

Subdomain-based multi-tenancy for [Better Auth](https://better-auth.com).

Resolves `acme.example.com` to a tenant, binds sessions to the tenant they were
issued for, and refuses a session that shows up on another tenant's host.

```bash
npm install better-auth-multi-tenant
```

## Why this exists

Better Auth's official `organization` plugin gives you organizations, members,
roles, invitations and an active-organization field on the session. It does not
cover the infrastructure half of multi-tenancy, and says so: subdomain-based
tenant resolution, request-scoped isolation and per-tenant callback origins are
left to you.

Those are exactly the parts that are easy to get subtly wrong. This plugin
handles them, and defaults to failing closed when it is unsure.

It is designed to sit **alongside** the `organization` plugin, not replace it.
Organizations model who belongs to what; this models which tenant a request is
for.

## Usage

```ts
import { betterAuth } from "better-auth";
import { multiTenant } from "better-auth-multi-tenant";

export const auth = betterAuth({
  plugins: [
    multiTenant({
      baseDomain: "example.com",
      getTenant: (slug) => db.tenant.findUnique({ where: { slug } }),
    }),
  ],
});
```

Client:

```ts
import { createAuthClient } from "better-auth/client";
import { multiTenantClient } from "better-auth-multi-tenant/client";

export const authClient = createAuthClient({
  plugins: [multiTenantClient()],
});

const { data } = await authClient.multiTenant.current();
// { id: "t_123", slug: "acme", origin: "https://acme.example.com" }
```

Add the session column:

```bash
npx @better-auth/cli migrate
```

## What it does

**Tenant resolution.** The tenant comes from the request's `Host` header, so it
is decided by DNS and TLS rather than by anything the caller can edit. `www`,
`api`, `app`, `admin` and friends are reserved and never resolve to a tenant.

**Cross-tenant rejection.** A session carrying `tenantId: A` that arrives on
tenant B's host is refused with `403 CROSS_TENANT_SESSION`. This is the property
worth testing in your own suite — see [Testing isolation](#testing-isolation).

**Fail closed.** `requireTenant` defaults to requiring a tenant on every path. A
route that forgets to opt in returns 400 instead of quietly serving data from
whichever tenant it happened to resolve last.

**Per-tenant callback origins.** `tenantOrigin(slug, { baseDomain })` builds the
origin a tenant's OAuth flow must return to, so one deployment can serve every
subdomain against a wildcard redirect registration instead of a hardcoded apex.

## The `x-tenant` header

A tenant header is convenient in development, where you rarely have wildcard
DNS pointed at localhost. It is also completely client-controlled: if you trust
it in production, any authenticated user can address any tenant by editing one
header.

So it is **off by default**, and enabling it is explicit:

```ts
multiTenant({
  baseDomain: "example.com",
  getTenant,
  // Never true in production.
  allowHeaderOverride: process.env.NODE_ENV !== "production",
})
```

When enabled, the header value is still validated against the same slug pattern
and reserved list as a subdomain.

## Options

| Option | Default | Description |
| --- | --- | --- |
| `baseDomain` | — | Apex domain tenants live under, e.g. `example.com`. |
| `getTenant` | — | `(slug) => Tenant \| null`. `null` becomes a 404. |
| `reserved` | `www, api, app, admin, auth, login, static, assets, cdn, mail, docs, status` | Subdomains that never resolve. Replaces the default when set. |
| `slugPattern` | DNS label, lowercase | Shape a slug must match. |
| `allowNestedSubdomains` | `false` | Let `acme.eu.example.com` resolve to `acme`. |
| `allowHeaderOverride` | `false` | Trust a client header to name the tenant. |
| `headerName` | `x-tenant` | Header consulted when the override is on. |
| `requireTenant` | `() => true` | Whether a path must carry a tenant. |
| `enforceSessionTenant` | all but auth entry points | Paths where the session's tenant must match the host's. |
| `getSessionTenantId` | `session.session.tenantId` | How to read a session's tenant. |
| `onTenantResolved` | — | Called after each successful resolution. |

## Error codes

| Code | Status | Meaning |
| --- | --- | --- |
| `TENANT_REQUIRED` | 400 | The path needs a tenant and the host did not name one. |
| `TENANT_NOT_FOUND` | 404 | `getTenant` returned `null`. |
| `TENANT_INACTIVE` | 403 | The tenant's `status` is not `"active"`. |
| `CROSS_TENANT_SESSION` | 403 | The session belongs to a different tenant. |

## Testing isolation

Cross-tenant isolation is the one property worth a dedicated regression test,
because it breaks silently — a route that forgets to check reads the wrong
tenant's rows and returns 200. Assert the refusal directly:

```ts
for (const path of ["/api/students", "/api/invoices", "/api/reports"]) {
  test(`cross-tenant ${path} is refused`, async () => {
    const res = await fetch(`https://other-tenant.example.com${path}`, {
      headers: { cookie: sessionCookieForTenantA },
    });
    assert.equal(res.status, 403);
  });
}
```

## Scope

This is `0.1.0`. Tenant resolution, cross-tenant session rejection and callback
origins are implemented and tested. Query-level data isolation helpers and
per-tenant OAuth provider configuration are not in this release.

Stamping `session.tenantId` at sign-in is left to your `databaseHooks` for now,
so the plugin does not take ownership of session creation:

```ts
databaseHooks: {
  session: {
    create: {
      before: async (session, ctx) => {
        const resolved = getTenantFromContext(ctx?.context);
        return { data: { ...session, tenantId: resolved?.tenant.id } };
      },
    },
  },
}
```

## Contributing

Issues and pull requests are welcome.

```bash
npm install
npm run typecheck
npm test
```

## License

MIT
