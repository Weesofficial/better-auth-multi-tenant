# Changelog

## 0.6.0

### Security

Found in a pre-release review; each has a regression test in
`test/security-review-0-6.test.ts`.

- **The admin role no longer crosses tenants.** The new admin scoping checked
  whom an admin route acted on, not who called it, and Better Auth's admin role
  is global: an admin of one tenant could ban or reset the password of another
  tenant's owner from that tenant's host. The caller now has to administer the
  tenant (`canAdministerTenant`, default `organizationAdminsOnly`: an `owner` or
  `admin` member of its organization), else `403 ADMIN_NOT_TENANT_ADMIN`.
- **Admin changes to a user shared with another tenant are refused.**
  `set-user-password`, `update-user`, `set-role`, `ban-user`, `unban-user` and
  `remove-user` change the global user, so one tenant's admin could take over a
  user's account on another tenant. They now refuse a user who belongs to another
  organization (`403 ADMIN_SHARED_USER`); `adminSharedUsers: "allow"` restores
  the old behaviour.
- **Cross-tenant requests are refused** (`sameOriginOnly`, on by default). With
  a wildcard `trustedOrigins`, a page on one tenant's subdomain could make
  credentialed requests on another. State-changing requests from another
  `Origin` now get `403 CROSS_TENANT_ORIGIN`.
- **API keys in secondary storage stay bound.** With `apiKeys: true` and the
  api-key plugin on `storage: "secondary-storage"`, keys were never stamped and
  verified on every tenant. Key routes and `verifyApiKey` now check the key's
  database row, and creating a key that has no row fails with
  `500 API_KEY_NOT_IN_DATABASE`.
- `allowHeaderOverride` logs a warning when `NODE_ENV` is `production`.
- **`deviceAuthorization` codes can be bound to a tenant** (`deviceCodes: true`,
  needs the new `deviceCode.tenantId` column). A code approved on one tenant
  could otherwise be redeemed for a session on another. On a tenant's host the
  device routes now only find that tenant's codes, and the plugin warns at
  startup when `deviceAuthorization` is installed and `deviceCodes` is not set.
  Tested in `test/device-authorization.test.ts`.

### Added

- **Path-based tenancy.** `pathPrefix: "/t"` addresses a tenant as
  `/api/auth/t/acme/…`; wrap the instance in `withTenantPaths(auth)`. The prefix
  comes off before Better Auth routes the request, so rate limits and
  `disabledPaths` apply unchanged. Each tenant gets its own cookie names
  (`tenantCookies`), links Better Auth builds come back under the tenant's prefix,
  and `tenantPathRequest` names the tenant for `auth.api` calls. `createTenantAuth`
  supports it too (with a new `basePath` option).
- **Your own resolver.** `getTenantSlug({ headers, request, path })` picks the
  tenant; the slug still passes `reserved` and `slugPattern`.
- **`cacheTenantLookup`** puts an in-memory cache (with `ttl`, `maxSize`,
  `cacheMisses` and `invalidate`) in front of `getTenant` or `getTenantByDomain`.
- **`admin` plugin scoping** (`admin`, on by default with `getOrganizationId`).
  On a tenant's host `list-users` lists the tenant organization's members only,
  routes that name a user refuse anyone else with `403 ADMIN_TENANT_MISMATCH`,
  and the admin session routes see the tenant's sessions only. Without
  `getOrganizationId` the plugin warns that admin routes are unscoped. A caller
  with no session gets the admin plugin's own `401` before any membership check.
- **`multiSession` plugin scoping.** `list-device-sessions` returns the tenant's
  sessions only; `set-active` and `revoke` refuse another tenant's session.
- **`@better-auth/api-key` binding** (`apiKeys: true`, needs the new
  `apikey.tenantId` column). Keys are stamped with the tenant they were created
  on, refused as sessions on another tenant whichever order the plugins are in,
  and hidden from the key routes of other tenants and from
  `auth.api.verifyApiKey` called with another tenant's headers. With `getOrganizationId`,
  organization keys must belong to the tenant's organization. The plugin warns
  when the api-key plugin is installed and `apiKeys` is not set.
