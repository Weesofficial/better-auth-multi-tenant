# SvelteKit example

Better Auth + `multiTenant` + `tenantSessionHooks` on SvelteKit 3 with
`adapter-node`. Two tenants, `acme` and `globex`, on `*.localhost`.

Better Auth is mounted in `src/hooks.server.ts` with `svelteKitHandler` from
`better-auth/svelte-kit`:

```ts
export const handle: Handle = ({ event, resolve }) => svelteKitHandler({ auth, event, resolve, building });
```

## Run

From the repository root, pack the package as npm would publish it, then
install, build and start the example (the example installs that tarball, not
the source):

```bash
npm ci && npm run pack:examples
cd examples/sveltekit
npm install --no-package-lock --legacy-peer-deps
npm start
```

Open `http://acme.localhost:3000/api/auth/ok` and
`http://globex.localhost:3000/api/auth/ok`.

## Notes

- `adapter-node` assumes `https` for the request URL unless told which header
  carries the scheme, and Better Auth then rejects the `http://` origin as
  `INVALID_ORIGIN`. `npm start` sets `PROTOCOL_HEADER=x-forwarded-proto`, as you
  would behind a TLS-terminating proxy, and the smoke test sends
  `x-forwarded-proto: http`.
- SvelteKit 3 reads its configuration from the `sveltekit()` Vite plugin
  (`vite.config.ts`); there is no `svelte.config.js`, and `$lib` is not
  available, so `hooks.server.ts` imports `./lib/auth` directly.
- No `baseURL` is set on purpose, so Better Auth derives it from each request.
- `--legacy-peer-deps` works around an npm resolver crash on Better Auth's
  optional peer dependencies.

## Smoke test

```bash
npm run smoke
```

Builds and starts the server, signs up on `acme`, replays the session cookie on
`globex` and expects `403 CROSS_TENANT_SESSION`. It connects to `127.0.0.1` and
names the tenant in the `Host` header, so it needs no DNS or `/etc/hosts`
entries.
