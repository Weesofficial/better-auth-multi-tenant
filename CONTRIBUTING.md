# Contributing

Thanks for helping. Bug reports, docs fixes and pull requests are all welcome.

## Setup

Node 20.19 or later.

```bash
npm install
npm run typecheck
npm test
npm run build
```

CI runs the same four steps on Node 20, 22 and 24, and a pull request has to
pass all of them.

## Pull requests

- Keep each pull request to one change.
- Add or update a test for every behaviour change. Tests live in `test/`:
  - `resolver.test.ts`: pure host-to-tenant resolution.
  - `session-hooks.test.ts`: stamping sessions with a tenant.
  - `plugin.test.ts`: end-to-end tests against a real Better Auth instance.
- Add a line to the top of `CHANGELOG.md` under an `Unreleased` heading.
- Mark breaking changes clearly. Anything that lets a request through that
  used to be refused is breaking, even if it looks like a fix.

## Security-sensitive code

`src/resolver.ts` and the session checks in `src/index.ts` decide tenant
boundaries. Changes there need a test that shows both the allowed and the
refused case.

If you find a way across a tenant boundary, report it privately as described in
[SECURITY.md](./SECURITY.md) instead of opening an issue or pull request.

## Releases

Maintainers publish by creating a GitHub release whose tag matches the
`package.json` version (for example `v0.3.0`). The release workflow re-runs the
checks and publishes to npm with provenance.
