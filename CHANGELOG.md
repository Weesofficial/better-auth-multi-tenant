# Changelog

## Unreleased

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
  id or slug other than the tenant's with `403 ORGANIZATION_TENANT_MISMATCH`,
  and `organization/list` returns only the tenant's organization.

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
