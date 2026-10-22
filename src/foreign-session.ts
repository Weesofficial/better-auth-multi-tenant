import { createAuthMiddleware, getSessionFromCtx } from "better-auth/api";
import { getTenantFromContext } from "./context.js";

/** A copy of `headers` without the named cookies. */
export function withoutCookies(headers: Headers | undefined, names: string[]): Headers {
  const copy = new Headers(headers);
  copy.set(
    "cookie",
    (copy.get("cookie") ?? "")
      .split(/;\s*/)
      .filter((pair) => pair && !names.some((name) => pair.startsWith(`${name}=`)))
      .join("; "),
  );
  return copy;
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
    return { context: { headers: withoutCookies(ctx.headers, [sessionToken.name, sessionData.name]) } };
  }),
});
