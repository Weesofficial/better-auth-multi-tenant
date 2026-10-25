import { createAuthMiddleware } from "better-auth/api";
import { getTenantFromContext } from "./context.js";

/** The model Better Auth's `deviceAuthorization` plugin keeps its codes in. */
const MODEL = "deviceCode";

export const deviceCodeSchema = {
  deviceCode: {
    fields: {
      tenantId: {
        type: "string",
        required: false,
        // Never accepted from the client: the tenant comes from the request.
        input: false,
      },
    },
  },
} as const;

type Where = { field: string; value: unknown; operator?: string; connector?: string }[];

/** The slice of Better Auth's adapter the device routes call and this file wraps. */
interface CodeAdapter {
  create: <T>(args: { model: string; data: Record<string, unknown>; [key: string]: unknown }) => Promise<T>;
  findOne: <T>(args: { model: string; where: Where; [key: string]: unknown }) => Promise<T | null>;
  findMany: <T>(args: { model: string; where?: Where; [key: string]: unknown }) => Promise<T[]>;
}

/** Device routes that look a code up; on a tenant's host they only find that tenant's codes. */
const LOOKUP_PATHS = new Set(["/device/token", "/device", "/device/approve", "/device/deny"]);

/**
 * Better Auth's `deviceAuthorization` plugin keeps its codes in their own
 * `deviceCode` table, not as verification rows, so the verification binding
 * does not reach them. Without this, a code a user approved on one tenant is
 * redeemed for a session on another. With `deviceCodes: true` a code is stamped
 * with the tenant that issued it (`deviceCode.tenantId`), and on a tenant's host
 * `/device/token`, `/device`, `/device/approve` and `/device/deny` only find the
 * tenant's codes, so another tenant's code is an invalid code.
 */
export const deviceCodeHook = {
  matcher: (ctx: { path?: string }) => ctx.path === "/device/code" || LOOKUP_PATHS.has(ctx.path ?? ""),
  handler: createAuthMiddleware(async (ctx) => {
    const resolved = getTenantFromContext(ctx.context);
    if (!resolved) return;
    const tenantId = resolved.tenant.id;
    const adapter = ctx.context.adapter as unknown as CodeAdapter;
    const scope = (model: string, where: Where = []): Where =>
      model === MODEL ? [...where, { field: "tenantId", value: tenantId }] : where;
    return {
      context: {
        context: {
          adapter:
            ctx.path === "/device/code"
              ? {
                  create: (args: Parameters<CodeAdapter["create"]>[0]) =>
                    adapter.create(args.model === MODEL ? { ...args, data: { ...args.data, tenantId } } : args),
                }
              : {
                  findOne: (args: Parameters<CodeAdapter["findOne"]>[0]) => adapter.findOne({ ...args, where: scope(args.model, args.where) }),
                  findMany: (args: Parameters<CodeAdapter["findMany"]>[0]) => adapter.findMany({ ...args, where: scope(args.model, args.where) }),
                },
        },
      },
    };
  }),
};
