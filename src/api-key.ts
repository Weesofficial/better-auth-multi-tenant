import { APIError, createAuthMiddleware } from "better-auth/api";
import type { BetterAuthPlugin } from "better-auth";
import { getTenantFromContext } from "./context.js";
import { organizationMismatch } from "./teams.js";

/** The model `@better-auth/api-key` keeps its keys in. */
const MODEL = "apikey";

export const apiKeySchema = {
  apikey: {
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

/** The slice of Better Auth's adapter this file reads, writes and wraps. */
interface KeyAdapter {
  findOne: <T>(args: { model: string; where: Where; select?: string[] }) => Promise<T | null>;
  findMany: <T>(args: { model: string; where?: Where; [key: string]: unknown }) => Promise<T[]>;
  count: (args: { model: string; where?: Where }) => Promise<number>;
  update: <T>(args: { model: string; where: Where; update: Record<string, unknown> }) => Promise<T | null>;
}

const keyNotFound = () => new APIError("NOT_FOUND", { code: "KEY_NOT_FOUND", message: "API Key not found" });

const noDatabaseRow = () =>
  new APIError("INTERNAL_SERVER_ERROR", {
    code: "API_KEY_NOT_IN_DATABASE",
    message:
      "[better-auth-multi-tenant] apiKeys: true binds keys through their database row, and this key has none. " +
      'Keep keys in the database (api-key storage: "database", or "secondary-storage" with fallbackToDatabase: true).',
  });

/** Whether the database row of key `id` is stamped with `tenantId`. */
async function ownsKey(adapter: KeyAdapter, id: string, tenantId: string): Promise<boolean> {
  const row = await adapter.findOne<{ tenantId?: string | null }>({ model: MODEL, where: [{ field: "id", value: id }] });
  return row?.tenantId === tenantId;
}

/** Key routes whose lookups only see the tenant's keys on a tenant's host. */
const SCOPED_PATHS = new Set(["/api-key/get", "/api-key/list", "/api-key/update", "/api-key/delete"]);

/**
 * `verifyApiKey` is server-only: it has no path, so a hook cannot tell it apart
 * from other server-only endpoints. Every path-less call made with a tenant's
 * headers gets the same scoping, which only narrows `apikey` lookups. A matcher
 * sees such a call's path as `undefined`, and the handler as `"/"`.
 */
const pathless = (ctx: { path?: string }) => ctx.path === undefined;

/**
 * `@better-auth/api-key` keys belong to a user (or an organization), and users
 * are global, so a key made on one tenant works on every other. With
 * `apiKeys: true` a key is stamped with the tenant it was created on
 * (`apikey.tenantId`), and on a tenant's host:
 *
 * - key routes (`get`, `list`, `update`, `delete`, and `auth.api.verifyApiKey`
 *   called with the request's headers) only find the tenant's keys, so another
 *   tenant's key is "not found";
 * - creating or listing an organization's keys needs the tenant's organization
 *   (`ORGANIZATION_TENANT_MISMATCH`), with `getOrganizationId`.
 */
export const apiKeyHooks = (organizationScoped: boolean) => ({
  before: [
    {
      matcher: (ctx: { path?: string }) => pathless(ctx) || SCOPED_PATHS.has(ctx.path!) || ctx.path === "/api-key/create",
      handler: createAuthMiddleware(async (ctx) => {
        const resolved = getTenantFromContext(ctx.context);
        if (!resolved) return;

        if (organizationScoped && (ctx.path === "/api-key/create" || ctx.path === "/api-key/list")) {
          const source = (ctx.path === "/api-key/create" ? ctx.body : ctx.query) as { organizationId?: unknown } | undefined;
          const organizationId = source?.organizationId;
          if (organizationId !== undefined && organizationId !== resolved.organizationId) throw organizationMismatch();
        }
        if (ctx.path !== "/" && !SCOPED_PATHS.has(ctx.path)) return;

        if (ctx.path === "/api-key/update" || ctx.path === "/api-key/delete") {
          const keyId = (ctx.body as { keyId?: unknown } | undefined)?.keyId;
          if (typeof keyId === "string" && !(await ownsKey(ctx.context.adapter as unknown as KeyAdapter, keyId, resolved.tenant.id))) {
            throw keyNotFound();
          }
        }

        const adapter = ctx.context.adapter as unknown as KeyAdapter;
        const scope = (model: string, where: Where = []): Where =>
          model === MODEL ? [...where, { field: "tenantId", value: resolved.tenant.id }] : where;
        return {
          context: {
            context: {
              adapter: {
                findOne: (args: Parameters<KeyAdapter["findOne"]>[0]) => adapter.findOne({ ...args, where: scope(args.model, args.where) }),
                findMany: (args: Parameters<KeyAdapter["findMany"]>[0]) => adapter.findMany({ ...args, where: scope(args.model, args.where) }),
                count: (args: Parameters<KeyAdapter["count"]>[0]) => adapter.count({ ...args, where: scope(args.model, args.where) }),
              },
            },
          },
        };
      }),
    },
  ],
  after: [
    {
      matcher: (ctx: { path?: string }) => ctx.path === "/api-key/create",
      handler: createAuthMiddleware(async (ctx) => {
        const resolved = getTenantFromContext(ctx.context);
        const created = ctx.context.returned as { id?: unknown } | undefined;
        if (!resolved || !created || typeof created.id !== "string") return;
        const stamped = await (ctx.context.adapter as unknown as KeyAdapter).update({
          model: MODEL,
          where: [{ field: "id", value: created.id }],
          update: { tenantId: resolved.tenant.id },
        });
        // No row to stamp: the key lives only in secondary storage, where this
        // plugin cannot bind it. Fail loudly rather than hand out an unbound key.
        if (!stamped) throw noDatabaseRow();
      }),
    },
    {
      // The checks below read the database row, so they hold when the api-key
      // plugin reads keys from secondary storage too (`fallbackToDatabase`).
      matcher: (ctx: { path?: string }) => pathless(ctx) || ctx.path === "/api-key/get" || ctx.path === "/api-key/list",
      handler: createAuthMiddleware(async (ctx) => {
        const resolved = getTenantFromContext(ctx.context);
        const returned = ctx.context.returned as unknown;
        if (!resolved || !returned || typeof returned !== "object" || returned instanceof Response) return;
        const owned = (id: unknown) => typeof id === "string" && ownsKey(ctx.context.adapter as unknown as KeyAdapter, id, resolved.tenant.id);

        if (ctx.path === "/api-key/list") {
          const list = returned as { apiKeys?: { id?: unknown }[] } | { id?: unknown }[];
          const keys = Array.isArray(list) ? list : list.apiKeys;
          if (!Array.isArray(keys)) return;
          const mine = (await Promise.all(keys.map(async (k) => ((await owned(k.id)) ? k : null)))).filter(Boolean);
          if (mine.length === keys.length) return;
          return ctx.json(Array.isArray(list) ? mine : { ...list, apiKeys: mine, total: mine.length });
        }
        if (ctx.path === "/api-key/get") {
          if (!(await owned((returned as { id?: unknown }).id))) throw keyNotFound();
          return;
        }
        // verifyApiKey
        const result = returned as { valid?: boolean; key?: { id?: unknown } | null };
        if (result.valid !== true || (await owned(result.key?.id))) return;
        return ctx.json({ valid: false, error: { message: "Invalid API key.", code: "KEY_NOT_FOUND" }, key: null });
      }),
    },
  ],
});

type Hook = NonNullable<NonNullable<BetterAuthPlugin["hooks"]>["before"]>[number];

/**
 * With `enableSessionForAPIKeys`, the api-key plugin's before hook turns a key
 * into a session, without writing one, so nothing stamps it. Wrap that hook:
 * once it has validated the key, refuse a key of another tenant
 * (`CROSS_TENANT_SESSION`) or with no tenant (`UNBOUND_SESSION`, unless
 * `unboundSessions: "allow"`), and give the session the key's tenant so the
 * cross-tenant check sees it. Wrapping works whichever order the plugins are in.
 */
const WRAPPED = Symbol.for("better-auth-multi-tenant.apiKeySessions");

export function bindApiKeySessions(
  plugin: BetterAuthPlugin,
  unboundSessions: "reject" | "allow",
  resolveRequest: (input: { context: Record<string, unknown> }) => Promise<unknown>,
): void {
  const hooks = plugin.hooks?.before;
  const marked = plugin as BetterAuthPlugin & { [WRAPPED]?: true };
  if (!hooks || marked[WRAPPED]) return;
  marked[WRAPPED] = true;
  plugin.hooks!.before = hooks.map(
    (hook): Hook => ({
      matcher: hook.matcher,
      handler: (async (input: { context: Record<string, unknown> }) => {
        // This plugin may be listed before ours, so its hook can run first.
        await resolveRequest(input);
        const result = await (hook.handler as (input: unknown) => Promise<unknown>)(input);
        const resolved = getTenantFromContext(input.context);
        const session = input.context.session as { session?: { id?: string; tenantId?: string } } | null | undefined;
        if (!resolved || !session?.session?.id) return result;

        const adapter = input.context.adapter as unknown as KeyAdapter;
        const key = await adapter.findOne<{ tenantId?: string | null }>({
          model: MODEL,
          where: [{ field: "id", value: session.session.id }],
        });
        if (!key?.tenantId) {
          if (unboundSessions === "allow") return result;
          throw new APIError("FORBIDDEN", { code: "UNBOUND_SESSION", message: "This API key is not bound to a tenant" });
        }
        if (key.tenantId !== resolved.tenant.id) {
          throw new APIError("FORBIDDEN", { code: "CROSS_TENANT_SESSION", message: "This API key belongs to a different tenant" });
        }
        session.session.tenantId = key.tenantId;
        return result;
      }) as unknown as Hook["handler"],
    }),
  );
}
