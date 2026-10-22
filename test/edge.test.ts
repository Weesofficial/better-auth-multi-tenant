import assert from "node:assert/strict";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { edgeViolations } from "../scripts/edge-check.js";

// A runtime that is not Node has no `node:*` modules, `Buffer` or `process`.
test("the package entry points bundle for a worker target with no Node-only APIs", async () => {
  assert.deepEqual(await edgeViolations(["src/index.ts", "src/client.ts", "src/react.ts"]), []);
});

test("the check catches Node built-ins and Node-only globals", async () => {
  const dir = await mkdtemp(join(tmpdir(), "edge-check-"));
  const builtin = join(dir, "builtin.js");
  const global = join(dir, "global.js");
  await writeFile(builtin, 'import { readFileSync } from "node:fs"; export const x = readFileSync;');
  await writeFile(global, 'export const x = Buffer.from("a");');

  assert.ok((await edgeViolations([builtin])).length > 0);
  assert.ok((await edgeViolations([global])).some((p) => p.includes("Buffer")));
});
