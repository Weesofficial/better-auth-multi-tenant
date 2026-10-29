import { APIError, createAuthMiddleware } from "better-auth/api";
import { getTenantFromContext } from "./context.js";
import { ERROR_CODES } from "./error-codes.js";
import { requestHost, type TrustProxy } from "./proxy.js";
import { normalizeHost } from "./resolver.js";

/** POST callbacks from an identity provider, which come from the provider's origin. */
const PROVIDER_CALLBACKS = ["/callback", "/oauth2/callback", "/sso/callback", "/sso/saml2/sp/acs", "/sso/saml2/callback"];
const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

/** The host of an `Origin` or `Referer` value; `""` for `null` or anything unparsable. */
function hostOfUrl(value: string): string {
  try {
    return normalizeHost(new URL(value).host);
  } catch {
    return "";
  }
}

/**
 * Tenant subdomains are same-site, so cookies cross between them and a
 * wildcard trustedOrigins accepts any of them. Only the tenant's own host may
 * make a state-changing request here (`sameOriginOnly`).
 */
export const sameOriginHook = (trustProxy: TrustProxy | undefined) => ({
  matcher: (ctx: { path?: string }) =>
    !PROVIDER_CALLBACKS.some((p) => ctx.path === p || (ctx.path ?? "").startsWith(`${p}/`)),
  handler: createAuthMiddleware(async (ctx) => {
    const resolved = getTenantFromContext(ctx.context);
    if (!resolved || (resolved.source !== "host" && resolved.source !== "custom-domain")) return;
    const method = (ctx.request?.method ?? ctx.method ?? "GET").toUpperCase();
    if (SAFE_METHODS.has(method)) return;
    const source = ctx.headers?.get("origin") ?? ctx.headers?.get("referer");
    // No Origin or Referer: a server-side call, or Better Auth's own check refuses it.
    if (source == null) return;
    const host = requestHost({ headers: ctx.headers!, request: ctx.request }, trustProxy);
    if (host.ok && hostOfUrl(source) === normalizeHost(host.host)) return;
    throw new APIError("FORBIDDEN", ERROR_CODES.CROSS_TENANT_ORIGIN);
  }),
});
