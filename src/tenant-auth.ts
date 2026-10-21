import { betterAuth, type Auth, type BetterAuthOptions, type BetterAuthPlugin } from "better-auth";
import { isAPIError } from "better-auth/api";
import type { Tenant } from "./context.js";
import { multiTenant, type MultiTenantOptions } from "./index.js";
import { tenantSessionHooks } from "./session-hooks.js";
import { resolveTenant } from "./tenant.js";

export interface TenantAuthOptions extends Omit<MultiTenantOptions, "requireTenant"> {
  /**
   * Build the Better Auth options for a tenant, typically with that tenant's
   * own `database`. Called once per tenant while its instance stays cached.
   * The `multiTenant` plugin and session stamping are added for you; do not add
   * them again.
   */
  createAuth: (tenant: Tenant) => BetterAuthOptions;
  /**
   * Most instances kept at once. The least recently used one is evicted when
   * the cache is full. Unbounded by default.
   */
  maxSize?: number;
  /**
   * Called when an instance leaves the cache (evicted for size, or dropped
   * with {@link TenantAuth.evict}), so you can close its database connection. Requests already running on that instance are not
   * waited for.
   */
  onEvict?: (tenant: Tenant, auth: Auth) => void | Promise<void>;
}

export interface TenantAuth {
  /** Serve a request with the resolved tenant's instance. Mount it where you would mount `auth.handler`. */
  handler: (request: Request) => Promise<Response>;
  /**
   * The resolved tenant's instance, for `auth.api.*` calls in your own code.
   * Throws the same `APIError` the handler turns into a response.
   */
  getAuth: (headers: Headers) => Promise<Auth>;
  /** Drop one tenant's cached instance (after its database moved, say), or all of them. */
  evict: (tenantId?: string) => Promise<void>;
}

/**
 * Database-per-tenant: one Better Auth instance per tenant, created on first
 * use and cached. Better Auth binds a single database to an instance, so the
 * tenant is resolved from the request host (the same way the `multiTenant`
 * plugin does) before an instance is picked.
 *
 * Unknown tenants, inactive tenants and hosts that name no tenant are refused
 * with the plugin's 404 / 403 / 400, without creating an instance.
 *
 * @example
 * ```ts
 * export const tenantAuth = createTenantAuth({
 *   baseDomain: "example.com",
 *   getTenant: (slug) => registry.tenant.findUnique({ where: { slug } }),
 *   createAuth: (tenant) => ({
 *     secret: process.env.BETTER_AUTH_SECRET,
 *     database: new Pool({ connectionString: urlFor(tenant) }),
 *     emailAndPassword: { enabled: true },
 *   }),
 *   maxSize: 100,
 *   onEvict: (_tenant, auth) => auth.$context.then((c) => c.options.database.end?.()),
 * });
 * ```
 */
export function createTenantAuth(options: TenantAuthOptions): TenantAuth {
  const { createAuth, maxSize, onEvict, ...pluginOptions } = options;
  if (maxSize !== undefined && !(Number.isInteger(maxSize) && maxSize >= 1)) {
    throw new RangeError("createTenantAuth: maxSize must be a positive integer");
  }

  // Keyed by tenant id; Map order is recency order (oldest first).
  const cache = new Map<string, { tenant: Tenant; auth: Auth }>();

  const drop = async (id: string) => {
    const entry = cache.get(id);
    if (!entry) return;
    cache.delete(id);
    await onEvict?.(entry.tenant, entry.auth);
  };

  const build = (tenant: Tenant) => {
    const entry = { tenant, auth: undefined as unknown as Auth };
    const userOptions = createAuth(tenant);
    const options: BetterAuthOptions = {
      ...userOptions,
      plugins: [
        // Binds this instance to its tenant, so a session or token copied to
        // another host is still refused, whatever the database holds.
        multiTenant({
          ...pluginOptions,
          // The tenant is already resolved, and the instance serves only it.
          // Reading `entry.tenant` keeps a renamed slug working without a rebuild.
          getTenant: (slug) => (slug === entry.tenant.slug ? entry.tenant : null),
          getTenantByDomain: pluginOptions.getTenantByDomain
            ? async (domain) => {
                const found = await pluginOptions.getTenantByDomain!(domain);
                return found?.id === entry.tenant.id ? found : null;
              }
            : undefined,
        }),
        { id: "multi-tenant-session", init: () => ({ options: { databaseHooks: tenantSessionHooks() } }) } satisfies BetterAuthPlugin,
        ...(userOptions.plugins ?? []),
      ],
    };
    entry.auth = betterAuth(options);
    return entry;
  };

  const getAuth = async (headers: Headers) => {
    const resolved = await resolveTenant(pluginOptions, headers, false);
    const { tenant } = resolved!; // `optional: false` never returns null.

    let entry = cache.get(tenant.id);
    if (entry) {
      cache.delete(tenant.id); // Re-insert below: most recently used goes last.
      entry.tenant = tenant;
    } else {
      entry = build(tenant);
    }
    cache.set(tenant.id, entry);

    while (maxSize !== undefined && cache.size > maxSize) {
      await drop(cache.keys().next().value!);
    }
    return entry.auth;
  };

  return {
    getAuth,
    async handler(request) {
      let auth: Auth;
      try {
        auth = await getAuth(request.headers);
      } catch (error) {
        if (!isAPIError(error)) throw error;
        return Response.json(error.body, { status: error.statusCode, headers: error.headers });
      }
      return auth.handler(request);
    },
    async evict(tenantId) {
      for (const id of tenantId === undefined ? [...cache.keys()] : [tenantId]) await drop(id);
    },
  };
}
