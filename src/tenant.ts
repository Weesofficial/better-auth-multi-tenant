import { APIError } from "better-auth/api";
import type { ResolvedTenant, Tenant } from "./context.js";
import { ERROR_CODES } from "./error-codes.js";
import { getPathTenant } from "./path.js";
import { requestHost } from "./proxy.js";
import {
  checkSlug,
  normalizeHost,
  resolveTenantSlug,
  type ResolverOptions,
  type TenantRejection,
  type TenantResolution,
} from "./resolver.js";

/** What a custom {@link TenantLookup.getTenantSlug} gets to look at. `request` is absent for most `auth.api` calls. */
export interface TenantSlugRequest {
  headers: Headers;
  request?: Request;
  /** The Better Auth route, such as `/get-session`. */
  path: string;
}

/** How a request names its tenant. Shared by the plugin and `createTenantAuth`. */
export interface TenantResolutionOptions extends Omit<ResolverOptions, "baseDomain"> {
  /**
   * Subdomain tenancy: the apex domain tenants live under, e.g. `"example.com"`
   * for `acme.example.com`. Do not include a leading dot.
   */
  baseDomain?: string;
  /**
   * Path-based tenancy: tenants are addressed as `<basePath><pathPrefix>/<slug>/…`,
   * for example `/api/auth/t/acme/sign-in/email` with `"/t"`. Mount the
   * instance through `withTenantPaths`. Cannot be combined with `baseDomain`.
   */
  pathPrefix?: string;
  /**
   * Resolve the tenant slug yourself, from anything on the request. Return
   * `null` when the request names no tenant. The slug still has to pass
   * `reserved` and `slugPattern`. Replaces host and path resolution; `baseDomain`
   * may still be set, for the origin `/multi-tenant/current` reports.
   *
   * Whatever you read here decides the tenant, so read only what the client
   * cannot choose freely, or require `canAccessTenant`.
   */
  getTenantSlug?: (request: TenantSlugRequest) => Promise<string | null | undefined> | string | null | undefined;
}

export interface TenantLookup extends TenantResolutionOptions {
  getTenant: (slug: string) => Promise<Tenant | null> | Tenant | null;
  getTenantByDomain?: (domain: string) => Promise<Tenant | null> | Tenant | null;
}

/** Which of the three resolution modes the options select. */
export type ResolutionMode = "host" | "path" | "custom";

/**
 * Throw at startup on options that pick no resolution mode, or pick
 * contradicting ones, so a tenant is never resolved some way you did not mean.
 */
export function resolutionMode(options: TenantLookup): ResolutionMode {
  const { baseDomain, pathPrefix, getTenantSlug } = options;
  const fail = (message: string): never => {
    throw new Error(`[better-auth-multi-tenant] ${message}`);
  };
  if (pathPrefix !== undefined && getTenantSlug) fail("pathPrefix and getTenantSlug both pick the tenant; set one of them.");
  if (pathPrefix !== undefined && baseDomain) fail("pathPrefix and baseDomain both pick the tenant; set one of them.");
  const mode: ResolutionMode = getTenantSlug ? "custom" : pathPrefix !== undefined ? "path" : "host";
  if (mode === "host" && !baseDomain) fail("set baseDomain (subdomains), pathPrefix (paths) or getTenantSlug (your own resolver).");
  if (mode !== "host") {
    const hostOnly = (["getTenantByDomain", "allowHeaderOverride", "allowNestedSubdomains", "trustProxy"] as const).filter(
      (key) => options[key] !== undefined && options[key] !== false,
    );
    if (hostOnly.length) fail(`${hostOnly.join(", ")} only apply to subdomain tenancy (baseDomain), not to ${mode === "path" ? "pathPrefix" : "getTenantSlug"}.`);
  }
  return mode;
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
  "no-tenant": "BAD_REQUEST",
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
  path = "",
): Promise<ResolvedTenant | null> {
  if (lookup.getTenantSlug || lookup.pathPrefix !== undefined) {
    const slug = lookup.getTenantSlug
      ? await lookup.getTenantSlug({ headers: headers ?? new Headers(), request, path })
      : getPathTenant(request);
    const resolution: TenantResolution = slug
      ? checkSlug(slug, lookup.getTenantSlug ? "custom" : "path", lookup)
      : { ok: false, reason: "no-tenant" };
    if (resolution.ok) {
      const tenant = assertActive(await lookup.getTenant(resolution.slug));
      return { slug: resolution.slug, tenant, source: resolution.source };
    }
    if (optional && resolution.reason === "no-tenant") return null;
    throw rejection(resolution.reason);
  }

  let host: string | null | undefined;
  if (headers) {
    const result = requestHost({ headers, request }, lookup.trustProxy);
    // Refused even where a tenant is optional: a malformed forwarded host means
    // the proxy setup is wrong or someone is probing, not "no tenant".
    if (!result.ok) throw new APIError("BAD_REQUEST", ERROR_CODES.INVALID_FORWARDED_HOST);
    host = result.host;
  }
  const headerValue = lookup.allowHeaderOverride ? headers?.get(lookup.headerName ?? "x-tenant") : null;

  const resolution = resolveTenantSlug(host, { ...lookup, baseDomain: lookup.baseDomain ?? "" }, headerValue);

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
  throw rejection(resolution.reason);
}

function rejection(reason: TenantRejection) {
  return new APIError(REJECTION_STATUS[reason], {
    code: "TENANT_REQUIRED",
    message: `No tenant for this request (${reason})`,
  });
}
