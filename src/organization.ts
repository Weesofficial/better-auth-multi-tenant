import { createAuthMiddleware, getSessionFromCtx } from "better-auth/api";
import { getTenantFromContext } from "./context.js";
import { listScopeHook, organizationMismatch, teamOrganizationId, teamTenantMismatch } from "./teams.js";

/** Routes that take an organization (id or slug) from the request, or use the active one. */
const ORG_PATHS = new Set(
  [
    "invite-member",
    "remove-member",
    "update-member-role",
    "list-members",
    "list-invitations",
    "get-active-member-role",
    "get-organization",
    "get-full-organization",
    "update",
    "delete",
  ].map((p) => `/organization/${p}`),
);

/** Routes that address an invitation by id: `invitationId` in the body, `id` in the query. */
const INVITATION_PATHS = new Set(["accept-invitation", "reject-invitation", "cancel-invitation", "get-invitation"].map((p) => `/organization/${p}`));

/** `check-slug` answers whether any organization has a slug, whoever owns it. */
const CHECK_SLUG = "/organization/check-slug";

/**
 * With an organization bridge, the organization routes that are not about
 * teams only work on the tenant's organization on a tenant's host:
 *
 * - an explicit `organizationId` or `organizationSlug` has to be the tenant's,
 *   and without one the session's active organization has to be;
 * - an invitation or member named by id has to belong to it, and so does a
 *   `teamId` on `invite-member`;
 * - `check-slug` is refused, since it tells whether any organization has a slug.
 *
 * An id that matches nothing is left to the route's own not-found error.
 */
export const organizationScopeHook = {
  matcher: (ctx: { path?: string }) => {
    const path = ctx.path ?? "";
    return ORG_PATHS.has(path) || INVITATION_PATHS.has(path) || path === CHECK_SLUG;
  },
  handler: createAuthMiddleware(async (ctx) => {
    const expected = getTenantFromContext(ctx.context)?.organizationId;
    if (!expected) return;
    const path = ctx.path;
    if (path === CHECK_SLUG) throw organizationMismatch();

    const body = (ctx.body ?? {}) as Record<string, unknown>;
    const query = (ctx.query ?? {}) as Record<string, unknown>;
    const adapter = ctx.context.adapter;
    const ownerOf = async (model: string, field: string, id: unknown) =>
      typeof id === "string" && id
        ? ((await adapter.findOne<{ organizationId: string }>({ model, where: [{ field, value: id }] }))?.organizationId ?? null)
        : null;
    const mustBeTenants = (owner: string | null) => {
      if (owner && owner !== expected) throw organizationMismatch();
    };

    if (INVITATION_PATHS.has(path)) {
      mustBeTenants(await ownerOf("invitation", "id", body.invitationId ?? query.id));
      return;
    }

    const explicit = [body.organizationId, query.organizationId].filter(Boolean);
    for (const id of explicit) if (id !== expected) throw organizationMismatch();
    if (typeof query.organizationSlug === "string" && query.organizationSlug) {
      explicit.push(query.organizationSlug);
      mustBeTenants((await adapter.findOne<{ id: string }>({ model: "organization", where: [{ field: "slug", value: query.organizationSlug }] }))?.id ?? null);
    }
    // Without an explicit organization the route uses the active one, which a
    // session that predates the bridge can have set to another.
    if (!explicit.length) {
      const active = (await getSessionFromCtx(ctx))?.session.activeOrganizationId;
      if (active && active !== expected) throw organizationMismatch();
    }

    mustBeTenants(await ownerOf("member", "id", path === "/organization/update-member-role" ? body.memberId : body.memberIdOrEmail));

    const teams = Array.isArray(body.teamId) ? body.teamId : [body.teamId];
    for (const teamId of teams) {
      if (typeof teamId !== "string" || !teamId) continue;
      const owner = await teamOrganizationId(adapter, teamId);
      if (owner && owner !== expected) throw teamTenantMismatch();
    }
  }),
};

/** `list-user-invitations` lists the user's invitations to every organization. */
export const invitationListHook = listScopeHook("/organization/list-user-invitations");
