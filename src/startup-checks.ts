import type { BetterAuthPlugin } from "better-auth";
import type { MultiTenantOptions } from "./options.js";

type InitContext = Parameters<NonNullable<BetterAuthPlugin["init"]>>[0];

/**
 * Warn about, or refuse at startup, a configuration that leaves part of Better
 * Auth shared between tenants. Runs from the plugin's `init`.
 */
export function checkSetup(
  ctx: InitContext,
  options: Pick<
    MultiTenantOptions,
    "allowHeaderOverride" | "headerName" | "admin" | "apiKeys" | "deviceCodes" | "sso" | "oauthProxyHost"
  > & {
    bindVerifications: boolean;
    adminScoped: boolean;
    hasSSOMapping: boolean;
    ssoRequireTenantMapping: boolean;
  },
): void {
  const installed = (id: string) => ctx.options.plugins?.some((p) => p.id === id) ?? false;

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

  if (options.allowHeaderOverride && (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env?.NODE_ENV === "production") {
    ctx.logger.warn(
      "[better-auth-multi-tenant] allowHeaderOverride is on in production, so any client can pick its tenant by sending the " +
        `${options.headerName ?? "x-tenant"} header. Use it for local development only.`,
    );
  }

  if (options.bindVerifications && ctx.options.secondaryStorage && !ctx.options.verification?.storeInDatabase) {
    ctx.logger.warn(
      "[better-auth-multi-tenant] verification rows live only in secondaryStorage, where Better Auth runs no database hooks, " +
        "so codes and tokens are not bound to the tenant that issued them. Set verification.storeInDatabase: true to enforce bindVerifications.",
    );
  }

  if (options.admin !== false && !options.adminScoped && installed("admin")) {
    ctx.logger.warn(
      "[better-auth-multi-tenant] the admin plugin is installed but getOrganizationId is not set, " +
        "so admin routes on a tenant's host list and act on every tenant's users. Set getOrganizationId to scope them, or admin: false to silence this.",
    );
  }

  const oauthProxy = ctx.options.plugins?.find((p) => p.id === "oauth-proxy");
  const proxyURL = (oauthProxy?.options as { productionURL?: string } | undefined)?.productionURL;
  if (proxyURL && !options.oauthProxyHost) {
    ctx.logger.warn(
      `[better-auth-multi-tenant] oAuthProxy sends OAuth callbacks to ${proxyURL}, which names no tenant, so they are refused. ` +
        `Set oauthProxyHost: "${new URL(proxyURL).host}".`,
    );
  } else if (proxyURL && options.oauthProxyHost && new URL(proxyURL).host !== options.oauthProxyHost.toLowerCase()) {
    ctx.logger.warn(
      `[better-auth-multi-tenant] oauthProxyHost (${options.oauthProxyHost}) is not the host of oAuthProxy's productionURL (${proxyURL}).`,
    );
  }

  for (const [id, name] of [
    ["oauth-provider", "@better-auth/oauth-provider"],
    ["oidc-provider", "the oidcProvider plugin"],
    ["mcp", "the mcp plugin"],
    ["scim", "@better-auth/scim"],
  ] as const) {
    if (installed(id)) {
      ctx.logger.warn(
        `[better-auth-multi-tenant] ${name} is installed but not tenant-scoped: its clients, connections and access tokens are shared by every tenant, ` +
          "and its access tokens are not checked against the request's tenant. See docs/security.md.",
      );
    }
  }

  if (options.apiKeys && !installed("api-key")) {
    throw new Error("[better-auth-multi-tenant] apiKeys: true needs the @better-auth/api-key plugin.");
  } else if (options.apiKeys === undefined && installed("api-key")) {
    ctx.logger.warn(
      "[better-auth-multi-tenant] @better-auth/api-key is installed but apiKeys is not set, so a key made on one tenant works on every other. " +
        "Set apiKeys: true (and migrate the apikey.tenantId column) to bind keys to tenants, or apiKeys: false to silence this.",
    );
  }

  if (options.deviceCodes && !installed("device-authorization")) {
    throw new Error("[better-auth-multi-tenant] deviceCodes: true needs the deviceAuthorization plugin.");
  } else if (options.deviceCodes === undefined && installed("device-authorization")) {
    ctx.logger.warn(
      "[better-auth-multi-tenant] deviceAuthorization is installed but deviceCodes is not set, so a code approved on one tenant can be redeemed on every other. " +
        "Set deviceCodes: true (and migrate the deviceCode.tenantId column) to bind codes to tenants, or deviceCodes: false to silence this.",
    );
  }

  if (options.sso !== false && !options.hasSSOMapping && installed("sso")) {
    ctx.logger.warn(
      options.ssoRequireTenantMapping
        ? "[better-auth-multi-tenant] @better-auth/sso is installed and ssoRequireTenantMapping is on, but neither getOrganizationId nor getSSODomains is set, " +
            "so every SSO route is refused on a tenant's host. Set one of them to map providers to tenants."
        : "[better-auth-multi-tenant] @better-auth/sso is installed but neither getOrganizationId nor getSSODomains is set, " +
            "so any tenant's host can use any SSO provider. Set one of them, or set ssoRequireTenantMapping: true to refuse SSO until you do.",
    );
  }
}
