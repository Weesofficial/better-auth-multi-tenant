/**
 * Host -> tenant slug resolution.
 *
 * This module is deliberately free of any Better Auth imports: tenant resolution
 * is the security-critical part of multi-tenancy, so it stays a pure function
 * that can be exhaustively unit tested on its own.
 */

/** Subdomains that must never resolve to a tenant. */
export const DEFAULT_RESERVED = [
  "www",
  "api",
  "app",
  "admin",
  "auth",
  "login",
  "static",
  "assets",
  "cdn",
  "mail",
  "docs",
  "status",
] as const;

/**
 * A DNS label: 1-63 chars, alphanumeric, inner hyphens allowed.
 * Deliberately stricter than DNS (no uppercase, no underscore) so that a slug
 * maps 1:1 to a lowercase database key.
 */
export const DEFAULT_SLUG_PATTERN = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/;

export interface ResolverOptions {
  /**
   * The apex domain tenants live under, e.g. `"example.com"` for
   * `acme.example.com`. Do not include a leading dot.
   */
  baseDomain: string;
  /**
   * Subdomains that are never tenants. Defaults to {@link DEFAULT_RESERVED}.
   * Passing your own list replaces the default rather than extending it.
   */
  reserved?: readonly string[];
  /** Slug shape. Defaults to {@link DEFAULT_SLUG_PATTERN}. */
  slugPattern?: RegExp;
  /**
   * Allow `acme.eu.example.com` to resolve to `acme`. Off by default: nested
   * labels are usually a sign of a misrouted request, not a tenant.
   */
  allowNestedSubdomains?: boolean;
  /**
   * Trust a client-supplied header (default `x-tenant`) to name the tenant.
   *
   * **This is off by default and should stay off in production.** A request
   * header is fully client-controlled, so trusting it means any authenticated
   * user can address any tenant by editing one header. Enable it only for local
   * development, where you have no wildcard DNS.
   */
  allowHeaderOverride?: boolean;
  /** Header consulted when {@link allowHeaderOverride} is on. */
  headerName?: string;
}

export type TenantResolution =
  | { ok: true; slug: string; source: "host" | "header" }
  | { ok: false; reason: TenantRejection };

export type TenantRejection =
  | "no-host"
  | "not-under-base-domain"
  | "apex-domain"
  | "nested-subdomain"
  | "reserved-subdomain"
  | "malformed-slug";

/** Strip the port and any trailing dot, and lowercase. `""` if unusable. */
export function normalizeHost(host: string | null | undefined): string {
  if (!host) return "";
  let h = host.trim().toLowerCase();
  // IPv6 literals arrive as `[::1]:3000`; they can never carry a tenant.
  if (h.startsWith("[")) return "";
  const colon = h.lastIndexOf(":");
  if (colon !== -1) h = h.slice(0, colon);
  if (h.endsWith(".")) h = h.slice(0, -1);
  return h;
}

/**
 * Resolve a tenant slug from a request host.
 *
 * Returns a discriminated result rather than throwing or returning `null`, so
 * callers can distinguish "this host has no tenant" (the apex domain, a health
 * check) from "this host tried to name a tenant and got it wrong".
 */
export function resolveTenantSlug(
  host: string | null | undefined,
  options: ResolverOptions,
  headerValue?: string | null,
): TenantResolution {
  const {
    baseDomain,
    reserved = DEFAULT_RESERVED,
    slugPattern = DEFAULT_SLUG_PATTERN,
    allowNestedSubdomains = false,
    allowHeaderOverride = false,
  } = options;

  if (allowHeaderOverride && headerValue) {
    const slug = headerValue.trim().toLowerCase();
    if (!slugPattern.test(slug)) return { ok: false, reason: "malformed-slug" };
    if (reserved.includes(slug)) return { ok: false, reason: "reserved-subdomain" };
    return { ok: true, slug, source: "header" };
  }

  const h = normalizeHost(host);
  if (!h) return { ok: false, reason: "no-host" };

  const apex = normalizeHost(baseDomain);
  if (h === apex) return { ok: false, reason: "apex-domain" };

  const suffix = `.${apex}`;
  if (!h.endsWith(suffix)) return { ok: false, reason: "not-under-base-domain" };

  const sub = h.slice(0, -suffix.length);
  if (!sub) return { ok: false, reason: "apex-domain" };

  if (sub.includes(".")) {
    if (!allowNestedSubdomains) return { ok: false, reason: "nested-subdomain" };
    // Left-most label wins: `acme.eu.example.com` -> `acme`.
    const [left] = sub.split(".");
    return finish(left!);
  }

  return finish(sub);

  function finish(slug: string): TenantResolution {
    if (reserved.includes(slug)) return { ok: false, reason: "reserved-subdomain" };
    if (!slugPattern.test(slug)) return { ok: false, reason: "malformed-slug" };
    return { ok: true, slug, source: "host" };
  }
}

/**
 * Build the origin a tenant's OAuth callbacks must return to.
 *
 * Deriving this from the live request instead of a single configured base URL
 * is what lets one deployment serve every tenant subdomain: the IdP is
 * registered against a wildcard, and each flow comes back where it started.
 */
export function tenantOrigin(
  slug: string,
  options: Pick<ResolverOptions, "baseDomain"> & { protocol?: string; port?: number },
): string {
  const protocol = options.protocol ?? "https";
  const port = options.port ? `:${options.port}` : "";
  return `${protocol}://${slug}.${normalizeHost(options.baseDomain)}${port}`;
}
