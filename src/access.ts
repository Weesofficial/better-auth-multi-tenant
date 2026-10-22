import { APIError } from "better-auth/api";
import type { User } from "better-auth";
import { getTenantFromContext, type Tenant } from "./context.js";

/** The slice of Better Auth's adapter this file needs. */
export interface FindOne {
  findOne: <T>(args: { model: string; where: { field: string; value: string }[] }) => Promise<T | null>;
}

export interface TenantAccessContext {
  /** The tenant's organization, when `getOrganizationId` is set. */
  organizationId?: string;
  adapter: FindOne;
}

/** Whether `user` may get a session on `tenant`. */
export type CanAccessTenant = (user: User, tenant: Tenant, context: TenantAccessContext) => boolean | Promise<boolean>;

/**
 * A `canAccessTenant` that lets in only members of the tenant's organization
 * (Better Auth's `organization` plugin). Needs `getOrganizationId`: a tenant
 * with no organization lets nobody in.
 */
export const organizationMembersOnly: CanAccessTenant = async (user, _tenant, { organizationId, adapter }) =>
  Boolean(
    organizationId &&
      (await adapter.findOne({
        model: "member",
        where: [
          { field: "organizationId", value: organizationId },
          { field: "userId", value: user.id },
        ],
      })),
  );

/**
 * `session.create.before` database hook: every session created on a tenant's
 * host, by any plugin (credentials, OAuth, SSO, magic link, anonymous), is
 * refused unless `canAccess` allows the user in.
 */
export const tenantAccessHook =
  (canAccess: CanAccessTenant) =>
  async (
    session: Record<string, unknown>,
    hookCtx: { context?: { adapter?: FindOne; internalAdapter?: { findUserById: (id: string) => Promise<User | null> } } } | null,
  ): Promise<void> => {
    const resolved = getTenantFromContext(hookCtx?.context);
    if (!resolved) return;
    const user = typeof session.userId === "string" ? await hookCtx?.context?.internalAdapter?.findUserById(session.userId) : null;
    const adapter = hookCtx?.context?.adapter;
    if (!user || !adapter || !(await canAccess(user, resolved.tenant, { organizationId: resolved.organizationId, adapter }))) {
      throw new APIError("FORBIDDEN", {
        code: "TENANT_ACCESS_DENIED",
        message: "This user cannot access this tenant",
      });
    }
  };
