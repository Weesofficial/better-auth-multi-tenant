import { APIError, createAuthMiddleware, getSessionFromCtx } from "better-auth/api";
import type { User } from "better-auth";
import { getTenantFromContext, type Tenant } from "./context.js";

/** The slice of Better Auth's adapter this file needs. */
interface MemberAdapter {
  findOne: <T>(args: { model: string; where: { field: string; value: string }[] }) => Promise<T | null>;
  findMany: <T>(args: { model: string; where: { field: string; value: string }[] }) => Promise<T[]>;
}

type Where = { field: string; value: unknown; operator?: string }[];

/** The slice of Better Auth's internal adapter the admin routes call and this file wraps. */
interface AdminInternalAdapter {
  listUsers: (limit?: number, offset?: number, sortBy?: unknown, where?: Where) => Promise<unknown[]>;
  countTotalUsers: (where?: Where) => Promise<number>;
  listSessions: (userId: string, ...rest: never[]) => Promise<{ token: string }[]>;
  deleteSession: (token: string) => Promise<void>;
  findSession: (token: string) => Promise<unknown>;
}

export const adminTenantMismatch = () =>
  new APIError("FORBIDDEN", {
    code: "ADMIN_TENANT_MISMATCH",
    message: "This user is not a member of this tenant",
  });

export const adminNotTenantAdmin = () =>
  new APIError("FORBIDDEN", {
    code: "ADMIN_NOT_TENANT_ADMIN",
    message: "You are not an administrator of this tenant",
  });

export const adminSharedUser = () =>
  new APIError("FORBIDDEN", {
    code: "ADMIN_SHARED_USER",
    message: "This user is also a member of another tenant, so this change cannot be made from here",
  });

export const adminRoleNotAssignable = () =>
  new APIError("FORBIDDEN", {
    code: "ADMIN_ROLE_NOT_ASSIGNABLE",
    message: "Admin roles are global and cannot be given out from a tenant",
  });

export interface TenantAdminContext {
  /** The tenant's organization, when `getOrganizationId` is set. */
  organizationId?: string;
  adapter: MemberAdapter;
}

/** Whether `user`, who holds an admin role, may use the admin routes on `tenant`'s host. */
export type CanAdministerTenant = (user: User, tenant: Tenant, context: TenantAdminContext) => boolean | Promise<boolean>;

/** Organization roles that make a member an administrator of the tenant, by default. */
const TENANT_ADMIN_ROLES = ["owner", "admin"];

/**
 * The default {@link CanAdministerTenant}: the caller is an `owner` or `admin`
 * member of the tenant's organization. Better Auth's admin role is global, so
 * without this an admin of one tenant would be an admin of every tenant they
 * can get a session on.
 */
export const organizationAdminsOnly: CanAdministerTenant = async (user, _tenant, { organizationId, adapter }) => {
  if (!organizationId) return false;
  const member = await adapter.findOne<{ role?: string }>({
    model: "member",
    where: [
      { field: "organizationId", value: organizationId },
      { field: "userId", value: user.id },
    ],
  });
  return (member?.role ?? "").split(",").some((role) => TENANT_ADMIN_ROLES.includes(role.trim()));
};

/**
 * Routes that change the global user, so their effect reaches every tenant the
 * user belongs to: a new password or email lets whoever set it sign in as the
 * user on the other tenants too.
 */
const GLOBAL_EFFECT = new Set([
  "/admin/set-role",
  "/admin/update-user",
  "/admin/ban-user",
  "/admin/unban-user",
  "/admin/remove-user",
  "/admin/set-user-password",
]);

/** Admin routes the caller does not need to administer the tenant for. */
const ANY_CALLER = new Set(["/admin/stop-impersonating", "/admin/has-permission"]);

/** Admin routes that act on one user, and where each takes the user id from. */
const TARGET_USER: Record<string, (ctx: { body?: unknown; query?: unknown }) => unknown> = {
  "/admin/get-user": (ctx) => (ctx.query as { id?: unknown } | undefined)?.id,
  "/admin/set-role": (ctx) => (ctx.body as { userId?: unknown } | undefined)?.userId,
  "/admin/update-user": (ctx) => (ctx.body as { userId?: unknown } | undefined)?.userId,
  "/admin/list-user-sessions": (ctx) => (ctx.body as { userId?: unknown } | undefined)?.userId,
  "/admin/ban-user": (ctx) => (ctx.body as { userId?: unknown } | undefined)?.userId,
  "/admin/unban-user": (ctx) => (ctx.body as { userId?: unknown } | undefined)?.userId,
  "/admin/impersonate-user": (ctx) => (ctx.body as { userId?: unknown } | undefined)?.userId,
  "/admin/revoke-user-sessions": (ctx) => (ctx.body as { userId?: unknown } | undefined)?.userId,
  "/admin/remove-user": (ctx) => (ctx.body as { userId?: unknown } | undefined)?.userId,
  "/admin/set-user-password": (ctx) => (ctx.body as { userId?: unknown } | undefined)?.userId,
};

