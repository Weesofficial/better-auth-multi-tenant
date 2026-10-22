import { spawn } from "node:child_process";
import assert from "node:assert/strict";
import http from "node:http";

/** Start the example, sign up on acme, replay the cookie on globex and expect a 403. */

const PORT = process.env.PORT ?? "3000";

const server = spawn("npm", ["run", "start"], {
  env: { ...process.env, PORT },
  stdio: "inherit",
  detached: true,
});
const stop = () => {
  try {
    process.kill(-server.pid!);
  } catch {}
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
        path: `/api/auth${path}`,
        method: init.method ?? "GET",
        timeout: 5000,
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
  for (let i = 0; i < 240; i++) {
    if (server.exitCode !== null) throw new Error(`server exited with ${server.exitCode}`);
    try {
      const res = await request("acme", "/ok");
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
  await waitReady();

  const signUp = await request("acme", "/sign-up/email", {
    method: "POST",
    body: { email: "user@example.com", password: "correct-horse-battery", name: "User" },
  });
  assert.equal(signUp.status, 200, signUp.body);
  assert.ok(signUp.cookie, "expected a session cookie");

  const own = await request("acme", "/get-session", { cookie: signUp.cookie });
  assert.equal(own.status, 200);
  assert.equal(own.json().user?.email, "user@example.com");

  const foreign = await request("globex", "/get-session", { cookie: signUp.cookie });
  assert.equal(foreign.status, 403, foreign.body);
  assert.equal(foreign.json().code, "CROSS_TENANT_SESSION");

  console.log("smoke ok: acme session refused on globex with 403 CROSS_TENANT_SESSION");
} finally {
  stop();
}
