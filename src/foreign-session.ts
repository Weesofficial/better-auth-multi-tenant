import { createAuthMiddleware, getSessionFromCtx } from "better-auth/api";
import { getTenantFromContext } from "./context.js";

/** A copy of `headers` without the named cookies, or without the cookies `drop` returns `true` for. */
export function withoutCookies(headers: Headers | undefined, drop: string[] | ((name: string) => boolean)): Headers {
  const dropped = typeof drop === "function" ? drop : (name: string) => drop.includes(name);
  const copy = new Headers(headers);
  copy.set(
    "cookie",
    (copy.get("cookie") ?? "")
      .split(/;\s*/)
      .filter((pair) => pair && !dropped(pair.slice(0, pair.indexOf("=") >>> 0)))
      .join("; "),
  );
  return copy;
}

const SCOPED_HEADERS = Symbol.for("better-auth-multi-tenant.scopedHeaders");

/**
 * Remember the request's headers with other tenants' cookies removed, so a
 * later hook that drops more cookies starts from them instead of from the
 * original request (the last hook's headers win).
 */
export function setScopedHeaders(context: unknown, headers: Headers): void {
  (context as Record<symbol, unknown>)[SCOPED_HEADERS] = headers;
}

/** The headers later hooks should start from: scoped ones if set, else the request's. */
export function scopedHeaders(ctx: { headers?: Headers; context: unknown }): Headers | undefined {
  return ((ctx.context as Record<symbol, unknown>)[SCOPED_HEADERS] as Headers | undefined) ?? ctx.headers;
}

/**
 * The sign-in, sign-up and callback routes run without the cross-tenant check,
 * because they run before a session is bound to anything. They still read the
 * session cookie: the anonymous plugin links the anonymous user it finds there to
 * the account being signed in to, and deletes it. A session that belongs to
 * another tenant is therefore dropped from the request on those routes, so the
 * route behaves as if the caller had none, instead of acting on it.
 */
export const foreignSessionHook = (
  getSessionTenantId: (session: unknown) => string | null | undefined,
  enforceSessionTenant: (path: string) => boolean,
) => ({
  matcher: (ctx: { path?: string }) => !enforceSessionTenant(ctx.path ?? ""),
  handler: createAuthMiddleware(async (ctx) => {
    const resolved = getTenantFromContext(ctx.context);
    if (!resolved) return;
    const session = await getSessionFromCtx(ctx, { disableRefresh: true });
    const tenantId = session ? getSessionTenantId(session) : null;
    if (!tenantId || tenantId === resolved.tenant.id) return;

    // getSessionFromCtx caches what it found on the shared context.
    (ctx.context as { session?: unknown }).session = null;
    const { sessionToken, sessionData } = ctx.context.authCookies;
    const headers = withoutCookies(scopedHeaders(ctx), [sessionToken.name, sessionData.name]);
    setScopedHeaders(ctx.context, headers);
    return { context: { headers } };
  }),
});
