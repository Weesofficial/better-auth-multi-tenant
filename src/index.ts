import { createAuthEndpoint, createAuthMiddleware } from "better-auth/api";
import type { BetterAuthPlugin } from "better-auth";
import { tenantOrigin } from "./resolver.js";
import { ERROR_CODES } from "./error-codes.js";
import { assertTrustProxy } from "./proxy.js";
import { assertPathPrefix } from "./path.js";
import { resolutionMode } from "./tenant.js";
import type { MultiTenantOptions } from "./options.js";

export type { MultiTenantOptions } from "./options.js";

export type { TenantErrorCode } from "./error-codes.js";
export { requestHost } from "./proxy.js";
export type { ProxyRequest, RequestHost, TrustProxy } from "./proxy.js";

export {
  resolveTenantSlug,
  checkSlug,
  normalizeHost,
  tenantOrigin,
  DEFAULT_RESERVED,
  DEFAULT_SLUG_PATTERN,
} from "./resolver.js";
export type { ResolverOptions, TenantResolution, TenantRejection } from "./resolver.js";

import { requireTenantFromContext } from "./context.js";
import { tenantAccessHook } from "./access.js";
import { adminScopeHook } from "./admin.js";
import { apiKeyHooks, apiKeySchema, bindApiKeySessions } from "./api-key.js";
import { deviceCodeHook, deviceCodeSchema } from "./device-authorization.js";
import { addJwtTenantClaim } from "./jwt.js";
import {
  activeOrganizationGuard,
  invitationListHook,
  organizationCreateHook,
  organizationListHook,
  organizationScopeHook,
} from "./organization.js";
import { foreignSessionHook } from "./foreign-session.js";
import { multiSessionHooks } from "./multi-session.js";
import { requestResolver, tenantTrustedOrigins } from "./request.js";
import { revokeScopeHook } from "./revoke.js";
import { sameOriginHook } from "./same-origin.js";
import { policyBeforeHook, policyFor, policySessionHook, policyUserCreateHook, publicPolicy } from "./policy.js";
import { resolveScoping } from "./scoping.js";
import { defaultEnforceSessionTenant, listSessionsHook, revokeSessionHook, sessionTenantHook } from "./session-binding.js";
import { ssoGuardHooks, ssoRefuseHook } from "./sso.js";
import { checkSetup } from "./startup-checks.js";
import { teamListHook, teamScopeHook } from "./teams.js";
import { trustDeviceHook, verificationBindingHooks, verificationSchema } from "./verification.js";