- `checkSlug` is exported, for validating a slug from your own source.

### Changed

- With `getOrganizationId` and the `admin` plugin installed, admin routes on a
  tenant's host are now scoped to its members. Set `admin: false` for the old
  behaviour.
- `baseDomain` is optional in the types; the plugin throws at startup unless
  exactly one of `baseDomain`, `pathPrefix` and `getTenantSlug` is set, and when
  subdomain-only options (`getTenantByDomain`, `allowHeaderOverride`,
  `allowNestedSubdomains`, `trustProxy`) are combined with another mode.
- The `TENANT_REQUIRED` message no longer mentions subdomains.

## 0.5.0

### Security

- **`/list-sessions` leaked other tenants' session tokens.** It returns every
  session of the user, raw tokens included, so a script on one tenant's host
  could read the user's sessions on every other tenant and replay them there.
  It now returns only the current tenant's sessions.
- **`/revoke-session` could revoke another tenant's session.** It now answers
  `403 CROSS_TENANT_SESSION` for a token bound to a different tenant.
- **Organization endpoints accepted another tenant's organization.** With
  `getOrganizationId`, endpoints such as `organization/update`,
  `get-full-organization`, `list-members`, `invite-member` and `delete` took an
  explicit `organizationId` or `organizationSlug` and acted on it, ignoring the
  locked active organization. Every `/organization/*` endpoint now refuses an
  id or slug other than the tenant's (including `null` and an unknown slug)
  with `403 ORGANIZATION_TENANT_MISMATCH`, and `organization/list` returns only
  the tenant's organization.

- **Codes, tokens and challenges issued on one tenant could be redeemed on
  another.** Magic-link tokens, email and phone OTPs, two-factor challenges
  (TOTP, OTP, backup codes), passkey challenges, SIWE nonces and OAuth state
  are verification rows keyed by the address or a random id, with no tenant, so
  the host that redeemed them decided the tenant of the session. They are now
  stamped with the tenant of the request that wrote them and refused on another
  tenant's host with `403 VERIFICATION_TENANT_MISMATCH` (`bindVerifications`).
  An OAuth state started on one tenant could be finished on another by replaying
  its state cookie.
- **A trusted-device cookie from one tenant skipped two-factor on another.** It
  is dropped before sign-in when its record belongs to another tenant, so the
  sign-in meets the normal challenge. (Refusing in an after hook is not enough:
  Better Auth keeps the session cookie of the failed response.)
- **An anonymous session of one tenant was linked to, and deleted by, a sign-in
  on another.** The sign-in, sign-up and callback routes run without the
  cross-tenant check and the anonymous plugin reads the session cookie there.
  A session of another tenant is now ignored on those routes.

### Added

- `trustProxy` option (`false`, `true`, a number of hops, or `(req) => boolean`)
  to read the tenant host from `X-Forwarded-Host` or `Forwarded: host=` behind
  Vercel, Netlify, Nginx and similar. Off by default, so only `Host` is read as
  before. It takes the right-most trusted entry, ignores anything a client
  prepended, and answers the new `400 INVALID_FORWARDED_HOST` for malformed
  values, disagreeing headers or too short a list. The README lists the value
  to use per platform. `createTenantAuth` takes it too, and `requestHost` is
  exported. The forwarded tenant is the one `canAccessTenant`, the verification
  binding, teams and SSO see.
- `getTenant(client)` in `better-auth-multi-tenant/client`: framework-free,
  never throws, returns `{ tenant, error }` with `error.code` typed to the
  plugin's error codes. `TenantErrorCode` is exported.
- `better-auth-multi-tenant/react` with `useTenant(client)`, returning
  `{ tenant, error, isPending }`. `react` 18 or newer is an optional peer
  dependency.
