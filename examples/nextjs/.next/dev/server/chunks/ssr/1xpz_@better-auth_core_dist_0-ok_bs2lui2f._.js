(()=>{"use strict";module.exports = [
"[project]/examples/nextjs/node_modules/@better-auth/core/dist/api/index.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "NO_STORE_HEADERS",
    ()=>NO_STORE_HEADERS,
    "createAuthEndpoint",
    ()=>createAuthEndpoint,
    "createAuthMiddleware",
    ()=>createAuthMiddleware,
    "optionsMiddleware",
    ()=>optionsMiddleware
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$endpoint$2d$context$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/context/endpoint-context.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$is$2d$api$2d$error$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/utils/is-api-error.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-call/dist/index.mjs [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$call$2f$dist$2f$endpoint$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-call/dist/endpoint.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$call$2f$dist$2f$middleware$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-call/dist/middleware.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$call$2f$dist$2f$error$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-call/dist/error.mjs [app-rsc] (ecmascript)");
;
;
;
//#region src/api/index.ts
/**
* Response headers that forbid any intermediary (proxy, CDN, browser) from
* caching a response body. Credential-bearing responses (access/refresh tokens,
* ID tokens, client secrets, device codes) must carry them.
*
* Set `metadata: { noStore: true }` on an endpoint and {@link createAuthEndpoint}
* applies these to the responses its handler produces: the success body and any
* error the handler throws. A request rejected by schema or media-type
* validation before the handler runs is not covered, and carries no credentials
* to protect. Spread them into a hand-built `Response` or `APIError`'s headers
* for the rare endpoint that constructs its own response.
*
* @see https://datatracker.ietf.org/doc/html/rfc6749#section-5.1
*/ const NO_STORE_HEADERS = {
    "Cache-Control": "no-store",
    Pragma: "no-cache"
};
/**
* Better-call's createEndpoint re-throws APIError without exposing the headers
* accumulated on ctx.responseHeaders (e.g. Set-Cookie from deleteSessionCookie
* before throw). Attach them to the error via kAPIErrorHeaderSymbol — matching
* better-call's createMiddleware contract so the outer pipeline can merge them
* into the response.
*/ function attachResponseHeadersToAPIError(responseHeaders, e) {
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$is$2d$api$2d$error$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isAPIError"])(e) || !responseHeaders) return;
    Object.defineProperty(e, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$call$2f$dist$2f$error$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["kAPIErrorHeaderSymbol"], {
        enumerable: false,
        configurable: true,
        value: responseHeaders,
        writable: false
    });
}
const optionsMiddleware = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$call$2f$dist$2f$middleware$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createMiddleware"])(async ()=>{
    /**
	* This will be passed on the instance of
	* the context. Used to infer the type
	* here.
	*/ return {};
});
const createAuthMiddleware = __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$call$2f$dist$2f$middleware$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createMiddleware"].create({
    use: [
        optionsMiddleware,
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$call$2f$dist$2f$middleware$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createMiddleware"])(async ()=>{
            return {};
        })
    ]
});
const createEndpointWithAuthContext = __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$call$2f$dist$2f$endpoint$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createEndpoint"].create({
    use: [
        optionsMiddleware
    ]
});
function wrapEndpointHandler(handler, options) {
    const noStore = options.metadata?.noStore === true;
    return async (context)=>{
        if (noStore) for (const [name, value] of Object.entries(NO_STORE_HEADERS))context.setHeader(name, value);
        try {
            return await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$endpoint$2d$context$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["runWithEndpointContext"])(context, ()=>handler(context));
        } catch (error) {
            attachResponseHeadersToAPIError(context.responseHeaders, error);
            throw error;
        }
    };
}
function createAuthEndpoint(...args) {
    if (args.length === 3) {
        const [path, options, handler] = args;
        return createEndpointWithAuthContext(path, options, wrapEndpointHandler(handler, options));
    }
    const [options, handler] = args;
    return createEndpointWithAuthContext(options, wrapEndpointHandler(handler, options));
}
/**
* Set `metadata.SERVER_ONLY` while preserving any existing metadata
* (`$Infer`, `openapi`, ...).
*/ function withServerOnly(options) {
    return {
        ...options,
        metadata: {
            ...options.metadata,
            SERVER_ONLY: true
        }
    };
}
/**
* Declare a **server-only** endpoint.
*
* The endpoint is callable through `auth.api.*` from trusted server code but is
* never registered on the HTTP router and never emitted into the OpenAPI
* schema. It takes no path because it has no URL to be reached at.
*
* Prefer this over the path-less `createAuthEndpoint({ ... }, handler)` form.
* Setting `metadata.SERVER_ONLY` makes the intent explicit at the call site and
* keeps the endpoint off the HTTP surface even if a path is later added by
* mistake: better-call's router skips an endpoint when its path is missing *or*
* when `SERVER_ONLY` is set, so the two together are defense in depth. Relying
* on path omission alone is invisible and one keystroke away from exposure.
*
* @example
* ```ts
* viewBackupCodes: createAuthEndpoint.serverOnly(
* 	{ method: "POST", body: schema },
* 	async (ctx) => { ... },
* )
* ```
*/ createAuthEndpoint.serverOnly = (options, handler)=>createAuthEndpoint(withServerOnly(options), handler);
;
}),
"[project]/examples/nextjs/node_modules/@better-auth/core/dist/async_hooks/index.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getAsyncLocalStorage",
    ()=>getAsyncLocalStorage
]);
//#region src/async_hooks/index.ts
let cachedAsyncLocalStorageConstructor;
let availabilityWarningLogged = false;
function getBuiltinAsyncLocalStorage() {
    try {
        return globalThis.process?.getBuiltinModule?.("node:async_hooks")?.AsyncLocalStorage;
    } catch  {
        return;
    }
}
async function getAsyncLocalStorage() {
    if (cachedAsyncLocalStorageConstructor) return cachedAsyncLocalStorageConstructor;
    const builtinConstructor = getBuiltinAsyncLocalStorage();
    if (builtinConstructor) {
        cachedAsyncLocalStorageConstructor ??= builtinConstructor;
        return cachedAsyncLocalStorageConstructor;
    }
    try {
        const { AsyncLocalStorage: constructor } = await import(/* @vite-ignore */ /* webpackIgnore: true */ "node:async_hooks");
        cachedAsyncLocalStorageConstructor ??= constructor;
        return cachedAsyncLocalStorageConstructor;
    } catch (err) {
        const constructor = globalThis.AsyncLocalStorage;
        if (typeof constructor === "function") {
            cachedAsyncLocalStorageConstructor ??= constructor;
            return cachedAsyncLocalStorageConstructor;
        }
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        if (!availabilityWarningLogged) {
            availabilityWarningLogged = true;
            console.warn("[better-auth] Warning: AsyncLocalStorage is not available in this environment. Some features may not work as expected.");
            console.warn("[better-auth] Please read more about this warning at https://better-auth.com/docs/installation#mount-handler");
            console.warn("[better-auth] If you are using Cloudflare Workers, please see: https://developers.cloudflare.com/workers/configuration/compatibility-flags/#nodejs-compatibility-flag");
        }
        throw err;
    }
}
;
}),
"[project]/examples/nextjs/node_modules/@better-auth/core/dist/context/endpoint-context.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getCurrentAuthContext",
    ()=>getCurrentAuthContext,
    "getCurrentAuthContextAsyncLocalStorage",
    ()=>getCurrentAuthContextAsyncLocalStorage,
    "getCurrentAuthEndpointContext",
    ()=>getCurrentAuthEndpointContext,
    "runWithEndpointContext",
    ()=>runWithEndpointContext,
    "tryGetCurrentAuthEndpointContext",
    ()=>tryGetCurrentAuthEndpointContext
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$global$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/context/global.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$async_hooks$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/async_hooks/index.mjs [app-rsc] (ecmascript)");
;
;
//#region src/context/endpoint-context.ts
const getExistingEndpointContextStorage = ()=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$global$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["__getBetterAuthGlobal"])().context.endpointContextAsyncStorage;
};
const getOrCreateEndpointContextStorage = async ()=>{
    const existing = getExistingEndpointContextStorage();
    if (existing) return existing;
    const AsyncLocalStorage = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$async_hooks$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getAsyncLocalStorage"])();
    const globalContext = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$global$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["__getBetterAuthGlobal"])().context;
    return globalContext.endpointContextAsyncStorage ??= new AsyncLocalStorage();
};
/**
* @deprecated Use `getCurrentAuthEndpointContext`,
* `tryGetCurrentAuthEndpointContext`, or `runWithEndpointContext` instead.
*/ async function getCurrentAuthContextAsyncLocalStorage() {
    return getOrCreateEndpointContextStorage();
}
/**
* Returns the current auth endpoint context, or `undefined` when called outside
* of `runWithEndpointContext`.
*/ function tryGetCurrentAuthEndpointContext() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$global$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["__getCurrentEndpointContext"])();
}
/**
* Returns the current auth endpoint context.
*
* @throws When called outside of `runWithEndpointContext`.
*/ function getCurrentAuthEndpointContext() {
    const authEndpointContext = tryGetCurrentAuthEndpointContext();
    if (!authEndpointContext) throw new Error("No auth context found. Please make sure you are calling this function within a `runWithEndpointContext` callback.");
    return authEndpointContext;
}
/**
* @deprecated Use `getCurrentAuthEndpointContext` instead.
*/ async function getCurrentAuthContext() {
    return getCurrentAuthEndpointContext();
}
async function runWithEndpointContext(authEndpointContext, fn) {
    return (await getOrCreateEndpointContextStorage()).run(authEndpointContext, fn);
}
;
}),
"[project]/examples/nextjs/node_modules/@better-auth/core/dist/context/global.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__getBetterAuthGlobal",
    ()=>__getBetterAuthGlobal,
    "__getCurrentEndpointContext",
    ()=>__getCurrentEndpointContext,
    "getBetterAuthVersion",
    ()=>getBetterAuthVersion
]);
//#region src/context/global.ts
const symbol = Symbol.for("better-auth:global");
let bind = null;
const __context = {};
const __betterAuthVersion = "1.7.12";
/**
* We store context instance in the globalThis.
*
* The reason we do this is that some bundlers, web framework, or package managers might
* create multiple copies of BetterAuth in the same process intentionally or unintentionally.
*
* For example, yarn v1, Next.js, SSR, Vite...
*
* @internal
*/ function __getBetterAuthGlobal() {
    if (!globalThis[symbol]) {
        globalThis[symbol] = {
            version: __betterAuthVersion,
            epoch: 1,
            context: __context
        };
        bind = globalThis[symbol];
    }
    bind = globalThis[symbol];
    if (bind.version !== __betterAuthVersion) {
        bind.version = __betterAuthVersion;
        bind.epoch++;
    }
    return globalThis[symbol];
}
function __getCurrentEndpointContext() {
    return __getBetterAuthGlobal().context.endpointContextAsyncStorage?.getStore();
}
function getBetterAuthVersion() {
    return __getBetterAuthGlobal().version;
}
;
}),
"[project]/examples/nextjs/node_modules/@better-auth/core/dist/context/request-state.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "defineRequestState",
    ()=>defineRequestState,
    "getCurrentRequestState",
    ()=>getCurrentRequestState,
    "getRequestStateAsyncLocalStorage",
    ()=>getRequestStateAsyncLocalStorage,
    "hasRequestState",
    ()=>hasRequestState,
    "runWithRequestState",
    ()=>runWithRequestState
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$global$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/context/global.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$async_hooks$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/async_hooks/index.mjs [app-rsc] (ecmascript)");
;
;
//#region src/context/request-state.ts
const ensureAsyncStorage = async ()=>{
    const betterAuthGlobal = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$global$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["__getBetterAuthGlobal"])();
    const existing = betterAuthGlobal.context.requestStateAsyncStorage;
    if (existing) return existing;
    const AsyncLocalStorage = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$async_hooks$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getAsyncLocalStorage"])();
    betterAuthGlobal.context.requestStateAsyncStorage ??= new AsyncLocalStorage();
    return betterAuthGlobal.context.requestStateAsyncStorage;
};
async function getRequestStateAsyncLocalStorage() {
    return ensureAsyncStorage();
}
async function hasRequestState() {
    return (await ensureAsyncStorage()).getStore() !== void 0;
}
async function getCurrentRequestState() {
    const store = (await ensureAsyncStorage()).getStore();
    if (!store) throw new Error("No request state found. Please make sure you are calling this function within a `runWithRequestState` callback.");
    return store;
}
async function runWithRequestState(store, fn) {
    return (await ensureAsyncStorage()).run(store, fn);
}
function defineRequestState(initFn) {
    const ref = Object.freeze({});
    return {
        get ref () {
            return ref;
        },
        async get () {
            const store = await getCurrentRequestState();
            if (!store.has(ref)) {
                const initialValue = await initFn();
                store.set(ref, initialValue);
                return initialValue;
            }
            return store.get(ref);
        },
        async set (value) {
            (await getCurrentRequestState()).set(ref, value);
        }
    };
}
;
}),
"[project]/examples/nextjs/node_modules/@better-auth/core/dist/context/transaction.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getCurrentAdapter",
    ()=>getCurrentAdapter,
    "getCurrentDBAdapterAsyncLocalStorage",
    ()=>getCurrentDBAdapterAsyncLocalStorage,
    "queueAfterTransactionHook",
    ()=>queueAfterTransactionHook,
    "runWithAdapter",
    ()=>runWithAdapter,
    "runWithTransaction",
    ()=>runWithTransaction
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$global$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/context/global.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$db$2f$schema$2d$check$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/db/schema-check.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$logger$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/env/logger.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$async_hooks$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/async_hooks/index.mjs [app-rsc] (ecmascript)");
;
;
;
;
//#region src/context/transaction.ts
const ensureAsyncStorage = async ()=>{
    const betterAuthGlobal = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$global$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["__getBetterAuthGlobal"])();
    const existing = betterAuthGlobal.context.adapterAsyncStorage;
    if (existing) return existing;
    const AsyncLocalStorage = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$async_hooks$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getAsyncLocalStorage"])();
    betterAuthGlobal.context.adapterAsyncStorage ??= new AsyncLocalStorage();
    return betterAuthGlobal.context.adapterAsyncStorage;
};
/**
* This is for internal use only. Most users should use `getCurrentAdapter` instead.
*
* It is exposed for advanced use cases where you need direct access to the AsyncLocalStorage instance.
*/ const getCurrentDBAdapterAsyncLocalStorage = async ()=>{
    return ensureAsyncStorage();
};
const getCurrentAdapter = async (fallback)=>{
    return ensureAsyncStorage().then((als)=>{
        return als.getStore()?.adapter || fallback;
    }).catch(()=>{
        return fallback;
    });
};
const runWithAdapter = async (adapter, fn)=>{
    let called = false;
    return ensureAsyncStorage().then(async (als)=>{
        called = true;
        const pendingHooks = [];
        let result;
        let error;
        let hasError = false;
        try {
            result = await als.run({
                adapter,
                pendingHooks,
                isTransactionActive: false
            }, fn);
        } catch (err) {
            error = err;
            hasError = true;
        }
        for (const hook of pendingHooks)await hook();
        if (hasError) throw error;
        return result;
    }).catch((err)=>{
        if (!called) return fn();
        throw err;
    });
};
/**
* Runs `fn` in a transaction on `adapter`, joining the current one when
* already inside it, then runs the hooks queued with
* `queueAfterTransactionHook` once the work commits.
*
* When the adapter has no real transaction (`transaction: false`), writes are
* applied as they happen and cannot roll back, so queued hooks also run when
* `fn` throws. The original error is still rethrown; a hook failure on that
* path goes to `onAfterCommitHookError`, or is logged when none is given.
*/ const runWithTransaction = async (adapter, fn, options)=>{
    let called = false;
    return ensureAsyncStorage().then(async (als)=>{
        called = true;
        if (als.getStore()?.isTransactionActive) return fn();
        const pendingSchemaCheck = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$db$2f$schema$2d$check$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["runtimeSchemaCheckFor"])(adapter)?.();
        if (pendingSchemaCheck) await pendingSchemaCheck;
        let pendingHooks = [];
        let result;
        let error;
        let hasError = false;
        try {
            result = await adapter.transaction(async (trx)=>{
                pendingHooks = [];
                return als.run({
                    adapter: trx,
                    pendingHooks,
                    isTransactionActive: true
                }, fn);
            });
        } catch (e) {
            hasError = true;
            error = e;
        }
        const runPendingHooks = async (unhandledErrors)=>{
            for (const hook of pendingHooks)try {
                await hook();
            } catch (hookError) {
                if (!options?.onAfterCommitHookError) {
                    if (unhandledErrors === "throw") throw hookError;
                    try {
                        __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$logger$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["logger"].error("Failed to run an after-commit hook for work that could not roll back", hookError);
                    } catch  {}
                    continue;
                }
                try {
                    await options.onAfterCommitHookError(hookError);
                } catch  {}
            }
        };
        if (hasError) {
            if (adapter.options?.adapterConfig.transaction === false) await runPendingHooks("log");
            throw error;
        }
        await runPendingHooks("throw");
        return result;
    }).catch((err)=>{
        if (!called) return fn();
        throw err;
    });
};
/**
* Queue a hook to be executed after the current transaction commits.
* If not in a transaction, the hook will execute immediately.
*
* When the adapter has no real transaction (`transaction: false`), the hook
* also runs if the surrounding work fails, since its writes were kept.
*/ const queueAfterTransactionHook = async (hook, options)=>{
    const executeHook = async ()=>{
        try {
            await hook();
        } catch (error) {
            if (!options?.onError) throw error;
            await options.onError(error);
        }
    };
    let storage;
    try {
        storage = await ensureAsyncStorage();
    } catch  {
        return executeHook();
    }
    const store = storage.getStore();
    if (!store?.isTransactionActive) return executeHook();
    store.pendingHooks.push(executeHook);
};
;
}),
"[project]/examples/nextjs/node_modules/@better-auth/core/dist/db/adapter/atomic-fallback.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createAtomicFallbacks",
    ()=>createAtomicFallbacks
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/error/index.mjs [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/zod/v4/classic/schemas.js [app-rsc] (ecmascript)");
;
;
//#region src/db/adapter/atomic-fallback.ts
const MAX_ATTEMPTS = 5;
const scalar = __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["union"]([
    __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["string"](),
    __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["number"](),
    __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["boolean"](),
    __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["date"]()
]).nullable();
const readSchema = __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["record"](__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["string"](), __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["unknown"]()).nullish();
const setSchema = __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["record"](__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["string"](), __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["unknown"]()).transform((values)=>{
    const assignments = {};
    for (const [field, value] of Object.entries(values))if (value !== void 0) assignments[field] = value;
    return assignments;
});
const mutationSchema = __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["object"]({
    increment: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["record"](__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["string"](), __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["number"]()),
    set: setSchema.optional()
});
const counterSchema = __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["number"]().nullish();
function createAtomicFallbacks(context) {
    const { adapter, adapterId } = context;
    const outputId = Object.entries(context.mapKeysTransformOutput ?? {}).find(([, field])=>field === "id")?.[0] ?? "id";
    async function idWhere(row, model, action) {
        const mappedId = context.mapKeysTransformInput?.id || context.getFieldName({
            model,
            field: "id"
        });
        if (row[mappedId] === void 0 || row[mappedId] === null) throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["BetterAuthError"](`Adapter "${context.adapterId}" must return the row id for atomic fallbacks.`);
        const id = (await context.transformOutput(row, model, [
            outputId
        ], void 0))?.id;
        if (typeof id !== "string" && typeof id !== "number") throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["BetterAuthError"](`Adapter "${context.adapterId}" must expose a logical string or number id through its output transform.`);
        const [condition] = context.transformWhereClause({
            model,
            where: [
                {
                    field: "id",
                    value: id
                }
            ],
            action
        });
        if (!condition) throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["BetterAuthError"]("The atomic fallback id condition was transformed away.");
        return condition;
    }
    async function readRow({ model, modelKey, where }) {
        const result = readSchema.safeParse(await adapter.findOne({
            model,
            modelKey,
            where
        }));
        if (!result.success) throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["BetterAuthError"](`Adapter "${adapterId}" must return a row snapshot or null.`);
        return result.data ?? null;
    }
    async function snapshotGuard(row, fields, request, action) {
        const id = await idWhere(row, request.modelKey, action);
        const hasOr = request.where.some((clause)=>clause.connector === "OR");
        const guard = hasOr ? [
            id
        ] : [
            ...request.where,
            id
        ];
        const keys = new Set(fields);
        for (const field of keys){
            if (field === id.field) continue;
            const value = scalar.safeParse(row[field] ?? null);
            if (!value.success) {
                if (hasOr && request.where.some((clause)=>clause.field === field)) throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["BetterAuthError"](`Adapter "${adapterId}" must implement native atomic methods for OR predicates on structured values.`);
                continue;
            }
            guard.push({
                field,
                value: value.data,
                operator: "eq",
                connector: "AND",
                mode: "sensitive"
            });
        }
        return guard;
    }
    function changedOne(count) {
        if (count !== 0 && count !== 1) throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["BetterAuthError"](`Adapter "${adapterId}" must return an affected row count of 0 or 1 from an atomic fallback.`);
        return count === 1;
    }
    async function consumeOne(request) {
        const { model, where } = request;
        const row = await readRow(request);
        if (row === null) return null;
        const guard = await snapshotGuard(row, [
            ...Object.keys(row),
            ...where.map(({ field })=>field)
        ], request, "consumeOne");
        return changedOne(await adapter.deleteMany({
            model,
            modelKey: request.modelKey,
            where: guard
        })) ? row : null;
    }
    async function incrementOne(request) {
        const { model, where } = request;
        const mutation = mutationSchema.safeParse(request);
        if (!mutation.success) throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["BetterAuthError"]("incrementOne requires finite increments and a set object for the atomic fallback.");
        const { increment, set } = mutation.data;
        const deltas = Object.entries(increment);
        const fields = [
            ...where.map(({ field })=>field),
            ...Object.keys(increment),
            ...Object.keys(set ?? {})
        ];
        for(let attempt = 0; attempt < MAX_ATTEMPTS; attempt++){
            const row = await readRow(request);
            if (row === null) return null;
            const update = {
                ...set
            };
            for (const [field, delta] of deltas){
                const previous = counterSchema.safeParse(row[field]);
                if (!previous.success) throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["BetterAuthError"](`Adapter "${adapterId}" must return finite numeric counter values or null for atomic increments.`);
                const current = previous.data ?? 0;
                const next = current + delta;
                if (!Number.isFinite(next) || delta !== 0 && next === current) throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["BetterAuthError"](`Adapter "${adapterId}" cannot represent the requested counter increment safely.`);
                update[field] = next;
            }
            const guard = await snapshotGuard(row, fields, request, "incrementOne");
            if (Object.entries(update).every(([field, value])=>{
                const previous = row[field];
                if (previous instanceof Date && value instanceof Date) return previous.getTime() === value.getTime();
                return Object.is(previous, value);
            })) return row;
            if (changedOne(await adapter.updateMany({
                model,
                modelKey: request.modelKey,
                where: guard,
                update
            }))) return {
                ...row,
                ...update
            };
        }
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["BetterAuthError"](`Adapter "${adapterId}" could not complete an atomic increment due to contention. Retry the operation or implement incrementOne natively.`);
    }
    return {
        consumeOne,
        incrementOne
    };
}
;
}),
"[project]/examples/nextjs/node_modules/@better-auth/core/dist/db/adapter/factory.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createAdapterFactory",
    ()=>createAdapterFactory
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/error/index.mjs [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$db$2f$get$2d$tables$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/db/get-tables.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$color$2d$depth$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/env/color-depth.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$logger$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/env/logger.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$db$2f$adapter$2f$get$2d$default$2d$model$2d$name$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/db/adapter/get-default-model-name.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$db$2f$adapter$2f$get$2d$id$2d$field$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/db/adapter/get-id-field.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$json$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/utils/json.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$db$2f$adapter$2f$atomic$2d$fallback$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/db/adapter/atomic-fallback.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$db$2f$adapter$2f$get$2d$default$2d$field$2d$name$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/db/adapter/get-default-field-name.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$db$2f$adapter$2f$get$2d$field$2d$attributes$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/db/adapter/get-field-attributes.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$db$2f$adapter$2f$get$2d$field$2d$name$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/db/adapter/get-field-name.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$db$2f$adapter$2f$get$2d$model$2d$name$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/db/adapter/get-model-name.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$db$2f$adapter$2f$utils$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/db/adapter/utils.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$instrumentation$2f$attributes$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/instrumentation/attributes.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$instrumentation$2f$tracer$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/instrumentation/tracer.mjs [app-rsc] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
;
;
;
;
//#region src/db/adapter/factory.ts
let debugLogs = [];
let transactionId = -1;
const createAsIsTransaction = (adapter)=>(fn)=>fn(adapter);
const createAdapterFactory = ({ adapter: customAdapter, config: cfg })=>(options)=>{
        const withSpan = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$instrumentation$2f$tracer$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createWithSpan"])(options);
        const uniqueAdapterFactoryInstanceId = Math.random().toString(36).substring(2, 15);
        const config = {
            ...cfg,
            supportsBooleans: cfg.supportsBooleans ?? true,
            supportsDates: cfg.supportsDates ?? true,
            supportsJSON: cfg.supportsJSON ?? false,
            adapterName: cfg.adapterName ?? cfg.adapterId,
            supportsNumericIds: cfg.supportsNumericIds ?? true,
            supportsUUIDs: cfg.supportsUUIDs ?? false,
            supportsArrays: cfg.supportsArrays ?? false,
            transaction: cfg.transaction ?? false,
            disableTransformInput: cfg.disableTransformInput ?? false,
            disableTransformOutput: cfg.disableTransformOutput ?? false,
            disableTransformJoin: cfg.disableTransformJoin ?? false
        };
        if (options.advanced?.database?.generateId === "serial" && config.supportsNumericIds === false) throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["BetterAuthError"](`[${config.adapterName}] Your database or database adapter does not support numeric ids. Please disable "useNumberId" in your config.`);
        const schema = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$db$2f$get$2d$tables$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getAuthTables"])(options);
        const debugLog = (...args)=>{
            if (config.debugLogs === true || typeof config.debugLogs === "object") {
                const logger = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$logger$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createLogger"])({
                    level: "info"
                });
                if (typeof config.debugLogs === "object" && "isRunningAdapterTests" in config.debugLogs) {
                    if (config.debugLogs.isRunningAdapterTests) {
                        args.shift();
                        debugLogs.push({
                            instance: uniqueAdapterFactoryInstanceId,
                            args
                        });
                    }
                    return;
                }
                if (typeof config.debugLogs === "object" && config.debugLogs.logCondition && !config.debugLogs.logCondition?.()) return;
                if (typeof args[0] === "object" && "method" in args[0]) {
                    const method = args.shift().method;
                    if (typeof config.debugLogs === "object") {
                        if (method === "create" && !config.debugLogs.create) return;
                        else if (method === "update" && !config.debugLogs.update) return;
                        else if (method === "updateMany" && !config.debugLogs.updateMany) return;
                        else if (method === "findOne" && !config.debugLogs.findOne) return;
                        else if (method === "findMany" && !config.debugLogs.findMany) return;
                        else if (method === "delete" && !config.debugLogs.delete) return;
                        else if (method === "deleteMany" && !config.debugLogs.deleteMany) return;
                        else if (method === "consumeOne" && !config.debugLogs.consumeOne) return;
                        else if (method === "incrementOne" && !config.debugLogs.incrementOne) return;
                        else if (method === "count" && !config.debugLogs.count) return;
                    }
                    logger.info(`[${config.adapterName}]`, ...args);
                } else logger.info(`[${config.adapterName}]`, ...args);
            }
        };
        const logger = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$logger$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createLogger"])(options.logger);
        const getDefaultModelName = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$db$2f$adapter$2f$get$2d$default$2d$model$2d$name$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["initGetDefaultModelName"])({
            usePlural: config.usePlural,
            schema
        });
        const getDefaultFieldName = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$db$2f$adapter$2f$get$2d$default$2d$field$2d$name$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["initGetDefaultFieldName"])({
            usePlural: config.usePlural,
            schema
        });
        const getModelName = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$db$2f$adapter$2f$get$2d$model$2d$name$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["initGetModelName"])({
            usePlural: config.usePlural,
            schema
        });
        const getFieldName = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$db$2f$adapter$2f$get$2d$field$2d$name$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["initGetFieldName"])({
            schema,
            usePlural: config.usePlural
        });
        const idField = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$db$2f$adapter$2f$get$2d$id$2d$field$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["initGetIdField"])({
            schema,
            options,
            usePlural: config.usePlural,
            disableIdGeneration: config.disableIdGeneration,
            customIdGenerator: config.customIdGenerator,
            supportsUUIDs: config.supportsUUIDs
        });
        const getFieldAttributes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$db$2f$adapter$2f$get$2d$field$2d$attributes$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["initGetFieldAttributes"])({
            schema,
            options,
            usePlural: config.usePlural,
            disableIdGeneration: config.disableIdGeneration,
            customIdGenerator: config.customIdGenerator
        });
        const transformInput = async (data, defaultModelName, action, forceAllowId)=>{
            const transformedData = {};
            const fields = schema[defaultModelName].fields;
            const newMappedKeys = config.mapKeysTransformInput ?? {};
            const useNumberId = options.advanced?.database?.generateId === "serial";
            fields.id = idField({
                customModelName: defaultModelName,
                forceAllowId: forceAllowId && "id" in data
            });
            for(const field in fields){
                let value = data[field];
                const fieldAttributes = fields[field];
                const newFieldName = newMappedKeys[field] || fields[field].fieldName || field;
                if (value === void 0 && (fieldAttributes.defaultValue === void 0 && !fieldAttributes.transform?.input && !(action === "update" && fieldAttributes.onUpdate) || action === "update" && !fieldAttributes.onUpdate)) continue;
                if (fieldAttributes && fieldAttributes.type === "date" && !(value instanceof Date) && typeof value === "string") try {
                    value = new Date(value);
                } catch  {
                    logger.error("[Adapter Factory] Failed to convert string to date", {
                        value,
                        field
                    });
                }
                let newValue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$db$2f$adapter$2f$utils$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["withApplyDefault"])(value, fieldAttributes, action);
                if (fieldAttributes.transform?.input) newValue = await fieldAttributes.transform.input(newValue);
                if (fieldAttributes.references?.field === "id" && useNumberId) if (Array.isArray(newValue)) newValue = newValue.map((x)=>x !== null ? Number(x) : null);
                else newValue = newValue !== null ? Number(newValue) : null;
                else if (config.supportsJSON === false && typeof newValue === "object" && fieldAttributes.type === "json") newValue = JSON.stringify(newValue);
                else if (config.supportsArrays === false && Array.isArray(newValue) && (fieldAttributes.type === "string[]" || fieldAttributes.type === "number[]")) newValue = JSON.stringify(newValue);
                else if (config.supportsDates === false && newValue instanceof Date && fieldAttributes.type === "date") newValue = newValue.toISOString();
                else if (config.supportsBooleans === false && typeof newValue === "boolean") newValue = newValue ? 1 : 0;
                if (config.customTransformInput) newValue = config.customTransformInput({
                    data: newValue,
                    action,
                    field: newFieldName,
                    fieldAttributes,
                    model: getModelName(defaultModelName),
                    schema,
                    options
                });
                if (newValue !== void 0) transformedData[newFieldName] = newValue;
            }
            return transformedData;
        };
        const transformOutput = async (data, inputModel, select = [], join)=>{
            const transformSingleOutput = async (data, inputModel, select = [])=>{
                if (!data) return null;
                const modelKey = getDefaultModelName(inputModel);
                const newMappedKeys = config.mapKeysTransformOutput ?? {};
                const transformedData = {};
                const tableSchema = schema[modelKey].fields;
                const idKey = Object.entries(newMappedKeys).find(([_, v])=>v === "id")?.[0];
                tableSchema[idKey ?? "id"] = {
                    type: options.advanced?.database?.generateId === "serial" ? "number" : "string"
                };
                for(const key in tableSchema){
                    if (select.length && !select.includes(key)) continue;
                    const field = tableSchema[key];
                    if (field) {
                        const originalKey = field.fieldName || key;
                        let newValue = data[Object.entries(newMappedKeys).find(([_, v])=>v === originalKey)?.[0] || originalKey];
                        if (field.transform?.output) newValue = await field.transform.output(newValue);
                        const newFieldName = newMappedKeys[key] || key;
                        if (originalKey === "id" || field.references?.field === "id") {
                            if (typeof newValue !== "undefined" && newValue !== null) newValue = String(newValue);
                        } else if (config.supportsJSON === false && typeof newValue === "string" && field.type === "json") newValue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$json$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["safeJSONParse"])(newValue);
                        else if (config.supportsArrays === false && typeof newValue === "string" && (field.type === "string[]" || field.type === "number[]")) newValue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$json$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["safeJSONParse"])(newValue);
                        else if (config.supportsDates === false && typeof newValue === "string" && field.type === "date") newValue = new Date(newValue);
                        else if (config.supportsBooleans === false && typeof newValue === "number" && field.type === "boolean") newValue = newValue === 1;
                        if (config.customTransformOutput) newValue = config.customTransformOutput({
                            data: newValue,
                            field: newFieldName,
                            fieldAttributes: field,
                            select,
                            model: getModelName(modelKey),
                            schema,
                            options
                        });
                        transformedData[newFieldName] = newValue;
                    }
                }
                return transformedData;
            };
            if (!join || Object.keys(join).length === 0) return await transformSingleOutput(data, inputModel, select);
            const modelKey = getDefaultModelName(inputModel);
            const transformedData = await transformSingleOutput(data, modelKey, select);
            const requiredModels = Object.entries(join).map(([model, joinConfig])=>({
                    modelName: model,
                    defaultModelName: joinConfig.modelKey ?? getDefaultModelName(model),
                    joinConfig
                }));
            if (!data) return null;
            for (const { modelName, defaultModelName, joinConfig } of requiredModels){
                let joinedData = await (async ()=>{
                    if (options.advanced?.database?.joins) {
                        if (modelName in data) return data[modelName];
                    }
                    return await handleFallbackJoin({
                        baseModel: modelKey,
                        baseData: transformedData,
                        joinModel: modelName,
                        specificJoinConfig: joinConfig
                    });
                })();
                if (joinedData === void 0 || joinedData === null) joinedData = joinConfig.relation === "one-to-one" ? null : [];
                if (joinConfig.relation === "one-to-many" && !Array.isArray(joinedData)) joinedData = [
                    joinedData
                ];
                const transformed = [];
                if (Array.isArray(joinedData)) for (const item of joinedData){
                    const transformedItem = await transformSingleOutput(item, defaultModelName, []);
                    transformed.push(transformedItem);
                }
                else {
                    const transformedItem = await transformSingleOutput(joinedData, defaultModelName, []);
                    transformed.push(transformedItem);
                }
                transformedData[defaultModelName] = (joinConfig.relation === "one-to-one" ? transformed[0] : transformed) ?? null;
            }
            return transformedData;
        };
        const transformWhereClause = ({ model, where, action })=>{
            if (!where) return void 0;
            const newMappedKeys = config.mapKeysTransformInput ?? {};
            return where.map((w)=>{
                const { field: unsafe_field, value, operator = "eq", connector = "AND", mode = "sensitive" } = w;
                if (operator === "in") {
                    if (!Array.isArray(value)) throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["BetterAuthError"]("Value must be an array");
                }
                let newValue = value;
                const defaultModelName = getDefaultModelName(model);
                const defaultFieldName = getDefaultFieldName({
                    field: unsafe_field,
                    model
                });
                const fieldName = newMappedKeys[defaultFieldName] || getFieldName({
                    field: defaultFieldName,
                    model: defaultModelName
                });
                const fieldAttr = getFieldAttributes({
                    field: defaultFieldName,
                    model: defaultModelName
                });
                const useNumberId = options.advanced?.database?.generateId === "serial";
                if (defaultFieldName === "id" || fieldAttr.references?.field === "id") {
                    if (useNumberId) if (Array.isArray(value)) newValue = value.map(Number);
                    else newValue = Number(value);
                }
                if (fieldAttr.type === "date" && value instanceof Date && !config.supportsDates) newValue = value.toISOString();
                if (fieldAttr.type === "boolean" && typeof newValue === "string") newValue = newValue === "true";
                if (fieldAttr.type === "number") {
                    if (typeof newValue === "string" && newValue.trim() !== "") {
                        const parsed = Number(newValue);
                        if (!Number.isNaN(parsed)) newValue = parsed;
                    } else if (Array.isArray(newValue)) {
                        const parsed = newValue.map((v)=>typeof v === "string" && v.trim() !== "" ? Number(v) : NaN);
                        if (parsed.every((n)=>!Number.isNaN(n))) newValue = parsed;
                    }
                }
                if (fieldAttr.type === "boolean" && typeof newValue === "boolean" && !config.supportsBooleans) newValue = newValue ? 1 : 0;
                if (fieldAttr.type === "json" && typeof value === "object" && !config.supportsJSON) try {
                    newValue = JSON.stringify(value);
                } catch (error) {
                    throw new Error(`Failed to stringify JSON value for field ${fieldName}`, {
                        cause: error
                    });
                }
                if (config.customTransformInput) newValue = config.customTransformInput({
                    data: newValue,
                    fieldAttributes: fieldAttr,
                    field: fieldName,
                    model: getModelName(model),
                    schema,
                    options,
                    action
                });
                return {
                    operator,
                    connector,
                    field: fieldName,
                    value: newValue,
                    mode
                };
            });
        };
        const transformJoinClause = (baseModel, unsanitizedJoin, select)=>{
            if (!unsanitizedJoin) return void 0;
            if (Object.keys(unsanitizedJoin).length === 0) return void 0;
            const transformedJoin = {};
            for (const [model, join] of Object.entries(unsanitizedJoin)){
                if (!join) continue;
                const defaultModelName = getDefaultModelName(model);
                const defaultBaseModelName = getDefaultModelName(baseModel);
                let foreignKeys = Object.entries(schema[defaultModelName].fields).filter(([field, fieldAttributes])=>fieldAttributes.references && getDefaultModelName(fieldAttributes.references.model) === defaultBaseModelName);
                let isForwardJoin = true;
                if (!foreignKeys.length) {
                    foreignKeys = Object.entries(schema[defaultBaseModelName].fields).filter(([field, fieldAttributes])=>fieldAttributes.references && getDefaultModelName(fieldAttributes.references.model) === defaultModelName);
                    isForwardJoin = false;
                }
                if (!foreignKeys.length) throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["BetterAuthError"](`No foreign key found for model ${model} and base model ${baseModel} while performing join operation.`);
                else if (foreignKeys.length > 1) throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["BetterAuthError"](`Multiple foreign keys found for model ${model} and base model ${baseModel} while performing join operation. Only one foreign key is supported.`);
                const [foreignKey, foreignKeyAttributes] = foreignKeys[0];
                if (!foreignKeyAttributes.references) throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["BetterAuthError"](`No references found for foreign key ${foreignKey} on model ${model} while performing join operation.`);
                let from;
                let to;
                let requiredSelectField;
                if (isForwardJoin) {
                    requiredSelectField = foreignKeyAttributes.references.field;
                    from = getFieldName({
                        model: baseModel,
                        field: requiredSelectField
                    });
                    to = getFieldName({
                        model,
                        field: foreignKey
                    });
                } else {
                    requiredSelectField = foreignKey;
                    from = getFieldName({
                        model: baseModel,
                        field: requiredSelectField
                    });
                    to = getFieldName({
                        model,
                        field: foreignKeyAttributes.references.field
                    });
                }
                if (select && !select.includes(requiredSelectField)) select.push(requiredSelectField);
                const isUnique = to === "id" ? true : foreignKeyAttributes.unique ?? false;
                let limit = options.advanced?.database?.defaultFindManyLimit ?? 100;
                if (isUnique) limit = 1;
                else if (typeof join === "object" && typeof join.limit === "number") limit = join.limit;
                transformedJoin[getModelName(model)] = {
                    modelKey: model,
                    on: {
                        from,
                        to
                    },
                    limit,
                    relation: isUnique ? "one-to-one" : "one-to-many"
                };
            }
            return {
                join: transformedJoin,
                select
            };
        };
        /**
	* Handle joins by making separate queries and combining results (fallback for adapters that don't support native joins).
	*/ const handleFallbackJoin = async ({ baseModel, baseData, joinModel, specificJoinConfig: joinConfig })=>{
            if (!baseData) return baseData;
            const modelKey = joinConfig.modelKey ?? getDefaultModelName(joinModel);
            const modelName = getModelName(modelKey);
            const field = joinConfig.on.to;
            const value = baseData[getDefaultFieldName({
                field: joinConfig.on.from,
                model: baseModel
            })];
            if (value === null || value === void 0) return joinConfig.relation === "one-to-one" ? null : [];
            let result;
            const where = transformWhereClause({
                model: modelKey,
                where: [
                    {
                        field,
                        value,
                        operator: "eq",
                        connector: "AND"
                    }
                ],
                action: "findOne"
            });
            try {
                if (joinConfig.relation === "one-to-one") result = await withSpan(`db findOne ${modelName}`, {
                    [__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$instrumentation$2f$attributes$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ATTR_DB_OPERATION_NAME"]]: "findOne",
                    [__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$instrumentation$2f$attributes$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ATTR_DB_COLLECTION_NAME"]]: modelName
                }, ()=>adapterInstance.findOne({
                        model: modelName,
                        modelKey,
                        where
                    }));
                else {
                    const limit = joinConfig.limit ?? options.advanced?.database?.defaultFindManyLimit ?? 100;
                    result = await withSpan(`db findMany ${modelName}`, {
                        [__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$instrumentation$2f$attributes$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ATTR_DB_OPERATION_NAME"]]: "findMany",
                        [__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$instrumentation$2f$attributes$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ATTR_DB_COLLECTION_NAME"]]: modelName
                    }, ()=>adapterInstance.findMany({
                            model: modelName,
                            modelKey,
                            where,
                            limit
                        }));
                }
            } catch (error) {
                logger.error(`Failed to query fallback join for model ${modelName}:`, {
                    where,
                    limit: joinConfig.limit
                });
                console.error(error);
                throw error;
            }
            return result;
        };
        const adapterInstance = customAdapter({
            options,
            schema,
            debugLog,
            getFieldName,
            getModelName,
            getDefaultModelName,
            getDefaultFieldName,
            getFieldAttributes,
            transformInput,
            transformOutput,
            transformWhereClause
        });
        let lazyLoadTransaction = null;
        const atomicFallbacks = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$db$2f$adapter$2f$atomic$2d$fallback$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createAtomicFallbacks"])({
            adapter: adapterInstance,
            adapterId: config.adapterId,
            mapKeysTransformInput: config.mapKeysTransformInput,
            mapKeysTransformOutput: config.mapKeysTransformOutput,
            getFieldName,
            transformOutput,
            transformWhereClause
        });
        const adapter = {
            transaction: async (cb)=>{
                if (!lazyLoadTransaction) if (!config.transaction) lazyLoadTransaction = createAsIsTransaction(adapter);
                else {
                    logger.debug(`[${config.adapterName}] - Using provided transaction implementation.`);
                    lazyLoadTransaction = config.transaction;
                }
                return lazyLoadTransaction(cb);
            },
            create: async ({ data: unsafeData, model: inputModel, select, forceAllowId = false })=>{
                transactionId++;
                const thisTransactionId = transactionId;
                const modelKey = getDefaultModelName(inputModel);
                const model = getModelName(modelKey);
                if ("id" in unsafeData && typeof unsafeData.id !== "undefined" && !forceAllowId) {
                    logger.warn(`[${config.adapterName}] - You are trying to create a record with an id. This is not allowed as we handle id generation for you, unless you pass in the \`forceAllowId\` parameter. The id will be ignored.`);
                    const stack = /* @__PURE__ */ new Error().stack?.split("\n").filter((_, i)=>i !== 1).join("\n").replace("Error:", "Create method with `id` being called at:");
                    console.log(stack);
                    unsafeData.id = void 0;
                }
                debugLog({
                    method: "create"
                }, `${formatTransactionId(thisTransactionId)} ${formatStep(1, 4)}`, `${formatMethod("create")} ${formatAction("Unsafe Input")}:`, {
                    model,
                    data: unsafeData
                });
                let data = unsafeData;
                if (!config.disableTransformInput) data = await transformInput(unsafeData, modelKey, "create", forceAllowId);
                debugLog({
                    method: "create"
                }, `${formatTransactionId(thisTransactionId)} ${formatStep(2, 4)}`, `${formatMethod("create")} ${formatAction("Parsed Input")}:`, {
                    model,
                    data
                });
                const res = await withSpan(`db create ${model}`, {
                    [__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$instrumentation$2f$attributes$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ATTR_DB_OPERATION_NAME"]]: "create",
                    [__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$instrumentation$2f$attributes$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ATTR_DB_COLLECTION_NAME"]]: model
                }, ()=>adapterInstance.create({
                        data,
                        model,
                        modelKey
                    }));
                debugLog({
                    method: "create"
                }, `${formatTransactionId(thisTransactionId)} ${formatStep(3, 4)}`, `${formatMethod("create")} ${formatAction("DB Result")}:`, {
                    model,
                    res
                });
                let transformed = res;
                if (!config.disableTransformOutput) transformed = await transformOutput(res, modelKey, select, void 0);
                debugLog({
                    method: "create"
                }, `${formatTransactionId(thisTransactionId)} ${formatStep(4, 4)}`, `${formatMethod("create")} ${formatAction("Parsed Result")}:`, {
                    model,
                    data: transformed
                });
                return transformed;
            },
            update: async ({ model: inputModel, where: unsafeWhere, update: unsafeData })=>{
                transactionId++;
                const thisTransactionId = transactionId;
                const modelKey = getDefaultModelName(inputModel);
                const model = getModelName(modelKey);
                const where = transformWhereClause({
                    model: modelKey,
                    where: unsafeWhere,
                    action: "update"
                });
                if (where.length === 0) return null;
                debugLog({
                    method: "update"
                }, `${formatTransactionId(thisTransactionId)} ${formatStep(1, 4)}`, `${formatMethod("update")} ${formatAction("Unsafe Input")}:`, {
                    model,
                    data: unsafeData
                });
                let data = unsafeData;
                if (!config.disableTransformInput) data = await transformInput(unsafeData, modelKey, "update");
                debugLog({
                    method: "update"
                }, `${formatTransactionId(thisTransactionId)} ${formatStep(2, 4)}`, `${formatMethod("update")} ${formatAction("Parsed Input")}:`, {
                    model,
                    data
                });
                const res = await withSpan(`db update ${model}`, {
                    [__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$instrumentation$2f$attributes$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ATTR_DB_OPERATION_NAME"]]: "update",
                    [__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$instrumentation$2f$attributes$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ATTR_DB_COLLECTION_NAME"]]: model
                }, ()=>adapterInstance.update({
                        model,
                        modelKey,
                        where,
                        update: data
                    }));
                debugLog({
                    method: "update"
                }, `${formatTransactionId(thisTransactionId)} ${formatStep(3, 4)}`, `${formatMethod("update")} ${formatAction("DB Result")}:`, {
                    model,
                    data: res
                });
                let transformed = res;
                if (!config.disableTransformOutput) transformed = await transformOutput(res, modelKey, void 0, void 0);
                debugLog({
                    method: "update"
                }, `${formatTransactionId(thisTransactionId)} ${formatStep(4, 4)}`, `${formatMethod("update")} ${formatAction("Parsed Result")}:`, {
                    model,
                    data: transformed
                });
                return transformed;
            },
            updateMany: async ({ model: inputModel, where: unsafeWhere, update: unsafeData })=>{
                transactionId++;
                const thisTransactionId = transactionId;
                const modelKey = getDefaultModelName(inputModel);
                const model = getModelName(modelKey);
                const where = transformWhereClause({
                    model: modelKey,
                    where: unsafeWhere,
                    action: "updateMany"
                });
                debugLog({
                    method: "updateMany"
                }, `${formatTransactionId(thisTransactionId)} ${formatStep(1, 4)}`, `${formatMethod("updateMany")} ${formatAction("Unsafe Input")}:`, {
                    model,
                    data: unsafeData
                });
                let data = unsafeData;
                if (!config.disableTransformInput) data = await transformInput(unsafeData, modelKey, "update");
                debugLog({
                    method: "updateMany"
                }, `${formatTransactionId(thisTransactionId)} ${formatStep(2, 4)}`, `${formatMethod("updateMany")} ${formatAction("Parsed Input")}:`, {
                    model,
                    data
                });
                const updatedCount = await withSpan(`db updateMany ${model}`, {
                    [__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$instrumentation$2f$attributes$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ATTR_DB_OPERATION_NAME"]]: "updateMany",
                    [__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$instrumentation$2f$attributes$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ATTR_DB_COLLECTION_NAME"]]: model
                }, ()=>adapterInstance.updateMany({
                        model,
                        modelKey,
                        where,
                        update: data
                    }));
                if (typeof updatedCount !== "number" || !Number.isFinite(updatedCount)) throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["BetterAuthError"](`Adapter "${config.adapterId}" updateMany must return a finite number affected row count.`);
                debugLog({
                    method: "updateMany"
                }, `${formatTransactionId(thisTransactionId)} ${formatStep(3, 4)}`, `${formatMethod("updateMany")} ${formatAction("DB Result")}:`, {
                    model,
                    data: updatedCount
                });
                debugLog({
                    method: "updateMany"
                }, `${formatTransactionId(thisTransactionId)} ${formatStep(4, 4)}`, `${formatMethod("updateMany")} ${formatAction("Parsed Result")}:`, {
                    model,
                    data: updatedCount
                });
                return updatedCount;
            },
            findOne: async ({ model: inputModel, where: unsafeWhere, select, join: unsafeJoin })=>{
                transactionId++;
                const thisTransactionId = transactionId;
                const modelKey = getDefaultModelName(inputModel);
                const model = getModelName(modelKey);
                const where = transformWhereClause({
                    model: modelKey,
                    where: unsafeWhere,
                    action: "findOne"
                });
                let join;
                let passJoinToAdapter = true;
                if (!config.disableTransformJoin) {
                    const result = transformJoinClause(modelKey, unsafeJoin, select);
                    if (result) {
                        join = result.join;
                        select = result.select;
                    }
                    if (!options.advanced?.database?.joins && join && Object.keys(join).length > 0) passJoinToAdapter = false;
                } else join = unsafeJoin;
                debugLog({
                    method: "findOne"
                }, `${formatTransactionId(thisTransactionId)} ${formatStep(1, 3)}`, `${formatMethod("findOne")}:`, {
                    model,
                    where,
                    select,
                    join
                });
                const res = await withSpan(`db findOne ${model}`, {
                    [__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$instrumentation$2f$attributes$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ATTR_DB_OPERATION_NAME"]]: "findOne",
                    [__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$instrumentation$2f$attributes$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ATTR_DB_COLLECTION_NAME"]]: model
                }, ()=>adapterInstance.findOne({
                        model,
                        modelKey,
                        where,
                        select,
                        join: passJoinToAdapter ? join : void 0
                    }));
                debugLog({
                    method: "findOne"
                }, `${formatTransactionId(thisTransactionId)} ${formatStep(2, 3)}`, `${formatMethod("findOne")} ${formatAction("DB Result")}:`, {
                    model,
                    data: res
                });
                let transformed = res;
                if (!config.disableTransformOutput) transformed = await transformOutput(res, modelKey, select, join);
                debugLog({
                    method: "findOne"
                }, `${formatTransactionId(thisTransactionId)} ${formatStep(3, 3)}`, `${formatMethod("findOne")} ${formatAction("Parsed Result")}:`, {
                    model,
                    data: transformed
                });
                return transformed;
            },
            findMany: async ({ model: inputModel, where: unsafeWhere, limit: unsafeLimit, select, sortBy, offset, join: unsafeJoin })=>{
                transactionId++;
                const thisTransactionId = transactionId;
                const limit = unsafeLimit ?? options.advanced?.database?.defaultFindManyLimit ?? 100;
                const modelKey = getDefaultModelName(inputModel);
                const model = getModelName(modelKey);
                const where = transformWhereClause({
                    model: modelKey,
                    where: unsafeWhere,
                    action: "findMany"
                });
                let join;
                let passJoinToAdapter = true;
                if (!config.disableTransformJoin) {
                    const result = transformJoinClause(modelKey, unsafeJoin, select);
                    if (result) {
                        join = result.join;
                        select = result.select;
                    }
                    if (!options.advanced?.database?.joins && join && Object.keys(join).length > 0) passJoinToAdapter = false;
                } else join = unsafeJoin;
                debugLog({
                    method: "findMany"
                }, `${formatTransactionId(thisTransactionId)} ${formatStep(1, 3)}`, `${formatMethod("findMany")}:`, {
                    model,
                    where,
                    limit,
                    sortBy,
                    offset,
                    join
                });
                const res = await withSpan(`db findMany ${model}`, {
                    [__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$instrumentation$2f$attributes$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ATTR_DB_OPERATION_NAME"]]: "findMany",
                    [__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$instrumentation$2f$attributes$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ATTR_DB_COLLECTION_NAME"]]: model
                }, ()=>adapterInstance.findMany({
                        model,
                        modelKey,
                        where,
                        limit,
                        select,
                        sortBy,
                        offset,
                        join: passJoinToAdapter ? join : void 0
                    }));
                debugLog({
                    method: "findMany"
                }, `${formatTransactionId(thisTransactionId)} ${formatStep(2, 3)}`, `${formatMethod("findMany")} ${formatAction("DB Result")}:`, {
                    model,
                    data: res
                });
                let transformed = res;
                if (!config.disableTransformOutput) transformed = await Promise.all(res.map(async (r)=>{
                    return await transformOutput(r, modelKey, void 0, join);
                }));
                debugLog({
                    method: "findMany"
                }, `${formatTransactionId(thisTransactionId)} ${formatStep(3, 3)}`, `${formatMethod("findMany")} ${formatAction("Parsed Result")}:`, {
                    model,
                    data: transformed
                });
                return transformed;
            },
            delete: async ({ model: inputModel, where: unsafeWhere })=>{
                transactionId++;
                const thisTransactionId = transactionId;
                const modelKey = getDefaultModelName(inputModel);
                const model = getModelName(modelKey);
                const where = transformWhereClause({
                    model: modelKey,
                    where: unsafeWhere,
                    action: "delete"
                });
                debugLog({
                    method: "delete"
                }, `${formatTransactionId(thisTransactionId)} ${formatStep(1, 2)}`, `${formatMethod("delete")}:`, {
                    model,
                    where
                });
                await withSpan(`db delete ${model}`, {
                    [__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$instrumentation$2f$attributes$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ATTR_DB_OPERATION_NAME"]]: "delete",
                    [__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$instrumentation$2f$attributes$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ATTR_DB_COLLECTION_NAME"]]: model
                }, ()=>adapterInstance.delete({
                        model,
                        modelKey,
                        where
                    }));
                debugLog({
                    method: "delete"
                }, `${formatTransactionId(thisTransactionId)} ${formatStep(2, 2)}`, `${formatMethod("delete")} ${formatAction("DB Result")}:`, {
                    model
                });
            },
            deleteMany: async ({ model: inputModel, where: unsafeWhere })=>{
                transactionId++;
                const thisTransactionId = transactionId;
                const modelKey = getDefaultModelName(inputModel);
                const model = getModelName(modelKey);
                const where = transformWhereClause({
                    model: modelKey,
                    where: unsafeWhere,
                    action: "deleteMany"
                });
                debugLog({
                    method: "deleteMany"
                }, `${formatTransactionId(thisTransactionId)} ${formatStep(1, 2)}`, `${formatMethod("deleteMany")} ${formatAction("DeleteMany")}:`, {
                    model,
                    where
                });
                const res = await withSpan(`db deleteMany ${model}`, {
                    [__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$instrumentation$2f$attributes$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ATTR_DB_OPERATION_NAME"]]: "deleteMany",
                    [__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$instrumentation$2f$attributes$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ATTR_DB_COLLECTION_NAME"]]: model
                }, ()=>adapterInstance.deleteMany({
                        model,
                        modelKey,
                        where
                    }));
                debugLog({
                    method: "deleteMany"
                }, `${formatTransactionId(thisTransactionId)} ${formatStep(2, 2)}`, `${formatMethod("deleteMany")} ${formatAction("DB Result")}:`, {
                    model,
                    data: res
                });
                return res;
            },
            consumeOne: async ({ model: inputModel, where: unsafeWhere })=>{
                transactionId++;
                const thisTransactionId = transactionId;
                const modelKey = getDefaultModelName(inputModel);
                const model = getModelName(modelKey);
                const where = transformWhereClause({
                    model: modelKey,
                    where: unsafeWhere,
                    action: "consumeOne"
                });
                debugLog({
                    method: "consumeOne"
                }, `${formatTransactionId(thisTransactionId)} ${formatStep(1, 3)}`, `${formatMethod("consumeOne")} ${formatAction("ConsumeOne")}:`, {
                    model,
                    where
                });
                const res = await withSpan(`db consumeOne ${model}`, {
                    [__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$instrumentation$2f$attributes$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ATTR_DB_OPERATION_NAME"]]: "consumeOne",
                    [__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$instrumentation$2f$attributes$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ATTR_DB_COLLECTION_NAME"]]: model
                }, ()=>adapterInstance.consumeOne ? adapterInstance.consumeOne({
                        model,
                        modelKey,
                        where
                    }) : atomicFallbacks.consumeOne({
                        model,
                        modelKey,
                        where
                    }));
                debugLog({
                    method: "consumeOne"
                }, `${formatTransactionId(thisTransactionId)} ${formatStep(2, 3)}`, `${formatMethod("consumeOne")} ${formatAction("DB Result")}:`, {
                    model,
                    data: res
                });
                let transformed = res;
                if (!config.disableTransformOutput && res) transformed = await transformOutput(res, modelKey, void 0, void 0);
                debugLog({
                    method: "consumeOne"
                }, `${formatTransactionId(thisTransactionId)} ${formatStep(3, 3)}`, `${formatMethod("consumeOne")} ${formatAction("Parsed Result")}:`, {
                    model,
                    data: transformed
                });
                return transformed;
            },
            incrementOne: async ({ model: inputModel, where: unsafeWhere, increment: unsafeIncrement, set: unsafeSet })=>{
                const hasIncrement = Object.keys(unsafeIncrement).length > 0;
                const hasSet = !!unsafeSet && Object.keys(unsafeSet).length > 0;
                if (!hasIncrement && !hasSet) throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["BetterAuthError"]("incrementOne requires a non-empty `increment` or `set`; both were empty.");
                transactionId++;
                const thisTransactionId = transactionId;
                const modelKey = getDefaultModelName(inputModel);
                const model = getModelName(modelKey);
                const where = transformWhereClause({
                    model: modelKey,
                    where: unsafeWhere,
                    action: "incrementOne"
                });
                debugLog({
                    method: "incrementOne"
                }, `${formatTransactionId(thisTransactionId)} ${formatStep(1, 3)}`, `${formatMethod("incrementOne")} ${formatAction("IncrementOne")}:`, {
                    model,
                    where,
                    increment: unsafeIncrement,
                    set: unsafeSet
                });
                const mappedKeys = config.mapKeysTransformInput ?? {};
                const increment = {};
                for (const [field, delta] of Object.entries(unsafeIncrement))increment[mappedKeys[field] || getFieldName({
                    model: modelKey,
                    field
                })] = delta;
                let set;
                if (unsafeSet && !config.disableTransformInput) set = await transformInput(unsafeSet, modelKey, "update");
                else set = unsafeSet;
                if (Object.keys(increment).length === 0 && (!set || Object.keys(set).length === 0)) throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["BetterAuthError"]("incrementOne resolved to an empty update: every increment/set field was unknown to the schema or transformed away.");
                const res = await withSpan(`db incrementOne ${model}`, {
                    [__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$instrumentation$2f$attributes$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ATTR_DB_OPERATION_NAME"]]: "incrementOne",
                    [__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$instrumentation$2f$attributes$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ATTR_DB_COLLECTION_NAME"]]: model
                }, ()=>adapterInstance.incrementOne ? adapterInstance.incrementOne({
                        model,
                        modelKey,
                        where,
                        increment,
                        set
                    }) : atomicFallbacks.incrementOne({
                        model,
                        modelKey,
                        where,
                        increment,
                        set
                    }));
                debugLog({
                    method: "incrementOne"
                }, `${formatTransactionId(thisTransactionId)} ${formatStep(2, 3)}`, `${formatMethod("incrementOne")} ${formatAction("DB Result")}:`, {
                    model,
                    data: res
                });
                let transformed = res;
                if (!config.disableTransformOutput && res) transformed = await transformOutput(res, modelKey, void 0, void 0);
                debugLog({
                    method: "incrementOne"
                }, `${formatTransactionId(thisTransactionId)} ${formatStep(3, 3)}`, `${formatMethod("incrementOne")} ${formatAction("Parsed Result")}:`, {
                    model,
                    data: transformed
                });
                return transformed;
            },
            count: async ({ model: inputModel, where: unsafeWhere })=>{
                transactionId++;
                const thisTransactionId = transactionId;
                const modelKey = getDefaultModelName(inputModel);
                const model = getModelName(modelKey);
                const where = transformWhereClause({
                    model: modelKey,
                    where: unsafeWhere,
                    action: "count"
                });
                debugLog({
                    method: "count"
                }, `${formatTransactionId(thisTransactionId)} ${formatStep(1, 2)}`, `${formatMethod("count")}:`, {
                    model,
                    where
                });
                const res = await withSpan(`db count ${model}`, {
                    [__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$instrumentation$2f$attributes$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ATTR_DB_OPERATION_NAME"]]: "count",
                    [__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$instrumentation$2f$attributes$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ATTR_DB_COLLECTION_NAME"]]: model
                }, ()=>adapterInstance.count({
                        model,
                        modelKey,
                        where
                    }));
                debugLog({
                    method: "count"
                }, `${formatTransactionId(thisTransactionId)} ${formatStep(2, 2)}`, `${formatMethod("count")}:`, {
                    model,
                    data: res
                });
                return res;
            },
            createSchema: adapterInstance.createSchema ? async (_, file)=>{
                const tables = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$db$2f$get$2d$tables$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getAuthTables"])(options);
                if (options.secondaryStorage && !options.session?.storeSessionInDatabase) delete tables.session;
                return adapterInstance.createSchema({
                    file,
                    tables
                });
            } : void 0,
            options: {
                adapterConfig: config,
                ...adapterInstance.options ?? {}
            },
            id: config.adapterId,
            ...config.debugLogs?.isRunningAdapterTests ? {
                adapterTestDebugLogs: {
                    resetDebugLogs () {
                        debugLogs = debugLogs.filter((log)=>log.instance !== uniqueAdapterFactoryInstanceId);
                    },
                    printDebugLogs () {
                        const separator = `─`.repeat(80);
                        const logs = debugLogs.filter((log)=>log.instance === uniqueAdapterFactoryInstanceId);
                        if (logs.length === 0) return;
                        const log = logs.reverse().map((log)=>{
                            log.args[0] = `\n${log.args[0]}`;
                            return [
                                ...log.args,
                                "\n"
                            ];
                        }).reduce((prev, curr)=>{
                            return [
                                ...curr,
                                ...prev
                            ];
                        }, [
                            `\n${separator}`
                        ]);
                        console.log(...log);
                    }
                }
            } : {}
        };
        return adapter;
    };
function formatTransactionId(transactionId) {
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$color$2d$depth$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getColorDepth"])() < 8) return `#${transactionId}`;
    return `${__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$logger$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TTY_COLORS"].fg.magenta}#${transactionId}${__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$logger$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TTY_COLORS"].reset}`;
}
function formatStep(step, total) {
    return `${__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$logger$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TTY_COLORS"].bg.black}${__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$logger$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TTY_COLORS"].fg.yellow}[${step}/${total}]${__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$logger$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TTY_COLORS"].reset}`;
}
function formatMethod(method) {
    return `${__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$logger$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TTY_COLORS"].bright}${method}${__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$logger$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TTY_COLORS"].reset}`;
}
function formatAction(action) {
    return `${__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$logger$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TTY_COLORS"].dim}(${action})${__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$logger$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TTY_COLORS"].reset}`;
}
;
}),
"[project]/examples/nextjs/node_modules/@better-auth/core/dist/db/adapter/get-default-field-name.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "initGetDefaultFieldName",
    ()=>initGetDefaultFieldName
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/error/index.mjs [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$db$2f$adapter$2f$get$2d$default$2d$model$2d$name$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/db/adapter/get-default-model-name.mjs [app-rsc] (ecmascript)");
;
;
//#region src/db/adapter/get-default-field-name.ts
const initGetDefaultFieldName = ({ schema, usePlural })=>{
    const getDefaultModelName = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$db$2f$adapter$2f$get$2d$default$2d$model$2d$name$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["initGetDefaultModelName"])({
        schema,
        usePlural
    });
    /**
	* This function helps us get the default field name from the schema defined by devs.
	* Often times, the user will be using the `fieldName` which could had been customized by the users.
	* This function helps us get the actual field name useful to match against the schema. (eg: schema[model].fields[field])
	*
	* If it's still unclear what this does:
	*
	* 1. User can define a custom fieldName.
	* 2. When using a custom fieldName, doing something like `schema[model].fields[field]` will not work.
	*/ const getDefaultFieldName = ({ field, model: inputModel })=>{
        if (field === "id" || field === "_id") return "id";
        const modelKey = getDefaultModelName(inputModel);
        let f = schema[modelKey]?.fields[field];
        if (!f) {
            const result = Object.entries(schema[modelKey].fields).find(([_, f])=>f.fieldName === field);
            if (result) {
                f = result[1];
                field = result[0];
            }
        }
        if (!f) throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["BetterAuthError"](`Field ${field} not found in model ${modelKey}`);
        return field;
    };
    return getDefaultFieldName;
};
;
}),
"[project]/examples/nextjs/node_modules/@better-auth/core/dist/db/adapter/get-default-model-name.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "initGetDefaultModelName",
    ()=>initGetDefaultModelName
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/error/index.mjs [app-rsc] (ecmascript) <locals>");
;
//#region src/db/adapter/get-default-model-name.ts
const initGetDefaultModelName = ({ usePlural, schema })=>{
    /**
	* This function helps us get the default model name from the schema defined by devs.
	* Often times, the user will be using the `modelName` which could had been customized by the users.
	* This function helps us get the actual model name useful to match against the schema. (eg: schema[model])
	*
	* If it's still unclear what this does:
	*
	* 1. User can define a custom modelName.
	* 2. When using a custom modelName, doing something like `schema[model]` will not work.
	* 3. Using this function helps us get the actual model name based on the user's defined custom modelName.
	*/ const getDefaultModelName = (model)=>{
        const resolve = (candidate)=>{
            if (schema[candidate]) return candidate;
            return Object.entries(schema).find(([_, f])=>f.modelName === candidate)?.[0];
        };
        if (usePlural && model.charAt(model.length - 1) === "s") {
            const m = resolve(model.slice(0, -1));
            if (m) return m;
        }
        const m = resolve(model);
        if (!m) throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["BetterAuthError"](`Model "${model}" not found in schema`);
        return m;
    };
    return getDefaultModelName;
};
;
}),
"[project]/examples/nextjs/node_modules/@better-auth/core/dist/db/adapter/get-field-attributes.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "initGetFieldAttributes",
    ()=>initGetFieldAttributes
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/error/index.mjs [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$db$2f$adapter$2f$get$2d$default$2d$model$2d$name$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/db/adapter/get-default-model-name.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$db$2f$adapter$2f$get$2d$id$2d$field$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/db/adapter/get-id-field.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$db$2f$adapter$2f$get$2d$default$2d$field$2d$name$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/db/adapter/get-default-field-name.mjs [app-rsc] (ecmascript)");
;
;
;
;
//#region src/db/adapter/get-field-attributes.ts
const initGetFieldAttributes = ({ usePlural, schema, options, customIdGenerator, disableIdGeneration })=>{
    const getDefaultModelName = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$db$2f$adapter$2f$get$2d$default$2d$model$2d$name$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["initGetDefaultModelName"])({
        usePlural,
        schema
    });
    const getDefaultFieldName = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$db$2f$adapter$2f$get$2d$default$2d$field$2d$name$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["initGetDefaultFieldName"])({
        usePlural,
        schema
    });
    const idField = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$db$2f$adapter$2f$get$2d$id$2d$field$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["initGetIdField"])({
        usePlural,
        schema,
        options,
        customIdGenerator,
        disableIdGeneration
    });
    const getFieldAttributes = ({ model, field })=>{
        const defaultModelName = getDefaultModelName(model);
        const defaultFieldName = getDefaultFieldName({
            field,
            model: defaultModelName
        });
        const fields = schema[defaultModelName].fields;
        fields.id = idField({
            customModelName: defaultModelName
        });
        const fieldAttributes = fields[defaultFieldName];
        if (!fieldAttributes) throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["BetterAuthError"](`Field ${field} not found in model ${model}`);
        return fieldAttributes;
    };
    return getFieldAttributes;
};
;
}),
"[project]/examples/nextjs/node_modules/@better-auth/core/dist/db/adapter/get-field-name.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "initGetFieldName",
    ()=>initGetFieldName
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$db$2f$adapter$2f$get$2d$default$2d$model$2d$name$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/db/adapter/get-default-model-name.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$db$2f$adapter$2f$get$2d$default$2d$field$2d$name$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/db/adapter/get-default-field-name.mjs [app-rsc] (ecmascript)");
;
;
//#region src/db/adapter/get-field-name.ts
const initGetFieldName = ({ schema, usePlural })=>{
    const getDefaultModelName = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$db$2f$adapter$2f$get$2d$default$2d$model$2d$name$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["initGetDefaultModelName"])({
        schema,
        usePlural
    });
    const getDefaultFieldName = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$db$2f$adapter$2f$get$2d$default$2d$field$2d$name$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["initGetDefaultFieldName"])({
        schema,
        usePlural
    });
    /**
	* Get the field name which is expected to be saved in the database based on the user's schema.
	*
	* This function is useful if you need to save the field name to the database.
	*
	* For example, if the user has defined a custom field name for the `user` model, then you can use this function to get the actual field name from the schema.
	*/ function getFieldName({ model: modelName, field: fieldName }) {
        const model = getDefaultModelName(modelName);
        const field = getDefaultFieldName({
            model,
            field: fieldName
        });
        return schema[model]?.fields[field]?.fieldName || field;
    }
    return getFieldName;
};
;
}),
"[project]/examples/nextjs/node_modules/@better-auth/core/dist/db/adapter/get-id-field.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "encodeDeterministicId",
    ()=>encodeDeterministicId,
    "initGetIdField",
    ()=>initGetIdField
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$logger$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/env/logger.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$id$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/utils/id.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$db$2f$adapter$2f$get$2d$default$2d$model$2d$name$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/db/adapter/get-default-model-name.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$base64$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/utils/dist/base64.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$hex$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/utils/dist/hex.mjs [app-rsc] (ecmascript)");
;
;
;
;
;
//#region src/db/adapter/get-id-field.ts
let warnedSerialDeterministicId = false;
/**
* Encodes a digest as a primary key that the configured
* `advanced.database.generateId` strategy keeps when the record is created
* with `forceAllowId`.
*
* Single-use records key their row by an id derived from the value they
* guard, so a duplicate insert is the first-writer-wins gate. The id field
* replaces a forced id that does not fit the strategy with a fresh one, which
* would let every insert win. Under `"uuid"` the first 16 bytes are formatted
* with version 5 and RFC 9562 variant bits, the shape the id field accepts.
* Other string strategies get the base64url digest. Under `"serial"` the
* base64url digest is still replaced by a database number, so the record is
* not single use; this logs a warning once per process.
*
* @internal Shared by Better Auth packages; not a supported public API.
* @param digest - A hash of the guarded value, at least 16 bytes long.
*/ function encodeDeterministicId(digest, options) {
    const generateId = options.advanced?.database?.generateId;
    if (generateId === "serial" && !warnedSerialDeterministicId) {
        warnedSerialDeterministicId = true;
        __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$logger$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["logger"].warn("Single-use checks (such as SAML assertion IDs, DPoP proofs, and private_key_jwt assertions) need string ids and are not enforced with `advanced.database.generateId: \"serial\"`.");
    }
    if (generateId !== "uuid") return __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$base64$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["base64Url"].encode(digest, {
        padding: false
    });
    const bytes = digest.slice(0, 16);
    bytes[6] = bytes[6] & 15 | 80;
    bytes[8] = bytes[8] & 63 | 128;
    const value = __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$hex$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["hex"].encode(bytes);
    return `${value.slice(0, 8)}-${value.slice(8, 12)}-${value.slice(12, 16)}-${value.slice(16, 20)}-${value.slice(20)}`;
}
const initGetIdField = ({ usePlural, schema, disableIdGeneration, options, customIdGenerator, supportsUUIDs })=>{
    const getDefaultModelName = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$db$2f$adapter$2f$get$2d$default$2d$model$2d$name$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["initGetDefaultModelName"])({
        usePlural,
        schema
    });
    const idField = ({ customModelName, forceAllowId })=>{
        const useNumberId = options.advanced?.database?.generateId === "serial";
        const useUUIDs = options.advanced?.database?.generateId === "uuid";
        const shouldGenerateId = (()=>{
            if (disableIdGeneration) return false;
            else if (useNumberId && !forceAllowId) return false;
            else if (useUUIDs) return !supportsUUIDs;
            else return true;
        })();
        const model = getDefaultModelName(customModelName ?? "id");
        return {
            type: useNumberId ? "number" : "string",
            required: shouldGenerateId ? true : false,
            ...shouldGenerateId ? {
                defaultValue () {
                    if (disableIdGeneration) return void 0;
                    const generateId$1 = options.advanced?.database?.generateId;
                    if (generateId$1 === false || generateId$1 === "serial") return void 0;
                    if (typeof generateId$1 === "function") return generateId$1({
                        model
                    });
                    if (generateId$1 === "uuid") return crypto.randomUUID();
                    if (customIdGenerator) return customIdGenerator({
                        model
                    });
                    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$id$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["generateId"])();
                }
            } : {},
            transform: {
                input: (value)=>{
                    if (!value) return void 0;
                    if (useNumberId) {
                        const numberValue = Number(value);
                        if (isNaN(numberValue)) return;
                        return numberValue;
                    }
                    if (useUUIDs) {
                        if (shouldGenerateId && !forceAllowId) return value;
                        if (disableIdGeneration) return void 0;
                        if (forceAllowId && typeof value === "string") if (/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)) return value;
                        else {
                            const stack = /* @__PURE__ */ new Error().stack?.split("\n").filter((_, i)=>i !== 1).join("\n").replace("Error:", "");
                            __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$logger$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["logger"].warn("[Adapter Factory] - Invalid UUID value for field `id` provided when `forceAllowId` is true. Generating a new UUID.", stack);
                        }
                        if (supportsUUIDs) return void 0;
                        if (typeof value !== "string" && !supportsUUIDs) return crypto.randomUUID();
                        return;
                    }
                    return value;
                },
                output: (value)=>{
                    if (!value) return void 0;
                    return String(value);
                }
            }
        };
    };
    return idField;
};
;
}),
"[project]/examples/nextjs/node_modules/@better-auth/core/dist/db/adapter/get-model-name.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "initGetModelName",
    ()=>initGetModelName
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$db$2f$adapter$2f$get$2d$default$2d$model$2d$name$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/db/adapter/get-default-model-name.mjs [app-rsc] (ecmascript)");
;
//#region src/db/adapter/get-model-name.ts
const initGetModelName = ({ usePlural, schema })=>{
    const getDefaultModelName = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$db$2f$adapter$2f$get$2d$default$2d$model$2d$name$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["initGetDefaultModelName"])({
        schema,
        usePlural
    });
    /**
	* Users can overwrite the default model of some tables. This function helps find the correct model name.
	* Furthermore, if the user passes `usePlural` as true in their adapter config,
	* then we should return the model name ending with an `s`.
	*/ const getModelName = (model)=>{
        const defaultModelKey = getDefaultModelName(model);
        if (schema && schema[defaultModelKey] && schema[defaultModelKey].modelName !== model) return usePlural ? `${schema[defaultModelKey].modelName}s` : schema[defaultModelKey].modelName;
        return usePlural ? `${model}s` : model;
    };
    return getModelName;
};
;
}),
"[project]/examples/nextjs/node_modules/@better-auth/core/dist/db/adapter/utils.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "deepmerge",
    ()=>deepmerge,
    "withApplyDefault",
    ()=>withApplyDefault
]);
//#region src/db/adapter/utils.ts
function withApplyDefault(value, field, action) {
    if (action === "update") {
        if (value === void 0 && field.onUpdate !== void 0) {
            if (typeof field.onUpdate === "function") return field.onUpdate();
            return field.onUpdate;
        }
        return value;
    }
    if (action === "create") {
        if (value === void 0 || field.required === true && value === null) {
            if (field.defaultValue !== void 0) {
                if (typeof field.defaultValue === "function") return field.defaultValue();
                return field.defaultValue;
            }
        }
    }
    return value;
}
function isObject(item) {
    return item !== null && typeof item === "object" && !Array.isArray(item);
}
function deepmerge(target, source) {
    if (Array.isArray(target) && Array.isArray(source)) return [
        ...target,
        ...source
    ];
    else if (isObject(target) && isObject(source)) {
        const result = {
            ...target
        };
        for (const [key, value] of Object.entries(source)){
            if (value === void 0) continue;
            if (key in target) result[key] = deepmerge(target[key], value);
            else result[key] = value;
        }
        return result;
    }
    return source;
}
;
}),
"[project]/examples/nextjs/node_modules/@better-auth/core/dist/db/database-index.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getDatabaseFieldIndexName",
    ()=>getDatabaseFieldIndexName,
    "getDatabaseIndexName",
    ()=>getDatabaseIndexName,
    "getDatabaseIndexStringLength",
    ()=>getDatabaseIndexStringLength,
    "getPortableDatabaseIdentifierKey",
    ()=>getPortableDatabaseIdentifierKey,
    "resolveDatabaseSchemaIndexes",
    ()=>resolveDatabaseSchemaIndexes,
    "resolveDatabaseTableIndexes",
    ()=>resolveDatabaseTableIndexes
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/error/index.mjs [app-rsc] (ecmascript) <locals>");
;
//#region src/db/database-index.ts
const MAX_DATABASE_INDEX_NAME_BYTES = 63;
const MAX_DATABASE_INDEX_FIELDS = 16;
function getPortableDatabaseIdentifierKey(identifier) {
    return identifier.toLowerCase();
}
function getUtf8ByteLength(value) {
    return new TextEncoder().encode(value).length;
}
function truncateUtf8(value, maxBytes) {
    let result = "";
    let byteLength = 0;
    for (const character of value){
        const characterByteLength = getUtf8ByteLength(character);
        if (byteLength + characterByteLength > maxBytes) break;
        result += character;
        byteLength += characterByteLength;
    }
    return result;
}
function getStableIndexNameHash(value) {
    let hash = 2166136261;
    for(let index = 0; index < value.length; index++){
        hash ^= value.charCodeAt(index);
        hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0).toString(16).padStart(8, "0");
}
/** Returns the stable database name for a table-level index. */ function getDatabaseIndexName(tableName, index) {
    if (index.name !== void 0) {
        if (index.name.trim().length === 0) throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["BetterAuthError"]("Database index names must contain at least one visible character.");
        if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(index.name)) throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["BetterAuthError"]("Database index names must start with a letter or underscore and contain only letters, numbers, and underscores.");
        if (getUtf8ByteLength(index.name) > MAX_DATABASE_INDEX_NAME_BYTES) throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["BetterAuthError"](`Database index names must be at most ${MAX_DATABASE_INDEX_NAME_BYTES} UTF-8 bytes.`);
        return index.name;
    }
    const indexKind = index.unique ? "uidx" : "idx";
    const generatedName = `${tableName}_${index.fields.join("_")}_${indexKind}`;
    if (getUtf8ByteLength(generatedName) <= MAX_DATABASE_INDEX_NAME_BYTES) return generatedName;
    const suffix = `_${getStableIndexNameHash(generatedName)}_${indexKind}`;
    return `${truncateUtf8(generatedName.slice(0, -indexKind.length - 1), MAX_DATABASE_INDEX_NAME_BYTES - getUtf8ByteLength(suffix))}${suffix}`;
}
/** Returns the database name used by legacy field-level index metadata. */ function getDatabaseFieldIndexName(tableName, columnName, unique) {
    return getDatabaseIndexName(tableName, {
        fields: [
            columnName
        ],
        unique
    });
}
/** Resolves logical index fields to their configured database column names. */ function resolveDatabaseTableIndexes({ fields, indexes, tableName }) {
    const resolvedIndexes = (indexes ?? []).map((index)=>{
        if (index.fields.length === 0) throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["BetterAuthError"](`Index on table "${tableName}" must include at least one field.`);
        if (index.fields.length > MAX_DATABASE_INDEX_FIELDS) throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["BetterAuthError"](`Index on table "${tableName}" can include at most ${MAX_DATABASE_INDEX_FIELDS} fields so it works across supported databases.`);
        if (new Set(index.fields).size !== index.fields.length) throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["BetterAuthError"](`Index on table "${tableName}" contains the same field more than once.`);
        if (index.unique && index.fields.some((fieldName)=>fields[fieldName]?.required === false)) throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["BetterAuthError"](`Unique index on table "${tableName}" can only include required fields so its behavior is consistent across databases.`);
        const unsupportedField = index.fields.find((fieldName)=>{
            const fieldType = fields[fieldName]?.type;
            return fieldType === "json" || fieldType === "string[]" || fieldType === "number[]";
        });
        if (unsupportedField) throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["BetterAuthError"](`Index on table "${tableName}" references field "${unsupportedField}", whose type is not portably indexable.`);
        const resolveFieldName = (fieldName)=>{
            const field = fields[fieldName];
            if (!field) throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["BetterAuthError"](`Index on table "${tableName}" references unknown field "${fieldName}".`);
            return field.fieldName || fieldName;
        };
        const [firstField, ...remainingFields] = index.fields;
        const columns = [
            resolveFieldName(firstField),
            ...remainingFields.map(resolveFieldName)
        ];
        if (new Set(columns.map(getPortableDatabaseIdentifierKey)).size !== columns.length) throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["BetterAuthError"](`Index on table "${tableName}" resolves more than one field to the same database column.`);
        return {
            columns,
            name: getDatabaseIndexName(tableName, {
                ...index,
                fields: columns
            }),
            unique: index.unique
        };
    });
    const definitionsByName = /* @__PURE__ */ new Map();
    const deduplicatedIndexes = [];
    for (const index of resolvedIndexes){
        const definition = JSON.stringify([
            index.columns,
            index.unique ?? false
        ]);
        const identifierKey = getPortableDatabaseIdentifierKey(index.name);
        const existingDefinition = definitionsByName.get(identifierKey);
        if (existingDefinition && existingDefinition !== definition) throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["BetterAuthError"](`Database index name "${index.name}" identifies more than one index on table "${tableName}".`);
        if (existingDefinition) continue;
        definitionsByName.set(identifierKey, definition);
        deduplicatedIndexes.push(index);
    }
    return deduplicatedIndexes;
}
/**
* Returns a safe generated string length for a column across all of its table
* indexes in byte-limited SQL dialects.
*/ function getDatabaseIndexStringLength({ columnName, dialect, fields, indexes }) {
    const fieldsByColumn = new Map(Object.entries(fields).map(([fieldName, field])=>[
            field.fieldName || fieldName,
            field
        ]));
    const containingIndexes = indexes.filter((index)=>index.columns.includes(columnName));
    if (containingIndexes.length === 0) return void 0;
    const byteBudget = dialect === "mysql" ? 3072 : 1700;
    const bytesPerCharacter = dialect === "mysql" ? 4 : 1;
    const defaultLength = dialect === "mysql" ? 191 : 255;
    return containingIndexes.reduce((length, index)=>{
        const stringColumnCount = index.columns.filter((column)=>{
            const type = fieldsByColumn.get(column)?.type;
            return type === "string" || Array.isArray(type);
        }).length;
        if (stringColumnCount === 0) return length;
        const nonStringColumnBytes = (index.columns.length - stringColumnCount) * 16;
        const safeLength = Math.floor(Math.max(1, byteBudget - nonStringColumnBytes) / bytesPerCharacter / stringColumnCount);
        return Math.min(length, safeLength);
    }, defaultLength);
}
/**
* Resolves and validates every table index as one portable database schema.
*
* Index names are schema-wide because SQLite and PostgreSQL do not scope them
* to an individual table.
*/ function resolveDatabaseSchemaIndexes(sources) {
    const mergedSourcesByTable = /* @__PURE__ */ new Map();
    for (const source of sources){
        const existingSource = mergedSourcesByTable.get(source.tableName);
        if (existingSource) {
            if (existingSource.indexes.length > 0 || (source.indexes?.length ?? 0) > 0) throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["BetterAuthError"](`Database schema resolves more than one indexed logical table to "${source.tableName}". Define table-level indexes through one logical schema key instead of aliasing multiple keys to the same database table.`);
            Object.assign(existingSource.fields, source.fields);
            continue;
        }
        const mergedSource = {
            fields: {},
            indexes: [],
            tableName: source.tableName
        };
        Object.assign(mergedSource.fields, source.fields);
        mergedSource.indexes.push(...source.indexes ?? []);
        mergedSourcesByTable.set(source.tableName, mergedSource);
    }
    const indexesByTable = /* @__PURE__ */ new Map();
    const indexOwnerByName = /* @__PURE__ */ new Map();
    const tableNamesByIdentifier = new Map([
        ...mergedSourcesByTable.keys()
    ].map((tableName)=>[
            getPortableDatabaseIdentifierKey(tableName),
            tableName
        ]));
    const fieldIndexOwnerByName = /* @__PURE__ */ new Map();
    for (const source of mergedSourcesByTable.values())for (const [fieldName, field] of Object.entries(source.fields)){
        if (!field.index && !field.unique) continue;
        const indexName = getDatabaseFieldIndexName(source.tableName, field.fieldName || fieldName, field.unique ?? false);
        const identifierKey = getPortableDatabaseIdentifierKey(indexName);
        if (tableNamesByIdentifier.has(identifierKey)) throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["BetterAuthError"](`Database index name "${indexName}" conflicts with a table name. Index and table names must be unique across the schema.`);
        const existingOwner = fieldIndexOwnerByName.get(identifierKey);
        if (existingOwner) throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["BetterAuthError"](`Database field-level index name "${indexName}" is used by both table "${existingOwner}" and table "${source.tableName}".`);
        fieldIndexOwnerByName.set(identifierKey, source.tableName);
    }
    for (const source of mergedSourcesByTable.values()){
        const resolvedIndexes = resolveDatabaseTableIndexes(source);
        indexesByTable.set(source.tableName, [
            ...resolvedIndexes
        ]);
        for (const index of resolvedIndexes){
            const identifierKey = getPortableDatabaseIdentifierKey(index.name);
            if (tableNamesByIdentifier.has(identifierKey)) throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["BetterAuthError"](`Database index name "${index.name}" conflicts with a table name. Index and table names must be unique across the schema.`);
            const fieldIndexOwner = fieldIndexOwnerByName.get(identifierKey);
            if (fieldIndexOwner) throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["BetterAuthError"](`Database index name "${index.name}" is already reserved by field-level index metadata on table "${fieldIndexOwner}". Remove the duplicate table-level index or give it a distinct name.`);
            const indexOwner = indexOwnerByName.get(identifierKey);
            if (indexOwner && indexOwner !== source.tableName) throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["BetterAuthError"](`Database index name "${index.name}" is used by both table "${indexOwner}" and table "${source.tableName}". Index names must be unique across the schema.`);
            indexOwnerByName.set(identifierKey, source.tableName);
        }
    }
    return indexesByTable;
}
;
}),
"[project]/examples/nextjs/node_modules/@better-auth/core/dist/db/get-tables.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getAuthTables",
    ()=>getAuthTables,
    "getAuthTablesWithResolvedIndexes",
    ()=>getAuthTablesWithResolvedIndexes
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$db$2f$database$2d$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/db/database-index.mjs [app-rsc] (ecmascript)");
;
//#region src/db/get-tables.ts
function mergeTableIndexes(...indexCollections) {
    const indexes = [];
    const seenIndexDefinitions = /* @__PURE__ */ new Set();
    for (const index of indexCollections.flatMap((collection)=>collection ?? [])){
        const definition = JSON.stringify([
            index.name ?? null,
            index.fields,
            index.unique ?? false
        ]);
        if (seenIndexDefinitions.has(definition)) continue;
        seenIndexDefinitions.add(definition);
        indexes.push(index);
    }
    return indexes;
}
const buildAuthTables = (options)=>{
    const pluginSchema = (options.plugins ?? []).reduce((acc, plugin)=>{
        const schema = plugin.schema;
        if (!schema) return acc;
        for (const [key, value] of Object.entries(schema))acc[key] = {
            fields: {
                ...acc[key]?.fields,
                ...value.fields
            },
            indexes: mergeTableIndexes(acc[key]?.indexes, value.indexes),
            modelName: value.modelName || key,
            disableMigrations: value.disableMigration ?? acc[key]?.disableMigrations
        };
        return acc;
    }, {});
    const shouldAddRateLimitTable = options.rateLimit?.storage === "database";
    const rateLimitTable = {
        rateLimit: {
            modelName: options.rateLimit?.modelName || "rateLimit",
            fields: {
                key: {
                    type: "string",
                    unique: true,
                    required: true,
                    fieldName: options.rateLimit?.fields?.key || "key"
                },
                count: {
                    type: "number",
                    required: true,
                    fieldName: options.rateLimit?.fields?.count || "count"
                },
                lastRequest: {
                    type: "number",
                    bigint: true,
                    required: true,
                    fieldName: options.rateLimit?.fields?.lastRequest || "lastRequest",
                    defaultValue: ()=>Date.now()
                }
            }
        }
    };
    const { user, session, account, verification, ...pluginTables } = pluginSchema;
    const verificationTable = {
        verification: {
            modelName: options.verification?.modelName || "verification",
            indexes: verification?.indexes,
            fields: {
                identifier: {
                    type: "string",
                    required: true,
                    fieldName: options.verification?.fields?.identifier || "identifier",
                    index: true
                },
                value: {
                    type: "string",
                    required: true,
                    fieldName: options.verification?.fields?.value || "value"
                },
                expiresAt: {
                    type: "date",
                    required: true,
                    fieldName: options.verification?.fields?.expiresAt || "expiresAt"
                },
                createdAt: {
                    type: "date",
                    required: true,
                    defaultValue: ()=>/* @__PURE__ */ new Date(),
                    fieldName: options.verification?.fields?.createdAt || "createdAt"
                },
                updatedAt: {
                    type: "date",
                    required: true,
                    defaultValue: ()=>/* @__PURE__ */ new Date(),
                    onUpdate: ()=>/* @__PURE__ */ new Date(),
                    fieldName: options.verification?.fields?.updatedAt || "updatedAt"
                },
                ...verification?.fields,
                ...options.verification?.additionalFields
            },
            order: 4
        }
    };
    const sessionTable = {
        session: {
            modelName: options.session?.modelName || "session",
            indexes: session?.indexes,
            fields: {
                expiresAt: {
                    type: "date",
                    required: true,
                    fieldName: options.session?.fields?.expiresAt || "expiresAt"
                },
                token: {
                    type: "string",
                    required: true,
                    fieldName: options.session?.fields?.token || "token",
                    unique: true
                },
                createdAt: {
                    type: "date",
                    required: true,
                    fieldName: options.session?.fields?.createdAt || "createdAt",
                    defaultValue: ()=>/* @__PURE__ */ new Date()
                },
                updatedAt: {
                    type: "date",
                    required: true,
                    fieldName: options.session?.fields?.updatedAt || "updatedAt",
                    onUpdate: ()=>/* @__PURE__ */ new Date()
                },
                ipAddress: {
                    type: "string",
                    required: false,
                    fieldName: options.session?.fields?.ipAddress || "ipAddress"
                },
                userAgent: {
                    type: "string",
                    required: false,
                    fieldName: options.session?.fields?.userAgent || "userAgent"
                },
                userId: {
                    type: "string",
                    fieldName: options.session?.fields?.userId || "userId",
                    references: {
                        model: "user",
                        field: "id",
                        onDelete: "cascade"
                    },
                    required: true,
                    index: true
                },
                ...session?.fields,
                ...options.session?.additionalFields
            },
            order: 2
        }
    };
    return {
        user: {
            modelName: options.user?.modelName || "user",
            indexes: user?.indexes,
            fields: {
                name: {
                    type: "string",
                    required: true,
                    fieldName: options.user?.fields?.name || "name",
                    sortable: true
                },
                email: {
                    type: "string",
                    unique: true,
                    required: true,
                    fieldName: options.user?.fields?.email || "email",
                    sortable: true
                },
                emailVerified: {
                    type: "boolean",
                    defaultValue: false,
                    required: true,
                    fieldName: options.user?.fields?.emailVerified || "emailVerified",
                    input: false
                },
                image: {
                    type: "string",
                    required: false,
                    fieldName: options.user?.fields?.image || "image"
                },
                createdAt: {
                    type: "date",
                    defaultValue: ()=>/* @__PURE__ */ new Date(),
                    required: true,
                    fieldName: options.user?.fields?.createdAt || "createdAt"
                },
                updatedAt: {
                    type: "date",
                    defaultValue: ()=>/* @__PURE__ */ new Date(),
                    onUpdate: ()=>/* @__PURE__ */ new Date(),
                    required: true,
                    fieldName: options.user?.fields?.updatedAt || "updatedAt"
                },
                ...user?.fields,
                ...options.user?.additionalFields
            },
            order: 1
        },
        ...!options.secondaryStorage || options.session?.storeSessionInDatabase ? sessionTable : {},
        account: {
            modelName: options.account?.modelName || "account",
            indexes: account?.indexes,
            fields: {
                accountId: {
                    type: "string",
                    required: true,
                    fieldName: options.account?.fields?.accountId || "accountId"
                },
                providerId: {
                    type: "string",
                    required: true,
                    fieldName: options.account?.fields?.providerId || "providerId"
                },
                userId: {
                    type: "string",
                    references: {
                        model: "user",
                        field: "id",
                        onDelete: "cascade"
                    },
                    required: true,
                    fieldName: options.account?.fields?.userId || "userId",
                    index: true
                },
                accessToken: {
                    type: "string",
                    required: false,
                    returned: false,
                    fieldName: options.account?.fields?.accessToken || "accessToken"
                },
                refreshToken: {
                    type: "string",
                    required: false,
                    returned: false,
                    fieldName: options.account?.fields?.refreshToken || "refreshToken"
                },
                idToken: {
                    type: "string",
                    required: false,
                    returned: false,
                    fieldName: options.account?.fields?.idToken || "idToken"
                },
                accessTokenExpiresAt: {
                    type: "date",
                    required: false,
                    returned: false,
                    fieldName: options.account?.fields?.accessTokenExpiresAt || "accessTokenExpiresAt"
                },
                refreshTokenExpiresAt: {
                    type: "date",
                    required: false,
                    returned: false,
                    fieldName: options.account?.fields?.refreshTokenExpiresAt || "refreshTokenExpiresAt"
                },
                scope: {
                    type: "string",
                    required: false,
                    fieldName: options.account?.fields?.scope || "scope"
                },
                password: {
                    type: "string",
                    required: false,
                    returned: false,
                    fieldName: options.account?.fields?.password || "password"
                },
                createdAt: {
                    type: "date",
                    required: true,
                    fieldName: options.account?.fields?.createdAt || "createdAt",
                    defaultValue: ()=>/* @__PURE__ */ new Date()
                },
                updatedAt: {
                    type: "date",
                    required: true,
                    fieldName: options.account?.fields?.updatedAt || "updatedAt",
                    onUpdate: ()=>/* @__PURE__ */ new Date()
                },
                ...account?.fields,
                ...options.account?.additionalFields
            },
            order: 3
        },
        ...!options.secondaryStorage || options.verification?.storeInDatabase ? verificationTable : {},
        ...pluginTables,
        ...shouldAddRateLimitTable ? rateLimitTable : {}
    };
};
function getAuthTablesWithResolvedIndexes(options) {
    const tables = buildAuthTables(options);
    return {
        indexesByTable: (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$db$2f$database$2d$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["resolveDatabaseSchemaIndexes"])(Object.values(tables).filter((table)=>!("disableMigrations" in table) || !table.disableMigrations).map((table)=>({
                fields: table.fields,
                indexes: "indexes" in table ? table.indexes : void 0,
                tableName: table.modelName
            }))),
        tables
    };
}
const getAuthTables = (options)=>getAuthTablesWithResolvedIndexes(options).tables;
;
}),
"[project]/examples/nextjs/node_modules/@better-auth/core/dist/db/schema-check.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "checksSchema",
    ()=>checksSchema,
    "createSchemaCheck",
    ()=>createSchemaCheck,
    "invalidateSchemaChecks",
    ()=>invalidateSchemaChecks,
    "registerSchemaCheck",
    ()=>registerSchemaCheck,
    "runtimeSchemaCheckFor",
    ()=>runtimeSchemaCheckFor,
    "schemaCheckFor",
    ()=>schemaCheckFor
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$db$2f$schema$2d$diff$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/db/schema-diff.mjs [app-rsc] (ecmascript)");
;
//#region src/db/schema-check.ts
/**
* Whether the adapter validates its schema. Enabled in every environment
* unless explicitly disabled.
*/ function checksSchema(options) {
    return options.advanced?.database?.validateSchema !== false;
}
const schemaChecks = /* @__PURE__ */ new WeakMap();
const schemaRevisions = /* @__PURE__ */ new WeakMap();
/** Invalidates cached checks after Better Auth changes this database's schema. */ function invalidateSchemaChecks(database) {
    const revision = schemaRevisions.get(database);
    if (revision) revision.value++;
}
/**
* Attaches a check to the adapter it verifies. The adapter object itself is
* left untouched, so this works for adapters Better Auth does not own.
*/ function registerSchemaCheck(adapter, check, options = {}) {
    const runtimeEnabled = options.runtimeEnabled ?? true;
    schemaChecks.set(adapter, {
        check,
        runtimeEnabled
    });
}
/**
* The registered check, regardless of whether runtime validation is enabled.
*/ function schemaCheckFor(adapter) {
    return schemaChecks.get(adapter)?.check;
}
/**
* The check used by runtime paths, when runtime validation is enabled.
*/ function runtimeSchemaCheckFor(adapter) {
    const registration = schemaChecks.get(adapter);
    return registration?.runtimeEnabled ? registration.check : void 0;
}
/**
* Turns a schema comparison into a check shared by one adapter instance.
*
* The first call runs `find` and every concurrent call shares that promise. A
* clean result is cached until invalidation. A mismatch is kept as one
* {@link SchemaMismatchError} and rethrown on every later call without asking
* the store again, until a migration invalidates it. When a database identity is supplied,
* checks for that identity share its schema revision. Pending callers follow
* the new check if their revision is invalidated. A failure to reach
* the store is not kept, so the next call asks again.
*
* @example
* ```ts
* const checkSchema = createSchemaCheck(
*   () => findSchemaProblems(db, "postgres", expected),
*   "database",
* );
* const pending = checkSchema();
* if (pending) await pending;
* ```
*/ function createSchemaCheck(find, source, database) {
    let revision = database ? schemaRevisions.get(database) : void 0;
    if (database && !revision) {
        revision = {
            value: 0
        };
        schemaRevisions.set(database, revision);
    }
    let checkedRevision = revision?.value;
    let clean = false;
    let verdict;
    const checkSchema = function checkSchema() {
        const currentRevision = revision?.value;
        if (checkedRevision !== currentRevision) {
            checkedRevision = currentRevision;
            clean = false;
            verdict = void 0;
        }
        if (clean) return;
        return verdict ??= Promise.resolve().then(find).then((findings)=>{
            if (revision?.value !== currentRevision) return checkSchema();
            if (findings.length) throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$db$2f$schema$2d$diff$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SchemaMismatchError"](findings, source);
            if (checkedRevision === currentRevision) clean = true;
        }, (error)=>{
            if (revision?.value !== currentRevision) return checkSchema();
            if (checkedRevision === currentRevision) verdict = void 0;
            throw error;
        });
    };
    checkSchema.source = source;
    return checkSchema;
}
;
}),
"[project]/examples/nextjs/node_modules/@better-auth/core/dist/db/schema-diff.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SchemaMismatchError",
    ()=>SchemaMismatchError,
    "diffSchema",
    ()=>diffSchema,
    "formatSchemaFinding",
    ()=>formatSchemaFinding,
    "getExpectedSchema",
    ()=>getExpectedSchema
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/error/index.mjs [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$db$2f$get$2d$tables$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/db/get-tables.mjs [app-rsc] (ecmascript)");
;
;
//#region src/db/schema-diff.ts
/**
* The tables this configuration writes, keyed the way the adapter addresses
* them. Tables that share a physical name are merged into one entry.
*/ function getExpectedSchema(options, { usePlural = false } = {}) {
    const expected = {};
    for (const table of Object.values((0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$db$2f$get$2d$tables$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getAuthTables"])(options))){
        const name = usePlural ? `${table.modelName}s` : table.modelName;
        const entry = expected[name] ??= {
            fields: {},
            disableMigrations: true
        };
        for (const [key, field] of Object.entries(table.fields))entry.fields[field.fieldName || key] = field;
        entry.disableMigrations = entry.disableMigrations && !!table.disableMigrations;
    }
    return expected;
}
/**
* Compares the tables Better Auth writes with what the store holds.
*
* A table or column Better Auth writes must exist. A column Better Auth does
* not write must accept an insert that omits it, so it is nullable or carries
* a default. Otherwise every insert into that table fails with a constraint
* error that says nothing about why the schema drifted.
*/ function diffSchema(expected, actual) {
    const findings = [];
    for (const [tableName, table] of Object.entries(expected)){
        if (table.disableMigrations) continue;
        const actualTable = actual.find((candidate)=>candidate.name === tableName && (table.schema === void 0 || candidate.schema === table.schema));
        if (!actualTable) {
            findings.push({
                kind: "missing-table",
                table: tableName
            });
            continue;
        }
        const written = new Set([
            table.idColumn ?? "id",
            ...Object.keys(table.fields)
        ]);
        for (const column of written)if (!actualTable.columns.some((candidate)=>candidate.name === column)) findings.push({
            kind: "missing-column",
            table: tableName,
            column
        });
        for (const column of actualTable.columns){
            if (written.has(column.name) || column.nullable || column.hasDefault) continue;
            findings.push({
                kind: "unexpected-required-column",
                table: tableName,
                column: column.name
            });
        }
    }
    return findings;
}
const applyHint = {
    database: "Run `npx auth migrate` to add it.",
    drizzle: "Run `npx auth generate` to refresh the Drizzle schema, then apply it with your migration tool.",
    prisma: "Run `npx auth generate` to refresh the Prisma schema, then run `prisma migrate`."
};
const relaxHint = {
    database: "Drop the column, make it nullable, or give it a database default.",
    drizzle: "Remove it from the Drizzle schema, make it nullable, or give it a default, then apply the change with your migration tool.",
    prisma: "Remove it from the Prisma schema, make it optional, or give it a default, then run `prisma migrate`."
};
const sourceLabel = {
    database: "Database",
    drizzle: "Drizzle",
    prisma: "Prisma"
};
/**
* One finding as a sentence that names the change resolving it.
*/ function formatSchemaFinding(finding, source) {
    switch(finding.kind){
        case "missing-table":
            return `Table "${finding.table}" is missing. ${applyHint[source]}`;
        case "missing-column":
            return `Column "${finding.column}" is missing from table "${finding.table}". ${applyHint[source]}`;
        case "unexpected-required-column":
            {
                const issuer = finding.column === "issuer" ? " If this column came from Better Auth 1.7.0 through 1.7.2, follow the upgrade guide before removing it: https://www.better-auth.com/docs/guides/1-7-upgrade-guide" : "";
                return `Column "${finding.column}" on table "${finding.table}" is required but Better Auth never writes it, so every insert into "${finding.table}" fails. ${relaxHint[source]}${issuer}`;
            }
    }
}
const repairHint = {
    database: "Make the listed columns nullable, give them defaults, or remove them.",
    drizzle: "Make the listed columns nullable in your Drizzle schema, give them defaults, or remove them.",
    prisma: "Make the listed fields optional in your Prisma schema, give them defaults, or remove them."
};
const migrationHint = {
    ...applyHint,
    database: "Run `npx auth migrate` to add the missing tables and columns."
};
function formatSchemaMismatch(findings, source) {
    const tables = [];
    const columns = [];
    const required = [];
    const affectedTables = /* @__PURE__ */ new Set();
    let hasIssuer = false;
    for (const finding of findings)switch(finding.kind){
        case "missing-table":
            tables.push(finding.table);
            break;
        case "missing-column":
            columns.push(`${finding.table}.${finding.column}`);
            break;
        case "unexpected-required-column":
            required.push(`${finding.table}.${finding.column}`);
            affectedTables.add(finding.table);
            hasIssuer ||= finding.column === "issuer";
            break;
    }
    const sections = [
        `${sourceLabel[source]} schema mismatch`
    ];
    if (tables.length) sections.push(`  Missing tables\n    ${tables.join(", ")}`);
    if (columns.length) sections.push(`  Missing columns\n    ${columns.join("\n    ")}`);
    if (required.length) {
        sections.push(`  Required columns Better Auth never writes\n    ${required.join("\n    ")}`);
        sections.push(`  Inserts into ${[
            ...affectedTables
        ].join(", ")} will fail.`);
    }
    const help = [];
    if (required.length) help.push(repairHint[source]);
    if (tables.length || columns.length || required.length && source !== "database") help.push(migrationHint[source]);
    if (help.length) sections.push(`  help: ${help.join("\n        ")}`);
    if (hasIssuer) sections.push("  note: If this column came from Better Auth 1.7.0 through 1.7.2,\n        follow the upgrade guide before removing it:\n        https://www.better-auth.com/docs/guides/1-7-upgrade-guide");
    return sections.join("\n\n");
}
/**
* The store cannot hold what this configuration writes.
*
* `findings` carries every problem as data; `message` lists each one with the
* change that resolves it. Reported during initialization and thrown when
* requests await validation, in every environment. Also thrown by
* `auth migrate` before it changes anything.
*
* @example
* ```ts
* try {
*   await auth.api.getSession({ headers });
* } catch (error) {
*   if (error instanceof SchemaMismatchError) console.error(error.findings);
* }
* ```
*/ var SchemaMismatchError = class extends __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["BetterAuthError"] {
    code = "SCHEMA_MISMATCH";
    constructor(findings, source){
        super(formatSchemaMismatch(findings, source));
        this.findings = findings;
        this.source = source;
    }
};
;
}),
"[project]/examples/nextjs/node_modules/@better-auth/core/dist/db/schema/session.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "sessionSchema",
    ()=>sessionSchema
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$db$2f$schema$2f$shared$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/db/schema/shared.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$coerce$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__coerce$3e$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/zod/v4/classic/coerce.js [app-rsc] (ecmascript) <export * as coerce>");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/zod/v4/classic/schemas.js [app-rsc] (ecmascript)");
;
;
//#region src/db/schema/session.ts
const sessionSchema = __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$db$2f$schema$2f$shared$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["coreSchema"].extend({
    userId: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$coerce$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__coerce$3e$__["coerce"].string(),
    expiresAt: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["date"](),
    token: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["string"](),
    ipAddress: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["string"]().nullish(),
    userAgent: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["string"]().nullish()
});
;
}),
"[project]/examples/nextjs/node_modules/@better-auth/core/dist/db/schema/shared.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "coreSchema",
    ()=>coreSchema
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/zod/v4/classic/schemas.js [app-rsc] (ecmascript)");
;
//#region src/db/schema/shared.ts
const coreSchema = __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["object"]({
    id: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["string"](),
    createdAt: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["date"]().default(()=>/* @__PURE__ */ new Date()),
    updatedAt: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["date"]().default(()=>/* @__PURE__ */ new Date())
});
;
}),
"[project]/examples/nextjs/node_modules/@better-auth/core/dist/db/schema/user.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "userSchema",
    ()=>userSchema
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$db$2f$schema$2f$shared$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/db/schema/shared.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/zod/v4/classic/schemas.js [app-rsc] (ecmascript)");
;
;
//#region src/db/schema/user.ts
const userSchema = __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$db$2f$schema$2f$shared$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["coreSchema"].extend({
    email: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["string"]().transform((val)=>val.toLowerCase()),
    emailVerified: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["boolean"]().default(false),
    name: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["string"](),
    image: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["string"]().nullish()
});
;
}),
"[project]/examples/nextjs/node_modules/@better-auth/core/dist/env/color-depth.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getColorDepth",
    ()=>getColorDepth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$env$2d$impl$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/env/env-impl.mjs [app-rsc] (ecmascript)");
;
//#region src/env/color-depth.ts
const COLORS_2 = 1;
const COLORS_16 = 4;
const COLORS_256 = 8;
const COLORS_16m = 24;
const TERM_ENVS = {
    eterm: COLORS_16,
    cons25: COLORS_16,
    console: COLORS_16,
    cygwin: COLORS_16,
    dtterm: COLORS_16,
    gnome: COLORS_16,
    hurd: COLORS_16,
    jfbterm: COLORS_16,
    konsole: COLORS_16,
    kterm: COLORS_16,
    mlterm: COLORS_16,
    mosh: COLORS_16m,
    putty: COLORS_16,
    st: COLORS_16,
    "rxvt-unicode-24bit": COLORS_16m,
    terminator: COLORS_16m,
    "xterm-kitty": COLORS_16m
};
const CI_ENVS_MAP = new Map(Object.entries({
    APPVEYOR: COLORS_256,
    BUILDKITE: COLORS_256,
    CIRCLECI: COLORS_16m,
    DRONE: COLORS_256,
    GITEA_ACTIONS: COLORS_16m,
    GITHUB_ACTIONS: COLORS_16m,
    GITLAB_CI: COLORS_256,
    TRAVIS: COLORS_256
}));
const TERM_ENVS_REG_EXP = [
    /ansi/,
    /color/,
    /linux/,
    /direct/,
    /^con[0-9]*x[0-9]/,
    /^rxvt/,
    /^screen/,
    /^xterm/,
    /^vt100/,
    /^vt220/
];
function getColorDepth() {
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$env$2d$impl$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getEnvVar"])("FORCE_COLOR") !== void 0) switch((0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$env$2d$impl$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getEnvVar"])("FORCE_COLOR")){
        case "":
        case "1":
        case "true":
            return COLORS_16;
        case "2":
            return COLORS_256;
        case "3":
            return COLORS_16m;
        default:
            return COLORS_2;
    }
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$env$2d$impl$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getEnvVar"])("NODE_DISABLE_COLORS") !== void 0 && (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$env$2d$impl$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getEnvVar"])("NODE_DISABLE_COLORS") !== "" || (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$env$2d$impl$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getEnvVar"])("NO_COLOR") !== void 0 && (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$env$2d$impl$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getEnvVar"])("NO_COLOR") !== "" || (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$env$2d$impl$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getEnvVar"])("TERM") === "dumb") return COLORS_2;
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$env$2d$impl$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getEnvVar"])("TMUX")) return COLORS_16m;
    if ("TF_BUILD" in __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$env$2d$impl$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["env"] && "AGENT_NAME" in __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$env$2d$impl$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["env"]) return COLORS_16;
    if ("CI" in __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$env$2d$impl$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["env"]) {
        for (const { 0: envName, 1: colors } of CI_ENVS_MAP)if (envName in __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$env$2d$impl$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["env"]) return colors;
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$env$2d$impl$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getEnvVar"])("CI_NAME") === "codeship") return COLORS_256;
        return COLORS_2;
    }
    if ("TEAMCITY_VERSION" in __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$env$2d$impl$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["env"]) return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.exec((0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$env$2d$impl$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getEnvVar"])("TEAMCITY_VERSION")) !== null ? COLORS_16 : COLORS_2;
    switch((0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$env$2d$impl$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getEnvVar"])("TERM_PROGRAM")){
        case "iTerm.app":
            if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$env$2d$impl$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getEnvVar"])("TERM_PROGRAM_VERSION") || /^[0-2]\./.exec((0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$env$2d$impl$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getEnvVar"])("TERM_PROGRAM_VERSION")) !== null) return COLORS_256;
            return COLORS_16m;
        case "HyperTerm":
        case "MacTerm":
            return COLORS_16m;
        case "Apple_Terminal":
            return COLORS_256;
    }
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$env$2d$impl$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getEnvVar"])("COLORTERM") === "truecolor" || (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$env$2d$impl$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getEnvVar"])("COLORTERM") === "24bit") return COLORS_16m;
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$env$2d$impl$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getEnvVar"])("TERM")) {
        if (/truecolor/.exec((0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$env$2d$impl$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getEnvVar"])("TERM")) !== null) return COLORS_16m;
        if (/^xterm-256/.exec((0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$env$2d$impl$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getEnvVar"])("TERM")) !== null) return COLORS_256;
        const termEnv = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$env$2d$impl$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getEnvVar"])("TERM").toLowerCase();
        if (TERM_ENVS[termEnv]) return TERM_ENVS[termEnv];
        if (TERM_ENVS_REG_EXP.some((term)=>term.exec(termEnv) !== null)) return COLORS_16;
    }
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$env$2d$impl$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getEnvVar"])("COLORTERM")) return COLORS_16;
    return COLORS_2;
}
;
}),
"[project]/examples/nextjs/node_modules/@better-auth/core/dist/env/env-impl.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ENV",
    ()=>ENV,
    "env",
    ()=>env,
    "getBooleanEnvVar",
    ()=>getBooleanEnvVar,
    "getEnvVar",
    ()=>getEnvVar,
    "isDevelopment",
    ()=>isDevelopment,
    "isProduction",
    ()=>isProduction,
    "isTest",
    ()=>isTest,
    "nodeENV",
    ()=>nodeENV
]);
//#region src/env/env-impl.ts
const _envShim = Object.create(null);
const _getEnv = (useShim)=>globalThis.process?.env || globalThis.Deno?.env.toObject() || globalThis.__env__ || (useShim ? _envShim : globalThis);
const env = new Proxy(_envShim, {
    get (_, prop) {
        return _getEnv()[prop] ?? _envShim[prop];
    },
    has (_, prop) {
        return prop in _getEnv() || prop in _envShim;
    },
    set (_, prop, value) {
        const env = _getEnv(true);
        env[prop] = value;
        return true;
    },
    deleteProperty (_, prop) {
        if (!prop) return false;
        const env = _getEnv(true);
        delete env[prop];
        return true;
    },
    ownKeys () {
        const env = _getEnv(true);
        return Object.keys(env);
    }
});
function toBoolean(val) {
    return val ? val !== "false" : false;
}
const nodeENV = env.NODE_ENV ?? "";
/** Detect if `NODE_ENV` environment variable is `production` */ const isProduction = nodeENV === "production";
/** Detect if `NODE_ENV` environment variable is `dev` or `development` */ const isDevelopment = ()=>nodeENV === "dev" || nodeENV === "development";
/** Detect if `NODE_ENV` environment variable is `test` */ const isTest = ()=>nodeENV === "test" || toBoolean(env.TEST);
/**
* Get environment variable with fallback
*/ function getEnvVar(key, fallback) {
    if (typeof process !== "undefined" && process.env) return process.env[key] ?? fallback;
    if (typeof Deno !== "undefined") return Deno.env.get(key) ?? fallback;
    if (typeof Bun !== "undefined") return Bun.env[key] ?? fallback;
    return fallback;
}
/**
* Get boolean environment variable
*/ function getBooleanEnvVar(key, fallback = true) {
    const value = getEnvVar(key);
    if (!value) return fallback;
    return value !== "0" && value.toLowerCase() !== "false" && value !== "";
}
/**
* Common environment variables used in Better Auth
*/ const ENV = Object.freeze({
    get BETTER_AUTH_SECRET () {
        return getEnvVar("BETTER_AUTH_SECRET");
    },
    get AUTH_SECRET () {
        return getEnvVar("AUTH_SECRET");
    },
    get BETTER_AUTH_TELEMETRY () {
        return getEnvVar("BETTER_AUTH_TELEMETRY");
    },
    get BETTER_AUTH_TELEMETRY_ID () {
        return getEnvVar("BETTER_AUTH_TELEMETRY_ID");
    },
    get NODE_ENV () {
        return getEnvVar("NODE_ENV", "development");
    },
    get PACKAGE_VERSION () {
        return getEnvVar("PACKAGE_VERSION", "0.0.0");
    },
    get BETTER_AUTH_TELEMETRY_ENDPOINT () {
        return getEnvVar("BETTER_AUTH_TELEMETRY_ENDPOINT", "");
    }
});
;
}),
"[project]/examples/nextjs/node_modules/@better-auth/core/dist/env/logger.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TTY_COLORS",
    ()=>TTY_COLORS,
    "createLogger",
    ()=>createLogger,
    "levels",
    ()=>levels,
    "logger",
    ()=>logger,
    "shouldPublishLog",
    ()=>shouldPublishLog
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$global$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/context/global.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$color$2d$depth$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/env/color-depth.mjs [app-rsc] (ecmascript)");
;
;
//#region src/env/logger.ts
const TTY_COLORS = {
    reset: "\x1B[0m",
    bright: "\x1B[1m",
    dim: "\x1B[2m",
    undim: "\x1B[22m",
    underscore: "\x1B[4m",
    blink: "\x1B[5m",
    reverse: "\x1B[7m",
    hidden: "\x1B[8m",
    fg: {
        black: "\x1B[30m",
        red: "\x1B[31m",
        green: "\x1B[32m",
        yellow: "\x1B[33m",
        blue: "\x1B[34m",
        magenta: "\x1B[35m",
        cyan: "\x1B[36m",
        white: "\x1B[37m"
    },
    bg: {
        black: "\x1B[40m",
        red: "\x1B[41m",
        green: "\x1B[42m",
        yellow: "\x1B[43m",
        blue: "\x1B[44m",
        magenta: "\x1B[45m",
        cyan: "\x1B[46m",
        white: "\x1B[47m"
    }
};
const levels = [
    "debug",
    "info",
    "success",
    "warn",
    "error"
];
function shouldPublishLog(currentLogLevel, logLevel) {
    return levels.indexOf(logLevel) >= levels.indexOf(currentLogLevel);
}
const levelColors = {
    info: TTY_COLORS.fg.blue,
    success: TTY_COLORS.fg.green,
    warn: TTY_COLORS.fg.yellow,
    error: TTY_COLORS.fg.red,
    debug: TTY_COLORS.fg.magenta
};
const formatMessage = (level, message, colorsEnabled)=>{
    const timestamp = /* @__PURE__ */ new Date().toISOString();
    if (colorsEnabled) return `${TTY_COLORS.dim}${timestamp}${TTY_COLORS.reset} ${levelColors[level]}${level.toUpperCase()}${TTY_COLORS.reset} ${TTY_COLORS.bright}[Better Auth]:${TTY_COLORS.reset} ${message}`;
    return `${timestamp} ${level.toUpperCase()} [Better Auth]: ${message}`;
};
const createLogger = (options)=>{
    const enabled = options?.disabled !== true;
    const logLevel = options?.level ?? "warn";
    const colorsEnabled = options?.disableColors !== void 0 ? !options.disableColors : (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$color$2d$depth$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getColorDepth"])() !== 1;
    const LogFunc = (level, message, args = [])=>{
        if (!enabled || !shouldPublishLog(logLevel, level)) return;
        const formattedMessage = formatMessage(level, message, colorsEnabled);
        if (!options || typeof options.log !== "function") {
            if (level === "error") console.error(formattedMessage, ...args);
            else if (level === "warn") console.warn(formattedMessage, ...args);
            else console.log(formattedMessage, ...args);
            return;
        }
        options.log(level === "success" ? "info" : level, message, ...args);
    };
    return {
        ...Object.fromEntries(levels.map((level)=>[
                level,
                (...[message, ...args])=>LogFunc(level, message, args)
            ])),
        get level () {
            return logLevel;
        }
    };
};
const defaultLogger = createLogger();
const getCurrentLogger = ()=>{
    const currentLogger = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$global$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["__getCurrentEndpointContext"])()?.context.logger;
    return currentLogger && currentLogger !== logger ? currentLogger : defaultLogger;
};
const logger = {
    debug: (...params)=>getCurrentLogger().debug(...params),
    info: (...params)=>getCurrentLogger().info(...params),
    success: (...params)=>getCurrentLogger().success(...params),
    warn: (...params)=>getCurrentLogger().warn(...params),
    error: (...params)=>getCurrentLogger().error(...params),
    get level () {
        return getCurrentLogger().level;
    }
};
;
}),
"[project]/examples/nextjs/node_modules/@better-auth/core/dist/error/codes.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BASE_ERROR_CODES",
    ()=>BASE_ERROR_CODES
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$error$2d$codes$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/utils/error-codes.mjs [app-rsc] (ecmascript)");
;
//#region src/error/codes.ts
const BASE_ERROR_CODES = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$error$2d$codes$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["defineErrorCodes"])({
    USER_NOT_FOUND: "User not found",
    FAILED_TO_CREATE_USER: "Failed to create user",
    FAILED_TO_CREATE_SESSION: "Failed to create session",
    FAILED_TO_UPDATE_USER: "Failed to update user",
    FAILED_TO_GET_SESSION: "Failed to get session",
    INVALID_PASSWORD: "Invalid password",
    INVALID_EMAIL: "Invalid email",
    INVALID_EMAIL_OR_PASSWORD: "Invalid email or password",
    INVALID_USER: "Invalid user",
    SOCIAL_ACCOUNT_ALREADY_LINKED: "Social account already linked",
    PROVIDER_NOT_FOUND: "Provider not found",
    INVALID_TOKEN: "Invalid token",
    TOKEN_EXPIRED: "Token expired",
    ID_TOKEN_NOT_SUPPORTED: "id_token not supported",
    FAILED_TO_GET_USER_INFO: "Failed to get user info",
    USER_EMAIL_NOT_FOUND: "User email not found",
    EMAIL_NOT_VERIFIED: "Email not verified",
    PASSWORD_TOO_SHORT: "Password too short",
    PASSWORD_TOO_LONG: "Password too long",
    USER_ALREADY_EXISTS: "User already exists.",
    USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: "User already exists. Use another email.",
    EMAIL_CAN_NOT_BE_UPDATED: "Email can not be updated",
    CHANGE_EMAIL_DISABLED: "Change email is disabled",
    CREDENTIAL_ACCOUNT_NOT_FOUND: "Credential account not found",
    SESSION_EXPIRED: "Session expired. Re-authenticate to perform this action.",
    FAILED_TO_UNLINK_LAST_ACCOUNT: "You can't unlink your last account",
    ACCOUNT_NOT_FOUND: "Account not found",
    USER_ALREADY_HAS_PASSWORD: "User already has a password. Provide that to delete the account.",
    CROSS_SITE_NAVIGATION_LOGIN_BLOCKED: "Cross-site navigation login blocked. This request appears to be a CSRF attack.",
    VERIFICATION_EMAIL_NOT_ENABLED: "Verification email isn't enabled",
    EMAIL_ALREADY_VERIFIED: "Email is already verified",
    EMAIL_MISMATCH: "Email mismatch",
    SESSION_NOT_FRESH: "Session is not fresh",
    LINKED_ACCOUNT_ALREADY_EXISTS: "Linked account already exists",
    INVALID_ORIGIN: "Invalid origin",
    INVALID_CALLBACK_URL: "Invalid callbackURL",
    INVALID_REDIRECT_URL: "Invalid redirectURL",
    INVALID_ERROR_CALLBACK_URL: "Invalid errorCallbackURL",
    INVALID_NEW_USER_CALLBACK_URL: "Invalid newUserCallbackURL",
    MISSING_OR_NULL_ORIGIN: "Missing or null Origin",
    CALLBACK_URL_REQUIRED: "callbackURL is required",
    FAILED_TO_CREATE_VERIFICATION: "Unable to create verification",
    FIELD_NOT_ALLOWED: "Field not allowed to be set",
    ASYNC_VALIDATION_NOT_SUPPORTED: "Async validation is not supported",
    VALIDATION_ERROR: "Validation Error",
    MISSING_FIELD: "Field is required",
    METHOD_NOT_ALLOWED_DEFER_SESSION_REQUIRED: "POST method requires deferSessionRefresh to be enabled in session config",
    BODY_MUST_BE_AN_OBJECT: "Body must be an object",
    PASSWORD_ALREADY_SET: "User already has a password set"
});
;
}),
"[project]/examples/nextjs/node_modules/@better-auth/core/dist/error/index.mjs [app-rsc] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "APIError",
    ()=>APIError,
    "BetterAuthError",
    ()=>BetterAuthError
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/error/codes.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$call$2f$dist$2f$error$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-call/dist/error.mjs [app-rsc] (ecmascript)");
;
;
//#region src/error/index.ts
var BetterAuthError = class extends Error {
    constructor(message, options){
        super(message, options);
        this.name = "BetterAuthError";
        this.message = message;
        this.stack = "";
    }
};
var APIError = class APIError extends __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$call$2f$dist$2f$error$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["APIError"] {
    constructor(...args){
        super(...args);
    }
    static fromStatus(status, body) {
        return new APIError(status, body);
    }
    static from(status, error, options) {
        const { code, message } = error;
        if (options?.cause === void 0) return new APIError(status, {
            message,
            code
        });
        return new APIError(status, {
            message,
            code,
            cause: options.cause
        });
    }
};
;
}),
"[project]/examples/nextjs/node_modules/@better-auth/core/dist/instrumentation/api.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getOpenTelemetryAPI",
    ()=>getOpenTelemetryAPI
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$instrumentation$2f$noop$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/instrumentation/noop.mjs [app-rsc] (ecmascript)");
;
//#region src/instrumentation/api.ts
let openTelemetryAPIPromise;
let openTelemetryAPI;
async function loadOpenTelemetryAPI() {
    try {
        openTelemetryAPI = await __turbopack_context__.A("[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs, async loader)");
    } catch  {}
}
function getOpenTelemetryAPI() {
    if (!openTelemetryAPIPromise) openTelemetryAPIPromise = loadOpenTelemetryAPI();
    return openTelemetryAPI ?? __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$instrumentation$2f$noop$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["noopOpenTelemetryAPI"];
}
;
}),
"[project]/examples/nextjs/node_modules/@better-auth/core/dist/instrumentation/attributes.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ATTR_CONTEXT",
    ()=>ATTR_CONTEXT,
    "ATTR_DB_COLLECTION_NAME",
    ()=>ATTR_DB_COLLECTION_NAME,
    "ATTR_DB_OPERATION_NAME",
    ()=>ATTR_DB_OPERATION_NAME,
    "ATTR_HOOK_TYPE",
    ()=>ATTR_HOOK_TYPE,
    "ATTR_HTTP_RESPONSE_STATUS_CODE",
    ()=>ATTR_HTTP_RESPONSE_STATUS_CODE,
    "ATTR_HTTP_ROUTE",
    ()=>ATTR_HTTP_ROUTE,
    "ATTR_OPERATION_ID",
    ()=>ATTR_OPERATION_ID
]);
//#region src/instrumentation/attributes.ts
/** Database collection accessed by the operation. */ const ATTR_DB_COLLECTION_NAME = "db.collection.name";
/** Database operation performed by the span. */ const ATTR_DB_OPERATION_NAME = "db.operation.name";
/** HTTP response status code. */ const ATTR_HTTP_RESPONSE_STATUS_CODE = "http.response.status_code";
/** Matched HTTP route template. */ const ATTR_HTTP_ROUTE = "http.route";
/** Operation identifier (e.g. getSession, signUpWithEmailAndPassword). Uses endpoint operationId when set, otherwise the endpoint key. */ const ATTR_OPERATION_ID = "better_auth.operation_id";
/** Hook type (e.g. before, after, create.before). */ const ATTR_HOOK_TYPE = "better_auth.hook.type";
/** Execution context (e.g. user, plugin:id). */ const ATTR_CONTEXT = "better_auth.context";
;
}),
"[project]/examples/nextjs/node_modules/@better-auth/core/dist/instrumentation/noop.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "noopOpenTelemetryAPI",
    ()=>noopOpenTelemetryAPI,
    "noopWithSpan",
    ()=>noopWithSpan
]);
//#region src/instrumentation/noop.ts
function createNoopSpan() {
    const span = {
        end () {},
        setAttribute (_key, _value) {},
        setStatus (_status) {},
        recordException (_exception) {},
        updateName (_name) {
            return span;
        }
    };
    return span;
}
function createNoopTracer(noopSpan) {
    function startActiveSpan(_name, ...rest) {
        const fn = rest[rest.length - 1];
        return fn(noopSpan);
    }
    return {
        startActiveSpan
    };
}
function createNoopTraceAPI() {
    const noopTracer = createNoopTracer(createNoopSpan());
    return {
        getTracer (_name, _version) {
            return noopTracer;
        },
        getActiveSpan () {}
    };
}
function createNoopOpenTelemetryAPI() {
    return {
        SpanStatusCode: {
            UNSET: 0,
            OK: 1,
            ERROR: 2
        },
        trace: createNoopTraceAPI()
    };
}
const noopOpenTelemetryAPI = createNoopOpenTelemetryAPI();
function noopWithSpan(_name, _attributes, fn) {
    return fn();
}
;
}),
"[project]/examples/nextjs/node_modules/@better-auth/core/dist/instrumentation/tracer.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createWithSpan",
    ()=>createWithSpan,
    "withSpan",
    ()=>withSpan
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$instrumentation$2f$attributes$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/instrumentation/attributes.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$instrumentation$2f$noop$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/instrumentation/noop.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$instrumentation$2f$api$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/instrumentation/api.mjs [app-rsc] (ecmascript)");
;
;
;
//#region src/instrumentation/tracer.ts
const INSTRUMENTATION_SCOPE = "better-auth";
const INSTRUMENTATION_VERSION = "1.7.12";
/**
* Better-auth uses `throw ctx.redirect(url)` for flow control (e.g. OAuth
* callbacks). These are APIErrors with 3xx status codes and should not be
* recorded as span errors.
*/ function isRedirectError(err) {
    if (err != null && typeof err === "object" && "name" in err && err.name === "APIError" && "statusCode" in err) {
        const status = err.statusCode;
        return status >= 300 && status < 400;
    }
    return false;
}
function endSpanWithError(span, err) {
    const { SpanStatusCode } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$instrumentation$2f$api$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getOpenTelemetryAPI"])();
    if (isRedirectError(err)) {
        span.setAttribute(__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$instrumentation$2f$attributes$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ATTR_HTTP_RESPONSE_STATUS_CODE"], err.statusCode);
        span.setStatus({
            code: SpanStatusCode.OK
        });
    } else {
        span.recordException(err);
        span.setStatus({
            code: SpanStatusCode.ERROR,
            message: String(err?.message ?? err)
        });
    }
    span.end();
}
function withSpan(name, attributes, fn) {
    const { trace } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$instrumentation$2f$api$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getOpenTelemetryAPI"])();
    return trace.getTracer(INSTRUMENTATION_SCOPE, INSTRUMENTATION_VERSION).startActiveSpan(name, {
        attributes
    }, (span)=>{
        try {
            const result = fn();
            if (result instanceof Promise) return result.then((value)=>{
                span.end();
                return value;
            }).catch((err)=>{
                endSpanWithError(span, err);
                throw err;
            });
            span.end();
            return result;
        } catch (err) {
            endSpanWithError(span, err);
            throw err;
        }
    });
}
/**
* Selects the span runner for an auth instance.
*/ function createWithSpan(options) {
    return options.experimental?.instrumentation?.enabled === false ? __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$instrumentation$2f$noop$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["noopWithSpan"] : withSpan;
}
;
}),
"[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/authorization-params.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "additionalAuthorizationParamsSchema",
    ()=>additionalAuthorizationParamsSchema
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$create$2d$authorization$2d$url$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/create-authorization-url.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/zod/v4/classic/schemas.js [app-rsc] (ecmascript)");
;
;
//#region src/oauth2/authorization-params.ts
/**
* Zod schema for the `additionalParams` field on social sign-in and
* account-linking request bodies. Rejects any key reserved by the
* authorization-URL builder (see `RESERVED_AUTHORIZATION_PARAMS`), so
* a caller cannot overwrite `state`, PKCE, `redirect_uri`, etc.
*/ const additionalAuthorizationParamsSchema = __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["record"](__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["string"](), __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["string"]()).refine((value)=>!Object.keys(value).some((key)=>__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$create$2d$authorization$2d$url$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["RESERVED_AUTHORIZATION_PARAMS_SET"].has(key)), {
    message: `additionalParams cannot include reserved OAuth parameters: ${__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$create$2d$authorization$2d$url$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["RESERVED_AUTHORIZATION_PARAMS"].join(", ")}`
}).meta({
    description: "Extra query parameters to append to the provider authorization URL (e.g. Cognito identity_provider, Google hd)."
}).optional();
;
}),
"[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/basic-credentials.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "decodeBasicCredentials",
    ()=>decodeBasicCredentials,
    "encodeBasicCredentials",
    ()=>encodeBasicCredentials
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$base64$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/utils/dist/base64.mjs [app-rsc] (ecmascript)");
;
//#region src/oauth2/basic-credentials.ts
const BASIC_AUTHORIZATION_PATTERN = /^Basic +(.*)$/i;
/**
* Encodes a value using `application/x-www-form-urlencoded` per the URL
* Living Standard. Differs from `encodeURIComponent` in two ways: it escapes
* `!`, `'`, `(`, and `)`, and it represents space as `+` rather than `%20`.
* `*` is left unescaped, matching the URL Standard's percent-encode set.
*/ function formUrlEncode(value) {
    return new URLSearchParams({
        v: value
    }).toString().slice(2);
}
/**
* Inverse of `formUrlEncode`: decodes a single `application/x-www-form-urlencoded`
* value, handling both `+` and `%20` as space.
*/ function formUrlDecode(value) {
    const decoded = new URLSearchParams(`v=${value}`).get("v");
    if (decoded === null) throw new Error("form-url-encoded value could not be decoded");
    return decoded;
}
/**
* Encodes an OAuth client id and secret as an HTTP Basic credential string.
*
* Follows RFC 6749 §2.3.1: both values are `application/x-www-form-urlencoded`
* prior to base64 encoding. The returned string is the full value of the
* `Authorization` header, including the `Basic ` prefix.
*/ function encodeBasicCredentials(clientId, clientSecret) {
    const payload = `${formUrlEncode(clientId)}:${formUrlEncode(clientSecret)}`;
    return `Basic ${__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$base64$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["base64"].encode(payload)}`;
}
/**
* Decodes an `Authorization: Basic …` header value into its OAuth client id
* and secret.
*
* Scheme matching is case-insensitive and tolerates one or more spaces
* between the scheme and credentials per RFC 7235 §2.1. The base64 payload
* is split on the first `:` only, so secrets containing colons round-trip
* correctly. Each half is form-url-decoded per RFC 6749 §2.3.1, accepting
* both `+` and `%20` as space. Per the URL Living Standard, invalid
* percent-escapes pass through as-is; downstream client lookup will fail
* with `invalid_client` for malformed credentials.
*
* Throws when the header is not a Basic credential, when the base64 payload
* contains no `:`, or when either half is empty.
*/ function decodeBasicCredentials(authorization) {
    const match = authorization.match(BASIC_AUTHORIZATION_PATTERN);
    if (!match) throw new Error("Authorization header is not a Basic credential");
    const encoded = match[1] ?? "";
    const decoded = new TextDecoder().decode(__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$base64$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["base64"].decode(encoded));
    const separatorIndex = decoded.indexOf(":");
    if (separatorIndex === -1) throw new Error("Basic credential is missing the client id/secret separator");
    const rawClientId = decoded.slice(0, separatorIndex);
    const rawClientSecret = decoded.slice(separatorIndex + 1);
    if (!rawClientId || !rawClientSecret) throw new Error("Basic credential client id and secret must both be non-empty");
    return {
        clientId: formUrlDecode(rawClientId),
        clientSecret: formUrlDecode(rawClientSecret)
    };
}
;
}),
"[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/client-assertion.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CLIENT_ASSERTION_TYPE",
    ()=>CLIENT_ASSERTION_TYPE,
    "PRIVATE_KEY_JWT_SIGNING_ALGORITHMS",
    ()=>PRIVATE_KEY_JWT_SIGNING_ALGORITHMS,
    "createPrivateKeyJwtClientAssertionGetter",
    ()=>createPrivateKeyJwtClientAssertionGetter,
    "resolveClientAssertionParams",
    ()=>resolveClientAssertionParams,
    "signPrivateKeyJwtClientAssertion",
    ()=>signPrivateKeyJwtClientAssertion
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$sign$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/jose/dist/webapi/jwt/sign.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$key$2f$import$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/jose/dist/webapi/key/import.js [app-rsc] (ecmascript)");
;
//#region src/oauth2/client-assertion.ts
/** Asymmetric signing algorithms compatible with private_key_jwt (RFC 7523). */ const PRIVATE_KEY_JWT_SIGNING_ALGORITHMS = [
    "RS256",
    "RS384",
    "RS512",
    "PS256",
    "PS384",
    "PS512",
    "ES256",
    "ES384",
    "ES512",
    "EdDSA"
];
function assertSupportedPrivateKeyJwtAlgorithm(candidate) {
    if (!PRIVATE_KEY_JWT_SIGNING_ALGORITHMS.includes(candidate)) throw new Error(`Unsupported private_key_jwt signing algorithm: ${candidate}. Use one of ${PRIVATE_KEY_JWT_SIGNING_ALGORITHMS.join(", ")}.`);
}
/**
* Validates `private_key_jwt` options eagerly and returns the algorithm to
* use for signing.
*
* Asserts that key material is configured, that any explicit `algorithm` is
* supported, that any JWK-embedded `alg` is supported, and that the two
* agree when both are set.
*/ function resolveValidPrivateKeyJwtOptions(options) {
    if (!options.privateKeyJwk && !options.privateKeyPem) throw new Error("private_key_jwt requires either privateKeyJwk or privateKeyPem");
    if (options.algorithm) assertSupportedPrivateKeyJwtAlgorithm(options.algorithm);
    const jwkAlg = options.privateKeyJwk?.alg;
    if (typeof jwkAlg === "string") assertSupportedPrivateKeyJwtAlgorithm(jwkAlg);
    if (options.algorithm && typeof jwkAlg === "string" && options.algorithm !== jwkAlg) throw new Error(`JWK alg "${jwkAlg}" does not match configured algorithm "${options.algorithm}". Remove the JWK alg field, or pass an algorithm that matches the JWK.`);
    return options.algorithm ?? (typeof jwkAlg === "string" ? jwkAlg : "RS256");
}
const CLIENT_ASSERTION_TYPE = "urn:ietf:params:oauth:client-assertion-type:jwt-bearer";
/**
* Signs an RFC 7523 client assertion JWT for `private_key_jwt` authentication.
*
* The JWT contains these claims:
*
* - iss=clientId
* - sub=clientId
* - aud=tokenEndpoint
* - exp=now + 120s
* - jti=unique
* - iat=now
*/ async function signPrivateKeyJwtClientAssertion({ clientId, tokenEndpoint, privateKeyJwk, privateKeyPem, kid, algorithm, expiresIn = 120 }) {
    const resolvedAlg = resolveValidPrivateKeyJwtOptions({
        privateKeyJwk,
        privateKeyPem,
        algorithm
    });
    const resolvedKid = kid ?? privateKeyJwk?.kid;
    const key = privateKeyJwk ? await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$key$2f$import$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["importJWK"])(privateKeyJwk, resolvedAlg) : await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$key$2f$import$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["importPKCS8"])(privateKeyPem, resolvedAlg);
    const now = Math.floor(Date.now() / 1e3);
    const jti = crypto.randomUUID();
    const header = {
        alg: resolvedAlg,
        typ: "JWT"
    };
    if (resolvedKid) header.kid = resolvedKid;
    return new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$sign$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SignJWT"]({}).setProtectedHeader(header).setIssuer(clientId).setSubject(clientId).setAudience(tokenEndpoint).setIssuedAt(now).setExpirationTime(now + expiresIn).setJti(jti).sign(key);
}
/**
* Creates a client assertion getter for `private_key_jwt` authentication.
*
* Validates options eagerly (key material, supported algorithm, JWK alg
* agreement) so misconfiguration surfaces at construction rather than on the
* first token request. The returned function signs a fresh RFC 7523 JWT
* assertion for every token endpoint request.
*/ function createPrivateKeyJwtClientAssertionGetter(options) {
    resolveValidPrivateKeyJwtOptions({
        privateKeyJwk: options.privateKeyJwk,
        privateKeyPem: options.privateKeyPem,
        algorithm: options.algorithm
    });
    return ({ clientId, tokenEndpoint })=>signPrivateKeyJwtClientAssertion({
            clientId,
            tokenEndpoint,
            privateKeyJwk: options.privateKeyJwk,
            privateKeyPem: options.privateKeyPem,
            kid: options.kid,
            algorithm: options.algorithm,
            expiresIn: options.expiresIn
        });
}
/**
* Resolves a client assertion getter into `client_assertion` + `client_assertion_type` params for injection into a token request body.
*/ async function resolveClientAssertionParams({ getClientAssertion, context }) {
    return {
        client_assertion: await getClientAssertion(context),
        client_assertion_type: CLIENT_ASSERTION_TYPE
    };
}
;
}),
"[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/create-authorization-url.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "RESERVED_AUTHORIZATION_PARAMS",
    ()=>RESERVED_AUTHORIZATION_PARAMS,
    "RESERVED_AUTHORIZATION_PARAMS_SET",
    ()=>RESERVED_AUTHORIZATION_PARAMS_SET,
    "createAuthorizationURL",
    ()=>createAuthorizationURL
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$utils$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/utils.mjs [app-rsc] (ecmascript)");
;
//#region src/oauth2/create-authorization-url.ts
/**
* Query-parameter names that are populated by the framework as part of the
* authorization request and must not be overridden by caller-supplied
* `additionalParams`. Overriding `state`, PKCE, or `redirect_uri` would
* break the callback correlation and session pinning guarantees.
*/ const RESERVED_AUTHORIZATION_PARAMS = [
    "state",
    "client_id",
    "redirect_uri",
    "response_type",
    "code_challenge",
    "code_challenge_method",
    "nonce",
    "scope"
];
const RESERVED_AUTHORIZATION_PARAMS_SET = new Set(RESERVED_AUTHORIZATION_PARAMS);
async function createAuthorizationURL({ id, options, authorizationEndpoint, state, codeVerifier, scopes, claims, redirectURI, duration, prompt, accessType, responseType, display, loginHint, nonce, hd, responseMode, additionalParams, scopeJoiner }) {
    options = typeof options === "function" ? await options() : options;
    const url = new URL(options.authorizationEndpoint || authorizationEndpoint);
    url.searchParams.set("response_type", responseType || "code");
    const primaryClientId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$utils$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getPrimaryClientId"])(options.clientId);
    if (!primaryClientId) throw new Error("OAuth provider requires clientId");
    url.searchParams.set("client_id", primaryClientId);
    url.searchParams.set("state", state);
    if (scopes?.length) url.searchParams.set("scope", scopes.join(scopeJoiner || " "));
    url.searchParams.set("redirect_uri", options.redirectURI || redirectURI);
    duration && url.searchParams.set("duration", duration);
    display && url.searchParams.set("display", display);
    loginHint && url.searchParams.set("login_hint", loginHint);
    nonce && url.searchParams.set("nonce", nonce);
    prompt && url.searchParams.set("prompt", prompt);
    hd && url.searchParams.set("hd", hd);
    accessType && url.searchParams.set("access_type", accessType);
    responseMode && url.searchParams.set("response_mode", responseMode);
    if (codeVerifier) {
        const codeChallenge = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$utils$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["generateCodeChallenge"])(codeVerifier);
        url.searchParams.set("code_challenge_method", "S256");
        url.searchParams.set("code_challenge", codeChallenge);
    }
    if (claims) {
        const claimsObj = claims.reduce((acc, claim)=>{
            acc[claim] = null;
            return acc;
        }, {});
        url.searchParams.set("claims", JSON.stringify({
            id_token: {
                email: null,
                email_verified: null,
                ...claimsObj
            }
        }));
    }
    if (additionalParams) for (const [key, value] of Object.entries(additionalParams)){
        if (RESERVED_AUTHORIZATION_PARAMS_SET.has(key)) continue;
        url.searchParams.set(key, value);
    }
    return url;
}
;
}),
"[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/dpop.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BEARER_AUTHORIZATION_SCHEME",
    ()=>BEARER_AUTHORIZATION_SCHEME,
    "DPOP_AUTHORIZATION_SCHEME",
    ()=>DPOP_AUTHORIZATION_SCHEME,
    "DPOP_PROOF_TYPE",
    ()=>DPOP_PROOF_TYPE,
    "DPOP_SIGNING_ALGORITHMS",
    ()=>DPOP_SIGNING_ALGORITHMS,
    "createDpopBindingError",
    ()=>createDpopBindingError,
    "createDpopProofError",
    ()=>createDpopProofError,
    "createDpopReplayStore",
    ()=>createDpopReplayStore,
    "createInMemoryDpopReplayStore",
    ()=>createInMemoryDpopReplayStore,
    "deriveDpopAth",
    ()=>deriveDpopAth,
    "deriveDpopJkt",
    ()=>deriveDpopJkt,
    "enforceDpopBinding",
    ()=>enforceDpopBinding,
    "getConfirmationJkt",
    ()=>getConfirmationJkt,
    "getDpopJktFromPayload",
    ()=>getDpopJktFromPayload,
    "isDpopBindingError",
    ()=>isDpopBindingError,
    "isDpopProofError",
    ()=>isDpopProofError,
    "normalizeDpopHtu",
    ()=>normalizeDpopHtu,
    "parseAccessTokenAuthorization",
    ()=>parseAccessTokenAuthorization,
    "stripAccessTokenAuthorizationScheme",
    ()=>stripAccessTokenAuthorizationScheme,
    "verifyDpopProof",
    ()=>verifyDpopProof
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$base64url$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__base64url__$2e$encode$3e$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/jose/dist/webapi/util/base64url.js [app-rsc] (ecmascript) <export * as base64url .encode>");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwk$2f$thumbprint$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/jose/dist/webapi/jwk/thumbprint.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$decode_protected_header$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/jose/dist/webapi/util/decode_protected_header.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$key$2f$import$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/jose/dist/webapi/key/import.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$verify$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/jose/dist/webapi/jwt/verify.js [app-rsc] (ecmascript)");
;
//#region src/oauth2/dpop.ts
const DPOP_AUTHORIZATION_SCHEME = "DPoP";
const BEARER_AUTHORIZATION_SCHEME = "Bearer";
const DPOP_PROOF_TYPE = "dpop+jwt";
const DPOP_SIGNING_ALGORITHMS = [
    "EdDSA",
    "ES256",
    "ES512",
    "PS256",
    "RS256"
];
const DEFAULT_DPOP_PROOF_MAX_AGE_SECONDS = 300;
const MAX_DPOP_JTI_LENGTH = 512;
const JWK_PRIVATE_FIELDS = new Set([
    "d",
    "p",
    "q",
    "dp",
    "dq",
    "qi",
    "oth",
    "k"
]);
function createInMemoryDpopReplayStore() {
    const reservations = /* @__PURE__ */ new Map();
    return {
        reserve ({ key, expiresAt, now }) {
            const nowMs = now.getTime();
            for (const [storedKey, expiresAtMs] of reservations)if (expiresAtMs <= nowMs) reservations.delete(storedKey);
            if (reservations.has(key)) return false;
            reservations.set(key, expiresAt.getTime());
            return true;
        }
    };
}
/**
* Database-backed DPoP proof replay store built on the auth context's
* verification reservation primitive (`internalAdapter.reserveVerificationValue`),
* the same atomic single-use mechanism that guards SAML assertion ids and other
* one-time tokens. A replayed proof collides on the deterministic reservation id
* so `reserve` returns `false`, giving cross-instance anti-replay. Prefer this
* over {@link createInMemoryDpopReplayStore} for any multi-instance or serverless
* resource server. Requires database-backed verification storage; a
* secondary-storage-only deployment rejects the proof (fails closed).
*/ function createDpopReplayStore(reservations) {
    return {
        reserve: ({ key, expiresAt })=>reservations.reserveVerificationValue({
                identifier: `dpop-proof:${key}`,
                value: key,
                expiresAt
            })
    };
}
function createDpopProofError(code, message) {
    return Object.assign(new Error(message), {
        code
    });
}
function isDpopProofError(error) {
    return error instanceof Error && "code" in error && error.code === "invalid_dpop_proof";
}
function parseAccessTokenAuthorization(authorization) {
    if (!authorization) return void 0;
    const value = authorization.trim();
    if (!value) return void 0;
    const match = /^([A-Za-z][A-Za-z0-9!#$%&'*+.^_`|~-]*)\s+(.+)$/.exec(value);
    if (!match) return {
        scheme: "Unknown",
        token: value
    };
    const scheme = match[1] ?? "";
    const token = match[2]?.trim() ?? "";
    if (scheme.toLowerCase() === "bearer") return {
        scheme: "Bearer",
        token
    };
    if (scheme.toLowerCase() === "dpop") return {
        scheme: "DPoP",
        token
    };
    return {
        scheme: "Unknown",
        token: value
    };
}
function stripAccessTokenAuthorizationScheme(token) {
    return parseAccessTokenAuthorization(token)?.token ?? token;
}
function normalizeDpopHtu(url) {
    const parsed = new URL(url);
    if (parsed.hash) throw new Error("DPoP proof htu must not contain a fragment");
    return `${parsed.origin}${parsed.pathname}`;
}
async function deriveDpopAth(accessToken) {
    const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(accessToken));
    return __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$base64url$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__base64url__$2e$encode$3e$__["base64url"].encode(new Uint8Array(digest));
}
async function deriveDpopJkt(jwk) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwk$2f$thumbprint$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["calculateJwkThumbprint"])(jwk, "sha256");
}
/**
* Extracts the DPoP key thumbprint from an RFC 7800 `cnf` confirmation. The
* input is untrusted (a JWT claim, a JSON column), so any shape other than an
* object carrying a non-empty string `jkt` (a primitive, an array, a different
* confirmation method such as mTLS `x5t#S256`) yields `undefined` instead of
* throwing.
*/ function getConfirmationJkt(confirmation) {
    if (!confirmation || typeof confirmation !== "object" || Array.isArray(confirmation)) return;
    const jkt = confirmation.jkt;
    return typeof jkt === "string" && jkt.length > 0 ? jkt : void 0;
}
function getDpopJktFromPayload(payload) {
    return getConfirmationJkt(payload.cnf);
}
function getStringClaim(payload, claim) {
    const value = payload[claim];
    return typeof value === "string" && value.length > 0 ? value : void 0;
}
function getNumberClaim(payload, claim) {
    const value = payload[claim];
    return typeof value === "number" && Number.isFinite(value) ? value : void 0;
}
function assertSupportedDpopAlgorithm(alg, signingAlgorithms) {
    if (!alg || alg === "none" || alg.startsWith("HS")) throw createDpopProofError("invalid_dpop_proof", "DPoP proof must use an asymmetric JWS algorithm");
    if (!signingAlgorithms.includes(alg)) throw createDpopProofError("invalid_dpop_proof", "DPoP proof uses an unsupported JWS algorithm");
}
function assertPublicJwk(jwk) {
    if (!jwk || typeof jwk !== "object" || Array.isArray(jwk)) throw createDpopProofError("invalid_dpop_proof", "DPoP proof header must include a public jwk");
    if (jwk.kty === "oct") throw createDpopProofError("invalid_dpop_proof", "DPoP proof jwk must be asymmetric");
    for (const field of JWK_PRIVATE_FIELDS)if (field in jwk) throw createDpopProofError("invalid_dpop_proof", "DPoP proof jwk must not contain private key material");
}
async function deriveDpopReplayKey(params) {
    const input = `${params.jkt}\n${params.htm}\n${params.htu}\n${params.jti}`;
    const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
    return __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$base64url$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__base64url__$2e$encode$3e$__["base64url"].encode(new Uint8Array(digest));
}
async function reserveDpopReplay(replayStore, reservation) {
    if (!replayStore) return;
    if (!await replayStore.reserve(reservation)) throw createDpopProofError("invalid_dpop_proof", "DPoP proof jti has already been used");
}
async function verifyDpopProof({ proofJwt, method, url, accessToken, expectedJkt, requireAth = false, nowSeconds = Math.floor(Date.now() / 1e3), proofMaxAgeSeconds = DEFAULT_DPOP_PROOF_MAX_AGE_SECONDS, signingAlgorithms = DPOP_SIGNING_ALGORITHMS, replayStore }) {
    if (!proofJwt || proofJwt.split(".").length !== 3) throw createDpopProofError("invalid_dpop_proof", "DPoP proof must be a compact JWT");
    let protectedHeader;
    try {
        protectedHeader = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$decode_protected_header$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["decodeProtectedHeader"])(proofJwt);
    } catch (error) {
        throw createDpopProofError("invalid_dpop_proof", error instanceof Error ? error.message : "DPoP proof header is invalid");
    }
    if (protectedHeader.typ !== "dpop+jwt") throw createDpopProofError("invalid_dpop_proof", "DPoP proof typ must be \"dpop+jwt\"");
    assertSupportedDpopAlgorithm(protectedHeader.alg, signingAlgorithms);
    assertPublicJwk(protectedHeader.jwk);
    let payload;
    try {
        payload = (await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$verify$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jwtVerify"])(proofJwt, await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$key$2f$import$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["importJWK"])(protectedHeader.jwk, protectedHeader.alg), {
            typ: DPOP_PROOF_TYPE
        })).payload;
    } catch (error) {
        throw createDpopProofError("invalid_dpop_proof", error instanceof Error ? error.message : "DPoP proof signature is invalid");
    }
    const htm = getStringClaim(payload, "htm");
    const htu = getStringClaim(payload, "htu");
    const jti = getStringClaim(payload, "jti");
    const iat = getNumberClaim(payload, "iat");
    if (!htm || !htu || !jti || iat === void 0) throw createDpopProofError("invalid_dpop_proof", "DPoP proof must include htm, htu, jti, and iat claims");
    if (jti.length > MAX_DPOP_JTI_LENGTH) throw createDpopProofError("invalid_dpop_proof", "DPoP proof jti is too large");
    if (htm.toUpperCase() !== method.toUpperCase()) throw createDpopProofError("invalid_dpop_proof", "DPoP proof htm does not match the request method");
    let normalizedHtu;
    let proofHtu;
    try {
        normalizedHtu = normalizeDpopHtu(url);
        proofHtu = normalizeDpopHtu(htu);
    } catch (error) {
        throw createDpopProofError("invalid_dpop_proof", error instanceof Error ? error.message : "DPoP proof htu is invalid");
    }
    if (proofHtu !== normalizedHtu) throw createDpopProofError("invalid_dpop_proof", "DPoP proof htu does not match the request URL");
    if (iat > nowSeconds + 5 || nowSeconds - iat > proofMaxAgeSeconds) throw createDpopProofError("invalid_dpop_proof", "DPoP proof iat is outside the accepted window");
    const ath = getStringClaim(payload, "ath");
    if (requireAth && !ath) throw createDpopProofError("invalid_dpop_proof", "DPoP proof must include an ath claim");
    if (accessToken !== void 0) {
        if (ath !== await deriveDpopAth(accessToken)) throw createDpopProofError("invalid_dpop_proof", "DPoP proof ath does not match the access token");
    }
    const jkt = await deriveDpopJkt(protectedHeader.jwk);
    if (expectedJkt !== void 0 && jkt !== expectedJkt) throw createDpopProofError("invalid_dpop_proof", "DPoP proof key does not match the bound token");
    const replayKey = await deriveDpopReplayKey({
        jkt,
        htm: htm.toUpperCase(),
        htu: normalizedHtu,
        jti
    });
    const expiresAt = /* @__PURE__ */ new Date((iat + proofMaxAgeSeconds) * 1e3);
    await reserveDpopReplay(replayStore, {
        key: replayKey,
        expiresAt,
        now: /* @__PURE__ */ new Date(nowSeconds * 1e3)
    });
    return {
        jwk: protectedHeader.jwk,
        jkt,
        jti,
        htm,
        htu: normalizedHtu,
        iat,
        ath,
        replayKey,
        expiresAt
    };
}
function createDpopBindingError(code, message) {
    return Object.assign(new Error(message), {
        code
    });
}
function isDpopBindingError(error) {
    return error instanceof Error && "code" in error && (error.code === "invalid_token" || error.code === "invalid_dpop_proof");
}
/**
* Enforces the RFC 9449 §7.1 sender-constraint check for a resource request,
* given an access-token payload that has already been validated (by JWKS or
* introspection). This is the single source of truth for the
* "is the token DPoP-bound? then require the DPoP scheme, a proof, and a
* matching key" decision, shared by every resource-server entry point.
*
* Throws a {@link DpopBindingError} on any mismatch so callers map the
* `invalid_token` / `invalid_dpop_proof` code into their own transport. Returns
* normally for a valid bearer token (no `cnf.jkt`, no DPoP scheme).
*/ async function enforceDpopBinding({ payload, authorization, proofJwt, method, url, replayStore, proofMaxAgeSeconds, signingAlgorithms }) {
    const dpopJkt = getDpopJktFromPayload(payload);
    if (!dpopJkt) {
        if (authorization.scheme === "DPoP") throw createDpopBindingError("invalid_token", "DPoP authorization requires a DPoP-bound access token");
        return;
    }
    if (authorization.scheme !== "DPoP") throw createDpopBindingError("invalid_token", "DPoP-bound access token requires the DPoP authorization scheme");
    if (!proofJwt) throw createDpopBindingError("invalid_dpop_proof", "DPoP proof header is required");
    try {
        await verifyDpopProof({
            proofJwt,
            method,
            url,
            accessToken: authorization.token,
            expectedJkt: dpopJkt,
            requireAth: true,
            proofMaxAgeSeconds,
            signingAlgorithms,
            replayStore
        });
    } catch (error) {
        if (isDpopProofError(error)) throw createDpopBindingError("invalid_dpop_proof", error.message);
        throw error;
    }
}
;
}),
"[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/refresh-access-token.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "refreshAccessToken",
    ()=>refreshAccessToken,
    "refreshAccessTokenRequest",
    ()=>refreshAccessTokenRequest
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$utils$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/utils.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$reject$2d$redirects$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/reject-redirects.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$token$2d$endpoint$2d$auth$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/token-endpoint-auth.mjs [app-rsc] (ecmascript)");
;
;
;
//#region src/oauth2/refresh-access-token.ts
const BLOCKED_REFRESH_TOKEN_PARAMS_SET = new Set([
    "grant_type",
    "refresh_token",
    "__proto__",
    "constructor",
    "prototype"
]);
async function refreshAccessTokenRequest({ refreshToken, options, authentication, tokenEndpointAuth, tokenEndpoint, extraParams, resource }) {
    options = typeof options === "function" ? await options() : options;
    const request = buildRefreshAccessTokenRequest({
        refreshToken,
        options,
        extraParams,
        resource
    });
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$token$2d$endpoint$2d$auth$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["applyTokenEndpointAuth"])({
        body: request.body,
        headers: request.headers,
        options,
        tokenEndpoint: tokenEndpoint ?? "",
        grantType: "refresh_token",
        tokenEndpointAuth,
        authentication
    });
    return request;
}
function applyRefreshExtraParams(body, extraParams) {
    if (!extraParams) return;
    for (const [key, value] of Object.entries(extraParams)){
        if (BLOCKED_REFRESH_TOKEN_PARAMS_SET.has(key)) continue;
        body.set(key, value);
    }
}
function buildRefreshAccessTokenRequest({ refreshToken, options, extraParams, resource }) {
    const body = new URLSearchParams();
    const headers = {
        "content-type": "application/x-www-form-urlencoded",
        accept: "application/json"
    };
    body.set("grant_type", "refresh_token");
    body.set("refresh_token", refreshToken);
    if (resource) if (typeof resource === "string") body.append("resource", resource);
    else for (const _resource of resource)body.append("resource", _resource);
    if (extraParams) applyRefreshExtraParams(body, extraParams);
    return {
        body,
        headers
    };
}
async function refreshAccessToken({ refreshToken, options, tokenEndpoint, authentication, tokenEndpointAuth, extraParams, resource }) {
    const { body, headers } = await refreshAccessTokenRequest({
        refreshToken,
        options,
        authentication,
        tokenEndpointAuth,
        tokenEndpoint,
        extraParams,
        resource
    });
    const { data, error } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$reject$2d$redirects$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fetchRefusingRedirects"])(tokenEndpoint, {
        method: "POST",
        body,
        headers
    });
    if (error) throw error;
    const tokens = {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        tokenType: data.token_type,
        scopes: (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$utils$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["parseScopeField"])(data.scope),
        idToken: data.id_token
    };
    if (data.expires_in) tokens.accessTokenExpiresAt = new Date(/* @__PURE__ */ new Date().getTime() + data.expires_in * 1e3);
    if (data.refresh_token_expires_in) tokens.refreshTokenExpiresAt = new Date(/* @__PURE__ */ new Date().getTime() + data.refresh_token_expires_in * 1e3);
    return tokens;
}
;
}),
"[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/reject-redirects.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "fetchRefusingRedirects",
    ()=>fetchRefusingRedirects
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/error/index.mjs [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$fetch$2f$fetch$2f$dist$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-fetch/fetch/dist/index.js [app-rsc] (ecmascript)");
;
;
//#region src/oauth2/reject-redirects.ts
const httpRedirectStatuses = new Set([
    301,
    302,
    303,
    307,
    308
]);
/**
* Whether a response from a `redirect: "manual"` fetch is a redirect.
*
* Node/undici exposes the real 3xx status. Spec-compliant runtimes (Cloudflare
* Workers, Deno, browsers) return an opaque-redirect filtered response with
* status 0 and type `"opaqueredirect"`, so the status alone is not enough.
*/ function isRedirectResponse(response) {
    return response.type === "opaqueredirect" || httpRedirectStatuses.has(response.status);
}
function redirectRefused(endpoint) {
    return new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["BetterAuthError"](`The OAuth endpoint "${endpoint}" returned an HTTP redirect. Server-side OAuth fetches refuse redirects to prevent SSRF; configure the final endpoint URL.`);
}
/**
* betterFetch that refuses HTTP redirects on a server-side OAuth fetch.
*
* Returns the betterFetch result and throws if the endpoint redirected, on both
* undici (real 3xx status) and spec-compliant runtimes (opaque redirect, where
* the error status is 0). The redirect is never followed on any runtime.
*/ async function fetchRefusingRedirects(url, options) {
    let redirected = false;
    const onError = options?.onError;
    const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$fetch$2f$fetch$2f$dist$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["betterFetch"])(url, {
        ...options,
        redirect: "manual",
        async onError (context) {
            if (isRedirectResponse(context.response)) redirected = true;
            await onError?.(context);
        }
    }).catch((error)=>{
        if (redirected) throw redirectRefused(url);
        throw error;
    });
    if (redirected) throw redirectRefused(url);
    return result;
}
;
}),
"[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/token-endpoint-auth.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "applyTokenEndpointAuth",
    ()=>applyTokenEndpointAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$utils$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/utils.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$basic$2d$credentials$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/basic-credentials.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$client$2d$assertion$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/client-assertion.mjs [app-rsc] (ecmascript)");
;
;
;
//#region src/oauth2/token-endpoint-auth.ts
function getDefaultTokenEndpointAuth(options, authentication) {
    if (authentication === "basic") return {
        method: "client_secret_basic"
    };
    if (options.clientSecret) return {
        method: "client_secret_post"
    };
    return {
        method: "none"
    };
}
function assertNoClientSecret(method, options, body) {
    if (options.clientSecret || body.has("client_secret")) throw new Error(`${method} token endpoint authentication cannot be combined with clientSecret`);
}
function setClientId(body, clientId) {
    if (clientId) body.set("client_id", clientId);
}
function assertClientSecretConfigured(method, options) {
    if (!options.clientSecret) throw new Error(`${method} token endpoint authentication requires clientSecret`);
}
function assertClientIdConfigured(method, clientId) {
    if (!clientId) throw new Error(`${method} token endpoint authentication requires clientId`);
}
function setClientSecretPostAuth({ body, options, clientId, requireClientSecret }) {
    if (requireClientSecret) assertClientSecretConfigured("client_secret_post", options);
    if (options.clientSecret) {
        assertClientIdConfigured("client_secret_post", clientId);
        setClientId(body, clientId);
        body.set("client_secret", options.clientSecret);
    }
}
function setClientSecretBasicAuth({ headers, options, clientId, body }) {
    if (body.has("client_secret")) throw new Error("client_secret_basic token endpoint authentication cannot be combined with client_secret body parameters");
    assertClientSecretConfigured("client_secret_basic", options);
    assertClientIdConfigured("client_secret_basic", clientId);
    headers.authorization = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$basic$2d$credentials$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["encodeBasicCredentials"])(clientId, options.clientSecret);
}
function assertCompleteManualClientAssertion(body) {
    if (body.has("client_assertion") !== body.has("client_assertion_type")) throw new Error("client_assertion and client_assertion_type must both be provided");
}
async function applyTokenEndpointAuth({ body, headers, options, tokenEndpoint, grantType, tokenEndpointAuth, authentication }) {
    assertCompleteManualClientAssertion(body);
    const clientId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$utils$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getPrimaryClientId"])(options.clientId);
    if (body.has("client_assertion")) {
        if (tokenEndpointAuth) throw new Error("client_assertion body parameters cannot be combined with tokenEndpointAuth");
        assertNoClientSecret("private_key_jwt", options, body);
        setClientId(body, clientId);
        return;
    }
    const auth = tokenEndpointAuth ?? getDefaultTokenEndpointAuth(options, authentication);
    if (auth.method === "custom") {
        await auth.customizeRequest({
            body,
            headers,
            options,
            tokenEndpoint,
            grantType
        });
        assertCompleteManualClientAssertion(body);
        return;
    }
    if (auth.method === "private_key_jwt") {
        assertNoClientSecret(auth.method, options, body);
        assertClientIdConfigured(auth.method, clientId);
        if (!tokenEndpoint) throw new Error("private_key_jwt token endpoint authentication requires tokenEndpoint");
        const assertionParams = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$client$2d$assertion$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["resolveClientAssertionParams"])({
            getClientAssertion: auth.getClientAssertion,
            context: {
                clientId,
                tokenEndpoint,
                grantType
            }
        });
        setClientId(body, clientId);
        for (const [key, value] of Object.entries(assertionParams))body.set(key, value);
        return;
    }
    if (auth.method === "none") {
        assertNoClientSecret(auth.method, options, body);
        if (grantType === "client_credentials") throw new Error("none token endpoint authentication cannot be used with client_credentials grant");
        assertClientIdConfigured(auth.method, clientId);
        setClientId(body, clientId);
        return;
    }
    if (auth.method === "client_secret_basic") {
        setClientSecretBasicAuth({
            headers,
            options,
            clientId,
            body
        });
        return;
    }
    setClientSecretPostAuth({
        body,
        options,
        clientId,
        requireClientSecret: tokenEndpointAuth?.method === "client_secret_post"
    });
}
;
}),
"[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/utils.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "applyDefaultAccessTokenExpiry",
    ()=>applyDefaultAccessTokenExpiry,
    "generateCodeChallenge",
    ()=>generateCodeChallenge,
    "getOAuth2Tokens",
    ()=>getOAuth2Tokens,
    "getPrimaryClientId",
    ()=>getPrimaryClientId,
    "mergeScopes",
    ()=>mergeScopes,
    "parseScopeField",
    ()=>parseScopeField
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$base64$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/utils/dist/base64.mjs [app-rsc] (ecmascript)");
;
//#region src/oauth2/utils.ts
/**
* Parse a provider's `scope` token-response field into a string array.
*
* RFC 6749 Section 3.3 defines `scope` as a space-delimited string, but
* providers vary: some return an already-split array. Accept both forms and
* drop empty or non-string entries.
*
* @see https://github.com/better-auth/better-auth/issues/9076
*/ function parseScopeField(scope) {
    if (Array.isArray(scope)) return scope.map((s)=>typeof s === "string" ? s.trim() : "").filter(Boolean);
    if (typeof scope === "string") return scope.trim().split(/\s+/).filter(Boolean);
    return [];
}
function getOAuth2Tokens(data) {
    const getDate = (seconds)=>{
        return new Date(/* @__PURE__ */ new Date().getTime() + seconds * 1e3);
    };
    return {
        tokenType: data.token_type,
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        accessTokenExpiresAt: data.expires_in ? getDate(data.expires_in) : void 0,
        refreshTokenExpiresAt: data.refresh_token_expires_in ? getDate(data.refresh_token_expires_in) : void 0,
        scopes: parseScopeField(data.scope),
        idToken: data.id_token,
        raw: data
    };
}
/**
* Fill in `accessTokenExpiresAt` from the provider's configured
* `accessTokenExpiresIn` when the token response omitted `expires_in`. Without a
* known expiry, `getAccessToken` cannot tell the token is expired and never
* refreshes it. No-op when the provider already supplied an expiry or no
* fallback is configured.
*/ function applyDefaultAccessTokenExpiry(tokens, accessTokenExpiresIn) {
    if (!tokens.accessTokenExpiresAt && accessTokenExpiresIn) tokens.accessTokenExpiresAt = new Date(Date.now() + accessTokenExpiresIn * 1e3);
    return tokens;
}
/**
* Compute the union of stored and incoming OAuth scopes, preserving
* stored insertion order and dropping duplicates.
*/ function mergeScopes(stored, incoming) {
    const existing = stored ? stored.split(",").map((scope)=>scope.trim()).filter(Boolean) : [];
    const next = (incoming ?? []).map((scope)=>scope.trim()).filter(Boolean);
    return [
        ...new Set([
            ...existing,
            ...next
        ])
    ].join(",");
}
/**
* Return the provider's primary Client ID: the single string, or the entry at
* array index 0 for the cross-platform form used by ID token audience
* verification. Index 0 is the designated primary and pairs with
* `clientSecret` for the authorization code flow; later array entries are
* only used as additional accepted audiences. Returns `undefined` when the
* primary value is missing or an empty string.
*/ function getPrimaryClientId(clientId) {
    const value = Array.isArray(clientId) ? clientId[0] : clientId;
    return typeof value === "string" && value.length > 0 ? value : void 0;
}
async function generateCodeChallenge(codeVerifier) {
    const data = new TextEncoder().encode(codeVerifier);
    const hash = await crypto.subtle.digest("SHA-256", data);
    return __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$base64$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["base64Url"].encode(new Uint8Array(hash), {
        padding: false
    });
}
;
}),
"[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/validate-authorization-code.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "authorizationCodeRequest",
    ()=>authorizationCodeRequest,
    "validateAuthorizationCode",
    ()=>validateAuthorizationCode,
    "validateToken",
    ()=>validateToken
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$utils$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/utils.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$reject$2d$redirects$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/reject-redirects.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$token$2d$endpoint$2d$auth$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/token-endpoint-auth.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$verify$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/verify.mjs [app-rsc] (ecmascript)");
;
;
;
;
//#region src/oauth2/validate-authorization-code.ts
async function authorizationCodeRequest({ code, codeVerifier, redirectURI, options, authentication, tokenEndpointAuth, tokenEndpoint, deviceId, headers, additionalParams = {}, resource }) {
    options = typeof options === "function" ? await options() : options;
    const request = buildAuthorizationCodeRequest({
        code,
        codeVerifier,
        redirectURI,
        options,
        deviceId,
        headers,
        additionalParams,
        resource
    });
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$token$2d$endpoint$2d$auth$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["applyTokenEndpointAuth"])({
        body: request.body,
        headers: request.headers,
        options,
        tokenEndpoint: tokenEndpoint ?? "",
        grantType: "authorization_code",
        tokenEndpointAuth,
        authentication
    });
    return request;
}
function buildAuthorizationCodeRequest({ code, codeVerifier, redirectURI, options, deviceId, headers, additionalParams = {}, resource }) {
    const body = new URLSearchParams();
    const requestHeaders = {
        "content-type": "application/x-www-form-urlencoded",
        accept: "application/json",
        ...headers
    };
    body.set("grant_type", "authorization_code");
    body.set("code", code);
    codeVerifier && body.set("code_verifier", codeVerifier);
    options.clientKey && body.set("client_key", options.clientKey);
    deviceId && body.set("device_id", deviceId);
    body.set("redirect_uri", options.redirectURI || redirectURI);
    if (resource) if (typeof resource === "string") body.append("resource", resource);
    else for (const _resource of resource)body.append("resource", _resource);
    for (const [key, value] of Object.entries(additionalParams))if (!body.has(key)) body.append(key, value);
    return {
        body,
        headers: requestHeaders
    };
}
async function validateAuthorizationCode({ code, codeVerifier, redirectURI, options, tokenEndpoint, authentication, tokenEndpointAuth, deviceId, headers, additionalParams = {}, resource }) {
    const { body, headers: requestHeaders } = await authorizationCodeRequest({
        code,
        codeVerifier,
        redirectURI,
        options,
        authentication,
        tokenEndpointAuth,
        tokenEndpoint,
        deviceId,
        headers,
        additionalParams,
        resource
    });
    const { data, error } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$reject$2d$redirects$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fetchRefusingRedirects"])(tokenEndpoint, {
        method: "POST",
        body,
        headers: requestHeaders
    });
    if (error) throw error;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$utils$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getOAuth2Tokens"])(data);
}
/**
* Verifies a JWT's signature against the key set at `jwksEndpoint`.
*
* Beyond the signature, only `exp` and `nbf` (when present) and the claims named
* in `options` are checked. Without `audience` and `issuer`, a token the same key
* set signed for another client or issuer also verifies, so pass both whenever
* the token proves identity.
*/ async function validateToken(token, jwksEndpoint, options) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$verify$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["verifyJwsToken"])(token, {
        jwksFetch: new URL(jwksEndpoint).href,
        verifyOptions: {
            audience: options?.audience,
            issuer: options?.issuer,
            algorithms: options?.algorithms,
            requiredClaims: options?.requiredClaims,
            clockTolerance: options?.clockTolerance
        }
    });
}
;
}),
"[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/verify-id-token.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getIdTokenVerifyOptions",
    ()=>getIdTokenVerifyOptions,
    "supportsIdTokenSignIn",
    ()=>supportsIdTokenSignIn,
    "verifyIdToken",
    ()=>verifyIdToken,
    "verifyProviderIdToken",
    ()=>verifyProviderIdToken
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$verify$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/jose/dist/webapi/jwt/verify.js [app-rsc] (ecmascript)");
;
//#region src/oauth2/verify-id-token.ts
/**
* Clock skew allowed on `exp`, `nbf`, and `iat`, matching openid-client and oauth4webapi.
*/ const ID_TOKEN_CLOCK_TOLERANCE_SECONDS = 30;
/**
* Claims every ID token must contain.
*
* @see https://openid.net/specs/openid-connect-core-1_0.html#IDToken
*/ const ID_TOKEN_REQUIRED_CLAIMS = [
    "iss",
    "sub",
    "aud",
    "exp",
    "iat"
];
/**
* Builds the jose options shared by every ID token verifier, so the required
* claims and clock tolerance stay the same across providers. Algorithms come
* from the caller's trusted configuration, never from the token header.
*
* @internal
*/ function getIdTokenVerifyOptions(options) {
    return {
        issuer: options.issuer,
        audience: options.audience,
        algorithms: options.algorithms,
        maxTokenAge: options.maxTokenAge,
        requiredClaims: ID_TOKEN_REQUIRED_CLAIMS,
        clockTolerance: ID_TOKEN_CLOCK_TOLERANCE_SECONDS
    };
}
async function sha256Hex(value) {
    const data = new TextEncoder().encode(value);
    const digest = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(digest)).map((byte)=>byte.toString(16).padStart(2, "0")).join("");
}
async function nonceMatches(claimNonce, nonce, comparison = "exact") {
    if (typeof claimNonce !== "string") return false;
    if (claimNonce === nonce) return true;
    if (comparison === "exact-or-sha256") return claimNonce === await sha256Hex(nonce);
    return false;
}
/**
* Verifies an ID token's signature and claims against a verification config,
* and its `nonce` when one is expected. Throws when the token is not valid.
*
* @see https://openid.net/specs/openid-connect-core-1_0.html#IDTokenValidation
* @internal
*/ async function verifyIdToken(token, config, nonce) {
    if (![
        config.audience
    ].flat().some(Boolean)) throw new Error("ID token audience is not configured");
    const verified = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$verify$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jwtVerify"])(token, config.jwks, getIdTokenVerifyOptions(config));
    if (nonce && !await nonceMatches(verified.payload.nonce, nonce, config.nonceComparison)) throw new Error("ID token nonce does not match");
    if (config.verifyClaims && !config.verifyClaims(verified.payload)) throw new Error("ID token claims were rejected");
    return verified;
}
/**
* Whether a provider can verify a client-submitted id_token.
*
* A provider supports id_token sign-in when it declares an {@link OAuthProvider.idToken}
* verification config, or when the integrator supplies a `verifyIdToken` override on the
* provider options. A provider whose options set `disableIdTokenSignIn`, or that declares
* neither, rejects the client id_token sign-in path with `ID_TOKEN_NOT_SUPPORTED`.
*/ function supportsIdTokenSignIn(provider) {
    const options = provider.options ?? {};
    if (options.disableIdTokenSignIn) return false;
    return Boolean(provider.idToken || options.verifyIdToken);
}
/**
* Verify a client-submitted id_token against a provider's verification config.
*
* This is the single id_token verifier for every social provider. Providers no longer
* implement their own boolean `verifyIdToken`; they declare an {@link OAuthProvider.idToken}
* config and this function performs the cryptographic check. The contract is fail-closed: a
* provider without a config (and without an integrator `verifyIdToken` override) returns
* `false`, so a forged token can never be accepted by omission.
*
* @returns `true` only when the token is authentic for the provider.
*/ async function verifyProviderIdToken(provider, token, nonce, ctx) {
    const options = provider.options ?? {};
    if (options.disableIdTokenSignIn) return false;
    try {
        if (options.verifyIdToken) return await options.verifyIdToken(token, nonce, ctx);
        const config = provider.idToken;
        if (!config) return false;
        if ("verify" in config) return await config.verify(token, nonce, ctx);
        if (token.split(".").length !== 3) return config.allowOpaqueToken === true;
        await verifyIdToken(token, config, nonce);
        return true;
    } catch  {
        return false;
    }
}
;
}),
"[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/verify.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createInsufficientScopeError",
    ()=>createInsufficientScopeError,
    "getJwks",
    ()=>getJwks,
    "isInsufficientScopeError",
    ()=>isInsufficientScopeError,
    "requestToResourceInput",
    ()=>requestToResourceInput,
    "verifyAccessTokenRequest",
    ()=>verifyAccessTokenRequest,
    "verifyBearerToken",
    ()=>verifyBearerToken,
    "verifyJwsAccessToken",
    ()=>verifyJwsAccessToken,
    "verifyJwsToken",
    ()=>verifyJwsToken
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$logger$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/env/logger.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$reject$2d$redirects$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/reject-redirects.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$dpop$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/dpop.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-call/dist/index.mjs [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$call$2f$dist$2f$error$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-call/dist/error.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$unsecured$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/jose/dist/webapi/jwt/unsecured.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwks$2f$local$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/jose/dist/webapi/jwks/local.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$decode_protected_header$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/jose/dist/webapi/util/decode_protected_header.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__errors__$2e$JWKSTimeout$3e$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/jose/dist/webapi/util/errors.js [app-rsc] (ecmascript) <export * as errors .JWKSTimeout>");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__errors__$2e$JWKSInvalid$3e$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/jose/dist/webapi/util/errors.js [app-rsc] (ecmascript) <export * as errors .JWKSInvalid>");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__errors__$2e$JWKSMultipleMatchingKeys$3e$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/jose/dist/webapi/util/errors.js [app-rsc] (ecmascript) <export * as errors .JWKSMultipleMatchingKeys>");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__errors__$2e$JWKSNoMatchingKey$3e$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/jose/dist/webapi/util/errors.js [app-rsc] (ecmascript) <export * as errors .JWKSNoMatchingKey>");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__errors__$2e$JWSSignatureVerificationFailed$3e$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/jose/dist/webapi/util/errors.js [app-rsc] (ecmascript) <export * as errors .JWSSignatureVerificationFailed>");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__errors__$2e$JWSInvalid$3e$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/jose/dist/webapi/util/errors.js [app-rsc] (ecmascript) <export * as errors .JWSInvalid>");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__errors__$2e$JWTExpired$3e$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/jose/dist/webapi/util/errors.js [app-rsc] (ecmascript) <export * as errors .JWTExpired>");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__errors__$2e$JOSEError$3e$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/jose/dist/webapi/util/errors.js [app-rsc] (ecmascript) <export * as errors .JOSEError>");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$verify$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/jose/dist/webapi/jwt/verify.js [app-rsc] (ecmascript)");
;
;
;
;
;
//#region src/oauth2/verify.ts
const joseInfrastructureErrorCodes = new Set([
    __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__errors__$2e$JWKSTimeout$3e$__["errors"].JWKSTimeout.code,
    __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__errors__$2e$JWKSInvalid$3e$__["errors"].JWKSInvalid.code,
    __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__errors__$2e$JWKSMultipleMatchingKeys$3e$__["errors"].JWKSMultipleMatchingKeys.code
]);
function isJoseInfrastructureError(error) {
    return joseInfrastructureErrorCodes.has(error.code);
}
/**
* @internal
*/ const jwksCache = /* @__PURE__ */ new Map();
/**
* Cache for function jwks sources, keyed by a caller-provided stable object.
* Entries are released with their key, so per-request keys cannot accumulate.
*/ const functionJwksCache = /* @__PURE__ */ new WeakMap();
/**
* How long a cached JWKS is trusted before it is refetched
*
* @internal
*/ const JWKS_CACHE_TTL_MS = 300 * 1e3;
const JWKS_REFETCH_COOLDOWN_MS = 30 * 1e3;
const JWKS_FETCH_TIMEOUT_MS = 5e3;
function getJwksCacheEntry(cache, key) {
    let entry = cache.get(key);
    if (!entry) {
        entry = {
            fetchedAt: 0,
            refetchedAt: 0
        };
        cache.set(key, entry);
    }
    return entry;
}
function isFetching(entry, now) {
    return entry.pending !== void 0 && now - entry.pending.startedAt < JWKS_FETCH_TIMEOUT_MS;
}
/**
* Fetches the key set into `entry`, joining a fetch already in flight so
* concurrent verifications share one call. Each caller bounds its own wait,
* since the request that started the fetch may end before it settles.
*/ async function loadJwks(entry, jwksFetch) {
    const now = Date.now();
    if (!entry.pending || !isFetching(entry, now)) {
        const pending = {
            startedAt: now,
            promise: fetchJwks(jwksFetch).then((jwks)=>{
                if (now >= entry.fetchedAt) {
                    entry.jwks = jwks;
                    entry.fetchedAt = now;
                }
                return jwks;
            }).finally(()=>{
                if (entry.pending === pending) entry.pending = void 0;
            })
        };
        entry.pending = pending;
    }
    const { promise, startedAt } = entry.pending;
    let timeout;
    try {
        return await Promise.race([
            promise,
            new Promise((_, reject)=>{
                timeout = setTimeout(()=>reject(new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__errors__$2e$JWKSTimeout$3e$__["errors"].JWKSTimeout()), startedAt + JWKS_FETCH_TIMEOUT_MS - now);
            })
        ]);
    } finally{
        clearTimeout(timeout);
    }
}
/**
* Refetches a fresh cached set, `current`, that lacks a token's key, such as a
* newly rotated-in `kid`. Uses a set another request fetched after `current`
* was read, or joins a fetch in flight. Otherwise refetches unless another
* refetch started within the cooldown, and resolves `undefined` then. A refetch
* consumes the cooldown whether or not it succeeds.
*/ async function refreshJwks(entry, current, jwksFetch) {
    if (entry.jwks !== current) return entry.jwks;
    const now = Date.now();
    if (!isFetching(entry, now)) {
        if (now - entry.refetchedAt < JWKS_REFETCH_COOLDOWN_MS) return void 0;
        entry.refetchedAt = now;
    }
    return loadJwks(entry, jwksFetch);
}
function shouldRefetchCachedJwksWithoutKid(error, resolved) {
    return !resolved.kid && (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__errors__$2e$JWKSNoMatchingKey$3e$__["errors"].JWKSNoMatchingKey || error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__errors__$2e$JWSSignatureVerificationFailed$3e$__["errors"].JWSSignatureVerificationFailed);
}
async function fetchJwks(jwksFetch) {
    try {
        const jwks = typeof jwksFetch === "string" ? await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$reject$2d$redirects$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fetchRefusingRedirects"])(jwksFetch, {
            headers: {
                Accept: "application/json"
            }
        }).then(async (res)=>{
            if (res.error) throw new Error(`Jwks failed: ${res.error.message ?? res.error.statusText}`);
            return res.data;
        }) : await jwksFetch();
        if (!jwks) throw new Error("No jwks found");
        return jwks;
    } catch (error) {
        if (error instanceof TypeError) {
            try {
                __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$logger$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["logger"].error("JWKS fetch failed:", error);
            } catch  {}
            throw new Error("JWKS fetch failed");
        }
        throw error;
    }
}
/**
* Builds a {@link ResourceRequestInput} from a standard `Request`, reading the
* `Authorization` and `DPoP` headers and the request method and URL. Resource
* servers share this so every entry point maps the wire request the same way.
*/ function requestToResourceInput(request) {
    return {
        authorizationHeader: request.headers.get("authorization"),
        dpopProofJwt: request.headers.get("dpop"),
        method: request.method,
        url: request.url
    };
}
/**
* Process-local, single-instance replay store. See the warning on
* {@link VerifyAccessTokenRequestOptions.dpop.replayStore}; multi-instance
* resource servers must pass their own shared store.
*/ const defaultDpopReplayStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$dpop$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createInMemoryDpopReplayStore"])();
/**
* @internal
*/ async function verifyJwsToken(token, opts) {
    if (token.split(".").length !== 3) throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__errors__$2e$JWSInvalid$3e$__["errors"].JWSInvalid("Invalid Compact JWS");
    const resolved = await getJwksForVerification(token, opts);
    let jwks = resolved.jwks;
    for(let refreshes = 0;; refreshes++)try {
        return await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$verify$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jwtVerify"])(token, (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwks$2f$local$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createLocalJWKSet"])(jwks), opts.verifyOptions);
    } catch (error) {
        const refreshed = refreshes < 2 && shouldRefetchCachedJwksWithoutKid(error, resolved) ? await resolved.refresh?.(jwks) : void 0;
        if (!refreshed) throw error;
        jwks = refreshed;
    }
}
/**
* Performs local verification of an access token for your APIs.
*
* Can also be configured for remote verification.
*/ async function verifyJwsAccessToken(token, opts) {
    try {
        const jwt = await verifyJwsToken(token, opts);
        if (jwt.payload.azp) jwt.payload.client_id = jwt.payload.azp;
        return jwt.payload;
    } catch (error) {
        if (error instanceof Error) throw error;
        throw new Error(error);
    }
}
async function getJwks(token, opts) {
    return (await getJwksForVerification(token, opts)).jwks;
}
async function getJwksForVerification(token, opts) {
    let jwtHeaders;
    try {
        jwtHeaders = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$decode_protected_header$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["decodeProtectedHeader"])(token);
    } catch (error) {
        if (error instanceof Error) throw error;
        throw new Error(error);
    }
    const kid = jwtHeaders.kid;
    const entry = typeof opts.jwksFetch === "string" ? getJwksCacheEntry(jwksCache, opts.jwksFetch) : opts.jwksCacheKey ? getJwksCacheEntry(functionJwksCache, opts.jwksCacheKey) : {
        fetchedAt: 0,
        refetchedAt: 0
    };
    const cached = Date.now() - entry.fetchedAt < JWKS_CACHE_TTL_MS ? entry.jwks : void 0;
    if (!cached) return {
        jwks: await loadJwks(entry, opts.jwksFetch),
        kid
    };
    const refresh = (failed)=>refreshJwks(entry, failed, opts.jwksFetch);
    if (!kid || cached.keys.some((jwk)=>jwk.kid === kid)) return {
        jwks: cached,
        kid,
        refresh
    };
    return {
        jwks: await refresh(cached) ?? cached,
        kid
    };
}
async function verifyAccessTokenPayload(token, opts) {
    let payload;
    if (opts.jwksUrl && !opts?.remoteVerify?.force) try {
        payload = await verifyJwsAccessToken(token, {
            jwksFetch: opts.jwksUrl,
            verifyOptions: opts.verifyOptions
        });
    } catch (error) {
        if (error instanceof Error) if (error.name === "TypeError" || error.name === "JWSInvalid") {} else if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__errors__$2e$JWTExpired$3e$__["errors"].JWTExpired) throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$call$2f$dist$2f$error$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["APIError"]("UNAUTHORIZED", {
            message: "token expired"
        });
        else if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__errors__$2e$JOSEError$3e$__["errors"].JOSEError) {
            if (isJoseInfrastructureError(error)) throw error;
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$call$2f$dist$2f$error$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["APIError"]("UNAUTHORIZED", {
                message: "invalid access token"
            });
        } else throw error;
        else throw new Error(error);
    }
    if (opts?.remoteVerify) {
        const { data: introspect, error: introspectError } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$reject$2d$redirects$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fetchRefusingRedirects"])(opts.remoteVerify.introspectUrl, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
                client_id: opts.remoteVerify.clientId,
                client_secret: opts.remoteVerify.clientSecret,
                token,
                token_type_hint: "access_token"
            }).toString()
        });
        if (introspectError) __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$logger$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["logger"].error(`Introspection failed: ${introspectError.message ?? introspectError.statusText}`);
        if (!introspect) throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$call$2f$dist$2f$error$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["APIError"]("INTERNAL_SERVER_ERROR", {
            message: "introspection failed"
        });
        if (!introspect.active) throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$call$2f$dist$2f$error$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["APIError"]("UNAUTHORIZED", {
            message: "token inactive"
        });
        try {
            const unsecuredJwt = new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$unsecured$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["UnsecuredJWT"](introspect).encode();
            const { audience: _audience, ...verifyOptionsNoAudience } = opts.verifyOptions;
            const skipAudience = !introspect.aud && opts.remoteVerify.allowMissingAudience === true;
            payload = __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$unsecured$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["UnsecuredJWT"].decode(unsecuredJwt, skipAudience ? verifyOptionsNoAudience : opts.verifyOptions).payload;
        } catch (error) {
            throw new Error(error);
        }
    }
    if (!payload) throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$call$2f$dist$2f$error$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["APIError"]("UNAUTHORIZED", {
        message: `no token payload`
    });
    const grantedScopes = parseGrantedScopes(payload.scope);
    if (opts.requiredScopes) {
        const isScopeSatisfied = opts.isScopeSatisfied ?? ((requiredScope, scopes)=>scopes.has(requiredScope));
        const missingScopes = opts.requiredScopes.filter((scope)=>!isScopeSatisfied(scope, grantedScopes));
        if (missingScopes.length > 0) throw createInsufficientScopeError(missingScopes);
    }
    return payload;
}
/**
* Build the RFC 6750 §3.1 insufficient-scope failure: the access token is valid
* but lacks scopes the operation needs.
*
* Resource-server challenge builders turn this into a `403` carrying a
* `WWW-Authenticate: Bearer error="insufficient_scope"` challenge that names
* `scopes`, so the client knows what to request when it re-authorizes. Throw it
* from a route handler to challenge for scopes only that operation needs; a
* plain `FORBIDDEN` stays a plain `403`, since a permission denial the client
* cannot fix by re-authorizing must not send the user through consent again.
*
* @param requiredScopes - Every scope the operation requires but the token lacks.
* @param description - RFC 6750 `error_description` text. It must use the
* printable ASCII character set allowed by the specification.
*/ const OAUTH_SCOPE_TOKEN_PATTERN = /^[\x21\x23-\x5b\x5d-\x7e]+$/;
const OAUTH_ERROR_DESCRIPTION_PATTERN = /^[\x20-\x21\x23-\x5b\x5d-\x7e]+$/;
const insufficientScopeErrors = /* @__PURE__ */ new WeakSet();
function isOAuthScopeToken(value) {
    return OAUTH_SCOPE_TOKEN_PATTERN.test(value);
}
function validateScopeTokens(scopes, label) {
    for (const scope of scopes)if (!isOAuthScopeToken(scope)) throw new TypeError(`invalid ${label}: ${JSON.stringify(scope)}`);
}
function validateRequiredScopes(opts) {
    if (opts.requiredScopes) validateScopeTokens(opts.requiredScopes, "required scope");
}
function parseGrantedScopes(scope) {
    if (scope === void 0) return /* @__PURE__ */ new Set();
    if (typeof scope !== "string" || scope.length === 0 || scope.split(" ").some((token)=>!isOAuthScopeToken(token))) throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$call$2f$dist$2f$error$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["APIError"]("UNAUTHORIZED", {
        message: "access token scope claim is invalid",
        error: "invalid_token",
        error_description: "access token scope claim is invalid"
    });
    return new Set(scope.split(" "));
}
function createInsufficientScopeError(requiredScopes, description = `access token is missing required scope: ${requiredScopes.join(" ")}`) {
    if (requiredScopes.length === 0) throw new TypeError("requiredScopes must contain at least one scope");
    validateScopeTokens(requiredScopes, "required scope");
    if (typeof description !== "string" || !OAUTH_ERROR_DESCRIPTION_PATTERN.test(description)) throw new TypeError("invalid error_description");
    const error = new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$call$2f$dist$2f$error$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["APIError"]("FORBIDDEN", {
        message: description,
        error: "insufficient_scope",
        error_description: description,
        scope: [
            ...new Set(requiredScopes)
        ].join(" ")
    });
    insufficientScopeErrors.add(error);
    return error;
}
/**
* Returns whether an error is a typed RFC 6750 insufficient-scope failure.
*/ function isInsufficientScopeError(error) {
    if (!(error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$call$2f$dist$2f$error$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["APIError"]) || !insufficientScopeErrors.has(error) || error.status !== "FORBIDDEN") return false;
    const body = error.body;
    if (body?.error !== "insufficient_scope" || typeof body.scope !== "string") return false;
    const scopes = body.scope.split(" ");
    return scopes.length > 0 && scopes.every(isOAuthScopeToken);
}
function throwDpopUnauthorized(message, error) {
    throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$call$2f$dist$2f$error$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["APIError"]("UNAUTHORIZED", error ? {
        message,
        error,
        error_description: message
    } : {
        message
    });
}
/**
* Performs local verification of a bearer access token for your API.
*
* Can also be configured for remote verification. DPoP-bound access tokens
* require {@link verifyAccessTokenRequest}, because sender-constraining cannot
* be verified without the HTTP method, URL, Authorization scheme, DPoP proof,
* and access-token hash. This function rejects DPoP-bound tokens; reach for it
* only when you hold a raw token string and intentionally accept bearer tokens
* alone.
*/ async function verifyBearerToken(token, opts) {
    validateRequiredScopes(opts);
    const payload = await verifyAccessTokenPayload(token, opts);
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$dpop$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getDpopJktFromPayload"])(payload)) throwDpopUnauthorized("DPoP-bound access token requires verifyAccessTokenRequest", "invalid_token");
    return payload;
}
/**
* Verifies an HTTP resource request carrying an OAuth access token. This is the
* recommended resource-server entry point: it handles both bearer and
* DPoP-bound tokens, the bearer case being the request with no DPoP proof.
*
* It performs the same token validation as {@link verifyBearerToken}, then adds
* the RFC 9449 sender-constraint checks that need request context: authorization
* scheme, method, URL, DPoP proof, `ath`, and `cnf.jkt` binding.
*/ async function verifyAccessTokenRequest(request, opts) {
    validateRequiredScopes(opts);
    const authorization = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$dpop$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["parseAccessTokenAuthorization"])(request.authorizationHeader);
    if (!authorization?.token) throwDpopUnauthorized("missing authorization header");
    if (authorization.scheme === "Unknown") throwDpopUnauthorized("authorization scheme must be Bearer or DPoP", "invalid_token");
    const payload = await verifyAccessTokenPayload(authorization.token, opts);
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$dpop$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["enforceDpopBinding"])({
            payload,
            authorization,
            proofJwt: request.dpopProofJwt,
            method: request.method,
            url: request.url,
            replayStore: opts.dpop?.replayStore ?? defaultDpopReplayStore,
            proofMaxAgeSeconds: opts.dpop?.proofMaxAgeSeconds,
            signingAlgorithms: opts.dpop?.signingAlgorithms
        });
    } catch (error) {
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$dpop$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isDpopBindingError"])(error)) throwDpopUnauthorized(error.message, error.code);
        throw error;
    }
    return payload;
}
;
}),
"[project]/examples/nextjs/node_modules/@better-auth/core/dist/social-providers/apple.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "apple",
    ()=>apple,
    "getApplePublicKey",
    ()=>getApplePublicKey
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/error/index.mjs [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$logger$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/env/logger.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$utils$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/utils.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$create$2d$authorization$2d$url$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/create-authorization-url.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$refresh$2d$access$2d$token$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/refresh-access-token.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$validate$2d$authorization$2d$code$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/validate-authorization-code.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$decode_jwt$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/jose/dist/webapi/util/decode_jwt.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$key$2f$import$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/jose/dist/webapi/key/import.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$fetch$2f$fetch$2f$dist$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-fetch/fetch/dist/index.js [app-rsc] (ecmascript)");
;
;
;
;
;
;
;
;
//#region src/social-providers/apple.ts
const apple = (options)=>{
    const tokenEndpoint = "https://appleid.apple.com/auth/token";
    return {
        id: "apple",
        name: "Apple",
        accountSubject: ({ profile })=>profile.sub,
        async createAuthorizationURL ({ state, scopes, redirectURI, additionalParams, codeVerifier }) {
            if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$utils$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getPrimaryClientId"])(options.clientId) || !options.clientSecret) {
                __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$logger$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["logger"].error("Client ID and client secret are required for Apple. Make sure to provide them in the options.");
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["BetterAuthError"]("CLIENT_ID_AND_SECRET_REQUIRED");
            }
            const _scope = options.disableDefaultScope ? [] : [
                "email",
                "name"
            ];
            if (options.scope) _scope.push(...options.scope);
            if (scopes) _scope.push(...scopes);
            return await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$create$2d$authorization$2d$url$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createAuthorizationURL"])({
                id: "apple",
                options,
                authorizationEndpoint: "https://appleid.apple.com/auth/authorize",
                scopes: _scope,
                state,
                redirectURI,
                codeVerifier,
                responseMode: "form_post",
                responseType: "code id_token",
                additionalParams
            });
        },
        validateAuthorizationCode: async ({ code, codeVerifier, redirectURI })=>{
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$validate$2d$authorization$2d$code$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["validateAuthorizationCode"])({
                code,
                codeVerifier,
                redirectURI,
                options,
                tokenEndpoint
            });
        },
        idToken: {
            jwks: (header)=>getApplePublicKey(header.kid),
            issuer: "https://appleid.apple.com",
            algorithms: [
                "RS256"
            ],
            audience: options.audience && options.audience.length ? options.audience : options.appBundleIdentifier ? options.appBundleIdentifier : options.clientId,
            maxTokenAge: "1h",
            nonceComparison: "exact-or-sha256"
        },
        refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken)=>{
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$refresh$2d$access$2d$token$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["refreshAccessToken"])({
                refreshToken,
                options,
                tokenEndpoint
            });
        },
        async getUserInfo (token) {
            if (options.getUserInfo) return options.getUserInfo(token);
            if (!token.idToken) return null;
            const profile = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$decode_jwt$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["decodeJwt"])(token.idToken);
            if (!profile) return null;
            let name;
            if (token.user?.name) name = `${token.user.name.firstName || ""} ${token.user.name.lastName || ""}`.trim();
            else name = profile.name || "";
            const emailVerified = typeof profile.email_verified === "boolean" ? profile.email_verified : profile.email_verified === "true";
            const enrichedProfile = {
                ...profile,
                name
            };
            const userMap = await options.mapProfileToUser?.(enrichedProfile);
            return {
                user: {
                    name: enrichedProfile.name,
                    emailVerified,
                    email: profile.email,
                    ...userMap
                },
                data: enrichedProfile
            };
        },
        options
    };
};
const getApplePublicKey = async (kid)=>{
    const { data } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$fetch$2f$fetch$2f$dist$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["betterFetch"])(`https://appleid.apple.com/auth/keys`);
    if (!data?.keys) throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"]("BAD_REQUEST", {
        message: "Keys not found"
    });
    const jwk = data.keys.find((key)=>key.kid === kid);
    if (!jwk) throw new Error(`JWK with kid ${kid} not found`);
    return await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$key$2f$import$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["importJWK"])(jwk, jwk.alg);
};
;
}),
"[project]/examples/nextjs/node_modules/@better-auth/core/dist/social-providers/atlassian.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "atlassian",
    ()=>atlassian
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/error/index.mjs [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$logger$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/env/logger.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$create$2d$authorization$2d$url$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/create-authorization-url.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$refresh$2d$access$2d$token$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/refresh-access-token.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$validate$2d$authorization$2d$code$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/validate-authorization-code.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$fetch$2f$fetch$2f$dist$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-fetch/fetch/dist/index.js [app-rsc] (ecmascript)");
;
;
;
;
;
;
//#region src/social-providers/atlassian.ts
const atlassian = (options)=>{
    const tokenEndpoint = "https://auth.atlassian.com/oauth/token";
    return {
        id: "atlassian",
        name: "Atlassian",
        accountSubject: ({ profile })=>profile.account_id,
        async createAuthorizationURL ({ state, scopes, codeVerifier, redirectURI, additionalParams }) {
            if (!options.clientId || !options.clientSecret) {
                __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$logger$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["logger"].error("Client Id and Secret are required for Atlassian");
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["BetterAuthError"]("CLIENT_ID_AND_SECRET_REQUIRED");
            }
            if (!codeVerifier) throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["BetterAuthError"]("codeVerifier is required for Atlassian");
            const _scopes = options.disableDefaultScope ? [] : [
                "read:jira-user",
                "offline_access"
            ];
            if (options.scope) _scopes.push(...options.scope);
            if (scopes) _scopes.push(...scopes);
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$create$2d$authorization$2d$url$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createAuthorizationURL"])({
                id: "atlassian",
                options,
                authorizationEndpoint: "https://auth.atlassian.com/authorize",
                scopes: _scopes,
                state,
                codeVerifier,
                redirectURI,
                additionalParams: {
                    ...additionalParams ?? {},
                    audience: "api.atlassian.com"
                },
                prompt: options.prompt
            });
        },
        validateAuthorizationCode: async ({ code, codeVerifier, redirectURI })=>{
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$validate$2d$authorization$2d$code$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["validateAuthorizationCode"])({
                code,
                codeVerifier,
                redirectURI,
                options,
                tokenEndpoint
            });
        },
        refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken)=>{
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$refresh$2d$access$2d$token$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["refreshAccessToken"])({
                refreshToken,
                options: {
                    clientId: options.clientId,
                    clientSecret: options.clientSecret
                },
                tokenEndpoint
            });
        },
        async getUserInfo (token) {
            if (options.getUserInfo) return options.getUserInfo(token);
            if (!token.accessToken) return null;
            try {
                const { data: profile } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$fetch$2f$fetch$2f$dist$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["betterFetch"])("https://api.atlassian.com/me", {
                    headers: {
                        Authorization: `Bearer ${token.accessToken}`
                    }
                });
                if (!profile) return null;
                const userMap = await options.mapProfileToUser?.(profile);
                return {
                    user: {
                        name: profile.name,
                        email: profile.email,
                        image: profile.picture,
                        emailVerified: false,
                        ...userMap
                    },
                    data: profile
                };
            } catch (error) {
                __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$logger$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["logger"].error("Failed to fetch user info from Atlassian:", error);
                return null;
            }
        },
        options
    };
};
;
}),
"[project]/examples/nextjs/node_modules/@better-auth/core/dist/social-providers/cloudflare.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cloudflare",
    ()=>cloudflare
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$logger$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/env/logger.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$create$2d$authorization$2d$url$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/create-authorization-url.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$refresh$2d$access$2d$token$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/refresh-access-token.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$validate$2d$authorization$2d$code$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/validate-authorization-code.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$fetch$2f$fetch$2f$dist$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-fetch/fetch/dist/index.js [app-rsc] (ecmascript)");
;
;
;
;
;
//#region src/social-providers/cloudflare.ts
const authorizationEndpoint = "https://dash.cloudflare.com/oauth2/auth";
const tokenEndpoint = "https://dash.cloudflare.com/oauth2/token";
/**
* Cloudflare's OIDC `userinfo` endpoint only returns the `sub` claim, so it
* cannot be used to build a user. The user's profile (email, name, ...) is
* read from the Cloudflare API `/user` endpoint instead, which the access
* token can call when the `user-details.read` scope is granted.
*/ const userEndpoint = "https://api.cloudflare.com/client/v4/user";
const getTokenEndpointAuth = (options)=>{
    const defaultMethod = options.clientSecret ? "client_secret_basic" : "none";
    return {
        method: options.tokenEndpointAuthMethod ?? defaultMethod
    };
};
const cloudflare = (options)=>{
    return {
        id: "cloudflare",
        name: "Cloudflare",
        accountSubject: ({ profile })=>profile.id,
        createAuthorizationURL ({ state, scopes, codeVerifier, redirectURI }) {
            const _scopes = options.disableDefaultScope ? [] : [
                "user-details.read"
            ];
            if (options.scope?.length) _scopes.push(...options.scope);
            if (scopes?.length) _scopes.push(...scopes);
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$create$2d$authorization$2d$url$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createAuthorizationURL"])({
                id: "cloudflare",
                options,
                authorizationEndpoint,
                scopes: _scopes.length ? [
                    ...new Set(_scopes)
                ] : void 0,
                state,
                codeVerifier,
                redirectURI
            });
        },
        validateAuthorizationCode: async ({ code, codeVerifier, redirectURI })=>{
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$validate$2d$authorization$2d$code$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["validateAuthorizationCode"])({
                code,
                codeVerifier,
                redirectURI,
                options,
                tokenEndpoint,
                tokenEndpointAuth: getTokenEndpointAuth(options)
            });
        },
        refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken)=>{
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$refresh$2d$access$2d$token$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["refreshAccessToken"])({
                refreshToken,
                options: {
                    clientId: options.clientId,
                    clientKey: options.clientKey,
                    clientSecret: options.clientSecret
                },
                tokenEndpoint,
                tokenEndpointAuth: getTokenEndpointAuth(options)
            });
        },
        async getUserInfo (token) {
            if (options.getUserInfo) return options.getUserInfo(token);
            const { data, error } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$fetch$2f$fetch$2f$dist$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["betterFetch"])(userEndpoint, {
                headers: {
                    authorization: `Bearer ${token.accessToken}`
                }
            });
            if (error || !data?.success || !data.result) {
                __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$logger$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["logger"].error("Failed to fetch user info from Cloudflare:", error ?? data?.errors);
                return null;
            }
            const profile = data.result;
            const name = [
                profile.first_name,
                profile.last_name
            ].filter(Boolean).join(" ") || profile.email;
            const userMap = await options.mapProfileToUser?.(profile);
            return {
                user: {
                    name,
                    email: profile.email,
                    emailVerified: false,
                    ...userMap
                },
                data: profile
            };
        },
        options
    };
};
;
}),
"[project]/examples/nextjs/node_modules/@better-auth/core/dist/social-providers/cognito.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cognito",
    ()=>cognito,
    "getCognitoPublicKey",
    ()=>getCognitoPublicKey
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/error/index.mjs [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$logger$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/env/logger.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$utils$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/utils.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$create$2d$authorization$2d$url$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/create-authorization-url.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$refresh$2d$access$2d$token$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/refresh-access-token.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$validate$2d$authorization$2d$code$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/validate-authorization-code.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$decode_jwt$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/jose/dist/webapi/util/decode_jwt.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$key$2f$import$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/jose/dist/webapi/key/import.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$fetch$2f$fetch$2f$dist$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-fetch/fetch/dist/index.js [app-rsc] (ecmascript)");
;
;
;
;
;
;
;
;
//#region src/social-providers/cognito.ts
const cognito = (options)=>{
    if (!options.domain || !options.region || !options.userPoolId) {
        __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$logger$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["logger"].error("Domain, region and userPoolId are required for Amazon Cognito. Make sure to provide them in the options.");
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["BetterAuthError"]("DOMAIN_AND_REGION_REQUIRED");
    }
    const cleanDomain = options.domain.replace(/^https?:\/\//, "");
    const authorizationEndpoint = `https://${cleanDomain}/oauth2/authorize`;
    const tokenEndpoint = `https://${cleanDomain}/oauth2/token`;
    const userInfoEndpoint = `https://${cleanDomain}/oauth2/userinfo`;
    return {
        id: "cognito",
        name: "Cognito",
        accountSubject: ({ profile })=>profile.sub,
        async createAuthorizationURL ({ state, scopes, codeVerifier, redirectURI, additionalParams }) {
            if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$utils$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getPrimaryClientId"])(options.clientId)) {
                __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$logger$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["logger"].error("ClientId is required for Amazon Cognito. Make sure to provide them in the options.");
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["BetterAuthError"]("CLIENT_ID_AND_SECRET_REQUIRED");
            }
            if (options.requireClientSecret && !options.clientSecret) {
                __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$logger$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["logger"].error("Client Secret is required when requireClientSecret is true. Make sure to provide it in the options.");
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["BetterAuthError"]("CLIENT_SECRET_REQUIRED");
            }
            const _scopes = options.disableDefaultScope ? [] : [
                "openid",
                "profile",
                "email"
            ];
            if (options.scope) _scopes.push(...options.scope);
            if (scopes) _scopes.push(...scopes);
            const url = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$create$2d$authorization$2d$url$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createAuthorizationURL"])({
                id: "cognito",
                options: {
                    ...options
                },
                authorizationEndpoint,
                scopes: _scopes,
                state,
                codeVerifier,
                redirectURI,
                prompt: options.prompt,
                additionalParams: {
                    ...options.identityProvider ? {
                        identity_provider: options.identityProvider
                    } : {},
                    ...additionalParams ?? {}
                }
            });
            const scopeValue = url.searchParams.get("scope");
            if (scopeValue) {
                url.searchParams.delete("scope");
                const encodedScope = encodeURIComponent(scopeValue);
                const urlString = url.toString();
                const separator = urlString.includes("?") ? "&" : "?";
                return new URL(`${urlString}${separator}scope=${encodedScope}`);
            }
            return url;
        },
        validateAuthorizationCode: async ({ code, codeVerifier, redirectURI })=>{
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$validate$2d$authorization$2d$code$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["validateAuthorizationCode"])({
                code,
                codeVerifier,
                redirectURI,
                options,
                tokenEndpoint
            });
        },
        refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken)=>{
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$refresh$2d$access$2d$token$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["refreshAccessToken"])({
                refreshToken,
                options: {
                    clientId: options.clientId,
                    clientKey: options.clientKey,
                    clientSecret: options.clientSecret
                },
                tokenEndpoint
            });
        },
        idToken: {
            jwks: (header)=>getCognitoPublicKey(header.kid, options.region, options.userPoolId),
            issuer: `https://cognito-idp.${options.region}.amazonaws.com/${options.userPoolId}`,
            audience: options.clientId,
            algorithms: [
                "RS256"
            ],
            maxTokenAge: "1h"
        },
        async getUserInfo (token) {
            if (options.getUserInfo) return options.getUserInfo(token);
            if (token.idToken) try {
                const profile = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$decode_jwt$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["decodeJwt"])(token.idToken);
                if (!profile) return null;
                const name = profile.name || profile.given_name || profile.username || "";
                const enrichedProfile = {
                    ...profile,
                    name
                };
                const userMap = await options.mapProfileToUser?.(enrichedProfile);
                return {
                    user: {
                        name: enrichedProfile.name,
                        email: profile.email,
                        image: profile.picture,
                        emailVerified: profile.email_verified,
                        ...userMap
                    },
                    data: enrichedProfile
                };
            } catch (error) {
                __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$logger$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["logger"].error("Failed to decode ID token:", error);
            }
            if (token.accessToken) try {
                const { data: userInfo } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$fetch$2f$fetch$2f$dist$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["betterFetch"])(userInfoEndpoint, {
                    headers: {
                        Authorization: `Bearer ${token.accessToken}`
                    }
                });
                if (userInfo) {
                    const userMap = await options.mapProfileToUser?.(userInfo);
                    return {
                        user: {
                            name: userInfo.name || userInfo.given_name || userInfo.username || "",
                            email: userInfo.email,
                            image: userInfo.picture,
                            emailVerified: userInfo.email_verified,
                            ...userMap
                        },
                        data: userInfo
                    };
                }
            } catch (error) {
                __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$logger$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["logger"].error("Failed to fetch user info from Cognito:", error);
            }
            return null;
        },
        options
    };
};
const getCognitoPublicKey = async (kid, region, userPoolId)=>{
    const COGNITO_JWKS_URI = `https://cognito-idp.${region}.amazonaws.com/${userPoolId}/.well-known/jwks.json`;
    try {
        const { data } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$fetch$2f$fetch$2f$dist$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["betterFetch"])(COGNITO_JWKS_URI);
        if (!data?.keys) throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"]("BAD_REQUEST", {
            message: "Keys not found"
        });
        const jwk = data.keys.find((key)=>key.kid === kid);
        if (!jwk) throw new Error(`JWK with kid ${kid} not found`);
        return await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$key$2f$import$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["importJWK"])(jwk, jwk.alg);
    } catch (error) {
        __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$logger$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["logger"].error("Failed to fetch Cognito public key:", error);
        throw error;
    }
};
;
}),
"[project]/examples/nextjs/node_modules/@better-auth/core/dist/social-providers/discord.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "discord",
    ()=>discord
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$create$2d$authorization$2d$url$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/create-authorization-url.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$refresh$2d$access$2d$token$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/refresh-access-token.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$validate$2d$authorization$2d$code$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/validate-authorization-code.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$fetch$2f$fetch$2f$dist$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-fetch/fetch/dist/index.js [app-rsc] (ecmascript)");
;
;
;
;
//#region src/social-providers/discord.ts
const discord = (options)=>{
    const tokenEndpoint = "https://discord.com/api/oauth2/token";
    return {
        id: "discord",
        name: "Discord",
        accountSubject: ({ profile })=>profile.id,
        createAuthorizationURL ({ state, scopes, redirectURI, additionalParams }) {
            const _scopes = options.disableDefaultScope ? [] : [
                "identify",
                "email"
            ];
            if (scopes) _scopes.push(...scopes);
            if (options.scope) _scopes.push(...options.scope);
            const hasBotScope = _scopes.includes("bot");
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$create$2d$authorization$2d$url$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createAuthorizationURL"])({
                id: "discord",
                options,
                authorizationEndpoint: "https://discord.com/api/oauth2/authorize",
                scopes: _scopes,
                state,
                redirectURI,
                prompt: options.prompt || "none",
                additionalParams: {
                    ...hasBotScope && options.permissions !== void 0 ? {
                        permissions: String(options.permissions)
                    } : {},
                    ...additionalParams ?? {}
                }
            });
        },
        validateAuthorizationCode: async ({ code, redirectURI })=>{
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$validate$2d$authorization$2d$code$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["validateAuthorizationCode"])({
                code,
                redirectURI,
                options,
                tokenEndpoint
            });
        },
        refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken)=>{
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$refresh$2d$access$2d$token$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["refreshAccessToken"])({
                refreshToken,
                options: {
                    clientId: options.clientId,
                    clientKey: options.clientKey,
                    clientSecret: options.clientSecret
                },
                tokenEndpoint
            });
        },
        async getUserInfo (token) {
            if (options.getUserInfo) return options.getUserInfo(token);
            const { data: profile, error } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$fetch$2f$fetch$2f$dist$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["betterFetch"])("https://discord.com/api/users/@me", {
                headers: {
                    authorization: `Bearer ${token.accessToken}`
                }
            });
            if (error) return null;
            if (profile.avatar === null) profile.image_url = `https://cdn.discordapp.com/embed/avatars/${profile.discriminator === "0" ? Number(BigInt(profile.id) >> BigInt(22)) % 6 : parseInt(profile.discriminator) % 5}.png`;
            else {
                const format = profile.avatar.startsWith("a_") ? "gif" : "png";
                profile.image_url = `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.${format}`;
            }
            const userMap = await options.mapProfileToUser?.(profile);
            return {
                user: {
                    name: profile.global_name || profile.username || "",
                    email: profile.email,
                    emailVerified: profile.verified,
                    image: profile.image_url,
                    ...userMap
                },
                data: profile
            };
        },
        options
    };
};
;
}),
"[project]/examples/nextjs/node_modules/@better-auth/core/dist/social-providers/dropbox.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "dropbox",
    ()=>dropbox
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$create$2d$authorization$2d$url$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/create-authorization-url.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$refresh$2d$access$2d$token$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/refresh-access-token.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$validate$2d$authorization$2d$code$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/validate-authorization-code.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$fetch$2f$fetch$2f$dist$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-fetch/fetch/dist/index.js [app-rsc] (ecmascript)");
;
;
;
;
//#region src/social-providers/dropbox.ts
const dropbox = (options)=>{
    const tokenEndpoint = "https://api.dropboxapi.com/oauth2/token";
    return {
        id: "dropbox",
        name: "Dropbox",
        accountSubject: ({ profile })=>profile.account_id,
        createAuthorizationURL: async ({ state, scopes, codeVerifier, redirectURI, additionalParams })=>{
            const _scopes = options.disableDefaultScope ? [] : [
                "account_info.read"
            ];
            if (options.scope) _scopes.push(...options.scope);
            if (scopes) _scopes.push(...scopes);
            return await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$create$2d$authorization$2d$url$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createAuthorizationURL"])({
                id: "dropbox",
                options,
                authorizationEndpoint: "https://www.dropbox.com/oauth2/authorize",
                scopes: _scopes,
                state,
                redirectURI,
                codeVerifier,
                additionalParams: {
                    ...options.accessType ? {
                        token_access_type: options.accessType
                    } : {},
                    ...additionalParams ?? {}
                }
            });
        },
        validateAuthorizationCode: async ({ code, codeVerifier, redirectURI })=>{
            return await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$validate$2d$authorization$2d$code$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["validateAuthorizationCode"])({
                code,
                codeVerifier,
                redirectURI,
                options,
                tokenEndpoint
            });
        },
        refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken)=>{
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$refresh$2d$access$2d$token$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["refreshAccessToken"])({
                refreshToken,
                options: {
                    clientId: options.clientId,
                    clientKey: options.clientKey,
                    clientSecret: options.clientSecret
                },
                tokenEndpoint
            });
        },
        async getUserInfo (token) {
            if (options.getUserInfo) return options.getUserInfo(token);
            const { data: profile, error } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$fetch$2f$fetch$2f$dist$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["betterFetch"])("https://api.dropboxapi.com/2/users/get_current_account", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token.accessToken}`
                }
            });
            if (error) return null;
            const userMap = await options.mapProfileToUser?.(profile);
            return {
                user: {
                    name: profile.name?.display_name,
                    email: profile.email,
                    emailVerified: profile.email_verified || false,
                    image: profile.profile_photo_url,
                    ...userMap
                },
                data: profile
            };
        },
        options
    };
};
;
}),
"[project]/examples/nextjs/node_modules/@better-auth/core/dist/social-providers/facebook.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "facebook",
    ()=>facebook
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/error/index.mjs [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$logger$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/env/logger.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$utils$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/utils.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$create$2d$authorization$2d$url$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/create-authorization-url.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$refresh$2d$access$2d$token$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/refresh-access-token.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$validate$2d$authorization$2d$code$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/validate-authorization-code.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwks$2f$remote$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/jose/dist/webapi/jwks/remote.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$decode_jwt$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/jose/dist/webapi/util/decode_jwt.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$fetch$2f$fetch$2f$dist$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-fetch/fetch/dist/index.js [app-rsc] (ecmascript)");
;
;
;
;
;
;
;
;
//#region src/social-providers/facebook.ts
/**
* Validate an opaque Facebook access token against the configured app.
*
* Facebook access tokens are not audience-bound at the Graph `/me` endpoint: a
* token minted for any Facebook app returns that app's profile. Without this
* check, a token issued to an unrelated app could be presented to this
* app's direct sign-in path and accepted as proof of identity. We call the
* `debug_token` endpoint and require the token to be valid, bound to one of the
* configured client ids, and tied to a user.
*
* @see https://developers.facebook.com/docs/facebook-login/guides/access-tokens/debugging
*
* @returns the inspected token's `user_id` when the token is valid and bound to
* the configured app, otherwise `null`.
*/ async function verifyFacebookAccessToken(accessToken, options) {
    const primaryClientId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$utils$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getPrimaryClientId"])(options.clientId);
    if (!primaryClientId || !options.clientSecret) return null;
    const clientIds = Array.isArray(options.clientId) ? options.clientId : [
        options.clientId
    ];
    const { data, error } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$fetch$2f$fetch$2f$dist$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["betterFetch"])("https://graph.facebook.com/debug_token", {
        query: {
            input_token: accessToken,
            access_token: `${primaryClientId}|${options.clientSecret}`
        }
    });
    if (error || !data?.data) return null;
    const { is_valid, app_id, user_id } = data.data;
    if (is_valid !== true || !app_id || !clientIds.includes(app_id) || !user_id) return null;
    return user_id;
}
const facebook = (options)=>{
    return {
        id: "facebook",
        name: "Facebook",
        accountSubject: ({ profile })=>"sub" in profile ? profile.sub : profile.id,
        async createAuthorizationURL ({ state, scopes, redirectURI, loginHint, additionalParams }) {
            if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$utils$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getPrimaryClientId"])(options.clientId) || !options.clientSecret) {
                __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$logger$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["logger"].error("Client ID and client secret are required for Facebook. Make sure to provide them in the options.");
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["BetterAuthError"]("CLIENT_ID_AND_SECRET_REQUIRED");
            }
            const _scopes = options.disableDefaultScope ? [] : [
                "email",
                "public_profile"
            ];
            if (options.scope) _scopes.push(...options.scope);
            if (scopes) _scopes.push(...scopes);
            return await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$create$2d$authorization$2d$url$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createAuthorizationURL"])({
                id: "facebook",
                options,
                authorizationEndpoint: "https://www.facebook.com/v24.0/dialog/oauth",
                scopes: _scopes,
                state,
                redirectURI,
                loginHint,
                additionalParams: {
                    ...options.configId ? {
                        config_id: options.configId
                    } : {},
                    ...additionalParams ?? {}
                }
            });
        },
        validateAuthorizationCode: async ({ code, redirectURI })=>{
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$validate$2d$authorization$2d$code$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["validateAuthorizationCode"])({
                code,
                redirectURI,
                options,
                tokenEndpoint: "https://graph.facebook.com/v24.0/oauth/access_token"
            });
        },
        idToken: {
            jwks: (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwks$2f$remote$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createRemoteJWKSet"])(new URL("https://limited.facebook.com/.well-known/oauth/openid/jwks/")),
            issuer: "https://www.facebook.com",
            audience: options.clientId,
            algorithms: [
                "RS256"
            ],
            allowOpaqueToken: true
        },
        refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken)=>{
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$refresh$2d$access$2d$token$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["refreshAccessToken"])({
                refreshToken,
                options: {
                    clientId: options.clientId,
                    clientKey: options.clientKey,
                    clientSecret: options.clientSecret
                },
                tokenEndpoint: "https://graph.facebook.com/v24.0/oauth/access_token"
            });
        },
        async getUserInfo (token) {
            if (options.getUserInfo) {
                const isOpaqueIdToken = !!token.idToken && token.idToken.split(".").length !== 3;
                const clientToken = token.accessToken || (isOpaqueIdToken ? token.idToken : void 0);
                if (clientToken && !await verifyFacebookAccessToken(clientToken, options)) return null;
                return options.getUserInfo(token);
            }
            if (token.idToken && token.idToken.split(".").length === 3) {
                const profile = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$decode_jwt$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["decodeJwt"])(token.idToken);
                const userMap = await options.mapProfileToUser?.(profile);
                return {
                    user: {
                        name: profile.name,
                        email: profile.email,
                        image: profile.picture,
                        emailVerified: false,
                        ...userMap
                    },
                    data: profile
                };
            }
            const accessToken = token.accessToken;
            if (!accessToken) return null;
            const tokenUserId = await verifyFacebookAccessToken(accessToken, options);
            if (!tokenUserId) return null;
            const { data: profile, error } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$fetch$2f$fetch$2f$dist$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["betterFetch"])("https://graph.facebook.com/me?fields=" + [
                "id",
                "name",
                "email",
                "picture",
                ...options?.fields || []
            ].join(","), {
                auth: {
                    type: "Bearer",
                    token: accessToken
                }
            });
            if (error) return null;
            if (profile.id !== tokenUserId) return null;
            const userMap = await options.mapProfileToUser?.(profile);
            return {
                user: {
                    name: profile.name,
                    email: profile.email,
                    image: profile.picture.data.url,
                    emailVerified: profile.email_verified ?? false,
                    ...userMap
                },
                data: profile
            };
        },
        options
    };
};
;
}),
"[project]/examples/nextjs/node_modules/@better-auth/core/dist/social-providers/figma.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "figma",
    ()=>figma
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/error/index.mjs [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$logger$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/env/logger.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$create$2d$authorization$2d$url$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/create-authorization-url.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$refresh$2d$access$2d$token$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/refresh-access-token.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$validate$2d$authorization$2d$code$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/validate-authorization-code.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$fetch$2f$fetch$2f$dist$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-fetch/fetch/dist/index.js [app-rsc] (ecmascript)");
;
;
;
;
;
;
//#region src/social-providers/figma.ts
const figma = (options)=>{
    const tokenEndpoint = "https://api.figma.com/v1/oauth/token";
    return {
        id: "figma",
        name: "Figma",
        accountSubject: ({ profile })=>profile.id,
        async createAuthorizationURL ({ state, scopes, codeVerifier, redirectURI, additionalParams }) {
            if (!options.clientId || !options.clientSecret) {
                __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$logger$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["logger"].error("Client Id and Client Secret are required for Figma. Make sure to provide them in the options.");
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["BetterAuthError"]("CLIENT_ID_AND_SECRET_REQUIRED");
            }
            if (!codeVerifier) throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["BetterAuthError"]("codeVerifier is required for Figma");
            const _scopes = options.disableDefaultScope ? [] : [
                "current_user:read"
            ];
            if (options.scope) _scopes.push(...options.scope);
            if (scopes) _scopes.push(...scopes);
            return await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$create$2d$authorization$2d$url$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createAuthorizationURL"])({
                id: "figma",
                options,
                authorizationEndpoint: "https://www.figma.com/oauth",
                scopes: _scopes,
                state,
                codeVerifier,
                redirectURI,
                additionalParams
            });
        },
        validateAuthorizationCode: async ({ code, codeVerifier, redirectURI })=>{
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$validate$2d$authorization$2d$code$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["validateAuthorizationCode"])({
                code,
                codeVerifier,
                redirectURI,
                options,
                tokenEndpoint,
                authentication: "basic"
            });
        },
        refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken)=>{
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$refresh$2d$access$2d$token$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["refreshAccessToken"])({
                refreshToken,
                options: {
                    clientId: options.clientId,
                    clientKey: options.clientKey,
                    clientSecret: options.clientSecret
                },
                tokenEndpoint,
                authentication: "basic"
            });
        },
        async getUserInfo (token) {
            if (options.getUserInfo) return options.getUserInfo(token);
            try {
                const { data: profile } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$fetch$2f$fetch$2f$dist$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["betterFetch"])("https://api.figma.com/v1/me", {
                    headers: {
                        Authorization: `Bearer ${token.accessToken}`
                    }
                });
                if (!profile) {
                    __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$logger$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["logger"].error("Failed to fetch user from Figma");
                    return null;
                }
                const userMap = await options.mapProfileToUser?.(profile);
                return {
                    user: {
                        name: profile.handle,
                        email: profile.email,
                        image: profile.img_url,
                        emailVerified: false,
                        ...userMap
                    },
                    data: profile
                };
            } catch (error) {
                __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$logger$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["logger"].error("Failed to fetch user info from Figma:", error);
                return null;
            }
        },
        options
    };
};
;
}),
"[project]/examples/nextjs/node_modules/@better-auth/core/dist/social-providers/github.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "github",
    ()=>github
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$logger$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/env/logger.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$utils$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/utils.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$create$2d$authorization$2d$url$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/create-authorization-url.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$refresh$2d$access$2d$token$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/refresh-access-token.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$validate$2d$authorization$2d$code$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/validate-authorization-code.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$fetch$2f$fetch$2f$dist$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-fetch/fetch/dist/index.js [app-rsc] (ecmascript)");
;
;
;
;
;
;
//#region src/social-providers/github.ts
const github = (options)=>{
    const tokenEndpoint = "https://github.com/login/oauth/access_token";
    return {
        id: "github",
        name: "GitHub",
        accountSubject: ({ profile })=>profile.id,
        createAuthorizationURL ({ state, scopes, loginHint, codeVerifier, redirectURI, additionalParams }) {
            const _scopes = options.disableDefaultScope ? [] : [
                "read:user",
                "user:email"
            ];
            if (options.scope) _scopes.push(...options.scope);
            if (scopes) _scopes.push(...scopes);
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$create$2d$authorization$2d$url$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createAuthorizationURL"])({
                id: "github",
                options,
                authorizationEndpoint: "https://github.com/login/oauth/authorize",
                scopes: _scopes,
                state,
                codeVerifier,
                redirectURI,
                loginHint,
                prompt: options.prompt,
                additionalParams
            });
        },
        validateAuthorizationCode: async ({ code, codeVerifier, redirectURI })=>{
            const { body, headers: requestHeaders } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$validate$2d$authorization$2d$code$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["authorizationCodeRequest"])({
                code,
                codeVerifier,
                redirectURI,
                options
            });
            const { data, error } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$fetch$2f$fetch$2f$dist$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["betterFetch"])(tokenEndpoint, {
                method: "POST",
                body,
                headers: requestHeaders
            });
            if (error) {
                __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$logger$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["logger"].error("GitHub OAuth token exchange failed:", error);
                return null;
            }
            if ("error" in data) {
                __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$logger$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["logger"].error("GitHub OAuth token exchange failed:", data);
                return null;
            }
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$utils$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getOAuth2Tokens"])(data);
        },
        refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken)=>{
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$refresh$2d$access$2d$token$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["refreshAccessToken"])({
                refreshToken,
                options: {
                    clientId: options.clientId,
                    clientKey: options.clientKey,
                    clientSecret: options.clientSecret
                },
                tokenEndpoint
            });
        },
        async getUserInfo (token) {
            if (options.getUserInfo) return options.getUserInfo(token);
            const { data: profile, error } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$fetch$2f$fetch$2f$dist$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["betterFetch"])("https://api.github.com/user", {
                headers: {
                    "User-Agent": "better-auth",
                    authorization: `Bearer ${token.accessToken}`
                }
            });
            if (error) return null;
            const { data: emails } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$fetch$2f$fetch$2f$dist$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["betterFetch"])("https://api.github.com/user/emails", {
                headers: {
                    Authorization: `Bearer ${token.accessToken}`,
                    "User-Agent": "better-auth"
                }
            });
            if (!profile.email && emails) profile.email = (emails.find((e)=>e.primary) ?? emails[0])?.email;
            const emailVerified = emails?.find((e)=>e.email === profile.email)?.verified ?? false;
            const userMap = await options.mapProfileToUser?.(profile);
            return {
                user: {
                    name: profile.name || profile.login || "",
                    email: profile.email,
                    image: profile.avatar_url,
                    emailVerified,
                    ...userMap
                },
                data: profile
            };
        },
        options
    };
};
;
}),
"[project]/examples/nextjs/node_modules/@better-auth/core/dist/social-providers/gitlab.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "gitlab",
    ()=>gitlab
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$create$2d$authorization$2d$url$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/create-authorization-url.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$refresh$2d$access$2d$token$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/refresh-access-token.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$validate$2d$authorization$2d$code$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/validate-authorization-code.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$fetch$2f$fetch$2f$dist$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-fetch/fetch/dist/index.js [app-rsc] (ecmascript)");
;
;
;
;
//#region src/social-providers/gitlab.ts
const cleanDoubleSlashes = (input = "")=>{
    return input.split("://").map((str)=>str.replace(/\/{2,}/g, "/")).join("://");
};
const issuerToEndpoints = (issuer)=>{
    const baseUrl = issuer || "https://gitlab.com";
    return {
        authorizationEndpoint: cleanDoubleSlashes(`${baseUrl}/oauth/authorize`),
        tokenEndpoint: cleanDoubleSlashes(`${baseUrl}/oauth/token`),
        userinfoEndpoint: cleanDoubleSlashes(`${baseUrl}/api/v4/user`)
    };
};
const gitlab = (options)=>{
    const { authorizationEndpoint, tokenEndpoint, userinfoEndpoint } = issuerToEndpoints(options.issuer);
    const issuerId = "gitlab";
    return {
        id: issuerId,
        name: "Gitlab",
        accountSubject: ({ profile })=>profile.id,
        createAuthorizationURL: async ({ state, scopes, codeVerifier, loginHint, redirectURI, additionalParams })=>{
            const _scopes = options.disableDefaultScope ? [] : [
                "read_user"
            ];
            if (options.scope) _scopes.push(...options.scope);
            if (scopes) _scopes.push(...scopes);
            return await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$create$2d$authorization$2d$url$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createAuthorizationURL"])({
                id: issuerId,
                options,
                authorizationEndpoint,
                scopes: _scopes,
                state,
                redirectURI,
                codeVerifier,
                loginHint,
                additionalParams
            });
        },
        validateAuthorizationCode: async ({ code, redirectURI, codeVerifier })=>{
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$validate$2d$authorization$2d$code$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["validateAuthorizationCode"])({
                code,
                redirectURI,
                options,
                codeVerifier,
                tokenEndpoint
            });
        },
        refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken)=>{
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$refresh$2d$access$2d$token$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["refreshAccessToken"])({
                refreshToken,
                options: {
                    clientId: options.clientId,
                    clientKey: options.clientKey,
                    clientSecret: options.clientSecret
                },
                tokenEndpoint
            });
        },
        async getUserInfo (token) {
            if (options.getUserInfo) return options.getUserInfo(token);
            const { data: profile, error } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$fetch$2f$fetch$2f$dist$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["betterFetch"])(userinfoEndpoint, {
                headers: {
                    authorization: `Bearer ${token.accessToken}`
                }
            });
            if (error || profile.state !== "active" || profile.locked) return null;
            const userMap = await options.mapProfileToUser?.(profile);
            return {
                user: {
                    name: profile.name ?? profile.username ?? "",
                    email: profile.email,
                    image: profile.avatar_url,
                    emailVerified: profile.email_verified ?? false,
                    ...userMap
                },
                data: profile
            };
        },
        options
    };
};
;
}),
"[project]/examples/nextjs/node_modules/@better-auth/core/dist/social-providers/google.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getGooglePublicKey",
    ()=>getGooglePublicKey,
    "google",
    ()=>google,
    "isGoogleHostedDomainAllowed",
    ()=>isGoogleHostedDomainAllowed,
    "verifyGoogleIdToken",
    ()=>verifyGoogleIdToken
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/error/index.mjs [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$logger$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/env/logger.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$utils$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/utils.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$create$2d$authorization$2d$url$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/create-authorization-url.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$refresh$2d$access$2d$token$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/refresh-access-token.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$validate$2d$authorization$2d$code$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/validate-authorization-code.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$verify$2d$id$2d$token$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/verify-id-token.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$decode_jwt$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/jose/dist/webapi/util/decode_jwt.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$decode_protected_header$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/jose/dist/webapi/util/decode_protected_header.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$key$2f$import$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/jose/dist/webapi/key/import.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$verify$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/jose/dist/webapi/jwt/verify.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$fetch$2f$fetch$2f$dist$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-fetch/fetch/dist/index.js [app-rsc] (ecmascript)");
;
;
;
;
;
;
;
;
;
//#region src/social-providers/google.ts
const GOOGLE_ID_TOKEN_MAX_AGE = "1h";
const GOOGLE_ID_TOKEN_ALGORITHM = "RS256";
const GOOGLE_ID_TOKEN_ALGORITHMS = [
    GOOGLE_ID_TOKEN_ALGORITHM
];
function isGoogleIdTokenAlgorithm(algorithm) {
    return GOOGLE_ID_TOKEN_ALGORITHMS.includes(algorithm);
}
/**
* Verifies a Google ID token against Google's issuer, audience, signature,
* expiry, and maximum token age.
*/ const verifyGoogleIdToken = async ({ token, audience, nonce })=>{
    try {
        const { kid, alg } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$decode_protected_header$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["decodeProtectedHeader"])(token);
        if (!isGoogleIdTokenAlgorithm(alg)) return null;
        const publicKeys = await getGooglePublicKeys(kid);
        for (const publicKey of publicKeys)try {
            const { payload: jwtClaims } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$verify$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jwtVerify"])(token, publicKey, (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$verify$2d$id$2d$token$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getIdTokenVerifyOptions"])({
                issuer: [
                    "https://accounts.google.com",
                    "accounts.google.com"
                ],
                audience,
                algorithms: GOOGLE_ID_TOKEN_ALGORITHMS,
                maxTokenAge: GOOGLE_ID_TOKEN_MAX_AGE
            }));
            if (nonce && jwtClaims.nonce !== nonce) return null;
            return jwtClaims;
        } catch  {
            continue;
        }
        return null;
    } catch  {
        return null;
    }
};
/**
* Checks whether Google's verified `hd` claim satisfies the configured hosted
* domain restriction. `hd: "*"` accepts any Google Workspace hosted domain.
*/ const isGoogleHostedDomainAllowed = (configuredHostedDomain, tokenHostedDomain)=>{
    if (!configuredHostedDomain) return true;
    if (typeof tokenHostedDomain !== "string" || !tokenHostedDomain) return false;
    if (configuredHostedDomain === "*") return true;
    return tokenHostedDomain === configuredHostedDomain;
};
const google = (options)=>{
    return {
        id: "google",
        name: "Google",
        accountSubject: ({ profile })=>profile.sub,
        async createAuthorizationURL ({ state, scopes, codeVerifier, redirectURI, loginHint, display, additionalParams }) {
            if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$utils$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getPrimaryClientId"])(options.clientId) || !options.clientSecret) {
                __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$logger$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["logger"].error("Client Id and Client Secret is required for Google. Make sure to provide them in the options.");
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["BetterAuthError"]("CLIENT_ID_AND_SECRET_REQUIRED");
            }
            if (!codeVerifier) throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["BetterAuthError"]("codeVerifier is required for Google");
            const _scopes = options.disableDefaultScope ? [] : [
                "email",
                "profile",
                "openid"
            ];
            if (options.scope) _scopes.push(...options.scope);
            if (scopes) _scopes.push(...scopes);
            return await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$create$2d$authorization$2d$url$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createAuthorizationURL"])({
                id: "google",
                options,
                authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
                scopes: _scopes,
                state,
                codeVerifier,
                redirectURI,
                prompt: options.prompt,
                accessType: options.accessType,
                display: display || options.display,
                loginHint,
                hd: options.hd,
                additionalParams: {
                    ...options.includeGrantedScopes === false ? {} : {
                        include_granted_scopes: "true"
                    },
                    ...additionalParams ?? {}
                }
            });
        },
        validateAuthorizationCode: async ({ code, codeVerifier, redirectURI })=>{
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$validate$2d$authorization$2d$code$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["validateAuthorizationCode"])({
                code,
                codeVerifier,
                redirectURI,
                options,
                tokenEndpoint: "https://oauth2.googleapis.com/token"
            });
        },
        refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken)=>{
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$refresh$2d$access$2d$token$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["refreshAccessToken"])({
                refreshToken,
                options: {
                    clientId: options.clientId,
                    clientKey: options.clientKey,
                    clientSecret: options.clientSecret
                },
                tokenEndpoint: "https://oauth2.googleapis.com/token"
            });
        },
        idToken: {
            jwks: (header)=>getGooglePublicKey(header.kid),
            issuer: [
                "https://accounts.google.com",
                "accounts.google.com"
            ],
            audience: options.clientId,
            algorithms: GOOGLE_ID_TOKEN_ALGORITHMS,
            maxTokenAge: GOOGLE_ID_TOKEN_MAX_AGE,
            verifyClaims: options.hd ? (claims)=>isGoogleHostedDomainAllowed(options.hd, claims.hd) : void 0
        },
        async getUserInfo (token) {
            if (options.getUserInfo) return options.getUserInfo(token);
            if (!token.idToken) return null;
            const user = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$decode_jwt$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["decodeJwt"])(token.idToken);
            if (!isGoogleHostedDomainAllowed(options.hd, user.hd)) {
                __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$logger$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["logger"].error(`Google sign-in rejected: id token hosted domain (hd) "${user.hd ?? "<missing>"}" does not satisfy the configured "hd" option "${options.hd}".`);
                return null;
            }
            const userMap = await options.mapProfileToUser?.(user);
            return {
                user: {
                    name: user.name,
                    email: user.email,
                    image: user.picture,
                    emailVerified: user.email_verified,
                    ...userMap
                },
                data: user
            };
        },
        options
    };
};
const getGooglePublicKey = async (kid)=>{
    const [publicKey] = await getGooglePublicKeys(kid);
    if (!publicKey) throw new Error(`JWK with kid ${kid} not found`);
    return publicKey;
};
const getGooglePublicKeys = async (kid)=>{
    const { data } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$fetch$2f$fetch$2f$dist$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["betterFetch"])("https://www.googleapis.com/oauth2/v3/certs");
    if (!data?.keys) throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"]("BAD_REQUEST", {
        message: "Keys not found"
    });
    const jwks = kid ? data.keys.filter((key)=>key.kid === kid) : data.keys;
    if (!jwks.length) throw new Error(`JWK with kid ${kid} not found`);
    return Promise.all(jwks.map((jwk)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$key$2f$import$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["importJWK"])(jwk, GOOGLE_ID_TOKEN_ALGORITHM)));
};
;
}),
"[project]/examples/nextjs/node_modules/@better-auth/core/dist/social-providers/huggingface.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "huggingface",
    ()=>huggingface
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$create$2d$authorization$2d$url$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/create-authorization-url.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$refresh$2d$access$2d$token$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/refresh-access-token.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$validate$2d$authorization$2d$code$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/validate-authorization-code.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$fetch$2f$fetch$2f$dist$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-fetch/fetch/dist/index.js [app-rsc] (ecmascript)");
;
;
;
;
//#region src/social-providers/huggingface.ts
const huggingface = (options)=>{
    const tokenEndpoint = "https://huggingface.co/oauth/token";
    return {
        id: "huggingface",
        name: "Hugging Face",
        accountSubject: ({ profile })=>profile.sub,
        createAuthorizationURL ({ state, scopes, codeVerifier, redirectURI, additionalParams }) {
            const _scopes = options.disableDefaultScope ? [] : [
                "openid",
                "profile",
                "email"
            ];
            if (options.scope) _scopes.push(...options.scope);
            if (scopes) _scopes.push(...scopes);
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$create$2d$authorization$2d$url$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createAuthorizationURL"])({
                id: "huggingface",
                options,
                authorizationEndpoint: "https://huggingface.co/oauth/authorize",
                scopes: _scopes,
                state,
                codeVerifier,
                redirectURI,
                additionalParams
            });
        },
        validateAuthorizationCode: async ({ code, codeVerifier, redirectURI })=>{
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$validate$2d$authorization$2d$code$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["validateAuthorizationCode"])({
                code,
                codeVerifier,
                redirectURI,
                options,
                tokenEndpoint
            });
        },
        refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken)=>{
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$refresh$2d$access$2d$token$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["refreshAccessToken"])({
                refreshToken,
                options: {
                    clientId: options.clientId,
                    clientKey: options.clientKey,
                    clientSecret: options.clientSecret
                },
                tokenEndpoint
            });
        },
        async getUserInfo (token) {
            if (options.getUserInfo) return options.getUserInfo(token);
            const { data: profile, error } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$fetch$2f$fetch$2f$dist$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["betterFetch"])("https://huggingface.co/oauth/userinfo", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token.accessToken}`
                }
            });
            if (error) return null;
            const userMap = await options.mapProfileToUser?.(profile);
            return {
                user: {
                    name: profile.name || profile.preferred_username || "",
                    email: profile.email,
                    image: profile.picture,
                    emailVerified: profile.email_verified ?? false,
                    ...userMap
                },
                data: profile
            };
        },
        options
    };
};
;
}),
"[project]/examples/nextjs/node_modules/@better-auth/core/dist/social-providers/index.mjs [app-rsc] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SocialProviderListEnum",
    ()=>SocialProviderListEnum,
    "socialProviderList",
    ()=>socialProviderList,
    "socialProviders",
    ()=>socialProviders
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$social$2d$providers$2f$apple$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/social-providers/apple.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$social$2d$providers$2f$atlassian$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/social-providers/atlassian.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$social$2d$providers$2f$cloudflare$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/social-providers/cloudflare.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$social$2d$providers$2f$cognito$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/social-providers/cognito.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$social$2d$providers$2f$discord$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/social-providers/discord.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$social$2d$providers$2f$dropbox$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/social-providers/dropbox.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$social$2d$providers$2f$facebook$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/social-providers/facebook.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$social$2d$providers$2f$figma$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/social-providers/figma.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$social$2d$providers$2f$github$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/social-providers/github.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$social$2d$providers$2f$gitlab$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/social-providers/gitlab.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$social$2d$providers$2f$google$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/social-providers/google.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$social$2d$providers$2f$huggingface$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/social-providers/huggingface.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$social$2d$providers$2f$kakao$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/social-providers/kakao.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$social$2d$providers$2f$kick$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/social-providers/kick.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$social$2d$providers$2f$line$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/social-providers/line.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$social$2d$providers$2f$linear$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/social-providers/linear.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$social$2d$providers$2f$linkedin$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/social-providers/linkedin.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$social$2d$providers$2f$microsoft$2d$entra$2d$id$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/social-providers/microsoft-entra-id.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$social$2d$providers$2f$naver$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/social-providers/naver.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$social$2d$providers$2f$notion$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/social-providers/notion.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$social$2d$providers$2f$paybin$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/social-providers/paybin.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$social$2d$providers$2f$paypal$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/social-providers/paypal.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$social$2d$providers$2f$polar$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/social-providers/polar.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$social$2d$providers$2f$railway$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/social-providers/railway.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$social$2d$providers$2f$reddit$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/social-providers/reddit.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$social$2d$providers$2f$roblox$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/social-providers/roblox.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$social$2d$providers$2f$salesforce$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/social-providers/salesforce.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$social$2d$providers$2f$slack$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/social-providers/slack.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$social$2d$providers$2f$spotify$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/social-providers/spotify.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$social$2d$providers$2f$tiktok$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/social-providers/tiktok.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$social$2d$providers$2f$twitch$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/social-providers/twitch.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$social$2d$providers$2f$twitter$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/social-providers/twitter.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$social$2d$providers$2f$vercel$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/social-providers/vercel.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$social$2d$providers$2f$vk$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/social-providers/vk.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$social$2d$providers$2f$wechat$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/social-providers/wechat.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$social$2d$providers$2f$zoom$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/social-providers/zoom.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/zod/v4/classic/schemas.js [app-rsc] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
//#region src/social-providers/index.ts
const socialProviders = {
    apple: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$social$2d$providers$2f$apple$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["apple"],
    atlassian: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$social$2d$providers$2f$atlassian$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["atlassian"],
    cloudflare: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$social$2d$providers$2f$cloudflare$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cloudflare"],
    cognito: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$social$2d$providers$2f$cognito$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cognito"],
    discord: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$social$2d$providers$2f$discord$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["discord"],
    facebook: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$social$2d$providers$2f$facebook$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["facebook"],
    figma: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$social$2d$providers$2f$figma$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["figma"],
    github: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$social$2d$providers$2f$github$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["github"],
    microsoft: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$social$2d$providers$2f$microsoft$2d$entra$2d$id$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["microsoft"],
    google: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$social$2d$providers$2f$google$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["google"],
    huggingface: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$social$2d$providers$2f$huggingface$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["huggingface"],
    slack: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$social$2d$providers$2f$slack$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["slack"],
    spotify: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$social$2d$providers$2f$spotify$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["spotify"],
    twitch: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$social$2d$providers$2f$twitch$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["twitch"],
    twitter: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$social$2d$providers$2f$twitter$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["twitter"],
    dropbox: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$social$2d$providers$2f$dropbox$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["dropbox"],
    kick: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$social$2d$providers$2f$kick$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["kick"],
    linear: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$social$2d$providers$2f$linear$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["linear"],
    linkedin: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$social$2d$providers$2f$linkedin$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["linkedin"],
    gitlab: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$social$2d$providers$2f$gitlab$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["gitlab"],
    tiktok: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$social$2d$providers$2f$tiktok$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["tiktok"],
    reddit: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$social$2d$providers$2f$reddit$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["reddit"],
    roblox: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$social$2d$providers$2f$roblox$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["roblox"],
    salesforce: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$social$2d$providers$2f$salesforce$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["salesforce"],
    vk: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$social$2d$providers$2f$vk$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["vk"],
    zoom: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$social$2d$providers$2f$zoom$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["zoom"],
    notion: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$social$2d$providers$2f$notion$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["notion"],
    kakao: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$social$2d$providers$2f$kakao$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["kakao"],
    naver: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$social$2d$providers$2f$naver$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["naver"],
    line: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$social$2d$providers$2f$line$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["line"],
    paybin: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$social$2d$providers$2f$paybin$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["paybin"],
    paypal: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$social$2d$providers$2f$paypal$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["paypal"],
    polar: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$social$2d$providers$2f$polar$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["polar"],
    railway: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$social$2d$providers$2f$railway$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["railway"],
    vercel: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$social$2d$providers$2f$vercel$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["vercel"],
    wechat: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$social$2d$providers$2f$wechat$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["wechat"]
};
const socialProviderList = Object.keys(socialProviders);
const SocialProviderListEnum = __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["enum"](socialProviderList).or(__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["string"]());
;
}),
"[project]/examples/nextjs/node_modules/@better-auth/core/dist/social-providers/kakao.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "kakao",
    ()=>kakao
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$create$2d$authorization$2d$url$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/create-authorization-url.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$refresh$2d$access$2d$token$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/refresh-access-token.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$validate$2d$authorization$2d$code$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/validate-authorization-code.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$fetch$2f$fetch$2f$dist$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-fetch/fetch/dist/index.js [app-rsc] (ecmascript)");
;
;
;
;
//#region src/social-providers/kakao.ts
const kakao = (options)=>{
    const tokenEndpoint = "https://kauth.kakao.com/oauth/token";
    return {
        id: "kakao",
        name: "Kakao",
        accountSubject: ({ profile })=>profile.id,
        createAuthorizationURL ({ state, scopes, redirectURI, additionalParams }) {
            const _scopes = options.disableDefaultScope ? [] : [
                "account_email",
                "profile_image",
                "profile_nickname"
            ];
            if (options.scope) _scopes.push(...options.scope);
            if (scopes) _scopes.push(...scopes);
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$create$2d$authorization$2d$url$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createAuthorizationURL"])({
                id: "kakao",
                options,
                authorizationEndpoint: "https://kauth.kakao.com/oauth/authorize",
                scopes: _scopes,
                state,
                redirectURI,
                additionalParams
            });
        },
        validateAuthorizationCode: async ({ code, redirectURI })=>{
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$validate$2d$authorization$2d$code$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["validateAuthorizationCode"])({
                code,
                redirectURI,
                options,
                tokenEndpoint
            });
        },
        refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken)=>{
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$refresh$2d$access$2d$token$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["refreshAccessToken"])({
                refreshToken,
                options: {
                    clientId: options.clientId,
                    clientKey: options.clientKey,
                    clientSecret: options.clientSecret
                },
                tokenEndpoint
            });
        },
        async getUserInfo (token) {
            if (options.getUserInfo) return options.getUserInfo(token);
            const { data: profile, error } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$fetch$2f$fetch$2f$dist$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["betterFetch"])("https://kapi.kakao.com/v2/user/me", {
                headers: {
                    Authorization: `Bearer ${token.accessToken}`
                }
            });
            if (error || !profile) return null;
            const userMap = await options.mapProfileToUser?.(profile);
            const account = profile.kakao_account || {};
            const kakaoProfile = account.profile || {};
            return {
                user: {
                    name: kakaoProfile.nickname || account.name || "",
                    email: account.email,
                    image: kakaoProfile.profile_image_url || kakaoProfile.thumbnail_image_url,
                    emailVerified: !!account.is_email_valid && !!account.is_email_verified,
                    ...userMap
                },
                data: profile
            };
        },
        options
    };
};
;
}),
"[project]/examples/nextjs/node_modules/@better-auth/core/dist/social-providers/kick.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "kick",
    ()=>kick
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$create$2d$authorization$2d$url$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/create-authorization-url.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$refresh$2d$access$2d$token$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/refresh-access-token.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$validate$2d$authorization$2d$code$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/validate-authorization-code.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$fetch$2f$fetch$2f$dist$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-fetch/fetch/dist/index.js [app-rsc] (ecmascript)");
;
;
;
;
//#region src/social-providers/kick.ts
const kick = (options)=>{
    return {
        id: "kick",
        name: "Kick",
        accountSubject: ({ profile })=>profile.user_id,
        createAuthorizationURL ({ state, scopes, redirectURI, codeVerifier, additionalParams }) {
            const _scopes = options.disableDefaultScope ? [] : [
                "user:read"
            ];
            if (options.scope) _scopes.push(...options.scope);
            if (scopes) _scopes.push(...scopes);
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$create$2d$authorization$2d$url$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createAuthorizationURL"])({
                id: "kick",
                redirectURI,
                options,
                authorizationEndpoint: "https://id.kick.com/oauth/authorize",
                scopes: _scopes,
                codeVerifier,
                state,
                additionalParams
            });
        },
        async validateAuthorizationCode ({ code, redirectURI, codeVerifier }) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$validate$2d$authorization$2d$code$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["validateAuthorizationCode"])({
                code,
                redirectURI,
                options,
                tokenEndpoint: "https://id.kick.com/oauth/token",
                codeVerifier
            });
        },
        refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken)=>{
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$refresh$2d$access$2d$token$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["refreshAccessToken"])({
                refreshToken,
                options: {
                    clientId: options.clientId,
                    clientSecret: options.clientSecret
                },
                tokenEndpoint: "https://id.kick.com/oauth/token"
            });
        },
        async getUserInfo (token) {
            if (options.getUserInfo) return options.getUserInfo(token);
            const { data, error } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$fetch$2f$fetch$2f$dist$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["betterFetch"])("https://api.kick.com/public/v1/users", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token.accessToken}`
                }
            });
            if (error) return null;
            const profile = data.data[0];
            const userMap = await options.mapProfileToUser?.(profile);
            return {
                user: {
                    name: profile.name,
                    email: profile.email,
                    image: profile.profile_picture,
                    emailVerified: false,
                    ...userMap
                },
                data: profile
            };
        },
        options
    };
};
;
}),
"[project]/examples/nextjs/node_modules/@better-auth/core/dist/social-providers/line.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "line",
    ()=>line
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$create$2d$authorization$2d$url$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/create-authorization-url.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$refresh$2d$access$2d$token$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/refresh-access-token.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$validate$2d$authorization$2d$code$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/validate-authorization-code.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$decode_jwt$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/jose/dist/webapi/util/decode_jwt.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$fetch$2f$fetch$2f$dist$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-fetch/fetch/dist/index.js [app-rsc] (ecmascript)");
;
;
;
;
;
//#region src/social-providers/line.ts
/**
* LINE Login v2.1
* - Authorization endpoint: https://access.line.me/oauth2/v2.1/authorize
* - Token endpoint: https://api.line.me/oauth2/v2.1/token
* - UserInfo endpoint: https://api.line.me/oauth2/v2.1/userinfo
* - Verify ID token: https://api.line.me/oauth2/v2.1/verify
*
* Docs: https://developers.line.biz/en/reference/line-login/#issue-access-token
*/ const line = (options)=>{
    const authorizationEndpoint = "https://access.line.me/oauth2/v2.1/authorize";
    const tokenEndpoint = "https://api.line.me/oauth2/v2.1/token";
    const userInfoEndpoint = "https://api.line.me/oauth2/v2.1/userinfo";
    const verifyIdTokenEndpoint = "https://api.line.me/oauth2/v2.1/verify";
    return {
        id: "line",
        name: "LINE",
        accountSubject: ({ profile })=>profile.sub,
        async createAuthorizationURL ({ state, scopes, codeVerifier, redirectURI, loginHint, additionalParams }) {
            const _scopes = options.disableDefaultScope ? [] : [
                "openid",
                "profile",
                "email"
            ];
            if (options.scope) _scopes.push(...options.scope);
            if (scopes) _scopes.push(...scopes);
            return await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$create$2d$authorization$2d$url$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createAuthorizationURL"])({
                id: "line",
                options,
                authorizationEndpoint,
                scopes: _scopes,
                state,
                codeVerifier,
                redirectURI,
                loginHint,
                additionalParams
            });
        },
        validateAuthorizationCode: async ({ code, codeVerifier, redirectURI })=>{
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$validate$2d$authorization$2d$code$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["validateAuthorizationCode"])({
                code,
                codeVerifier,
                redirectURI,
                options,
                tokenEndpoint
            });
        },
        refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken)=>{
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$refresh$2d$access$2d$token$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["refreshAccessToken"])({
                refreshToken,
                options: {
                    clientId: options.clientId,
                    clientSecret: options.clientSecret
                },
                tokenEndpoint
            });
        },
        idToken: {
            verify: async (token, nonce)=>{
                const body = new URLSearchParams();
                body.set("id_token", token);
                body.set("client_id", options.clientId);
                if (nonce) body.set("nonce", nonce);
                const { data, error } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$fetch$2f$fetch$2f$dist$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["betterFetch"])(verifyIdTokenEndpoint, {
                    method: "POST",
                    headers: {
                        "content-type": "application/x-www-form-urlencoded"
                    },
                    body
                });
                if (error || !data) return false;
                if (data.aud !== options.clientId) return false;
                if (data.nonce && data.nonce !== nonce) return false;
                return true;
            }
        },
        async getUserInfo (token) {
            if (options.getUserInfo) return options.getUserInfo(token);
            let profile = null;
            if (token.idToken) try {
                profile = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$decode_jwt$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["decodeJwt"])(token.idToken);
            } catch  {}
            if (!profile) {
                const { data } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$fetch$2f$fetch$2f$dist$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["betterFetch"])(userInfoEndpoint, {
                    headers: {
                        authorization: `Bearer ${token.accessToken}`
                    }
                });
                profile = data || null;
            }
            if (!profile) return null;
            const userMap = await options.mapProfileToUser?.(profile);
            return {
                user: {
                    name: profile.name || "",
                    email: profile.email,
                    image: profile.picture,
                    emailVerified: false,
                    ...userMap
                },
                data: profile
            };
        },
        options
    };
};
;
}),
"[project]/examples/nextjs/node_modules/@better-auth/core/dist/social-providers/linear.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "linear",
    ()=>linear
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$create$2d$authorization$2d$url$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/create-authorization-url.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$refresh$2d$access$2d$token$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/refresh-access-token.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$validate$2d$authorization$2d$code$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/validate-authorization-code.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$fetch$2f$fetch$2f$dist$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-fetch/fetch/dist/index.js [app-rsc] (ecmascript)");
;
;
;
;
//#region src/social-providers/linear.ts
const linear = (options)=>{
    const tokenEndpoint = "https://api.linear.app/oauth/token";
    return {
        id: "linear",
        name: "Linear",
        accountSubject: ({ profile })=>profile.id,
        createAuthorizationURL ({ state, scopes, loginHint, redirectURI, additionalParams }) {
            const _scopes = options.disableDefaultScope ? [] : [
                "read"
            ];
            if (options.scope) _scopes.push(...options.scope);
            if (scopes) _scopes.push(...scopes);
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$create$2d$authorization$2d$url$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createAuthorizationURL"])({
                id: "linear",
                options,
                authorizationEndpoint: "https://linear.app/oauth/authorize",
                scopes: _scopes,
                state,
                redirectURI,
                loginHint,
                additionalParams
            });
        },
        validateAuthorizationCode: async ({ code, redirectURI })=>{
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$validate$2d$authorization$2d$code$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["validateAuthorizationCode"])({
                code,
                redirectURI,
                options,
                tokenEndpoint
            });
        },
        refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken)=>{
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$refresh$2d$access$2d$token$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["refreshAccessToken"])({
                refreshToken,
                options: {
                    clientId: options.clientId,
                    clientKey: options.clientKey,
                    clientSecret: options.clientSecret
                },
                tokenEndpoint
            });
        },
        async getUserInfo (token) {
            if (options.getUserInfo) return options.getUserInfo(token);
            const { data: profile, error } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$fetch$2f$fetch$2f$dist$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["betterFetch"])("https://api.linear.app/graphql", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token.accessToken}`
                },
                body: JSON.stringify({
                    query: `
							query {
								viewer {
									id
									name
									email
									avatarUrl
									active
									createdAt
									updatedAt
								}
							}
						`
                })
            });
            if (error || !profile?.data?.viewer) return null;
            const userData = profile.data.viewer;
            const userMap = await options.mapProfileToUser?.(userData);
            return {
                user: {
                    name: profile.data.viewer.name,
                    email: profile.data.viewer.email,
                    image: profile.data.viewer.avatarUrl,
                    emailVerified: false,
                    ...userMap
                },
                data: userData
            };
        },
        options
    };
};
;
}),
"[project]/examples/nextjs/node_modules/@better-auth/core/dist/social-providers/linkedin.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "linkedin",
    ()=>linkedin
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$create$2d$authorization$2d$url$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/create-authorization-url.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$refresh$2d$access$2d$token$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/refresh-access-token.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$validate$2d$authorization$2d$code$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/validate-authorization-code.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$fetch$2f$fetch$2f$dist$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-fetch/fetch/dist/index.js [app-rsc] (ecmascript)");
;
;
;
;
//#region src/social-providers/linkedin.ts
const linkedin = (options)=>{
    const authorizationEndpoint = "https://www.linkedin.com/oauth/v2/authorization";
    const tokenEndpoint = "https://www.linkedin.com/oauth/v2/accessToken";
    return {
        id: "linkedin",
        name: "Linkedin",
        accountSubject: ({ profile })=>profile.sub,
        createAuthorizationURL: async ({ state, scopes, redirectURI, loginHint, additionalParams })=>{
            const _scopes = options.disableDefaultScope ? [] : [
                "profile",
                "email",
                "openid"
            ];
            if (options.scope) _scopes.push(...options.scope);
            if (scopes) _scopes.push(...scopes);
            return await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$create$2d$authorization$2d$url$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createAuthorizationURL"])({
                id: "linkedin",
                options,
                authorizationEndpoint,
                scopes: _scopes,
                state,
                loginHint,
                redirectURI,
                additionalParams
            });
        },
        validateAuthorizationCode: async ({ code, redirectURI })=>{
            return await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$validate$2d$authorization$2d$code$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["validateAuthorizationCode"])({
                code,
                redirectURI,
                options,
                tokenEndpoint
            });
        },
        refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken)=>{
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$refresh$2d$access$2d$token$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["refreshAccessToken"])({
                refreshToken,
                options: {
                    clientId: options.clientId,
                    clientKey: options.clientKey,
                    clientSecret: options.clientSecret
                },
                tokenEndpoint
            });
        },
        async getUserInfo (token) {
            if (options.getUserInfo) return options.getUserInfo(token);
            const { data: profile, error } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$fetch$2f$fetch$2f$dist$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["betterFetch"])("https://api.linkedin.com/v2/userinfo", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token.accessToken}`
                }
            });
            if (error) return null;
            const userMap = await options.mapProfileToUser?.(profile);
            return {
                user: {
                    name: profile.name,
                    email: profile.email,
                    emailVerified: profile.email_verified ?? false,
                    image: profile.picture,
                    ...userMap
                },
                data: profile
            };
        },
        options
    };
};
;
}),
"[project]/examples/nextjs/node_modules/@better-auth/core/dist/social-providers/microsoft-entra-id.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getMicrosoftPublicKey",
    ()=>getMicrosoftPublicKey,
    "microsoft",
    ()=>microsoft
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/error/index.mjs [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$logger$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/env/logger.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$utils$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/utils.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$create$2d$authorization$2d$url$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/create-authorization-url.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$refresh$2d$access$2d$token$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/refresh-access-token.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$validate$2d$authorization$2d$code$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/validate-authorization-code.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$base64$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/utils/dist/base64.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$decode_jwt$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/jose/dist/webapi/util/decode_jwt.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$key$2f$import$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/jose/dist/webapi/key/import.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$fetch$2f$fetch$2f$dist$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-fetch/fetch/dist/index.js [app-rsc] (ecmascript)");
;
;
;
;
;
;
;
;
;
//#region src/social-providers/microsoft-entra-id.ts
/**
* Microsoft's fixed tenant id for personal (consumer) Microsoft accounts. Every
* personal-account token carries it as the `tid` claim, so it distinguishes the
* consumer account class from work/school tenants.
* @see https://learn.microsoft.com/en-us/entra/identity-platform/id-token-claims-reference
*/ const MICROSOFT_CONSUMER_TENANT_ID = "9188040d-6c67-4c5b-b112-36a304b66dad";
const microsoft = (options)=>{
    const tenant = options.tenantId || "common";
    let authority = options.authority || "https://login.microsoftonline.com";
    while(authority.endsWith("/"))authority = authority.slice(0, -1);
    const authorizationEndpoint = `${authority}/${tenant}/oauth2/v2.0/authorize`;
    const tokenEndpoint = `${authority}/${tenant}/oauth2/v2.0/token`;
    if (options.clientSecret && options.clientAssertion) throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["BetterAuthError"]("Microsoft Entra ID clientAssertion cannot be combined with clientSecret");
    const tokenEndpointAuth = options.clientAssertion ? {
        method: "private_key_jwt",
        getClientAssertion: options.clientAssertion
    } : void 0;
    return {
        id: "microsoft",
        name: "Microsoft EntraID",
        accountSubject: ({ profile })=>profile.oid,
        createAuthorizationURL (data) {
            if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$utils$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getPrimaryClientId"])(options.clientId)) {
                __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$logger$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["logger"].error("Client Id is required for Microsoft Entra ID. Make sure to provide it in the options.");
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["BetterAuthError"]("CLIENT_ID_AND_SECRET_REQUIRED");
            }
            const scopes = options.disableDefaultScope ? [] : [
                "openid",
                "profile",
                "email",
                "User.Read",
                "offline_access"
            ];
            if (options.scope) scopes.push(...options.scope);
            if (data.scopes) scopes.push(...data.scopes);
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$create$2d$authorization$2d$url$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createAuthorizationURL"])({
                id: "microsoft",
                options,
                authorizationEndpoint,
                state: data.state,
                codeVerifier: data.codeVerifier,
                scopes,
                redirectURI: data.redirectURI,
                prompt: options.prompt,
                loginHint: data.loginHint,
                additionalParams: data.additionalParams
            });
        },
        validateAuthorizationCode ({ code, codeVerifier, redirectURI }) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$validate$2d$authorization$2d$code$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["validateAuthorizationCode"])({
                code,
                codeVerifier,
                redirectURI,
                options,
                tokenEndpoint,
                tokenEndpointAuth
            });
        },
        idToken: {
            jwks: (header)=>getMicrosoftPublicKey(header.kid, tenant, authority),
            algorithms: [
                "RS256"
            ],
            audience: options.clientId,
            maxTokenAge: "1h",
            /**
			* Issuer varies per tenant for multi-tenant endpoints, so only validate it for
			* specific tenants.
			* @see https://learn.microsoft.com/en-us/entra/identity-platform/v2-protocols#endpoints
			*/ issuer: tenant !== "common" && tenant !== "organizations" && tenant !== "consumers" ? `${authority}/${tenant}/v2.0` : void 0,
            /**
			* The multi-tenant endpoints (common/organizations/consumers) skip the
			* issuer check above because the issuer varies per tenant, and the
			* organizations and consumers JWKS sets overlap. Enforce the tenant
			* binding explicitly so a token from a disallowed account class cannot
			* pass: the issuer must name the token's own tenant, and the account
			* class must match the configured restriction.
			* @see https://learn.microsoft.com/en-us/entra/identity-platform/id-token-claims-reference
			*/ verifyClaims: (claims)=>{
                const tid = claims.tid;
                if (typeof tid !== "string" || claims.iss !== `${authority}/${tid}/v2.0`) return false;
                if (tenant === "organizations" && tid === MICROSOFT_CONSUMER_TENANT_ID) return false;
                if (tenant === "consumers" && tid !== MICROSOFT_CONSUMER_TENANT_ID) return false;
                return true;
            }
        },
        async getUserInfo (token) {
            if (options.getUserInfo) return options.getUserInfo(token);
            if (!token.idToken) return null;
            const user = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$decode_jwt$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["decodeJwt"])(token.idToken);
            if (typeof user.oid !== "string" || user.oid.trim().length === 0) {
                __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$logger$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["logger"].error("Microsoft Entra ID token did not include a valid oid claim; unable to resolve a stable account identifier.");
                return null;
            }
            const profilePhotoSize = options.profilePhotoSize || 48;
            if (!options.disableProfilePhoto && token.accessToken) await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$fetch$2f$fetch$2f$dist$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["betterFetch"])(`https://graph.microsoft.com/v1.0/me/photos/${profilePhotoSize}x${profilePhotoSize}/$value`, {
                headers: {
                    Authorization: `Bearer ${token.accessToken}`
                },
                async onResponse (context) {
                    if (!context.response.ok) return;
                    try {
                        const pictureBuffer = await context.response.clone().arrayBuffer();
                        user.picture = `data:image/jpeg;base64, ${__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$base64$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["base64"].encode(pictureBuffer)}`;
                    } catch (e) {
                        __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$logger$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["logger"].error(e && typeof e === "object" && "name" in e ? e.name : "", e);
                    }
                }
            });
            const userMap = await options.mapProfileToUser?.(user);
            const emailVerified = user.email_verified !== void 0 ? user.email_verified : user.email && (user.verified_primary_email?.includes(user.email) || user.verified_secondary_email?.includes(user.email)) ? true : false;
            return {
                user: {
                    name: user.name,
                    email: user.email,
                    image: user.picture,
                    emailVerified,
                    ...userMap
                },
                data: user
            };
        },
        refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken)=>{
            const scopes = options.disableDefaultScope ? [] : [
                "openid",
                "profile",
                "email",
                "User.Read",
                "offline_access"
            ];
            if (options.scope) scopes.push(...options.scope);
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$refresh$2d$access$2d$token$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["refreshAccessToken"])({
                refreshToken,
                options: {
                    clientId: options.clientId,
                    clientSecret: options.clientSecret
                },
                extraParams: {
                    scope: scopes.join(" ")
                },
                tokenEndpoint,
                tokenEndpointAuth
            });
        },
        options
    };
};
const getMicrosoftPublicKey = async (kid, tenant, authority)=>{
    const { data } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$fetch$2f$fetch$2f$dist$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["betterFetch"])(`${authority}/${tenant}/discovery/v2.0/keys`);
    if (!data?.keys) throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"]("BAD_REQUEST", {
        message: "Keys not found"
    });
    const jwk = data.keys.find((key)=>key.kid === kid);
    if (!jwk) throw new Error(`JWK with kid ${kid} not found`);
    return await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$key$2f$import$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["importJWK"])(jwk, jwk.alg ?? "RS256");
};
;
}),
"[project]/examples/nextjs/node_modules/@better-auth/core/dist/social-providers/naver.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "naver",
    ()=>naver
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$create$2d$authorization$2d$url$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/create-authorization-url.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$refresh$2d$access$2d$token$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/refresh-access-token.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$validate$2d$authorization$2d$code$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/validate-authorization-code.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$fetch$2f$fetch$2f$dist$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-fetch/fetch/dist/index.js [app-rsc] (ecmascript)");
;
;
;
;
//#region src/social-providers/naver.ts
const naver = (options)=>{
    const tokenEndpoint = "https://nid.naver.com/oauth2.0/token";
    return {
        id: "naver",
        name: "Naver",
        accountSubject: ({ profile })=>profile.response.id,
        createAuthorizationURL ({ state, scopes, redirectURI, additionalParams }) {
            const _scopes = options.disableDefaultScope ? [] : [
                "profile",
                "email"
            ];
            if (options.scope) _scopes.push(...options.scope);
            if (scopes) _scopes.push(...scopes);
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$create$2d$authorization$2d$url$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createAuthorizationURL"])({
                id: "naver",
                options,
                authorizationEndpoint: "https://nid.naver.com/oauth2.0/authorize",
                scopes: _scopes,
                state,
                redirectURI,
                additionalParams
            });
        },
        validateAuthorizationCode: async ({ code, redirectURI })=>{
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$validate$2d$authorization$2d$code$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["validateAuthorizationCode"])({
                code,
                redirectURI,
                options,
                tokenEndpoint
            });
        },
        refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken)=>{
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$refresh$2d$access$2d$token$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["refreshAccessToken"])({
                refreshToken,
                options: {
                    clientId: options.clientId,
                    clientKey: options.clientKey,
                    clientSecret: options.clientSecret
                },
                tokenEndpoint
            });
        },
        async getUserInfo (token) {
            if (options.getUserInfo) return options.getUserInfo(token);
            const { data: profile, error } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$fetch$2f$fetch$2f$dist$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["betterFetch"])("https://openapi.naver.com/v1/nid/me", {
                headers: {
                    Authorization: `Bearer ${token.accessToken}`
                }
            });
            if (error || !profile || profile.resultcode !== "00") return null;
            const userMap = await options.mapProfileToUser?.(profile);
            const res = profile.response || {};
            return {
                user: {
                    name: res.name || res.nickname || "",
                    email: res.email,
                    image: res.profile_image,
                    emailVerified: false,
                    ...userMap
                },
                data: profile
            };
        },
        options
    };
};
;
}),
"[project]/examples/nextjs/node_modules/@better-auth/core/dist/social-providers/notion.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "notion",
    ()=>notion
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$create$2d$authorization$2d$url$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/create-authorization-url.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$refresh$2d$access$2d$token$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/refresh-access-token.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$validate$2d$authorization$2d$code$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/validate-authorization-code.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$fetch$2f$fetch$2f$dist$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-fetch/fetch/dist/index.js [app-rsc] (ecmascript)");
;
;
;
;
//#region src/social-providers/notion.ts
const notion = (options)=>{
    const tokenEndpoint = "https://api.notion.com/v1/oauth/token";
    return {
        id: "notion",
        name: "Notion",
        accountSubject: ({ profile })=>profile.id,
        createAuthorizationURL ({ state, scopes, loginHint, redirectURI, additionalParams }) {
            const _scopes = options.disableDefaultScope ? [] : [];
            if (options.scope) _scopes.push(...options.scope);
            if (scopes) _scopes.push(...scopes);
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$create$2d$authorization$2d$url$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createAuthorizationURL"])({
                id: "notion",
                options,
                authorizationEndpoint: "https://api.notion.com/v1/oauth/authorize",
                scopes: _scopes,
                state,
                redirectURI,
                loginHint,
                additionalParams: {
                    ...additionalParams ?? {},
                    owner: "user"
                }
            });
        },
        validateAuthorizationCode: async ({ code, redirectURI })=>{
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$validate$2d$authorization$2d$code$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["validateAuthorizationCode"])({
                code,
                redirectURI,
                options,
                tokenEndpoint,
                authentication: "basic"
            });
        },
        refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken)=>{
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$refresh$2d$access$2d$token$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["refreshAccessToken"])({
                refreshToken,
                options: {
                    clientId: options.clientId,
                    clientKey: options.clientKey,
                    clientSecret: options.clientSecret
                },
                tokenEndpoint
            });
        },
        async getUserInfo (token) {
            if (options.getUserInfo) return options.getUserInfo(token);
            const { data: profile, error } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$fetch$2f$fetch$2f$dist$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["betterFetch"])("https://api.notion.com/v1/users/me", {
                headers: {
                    Authorization: `Bearer ${token.accessToken}`,
                    "Notion-Version": "2022-06-28"
                }
            });
            if (error || !profile) return null;
            const userProfile = profile.bot?.owner?.user;
            if (!userProfile) return null;
            const userMap = await options.mapProfileToUser?.(userProfile);
            return {
                user: {
                    name: userProfile.name || "",
                    email: userProfile.person?.email || null,
                    image: userProfile.avatar_url,
                    emailVerified: false,
                    ...userMap
                },
                data: userProfile
            };
        },
        options
    };
};
;
}),
"[project]/examples/nextjs/node_modules/@better-auth/core/dist/social-providers/paybin.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "paybin",
    ()=>paybin
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/error/index.mjs [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$logger$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/env/logger.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$create$2d$authorization$2d$url$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/create-authorization-url.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$refresh$2d$access$2d$token$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/refresh-access-token.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$validate$2d$authorization$2d$code$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/validate-authorization-code.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$decode_jwt$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/jose/dist/webapi/util/decode_jwt.js [app-rsc] (ecmascript)");
;
;
;
;
;
;
//#region src/social-providers/paybin.ts
const paybin = (options)=>{
    const issuer = options.issuer || "https://idp.paybin.io";
    const authorizationEndpoint = `${issuer}/oauth2/authorize`;
    const tokenEndpoint = `${issuer}/oauth2/token`;
    return {
        id: "paybin",
        name: "Paybin",
        accountSubject: ({ profile })=>profile.sub,
        async createAuthorizationURL ({ state, scopes, codeVerifier, redirectURI, loginHint, additionalParams }) {
            if (!options.clientId || !options.clientSecret) {
                __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$logger$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["logger"].error("Client Id and Client Secret is required for Paybin. Make sure to provide them in the options.");
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["BetterAuthError"]("CLIENT_ID_AND_SECRET_REQUIRED");
            }
            if (!codeVerifier) throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["BetterAuthError"]("codeVerifier is required for Paybin");
            const _scopes = options.disableDefaultScope ? [] : [
                "openid",
                "email",
                "profile"
            ];
            if (options.scope) _scopes.push(...options.scope);
            if (scopes) _scopes.push(...scopes);
            return await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$create$2d$authorization$2d$url$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createAuthorizationURL"])({
                id: "paybin",
                options,
                authorizationEndpoint,
                scopes: _scopes,
                state,
                codeVerifier,
                redirectURI,
                prompt: options.prompt,
                loginHint,
                additionalParams
            });
        },
        validateAuthorizationCode: async ({ code, codeVerifier, redirectURI })=>{
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$validate$2d$authorization$2d$code$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["validateAuthorizationCode"])({
                code,
                codeVerifier,
                redirectURI,
                options,
                tokenEndpoint
            });
        },
        refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken)=>{
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$refresh$2d$access$2d$token$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["refreshAccessToken"])({
                refreshToken,
                options: {
                    clientId: options.clientId,
                    clientKey: options.clientKey,
                    clientSecret: options.clientSecret
                },
                tokenEndpoint
            });
        },
        async getUserInfo (token) {
            if (options.getUserInfo) return options.getUserInfo(token);
            if (!token.idToken) return null;
            const user = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$decode_jwt$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["decodeJwt"])(token.idToken);
            const userMap = await options.mapProfileToUser?.(user);
            return {
                user: {
                    name: user.name || user.preferred_username || "",
                    email: user.email,
                    image: user.picture,
                    emailVerified: user.email_verified || false,
                    ...userMap
                },
                data: user
            };
        },
        options
    };
};
;
}),
"[project]/examples/nextjs/node_modules/@better-auth/core/dist/social-providers/paypal.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "paypal",
    ()=>paypal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/error/index.mjs [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$logger$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/env/logger.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$create$2d$authorization$2d$url$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/create-authorization-url.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$refresh$2d$access$2d$token$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/refresh-access-token.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$validate$2d$authorization$2d$code$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/validate-authorization-code.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$decode_jwt$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/jose/dist/webapi/util/decode_jwt.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$fetch$2f$fetch$2f$dist$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-fetch/fetch/dist/index.js [app-rsc] (ecmascript)");
;
;
;
;
;
;
;
//#region src/social-providers/paypal.ts
const paypal = (options)=>{
    const isSandbox = (options.environment || "sandbox") === "sandbox";
    const authorizationEndpoint = isSandbox ? "https://www.sandbox.paypal.com/signin/authorize" : "https://www.paypal.com/signin/authorize";
    const tokenEndpoint = isSandbox ? "https://api-m.sandbox.paypal.com/v1/oauth2/token" : "https://api-m.paypal.com/v1/oauth2/token";
    const userInfoEndpoint = isSandbox ? "https://api-m.sandbox.paypal.com/v1/identity/oauth2/userinfo" : "https://api-m.paypal.com/v1/identity/oauth2/userinfo";
    const tokenRequestOptions = {
        clientId: options.clientId,
        clientSecret: options.clientSecret
    };
    const tokenEndpointAuth = {
        method: "client_secret_basic"
    };
    return {
        id: "paypal",
        name: "PayPal",
        accountSubject: ({ profile })=>profile.user_id,
        async createAuthorizationURL ({ state, codeVerifier, redirectURI, additionalParams }) {
            if (!options.clientId || !options.clientSecret) {
                __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$logger$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["logger"].error("Client Id and Client Secret is required for PayPal. Make sure to provide them in the options.");
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["BetterAuthError"]("CLIENT_ID_AND_SECRET_REQUIRED");
            }
            return await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$create$2d$authorization$2d$url$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createAuthorizationURL"])({
                id: "paypal",
                options,
                authorizationEndpoint,
                scopes: [],
                state,
                codeVerifier,
                redirectURI,
                prompt: options.prompt,
                additionalParams
            });
        },
        validateAuthorizationCode: async ({ code, codeVerifier, redirectURI })=>{
            try {
                return await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$validate$2d$authorization$2d$code$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["validateAuthorizationCode"])({
                    code,
                    codeVerifier,
                    redirectURI: options.redirectURI || redirectURI,
                    options: tokenRequestOptions,
                    tokenEndpoint,
                    tokenEndpointAuth
                });
            } catch (error) {
                __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$logger$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["logger"].error("PayPal token exchange failed:", error);
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["BetterAuthError"]("FAILED_TO_GET_ACCESS_TOKEN");
            }
        },
        refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken)=>{
            try {
                return await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$refresh$2d$access$2d$token$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["refreshAccessToken"])({
                    refreshToken,
                    options: tokenRequestOptions,
                    tokenEndpoint,
                    tokenEndpointAuth
                });
            } catch (error) {
                __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$logger$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["logger"].error("PayPal token refresh failed:", error);
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["BetterAuthError"]("FAILED_TO_REFRESH_ACCESS_TOKEN");
            }
        },
        async getUserInfo (token) {
            if (options.getUserInfo) return options.getUserInfo(token);
            if (!token.accessToken) {
                __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$logger$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["logger"].error("Access token is required to fetch PayPal user info");
                return null;
            }
            try {
                const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$fetch$2f$fetch$2f$dist$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["betterFetch"])(`${userInfoEndpoint}?schema=paypalv1.1`, {
                    headers: {
                        Authorization: `Bearer ${token.accessToken}`,
                        Accept: "application/json"
                    }
                });
                if (!response.data) {
                    __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$logger$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["logger"].error("Failed to fetch user info from PayPal");
                    return null;
                }
                const userInfo = response.data;
                if (token.idToken) {
                    let idTokenSubject;
                    try {
                        idTokenSubject = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$decode_jwt$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["decodeJwt"])(token.idToken).sub;
                    } catch (error) {
                        __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$logger$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["logger"].error("Failed to decode PayPal ID token:", error);
                        return null;
                    }
                    const userInfoSubject = userInfo.sub ?? userInfo.user_id;
                    if (!idTokenSubject || userInfoSubject !== idTokenSubject) {
                        __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$logger$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["logger"].error("PayPal user info subject does not match ID token subject");
                        return null;
                    }
                }
                const userMap = await options.mapProfileToUser?.(userInfo);
                return {
                    user: {
                        name: userInfo.name,
                        email: userInfo.email,
                        image: userInfo.picture,
                        emailVerified: userInfo.email_verified,
                        ...userMap
                    },
                    data: userInfo
                };
            } catch (error) {
                __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$logger$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["logger"].error("Failed to fetch user info from PayPal:", error);
                return null;
            }
        },
        options
    };
};
;
}),
"[project]/examples/nextjs/node_modules/@better-auth/core/dist/social-providers/polar.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "polar",
    ()=>polar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$create$2d$authorization$2d$url$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/create-authorization-url.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$refresh$2d$access$2d$token$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/refresh-access-token.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$validate$2d$authorization$2d$code$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/validate-authorization-code.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$fetch$2f$fetch$2f$dist$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-fetch/fetch/dist/index.js [app-rsc] (ecmascript)");
;
;
;
;
//#region src/social-providers/polar.ts
const polar = (options)=>{
    const tokenEndpoint = "https://api.polar.sh/v1/oauth2/token";
    return {
        id: "polar",
        name: "Polar",
        accountSubject: ({ profile })=>profile.id,
        createAuthorizationURL ({ state, scopes, codeVerifier, redirectURI, additionalParams }) {
            const _scopes = options.disableDefaultScope ? [] : [
                "openid",
                "profile",
                "email"
            ];
            if (options.scope) _scopes.push(...options.scope);
            if (scopes) _scopes.push(...scopes);
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$create$2d$authorization$2d$url$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createAuthorizationURL"])({
                id: "polar",
                options,
                authorizationEndpoint: "https://polar.sh/oauth2/authorize",
                scopes: _scopes,
                state,
                codeVerifier,
                redirectURI,
                prompt: options.prompt,
                additionalParams
            });
        },
        validateAuthorizationCode: async ({ code, codeVerifier, redirectURI })=>{
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$validate$2d$authorization$2d$code$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["validateAuthorizationCode"])({
                code,
                codeVerifier,
                redirectURI,
                options,
                tokenEndpoint
            });
        },
        refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken)=>{
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$refresh$2d$access$2d$token$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["refreshAccessToken"])({
                refreshToken,
                options: {
                    clientId: options.clientId,
                    clientKey: options.clientKey,
                    clientSecret: options.clientSecret
                },
                tokenEndpoint
            });
        },
        async getUserInfo (token) {
            if (options.getUserInfo) return options.getUserInfo(token);
            const { data: profile, error } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$fetch$2f$fetch$2f$dist$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["betterFetch"])("https://api.polar.sh/v1/oauth2/userinfo", {
                headers: {
                    Authorization: `Bearer ${token.accessToken}`
                }
            });
            if (error) return null;
            const userMap = await options.mapProfileToUser?.(profile);
            return {
                user: {
                    name: profile.public_name || profile.username || "",
                    email: profile.email,
                    image: profile.avatar_url,
                    emailVerified: profile.email_verified ?? false,
                    ...userMap
                },
                data: profile
            };
        },
        options
    };
};
;
}),
"[project]/examples/nextjs/node_modules/@better-auth/core/dist/social-providers/railway.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "railway",
    ()=>railway
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$create$2d$authorization$2d$url$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/create-authorization-url.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$refresh$2d$access$2d$token$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/refresh-access-token.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$validate$2d$authorization$2d$code$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/validate-authorization-code.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$fetch$2f$fetch$2f$dist$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-fetch/fetch/dist/index.js [app-rsc] (ecmascript)");
;
;
;
;
//#region src/social-providers/railway.ts
const authorizationEndpoint = "https://backboard.railway.com/oauth/auth";
const tokenEndpoint = "https://backboard.railway.com/oauth/token";
const userinfoEndpoint = "https://backboard.railway.com/oauth/me";
const railway = (options)=>{
    return {
        id: "railway",
        name: "Railway",
        accountSubject: ({ profile })=>profile.sub,
        createAuthorizationURL ({ state, scopes, codeVerifier, redirectURI, additionalParams }) {
            const _scopes = options.disableDefaultScope ? [] : [
                "openid",
                "email",
                "profile"
            ];
            if (options.scope) _scopes.push(...options.scope);
            if (scopes) _scopes.push(...scopes);
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$create$2d$authorization$2d$url$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createAuthorizationURL"])({
                id: "railway",
                options,
                authorizationEndpoint,
                scopes: _scopes,
                state,
                codeVerifier,
                redirectURI,
                additionalParams
            });
        },
        validateAuthorizationCode: async ({ code, codeVerifier, redirectURI })=>{
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$validate$2d$authorization$2d$code$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["validateAuthorizationCode"])({
                code,
                codeVerifier,
                redirectURI,
                options,
                tokenEndpoint,
                authentication: "basic"
            });
        },
        refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken)=>{
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$refresh$2d$access$2d$token$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["refreshAccessToken"])({
                refreshToken,
                options: {
                    clientId: options.clientId,
                    clientKey: options.clientKey,
                    clientSecret: options.clientSecret
                },
                tokenEndpoint,
                authentication: "basic"
            });
        },
        async getUserInfo (token) {
            if (options.getUserInfo) return options.getUserInfo(token);
            const { data: profile, error } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$fetch$2f$fetch$2f$dist$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["betterFetch"])(userinfoEndpoint, {
                headers: {
                    authorization: `Bearer ${token.accessToken}`
                }
            });
            if (error || !profile) return null;
            const userMap = await options.mapProfileToUser?.(profile);
            return {
                user: {
                    name: profile.name,
                    email: profile.email,
                    image: profile.picture,
                    emailVerified: false,
                    ...userMap
                },
                data: profile
            };
        },
        options
    };
};
;
}),
"[project]/examples/nextjs/node_modules/@better-auth/core/dist/social-providers/reddit.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "reddit",
    ()=>reddit
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$create$2d$authorization$2d$url$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/create-authorization-url.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$refresh$2d$access$2d$token$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/refresh-access-token.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$validate$2d$authorization$2d$code$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/validate-authorization-code.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$email$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/utils/email.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$fetch$2f$fetch$2f$dist$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-fetch/fetch/dist/index.js [app-rsc] (ecmascript)");
;
;
;
;
;
//#region src/social-providers/reddit.ts
const reddit = (options)=>{
    const tokenEndpoint = "https://www.reddit.com/api/v1/access_token";
    const tokenRequestOptions = {
        clientId: options.clientId,
        clientSecret: options.clientSecret
    };
    const tokenEndpointAuth = {
        method: "client_secret_basic"
    };
    return {
        id: "reddit",
        name: "Reddit",
        accountSubject: ({ profile })=>profile.id,
        createAuthorizationURL ({ state, scopes, redirectURI, additionalParams }) {
            const _scopes = options.disableDefaultScope ? [] : [
                "identity"
            ];
            if (options.scope) _scopes.push(...options.scope);
            if (scopes) _scopes.push(...scopes);
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$create$2d$authorization$2d$url$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createAuthorizationURL"])({
                id: "reddit",
                options,
                authorizationEndpoint: "https://www.reddit.com/api/v1/authorize",
                scopes: _scopes,
                state,
                redirectURI,
                duration: options.duration,
                additionalParams
            });
        },
        validateAuthorizationCode: async ({ code, redirectURI })=>{
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$validate$2d$authorization$2d$code$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["validateAuthorizationCode"])({
                code,
                redirectURI: options.redirectURI || redirectURI,
                options: tokenRequestOptions,
                tokenEndpoint,
                tokenEndpointAuth,
                headers: {
                    accept: "text/plain",
                    "user-agent": "better-auth"
                }
            });
        },
        refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken)=>{
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$refresh$2d$access$2d$token$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["refreshAccessToken"])({
                refreshToken,
                options: tokenRequestOptions,
                tokenEndpoint,
                tokenEndpointAuth
            });
        },
        async getUserInfo (token) {
            if (options.getUserInfo) return options.getUserInfo(token);
            const { data: profile, error } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$fetch$2f$fetch$2f$dist$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["betterFetch"])("https://oauth.reddit.com/api/v1/me", {
                headers: {
                    Authorization: `Bearer ${token.accessToken}`,
                    "User-Agent": "better-auth"
                }
            });
            if (error) return null;
            const userMap = await options.mapProfileToUser?.(profile);
            const email = userMap?.email || (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$email$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createPlaceholderEmail"])({
                identifier: profile.id,
                namespace: "reddit"
            });
            return {
                user: {
                    name: profile.name,
                    image: profile.icon_img?.split("?")[0],
                    ...userMap,
                    email,
                    emailVerified: userMap?.emailVerified ?? false
                },
                data: profile
            };
        },
        options
    };
};
;
}),
"[project]/examples/nextjs/node_modules/@better-auth/core/dist/social-providers/roblox.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "roblox",
    ()=>roblox
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$create$2d$authorization$2d$url$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/create-authorization-url.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$refresh$2d$access$2d$token$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/refresh-access-token.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$validate$2d$authorization$2d$code$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/validate-authorization-code.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$email$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/utils/email.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$fetch$2f$fetch$2f$dist$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-fetch/fetch/dist/index.js [app-rsc] (ecmascript)");
;
;
;
;
;
//#region src/social-providers/roblox.ts
const roblox = (options)=>{
    const tokenEndpoint = "https://apis.roblox.com/oauth/v1/token";
    return {
        id: "roblox",
        name: "Roblox",
        accountSubject: ({ profile })=>profile.sub,
        createAuthorizationURL ({ state, scopes, redirectURI, additionalParams }) {
            const _scopes = options.disableDefaultScope ? [] : [
                "openid",
                "profile"
            ];
            if (options.scope) _scopes.push(...options.scope);
            if (scopes) _scopes.push(...scopes);
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$create$2d$authorization$2d$url$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createAuthorizationURL"])({
                id: "roblox",
                options,
                authorizationEndpoint: "https://apis.roblox.com/oauth/v1/authorize",
                scopes: _scopes,
                state,
                redirectURI,
                prompt: options.prompt || "select_account consent",
                additionalParams
            });
        },
        validateAuthorizationCode: async ({ code, redirectURI })=>{
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$validate$2d$authorization$2d$code$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["validateAuthorizationCode"])({
                code,
                redirectURI: options.redirectURI || redirectURI,
                options,
                tokenEndpoint,
                authentication: "post"
            });
        },
        refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken)=>{
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$refresh$2d$access$2d$token$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["refreshAccessToken"])({
                refreshToken,
                options: {
                    clientId: options.clientId,
                    clientKey: options.clientKey,
                    clientSecret: options.clientSecret
                },
                tokenEndpoint
            });
        },
        async getUserInfo (token) {
            if (options.getUserInfo) return options.getUserInfo(token);
            const { data: profile, error } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$fetch$2f$fetch$2f$dist$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["betterFetch"])("https://apis.roblox.com/oauth/v1/userinfo", {
                headers: {
                    authorization: `Bearer ${token.accessToken}`
                }
            });
            if (error) return null;
            const userMap = await options.mapProfileToUser?.(profile);
            return {
                user: {
                    name: profile.nickname || profile.preferred_username || "",
                    image: profile.picture,
                    email: (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$email$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createPlaceholderEmail"])({
                        identifier: profile.sub,
                        namespace: "roblox"
                    }),
                    emailVerified: false,
                    ...userMap
                },
                data: {
                    ...profile
                }
            };
        },
        options
    };
};
;
}),
"[project]/examples/nextjs/node_modules/@better-auth/core/dist/social-providers/salesforce.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "salesforce",
    ()=>salesforce
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/error/index.mjs [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$logger$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/env/logger.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$create$2d$authorization$2d$url$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/create-authorization-url.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$refresh$2d$access$2d$token$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/refresh-access-token.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$validate$2d$authorization$2d$code$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/validate-authorization-code.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$fetch$2f$fetch$2f$dist$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-fetch/fetch/dist/index.js [app-rsc] (ecmascript)");
;
;
;
;
;
;
//#region src/social-providers/salesforce.ts
const salesforce = (options)=>{
    const isSandbox = (options.environment ?? "production") === "sandbox";
    const authorizationEndpoint = options.loginUrl ? `https://${options.loginUrl}/services/oauth2/authorize` : isSandbox ? "https://test.salesforce.com/services/oauth2/authorize" : "https://login.salesforce.com/services/oauth2/authorize";
    const tokenEndpoint = options.loginUrl ? `https://${options.loginUrl}/services/oauth2/token` : isSandbox ? "https://test.salesforce.com/services/oauth2/token" : "https://login.salesforce.com/services/oauth2/token";
    const userInfoEndpoint = options.loginUrl ? `https://${options.loginUrl}/services/oauth2/userinfo` : isSandbox ? "https://test.salesforce.com/services/oauth2/userinfo" : "https://login.salesforce.com/services/oauth2/userinfo";
    return {
        id: "salesforce",
        name: "Salesforce",
        accountSubject: ({ profile })=>profile.user_id,
        async createAuthorizationURL ({ state, scopes, codeVerifier, redirectURI, additionalParams }) {
            if (!options.clientId || !options.clientSecret) {
                __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$logger$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["logger"].error("Client Id and Client Secret are required for Salesforce. Make sure to provide them in the options.");
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["BetterAuthError"]("CLIENT_ID_AND_SECRET_REQUIRED");
            }
            if (!codeVerifier) throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["BetterAuthError"]("codeVerifier is required for Salesforce");
            const _scopes = options.disableDefaultScope ? [] : [
                "openid",
                "email",
                "profile"
            ];
            if (options.scope) _scopes.push(...options.scope);
            if (scopes) _scopes.push(...scopes);
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$create$2d$authorization$2d$url$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createAuthorizationURL"])({
                id: "salesforce",
                options,
                authorizationEndpoint,
                scopes: _scopes,
                state,
                codeVerifier,
                redirectURI: options.redirectURI || redirectURI,
                additionalParams
            });
        },
        validateAuthorizationCode: async ({ code, codeVerifier, redirectURI })=>{
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$validate$2d$authorization$2d$code$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["validateAuthorizationCode"])({
                code,
                codeVerifier,
                redirectURI: options.redirectURI || redirectURI,
                options,
                tokenEndpoint
            });
        },
        refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken)=>{
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$refresh$2d$access$2d$token$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["refreshAccessToken"])({
                refreshToken,
                options: {
                    clientId: options.clientId,
                    clientSecret: options.clientSecret
                },
                tokenEndpoint
            });
        },
        async getUserInfo (token) {
            if (options.getUserInfo) return options.getUserInfo(token);
            try {
                const { data: user } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$fetch$2f$fetch$2f$dist$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["betterFetch"])(userInfoEndpoint, {
                    headers: {
                        Authorization: `Bearer ${token.accessToken}`
                    }
                });
                if (!user) {
                    __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$logger$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["logger"].error("Failed to fetch user info from Salesforce");
                    return null;
                }
                const userMap = await options.mapProfileToUser?.(user);
                return {
                    user: {
                        name: user.name,
                        email: user.email,
                        image: user.photos?.picture || user.photos?.thumbnail,
                        emailVerified: user.email_verified ?? false,
                        ...userMap
                    },
                    data: user
                };
            } catch (error) {
                __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$logger$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["logger"].error("Failed to fetch user info from Salesforce:", error);
                return null;
            }
        },
        options
    };
};
;
}),
"[project]/examples/nextjs/node_modules/@better-auth/core/dist/social-providers/slack.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "slack",
    ()=>slack
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$create$2d$authorization$2d$url$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/create-authorization-url.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$refresh$2d$access$2d$token$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/refresh-access-token.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$validate$2d$authorization$2d$code$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/validate-authorization-code.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$fetch$2f$fetch$2f$dist$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-fetch/fetch/dist/index.js [app-rsc] (ecmascript)");
;
;
;
;
//#region src/social-providers/slack.ts
const slack = (options)=>{
    const tokenEndpoint = "https://slack.com/api/openid.connect.token";
    return {
        id: "slack",
        name: "Slack",
        accountSubject: ({ profile })=>profile["https://slack.com/user_id"],
        createAuthorizationURL ({ state, scopes, redirectURI, additionalParams }) {
            const _scopes = options.disableDefaultScope ? [] : [
                "openid",
                "profile",
                "email"
            ];
            if (scopes) _scopes.push(...scopes);
            if (options.scope) _scopes.push(...options.scope);
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$create$2d$authorization$2d$url$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createAuthorizationURL"])({
                id: "slack",
                options,
                authorizationEndpoint: "https://slack.com/openid/connect/authorize",
                scopes: _scopes,
                state,
                redirectURI,
                additionalParams
            });
        },
        validateAuthorizationCode: async ({ code, redirectURI })=>{
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$validate$2d$authorization$2d$code$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["validateAuthorizationCode"])({
                code,
                redirectURI,
                options,
                tokenEndpoint
            });
        },
        refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken)=>{
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$refresh$2d$access$2d$token$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["refreshAccessToken"])({
                refreshToken,
                options: {
                    clientId: options.clientId,
                    clientKey: options.clientKey,
                    clientSecret: options.clientSecret
                },
                tokenEndpoint
            });
        },
        async getUserInfo (token) {
            if (options.getUserInfo) return options.getUserInfo(token);
            const { data: profile, error } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$fetch$2f$fetch$2f$dist$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["betterFetch"])("https://slack.com/api/openid.connect.userInfo", {
                headers: {
                    authorization: `Bearer ${token.accessToken}`
                }
            });
            if (error) return null;
            const userMap = await options.mapProfileToUser?.(profile);
            return {
                user: {
                    name: profile.name || "",
                    email: profile.email,
                    emailVerified: profile.email_verified,
                    image: profile.picture || profile["https://slack.com/user_image_512"],
                    ...userMap
                },
                data: profile
            };
        },
        options
    };
};
;
}),
"[project]/examples/nextjs/node_modules/@better-auth/core/dist/social-providers/spotify.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "spotify",
    ()=>spotify
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$create$2d$authorization$2d$url$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/create-authorization-url.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$refresh$2d$access$2d$token$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/refresh-access-token.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$validate$2d$authorization$2d$code$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/validate-authorization-code.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$fetch$2f$fetch$2f$dist$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-fetch/fetch/dist/index.js [app-rsc] (ecmascript)");
;
;
;
;
//#region src/social-providers/spotify.ts
const spotify = (options)=>{
    const tokenEndpoint = "https://accounts.spotify.com/api/token";
    return {
        id: "spotify",
        name: "Spotify",
        accountSubject: ({ profile })=>profile.id,
        createAuthorizationURL ({ state, scopes, codeVerifier, redirectURI, additionalParams }) {
            const _scopes = options.disableDefaultScope ? [] : [
                "user-read-email"
            ];
            if (options.scope) _scopes.push(...options.scope);
            if (scopes) _scopes.push(...scopes);
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$create$2d$authorization$2d$url$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createAuthorizationURL"])({
                id: "spotify",
                options,
                authorizationEndpoint: "https://accounts.spotify.com/authorize",
                scopes: _scopes,
                state,
                codeVerifier,
                redirectURI,
                additionalParams
            });
        },
        validateAuthorizationCode: async ({ code, codeVerifier, redirectURI })=>{
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$validate$2d$authorization$2d$code$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["validateAuthorizationCode"])({
                code,
                codeVerifier,
                redirectURI,
                options,
                tokenEndpoint
            });
        },
        refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken)=>{
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$refresh$2d$access$2d$token$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["refreshAccessToken"])({
                refreshToken,
                options: {
                    clientId: options.clientId,
                    clientKey: options.clientKey,
                    clientSecret: options.clientSecret
                },
                tokenEndpoint
            });
        },
        async getUserInfo (token) {
            if (options.getUserInfo) return options.getUserInfo(token);
            const { data: profile, error } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$fetch$2f$fetch$2f$dist$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["betterFetch"])("https://api.spotify.com/v1/me", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token.accessToken}`
                }
            });
            if (error) return null;
            const userMap = await options.mapProfileToUser?.(profile);
            return {
                user: {
                    name: profile.display_name,
                    email: profile.email,
                    image: profile.images[0]?.url,
                    emailVerified: false,
                    ...userMap
                },
                data: profile
            };
        },
        options
    };
};
;
}),
"[project]/examples/nextjs/node_modules/@better-auth/core/dist/social-providers/tiktok.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "tiktok",
    ()=>tiktok
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$create$2d$authorization$2d$url$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/create-authorization-url.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$refresh$2d$access$2d$token$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/refresh-access-token.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$validate$2d$authorization$2d$code$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/validate-authorization-code.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$email$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/utils/email.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$fetch$2f$fetch$2f$dist$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-fetch/fetch/dist/index.js [app-rsc] (ecmascript)");
;
;
;
;
;
//#region src/social-providers/tiktok.ts
const tiktok = (options)=>{
    const tokenEndpoint = "https://open.tiktokapis.com/v2/oauth/token/";
    const tokenEndpointAuth = {
        method: "custom",
        customizeRequest ({ body }) {
            body.set("client_key", options.clientKey);
            body.set("client_secret", options.clientSecret);
        }
    };
    return {
        id: "tiktok",
        name: "TikTok",
        accountSubject: ({ profile })=>profile.data.user.open_id,
        createAuthorizationURL ({ state, scopes, redirectURI, additionalParams }) {
            const _scopes = options.disableDefaultScope ? [] : [
                "user.info.profile"
            ];
            if (options.scope) _scopes.push(...options.scope);
            if (scopes) _scopes.push(...scopes);
            const url = new URL("https://www.tiktok.com/v2/auth/authorize");
            url.searchParams.set("scope", _scopes.join(","));
            url.searchParams.set("response_type", "code");
            url.searchParams.set("client_key", options.clientKey);
            url.searchParams.set("redirect_uri", options.redirectURI || redirectURI);
            url.searchParams.set("state", state);
            if (additionalParams) for (const [key, value] of Object.entries(additionalParams)){
                if (__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$create$2d$authorization$2d$url$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["RESERVED_AUTHORIZATION_PARAMS_SET"].has(key)) continue;
                if (key === "client_key") continue;
                url.searchParams.set(key, value);
            }
            return url;
        },
        validateAuthorizationCode: async ({ code, codeVerifier, redirectURI })=>{
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$validate$2d$authorization$2d$code$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["validateAuthorizationCode"])({
                code,
                codeVerifier,
                redirectURI: options.redirectURI || redirectURI,
                options: {},
                tokenEndpoint,
                tokenEndpointAuth
            });
        },
        refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken)=>{
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$refresh$2d$access$2d$token$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["refreshAccessToken"])({
                refreshToken,
                options: {},
                tokenEndpoint,
                tokenEndpointAuth
            });
        },
        async getUserInfo (token) {
            if (options.getUserInfo) return options.getUserInfo(token);
            const { data: profile, error } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$fetch$2f$fetch$2f$dist$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["betterFetch"])(`https://open.tiktokapis.com/v2/user/info/?fields=${[
                "open_id",
                "avatar_large_url",
                "display_name",
                "username"
            ].join(",")}`, {
                headers: {
                    authorization: `Bearer ${token.accessToken}`
                }
            });
            if (error) return null;
            return {
                user: {
                    email: profile.data.user.email || (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$email$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createPlaceholderEmail"])({
                        identifier: profile.data.user.open_id,
                        namespace: "tiktok"
                    }),
                    name: profile.data.user.display_name || profile.data.user.username || "",
                    image: profile.data.user.avatar_large_url,
                    emailVerified: false
                },
                data: profile
            };
        },
        options
    };
};
;
}),
"[project]/examples/nextjs/node_modules/@better-auth/core/dist/social-providers/twitch.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "twitch",
    ()=>twitch
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$logger$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/env/logger.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$create$2d$authorization$2d$url$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/create-authorization-url.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$refresh$2d$access$2d$token$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/refresh-access-token.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$validate$2d$authorization$2d$code$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/validate-authorization-code.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$decode_jwt$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/jose/dist/webapi/util/decode_jwt.js [app-rsc] (ecmascript)");
;
;
;
;
;
//#region src/social-providers/twitch.ts
const twitch = (options)=>{
    const tokenEndpoint = "https://id.twitch.tv/oauth2/token";
    return {
        id: "twitch",
        name: "Twitch",
        accountSubject: ({ profile })=>profile.sub,
        createAuthorizationURL ({ state, scopes, redirectURI, additionalParams }) {
            const _scopes = options.disableDefaultScope ? [] : [
                "user:read:email",
                "openid"
            ];
            if (options.scope) _scopes.push(...options.scope);
            if (scopes) _scopes.push(...scopes);
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$create$2d$authorization$2d$url$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createAuthorizationURL"])({
                id: "twitch",
                redirectURI,
                options,
                authorizationEndpoint: "https://id.twitch.tv/oauth2/authorize",
                scopes: _scopes,
                state,
                claims: options.claims || [
                    "email",
                    "email_verified",
                    "preferred_username",
                    "picture"
                ],
                additionalParams
            });
        },
        validateAuthorizationCode: async ({ code, redirectURI })=>{
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$validate$2d$authorization$2d$code$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["validateAuthorizationCode"])({
                code,
                redirectURI,
                options,
                tokenEndpoint
            });
        },
        refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken)=>{
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$refresh$2d$access$2d$token$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["refreshAccessToken"])({
                refreshToken,
                options: {
                    clientId: options.clientId,
                    clientKey: options.clientKey,
                    clientSecret: options.clientSecret
                },
                tokenEndpoint
            });
        },
        async getUserInfo (token) {
            if (options.getUserInfo) return options.getUserInfo(token);
            const idToken = token.idToken;
            if (!idToken) {
                __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$logger$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["logger"].error("No idToken found in token");
                return null;
            }
            const profile = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$decode_jwt$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["decodeJwt"])(idToken);
            const userMap = await options.mapProfileToUser?.(profile);
            return {
                user: {
                    name: profile.preferred_username,
                    email: profile.email,
                    image: profile.picture,
                    emailVerified: profile.email_verified,
                    ...userMap
                },
                data: profile
            };
        },
        options
    };
};
;
}),
"[project]/examples/nextjs/node_modules/@better-auth/core/dist/social-providers/twitter.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "twitter",
    ()=>twitter
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$create$2d$authorization$2d$url$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/create-authorization-url.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$refresh$2d$access$2d$token$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/refresh-access-token.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$validate$2d$authorization$2d$code$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/validate-authorization-code.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$email$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/utils/email.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$fetch$2f$fetch$2f$dist$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-fetch/fetch/dist/index.js [app-rsc] (ecmascript)");
;
;
;
;
;
//#region src/social-providers/twitter.ts
const twitter = (options)=>{
    const tokenEndpoint = "https://api.x.com/2/oauth2/token";
    return {
        id: "twitter",
        name: "Twitter",
        accountSubject: ({ profile })=>profile.data.id,
        createAuthorizationURL (data) {
            const _scopes = options.disableDefaultScope ? [] : [
                "users.read",
                "tweet.read",
                "offline.access",
                "users.email"
            ];
            if (options.scope) _scopes.push(...options.scope);
            if (data.scopes) _scopes.push(...data.scopes);
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$create$2d$authorization$2d$url$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createAuthorizationURL"])({
                id: "twitter",
                options,
                authorizationEndpoint: "https://x.com/i/oauth2/authorize",
                scopes: _scopes,
                state: data.state,
                codeVerifier: data.codeVerifier,
                redirectURI: data.redirectURI,
                additionalParams: data.additionalParams
            });
        },
        validateAuthorizationCode: async ({ code, codeVerifier, redirectURI })=>{
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$validate$2d$authorization$2d$code$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["validateAuthorizationCode"])({
                code,
                codeVerifier,
                authentication: "basic",
                redirectURI,
                options,
                tokenEndpoint
            });
        },
        refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken)=>{
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$refresh$2d$access$2d$token$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["refreshAccessToken"])({
                refreshToken,
                options: {
                    clientId: options.clientId,
                    clientKey: options.clientKey,
                    clientSecret: options.clientSecret
                },
                authentication: "basic",
                tokenEndpoint
            });
        },
        async getUserInfo (token) {
            if (options.getUserInfo) return options.getUserInfo(token);
            const { data: profile, error: profileError } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$fetch$2f$fetch$2f$dist$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["betterFetch"])("https://api.x.com/2/users/me?user.fields=profile_image_url", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token.accessToken}`
                }
            });
            if (profileError) return null;
            const { data: emailData, error: emailError } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$fetch$2f$fetch$2f$dist$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["betterFetch"])("https://api.x.com/2/users/me?user.fields=confirmed_email", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token.accessToken}`
                }
            });
            let emailVerified = false;
            if (!emailError && emailData?.data?.confirmed_email) {
                profile.data.email = emailData.data.confirmed_email;
                emailVerified = true;
            }
            const userMap = await options.mapProfileToUser?.(profile);
            return {
                user: {
                    name: profile.data.name,
                    email: profile.data.email || (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$email$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createPlaceholderEmail"])({
                        identifier: profile.data.id,
                        namespace: "twitter"
                    }),
                    image: profile.data.profile_image_url,
                    emailVerified,
                    ...userMap
                },
                data: profile
            };
        },
        options
    };
};
;
}),
"[project]/examples/nextjs/node_modules/@better-auth/core/dist/social-providers/vercel.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "vercel",
    ()=>vercel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/error/index.mjs [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$create$2d$authorization$2d$url$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/create-authorization-url.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$validate$2d$authorization$2d$code$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/validate-authorization-code.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$fetch$2f$fetch$2f$dist$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-fetch/fetch/dist/index.js [app-rsc] (ecmascript)");
;
;
;
;
//#region src/social-providers/vercel.ts
const vercel = (options)=>{
    return {
        id: "vercel",
        name: "Vercel",
        accountSubject: ({ profile })=>profile.sub,
        createAuthorizationURL ({ state, scopes, codeVerifier, redirectURI, additionalParams }) {
            if (!codeVerifier) throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["BetterAuthError"]("codeVerifier is required for Vercel");
            let _scopes = void 0;
            if (options.scope !== void 0 || scopes !== void 0) {
                _scopes = [];
                if (options.scope) _scopes.push(...options.scope);
                if (scopes) _scopes.push(...scopes);
            }
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$create$2d$authorization$2d$url$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createAuthorizationURL"])({
                id: "vercel",
                options,
                authorizationEndpoint: "https://vercel.com/oauth/authorize",
                scopes: _scopes,
                state,
                codeVerifier,
                redirectURI,
                additionalParams
            });
        },
        validateAuthorizationCode: async ({ code, codeVerifier, redirectURI })=>{
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$validate$2d$authorization$2d$code$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["validateAuthorizationCode"])({
                code,
                codeVerifier,
                redirectURI,
                options,
                tokenEndpoint: "https://api.vercel.com/login/oauth/token"
            });
        },
        async getUserInfo (token) {
            if (options.getUserInfo) return options.getUserInfo(token);
            const { data: profile, error } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$fetch$2f$fetch$2f$dist$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["betterFetch"])("https://api.vercel.com/login/oauth/userinfo", {
                headers: {
                    Authorization: `Bearer ${token.accessToken}`
                }
            });
            if (error || !profile) return null;
            const userMap = await options.mapProfileToUser?.(profile);
            return {
                user: {
                    name: profile.name ?? profile.preferred_username ?? "",
                    email: profile.email,
                    image: profile.picture,
                    emailVerified: profile.email_verified ?? false,
                    ...userMap
                },
                data: profile
            };
        },
        options
    };
};
;
}),
"[project]/examples/nextjs/node_modules/@better-auth/core/dist/social-providers/vk.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "vk",
    ()=>vk
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$create$2d$authorization$2d$url$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/create-authorization-url.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$refresh$2d$access$2d$token$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/refresh-access-token.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$validate$2d$authorization$2d$code$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/validate-authorization-code.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$fetch$2f$fetch$2f$dist$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-fetch/fetch/dist/index.js [app-rsc] (ecmascript)");
;
;
;
;
//#region src/social-providers/vk.ts
const vk = (options)=>{
    const tokenEndpoint = "https://id.vk.com/oauth2/auth";
    return {
        id: "vk",
        name: "VK",
        accountSubject: ({ profile })=>profile.user.user_id,
        async createAuthorizationURL ({ state, scopes, codeVerifier, redirectURI, additionalParams }) {
            const _scopes = options.disableDefaultScope ? [] : [
                "email",
                "phone"
            ];
            if (options.scope) _scopes.push(...options.scope);
            if (scopes) _scopes.push(...scopes);
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$create$2d$authorization$2d$url$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createAuthorizationURL"])({
                id: "vk",
                options,
                authorizationEndpoint: "https://id.vk.com/authorize",
                scopes: _scopes,
                state,
                redirectURI,
                codeVerifier,
                additionalParams
            });
        },
        validateAuthorizationCode: async ({ code, codeVerifier, redirectURI, deviceId })=>{
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$validate$2d$authorization$2d$code$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["validateAuthorizationCode"])({
                code,
                codeVerifier,
                redirectURI: options.redirectURI || redirectURI,
                options,
                deviceId,
                tokenEndpoint
            });
        },
        refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken)=>{
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$refresh$2d$access$2d$token$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["refreshAccessToken"])({
                refreshToken,
                options: {
                    clientId: options.clientId,
                    clientKey: options.clientKey,
                    clientSecret: options.clientSecret
                },
                tokenEndpoint
            });
        },
        async getUserInfo (data) {
            if (options.getUserInfo) return options.getUserInfo(data);
            if (!data.accessToken) return null;
            const { data: profile, error } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$fetch$2f$fetch$2f$dist$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["betterFetch"])("https://id.vk.com/oauth2/user_info", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: new URLSearchParams({
                    access_token: data.accessToken,
                    client_id: options.clientId
                }).toString()
            });
            if (error) return null;
            const userMap = await options.mapProfileToUser?.(profile);
            if (!profile.user.email && !userMap?.email) return null;
            return {
                user: {
                    first_name: profile.user.first_name,
                    last_name: profile.user.last_name,
                    email: profile.user.email,
                    image: profile.user.avatar,
                    emailVerified: false,
                    birthday: profile.user.birthday,
                    sex: profile.user.sex,
                    name: `${profile.user.first_name} ${profile.user.last_name}`,
                    ...userMap
                },
                data: profile
            };
        },
        options
    };
};
;
}),
"[project]/examples/nextjs/node_modules/@better-auth/core/dist/social-providers/wechat.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "wechat",
    ()=>wechat
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$create$2d$authorization$2d$url$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/create-authorization-url.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$email$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/utils/email.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$fetch$2f$fetch$2f$dist$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-fetch/fetch/dist/index.js [app-rsc] (ecmascript)");
;
;
;
//#region src/social-providers/wechat.ts
const wechat = (options)=>{
    return {
        id: "wechat",
        name: "WeChat",
        accountSubject: ({ profile })=>profile.unionid || profile.openid,
        createAuthorizationURL ({ state, scopes, redirectURI, additionalParams }) {
            const _scopes = options.disableDefaultScope ? [] : [
                "snsapi_login"
            ];
            options.scope && _scopes.push(...options.scope);
            scopes && _scopes.push(...scopes);
            const url = new URL("https://open.weixin.qq.com/connect/qrconnect");
            url.searchParams.set("scope", _scopes.join(","));
            url.searchParams.set("response_type", "code");
            url.searchParams.set("appid", options.clientId);
            url.searchParams.set("redirect_uri", options.redirectURI || redirectURI);
            url.searchParams.set("state", state);
            url.searchParams.set("lang", options.lang || "cn");
            if (additionalParams) for (const [key, value] of Object.entries(additionalParams)){
                if (__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$create$2d$authorization$2d$url$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["RESERVED_AUTHORIZATION_PARAMS_SET"].has(key)) continue;
                if (key === "appid") continue;
                url.searchParams.set(key, value);
            }
            url.hash = "wechat_redirect";
            return url;
        },
        validateAuthorizationCode: async ({ code })=>{
            const { data: tokenData, error } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$fetch$2f$fetch$2f$dist$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["betterFetch"])("https://api.weixin.qq.com/sns/oauth2/access_token?" + new URLSearchParams({
                appid: options.clientId,
                secret: options.clientSecret,
                code,
                grant_type: "authorization_code"
            }).toString(), {
                method: "GET"
            });
            if (error || !tokenData || tokenData.errcode) throw new Error(`Failed to validate authorization code: ${tokenData?.errmsg || error?.message || "Unknown error"}`);
            return {
                tokenType: "Bearer",
                accessToken: tokenData.access_token,
                refreshToken: tokenData.refresh_token,
                accessTokenExpiresAt: new Date(Date.now() + tokenData.expires_in * 1e3),
                scopes: tokenData.scope.split(","),
                openid: tokenData.openid,
                unionid: tokenData.unionid
            };
        },
        refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken)=>{
            const { data: tokenData, error } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$fetch$2f$fetch$2f$dist$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["betterFetch"])("https://api.weixin.qq.com/sns/oauth2/refresh_token?" + new URLSearchParams({
                appid: options.clientId,
                grant_type: "refresh_token",
                refresh_token: refreshToken
            }).toString(), {
                method: "GET"
            });
            if (error || !tokenData || tokenData.errcode) throw new Error(`Failed to refresh access token: ${tokenData?.errmsg || error?.message || "Unknown error"}`);
            return {
                tokenType: "Bearer",
                accessToken: tokenData.access_token,
                refreshToken: tokenData.refresh_token,
                accessTokenExpiresAt: new Date(Date.now() + tokenData.expires_in * 1e3),
                scopes: tokenData.scope.split(",")
            };
        },
        async getUserInfo (token) {
            if (options.getUserInfo) return options.getUserInfo(token);
            const openid = token.openid;
            if (!openid) return null;
            const { data: profile, error } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$fetch$2f$fetch$2f$dist$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["betterFetch"])("https://api.weixin.qq.com/sns/userinfo?" + new URLSearchParams({
                access_token: token.accessToken || "",
                openid,
                lang: "zh_CN"
            }).toString(), {
                method: "GET"
            });
            if (error || !profile || profile.errcode) return null;
            const userMap = await options.mapProfileToUser?.(profile);
            const userId = profile.unionid || profile.openid || openid;
            return {
                user: {
                    name: profile.nickname,
                    email: profile.email || (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$email$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createPlaceholderEmail"])({
                        identifier: userId,
                        namespace: "wechat"
                    }),
                    image: profile.headimgurl,
                    emailVerified: false,
                    ...userMap
                },
                data: profile
            };
        },
        options
    };
};
;
}),
"[project]/examples/nextjs/node_modules/@better-auth/core/dist/social-providers/zoom.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "zoom",
    ()=>zoom
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$create$2d$authorization$2d$url$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/create-authorization-url.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$refresh$2d$access$2d$token$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/refresh-access-token.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$validate$2d$authorization$2d$code$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/validate-authorization-code.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$fetch$2f$fetch$2f$dist$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-fetch/fetch/dist/index.js [app-rsc] (ecmascript)");
;
;
;
;
//#region src/social-providers/zoom.ts
const zoom = (userOptions)=>{
    const options = {
        pkce: true,
        ...userOptions
    };
    return {
        id: "zoom",
        name: "Zoom",
        accountSubject: ({ profile })=>profile.id,
        createAuthorizationURL: async ({ state, redirectURI, codeVerifier, additionalParams })=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$create$2d$authorization$2d$url$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createAuthorizationURL"])({
                id: "zoom",
                options,
                authorizationEndpoint: "https://zoom.us/oauth/authorize",
                state,
                redirectURI,
                codeVerifier: options.pkce ? codeVerifier : void 0,
                additionalParams
            }),
        validateAuthorizationCode: async ({ code, redirectURI, codeVerifier })=>{
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$validate$2d$authorization$2d$code$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["validateAuthorizationCode"])({
                code,
                redirectURI: options.redirectURI || redirectURI,
                codeVerifier,
                options,
                tokenEndpoint: "https://zoom.us/oauth/token",
                authentication: "post"
            });
        },
        refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$refresh$2d$access$2d$token$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["refreshAccessToken"])({
                refreshToken,
                options: {
                    clientId: options.clientId,
                    clientKey: options.clientKey,
                    clientSecret: options.clientSecret
                },
                tokenEndpoint: "https://zoom.us/oauth/token"
            }),
        async getUserInfo (token) {
            if (options.getUserInfo) return options.getUserInfo(token);
            const { data: profile, error } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$fetch$2f$fetch$2f$dist$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["betterFetch"])("https://api.zoom.us/v2/users/me", {
                headers: {
                    authorization: `Bearer ${token.accessToken}`
                }
            });
            if (error) return null;
            const userMap = await options.mapProfileToUser?.(profile);
            return {
                user: {
                    name: profile.display_name,
                    image: profile.pic_url,
                    email: profile.email,
                    emailVerified: Boolean(profile.verified),
                    ...userMap
                },
                data: {
                    ...profile
                }
            };
        }
    };
};
;
}),
"[project]/examples/nextjs/node_modules/@better-auth/core/dist/utils/db.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "filterOutputFields",
    ()=>filterOutputFields
]);
//#region src/utils/db.ts
/**
* Filters output data by removing fields with the `returned: false` attribute.
* This ensures sensitive fields are not exposed in API responses.
*/ function filterOutputFields(data, additionalFields) {
    if (!data || !additionalFields) return data;
    const returnFiltered = Object.entries(additionalFields).filter(([, { returned }])=>returned === false).map(([key])=>key);
    return Object.entries(structuredClone(data)).filter(([key])=>!returnFiltered.includes(key)).reduce((acc, [key, value])=>({
            ...acc,
            [key]: value
        }), {});
}
;
}),
"[project]/examples/nextjs/node_modules/@better-auth/core/dist/utils/deprecate.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "deprecate",
    ()=>deprecate
]);
//#region src/utils/deprecate.ts
/**
* Wraps a function to log a deprecation warning at once.
*/ function deprecate(fn, message, logger) {
    let warned = false;
    return function(...args) {
        if (!warned) {
            (logger?.warn ?? console.warn)(`[Deprecation] ${message}`);
            warned = true;
        }
        return fn.apply(this, args);
    };
}
;
}),
"[project]/examples/nextjs/node_modules/@better-auth/core/dist/utils/email.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createPlaceholderEmail",
    ()=>createPlaceholderEmail
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/zod/v4/classic/schemas.js [app-rsc] (ecmascript)");
;
//#region src/utils/email.ts
/**
* @see https://www.rfc-editor.org/rfc/rfc6761.html#section-6.4
*/ const PLACEHOLDER_EMAIL_DOMAIN = "placeholder.invalid";
/**
* Creates a stable, non-routable email address for an account without an email.
*
* @throws TypeError if the generated email is invalid.
*/ function createPlaceholderEmail({ identifier, namespace }) {
    const result = __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["email"]().safeParse(`${identifier}@${namespace}.${PLACEHOLDER_EMAIL_DOMAIN}`);
    if (!result.success) throw new TypeError("Invalid placeholder email");
    return result.data;
}
;
}),
"[project]/examples/nextjs/node_modules/@better-auth/core/dist/utils/error-codes.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "defineErrorCodes",
    ()=>defineErrorCodes
]);
//#region src/utils/error-codes.ts
function defineErrorCodes(codes) {
    return Object.fromEntries(Object.entries(codes).map(([key, value])=>[
            key,
            {
                code: key,
                message: value,
                toString: ()=>key
            }
        ]));
}
;
}),
"[project]/examples/nextjs/node_modules/@better-auth/core/dist/utils/host.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "classifyHost",
    ()=>classifyHost,
    "isLoopbackHost",
    ()=>isLoopbackHost,
    "isLoopbackIP",
    ()=>isLoopbackIP,
    "isPublicRoutableHost",
    ()=>isPublicRoutableHost
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$ip$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/utils/ip.mjs [app-rsc] (ecmascript)");
;
//#region src/utils/host.ts
/**
* Cloud provider instance metadata service FQDNs. These resolve to link-local
* IPs (usually `169.254.169.254`) inside their respective clouds and are
* prime SSRF targets.
*
* The IPs themselves are already caught by the `linkLocal` kind; this set
* only exists for the FQDN form that a naive server-side fetch might resolve
* via its own resolver.
*/ const CLOUD_METADATA_HOSTS = new Set([
    "metadata.google.internal",
    "metadata.goog",
    "metadata",
    "instance-data",
    "instance-data.ec2.internal"
]);
/** Strip `[...]` if the entire input is bracketed (IPv6 literal form). */ function stripBrackets(host) {
    if (host.length >= 2 && host.startsWith("[") && host.endsWith("]")) return host.slice(1, -1);
    return host;
}
/**
* Strip trailing `:port` from host-with-port strings.
*
* - Bracketed IPv6 with port: `[::1]:8080` → `[::1]`
* - IPv4/FQDN with port: `127.0.0.1:3000` / `example.com:443` → base form
* - Bare IPv6: `::1` / `fe80::1` → unchanged (multiple colons means no port)
*/ function stripPort(host) {
    if (host.startsWith("[")) {
        const end = host.indexOf("]");
        if (end === -1) return host;
        return host.slice(0, end + 1);
    }
    const firstColon = host.indexOf(":");
    if (firstColon === -1) return host;
    if (host.indexOf(":", firstColon + 1) !== -1) return host;
    return host.slice(0, firstColon);
}
/** Strip IPv6 zone identifier: `fe80::1%eth0` → `fe80::1`. */ function stripZoneId(host) {
    const zone = host.indexOf("%");
    if (zone === -1) return host;
    return host.slice(0, zone);
}
/**
* Strip trailing dots (RFC 1034 absolute DNS form): `localhost.` → `localhost`.
* Without this, `metadata.google.internal.` would fall through to `public` and
* bypass the cloud-metadata / `.localhost` checks, since WHATWG URL parsing
* preserves the trailing dot in `url.hostname`.
*/ function stripTrailingDot(host) {
    return host.replace(/\.+$/, "");
}
/** Fast dotted-decimal shape check. Does NOT validate octet bounds. */ function looksLikeIPv4(host) {
    return /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(host);
}
/** Pack a validated dotted-decimal IPv4 into a 32-bit unsigned integer. */ function ipv4ToUint32(ip) {
    const parts = ip.split(".");
    return (Number(parts[0]) << 24 | Number(parts[1]) << 16 | Number(parts[2]) << 8 | Number(parts[3])) >>> 0;
}
/** Check whether a 32-bit value matches `prefix/length` (both unsigned). */ function inIPv4Range(value, prefix, length) {
    if (length === 0) return true;
    const mask = length === 32 ? 4294967295 : -1 << 32 - length >>> 0;
    return (value & mask) === (prefix & mask);
}
function classifyIPv4(ip) {
    if (ip === "0.0.0.0") return "unspecified";
    if (ip === "255.255.255.255") return "broadcast";
    const n = ipv4ToUint32(ip);
    if (inIPv4Range(n, ipv4ToUint32("127.0.0.0"), 8)) return "loopback";
    if (inIPv4Range(n, ipv4ToUint32("10.0.0.0"), 8)) return "private";
    if (inIPv4Range(n, ipv4ToUint32("172.16.0.0"), 12)) return "private";
    if (inIPv4Range(n, ipv4ToUint32("192.168.0.0"), 16)) return "private";
    if (inIPv4Range(n, ipv4ToUint32("169.254.0.0"), 16)) return "linkLocal";
    if (inIPv4Range(n, ipv4ToUint32("100.64.0.0"), 10)) return "sharedAddressSpace";
    if (inIPv4Range(n, ipv4ToUint32("192.0.2.0"), 24)) return "documentation";
    if (inIPv4Range(n, ipv4ToUint32("198.51.100.0"), 24)) return "documentation";
    if (inIPv4Range(n, ipv4ToUint32("203.0.113.0"), 24)) return "documentation";
    if (inIPv4Range(n, ipv4ToUint32("198.18.0.0"), 15)) return "benchmarking";
    if (inIPv4Range(n, ipv4ToUint32("224.0.0.0"), 4)) return "multicast";
    if (inIPv4Range(n, ipv4ToUint32("0.0.0.0"), 8)) return "reserved";
    if (inIPv4Range(n, ipv4ToUint32("192.0.0.0"), 24)) return "reserved";
    if (inIPv4Range(n, ipv4ToUint32("192.88.99.0"), 24)) return "reserved";
    if (inIPv4Range(n, ipv4ToUint32("240.0.0.0"), 4)) return "reserved";
    return "public";
}
/**
* Extract an IPv4 address embedded in an expanded IPv6 literal.
*
* Used to recurse into tunnel/translation forms (6to4, NAT64, Teredo) so a
* private destination cannot be smuggled behind a syntactically-public IPv6
* literal. `startGroup` is the index of the first of two 16-bit groups in the
* expanded form (`0000:0000:...`). With `xor: true`, the 32-bit value is XORed
* with `0xffffffff` before decoding (Teredo obfuscates the client IPv4 this
* way).
*/ function extractEmbeddedIPv4(expanded, startGroup, options = {}) {
    const offset = startGroup * 5;
    const g1 = Number.parseInt(expanded.slice(offset, offset + 4), 16);
    const g2 = Number.parseInt(expanded.slice(offset + 5, offset + 9), 16);
    if (!Number.isFinite(g1) || !Number.isFinite(g2)) return null;
    let combined = (g1 << 16 | g2) >>> 0;
    if (options.xor) combined = (combined ^ 4294967295) >>> 0;
    return `${combined >>> 24 & 255}.${combined >>> 16 & 255}.${combined >>> 8 & 255}.${combined & 255}`;
}
/**
* Classify an expanded, full-form, lowercase IPv6 address (no IPv4-mapped
* input — those are unmapped to IPv4 before reaching here).
*
* 6to4 (`2002::/16`), NAT64 (`64:ff9b::/96`) and Teredo (`2001:0000::/32`)
* embed an IPv4 that can route to private/loopback space. If the embedded
* IPv4 classifies as non-`public`, return `reserved` — blocks SSRF without
* advertising the address as a loopback literal for RFC 8252 §7.3 matching.
*/ function classifyIPv6(expanded) {
    if (expanded === "0000:0000:0000:0000:0000:0000:0000:0000") return "unspecified";
    if (expanded === "0000:0000:0000:0000:0000:0000:0000:0001") return "loopback";
    const firstByte = Number.parseInt(expanded.slice(0, 2), 16);
    const secondByte = Number.parseInt(expanded.slice(2, 4), 16);
    if (firstByte === 255) return "multicast";
    if (firstByte === 254 && (secondByte & 192) === 128) return "linkLocal";
    if (firstByte === 254 && (secondByte & 192) === 192) return "reserved";
    if ((firstByte & 254) === 252) return "private";
    if (expanded.startsWith("2001:0db8:")) return "documentation";
    if (expanded.startsWith("2001:0002:0000:")) return "benchmarking";
    if (expanded.startsWith("2002:")) {
        const embedded = extractEmbeddedIPv4(expanded, 1);
        if (embedded && classifyIPv4(embedded) !== "public") return "reserved";
        return "public";
    }
    if (expanded.startsWith("0064:ff9b:0000:0000:0000:0000:")) {
        const embedded = extractEmbeddedIPv4(expanded, 6);
        if (embedded && classifyIPv4(embedded) !== "public") return "reserved";
        return "reserved";
    }
    if (expanded.startsWith("0064:ff9b:0001:")) return "reserved";
    if (expanded.startsWith("2001:0000:")) {
        const embedded = extractEmbeddedIPv4(expanded, 6, {
            xor: true
        });
        if (embedded && classifyIPv4(embedded) !== "public") return "reserved";
        return "reserved";
    }
    if (expanded.startsWith("0100:0000:0000:0000:")) return "reserved";
    if (expanded.startsWith("3fff:0")) return "documentation";
    if (expanded.startsWith("5f00:")) return "reserved";
    if (expanded.startsWith("0000:0000:0000:0000:0000:0000:")) return "reserved";
    return "public";
}
/**
* Classify a host string according to RFC 6890 / RFC 6761.
*
* Accepts inputs in any of these shapes and normalizes before classifying:
*
*   - Bare IPv4: `127.0.0.1`
*   - Bare IPv6: `::1`, `fe80::1%eth0`
*   - Bracketed IPv6: `[::1]`
*   - Host with port: `localhost:3000`, `127.0.0.1:443`, `[::1]:8080`
*   - FQDN: `example.com`, `tenant.localhost`
*   - IPv4-mapped IPv6: `::ffff:192.0.2.1` (reported as `literal: "ipv4"`)
*
* Invalid or non-resolvable FQDNs are returned as `{ kind: "public", literal: "fqdn" }`
* — this function never throws. Callers that need structural validation must
* combine this with a URL/hostname validator upstream.
*
* @example
* classifyHost("127.0.0.1")
* // { kind: "loopback", literal: "ipv4", canonical: "127.0.0.1" }
*
* @example
* classifyHost("[::1]:8080")
* // { kind: "loopback", literal: "ipv6", canonical: "0000:0000:...:0001" }
*
* @example
* classifyHost("::ffff:192.0.2.1")
* // { kind: "documentation", literal: "ipv4", canonical: "192.0.2.1" }
*
* @example
* classifyHost("tenant-a.localhost")
* // { kind: "localhost", literal: "fqdn", canonical: "tenant-a.localhost" }
*/ function classifyHost(host) {
    const lowered = stripTrailingDot(stripZoneId(stripBrackets(stripPort(host.trim())))).toLowerCase();
    if (lowered === "") return {
        kind: "reserved",
        literal: "fqdn",
        canonical: ""
    };
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$ip$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isValidIP"])(lowered)) {
        if (lowered === "localhost" || lowered.endsWith(".localhost")) return {
            kind: "localhost",
            literal: "fqdn",
            canonical: lowered
        };
        if (CLOUD_METADATA_HOSTS.has(lowered)) return {
            kind: "cloudMetadata",
            literal: "fqdn",
            canonical: lowered
        };
        return {
            kind: "public",
            literal: "fqdn",
            canonical: lowered
        };
    }
    if (looksLikeIPv4(lowered)) return {
        kind: classifyIPv4(lowered),
        literal: "ipv4",
        canonical: lowered
    };
    const canonical = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$ip$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["normalizeIP"])(lowered, {
        ipv6Subnet: 128
    });
    if (looksLikeIPv4(canonical)) return {
        kind: classifyIPv4(canonical),
        literal: "ipv4",
        canonical
    };
    return {
        kind: classifyIPv6(canonical),
        literal: "ipv6",
        canonical
    };
}
/**
* Strict loopback-IP-literal check per RFC 8252 §7.3.
*
* Returns true ONLY for IPv4 `127.0.0.0/8` or IPv6 `::1`. The DNS name
* `localhost` returns false — RFC 8252 §8.3 explicitly recommends against
* relying on name resolution for loopback redirect URIs.
*
* Use this for OAuth redirect URI matching.
*
* @example
* isLoopbackIP("127.0.0.1")     // true
* isLoopbackIP("::1")           // true
* isLoopbackIP("[::1]:8080")    // true
* isLoopbackIP("localhost")     // false  (use isLoopbackHost for DNS names)
* isLoopbackIP("0.0.0.0")       // false  (unspecified, not loopback)
*/ function isLoopbackIP(host) {
    return classifyHost(host).kind === "loopback";
}
/**
* Permissive loopback check for developer-ergonomics code paths.
*
* Returns true for IPv4 `127.0.0.0/8`, IPv6 `::1`, the literal name `localhost`,
* and any RFC 6761 `.localhost` subdomain (`tenant.localhost`, `app.localhost`).
*
* Use this for things like: allowing HTTP for dev servers, skipping Secure
* cookie requirements, browser-trust heuristics. Do NOT use this for OAuth
* redirect URI matching — use {@link isLoopbackIP} there.
*
* @example
* isLoopbackHost("localhost")         // true
* isLoopbackHost("tenant.localhost")  // true  (RFC 6761)
* isLoopbackHost("127.0.0.1")         // true
* isLoopbackHost("0.0.0.0")           // false (unspecified, NOT loopback)
*/ function isLoopbackHost(host) {
    const kind = classifyHost(host).kind;
    return kind === "loopback" || kind === "localhost";
}
/**
* First-line SSRF gate: returns true ONLY for hosts that classify as `public`.
*
* Every RFC 6890 special-purpose range (loopback, private, link-local,
* unspecified, documentation, multicast, broadcast, reserved, shared address
* space, benchmarking) and cloud-metadata FQDN returns false.
*
* Use this BEFORE issuing a server-side fetch to a user-supplied URL, e.g.
* OAuth introspection endpoints, webhook targets, or metadata-document
* fetches (CIMD).
*
* Limitations (this is a syntactic check, not a complete SSRF mitigation):
* - No DNS resolution: a public-looking FQDN that resolves to a private IP
*   passes this check. Re-verify the resolved address before connecting, or
*   pin the socket to the resolved IP.
* - No DNS-rebinding defense: attackers can return a public IP on the first
*   lookup and a private IP on the second. Resolve once and reuse the IP.
* - No redirect following: HTTP 3xx responses can redirect to private hosts.
*   Re-run this check on every redirect target, or disable auto-follow.
*
* @example
* isPublicRoutableHost("example.com")            // true
* isPublicRoutableHost("127.0.0.1")              // false (loopback)
* isPublicRoutableHost("169.254.169.254")        // false (linkLocal / AWS IMDS)
* isPublicRoutableHost("metadata.google.internal") // false (cloudMetadata)
* isPublicRoutableHost("10.0.0.1")               // false (private)
* isPublicRoutableHost("::ffff:127.0.0.1")       // false (mapped loopback)
*/ function isPublicRoutableHost(host) {
    return classifyHost(host).kind === "public";
}
;
}),
"[project]/examples/nextjs/node_modules/@better-auth/core/dist/utils/id.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "generateId",
    ()=>generateId
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$random$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/utils/dist/random.mjs [app-rsc] (ecmascript)");
;
//#region src/utils/id.ts
const generateId = (size)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$random$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createRandomStringGenerator"])("a-z", "A-Z", "0-9")(size || 32);
};
;
}),
"[project]/examples/nextjs/node_modules/@better-auth/core/dist/utils/ip.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createRateLimitKey",
    ()=>createRateLimitKey,
    "findInvalidTrustedProxies",
    ()=>findInvalidTrustedProxies,
    "getIP",
    ()=>getIP,
    "getIPFromHeader",
    ()=>getIPFromHeader,
    "isValidIP",
    ()=>isValidIP,
    "normalizeIP",
    ()=>normalizeIP
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$env$2d$impl$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/env/env-impl.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/zod/v4/classic/schemas.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$core$2f$parse$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/zod/v4/core/parse.js [app-rsc] (ecmascript)");
;
;
//#region src/utils/ip.ts
const ipv4Schema = __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ipv4"]();
const ipv6Schema = __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ipv6"]();
/**
* Checks if an IP is valid IPv4 or IPv6
*/ function isValidIP(ip) {
    return isIPv4(ip) || isIPv6(ip);
}
function isIPv4(ip) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$core$2f$parse$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["validate"](ipv4Schema, ip);
}
function isIPv6(ip) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$core$2f$parse$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["validate"](ipv6Schema, ip);
}
/**
* Converts IPv4-mapped IPv6 address to IPv4
* e.g., "::ffff:192.0.2.1" -> "192.0.2.1"
*/ function extractIPv4FromMapped(ipv6) {
    const lower = ipv6.toLowerCase();
    if (lower.startsWith("::ffff:")) {
        const ipv4Part = lower.substring(7);
        if (isIPv4(ipv4Part)) return ipv4Part;
    }
    const parts = ipv6.split(":");
    if (parts.length === 7 && parts[5]?.toLowerCase() === "ffff") {
        const ipv4Part = parts[6];
        if (ipv4Part && isIPv4(ipv4Part)) return ipv4Part;
    }
    if (lower.includes("::ffff:") || lower.includes(":ffff:")) {
        const groups = expandIPv6(ipv6);
        if (groups.length === 8 && groups[0] === "0000" && groups[1] === "0000" && groups[2] === "0000" && groups[3] === "0000" && groups[4] === "0000" && groups[5] === "ffff" && groups[6] && groups[7]) return `${Number.parseInt(groups[6].substring(0, 2), 16)}.${Number.parseInt(groups[6].substring(2, 4), 16)}.${Number.parseInt(groups[7].substring(0, 2), 16)}.${Number.parseInt(groups[7].substring(2, 4), 16)}`;
    }
    return null;
}
/**
* Expands a compressed IPv6 address to full form
* e.g., "2001:db8::1" -> ["2001", "0db8", "0000", "0000", "0000", "0000", "0000", "0001"]
*/ function expandIPv6(ipv6) {
    if (ipv6.includes("::")) {
        const sides = ipv6.split("::");
        const left = sides[0] ? sides[0].split(":") : [];
        const right = sides[1] ? sides[1].split(":") : [];
        const missingGroups = 8 - left.length - right.length;
        const zeros = Array(missingGroups).fill("0000");
        const paddedLeft = left.map((g)=>g.padStart(4, "0"));
        const paddedRight = right.map((g)=>g.padStart(4, "0"));
        return [
            ...paddedLeft,
            ...zeros,
            ...paddedRight
        ];
    }
    return ipv6.split(":").map((g)=>g.padStart(4, "0"));
}
/**
* Normalizes an IPv6 address to canonical form
* e.g., "2001:DB8::1" -> "2001:0db8:0000:0000:0000:0000:0000:0001"
*/ function normalizeIPv6(ipv6, subnetPrefix) {
    const groups = expandIPv6(ipv6);
    if (subnetPrefix !== void 0 && subnetPrefix < 128) {
        let bitsRemaining = Math.max(0, Math.floor(subnetPrefix));
        return groups.map((group)=>{
            if (bitsRemaining <= 0) return "0000";
            if (bitsRemaining >= 16) {
                bitsRemaining -= 16;
                return group;
            }
            const masked = Number.parseInt(group, 16) & (65535 << 16 - bitsRemaining & 65535);
            bitsRemaining = 0;
            return masked.toString(16).padStart(4, "0");
        }).join(":").toLowerCase();
    }
    return groups.join(":").toLowerCase();
}
/**
* Normalizes an IP address (IPv4 or IPv6) for consistent rate limiting.
*
* @param ip - The IP address to normalize
* @param options - Normalization options
* @returns Normalized IP address
*
* @example
* normalizeIP("2001:DB8::1")
* // -> "2001:0db8:0000:0000:0000:0000:0000:0000"
*
* @example
* normalizeIP("::ffff:192.0.2.1")
* // -> "192.0.2.1" (converted to IPv4)
*
* @example
* normalizeIP("2001:db8::1", { ipv6Subnet: 64 })
* // -> "2001:0db8:0000:0000:0000:0000:0000:0000" (subnet /64)
*/ function normalizeIP(ip, options = {}) {
    if (isIPv4(ip)) return ip.toLowerCase();
    if (!isIPv6(ip)) return ip.toLowerCase();
    const ipv4 = extractIPv4FromMapped(ip);
    if (ipv4) return ipv4.toLowerCase();
    return normalizeIPv6(ip, options.ipv6Subnet ?? 64);
}
/**
* Raw bytes of an IP for CIDR comparison. Returns `null` for an invalid IP.
*/ function ipToBytes(ip) {
    if (isIPv4(ip)) return Uint8Array.from(ip.split(".").map((octet)=>Number(octet)));
    if (!isIPv6(ip)) return null;
    const mapped = extractIPv4FromMapped(ip);
    if (mapped) return Uint8Array.from(mapped.split(".").map((octet)=>Number(octet)));
    const groups = expandIPv6(ip);
    const bytes = new Uint8Array(16);
    for(let i = 0; i < 8; i++){
        const group = Number.parseInt(groups[i] ?? "0", 16);
        bytes[i * 2] = group >> 8 & 255;
        bytes[i * 2 + 1] = group & 255;
    }
    return bytes;
}
const CIDR_PREFIX_PATTERN = /^\d+$/;
/**
* Parses an IP or `IP/prefix` string into network bytes and a prefix length.
* The prefix must be digits only and within the address family. `null` if the
* value is not a valid IP or CIDR range, which keeps a malformed entry from
* silently behaving like a non-match.
*/ function parseCIDR(value) {
    const slash = value.lastIndexOf("/");
    const bytes = ipToBytes(slash === -1 ? value : value.slice(0, slash));
    if (!bytes) return null;
    const maxBits = bytes.length * 8;
    if (slash === -1) return {
        bytes,
        prefix: maxBits
    };
    const prefixPart = value.slice(slash + 1);
    if (!CIDR_PREFIX_PATTERN.test(prefixPart)) return null;
    const prefix = Number(prefixPart);
    return prefix <= maxBits ? {
        bytes,
        prefix
    } : null;
}
/**
* Whether `ipBytes` falls inside an already-parsed CIDR network.
*/ function matchesCIDR(ipBytes, net) {
    if (ipBytes.length !== net.bytes.length) return false;
    let bitsRemaining = net.prefix;
    for(let i = 0; i < ipBytes.length && bitsRemaining > 0; i++){
        const take = bitsRemaining >= 8 ? 8 : bitsRemaining;
        const mask = take === 8 ? 255 : 255 << 8 - take & 255;
        if (((ipBytes[i] ?? 0) & mask) !== ((net.bytes[i] ?? 0) & mask)) return false;
        bitsRemaining -= 8;
    }
    return true;
}
/**
* Trusted-proxy entries that are not a valid IP address or CIDR range.
*/ function findInvalidTrustedProxies(entries) {
    return entries.filter((entry)=>parseCIDR(entry) === null);
}
/**
* Resolves the client IP from a forwarded header. The leftmost token is spoofable,
* so with `trustedProxies` the chain is stripped from the right to the first
* untrusted hop. Otherwise only a single-value header is trusted. Returns `null`
* when no trustworthy client IP can be resolved.
*/ function getIPFromHeader(value, options = {}) {
    const forwardedIps = value.split(",").map((ip)=>ip.trim()).filter(Boolean);
    if (forwardedIps.length === 0) return null;
    const trustedProxies = (options.trustedProxies ?? []).map(parseCIDR).filter((proxy)=>{
        return proxy !== null;
    });
    if (trustedProxies.length > 0) {
        for(let i = forwardedIps.length - 1; i >= 0; i--){
            const ip = forwardedIps[i];
            const ipBytes = ip ? ipToBytes(ip) : null;
            if (!ip || !ipBytes) return null;
            if (trustedProxies.some((proxy)=>matchesCIDR(ipBytes, proxy))) continue;
            return normalizeIP(ip, {
                ipv6Subnet: options.ipv6Subnet
            });
        }
        return null;
    }
    if (forwardedIps.length !== 1) return null;
    const selectedIp = forwardedIps[0];
    if (!selectedIp || !isValidIP(selectedIp)) return null;
    return normalizeIP(selectedIp, {
        ipv6Subnet: options.ipv6Subnet
    });
}
const LOCALHOST_IP = "127.0.0.1";
const DEFAULT_IP_HEADERS = [
    "x-forwarded-for"
];
/**
* Resolves the client IP for a request from the configured IP headers.
* Honors `disableIpTracking`, walks `ipAddressHeaders` in order (default
* `x-forwarded-for`), and falls back to localhost in development and test.
* Returns `null` when tracking is disabled or no trustworthy IP can be resolved.
*/ function getIP(req, options) {
    if (options.advanced?.ipAddress?.disableIpTracking) return null;
    const headers = "headers" in req ? req.headers : req;
    const ipHeaders = options.advanced?.ipAddress?.ipAddressHeaders || DEFAULT_IP_HEADERS;
    for (const key of ipHeaders){
        const value = "get" in headers ? headers.get(key) : headers[key];
        if (typeof value === "string") {
            const ip = getIPFromHeader(value, {
                ipv6Subnet: options.advanced?.ipAddress?.ipv6Subnet,
                trustedProxies: options.advanced?.ipAddress?.trustedProxies
            });
            if (ip) return ip;
        }
    }
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$env$2d$impl$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isTest"])() || (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$env$2d$impl$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isDevelopment"])()) return LOCALHOST_IP;
    return null;
}
/**
* Creates a rate limit key from IP and path
* Uses a separator to prevent collision attacks
*
* @param ip - The IP address (should be normalized)
* @param path - The request path
* @returns Rate limit key
*/ function createRateLimitKey(ip, path) {
    return `${ip}|${path}`;
}
;
}),
"[project]/examples/nextjs/node_modules/@better-auth/core/dist/utils/is-api-error.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "isAPIError",
    ()=>isAPIError
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/error/index.mjs [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-call/dist/index.mjs [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$call$2f$dist$2f$error$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-call/dist/error.mjs [app-rsc] (ecmascript)");
;
;
//#region src/utils/is-api-error.ts
function isAPIError(error) {
    return error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$call$2f$dist$2f$error$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["APIError"] || error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"] || error?.name === "APIError";
}
;
}),
"[project]/examples/nextjs/node_modules/@better-auth/core/dist/utils/json.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "safeJSONParse",
    ()=>safeJSONParse
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$logger$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/env/logger.mjs [app-rsc] (ecmascript)");
;
//#region src/utils/json.ts
const iso8601Regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/;
function reviveDate(value) {
    if (typeof value === "string" && iso8601Regex.test(value)) {
        const date = new Date(value);
        if (!isNaN(date.getTime())) return date;
    }
    return value;
}
/**
* Recursively walk a pre-parsed object and convert ISO 8601 date strings
* to Date instances. This handles the case where a Redis client (or similar)
* returns already-parsed JSON objects whose date fields are still strings.
*/ function reviveDates(value) {
    if (value === null || value === void 0) return value;
    if (typeof value === "string") return reviveDate(value);
    if (value instanceof Date) return value;
    if (Array.isArray(value)) return value.map(reviveDates);
    if (typeof value === "object") {
        const result = {};
        for (const key of Object.keys(value))result[key] = reviveDates(value[key]);
        return result;
    }
    return value;
}
function safeJSONParse(data) {
    try {
        if (typeof data !== "string") {
            if (data === null || data === void 0) return null;
            return reviveDates(data);
        }
        return JSON.parse(data, (_, value)=>reviveDate(value));
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$logger$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["logger"].error("Error parsing JSON", {
            error: e
        });
        return null;
    }
}
;
}),
"[project]/examples/nextjs/node_modules/@better-auth/core/dist/utils/string.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "capitalizeFirstLetter",
    ()=>capitalizeFirstLetter,
    "toCamelCase",
    ()=>toCamelCase,
    "toKebabCase",
    ()=>toKebabCase,
    "toPascalCase",
    ()=>toPascalCase,
    "toSnakeCase",
    ()=>toSnakeCase
]);
//#region src/utils/string.ts
function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
const WORD_PATTERN = /[\p{Ll}\d]+|\p{Lu}+(?!\p{Ll})|\p{Lu}[\p{Ll}\d]+|\p{Lo}+/gu;
const APOSTROPHE_PATTERN = /['\u2019]/g;
function splitWords(input) {
    return input.replace(APOSTROPHE_PATTERN, "").match(WORD_PATTERN) ?? [];
}
function toSnakeCase(input) {
    return splitWords(input).map((word)=>word.toLowerCase()).join("_");
}
function toKebabCase(input) {
    return splitWords(input).map((word)=>word.toLowerCase()).join("-");
}
function toCamelCase(input) {
    return splitWords(input).reduce((acc, word, i)=>{
        return acc + (i === 0 ? word.toLowerCase() : `${word[0].toUpperCase()}${word.slice(1)}`);
    }, "");
}
function toPascalCase(input) {
    return splitWords(input).map((word)=>`${word[0].toUpperCase()}${word.slice(1).toLowerCase()}`).join("");
}
;
}),
"[project]/examples/nextjs/node_modules/@better-auth/core/dist/utils/url.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DANGEROUS_URL_SCHEMES",
    ()=>DANGEROUS_URL_SCHEMES,
    "appendQueryParams",
    ()=>appendQueryParams,
    "isSafeUrlScheme",
    ()=>isSafeUrlScheme,
    "normalizePathname",
    ()=>normalizePathname
]);
//#region src/utils/url.ts
/**
* Normalizes a request pathname by removing the basePath prefix and trailing slashes.
* This is useful for matching paths against configured path lists.
*
* @param requestUrl - The full request URL
* @param basePath - The base path of the auth API (e.g., "/api/auth")
* @returns The normalized path without basePath prefix or trailing slashes,
*          or "/" if URL parsing fails
*
* @example
* normalizePathname("http://localhost:3000/api/auth/sso/saml2/callback/provider1", "/api/auth")
* // Returns: "/sso/saml2/callback/provider1"
*
* normalizePathname("http://localhost:3000/sso/saml2/callback/provider1/", "/")
* // Returns: "/sso/saml2/callback/provider1"
*/ function normalizePathname(requestUrl, basePath) {
    let pathname;
    try {
        pathname = new URL(requestUrl).pathname.replace(/\/+$/, "") || "/";
    } catch  {
        return "/";
    }
    const normalizedBasePath = basePath.replace(/\/+$/, "");
    if (normalizedBasePath === "") return pathname;
    if (pathname === normalizedBasePath) return "/";
    if (pathname.startsWith(normalizedBasePath + "/")) return pathname.slice(normalizedBasePath.length).replace(/\/+$/, "") || "/";
    return pathname;
}
const URL_REFERENCE_ORIGIN = "https://better-auth.invalid";
/**
* Appends query parameters before the fragment of an absolute or root-relative URL.
* Existing query text is retained without parsing it into name-value pairs.
*
* This function only composes URLs. Callers must validate untrusted input.
*
* @throws TypeError if parsing fails or a relative input changes authority.
*/ function appendQueryParams(input, params) {
    const relative = input.startsWith("/");
    if (input.startsWith("//") || input.startsWith("/\\")) throw new TypeError("Expected an absolute or root-relative URL");
    const parsedURL = relative ? new URL(input, URL_REFERENCE_ORIGIN) : new URL(input);
    if (relative && parsedURL.origin !== URL_REFERENCE_ORIGIN) throw new TypeError("Expected an absolute or root-relative URL");
    const query = params.toString();
    if (!query) return input;
    const separator = parsedURL.search.endsWith("&") ? "" : "&";
    parsedURL.search = parsedURL.search ? `${parsedURL.search}${separator}${query}` : query;
    return relative ? parsedURL.href.slice(parsedURL.origin.length) : parsedURL.href;
}
/**
* Schemes that execute or embed code when navigated to or accepted as a
* redirect target. These are never safe as an OAuth `redirect_uri` or as a
* client-side navigation target (`window.location.href`, `location.assign`, ...).
*/ const DANGEROUS_URL_SCHEMES = [
    "javascript:",
    "data:",
    "vbscript:"
];
/**
* Returns `false` only when `value` is an absolute URL using a dangerous scheme
* (`javascript:`, `data:`, `vbscript:`). Relative URLs (e.g. `/dashboard`) and
* safe absolute schemes (`http`, `https`, custom app schemes such as
* `myapp://`) return `true`.
*
* Use this to guard browser navigation sinks and any redirect target that may
* originate from untrusted input. It is intentionally narrow: it blocks code
* execution schemes without rejecting relative paths or mobile deep links.
*/ function isSafeUrlScheme(value) {
    let parsed;
    try {
        parsed = new URL(value);
    } catch  {
        return true;
    }
    return !DANGEROUS_URL_SCHEMES.includes(parsed.protocol);
}
;
}),
];})()

//# sourceMappingURL=1xpz_%40better-auth_core_dist_0-ok_bs2lui2f._.js.map