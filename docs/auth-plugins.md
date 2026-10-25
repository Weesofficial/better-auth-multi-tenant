# Better Auth authentication plugins with multi-tenancy

How each of Better Auth's authentication plugins behaves next to this plugin.
Every statement here is backed by an end-to-end test (a real Better Auth
instance, driven over HTTP) in `test/verification.test.ts`,
`test/auth-plugins.test.ts`, `test/auth-plugins-external.test.ts`,
`test/auth-plugins-organization.test.ts` and
`test/auth-plugins-tenant-auth.test.ts`. Tested with `better-auth` 1.7.12 and
`@better-auth/passkey` 1.7.12; the suite also passes on `better-auth` 1.6.33
except the SIWE tests, which are skipped there (1.6's SIWE request shape
differs) and one organization-route test that already failed on 1.6 before this
work (`/organization/get-organization` does not exist in 1.6).

The three mechanisms that do the work, in a single database:

1. **Session stamp.** `tenantSessionHooks()` writes `session.tenantId` whenever
   any plugin creates a session through Better Auth's internal adapter, and the
   plugin refuses a session on any other tenant's host (`CROSS_TENANT_SESSION`).
2. **`canAccessTenant`.** Runs in `session.create.before`, so it covers every
   plugin that creates a session. Users are global; this is the only thing that
   says which of them a tenant lets in.
3. **Verification binding** (`bindVerifications`, default `true`). Codes, tokens,
   nonces, challenges and pending cookies that plugins keep as `verification`
   rows are stamped with the tenant of the request that wrote them
   (`verification.tenantId`). Consuming or deleting a live row from another
   tenant's host answers `403 VERIFICATION_TENANT_MISMATCH`. Two companion
   hooks: a trusted-device cookie of another tenant is dropped before sign-in
   (so two-factor still challenges), and a session cookie of another tenant is
   ignored on the sign-in, sign-up and callback routes.

With `createTenantAuth` (database per tenant) the other tenant's instance has
never seen a code, so a code replayed on another host fails by itself; with one
database shared by several instances, the binding refuses it.

## Compatibility

| Plugin | Works | Cross-tenant risk | Status |
| --- | --- | --- | --- |
| `twoFactor` | yes | Pending-challenge cookie, OTP, backup code and trusted-device cookie replayed on another tenant. Enrolment is per user, so 2FA is on for every tenant. | **Fixed here** |
| `username` | yes | Usernames are global: a name taken on one tenant is taken on all, `/is-username-available` and sign-up reveal it, and the same login works on every tenant. | **Config needed** (`canAccessTenant`); per-tenant uniqueness needs **upstream** |
| `anonymous` | yes | An anonymous session of one tenant was linked to (and deleted by) a sign-in on another. | **Fixed here** |
| `phoneNumber` | yes | OTP redeemed on another tenant; one OTP slot per number across tenants; the number is global. A custom `verifyOTP` bypasses the stored code. | **Fixed here**; custom `verifyOTP` is **config needed**; shared slot **upstream** |
| `magicLink` | yes | Link followed on another tenant. | **Fixed here**; needs a `baseURL` that follows the host (**config**) |
| `emailOTP` | yes | OTP redeemed on another tenant; `check-verification-otp` can be probed from any tenant; one slot per email and type across tenants. | **Fixed here** for redemption; the rest is **upstream** |
| `passkey` (`@better-auth/passkey`) | yes | Challenge answered on another tenant. `rpID` and `origin` are fixed per instance. | **Fixed here** (challenge); per-tenant `rpID` is **config needed** (`createTenantAuth`) |
| `genericOAuth` | yes | State started on one tenant redeemed on another. The redirect URI follows `baseURL`. | **Fixed here**; `baseURL` and redirect URIs are **config needed** |
| `oneTap` | yes | A Google ID token proves identity to every tenant of the instance. | **Config needed** (`createTenantAuth` with a client id per tenant); single instance **upstream** |
| `siwe` | yes | Nonce used on another tenant. The message `domain` is one value per instance. | **Fixed here** (nonce); per-tenant domain is **config needed** (`createTenantAuth`) |
| `deviceAuthorization` | yes | A code approved on one tenant redeemed for a session on another. Codes live in their own `deviceCode` table, not as verification rows. | **Fixed here** with `deviceCodes: true` (test: `test/device-authorization.test.ts`) |

"Fixed here" means a failing test was written first and the fix lives in `src/`.
Nothing in this plugin copies or patches Better Auth: it uses hooks,
`databaseHooks` and endpoints only.