- `npm run build` now bundles every entry point with esbuild for a
  platform-neutral target and fails on Node built-ins or Node-only globals
  (`Buffer`, `process`, `require`), so the package stays runnable on Workers,
  Vercel Edge, Deno and Bun. `npm test` runs the same check on the sources.
- Framework examples under `examples/` for Hono, Express, Next.js, Nuxt,
  SvelteKit, TanStack Start and Cloudflare Workers. Each installs the packed
  package, runs two tenants on `*.localhost` and has a smoke test that replays
  an `acme` session on `globex` and expects `403 CROSS_TENANT_SESSION`. The
  Next.js smoke test also builds and starts the app on a free port with a
  throwaway database and checks the suspended tenant. A new `Examples`
  workflow runs them all, and the README has a compatibility table.
- `npm run pack:examples` builds the package and packs it for the examples.
- `bindVerifications` (default `true`) and the `verification.tenantId` column it
  needs, `VERIFICATION_TENANT_MISMATCH`. A startup warning when verification rows
  live only in `secondaryStorage`, where Better Auth runs no database hooks.
- [docs/auth-plugins.md](./docs/auth-plugins.md): how `twoFactor`, `username`,
  `anonymous`, `phoneNumber`, `magicLink`, `emailOTP`, `passkey`,
  `genericOAuth`, `oneTap` and `siwe` behave with the plugin, a compatibility
  table, and how to configure a relying party, SIWE domain, Google client id or
  OAuth redirect per tenant. [docs/upstream-proposals.md](./docs/upstream-proposals.md)
  lists what only Better Auth can fix. End-to-end tests for each, including
  `createTenantAuth`, the organization bridge and teams; `@better-auth/passkey`
  is a development dependency for them.
- `canAccessTenant(user, tenant, { organizationId, adapter })`. Better Auth
  users are global; with this set, a session is only created on a tenant's host
  for a user it lets in, whichever plugin creates it, else
  `403 TENANT_ACCESS_DENIED` (checked at session creation, not on each request).
  `organizationMembersOnly` is a ready one for tenants mapped with
  `getOrganizationId`. Sign-up on another tenant answers a known email like a
  new one when Better Auth does (`autoSignIn: false` or
  `requireEmailVerification: true`); otherwise it still answers `422`, see the
  README.
- Organization routes that name an id are scoped to the tenant's organization
  (`403 ORGANIZATION_TENANT_MISMATCH`, or `TEAM_TENANT_MISMATCH`):
  `invite-member` (`organizationId`, `teamId`), `get-invitation`,
  `accept-invitation`, `reject-invitation`, `cancel-invitation`, `remove-member`,
  `update-member-role`, `list-members`, `list-invitations`,
  `get-active-member-role`, `get-organization`, `get-full-organization`,
  `update` and `delete`. `list-user-invitations` returns only the tenant's
  invitations and `check-slug` is refused.
- `revokeScope` (default `"tenant"`). `/revoke-sessions`,
  `/revoke-other-sessions` and `/change-password` with `revokeOtherSessions`
  end only the tenant's sessions. `"all"` keeps Better Auth's behaviour.
- `GET /sso/providers` returns only the tenant's providers.
- SAML responses are bound to the tenant that started the flow: the RelayState
  of the IdP redirect is recorded with the tenant, and the ACS route refuses one
  that was not handed out on the host's tenant.
- `@better-auth/sso` installed with neither `getOrganizationId` nor
  `getSSODomains` logs a startup warning. `ssoRequireTenantMapping: true` refuses
  every SSO route on tenant hosts in that case (default `false`).
- Tests for sessions created by the magic-link and anonymous plugins.
- End-to-end test of `createTenantAuth` (one memory database per tenant) with
  organization teams and `@better-auth/sso`: each tenant's team and provider
  work on its host, and another tenant's session, team id and provider id are
  refused.
- Teams. With `organization({ teams: { enabled: true } })` and
  `getOrganizationId`, team routes only work on the tenant's organization: an
  explicit `organizationId` for another one is `403 ORGANIZATION_TENANT_MISMATCH`,
  a `teamId` of another organization's team is `403 TEAM_TENANT_MISMATCH`
  (including `list-team-members`, which looks a team up by id alone), and
  `list-user-teams` returns only the tenant's teams. `activeTeamId` can only be
  set to one of the tenant's teams, on every session write, and is cleared when
  the active organization is.
