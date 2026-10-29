import type { CanAccessTenant } from "./access.js";
import type { CanAdministerTenant } from "./admin.js";
import type { ResolvedTenant, Tenant } from "./context.js";
import type { GetTenantPolicy } from "./policy.js";
import type { TenantResolutionOptions } from "./tenant.js";

export interface MultiTenantOptions extends TenantResolutionOptions {
  /**
   * Look up a tenant by slug. Return `null` for unknown slugs — the plugin
   * turns that into a 404. An inactive tenant is a 403 instead, so return
   * `null` for those too if their existence must not be visible.
   */
  getTenant: (slug: string) => Promise<Tenant | null> | Tenant | null;
  /**
   * Look up a tenant by a custom domain such as `app.acme.com`. Called only
   * for hosts outside `baseDomain`, with the host lowercased and its port
   * removed. Return `null` for unknown domains — the plugin turns that into a
   * 404, like an unknown slug.
   *
   * Verify that a tenant owns a domain (for example with a DNS TXT record)
   * before you store the mapping this reads from, and add the domain to Better
   * Auth's `trustedOrigins`.
   */
  getTenantByDomain?: (domain: string) => Promise<Tenant | null> | Tenant | null;
  /**
   * Map a tenant to its organization in Better Auth's `organization` plugin.
   * When set, new sessions start with that organization active (through
   * `tenantSessionHooks()`), and on a tenant's host `/organization/set-active`
   * refuses any other organization, including clearing it, with
   * `403 ORGANIZATION_TENANT_MISMATCH`.
   *
   * It also scopes the organization plugin's team routes and `activeTeamId` to
   * that organization (`TEAM_TENANT_MISMATCH`), and, with `@better-auth/sso`,
   * limits SSO on a tenant's host to providers linked to that organization.
   */
  getOrganizationId?: (tenant: Tenant) => string | null | undefined;
  /**
   * Email domains a tenant owns, for `@better-auth/sso` providers that are not
   * linked to an organization. Such a provider belongs to the tenant when all
   * of its domains are one of these or a subdomain of one. Setting this, or
   * `getOrganizationId`, turns the SSO checks on: on a tenant's host, sign-in,
   * registration, callbacks and provider management then only use that
   * tenant's providers, else `403 SSO_PROVIDER_TENANT_MISMATCH`.
   */
  getSSODomains?: (tenant: Tenant) => string[] | null | undefined | Promise<string[] | null | undefined>;
  /**
   * Scope the `organization` plugin's team routes, `list-user-teams` and
   * `activeTeamId` to the tenant's organization. Defaults to `true` when
   * `getOrganizationId` is set, else `false`. `false` leaves teams unscoped;
   * `true` without `getOrganizationId` throws at startup.
   */
  teams?: boolean;
  /**
   * Scope Better Auth's `admin` plugin to the tenant's organization: on a
   * tenant's host, `list-users` lists its members only, routes that name a user
   * refuse anyone else (`ADMIN_TENANT_MISMATCH`), and the admin session routes
   * see the tenant's sessions only. Defaults to `true` when `getOrganizationId`
   * is set, else `false`; `true` without `getOrganizationId` throws at startup.
   */
  admin?: boolean;
  /**
   * Who may use the `admin` plugin's routes on a tenant's host, on top of the
   * admin plugin's own role check. Better Auth's admin role is global, so
   * without this an admin of one tenant administers every tenant they can get a
   * session on. Defaults to {@link organizationAdminsOnly}: an `owner` or
   * `admin` member of the tenant's organization. Anyone else gets
   * `403 ADMIN_NOT_TENANT_ADMIN`; a check that throws refuses too.
   */
  canAdministerTenant?: CanAdministerTenant;
  /**
   * Admin routes that change the global user (`set-user-password`,
   * `update-user`, `set-role`, `ban-user`, `unban-user`, `remove-user`) also
   * change it on every other tenant the user belongs to: a password or email set
   * on one tenant signs in on the others. `"refuse"` (the default) refuses them
   * for a user who is also a member of another organization
   * (`403 ADMIN_SHARED_USER`); `"allow"` lets them through.
   */
  adminSharedUsers?: "refuse" | "allow";
  /**
   * Roles of the `admin` plugin are global, and many apps read `user.role` as a
   * platform-wide permission. `"refuse"` (the default) stops `create-user` and
   * `set-role` on a tenant's host from giving out one of the admin plugin's
   * `adminRoles` (default `["admin"]`), with `403 ADMIN_ROLE_NOT_ASSIGNABLE`;
   * `"allow"` lets a tenant's administrators hand out every role.
   */
  adminRoleAssignment?: "refuse" | "allow";
  /**
   * Claim that the `jwt` plugin's tokens carry the session's tenant id in.
   * Every tenant shares one `baseURL`, so without it a token minted on one
   * tenant verifies for every other. Defaults to `"tenantId"`; `false` leaves
   * tokens as the `jwt` plugin makes them. Needs `jwt()` to be passed an
   * options object (`jwt({})`); the plugin warns at startup otherwise.
   */
  jwtTenantClaim?: string | false;
  /**
   * Refuse a request on a tenant's host whose `Origin` (or, without one,
   * `Referer`) is another host, with `403 CROSS_TENANT_ORIGIN`. Tenant
   * subdomains are "same-site" to each other, so cookies travel between them
   * and a wildcard `trustedOrigins` such as `https://*.example.com` passes
   * Better Auth's CSRF check: without this, a page on one tenant's subdomain can
   * act as the signed-in user on another. Safe methods and the OAuth / SAML
   * callback routes are exempt. Defaults to `true` for subdomain and
   * custom-domain tenancy; path tenancy shares one host and is unaffected.
   */
  sameOriginOnly?: boolean;
  /**
   * Bind `@better-auth/api-key` keys to the tenant they were created on. A key
   * is stamped with `apikey.tenantId`; on a tenant's host the key routes only
   * find that tenant's keys, and a key used as a session
   * (`enableSessionForAPIKeys`) is refused on another tenant
   * (`CROSS_TENANT_SESSION`) or without a stamp (`UNBOUND_SESSION`). With
   * `getOrganizationId`, an organization's keys must be the tenant's
   * organization's. Needs the column, so migrate when you turn it on. Defaults
   * to `false`; the plugin warns at startup when the api-key plugin is installed
   * and this is not set.
   */
  apiKeys?: boolean;
  /**
   * Bind the `deviceAuthorization` plugin's codes to the tenant that issued
   * them (`deviceCode.tenantId`). On a tenant's host the device routes only
   * find that tenant's codes, so a code approved on one tenant cannot be
   * redeemed for a session on another. Needs the column, so migrate when you
   * turn it on. Defaults to `false`; the plugin warns at startup when
   * `deviceAuthorization` is installed and this is not set.
   */
  deviceCodes?: boolean;
  /**
   * Scope `@better-auth/sso` to the tenant's providers. Defaults to `true` when
   * `getOrganizationId` or `getSSODomains` is set, else `false`. `false` leaves
   * SSO unscoped (no checks, no startup warning); `true` without either option
   * throws at startup, and so does `false` together with
   * `ssoRequireTenantMapping`.
   */
  sso?: boolean;
  /**
   * With `@better-auth/sso` installed and neither `getOrganizationId` nor
   * `getSSODomains` set, no provider is tied to a tenant, so any tenant's host
   * can use any provider (the plugin logs a warning at startup). Set this to
   * `true` to fail closed instead: every SSO route is refused on a tenant's host
   * with `403 SSO_PROVIDER_TENANT_MISMATCH` until one of those options is set.
   * Defaults to `false`.
   */
  ssoRequireTenantMapping?: boolean;
  /**
   * Bind the codes, tokens and challenges that plugins store as verification
   * rows (magic link, email and phone OTP, two-factor challenge and
   * trusted-device record, passkey challenge, SIWE nonce, OAuth state) to the
   * tenant that issued them. A row is stamped with `verification.tenantId` when
   * it is written, and redeeming or deleting a live row on another tenant's host
   * is refused with `403 VERIFICATION_TENANT_MISMATCH`. Defaults to `true`; it
   * needs the `verification.tenantId` column, so migrate before upgrading, or set
   * `false` to leave rows alone (for example with a database per tenant).
   */
  bindVerifications?: boolean;
  /**
   * Decide whether a user may get a session on a tenant. Better Auth users are
   * global, so without this an account created on one tenant signs in on every
   * other. When set, every session created on a tenant's host, by any plugin,
   * is refused with `403 TENANT_ACCESS_DENIED` unless this returns `true`; a
   * check that throws refuses too. It runs when a session is created, not on
   * each request, so revoke the sessions of a user whose access you remove.
   *
   * Use {@link organizationMembersOnly} to allow only members of the tenant's
   * organization. To keep sign-up on another tenant from revealing that an
   * email is registered, also set `emailAndPassword.autoSignIn: false` or
   * `requireEmailVerification: true`; Better Auth then answers the same way for
   * a known and an unknown email.
   */
  canAccessTenant?: CanAccessTenant;
  /**
   * Decide whether a given request path must carry a tenant. Defaults to
   * requiring one everywhere, which is the safe default: a path that forgets to
   * opt in fails closed instead of silently serving cross-tenant data.
   */
  requireTenant?: (path: string) => boolean;
  /**
   * Read the tenant id a session is bound to. Defaults to `session.tenantId`,
   * the field this plugin adds to the session table.
   */
  getSessionTenantId?: (session: unknown) => string | null | undefined;
  /**
   * Paths whose session must belong to the resolved tenant. Defaults to every
   * path except the sign-in/sign-up/callback routes, which run before a session
   * is bound to anything.
   */
  enforceSessionTenant?: (path: string) => boolean;
  /**
   * What to do with a session that carries no tenant id when it shows up on a
   * tenant's host — typically one minted before the plugin was installed, or on
   * the apex domain.
   *
   * `"reject"` (the default) refuses it with `403 UNBOUND_SESSION`. An untagged
   * session cannot be checked against the host, so accepting it means it works
   * on every tenant.
   *
   * `"allow"` lets it through. Use it only while migrating existing sessions.
   */
  unboundSessions?: "reject" | "allow";
  /**
   * Which of the user's sessions `/revoke-sessions`, `/revoke-other-sessions`
   * and `/change-password` with `revokeOtherSessions` end on a tenant's host.
   *
   * `"tenant"` (the default) ends the tenant's sessions only (plus any with no
   * tenant), so one tenant cannot sign the user out of the others. Because the
   * password is global, a password change then leaves the user's sessions on
   * other tenants alive.
   *
   * `"all"` is Better Auth's behaviour: every session of the user.
   */
  revokeScope?: "tenant" | "all";
  /**
   * Protocol reported in the `origin` returned by `/multi-tenant/current`.
   * Defaults to `"https"`; set `"http"` for local development.
   */
  protocol?: string;
  /** Port reported in the `origin` returned by `/multi-tenant/current`. */
  port?: number;
  /**
   * Trust the origin of the host a request arrived on when that host is an
   * active tenant's subdomain or custom domain, without listing it in Better
   * Auth's `trustedOrigins`. Only the requesting tenant's own origin is added,
   * never another tenant's, so a `callbackURL` on a different tenant's domain is
   * still refused. Defaults to `true`.
   */
  trustTenantOrigins?: boolean;
  /**
   * Build Better Auth's `baseURL` from the tenant's host on each request, so
   * magic links, verification emails and OAuth redirect URIs point at the
   * subdomain or custom domain the flow started on instead of one fixed host.
   * The scheme is `protocol` when set, otherwise the request's. Defaults to
   * `false`: it also changes the `iss` and `aud` of `jwt` tokens and the
   * redirect URIs your OAuth providers must accept.
   */
  tenantBaseURL?: boolean;
  /**
   * Per-tenant auth policy: which sign-in methods a tenant allows, whether it
   * allows sign-up, and whether it requires two-factor authentication. Enforced
   * on the server. Called at most once per request; cache it like `getTenant`.
   */
  getTenantPolicy?: GetTenantPolicy;
  /**
   * The host Better Auth's `oAuthProxy` plugin uses as its `productionURL`
   * (`auth.example.com`): OAuth providers redirect there, and it hands the
   * profile to the tenant the flow started on, where the session is created.
   * That host names no tenant, so it may serve the provider callback
   * (`/callback/:id`) without one; every other route on it is refused as usual.
   * The hand-off is bound to the starting tenant by its OAuth state, so it is
   * refused on any other tenant.
   */
  oauthProxyHost?: string;
  /**
   * `"global"` (the default): one user per email, shared by every tenant, as in
   * Better Auth. `"tenant"`: the same email on two tenants is two separate users,
   * each with its own password, accounts and sessions. Every `user` and `account`
   * query is limited to the requesting tenant (and, with `bindVerifications`,
   * every `verification` query on a tenant's host), and a user or account query
   * outside a tenant's request is refused. Adds `user.tenantId` and
   * `account.tenantId`; replace the global unique index on `user.email` with a
   * unique `(tenantId, email)` in your migration. See docs/security.md.
   */
  identity?: "global" | "tenant";
  /** Called after a tenant resolves. Useful for logging and metrics. */
  onTenantResolved?: (resolved: ResolvedTenant, path: string) => void | Promise<void>;
  /**
   * Give every tenant its own cookie names (`better-auth.acme.session_token`),
   * so one browser can be signed in to several tenants on the same host.
   * Defaults to `true` with `pathPrefix` and `false` otherwise; subdomains
   * already keep their cookies apart.
   */
  tenantCookies?: boolean;
}