export { getTenantFromContext, requireTenantFromContext } from "./context.js";
export type { ResolvedTenant, Tenant } from "./context.js";
export { organizationMembersOnly } from "./access.js";
export { organizationAdminsOnly } from "./admin.js";
export type { CanAdministerTenant, TenantAdminContext } from "./admin.js";
export type { CanAccessTenant, TenantAccessContext } from "./access.js";
export type { GetTenantPolicy, TenantAuthMethod, TenantPolicy } from "./policy.js";
export { createTenantAuth } from "./tenant-auth.js";
export type { TenantAuth, TenantAuthOptions } from "./tenant-auth.js";
export { tenantSessionHooks } from "./session-hooks.js";
export { cacheTenantLookup } from "./cache.js";
export { withTenantPaths, tenantPathRequest } from "./path.js";
export type { TenantResolutionOptions, TenantSlugRequest } from "./tenant.js";
export type { CachedTenantLookup, TenantCacheOptions } from "./cache.js";
export type { TenantSessionHookOptions } from "./session-hooks.js";

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
    admin: adminOption,
    canAdministerTenant,
    adminSharedUsers = "refuse",
    adminRoleAssignment = "refuse",
    jwtTenantClaim = "tenantId",
    sameOriginOnly = true,
    apiKeys,
    deviceCodes,
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
    tenantCookies: tenantCookiesOption,
    trustTenantOrigins = true,
    tenantBaseURL = false,
    getTenantPolicy,
    oauthProxyHost,
    ...resolverOptions
  } = options;
  assertTrustProxy(resolverOptions.trustProxy);
  const mode = resolutionMode(options);
  if (mode === "path") assertPathPrefix(resolverOptions.pathPrefix!);
  const tenantCookies = tenantCookiesOption ?? mode === "path";

  const { hasSSOMapping, teamsScoped, adminScoped, ssoScoped } = resolveScoping(options);
  const sso = ssoScoped
    ? ssoGuardHooks(getSSODomains)
    : { before: ssoRequireTenantMapping ? [ssoRefuseHook] : [], after: [] };

  const lookup = { ...resolverOptions, getTenant, getTenantByDomain };
  const resolveRequest = requestResolver({
    lookup,
    requireTenant,
    getOrganizationId,
    tenantCookies,
    tenantBaseURL,
    protocol,
    oauthProxyHost,
    onTenantResolved,
  });
  const trusted = trustTenantOrigins ? { trustedOrigins: tenantTrustedOrigins(lookup, protocol) } : {};

  return {
    id: "multi-tenant",
    // Read by `withTenantPaths`.
    options: { pathPrefix: resolverOptions.pathPrefix },

    init(ctx) {
      checkSetup(ctx, {
        allowHeaderOverride: resolverOptions.allowHeaderOverride,
        headerName: resolverOptions.headerName,
        admin: adminOption,
        apiKeys,
        deviceCodes,
        sso: ssoOption,
        oauthProxyHost,
        bindVerifications,
        adminScoped,
        hasSSOMapping,
        ssoRequireTenantMapping,
      });

      const jwtPlugin = ctx.options.plugins?.find((p) => p.id === "jwt");
      if (jwtPlugin && jwtTenantClaim !== false && !addJwtTenantClaim(jwtPlugin, jwtTenantClaim, getSessionTenantId)) {
        ctx.logger.warn(
          "[better-auth-multi-tenant] the jwt plugin was created without options, so its tokens cannot carry the tenant: a token minted on one tenant verifies for every other. " +
            "Create it as jwt({}) so the tenant claim is added, or set jwtTenantClaim: false to silence this.",
        );
      }

      const apiKeyPlugin = ctx.options.plugins?.find((p) => p.id === "api-key");
      if (apiKeys && apiKeyPlugin) bindApiKeySessions(apiKeyPlugin, unboundSessions, resolveRequest);

      const accessHooks = canAccessTenant ? { create: { before: tenantAccessHook(canAccessTenant) } } : {};
      const verificationHooks = bindVerifications ? verificationBindingHooks() : {};
      const userHooks = getTenantPolicy ? { user: { create: { before: policyUserCreateHook(getTenantPolicy) } } } : {};
      if (!getOrganizationId) {
        return {
          options: {
            ...trusted,
            ...(canAccessTenant || bindVerifications || getTenantPolicy
              ? {
                  databaseHooks: {
                    ...verificationHooks,
                    ...userHooks,
                    ...(canAccessTenant ? { session: accessHooks } : {}),
                  },
                }
              : {}),
          },
        };
      }
      const orgPlugin = ctx.options.plugins?.find((p) => p.id === "organization");
      const teamsEnabled =
        teamsScoped && Boolean((orgPlugin?.options as { teams?: { enabled?: boolean } } | undefined)?.teams?.enabled);
      return {
        options: {
          ...trusted,
          databaseHooks: {
            ...verificationHooks,
            ...userHooks,
            session: {
              ...accessHooks,
              update: { before: activeOrganizationGuard(teamsScoped, teamsEnabled) },
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
      ...(apiKeys ? apiKeySchema : {}),
      ...(deviceCodes ? deviceCodeSchema : {}),
    },

    $ERROR_CODES: ERROR_CODES,

    hooks: {
      before: [
        {
          // Resolve on every request so downstream handlers can rely on it.
          matcher: () => true,
          handler: createAuthMiddleware(async (ctx) => resolveRequest(ctx)),
        },
        sessionTenantHook(getSessionTenantId, enforceSessionTenant, unboundSessions),
        ...(sameOriginOnly ? [sameOriginHook(resolverOptions.trustProxy)] : []),
        ...(getTenantPolicy ? [policyBeforeHook(getTenantPolicy)] : []),
        organizationCreateHook,
        revokeSessionHook(getSessionTenantId),
        foreignSessionHook(getSessionTenantId, enforceSessionTenant),
        ...(bindVerifications ? [trustDeviceHook] : []),
        ...(revokeScope === "tenant" ? [revokeScopeHook(getSessionTenantId)] : []),
        ...(getOrganizationId ? [organizationScopeHook] : []),
        ...(teamsScoped ? [teamScopeHook] : []),
        ...(adminScoped ? [adminScopeHook(getSessionTenantId, canAdministerTenant, adminSharedUsers, adminRoleAssignment)] : []),
        ...multiSessionHooks(getSessionTenantId, unboundSessions).before,
        ...(apiKeys ? apiKeyHooks(Boolean(getOrganizationId)).before : []),
        ...(deviceCodes ? [deviceCodeHook] : []),
        ...sso.before,
      ],
      after: [
        listSessionsHook(getSessionTenantId),
        ...(getTenantPolicy ? [policySessionHook(getTenantPolicy)] : []),
        organizationListHook,
        ...(teamsScoped ? [teamListHook] : []),
        ...(getOrganizationId ? [invitationListHook] : []),
        ...multiSessionHooks(getSessionTenantId, unboundSessions).after,
        ...(apiKeys ? apiKeyHooks(Boolean(getOrganizationId)).after : []),
        ...sso.after,
      ],
    },

    endpoints: {
      getCurrentTenant: createAuthEndpoint(
        "/multi-tenant/current",
        { method: "GET" },
        async (ctx) => {
          const resolved = requireTenantFromContext(ctx.context);
          const { baseDomain } = resolverOptions;
          return ctx.json({
            id: resolved.tenant.id,
            slug: resolved.slug,
            origin: resolved.domain
              ? `${protocol ?? "https"}://${resolved.domain}${port ? `:${port}` : ""}`
              : baseDomain && resolved.source !== "path"
                ? tenantOrigin(resolved.slug, { baseDomain, protocol, port })
                : new URL(ctx.context.baseURL).origin,
            ...(getTenantPolicy ? { policy: publicPolicy((await policyFor(ctx.context, getTenantPolicy)) ?? {}) } : {}),
          });
        },
      ),
    },
  } satisfies BetterAuthPlugin;
};

export type MultiTenantPlugin = ReturnType<typeof multiTenant>;