- SSO. With `@better-auth/sso` and `getOrganizationId` or the new
  `getSSODomains(tenant)`, sign-in, registration, callbacks, SAML routes and
  provider management on a tenant's host only use that tenant's providers
  (`403 SSO_PROVIDER_TENANT_MISMATCH`). Sign-in picks the tenant's provider
  itself and pins it by id. A callback that lands on another tenant's host is
  refused before any user or session is created. See the README for the limits:
  the shared `redirectURI` callback is refused on tenant hosts, and an
  IdP-initiated SAML response is only checked against the provider.
- `teams` and `sso` options to turn team and SSO scoping on or off. Defaults keep
  the current behaviour (teams on with `getOrganizationId`; SSO on with
  `getOrganizationId` or `getSSODomains`); `false` turns that scoping off, and
  `true` without the mapping it needs throws at startup, as does `sso: false`
  with `ssoRequireTenantMapping: true`. `createTenantAuth` validates them when
  it is called.
- `@better-auth/sso` is an optional peer dependency (`>=1.6.0`). Nothing in the
  plugin loads it.
- CI also runs the suite against the latest and the 1.6 releases of
  `better-auth` and `@better-auth/sso`.
- `createTenantAuth` for database-per-tenant. It resolves the tenant from the
  request host with the plugin's resolver and serves the request from a cached
  Better Auth instance built by your `createAuth(tenant)` callback, with an
  optional `maxSize` (least recently used eviction) and `onEvict` hook, plus
  `getAuth(headers)` and `evict(tenantId?)`. Unknown or inactive tenants get
  the plugin's 404 / 403 without creating an instance, and every instance keeps
  the `multiTenant` plugin and session stamping, so a token copied across hosts
  is still refused.
- README: *Database per tenant*, including schema-per-tenant on Postgres with
  `search_path`.

### Changed

- **Migration:** `bindVerifications` adds a nullable `verification.tenantId`
  column. Run your migration before deploying, or pass `bindVerifications: false`.
  Verification rows written before the upgrade carry no stamp and are refused on
  a tenant's host, so codes issued just before the deploy stop working.
- **Behaviour change:** a magic link (or any other code) must be redeemed on the
  tenant that issued it. With one fixed `baseURL` the link opens on that host, so
  use a `baseURL` that follows the request host; see the README.
- **Behaviour change:** with `revokeScope` at its default, bulk revocation no
  longer ends the user's sessions on other tenants. A password change with
  `revokeOtherSessions` therefore leaves them alive; set `revokeScope: "all"`
  for the old behaviour.
- `/sso/callback` and `/sso/saml2/sp/acs` no longer need a session that matches
  the host: like the other callback routes, they run before a session is bound.
- Development dependencies moved to `better-auth` and `@better-auth/sso`
  `^1.7.12`. The `better-auth` peer range is still `>=1.6.0`.
- Internal: the plugin's tenant resolution moved into a shared function that
  `createTenantAuth` also uses. Behaviour is unchanged.

## 0.4.1

### Security

- **Bearer tokens bypassed the cross-tenant check.** With Better Auth's
  `bearer` plugin, a token issued on one tenant was accepted on another, for
  reads and writes, because the bearer plugin only turns `Authorization` into
  a session cookie after all before-hooks have run. The check now also looks
  up the session behind a bearer token, and refuses a foreign token even when
  a valid cookie is sent alongside it. Affects every earlier version when the
  `bearer` plugin is installed. Upgrade.
- **The organization lock covered only `set-active`.** With
  `getOrganizationId` (new in 0.4.0), `organization/create`,
  `accept-invitation` and other organization routes could still make another
  organization active on a tenant's host, giving a user owner rights there in
  apps that authorise against the active organization. Every session write is
  now checked, and `organization/create` on a tenant host requires
  `keepCurrentActiveOrganization: true`.

