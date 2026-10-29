# Organizations, teams, SSO and admin

How the plugin scopes Better Auth's `organization` and `admin` plugins and
`@better-auth/sso` to a tenant, and how `canAccessTenant` decides who may sign in.

## With the `organization` plugin

If each tenant is one organization in Better Auth's
[`organization` plugin](https://www.better-auth.com/docs/plugins/organization),
tell the plugin how to map them:

```ts
import { organization } from "better-auth/plugins";

betterAuth({
  plugins: [
    organization(),
    multiTenant({
      baseDomain: "example.com",
      getTenant,
      getOrganizationId: (tenant) => tenant.organizationId,
    }),
  ],
  databaseHooks: tenantSessionHooks(),
});
```

On a tenant's host:

- a new session starts with the tenant's organization as
  `activeOrganizationId`, stamped by `tenantSessionHooks()`;
- `/organization/set-active` accepts only that organization, by id or by slug.
  Switching to any other organization, or clearing it, is
  `403 ORGANIZATION_TENANT_MISMATCH`;
- every other `/organization/*` endpoint refuses an `organizationId` or
  `organizationSlug` (in the body or the query) that is not the tenant's, also
  with `403 ORGANIZATION_TENANT_MISMATCH`. An unknown slug is refused too;
- `/organization/list` returns only the tenant's organization.

Membership checks stay with the `organization` plugin: the user still has to be
a member of the tenant's organization.

The routes that take an organization, an invitation or a member from the
request are scoped to the tenant's organization as well, else
`403 ORGANIZATION_TENANT_MISMATCH` (`TEAM_TENANT_MISMATCH` for a team):

- `invite-member`, `remove-member`, `update-member-role`, `list-members`,
  `list-invitations`, `get-active-member-role`, `get-organization`,
  `get-full-organization`, `update` and `delete` refuse an explicit
  `organizationId` or `organizationSlug` that is not the tenant's. Without one
  they use the active organization, which has to be the tenant's too (a session
  that predates the bridge can still have another one active). `invite-member`
  also refuses a `teamId`, or any of several, from another organization.
- An invitation named by id (`get-invitation`, `accept-invitation`,
  `reject-invitation`, `cancel-invitation`) and a member named by id
  (`remove-member`, `update-member-role`) have to belong to the tenant's
  organization. An id that matches nothing is left to the route's own error.
- `list-user-invitations` only returns the tenant's invitations.
- `check-slug` is refused: it says whether any organization has a slug. Slugs
  stay unique across tenants, so `organization/create` still answers "slug taken"
  for another tenant's slug.

`add-member` and `leave` are not scoped: `add-member` is server-only, and
leaving another organization only removes access.

### Who may sign in to a tenant

Better Auth has one user table, so by default an account created on `acme`
signs in on `globex` too and gets a `globex` session there. Set
`canAccessTenant` to decide:

```ts
import { multiTenant, organizationMembersOnly } from "better-auth-multi-tenant";

multiTenant({
  baseDomain: "example.com",
  getTenant,
  getOrganizationId: (tenant) => tenant.organizationId,
  // Only members of the tenant's organization...
  canAccessTenant: organizationMembersOnly,
  // ...or your own rule:
  // canAccessTenant: async (user, tenant) => db.access.exists({ userId: user.id, tenantId: tenant.id }),
});
```

It runs whenever a session is created on a tenant's host, whichever plugin
creates it (password, OAuth, SSO, magic link, anonymous), and answers
`403 TENANT_ACCESS_DENIED` with no session issued. A check that throws refuses
too. Things to know:

- It runs when the session is created, not on each request. A user whose access
  you remove keeps their existing sessions until you revoke them.
- `organizationMembersOnly` needs the user to be a member *before* signing in,
  so invite and add members by another route; a self-service sign-up with
  auto sign-in is refused (the account is created, no session is). It lets
  nobody in on a tenant that has no organization.
- A wrong password is still the ordinary `401`; `TENANT_ACCESS_DENIED` is only
  answered once the credentials are right.
- **Sign-up on another tenant reveals whether the email is registered**, as in
  plain Better Auth (`422 USER_ALREADY_EXISTS`), unless Better Auth is told to
  create no session at sign-up: with `emailAndPassword.autoSignIn: false` or
  `requireEmailVerification: true` it answers a known email exactly like a new
  one (`200`, `token: null`, a stand-in user; the stand-in carries `image: null`,
  which a real user without an image does not). With auto sign-in on, a fresh
  sign-up returns a session and cookie, so no hook can make the duplicate look
  the same. Set one of those two options if this matters to you.

