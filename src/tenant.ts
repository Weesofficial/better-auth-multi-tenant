import { APIError } from "better-auth/api";
import type { ResolvedTenant, Tenant } from "./context.js";
import { ERROR_CODES } from "./error-codes.js";
import { requestHost } from "./proxy.js";
import { normalizeHost, resolveTenantSlug, type ResolverOptions, type TenantRejection } from "./resolver.js";

/** What resolving a request to a tenant needs. Shared by the plugin and `createTenantAuth`. */
export interface TenantLookup extends ResolverOptions {
  getTenant: (slug: string) => Promise<Tenant | null> | Tenant | null;
  getTenantByDomain?: (domain: string) => Promise<Tenant | null> | Tenant | null;
}

/** Refuse unknown tenants (404, without saying why) and inactive ones (403). */
export function assertActive(tenant: Tenant | null): Tenant {
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
 * Resolve a request to its tenant, or throw the 400/403/404 `APIError` the
 * plugin answers with. With `optional`, a host that names no tenant returns
 * `null` instead; one that names an unknown or inactive tenant still throws.
 */
export async function resolveTenant(
  lookup: TenantLookup,
  headers: Headers | undefined,
  optional: boolean,
  request?: Request,
): Promise<ResolvedTenant | null> {
  let host: string | null | undefined;
  if (headers) {
    const result = requestHost({ headers, request }, lookup.trustProxy);
    // Refused even where a tenant is optional: a malformed forwarded host means
    // the proxy setup is wrong or someone is probing, not "no tenant".
    if (!result.ok) throw new APIError("BAD_REQUEST", ERROR_CODES.INVALID_FORWARDED_HOST);
    host = result.host;
  }
  const headerValue = lookup.allowHeaderOverride ? headers?.get(lookup.headerName ?? "x-tenant") : null;

  const resolution = resolveTenantSlug(host, lookup, headerValue);

  if (resolution.ok) {
    const tenant = assertActive(await lookup.getTenant(resolution.slug));
    return { slug: resolution.slug, tenant, source: resolution.source };
  }
  if (resolution.reason === "not-under-base-domain" && lookup.getTenantByDomain) {
    // A host outside the base domain can still be a tenant's own domain.
    const domain = normalizeHost(host);
    const found = await lookup.getTenantByDomain(domain);
    if (!found && optional) return null;
    const tenant = assertActive(found);
    return { slug: tenant.slug, tenant, source: "custom-domain", domain };
  }
  if (optional) return null;
  throw new APIError(REJECTION_STATUS[resolution.reason], {
    code: "TENANT_REQUIRED",
    message: `No tenant for this request (${resolution.reason})`,
  });
}
