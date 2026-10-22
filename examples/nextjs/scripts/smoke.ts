import { spawn, spawnSync } from "node:child_process";
import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import { mkdtempSync, rmSync } from "node:fs";
import http from "node:http";
import net from "node:net";
import { tmpdir } from "node:os";
import { join } from "node:path";

/**
 * Build and start the example on a free port with a throwaway database, sign up
 * on acme, replay the cookie on globex and expect a 403, check the suspended
 * tenant, then shut everything down and delete the database.
 */

const freePort = () =>
  new Promise<number>((resolve, reject) => {
    const probe = net.createServer();
    probe.on("error", reject);
    probe.listen(0, () => {
      const { port } = probe.address() as net.AddressInfo;
      probe.close(() => resolve(port));
    });
  });

const PORT = String(await freePort());
const dir = mkdtempSync(join(tmpdir(), "nextjs-example-"));
const env = {
  ...process.env,
  PORT,
  DATABASE_PATH: join(dir, "example.db"),
  BETTER_AUTH_SECRET: randomBytes(32).toString("base64"),
};

const run = (args: string[]) => {
  const res = spawnSync("npx", args, { env, stdio: "inherit" });
  if (res.status !== 0) throw new Error(`npx ${args.join(" ")} exited with ${res.status}`);
};

let server: ReturnType<typeof spawn> | undefined;
const stop = () => {
  try {
    process.kill(-server!.pid!);
  } catch {}
  rmSync(dir, { recursive: true, force: true });
};
process.on("exit", stop);

interface Reply {
  status: number;
  cookie?: string;
  body: string;
  json: () => Record<string, any>;
}

// `fetch` cannot set Host and `*.localhost` does not resolve everywhere, so
// connect to 127.0.0.1 and name the tenant in the Host header.
const request = (tenant: string, path: string, init: { method?: string; body?: unknown; cookie?: string } = {}) =>
  new Promise<Reply>((resolve, reject) => {
    const host = `${tenant}.localhost:${PORT}`;
    const req = http.request(
      {
        host: "127.0.0.1",
        port: PORT,
        path,
        method: init.method ?? "GET",
        timeout: 10000,
        headers: {
          host,
          origin: `http://${host}`,
          "content-type": "application/json",
          ...(init.cookie ? { cookie: init.cookie } : {}),
        },
      },
      (res) => {
        let body = "";
        res.on("data", (chunk) => (body += chunk));
        res.on("end", () =>
          resolve({
            status: res.statusCode ?? 0,
            cookie: res.headers["set-cookie"]?.[0]?.split(";")[0],
            body,
            json: () => JSON.parse(body),
          }),
        );
      },
    );
    req.on("timeout", () => req.destroy(new Error("request timed out")));
    req.on("error", reject);
    req.end(init.body ? JSON.stringify(init.body) : undefined);
  });

async function waitReady() {
  let last = "no response";
  for (let i = 0; i < 120; i++) {
    if (server!.exitCode !== null) throw new Error(`server exited with ${server!.exitCode}`);
    try {
      const res = await request("acme", "/api/auth/ok");
      if (res.status === 200) return;
      last = `${res.status} ${res.body}`;
    } catch (error) {
      last = String(error);
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`server did not become ready: ${last}`);
}

try {
  run(["tsx", "scripts/setup.ts"]);
  run(["next", "build"]);
  server = spawn("npx", ["next", "start", "-p", PORT], { env, stdio: "inherit", detached: true });
  await waitReady();

  const signUp = await request("acme", "/api/auth/sign-up/email", {
    method: "POST",
    body: { email: "user@example.com", password: "correct-horse-battery", name: "User" },
  });
  assert.equal(signUp.status, 200, signUp.body);
  assert.ok(signUp.cookie, "expected a session cookie");

  const own = await request("acme", "/api/auth/get-session", { cookie: signUp.cookie });
  assert.equal(own.status, 200);
  assert.equal(own.json().user?.email, "user@example.com");

  const foreign = await request("globex", "/api/auth/get-session", { cookie: signUp.cookie });
  assert.equal(foreign.status, 403, foreign.body);
  assert.equal(foreign.json().code, "CROSS_TENANT_SESSION");

  const suspended = await request("initech", "/api/auth/get-session");
  assert.equal(suspended.status, 403, suspended.body);
  assert.equal(suspended.json().code, "TENANT_INACTIVE");
  assert.equal(suspended.json().message, "This tenant is not active");

  const page = await request("initech", "/");
  assert.equal(page.status, 200, page.body);
  assert.ok(page.body.includes("The plugin answers 403 TENANT_INACTIVE here."), "suspended page message missing");

  console.log("smoke ok: acme session refused on globex with 403 CROSS_TENANT_SESSION; initech answers 403 TENANT_INACTIVE");
} finally {
  stop();
}
