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

The routes that take an organization, an invitation or a member from the
request are scoped to the tenant's organization as well, else
`403 ORGANIZATION_TENANT_MISMATCH` (`TEAM_TENANT_MISMATCH` for a team):

- `invite-member`, `remove-member`, `update-member-role`, `list-members`,
  `list-invitations`, `get-active-member-role`, `get-organization`,
  `get-full-organization`, `update` and `delete` refuse an explicit
  `organizationId` or `organizationSlug` that is not the tenant's. Without one
  they use the active organization, which has to be the tenant's too (a session
  that predates the bridge can still have another one active). `invite-member`
  also refuses a `teamId`, or any of several, from another organization.
- An invitation named by id (`get-invitation`, `accept-invitation`,
  `reject-invitation`, `cancel-invitation`) and a member named by id
  (`remove-member`, `update-member-role`) have to belong to the tenant's
  organization. An id that matches nothing is left to the route's own error.
- `list-user-invitations` only returns the tenant's invitations.
- `check-slug` is refused: it says whether any organization has a slug. Slugs
  stay unique across tenants, so `organization/create` still answers "slug taken"
  for another tenant's slug.

`add-member` and `leave` are not scoped: `add-member` is server-only, and
leaving another organization only removes access.

### Who may sign in to a tenant

Better Auth has one user table, so by default an account created on `acme`
signs in on `globex` too and gets a `globex` session there. Set
`canAccessTenant` to decide:

```ts
import { multiTenant, organizationMembersOnly } from "better-auth-multi-tenant";

multiTenant({
  baseDomain: "example.com",
  getTenant,
  getOrganizationId: (tenant) => tenant.organizationId,
  // Only members of the tenant's organization...
  canAccessTenant: organizationMembersOnly,
  // ...or your own rule:
  // canAccessTenant: async (user, tenant) => db.access.exists({ userId: user.id, tenantId: tenant.id }),
});
```

It runs whenever a session is created on a tenant's host, whichever plugin
creates it (password, OAuth, SSO, magic link, anonymous), and answers
`403 TENANT_ACCESS_DENIED` with no session issued. A check that throws refuses
too. Things to know:

- It runs when the session is created, not on each request. A user whose access
  you remove keeps their existing sessions until you revoke them.
- `organizationMembersOnly` needs the user to be a member *before* signing in,
  so invite and add members by another route; a self-service sign-up with
  auto sign-in is refused (the account is created, no session is). It lets
  nobody in on a tenant that has no organization.
- A wrong password is still the ordinary `401`; `TENANT_ACCESS_DENIED` is only
  answered once the credentials are right.
- **Sign-up on another tenant reveals whether the email is registered**, as in
  plain Better Auth (`422 USER_ALREADY_EXISTS`), unless Better Auth is told to
  create no session at sign-up: with `emailAndPassword.autoSignIn: false` or
  `requireEmailVerification: true` it answers a known email exactly like a new
  one (`200`, `token: null`, a stand-in user; the stand-in carries `image: null`,
  which a real user without an image does not). With auto sign-in on, a fresh
  sign-up returns a session and cookie, so no hook can make the duplicate look
  the same. Set one of those two options if this matters to you.

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

Setting either option turns the checks on. Without them SSO is untouched, so any
tenant's host can use any provider, and the plugin logs a warning at startup if
`@better-auth/sso` is installed. To fail closed instead, set
`ssoRequireTenantMapping: true`: with neither option set, every SSO route
(`/sign-in/sso` and `/sso/*`) is then refused on a tenant's host with
`403 SSO_PROVIDER_TENANT_MISMATCH` until you add a mapping. It defaults to
`false`, so existing setups keep working.

With a mapping, on a tenant's host every provider the request reaches has to
belong to the tenant, else `403 SSO_PROVIDER_TENANT_MISMATCH`:

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
- **SAML responses are bound to a host through RelayState, not through a
  cookie.** The IdP posts to the ACS URL cross-site, so no cookie ties the
  response to the browser that started the flow (a login-CSRF the SSO plugin
  does not guard either). What is bound is the tenant: when `/sign-in/sso`
  redirects to the IdP, the plugin records the RelayState that the SSO plugin put
  in the redirect URL (a standard parameter of the redirect binding) together
  with the tenant of the host. The ACS route on a tenant's host then refuses a
  RelayState that was not handed out on that tenant, or is unknown or expired
  (`SSO_PROVIDER_TENANT_MISMATCH`). This closes the case the provider check
  cannot: two tenants whose `getSSODomains` overlap both own the provider, and a
  response for a flow started on one could be posted to the other. Not covered:
  an **IdP-initiated** response carries no RelayState, so only the provider check
  applies to it (and the SSO plugin refuses it unless `allowIdpInitiated` is
  on). A flow started before you upgrade, or a version of the SSO plugin that
  stops using the redirect binding, has no record and is refused, which fails
  closed.
