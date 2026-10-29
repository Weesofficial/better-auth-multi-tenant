import { createCookieGetter, getCookies } from "better-auth/cookies";
import { setTenantOnContext, type ResolvedTenant, type Tenant } from "./context.js";
import { setScopedHeaders, withoutCookies } from "./foreign-session.js";
import { trimTrailingSlashes } from "./path.js";
import { resolveTenant, type TenantLookup } from "./tenant.js";

const RESOLVED = Symbol.for("better-auth-multi-tenant.resolved");

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Better Auth's per-request AuthContext
type ResolveInput = { path?: string; headers?: Headers; request?: Request; context: any };
type Scoped = { context: { headers: Headers } };

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
    onTenantResolved,
  }: {
    lookup: TenantLookup;
    requireTenant: (path: string) => boolean;
    getOrganizationId?: (tenant: Tenant) => string | null | undefined;
    tenantCookies: boolean;
    onTenantResolved?: (resolved: ResolvedTenant, path: string) => void | Promise<void>;
  }) =>
  async (ctx: ResolveInput): Promise<Scoped | undefined> => {
    const done = (ctx.context as Record<symbol, unknown>)[RESOLVED] as { scoped?: Scoped } | undefined;
    if (done) return done.scoped;
    const path = ctx.path ?? "";
    const resolved = await resolveTenant(lookup, ctx.headers, !requireTenant(path), ctx.request, path);
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
