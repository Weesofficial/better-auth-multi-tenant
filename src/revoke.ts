import { createAuthMiddleware } from "better-auth/api";
import { getTenantFromContext } from "./context.js";

/** The slice of Better Auth's internal adapter this file wraps. */
interface SessionAdapter {
  listSessions: (userId: string, ...rest: never[]) => Promise<{ token: string }[]>;
  deleteSession: (token: string) => Promise<void>;
}

const REVOKE_PATHS = new Set(["/revoke-sessions", "/revoke-other-sessions", "/change-password"]);

/**
 * Better Auth ends a user's sessions on every tenant when a route revokes
 * them, because users are global. On a tenant's host, hand these routes an
 * internal adapter that only sees the tenant's sessions (and the ones with no
 * tenant, which work everywhere under `unboundSessions: "allow"`):
 *
 * - `/revoke-other-sessions` lists the user's sessions and deletes the others;
 * - `/revoke-sessions` and `/change-password` with `revokeOtherSessions` call
 *   `deleteUserSessions`.
 *
 * Both go through `listSessions` and `deleteSession`, so every session storage
 * mode keeps working. The routes are otherwise untouched.
 */
export const revokeScopeHook = (getSessionTenantId: (session: unknown) => string | null | undefined) => ({
  matcher: (ctx: { path?: string }) => REVOKE_PATHS.has(ctx.path ?? ""),
  handler: createAuthMiddleware(async (ctx) => {
    const resolved = getTenantFromContext(ctx.context);
    if (!resolved) return;
    if (ctx.path === "/change-password" && !(ctx.body as { revokeOtherSessions?: boolean } | undefined)?.revokeOtherSessions) return;

    const adapter = ctx.context.internalAdapter as unknown as SessionAdapter;
    const own = (session: { token: string }) => {
      const tenantId = getSessionTenantId({ session });
      return !tenantId || tenantId === resolved.tenant.id;
    };
    return {
      context: {
        context: {
          internalAdapter: {
            listSessions: async (userId: string) => (await adapter.listSessions(userId)).filter(own),
            deleteUserSessions: async (userId: string) => {
              await Promise.all((await adapter.listSessions(userId)).filter(own).map((s) => adapter.deleteSession(s.token)));
            },
          },
        },
      },
    };
  }),
});
