# better-auth-multi-tenant

[![npm version](https://img.shields.io/npm/v/better-auth-multi-tenant)](https://www.npmjs.com/package/better-auth-multi-tenant)
[![npm downloads](https://img.shields.io/npm/dm/better-auth-multi-tenant)](https://www.npmjs.com/package/better-auth-multi-tenant)
[![CI](https://github.com/Weesofficial/better-auth-multi-tenant/actions/workflows/ci.yml/badge.svg)](https://github.com/Weesofficial/better-auth-multi-tenant/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue)](./LICENSE)
[![Types: TypeScript](https://img.shields.io/npm/types/better-auth-multi-tenant)](https://www.npmjs.com/package/better-auth-multi-tenant)
[![Better Auth](https://img.shields.io/npm/dependency-version/better-auth-multi-tenant/peer/better-auth)](https://better-auth.com)
[![npm provenance](https://img.shields.io/badge/npm-provenance-green)](https://www.npmjs.com/package/better-auth-multi-tenant#provenance)
[![GitHub stars](https://img.shields.io/github/stars/Weesofficial/better-auth-multi-tenant)](https://github.com/Weesofficial/better-auth-multi-tenant/stargazers)
[![Follow @patelwees](https://img.shields.io/twitter/follow/patelwees)](https://x.com/patelwees)

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
worth testing in your own suite — see [Testing isolation](./docs/security.md#testing-isolation).

**Fail closed.** `requireTenant` defaults to requiring a tenant on every path. A
route that forgets to opt in returns 400 instead of quietly serving data from
whichever tenant it happened to resolve last.

**Per-tenant callback origins.** `tenantOrigin(slug, { baseDomain })` builds the
origin a tenant's OAuth flow must return to, so one deployment can serve every
subdomain against a wildcard redirect registration instead of a hardcoded apex.

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

Setup for each mode, the development-only `x-tenant` header, caching lookups,
cookies across subdomains, reverse proxies and edge runtimes are covered in
[docs/tenancy-modes.md](./docs/tenancy-modes.md).

## Organizations, teams, SSO and admin

With `getOrganizationId`, each tenant maps to an organization of Better Auth's
`organization` plugin: on a tenant's host only that organization can be active,
and organization, invitation, team and admin routes only act on it. With
`getOrganizationId` or `getSSODomains`, `@better-auth/sso` only uses the
tenant's providers. `canAccessTenant` decides who may sign in to a tenant.
Setup, and what each check covers: [docs/organization.md](./docs/organization.md).

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

## Security notes

On a tenant's host the plugin refuses another tenant's session (cookie or bearer
token), verification codes and tokens issued on another tenant, and, with
subdomain or custom-domain tenancy, state-changing requests from another
tenant's origin. With `apiKeys` and `deviceCodes` it does the same for API
keys and device codes.

What it does **not** do:

- **Users are global.** One account can sign in on every tenant unless you set
  `canAccessTenant`.
- **Your own queries are not filtered.** Scope every data query by tenant
  yourself.
- **Some plugin state is shared.** Usernames, phone numbers, two-factor settings
  and passkeys belong to the user, and the OAuth provider, `oidcProvider`,
  `mcp` and SCIM plugins are not tenant-scoped.
- **`trustProxy` is trust you grant.** Turn it on only behind a proxy that
  overwrites `X-Forwarded-Host`.

The full list, with the trade-offs, is in [docs/security.md](./docs/security.md).
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

Better Auth binds one database per instance, so for a database (or Postgres
schema) per tenant, `createTenantAuth` keeps one Better Auth instance per
tenant. See [docs/database-per-tenant.md](./docs/database-per-tenant.md).

## Options

| Option | Default | Description |
| --- | --- | --- |
| `baseDomain` | — | Subdomain tenancy: the apex domain tenants live under, e.g. `example.com`. Set this, `pathPrefix` or `getTenantSlug`. |
| `pathPrefix` | — | Path tenancy: tenants are addressed as `<basePath><pathPrefix>/<slug>/…`. Mount through `withTenantPaths`. See [Path-based tenants](./docs/tenancy-modes.md#path-based-tenants). |
| `getTenantSlug` | — | `({ headers, request, path }) => slug \| null`. Your own resolver. See [Your own resolver](./docs/tenancy-modes.md#your-own-resolver). |
| `tenantCookies` | `true` with `pathPrefix`, else `false` | Give every tenant its own cookie names, and hide other tenants' cookies from the request. |
| `getTenant` | — | `(slug) => Tenant \| null`. `null` becomes a 404. |
| `getTenantByDomain` | — | `(domain) => Tenant \| null` for custom domains outside `baseDomain`. See [Custom domains](./docs/tenancy-modes.md#custom-domains). |
| `getOrganizationId` | — | `(tenant) => organizationId`. Locks the active organization on tenant hosts, refuses other organizations' ids and slugs on every `/organization/*` endpoint, scopes teams and `activeTeamId` to it, and ties SSO providers to it. See [With the `organization` plugin](./docs/organization.md#with-the-organization-plugin). |
| `getSSODomains` | — | `(tenant) => string[]`. Email domains a tenant owns, for SSO providers with no organization. Turns on the SSO checks. See [With `@better-auth/sso`](./docs/organization.md#with-better-authsso). |
| `canAccessTenant` | — | `(user, tenant, { organizationId, adapter }) => boolean`. Refuses sessions for users the tenant does not let in (`TENANT_ACCESS_DENIED`). `organizationMembersOnly` is a ready one. See [Who may sign in to a tenant](./docs/organization.md#who-may-sign-in-to-a-tenant). |
| `admin` | `true` with `getOrganizationId`, else `false` | Scope the `admin` plugin to the tenant's members and sessions. `true` without `getOrganizationId` throws at startup. See [Admin plugin](./docs/organization.md#admin-plugin). |
| `canAdministerTenant` | `organizationAdminsOnly` | `(user, tenant, { organizationId, adapter }) => boolean`. Who may use the `admin` plugin on a tenant's host (`ADMIN_NOT_TENANT_ADMIN`). See [Admin plugin](./docs/organization.md#admin-plugin). |
| `adminSharedUsers` | `"refuse"` | `"refuse"` stops admin routes that change the global user from touching a user who belongs to another organization too (`ADMIN_SHARED_USER`); `"allow"` lets them. |
| `adminRoleAssignment` | `"refuse"` | `"refuse"` stops `create-user` and `set-role` on a tenant's host from giving out the admin plugin's `adminRoles` (`ADMIN_ROLE_NOT_ASSIGNABLE`); `"allow"` lets them. |
| `jwtTenantClaim` | `"tenantId"` | Claim the `jwt` plugin's tokens carry the session's tenant in; `false` leaves tokens alone. Needs `jwt({})`. |
| `sameOriginOnly` | `true` | Refuse state-changing requests on a tenant's host from another origin (`CROSS_TENANT_ORIGIN`). Subdomain and custom-domain tenancy only. |
| `apiKeys` | `false` | Bind `@better-auth/api-key` keys to the tenant they were created on (`apikey.tenantId`). See [API keys](#api-keys). |
| `deviceCodes` | `false` | Bind `deviceAuthorization` codes to the tenant that issued them (`deviceCode.tenantId`). See [Device authorization](#device-authorization). |
| `teams` | `true` with `getOrganizationId`, else `false` | Scope the organization plugin's team routes, `list-user-teams` and `activeTeamId` to the tenant's organization. `false` turns it off; `true` without `getOrganizationId` throws at startup. See [Teams](./docs/organization.md#teams). |
| `sso` | `true` with `getOrganizationId` or `getSSODomains`, else `false` | Scope `@better-auth/sso` to the tenant's providers. `false` turns it off (no checks, no startup warning); `true` without either option throws at startup, and so does `false` with `ssoRequireTenantMapping`. |
| `ssoRequireTenantMapping` | `false` | With SSO installed and neither `getOrganizationId` nor `getSSODomains` set, `true` refuses every SSO route on tenant hosts instead of leaving SSO unscoped. |
| `bindVerifications` | `true` | Stamp the codes, tokens, nonces and challenges that plugins keep as verification rows with the tenant that issued them (`verification.tenantId`), and refuse redeeming or deleting a live one on another tenant (`VERIFICATION_TENANT_MISMATCH`). Also drops another tenant's trusted-device cookie before sign-in. Needs the column; `false` turns it all off. See [Authentication plugins](#authentication-plugins). |
| `revokeScope` | `"tenant"` | `"tenant"` limits `/revoke-sessions`, `/revoke-other-sessions` and `/change-password` with `revokeOtherSessions` to the tenant's sessions; `"all"` ends every session of the user, as Better Auth does. |
| `reserved` | `www, api, app, admin, auth, login, static, assets, cdn, mail, docs, status` | Subdomains that never resolve. Replaces the default when set. |
| `slugPattern` | DNS label, lowercase | Shape a slug must match. |
| `allowNestedSubdomains` | `false` | Let `acme.eu.example.com` resolve to `acme`. |
| `allowHeaderOverride` | `false` | Trust a client header to name the tenant. |
| `headerName` | `x-tenant` | Header consulted when the override is on. |
| `trustProxy` | `false` | Read the host from `X-Forwarded-Host` / `Forwarded` instead of `Host`: `true`, a number of proxy hops, or `(req) => boolean`. See [Behind a reverse proxy](./docs/tenancy-modes.md#behind-a-reverse-proxy). |
| `requireTenant` | `() => true` | Whether a path must carry a tenant. |
| `enforceSessionTenant` | all but auth entry points | Paths where the session's tenant must match the host's. |
| `getSessionTenantId` | `session.session.tenantId` | How to read a session's tenant. |
| `unboundSessions` | `"reject"` | `"allow"` lets sessions with no tenant through. Use only while migrating. |
| `protocol` | `"https"` | Protocol of the `origin` returned by `/multi-tenant/current`. |
| `port` | — | Port of the `origin` returned by `/multi-tenant/current`. |
| `onTenantResolved` | — | Called after each successful resolution. |

`cacheTenantLookup(lookup, { ttl, maxSize?, cacheMisses? })` wraps `getTenant`
or `getTenantByDomain` with an in-memory cache; see
[Caching tenant lookups](./docs/tenancy-modes.md#caching-tenant-lookups).

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

## Contact

Questions, feedback or something to show off? Message or tag the maintainer on
X, [@patelwees](https://x.com/patelwees), send a Discord message to
`weespatel`, or connect on [LinkedIn](https://www.linkedin.com/in/gigax/).
Bugs still belong in
[GitHub issues](https://github.com/Weesofficial/better-auth-multi-tenant/issues),
and security reports go through [SECURITY.md](./SECURITY.md), not public posts.

## License

MIT