## Upgrading: the `verification.tenantId` column

Verification binding adds one nullable column. Generate or run your migration
(`npx auth migrate` / `npx auth generate`) before deploying, or set
`bindVerifications: false` to opt out (for example with a database per tenant,
where there is nothing to bind). A row with no stamp, written before the upgrade,
is refused on a tenant's host, so codes issued just before the deploy stop
working; users ask for a new one.

Things the binding does not reach:

- **`secondaryStorage` without `verification.storeInDatabase: true`.** Better
  Auth consumes a row from secondary storage without running database hooks, so
  nothing is enforced. The plugin logs a warning at startup. Set
  `verification: { storeInDatabase: true }` to enforce it.
- **Codes verified outside the verification table**: `phoneNumber`'s
  `verifyOTP` (for example Twilio Verify) and any other custom verifier. See
  [phoneNumber](#phonenumber).
- **Rows written on a request with no tenant** (`requireTenant: () => false`
  paths, server-side `auth.api` calls without request headers) carry no stamp, so
  a tenant's host refuses them.
- **Account creation is not gated by `canAccessTenant`**: it gates sessions. A
  plugin that creates the user before the session (SIWE, a sign-in by OTP or
  OAuth) leaves the account behind when the session is refused. A password
  sign-up on a refused tenant is rolled back, because Better Auth creates the
  user and session in one transaction.
- **Side effects before the session exists** still happen on a refused tenant:
  a magic link or OTP is consumed, and proving an unverified email ends the
  user's older sessions.

## Per-plugin notes

Each note answers: (a) are sessions stamped and refused on another tenant, (b)
can a code, token, challenge, nonce or cookie issued on tenant A be redeemed on
tenant B, (c) does `canAccessTenant` apply, (d) what is global.

### twoFactor

- **(a)** Yes. The session created after the challenge, and the fresh session
  that `/two-factor/enable` swaps in, are stamped. Cookies of another tenant are
  refused on the `/two-factor/*` routes that need a session.
- **(b)** The pending-challenge cookie (`two_factor`) names a verification row
  (`2fa-…`), with companion rows for the attempt counter and the emailed or
  texted OTP. All are written on the tenant's host, so completing a challenge
  from another host answers `403`/`401` and creates no session, for TOTP, OTP
  and backup codes alike (backup codes only work together with a pending cookie
  or a session). The **trusted-device cookie** is a signed pointer to a
  verification row; on another tenant's `/sign-in/email`, `/sign-in/username`
  or `/sign-in/phone-number` it is dropped before the route reads it, so the
  sign-in meets the normal challenge. Refusing the request instead would leave
  the session cookie that the sign-in already set, with no second factor
  (see [upstream proposal 3](./upstream-proposals.md)). Tested with an OTP and
  backup codes; TOTP shares the same challenge code path.
- **(c)** Yes, twice: the sign-in creates a session before the challenge (the
  plugin deletes it again), so a user the tenant refuses never gets a challenge;
  the session after the challenge is checked too.
- **(d)** Two-factor settings (`twoFactorEnabled`, TOTP secret, backup codes)
  belong to the user, so they apply on every tenant. Enrolling on one tenant
  turns the challenge on for all.

### username

- **(a)** Yes (`/sign-in/username`).
- **(b)** Nothing is issued: no code, token or cookie besides the session.
- **(c)** Yes.
- **(d)** `user.username` is unique across the whole table. Consequences, all
  tested: a user created on `acme` signs in on `globex` with the same username
  and password (gate it with `canAccessTenant`); `/is-username-available` and a
  clashing sign-up (`USERNAME_IS_ALREADY_TAKEN`) tell any tenant that a name is
  taken somewhere. If that must not be visible, namespace usernames yourself
  (for example store `acme:alice` through `usernameValidator` and your own
  sign-up path) or accept it; per-tenant uniqueness needs Better Auth's
  support ([upstream proposal 4](./upstream-proposals.md)).

### anonymous

- **(a)** Yes (`/sign-in/anonymous`), including `canAccessTenant`.
- **(b)** The anonymous plugin reads the session cookie on `/sign-in/*`,
  `/sign-up/*` and callbacks, links the anonymous user to the account being
  signed in to (`onLinkAccount`) and deletes it. Those routes skip the
  cross-tenant check, so an anonymous session of tenant A used to be linked and
  deleted by a sign-in on tenant B. On routes where the check is off, a session
  of another tenant is now dropped from the request, so the route behaves as if
  the caller had none. Linking on the issuing tenant is unchanged.
- **(c)** Yes.
- **(d)** Nothing shared: anonymous users have generated emails.

### phoneNumber

- **(a)** Yes, for `/sign-in/phone-number` and for the session that
  `/phone-number/verify` creates.
- **(b)** Fixed for the stored OTP: send-OTP, verify, and the password-reset OTP
  are bound to the issuing tenant, and a refused verification creates no user.
  Not covered:
  - **A custom `verifyOTP`** (Twilio Verify and the like) checks the code
    outside the verification table, so there is nothing to bind. Check the
    tenant yourself, for example with the OTP provider's per-tenant service id
    (`getTenantFromContext(ctx.context)` inside `verifyOTP`).
  - **One slot per number.** The verification identifier is the bare phone
    number, so a code requested on another tenant for the same number replaces
    the pending one (Better Auth reads the newest row). Nobody can redeem it,
    but the user's code stops working ([upstream proposal 2](./upstream-proposals.md)).
- **(c)** Yes.
- **(d)** `user.phoneNumber` is global: the same number and password sign in on
  every tenant and the number cannot be reused for another account, which also
  tells a tenant that it is registered elsewhere. Gate it with
  `canAccessTenant`.

### magicLink

- **(a)** Yes.
- **(b)** Fixed: the token row is bound, so a link followed on another tenant
  answers `403 VERIFICATION_TENANT_MISMATCH` and leaves the link usable on its own
  tenant. The link is built from Better Auth's `baseURL`, so it must open on the
  tenant that sent it: with one fixed `baseURL` it opens on that host and is
  refused for every other tenant. Use a `baseURL` that follows the request host:

  ```ts
  betterAuth({
    baseURL: { allowedHosts: ["*.example.com"], protocol: "https", fallback: "https://app.example.com" },
    trustedOrigins: ["https://*.example.com"],
  });
  ```

  (A test sends and follows links on two tenants this way.)
- **(c)** Yes.
- **(d)** The email is global; the link creates the account if it does not exist.

### emailOTP

- **(a)** Yes.
- **(b)** Fixed for redemption: sign-in, `verify-email`, password reset and
  change-email OTPs are bound. Remaining: `/email-otp/check-verification-otp`
  compares a guess without consuming it and counts an attempt, from any tenant
  (the attempt budget is shared by the slot, so it is no easier to guess than on
  the issuing tenant); and the identifier is `type-email`, one slot per email and
  type across tenants, with the same effect as for phone numbers
  ([upstream proposal 2](./upstream-proposals.md)).
- **(c)** Yes.
- **(d)** The email is global.

### passkey

`@better-auth/passkey` is a separate package (a `devDependency` here; this
plugin never imports it).

- **(a)** Yes. A software authenticator signs real assertions in the tests.
- **(b)** The challenge (sign-in and registration) is a verification row named by
  a signed cookie; it is bound, so an assertion answered on another host fails
  with `VERIFICATION_TENANT_MISMATCH` even when the assertion itself is valid.
  What the passkey plugin checks beyond that is the **relying party**: `rpID`
  defaults to the hostname of a *string* `baseURL` (a dynamic `baseURL` object
  falls back to `localhost`, so always set it), and the origin check compares the
  assertion with the request's own `Origin` header unless you set `origin`,
  so the real boundary is the `rpID` hash that the browser signs.
  - `rpID: "example.com"`: one credential works on every tenant subdomain. The
    session is stamped with the tenant it is used on; `canAccessTenant` decides.
  - `rpID: "acme.example.com"` in a single instance: passkeys only work on that
    host; browsers on `globex` sign another rp id, which the instance refuses.
  - **One rpID per tenant needs one instance per tenant:**

  ```ts
  createTenantAuth({
    baseDomain: "example.com",
    getTenant,
    createAuth: (tenant) => ({
      database: databaseFor(tenant),
      plugins: [
        passkey({
          rpID: `${tenant.slug}.example.com`,
          rpName: tenant.name as string,
          origin: `https://${tenant.slug}.example.com`,
        }),
      ],
    }),
  });
  ```

  (Tested: the same credential is accepted by each tenant for its own rp id and
  refused for the other's.) For a custom domain use that domain as `rpID`.
- **(c)** Yes.
- **(d)** Passkeys belong to the user; `list-user-passkeys` shows all of them,
  whichever tenant registered them.

### genericOAuth

In Better Auth 1.7 the plugin registers its providers as social providers, so
the routes are `/sign-in/social` (`provider`) and `/callback/:providerId`, with
the core state handling.

- **(a)** Yes, stamped with the tenant of the *callback* host.
- **(b)** The state is a verification row plus a signed cookie. The cookie is
  host-only, but a client can replay it, and before the binding a state started
  on `acme` could finish on `globex`. Now the callback on the other host is
  refused (Better Auth turns the error into a redirect to its error page with
  `error=internal_server_error`) and the row survives for the host that
  started it. The `redirect_uri` sent to the provider is
  `{baseURL}/callback/{providerId}` (or the provider's `redirectURI`): a fixed
  one sends every tenant to one host, where the flow of any other tenant fails
  its state check. Per-tenant setup:
  1. a `baseURL` that follows the host (as for magic links);
  2. register `https://acme.example.com/api/auth/callback/<id>` for every tenant
     at the provider (wildcards are rarely allowed);
  3. do not set `redirectURI` on the provider config.
  With `createTenantAuth` each tenant can also have its own client id and
  secret in `createAuth`.