### Docs

- New *Security notes* section: what is enforced, and what is not (users are
  global, suspended versus unknown tenants, your own queries).

## 0.4.0

0.3.0 was never published to npm, so upgrading from 0.2.0 picks up the
0.3.0 changes below as well, including its breaking ones.

### Added

- Custom domains. Pass `getTenantByDomain(domain)` to serve a tenant from its
  own domain (`app.acme.com`) as well as its subdomain. It is called only for
  hosts outside `baseDomain`; unknown domains are `404 TENANT_NOT_FOUND`, and
  sessions stay bound to the tenant, so the cross-tenant check applies there
  too.
- `ResolvedTenant.domain`, set when the tenant was resolved from a custom
  domain.
- A startup warning when Better Auth's `advanced.crossSubDomainCookies` is
  enabled: one shared session cookie means a user can only be signed in to one
  tenant at a time.

- Organization bridge. Pass `getOrganizationId(tenant)` to tie each tenant to
  an organization in Better Auth's `organization` plugin: new sessions start
  with it active, and `/organization/set-active` refuses any other
  organization on that tenant's host (`403 ORGANIZATION_TENANT_MISMATCH`).

### Changed

- `ResolvedTenant.source` can now be `"custom-domain"`. If you switch on it
  exhaustively, add the new case.

## 0.3.0

### Breaking

- Sessions with no `tenantId` are now refused on tenant hosts with
  `403 UNBOUND_SESSION`. Previously they were let through, which made a session
  minted before the plugin was installed (or on the apex domain) valid on every
  tenant. If you have such sessions in flight, set
  `multiTenant({ unboundSessions: "allow" })` until they expire.
- Node 18 is no longer supported. Better Auth 1.6's own dependencies require
  Node 20.19 or later, so the plugin could not sign anyone in on Node 18 anyway;
  `engines` now says so.

### Added

- `requireTenantFromContext(ctx.context)` — returns the resolved tenant or throws
  `400 TENANT_REQUIRED`, for use in your own endpoints and hooks.
- `protocol` and `port` options, so `/multi-tenant/current` reports the right
  `origin` in local development (`http://acme.localhost.test:3000`).
- End-to-end tests that run the plugin inside a real Better Auth instance, on
  Node 20, 22 and 24.

### Fixed

- The paths exempt from the session-tenant check now match whole path segments.
  `/sign-in/email` is still exempt; a custom `/sign-in-as` or `/okta` route no
  longer is just because it shares a prefix.

## 0.2.0

### Added

- `tenantSessionHooks()` — a `databaseHooks` fragment that stamps each new
  session with the tenant its request resolved to. In `0.1.0` this had to be
  written by hand, and getting it wrong produced sessions the cross-tenant guard
  could not check.

  It fails closed by default: a session created on a request with no tenant is
  refused rather than minted unbound, because an untagged session is a
  credential that works on every tenant. Opt out with
  `tenantSessionHooks({ onMissingTenant: "allow" })` if you knowingly serve
  sign-in from the apex domain.

  ```ts
  betterAuth({
    plugins: [multiTenant({ baseDomain: "example.com", getTenant })],
    databaseHooks: tenantSessionHooks(),
  });
  ```

- Releases now publish from CI with [npm provenance][provenance], so the
  published tarball can be traced back to the commit and workflow run that
  produced it.

[provenance]: https://docs.npmjs.com/generating-provenance-statements

### Changed

- `Tenant`, `ResolvedTenant` and `getTenantFromContext` moved to an internal
  module. They are still exported from the package root; no import paths change.

## 0.1.0

Initial release.

- Subdomain-based tenant resolution from the request host, with reserved
  subdomains and a strict slug pattern.
- Cross-tenant session rejection: a session bound to one tenant is refused on
  another tenant's host.
- `tenantOrigin()` for per-tenant OAuth callback origins.
- The `x-tenant` header override is off by default, since it is
  client-controlled.
