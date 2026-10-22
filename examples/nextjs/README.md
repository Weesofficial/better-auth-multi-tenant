# Next.js example

A small Next.js app with three tenants on `*.localhost`, showing what the plugin
does: tenant resolution from the host, sessions bound to a tenant, a stolen
session refused on another tenant, and a suspended tenant refused outright.

From the repository root, pack the package as npm would publish it, then
install and start the example (the example installs that tarball, not the
source):

```bash
npm ci && npm run pack:examples
cd examples/nextjs
npm install --no-package-lock --legacy-peer-deps
cp .env.example .env.local   # then set BETTER_AUTH_SECRET
npm run setup                # creates example.db and seeds acme, globex, initech
npm run dev
```

`--legacy-peer-deps` works around an npm resolver crash on Better Auth's
optional peer dependencies; it does not change what is installed here.

Open <http://localhost:3000>. Browsers resolve `*.localhost` to your machine,
so no `/etc/hosts` changes are needed.

1. Go to **Acme Corp** (`acme.localhost:3000`) and sign up. The session is
   stamped with `t_acme`.
2. **Replay on acme** returns `200`. **Replay on globex** presents the same
   cookie to Globex and gets `403 CROSS_TENANT_SESSION`.
3. **Initech** is suspended, so it answers `403 TENANT_INACTIVE`.

Browsers never send a host-only cookie to another subdomain, so the replay
button does it server side (`app/api/replay/route.ts`), the way an attacker
holding a stolen cookie would.

## Smoke test

```bash
npm run smoke
```

Creates a throwaway database, runs `setup`, then `next build` and `next start`
on a free port. It signs up on `acme`, replays the cookie on `globex` and
expects `403 CROSS_TENANT_SESSION`, checks that `initech` answers
`403 TENANT_INACTIVE`, then stops the server and deletes the database. It
connects to `127.0.0.1` and names the tenant in the `Host` header, so it needs
no DNS or `/etc/hosts` entries. `PORT` and `DATABASE_PATH` override the port
(default 3000) and the SQLite file (default `example.db`).

`next.config.ts` pins `turbopack.root` to this folder: inside this repository
Next.js would otherwise take the repository root as the project and treat the
package's own `src/proxy.ts` as a Next.js proxy.

| File | What it shows |
| --- | --- |
| `lib/auth.ts` | `multiTenant()` with `baseDomain: "localhost"` and `tenantSessionHooks()` |
| `lib/db.ts` | the app's own `tenant` table and `getTenant` lookup |
| `lib/auth-client.ts` | `multiTenantClient()`, with no `baseURL` so each tenant talks to its own host |
| `app/page.tsx` | reading the tenant and session in a server component |
