# better-auth-multi-tenant

[![npm version](https://img.shields.io/npm/v/better-auth-multi-tenant)](https://www.npmjs.com/package/better-auth-multi-tenant)
[![npm downloads](https://img.shields.io/npm/dm/better-auth-multi-tenant)](https://www.npmjs.com/package/better-auth-multi-tenant)
[![CI](https://github.com/Weesofficial/better-auth-multi-tenant/actions/workflows/ci.yml/badge.svg)](https://github.com/Weesofficial/better-auth-multi-tenant/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue)](./LICENSE)

Multi-tenancy for [Better Auth](https://better-auth.com), by subdomain, custom
domain or path.

Resolves `acme.example.com` (or `app.acme.com`, or `example.com/…/t/acme`) to a
tenant, binds sessions to the tenant they were issued for, and refuses a session
that shows up on another tenant.

```bash
npm install better-auth-multi-tenant
```

A runnable Next.js demo lives in [`examples/nextjs`](./examples/nextjs).

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

Add the `session.tenantId` and `verification.tenantId` columns:

```bash
npx @better-auth/cli migrate
```

`verification.tenantId` binds codes and tokens to a tenant, see
[Authentication plugins](#authentication-plugins); pass
`bindVerifications: false` if you do not want that column.

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

Any host outside `baseDomain` reaches `getTenantByDomain`, so a client can make
it query your database with made-up hosts. Wrap it in
`cacheTenantLookup(..., { ttl, cacheMisses: true })` so repeated unknown hosts
are answered from memory (see [Caching tenant lookups](#caching-tenant-lookups)).

## Choosing how tenants are addressed

| Mode | Example | Option | Cookies | Pick it when |
| --- | --- | --- | --- | --- |
| Subdomain | `acme.example.com` | `baseDomain` | Apart by host | Most SaaS apps. Needs wildcard DNS and TLS. |
| Custom domain | `app.acme.com` | `getTenantByDomain` (with `baseDomain`) | Apart by host | Customers bring their own domain. You verify ownership. |
| Path | `example.com/api/auth/t/acme/…` | `pathPrefix` | One name per tenant (`tenantCookies`) | One host for everyone: no wildcard DNS, an early product, an internal tool. |
| Your own | anything on the request | `getTenantSlug` | Apart by host, or `tenantCookies` | None of the above fits. |

Set exactly one of `baseDomain`, `pathPrefix` and `getTenantSlug`; the plugin
throws at startup otherwise. Session binding, `canAccessTenant`, the
verification binding, teams, SSO, admin and API keys work the same in every mode.

## Path-based tenants

With `pathPrefix`, a tenant is named in the auth URL:
`/api/auth/t/acme/sign-in/email` is the `/sign-in/email` route for `acme`.
Wrap the instance in `withTenantPaths`, which takes the prefix off before Better
Auth sees the request, and point each tenant's client at its own base URL:

```ts
import { betterAuth } from "better-auth";
import { multiTenant, organizationMembersOnly, tenantSessionHooks, withTenantPaths } from "better-auth-multi-tenant";

export const auth = withTenantPaths(
  betterAuth({
    plugins: [
      multiTenant({
        pathPrefix: "/t",
        getTenant: (slug) => db.tenant.findUnique({ where: { slug } }),
        getOrganizationId: (tenant) => tenant.organizationId,
        canAccessTenant: organizationMembersOnly,
      }),
    ],
    databaseHooks: tenantSessionHooks(),
  }),
);

// In the browser, on /acme/…
const authClient = createAuthClient({ baseURL: `${location.origin}/api/auth/t/${slug}` });
```

- **Pass the wrapped `auth` everywhere** you would pass `auth`, including
  `toNodeHandler(auth)` and `svelteKitHandler({ auth })`. Without it, prefixed
  URLs are `404` and unprefixed ones are `400 TENANT_REQUIRED`.
- **Rate limits and `disabledPaths` see the route without the prefix**, so
  Better Auth's sign-in limit is one bucket across all tenants, not one per tenant.
- **Each tenant gets its own cookie names** (`better-auth.acme.session_token`),
  so one browser can be signed in to several tenants at once, and other tenants'
  cookies are hidden from the request. If you read the cookie yourself (Next.js
  middleware), pass `cookiePrefix: "better-auth.acme"` to `getSessionCookie`.
- **Links follow the tenant.** Magic links, email verification and OAuth
  redirect URIs are built under `/api/auth/t/<slug>`, so register each
  tenant's redirect URI with your OAuth providers (or use one provider app per
  tenant with `createTenantAuth`).
- **Tenants share one origin in the browser.** Every tenant's cookies go with
  every request to the host, and a page under `/t/globex` is same-origin with
  `/api/auth/t/acme`, so script running on one tenant's pages can act as the
  signed-in user on every other tenant; Better Auth's CSRF check and
  `sameOriginOnly` cannot tell them apart. Do not serve tenant-authored HTML or
  script from the shared origin. If tenants customise their pages, or one XSS
  must not reach every tenant, use subdomains instead.
- **The URL is chosen by the client**, unlike a host backed by DNS. Session
  binding still refuses another tenant's session, but anyone can sign in to any
  tenant unless you set `canAccessTenant`. Set it.
- **Server code** that calls `auth.api` for a page under `/acme/…` names the
  tenant with `tenantPathRequest`:

  ```ts
  const session = await auth.api.getSession({
    headers: request.headers,
    request: tenantPathRequest(request, params.tenant),
    asResponse: false,
  });
  ```

`createTenantAuth` takes `pathPrefix` too (and `basePath`, default `/api/auth`);
its `handler` does the unwrapping itself.

## Your own resolver

`getTenantSlug` decides the tenant from anything on the request. It gets
`{ headers, request, path }` and returns a slug or `null`; the slug still has to
pass `reserved` and `slugPattern`:

```ts
multiTenant({
  // Set by your edge middleware, which strips any copy the client sent.
  getTenantSlug: ({ headers }) => headers.get("x-internal-tenant"),
  getTenant,
  canAccessTenant: organizationMembersOnly,
})
```

Read only what the client cannot choose, or rely on `canAccessTenant`. Set
`baseDomain` as well if `/multi-tenant/current` should report subdomain origins,
and `tenantCookies: true` if tenants share a host.

## Caching tenant lookups

`getTenant` runs on every request, `get-session` included. Put
`cacheTenantLookup` in front of it (or of `getTenantByDomain`):

```ts
import { cacheTenantLookup } from "better-auth-multi-tenant";

const getTenant = cacheTenantLookup((slug) => db.tenant.findUnique({ where: { slug } }), { ttl: 60_000 });
multiTenant({ baseDomain: "example.com", getTenant });

// After you suspend, delete or rename a tenant:
getTenant.invalidate(tenant.id); // or a slug, or nothing for everything
```

The cache lives in the process (or isolate), shares one lookup between
concurrent requests for the same slug, and keeps 1000 entries by default
(`maxSize`). Unknown slugs are not cached unless you set `cacheMisses: true`. A
change you make to a tenant applies after at most `ttl`, or at once with
`invalidate`.

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
  `403 ORGANIZATION_TENANT_MISMATCH`;
- every other `/organization/*` endpoint refuses an `organizationId` or
  `organizationSlug` (in the body or the query) that is not the tenant's, also
  with `403 ORGANIZATION_TENANT_MISMATCH`. An unknown slug is refused too;
- `/organization/list` returns only the tenant's organization.

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
team routes are scoped to the tenant's organization too (the `teams` option,
on by default with `getOrganizationId`; `teams: false` leaves teams unscoped
while the other organization checks stay). On a tenant's host:

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

Setting either option turns the checks on (the `sso` option; `sso: false` turns
them off again even with a mapping, `sso: true` without a mapping throws at
startup). Without them SSO is untouched, so any
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

### Admin plugin

With `getOrganizationId`, Better Auth's
[`admin` plugin](https://www.better-auth.com/docs/plugins/admin) only reaches the
tenant's members on its host (`admin`, on by default with
`getOrganizationId`):

- `/admin/list-users` lists and counts members of the tenant's organization only,
  with the caller's search and filters applied on top.
- A route that names a user (`get-user`, `set-role`, `update-user`, `ban-user`,
  `unban-user`, `impersonate-user`, `remove-user`, `set-user-password`,
  `list-user-sessions`, `revoke-user-sessions`) refuses anyone else with
  `403 ADMIN_TENANT_MISMATCH`.
- `list-user-sessions` and `revoke-user-sessions` see the tenant's sessions only,
  and `revoke-user-session` refuses another tenant's session.
- An impersonation session is bound to the tenant it was started on.

Better Auth's admin role is a field of the global user, so on its own it would
make an admin of one tenant an admin of every tenant they can get a session on.
On a tenant's host the caller must also administer that tenant
(`canAdministerTenant`), else `403 ADMIN_NOT_TENANT_ADMIN`. The default,
`organizationAdminsOnly`, accepts an `owner` or `admin` member of the tenant's
organization; pass your own function for platform staff:

```ts
multiTenant({
  // ...
  canAdministerTenant: async (user, tenant, ctx) =>
    user.email.endsWith("@yourcompany.com") || organizationAdminsOnly(user, tenant, ctx),
});
```

Passwords, emails, roles and bans are global too, so changing them for a user who
also belongs to another tenant would change them there as well: a password set
by one tenant's admin would sign in as the user on the other tenant. The routes
that do this (`set-user-password`, `update-user`, `set-role`, `ban-user`,
`unban-user`, `remove-user`) refuse a user who is a member of any other
organization with `403 ADMIN_SHARED_USER`. Session routes and impersonation
still work for them. `adminSharedUsers: "allow"` lifts the refusal.

Roles are global too, and many apps read `user.role` as a platform-wide
permission, so `create-user` and `set-role` on a tenant's host cannot give out
one of the admin plugin's `adminRoles` (default `["admin"]`):
`403 ADMIN_ROLE_NOT_ASSIGNABLE`. Other roles work as before.
`adminRoleAssignment: "allow"` lifts the refusal.

`create-user` is not scoped otherwise: add the new user to the tenant's
organization yourself, and note that it answers `USER_ALREADY_EXISTS` for an
email registered on any tenant. Without `getOrganizationId` the plugin logs a
warning that admin routes are unscoped; `admin: false` turns the scoping and the
warning off.

## Sessions across tenants

One user can be signed in to several tenants, and Better Auth lists and revokes
sessions per user. On a tenant's host:

- `/list-sessions` returns only that tenant's sessions. Without this, a script
  running on one tenant's host could read the session tokens of every other
  tenant the user is signed in to.
- `/revoke-session` refuses a token that belongs to another tenant
  (`403 CROSS_TENANT_SESSION`).

`/revoke-sessions`, `/revoke-other-sessions` and `revokeOtherSessions` on
password change end only the tenant's sessions by default (`revokeScope`), so
one tenant cannot sign the user out of the others. A password change therefore
leaves the user's sessions on other tenants alive; set `revokeScope: "all"` for
Better Auth's behaviour.

## Authentication plugins

Better Auth's `twoFactor`, `username`, `anonymous`, `phoneNumber`, `magicLink`,
`emailOTP`, `passkey` (`@better-auth/passkey`), `genericOAuth`, `oneTap` and
`siwe` plugins all work with this plugin, each with end-to-end tests. Their
sessions are stamped with the tenant, refused on another and gated by
`canAccessTenant`. In addition, anything a plugin hands out as a verification row
(magic-link token, email and phone OTP, two-factor challenge and trusted-device
record, passkey challenge, SIWE nonce, OAuth state) is bound to the tenant that
issued it: redeeming it on another tenant's host is refused with
`403 VERIFICATION_TENANT_MISMATCH` (`bindVerifications`, on by default). A link
that is emailed (magic link, OAuth callback) must open on the tenant that sent
it, so use a `baseURL` that follows the request host.

[docs/auth-plugins.md](./docs/auth-plugins.md) has the compatibility table, the
answers per plugin, and how to configure a relying party, SIWE domain, Google
client id or OAuth redirect per tenant. Gaps that only Better Auth can close are
written up in [docs/upstream-proposals.md](./docs/upstream-proposals.md).

### Multi-session

With Better Auth's `multiSession` plugin, `/multi-session/list-device-sessions`
returns only the tenant's sessions, and `/multi-session/set-active` or
`/multi-session/revoke` with another tenant's session is refused with
`403 CROSS_TENANT_SESSION`. On subdomains its cookies are host cookies and
already apart; this matters when tenants share a host (path mode), where signing
in on one tenant no longer signs the same user out of another.

### API keys

`@better-auth/api-key` keys belong to a user or an organization, and users are
global, so by default a key made on one tenant works on every other. Set
`apiKeys: true` (and migrate the `apikey.tenantId` column) to bind each key to
the tenant it was created on:

- A key used as a session (`enableSessionForAPIKeys`) is refused on another
  tenant with `403 CROSS_TENANT_SESSION`, and a key with no tenant with
  `403 UNBOUND_SESSION` (unless `unboundSessions: "allow"`). This holds whichever
  order the two plugins are listed in.
- On a tenant's host, `/api-key/get`, `list`, `update` and `delete` only find
  that tenant's keys; another tenant's key is `404`. So does
  `auth.api.verifyApiKey` when you pass it the request's headers: another
  tenant's key comes back `valid: false`.
- With `getOrganizationId`, creating or listing an organization's keys needs the
  tenant's organization (`403 ORGANIZATION_TENANT_MISMATCH`).

Keys are stamped in the database, so the binding needs a database row for each
key: the plugin's default `storage: "database"`, or `"secondary-storage"` with
`fallbackToDatabase: true` (the checks read the row, not the cached copy). With
secondary storage alone, creating a key on a tenant's host fails with
`500 API_KEY_NOT_IN_DATABASE` rather than hand out a key bound to nothing. Keys created before you turn it on have no tenant; re-issue
them, or set their `tenantId`. The plugin warns at startup when the api-key plugin
is installed and `apiKeys` is not set.

### Device authorization

Better Auth's `deviceAuthorization` plugin keeps its codes in a `deviceCode`
table of its own, so without binding, a code a user approves on one tenant can
be redeemed for a session on another. Set `deviceCodes: true` (and migrate the
`deviceCode.tenantId` column): each code is stamped with the tenant that issued
it, and on a tenant's host `/device/token`, `/device`, `/device/approve` and
`/device/deny` only find that tenant's codes, so another tenant's code is
`invalid_grant`. Codes issued before you turn it on stop working; they expire in
minutes anyway. The plugin warns at startup when `deviceAuthorization` is
installed and `deviceCodes` is not set.

## Cookies across subdomains

Leave Better Auth's `advanced.crossSubDomainCookies` **off**. It puts one
session cookie on the apex domain, shared by every tenant subdomain. The
cross-tenant check still refuses that session on the wrong tenant, but signing
in to one tenant then signs the user out of every other one. The plugin logs a
warning at startup if it finds the option enabled.

## Behind a reverse proxy

By default the tenant comes from the `Host` header and nothing else, so a
client-supplied `X-Forwarded-Host` or `Forwarded` header is ignored. If a proxy
in front of you rewrites `Host` to an internal name, set `trustProxy` so the
host is read from the header the proxy sets instead:

```ts
multiTenant({ baseDomain: "example.com", getTenant, trustProxy: true });
```

| Value | Meaning |
| --- | --- |
| `false` (default) | `Host` only. |
| `true` | One trusted proxy: the right-most entry of `X-Forwarded-Host` (or the `host=` of the right-most `Forwarded` element). |
| a number `n` | `n` trusted proxies in a row: the right-most `n` entries are yours, and the left-most of those is used. Fewer entries than `n` is rejected. |
| `(req) => boolean` | Decided per request; `req` is `{ headers, request? }`. `true` trusts one proxy, anything else uses `Host`. Use it to trust the header only when a secret header or source you check is present. |

Entries to the left of the trusted ones are client-controlled and never read.
A forwarded host that is not a plain host name, IPv4 address or bracketed IPv6
literal with an optional port, an empty entry, `X-Forwarded-Host` and
`Forwarded` naming different hosts, or a list shorter than `n` answers
`400 INVALID_FORWARDED_HOST`, also on paths that do not require a tenant. With
neither header present the request did not come through a proxy and `Host` is
used.

Nothing is detected for you: whether the header can be trusted depends on
whether your proxy overwrites it. If it only passes the client's value
through, enabling `trustProxy` lets anyone pick their tenant. Confirm what your
platform sends (log `host` and `x-forwarded-host` from a test request) before
turning it on.

| Platform | `trustProxy` | Why |
| --- | --- | --- |
| Vercel | `true` | Sets `x-forwarded-host` to the public host and replaces a client-supplied value. |
| Cloudflare Workers / Pages | `false` | `Host` and `request.url` already carry the public host, and no `x-forwarded-host` is added. |
| Cloudflare proxying to your origin | `false` | `Host` is passed through unchanged. |
| Netlify | `true` | Functions can see an internal `Host`; the public host is in `x-forwarded-host`. |
| Nginx | `false` with `proxy_set_header Host $host;`, or `true` with `proxy_set_header X-Forwarded-Host $host;` | Always set the header from `$host`, never from `$http_x_forwarded_host`, which repeats the client's value. |
| AWS ALB | `false` | Passes `Host` through and adds no `X-Forwarded-Host`. Behind CloudFront, forward the `Host` header to the origin. |
| CDN in front of Nginx or an ALB | `2` | Only if each layer appends to `X-Forwarded-Host`; otherwise `1`. |

`createTenantAuth` takes the same option. The tenant read from the forwarded host
is the one every other check uses: session binding, `canAccessTenant`, the
verification binding, teams and SSO.

## Edge runtimes

The package uses no Node built-ins, `Buffer` or `process`, so it can run on
Cloudflare Workers, Vercel Edge, Deno and Bun. `npm run build` bundles each
entry point with esbuild for a platform-neutral target and fails on any Node
built-in or Node-only global. That check covers this package only: Better Auth,
your database adapter and the code in your callbacks must run there too.

## Security notes

What the plugin enforces on a tenant's host:

- A state-changing request whose `Origin` (or `Referer`) is another host is
  refused (`403 CROSS_TENANT_ORIGIN`, `sameOriginOnly`). Tenant subdomains are
  "same-site", so browsers send a tenant's cookies on requests from another
  tenant's page, and a wildcard `trustedOrigins` such as `https://*.example.com`
  lets them past Better Auth's CSRF check. OAuth and SAML callbacks are exempt.
  It applies to subdomain and custom-domain tenancy only: path tenancy shares
  one origin (see [Path-based tenants](#path-based-tenants)), and with
  `getTenantSlug` the plugin does not know which host is the tenant's, so
  check the `Origin` yourself if your resolver reads the host.
- Tokens from Better Auth's `jwt` plugin carry the tenant they were minted on
  (`tenantId`, `jwtTenantClaim`). Their `iss` and `aud` are the one `baseURL`
  shared by every tenant, so a service that verifies them must also compare the
  claim with the tenant it serves:

  ```ts
  const { payload } = await jwtVerify(token, jwks, { issuer: BASE_URL, audience: BASE_URL });
  if (payload.tenantId !== tenant.id) throw new Error("token for another tenant");
  ```

  The plugin reads its options from the object passed to `jwt()`, so create it
  as `jwt({})`; with `jwt()` the claim cannot be added and the plugin warns.

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
  creates it; this repository tests password, username, phone, magic-link,
  email OTP, two-factor, anonymous, passkey, generic OAuth, One Tap and SIWE
  sessions ([Authentication plugins](#authentication-plugins)). One created on a
  request with no tenant is refused
  (`400 TENANT_REQUIRED`) and one without a stamp is refused on use
  (`403 UNBOUND_SESSION`), so a plugin that skips the adapter gets no working
  session either. `@better-auth/api-key` sessions are bound with `apiKeys: true`,
  see [API keys](#api-keys).
- With `bindVerifications` (default), a magic-link token, OTP, two-factor
  challenge, trusted-device cookie, passkey challenge, SIWE nonce or OAuth state
  issued on one tenant is refused on another
  (`403 VERIFICATION_TENANT_MISMATCH`), and a session cookie of another tenant is
  ignored on the sign-in, sign-up and callback routes (the anonymous plugin
  would otherwise link and delete its anonymous user).
- `/list-sessions` returns only the tenant's sessions, so no other tenant's
  session token leaves its host, and `/revoke-session` refuses a token bound to
  another tenant (`403 CROSS_TENANT_SESSION`).
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
- **Some plugin state is still shared across tenants**, because it lives in
  Better Auth's own tables or identifiers
  ([details](./docs/auth-plugins.md#per-plugin-notes)):
  usernames and phone numbers are unique across all tenants (so a name taken on
  one is visible as taken on all); the email and phone OTP slot is one per
  address, so a code requested on another tenant replaces the pending one;
  `check-verification-otp` can be probed from any tenant; two-factor settings
  and passkeys belong to the user. Account creation is not gated by
  `canAccessTenant`, only session creation.
- **Verification binding is not enforced** when verification rows live only in
  `secondaryStorage` (Better Auth runs no database hooks there; the plugin logs a
  warning, set `verification.storeInDatabase: true`) or when a plugin verifies a
  code outside the table (`phoneNumber`'s custom `verifyOTP`).
- **One passkey relying party, SIWE domain, Google client id and OAuth redirect
  per instance.** To vary them per tenant use `createTenantAuth` with the plugin
  configured in `createAuth` (see
  [docs/auth-plugins.md](./docs/auth-plugins.md)).
- **Suspended and unknown tenants look different**: `403 TENANT_INACTIVE`
  versus `404 TENANT_NOT_FOUND`. If that must not be visible, return `null`
  from `getTenant` for inactive tenants.
- **OAuth provider and SCIM plugins are not scoped.** With
  `@better-auth/oauth-provider` (or `oidcProvider` / `mcp`) and
  `@better-auth/scim`, clients, consents, SCIM connections and access tokens are
  shared by every tenant, and an access token is not checked against the host's
  tenant (only session tokens are). Authorization codes are verification rows,
  so they are bound. The plugin warns at startup when one is installed. Use
  `createTenantAuth` (a database per tenant) if they must be separate.
- **Your own queries are not filtered.** Scope every data query by tenant
  yourself.
- **`trustProxy` is trust you grant.** The plugin cannot tell whether your
  proxy overwrites `X-Forwarded-Host` or merely forwards the client's. If it
  forwards it, a request can name any tenant; leave `trustProxy` off or use a
  predicate that checks the request came from your proxy.
- **The edge check is static.** It proves the bundle has no Node built-ins, not
  that it was run on Workers, Deno or Bun.

Report vulnerabilities privately; see [SECURITY.md](./SECURITY.md).

## Upgrading from 0.5

0.6.0 refuses some requests 0.5 let through. Each has an option to restore the
old behaviour if you depend on it:

| What changes | Error | Restore with |
| --- | --- | --- |
| With `getOrganizationId` and the `admin` plugin, admin routes are scoped to the tenant, and only an `owner`/`admin` member of its organization may call them. A platform admin who is not one is refused. | `ADMIN_NOT_TENANT_ADMIN`, `ADMIN_TENANT_MISMATCH` | `canAdministerTenant` (let your staff in), or `admin: false` |
| Admin changes to the global user (password, email, role, ban, removal) refuse a user who belongs to another organization too. | `ADMIN_SHARED_USER` | `adminSharedUsers: "allow"` |
| `create-user` / `set-role` cannot give out an admin role from a tenant's host. | `ADMIN_ROLE_NOT_ASSIGNABLE` | `adminRoleAssignment: "allow"` |
| A state-changing request from another origin is refused, including a browser extension, or `www.acme.com` calling `acme.com`. | `CROSS_TENANT_ORIGIN` | `sameOriginOnly: false` |
| `jwt` plugin tokens gain a `tenantId` claim. | — | `jwtTenantClaim: false` |

New, opt-in columns: `apikey.tenantId` (`apiKeys: true`) and
`deviceCode.tenantId` (`deviceCodes: true`). Run your migration before turning
them on. `session.tenantId` and `verification.tenantId` are unchanged from 0.5.

## Database per tenant

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
plugin, and every option of [Options](#options) except `requireTenant` applies
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

### Schema per tenant (Postgres)

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

## Options

| Option | Default | Description |
| --- | --- | --- |
| `baseDomain` | — | Subdomain tenancy: the apex domain tenants live under, e.g. `example.com`. Set this, `pathPrefix` or `getTenantSlug`. |
| `pathPrefix` | — | Path tenancy: tenants are addressed as `<basePath><pathPrefix>/<slug>/…`. Mount through `withTenantPaths`. See [Path-based tenants](#path-based-tenants). |
| `getTenantSlug` | — | `({ headers, request, path }) => slug \| null`. Your own resolver. See [Your own resolver](#your-own-resolver). |
| `tenantCookies` | `true` with `pathPrefix`, else `false` | Give every tenant its own cookie names, and hide other tenants' cookies from the request. |
| `getTenant` | — | `(slug) => Tenant \| null`. `null` becomes a 404. |
| `getTenantByDomain` | — | `(domain) => Tenant \| null` for custom domains outside `baseDomain`. See [Custom domains](#custom-domains). |
| `getOrganizationId` | — | `(tenant) => organizationId`. Locks the active organization on tenant hosts, refuses other organizations' ids and slugs on every `/organization/*` endpoint, scopes teams and `activeTeamId` to it, and ties SSO providers to it. See [With the `organization` plugin](#with-the-organization-plugin). |
| `getSSODomains` | — | `(tenant) => string[]`. Email domains a tenant owns, for SSO providers with no organization. Turns on the SSO checks. See [With `@better-auth/sso`](#with-better-authsso). |
| `canAccessTenant` | — | `(user, tenant, { organizationId, adapter }) => boolean`. Refuses sessions for users the tenant does not let in (`TENANT_ACCESS_DENIED`). `organizationMembersOnly` is a ready one. See [Who may sign in to a tenant](#who-may-sign-in-to-a-tenant). |
| `admin` | `true` with `getOrganizationId`, else `false` | Scope the `admin` plugin to the tenant's members and sessions. `true` without `getOrganizationId` throws at startup. See [Admin plugin](#admin-plugin). |
| `canAdministerTenant` | `organizationAdminsOnly` | `(user, tenant, { organizationId, adapter }) => boolean`. Who may use the `admin` plugin on a tenant's host (`ADMIN_NOT_TENANT_ADMIN`). See [Admin plugin](#admin-plugin). |
| `adminSharedUsers` | `"refuse"` | `"refuse"` stops admin routes that change the global user from touching a user who belongs to another organization too (`ADMIN_SHARED_USER`); `"allow"` lets them. |
| `adminRoleAssignment` | `"refuse"` | `"refuse"` stops `create-user` and `set-role` on a tenant's host from giving out the admin plugin's `adminRoles` (`ADMIN_ROLE_NOT_ASSIGNABLE`); `"allow"` lets them. |
| `jwtTenantClaim` | `"tenantId"` | Claim the `jwt` plugin's tokens carry the session's tenant in; `false` leaves tokens alone. Needs `jwt({})`. |
| `sameOriginOnly` | `true` | Refuse state-changing requests on a tenant's host from another origin (`CROSS_TENANT_ORIGIN`). Subdomain and custom-domain tenancy only. |
| `apiKeys` | `false` | Bind `@better-auth/api-key` keys to the tenant they were created on (`apikey.tenantId`). See [API keys](#api-keys). |
| `deviceCodes` | `false` | Bind `deviceAuthorization` codes to the tenant that issued them (`deviceCode.tenantId`). See [Device authorization](#device-authorization). |
| `teams` | `true` with `getOrganizationId`, else `false` | Scope the organization plugin's team routes, `list-user-teams` and `activeTeamId` to the tenant's organization. `false` turns it off; `true` without `getOrganizationId` throws at startup. See [Teams](#teams). |
| `sso` | `true` with `getOrganizationId` or `getSSODomains`, else `false` | Scope `@better-auth/sso` to the tenant's providers. `false` turns it off (no checks, no startup warning); `true` without either option throws at startup, and so does `false` with `ssoRequireTenantMapping`. |
| `ssoRequireTenantMapping` | `false` | With SSO installed and neither `getOrganizationId` nor `getSSODomains` set, `true` refuses every SSO route on tenant hosts instead of leaving SSO unscoped. |
| `bindVerifications` | `true` | Stamp the codes, tokens, nonces and challenges that plugins keep as verification rows with the tenant that issued them (`verification.tenantId`), and refuse redeeming or deleting a live one on another tenant (`VERIFICATION_TENANT_MISMATCH`). Also drops another tenant's trusted-device cookie before sign-in. Needs the column; `false` turns it all off. See [Authentication plugins](#authentication-plugins). |
| `revokeScope` | `"tenant"` | `"tenant"` limits `/revoke-sessions`, `/revoke-other-sessions` and `/change-password` with `revokeOtherSessions` to the tenant's sessions; `"all"` ends every session of the user, as Better Auth does. |
| `reserved` | `www, api, app, admin, auth, login, static, assets, cdn, mail, docs, status` | Subdomains that never resolve. Replaces the default when set. |
| `slugPattern` | DNS label, lowercase | Shape a slug must match. |
| `allowNestedSubdomains` | `false` | Let `acme.eu.example.com` resolve to `acme`. |
| `allowHeaderOverride` | `false` | Trust a client header to name the tenant. |
| `headerName` | `x-tenant` | Header consulted when the override is on. |
| `trustProxy` | `false` | Read the host from `X-Forwarded-Host` / `Forwarded` instead of `Host`: `true`, a number of proxy hops, or `(req) => boolean`. See [Behind a reverse proxy](#behind-a-reverse-proxy). |
| `requireTenant` | `() => true` | Whether a path must carry a tenant. |
| `enforceSessionTenant` | all but auth entry points | Paths where the session's tenant must match the host's. |
| `getSessionTenantId` | `session.session.tenantId` | How to read a session's tenant. |
| `unboundSessions` | `"reject"` | `"allow"` lets sessions with no tenant through. Use only while migrating. |
| `protocol` | `"https"` | Protocol of the `origin` returned by `/multi-tenant/current`. |
| `port` | — | Port of the `origin` returned by `/multi-tenant/current`. |
| `onTenantResolved` | — | Called after each successful resolution. |

`cacheTenantLookup(lookup, { ttl, maxSize?, cacheMisses? })` wraps `getTenant`
or `getTenantByDomain` with an in-memory cache; see
[Caching tenant lookups](#caching-tenant-lookups).

Additional options of `createTenantAuth` (it also takes every option above except `requireTenant`). See [Database per tenant](#database-per-tenant).

| Option | Default | Description |
| --- | --- | --- |
| `createAuth` | — | `(tenant) => BetterAuthOptions`. Builds a tenant's instance, with its own `database`. |
| `maxSize` | unbounded | Most instances cached; the least recently used is evicted beyond it. A positive integer. |
| `onEvict` | — | `(tenant, auth) => void`. Called when an instance leaves the cache; close its connections here. |
| `basePath` | `"/api/auth"` | With `pathPrefix`: where the instances are mounted, used to find the tenant in the URL and given to every instance. |

## Error codes

| Code | Status | Meaning |
| --- | --- | --- |
| `TENANT_REQUIRED` | 400 | The path needs a tenant and the request did not name a valid one (host, path prefix or `getTenantSlug`). Always, with `createTenantAuth`. |
| `INVALID_FORWARDED_HOST` | 400 | `trustProxy` is on and the forwarded host is malformed, disagrees between `X-Forwarded-Host` and `Forwarded`, or has fewer entries than the trusted hops. |
| `TENANT_NOT_FOUND` | 404 | `getTenant` (or `getTenantByDomain`) returned `null`. Same for `createTenantAuth`, before any instance is created. |
| `TENANT_INACTIVE` | 403 | The tenant's `status` is not `"active"`. |
| `CROSS_TENANT_SESSION` | 403 | The session belongs to a different tenant, or `/revoke-session` named another tenant's session. |
| `UNBOUND_SESSION` | 403 | The session carries no tenant id (see `unboundSessions`). |
| `TENANT_ACCESS_DENIED` | 403 | `canAccessTenant` did not let the user in; no session was created. |
| `ORGANIZATION_TENANT_MISMATCH` | 403 | `/organization/set-active` tried to activate (or clear) an organization other than the tenant's, or an organization, team, invitation or member route named another organization's (see `getOrganizationId`). |
| `ADMIN_TENANT_MISMATCH` | 403 | An `admin` plugin route named a user who is not a member of the tenant's organization (see `admin`). |
| `ADMIN_NOT_TENANT_ADMIN` | 403 | The caller of an `admin` plugin route does not administer the tenant (see `canAdministerTenant`). |
| `ADMIN_SHARED_USER` | 403 | An admin route that changes the global user named a user who also belongs to another organization (see `adminSharedUsers`). |
| `ADMIN_ROLE_NOT_ASSIGNABLE` | 403 | `create-user` or `set-role` on a tenant's host tried to give out one of the admin plugin's `adminRoles` (see `adminRoleAssignment`). |
| `CROSS_TENANT_ORIGIN` | 403 | A state-changing request came from another host's page (see `sameOriginOnly`). |
| `TEAM_TENANT_MISMATCH` | 403 | A team route or `activeTeamId` named a team of another tenant's organization. |
| `VERIFICATION_TENANT_MISMATCH` | 403 | A code, token, nonce, challenge or pending cookie was issued on a different tenant, or carries no tenant stamp (see `bindVerifications`). |
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

## Reading the tenant on the client

`getTenant(client)` calls `/multi-tenant/current` through your Better Auth
client and never throws. It returns `{ tenant, error }`, where `error.code` is
typed to the plugin's [error codes](#error-codes). It is framework-free, so it
works in Vue, Svelte or a plain script:

```ts
import { getTenant } from "better-auth-multi-tenant/client";

const { tenant, error } = await getTenant(authClient);
if (error?.code === "TENANT_NOT_FOUND") showUnknownWorkspacePage();
```

For React, `useTenant(client)` in `better-auth-multi-tenant/react` returns
`{ tenant, error, isPending }` (`react` 18 or newer is an optional peer
dependency). It fetches in an effect, so server rendering produces the pending
state, and it starts over if you pass a different client:

```tsx
import { useTenant } from "better-auth-multi-tenant/react";

function Brand() {
  const { tenant, error, isPending } = useTenant(authClient);
  if (isPending) return null;
  if (error?.code === "TENANT_NOT_FOUND") return <NotFound />;
  return <h1>{tenant?.slug}</h1>;
}
```

`error.status` is `0` when no usable response arrived (network failure, or a
body that is not the plugin's).

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

## Compatibility

Each framework has a minimal example under [`examples/`](./examples) that
installs the packed package (not the source), runs two tenants on
`*.localhost`, and has a smoke test: sign up on `acme`, replay the cookie on
`globex`, expect `403 CROSS_TENANT_SESSION`. The
[Examples workflow](./.github/workflows/examples.yml) runs every one on each
push and pull request.

| Framework | Runtime | Tested version | Better Auth integration | Status |
| --- | --- | --- | --- | --- |
| [Hono](./examples/hono) | Node 22 | `hono` 4.13.13, `@hono/node-server` 2.1.5 | `auth.handler(c.req.raw)` | Passing |
| [Express](./examples/express) | Node 22 | `express` 5.3.0 | `toNodeHandler` (`better-auth/node`) | Passing |
| [Next.js](./examples/nextjs) | Node 22 (`next start`) | `next` 16.4.2, `react` 19.3.1 | route handler calling `auth.handler(request)` | Passing |
| [Nuxt](./examples/nuxt) | Node 22 (Nitro) | `nuxt` 4.6.2 | `auth.handler(toWebRequest(event))` | Passing |
| [SvelteKit](./examples/sveltekit) | Node 22 (`adapter-node`) | `@sveltejs/kit` 3.1.0 | `svelteKitHandler` (`better-auth/svelte-kit`) | Passing |
| [TanStack Start](./examples/tanstack-start) | Node 22 (Vite dev server) | `@tanstack/react-start` 1.169.3 | server route `handlers` calling `auth.handler(request)` | Passing |
| [Cloudflare Workers](./examples/cloudflare-workers) | `workerd` via `wrangler dev --local` | `wrangler` 4.151.3, `hono` 4.13.13 | `auth.handler(c.req.raw)` | Passing |

All use Better Auth 1.7.14. The examples keep users in memory and hardcode the
tenant list; swap in your own database and `getTenant` lookup. TanStack Start is
exercised on its dev server, and Workers on the local `workerd` simulator, not
on a deployed Worker.

To run one yourself, see its README; the short version is
`npm run pack:examples`, then `npm install --no-package-lock
--legacy-peer-deps && npm run smoke` inside the example.

## Scope

Tenant resolution (subdomain, custom domain, path or your own), session binding,
cross-tenant rejection and callback origins are implemented and tested, as is
scoping for the organization, admin, multi-session, SSO and API key plugins.
Query-level data isolation helpers and per-tenant OAuth provider configuration
are not in this release.

## Contributing

Issues and pull requests are welcome; see [CONTRIBUTING.md](./CONTRIBUTING.md).
Found a way to cross a tenant boundary? Please report it privately, as
described in [SECURITY.md](./SECURITY.md), rather than in a public issue.

## License

MIT
