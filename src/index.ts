import { APIError, createAuthEndpoint, createAuthMiddleware, getSessionFromCtx } from "better-auth/api";
import type { BetterAuthPlugin } from "better-auth";
import {
  normalizeHost,
  resolveTenantSlug,
  tenantOrigin,
  type ResolverOptions,
  type TenantRejection,
} from "./resolver.js";

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
import { revokeScopeHook } from "./revoke.js";
import { ssoGuardHooks } from "./sso.js";
import { teamListHook, teamOrganizationId, teamScopeHook, teamTenantMismatch } from "./teams.js";

export { getTenantFromContext, requireTenantFromContext } from "./context.js";
export type { ResolvedTenant, Tenant } from "./context.js";
export { organizationMembersOnly } from "./access.js";
export type { CanAccessTenant, TenantAccessContext } from "./access.js";
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

/** Refuse unknown tenants (404, without saying why) and inactive ones (403). */
function assertActive(tenant: Tenant | null): Tenant {
  if (!tenant) {
    throw new APIError("NOT_FOUND", { code: "TENANT_NOT_FOUND", message: "Unknown tenant" });
  }
  if (tenant.status !== undefined && tenant.status !== "active") {
    throw new APIError("FORBIDDEN", { code: "TENANT_INACTIVE", message: "This tenant is not active" });
  }
  return tenant;
}

const REJECTION_STATUS: Record<TenantRejection, "BAD_REQUEST" | "NOT_FOUND"> = {
  "no-host": "BAD_REQUEST",
  "not-under-base-domain": "BAD_REQUEST",
  "apex-domain": "BAD_REQUEST",
  "nested-subdomain": "BAD_REQUEST",
  "reserved-subdomain": "NOT_FOUND",
  "malformed-slug": "BAD_REQUEST",
};

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

  const headerName = options.headerName ?? "x-tenant";

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

      const accessHooks = canAccessTenant ? { create: { before: tenantAccessHook(canAccessTenant) } } : {};
      if (!getOrganizationId) return canAccessTenant ? { options: { databaseHooks: { session: accessHooks } } } : undefined;
      const orgPlugin = ctx.options.plugins?.find((p) => p.id === "organization");
      const teamsEnabled = Boolean((orgPlugin?.options as { teams?: { enabled?: boolean } } | undefined)?.teams?.enabled);
      return {
        options: {
          databaseHooks: {
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
                  if (team) {
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
    },

    $ERROR_CODES: {
      TENANT_REQUIRED: {
        code: "TENANT_REQUIRED",
        message: "This request must be made on a tenant subdomain",
      },
      TENANT_NOT_FOUND: { code: "TENANT_NOT_FOUND", message: "Unknown tenant" },
      TENANT_INACTIVE: { code: "TENANT_INACTIVE", message: "This tenant is not active" },
      CROSS_TENANT_SESSION: {
        code: "CROSS_TENANT_SESSION",
        message: "This session belongs to a different tenant",
      },
      UNBOUND_SESSION: {
        code: "UNBOUND_SESSION",
        message: "This session is not bound to a tenant",
      },
      TENANT_ACCESS_DENIED: {
        code: "TENANT_ACCESS_DENIED",
        message: "This user cannot access this tenant",
      },
      ORGANIZATION_TENANT_MISMATCH: {
        code: "ORGANIZATION_TENANT_MISMATCH",
        message: "Only this tenant's organization can be active here",
      },
      TEAM_TENANT_MISMATCH: {
        code: "TEAM_TENANT_MISMATCH",
        message: "This team belongs to a different tenant's organization",
      },
      SSO_PROVIDER_TENANT_MISMATCH: {
        code: "SSO_PROVIDER_TENANT_MISMATCH",
        message: "This SSO provider does not belong to this tenant",
      },
    },

    hooks: {
      before: [
        {
          // Resolve on every request so downstream handlers can rely on it.
          matcher: () => true,
          handler: createAuthMiddleware(async (ctx) => {
            const path = ctx.path ?? "";
            const host = ctx.headers?.get("host");
            const headerValue = resolverOptions.allowHeaderOverride
              ? ctx.headers?.get(headerName)
              : null;

            const resolution = resolveTenantSlug(host, resolverOptions, headerValue);

            let resolved: ResolvedTenant;
            if (resolution.ok) {
              const tenant = assertActive(await getTenant(resolution.slug));
              resolved = { slug: resolution.slug, tenant, source: resolution.source };
            } else if (resolution.reason === "not-under-base-domain" && getTenantByDomain) {
              // A host outside the base domain can still be a tenant's own domain.
              const domain = normalizeHost(host);
              const found = await getTenantByDomain(domain);
              if (!found && !requireTenant(path)) return;
              const tenant = assertActive(found);
              resolved = { slug: tenant.slug, tenant, source: "custom-domain", domain };
            } else {
              if (!requireTenant(path)) return;
              throw new APIError(REJECTION_STATUS[resolution.reason], {
                code: "TENANT_REQUIRED",
                message: `No tenant for this request (${resolution.reason})`,
              });
            }

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
          matcher: (ctx) => ctx.path === "/organization/set-active",
          handler: createAuthMiddleware(async (ctx) => {
            const expected = getTenantFromContext(ctx.context)?.organizationId;
            if (!expected) return;

            const body = (ctx.body ?? {}) as { organizationId?: string | null; organizationSlug?: string };
            let target: string | null | undefined = body.organizationId;
            if (target === undefined && body.organizationSlug) {
              const org = await ctx.context.adapter.findOne<{ id: string }>({
                model: "organization",
                where: [{ field: "slug", value: body.organizationSlug }],
              });
              target = org?.id;
            }
            // No target at all keeps the current (tenant-stamped) organization.
            if (target === undefined && !body.organizationSlug) return;

            if (target !== expected) {
              throw new APIError("FORBIDDEN", {
                code: "ORGANIZATION_TENANT_MISMATCH",
                message: "Only this tenant's organization can be active here",
              });
            }
          }),
        },
        ...(revokeScope === "tenant" ? [revokeScopeHook(getSessionTenantId)] : []),
        ...(getOrganizationId ? [teamScopeHook, organizationScopeHook] : []),
        ...(getOrganizationId || getSSODomains ? ssoGuardHooks(getSSODomains) : []),
      ],
      after: getOrganizationId ? [teamListHook, invitationListHook] : [],
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
