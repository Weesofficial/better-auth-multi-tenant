import { APIError, createAuthMiddleware, getSessionFromCtx } from "better-auth/api";
import { getTenantFromContext } from "./context.js";

/** Paths that legitimately run without a tenant-bound session. */
const UNBOUND_PATHS = [
  "/sign-in",
  "/sign-up",
  "/callback",
  "/oauth2/callback",
  "/sso/callback",
  "/sso/saml2/sp/acs",
  "/verify-email",
  "/reset-password",
  "/request-password-reset",
  "/error",
  "/ok",
];

// Match whole path segments, so `/sign-in/email` is an entry point but
// `/sign-in-as-admin` or `/okta` is not.
export const defaultEnforceSessionTenant = (path: string) =>
  !UNBOUND_PATHS.some((p) => path === p || path.startsWith(`${p}/`));

const crossTenantSession = () =>
  new APIError("FORBIDDEN", {
    code: "CROSS_TENANT_SESSION",
    message: "This session belongs to a different tenant",
  });

/**
 * The session behind an `Authorization: Bearer` header, if any. Used only to
 * refuse a request, never to allow one, so the token's signature need not be
 * checked here: the bearer plugin does that before it authenticates anything.
 */
async function findBearerSession(ctx: {
  headers?: Headers;
  context: { internalAdapter: { findSession: (token: string) => Promise<unknown> } };
}) {
  const header = ctx.headers?.get("authorization");
  if (!header || !/^bearer\s/i.test(header)) return null;
  let value = header.slice(7).trim();
  try {
    value = decodeURIComponent(value);
  } catch {
    // Not URI-encoded; use as is.
  }
  // Signed tokens are `token.signature`; the session token is the first part.
  const token = value.split(".")[0];
  return token ? ctx.context.internalAdapter.findSession(token) : null;
}

/**
 * The core isolation property: a session issued for tenant A must not be
 * usable on tenant B's host, no matter what the caller sends.
 */
export const sessionTenantHook = (
  getSessionTenantId: (session: unknown) => string | null | undefined,
  enforceSessionTenant: (path: string) => boolean,
  unboundSessions: "reject" | "allow",
) => ({
  matcher: (ctx: { path?: string }) => enforceSessionTenant(ctx.path ?? ""),
  handler: createAuthMiddleware(async (ctx) => {
    const resolved = getTenantFromContext(ctx.context);
    if (!resolved) return;

    // Check the cookie session and any bearer token. The bearer plugin
    // only turns `Authorization` into a cookie after every before-hook
    // has run, so getSessionFromCtx cannot see it here.
    const sessions = [await getSessionFromCtx(ctx), await findBearerSession(ctx)];

    for (const session of sessions) {
      if (!session) continue; // Unauthenticated: the normal 401 path handles it.

      const sessionTenantId = getSessionTenantId(session);
      // A session with no tenant predates the plugin (or was minted on
      // the apex). Accepting it would make it valid on every tenant.
      if (!sessionTenantId) {
        if (unboundSessions === "allow") continue;
        throw new APIError("FORBIDDEN", {
          code: "UNBOUND_SESSION",
          message: "This session is not bound to a tenant",
        });
      }

      if (sessionTenantId !== resolved.tenant.id) throw crossTenantSession();
    }
  }),
});

/**
 * A user's sessions span tenants; revoking one from another tenant's host
 * would let that host sign the user out elsewhere.
 */
export const revokeSessionHook = (getSessionTenantId: (session: unknown) => string | null | undefined) => ({
  matcher: (ctx: { path?: string }) => ctx.path === "/revoke-session",
  handler: createAuthMiddleware(async (ctx) => {
    const resolved = getTenantFromContext(ctx.context);
    const token = (ctx.body as { token?: unknown } | undefined)?.token;
    if (!resolved || typeof token !== "string") return;
    const target = await ctx.context.internalAdapter.findSession(token);
    if (target && getSessionTenantId(target) !== resolved.tenant.id) throw crossTenantSession();
  }),
});

/**
 * `list-sessions` returns every session of the user, tokens included. Only
 * this tenant's may leave this tenant's host.
 */
export const listSessionsHook = (getSessionTenantId: (session: unknown) => string | null | undefined) => ({
  matcher: (ctx: { path?: string }) => ctx.path === "/list-sessions",
  handler: createAuthMiddleware(async (ctx) => {
    const resolved = getTenantFromContext(ctx.context);
    const returned = ctx.context.returned;
    if (!resolved || !Array.isArray(returned)) return;
    return ctx.json(returned.filter((session) => getSessionTenantId({ session }) === resolved.tenant.id));
  }),
});
