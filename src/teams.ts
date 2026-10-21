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

const organizationMismatch = () =>
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
 * active organization, so an explicit one has to match, and so does a team id
 * (`list-team-members` looks a team up by id alone).
 */
export const teamScopeHook = {
  matcher: (ctx: { path?: string }) => TEAM_PATHS.has(ctx.path ?? ""),
  handler: createAuthMiddleware(async (ctx) => {
    const expected = getTenantFromContext(ctx.context)?.organizationId;
    if (!expected) return;

    const body = (ctx.body ?? {}) as { organizationId?: unknown; teamId?: unknown; data?: { organizationId?: unknown } };
    const query = (ctx.query ?? {}) as { organizationId?: unknown; teamId?: unknown };

    // An empty value means "the active organization", checked below.
    for (const id of [body.organizationId, body.data?.organizationId, query.organizationId]) {
      if (id && id !== expected) throw organizationMismatch();
    }

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
 * `list-user-teams` returns the user's teams in every organization (older
 * versions take no organization at all), so keep only the tenant's.
 */
export const teamListHook = {
  matcher: (ctx: { path?: string }) => ctx.path === "/organization/list-user-teams",
  handler: createAuthMiddleware(async (ctx) => {
    const expected = getTenantFromContext(ctx.context)?.organizationId;
    const returned = ctx.context.returned;
    if (!expected || returned instanceof Error) return;
    const teams = Array.isArray(returned) ? (returned as { organizationId?: string }[]) : [];
    return ctx.json(teams.filter((team) => team.organizationId === expected));
  }),
};
