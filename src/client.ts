import type { BetterAuthClientPlugin } from "better-auth/client";
import { ERROR_CODES, type TenantErrorCode } from "./error-codes.js";
import type { multiTenant } from "./index.js";
import type { TenantPolicy } from "./policy.js";

type MultiTenantServerPlugin = ReturnType<typeof multiTenant>;

export type { TenantErrorCode } from "./error-codes.js";

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

/** What `/multi-tenant/current` returns. */
export interface CurrentTenant {
  id: string;
  slug: string;
  origin: string;
  /** The tenant's auth policy, when the server sets `getTenantPolicy`. */
  policy?: TenantPolicy;
}

export interface TenantError {
  /** HTTP status, or `0` when no usable response arrived (network failure, unexpected body). */
  status: number;
  statusText: string;
  message?: string;
  /** One of the plugin's error codes; absent for an error that is not the plugin's. */
  code?: TenantErrorCode;
}

export type TenantResult =
  | { tenant: CurrentTenant; error: null }
  | { tenant: null; error: TenantError };

/** The part of an `authClient` created with {@link multiTenantClient} that {@link getTenant} uses. */
export interface TenantClient {
  multiTenant: {
    current: () => Promise<{
      data: CurrentTenant | null;
      error: { status: number; statusText: string; message?: string; code?: string } | null;
    }>;
  };
}

const isErrorCode = (code: unknown): code is TenantErrorCode =>
  typeof code === "string" && Object.hasOwn(ERROR_CODES, code);

const isCurrentTenant = (data: unknown): data is CurrentTenant => {
  const d = data as Partial<CurrentTenant> | null;
  return !!d && typeof d.id === "string" && typeof d.slug === "string" && typeof d.origin === "string";
};

/**
 * The tenant of the host the client talks to. Never throws: a failure comes
 * back as `{ tenant: null, error }`, with `error.code` typed when the plugin
 * sent one. Framework-free, so Vue, Svelte and plain scripts can use it; React
 * has {@link useTenant} in `better-auth-multi-tenant/react`.
 *
 * @example
 * ```ts
 * const { tenant, error } = await getTenant(authClient);
 * if (error?.code === "TENANT_NOT_FOUND") showUnknownWorkspacePage();
 * ```
 */
export async function getTenant(client: TenantClient): Promise<TenantResult> {
  try {
    const { data, error } = await client.multiTenant.current();
    if (!error && isCurrentTenant(data)) return { tenant: data, error: null };
    return {
      tenant: null,
      error: {
        status: error?.status ?? 0,
        statusText: error?.statusText ?? "Unexpected response",
        message: error?.message,
        code: isErrorCode(error?.code) ? error.code : undefined,
      },
    };
  } catch (cause) {
    return {
      tenant: null,
      error: { status: 0, statusText: "Network Error", message: cause instanceof Error ? cause.message : undefined },
    };
  }
}
