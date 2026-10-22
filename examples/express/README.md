# Express example

Better Auth + `multiTenant` + `tenantSessionHooks` on Express 5. Two tenants,
`acme` and `globex`, on `*.localhost`.

Better Auth is mounted with `toNodeHandler` from `better-auth/node`, before any
body parser: `app.all("/api/auth/*splat", toNodeHandler(auth))`. (`*splat` is
Express 5 syntax; Express 4 uses `/api/auth/*`.)

## Run

From the repository root, pack the package as npm would publish it, then
install and start the example (the example installs that tarball, not the
source):

```bash
npm ci && npm run pack:examples
cd examples/express
npm install --no-package-lock --legacy-peer-deps
npm start
```

Open `http://acme.localhost:3000/api/auth/ok` and
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
is what one deployment serving many subdomains needs.
