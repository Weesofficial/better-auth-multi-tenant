import { APIError, createAuthMiddleware } from "better-auth/api";
import { getTenantFromContext } from "./context.js";
import { scopedHeaders, setScopedHeaders, withoutCookies } from "./foreign-session.js";

/** `verification` columns the plugin adds when verification rows are bound to tenants. */
export const verificationSchema = {
  verification: {
    fields: {
      tenantId: {
        type: "string",
        required: false,
        // Never accepted from the client: the tenant comes from the host.
        input: false,
      },
    },
  },
} as const;

/**
 * `verification` database hooks. Every row a plugin writes (magic-link token,
 * email and phone OTP, two-factor challenge and trusted-device record, passkey
 * challenge, SIWE nonce, OAuth state) is stamped with the tenant of the request
 * that wrote it, and consuming or deleting a live row from another tenant's host
 * is refused with `403 VERIFICATION_TENANT_MISMATCH`.
 *
 * Better Auth runs `delete.before` for `consumeVerificationValue` and
 * `deleteVerificationByIdentifier`, which is where every plugin redeems a row. A
 * hook that returns `false` there only makes the plugin's delete a no-op, and
 * some flows go on to act, so the hook throws instead. Expired rows are exempt,
 * so Better Auth's cleanup of them keeps working from any host.
 */
export const verificationBindingHooks = () => ({
  verification: {
    create: {
      before: async (_row: Record<string, unknown>, hookCtx: { context?: unknown } | null) => {
        const resolved = getTenantFromContext(hookCtx?.context);
        return resolved ? { data: { tenantId: resolved.tenant.id } } : undefined;
      },
    },
    delete: {
      before: async (row: Record<string, unknown>, hookCtx: { context?: unknown } | null): Promise<void> => {
        if (row.expiresAt && new Date(row.expiresAt as Date).getTime() <= Date.now()) return;
        // A row with no stamp (written before the column existed, or on a request
        // without a tenant) fails closed on a tenant's host, like an unbound session.
        const resolved = getTenantFromContext(hookCtx?.context);
        if (resolved ? row.tenantId === resolved.tenant.id : !row.tenantId) return;
        throw new APIError("FORBIDDEN", {
          code: "VERIFICATION_TENANT_MISMATCH",
          message: "This code or token was issued on a different tenant",
        });
      },
    },
  },
});

// The two-factor plugin's trusted-device cookie, on the sign-in routes it guards.
const TRUST_DEVICE_COOKIE = "trust_device";
const TRUST_DEVICE_PATHS = new Set(["/sign-in/email", "/sign-in/username", "/sign-in/phone-number"]);

/**
 * A trusted-device cookie skips the two-factor challenge on the sign-in route
 * that reads it, and the session cookie is already set by then, so a refusal
 * there would leave a session without the second factor. Drop a cookie whose
 * record belongs to another tenant before the route sees it: the sign-in then
 * meets the normal challenge.
 */
export const trustDeviceHook = {
  matcher: (ctx: { path?: string }) => TRUST_DEVICE_PATHS.has(ctx.path ?? ""),
  handler: createAuthMiddleware(async (ctx) => {
    const resolved = getTenantFromContext(ctx.context);
    const cookie = ctx.context.createAuthCookie(TRUST_DEVICE_COOKIE).name;
    // `token!identifier`, signed by the plugin; only the identifier is read.
    const signed = await ctx.getSignedCookie(cookie, ctx.context.secret);
    const identifier = signed ? signed.split("!")[1] : undefined;
    if (!resolved || !identifier) return;
    const row = (await ctx.context.internalAdapter.findVerificationValue(identifier)) as { tenantId?: string } | null;
    if (!row || row.tenantId === resolved.tenant.id) return;

    const headers = withoutCookies(scopedHeaders(ctx), [cookie]);
    setScopedHeaders(ctx.context, headers);
    return { context: { headers } };
  }),
};
