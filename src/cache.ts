import type { Tenant } from "./context.js";

export interface TenantCacheOptions {
  /** How long a looked-up tenant is reused, in milliseconds. A positive number. */
  ttl: number;
  /** Most entries kept; the least recently used is dropped beyond it. Defaults to 1000. */
  maxSize?: number;
  /**
   * Also remember a lookup that found no tenant, for `ttl`. Off by default, so a
   * tenant you create is served on its next request; turn it on if unknown
   * hosts are hammering your database.
   */
  cacheMisses?: boolean;
}

/** A tenant lookup with a cache in front of it. */
export interface CachedTenantLookup {
  (key: string): Promise<Tenant | null>;
  /**
   * Forget cached entries: the one for a slug or domain, or every entry of a
   * tenant id, or everything when called without an argument. Call it after you
   * suspend, delete or rename a tenant, so the change applies before `ttl` runs out.
   */
  invalidate: (keyOrTenantId?: string) => void;
}

/**
 * Put an in-memory cache in front of `getTenant` or `getTenantByDomain`, so a
 * request does not cost a database query just to resolve its tenant.
 *
 * The cache lives in this process (or isolate), uses no Node built-ins, and
 * shares one lookup between concurrent requests for the same key. A tenant you
 * change stays as it was for up to `ttl` unless you call `invalidate`.
 *
 * @example
 * ```ts
 * const getTenant = cacheTenantLookup((slug) => db.tenant.findUnique({ where: { slug } }), { ttl: 60_000 });
 * multiTenant({ baseDomain: "example.com", getTenant });
 * // after suspending a tenant:
 * getTenant.invalidate(tenant.id);
 * ```
 */
export function cacheTenantLookup(
  lookup: (key: string) => Promise<Tenant | null> | Tenant | null,
  options: TenantCacheOptions,
): CachedTenantLookup {
  const { ttl, maxSize = 1000, cacheMisses = false } = options;
  if (!(typeof ttl === "number" && ttl > 0 && Number.isFinite(ttl))) {
    throw new RangeError("cacheTenantLookup: ttl must be a positive number of milliseconds");
  }
  if (!(Number.isInteger(maxSize) && maxSize >= 1)) {
    throw new RangeError("cacheTenantLookup: maxSize must be a positive integer");
  }

  // Map order is recency order (oldest first).
  const entries = new Map<string, { tenant: Tenant | null; expires: number }>();
  const pending = new Map<string, Promise<Tenant | null>>();
  // Bumped by invalidate, so a lookup that started before it does not store a stale result.
  let generation = 0;

  const cached = (async (key: string) => {
    const hit = entries.get(key);
    if (hit) {
      entries.delete(key);
      if (hit.expires > Date.now()) {
        entries.set(key, hit);
        return hit.tenant;
      }
    }

    const running = pending.get(key);
    if (running) return running;

    const started = generation;
    const promise: Promise<Tenant | null> = (async () => {
      const tenant = (await lookup(key)) ?? null;
      if ((tenant || cacheMisses) && started === generation) {
        entries.set(key, { tenant, expires: Date.now() + ttl });
        while (entries.size > maxSize) entries.delete(entries.keys().next().value!);
      }
      return tenant;
    })().finally(() => {
      if (pending.get(key) === promise) pending.delete(key);
    });
    pending.set(key, promise);
    return promise;
  }) as CachedTenantLookup;

  cached.invalidate = (keyOrTenantId) => {
    generation++;
    pending.clear();
    if (keyOrTenantId === undefined) {
      entries.clear();
      return;
    }
    for (const [key, entry] of entries) {
      if (key === keyOrTenantId || entry.tenant?.id === keyOrTenantId) entries.delete(key);
    }
  };

  return cached;
}
