import { DEFAULT_SLUG_PATTERN } from "better-auth-multi-tenant";
import { auth, ORIGIN_PORT } from "@/lib/auth";

/**
 * Demo only: take the caller's session cookie and present it to another
 * tenant, as an attacker holding a stolen cookie would. Browsers never send a
 * host-only cookie to another subdomain, so this does it server side.
 */
export async function POST(request: Request) {
  const target = new URL(request.url).searchParams.get("tenant") ?? "";
  if (!DEFAULT_SLUG_PATTERN.test(target)) {
    return Response.json({ error: "bad tenant" }, { status: 400 });
  }
  const host = `${target}.localhost:${ORIGIN_PORT}`;
  const res = await auth.handler(
    new Request(`http://${host}/api/auth/get-session`, {
      headers: { host, cookie: request.headers.get("cookie") ?? "" },
    }),
  );
  const text = await res.text();
  return Response.json({ host, status: res.status, body: text ? JSON.parse(text) : null });
}
