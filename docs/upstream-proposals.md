# Upstream proposals for Better Auth

Gaps that [`better-auth-multi-tenant`](../README.md) cannot close through
Better Auth's public hooks. Nothing here has been opened upstream. File and line
references are to `better-auth` 1.7.12 and `@better-auth/passkey` 1.7.12 as
installed in `node_modules` (`dist/…`); re-check them against the version you
target. The compatibility table is in [auth-plugins.md](./auth-plugins.md).

## 1. Per-request plugin options (single instance, per-tenant relying party)

**Problem.** Options that identify "who we are" are plain values fixed when the
plugin is constructed, so one Better Auth instance serving many tenant hosts
cannot vary them per request:

- passkey: `rpID` and `origin` (`@better-auth/passkey/dist/index.mjs:13`, `:168`,
  `:277`, `:337`, `:354`, `:453`, `:476`). `getRpID` also reads only a string
  `baseURL`, so a dynamic `baseURL` object makes the default `localhost`.
- SIWE: `domain` is compared with the message domain and put in the CACAO
  (`dist/plugins/siwe/index.mjs:78`, `:109`).
- One Tap: `clientId`, the ID token audience (`dist/plugins/one-tap/index.mjs:50`).
- generic OAuth: a provider's `redirectURI`.

The only way to give tenant A and tenant B different values is one instance per
tenant (`createTenantAuth`), which also means one database per tenant.

**Minimal change.** Accept a function wherever these options take a value, called
with the endpoint context. No behaviour changes for plain values.

```ts
// types
rpID?: string | ((ctx: GenericEndpointContext) => string | Promise<string>);
origin?: string | string[] | null | ((ctx: GenericEndpointContext) => string | string[] | Promise<string | string[]>);
domain: string | ((ctx: GenericEndpointContext) => string);   // siwe
clientId?: string | string[] | ((ctx: GenericEndpointContext) => string | string[]); // oneTap

// implementation sketch (passkey)
const rpID = typeof opts.rpID === "function" ? await opts.rpID(ctx) : getRpID(opts, baseURLString);
```

**Example.** With this change the tenant plugin's resolved tenant is enough:

```ts
passkey({
  rpID: (ctx) => `${getTenantFromContext(ctx.context)!.slug}.example.com`,
  origin: (ctx) => `https://${getTenantFromContext(ctx.context)!.slug}.example.com`,
});
oneTap({ clientId: (ctx) => googleClientIdFor(getTenantFromContext(ctx.context)!.tenant) });
```

`SIWE`'s `verifyMessage` and `ensLookup` should receive the context too, for the
same reason.

## 2. Scoping verification identifiers

**Problem.** Plugins build verification identifiers from user input: email OTP
`<type>-<email>`, phone OTP `<phone>`, magic link a token. Rows written on
different tenants for the same email or phone share one identifier, and Better
Auth reads "the newest row" for it
(`dist/db/internal-adapter.mjs:733-773`). A code requested on tenant B replaces
tenant A's pending code for the same address. The tenant plugin can stamp rows and
refuse a cross-tenant redemption, but it cannot change the identifier a plugin
looks up, so it cannot give each tenant its own slot. The same shared slot
means `check-verification-otp` consumes the attempt budget of another tenant's
code.

**Minimal change.** One option applied in the single place identifiers are
turned into stored keys. `processIdentifier` is already called by
`createVerificationValue`, `findVerificationValue`, `deleteVerificationByIdentifier`,
`consumeVerificationValue`, `reserveVerificationValue` and
`updateVerificationByIdentifier` (`internal-adapter.mjs:718`, `:735`, `:776`,
`:804`, `:904`, `:941`):

```ts
advanced: {
  // A prefix for every verification identifier, from the current request.
  verificationIdentifierScope?: (ctx: GenericEndpointContext | null) => string | undefined;
}

// in processIdentifier's callers
const scoped = scope ? `${scope}:${identifier}` : identifier;
```

**Example.**

```ts
betterAuth({
  advanced: {
    verificationIdentifierScope: (ctx) => getTenantFromContext(ctx?.context)?.tenant.id,
  },
});
```

Each tenant then has its own OTP slot per email and phone, and the row-stamping
hook in this repository becomes unnecessary for plugins that go through the
internal adapter.

## 3. A failing `after` hook must not leave the endpoint's cookies

**Problem.** When an `after` hook throws an `APIError`, the response is the
error, but the `Set-Cookie` headers that the endpoint had already produced are
kept. A hook that wants to veto a sign-in after the fact therefore returns `403`
with a working session cookie. The two-factor plugin's trusted-device check runs
as an after hook, so any plugin that tries to refuse a sign-in there leaks the
session. Reproduction (a plugin with one hook is enough):

```ts
const throwsAfter = {
  id: "throws-after",
  hooks: {
    after: [{
      matcher: (c) => c.path === "/sign-in/email",
      handler: createAuthMiddleware(async () => {
        throw new APIError("FORBIDDEN", { message: "no" });
      }),
    }],
  },
};
// POST /sign-in/email with valid credentials
// -> 403, and `set-cookie: better-auth.session_token=…` is present.
```

**Minimal change.** When an `after` hook throws, discard the cookie headers the
endpoint set (and ideally delete the session it created in this request, since
`ctx.context.newSession` knows it), or document that `after` hooks must not
throw and offer a veto point before the cookie is written.

**Workaround here.** `better-auth-multi-tenant` strips the foreign trusted-device
cookie in a `before` hook, so the sign-in never reaches the after hook with it.

## 4. Request context in `usernameNormalization`

**Problem.** `user.username` is unique across the table, so a name taken on one
tenant is taken on all, and `/is-username-available` and sign-up reveal it
(see [auth-plugins.md](./auth-plugins.md#username)). The plugin already
normalises the username before it looks it up or stores it
(`dist/plugins/username/index.mjs:25-36`, used for sign-in at `:158`), but
`usernameNormalization(username)` does not receive the request.

**Minimal change.** Pass the endpoint context as a second argument.

```ts
usernameNormalization?: false | ((username: string, ctx: GenericEndpointContext) => string);
```

**Example.** Namespace the stored value per tenant, keep `displayUsername` as the
user typed it:

```ts
username({
  usernameNormalization: (name, ctx) => `${getTenantFromContext(ctx.context)!.tenant.id}:${name.toLowerCase()}`,
});
```

Names are then unique per tenant. (`phoneNumber` has no normalisation hook;
`phoneNumber`'s lookups would need the same, or a `where` scope.)

## 5. Database hooks for verification rows kept only in secondary storage

**Problem.** With `secondaryStorage` and `verification.storeInDatabase` unset,
`consumeVerificationValue` takes the `getAndDelete` branch
(`internal-adapter.mjs:818-828`) and never reaches `consumeOneWithHooks`, so
`verification.delete.before` does not run; `createVerificationValue` runs
`create.before` but a plugin cannot veto a read or consume. Any integrity check
a plugin hangs on `delete.before` is silently skipped for the most common
Redis setup. `better-auth-multi-tenant` can only warn at startup.

**Minimal change.** Read the entry first on that branch and run the `delete.before`
hooks with it (as the database branch does with its pre-snapshot) before calling
`getAndDelete`; abort without deleting when a hook returns `false` or throws.

```ts
const peeked = hydrateCachedVerification(await secondaryStorage.get(key));
if (peeked && (await runDeleteBefore("verification", peeked)) === false) return null;
return hydrateCachedVerification(await secondaryStorage.getAndDelete(key));
```
