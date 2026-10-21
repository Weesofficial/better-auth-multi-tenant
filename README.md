# better-auth-multi-tenant

[![npm version](https://img.shields.io/npm/v/better-auth-multi-tenant)](https://www.npmjs.com/package/better-auth-multi-tenant)
[![npm downloads](https://img.shields.io/npm/dm/better-auth-multi-tenant)](https://www.npmjs.com/package/better-auth-multi-tenant)
[![CI](https://github.com/Weesofficial/better-auth-multi-tenant/actions/workflows/ci.yml/badge.svg)](https://github.com/Weesofficial/better-auth-multi-tenant/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue)](./LICENSE)

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
import { multiTenant, tenantSessionHooks } from "better-auth-multi-tenant";

export const auth = betterAuth({
  plugins: [
    multiTenant({
      baseDomain: "example.com",
      getTenant: (slug) => db.tenant.findUnique({ where: { slug } }),
    }),
  ],
  // Binds every new session to the tenant it was created on.
  databaseHooks: tenantSessionHooks(),
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
tenant B's host is refused with `403 CROSS_TENANT_SESSION`. A session carrying
no tenant at all is refused with `403 UNBOUND_SESSION`, since it would otherwise
be valid on every tenant. This is the property
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

## Custom domains

Tenants can also be served from their own domain, such as `app.acme.com`,
alongside `acme.example.com`. Pass `getTenantByDomain`:

```ts
multiTenant({
  baseDomain: "example.com",
  getTenant: (slug) => db.tenant.findUnique({ where: { slug } }),
  getTenantByDomain: (domain) =>
    db.tenant.findFirst({ where: { customDomain: domain, domainVerified: true } }),
})
```

- It is called only for hosts **outside** `baseDomain`, with the host lowercased
  and the port removed. Subdomains never reach it.
- An unknown domain is a `404 TENANT_NOT_FOUND`, and an inactive tenant a
  `403 TENANT_INACTIVE`, exactly as for subdomains.
- Sessions stay bound to the tenant id, so a session from one tenant is refused
  on another tenant's custom domain with `403 CROSS_TENANT_SESSION`.
- `/multi-tenant/current` reports the custom domain as the `origin`, and the
  resolved tenant has `source: "custom-domain"` and `domain` set.

Two things are up to you:

1. **Verify ownership** before you store a mapping, for example with a DNS TXT
   record. Whoever controls the mapping controls which tenant a domain serves.
2. **Trust the origin.** Add each custom domain to Better Auth's
   `trustedOrigins`, or its CSRF checks will refuse requests from it.

## With the `organization` plugin

If each tenant is one organization in Better Auth's
[`organization` plugin](https://www.better-auth.com/docs/plugins/organization),
tell the plugin how to map them:

```ts
import { organization } from "better-auth/plugins";

betterAuth({
  plugins: [
    organization(),
    multiTenant({
      baseDomain: "example.com",
      getTenant,
      getOrganizationId: (tenant) => tenant.organizationId,
    }),
  ],
  databaseHooks: tenantSessionHooks(),
});
```

On a tenant's host:

- a new session starts with the tenant's organization as
  `activeOrganizationId`, stamped by `tenantSessionHooks()`;
- `/organization/set-active` accepts only that organization, by id or by slug.
  Switching to any other organization, or clearing it, is
  `403 ORGANIZATION_TENANT_MISMATCH`.

Membership checks stay with the `organization` plugin: the user still has to be
a member of the tenant's organization.

### Teams

With `organization({ teams: { enabled: true } })` and `getOrganizationId`, the
team routes are scoped to the tenant's organization too. On a tenant's host:

- `create-team`, `update-team`, `remove-team`, `list-teams`, `list-user-teams`,
  `add-team-member` and `remove-team-member` refuse an explicit
  `organizationId` that is not the tenant's (`ORGANIZATION_TENANT_MISMATCH`).
  Leave it out and the tenant's organization is used.
- Any route that names a team (`teamId`, including `list-team-members`, which
  finds a team by id alone) refuses a team of another organization with
  `403 TEAM_TENANT_MISMATCH`.
- A session that still has another organization active (it predates the
  bridge) cannot use the team routes until it is switched to the tenant's.
- `list-user-teams` only returns the tenant's teams. It lists the user's teams
  in every organization otherwise.
- `activeTeamId` can only be set to a team of the tenant's organization, on
  every write: `set-active-team`, accepting an invitation and so on. Clearing the active organization (leaving it, say) clears the
  active team with it.

## With `@better-auth/sso`

[`@better-auth/sso`](https://www.better-auth.com/docs/plugins/sso) is an
optional peer dependency: the plugin works without it, and nothing here loads it.
Tell the plugin which providers belong to a tenant, by organization or by
domain:

```ts
multiTenant({
  baseDomain: "example.com",
  getTenant,
  // Providers registered with `organizationId` belong to that tenant...
  getOrganizationId: (tenant) => tenant.organizationId,
  // ...and so do providers with no organization whose domains are listed here.
  getSSODomains: (tenant) => tenant.emailDomains,
});
```

Setting either option turns the checks on; without them SSO is untouched. On a
tenant's host, every provider the request reaches has to belong to the tenant,
else `403 SSO_PROVIDER_TENANT_MISMATCH`:

- **Sign-in** (`/sign-in/sso`). The provider is chosen from the tenant's own
  providers (by `providerId`, `organizationSlug`, `domain` or `email`) and then
  pinned by id before the SSO plugin runs. Two tenants sharing a domain cannot
  make a sign-in resolve to the other one's provider.
- **Registration** (`/sso/register`). `organizationId` must be the tenant's
  organization and is filled in when left out. A provider with no organization
  needs a `domain` the tenant owns.
- **Callbacks and SAML routes** (`/sso/callback/:providerId`,
  `/sso/saml2/...`) and **provider management** (`get-provider`,
  `update-provider`, `delete-provider`, the domain verification routes). The
  provider named in the path, query or body must belong to the host's tenant.
  A callback that lands on another tenant's host is refused before the SSO
  plugin reads the state or creates a user. Changing a domain-owned provider's
  `domain` to one the tenant does not own is refused too.

A provider belongs to the tenant of its organization, whatever its `domain`
says. One with no organization belongs to the tenant when **all** of its
(comma-separated) domains are one of the tenant's `getSSODomains`, or a
subdomain of one. Providers from the SSO plugin's `defaultSSO` option are not in
the database, so they belong to no tenant and are refused on tenant hosts.

The session a callback creates is stamped with the tenant of the host it lands
on (`tenantSessionHooks()`), and the provider check makes that the tenant that
started the flow, since a provider belongs to one tenant.

Limits, because the SSO plugin's callback design leaves no safe way to do more
through public hooks:

- **The callback must land on the tenant's own host.** The redirect URL is
  `{baseURL}/sso/callback/{providerId}`, so with one fixed `baseURL` every flow
  returns to one host, which is not the tenant's. Use a `baseURL` that follows
  the request host (Better Auth's dynamic `baseURL` with `allowedHosts`, where
  your version has it), and register each tenant's redirect URL with the
  identity provider. This repository's tests drive the callback on tenant hosts
  directly; they do not run a dynamic `baseURL`. A callback on a host that names no
  tenant creates no session: `tenantSessionHooks()` refuses an unbound session,
  so keep its default `onMissingTenant: "reject"` when you use SSO.
- **The shared callback is refused on a tenant's host.** With the SSO plugin's
  `redirectURI` option, `/sso/callback` learns the provider from the OAuth
  state, which only the SSO plugin can read. It cannot be checked, so it gets
  `SSO_PROVIDER_TENANT_MISMATCH` on a tenant's host.
- **SAML responses are not bound to a host.** The IdP posts to the ACS URL
  cross-site, so no cookie ties the response to the host that started the
  flow. The provider check still applies, which covers a response, or an
  IdP-initiated one, sent to the wrong tenant's host.
- **`GET /sso/providers` is not filtered.** It lists the providers the signed-in
  user administers in every organization. Filter on `organizationId` in your
  own code if tenants must not see each other's.
- **Users are global**, as ever: an SSO sign-in links to an existing account
  with the same email, on any tenant.

## Cookies across subdomains

Leave Better Auth's `advanced.crossSubDomainCookies` **off**. It puts one
session cookie on the apex domain, shared by every tenant subdomain. The
cross-tenant check still refuses that session on the wrong tenant, but signing
in to one tenant then signs the user out of every other one. The plugin logs a
warning at startup if it finds the option enabled.

## Security notes

What the plugin enforces on a tenant's host:

- A session from another tenant is refused (`403 CROSS_TENANT_SESSION`) whether
  it arrives as a cookie or as a bearer token from Better Auth's `bearer`
  plugin.
- With `getOrganizationId`, no session write can make another organization
  active: `set-active`, `organization/create` (unless
  `keepCurrentActiveOrganization: true`), accepting an invitation and so on.
  Clearing the active organization is allowed, since it only removes access.
- With `getOrganizationId`, team routes only touch the tenant's teams, and with
  `getOrganizationId` or `getSSODomains`, SSO only uses the tenant's providers.
  See [Teams](#teams) and [With `@better-auth/sso`](#with-better-authsso) for
  what is and is not covered.

What it does **not** do, so you can plan for it:

- **Users are global.** Better Auth has one user table, so an account created
  on `acme` can also sign in on `globex` and gets a `globex` session there.
  Sign-up on another tenant with the same email answers
  `422 USER_ALREADY_EXISTS`, which reveals that the email is registered
  somewhere. If accounts must belong to a tenant, check membership in your own
  code, or use the `organization` plugin's membership with
  `getOrganizationId`.
- **Suspended and unknown tenants look different**: `403 TENANT_INACTIVE`
  versus `404 TENANT_NOT_FOUND`. If that must not be visible, return `null`
  from `getTenant` for inactive tenants.
- **Your own queries are not filtered.** Scope every data query by tenant
  yourself.

Report vulnerabilities privately; see [SECURITY.md](./SECURITY.md).

## Options

| Option | Default | Description |
| --- | --- | --- |
| `baseDomain` | — | Apex domain tenants live under, e.g. `example.com`. |
| `getTenant` | — | `(slug) => Tenant \| null`. `null` becomes a 404. |
| `getTenantByDomain` | — | `(domain) => Tenant \| null` for custom domains outside `baseDomain`. See [Custom domains](#custom-domains). |
| `getOrganizationId` | — | `(tenant) => organizationId`. Locks the active organization on tenant hosts, scopes teams and `activeTeamId` to it, and ties SSO providers to it. See [With the `organization` plugin](#with-the-organization-plugin). |
| `getSSODomains` | — | `(tenant) => string[]`. Email domains a tenant owns, for SSO providers with no organization. Turns on the SSO checks. See [With `@better-auth/sso`](#with-better-authsso). |
| `reserved` | `www, api, app, admin, auth, login, static, assets, cdn, mail, docs, status` | Subdomains that never resolve. Replaces the default when set. |
| `slugPattern` | DNS label, lowercase | Shape a slug must match. |
| `allowNestedSubdomains` | `false` | Let `acme.eu.example.com` resolve to `acme`. |
| `allowHeaderOverride` | `false` | Trust a client header to name the tenant. |
| `headerName` | `x-tenant` | Header consulted when the override is on. |
| `requireTenant` | `() => true` | Whether a path must carry a tenant. |
| `enforceSessionTenant` | all but auth entry points | Paths where the session's tenant must match the host's. |
| `getSessionTenantId` | `session.session.tenantId` | How to read a session's tenant. |
| `unboundSessions` | `"reject"` | `"allow"` lets sessions with no tenant through. Use only while migrating. |
| `protocol` | `"https"` | Protocol of the `origin` returned by `/multi-tenant/current`. |
| `port` | — | Port of the `origin` returned by `/multi-tenant/current`. |
| `onTenantResolved` | — | Called after each successful resolution. |

## Error codes

| Code | Status | Meaning |
| --- | --- | --- |
| `TENANT_REQUIRED` | 400 | The path needs a tenant and the host did not name one. |
| `TENANT_NOT_FOUND` | 404 | `getTenant` (or `getTenantByDomain`) returned `null`. |
| `TENANT_INACTIVE` | 403 | The tenant's `status` is not `"active"`. |
| `CROSS_TENANT_SESSION` | 403 | The session belongs to a different tenant. |
| `UNBOUND_SESSION` | 403 | The session carries no tenant id (see `unboundSessions`). |
| `ORGANIZATION_TENANT_MISMATCH` | 403 | `/organization/set-active` tried to activate (or clear) an organization other than the tenant's, or a team route named another organization (see `getOrganizationId`). |
| `TEAM_TENANT_MISMATCH` | 403 | A team route or `activeTeamId` named a team of another tenant's organization. |
| `SSO_PROVIDER_TENANT_MISMATCH` | 403 | An SSO sign-in, registration, callback or provider route reached a provider that does not belong to the tenant (see `getSSODomains`). |

## Reading the tenant in your own code

`requireTenantFromContext` returns the tenant resolved for the request, or
throws `400 TENANT_REQUIRED` when there is none — so a path exempted by
`requireTenant` fails closed instead of crashing on `null`:

```ts
import { createAuthEndpoint } from "better-auth/api";
import { requireTenantFromContext } from "better-auth-multi-tenant";

createAuthEndpoint("/projects", { method: "GET" }, async (ctx) => {
  const { tenant } = requireTenantFromContext(ctx.context);
  return ctx.json(await db.project.findMany({ where: { tenantId: tenant.id } }));
});
```

`getTenantFromContext` is the non-throwing variant and returns `null` instead.

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

## Binding sessions to tenants

`tenantSessionHooks()` stamps each new session with the tenant its request
resolved to. It is a plain `databaseHooks` fragment rather than something the
plugin does behind your back, so it composes with hooks you already have:

```ts
databaseHooks: {
  ...tenantSessionHooks(),
  user: { create: { before: myUserHook } },
}
```

It fails closed. A session created on a request that carried no tenant is
refused, because an untagged session is one the cross-tenant guard cannot check
— in other words, a credential that works on every tenant. If you knowingly
serve sign-in from the apex domain, opt out explicitly:

```ts
tenantSessionHooks({ onMissingTenant: "allow" })
```

## Scope

Tenant resolution, session binding, cross-tenant rejection and callback origins
are implemented and tested. Query-level data isolation helpers and per-tenant
OAuth provider configuration are not in this release.

## Contributing

Issues and pull requests are welcome; see [CONTRIBUTING.md](./CONTRIBUTING.md).
Found a way to cross a tenant boundary? Please report it privately, as
described in [SECURITY.md](./SECURITY.md), rather than in a public issue.

## License

MIT
