/**
 * Which host a request is addressed to, once a reverse proxy may sit in front.
 *
 * Like `resolver.ts`, this is pure and free of Better Auth imports. It is the
 * one place a client-supplied forwarding header can influence the tenant, so it
 * stays small and fails closed: anything it cannot parse is rejected, never
 * guessed at.
 */

/** What a `trustProxy` predicate gets to look at. `request` is absent for calls made through `auth.api`. */
export interface ProxyRequest {
  headers: Headers;
  request?: Request;
}

/**
 * - `false` (default): only the `Host` header.
 * - `true`: one trusted proxy, same as `1`.
 * - a number `n`: `n` trusted proxies in a row.
 * - a function: trusts one proxy for the requests it returns `true` for.
 */
export type TrustProxy = boolean | number | ((req: ProxyRequest) => boolean);

export type RequestHost =
  | { ok: true; host: string | null | undefined }
  | { ok: false };

/** Throw on a value that is not a valid {@link TrustProxy}, so a typo cannot silently disable or widen trust. */
export function assertTrustProxy(value: unknown): void {
  if (value === undefined || typeof value === "boolean" || typeof value === "function") return;
  if (typeof value === "number" && Number.isInteger(value) && value >= 0) return;
  throw new RangeError("trustProxy must be a boolean, a function, or a non-negative integer number of hops");
}

// A host name or IPv4 address, or a bracketed IPv6 literal, with an optional port.
const HOST = /^(?:[a-z0-9][a-z0-9.-]*|\[[0-9a-f:.]+\])(?::(\d{1,5}))?$/i;
const MAX_HOST_LENGTH = 255;
const MAX_HEADER_LENGTH = 4096;

function validHost(raw: string): string | null {
  const host = raw.trim();
  if (!host || host.length > MAX_HOST_LENGTH) return null;
  const match = HOST.exec(host);
  if (!match) return null;
  if (match[1] !== undefined && Number(match[1]) > 65535) return null;
  return host;
}

/** Split on `separator`, ignoring any inside double quotes (RFC 7239 quoted strings). */
function splitOutsideQuotes(input: string, separator: string): string[] {
  const parts: string[] = [];
  let current = "";
  let quoted = false;
  for (let i = 0; i < input.length; i++) {
    const char = input[i]!;
    if (char === "\\" && quoted) {
      current += char + (input[++i] ?? "");
    } else if (char === '"') {
      quoted = !quoted;
      current += char;
    } else if (char === separator && !quoted) {
      parts.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  parts.push(current);
  return parts;
}

/** The `host=` of each `Forwarded` element; `null` for an element without one or with a broken quote. */
function forwardedHosts(header: string): (string | null)[] {
  return splitOutsideQuotes(header, ",").map((element) => {
    for (const pair of splitOutsideQuotes(element, ";")) {
      const eq = pair.indexOf("=");
      if (eq === -1 || pair.slice(0, eq).trim().toLowerCase() !== "host") continue;
      let value = pair.slice(eq + 1).trim();
      if (value.startsWith('"')) {
        if (value.length < 2 || !value.endsWith('"')) return null;
        value = value.slice(1, -1).replace(/\\(.)/g, "$1");
      }
      return value;
    }
    return null;
  });
}

/**
 * The host the original client addressed.
 *
 * With `trustProxy` off, or a predicate that says no, this is the `Host` header
 * and nothing a client sends in `X-Forwarded-Host` or `Forwarded` matters.
 *
 * With it on, the forwarding header is a list with one entry per hop, each
 * proxy adding to the right. The right-most `hops` entries were written by your
 * proxies; the left-most of those is used, and everything further left is
 * client-controlled and ignored. A header with fewer entries than `hops`, an
 * entry that is not a plain host, or `X-Forwarded-Host` and `Forwarded` naming
 * different hosts, is rejected. With neither header present the request did not
 * come through a proxy and `Host` is used.
 */
export function requestHost(req: ProxyRequest, trustProxy: TrustProxy | undefined): RequestHost {
  const direct = req.headers.get("host");
  const hops =
    typeof trustProxy === "function" ? (trustProxy(req) === true ? 1 : 0) : trustProxy === true ? 1 : trustProxy || 0;
  if (hops === 0) return { ok: true, host: direct };

  const xfh = req.headers.get("x-forwarded-host");
  const forwarded = req.headers.get("forwarded");
  if (xfh === null && forwarded === null) return { ok: true, host: direct };
  if ((xfh?.length ?? 0) > MAX_HEADER_LENGTH || (forwarded?.length ?? 0) > MAX_HEADER_LENGTH) return { ok: false };

  const pick = (entries: (string | null)[]): string | null => {
    const entry = entries.length >= hops ? entries[entries.length - hops] : null;
    return entry == null ? null : validHost(entry);
  };
  const fromXfh = xfh === null ? undefined : pick(xfh.split(","));
  const fromForwarded = forwarded === null ? undefined : pick(forwardedHosts(forwarded));

  if (fromXfh === null || fromForwarded === null) return { ok: false };
  if (fromXfh !== undefined && fromForwarded !== undefined && fromXfh.toLowerCase() !== fromForwarded.toLowerCase()) {
    return { ok: false };
  }
  return { ok: true, host: (fromXfh ?? fromForwarded)! };
}