- **(c)** Yes.
- **(d)** Accounts link by email, globally: a social identity linked on one
  tenant signs in on every tenant that `canAccessTenant` lets the user into.

### oneTap

- **(a)** Yes.
- **(b)** Nothing is stored: the Google ID token is a bearer proof checked
  against the plugin's `clientId` (its audience), and nothing in it names the
  page or the tenant. In a single instance a token obtained for one tenant's page
  signs in on any tenant of the instance (tested). Per-tenant Google client ids
  need one instance per tenant:

  ```ts
  createTenantAuth({
    baseDomain: "example.com",
    getTenant,
    createAuth: (tenant) => ({
      database: databaseFor(tenant),
      plugins: [oneTap({ clientId: googleClientIdFor(tenant) })],
    }),
  });
  ```

  (Tested: a token minted for one tenant's client id is refused by another's.)
  Also set the same client id on the page's `google.accounts.id.initialize`.
  Single-instance support would need a per-request `clientId`
  ([upstream proposal 1](./upstream-proposals.md)).
- **(c)** Yes.
- **(d)** As for OAuth: accounts link by email.

### siwe

- **(a)** Yes.
- **(b)** The nonce is a verification row (`siwe:<nonce>`) consumed on verify, so
  a nonce handed out on one tenant fails on another. The message `domain` is
  compared with the plugin's `domain` option, not with the host: one value for
  the instance, so a message for that domain is accepted on every tenant, and a
  message for the tenant's own host is refused when the option names another.
  Per-tenant domains need one instance per tenant:

  ```ts
  createTenantAuth({
    baseDomain: "example.com",
    getTenant,
    createAuth: (tenant) => ({
      database: databaseFor(tenant),
      plugins: [siwe({ domain: `${tenant.slug}.example.com`, getNonce, verifyMessage })],
    }),
  });
  ```

  (Tested: each tenant accepts messages for its own domain only.) Your
  `verifyMessage` should also check `uri` and `chainId` as your app requires.
