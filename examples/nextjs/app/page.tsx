import { headers } from "next/headers";
import { resolveTenantSlug } from "better-auth-multi-tenant";
import { auth, ORIGIN_PORT } from "@/lib/auth";
import { findTenant, listTenants } from "@/lib/db";
import { TenantPanel } from "./tenant-panel";

export const dynamic = "force-dynamic";

export default async function Home() {
  const h = await headers();
  const resolution = resolveTenantSlug(h.get("host"), { baseDomain: "localhost" });

  if (!resolution.ok) {
    return (
      <main>
        <h1>better-auth-multi-tenant</h1>
        <p>
          This is the apex domain, so there is no tenant here. Open a tenant&apos;s subdomain:
        </p>
        <ul>
          {listTenants().map((t) => (
            <li key={t.slug}>
              <a href={`http://${t.slug}.localhost:${ORIGIN_PORT}`}>{t.name}</a>{" "}
              <code>{t.slug}.localhost</code>
              {t.status !== "active" && <em> ({t.status})</em>}
            </li>
          ))}
        </ul>
      </main>
    );
  }

  const tenant = findTenant(resolution.slug);
  if (!tenant) return <p>No tenant called “{resolution.slug}”. The plugin answers 404 here.</p>;
  if (tenant.status !== "active") {
    return <p>{tenant.name} is {tenant.status}. The plugin answers 403 TENANT_INACTIVE here.</p>;
  }

  const session = await auth.api.getSession({ headers: h }).catch(() => null);
  const others = listTenants()
    .filter((t) => t.slug !== tenant.slug && t.status === "active")
    .map((t) => t.slug);

  return (
    <main>
      <p>
        <a href={`http://localhost:${ORIGIN_PORT}`}>← all tenants</a>
      </p>
      <h1>{tenant.name}</h1>
      <p>
        Tenant <code>{tenant.slug}</code> (<code>{tenant.id}</code>), resolved from the host.
      </p>
      <TenantPanel
        slug={tenant.slug}
        others={others}
        user={session ? { email: session.user.email, tenantId: String((session.session as { tenantId?: string }).tenantId) } : null}
      />
    </main>
  );
}
