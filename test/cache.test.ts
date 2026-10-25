import { test } from "node:test";
import assert from "node:assert/strict";
import { cacheTenantLookup, type Tenant } from "../src/index.js";
import { setup, TENANTS } from "./helpers.js";

const acme: Tenant = { id: "t_acme", slug: "acme", status: "active" };

function counting(result: (key: string) => Tenant | null = (key) => (key === "acme" ? acme : null)) {
  const calls: string[] = [];
  return { calls, lookup: async (key: string) => (calls.push(key), result(key)) };
}

test("a cached lookup is reused within ttl and refetched after it", async (t) => {
  t.mock.timers.enable({ apis: ["Date"] });
  const { calls, lookup } = counting();
  const cached = cacheTenantLookup(lookup, { ttl: 1000 });
  assert.equal(await cached("acme"), acme);
  assert.equal(await cached("acme"), acme);
  assert.equal(calls.length, 1);
  t.mock.timers.tick(1001);
  assert.equal(await cached("acme"), acme);
  assert.equal(calls.length, 2);
});

test("misses are not cached unless cacheMisses is on", async () => {
  const plain = counting();
  const cached = cacheTenantLookup(plain.lookup, { ttl: 1000 });
  assert.equal(await cached("nope"), null);
  assert.equal(await cached("nope"), null);
  assert.equal(plain.calls.length, 2);

  const misses = counting();
  const cachedMisses = cacheTenantLookup(misses.lookup, { ttl: 1000, cacheMisses: true });
  await cachedMisses("nope");
  await cachedMisses("nope");
  assert.equal(misses.calls.length, 1);
});

test("concurrent lookups for one key share a single call", async () => {
  const { calls, lookup } = counting();
  const cached = cacheTenantLookup(lookup, { ttl: 1000 });
  const results = await Promise.all([cached("acme"), cached("acme"), cached("acme")]);
  assert.deepEqual(results, [acme, acme, acme]);
  assert.equal(calls.length, 1);
});

test("invalidate drops an entry by key, by tenant id, or all of them", async () => {
  const { calls, lookup } = counting();
  const cached = cacheTenantLookup(lookup, { ttl: 60_000 });
  await cached("acme");
  cached.invalidate("acme");
  await cached("acme");
  assert.equal(calls.length, 2);
  cached.invalidate("t_acme");
  await cached("acme");
  assert.equal(calls.length, 3);
  cached.invalidate();
  await cached("acme");
  assert.equal(calls.length, 4);
});

test("a lookup that was running when invalidate was called is not stored", async () => {
  let release!: () => void;
  const gate = new Promise<void>((resolve) => (release = resolve));
  const calls: string[] = [];
  const cached = cacheTenantLookup(
    async (key) => {
      calls.push(key);
      if (calls.length === 1) await gate;
      return acme;
    },
    { ttl: 60_000 },
  );
  const first = cached("acme");
  cached.invalidate("acme");
  release();
  await first;
  await cached("acme");
  assert.equal(calls.length, 2);
});

test("maxSize evicts the least recently used entry", async () => {
  const calls: string[] = [];
  const cached = cacheTenantLookup(async (key) => (calls.push(key), { id: key, slug: key }), { ttl: 60_000, maxSize: 2 });
  await cached("a");
  await cached("b");
  await cached("a"); // `b` is now the oldest
  await cached("c");
  await cached("a");
  assert.deepEqual(calls, ["a", "b", "c"]);
  await cached("b");
  assert.deepEqual(calls, ["a", "b", "c", "b"]);
});

test("rejects a ttl or maxSize that cannot work", () => {
  assert.throws(() => cacheTenantLookup(() => null, { ttl: 0 }), RangeError);
  assert.throws(() => cacheTenantLookup(() => null, { ttl: Number.POSITIVE_INFINITY }), RangeError);
  assert.throws(() => cacheTenantLookup(() => null, { ttl: 1000, maxSize: 0 }), RangeError);
});

test("the plugin resolves through a cached getTenant, and a suspended tenant applies after invalidate", async () => {
  const tenants: Record<string, Tenant> = { ...TENANTS, acme: { ...TENANTS.acme! } };
  const { calls, lookup } = counting((slug) => tenants[slug] ?? null);
  const getTenant = cacheTenantLookup(lookup, { ttl: 60_000 });
  const { request } = setup({ getTenant });

  assert.equal((await request("acme.example.com", "/multi-tenant/current")).status, 200);
  assert.equal((await request("acme.example.com", "/multi-tenant/current")).status, 200);
  assert.equal(calls.length, 1);

  tenants.acme = { ...tenants.acme!, status: "suspended" };
  assert.equal((await request("acme.example.com", "/multi-tenant/current")).status, 200);
  getTenant.invalidate("t_acme");
  assert.equal((await request("acme.example.com", "/multi-tenant/current")).status, 403);
});