- **(c)** Yes.
- **(d)** A wallet address is one account on every tenant (`walletAddress` has
  no tenant), and, as noted above, the account is created before
  `canAccessTenant` refuses the session.

## With the organization bridge and teams

With `getOrganizationId`, teams on, and `canAccessTenant: organizationMembersOnly`
(tested with password/username, magic link and email OTP): the session a plugin
creates starts with the tenant's organization active, a non-member (or a member
of another tenant's organization only) gets `TENANT_ACCESS_DENIED`, and on that
session `set-active` and `set-active-team` still refuse another organization's
ids (`ORGANIZATION_TENANT_MISMATCH`, `TEAM_TENANT_MISMATCH`).

## Configuration checklist

- Put `multiTenant()` first in `plugins`, so its hooks run before the other
  plugins' (the foreign-session and trusted-device hooks must act before they
  read the cookies).
- Run the `verification.tenantId` migration (or `bindVerifications: false`).
- Use a `baseURL` that follows the host for every flow that emails or redirects
  to a link (magic link, OAuth, password reset).
- Keep `verification.storeInDatabase: true` if you use `secondaryStorage`.
- Set `canAccessTenant` unless every user may use every tenant.
- Passkey, SIWE, One Tap: `createTenantAuth` when each tenant needs its own
  relying party, domain or client id.