### Teams

With `organization({ teams: { enabled: true } })` and `getOrganizationId`, the
team routes are scoped to the tenant's organization too (the `teams` option,
on by default with `getOrganizationId`; `teams: false` leaves teams unscoped
while the other organization checks stay). On a tenant's host:

- `create-team`, `update-team`, `remove-team`, `list-teams`, `list-user-teams`,
  `add-team-member` and `remove-team-member` refuse an explicit
  `organizationId` that is not the tenant's (`ORGANIZATION_TENANT_MISMATCH`).
  Leave it out and the tenant's organization is used.
- Any route that names a team (`teamId`, including `list-team-members`, which
  finds a team by id alone) refuses a team of another organization with
  `403 TEAM_TENANT_MISMATCH`.
- A session that still has another organization active (it predates the
  bridge) cannot use the team routes until it is switched to the tenant's.
- `list-user-teams` only returns the tenant's teams. It lists the user's teams
  in every organization otherwise.
- `activeTeamId` can only be set to a team of the tenant's organization, on
  every write: `set-active-team`, accepting an invitation and so on. Clearing the active organization (leaving it, say) clears the
  active team with it.

## With `@better-auth/sso`

[`@better-auth/sso`](https://www.better-auth.com/docs/plugins/sso) is an
optional peer dependency: the plugin works without it, and nothing here loads it.
Tell the plugin which providers belong to a tenant, by organization or by
domain:

```ts
multiTenant({
  baseDomain: "example.com",
  getTenant,
  // Providers registered with `organizationId` belong to that tenant...
  getOrganizationId: (tenant) => tenant.organizationId,
  // ...and so do providers with no organization whose domains are listed here.
  getSSODomains: (tenant) => tenant.emailDomains,
});
```

Setting either option turns the checks on (the `sso` option; `sso: false` turns
them off again even with a mapping, `sso: true` without a mapping throws at
startup). Without them SSO is untouched, so any
tenant's host can use any provider, and the plugin logs a warning at startup if
`@better-auth/sso` is installed. To fail closed instead, set
`ssoRequireTenantMapping: true`: with neither option set, every SSO route
(`/sign-in/sso` and `/sso/*`) is then refused on a tenant's host with
`403 SSO_PROVIDER_TENANT_MISMATCH` until you add a mapping. It defaults to
`false`, so existing setups keep working.

With a mapping, on a tenant's host every provider the request reaches has to
belong to the tenant, else `403 SSO_PROVIDER_TENANT_MISMATCH`:

- **Sign-in** (`/sign-in/sso`). The provider is chosen from the tenant's own
  providers (by `providerId`, `organizationSlug`, `domain` or `email`) and then
  pinned by id before the SSO plugin runs. Two tenants sharing a domain cannot
  make a sign-in resolve to the other one's provider.
- **Registration** (`/sso/register`). `organizationId` must be the tenant's
  organization and is filled in when left out. A provider with no organization
  needs a `domain` the tenant owns.
- **Callbacks and SAML routes** (`/sso/callback/:providerId`,
  `/sso/saml2/...`) and **provider management** (`get-provider`,
  `update-provider`, `delete-provider`, the domain verification routes). The
  provider named in the path, query or body must belong to the host's tenant.
  A callback that lands on another tenant's host is refused before the SSO
  plugin reads the state or creates a user. Changing a domain-owned provider's
  `domain` to one the tenant does not own is refused too.

A provider belongs to the tenant of its organization, whatever its `domain`
says. One with no organization belongs to the tenant when **all** of its
(comma-separated) domains are one of the tenant's `getSSODomains`, or a
subdomain of one. Providers from the SSO plugin's `defaultSSO` option are not in
the database, so they belong to no tenant and are refused on tenant hosts.

The session a callback creates is stamped with the tenant of the host it lands
on (`tenantSessionHooks()`), and the provider check makes that the tenant that
started the flow, since a provider belongs to one tenant.

Limits, because the SSO plugin's callback design leaves no safe way to do more
through public hooks:

- **The callback must land on the tenant's own host.** The redirect URL is
  `{baseURL}/sso/callback/{providerId}`, so with one fixed `baseURL` every flow
  returns to one host, which is not the tenant's. Use a `baseURL` that follows
  the request host (Better Auth's dynamic `baseURL` with `allowedHosts`, where
  your version has it), and register each tenant's redirect URL with the
  identity provider. This repository's tests drive the callback on tenant hosts
  directly; they do not run a dynamic `baseURL`. A callback on a host that names no
  tenant creates no session: `tenantSessionHooks()` refuses an unbound session,
  so keep its default `onMissingTenant: "reject"` when you use SSO.
- **The shared callback is refused on a tenant's host.** With the SSO plugin's
  `redirectURI` option, `/sso/callback` learns the provider from the OAuth
  state, which only the SSO plugin can read. It cannot be checked, so it gets
  `SSO_PROVIDER_TENANT_MISMATCH` on a tenant's host.
- **SAML responses are bound to a host through RelayState, not through a
  cookie.** The IdP posts to the ACS URL cross-site, so no cookie ties the
  response to the browser that started the flow (a login-CSRF the SSO plugin
  does not guard either). What is bound is the tenant: when `/sign-in/sso`
  redirects to the IdP, the plugin records the RelayState that the SSO plugin put
  in the redirect URL (a standard parameter of the redirect binding) together
  with the tenant of the host. The ACS route on a tenant's host then refuses a
  RelayState that was not handed out on that tenant, or is unknown or expired
  (`SSO_PROVIDER_TENANT_MISMATCH`). This closes the case the provider check
  cannot: two tenants whose `getSSODomains` overlap both own the provider, and a
  response for a flow started on one could be posted to the other. Not covered:
  an **IdP-initiated** response carries no RelayState, so only the provider check
  applies to it (and the SSO plugin refuses it unless `allowIdpInitiated` is
  on). A flow started before you upgrade, or a version of the SSO plugin that
  stops using the redirect binding, has no record and is refused, which fails
  closed.
- **Users are global**, as ever: an SSO sign-in links to an existing account
  with the same email, on any tenant. Use `canAccessTenant` to refuse it.

`GET /sso/providers` lists only the tenant's providers (the same ownership rule
as above). Without `getOrganizationId` or `getSSODomains` it is unfiltered.

