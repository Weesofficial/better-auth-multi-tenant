/** The options `teams`, `admin` and `sso` default from, and conflict with. */
interface ScopingOptions {
  getOrganizationId?: unknown;
  getSSODomains?: unknown;
  teams?: boolean;
  admin?: boolean;
  sso?: boolean;
  ssoRequireTenantMapping?: boolean;
}

/**
 * Whether team, admin and SSO scoping are on: an explicit `teams` / `admin` / `sso` wins, else
 * they follow the mapping options. Throws on a toggle that cannot work, so a
 * misconfiguration fails at startup instead of leaving a tenant unscoped.
 */
export function resolveScoping(options: ScopingOptions) {
  const { getOrganizationId, getSSODomains, teams, admin, sso, ssoRequireTenantMapping } = options;
  const hasSSOMapping = Boolean(getOrganizationId || getSSODomains);
  if (teams && !getOrganizationId) {
    throw new Error("[better-auth-multi-tenant] teams: true needs getOrganizationId, which tells which organization a tenant's teams belong to.");
  }
  if (admin && !getOrganizationId) {
    throw new Error("[better-auth-multi-tenant] admin: true needs getOrganizationId, which tells which users are a tenant's members.");
  }
  if (sso && !hasSSOMapping) {
    throw new Error("[better-auth-multi-tenant] sso: true needs getOrganizationId or getSSODomains, which tell which SSO providers a tenant owns.");
  }
  if (sso === false && ssoRequireTenantMapping) {
    throw new Error("[better-auth-multi-tenant] sso: false turns SSO scoping off, which contradicts ssoRequireTenantMapping: true. Drop one of them.");
  }
  return {
    hasSSOMapping,
    teamsScoped: teams ?? Boolean(getOrganizationId),
    adminScoped: admin ?? Boolean(getOrganizationId),
    ssoScoped: sso ?? hasSSOMapping,
  };
}
