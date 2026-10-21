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
 * With an organization bridge, every `/organization/*` route on a tenant's
 * host only works on the tenant's organization:
 *
 * - an explicit `organizationId` or `organizationSlug` (body, `data` or query)
 *   has to be the tenant's, so `null` (clearing it) and an unknown slug are
 *   refused too; without one, the routes in `ORG_PATHS` use the session's
 *   active organization, which has to be the tenant's;
 * - an invitation or member named by id has to belong to it, and so does a
 *   `teamId` on `invite-member`;
 * - `check-slug` is refused, since it tells whether any organization has a slug.
 *
 * An id that matches nothing is left to the route's own not-found error. Team
 * routes add their own checks in `teamScopeHook`.
 */
export const organizationScopeHook = {
  matcher: (ctx: { path?: string }) => ctx.path?.startsWith("/organization/") ?? false,
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

    let explicit = false;
    for (const source of [body, body.data, query]) {
      if (!source || typeof source !== "object") continue;
      const { organizationId, organizationSlug } = source as { organizationId?: unknown; organizationSlug?: unknown };
      let target = organizationId;
      if (target === undefined && organizationSlug !== undefined) {
        const org =
          typeof organizationSlug === "string"
            ? await adapter.findOne<{ id: string }>({ model: "organization", where: [{ field: "slug", value: organizationSlug }] })
            : null;
        // An unknown slug fails closed.
        target = org?.id ?? null;
      }
      if (target === undefined) continue;
      explicit = true;
      if (target !== expected) throw organizationMismatch();
    }

    if (INVITATION_PATHS.has(path)) {
      mustBeTenants(await ownerOf("invitation", "id", body.invitationId ?? query.id));
      return;
    }
    if (!ORG_PATHS.has(path)) return;

    // Without an explicit organization the route uses the active one, which a
    // session that predates the bridge can have set to another.
    if (!explicit) {
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
