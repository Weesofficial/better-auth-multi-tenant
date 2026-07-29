import { APIError } from "better-auth/api";
import { getTenantFromContext } from "./context.js";

export interface TenantSessionHookOptions {
  /**
   * What to do when a session is created on a request that carried no tenant.
   *
   * `"reject"` (the default) refuses to mint an unbound session: an untagged
   * session is one the cross-tenant guard cannot check, so allowing it silently
   * creates a credential that works on every tenant.
   *
   * `"allow"` mints the session without a tenant. Use it only if you knowingly
   * serve sign-in from the apex domain.
   */
  onMissingTenant?: "reject" | "allow";
}

/**
 * `databaseHooks` fragment that stamps each new session with the tenant the
 * request resolved to.
 *
 * The plugin adds the `session.tenantId` column and enforces it, but it does
 * not take ownership of session creation — spread this into your own
 * `databaseHooks` so your hooks and this one compose instead of overwriting
 * each other.
 *
 * @example
 * ```ts
 * import { betterAuth } from "better-auth";
 * import { multiTenant, tenantSessionHooks } from "better-auth-multi-tenant";
 *
 * export const auth = betterAuth({
 *   plugins: [multiTenant({ baseDomain: "example.com", getTenant })],
 *   databaseHooks: tenantSessionHooks(),
 * });
 * ```
 */
export function tenantSessionHooks(options: TenantSessionHookOptions = {}) {
  const { onMissingTenant = "reject" } = options;

  return {
    session: {
      create: {
        before: async (
          session: Record<string, unknown>,
          context: { context?: unknown } | null,
        ): Promise<{ data: Record<string, unknown> } | undefined> => {
          const resolved = getTenantFromContext(context?.context);

          if (!resolved) {
            if (onMissingTenant === "allow") return;
            throw new APIError("BAD_REQUEST", {
              code: "TENANT_REQUIRED",
              message: "Refusing to create a session that is not bound to a tenant",
            });
          }

          return { data: { ...session, tenantId: resolved.tenant.id } };
        },
      },
    },
  };
}
