import { APIError, createAuthMiddleware, getSessionFromCtx } from "better-auth/api";
import { getTenantFromContext, type Tenant } from "./context.js";
import { ERROR_CODES } from "./error-codes.js";

/**
 * A way of signing in. `social` allows every social and generic OAuth provider;
 * `social:<id>` allows one (`social:google`).
 */
export type TenantAuthMethod =
  | "email-password"
  | "username"
  | "phone-number"
  | "magic-link"
  | "email-otp"
  | "passkey"
  | "sso"
  | "siwe"
  | "anonymous"
  | "social"
  | `social:${string}`;

/** What a tenant allows. Anything left out is not restricted. */
export interface TenantPolicy {
  /** Sign-in methods the tenant allows. Leave out to allow every method. */
  methods?: TenantAuthMethod[];
  /** `false` refuses creating new users on the tenant, by any method. */
  signUp?: boolean;
  /**
   * Users must have two-factor authentication (the `twoFactor` plugin) turned
   * on. Until they do, `get-session` answers with no session and other auth
   * routes are refused, except two-factor enrolment and sign-out.
   */
  requireTwoFactor?: boolean;
}

export type GetTenantPolicy = (tenant: Tenant) => TenantPolicy | null | undefined | Promise<TenantPolicy | null | undefined>;

const POLICY = Symbol.for("better-auth-multi-tenant.policy");

/** The requesting tenant's policy, looked up once per request. `null` without a tenant. */
export async function policyFor(context: unknown, getPolicy: GetTenantPolicy): Promise<TenantPolicy | null> {
  const resolved = getTenantFromContext(context);
  if (!resolved) return null;
  const cache = context as Record<symbol, TenantPolicy | undefined>;
  return (cache[POLICY] ??= (await getPolicy(resolved.tenant)) ?? {});
}

/** The public part of a policy, for `/multi-tenant/current`. */
export function publicPolicy(policy: TenantPolicy): TenantPolicy {
  const { methods, signUp, requireTwoFactor } = policy;
  return {
    ...(methods ? { methods } : {}),
    ...(signUp !== undefined ? { signUp } : {}),
    ...(requireTwoFactor !== undefined ? { requireTwoFactor } : {}),
  };
}

const lastSegment = (path: string) => path.split("/").pop() ?? "";

/** Which sign-in method a route belongs to, or `null` for routes that are not one. */
function methodOf(ctx: { path?: string; params?: Record<string, string | undefined>; body?: unknown }): TenantAuthMethod | null {
  const path = ctx.path ?? "";
  const body = (ctx.body ?? {}) as { provider?: unknown; providerId?: unknown; type?: unknown };
  const provider = (value: unknown) => (typeof value === "string" && value ? `social:${value}` : "social") as TenantAuthMethod;

  if (path === "/sign-in/email" || path === "/sign-up/email") return "email-password";
  if (path === "/sign-in/username") return "username";
  if (path === "/sign-in/phone-number" || path === "/phone-number/verify") return "phone-number";
  if (path === "/sign-in/magic-link" || path === "/magic-link/verify") return "magic-link";
  if (path === "/sign-in/email-otp") return "email-otp";
  if (path === "/email-otp/send-verification-otp" && body.type === "sign-in") return "email-otp";
  if (path === "/passkey/generate-authenticate-options" || path === "/passkey/verify-authentication") return "passkey";
  if (path === "/sign-in/sso" || path.startsWith("/sso/callback") || path.startsWith("/sso/saml2/")) return "sso";
  if (path.startsWith("/siwe/")) return "siwe";
  if (path === "/sign-in/anonymous") return "anonymous";
  if (path === "/sign-in/social") return provider(body.provider);
  if (path === "/sign-in/oauth2") return provider(body.providerId);
  if (path === "/one-tap/callback") return "social:google";
  // Deprecated oAuthProxy hand-off: the provider is only known after decrypting.
  if (path === "/oauth-proxy-callback") return "social";
  if (path.startsWith("/callback/") || path.startsWith("/oauth2/callback/")) return provider(ctx.params?.id ?? lastSegment(path));
  return null;
}

const allows = (policy: TenantPolicy, method: TenantAuthMethod) =>
  !policy.methods ||
  policy.methods.includes(method) ||
  (method.startsWith("social:") && policy.methods.includes("social"));

// Routes a user who still has to turn on two-factor authentication may use.
const ENROLMENT = (path: string) =>
  path.startsWith("/two-factor/") || path === "/sign-out" || path === "/get-session" || path === "/multi-tenant/current";

const twoFactorMissing = (user: unknown) => (user as { twoFactorEnabled?: boolean } | undefined)?.twoFactorEnabled !== true;

/**
 * Before hook: refuse a sign-in method the tenant does not allow, sign-up when
 * it is off, and anything but enrolment for a user who still needs 2FA.
 */
export const policyBeforeHook = (getPolicy: GetTenantPolicy) => ({
  matcher: () => true,
  handler: createAuthMiddleware(async (ctx) => {
    const policy = await policyFor(ctx.context, getPolicy);
    if (!policy) return;

    const method = methodOf(ctx);
    if (method && !allows(policy, method)) throw new APIError("FORBIDDEN", ERROR_CODES.AUTH_METHOD_NOT_ALLOWED);
    if (ctx.path === "/sign-up/email" && policy.signUp === false) throw new APIError("FORBIDDEN", ERROR_CODES.SIGN_UP_DISABLED);

    if (policy.requireTwoFactor && !ENROLMENT(ctx.path ?? "")) {
      const session = await getSessionFromCtx(ctx).catch(() => null);
      if (session && twoFactorMissing(session.user)) throw new APIError("FORBIDDEN", ERROR_CODES.TWO_FACTOR_REQUIRED);
    }
  }),
});

/** After hook: `get-session` reports no session until a required 2FA is on. */
export const policySessionHook = (getPolicy: GetTenantPolicy) => ({
  matcher: (ctx: { path?: string }) => ctx.path === "/get-session",
  handler: createAuthMiddleware(async (ctx) => {
    const returned = ctx.context.returned as { user?: unknown } | null | undefined;
    if (!returned || typeof returned !== "object" || !("user" in returned)) return;
    const policy = await policyFor(ctx.context, getPolicy);
    if (policy?.requireTwoFactor && twoFactorMissing(returned.user)) return ctx.json(null);
  }),
});

/** `user.create.before` database hook: no new users on a tenant with sign-up off. */
export const policyUserCreateHook =
  (getPolicy: GetTenantPolicy) =>
  async (_user: unknown, hookCtx: { context?: unknown } | null): Promise<void> => {
    const policy = await policyFor(hookCtx?.context, getPolicy);
    if (policy?.signUp === false) throw new APIError("FORBIDDEN", ERROR_CODES.SIGN_UP_DISABLED);
  };