/**
 * Better Auth's `admin` plugin works on every user of the instance, because
 * users are global. On a tenant's host with an organization bridge, the admin
 * routes only reach the members of the tenant's organization:
 *
 * - `list-users` lists (and counts) members only;
 * - a route that names a user (`get-user`, `set-role`, `ban-user`,
 *   `impersonate-user`, `remove-user`, …) refuses anyone else with
 *   `403 ADMIN_TENANT_MISMATCH`;
 * - `list-user-sessions` and `revoke-user-sessions` see the tenant's sessions
 *   only, and `revoke-user-session` refuses another tenant's session.
 *
 * The caller has to administer the tenant (`canAdminister`, by default an
 * `owner` or `admin` member of its organization), else `ADMIN_NOT_TENANT_ADMIN`:
 * the admin role is global, and holding it must not make someone an admin of
 * every tenant. Routes that change the global user (password, email, role, ban,
 * removal) refuse a user who also belongs to another organization
 * (`ADMIN_SHARED_USER`), unless `sharedUsers` is `"allow"`. `create-user` and
 * `set-role` cannot give out one of the admin plugin's `adminRoles`
 * (`ADMIN_ROLE_NOT_ASSIGNABLE`), unless `roleAssignment` is `"allow"`.
 *
 * A tenant with no organization has no members, so every one of these refuses.
 *
 * A caller with no session is left to the admin plugin's own `401`, so these
 * checks never tell an anonymous caller whether a user id is a member.
 */
export const adminScopeHook = (
  getSessionTenantId: (session: unknown) => string | null | undefined,
  canAdminister: CanAdministerTenant = organizationAdminsOnly,
  sharedUsers: "refuse" | "allow" = "refuse",
  roleAssignment: "refuse" | "allow" = "refuse",
) => ({
  matcher: (ctx: { path?: string }) => (ctx.path ?? "").startsWith("/admin/"),
  handler: createAuthMiddleware(async (ctx) => {
    const resolved = getTenantFromContext(ctx.context);
    if (!resolved) return;
    const session = await getSessionFromCtx(ctx, { disableRefresh: true });
    if (!session) return;
    const organizationId = resolved.organizationId;
    const adapter = ctx.context.adapter as unknown as MemberAdapter;
    const internal = ctx.context.internalAdapter as unknown as AdminInternalAdapter;
    const path = ctx.path ?? "";

    if (!ANY_CALLER.has(path)) {
      let allowed = false;
      try {
        allowed = (await canAdminister(session.user as User, resolved.tenant, { organizationId, adapter })) === true;
      } catch {
        // A check that throws refuses, like canAccessTenant.
      }
      if (!allowed) throw adminNotTenantAdmin();
    }

    const isMember = async (userId: string) =>
      Boolean(
        organizationId &&
          (await adapter.findOne({
            model: "member",
            where: [
              { field: "organizationId", value: organizationId },
              { field: "userId", value: userId },
            ],
          })),
      );

    const target = TARGET_USER[path]?.(ctx);
    // A missing id is the admin plugin's own validation error to give.
    if (target !== undefined && target !== null && !(await isMember(String(target)))) throw adminTenantMismatch();

    if (sharedUsers === "refuse" && GLOBAL_EFFECT.has(path) && target !== undefined && target !== null) {
      const memberships = await adapter.findMany<{ organizationId: string }>({
        model: "member",
        where: [{ field: "userId", value: String(target) }],
      });
      if (memberships.some((m) => m.organizationId !== organizationId)) throw adminSharedUser();
    }

    if (roleAssignment === "refuse" && (path === "/admin/create-user" || path === "/admin/set-role")) {
      const role = (ctx.body as { role?: unknown } | undefined)?.role;
      const roles = (Array.isArray(role) ? role : typeof role === "string" ? role.split(",") : []).map((r) => String(r).trim());
      const adminPlugin = (ctx.context.options.plugins ?? []).find((p: { id: string }) => p.id === "admin") as
        | { options?: { adminRoles?: string | string[] } }
        | undefined;
      const configured = adminPlugin?.options?.adminRoles ?? ["admin"];
      const adminRoles = (Array.isArray(configured) ? configured : configured.split(",")).map((r) => r.trim().toLowerCase());
      if (roles.some((r) => adminRoles.includes(r.toLowerCase()))) throw adminRoleNotAssignable();
    }

    const ownSession = (session: unknown) => getSessionTenantId(session) === resolved.tenant.id;

    if (path === "/admin/revoke-user-session") {
      const token = (ctx.body as { sessionToken?: unknown } | undefined)?.sessionToken;
      if (typeof token !== "string") return;
      const found = await internal.findSession(token);
      if (found && !ownSession(found)) {
        throw new APIError("FORBIDDEN", {
          code: "CROSS_TENANT_SESSION",
          message: "This session belongs to a different tenant",
        });
      }
      return;
    }

    if (path === "/admin/list-user-sessions" || path === "/admin/revoke-user-sessions") {
      const listOwn = async (userId: string) => (await internal.listSessions(userId)).filter((session) => ownSession({ session }));
      return {
        context: {
          context: {
            internalAdapter: {
              listSessions: listOwn,
              deleteUserSessions: async (userId: string) => {
                await Promise.all((await listOwn(userId)).map((s) => internal.deleteSession(s.token)));
              },
            },
          },
        },
      };
    }

    if (path === "/admin/list-users") {
      const members = organizationId
        ? await adapter.findMany<{ userId: string }>({ model: "member", where: [{ field: "organizationId", value: organizationId }] })
        : [];
      const scope: Where = [{ field: "id", operator: "in", value: members.map((m) => m.userId) }];
      return {
        context: {
          context: {
            internalAdapter: {
              listUsers: (limit?: number, offset?: number, sortBy?: unknown, where?: Where) =>
                internal.listUsers(limit, offset, sortBy, [...(where ?? []), ...scope]),
              countTotalUsers: (where?: Where) => internal.countTotalUsers([...(where ?? []), ...scope]),
            },
          },
        },
      };
    }
  }),
});
