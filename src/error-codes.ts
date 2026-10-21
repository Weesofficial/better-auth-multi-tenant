/**
 * Plain data, shared by the server plugin and the client helpers so neither
 * pulls the other's dependencies in.
 */
export const ERROR_CODES = {
  TENANT_REQUIRED: {
    code: "TENANT_REQUIRED",
    message: "This request must be made on a tenant subdomain",
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
  ORGANIZATION_TENANT_MISMATCH: {
    code: "ORGANIZATION_TENANT_MISMATCH",
    message: "Only this tenant's organization can be active here",
  },
} as const;

export type TenantErrorCode = keyof typeof ERROR_CODES;
