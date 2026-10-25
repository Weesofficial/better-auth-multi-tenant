import type { BetterAuthPlugin } from "better-auth";

type Session = { session: Record<string, unknown>; user: Record<string, unknown> };
type JwtOptions = { jwt?: { definePayload?: (session: Session) => Record<string, unknown> | Promise<Record<string, unknown>> } };

const WRAPPED = Symbol.for("better-auth-multi-tenant.jwtClaim");

/**
 * The `jwt` plugin signs the session's user, and its `iss` and `aud` are the one
 * `baseURL`, so a token minted on one tenant cannot be told from one minted on
 * another: a service that verifies it against the JWKS accepts it for any tenant.
 * Add the session's tenant as a claim, on top of the app's own `definePayload`.
 *
 * The plugin reads its options from the object passed to `jwt()`, so this only
 * works when there is one. Returns `false` for `jwt()` called without options.
 */
export function addJwtTenantClaim(
  plugin: BetterAuthPlugin,
  claim: string,
  getSessionTenantId: (session: unknown) => string | null | undefined,
): boolean {
  const options = (plugin as { options?: JwtOptions }).options;
  if (!options || typeof options !== "object") return false;
  const marked = options as JwtOptions & { [WRAPPED]?: true };
  if (marked[WRAPPED]) return true;
  marked[WRAPPED] = true;
  const define = options.jwt?.definePayload;
  options.jwt = {
    ...options.jwt,
    definePayload: async (session) => {
      const payload = define ? await define(session) : session.user;
      const tenantId = getSessionTenantId(session);
      return tenantId ? { ...payload, [claim]: tenantId } : payload;
    },
  };
  return true;
}
