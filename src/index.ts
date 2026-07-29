import { APIError, createAuthEndpoint, createAuthMiddleware, getSessionFromCtx } from "better-auth/api";
import type { BetterAuthPlugin } from "better-auth";
import {
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

/** The minimum a tenant record must expose for this plugin to gate on it. */
export interface Tenant {
  id: string;
  slug: string;
  /** Anything other than `"active"` is refused with 403. */
  status?: string;
  [key: string]: unknown;
}

/** What the plugin attaches to the auth context for the current request. */
export interface ResolvedTenant {
  slug: string;
  tenant: Tenant;
  source: "host" | "header";
}

const CONTEXT_KEY = "multiTenant" as const;

export interface MultiTenantOptions extends ResolverOptions {
  /**
   * Look up a tenant by slug. Return `null` for unknown slugs — the plugin
   * turns that into a 404 rather than leaking whether the slug exists.
   */
  getTenant: (slug: string) => Promise<Tenant | null> | Tenant | null;
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
  /** Called after a tenant resolves. Useful for logging and metrics. */
  onTenantResolved?: (resolved: ResolvedTenant, path: string) => void | Promise<void>;
}

/** Paths that legitimately run without a tenant-bound session. */
const UNBOUND_PATHS = [
  "/sign-in",
  "/sign-up",
  "/callback",
  "/oauth2/callback",
  "/verify-email",
  "/reset-password",
  "/request-password-reset",
  "/error",
  "/ok",
];

const defaultEnforceSessionTenant = (path: string) =>
  !UNBOUND_PATHS.some((p) => path.startsWith(p));

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
    requireTenant = () => true,
    getSessionTenantId = (session) =>
      (session as { session?: { tenantId?: string } } | null)?.session?.tenantId,
    enforceSessionTenant = defaultEnforceSessionTenant,
    onTenantResolved,
    ...resolverOptions
  } = options;

  const headerName = options.headerName ?? "x-tenant";

  return {
    id: "multi-tenant",

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

            if (!resolution.ok) {
              if (!requireTenant(path)) return;
              throw new APIError(REJECTION_STATUS[resolution.reason], {
                code: "TENANT_REQUIRED",
                message: `No tenant for this request (${resolution.reason})`,
              });
            }

            const tenant = await getTenant(resolution.slug);
            if (!tenant) {
              throw new APIError("NOT_FOUND", {
                code: "TENANT_NOT_FOUND",
                message: "Unknown tenant",
              });
            }
            if (tenant.status !== undefined && tenant.status !== "active") {
              throw new APIError("FORBIDDEN", {
                code: "TENANT_INACTIVE",
                message: "This tenant is not active",
              });
            }

            const resolved: ResolvedTenant = {
              slug: resolution.slug,
              tenant,
              source: resolution.source,
            };
            (ctx.context as Record<string, unknown>)[CONTEXT_KEY] = resolved;
            await onTenantResolved?.(resolved, path);
          }),
        },
        {
          // The core isolation property: a session issued for tenant A must not
          // be usable on tenant B's host, no matter what the caller sends.
          matcher: (ctx) => enforceSessionTenant(ctx.path ?? ""),
          handler: createAuthMiddleware(async (ctx) => {
            const resolved = (ctx.context as Record<string, unknown>)[CONTEXT_KEY] as
              | ResolvedTenant
              | undefined;
            if (!resolved) return;

            const session = await getSessionFromCtx(ctx);
            if (!session) return; // Unauthenticated: let the normal 401 path handle it.

            const sessionTenantId = getSessionTenantId(session);
            // A session with no tenant predates the plugin (or was minted on the
            // apex). Treat it as unbound rather than as belonging to everyone.
            if (!sessionTenantId) return;

            if (sessionTenantId !== resolved.tenant.id) {
              throw new APIError("FORBIDDEN", {
                code: "CROSS_TENANT_SESSION",
                message: "This session belongs to a different tenant",
              });
            }
          }),
        },
      ],
    },

    endpoints: {
      getCurrentTenant: createAuthEndpoint(
        "/multi-tenant/current",
        { method: "GET" },
        async (ctx) => {
          const resolved = (ctx.context as Record<string, unknown>)[CONTEXT_KEY] as
            | ResolvedTenant
            | undefined;
          if (!resolved) {
            throw new APIError("BAD_REQUEST", {
              code: "TENANT_REQUIRED",
              message: "No tenant for this request",
            });
          }
          return ctx.json({
            id: resolved.tenant.id,
            slug: resolved.slug,
            origin: tenantOrigin(resolved.slug, resolverOptions),
          });
        },
      ),
    },
  } satisfies BetterAuthPlugin;
};

/**
 * Read the tenant resolved for the current request.
 *
 * Returns `null` when the request carried no tenant — callers that require one
 * should say so via `requireTenant` rather than assuming this is non-null.
 */
export function getTenantFromContext(context: unknown): ResolvedTenant | null {
  const value = (context as Record<string, unknown> | null)?.[CONTEXT_KEY];
  return (value as ResolvedTenant | undefined) ?? null;
}

export type MultiTenantPlugin = ReturnType<typeof multiTenant>;
