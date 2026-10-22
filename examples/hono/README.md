# Hono example

Better Auth + `multiTenant` + `tenantSessionHooks` on [Hono](https://hono.dev)
with `@hono/node-server`. Two tenants, `acme` and `globex`, on `*.localhost`.

Better Auth is mounted with its web-standard handler:
`app.on(["GET", "POST"], "/api/auth/*", (c) => auth.handler(c.req.raw))`.

## Run

From the repository root, pack the package as npm would publish it, then
install and start the example (the example installs that tarball, not the
source):

```bash
npm ci && npm run pack:examples
cd examples/hono
npm install --no-package-lock --legacy-peer-deps
npm start
```

Browsers resolve `*.localhost` to loopback, so open
`http://acme.localhost:3000/api/auth/ok` and
`http://globex.localhost:3000/api/auth/ok`.

`--legacy-peer-deps` works around an npm resolver crash on Better Auth's
optional peer dependencies; it does not change what is installed here.

## Smoke test

```bash
npm run smoke
```

Starts the server, signs up on `acme`, replays the session cookie on `globex`
and expects `403 CROSS_TENANT_SESSION`. It connects to `127.0.0.1` and names the
tenant in the `Host` header, so it needs no DNS or `/etc/hosts` entries.

No `baseURL` is set on purpose: Better Auth derives it from each request, which
is what one deployment serving many subdomains needs. It logs a warning about
this at startup.