### Admin plugin

With `getOrganizationId`, Better Auth's
[`admin` plugin](https://www.better-auth.com/docs/plugins/admin) only reaches the
tenant's members on its host (`admin`, on by default with
`getOrganizationId`):

- `/admin/list-users` lists and counts members of the tenant's organization only,
  with the caller's search and filters applied on top.
- A route that names a user (`get-user`, `set-role`, `update-user`, `ban-user`,
  `unban-user`, `impersonate-user`, `remove-user`, `set-user-password`,
  `list-user-sessions`, `revoke-user-sessions`) refuses anyone else with
  `403 ADMIN_TENANT_MISMATCH`.
- `list-user-sessions` and `revoke-user-sessions` see the tenant's sessions only,
  and `revoke-user-session` refuses another tenant's session.
- An impersonation session is bound to the tenant it was started on.

Better Auth's admin role is a field of the global user, so on its own it would
make an admin of one tenant an admin of every tenant they can get a session on.
On a tenant's host the caller must also administer that tenant
(`canAdministerTenant`), else `403 ADMIN_NOT_TENANT_ADMIN`. The default,
`organizationAdminsOnly`, accepts an `owner` or `admin` member of the tenant's
organization; pass your own function for platform staff:

```ts
multiTenant({
  // ...
  canAdministerTenant: async (user, tenant, ctx) =>
    user.email.endsWith("@yourcompany.com") || organizationAdminsOnly(user, tenant, ctx),
});
```

Passwords, emails, roles and bans are global too, so changing them for a user who
also belongs to another tenant would change them there as well: a password set
by one tenant's admin would sign in as the user on the other tenant. The routes
that do this (`set-user-password`, `update-user`, `set-role`, `ban-user`,
`unban-user`, `remove-user`) refuse a user who is a member of any other
organization with `403 ADMIN_SHARED_USER`. Session routes and impersonation
still work for them. `adminSharedUsers: "allow"` lifts the refusal.

Roles are global too, and many apps read `user.role` as a platform-wide
permission, so `create-user` and `set-role` on a tenant's host cannot give out
one of the admin plugin's `adminRoles` (default `["admin"]`):
`403 ADMIN_ROLE_NOT_ASSIGNABLE`. Other roles work as before.
`adminRoleAssignment: "allow"` lifts the refusal.

`create-user` is not scoped otherwise: add the new user to the tenant's
organization yourself, and note that it answers `USER_ALREADY_EXISTS` for an
email registered on any tenant. Without `getOrganizationId` the plugin logs a
warning that admin routes are unscoped; `admin: false` turns the scoping and the
warning off.
