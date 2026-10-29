# Addressing tenants

How a request is mapped to a tenant, and what each mode needs. The
[README](../README.md#choosing-how-tenants-are-addressed) compares the modes.

## The `x-tenant` header

A tenant header is convenient in development, where you rarely have wildcard
DNS pointed at localhost. It is also completely client-controlled: if you trust
it in production, any authenticated user can address any tenant by editing one
header.

So it is **off by default**, and enabling it is explicit:

```ts
multiTenant({
  baseDomain: "example.com",
  getTenant,
  // Never true in production.
  allowHeaderOverride: process.env.NODE_ENV !== "production",
})
```

When enabled, the header value is still validated against the same slug pattern
and reserved list as a subdomain.

## Custom domains

Tenants can also be served from their own domain, such as `app.acme.com`,
alongside `acme.example.com`. Pass `getTenantByDomain`:

```ts
multiTenant({
  baseDomain: "example.com",
  getTenant: (slug) => db.tenant.findUnique({ where: { slug } }),
  getTenantByDomain: (domain) =>
    db.tenant.findFirst({ where: { customDomain: domain, domainVerified: true } }),
})
```

- It is called only for hosts **outside** `baseDomain`, with the host lowercased
  and the port removed. Subdomains never reach it.
- An unknown domain is a `404 TENANT_NOT_FOUND`, and an inactive tenant a
  `403 TENANT_INACTIVE`, exactly as for subdomains.
- Sessions stay bound to the tenant id, so a session from one tenant is refused
  on another tenant's custom domain with `403 CROSS_TENANT_SESSION`.
- `/multi-tenant/current` reports the custom domain as the `origin`, and the
  resolved tenant has `source: "custom-domain"` and `domain` set.

Two things are up to you:

1. **Verify ownership** before you store a mapping, for example with a DNS TXT
   record. Whoever controls the mapping controls which tenant a domain serves.
2. **Trust the origin.** Add each custom domain to Better Auth's
   `trustedOrigins`, or its CSRF checks will refuse requests from it.

Any host outside `baseDomain` reaches `getTenantByDomain`, so a client can make
it query your database with made-up hosts. Wrap it in
`cacheTenantLookup(..., { ttl, cacheMisses: true })` so repeated unknown hosts
are answered from memory (see [Caching tenant lookups](#caching-tenant-lookups)).

## Path-based tenants

With `pathPrefix`, a tenant is named in the auth URL:
`/api/auth/t/acme/sign-in/email` is the `/sign-in/email` route for `acme`.
Wrap the instance in `withTenantPaths`, which takes the prefix off before Better
Auth sees the request, and point each tenant's client at its own base URL:

```ts
import { betterAuth } from "better-auth";
import { multiTenant, organizationMembersOnly, tenantSessionHooks, withTenantPaths } from "better-auth-multi-tenant";

export const auth = withTenantPaths(
  betterAuth({
    plugins: [
      multiTenant({
        pathPrefix: "/t",
        getTenant: (slug) => db.tenant.findUnique({ where: { slug } }),
        getOrganizationId: (tenant) => tenant.organizationId,
        canAccessTenant: organizationMembersOnly,
      }),
    ],
    databaseHooks: tenantSessionHooks(),
  }),
);

// In the browser, on /acme/…
const authClient = createAuthClient({ baseURL: `${location.origin}/api/auth/t/${slug}` });
```

- **Pass the wrapped `auth` everywhere** you would pass `auth`, including
  `toNodeHandler(auth)` and `svelteKitHandler({ auth })`. Without it, prefixed
  URLs are `404` and unprefixed ones are `400 TENANT_REQUIRED`.
- **Rate limits and `disabledPaths` see the route without the prefix**, so
  Better Auth's sign-in limit is one bucket across all tenants, not one per tenant.
- **Each tenant gets its own cookie names** (`better-auth.acme.session_token`),
  so one browser can be signed in to several tenants at once, and other tenants'
  cookies are hidden from the request. If you read the cookie yourself (Next.js
  middleware), pass `cookiePrefix: "better-auth.acme"` to `getSessionCookie`.
- **Links follow the tenant.** Magic links, email verification and OAuth
  redirect URIs are built under `/api/auth/t/<slug>`, so register each
  tenant's redirect URI with your OAuth providers (or use one provider app per
  tenant with `createTenantAuth`).
- **Tenants share one origin in the browser.** Every tenant's cookies go with
  every request to the host, and a page under `/t/globex` is same-origin with
  `/api/auth/t/acme`, so script running on one tenant's pages can act as the
  signed-in user on every other tenant; Better Auth's CSRF check and
  `sameOriginOnly` cannot tell them apart. Do not serve tenant-authored HTML or
  script from the shared origin. If tenants customise their pages, or one XSS
  must not reach every tenant, use subdomains instead.
- **The URL is chosen by the client**, unlike a host backed by DNS. Session
  binding still refuses another tenant's session, but anyone can sign in to any
  tenant unless you set `canAccessTenant`. Set it.
- **Server code** that calls `auth.api` for a page under `/acme/…` names the
  tenant with `tenantPathRequest`:

  ```ts
  const session = await auth.api.getSession({
    headers: request.headers,
    request: tenantPathRequest(request, params.tenant),
    asResponse: false,
  });
  ```

`createTenantAuth` takes `pathPrefix` too (and `basePath`, default `/api/auth`);
its `handler` does the unwrapping itself.

## Your own resolver

`getTenantSlug` decides the tenant from anything on the request. It gets
`{ headers, request, path }` and returns a slug or `null`; the slug still has to
pass `reserved` and `slugPattern`:

```ts
multiTenant({
  // Set by your edge middleware, which strips any copy the client sent.
  getTenantSlug: ({ headers }) => headers.get("x-internal-tenant"),
  getTenant,
  canAccessTenant: organizationMembersOnly,
})
```

Read only what the client cannot choose, or rely on `canAccessTenant`. Set
`baseDomain` as well if `/multi-tenant/current` should report subdomain origins,
and `tenantCookies: true` if tenants share a host.

## Caching tenant lookups

`getTenant` runs on every request, `get-session` included. Put
`cacheTenantLookup` in front of it (or of `getTenantByDomain`):

```ts
import { cacheTenantLookup } from "better-auth-multi-tenant";

const getTenant = cacheTenantLookup((slug) => db.tenant.findUnique({ where: { slug } }), { ttl: 60_000 });
multiTenant({ baseDomain: "example.com", getTenant });

// After you suspend, delete or rename a tenant:
getTenant.invalidate(tenant.id); // or a slug, or nothing for everything
```

The cache lives in the process (or isolate), shares one lookup between
concurrent requests for the same slug, and keeps 1000 entries by default
(`maxSize`). Unknown slugs are not cached unless you set `cacheMisses: true`. A
change you make to a tenant applies after at most `ttl`, or at once with
`invalidate`.

## Cookies across subdomains

Leave Better Auth's `advanced.crossSubDomainCookies` **off**. It puts one
session cookie on the apex domain, shared by every tenant subdomain. The
cross-tenant check still refuses that session on the wrong tenant, but signing
in to one tenant then signs the user out of every other one. The plugin logs a
warning at startup if it finds the option enabled.

## Behind a reverse proxy

By default the tenant comes from the `Host` header and nothing else, so a
client-supplied `X-Forwarded-Host` or `Forwarded` header is ignored. If a proxy
in front of you rewrites `Host` to an internal name, set `trustProxy` so the
host is read from the header the proxy sets instead:

```ts
multiTenant({ baseDomain: "example.com", getTenant, trustProxy: true });
```

| Value | Meaning |
| --- | --- |
| `false` (default) | `Host` only. |
| `true` | One trusted proxy: the right-most entry of `X-Forwarded-Host` (or the `host=` of the right-most `Forwarded` element). |
| a number `n` | `n` trusted proxies in a row: the right-most `n` entries are yours, and the left-most of those is used. Fewer entries than `n` is rejected. |
| `(req) => boolean` | Decided per request; `req` is `{ headers, request? }`. `true` trusts one proxy, anything else uses `Host`. Use it to trust the header only when a secret header or source you check is present. |

Entries to the left of the trusted ones are client-controlled and never read.
A forwarded host that is not a plain host name, IPv4 address or bracketed IPv6
literal with an optional port, an empty entry, `X-Forwarded-Host` and
`Forwarded` naming different hosts, or a list shorter than `n` answers
`400 INVALID_FORWARDED_HOST`, also on paths that do not require a tenant. With
neither header present the request did not come through a proxy and `Host` is
used.

Nothing is detected for you: whether the header can be trusted depends on
whether your proxy overwrites it. If it only passes the client's value
through, enabling `trustProxy` lets anyone pick their tenant. Confirm what your
platform sends (log `host` and `x-forwarded-host` from a test request) before
turning it on.

| Platform | `trustProxy` | Why |
| --- | --- | --- |
| Vercel | `true` | Sets `x-forwarded-host` to the public host and replaces a client-supplied value. |
| Cloudflare Workers / Pages | `false` | `Host` and `request.url` already carry the public host, and no `x-forwarded-host` is added. |
| Cloudflare proxying to your origin | `false` | `Host` is passed through unchanged. |
| Netlify | `true` | Functions can see an internal `Host`; the public host is in `x-forwarded-host`. |
| Nginx | `false` with `proxy_set_header Host $host;`, or `true` with `proxy_set_header X-Forwarded-Host $host;` | Always set the header from `$host`, never from `$http_x_forwarded_host`, which repeats the client's value. |
| AWS ALB | `false` | Passes `Host` through and adds no `X-Forwarded-Host`. Behind CloudFront, forward the `Host` header to the origin. |
| CDN in front of Nginx or an ALB | `2` | Only if each layer appends to `X-Forwarded-Host`; otherwise `1`. |

`createTenantAuth` takes the same option. The tenant read from the forwarded host
is the one every other check uses: session binding, `canAccessTenant`, the
verification binding, teams and SSO.

## Edge runtimes

The package uses no Node built-ins, `Buffer` or `process`, so it can run on
Cloudflare Workers, Vercel Edge, Deno and Bun. `npm run build` bundles each
entry point with esbuild for a platform-neutral target and fails on any Node
built-in or Node-only global. That check covers this package only: Better Auth,
your database adapter and the code in your callbacks must run there too.
