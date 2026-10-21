# Cloudflare Workers example

Better Auth + `multiTenant` + `tenantSessionHooks` on Hono running in the
Workers runtime (`workerd`). Two tenants, `acme` and `globex`, on `*.localhost`.
It uses the memory adapter, so it needs no Cloudflare account and no D1
database; state lives as long as the isolate.

Better Auth is mounted with its web-standard handler:
`app.on(["GET", "POST"], "/api/auth/*", (c) => auth.handler(c.req.raw))`.

## Run

From the repository root, pack the package as npm would publish it, then
install and start the example locally with `wrangler dev --local` (no login):

```bash
npm ci && npm run pack:examples
cd examples/cloudflare-workers
npm install --no-package-lock --legacy-peer-deps
npm start
```

Open `http://acme.localhost:3000/api/auth/ok` and
`http://globex.localhost:3000/api/auth/ok`.

## Notes

- The memory adapter is imported from `@better-auth/memory-adapter` (a direct
  dependency). Importing it through `better-auth/adapters/memory` failed under
  Wrangler's bundler with `memoryAdapter is not a function`.
- For persistence, use D1 with a Kysely D1 dialect or Drizzle and keep
  `tenantSessionHooks()` as is. Set the secret with
  `wrangler secret put BETTER_AUTH_SECRET`; the example falls back to a
  public placeholder.
- No `baseURL` is set on purpose, so Better Auth derives it from each request.
- `--legacy-peer-deps` works around an npm resolver crash on Better Auth's
  optional peer dependencies.

## Smoke test

```bash
npm run smoke
```

Starts `wrangler dev`, signs up on `acme`, replays the session cookie on
`globex` and expects `403 CROSS_TENANT_SESSION`. It connects to `127.0.0.1` and
names the tenant in the `Host` header, so it needs no DNS or `/etc/hosts`
entries.
