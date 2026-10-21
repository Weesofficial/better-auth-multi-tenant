import { APIError, createAuthMiddleware, getSessionFromCtx } from "better-auth/api";
import { getTenantFromContext } from "./context.js";

/** The slice of Better Auth's adapter this file needs. */
interface FindOne {
  findOne: <T>(args: { model: string; where: { field: string; value: string }[] }) => Promise<T | null>;
}

/** The organization a team belongs to, or `null` when there is no such team. */
export async function teamOrganizationId(adapter: FindOne, teamId: string): Promise<string | null> {
  const team = await adapter.findOne<{ organizationId: string }>({
    model: "team",
    where: [{ field: "id", value: teamId }],
  });
  return team?.organizationId ?? null;
}

export const teamTenantMismatch = () =>
  new APIError("FORBIDDEN", {
    code: "TEAM_TENANT_MISMATCH",
    message: "This team belongs to a different tenant's organization",
  });

export const organizationMismatch = () =>
  new APIError("FORBIDDEN", {
    code: "ORGANIZATION_TENANT_MISMATCH",
    message: "Only this tenant's organization can be used here",
  });

/** Organization plugin routes that take an organization or a team from the request. */
const TEAM_PATHS = new Set([
  "/organization/create-team",
  "/organization/remove-team",
  "/organization/update-team",
  "/organization/list-teams",
  "/organization/set-active-team",
  "/organization/list-user-teams",
  "/organization/list-team-members",
  "/organization/add-team-member",
  "/organization/remove-team-member",
]);

/**
 * With an organization bridge, a team route on a tenant's host only works on
 * that tenant's organization and its teams. Routes default to the session's
 * active organization, which has to match, and so does a team id
 * (`list-team-members` looks a team up by id alone). An explicit organization
 * is checked by `organizationScopeHook`, which covers every `/organization/*` route.
 */
export const teamScopeHook = {
  matcher: (ctx: { path?: string }) => TEAM_PATHS.has(ctx.path ?? ""),
  handler: createAuthMiddleware(async (ctx) => {
    const expected = getTenantFromContext(ctx.context)?.organizationId;
    if (!expected) return;

    const body = (ctx.body ?? {}) as { teamId?: unknown };
    const query = (ctx.query ?? {}) as { teamId?: unknown };

    // A session that predates the bridge can still have another organization active.
    const active = (await getSessionFromCtx(ctx))?.session.activeOrganizationId;
    if (active && active !== expected) throw organizationMismatch();

    const teamId = body.teamId ?? query.teamId;
    if (typeof teamId === "string" && teamId) {
      const owner = await teamOrganizationId(ctx.context.adapter, teamId);
      // An unknown team is left to the route's own TEAM_NOT_FOUND.
      if (owner && owner !== expected) throw teamTenantMismatch();
    }
  }),
};

/**
 * A route that lists rows across every organization of the user: keep only the
 * tenant's. `list-user-teams` (older versions take no organization at all) and
 * `list-user-invitations` work this way.
 */
export const listScopeHook = (path: string) => ({
  matcher: (ctx: { path?: string }) => ctx.path === path,
  handler: createAuthMiddleware(async (ctx) => {
    const expected = getTenantFromContext(ctx.context)?.organizationId;
    const returned = ctx.context.returned;
    if (!expected || returned instanceof Error) return;
    const rows = Array.isArray(returned) ? (returned as { organizationId?: string }[]) : [];
    return ctx.json(rows.filter((row) => row.organizationId === expected));
  }),
});

export const teamListHook = listScopeHook("/organization/list-user-teams");
