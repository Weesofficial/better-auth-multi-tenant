import { APIError, createAuthMiddleware } from "better-auth/api";
import { getTenantFromContext, type Tenant } from "./context.js";

/** The columns of the `ssoProvider` table this file reads. */
export interface ProviderRow {
  providerId: string;
  organizationId?: string | null;
  domain?: string | null;
}

/** Verification identifier prefix for "this RelayState was handed out on that tenant". */
const RELAY_KEY = "multi-tenant:saml-relay:";
/** The SSO plugin's own relay state lives 10 minutes. */
const RELAY_TTL_MS = 600_000;

const mismatch = () =>
  new APIError("FORBIDDEN", {
    code: "SSO_PROVIDER_TENANT_MISMATCH",
    message: "This SSO provider does not belong to this tenant",
  });

/** `acme.com`, `https://acme.com/x` and `ACME.com:443` all become `acme.com`. */
const hostOf = (entry: string) =>
  entry.trim().toLowerCase().replace(/^[a-z][a-z0-9+.-]*:\/\//, "").split(/[/:?#]/)[0] ?? "";

const domainsOf = (list: string | null | undefined) => (list ?? "").split(",").map(hostOf).filter(Boolean);

const isUnder = (domain: string, parent: string) => domain === parent || domain.endsWith(`.${parent}`);

/**
 * `ssoRequireTenantMapping` without `getOrganizationId` or `getSSODomains`: no
 * provider can be tied to a tenant, so none is usable on a tenant's host.
 */
export const ssoRefuseHook = {
  matcher: (ctx: { path?: string }) => ctx.path === "/sign-in/sso" || (ctx.path ?? "").startsWith("/sso/"),
  handler: createAuthMiddleware(async (ctx) => {
    if (getTenantFromContext(ctx.context)) throw mismatch();
  }),
};

/**
 * With an organization bridge or `getSSODomains`, SSO on a tenant's host only
 * touches that tenant's providers:
 *
 * - a provider linked to an organization belongs to the tenant of that
 *   organization, whatever its domain says;
 * - an unlinked provider belongs to the tenant when every one of its domains
 *   is (a subdomain of) a domain `getSSODomains` returns for it.
 *
 * Providers from the SSO plugin's `defaultSSO` option are not in the table, so
 * they belong to no tenant and are refused on a tenant's host.
 */
export function ssoGuardHooks(getSSODomains?: (tenant: Tenant) => string[] | null | undefined | Promise<string[] | null | undefined>) {
  /** Whether `provider` belongs to the tenant of this request. */
  const ownerCheck = async (context: unknown) => {
    const resolved = getTenantFromContext(context);
    if (!resolved) return null;
    const tenantDomains = ((await getSSODomains?.(resolved.tenant)) ?? []).map(hostOf).filter(Boolean);
    return (provider: Pick<ProviderRow, "organizationId" | "domain">) => {
      if (provider.organizationId) return provider.organizationId === resolved.organizationId;
      const domains = domainsOf(provider.domain);
      return domains.length > 0 && domains.every((d) => tenantDomains.some((t) => isUnder(d, t)));
    };
  };

  const before = [
    {
      // Sign-in picks a provider from a provider id, an organization slug, a
      // domain or an email. Choose it here from the tenant's own providers and
      // pin it by id, so the SSO plugin cannot resolve a different one.
      matcher: (ctx: { path?: string }) => ctx.path === "/sign-in/sso",
      handler: createAuthMiddleware(async (ctx) => {
        const owns = await ownerCheck(ctx.context);
        if (!owns) return;
        const body = (ctx.body ?? {}) as { providerId?: string; organizationSlug?: string; domain?: string; email?: string };
        const adapter = ctx.context.adapter;

        let chosen: ProviderRow | undefined | null;
        if (body.providerId) {
          chosen = await adapter.findOne<ProviderRow>({
            model: "ssoProvider",
            where: [{ field: "providerId", value: body.providerId }],
          });
        } else if (body.organizationSlug) {
          const org = await adapter.findOne<{ id: string }>({
            model: "organization",
            where: [{ field: "slug", value: body.organizationSlug }],
          });
          const providers = org ? await adapter.findMany<ProviderRow>({ model: "ssoProvider", where: [{ field: "organizationId", value: org.id }] }) : [];
          chosen = providers.find((p) => owns(p));
        } else {
          const domain = hostOf(body.domain || body.email?.split("@")[1] || "");
          const providers = domain ? await adapter.findMany<ProviderRow>({ model: "ssoProvider" }) : [];
          chosen = providers.find((p) => owns(p) && domainsOf(p.domain).some((d) => isUnder(domain, d)));
        }

        if (!chosen || !owns(chosen)) throw mismatch();
        if (chosen.providerId !== body.providerId) return { context: { body: { providerId: chosen.providerId } } };
      }),
    },
    {
      // Registration links the provider to the tenant: its organization (filled
      // in when the request leaves it out) or, without one, its domain.
      matcher: (ctx: { path?: string }) => ctx.path === "/sso/register",
      handler: createAuthMiddleware(async (ctx) => {
        const owns = await ownerCheck(ctx.context);
        if (!owns) return;
        const body = (ctx.body ?? {}) as { organizationId?: string; domain?: string };
        const organizationId = body.organizationId || getTenantFromContext(ctx.context)?.organizationId;
        if (!owns({ organizationId, domain: body.domain })) throw mismatch();
        if (!body.organizationId && organizationId) return { context: { body: { organizationId } } };
      }),
    },
    {
      // Callbacks, the SAML routes and provider management name a provider in
      // the path, the query or the body. The provider must belong to the host's
      // tenant, so a callback that lands on another tenant's host is refused.
      matcher: (ctx: { path?: string }) => {
        const path = ctx.path ?? "";
        return path.startsWith("/sso/") && !["/sso/register", "/sso/providers", "/sso/callback"].includes(path);
      },
      handler: createAuthMiddleware(async (ctx) => {
        const owns = await ownerCheck(ctx.context);
        if (!owns) return;
        const body = (ctx.body ?? {}) as { providerId?: string; domain?: string };
        const query = (ctx.query ?? {}) as { providerId?: string };
        const params = ((ctx as { params?: unknown }).params ?? {}) as { providerId?: string };
        const providerId = params.providerId ?? body.providerId ?? query.providerId;
        if (!providerId) return;

        const provider = await ctx.context.adapter.findOne<ProviderRow>({
          model: "ssoProvider",
          where: [{ field: "providerId", value: providerId }],
        });
        if (!provider || !owns(provider)) throw mismatch();
        // A domain change must stay inside the tenant's domains.
        if (ctx.path === "/sso/update-provider" && body.domain && !owns({ organizationId: provider.organizationId, domain: body.domain })) {
          throw mismatch();
        }
      }),
    },
    {
      // A SAML response names the flow it answers by RelayState. Only a
      // RelayState handed out on this tenant's host (see the after hook) gets
      // through; without one the response is IdP-initiated, which the SSO
      // plugin accepts only when `allowIdpInitiated` is on.
      matcher: (ctx: { path?: string }) => (ctx.path ?? "").startsWith("/sso/saml2/sp/acs"),
      handler: createAuthMiddleware(async (ctx) => {
        const resolved = getTenantFromContext(ctx.context);
        const relayState = (ctx.body as { RelayState?: unknown } | undefined)?.RelayState;
        if (!resolved || typeof relayState !== "string" || !relayState) return;
        const bound = await ctx.context.internalAdapter.findVerificationValue(`${RELAY_KEY}${relayState}`);
        if (!bound || bound.value !== resolved.tenant.id || new Date(bound.expiresAt) <= new Date()) throw mismatch();
      }),
    },
    {
      // The shared callback (the SSO plugin's `redirectURI` option) learns the
      // provider from the OAuth state, which only the plugin can read. It cannot
      // be checked here, so it is refused on a tenant's host.
      matcher: (ctx: { path?: string }) => ctx.path === "/sso/callback",
      handler: createAuthMiddleware(async (ctx) => {
        if (getTenantFromContext(ctx.context)) throw mismatch();
      }),
    },
  ];

  const after = [
    {
      // A SAML sign-in redirects to the IdP with the SSO plugin's RelayState
      // (a standard parameter of the redirect binding). Remember which tenant
      // it was handed out on, for the ACS check above.
      matcher: (ctx: { path?: string }) => ctx.path === "/sign-in/sso",
      handler: createAuthMiddleware(async (ctx) => {
        const resolved = getTenantFromContext(ctx.context);
        const url = (ctx.context.returned as { url?: unknown } | undefined)?.url;
        if (!resolved || typeof url !== "string") return;
        const params = new URL(url).searchParams;
        const relayState = params.get("RelayState");
        if (!relayState || !params.has("SAMLRequest")) return;
        await ctx.context.internalAdapter.createVerificationValue({
          identifier: `${RELAY_KEY}${relayState}`,
          value: resolved.tenant.id,
          expiresAt: new Date(Date.now() + RELAY_TTL_MS),
        });
      }),
    },
    {
      // The list covers every organization the user administers, whatever the
      // tenant of the host; keep the tenant's providers.
      matcher: (ctx: { path?: string }) => ctx.path === "/sso/providers",
      handler: createAuthMiddleware(async (ctx) => {
        const returned = ctx.context.returned as { providers?: ProviderRow[] } | Error | undefined;
        const owns = await ownerCheck(ctx.context);
        if (!owns || !returned || returned instanceof Error) return;
        return ctx.json({ ...returned, providers: (returned.providers ?? []).filter((p) => owns(p)) });
      }),
    },
  ];

  return { before, after };
}
