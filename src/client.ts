import type { BetterAuthClientPlugin } from "better-auth/client";
import type { multiTenant } from "./index.js";

type MultiTenantServerPlugin = ReturnType<typeof multiTenant>;

/**
 * Client counterpart to {@link multiTenant}.
 *
 * Adds `authClient.multiTenant.current()` and the server plugin's error codes
 * to the client's inferred types. It sends no tenant identifier of its own —
 * the tenant is derived from the host the request is already going to.
 *
 * @example
 * ```ts
 * import { createAuthClient } from "better-auth/client";
 * import { multiTenantClient } from "better-auth-multi-tenant/client";
 *
 * export const authClient = createAuthClient({
 *   plugins: [multiTenantClient()],
 * });
 * ```
 */
export const multiTenantClient = () => {
  return {
    id: "multi-tenant",
    $InferServerPlugin: {} as MultiTenantServerPlugin,
  } satisfies BetterAuthClientPlugin;
};

export type MultiTenantClientPlugin = ReturnType<typeof multiTenantClient>;
