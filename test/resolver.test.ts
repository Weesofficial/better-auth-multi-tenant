import { test } from "node:test";
import assert from "node:assert/strict";
import {
  normalizeHost,
  resolveTenantSlug,
  tenantOrigin,
  type ResolverOptions,
} from "../src/resolver.js";

const base: ResolverOptions = { baseDomain: "example.com" };

function slugOf(host: string, opts: ResolverOptions = base, header?: string | null) {
  const r = resolveTenantSlug(host, opts, header);
  return r.ok ? r.slug : null;
}

function reasonOf(host: string, opts: ResolverOptions = base, header?: string | null) {
  const r = resolveTenantSlug(host, opts, header);
  return r.ok ? null : r.reason;
}

test("resolves a plain subdomain", () => {
  assert.equal(slugOf("acme.example.com"), "acme");
});

test("strips the port", () => {
  assert.equal(slugOf("acme.example.com:3000"), "acme");
});

test("is case insensitive", () => {
  assert.equal(slugOf("ACME.Example.COM"), "acme");
});

test("tolerates a fully-qualified trailing dot", () => {
  assert.equal(slugOf("acme.example.com."), "acme");
});

test("the apex domain carries no tenant", () => {
  assert.equal(reasonOf("example.com"), "apex-domain");
});

test("reserved subdomains never resolve", () => {
  for (const sub of ["www", "api", "app", "admin", "auth"]) {
    assert.equal(reasonOf(`${sub}.example.com`), "reserved-subdomain", sub);
  }
});

test("a custom reserved list replaces the default", () => {
  const opts = { ...base, reserved: ["internal"] };
  assert.equal(slugOf("www.example.com", opts), "www");
  assert.equal(reasonOf("internal.example.com", opts), "reserved-subdomain");
});

// The important one: a host that merely *contains* the base domain, or that
// ends with it as a bare substring, must not resolve. `notexample.com` and
// `example.com.attacker.net` are the classic suffix-matching bugs.
test("rejects lookalike domains", () => {
  for (const host of [
    "acme.notexample.com",
    "example.com.attacker.net",
    "acme.example.com.attacker.net",
    "attacker.net",
    "acmeexample.com",
  ]) {
    assert.equal(slugOf(host), null, `${host} must not resolve`);
  }
});

test("nested subdomains are refused by default", () => {
  assert.equal(reasonOf("acme.eu.example.com"), "nested-subdomain");
});

test("nested subdomains resolve left-most when opted in", () => {
  assert.equal(slugOf("acme.eu.example.com", { ...base, allowNestedSubdomains: true }), "acme");
});

test("malformed slugs are refused", () => {
  for (const sub of ["-acme", "acme-", "ac_me", "ACME!", "a".repeat(64)]) {
    assert.equal(slugOf(`${sub}.example.com`), null, sub);
  }
});

test("a 63-character slug is still valid", () => {
  const sub = "a".repeat(63);
  assert.equal(slugOf(`${sub}.example.com`), sub);
});

test("an empty or missing host resolves to nothing", () => {
  assert.equal(reasonOf(""), "no-host");
  assert.equal(reasonOf(undefined as unknown as string), "no-host");
});

test("IPv6 literals carry no tenant", () => {
  assert.equal(reasonOf("[::1]:3000"), "no-host");
});

// The security default: the x-tenant header is client-controlled, so it is
// ignored unless the host app explicitly opts in.
test("the tenant header is ignored unless enabled", () => {
  assert.equal(slugOf("example.com", base, "acme"), null);
});

test("the tenant header is honoured when enabled", () => {
  const opts = { ...base, allowHeaderOverride: true };
  const r = resolveTenantSlug("example.com", opts, "acme");
  assert.ok(r.ok);
  assert.equal(r.slug, "acme");
  assert.equal(r.source, "header");
});

test("the tenant header is still validated when enabled", () => {
  const opts = { ...base, allowHeaderOverride: true };
  assert.equal(reasonOf("example.com", opts, "not a slug"), "malformed-slug");
  assert.equal(reasonOf("example.com", opts, "www"), "reserved-subdomain");
});

test("host resolution reports its source", () => {
  const r = resolveTenantSlug("acme.example.com", base);
  assert.ok(r.ok);
  assert.equal(r.source, "host");
});

test("normalizeHost is total", () => {
  assert.equal(normalizeHost(null), "");
  assert.equal(normalizeHost("  Example.COM:8080  "), "example.com");
});

test("tenantOrigin builds the per-tenant callback origin", () => {
  assert.equal(tenantOrigin("acme", base), "https://acme.example.com");
  assert.equal(
    tenantOrigin("acme", { ...base, protocol: "http", port: 3000 }),
    "http://acme.example.com:3000",
  );
});
