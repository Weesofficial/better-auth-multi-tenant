import { APIError } from "better-auth/api";
import { getTenantFromContext } from "./context.js";
import { ERROR_CODES } from "./error-codes.js";

/**
 * Tenant-scoped identity (`identity: "tenant"`): the same email on two tenants
 * is two users. Every `user` and `account` query the database adapter runs is
 * limited to the requesting tenant, and every row created is stamped with it.
 *
 * The adapter has no request, so the tenant comes from Better Auth's endpoint
 * context (an AsyncLocalStorage that holds the request's auth context). A user
 * or account query with no tenant there is refused rather than run unscoped.
 */

type Where = { field: string; value: unknown; operator?: string; connector?: "AND" | "OR" };
type Args = { model: string; where?: Where[]; data?: Record<string, unknown>; [key: string]: unknown };
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Better Auth's DBAdapter differs between 1.6 and 1.7
type Adapter = Record<string, any>;

const SCOPED = new Set(["user", "account"]);
const QUERIES = new Set(["findOne", "findMany", "count", "update", "updateMany", "delete", "deleteMany"]);

type Store = { getStore(): { context?: unknown } | undefined };
let storage: Promise<Store> | undefined;

/** The requesting tenant's id, or `null` outside a request with a tenant. */
async function currentTenantId(): Promise<string | null> {
  storage ??= import("@better-auth/core/context").then((m) => m.getCurrentAuthContextAsyncLocalStorage() as Promise<Store>);
  const store = (await storage).getStore();
  return getTenantFromContext(store?.context)?.tenant.id ?? null;
}

/**
 * Wrap a Better Auth database adapter so `user` and `account` (and, with
 * `verification`, `verification`) rows belong to the requesting tenant.
 * Verification rows are filtered only when there is a tenant: expired-row
 * cleanup and the OAuth proxy host run without one.
 */
export function tenantScopedAdapter(base: Adapter, { verification }: { verification: boolean }): Adapter {
  const scoped = (model: string) => SCOPED.has(model) || (verification && model === "verification");

  const wrap = (adapter: Adapter): Adapter =>
    new Proxy(adapter, {
      get(target, prop, receiver) {
        const value = Reflect.get(target, prop, receiver);
        if (typeof value !== "function") return value;
        if (prop === "transaction") {
          return (callback: (trx: Adapter) => unknown) => value.call(target, (trx: Adapter) => callback(wrap(trx)));
        }
        if (prop !== "create" && !QUERIES.has(prop as string)) return value.bind(target);
        return async (args: Args, ...rest: unknown[]) => {
          if (!args || !scoped(args.model)) return value.call(target, args, ...rest);
          const tenantId = await currentTenantId();
          if (!tenantId) {
            if (args.model === "verification") return value.call(target, args, ...rest);
            throw new APIError("BAD_REQUEST", ERROR_CODES.TENANT_REQUIRED);
          }
          const next: Args =
            prop === "create"
              ? { ...args, data: { ...args.data, tenantId } }
              : { ...args, where: [...(args.where ?? []), { field: "tenantId", value: tenantId, operator: "eq", connector: "AND" }] };
          return value.call(target, next, ...rest);
        };
      },
    });

  return wrap(base);
}

const tenantIdField = {
  type: "string",
  required: false,
  // Never accepted from the client: the tenant comes from the host.
  input: false,
  index: true,
} as const;

/**
 * `user.tenantId` and `account.tenantId`. Better Auth's core schema keeps
 * `user.email` globally unique and a plugin cannot redefine a core field, so
 * replacing that index with a unique `(tenantId, email)` is left to a migration.
 */
export const identitySchema = {
  user: { fields: { tenantId: tenantIdField } },
  account: { fields: { tenantId: tenantIdField } },
};
