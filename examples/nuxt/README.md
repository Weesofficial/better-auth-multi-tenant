# Nuxt example

Better Auth + `multiTenant` + `tenantSessionHooks` on Nuxt 4 (Nitro, h3 1.x).
Two tenants, `acme` and `globex`, on `*.localhost`.

Better Auth is mounted as a catch-all server route,
`server/api/auth/[...all].ts`:

```ts
export default defineEventHandler((event) => auth.handler(toWebRequest(event)));
```

`toWebRequest` is h3 1.x's converter; the auto-imported `auth` lives in
`server/utils/auth.ts`.

## Run

From the repository root, pack the package as npm would publish it, then
install, build and start the example (the example installs that tarball, not
the source):

```bash
npm ci && npm run pack:examples
cd examples/nuxt
npm install --no-package-lock --legacy-peer-deps
npm start
```

Open `http://acme.localhost:3000/api/auth/ok` and
`http://globex.localhost:3000/api/auth/ok`.

`--legacy-peer-deps` works around an npm resolver crash on Better Auth's
optional peer dependencies. No `baseURL` is set on purpose, so Better Auth
derives it from each request.

## Smoke test

```bash
npm run smoke
```

Builds and starts the server, signs up on `acme`, replays the session cookie on
`globex` and expects `403 CROSS_TENANT_SESSION`. It connects to `127.0.0.1` and
names the tenant in the `Host` header, so it needs no DNS or `/etc/hosts`
entries.
