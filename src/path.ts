/**
 * Path-based tenancy: `example.com/api/auth/t/acme/sign-in/email` is the
 * `/sign-in/email` route for tenant `acme`.
 *
 * The prefix is taken off before Better Auth sees the request, so rate limits,
 * `disabledPaths` and every route match exactly as they do without tenants. The
 * slug is handed to the plugin through a `WeakMap` keyed by the rewritten
 * `Request` object, never through a header: a client can send any header, but
 * cannot get a slug into this map except by addressing the prefixed path.
 */

const pathTenants = new WeakMap<Request, string>();

/** The tenant slug a rewritten request was addressed to, if any. */
export function getPathTenant(request: Request | undefined): string | undefined {
  return request ? pathTenants.get(request) : undefined;
}

/**
 * Mark `request` as addressed to `slug`, for `auth.api` calls made in path
 * mode from your own server code (a page at `/acme/dashboard` reading the
 * session, say). Returns the same request.
 *
 * @example
 * ```ts
 * const session = await auth.api.getSession({
 *   headers: request.headers,
 *   request: tenantPathRequest(request, params.tenant),
 *   asResponse: false, // passing a request makes auth.api answer with a Response otherwise
 * });
 * ```
 */
export function tenantPathRequest(request: Request, slug: string): Request {
  pathTenants.set(request, slug);
  return request;
}

/** Throw on a `pathPrefix` that cannot be matched unambiguously. */
export function assertPathPrefix(prefix: string): void {
  if (!/^(?:\/[A-Za-z0-9._~-]+)+$/.test(prefix)) {
    throw new RangeError(
      `[better-auth-multi-tenant] pathPrefix must look like "/t": one or more path segments, starting with "/" and not ending with one (got ${JSON.stringify(prefix)}).`,
    );
  }
}

export const DEFAULT_BASE_PATH = "/api/auth";

/** `value` without trailing slashes. A loop rather than `/\/+$/`, which backtracks on long runs of `/`. */
export function trimTrailingSlashes(value: string): string {
  let end = value.length;
  while (end > 0 && value[end - 1] === "/") end--;
  return value.slice(0, end);
}

/**
 * Split `<basePath><prefix>/<slug>/<route>` into the slug and the URL Better
 * Auth should see (`<basePath>/<route>`). `null` for any other path, including
 * one that names a slug but no route.
 */
export function splitTenantPath(url: string, basePath: string, prefix: string): { slug: string; url: string } | null {
  const parsed = new URL(url);
  const base = trimTrailingSlashes(basePath);
  const head = `${base}${prefix}/`;
  if (!parsed.pathname.startsWith(head)) return null;
  const rest = parsed.pathname.slice(head.length);
  const slash = rest.indexOf("/");
  if (slash <= 0 || slash === rest.length - 1) return null;
  let slug: string;
  try {
    slug = decodeURIComponent(rest.slice(0, slash));
  } catch {
    return null;
  }
  parsed.pathname = `${base}${rest.slice(slash)}`;
  return { slug, url: parsed.toString() };
}

/** A copy of `request` addressed to `url`, with its body. */
export function readdress(request: Request, url: string): Request {
  return new Request(url, {
    method: request.method,
    headers: request.headers,
    body: request.body,
    redirect: request.redirect,
    signal: request.signal,
    // Required by Node when a request is built from a stream.
    ...(request.body ? { duplex: "half" } : {}),
  } as RequestInit);
}

/** The parts of a Better Auth instance {@link withTenantPaths} needs. */
interface AuthLike {
  handler: (request: Request) => Promise<Response>;
  options: { basePath?: string; plugins?: { id: string; options?: unknown }[] };
}

/**
 * Serve path-based tenants (`pathPrefix`) from a Better Auth instance. Returns
 * the same instance with a `handler` that takes `<basePath><pathPrefix>/<slug>`
 * off the URL and remembers the slug for the `multiTenant` plugin. Mount or
 * pass the returned object wherever you used `auth`, including framework
 * helpers such as `toNodeHandler(auth)`.
 *
 * A request without the prefix passes through unchanged and has no tenant.
 *
 * @example
 * ```ts
 * export const auth = withTenantPaths(
 *   betterAuth({ plugins: [multiTenant({ pathPrefix: "/t", getTenant, canAccessTenant })] }),
 * );
 * // The client for tenant "acme":
 * createAuthClient({ baseURL: "https://example.com/api/auth/t/acme" });
 * ```
 */
export function withTenantPaths<A extends AuthLike>(auth: A): A {
  const plugin = auth.options.plugins?.find((p) => p.id === "multi-tenant");
  const prefix = (plugin?.options as { pathPrefix?: string } | undefined)?.pathPrefix;
  if (!prefix) {
    throw new Error("[better-auth-multi-tenant] withTenantPaths needs the multiTenant plugin with a pathPrefix.");
  }
  const basePath = auth.options.basePath || DEFAULT_BASE_PATH;
  const handler = auth.handler.bind(auth);
  return {
    ...auth,
    handler: (request: Request) => {
      const split = splitTenantPath(request.url, basePath, prefix);
      if (!split) return handler(request);
      return handler(tenantPathRequest(readdress(request, split.url), split.slug));
    },
  };
}
