# Next.js example

A small Next.js app with three tenants on `*.localhost`, showing what the plugin
does: tenant resolution from the host, sessions bound to a tenant, a stolen
session refused on another tenant, and a suspended tenant refused outright.

```bash
cd examples/nextjs
npm install
cp .env.example .env.local   # then set BETTER_AUTH_SECRET
npm run setup                # creates example.db and seeds acme, globex, initech
npm run dev
```

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

| File | What it shows |
| --- | --- |
| `lib/auth.ts` | `multiTenant()` with `baseDomain: "localhost"` and `tenantSessionHooks()` |
| `lib/db.ts` | the app's own `tenant` table and `getTenant` lookup |
| `lib/auth-client.ts` | `multiTenantClient()`, with no `baseURL` so each tenant talks to its own host |
| `app/page.tsx` | reading the tenant and session in a server component |
