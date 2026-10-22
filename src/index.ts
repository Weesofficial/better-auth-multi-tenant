import { APIError, createAuthEndpoint, createAuthMiddleware, getSessionFromCtx } from "better-auth/api";
import type { BetterAuthPlugin } from "better-auth";
import { tenantOrigin, type ResolverOptions } from "./resolver.js";
import { ERROR_CODES } from "./error-codes.js";
import { assertTrustProxy } from "./proxy.js";
import { resolveTenant } from "./tenant.js";

export type { TenantErrorCode } from "./error-codes.js";
export { requestHost } from "./proxy.js";
export type { ProxyRequest, RequestHost, TrustProxy } from "./proxy.js";

export {
  resolveTenantSlug,
  normalizeHost,
  tenantOrigin,
  DEFAULT_RESERVED,
  DEFAULT_SLUG_PATTERN,
} from "./resolver.js";
export type { ResolverOptions, TenantResolution, TenantRejection } from "./resolver.js";

import {
  getTenantFromContext,
  requireTenantFromContext,
  setTenantOnContext,
  type ResolvedTenant,
  type Tenant,
} from "./context.js";
import { tenantAccessHook, type CanAccessTenant } from "./access.js";
import { invitationListHook, organizationScopeHook } from "./organization.js";
import { foreignSessionHook } from "./foreign-session.js";
import { revokeScopeHook } from "./revoke.js";
import { resolveScoping } from "./scoping.js";
import { ssoGuardHooks, ssoRefuseHook } from "./sso.js";
import { teamListHook, teamOrganizationId, teamScopeHook, teamTenantMismatch } from "./teams.js";
import { trustDeviceHook, verificationBindingHooks, verificationSchema } from "./verification.js";

export { getTenantFromContext, requireTenantFromContext } from "./context.js";
export type { ResolvedTenant, Tenant } from "./context.js";
export { organizationMembersOnly } from "./access.js";
export type { CanAccessTenant, TenantAccessContext } from "./access.js";
export { createTenantAuth } from "./tenant-auth.js";
export type { TenantAuth, TenantAuthOptions } from "./tenant-auth.js";
export { tenantSessionHooks } from "./session-hooks.js";
export type { TenantSessionHookOptions } from "./session-hooks.js";

export interface MultiTenantOptions extends ResolverOptions {
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
  /** Called after a tenant resolves. Useful for logging and metrics. */
  onTenantResolved?: (resolved: ResolvedTenant, path: string) => void | Promise<void>;
}

/** Paths that legitimately run without a tenant-bound session. */
const UNBOUND_PATHS = [
  "/sign-in",
  "/sign-up",
  "/callback",
  "/oauth2/callback",
  "/sso/callback",
  "/sso/saml2/sp/acs",
  "/verify-email",
  "/reset-password",
  "/request-password-reset",
  "/error",
  "/ok",
];

// Match whole path segments, so `/sign-in/email` is an entry point but
// `/sign-in-as-admin` or `/okta` is not.
const defaultEnforceSessionTenant = (path: string) =>
  !UNBOUND_PATHS.some((p) => path === p || path.startsWith(`${p}/`));

/**
 * The session behind an `Authorization: Bearer` header, if any. Used only to
 * refuse a request, never to allow one, so the token's signature need not be
 * checked here: the bearer plugin does that before it authenticates anything.
 */
async function findBearerSession(ctx: {
  headers?: Headers;
  context: { internalAdapter: { findSession: (token: string) => Promise<unknown> } };
}) {
  const header = ctx.headers?.get("authorization");
  if (!header || !/^bearer\s/i.test(header)) return null;
  let value = header.slice(7).trim();
  try {
    value = decodeURIComponent(value);
  } catch {
    // Not URI-encoded; use as is.
  }
  // Signed tokens are `token.signature`; the session token is the first part.
  const token = value.split(".")[0];
  return token ? ctx.context.internalAdapter.findSession(token) : null;
}

