import { createCookieGetter, getCookies } from "better-auth/cookies";
import { setTenantOnContext, type ResolvedTenant, type Tenant } from "./context.js";
import { setScopedHeaders, withoutCookies } from "./foreign-session.js";
import { trimTrailingSlashes } from "./path.js";
import { requestHost } from "./proxy.js";
import { resolveTenant, type TenantLookup } from "./tenant.js";

const RESOLVED = Symbol.for("better-auth-multi-tenant.resolved");

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Better Auth's per-request AuthContext
type ResolveInput = { path?: string; headers?: Headers; request?: Request; context: any };
type Scoped = { context: { headers: Headers } };

// Better Auth asks for `trustedOrigins` before any hook runs, so the tenant is
// resolved there first; the before hook reuses that result for the same request.
const early = new WeakMap<Request, Promise<ResolvedTenant | null>>();

/**
 * The origin of the host a request arrived on, when that host is the tenant's
 * subdomain or custom domain. Header, path and custom resolution share one host
 * across tenants, so they have no origin of their own.
 */
function tenantHostOrigin(
  resolved: ResolvedTenant,
  headers: Headers | undefined,
  request: Request | undefined,
  lookup: TenantLookup,
  protocol: string | undefined,
): string | null {
  if (resolved.source !== "host" && resolved.source !== "custom-domain") return null;
  if (!headers) return null;
  const host = requestHost({ headers, request }, lookup.trustProxy);
  if (!host.ok || !host.host) return null;
  const scheme = protocol ?? (request ? new URL(request.url).protocol.slice(0, -1) : "https");
  return `${scheme}://${host.host.toLowerCase()}`;
}

/**
 * A `trustedOrigins` function that trusts the requesting tenant's own origin.
 * Only host-based tenancy has one; anything that does not resolve to an active
 * tenant adds nothing.
 */
export const tenantTrustedOrigins =
  (lookup: TenantLookup, protocol: string | undefined) =>
  async (request?: Request): Promise<string[]> => {
    if (!request || lookup.getTenantSlug || lookup.pathPrefix !== undefined) return [];
    // Better Auth asks again from its origin check; answer from the first lookup.
    let pending = early.get(request);
    if (!pending) {
      pending = resolveTenant(lookup, request.headers, true, request);
      early.set(request, pending);
    }
    const resolved = await pending.catch(() => null);
    const origin = resolved && tenantHostOrigin(resolved, request.headers, request, lookup, protocol);
    return origin ? [origin] : [];
  };

/**
 * Resolve the request's tenant and set it up on the request's context, once
 * per request. The first before hook calls it; so does the api-key session
 * wrapper, which can run before that hook when its plugin is listed first.
 */
export const requestResolver =
  ({
    lookup,
    requireTenant,
    getOrganizationId,
    tenantCookies,
    tenantBaseURL,
    protocol,
    onTenantResolved,
  }: {
    lookup: TenantLookup;
    requireTenant: (path: string) => boolean;
    getOrganizationId?: (tenant: Tenant) => string | null | undefined;
    tenantCookies: boolean;
    tenantBaseURL: boolean;
    protocol: string | undefined;
    onTenantResolved?: (resolved: ResolvedTenant, path: string) => void | Promise<void>;
  }) =>
  async (ctx: ResolveInput): Promise<Scoped | undefined> => {
    const done = (ctx.context as Record<symbol, unknown>)[RESOLVED] as { scoped?: Scoped } | undefined;
    if (done) return done.scoped;
    const path = ctx.path ?? "";
    // A tenant found while computing trustedOrigins is reused. A miss (no
    // tenant, or an error) resolves again, so the 400/403/404 still comes from here.
    const pending = ctx.request && early.get(ctx.request);
    const resolved =
      (pending && (await pending.catch(() => null))) ??
      (await resolveTenant(lookup, ctx.headers, !requireTenant(path), ctx.request, path));
    if (!resolved) {
      (ctx.context as Record<symbol, unknown>)[RESOLVED] = {};
      return;
    }

    const organizationId = getOrganizationId?.(resolved.tenant);
    if (organizationId) resolved.organizationId = organizationId;

    setTenantOnContext(ctx.context, resolved);
    let scoped: Scoped | undefined;
    // The context is this request's own copy, so these hold for every
    // later hook and the endpoint, and for nothing else.
    if (resolved.source === "path") {
      // Links Better Auth builds (magic link, OAuth redirect URI, email
      // verification) come back to this tenant's prefix.
      ctx.context.baseURL = `${trimTrailingSlashes(ctx.context.baseURL)}${lookup.pathPrefix}/${resolved.slug}`;
    }
    if (tenantBaseURL) {
      const origin = tenantHostOrigin(resolved, ctx.headers, ctx.request, lookup, protocol);
      if (origin) ctx.context.baseURL = `${origin}${ctx.context.options.basePath || "/api/auth"}`;
    }
    if (tenantCookies) {
      const base = ctx.context.options;
      const tenantOptions = {
        ...base,
        advanced: { ...base.advanced, cookiePrefix: `${base.advanced?.cookiePrefix || "better-auth"}.${resolved.slug}` },
      };
      ctx.context.authCookies = getCookies(tenantOptions);
      ctx.context.createAuthCookie = createCookieGetter(tenantOptions);
      // Other tenants' cookies share this host. Hide them, so no plugin
      // reading every cookie (multi-session lists them all) acts on them.
      const shared = `${base.advanced?.cookiePrefix || "better-auth"}.`;
      const own = `${shared}${resolved.slug}.`;
      const unprefixed = (name: string) => name.replace(/^__(?:Secure|Host)-/, "");
      const headers = withoutCookies(ctx.headers, (name) => unprefixed(name).startsWith(shared) && !unprefixed(name).startsWith(own));
      if (headers.get("cookie") !== (ctx.headers?.get("cookie") ?? "")) {
        setScopedHeaders(ctx.context, headers);
        scoped = { context: { headers } };
      }
    }
    await onTenantResolved?.(resolved, path);
    return scoped;
  };
