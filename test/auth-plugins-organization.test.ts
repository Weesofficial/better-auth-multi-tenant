import { test } from "node:test";
import assert from "node:assert/strict";
import { emailOTP, magicLink, organization, username } from "better-auth/plugins";
import { organizationMembersOnly, type Tenant } from "../src/index.js";
import { codeOf, cookiesOf, setup } from "./helpers.js";

/**
 * Authentication plugins with the organization bridge and teams on: the sessions
 * they create start in the tenant's organization, only organization members get
 * one, and the team checks still apply to those sessions.
 */

const ACME = "acme.example.com";
const GLOBEX = "globex.example.com";
const EMAIL = "user@example.com";
const PASSWORD = "correct-horse-battery";
const ORG_OF: Record<string, string> = { acme: "org_acme", globex: "org_globex" };

function bridgeSetup() {
  const sent = { links: [] as string[], otps: [] as string[] };
  let bootstrap = false;
  const ctx = setup(
    {
      getOrganizationId: (tenant: Tenant) => ORG_OF[tenant.slug],
      canAccessTenant: (user, tenant, access) => bootstrap || organizationMembersOnly(user, tenant, access),
    },
    {
      trustedOrigins: ["http://*.example.com"],
      plugins: [
        organization({ teams: { enabled: true } }),
        username(),
        magicLink({ sendMagicLink: async ({ token }) => void sent.links.push(token) }),
        emailOTP({ sendVerificationOTP: async ({ otp }) => void sent.otps.push(otp) }),
      ],
    },
  );
  const now = new Date();
  ctx.db.organization!.push(
    { id: "org_acme", name: "Acme", slug: "acme", createdAt: now },
    { id: "org_globex", name: "Globex", slug: "globex", createdAt: now },
  );
  ctx.db.team!.push(
    { id: "team_acme", name: "Acme Eng", organizationId: "org_acme", createdAt: now, updatedAt: now },
    { id: "team_globex", name: "Globex Eng", organizationId: "org_globex", createdAt: now, updatedAt: now },
  );

  /** An account that belongs to no organization yet. */
  const createAccount = async () => {
    bootstrap = true;
    const res = await ctx.request(ACME, "/sign-up/email", {
      method: "POST",
      body: { email: EMAIL, password: PASSWORD, name: "User", username: "alice" },
    });
    bootstrap = false;
    assert.equal(res.status, 200, await res.clone().text());
    return ctx.db.user[0]!.id as string;
  };
  const join = (userId: string, org: string, team: string) => {
    ctx.db.member!.push({ id: `m_${org}`, organizationId: org, userId, role: "member", createdAt: now });
    ctx.db.teamMember!.push({ id: `tm_${team}`, teamId: team, userId, createdAt: now });
  };
  return { ...ctx, sent, createAccount, join };
}

const signIns = {
  password: (r: ReturnType<typeof bridgeSetup>, host: string) =>
    r.request(host, "/sign-in/username", { method: "POST", body: { username: "alice", password: PASSWORD } }),
  magicLink: async (r: ReturnType<typeof bridgeSetup>, host: string) => {
    await r.request(host, "/sign-in/magic-link", { method: "POST", body: { email: EMAIL } });
    return r.request(host, `/magic-link/verify?token=${r.sent.links.at(-1)}`);
  },
  emailOtp: async (r: ReturnType<typeof bridgeSetup>, host: string) => {
    await r.request(host, "/email-otp/send-verification-otp", { method: "POST", body: { email: EMAIL, type: "sign-in" } });
    return r.request(host, "/sign-in/email-otp", { method: "POST", body: { email: EMAIL, otp: r.sent.otps.at(-1) } });
  },
};

for (const [name, signIn] of Object.entries(signIns)) {
  test(`${name}: only a member gets a session, which starts in the tenant's organization`, async () => {
    const r = bridgeSetup();
    const userId = await r.createAccount();
    const before = r.db.session.length;

    const denied = await signIn(r, ACME);
    assert.equal(await codeOf(denied), "TENANT_ACCESS_DENIED");
    // Proving an unverified email (magic link, OTP) ends the user's older sessions; none is added.
    assert.ok(r.db.session.length <= before);

    r.join(userId, "org_acme", "team_acme");
    const res = await signIn(r, ACME);
    assert.equal(res.status, 200, await res.clone().text());
    const session = r.db.session.at(-1)!;
    assert.equal(session.tenantId, "t_acme");
    assert.equal(session.activeOrganizationId, "org_acme");

    // A member of acme only is not let in on globex, whichever plugin signs them in.
    assert.equal(await codeOf(await signIn(r, GLOBEX)), "TENANT_ACCESS_DENIED");
  });
}

test("a plugin-created session cannot activate another tenant's organization or team", async () => {
  const r = bridgeSetup();
  const userId = await r.createAccount();
  r.join(userId, "org_acme", "team_acme");
  r.join(userId, "org_globex", "team_globex");
  const cookie = cookiesOf(await signIns.magicLink(r, ACME));

  const post = (path: string, body: Record<string, unknown>) => r.request(ACME, path, { method: "POST", cookie, body });
  const otherOrg = await post("/organization/set-active", { organizationId: "org_globex" });
  assert.equal(await codeOf(otherOrg), "ORGANIZATION_TENANT_MISMATCH");
  const otherTeam = await post("/organization/set-active-team", { teamId: "team_globex" });
  assert.equal(await codeOf(otherTeam), "TEAM_TENANT_MISMATCH");
  const ownTeam = await post("/organization/set-active-team", { teamId: "team_acme" });
  assert.equal(ownTeam.status, 200, await ownTeam.clone().text());
  assert.equal(r.db.session.at(-1)!.activeTeamId, "team_acme");
});
