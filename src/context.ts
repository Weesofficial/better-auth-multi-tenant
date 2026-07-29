/** Shared request-context plumbing, kept separate so it has no cyclic imports. */

/** What the plugin attaches to the auth context for the current request. */
export interface ResolvedTenant {
  slug: string;
  tenant: Tenant;
  source: "host" | "header";
}

/** The minimum a tenant record must expose for this plugin to gate on it. */
export interface Tenant {
  id: string;
  slug: string;
  /** Anything other than `"active"` is refused with 403. */
  status?: string;
  [key: string]: unknown;
}

export const CONTEXT_KEY = "multiTenant" as const;

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

/** Attach the resolved tenant to the auth context. */
export function setTenantOnContext(context: unknown, resolved: ResolvedTenant): void {
  (context as Record<string, unknown>)[CONTEXT_KEY] = resolved;
}
