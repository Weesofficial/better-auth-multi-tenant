import { APIError, createAuthMiddleware } from "better-auth/api";
import { getTenantFromContext } from "./context.js";

const crossTenant = () =>
  new APIError("FORBIDDEN", {
    code: "CROSS_TENANT_SESSION",
    message: "This session belongs to a different tenant",
  });

/**
 * Better Auth's `multiSession` plugin keeps one cookie per signed-in account
 * and lets the client list them, switch to one or revoke one. On a tenant's
 * host only that tenant's sessions take part: `list-device-sessions` returns
 * them alone, and `set-active` or `revoke` with another tenant's session is
 * refused with `403 CROSS_TENANT_SESSION`.
 *
 * Subdomains already keep these cookies apart (they are host cookies); this
 * matters when tenants share a host, and guards against a copied cookie.
 */
export const multiSessionHooks = (
  getSessionTenantId: (session: unknown) => string | null | undefined,
  unboundSessions: "reject" | "allow",
) => {
  const belongs = (session: unknown, tenantId: string) => {
    const id = getSessionTenantId(session);
    return id ? id === tenantId : unboundSessions === "allow";
  };

  return {
    before: [
      {
        matcher: (ctx: { path?: string }) => ctx.path === "/multi-session/set-active" || ctx.path === "/multi-session/revoke",
        handler: createAuthMiddleware(async (ctx) => {
          const resolved = getTenantFromContext(ctx.context);
          const token = (ctx.body as { sessionToken?: unknown } | undefined)?.sessionToken;
          if (!resolved || typeof token !== "string") return;
          // The same lookup the plugin makes: the signed cookie named after the token.
          const cookie = `${ctx.context.authCookies.sessionToken.name}_multi-${token.toLowerCase()}`;
          const stored = await ctx.getSignedCookie(cookie, ctx.context.secret);
          if (!stored) return; // The plugin answers INVALID_SESSION_TOKEN.
          const session = await ctx.context.internalAdapter.findSession(stored);
          if (session && !belongs(session, resolved.tenant.id)) throw crossTenant();
        }),
      },
    ],
    after: [
      {
        matcher: (ctx: { path?: string }) => ctx.path === "/multi-session/list-device-sessions",
        handler: createAuthMiddleware(async (ctx) => {
          const resolved = getTenantFromContext(ctx.context);
          const returned = ctx.context.returned;
          if (!resolved || !Array.isArray(returned)) return;
          return ctx.json(returned.filter((item) => belongs(item, resolved.tenant.id)));
        }),
      },
    ],
  };
};
