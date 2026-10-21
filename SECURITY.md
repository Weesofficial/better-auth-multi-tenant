# Security policy

This plugin decides which tenant a request belongs to and refuses sessions that
cross a tenant boundary. A bug here can expose one customer's data to another,
so security reports get priority over everything else.

## Supported versions

| Version | Supported |
| ------- | --------- |
| 0.3.x   | Yes       |
| < 0.3   | No. 0.3.0 closed the unbound-session gap described in the changelog, so please upgrade |

## Reporting a vulnerability

Please do **not** open a public issue.

Report it privately through GitHub:
[Report a vulnerability](https://github.com/Weesofficial/better-auth-multi-tenant/security/advisories/new).

Useful details:

- the plugin version, Better Auth version and Node version
- your `multiTenant()` options (with secrets removed)
- the request sequence that crosses the boundary, ideally as a failing test
  in the style of `test/plugin.test.ts`

We aim to acknowledge reports within 5 business days. Once a fix is ready we
publish a patched release and a GitHub security advisory, and credit you unless
you ask us not to.

## Scope

In scope: tenant resolution from the host, the `x-tenant` header override,
session-to-tenant binding, and the cross-tenant and unbound-session checks.

Out of scope: vulnerabilities in Better Auth itself (report those to the Better
Auth project), and data isolation inside your own queries, which this plugin
does not provide.
