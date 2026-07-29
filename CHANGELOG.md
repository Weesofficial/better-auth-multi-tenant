# Changelog

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
