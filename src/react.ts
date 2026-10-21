import { useEffect, useState } from "react";
import { getTenant, type CurrentTenant, type TenantClient, type TenantError } from "./client.js";

export { getTenant } from "./client.js";
export type { CurrentTenant, TenantClient, TenantError, TenantErrorCode, TenantResult } from "./client.js";

export interface UseTenantResult {
  tenant: CurrentTenant | null;
  error: TenantError | null;
  isPending: boolean;
}

const PENDING: UseTenantResult = { tenant: null, error: null, isPending: true };

/** @internal The hook body with React's hooks passed in, so tests can drive it without a renderer. */
export function useTenantWith(
  hooks: Pick<typeof import("react"), "useState" | "useEffect">,
  client: TenantClient,
): UseTenantResult {
  const [state, setState] = hooks.useState(PENDING);

  hooks.useEffect(() => {
    let current = true;
    // A new client starts over; keep the same object when already pending so
    // the first run does not render twice.
    setState((s) => (s.isPending ? s : PENDING));
    void getTenant(client).then(({ tenant, error }) => {
      if (current) setState({ tenant, error, isPending: false });
    });
    return () => {
      current = false;
    };
  }, [client]);

  return state;
}

/**
 * The tenant of the host `client` talks to, as `{ tenant, error, isPending }`.
 * `error.code` is typed to the plugin's error codes. Nothing is fetched while
 * rendering on the server, so server output is the pending state.
 *
 * @example
 * ```tsx
 * import { useTenant } from "better-auth-multi-tenant/react";
 *
 * function Brand() {
 *   const { tenant, error, isPending } = useTenant(authClient);
 *   if (isPending) return null;
 *   if (error?.code === "TENANT_NOT_FOUND") return <NotFound />;
 *   return <h1>{tenant?.slug}</h1>;
 * }
 * ```
 */
export function useTenant(client: TenantClient): UseTenantResult {
  return useTenantWith({ useState, useEffect }, client);
}
