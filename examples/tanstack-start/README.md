# TanStack Start example

Better Auth + `multiTenant` + `tenantSessionHooks` on TanStack Start (React,
Vite). Two tenants, `acme` and `globex`, on `*.localhost`.

Better Auth is mounted as a server route, `src/routes/api/auth/$.ts`:

```ts
export const Route = createFileRoute("/api/auth/$")({
  server: {
    handlers: {
      GET: ({ request }) => auth.handler(request),
      POST: ({ request }) => auth.handler(request),
    },
  },
});
```

`tanstackStartCookies()` from `better-auth/tanstack-start` is only needed when
you call `auth.api.*` from server functions and want the cookies it sets
forwarded; this example calls the HTTP endpoints only, so it is not installed.

## Run

From the repository root, pack the package as npm would publish it, then
install and start the example (the example installs that tarball, not the
source):

```bash
npm ci && npm run pack:examples
cd examples/tanstack-start
npm install --no-package-lock --legacy-peer-deps
npm start
```

Open `http://acme.localhost:3000/api/auth/ok` and
`http://globex.localhost:3000/api/auth/ok`.

The smoke test and `npm start` use the Vite dev server. `--legacy-peer-deps`
works around an npm resolver crash on Better Auth's optional peer dependencies.
No `baseURL` is set on purpose, so Better Auth derives it from each request.

## Smoke test

```bash
npm run smoke
```

Starts the server, signs up on `acme`, replays the session cookie on `globex`
and expects `403 CROSS_TENANT_SESSION`. It connects to `127.0.0.1` and names the
tenant in the `Host` header, so it needs no DNS or `/etc/hosts` entries.
