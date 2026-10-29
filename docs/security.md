# Security notes

What the plugin enforces on a tenant's host:

- A state-changing request whose `Origin` (or `Referer`) is another host is
  refused (`403 CROSS_TENANT_ORIGIN`, `sameOriginOnly`). Tenant subdomains are
  "same-site", so browsers send a tenant's cookies on requests from another
  tenant's page, and a wildcard `trustedOrigins` such as `https://*.example.com`
  lets them past Better Auth's CSRF check. OAuth and SAML callbacks are exempt.
  It applies to subdomain and custom-domain tenancy only: path tenancy shares
  one origin (see [Path-based tenants](./tenancy-modes.md#path-based-tenants)), and with
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
  See [Teams](./organization.md#teams) and [With `@better-auth/sso`](./organization.md#with-better-authsso) for
  what is and is not covered.
- With `getOrganizationId`, organization, invitation and member routes that name
  an id only work on the tenant's organization (see
  [With the `organization` plugin](./organization.md#with-the-organization-plugin)).
- With `canAccessTenant`, a session is only created for a user the tenant lets
  in, whichever plugin creates it
  ([Who may sign in to a tenant](./organization.md#who-may-sign-in-to-a-tenant)).
- Every session created on a tenant's host through Better Auth's internal
  adapter gets the tenant stamp from `tenantSessionHooks()`, whichever plugin
  creates it; this repository tests password, username, phone, magic-link,
  email OTP, two-factor, anonymous, passkey, generic OAuth, One Tap and SIWE
  sessions ([Authentication plugins](../README.md#authentication-plugins)). One created on a
  request with no tenant is refused
  (`400 TENANT_REQUIRED`) and one without a stamp is refused on use
  (`403 UNBOUND_SESSION`), so a plugin that skips the adapter gets no working
  session either. `@better-auth/api-key` sessions are bound with `apiKeys: true`,
  see [API keys](../README.md#api-keys).
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
  ([details](./auth-plugins.md#per-plugin-notes)):
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
  [docs/auth-plugins.md](./auth-plugins.md)).
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

Report vulnerabilities privately; see [SECURITY.md](../SECURITY.md).

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
