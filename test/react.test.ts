import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { useTenant, useTenantWith, type UseTenantResult } from "../src/react.js";
import type { CurrentTenant, TenantClient } from "../src/client.js";

const ACME: CurrentTenant = { id: "t_acme", slug: "acme", origin: "https://acme.example.com" };

const clientOf = (current: TenantClient["multiTenant"]["current"]): TenantClient => ({ multiTenant: { current } });
const found = (tenant: CurrentTenant) => clientOf(async () => ({ data: tenant, error: null }));
const tick = () => new Promise((resolve) => setTimeout(resolve, 0));

/** Just enough of React's hook model to run a hook: state slots, effects with deps, cleanup on unmount. */
function mount(client: TenantClient) {
  const slots: unknown[] = [];
  const cleanups: (() => void)[] = [];
  let deps: unknown[] | undefined;
  let result!: UseTenantResult;
  let renders = 0;
  let current = client;

  const hooks = {
    useState: ((initial: unknown) => {
      if (!slots.length) slots.push(initial);
      return [
        slots[0],
        (next: unknown) => {
          const value = typeof next === "function" ? (next as (prev: unknown) => unknown)(slots[0]) : next;
          if (!Object.is(value, slots[0])) {
            slots[0] = value;
            render();
          }
        },
      ];
    }) as never,
    useEffect: ((effect: () => (() => void) | void, nextDeps: unknown[]) => {
      if (deps && deps.length === nextDeps.length && deps.every((d, i) => Object.is(d, nextDeps[i]))) return;
      deps = nextDeps;
      pending.push(effect);
    }) as never,
  };
  const pending: (() => (() => void) | void)[] = [];

  function render() {
    renders++;
    result = useTenantWith(hooks, current);
    for (const effect of pending.splice(0)) {
      cleanups.splice(0).forEach((c) => c());
      const cleanup = effect();
      if (cleanup) cleanups.push(cleanup);
    }
  }
  render();

  return {
    get result() {
      return result;
    },
    get renders() {
      return renders;
    },
    rerender(next: TenantClient) {
      current = next;
      render();
    },
    unmount: () => cleanups.splice(0).forEach((c) => c()),
  };
}

test("useTenant renders pending on the server, with no fetch", () => {
  let calls = 0;
  const client = clientOf(async () => {
    calls++;
    return { data: ACME, error: null };
  });
  function Probe() {
    const { tenant, error, isPending } = useTenant(client);
    return createElement("p", null, JSON.stringify({ tenant, error, isPending }));
  }
  const html = renderToString(createElement(Probe));
  assert.match(html, /isPending&quot;:true/);
  assert.match(html, /tenant&quot;:null/);
  assert.equal(calls, 0);
});

test("useTenant goes from pending to the tenant", async () => {
  const hook = mount(found(ACME));
  assert.deepEqual(hook.result, { tenant: null, error: null, isPending: true });
  await tick();
  assert.deepEqual(hook.result, { tenant: ACME, error: null, isPending: false });
  assert.equal(hook.renders, 2);
});

test("useTenant surfaces a typed error", async () => {
  const hook = mount(
    clientOf(async () => ({
      data: null,
      error: { status: 404, statusText: "Not Found", code: "TENANT_NOT_FOUND", message: "Unknown tenant" },
    })),
  );
  await tick();
  assert.equal(hook.result.isPending, false);
  assert.equal(hook.result.tenant, null);
  assert.equal(hook.result.error?.code, "TENANT_NOT_FOUND");
});

test("useTenant ignores a response that arrives after unmount", async () => {
  const hook = mount(found(ACME));
  hook.unmount();
  await tick();
  assert.equal(hook.result.isPending, true);
  assert.equal(hook.renders, 1);
});

test("useTenant starts over for a new client and ignores the old one's late answer", async () => {
  const slow = clientOf(() => new Promise((resolve) => setTimeout(() => resolve({ data: ACME, error: null }), 20)));
  const globex: CurrentTenant = { id: "t_globex", slug: "globex", origin: "https://globex.example.com" };
  const hook = mount(slow);
  hook.rerender(found(globex));
  await tick();
  assert.equal(hook.result.tenant?.slug, "globex");
  await new Promise((resolve) => setTimeout(resolve, 40));
  assert.equal(hook.result.tenant?.slug, "globex");
});
