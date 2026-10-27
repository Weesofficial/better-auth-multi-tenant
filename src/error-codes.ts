/**
 * Plain data, shared by the server plugin and the client helpers so neither
 * pulls the other's dependencies in.
 */
export const ERROR_CODES = {
  TENANT_REQUIRED: {
    code: "TENANT_REQUIRED",
    message: "This request must name a tenant",
  },
  TENANT_NOT_FOUND: { code: "TENANT_NOT_FOUND", message: "Unknown tenant" },
  TENANT_INACTIVE: { code: "TENANT_INACTIVE", message: "This tenant is not active" },
  INVALID_FORWARDED_HOST: {
    code: "INVALID_FORWARDED_HOST",
    message: "The forwarded host of this request is malformed",
  },
  CROSS_TENANT_SESSION: {
    code: "CROSS_TENANT_SESSION",
    message: "This session belongs to a different tenant",
  },
  UNBOUND_SESSION: {
    code: "UNBOUND_SESSION",
    message: "This session is not bound to a tenant",
  },
  TENANT_ACCESS_DENIED: {
    code: "TENANT_ACCESS_DENIED",
    message: "This user cannot access this tenant",
  },
  ORGANIZATION_TENANT_MISMATCH: {
    code: "ORGANIZATION_TENANT_MISMATCH",
    message: "Only this tenant's organization can be active here",
  },
  TEAM_TENANT_MISMATCH: {
    code: "TEAM_TENANT_MISMATCH",
    message: "This team belongs to a different tenant's organization",
  },
  VERIFICATION_TENANT_MISMATCH: {
    code: "VERIFICATION_TENANT_MISMATCH",
    message: "This code or token was issued on a different tenant",
  },
  ADMIN_TENANT_MISMATCH: {
    code: "ADMIN_TENANT_MISMATCH",
    message: "This user is not a member of this tenant",
  },
  ADMIN_NOT_TENANT_ADMIN: {
    code: "ADMIN_NOT_TENANT_ADMIN",
    message: "You are not an administrator of this tenant",
  },
  ADMIN_SHARED_USER: {
    code: "ADMIN_SHARED_USER",
    message: "This user is also a member of another tenant, so this change cannot be made from here",
  },
  ADMIN_ROLE_NOT_ASSIGNABLE: {
    code: "ADMIN_ROLE_NOT_ASSIGNABLE",
    message: "Admin roles are global and cannot be given out from a tenant",
  },
  CROSS_TENANT_ORIGIN: {
    code: "CROSS_TENANT_ORIGIN",
    message: "This request came from a different origin than the tenant's",
  },
  SSO_PROVIDER_TENANT_MISMATCH: {
    code: "SSO_PROVIDER_TENANT_MISMATCH",
    message: "This SSO provider does not belong to this tenant",
  },
} as const;

export type TenantErrorCode = keyof typeof ERROR_CODES;