/**
 * Subdomain-based multi-tenancy for Better Auth.
 *
 * Resolves `acme.example.com` to a tenant, refuses requests whose session
 * belongs to a different tenant, and exposes the resolved tenant to your own
 * endpoints.
 *
 * @example
 * ```ts
 * import { betterAuth } from "better-auth";
 * import { multiTenant } from "better-auth-multi-tenant";
 *
 * export const auth = betterAuth({
 *   plugins: [
 *     multiTenant({
 *       baseDomain: "example.com",
 *       getTenant: (slug) => db.tenant.findUnique({ where: { slug } }),
 *     }),
 *   ],
 * });
 * ```
 */
export const multiTenant = (options: MultiTenantOptions) => {
  const {
    getTenant,
    getTenantByDomain,
    getOrganizationId,
    getSSODomains,
    teams: _teams,
    sso: ssoOption,
    ssoRequireTenantMapping = false,
    bindVerifications = true,
    canAccessTenant,
    requireTenant = () => true,
    getSessionTenantId = (session) =>
      (session as { session?: { tenantId?: string } } | null)?.session?.tenantId,
    enforceSessionTenant = defaultEnforceSessionTenant,
    unboundSessions = "reject",
    revokeScope = "tenant",
    protocol,
    port,
    onTenantResolved,
    ...resolverOptions
  } = options;
  assertTrustProxy(resolverOptions.trustProxy);

  const { hasSSOMapping, teamsScoped, ssoScoped } = resolveScoping(options);
  const sso = ssoScoped
    ? ssoGuardHooks(getSSODomains)
    : { before: ssoRequireTenantMapping ? [ssoRefuseHook] : [], after: [] };

  return {
    id: "multi-tenant",

    init(ctx) {
      // One apex-domain cookie for every tenant: the cross-tenant check still
      // refuses it on the wrong tenant, but signing in to one tenant signs the
      // user out of the others.
      if (ctx.options.advanced?.crossSubDomainCookies?.enabled) {
        ctx.logger.warn(
          "[better-auth-multi-tenant] advanced.crossSubDomainCookies is enabled, so every tenant subdomain shares one session cookie. " +
            "Users can only be signed in to one tenant at a time, and other tenants answer 403 CROSS_TENANT_SESSION. " +
            "Turn it off unless you deliberately want a single sign-in across tenants.",
        );
      }

      if (bindVerifications && ctx.options.secondaryStorage && !ctx.options.verification?.storeInDatabase) {
        ctx.logger.warn(
          "[better-auth-multi-tenant] verification rows live only in secondaryStorage, where Better Auth runs no database hooks, " +
            "so codes and tokens are not bound to the tenant that issued them. Set verification.storeInDatabase: true to enforce bindVerifications.",
        );
      }

      if (ssoOption !== false && !hasSSOMapping && ctx.options.plugins?.some((p) => p.id === "sso")) {
        ctx.logger.warn(
          ssoRequireTenantMapping
            ? "[better-auth-multi-tenant] @better-auth/sso is installed and ssoRequireTenantMapping is on, but neither getOrganizationId nor getSSODomains is set, " +
                "so every SSO route is refused on a tenant's host. Set one of them to map providers to tenants."
            : "[better-auth-multi-tenant] @better-auth/sso is installed but neither getOrganizationId nor getSSODomains is set, " +
                "so any tenant's host can use any SSO provider. Set one of them, or set ssoRequireTenantMapping: true to refuse SSO until you do.",
        );
      }

      const accessHooks = canAccessTenant ? { create: { before: tenantAccessHook(canAccessTenant) } } : {};
      const verificationHooks = bindVerifications ? verificationBindingHooks() : {};
      if (!getOrganizationId) {
        return canAccessTenant || bindVerifications
          ? { options: { databaseHooks: { ...verificationHooks, ...(canAccessTenant ? { session: accessHooks } : {}) } } }
          : undefined;
      }
      const orgPlugin = ctx.options.plugins?.find((p) => p.id === "organization");
      const teamsEnabled =
        teamsScoped && Boolean((orgPlugin?.options as { teams?: { enabled?: boolean } } | undefined)?.teams?.enabled);
      return {
        options: {
          databaseHooks: {
            ...verificationHooks,
            session: {
              ...accessHooks,
              update: {
                // The set-active check covers one route; organization create,
                // accept-invitation and others move activeOrganizationId too.
                // Catch every write here. Clearing it is allowed: that only
                // drops privileges, and leave/remove-member need it.
                before: async (
                  data: Record<string, unknown>,
                  hookCtx: { context?: { adapter?: Parameters<typeof teamOrganizationId>[0] } } | null,
                ): Promise<{ data: Record<string, unknown> } | undefined> => {
                  const expected = getTenantFromContext(hookCtx?.context)?.organizationId;
                  if (!expected) return;
                  const next = data.activeOrganizationId;
                  if (next && next !== expected) {
                    throw new APIError("FORBIDDEN", {
                      code: "ORGANIZATION_TENANT_MISMATCH",
                      message: "Only this tenant's organization can be active here",
                    });
                  }
                  // The active team must belong to the tenant's organization. This
                  // also covers accept-invitation, which sets the team first.
                  const team = data.activeTeamId;
                  if (teamsScoped && team) {
                    const adapter = hookCtx?.context?.adapter;
                    if (typeof team !== "string" || !adapter || (await teamOrganizationId(adapter, team)) !== expected) {
                      throw teamTenantMismatch();
                    }
                  }
                  // A team belongs to the organization that was active.
                  if (teamsEnabled && next === null && team === undefined) {
                    return { data: { ...data, activeTeamId: null } };
                  }
                },
              },
            },
          },
        },
      };
    },

    schema: {
      session: {
        fields: {
          tenantId: {
            type: "string",
            required: false,
            // Never accepted from the client: the tenant comes from the host.
            input: false,
          },
        },
      },
      ...(bindVerifications ? verificationSchema : {}),
    },

    $ERROR_CODES: ERROR_CODES,

    hooks: {
      before: [
        {
          // Resolve on every request so downstream handlers can rely on it.
          matcher: () => true,
          handler: createAuthMiddleware(async (ctx) => {
            const path = ctx.path ?? "";
            const resolved = await resolveTenant(
              { ...resolverOptions, getTenant, getTenantByDomain },
              ctx.headers,
              !requireTenant(path),
              ctx.request,
            );
            if (!resolved) return;

            const organizationId = getOrganizationId?.(resolved.tenant);
            if (organizationId) resolved.organizationId = organizationId;

            setTenantOnContext(ctx.context, resolved);
            await onTenantResolved?.(resolved, path);
          }),
        },
        {
          // The core isolation property: a session issued for tenant A must not
          // be usable on tenant B's host, no matter what the caller sends.
          matcher: (ctx) => enforceSessionTenant(ctx.path ?? ""),
          handler: createAuthMiddleware(async (ctx) => {
            const resolved = getTenantFromContext(ctx.context);
            if (!resolved) return;

            // Check the cookie session and any bearer token. The bearer plugin
            // only turns `Authorization` into a cookie after every before-hook
            // has run, so getSessionFromCtx cannot see it here.
            const sessions = [await getSessionFromCtx(ctx), await findBearerSession(ctx)];

            for (const session of sessions) {
              if (!session) continue; // Unauthenticated: the normal 401 path handles it.

              const sessionTenantId = getSessionTenantId(session);
              // A session with no tenant predates the plugin (or was minted on
              // the apex). Accepting it would make it valid on every tenant.
              if (!sessionTenantId) {
                if (unboundSessions === "allow") continue;
                throw new APIError("FORBIDDEN", {
                  code: "UNBOUND_SESSION",
                  message: "This session is not bound to a tenant",
                });
              }

              if (sessionTenantId !== resolved.tenant.id) {
                throw new APIError("FORBIDDEN", {
                  code: "CROSS_TENANT_SESSION",
                  message: "This session belongs to a different tenant",
                });
              }
            }
          }),
        },
        {
          // With an organization bridge, a tenant's host only ever has that
          // tenant's organization active.
          // Creating an organization makes it active unless the caller keeps
          // the current one. Refuse before anything is written, so a tenant host
          // never ends up with a half-created organization.
          matcher: (ctx) => ctx.path === "/organization/create",
          handler: createAuthMiddleware(async (ctx) => {
            if (!getTenantFromContext(ctx.context)?.organizationId) return;
            if ((ctx.body as { keepCurrentActiveOrganization?: boolean } | undefined)?.keepCurrentActiveOrganization) return;
            throw new APIError("FORBIDDEN", {
              code: "ORGANIZATION_TENANT_MISMATCH",
              message: "Only this tenant's organization can be active here; pass keepCurrentActiveOrganization: true",
            });
          }),
        },
        {
          // A user's sessions span tenants; revoking one from another tenant's
          // host would let that host sign the user out elsewhere.
          matcher: (ctx) => ctx.path === "/revoke-session",
          handler: createAuthMiddleware(async (ctx) => {
            const resolved = getTenantFromContext(ctx.context);
            const token = (ctx.body as { token?: unknown } | undefined)?.token;
            if (!resolved || typeof token !== "string") return;
            const target = await ctx.context.internalAdapter.findSession(token);
            if (target && getSessionTenantId(target) !== resolved.tenant.id) {
              throw new APIError("FORBIDDEN", {
                code: "CROSS_TENANT_SESSION",
                message: "This session belongs to a different tenant",
              });
            }
          }),
        },
        foreignSessionHook(getSessionTenantId, enforceSessionTenant),
        ...(bindVerifications ? [trustDeviceHook] : []),
        ...(revokeScope === "tenant" ? [revokeScopeHook(getSessionTenantId)] : []),
        ...(getOrganizationId ? [organizationScopeHook] : []),
        ...(teamsScoped ? [teamScopeHook] : []),
        ...sso.before,
      ],
      after: [
        {
          // list-sessions returns every session of the user, tokens included.
          // Only this tenant's may leave this tenant's host.
          matcher: (ctx) => ctx.path === "/list-sessions",
          handler: createAuthMiddleware(async (ctx) => {
            const resolved = getTenantFromContext(ctx.context);
            const returned = ctx.context.returned;
            if (!resolved || !Array.isArray(returned)) return;
            return ctx.json(returned.filter((session) => getSessionTenantId({ session }) === resolved.tenant.id));
          }),
        },
        {
          matcher: (ctx) => ctx.path === "/organization/list",
          handler: createAuthMiddleware(async (ctx) => {
            const expected = getTenantFromContext(ctx.context)?.organizationId;
            const returned = ctx.context.returned;
            if (!expected || !Array.isArray(returned)) return;
            return ctx.json(returned.filter((org: { id?: string }) => org.id === expected));
          }),
        },
        ...(teamsScoped ? [teamListHook] : []),
        ...(getOrganizationId ? [invitationListHook] : []),
        ...sso.after,
      ],
    },

    endpoints: {
      getCurrentTenant: createAuthEndpoint(
        "/multi-tenant/current",
        { method: "GET" },
        async (ctx) => {
          const resolved = requireTenantFromContext(ctx.context);
          return ctx.json({
            id: resolved.tenant.id,
            slug: resolved.slug,
            origin: resolved.domain
              ? `${protocol ?? "https"}://${resolved.domain}${port ? `:${port}` : ""}`
              : tenantOrigin(resolved.slug, { ...resolverOptions, protocol, port }),
          });
        },
      ),
    },
  } satisfies BetterAuthPlugin;
};

export type MultiTenantPlugin = ReturnType<typeof multiTenant>;