- **Users are global**, as ever: an SSO sign-in links to an existing account
  with the same email, on any tenant. Use `canAccessTenant` to refuse it.

`GET /sso/providers` lists only the tenant's providers (the same ownership rule
as above). Without `getOrganizationId` or `getSSODomains` it is unfiltered.

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
- With `getOrganizationId`, organization, invitation and member routes that name
  an id only work on the tenant's organization (see
  [With the `organization` plugin](#with-the-organization-plugin)).
- With `canAccessTenant`, a session is only created for a user the tenant lets
  in, whichever plugin creates it
  ([Who may sign in to a tenant](#who-may-sign-in-to-a-tenant)).
- Every session created on a tenant's host through Better Auth's internal
  adapter gets the tenant stamp from `tenantSessionHooks()`, whichever plugin
  creates it; this repository tests password, magic-link and anonymous
  sessions. One created on a request with no tenant is refused
  (`400 TENANT_REQUIRED`) and one without a stamp is refused on use
  (`403 UNBOUND_SESSION`), so a plugin that skips the adapter gets no working
  session either. `@better-auth/api-key` is a separate package that this
  repository does not install, so its sessions are not verified here: if you use
  it with sessions enabled, test that a key from one tenant is refused on
  another.
- `/revoke-sessions`, `/revoke-other-sessions` and `/change-password` with
  `revokeOtherSessions` only end the tenant's sessions
  (and any with no tenant), see `revokeScope`. Password reset
  (`revokeSessionsOnPasswordReset`) is not narrowed: it ends every session of the
  user, which is what you want after a reset.

What it does **not** do, so you can plan for it:

- **Users are global.** Better Auth has one user table, so an account created
  on `acme` can also sign in on `globex` and gets a `globex` session there,
  unless you set `canAccessTenant`. Without Better Auth's generic duplicate
  answer (`autoSignIn: false` or `requireEmailVerification: true`), sign-up on
  another tenant with the same email answers `422 USER_ALREADY_EXISTS`, which
  reveals that the email is registered somewhere. `canAccessTenant` is checked
  when a session is created, not on each request.
- **Narrowed revocation has a cost.** Because the password is global, a
  password change with `revokeOtherSessions` leaves the user's sessions on other
  tenants alive, so a stolen session there survives. Set `revokeScope: "all"` to
  end every session instead (a user then signs out of every tenant, which is
  Better Auth's behaviour). The revoke routes are changed by handing them an
  internal adapter that only lists the tenant's sessions, through the return
  value of a `before` hook; this needs a Better Auth that merges a hook's
  returned `context`, which 1.7 does and which is untested on 1.6.
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
| `canAccessTenant` | — | `(user, tenant, { organizationId, adapter }) => boolean`. Refuses sessions for users the tenant does not let in (`TENANT_ACCESS_DENIED`). `organizationMembersOnly` is a ready one. See [Who may sign in to a tenant](#who-may-sign-in-to-a-tenant). |
| `ssoRequireTenantMapping` | `false` | With SSO installed and neither `getOrganizationId` nor `getSSODomains` set, `true` refuses every SSO route on tenant hosts instead of leaving SSO unscoped. |
| `revokeScope` | `"tenant"` | `"tenant"` limits `/revoke-sessions`, `/revoke-other-sessions` and `/change-password` with `revokeOtherSessions` to the tenant's sessions; `"all"` ends every session of the user, as Better Auth does. |
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
| `TENANT_ACCESS_DENIED` | 403 | `canAccessTenant` did not let the user in; no session was created. |
| `ORGANIZATION_TENANT_MISMATCH` | 403 | `/organization/set-active` tried to activate (or clear) an organization other than the tenant's, or an organization, team, invitation or member route named another organization's (see `getOrganizationId`). |
| `TEAM_TENANT_MISMATCH` | 403 | A team route or `activeTeamId` named a team of another tenant's organization. |
| `SSO_PROVIDER_TENANT_MISMATCH` | 403 | An SSO sign-in, registration, callback, SAML response or provider route reached a provider that does not belong to the tenant, or a SAML RelayState that was not handed out on this tenant (see `getSSODomains`, `ssoRequireTenantMapping`). |

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
