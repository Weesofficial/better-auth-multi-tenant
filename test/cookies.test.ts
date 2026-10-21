import { test } from "node:test";
import assert from "node:assert/strict";
import { setup } from "./helpers.js";

/**
 * Better Auth's crossSubDomainCookies puts one session cookie on the apex
 * domain, shared by every tenant subdomain. The cross-tenant check still
 * refuses it on the wrong tenant, but users can then only be signed in to one
 * tenant at a time, so the plugin warns at startup.
 */

const captureWarnings = () => {
  const warnings: string[] = [];
  const logger = {
    level: "warn" as const,
    log: (level: string, message: string) => {
      if (level === "warn") warnings.push(message);
    },
  };
  return { warnings, logger };
};

test("warns once when crossSubDomainCookies is enabled", async () => {
  const { warnings, logger } = captureWarnings();
  const { auth } = setup({}, {
    auth: { logger, advanced: { crossSubDomainCookies: { enabled: true, domain: "example.com" } } },
  });
  await auth.$context;
  const ours = warnings.filter((w) => w.includes("crossSubDomainCookies"));
  assert.equal(ours.length, 1, `warnings: ${JSON.stringify(warnings)}`);
  assert.match(ours[0]!, /one tenant at a time/);
});

test("does not warn when crossSubDomainCookies is off", async () => {
  const { warnings, logger } = captureWarnings();
  const { auth } = setup({}, { auth: { logger } });
  await auth.$context;
  assert.deepEqual(warnings.filter((w) => w.includes("crossSubDomainCookies")), []);
});
