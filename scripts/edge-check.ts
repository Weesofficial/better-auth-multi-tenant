/**
 * Bundles entry points for a worker-style target and reports anything that
 * would not run on Cloudflare Workers, Vercel Edge, Deno or Bun without a Node
 * compatibility layer: Node built-ins and Node-only globals.
 *
 * `platform: "neutral"` does not know about Node, so an import of `node:fs`
 * (or any other built-in) fails to resolve, which is the check. Better Auth and
 * React are left external: they are peers, and their runtime support is theirs.
 *
 *   node --import tsx scripts/edge-check.ts dist/index.js dist/client.js
 */
import { builtinModules } from "node:module";
import { pathToFileURL } from "node:url";
import { build } from "esbuild";

const EXTERNAL = ["better-auth", "better-auth/*", "@better-auth/*", "react"];
const NODE_GLOBALS = /\b(?:Buffer|process\.|require\(|__dirname|__filename|setImmediate)/;

const isBuiltin = (specifier: string) =>
  specifier.startsWith("node:") || builtinModules.includes(specifier.split("/")[0]!);

/** Human-readable problems with bundling `entryPoints` for a worker; empty when clean. */
export async function edgeViolations(entryPoints: string[]): Promise<string[]> {
  const problems: string[] = [];
  let result;
  try {
    result = await build({
      entryPoints,
      bundle: true,
      write: false,
      outdir: "edge-check-out", // never written; esbuild wants one for several entries
      metafile: true,
      platform: "neutral",
      format: "esm",
      target: "es2022",
      external: EXTERNAL,
      logLevel: "silent",
    });
  } catch (error) {
    const errors = (error as { errors?: { text: string }[] }).errors;
    return (errors ?? [{ text: String(error) }]).map((e) => `bundle failed: ${e.text}`);
  }

  for (const [output, meta] of Object.entries(result.metafile.outputs)) {
    for (const imported of meta.imports) {
      if (isBuiltin(imported.path)) problems.push(`${output} imports Node built-in "${imported.path}"`);
    }
  }
  for (const file of result.outputFiles) {
    const match = NODE_GLOBALS.exec(file.text);
    if (match) problems.push(`${file.path} uses Node-only "${match[0]}"`);
  }
  return problems;
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  const entries = process.argv.slice(2);
  if (!entries.length) {
    console.error("usage: edge-check <entry>...");
    process.exit(2);
  }
  const problems = await edgeViolations(entries);
  for (const problem of problems) console.error(`edge-check: ${problem}`);
  if (problems.length) process.exit(1);
  console.log(`edge-check: ${entries.length} entries bundle for a worker target with no Node-only APIs`);
}
