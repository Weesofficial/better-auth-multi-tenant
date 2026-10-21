(()=>{"use strict";module.exports = [
"[project]/examples/nextjs/node_modules/better-auth/dist/api/dispatch.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "dispatchAuthEndpoint",
    ()=>dispatchAuthEndpoint,
    "getOperationId",
    ()=>getOperationId
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$is$2d$api$2d$error$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/utils/is-api-error.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$url$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/utils/url.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$endpoint$2d$context$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/context/endpoint-context.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$logger$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/env/logger.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/error/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$defu$2f$dist$2f$defu$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/defu/dist/defu.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$instrumentation$2f$attributes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/instrumentation/attributes.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$instrumentation$2f$tracer$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/instrumentation/tracer.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-call/dist/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$call$2f$dist$2f$error$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-call/dist/error.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$call$2f$dist$2f$to$2d$response$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-call/dist/to-response.mjs [app-route] (ecmascript)");
;
;
;
;
;
;
;
;
//#region src/api/dispatch.ts
const defuReplaceArrays = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$defu$2f$dist$2f$defu$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createDefu"])((obj, key, value)=>{
    if (Array.isArray(obj[key]) && Array.isArray(value)) {
        obj[key] = value;
        return true;
    }
});
const hooksSourceWeakMap = /* @__PURE__ */ new WeakMap();
/**
* Resolves the operation id used for spans, preferring an explicit
* `operationId`, then the OpenAPI one, then the caller's `fallback` (the
* `auth.api.*` map key), and finally the route path.
*/ function getOperationId(endpoint, fallback) {
    const opts = endpoint.options;
    return opts?.operationId ?? opts?.metadata?.openapi?.operationId ?? fallback ?? endpoint.path ?? "/:virtual";
}
/**
* Merge a set of response headers onto the dispatch's accumulator, appending
* `set-cookie` (multiple cookies are legal) and replacing everything else.
*/ function mergeResponseHeaders(context, headers) {
    if (!headers) return;
    headers.forEach((value, key)=>{
        if (!context.responseHeaders) context.responseHeaders = new Headers({
            [key]: value
        });
        else if (key.toLowerCase() === "set-cookie") context.responseHeaders.append(key, value);
        else context.responseHeaders.set(key, value);
    });
}
/**
* Combine the two header sources an `APIError` can carry into one set:
* - `kAPIErrorHeaderSymbol`: `ctx.responseHeaders` accumulated via
*   `c.setCookie` / `c.setHeader` before the throw.
* - `e.headers`: explicit headers on the error (e.g. `location` from
*   `c.redirect`).
*
* `c.redirect()` reuses `ctx.responseHeaders` as `e.headers`, so when both
* point at the same object iterating each would duplicate every `set-cookie`;
* the identity check skips that copy. Explicit error headers override
* accumulated ones, while cookies from both accumulate.
*/ function mergeAPIErrorHeaders(error) {
    const ctxHeaders = error[__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$call$2f$dist$2f$error$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["kAPIErrorHeaderSymbol"]];
    const errHeaders = error.headers && error.headers !== ctxHeaders ? new Headers(error.headers) : null;
    if (!ctxHeaders && !errHeaders) return null;
    const headers = new Headers();
    ctxHeaders?.forEach((value, key)=>{
        headers.append(key, value);
    });
    errHeaders?.forEach((value, key)=>{
        if (key.toLowerCase() === "set-cookie") headers.append(key, value);
        else headers.set(key, value);
    });
    return headers;
}
async function runBeforeHooks(context, hooks, endpoint, operationId) {
    const withSpan = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$instrumentation$2f$tracer$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createWithSpan"])(context.context.options);
    let modifiedContext = {};
    for (const hook of hooks){
        let matched = false;
        try {
            matched = hook.matcher(context);
        } catch (error) {
            const hookSource = hooksSourceWeakMap.get(hook.handler) ?? "unknown";
            context.context.logger.error(`An error occurred during ${hookSource} hook matcher execution:`, error);
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"]("INTERNAL_SERVER_ERROR", {
                message: "An error occurred during hook matcher execution. Check the logs for more details."
            });
        }
        if (!matched) continue;
        const hookSource = hooksSourceWeakMap.get(hook.handler) ?? "unknown";
        const route = endpoint.path ?? "/:virtual";
        const result = await withSpan(`hook before ${route} ${hookSource}`, {
            [__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$instrumentation$2f$attributes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ATTR_HOOK_TYPE"]]: "before",
            [__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$instrumentation$2f$attributes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ATTR_HTTP_ROUTE"]]: route,
            [__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$instrumentation$2f$attributes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ATTR_CONTEXT"]]: hookSource,
            [__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$instrumentation$2f$attributes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ATTR_OPERATION_ID"]]: operationId
        }, ()=>hook.handler({
                ...context,
                returnHeaders: true
            })).catch((e)=>{
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$is$2d$api$2d$error$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isAPIError"])(e) && (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$logger$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["shouldPublishLog"])(context.context.logger.level, "debug")) e.stack = e.errorStack;
            throw e;
        });
        mergeResponseHeaders(context.context, result?.headers);
        const hookReturn = result?.response;
        if (hookReturn && typeof hookReturn === "object") {
            if ("context" in hookReturn && typeof hookReturn.context === "object") {
                const { headers, ...rest } = hookReturn.context;
                if (headers instanceof Headers) if (modifiedContext.headers) headers.forEach((value, key)=>{
                    modifiedContext.headers?.set(key, value);
                });
                else modifiedContext.headers = headers;
                modifiedContext = defuReplaceArrays(rest, modifiedContext);
                continue;
            }
            return hookReturn;
        }
    }
    return {
        context: modifiedContext
    };
}
async function runAfterHooks(context, hooks, endpoint, operationId) {
    const withSpan = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$instrumentation$2f$tracer$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createWithSpan"])(context.context.options);
    for (const hook of hooks){
        if (!hook.matcher(context)) continue;
        const hookSource = hooksSourceWeakMap.get(hook.handler) ?? "unknown";
        const route = endpoint.path ?? "/:virtual";
        const result = await withSpan(`hook after ${route} ${hookSource}`, {
            [__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$instrumentation$2f$attributes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ATTR_HOOK_TYPE"]]: "after",
            [__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$instrumentation$2f$attributes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ATTR_HTTP_ROUTE"]]: route,
            [__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$instrumentation$2f$attributes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ATTR_CONTEXT"]]: hookSource,
            [__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$instrumentation$2f$attributes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ATTR_OPERATION_ID"]]: operationId
        }, ()=>hook.handler(context)).catch((e)=>{
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$is$2d$api$2d$error$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isAPIError"])(e)) {
                if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$logger$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["shouldPublishLog"])(context.context.logger.level, "debug")) e.stack = e.errorStack;
                return {
                    response: e,
                    headers: mergeAPIErrorHeaders(e)
                };
            }
            throw e;
        });
        mergeResponseHeaders(context.context, result.headers);
        if (result.response !== void 0) context.context.returned = result.response;
    }
    return {
        response: context.context.returned,
        headers: context.context.responseHeaders
    };
}
function getHooks(authContext) {
    const plugins = authContext.options.plugins || [];
    const beforeHooks = [];
    const afterHooks = [];
    const beforeHookHandler = authContext.options.hooks?.before;
    if (beforeHookHandler) {
        hooksSourceWeakMap.set(beforeHookHandler, "user");
        beforeHooks.push({
            matcher: ()=>true,
            handler: beforeHookHandler
        });
    }
    const afterHookHandler = authContext.options.hooks?.after;
    if (afterHookHandler) {
        hooksSourceWeakMap.set(afterHookHandler, "user");
        afterHooks.push({
            matcher: ()=>true,
            handler: afterHookHandler
        });
    }
    const pluginBeforeHooks = plugins.flatMap((plugin)=>(plugin.hooks?.before ?? []).map((h)=>{
            hooksSourceWeakMap.set(h.handler, `plugin:${plugin.id}`);
            return h;
        }));
    const pluginAfterHooks = plugins.flatMap((plugin)=>(plugin.hooks?.after ?? []).map((h)=>{
            hooksSourceWeakMap.set(h.handler, `plugin:${plugin.id}`);
            return h;
        }));
    if (pluginBeforeHooks.length) beforeHooks.push(...pluginBeforeHooks);
    if (pluginAfterHooks.length) afterHooks.push(...pluginAfterHooks);
    return {
        beforeHooks,
        afterHooks
    };
}
/**
* Run a single endpoint through the configured `hooks.before` / `hooks.after`
* pipeline, normalizing the response, headers, and `APIError`s the same way a
* router or `auth.api.*` dispatch does.
*
* This is the canonical hook runner. The HTTP router and `auth.api.*` reach it
* through {@link toAuthEndpoints}. Plugins call it directly when they need to
* re-enter the pipeline on purpose, such as resuming `/oauth2/authorize` after
* a fresh sign-in. Calling an endpoint as a plain function deliberately skips
* hooks; `dispatchAuthEndpoint` is the supported way to opt back in.
*
* @param endpoint The endpoint to dispatch.
* @param input Input context whose `context` is an already-resolved `AuthContext`.
*/ async function dispatchAuthEndpoint(endpoint, input) {
    const withSpan = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$instrumentation$2f$tracer$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createWithSpan"])(input.context.options);
    const operationId = input.operationId ?? getOperationId(endpoint);
    const route = endpoint.path ?? "/:virtual";
    const endpointMethod = endpoint.options?.method;
    const defaultMethod = Array.isArray(endpointMethod) ? endpointMethod[0] : endpointMethod;
    const methodName = input.method ?? input.request?.method ?? defaultMethod ?? "?";
    const shouldReturnResponse = input.asResponse ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$url$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isRequestLike"])(input.request);
    let internalContext = {
        ...input,
        context: {
            ...input.context,
            returned: void 0,
            responseHeaders: void 0,
            session: input.context.session ?? null
        },
        path: endpoint.path,
        headers: input.headers ? new Headers(input.headers) : void 0
    };
    return withSpan(`${methodName} ${route}`, {
        [__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$instrumentation$2f$attributes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ATTR_HTTP_ROUTE"]]: route,
        [__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$instrumentation$2f$attributes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ATTR_OPERATION_ID"]]: operationId
    }, async ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$endpoint$2d$context$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["runWithEndpointContext"])(internalContext, async ()=>{
            const { beforeHooks, afterHooks } = getHooks(internalContext.context);
            const before = await runBeforeHooks(internalContext, beforeHooks, endpoint, operationId);
            if ("context" in before && before.context && typeof before.context === "object") {
                const { headers, ...rest } = before.context;
                if (headers) {
                    if (!internalContext.headers) internalContext.headers = new Headers();
                    const requestHeaders = internalContext.headers;
                    headers.forEach((value, key)=>{
                        requestHeaders.set(key, value);
                    });
                }
                internalContext = defuReplaceArrays(rest, internalContext);
            } else if (before) {
                const responseHeaders = internalContext.context.responseHeaders;
                return shouldReturnResponse ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$call$2f$dist$2f$to$2d$response$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["toResponse"])(before, {
                    headers: responseHeaders
                }) : input.returnHeaders ? {
                    headers: responseHeaders,
                    response: before
                } : before;
            }
            internalContext.asResponse = false;
            internalContext.returnHeaders = true;
            internalContext.returnStatus = true;
            const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$endpoint$2d$context$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["runWithEndpointContext"])(internalContext, ()=>withSpan(`handler ${route}`, {
                    [__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$instrumentation$2f$attributes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ATTR_HTTP_ROUTE"]]: route,
                    [__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$instrumentation$2f$attributes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ATTR_OPERATION_ID"]]: operationId
                }, ()=>endpoint(internalContext))).catch((e)=>{
                if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$is$2d$api$2d$error$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isAPIError"])(e)) return {
                    response: e,
                    status: e.statusCode,
                    headers: mergeAPIErrorHeaders(e)
                };
                throw e;
            });
            if (result instanceof Response) return result;
            internalContext.context.returned = result.response;
            internalContext.context.responseHeaders = result.headers ?? void 0;
            const after = await runAfterHooks(internalContext, afterHooks, endpoint, operationId);
            if (after.response !== void 0) result.response = after.response;
            result.headers = after.headers ?? result.headers;
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$is$2d$api$2d$error$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isAPIError"])(result.response) && (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$logger$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["shouldPublishLog"])(internalContext.context.logger.level, "debug")) result.response.stack = result.response.errorStack;
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$is$2d$api$2d$error$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isAPIError"])(result.response) && !shouldReturnResponse) {
                if (result.headers) Object.defineProperty(result.response, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$call$2f$dist$2f$error$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["kAPIErrorHeaderSymbol"], {
                    enumerable: false,
                    configurable: true,
                    writable: false,
                    value: result.headers
                });
                throw result.response;
            }
            return shouldReturnResponse ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$call$2f$dist$2f$to$2d$response$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["toResponse"])(result.response, {
                headers: result.headers ?? void 0,
                status: result.status
            }) : input.returnHeaders ? input.returnStatus ? {
                headers: result.headers,
                response: result.response,
                status: result.status
            } : {
                headers: result.headers,
                response: result.response
            } : input.returnStatus ? {
                response: result.response,
                status: result.status
            } : result.response;
        }));
}
;
}),
"[project]/examples/nextjs/node_modules/better-auth/dist/api/index.mjs [app-route] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "checkEndpointConflicts",
    ()=>checkEndpointConflicts,
    "getEndpoints",
    ()=>getEndpoints,
    "router",
    ()=>router
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$is$2d$api$2d$error$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/utils/is-api-error.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$middlewares$2f$authorization$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/api/middlewares/authorization.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$middlewares$2f$origin$2d$check$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/api/middlewares/origin-check.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$rate$2d$limiter$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/api/rate-limiter/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$state$2f$oauth$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/api/state/oauth.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$state$2f$should$2d$session$2d$refresh$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/api/state/should-session-refresh.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$routes$2f$session$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/api/routes/session.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$routes$2f$account$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/api/routes/account.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$routes$2f$callback$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/api/routes/callback.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$routes$2f$email$2d$verification$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/api/routes/email-verification.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$routes$2f$error$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/api/routes/error.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$routes$2f$ok$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/api/routes/ok.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$routes$2f$password$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/api/routes/password.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$routes$2f$sign$2d$in$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/api/routes/sign-in.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$routes$2f$sign$2d$out$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/api/routes/sign-out.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$routes$2f$sign$2d$up$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/api/routes/sign-up.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$routes$2f$update$2d$session$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/api/routes/update-session.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$routes$2f$update$2d$user$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/api/routes/update-user.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$dispatch$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/api/dispatch.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$to$2d$auth$2d$endpoints$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/api/to-auth-endpoints.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$logger$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/env/logger.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/error/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$ip$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/utils/ip.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$instrumentation$2f$attributes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/instrumentation/attributes.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$instrumentation$2f$tracer$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/instrumentation/tracer.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$url$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/utils/url.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-call/dist/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$call$2f$dist$2f$router$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-call/dist/router.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$api$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/api/index.mjs [app-route] (ecmascript)");
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
//#region src/api/index.ts
function checkEndpointConflicts(options, logger) {
    const endpointRegistry = /* @__PURE__ */ new Map();
    options.plugins?.forEach((plugin)=>{
        if (plugin.endpoints) {
            for (const [key, endpoint] of Object.entries(plugin.endpoints))if (endpoint && "path" in endpoint && typeof endpoint.path === "string") {
                const path = endpoint.path;
                let methods = [];
                if (endpoint.options && "method" in endpoint.options) {
                    if (Array.isArray(endpoint.options.method)) methods = endpoint.options.method;
                    else if (typeof endpoint.options.method === "string") methods = [
                        endpoint.options.method
                    ];
                }
                if (methods.length === 0) methods = [
                    "*"
                ];
                if (!endpointRegistry.has(path)) endpointRegistry.set(path, []);
                endpointRegistry.get(path).push({
                    pluginId: plugin.id,
                    endpointKey: key,
                    methods
                });
            }
        }
    });
    const conflicts = [];
    for (const [path, entries] of endpointRegistry.entries())if (entries.length > 1) {
        const methodMap = /* @__PURE__ */ new Map();
        let hasConflict = false;
        for (const entry of entries)for (const method of entry.methods){
            if (!methodMap.has(method)) methodMap.set(method, []);
            methodMap.get(method).push(entry.pluginId);
            if (methodMap.get(method).length > 1) hasConflict = true;
            if (method === "*" && entries.length > 1) hasConflict = true;
            else if (method !== "*" && methodMap.has("*")) hasConflict = true;
        }
        if (hasConflict) {
            const uniquePlugins = [
                ...new Set(entries.map((e)=>e.pluginId))
            ];
            const conflictingMethods = [];
            for (const [method, plugins] of methodMap.entries())if (plugins.length > 1 || method === "*" && entries.length > 1 || method !== "*" && methodMap.has("*")) conflictingMethods.push(method);
            conflicts.push({
                path,
                plugins: uniquePlugins,
                conflictingMethods
            });
        }
    }
    if (conflicts.length > 0) {
        const conflictMessages = conflicts.map((conflict)=>`  - "${conflict.path}" [${conflict.conflictingMethods.join(", ")}] used by plugins: ${conflict.plugins.join(", ")}`).join("\n");
        logger.error(`Endpoint path conflicts detected! Multiple plugins are trying to use the same endpoint paths with conflicting HTTP methods:
${conflictMessages}

To resolve this, you can:
	1. Use only one of the conflicting plugins
	2. Configure the plugins to use different paths (if supported)
	3. Ensure plugins use different HTTP methods for the same path
`);
    }
}
function getEndpoints(ctx, options) {
    const withSpan = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$instrumentation$2f$tracer$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createWithSpan"])(options);
    const pluginEndpoints = options.plugins?.reduce((acc, plugin)=>{
        return {
            ...acc,
            ...plugin.endpoints
        };
    }, {}) ?? {};
    const middlewares = options.plugins?.map((plugin)=>plugin.middlewares?.map((m)=>{
            const middleware = async (context)=>{
                const authContext = await ctx;
                return withSpan(`middleware ${m.path} ${plugin.id}`, {
                    [__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$instrumentation$2f$attributes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ATTR_HOOK_TYPE"]]: "middleware",
                    [__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$instrumentation$2f$attributes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ATTR_HTTP_ROUTE"]]: m.path,
                    [__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$instrumentation$2f$attributes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ATTR_CONTEXT"]]: `plugin:${plugin.id}`
                }, ()=>m.middleware({
                        ...context,
                        context: {
                            ...authContext,
                            ...context.context
                        }
                    }));
            };
            middleware.options = m.middleware.options;
            return {
                path: m.path,
                middleware
            };
        })).filter((plugin)=>plugin !== void 0).flat() || [];
    return {
        api: (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$to$2d$auth$2d$endpoints$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["toAuthEndpoints"])({
            signInSocial: (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$routes$2f$sign$2d$in$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["signInSocial"])(),
            callbackOAuth: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$routes$2f$callback$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["callbackOAuth"],
            getSession: (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$routes$2f$session$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getSession"])(),
            signOut: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$routes$2f$sign$2d$out$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["signOut"],
            signUpEmail: (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$routes$2f$sign$2d$up$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["signUpEmail"])(),
            signInEmail: (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$routes$2f$sign$2d$in$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["signInEmail"])(),
            resetPassword: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$routes$2f$password$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["resetPassword"],
            verifyPassword: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$routes$2f$password$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["verifyPassword"],
            verifyEmail: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$routes$2f$email$2d$verification$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["verifyEmail"],
            sendVerificationEmail: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$routes$2f$email$2d$verification$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sendVerificationEmail"],
            changeEmail: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$routes$2f$update$2d$user$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["changeEmail"],
            changePassword: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$routes$2f$update$2d$user$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["changePassword"],
            setPassword: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$routes$2f$update$2d$user$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["setPassword"],
            updateSession: (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$routes$2f$update$2d$session$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["updateSession"])(),
            updateUser: (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$routes$2f$update$2d$user$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["updateUser"])(),
            deleteUser: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$routes$2f$update$2d$user$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["deleteUser"],
            requestPasswordReset: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$routes$2f$password$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["requestPasswordReset"],
            requestPasswordResetCallback: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$routes$2f$password$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["requestPasswordResetCallback"],
            listSessions: (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$routes$2f$session$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["listSessions"])(),
            revokeSession: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$routes$2f$session$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["revokeSession"],
            revokeSessions: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$routes$2f$session$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["revokeSessions"],
            revokeOtherSessions: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$routes$2f$session$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["revokeOtherSessions"],
            linkSocialAccount: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$routes$2f$account$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["linkSocialAccount"],
            listUserAccounts: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$routes$2f$account$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["listUserAccounts"],
            deleteUserCallback: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$routes$2f$update$2d$user$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["deleteUserCallback"],
            unlinkAccount: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$routes$2f$account$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["unlinkAccount"],
            refreshToken: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$routes$2f$account$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["refreshToken"],
            getAccessToken: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$routes$2f$account$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getAccessToken"],
            accountInfo: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$routes$2f$account$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["accountInfo"],
            ...pluginEndpoints,
            ok: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$routes$2f$ok$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ok"],
            error: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$routes$2f$error$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["error"]
        }, ctx),
        middlewares
    };
}
const router = (ctx, options)=>{
    const withSpan = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$instrumentation$2f$tracer$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createWithSpan"])(options);
    const { api, middlewares } = getEndpoints(ctx, options);
    const basePath = new URL(ctx.baseURL).pathname;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$call$2f$dist$2f$router$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createRouter"])(api, {
        routerContext: ctx,
        openapi: {
            disabled: true
        },
        basePath,
        routerMiddleware: [
            {
                path: "/**",
                middleware: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$middlewares$2f$origin$2d$check$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["originCheckMiddleware"]
            },
            ...middlewares
        ],
        allowedMediaTypes: [
            "application/json"
        ],
        skipTrailingSlashes: options.advanced?.skipTrailingSlashes ?? false,
        async onRequest (req) {
            const disabledPaths = ctx.options.disabledPaths || [];
            const normalizedPath = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$url$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizePathname"])(req.url, basePath);
            if (disabledPaths.includes(normalizedPath)) return new Response("Not Found", {
                status: 404
            });
            const pendingSchemaCheck = ctx.checkSchema?.();
            if (pendingSchemaCheck) await pendingSchemaCheck;
            let currentRequest = req;
            const rateLimitResponse = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$rate$2d$limiter$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["onRequestRateLimit"])(currentRequest, ctx);
            if (rateLimitResponse) return rateLimitResponse;
            for (const plugin of ctx.options.plugins || [])if (plugin.onRequest) {
                const response = await withSpan(`onRequest ${plugin.id}`, {
                    [__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$instrumentation$2f$attributes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ATTR_HOOK_TYPE"]]: "onRequest",
                    [__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$instrumentation$2f$attributes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ATTR_CONTEXT"]]: `plugin:${plugin.id}`
                }, ()=>plugin.onRequest(currentRequest, ctx));
                if (response && "response" in response) return response.response;
                if (response && "request" in response) currentRequest = response.request;
            }
            return currentRequest;
        },
        async onResponse (res, req) {
            for (const plugin of ctx.options.plugins || [])if (plugin.onResponse) {
                const response = await withSpan(`onResponse ${plugin.id}`, {
                    [__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$instrumentation$2f$attributes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ATTR_HOOK_TYPE"]]: "onResponse",
                    [__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$instrumentation$2f$attributes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ATTR_CONTEXT"]]: `plugin:${plugin.id}`,
                    [__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$instrumentation$2f$attributes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ATTR_HTTP_RESPONSE_STATUS_CODE"]]: res.status
                }, ()=>plugin.onResponse(res, ctx));
                if (response) return response.response;
            }
            return res;
        },
        async onError (e) {
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$is$2d$api$2d$error$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isAPIError"])(e) && e.status === "FOUND") return;
            if (options.onAPIError?.throw) throw e;
            if (options.onAPIError?.onError) {
                try {
                    await options.onAPIError.onError(e, ctx);
                } catch (hookError) {
                    ctx.logger.error("onAPIError.onError threw", hookError);
                }
                return;
            }
            const optLogLevel = options.logger?.level;
            const log = optLogLevel === "error" || optLogLevel === "warn" || optLogLevel === "debug" ? __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$logger$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"] : void 0;
            if (options.logger?.disabled !== true) {
                if (e && typeof e === "object" && "message" in e && typeof e.message === "string") {
                    if (e.message.includes("no column") || e.message.includes("column") || e.message.includes("relation") || e.message.includes("table") || e.message.includes("does not exist")) {
                        ctx.logger?.error(e.message);
                        return;
                    }
                }
                if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$is$2d$api$2d$error$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isAPIError"])(e)) {
                    if (e.status === "INTERNAL_SERVER_ERROR") ctx.logger.error(e.status, e);
                    log?.error(e.message);
                } else ctx.logger?.error(e && typeof e === "object" && "name" in e ? e.name : "", e);
            }
        }
    });
};
;
}),
"[project]/examples/nextjs/node_modules/better-auth/dist/api/middlewares/authorization.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "requireOrgRole",
    ()=>requireOrgRole,
    "requireResourceOwnership",
    ()=>requireResourceOwnership
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/error/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$api$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/api/index.mjs [app-route] (ecmascript)");
;
;
//#region src/api/middlewares/authorization.ts
/**
* Middleware that verifies the authenticated user owns a resource.
* Must be used after sessionMiddleware in the `use` array.
*
* Fetches the resource by ID from the request body or query,
* then verifies `resource[ownerField] === session.user.id`.
* Throws NOT_FOUND if the resource doesn't exist, FORBIDDEN if
* the user doesn't own it.
*
* The fetched resource is returned on `ctx.context.verifiedResource`
* so the handler can use it without a redundant DB query.
*/ function requireResourceOwnership(config) {
    const ownerField = config.ownerField ?? "userId";
    const forbiddenStatus = config.forbiddenStatus ?? "FORBIDDEN";
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$api$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAuthMiddleware"])(async (ctx)=>{
        const session = ctx.context.session;
        if (!session?.user?.id) throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"]("UNAUTHORIZED");
        const resourceId = (config.idSource === "body" ? ctx.body : ctx.query)?.[config.idParam];
        if (!resourceId) throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"]("BAD_REQUEST", {
            message: `Missing required parameter: ${config.idParam}`
        });
        const resource = await ctx.context.adapter.findOne({
            model: config.model,
            where: [
                {
                    field: "id",
                    value: resourceId
                }
            ]
        });
        if (!resource) {
            if (config.notFoundError) throw __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"].from("NOT_FOUND", config.notFoundError);
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"]("NOT_FOUND");
        }
        if (resource[ownerField] !== session.user.id) {
            if (config.forbiddenError) throw __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"].from(forbiddenStatus, config.forbiddenError);
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"](forbiddenStatus);
        }
        return {
            verifiedResource: resource
        };
    });
}
/**
* Middleware that verifies the authenticated user is a member of a
* specific organization with one of the allowed roles.
* Must be used after sessionMiddleware in the `use` array.
*
* Looks up the member record by {userId, organizationId}, then checks
* the member's role against the allowed list.
*
* The verified member is returned on `ctx.context.verifiedMember`.
*/ function requireOrgRole(config) {
    const parseMemberRoles = (role)=>role.split(",").map((entry)=>entry.trim()).filter(Boolean);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$api$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAuthMiddleware"])(async (ctx)=>{
        const session = ctx.context.session;
        if (!session?.user?.id) throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"]("UNAUTHORIZED");
        if (!ctx.context.hasPlugin("organization")) throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"]("BAD_REQUEST", {
            message: "Organization plugin is required for org role authorization"
        });
        const organizationId = (config.orgIdSource === "body" ? ctx.body : ctx.query)?.[config.orgIdParam];
        if (!organizationId) throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"]("BAD_REQUEST", {
            message: `Missing required parameter: ${config.orgIdParam}`
        });
        const member = await ctx.context.adapter.findOne({
            model: "member",
            where: [
                {
                    field: "userId",
                    value: session.user.id
                },
                {
                    field: "organizationId",
                    value: organizationId
                }
            ]
        });
        if (!member) throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"]("FORBIDDEN", {
            message: "Not a member of this organization"
        });
        if (config.allowedRoles?.length) {
            if (!parseMemberRoles(member.role ?? "").some((role)=>config.allowedRoles.includes(role))) throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"]("FORBIDDEN", {
                message: "Insufficient role for this operation"
            });
        }
        return {
            verifiedMember: member
        };
    });
}
;
}),
"[project]/examples/nextjs/node_modules/better-auth/dist/api/middlewares/origin-check.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "formCsrfMiddleware",
    ()=>formCsrfMiddleware,
    "originCheck",
    ()=>originCheck,
    "originCheckMiddleware",
    ()=>originCheckMiddleware
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$url$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/utils/url.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$auth$2f$trusted$2d$origins$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/auth/trusted-origins.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/error/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/error/codes.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$url$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/utils/url.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$api$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/api/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$deprecate$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/utils/deprecate.mjs [app-route] (ecmascript)");
;
;
;
;
;
;
//#region src/api/middlewares/origin-check.ts
/**
* Checks if CSRF should be skipped for backward compatibility.
* Previously, disableOriginCheck also disabled CSRF checks.
* This maintains that behavior when disableCSRFCheck isn't explicitly set.
* Only triggers for skipOriginCheck === true, not for path arrays.
*/ function shouldSkipCSRFForBackwardCompat(ctx) {
    return ctx.context.skipOriginCheck === true && ctx.context.options.advanced?.disableCSRFCheck === void 0;
}
/**
* Checks if the origin check should be skipped for the current request.
* Handles both boolean (skip all) and array (skip specific paths) configurations.
*/ function shouldSkipOriginCheck(ctx) {
    const skipOriginCheck = ctx.context.skipOriginCheck;
    if (skipOriginCheck === true) return true;
    if (Array.isArray(skipOriginCheck) && ctx.request) try {
        const basePath = new URL(ctx.context.baseURL).pathname;
        const currentPath = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$url$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizePathname"])(ctx.request.url, basePath);
        return skipOriginCheck.some((skipPath)=>{
            const normalizedSkipPath = skipPath.replace(/\/+$/, "");
            return currentPath === normalizedSkipPath || currentPath.startsWith(`${normalizedSkipPath}/`);
        });
    } catch  {}
    return false;
}
/**
* Logs deprecation warning for users relying on coupled behavior.
* Only logs if user explicitly set disableOriginCheck (not test environment default).
*/ const logBackwardCompatWarning = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$deprecate$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["deprecate"])(function logBackwardCompatWarning() {}, "disableOriginCheck: true currently also disables CSRF checks. In a future version, disableOriginCheck will ONLY disable URL validation. To keep CSRF disabled, add disableCSRFCheck: true to your config.");
/**
* A middleware to validate callbackURL and origin against trustedOrigins.
* Also handles CSRF protection using Fetch Metadata for first-login scenarios.
*/ const originCheckMiddleware = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$api$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAuthMiddleware"])(async (ctx)=>{
    if (ctx.request?.method === "GET" || ctx.request?.method === "OPTIONS" || ctx.request?.method === "HEAD" || !ctx.request) return;
    await validateOrigin(ctx);
    if (shouldSkipOriginCheck(ctx)) return;
    const { body, query } = ctx;
    const callbackURL = body?.callbackURL || query?.callbackURL;
    const redirectURL = body?.redirectTo;
    const errorCallbackURL = body?.errorCallbackURL;
    const newUserCallbackURL = body?.newUserCallbackURL;
    const validateURL = (url, label)=>{
        if (!url) return;
        if (typeof url !== "string") throw __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"].fromStatus("BAD_REQUEST", {
            message: `Invalid ${label}: expected a string`
        });
        if (!ctx.context.isTrustedOrigin(url, {
            allowRelativePaths: label !== "origin"
        })) {
            ctx.context.logger.error(`Invalid ${label}: ${url}`);
            ctx.context.logger.info(`If it's a valid URL, please add ${url} to trustedOrigins in your auth config\n`, `Current list of trustedOrigins: ${ctx.context.trustedOrigins}`);
            if (label === "origin") throw __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"].from("FORBIDDEN", __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BASE_ERROR_CODES"].INVALID_ORIGIN);
            if (label === "callbackURL") throw __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"].from("FORBIDDEN", __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BASE_ERROR_CODES"].INVALID_CALLBACK_URL);
            if (label === "redirectURL") throw __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"].from("FORBIDDEN", __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BASE_ERROR_CODES"].INVALID_REDIRECT_URL);
            if (label === "errorCallbackURL") throw __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"].from("FORBIDDEN", __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BASE_ERROR_CODES"].INVALID_ERROR_CALLBACK_URL);
            if (label === "newUserCallbackURL") throw __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"].from("FORBIDDEN", __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BASE_ERROR_CODES"].INVALID_NEW_USER_CALLBACK_URL);
            throw __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"].fromStatus("FORBIDDEN", {
                message: `Invalid ${label}`
            });
        }
    };
    callbackURL && validateURL(callbackURL, "callbackURL");
    redirectURL && validateURL(redirectURL, "redirectURL");
    errorCallbackURL && validateURL(errorCallbackURL, "errorCallbackURL");
    newUserCallbackURL && validateURL(newUserCallbackURL, "newUserCallbackURL");
});
const originCheck = (getValue)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$api$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAuthMiddleware"])(async (ctx)=>{
        if (!ctx.request) return;
        if (shouldSkipOriginCheck(ctx)) return;
        const callbackURL = getValue(ctx);
        const validateURL = (url, label)=>{
            if (!url) return;
            if (!ctx.context.isTrustedOrigin(url, {
                allowRelativePaths: label !== "origin"
            })) {
                ctx.context.logger.error(`Invalid ${label}: ${url}`);
                ctx.context.logger.info(`If it's a valid URL, please add ${url} to trustedOrigins in your auth config\n`, `Current list of trustedOrigins: ${ctx.context.trustedOrigins}`);
                if (label === "origin") throw __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"].from("FORBIDDEN", __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BASE_ERROR_CODES"].INVALID_ORIGIN);
                if (label === "callbackURL") throw __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"].from("FORBIDDEN", __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BASE_ERROR_CODES"].INVALID_CALLBACK_URL);
                if (label === "redirectURL") throw __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"].from("FORBIDDEN", __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BASE_ERROR_CODES"].INVALID_REDIRECT_URL);
                if (label === "errorCallbackURL") throw __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"].from("FORBIDDEN", __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BASE_ERROR_CODES"].INVALID_ERROR_CALLBACK_URL);
                if (label === "newUserCallbackURL") throw __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"].from("FORBIDDEN", __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BASE_ERROR_CODES"].INVALID_NEW_USER_CALLBACK_URL);
                throw __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"].fromStatus("FORBIDDEN", {
                    message: `Invalid ${label}`
                });
            }
        };
        const callbacks = Array.isArray(callbackURL) ? callbackURL : [
            callbackURL
        ];
        for (const url of callbacks)validateURL(url, "callbackURL");
    });
/**
* Validates origin header against trusted origins.
* @param ctx - The endpoint context
* @param forceValidate - If true, always validate origin regardless of cookies/skip flags
*/ async function validateOrigin(ctx, forceValidate = false) {
    const headers = ctx.request?.headers;
    if (!headers || !ctx.request) return;
    const origin = headers.get("origin");
    const originHeader = origin || headers.get("referer") || "";
    const useCookies = headers.has("cookie");
    if (ctx.context.skipCSRFCheck) return;
    if (shouldSkipCSRFForBackwardCompat(ctx)) {
        ctx.context.options.advanced?.disableOriginCheck === true && logBackwardCompatWarning();
        return;
    }
    if (shouldSkipOriginCheck(ctx)) return;
    if (!(forceValidate || useCookies)) return;
    const inferredBaseURL = origin === "null" && headers.get("sec-fetch-site") === "same-origin" ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$url$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getBaseURL"])(void 0, ctx.context.options.basePath, ctx.request, false, ctx.context.options.advanced?.trustedProxyHeaders) : void 0;
    const originToValidate = (inferredBaseURL ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$url$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getOrigin"])(inferredBaseURL) : void 0) ?? originHeader;
    if (!originToValidate || originToValidate === "null") throw __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"].from("FORBIDDEN", __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BASE_ERROR_CODES"].MISSING_OR_NULL_ORIGIN);
    const trustedOrigins = Array.isArray(ctx.context.options.trustedOrigins) ? ctx.context.trustedOrigins : [
        ...ctx.context.trustedOrigins,
        ...(await ctx.context.options.trustedOrigins?.(ctx.request))?.filter((v)=>Boolean(v)) || []
    ];
    if (!trustedOrigins.some((origin)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$auth$2f$trusted$2d$origins$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["matchesOriginPattern"])(originToValidate, origin))) {
        ctx.context.logger.error(`Invalid origin: ${originToValidate}`);
        ctx.context.logger.info(`If it's a valid URL, please add ${originToValidate} to trustedOrigins in your auth config\n`, `Current list of trustedOrigins: ${trustedOrigins}`);
        throw __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"].from("FORBIDDEN", __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BASE_ERROR_CODES"].INVALID_ORIGIN);
    }
}
/**
* Middleware for CSRF protection using Fetch Metadata headers.
* This prevents cross-site navigation login attacks while supporting progressive enhancement.
*/ const formCsrfMiddleware = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$api$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAuthMiddleware"])(async (ctx)=>{
    if (!ctx.request) return;
    await validateFormCsrf(ctx);
});
/**
* Validates CSRF protection for first-login scenarios using Fetch Metadata headers.
* This prevents cross-site form submission attacks while supporting progressive enhancement.
*/ async function validateFormCsrf(ctx) {
    const req = ctx.request;
    if (!req) return;
    if (ctx.context.skipCSRFCheck) return;
    if (shouldSkipCSRFForBackwardCompat(ctx)) return;
    const headers = req.headers;
    if (headers.has("cookie")) return await validateOrigin(ctx);
    const site = headers.get("Sec-Fetch-Site");
    const mode = headers.get("Sec-Fetch-Mode");
    const dest = headers.get("Sec-Fetch-Dest");
    if (Boolean(site && site.trim() || mode && mode.trim() || dest && dest.trim())) {
        if (site === "cross-site" && mode === "navigate") {
            ctx.context.logger.error("Blocked cross-site navigation login attempt (CSRF protection)", {
                secFetchSite: site,
                secFetchMode: mode,
                secFetchDest: dest
            });
            throw __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"].from("FORBIDDEN", __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BASE_ERROR_CODES"].CROSS_SITE_NAVIGATION_LOGIN_BLOCKED);
        }
        return await validateOrigin(ctx, true);
    }
    if (headers.get("origin") || headers.get("referer")) return await validateOrigin(ctx, true);
}
;
}),
"[project]/examples/nextjs/node_modules/better-auth/dist/api/rate-limiter/index.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "onRequestRateLimit",
    ()=>onRequestRateLimit
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$wildcard$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/utils/wildcard.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/error/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$ip$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/utils/ip.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$url$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/utils/url.mjs [app-route] (ecmascript)");
;
;
;
;
//#region src/api/rate-limiter/index.ts
const memory = /* @__PURE__ */ new Map();
const MEMORY_STORE_MAX_ENTRIES = 1e5;
function pruneMemoryStore() {
    const now = Date.now();
    for (const [key, entry] of memory)if (now >= entry.expiresAt) memory.delete(key);
    if (memory.size <= MEMORY_STORE_MAX_ENTRIES) return;
    const overflow = memory.size - MEMORY_STORE_MAX_ENTRIES;
    let removed = 0;
    for (const key of memory.keys()){
        memory.delete(key);
        if (++removed >= overflow) break;
    }
}
/**
* Decide an atomic rate-limit step against an in-memory `RateLimit` snapshot
* for the rolling `window` (seconds) and `max`. Shared by the memory backend
* (read-decide-write is atomic under single-threaded JS) and as the fallback
* for storages lacking an atomic primitive.
*/ function decideConsume(data, rule, now) {
    const windowInMs = rule.window * 1e3;
    if (!data) return {
        next: {
            key: "",
            count: 1,
            lastRequest: now
        },
        update: false,
        allowed: true,
        retryAfter: null
    };
    if (now - data.lastRequest >= windowInMs) return {
        next: {
            ...data,
            count: 1,
            lastRequest: now
        },
        update: true,
        allowed: true,
        retryAfter: null
    };
    if (data.count >= rule.max) return {
        next: data,
        update: true,
        allowed: false,
        retryAfter: getRetryAfter(data.lastRequest, rule.window)
    };
    return {
        next: {
            ...data,
            count: data.count + 1,
            lastRequest: now
        },
        update: true,
        allowed: true,
        retryAfter: null
    };
}
function rateLimitResponse(retryAfter) {
    return new Response(JSON.stringify({
        message: "Too many requests. Please try again later."
    }), {
        status: 429,
        statusText: "Too Many Requests",
        headers: {
            "Content-Type": "application/json",
            "X-Retry-After": retryAfter.toString()
        }
    });
}
function getRetryAfter(lastRequest, window) {
    const now = Date.now();
    const windowInMs = window * 1e3;
    return Math.ceil((lastRequest + windowInMs - now) / 1e3);
}
function createDatabaseStorageWrapper(ctx) {
    const model = "rateLimit";
    const db = ctx.adapter;
    let longestObservedWindow = Math.max(...getConfiguredRateLimitWindows(ctx));
    const readRow = async (key)=>{
        const data = (await db.findMany({
            model,
            where: [
                {
                    field: "key",
                    value: key
                }
            ]
        }))[0];
        if (data) data.lastRequest = Number(data.lastRequest);
        return data;
    };
    const consume = async (key, rule)=>{
        if (rule.window > longestObservedWindow) longestObservedWindow = rule.window;
        const windowInMs = rule.window * 1e3;
        const data = await readRow(key);
        const now = Date.now();
        if (!data) try {
            await db.create({
                model,
                data: {
                    key,
                    count: 1,
                    lastRequest: now
                }
            });
            return {
                allowed: true,
                retryAfter: null
            };
        } catch (error) {
            if (!await readRow(key)) throw error;
            return consume(key, rule);
        }
        if (now - data.lastRequest >= windowInMs) {
            if (await db.incrementOne({
                model,
                where: [
                    {
                        field: "key",
                        value: key
                    },
                    {
                        field: "lastRequest",
                        operator: "lte",
                        value: data.lastRequest
                    }
                ],
                increment: {},
                set: {
                    count: 1,
                    lastRequest: now
                }
            })) {
                await deleteExpiredRows(now);
                return {
                    allowed: true,
                    retryAfter: null
                };
            }
            return consume(key, rule);
        }
        const windowStart = now - windowInMs;
        if (await db.incrementOne({
            model,
            where: [
                {
                    field: "key",
                    value: key
                },
                {
                    field: "lastRequest",
                    operator: "gt",
                    value: windowStart
                },
                {
                    field: "count",
                    operator: "lt",
                    value: rule.max
                }
            ],
            increment: {
                count: 1
            },
            set: {
                lastRequest: now
            }
        })) return {
            allowed: true,
            retryAfter: null
        };
        const fresh = await readRow(key);
        if (!fresh) return consume(key, rule);
        if (now - fresh.lastRequest >= windowInMs) return consume(key, rule);
        return {
            allowed: false,
            retryAfter: getRetryAfter(fresh.lastRequest, rule.window)
        };
    };
    const deleteExpiredRows = async (now)=>{
        const cutoff = now - longestObservedWindow * 1e3;
        await ctx.runInBackgroundOrAwait(db.deleteMany({
            model,
            where: [
                {
                    field: "lastRequest",
                    operator: "lt",
                    value: cutoff
                }
            ]
        }).then(()=>void 0).catch((e)=>ctx.logger.error("Error pruning rate limit rows", e)));
    };
    return {
        consume
    };
}
function getConfiguredRateLimitWindows(ctx) {
    const windows = [
        ctx.rateLimit.window,
        ...getDefaultSpecialRules().map((rule)=>rule.window)
    ];
    for (const plugin of ctx.options.plugins || [])if (plugin.rateLimit) windows.push(...plugin.rateLimit.map((rule)=>rule.window));
    if (ctx.rateLimit.customRules) {
        for (const customRule of Object.values(ctx.rateLimit.customRules))if (customRule && typeof customRule !== "function") windows.push(customRule.window);
    }
    const validWindows = windows.filter((window)=>Number.isFinite(window) && window > 0);
    return validWindows.length > 0 ? validWindows : [
        ctx.rateLimit.window
    ];
}
function getRateLimitStorage(ctx, rateLimitSettings) {
    if (ctx.options.rateLimit?.customStorage) return ctx.options.rateLimit.customStorage;
    const storage = ctx.rateLimit.storage;
    if (storage === "secondary-storage") {
        const ttlFor = (window)=>window ?? ctx.options.rateLimit?.window ?? 10;
        const increment = ctx.options.secondaryStorage?.increment;
        if (!increment) throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["BetterAuthError"]("Secondary-storage rate limiting requires SecondaryStorage.increment.");
        return {
            consume: async (key, rule)=>{
                if (await increment(key, ttlFor(rule.window)) <= rule.max) return {
                    allowed: true,
                    retryAfter: null
                };
                return {
                    allowed: false,
                    retryAfter: rule.window
                };
            }
        };
    } else if (storage === "memory") {
        const ttlFor = (window)=>window ?? ctx.options.rateLimit?.window ?? 10;
        return {
            async consume (key, rule) {
                pruneMemoryStore();
                const now = Date.now();
                const entry = memory.get(key);
                const decision = decideConsume(entry && now < entry.expiresAt ? entry.data : void 0, rule, now);
                if (decision.allowed) memory.set(key, {
                    data: {
                        ...decision.next,
                        key
                    },
                    expiresAt: now + ttlFor(rule.window) * 1e3
                });
                return {
                    allowed: decision.allowed,
                    retryAfter: decision.retryAfter
                };
            }
        };
    }
    return createDatabaseStorageWrapper(ctx);
}
let ipWarningLogged = false;
const NO_TRUSTED_IP_KEY = "no-trusted-ip";
async function resolveRateLimitConfig(req, ctx) {
    const basePath = new URL(ctx.baseURL).pathname;
    const path = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$url$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizePathname"])(req.url, basePath);
    let currentWindow = ctx.rateLimit.window;
    let currentMax = ctx.rateLimit.max;
    const ip = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$ip$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getIP"])(req, ctx.options);
    if (!ip && ctx.options.advanced?.ipAddress?.disableIpTracking) return null;
    if (!ip && !ipWarningLogged) {
        ctx.logger.warn("Rate limiting could not determine a client IP and is falling back to a single shared per-path bucket. Ensure your runtime forwards a trusted client IP header, then set `advanced.ipAddress.ipAddressHeaders` or `advanced.ipAddress.trustedProxies` so the address can be resolved.");
        ipWarningLogged = true;
    }
    const key = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$ip$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createRateLimitKey"])(ip ?? NO_TRUSTED_IP_KEY, path);
    const specialRule = getDefaultSpecialRules().find((rule)=>rule.pathMatcher(path));
    if (specialRule) {
        currentWindow = specialRule.window;
        currentMax = specialRule.max;
    }
    for (const plugin of ctx.options.plugins || [])if (plugin.rateLimit) {
        const matchedRule = plugin.rateLimit.find((rule)=>rule.pathMatcher(path));
        if (matchedRule) {
            currentWindow = matchedRule.window;
            currentMax = matchedRule.max;
            break;
        }
    }
    if (ctx.rateLimit.customRules) {
        const _path = Object.keys(ctx.rateLimit.customRules).find((p)=>{
            if (p.includes("*")) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$wildcard$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["wildcardMatch"])(p)(path);
            return p === path;
        });
        if (_path) {
            const customRule = ctx.rateLimit.customRules[_path];
            const resolved = typeof customRule === "function" ? await customRule(req, {
                window: currentWindow,
                max: currentMax
            }) : customRule;
            if (resolved) {
                currentWindow = resolved.window;
                currentMax = resolved.max;
            }
            if (resolved === false) return null;
        }
    }
    return {
        key,
        currentWindow,
        currentMax
    };
}
/**
* Decides the rate limit for the request in a single atomic step. The whole
* check-and-increment happens here in the request phase; there is no separate
* response-phase write-back, so concurrent requests cannot all pass a stale
* read before any increment lands.
*/ async function onRequestRateLimit(req, ctx) {
    if (!ctx.rateLimit.enabled) return;
    const config = await resolveRateLimitConfig(req, ctx);
    if (!config) return;
    const { key, currentWindow, currentMax } = config;
    const storage = getRateLimitStorage(ctx, {
        window: currentWindow
    });
    const rule = {
        window: currentWindow,
        max: currentMax
    };
    const { allowed, retryAfter } = await storage.consume(key, rule);
    if (!allowed) return rateLimitResponse(retryAfter ?? currentWindow);
}
function getDefaultSpecialRules() {
    return [
        {
            pathMatcher (path) {
                return path.startsWith("/sign-in") || path.startsWith("/sign-up") || path.startsWith("/change-password") || path.startsWith("/change-email");
            },
            window: 10,
            max: 3
        },
        {
            pathMatcher (path) {
                return path === "/request-password-reset" || path === "/send-verification-email" || path.startsWith("/forget-password") || path === "/email-otp/send-verification-otp" || path === "/email-otp/request-password-reset";
            },
            window: 60,
            max: 3
        }
    ];
}
;
}),
"[project]/examples/nextjs/node_modules/better-auth/dist/api/routes/account.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "accountInfo",
    ()=>accountInfo,
    "getAccessToken",
    ()=>getAccessToken,
    "linkSocialAccount",
    ()=>linkSocialAccount,
    "listUserAccounts",
    ()=>listUserAccounts,
    "refreshToken",
    ()=>refreshToken,
    "unlinkAccount",
    ()=>unlinkAccount
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$context$2f$store$2d$capabilities$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/context/store-capabilities.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$schema$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/db/schema.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$session$2d$store$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/cookies/session-store.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$context$2f$helpers$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/context/helpers.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$oauth2$2f$account$2d$key$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/oauth2/account-key.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$oauth2$2f$errors$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/oauth2/errors.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$oauth2$2f$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/oauth2/utils.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$oauth2$2f$link$2d$account$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/oauth2/link-account.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$oauth2$2f$state$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/oauth2/state.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$routes$2f$session$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/api/routes/session.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/error/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/error/codes.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$authorization$2d$params$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/authorization-params.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$verify$2d$id$2d$token$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/verify-id-token.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$social$2d$providers$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/social-providers/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$api$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/api/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/zod/v4/classic/schemas.js [app-route] (ecmascript)");
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
//#region src/api/routes/account.ts
function parseStoredScopes(scope) {
    if (!scope) return [];
    return scope.split(",").map((s)=>s.trim()).filter(Boolean);
}
const listUserAccounts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$api$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAuthEndpoint"])("/list-accounts", {
    method: "GET",
    use: [
        __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$routes$2f$session$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sessionMiddleware"]
    ],
    metadata: {
        openapi: {
            operationId: "listUserAccounts",
            description: "List all accounts linked to the user",
            responses: {
                "200": {
                    description: "Success",
                    content: {
                        "application/json": {
                            schema: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        id: {
                                            type: "string"
                                        },
                                        providerId: {
                                            type: "string"
                                        },
                                        createdAt: {
                                            type: "string",
                                            format: "date-time"
                                        },
                                        updatedAt: {
                                            type: "string",
                                            format: "date-time"
                                        },
                                        accountId: {
                                            type: "string"
                                        },
                                        userId: {
                                            type: "string"
                                        },
                                        scopes: {
                                            type: "array",
                                            items: {
                                                type: "string"
                                            }
                                        }
                                    },
                                    required: [
                                        "id",
                                        "providerId",
                                        "createdAt",
                                        "updatedAt",
                                        "accountId",
                                        "userId",
                                        "scopes"
                                    ]
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}, async (c)=>{
    const session = c.context.session;
    const accounts = await c.context.internalAdapter.findAccounts(session.user.id);
    return c.json(accounts.map((a)=>{
        const { scope, ...parsed } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$schema$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseAccountOutput"])(c.context.options, a);
        return {
            ...parsed,
            scopes: parseStoredScopes(scope)
        };
    }));
});
const linkSocialAccount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$api$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAuthEndpoint"])("/link-social", {
    method: "POST",
    requireHeaders: true,
    body: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["object"]({
        /**
		* Callback URL to redirect to after the user has signed in.
		*/ callbackURL: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]().meta({
            description: "The URL to redirect to after the user has signed in"
        }).optional(),
        /**
		* OAuth2 provider to use
		*/ provider: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$social$2d$providers$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SocialProviderListEnum"],
        /**
		* ID Token for direct authentication without redirect
		*/ idToken: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["object"]({
            token: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"](),
            nonce: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]().optional(),
            accessToken: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]().optional(),
            refreshToken: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]().optional()
        }).optional(),
        /**
		* Whether to allow sign up for new users
		*/ requestSignUp: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["boolean"]().optional(),
        /**
		* Additional scopes to request when linking the account.
		* This is useful for requesting additional permissions when
		* linking a social account compared to the initial authentication.
		*/ scopes: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["array"](__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]()).meta({
            description: "Additional scopes to request from the provider"
        }).optional(),
        /**
		* The URL to redirect to if there is an error during the link process.
		*/ errorCallbackURL: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]().meta({
            description: "The URL to redirect to if there is an error during the link process"
        }).optional(),
        /**
		* Disable automatic redirection to the provider
		*
		* This is useful if you want to handle the redirection
		* yourself like in a popup or a different tab.
		*/ disableRedirect: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["boolean"]().meta({
            description: "Disable automatic redirection to the provider. Useful for handling the redirection yourself"
        }).optional(),
        /**
		* The login hint to forward to the provider authorization endpoint.
		*/ loginHint: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]().meta({
            description: "The login hint to use for the authorization code request"
        }).optional(),
        /**
		* Extra query parameters to append to the provider authorization URL.
		* Reserved OAuth keys (state, client_id, redirect_uri, response_type,
		* code_challenge, code_challenge_method, nonce, scope) are rejected.
		*/ additionalParams: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$authorization$2d$params$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["additionalAuthorizationParamsSchema"],
        /**
		* Any additional data to pass through the oauth flow.
		*/ additionalData: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["record"](__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"](), __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["any"]()).optional()
    }),
    use: [
        __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$routes$2f$session$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sessionMiddleware"]
    ],
    metadata: {
        openapi: {
            description: "Link a social account to the user",
            operationId: "linkSocialAccount",
            responses: {
                "200": {
                    description: "Success",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    url: {
                                        type: "string",
                                        description: "The authorization URL to redirect the user to"
                                    },
                                    redirect: {
                                        type: "boolean",
                                        description: "Indicates if the user should be redirected to the authorization URL"
                                    },
                                    status: {
                                        type: "boolean"
                                    }
                                },
                                required: [
                                    "redirect"
                                ]
                            }
                        }
                    }
                }
            }
        }
    }
}, async (c)=>{
    const session = c.context.session;
    const provider = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$context$2f$helpers$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getAwaitableValue"])(c.context.socialProviders, {
        value: c.body.provider
    });
    if (!provider) {
        c.context.logger.error("Provider not found. Make sure to add the provider in your auth config", {
            provider: c.body.provider
        });
        throw __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"].from("NOT_FOUND", __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BASE_ERROR_CODES"].PROVIDER_NOT_FOUND);
    }
    if (c.body.idToken) {
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$verify$2d$id$2d$token$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supportsIdTokenSignIn"])(provider)) {
            c.context.logger.error("Provider does not support id token verification", {
                provider: c.body.provider
            });
            throw __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"].from("NOT_FOUND", __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BASE_ERROR_CODES"].ID_TOKEN_NOT_SUPPORTED);
        }
        const { token, nonce } = c.body.idToken;
        if (!await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$verify$2d$id$2d$token$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["verifyProviderIdToken"])(provider, token, nonce, c)) {
            c.context.logger.warn("Invalid id token", {
                provider: c.body.provider
            });
            throw __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"].from("UNAUTHORIZED", __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BASE_ERROR_CODES"].INVALID_TOKEN);
        }
        const linkingUserInfo = await provider.getUserInfo({
            idToken: token,
            accessToken: c.body.idToken.accessToken,
            refreshToken: c.body.idToken.refreshToken
        });
        if (!linkingUserInfo || !linkingUserInfo?.user) {
            c.context.logger.error("Failed to get user info", {
                provider: c.body.provider
            });
            throw __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"].from("UNAUTHORIZED", __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BASE_ERROR_CODES"].FAILED_TO_GET_USER_INFO);
        }
        if (!linkingUserInfo.user.email) {
            c.context.logger.error((0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$oauth2$2f$errors$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["missingEmailLogMessage"])(c.body.provider, {
                source: "id_token"
            }), {
                provider: c.body.provider
            });
            throw __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"].from("UNAUTHORIZED", __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BASE_ERROR_CODES"].USER_EMAIL_NOT_FOUND);
        }
        const accountKey = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$oauth2$2f$account$2d$key$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["resolveOAuthAccountKeyForAPI"])(provider, {
            idToken: token,
            accessToken: c.body.idToken.accessToken,
            refreshToken: c.body.idToken.refreshToken
        }, linkingUserInfo.data);
        const linkedAccount = await c.context.internalAdapter.findAccountByKey(accountKey);
        if (linkedAccount?.userId === session.user.id) {
            const updateData = Object.fromEntries(Object.entries({
                providerId: provider.id,
                accessToken: await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$oauth2$2f$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["setTokenUtil"])(c.body.idToken.accessToken, c.context),
                idToken: token,
                refreshToken: await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$oauth2$2f$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["setTokenUtil"])(c.body.idToken.refreshToken, c.context)
            }).filter(([_, value])=>value !== void 0));
            await c.context.internalAdapter.updateAccount(linkedAccount.id, updateData);
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$oauth2$2f$link$2d$account$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["applyUpdateUserInfoOnLink"])(c, session.user.id, linkingUserInfo.user);
            return c.json({
                url: "",
                status: true,
                redirect: false
            });
        }
        if (linkedAccount) throw __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"].from("CONFLICT", __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BASE_ERROR_CODES"].SOCIAL_ACCOUNT_ALREADY_LINKED);
        if (!c.context.trustedProviders.includes(provider.id) && !linkingUserInfo.user.emailVerified || c.context.options.account?.accountLinking?.enabled === false) throw __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"].from("UNAUTHORIZED", {
            message: "Account not linked - linking not allowed",
            code: "LINKING_NOT_ALLOWED"
        });
        if (linkingUserInfo.user.email?.toLowerCase() !== session.user.email.toLowerCase() && c.context.options.account?.accountLinking?.allowDifferentEmails !== true) throw __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"].from("UNAUTHORIZED", {
            message: "Account not linked - different emails not allowed",
            code: "LINKING_DIFFERENT_EMAILS_NOT_ALLOWED"
        });
        try {
            await c.context.internalAdapter.createAccount({
                userId: session.user.id,
                ...accountKey,
                accessToken: await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$oauth2$2f$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["setTokenUtil"])(c.body.idToken.accessToken, c.context),
                idToken: token,
                refreshToken: await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$oauth2$2f$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["setTokenUtil"])(c.body.idToken.refreshToken, c.context)
            });
        } catch  {
            throw __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"].from("EXPECTATION_FAILED", {
                message: "Account not linked - unable to create account",
                code: "LINKING_FAILED"
            });
        }
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$oauth2$2f$link$2d$account$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["applyUpdateUserInfoOnLink"])(c, session.user.id, linkingUserInfo.user);
        return c.json({
            url: "",
            status: true,
            redirect: false
        });
    }
    const idTokenNonce = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$oauth2$2f$state$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateIdTokenNonce"])(provider);
    const state = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$oauth2$2f$state$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateState"])(c, {
        link: {
            userId: session.user.id,
            email: session.user.email
        },
        additionalData: c.body.additionalData,
        idTokenNonce
    });
    const url = await provider.createAuthorizationURL({
        state: state.state,
        codeVerifier: state.codeVerifier,
        idTokenNonce,
        redirectURI: `${c.context.baseURL}${(0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$oauth2$2f$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getOAuthCallbackPath"])(provider)}`,
        scopes: c.body.scopes,
        loginHint: c.body.loginHint,
        additionalParams: c.body.additionalParams
    });
    if (!c.body.disableRedirect) c.setHeader("Location", url.toString());
    return c.json({
        url: url.toString(),
        redirect: !c.body.disableRedirect
    });
});
const unlinkAccount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$api$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAuthEndpoint"])("/unlink-account", {
    method: "POST",
    body: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["object"]({
        accountId: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]().meta({
            description: "The Better Auth account ID to unlink"
        })
    }),
    use: [
        __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$routes$2f$session$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["freshSessionMiddleware"]
    ],
    metadata: {
        openapi: {
            description: "Unlink an account",
            responses: {
                "200": {
                    description: "Success",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    status: {
                                        type: "boolean"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}, async (ctx)=>{
    const { accountId } = ctx.body;
    const accounts = await ctx.context.internalAdapter.findAccounts(ctx.context.session.user.id);
    if (accounts.length === 1 && !ctx.context.options.account?.accountLinking?.allowUnlinkingAll) throw __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"].from("BAD_REQUEST", __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BASE_ERROR_CODES"].FAILED_TO_UNLINK_LAST_ACCOUNT);
    const accountExist = accounts.find((account)=>account.id === accountId);
    if (!accountExist) throw __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"].from("BAD_REQUEST", __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BASE_ERROR_CODES"].ACCOUNT_NOT_FOUND);
    await ctx.context.internalAdapter.deleteAccount(accountExist.id);
    return ctx.json({
        status: true
    });
});
/**
* Resolves the user id an account-token operation should act on.
*
* A caller reaching the server over HTTP (a request or session headers are
* present) must have a valid session, and that session's user always wins.
* A trusted server-side `auth.api` caller with no session may instead name a
* `userId` directly. Throws `UNAUTHORIZED` when an HTTP caller is
* unauthenticated, and `USER_ID_OR_SESSION_REQUIRED` when neither a session
* nor a `userId` is available.
*
* When a durable store is authoritative, bypasses the cookie cache: these
* routes mint or refresh provider access tokens, so a server-side session
* revocation must take effect immediately rather than waiting for the cached
* cookie to expire. DB-less deployments keep the session in the cookie itself,
* so the cache is left in place for them.
*/ async function resolveUserId(ctx, userId) {
    const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$routes$2f$session$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getSessionFromCtx"])(ctx, {
        disableCookieCache: (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$routes$2f$session$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isStateful"])(ctx)
    });
    if (!session && (ctx.request || ctx.headers)) throw ctx.error("UNAUTHORIZED");
    const resolvedUserId = session?.user?.id || userId;
    if (!resolvedUserId) throw __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"].from("BAD_REQUEST", {
        message: "Either userId or session is required",
        code: "USER_ID_OR_SESSION_REQUIRED"
    });
    return resolvedUserId;
}
const accountSelectionSchema = __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["union"]([
    __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["strictObject"]({
        accountId: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]().meta({
            description: "The Better Auth account ID"
        }),
        userId: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]().meta({
            description: "The user ID associated with the account"
        }).optional()
    }),
    __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["strictObject"]({
        useAccountCookie: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["literal"](true).meta({
            description: "Select the current OAuth account from its signed cookie"
        }),
        userId: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]().meta({
            description: "The user ID associated with the account"
        }).optional()
    })
]);
function matchesAccountSelection(ctx, account, { resolvedUserId, selection }) {
    return (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$context$2f$store$2d$capabilities$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["shouldBindAccountCookieToSessionUser"])(ctx.context.options) || account.userId === resolvedUserId) && ("accountId" in selection ? account.id === selection.accountId : true);
}
/**
* Resolves an account from exactly one explicit source.
*
* A local account ID is resolved from the database. A signed account cookie is
* used only when the caller explicitly selects it, which keeps stateless OAuth
* flows usable without letting cached cookie data satisfy a row-ID lookup.
*/ async function resolveUserAccount(ctx, { resolvedUserId, selection }) {
    if ("accountId" in selection) {
        const account = (await ctx.context.internalAdapter.findAccounts(resolvedUserId)).find((candidate)=>candidate.id === selection.accountId);
        if (account) return {
            account,
            accountCookie: null
        };
    } else if (ctx.context.options.account?.storeAccountCookie) {
        const accountCookie = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$session$2d$store$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getAccountCookie"])(ctx);
        if (accountCookie && matchesAccountSelection(ctx, accountCookie, {
            resolvedUserId,
            selection
        })) return {
            account: accountCookie,
            accountCookie
        };
    }
    throw __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"].from("BAD_REQUEST", __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BASE_ERROR_CODES"].ACCOUNT_NOT_FOUND);
}
/**
* Fetches a currently-valid access token for a user's provider account,
* refreshing and persisting it when it is within five seconds of expiry.
* Shared by the `/get-access-token` endpoint and `/account-info` so both
* resolve and refresh tokens through one path.
*/ async function getValidAccessToken(ctx, { resolvedUserId, selection, account: resolvedAccount }) {
    const account = resolvedAccount ?? (await resolveUserAccount(ctx, {
        resolvedUserId,
        selection
    })).account;
    if (!matchesAccountSelection(ctx, account, {
        resolvedUserId,
        selection
    })) throw __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"].from("BAD_REQUEST", __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BASE_ERROR_CODES"].ACCOUNT_NOT_FOUND);
    const provider = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$context$2f$helpers$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getAwaitableValue"])(ctx.context.socialProviders, {
        value: account.providerId
    });
    if (!provider) throw __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"].from("BAD_REQUEST", {
        message: `Provider ${account.providerId} is not supported.`,
        code: "PROVIDER_NOT_SUPPORTED"
    });
    try {
        let newTokens = null;
        const accessTokenExpired = account.accessTokenExpiresAt && new Date(account.accessTokenExpiresAt).getTime() - Date.now() < 5e3;
        if (account.refreshToken && accessTokenExpired && provider.refreshAccessToken) {
            const refreshToken = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$oauth2$2f$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["decryptOAuthToken"])(account.refreshToken, ctx.context);
            newTokens = await provider.refreshAccessToken(refreshToken, ctx);
            const updatedData = {
                accessToken: await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$oauth2$2f$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["setTokenUtil"])(newTokens?.accessToken, ctx.context),
                accessTokenExpiresAt: newTokens?.accessTokenExpiresAt,
                refreshToken: newTokens?.refreshToken ? await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$oauth2$2f$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["setTokenUtil"])(newTokens.refreshToken, ctx.context) : account.refreshToken,
                refreshTokenExpiresAt: newTokens?.refreshTokenExpiresAt ?? account.refreshTokenExpiresAt,
                idToken: newTokens?.idToken || account.idToken
            };
            let updatedAccount = null;
            if (account.id) updatedAccount = await ctx.context.internalAdapter.updateAccount(account.id, updatedData);
            if (ctx.context.options.account?.storeAccountCookie) await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$session$2d$store$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["setAccountCookie"])(ctx, {
                ...account,
                ...updatedAccount ?? updatedData
            });
        }
        const accessTokenExpiresAt = (()=>{
            if (newTokens?.accessTokenExpiresAt) {
                if (typeof newTokens.accessTokenExpiresAt === "string") return new Date(newTokens.accessTokenExpiresAt);
                return newTokens.accessTokenExpiresAt;
            }
            if (account.accessTokenExpiresAt) {
                if (typeof account.accessTokenExpiresAt === "string") return new Date(account.accessTokenExpiresAt);
                return account.accessTokenExpiresAt;
            }
        })();
        return {
            accessToken: newTokens?.accessToken ?? await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$oauth2$2f$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["decryptOAuthToken"])(account.accessToken ?? "", ctx.context),
            accessTokenExpiresAt,
            scopes: parseStoredScopes(account.scope),
            idToken: newTokens?.idToken ?? account.idToken ?? void 0
        };
    } catch (_error) {
        throw __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"].from("BAD_REQUEST", {
            message: "Failed to get a valid access token",
            code: "FAILED_TO_GET_ACCESS_TOKEN"
        });
    }
}
const getAccessToken = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$api$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAuthEndpoint"])("/get-access-token", {
    method: "POST",
    body: accountSelectionSchema,
    metadata: {
        openapi: {
            description: "Get a valid access token, doing a refresh if needed",
            responses: {
                200: {
                    description: "A Valid access token",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    tokenType: {
                                        type: "string"
                                    },
                                    idToken: {
                                        type: "string"
                                    },
                                    accessToken: {
                                        type: "string"
                                    },
                                    accessTokenExpiresAt: {
                                        type: "string",
                                        format: "date-time"
                                    }
                                }
                            }
                        }
                    }
                },
                400: {
                    description: "Invalid refresh token or provider configuration"
                }
            }
        }
    }
}, async (ctx)=>{
    const { userId } = ctx.body;
    const tokens = await getValidAccessToken(ctx, {
        resolvedUserId: await resolveUserId(ctx, userId),
        selection: ctx.body
    });
    return ctx.json(tokens);
});
const refreshToken = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$api$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAuthEndpoint"])("/refresh-token", {
    method: "POST",
    body: accountSelectionSchema,
    metadata: {
        openapi: {
            description: "Refresh the access token using a refresh token",
            responses: {
                200: {
                    description: "Access token refreshed successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    tokenType: {
                                        type: "string"
                                    },
                                    idToken: {
                                        type: "string"
                                    },
                                    accessToken: {
                                        type: "string"
                                    },
                                    refreshToken: {
                                        type: "string"
                                    },
                                    accessTokenExpiresAt: {
                                        type: "string",
                                        format: "date-time"
                                    },
                                    refreshTokenExpiresAt: {
                                        type: "string",
                                        format: "date-time"
                                    }
                                }
                            }
                        }
                    }
                },
                400: {
                    description: "Invalid refresh token or provider configuration"
                }
            }
        }
    }
}, async (ctx)=>{
    const { userId } = ctx.body;
    const { account, accountCookie } = await resolveUserAccount(ctx, {
        resolvedUserId: await resolveUserId(ctx, userId),
        selection: ctx.body
    });
    const provider = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$context$2f$helpers$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getAwaitableValue"])(ctx.context.socialProviders, {
        value: account.providerId
    });
    if (!provider) throw __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"].from("BAD_REQUEST", {
        message: `Provider ${account.providerId} is not supported.`,
        code: "PROVIDER_NOT_SUPPORTED"
    });
    if (!provider.refreshAccessToken) throw __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"].from("BAD_REQUEST", {
        message: `Provider ${account.providerId} does not support token refreshing.`,
        code: "TOKEN_REFRESH_NOT_SUPPORTED"
    });
    const refreshToken = account.refreshToken ?? void 0;
    if (!refreshToken) throw __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"].from("BAD_REQUEST", {
        message: "Refresh token not found",
        code: "REFRESH_TOKEN_NOT_FOUND"
    });
    try {
        const decryptedRefreshToken = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$oauth2$2f$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["decryptOAuthToken"])(refreshToken, ctx.context);
        const tokens = await provider.refreshAccessToken(decryptedRefreshToken, ctx);
        const resolvedRefreshToken = tokens.refreshToken ? await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$oauth2$2f$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["setTokenUtil"])(tokens.refreshToken, ctx.context) : refreshToken;
        const resolvedRefreshTokenExpiresAt = tokens.refreshTokenExpiresAt ?? account.refreshTokenExpiresAt;
        const updatedTokenData = {
            accessToken: await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$oauth2$2f$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["setTokenUtil"])(tokens.accessToken, ctx.context),
            refreshToken: resolvedRefreshToken,
            accessTokenExpiresAt: tokens.accessTokenExpiresAt,
            refreshTokenExpiresAt: resolvedRefreshTokenExpiresAt,
            idToken: tokens.idToken || account.idToken
        };
        let updatedAccount = null;
        if (account.id) /**
		* `scope` intentionally omitted. Refresh response may be narrower.
		*
		* @see {@link Account.scope}
		*/ updatedAccount = await ctx.context.internalAdapter.updateAccount(account.id, updatedTokenData);
        if (accountCookie?.id === account.id && ctx.context.options.account?.storeAccountCookie) await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$session$2d$store$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["setAccountCookie"])(ctx, {
            ...accountCookie,
            ...updatedAccount ?? updatedTokenData
        });
        const responseScope = updatedAccount?.scope ?? account.scope;
        return ctx.json({
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken ?? decryptedRefreshToken,
            accessTokenExpiresAt: tokens.accessTokenExpiresAt,
            refreshTokenExpiresAt: resolvedRefreshTokenExpiresAt,
            scope: responseScope,
            idToken: tokens.idToken || account.idToken,
            providerId: account.providerId,
            accountId: account.id
        });
    } catch (_error) {
        throw __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"].from("BAD_REQUEST", {
            message: "Failed to refresh access token",
            code: "FAILED_TO_REFRESH_ACCESS_TOKEN"
        });
    }
});
const accountInfo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$api$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAuthEndpoint"])("/account-info", {
    method: "GET",
    metadata: {
        openapi: {
            description: "Get the account info provided by the provider",
            responses: {
                "200": {
                    description: "Success",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    user: {
                                        type: "object",
                                        properties: {
                                            name: {
                                                type: "string"
                                            },
                                            email: {
                                                type: "string",
                                                nullable: true
                                            },
                                            image: {
                                                type: "string"
                                            },
                                            emailVerified: {
                                                type: "boolean"
                                            }
                                        },
                                        required: [
                                            "emailVerified"
                                        ]
                                    },
                                    account: {
                                        type: "object",
                                        properties: {
                                            id: {
                                                type: "string"
                                            },
                                            providerId: {
                                                type: "string"
                                            },
                                            accountId: {
                                                type: "string"
                                            }
                                        },
                                        required: [
                                            "id",
                                            "providerId",
                                            "accountId"
                                        ],
                                        additionalProperties: false
                                    },
                                    data: {
                                        type: "object",
                                        properties: {},
                                        additionalProperties: true
                                    }
                                },
                                required: [
                                    "user",
                                    "data",
                                    "account"
                                ],
                                additionalProperties: false
                            }
                        }
                    }
                }
            }
        }
    },
    query: accountSelectionSchema
}, async (ctx)=>{
    const { userId } = ctx.query;
    const resolvedUserId = await resolveUserId(ctx, userId);
    const { account } = await resolveUserAccount(ctx, {
        resolvedUserId,
        selection: ctx.query
    });
    const provider = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$context$2f$helpers$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getAwaitableValue"])(ctx.context.socialProviders, {
        value: account.providerId
    });
    if (!provider) throw __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"].from("BAD_REQUEST", {
        message: "Account is not associated with a configured social provider.",
        code: "PROVIDER_NOT_CONFIGURED"
    });
    const tokens = await getValidAccessToken(ctx, {
        resolvedUserId,
        selection: ctx.query,
        account
    });
    if (!tokens.accessToken) throw __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"].from("BAD_REQUEST", {
        message: "Access token not found",
        code: "ACCESS_TOKEN_NOT_FOUND"
    });
    const info = await provider.getUserInfo({
        ...tokens,
        accessToken: tokens.accessToken
    });
    if (!info) throw __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"].from("UNAUTHORIZED", __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BASE_ERROR_CODES"].FAILED_TO_GET_USER_INFO);
    return ctx.json({
        ...info,
        account: {
            id: account.id,
            providerId: account.providerId,
            accountId: account.accountId
        }
    });
});
;
}),
"[project]/examples/nextjs/node_modules/better-auth/dist/api/routes/callback.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "callbackOAuth",
    ()=>callbackOAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$is$2d$api$2d$error$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/utils/is-api-error.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/cookies/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$context$2f$helpers$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/context/helpers.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$oauth2$2f$errors$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/oauth2/errors.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$oauth2$2f$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/oauth2/utils.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$oauth2$2f$link$2d$account$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/oauth2/link-account.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$oauth2$2f$state$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/oauth2/state.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$oauth2$2f$callback$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/oauth2/callback.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$hide$2d$metadata$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/utils/hide-metadata.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$url$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/utils/url.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$api$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/api/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/zod/v4/classic/schemas.js [app-route] (ecmascript)");
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
//#region src/api/routes/callback.ts
const schema = __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["object"]({
    code: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]().optional(),
    error: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]().optional(),
    device_id: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]().optional(),
    error_description: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]().optional(),
    state: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]().optional(),
    user: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]().optional(),
    iss: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]().optional()
});
const callbackOAuth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$api$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAuthEndpoint"])("/callback/:id", {
    method: [
        "GET",
        "POST"
    ],
    operationId: "handleOAuthCallback",
    body: schema.optional(),
    query: schema.optional(),
    metadata: {
        ...__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$hide$2d$metadata$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["HIDE_METADATA"],
        allowedMediaTypes: [
            "application/x-www-form-urlencoded",
            "application/json"
        ]
    }
}, async (c)=>{
    let queryOrBody;
    const defaultErrorURL = c.context.options.onAPIError?.errorURL || `${c.context.baseURL}/error`;
    if (c.method === "POST") {
        const postData = c.body ? schema.parse(c.body) : {};
        const queryData = c.query ? schema.parse(c.query) : {};
        const mergedData = schema.parse({
            ...postData,
            ...queryData
        });
        const params = new URLSearchParams();
        for (const [key, value] of Object.entries(mergedData))if (value !== void 0 && value !== null) params.set(key, String(value));
        const redirectURL = `${c.context.baseURL}/callback/${c.params.id}?${params.toString()}`;
        throw c.redirect(redirectURL);
    }
    try {
        if (c.method === "GET") queryOrBody = schema.parse(c.query);
        else if (c.method === "POST") queryOrBody = schema.parse(c.body);
        else throw new Error("Unsupported method");
    } catch (e) {
        c.context.logger.error("INVALID_CALLBACK_REQUEST", e);
        const redirectURL = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$url$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["appendQueryParams"])(defaultErrorURL, new URLSearchParams({
            error: "invalid_callback_request"
        }));
        throw c.redirect(redirectURL);
    }
    const { code, error, state, error_description, device_id, user: userData, iss } = queryOrBody;
    if (state === void 0 && code) {
        const provider = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$context$2f$helpers$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getAwaitableValue"])(c.context.socialProviders, {
            value: c.params.id
        });
        if (provider?.allowIdpInitiated) {
            const idTokenNonce = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$oauth2$2f$state$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateIdTokenNonce"])(provider);
            const { state: freshState, codeVerifier } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$oauth2$2f$state$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateState"])(c, {
                idTokenNonce
            });
            const authUrl = await provider.createAuthorizationURL({
                state: freshState,
                codeVerifier,
                idTokenNonce,
                redirectURI: `${c.context.baseURL}${(0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$oauth2$2f$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getOAuthCallbackPath"])(provider)}`
            });
            throw c.redirect(authUrl.toString());
        }
    }
    if (!state) {
        c.context.logger.error("State not found", error);
        const redirectURL = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$url$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["appendQueryParams"])(defaultErrorURL, new URLSearchParams({
            error: "state_not_found"
        }));
        throw c.redirect(redirectURL);
    }
    const { codeVerifier, callbackURL, link, errorURL, newUserURL, requestSignUp, idTokenNonce } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$oauth2$2f$state$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseState"])(c);
    function redirectOnError(error, description) {
        const baseURL = errorURL ?? defaultErrorURL;
        const params = new URLSearchParams({
            error
        });
        if (description) params.set("error_description", description);
        const redirectURL = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$url$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["appendQueryParams"])(baseURL, params);
        throw c.redirect(redirectURL);
    }
    if (error) redirectOnError(error, error_description);
    if (!code) {
        c.context.logger.warn("Code not found");
        throw redirectOnError(__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$oauth2$2f$errors$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["OAUTH_CALLBACK_ERROR_CODES"].NO_CODE);
    }
    const provider = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$context$2f$helpers$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getAwaitableValue"])(c.context.socialProviders, {
        value: c.params.id
    });
    if (!provider) {
        c.context.logger.warn("OAuth provider not found", {
            providerId: c.params.id
        });
        throw redirectOnError(__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$oauth2$2f$errors$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["OAUTH_CALLBACK_ERROR_CODES"].PROVIDER_NOT_FOUND);
    }
    const exchanged = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$oauth2$2f$callback$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["exchangeOAuthCallback"])(c, provider, {
        code,
        codeVerifier,
        iss,
        deviceId: device_id,
        user: userData,
        idTokenNonce
    });
    if (exchanged.error) throw redirectOnError(exchanged.error);
    const { tokens, userInfo, providerProfile, accountKey } = exchanged;
    const { accountId } = accountKey;
    if (!callbackURL) {
        c.context.logger.error("No callback URL found");
        throw redirectOnError(__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$oauth2$2f$errors$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["OAUTH_CALLBACK_ERROR_CODES"].NO_CALLBACK_URL);
    }
    const accountData = {
        ...accountKey,
        ...tokens,
        scope: tokens.scopes?.join(",")
    };
    if (link) {
        const linkResult = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$oauth2$2f$link$2d$account$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["linkOAuthAccount"])(c, {
            link,
            userInfo,
            account: accountData,
            profile: providerProfile,
            scopes: tokens.scopes
        });
        if (!linkResult.linked) return redirectOnError(linkResult.error.code, linkResult.error.message);
        throw c.redirect(callbackURL);
    }
    if (!userInfo.email) {
        c.context.logger.error((0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$oauth2$2f$errors$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["missingEmailLogMessage"])(provider.id));
        return redirectOnError(__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$oauth2$2f$errors$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["OAUTH_CALLBACK_ERROR_CODES"].EMAIL_NOT_FOUND);
    }
    let result;
    try {
        result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$oauth2$2f$link$2d$account$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["handleOAuthUserInfo"])(c, {
            userInfo: {
                ...userInfo,
                id: accountId,
                email: userInfo.email,
                name: userInfo.name || ""
            },
            account: accountData,
            callbackURL,
            disableSignUp: provider.disableImplicitSignUp && !requestSignUp || provider.options?.disableSignUp,
            overrideUserInfo: provider.options?.overrideUserInfoOnSignIn,
            source: {
                method: "oauth",
                oauth: {
                    providerId: provider.id,
                    profile: providerProfile
                }
            }
        });
    } catch (e) {
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$is$2d$api$2d$error$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isAPIError"])(e) && e.body?.code) redirectOnError(e.body.code, e.body.message);
        throw e;
    }
    if (result.error) {
        c.context.logger.error(result.error.split(" ").join("_"));
        return redirectOnError(result.error.split(" ").join("_"));
    }
    const { session, user } = result.data;
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["setSessionCookie"])(c, {
        session,
        user
    });
    let toRedirectTo;
    try {
        toRedirectTo = (result.isRegister ? newUserURL || callbackURL : callbackURL).toString();
    } catch  {
        toRedirectTo = result.isRegister ? newUserURL || callbackURL : callbackURL;
    }
    throw c.redirect(toRedirectTo);
});
;
}),
"[project]/examples/nextjs/node_modules/better-auth/dist/api/routes/email-verification.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createEmailVerificationToken",
    ()=>createEmailVerificationToken,
    "sendVerificationEmail",
    ()=>sendVerificationEmail,
    "sendVerificationEmailFn",
    ()=>sendVerificationEmailFn,
    "verifyEmail",
    ()=>verifyEmail
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$middlewares$2f$origin$2d$check$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/api/middlewares/origin-check.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$crypto$2f$jwt$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/crypto/jwt.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$schema$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/db/schema.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/cookies/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$routes$2f$session$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/api/routes/session.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$request$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/utils/request.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/error/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/error/codes.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$url$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/utils/url.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$api$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/api/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/zod/v4/classic/schemas.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$verify$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/jose/dist/webapi/jwt/verify.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/jose/dist/webapi/util/errors.js [app-route] (ecmascript)");
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
//#region src/api/routes/email-verification.ts
async function createEmailVerificationToken(secret, email, updateTo, expiresIn = 3600, extraPayload) {
    return await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$crypto$2f$jwt$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["signJWT"])({
        email: email.toLowerCase(),
        updateTo: updateTo?.toLowerCase(),
        ...extraPayload
    }, secret, expiresIn);
}
/**
* A function to send a verification email to the user
*/ async function sendVerificationEmailFn(ctx, user) {
    if (!ctx.context.options.emailVerification?.sendVerificationEmail) {
        ctx.context.logger.error("Verification email isn't enabled.");
        throw __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"].from("BAD_REQUEST", __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BASE_ERROR_CODES"].VERIFICATION_EMAIL_NOT_ENABLED);
    }
    const token = await createEmailVerificationToken(ctx.context.secret, user.email, void 0, ctx.context.options.emailVerification?.expiresIn);
    const callbackURL = ctx.body.callbackURL ? encodeURIComponent(ctx.body.callbackURL) : encodeURIComponent("/");
    const url = `${ctx.context.baseURL}/verify-email?token=${token}&callbackURL=${callbackURL}`;
    await ctx.context.options.emailVerification.sendVerificationEmail({
        user,
        url,
        token
    }, ctx.request);
}
const sendVerificationEmail = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$api$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAuthEndpoint"])("/send-verification-email", {
    method: "POST",
    operationId: "sendVerificationEmail",
    cloneRequest: true,
    body: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["object"]({
        email: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["email"]().meta({
            description: "The email to send the verification email to"
        }),
        callbackURL: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]().meta({
            description: "The URL to use for email verification callback"
        }).optional()
    }),
    metadata: {
        openapi: {
            operationId: "sendVerificationEmail",
            description: "Send a verification email to the user",
            requestBody: {
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                email: {
                                    type: "string",
                                    description: "The email to send the verification email to",
                                    example: "user@example.com"
                                },
                                callbackURL: {
                                    type: "string",
                                    description: "The URL to use for email verification callback",
                                    example: "https://example.com/callback",
                                    nullable: true
                                }
                            },
                            required: [
                                "email"
                            ]
                        }
                    }
                }
            },
            responses: {
                "200": {
                    description: "Success",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    status: {
                                        type: "boolean",
                                        description: "Indicates if the email was sent successfully",
                                        example: true
                                    }
                                }
                            }
                        }
                    }
                },
                "400": {
                    description: "Bad Request",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: {
                                        type: "string",
                                        description: "Error message",
                                        example: "Verification email isn't enabled"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}, async (ctx)=>{
    if (!ctx.context.options.emailVerification?.sendVerificationEmail) {
        ctx.context.logger.error("Verification email isn't enabled.");
        throw __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"].from("BAD_REQUEST", __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BASE_ERROR_CODES"].VERIFICATION_EMAIL_NOT_ENABLED);
    }
    const { email } = ctx.body;
    const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$routes$2f$session$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getSessionFromCtx"])(ctx);
    if (!session) {
        /**
		* Enforce a constant-time floor so an attacker cannot distinguish
		* "email not found / already verified" (fast local JWT sign) from
		* "email found and unverified" (slow external email-send) by
		* comparing response times.
		*/ const MINIMUM_MS = 500;
        const start = Date.now();
        const user = await ctx.context.internalAdapter.findUserByEmail(email);
        let error;
        if (!user || user.user.emailVerified) await createEmailVerificationToken(ctx.context.secret, email, void 0, ctx.context.options.emailVerification?.expiresIn);
        else try {
            await sendVerificationEmailFn(ctx, user.user);
        } catch (e) {
            error = e;
        }
        const remaining = MINIMUM_MS - (Date.now() - start);
        if (remaining > 0) await new Promise((resolve)=>setTimeout(resolve, remaining));
        if (error) throw error;
        return ctx.json({
            status: true
        });
    }
    if (session?.user.email.toLowerCase() !== email.toLowerCase()) throw __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"].from("BAD_REQUEST", __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BASE_ERROR_CODES"].EMAIL_MISMATCH);
    if (session?.user.emailVerified) throw __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"].from("BAD_REQUEST", __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BASE_ERROR_CODES"].EMAIL_ALREADY_VERIFIED);
    await sendVerificationEmailFn(ctx, session.user);
    return ctx.json({
        status: true
    });
});
const verifyEmail = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$api$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAuthEndpoint"])("/verify-email", {
    method: "GET",
    operationId: "verifyEmail",
    query: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["object"]({
        token: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]().meta({
            description: "The token to verify the email"
        }),
        callbackURL: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]().meta({
            description: "The URL to redirect to after email verification"
        }).optional()
    }),
    use: [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$middlewares$2f$origin$2d$check$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["originCheck"])((ctx)=>ctx.query.callbackURL)
    ],
    metadata: {
        openapi: {
            description: "Verify the email of the user",
            parameters: [
                {
                    name: "token",
                    in: "query",
                    description: "The token to verify the email",
                    required: true,
                    schema: {
                        type: "string"
                    }
                },
                {
                    name: "callbackURL",
                    in: "query",
                    description: "The URL to redirect to after email verification",
                    required: false,
                    schema: {
                        type: "string"
                    }
                }
            ],
            responses: {
                "200": {
                    description: "Success",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    user: {
                                        type: "object",
                                        $ref: "#/components/schemas/User"
                                    },
                                    status: {
                                        type: "boolean",
                                        description: "Indicates if the email was verified successfully"
                                    }
                                },
                                required: [
                                    "user",
                                    "status"
                                ]
                            }
                        }
                    }
                }
            }
        }
    }
}, async (ctx)=>{
    function redirectOnError(error) {
        if (ctx.query.callbackURL) {
            const params = new URLSearchParams({
                error: error.code
            });
            const redirectURL = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$url$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["appendQueryParams"])(ctx.query.callbackURL, params);
            throw ctx.redirect(redirectURL);
        }
        throw __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"].from("UNAUTHORIZED", error);
    }
    const { token } = ctx.query;
    let jwt;
    try {
        jwt = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$verify$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jwtVerify"])(token, new TextEncoder().encode(ctx.context.secret), {
            algorithms: [
                "HS256"
            ]
        });
    } catch (e) {
        if (e instanceof __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["JWTExpired"]) return redirectOnError(__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BASE_ERROR_CODES"].TOKEN_EXPIRED);
        return redirectOnError(__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BASE_ERROR_CODES"].INVALID_TOKEN);
    }
    const parsed = __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["object"]({
        email: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["email"](),
        updateTo: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]().optional(),
        requestType: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]().optional()
    }).parse(jwt.payload);
    const user = await ctx.context.internalAdapter.findUserByEmail(parsed.email);
    if (!user) return redirectOnError(__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BASE_ERROR_CODES"].USER_NOT_FOUND);
    if (parsed.updateTo) {
        const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$routes$2f$session$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getSessionFromCtx"])(ctx);
        if (session && session.user.email !== parsed.email) return redirectOnError(__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BASE_ERROR_CODES"].INVALID_USER);
        switch(parsed.requestType){
            /**
			* User clicks confirmation -> sends verification to new email
			*/ case "change-email-confirmation":
                {
                    const newToken = await createEmailVerificationToken(ctx.context.secret, parsed.email, parsed.updateTo, ctx.context.options.emailVerification?.expiresIn, {
                        requestType: "change-email-verification"
                    });
                    const updateCallbackURL = ctx.query.callbackURL ? encodeURIComponent(ctx.query.callbackURL) : encodeURIComponent("/");
                    const url = `${ctx.context.baseURL}/verify-email?token=${newToken}&callbackURL=${updateCallbackURL}`;
                    if (ctx.context.options.emailVerification?.sendVerificationEmail) await ctx.context.runInBackgroundOrAwait(ctx.context.options.emailVerification.sendVerificationEmail({
                        user: {
                            ...user.user,
                            email: parsed.updateTo
                        },
                        url,
                        token: newToken
                    }, (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$request$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["safeCloneRequest"])(ctx.request)));
                    if (ctx.query.callbackURL) throw ctx.redirect(ctx.query.callbackURL);
                    return ctx.json({
                        status: true
                    });
                }
            /**
			* User clicks verification -> updates email
			*/ case "change-email-verification":
                {
                    let activeSession = session;
                    if (!activeSession) {
                        const newSession = await ctx.context.internalAdapter.createSession(user.user.id);
                        if (!newSession) throw __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"].from("INTERNAL_SERVER_ERROR", __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BASE_ERROR_CODES"].FAILED_TO_CREATE_SESSION);
                        activeSession = {
                            session: newSession,
                            user: user.user
                        };
                    }
                    const updatedUser = await ctx.context.internalAdapter.updateUserByEmail(parsed.email, {
                        email: parsed.updateTo,
                        emailVerified: true
                    });
                    if (ctx.context.options.emailVerification?.afterEmailVerification) await ctx.context.options.emailVerification.afterEmailVerification(updatedUser, ctx.request);
                    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["setSessionCookie"])(ctx, {
                        session: activeSession.session,
                        user: {
                            ...activeSession.user,
                            email: parsed.updateTo,
                            emailVerified: true
                        }
                    });
                    if (ctx.query.callbackURL) throw ctx.redirect(ctx.query.callbackURL);
                    return ctx.json({
                        status: true,
                        user: (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$schema$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseUserOutput"])(ctx.context.options, updatedUser)
                    });
                }
            /**
			* Legacy flow
			*
			* - skips two-step verification
			* - updates email immediately
			*/ default:
                {
                    let activeSession = session;
                    if (!activeSession) {
                        const newSession = await ctx.context.internalAdapter.createSession(user.user.id);
                        if (!newSession) throw __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"].from("INTERNAL_SERVER_ERROR", __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BASE_ERROR_CODES"].FAILED_TO_CREATE_SESSION);
                        activeSession = {
                            session: newSession,
                            user: user.user
                        };
                    }
                    const updatedUser = await ctx.context.internalAdapter.updateUserByEmail(parsed.email, {
                        email: parsed.updateTo,
                        emailVerified: false
                    });
                    const newToken = await createEmailVerificationToken(ctx.context.secret, parsed.updateTo);
                    const updateCallbackURL = ctx.query.callbackURL ? encodeURIComponent(ctx.query.callbackURL) : encodeURIComponent("/");
                    if (ctx.context.options.emailVerification?.sendVerificationEmail) await ctx.context.runInBackgroundOrAwait(ctx.context.options.emailVerification.sendVerificationEmail({
                        user: updatedUser,
                        url: `${ctx.context.baseURL}/verify-email?token=${newToken}&callbackURL=${updateCallbackURL}`,
                        token: newToken
                    }, (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$request$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["safeCloneRequest"])(ctx.request)));
                    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["setSessionCookie"])(ctx, {
                        session: activeSession.session,
                        user: {
                            ...activeSession.user,
                            email: parsed.updateTo,
                            emailVerified: false
                        }
                    });
                    if (ctx.query.callbackURL) throw ctx.redirect(ctx.query.callbackURL);
                    return ctx.json({
                        status: true,
                        user: (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$schema$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseUserOutput"])(ctx.context.options, updatedUser)
                    });
                }
        }
    }
    if (user.user.emailVerified) {
        if (ctx.query.callbackURL) throw ctx.redirect(ctx.query.callbackURL);
        return ctx.json({
            status: true,
            user: null
        });
    }
    if (ctx.context.options.emailVerification?.beforeEmailVerification) await ctx.context.options.emailVerification.beforeEmailVerification(user.user, ctx.request);
    const updatedUser = await ctx.context.internalAdapter.updateUserByEmail(parsed.email, {
        emailVerified: true
    });
    if (ctx.context.options.emailVerification?.afterEmailVerification) await ctx.context.options.emailVerification.afterEmailVerification(updatedUser, ctx.request);
    if (ctx.context.options.emailVerification?.autoSignInAfterVerification) {
        const currentSession = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$routes$2f$session$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getSessionFromCtx"])(ctx);
        if (!currentSession || currentSession.user.email !== parsed.email) {
            const session = await ctx.context.internalAdapter.createSession(user.user.id);
            if (!session) throw __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"].from("INTERNAL_SERVER_ERROR", __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BASE_ERROR_CODES"].FAILED_TO_CREATE_SESSION);
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["setSessionCookie"])(ctx, {
                session,
                user: {
                    ...user.user,
                    emailVerified: true
                }
            });
        } else await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["setSessionCookie"])(ctx, {
            session: currentSession.session,
            user: {
                ...currentSession.user,
                emailVerified: true
            }
        });
    }
    if (ctx.query.callbackURL) throw ctx.redirect(ctx.query.callbackURL);
    return ctx.json({
        status: true,
        user: null
    });
});
;
}),
"[project]/examples/nextjs/node_modules/better-auth/dist/api/routes/error.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "error",
    ()=>error
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$hide$2d$metadata$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/utils/hide-metadata.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$env$2d$impl$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/env/env-impl.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$url$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/utils/url.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$api$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/api/index.mjs [app-route] (ecmascript)");
;
;
;
;
//#region src/api/routes/error.ts
function sanitize(input) {
    return input.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/&(?!amp;|lt;|gt;|quot;|#39;|#x[0-9a-fA-F]+;|#[0-9]+;)/g, "&amp;");
}
const html = (options, code = "Unknown", description = null)=>{
    const custom = options.onAPIError?.customizeDefaultErrorPage;
    return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Error</title>
    <style>
      * {
        box-sizing: border-box;
      }
      body {
        font-family: ${custom?.font?.defaultFamily || "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"};
        background: ${custom?.colors?.background || "var(--background)"};
        color: var(--foreground);
        margin: 0;
      }
      :root,
      :host {
        --spacing: 0.25rem;
        --container-md: 28rem;
        --text-sm: ${custom?.size?.textSm || "0.875rem"};
        --text-sm--line-height: calc(1.25 / 0.875);
        --text-2xl: ${custom?.size?.text2xl || "1.5rem"};
        --text-2xl--line-height: calc(2 / 1.5);
        --text-4xl: ${custom?.size?.text4xl || "2.25rem"};
        --text-4xl--line-height: calc(2.5 / 2.25);
        --text-6xl: ${custom?.size?.text6xl || "3rem"};
        --text-6xl--line-height: 1;
        --font-weight-medium: 500;
        --font-weight-semibold: 600;
        --font-weight-bold: 700;
        --default-transition-duration: 150ms;
        --default-transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        --radius: ${custom?.size?.radiusSm || "0.625rem"};
        --default-mono-font-family: ${custom?.font?.monoFamily || "var(--font-geist-mono)"};
        --primary: ${custom?.colors?.primary || "black"};
        --primary-foreground: ${custom?.colors?.primaryForeground || "white"};
        --background: ${custom?.colors?.background || "white"};
        --foreground: ${custom?.colors?.foreground || "oklch(0.271 0 0)"};
        --border: ${custom?.colors?.border || "oklch(0.89 0 0)"};
        --destructive: ${custom?.colors?.destructive || "oklch(0.55 0.15 25.723)"};
        --muted-foreground: ${custom?.colors?.mutedForeground || "oklch(0.545 0 0)"};
        --corner-border: ${custom?.colors?.cornerBorder || "#404040"};
      }

      button, .btn {
        cursor: pointer;
        background: none;
        border: none;
        color: inherit;
        font: inherit;
        transition: all var(--default-transition-duration)
          var(--default-transition-timing-function);
      }
      button:hover, .btn:hover {
        opacity: 0.8;
      }

      @media (prefers-color-scheme: dark) {
        :root,
        :host {
          --primary: ${custom?.colors?.primary || "white"};
          --primary-foreground: ${custom?.colors?.primaryForeground || "black"};
          --background: ${custom?.colors?.background || "oklch(0.15 0 0)"};
          --foreground: ${custom?.colors?.foreground || "oklch(0.98 0 0)"};
          --border: ${custom?.colors?.border || "oklch(0.27 0 0)"};
          --destructive: ${custom?.colors?.destructive || "oklch(0.65 0.15 25.723)"};
          --muted-foreground: ${custom?.colors?.mutedForeground || "oklch(0.65 0 0)"};
          --corner-border: ${custom?.colors?.cornerBorder || "#a0a0a0"};
        }
      }
      @media (max-width: 640px) {
        :root, :host {
          --text-6xl: 2.5rem;
          --text-2xl: 1.25rem;
          --text-sm: 0.8125rem;
        }
      }
      @media (max-width: 480px) {
        :root, :host {
          --text-6xl: 2rem;
          --text-2xl: 1.125rem;
        }
      }
    </style>
  </head>
  <body style="width: 100vw; min-height: 100vh; overflow-x: hidden; overflow-y: auto;">
    <div
        style="
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 1.5rem;
            position: relative;
            width: 100%;
            min-height: 100vh;
            padding: 1rem;
        "
        >
${custom?.disableBackgroundGrid ? "" : `
      <div
        style="
          position: absolute;
          inset: 0;
          background-image: linear-gradient(to right, ${custom?.colors?.gridColor || "var(--border)"} 1px, transparent 1px),
            linear-gradient(to bottom, ${custom?.colors?.gridColor || "var(--border)"} 1px, transparent 1px);
          background-size: 40px 40px;
          opacity: 0.6;
          pointer-events: none;
          width: 100vw;
          height: 100vh;
        "
      ></div>
      <div
        style="
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: ${custom?.colors?.background || "var(--background)"};
          mask-image: radial-gradient(ellipse at center, transparent 20%, black);
          -webkit-mask-image: radial-gradient(ellipse at center, transparent 20%, black);
          pointer-events: none;
        "
      ></div>
`}

<div
  style="
    position: relative;
    z-index: 10;
    border: 2px solid var(--border);
    background: ${custom?.colors?.cardBackground || "var(--background)"};
    padding: 1.5rem;
    max-width: 42rem;
    width: 100%;
  "
>
    ${custom?.disableCornerDecorations ? "" : `
        <!-- Corner decorations -->
        <div
          style="
            position: absolute;
            top: -2px;
            left: -2px;
            width: 2rem;
            height: 2rem;
            border-top: 4px solid var(--corner-border);
            border-left: 4px solid var(--corner-border);
          "
        ></div>
        <div
          style="
            position: absolute;
            top: -2px;
            right: -2px;
            width: 2rem;
            height: 2rem;
            border-top: 4px solid var(--corner-border);
            border-right: 4px solid var(--corner-border);
          "
        ></div>
  
        <div
          style="
            position: absolute;
            bottom: -2px;
            left: -2px;
            width: 2rem;
            height: 2rem;
            border-bottom: 4px solid var(--corner-border);
            border-left: 4px solid var(--corner-border);
          "
        ></div>
        <div
          style="
            position: absolute;
            bottom: -2px;
            right: -2px;
            width: 2rem;
            height: 2rem;
            border-bottom: 4px solid var(--corner-border);
            border-right: 4px solid var(--corner-border);
          "
        ></div>`}

        <div style="text-align: center; margin-bottom: 1.5rem;">
          <div style="margin-bottom: 1.5rem;">
            <div
              style="
                display: inline-block;
                border: 2px solid ${custom?.disableTitleBorder ? "transparent" : custom?.colors?.titleBorder || "var(--destructive)"};
                padding: 0.375rem 1rem;
              "
            >
              <h1
                style="
                  font-size: var(--text-6xl);
                  font-weight: var(--font-weight-semibold);
                  color: ${custom?.colors?.titleColor || "var(--foreground)"};
                  letter-spacing: -0.02em;
                  margin: 0;
                "
              >
                ERROR
              </h1>
            </div>
            <div
              style="
                height: 2px;
                background-color: var(--border);
                width: calc(100% + 3rem);
                margin-left: -1.5rem;
                margin-top: 1.5rem;
              "
            ></div>
          </div>

          <h2
            style="
              font-size: var(--text-2xl);
              font-weight: var(--font-weight-semibold);
              color: var(--foreground);
              margin: 0 0 1rem;
            "
          >
            Something went wrong
          </h2>

          <div
            style="
                display: inline-flex;
                align-items: center;
                gap: 0.5rem;
                border: 2px solid var(--border);
                background-color: var(--muted);
                padding: 0.375rem 0.75rem;
                margin: 0 0 1rem;
                flex-wrap: wrap;
                justify-content: center;
            "
            >
            <span
                style="
                font-size: 0.75rem;
                color: var(--muted-foreground);
                font-weight: var(--font-weight-semibold);
                "
            >
                CODE:
            </span>
            <span
                style="
                font-size: var(--text-sm);
                font-family: var(--default-mono-font-family, monospace);
                color: var(--foreground);
                word-break: break-all;
                "
            >
                ${sanitize(code)}
            </span>
            </div>

          <p
            style="
              color: var(--muted-foreground);
              max-width: 28rem;
              margin: 0 auto;
              font-size: var(--text-sm);
              line-height: 1.5;
              text-wrap: pretty;
            "
          >
            ${!description ? `We encountered an unexpected error. Please try again or return to the home page. If you're a developer, you can find <a href='https://better-auth.com/docs/reference/errors/${encodeURIComponent(code)}' target='_blank' rel="noopener noreferrer" style='color: var(--foreground); text-decoration: underline;'>more information about the error</a>.` : description}
          </p>
        </div>

        <div
          style="
            display: flex;
            gap: 0.75rem;
            margin-top: 1.5rem;
            justify-content: center;
            flex-wrap: wrap;
          "
        >
          <a
            href="/"
            style="
              text-decoration: none;
            "
          >
            <div
              style="
                border: 2px solid var(--border);
                background: var(--primary);
                color: var(--primary-foreground);
                padding: 0.5rem 1rem;
                border-radius: 0;
                white-space: nowrap;
              "
              class="btn"
            >
              Go Home
            </div>
          </a>
          <a
            href="https://better-auth.com/docs/reference/errors/${encodeURIComponent(code)}?askai=${encodeURIComponent(`What does the error code ${code} mean?`)}"
            target="_blank"
            rel="noopener noreferrer"
            style="
              text-decoration: none;
            "
          >
            <div
              style="
                border: 2px solid var(--border);
                background: transparent;
                color: var(--foreground);
                padding: 0.5rem 1rem;
                border-radius: 0;
                white-space: nowrap;
              "
              class="btn"
            >
              Ask AI
            </div>
          </a>
        </div>
      </div>
    </div>
  </body>
</html>`;
};
const error = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$api$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAuthEndpoint"])("/error", {
    method: "GET",
    metadata: {
        ...__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$hide$2d$metadata$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["HIDE_METADATA"],
        openapi: {
            description: "Displays an error page",
            responses: {
                "200": {
                    description: "Success",
                    content: {
                        "text/html": {
                            schema: {
                                type: "string",
                                description: "The HTML content of the error page"
                            }
                        }
                    }
                }
            }
        }
    }
}, async (c)=>{
    const url = new URL(c.request?.url || "");
    const unsanitizedCode = url.searchParams.get("error") || "UNKNOWN";
    const unsanitizedDescription = url.searchParams.get("error_description") || null;
    const safeCode = /^[\'A-Za-z0-9_-]+$/.test(unsanitizedCode || "") ? unsanitizedCode : "UNKNOWN";
    const safeDescription = unsanitizedDescription ? sanitize(unsanitizedDescription) : null;
    const params = new URLSearchParams();
    params.set("error", safeCode);
    if (unsanitizedDescription) params.set("error_description", unsanitizedDescription);
    const options = c.context.options;
    const errorURL = options.onAPIError?.errorURL;
    if (errorURL) {
        const redirectURL = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$url$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["appendQueryParams"])(errorURL, params);
        return new Response(null, {
            status: 302,
            headers: {
                Location: redirectURL
            }
        });
    }
    if (__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$env$2d$impl$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isProduction"] && !options.onAPIError?.customizeDefaultErrorPage) return new Response(null, {
        status: 302,
        headers: {
            Location: `/?${params.toString()}`
        }
    });
    return new Response(html(c.context.options, safeCode, safeDescription), {
        headers: {
            "Content-Type": "text/html"
        }
    });
});
;
}),
"[project]/examples/nextjs/node_modules/better-auth/dist/api/routes/ok.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ok",
    ()=>ok
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$hide$2d$metadata$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/utils/hide-metadata.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$api$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/api/index.mjs [app-route] (ecmascript)");
;
;
//#region src/api/routes/ok.ts
const ok = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$api$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAuthEndpoint"])("/ok", {
    method: "GET",
    metadata: {
        ...__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$hide$2d$metadata$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["HIDE_METADATA"],
        openapi: {
            description: "Check if the API is working",
            responses: {
                "200": {
                    description: "API is working",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    ok: {
                                        type: "boolean",
                                        description: "Indicates if the API is working"
                                    }
                                },
                                required: [
                                    "ok"
                                ]
                            }
                        }
                    }
                }
            }
        }
    }
}, async (ctx)=>{
    return ctx.json({
        ok: true
    });
});
;
}),
"[project]/examples/nextjs/node_modules/better-auth/dist/api/routes/password.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "requestPasswordReset",
    ()=>requestPasswordReset,
    "requestPasswordResetCallback",
    ()=>requestPasswordResetCallback,
    "resetPassword",
    ()=>resetPassword,
    "verifyPassword",
    ()=>verifyPassword
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$middlewares$2f$origin$2d$check$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/api/middlewares/origin-check.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$date$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/utils/date.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$routes$2f$session$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/api/routes/session.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$password$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/utils/password.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/error/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/error/codes.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$id$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/utils/id.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$api$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/api/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/zod/v4/classic/schemas.js [app-route] (ecmascript)");
;
;
;
;
;
;
;
;
//#region src/api/routes/password.ts
function redirectError(ctx, callbackURL, query) {
    const url = callbackURL ? new URL(callbackURL, ctx.baseURL) : new URL(`${ctx.baseURL}/error`);
    if (query) Object.entries(query).forEach(([k, v])=>url.searchParams.set(k, v));
    return url.href;
}
function redirectCallback(ctx, callbackURL, query) {
    const url = new URL(callbackURL, ctx.baseURL);
    if (query) Object.entries(query).forEach(([k, v])=>url.searchParams.set(k, v));
    return url.href;
}
const requestPasswordReset = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$api$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAuthEndpoint"])("/request-password-reset", {
    method: "POST",
    body: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["object"]({
        /**
		* The email address of the user to send a password reset email to.
		*/ email: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["email"]().meta({
            description: "The email address of the user to send a password reset email to"
        }),
        /**
		* The URL to redirect the user to reset their password.
		* If the token isn't valid or expired, it'll be redirected with a query parameter `?
		* error=INVALID_TOKEN`. If the token is valid, it'll be redirected with a query parameter `?
		* token=VALID_TOKEN
		*/ redirectTo: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]().meta({
            description: "The URL to redirect the user to reset their password. If the token isn't valid or expired, it'll be redirected with a query parameter `?error=INVALID_TOKEN`. If the token is valid, it'll be redirected with a query parameter `?token=VALID_TOKEN"
        }).optional()
    }),
    metadata: {
        openapi: {
            operationId: "requestPasswordReset",
            description: "Send a password reset email to the user",
            responses: {
                "200": {
                    description: "Success",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    status: {
                                        type: "boolean"
                                    },
                                    message: {
                                        type: "string"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    use: [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$middlewares$2f$origin$2d$check$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["originCheck"])((ctx)=>ctx.body.redirectTo)
    ]
}, async (ctx)=>{
    if (!ctx.context.options.emailAndPassword?.sendResetPassword) {
        ctx.context.logger.error("Reset password isn't enabled.Please pass an emailAndPassword.sendResetPassword function in your auth config!");
        throw __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"].from("BAD_REQUEST", {
            message: "Reset password isn't enabled",
            code: "RESET_PASSWORD_DISABLED"
        });
    }
    const { email, redirectTo } = ctx.body;
    const user = await ctx.context.internalAdapter.findUserByEmail(email, {
        includeAccounts: true
    });
    if (!user) {
        /**
		* We simulate the verification token generation and the database lookup
		* to mitigate timing attacks.
		*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$id$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateId"])(24);
        await ctx.context.internalAdapter.findVerificationValue("dummy-verification-token");
        ctx.context.logger.warn("Reset Password: User not found");
        return ctx.json({
            status: true,
            message: "If this email exists in our system, check your email for the reset link"
        });
    }
    const expiresAt = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$date$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getDate"])(ctx.context.options.emailAndPassword.resetPasswordTokenExpiresIn || 3600 * 1, "sec");
    const verificationToken = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$id$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateId"])(24);
    await ctx.context.internalAdapter.createVerificationValue({
        value: user.user.id,
        identifier: `reset-password:${verificationToken}`,
        expiresAt
    });
    const callbackURL = redirectTo ? encodeURIComponent(redirectTo) : "";
    const url = `${ctx.context.baseURL}/reset-password/${verificationToken}?callbackURL=${callbackURL}`;
    await ctx.context.runInBackgroundOrAwait(ctx.context.options.emailAndPassword.sendResetPassword({
        user: user.user,
        url,
        token: verificationToken
    }, ctx.request));
    return ctx.json({
        status: true,
        message: "If this email exists in our system, check your email for the reset link"
    });
});
const requestPasswordResetCallback = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$api$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAuthEndpoint"])("/reset-password/:token", {
    method: "GET",
    operationId: "resetPasswordCallback",
    query: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["object"]({
        callbackURL: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]().meta({
            description: "The URL to redirect the user to reset their password"
        })
    }),
    use: [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$middlewares$2f$origin$2d$check$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["originCheck"])((ctx)=>ctx.query.callbackURL)
    ],
    metadata: {
        openapi: {
            operationId: "resetPasswordCallback",
            description: "Redirects the user to the callback URL with the token",
            parameters: [
                {
                    name: "token",
                    in: "path",
                    required: true,
                    description: "The token to reset the password",
                    schema: {
                        type: "string"
                    }
                },
                {
                    name: "callbackURL",
                    in: "query",
                    required: true,
                    description: "The URL to redirect the user to reset their password",
                    schema: {
                        type: "string"
                    }
                }
            ],
            responses: {
                "200": {
                    description: "Success",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    token: {
                                        type: "string"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}, async (ctx)=>{
    const { token } = ctx.params;
    const { callbackURL } = ctx.query;
    if (!token || !callbackURL) throw ctx.redirect(redirectError(ctx.context, callbackURL, {
        error: "INVALID_TOKEN"
    }));
    const verification = await ctx.context.internalAdapter.findVerificationValue(`reset-password:${token}`);
    if (!verification || verification.expiresAt < /* @__PURE__ */ new Date()) throw ctx.redirect(redirectError(ctx.context, callbackURL, {
        error: "INVALID_TOKEN"
    }));
    throw ctx.redirect(redirectCallback(ctx.context, callbackURL, {
        token
    }));
});
const resetPassword = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$api$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAuthEndpoint"])("/reset-password", {
    method: "POST",
    operationId: "resetPassword",
    query: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["object"]({
        token: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]().optional()
    }).optional(),
    body: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["object"]({
        newPassword: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]().meta({
            description: "The new password to set"
        }),
        token: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]().meta({
            description: "The token to reset the password"
        }).optional()
    }),
    metadata: {
        openapi: {
            operationId: "resetPassword",
            description: "Reset the password for a user",
            responses: {
                "200": {
                    description: "Success",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    status: {
                                        type: "boolean"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}, async (ctx)=>{
    const token = ctx.body.token || ctx.query?.token;
    if (!token) throw __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"].from("BAD_REQUEST", __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BASE_ERROR_CODES"].INVALID_TOKEN);
    const { newPassword } = ctx.body;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$password$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["assertPasswordNotTooShort"])(ctx, newPassword);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$password$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["assertPasswordNotTooLong"])(ctx, newPassword);
    const id = `reset-password:${token}`;
    const verification = await ctx.context.internalAdapter.findVerificationValue(id);
    if (!verification || verification.expiresAt < /* @__PURE__ */ new Date()) throw __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"].from("BAD_REQUEST", __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BASE_ERROR_CODES"].INVALID_TOKEN);
    const userId = verification.value;
    const user = await ctx.context.internalAdapter.findUserById(userId);
    if (!user) throw __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"].from("BAD_REQUEST", __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BASE_ERROR_CODES"].USER_NOT_FOUND);
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$password$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["resetCredentialPassword"])(ctx, userId, await ctx.context.password.hash(newPassword), async ()=>{
        if (!await ctx.context.internalAdapter.consumeVerificationValue(id)) throw __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"].from("BAD_REQUEST", __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BASE_ERROR_CODES"].INVALID_TOKEN);
    });
    if (ctx.context.options.emailAndPassword?.onPasswordReset) await ctx.context.options.emailAndPassword.onPasswordReset({
        user
    }, ctx.request);
    return ctx.json({
        status: true
    });
});
const verifyPassword = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$api$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAuthEndpoint"])("/verify-password", {
    method: "POST",
    body: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["object"]({
        /**
	* The password to verify
	*/ password: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]().meta({
            description: "The password to verify"
        })
    }),
    metadata: {
        scope: "server",
        openapi: {
            operationId: "verifyPassword",
            description: "Verify the current user's password",
            responses: {
                "200": {
                    description: "Success",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    status: {
                                        type: "boolean"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    use: [
        __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$routes$2f$session$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sensitiveSessionMiddleware"]
    ]
}, async (ctx)=>{
    const { password } = ctx.body;
    const session = ctx.context.session;
    if (!await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$password$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["validatePassword"])(ctx, {
        password,
        userId: session.user.id
    })) throw __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"].from("BAD_REQUEST", __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BASE_ERROR_CODES"].INVALID_PASSWORD);
    return ctx.json({
        status: true
    });
});
;
}),
"[project]/examples/nextjs/node_modules/better-auth/dist/api/routes/session.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "freshSessionMiddleware",
    ()=>freshSessionMiddleware,
    "getAuthoritativeSessionFromCtx",
    ()=>getAuthoritativeSessionFromCtx,
    "getSession",
    ()=>getSession,
    "getSessionFromCtx",
    ()=>getSessionFromCtx,
    "isStateful",
    ()=>isStateful,
    "listSessions",
    ()=>listSessions,
    "requestOnlySessionMiddleware",
    ()=>requestOnlySessionMiddleware,
    "revokeOtherSessions",
    ()=>revokeOtherSessions,
    "revokeSession",
    ()=>revokeSession,
    "revokeSessions",
    ()=>revokeSessions,
    "sensitiveSessionMiddleware",
    ()=>sensitiveSessionMiddleware,
    "sessionMiddleware",
    ()=>sessionMiddleware
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$is$2d$api$2d$error$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/utils/is-api-error.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$context$2f$store$2d$capabilities$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/context/store-capabilities.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$schema$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/db/schema.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$date$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/utils/date.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$session$2d$store$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/cookies/session-store.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/cookies/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$state$2f$should$2d$session$2d$refresh$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/api/state/should-session-refresh.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/error/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/error/codes.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$api$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/api/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/zod/v4/classic/schemas.js [app-route] (ecmascript)");
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
//#region src/api/routes/session.ts
const getSession = ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$api$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAuthEndpoint"])("/get-session", {
        method: [
            "GET",
            "POST"
        ],
        operationId: "getSession",
        query: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$session$2d$store$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getSessionQuerySchema"],
        requireHeaders: true,
        metadata: {
            openapi: {
                operationId: "getSession",
                description: "Get the current session",
                responses: {
                    "200": {
                        description: "Success",
                        content: {
                            "application/json": {
                                schema: {
                                    type: [
                                        "object",
                                        "null"
                                    ],
                                    properties: {
                                        session: {
                                            $ref: "#/components/schemas/Session"
                                        },
                                        user: {
                                            $ref: "#/components/schemas/User"
                                        }
                                    },
                                    required: [
                                        "session",
                                        "user"
                                    ]
                                }
                            }
                        }
                    }
                }
            }
        }
    }, async (ctx)=>{
        ctx.setHeader("cache-control", "no-store");
        ctx.setHeader("pragma", "no-cache");
        const deferSessionRefresh = ctx.context.options.session?.deferSessionRefresh;
        const isPostRequest = ctx.method === "POST";
        if (isPostRequest && !deferSessionRefresh) throw __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"].from("METHOD_NOT_ALLOWED", __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BASE_ERROR_CODES"].METHOD_NOT_ALLOWED_DEFER_SESSION_REQUIRED);
        try {
            const cookieCacheEnabled = ctx.context.options.session?.cookieCache?.enabled === true;
            const sessionCookieToken = await ctx.getSignedCookie(ctx.context.authCookies.sessionToken.name, ctx.context.secret);
            if (!sessionCookieToken && cookieCacheEnabled) return null;
            const sessionDataCookie = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$session$2d$store$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getChunkedCookie"])(ctx, ctx.context.authCookies.sessionData.name);
            if (sessionDataCookie && !cookieCacheEnabled) {
                const sessionStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$session$2d$store$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createSessionStore"])(ctx.context.authCookies.sessionData.name, ctx.context.authCookies.sessionData.attributes, ctx);
                sessionStore.setCookies(sessionStore.clean());
            }
            if (!sessionCookieToken) return null;
            const shouldUseCookieCache = cookieCacheEnabled && !ctx.query?.disableCookieCache;
            const sessionDataPayload = shouldUseCookieCache && sessionDataCookie ? await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["decodeCookieCache"])(ctx, sessionDataCookie) : null;
            if (shouldUseCookieCache && sessionDataCookie && !sessionDataPayload) (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["expireCookie"])(ctx, ctx.context.authCookies.sessionData);
            const dontRememberMe = await ctx.getSignedCookie(ctx.context.authCookies.dontRememberToken.name, ctx.context.secret);
            /**
		* If session data is present in the cookie, check if it should be used or refreshed
		*/ if (sessionDataPayload?.session) {
                const session = sessionDataPayload.session;
                let shouldExpireCookieCache = session.session.token !== sessionCookieToken;
                if (!shouldExpireCookieCache) {
                    const versionConfig = ctx.context.options.session?.cookieCache?.version;
                    let expectedVersion = "1";
                    if (versionConfig) {
                        if (typeof versionConfig === "string") expectedVersion = versionConfig;
                        else if (typeof versionConfig === "function") {
                            const result = versionConfig(session.session, session.user);
                            expectedVersion = result instanceof Promise ? await result : result;
                        }
                    }
                    shouldExpireCookieCache = (session.version || "1") !== expectedVersion;
                }
                if (!shouldExpireCookieCache) {
                    const now = Date.now();
                    const cachedSessionExpiresAt = new Date(session.session.expiresAt).getTime();
                    shouldExpireCookieCache = sessionDataPayload.expiresAt < now || !Number.isFinite(cachedSessionExpiresAt) || cachedSessionExpiresAt < now;
                }
                if (shouldExpireCookieCache) (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["expireCookie"])(ctx, ctx.context.authCookies.sessionData);
                else {
                    const cookieRefreshCache = ctx.context.sessionConfig.cookieRefreshCache;
                    if (cookieRefreshCache === false) {
                        ctx.context.session = session;
                        const parsedSession = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$schema$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseSessionOutput"])(ctx.context.options, {
                            ...session.session,
                            expiresAt: new Date(session.session.expiresAt),
                            createdAt: new Date(session.session.createdAt),
                            updatedAt: new Date(session.session.updatedAt)
                        });
                        const parsedUser = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$schema$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseUserOutput"])(ctx.context.options, {
                            ...session.user,
                            createdAt: new Date(session.user.createdAt),
                            updatedAt: new Date(session.user.updatedAt)
                        });
                        return ctx.json({
                            session: parsedSession,
                            user: parsedUser
                        });
                    }
                    const timeUntilExpiry = sessionDataPayload.expiresAt - Date.now();
                    const updateAge = cookieRefreshCache.updateAge * 1e3;
                    const shouldSkipSessionRefresh = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$state$2f$should$2d$session$2d$refresh$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getShouldSkipSessionRefresh"])();
                    if (timeUntilExpiry < updateAge && !shouldSkipSessionRefresh) {
                        const refreshedSession = {
                            session: {
                                ...session.session
                            },
                            user: session.user,
                            updatedAt: Date.now()
                        };
                        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["setCookieCache"])(ctx, refreshedSession, false);
                        const sessionTokenOptions = ctx.context.authCookies.sessionToken.attributes;
                        const sessionTokenMaxAge = dontRememberMe ? void 0 : ctx.context.sessionConfig.expiresIn;
                        await ctx.setSignedCookie(ctx.context.authCookies.sessionToken.name, session.session.token, ctx.context.secret, {
                            ...sessionTokenOptions,
                            maxAge: sessionTokenMaxAge
                        });
                        const parsedRefreshedSession = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$schema$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseSessionOutput"])(ctx.context.options, {
                            ...refreshedSession.session,
                            expiresAt: new Date(refreshedSession.session.expiresAt),
                            createdAt: new Date(refreshedSession.session.createdAt),
                            updatedAt: new Date(refreshedSession.session.updatedAt)
                        });
                        const parsedRefreshedUser = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$schema$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseUserOutput"])(ctx.context.options, {
                            ...refreshedSession.user,
                            createdAt: new Date(refreshedSession.user.createdAt),
                            updatedAt: new Date(refreshedSession.user.updatedAt)
                        });
                        ctx.context.session = {
                            session: parsedRefreshedSession,
                            user: parsedRefreshedUser
                        };
                        return ctx.json({
                            session: parsedRefreshedSession,
                            user: parsedRefreshedUser
                        });
                    }
                    const parsedSession = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$schema$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseSessionOutput"])(ctx.context.options, {
                        ...session.session,
                        expiresAt: new Date(session.session.expiresAt),
                        createdAt: new Date(session.session.createdAt),
                        updatedAt: new Date(session.session.updatedAt)
                    });
                    const parsedUser = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$schema$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseUserOutput"])(ctx.context.options, {
                        ...session.user,
                        createdAt: new Date(session.user.createdAt),
                        updatedAt: new Date(session.user.updatedAt)
                    });
                    ctx.context.session = {
                        session: parsedSession,
                        user: parsedUser
                    };
                    return ctx.json({
                        session: parsedSession,
                        user: parsedUser
                    });
                }
            }
            const session = await ctx.context.internalAdapter.findSession(sessionCookieToken);
            ctx.context.session = session;
            if (!session || session.session.expiresAt < /* @__PURE__ */ new Date()) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["deleteSessionCookie"])(ctx);
                if (session) {
                    /**
				* if session expired clean up the session
				* Only delete on POST when deferSessionRefresh is enabled
				*/ if (!deferSessionRefresh || isPostRequest) await ctx.context.internalAdapter.deleteSession(session.session.token);
                }
                return ctx.json(null);
            }
            /**
		* We don't need to update the session if the user doesn't want to be remembered
		* or if the session refresh is disabled
		*/ if (dontRememberMe || ctx.query?.disableRefresh) {
                const parsedSession = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$schema$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseSessionOutput"])(ctx.context.options, session.session);
                const parsedUser = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$schema$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseUserOutput"])(ctx.context.options, session.user);
                return ctx.json({
                    session: parsedSession,
                    user: parsedUser
                });
            }
            const expiresIn = ctx.context.sessionConfig.expiresIn;
            const updateAge = ctx.context.sessionConfig.updateAge;
            const shouldBeUpdated = session.session.expiresAt.valueOf() - expiresIn * 1e3 + updateAge * 1e3 <= Date.now();
            const disableRefresh = ctx.query?.disableRefresh || ctx.context.options.session?.disableSessionRefresh;
            const shouldSkipSessionRefresh = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$state$2f$should$2d$session$2d$refresh$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getShouldSkipSessionRefresh"])();
            const needsRefresh = shouldBeUpdated && !disableRefresh && !shouldSkipSessionRefresh;
            /**
		* When deferSessionRefresh is enabled and this is a GET request,
		* return the session without performing writes, but include needsRefresh flag
		*/ if (deferSessionRefresh && !isPostRequest) {
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["setCookieCache"])(ctx, session, !!dontRememberMe);
                const parsedSession = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$schema$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseSessionOutput"])(ctx.context.options, session.session);
                const parsedUser = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$schema$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseUserOutput"])(ctx.context.options, session.user);
                return ctx.json({
                    session: parsedSession,
                    user: parsedUser,
                    needsRefresh
                });
            }
            if (needsRefresh) {
                const updatedSession = await ctx.context.internalAdapter.updateSession(session.session.token, {
                    expiresAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$date$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getDate"])(ctx.context.sessionConfig.expiresIn, "sec"),
                    updatedAt: /* @__PURE__ */ new Date()
                });
                if (!updatedSession) {
                    /**
				* Handle case where session update fails (e.g., concurrent deletion)
				*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["deleteSessionCookie"])(ctx);
                    throw __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"].from("UNAUTHORIZED", __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BASE_ERROR_CODES"].FAILED_TO_GET_SESSION);
                }
                const maxAge = ctx.context.sessionConfig.expiresIn;
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["setSessionCookie"])(ctx, {
                    session: updatedSession,
                    user: session.user
                }, false, {
                    maxAge
                });
                const parsedUpdatedSession = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$schema$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseSessionOutput"])(ctx.context.options, updatedSession);
                const parsedUser = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$schema$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseUserOutput"])(ctx.context.options, session.user);
                return ctx.json({
                    session: parsedUpdatedSession,
                    user: parsedUser
                });
            }
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["setCookieCache"])(ctx, session, !!dontRememberMe);
            const parsedSession = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$schema$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseSessionOutput"])(ctx.context.options, session.session);
            const parsedUser = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$schema$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseUserOutput"])(ctx.context.options, session.user);
            return ctx.json({
                session: parsedSession,
                user: parsedUser
            });
        } catch (error) {
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$is$2d$api$2d$error$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isAPIError"])(error)) throw error;
            ctx.context.logger.error("INTERNAL_SERVER_ERROR", error);
            throw __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"].from("INTERNAL_SERVER_ERROR", __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BASE_ERROR_CODES"].FAILED_TO_GET_SESSION, {
                cause: error
            });
        }
    });
/**
* Whether the deployment keeps sessions in a durable server-side store
* (a database or secondary storage) rather than only in the signed cookie.
*
* Sensitive operations use this to decide whether the cookie cache is merely an
* optimization that must be bypassed for an authoritative read (`true`), or the
* only place the session lives and therefore the authority itself (`false`, for
* stateless / DB-less deployments). Pass the result as `disableCookieCache` so a
* revoked-but-cached session cannot authorize a sensitive action.
*/ const isStateful = (ctx)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$context$2f$store$2d$capabilities$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["hasServerSessionStore"])(ctx.context.options);
const getSessionFromCtx = async (ctx, config)=>{
    if (ctx.context.session) return ctx.context.session;
    const session = await getSession()({
        ...ctx,
        method: "GET",
        asResponse: false,
        headers: ctx.headers,
        returnHeaders: true,
        returnStatus: false,
        query: {
            ...config,
            ...ctx.query,
            disableCookieCache: config?.disableCookieCache || ctx.query?.disableCookieCache,
            disableRefresh: config?.disableRefresh || ctx.query?.disableRefresh
        }
    }).catch(()=>{
        return null;
    });
    if (!session) {
        ctx.context.session = null;
        return null;
    }
    if (session.headers) session.headers.forEach((value, key)=>{
        const lowerKey = key.toLowerCase();
        if (lowerKey === "cache-control" || lowerKey === "pragma") return;
        if (lowerKey === "set-cookie") ctx.responseHeaders.append(key, value);
        else ctx.responseHeaders.set(key, value);
    });
    ctx.context.session = session.response;
    return session.response;
};
/**
* Reads the session from the source that can authorize sensitive work.
*
* Stateful deployments must re-read the server-side session store because an
* earlier hook may have populated `ctx.context.session` from cookie cache.
* Stateless deployments keep the signed cookie as the session record.
*/ const getAuthoritativeSessionFromCtx = async (ctx)=>{
    if (!isStateful(ctx)) return getSessionFromCtx(ctx);
    ctx.context.session = null;
    return getSessionFromCtx(ctx, {
        disableCookieCache: true
    });
};
/**
* The middleware forces the endpoint to require a valid session.
*/ const sessionMiddleware = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$api$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAuthMiddleware"])(async (ctx)=>{
    const session = await getSessionFromCtx(ctx);
    if (!session?.session) throw __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"].from("UNAUTHORIZED", {
        message: "Unauthorized",
        code: "UNAUTHORIZED"
    });
    return {
        session
    };
});
/**
* This middleware forces the endpoint to require a valid authoritative session.
* This should be used for sensitive operations like password changes, account deletion, etc.
*/ const sensitiveSessionMiddleware = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$api$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAuthMiddleware"])(async (ctx)=>{
    const session = await getAuthoritativeSessionFromCtx(ctx);
    if (!session?.session) throw __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"].from("UNAUTHORIZED", {
        message: "Unauthorized",
        code: "UNAUTHORIZED"
    });
    return {
        session
    };
});
/**
* This middleware allows you to call the endpoint on the client if session is valid.
* However, if called on the server, no session is required.
*/ const requestOnlySessionMiddleware = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$api$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAuthMiddleware"])(async (ctx)=>{
    const session = await getSessionFromCtx(ctx);
    if (!session?.session && (ctx.request || ctx.headers)) throw __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"].from("UNAUTHORIZED", {
        message: "Unauthorized",
        code: "UNAUTHORIZED"
    });
    return {
        session
    };
});
/**
* This middleware forces the endpoint to require a valid session,
* as well as making sure the session is fresh before proceeding.
*
* Session freshness check will be skipped if the session config's freshAge
* is set to 0
*/ const freshSessionMiddleware = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$api$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAuthMiddleware"])(async (ctx)=>{
    const session = await getSessionFromCtx(ctx);
    if (!session?.session) throw __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"].from("UNAUTHORIZED", {
        message: "Unauthorized",
        code: "UNAUTHORIZED"
    });
    if (ctx.context.sessionConfig.freshAge !== 0) {
        const createdAt = new Date(session.session.createdAt).getTime();
        const freshAge = ctx.context.sessionConfig.freshAge * 1e3;
        if (Date.now() - createdAt >= freshAge) throw __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"].from("FORBIDDEN", __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BASE_ERROR_CODES"].SESSION_NOT_FRESH);
    }
    return {
        session
    };
});
/**
* user active sessions list
*/ const listSessions = ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$api$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAuthEndpoint"])("/list-sessions", {
        method: "GET",
        operationId: "listUserSessions",
        use: [
            freshSessionMiddleware
        ],
        requireHeaders: true,
        metadata: {
            openapi: {
                operationId: "listUserSessions",
                description: "List all active sessions for the user",
                responses: {
                    "200": {
                        description: "Success",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "array",
                                    items: {
                                        $ref: "#/components/schemas/Session"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }, async (ctx)=>{
        try {
            const activeSessions = (await ctx.context.internalAdapter.listSessions(ctx.context.session.user.id, {
                onlyActiveSessions: true
            })).filter((session)=>{
                return session.expiresAt > /* @__PURE__ */ new Date();
            });
            return ctx.json(activeSessions.map((session)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$schema$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseSessionOutput"])(ctx.context.options, session)));
        } catch (e) {
            ctx.context.logger.error(e);
            throw ctx.error("INTERNAL_SERVER_ERROR");
        }
    });
/**
* revoke a single session
*/ const revokeSession = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$api$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAuthEndpoint"])("/revoke-session", {
    method: "POST",
    body: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["object"]({
        token: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]().meta({
            description: "The token to revoke"
        })
    }),
    use: [
        sensitiveSessionMiddleware
    ],
    requireHeaders: true,
    metadata: {
        openapi: {
            description: "Revoke a single session",
            requestBody: {
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                token: {
                                    type: "string",
                                    description: "The token to revoke"
                                }
                            },
                            required: [
                                "token"
                            ]
                        }
                    }
                }
            },
            responses: {
                "200": {
                    description: "Success",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    status: {
                                        type: "boolean",
                                        description: "Indicates if the session was revoked successfully"
                                    }
                                },
                                required: [
                                    "status"
                                ]
                            }
                        }
                    }
                }
            }
        }
    }
}, async (ctx)=>{
    const token = ctx.body.token;
    if ((await ctx.context.internalAdapter.findSession(token))?.session.userId === ctx.context.session.user.id) try {
        await ctx.context.internalAdapter.deleteSession(token);
    } catch (error) {
        ctx.context.logger.error(error && typeof error === "object" && "name" in error ? error.name : "", error);
        throw __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"].from("INTERNAL_SERVER_ERROR", {
            message: "Internal Server Error",
            code: "INTERNAL_SERVER_ERROR"
        });
    }
    return ctx.json({
        status: true
    });
});
/**
* revoke all user sessions
*/ const revokeSessions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$api$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAuthEndpoint"])("/revoke-sessions", {
    method: "POST",
    use: [
        sensitiveSessionMiddleware
    ],
    requireHeaders: true,
    metadata: {
        openapi: {
            description: "Revoke all sessions for the user",
            responses: {
                "200": {
                    description: "Success",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    status: {
                                        type: "boolean",
                                        description: "Indicates if all sessions were revoked successfully"
                                    }
                                },
                                required: [
                                    "status"
                                ]
                            }
                        }
                    }
                }
            }
        }
    }
}, async (ctx)=>{
    try {
        await ctx.context.internalAdapter.deleteUserSessions(ctx.context.session.user.id);
    } catch (error) {
        ctx.context.logger.error(error && typeof error === "object" && "name" in error ? error.name : "", error);
        throw __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"].from("INTERNAL_SERVER_ERROR", {
            message: "Internal Server Error",
            code: "INTERNAL_SERVER_ERROR"
        });
    }
    return ctx.json({
        status: true
    });
});
const revokeOtherSessions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$api$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAuthEndpoint"])("/revoke-other-sessions", {
    method: "POST",
    requireHeaders: true,
    use: [
        sensitiveSessionMiddleware
    ],
    metadata: {
        openapi: {
            description: "Revoke all other sessions for the user except the current one",
            responses: {
                "200": {
                    description: "Success",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    status: {
                                        type: "boolean",
                                        description: "Indicates if all other sessions were revoked successfully"
                                    }
                                },
                                required: [
                                    "status"
                                ]
                            }
                        }
                    }
                }
            }
        }
    }
}, async (ctx)=>{
    const session = ctx.context.session;
    if (!session.user) throw __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"].from("UNAUTHORIZED", {
        message: "Unauthorized",
        code: "UNAUTHORIZED"
    });
    const otherSessions = (await ctx.context.internalAdapter.listSessions(session.user.id)).filter((session)=>{
        return session.expiresAt > /* @__PURE__ */ new Date();
    }).filter((session)=>session.token !== ctx.context.session.session.token);
    await Promise.all(otherSessions.map((session)=>ctx.context.internalAdapter.deleteSession(session.token)));
    return ctx.json({
        status: true
    });
});
;
}),
"[project]/examples/nextjs/node_modules/better-auth/dist/api/routes/sign-in.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "signInEmail",
    ()=>signInEmail,
    "signInSocial",
    ()=>signInSocial
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$middlewares$2f$origin$2d$check$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/api/middlewares/origin-check.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$schema$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/db/schema.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/cookies/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$context$2f$helpers$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/context/helpers.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$oauth2$2f$account$2d$key$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/oauth2/account-key.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$oauth2$2f$errors$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/oauth2/errors.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$oauth2$2f$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/oauth2/utils.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$oauth2$2f$link$2d$account$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/oauth2/link-account.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$oauth2$2f$state$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/oauth2/state.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$request$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/utils/request.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$routes$2f$email$2d$verification$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/api/routes/email-verification.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$password$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/utils/password.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/error/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/error/codes.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$authorization$2d$params$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/authorization-params.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$verify$2d$id$2d$token$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/verify-id-token.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$social$2d$providers$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/social-providers/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$api$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/api/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/zod/v4/classic/schemas.js [app-route] (ecmascript)");
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
//#region src/api/routes/sign-in.ts
const socialSignInBodySchema = __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["object"]({
    /**
	* Callback URL to redirect to after the user
	* has signed in.
	*/ callbackURL: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]().meta({
        description: "Callback URL to redirect to after the user has signed in"
    }).optional(),
    /**
	* callback url to redirect if the user is newly registered.
	*
	* useful if you have different routes for existing users and new users
	*/ newUserCallbackURL: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]().optional(),
    /**
	* Callback url to redirect to if an error happens
	*
	* If it's initiated from the client sdk this defaults to
	* the current url.
	*/ errorCallbackURL: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]().meta({
        description: "Callback URL to redirect to if an error happens"
    }).optional(),
    /**
	* OAuth2 provider to use`
	*/ provider: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$social$2d$providers$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SocialProviderListEnum"],
    /**
	* Disable automatic redirection to the provider
	*
	* This is useful if you want to handle the redirection
	* yourself like in a popup or a different tab.
	*/ disableRedirect: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["boolean"]().meta({
        description: "Disable automatic redirection to the provider. Useful for handling the redirection yourself"
    }).optional(),
    /**
	* ID token from the provider
	*
	* This is used to sign in the user
	* if the user is already signed in with the
	* provider in the frontend.
	*
	* Only applicable if the provider supports
	* it. Currently only `apple` and `google` is
	* supported out of the box.
	*/ idToken: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["optional"](__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["object"]({
        /**
		* ID token from the provider
		*/ token: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]().meta({
            description: "ID token from the provider"
        }),
        /**
		* The nonce used to generate the token
		*/ nonce: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]().meta({
            description: "Nonce used to generate the token"
        }).optional(),
        /**
		* Access token from the provider
		*/ accessToken: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]().meta({
            description: "Access token from the provider"
        }).optional(),
        /**
		* Refresh token from the provider
		*/ refreshToken: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]().meta({
            description: "Refresh token from the provider"
        }).optional(),
        /**
		* Expiry date of the token
		*/ expiresAt: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["number"]().meta({
            description: "Expiry date of the token"
        }).optional(),
        /**
		* The user object from the provider.
		* This is only available for some providers like Apple.
		*/ user: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["object"]({
            name: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["object"]({
                firstName: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]().optional(),
                lastName: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]().optional()
            }).optional(),
            email: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]().optional()
        }).meta({
            description: "The user object from the provider. Only available for some providers like Apple."
        }).optional()
    })),
    scopes: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["array"](__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]()).meta({
        description: "Array of scopes to request from the provider. This will override the default scopes passed."
    }).optional(),
    /**
	* Explicitly request sign-up
	*
	* Should be used to allow sign up when
	* disableImplicitSignUp for this provider is
	* true
	*/ requestSignUp: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["boolean"]().meta({
        description: "Explicitly request sign-up. Useful when disableImplicitSignUp is true for this provider"
    }).optional(),
    /**
	* The login hint to use for the authorization code request
	*/ loginHint: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]().meta({
        description: "The login hint to use for the authorization code request"
    }).optional(),
    /**
	* Extra query parameters to append to the provider authorization URL.
	* Reserved OAuth keys (state, client_id, redirect_uri, response_type,
	* code_challenge, code_challenge_method, nonce, scope) are rejected.
	*/ additionalParams: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$authorization$2d$params$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["additionalAuthorizationParamsSchema"],
    /**
	* Additional data to be passed through the OAuth flow
	*/ additionalData: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["record"](__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"](), __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["any"]()).optional().meta({
        description: "Additional data to be passed through the OAuth flow"
    })
});
const signInSocial = ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$api$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAuthEndpoint"])("/sign-in/social", {
        method: "POST",
        operationId: "socialSignIn",
        body: socialSignInBodySchema,
        metadata: {
            $Infer: {
                body: {},
                returned: {}
            },
            openapi: {
                description: "Sign in with a social provider",
                operationId: "socialSignIn",
                responses: {
                    "200": {
                        description: "Success - Returns session details (idToken branch) or an authorize URL (redirect branch)",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    description: "Returns session details when idToken is provided, or an authorize URL otherwise",
                                    properties: {
                                        token: {
                                            type: "string"
                                        },
                                        user: {
                                            type: "object",
                                            $ref: "#/components/schemas/User"
                                        },
                                        url: {
                                            type: "string"
                                        },
                                        redirect: {
                                            type: "boolean"
                                        }
                                    },
                                    required: [
                                        "redirect"
                                    ]
                                }
                            }
                        }
                    }
                }
            }
        }
    }, async (c)=>{
        const provider = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$context$2f$helpers$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getAwaitableValue"])(c.context.socialProviders, {
            value: c.body.provider
        });
        if (!provider) {
            c.context.logger.error("Provider not found. Make sure to add the provider in your auth config", {
                provider: c.body.provider
            });
            throw __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"].from("NOT_FOUND", __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BASE_ERROR_CODES"].PROVIDER_NOT_FOUND);
        }
        if (c.body.idToken) {
            if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$verify$2d$id$2d$token$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supportsIdTokenSignIn"])(provider)) {
                c.context.logger.error("Provider does not support id token verification", {
                    provider: c.body.provider
                });
                throw __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"].from("NOT_FOUND", __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BASE_ERROR_CODES"].ID_TOKEN_NOT_SUPPORTED);
            }
            const { token, nonce } = c.body.idToken;
            if (!await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$verify$2d$id$2d$token$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["verifyProviderIdToken"])(provider, token, nonce, c)) {
                c.context.logger.warn("Invalid id token", {
                    provider: c.body.provider
                });
                throw __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"].from("UNAUTHORIZED", __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BASE_ERROR_CODES"].INVALID_TOKEN);
            }
            const oauthTokens = {
                idToken: token,
                accessToken: c.body.idToken.accessToken,
                refreshToken: c.body.idToken.refreshToken,
                user: c.body.idToken.user
            };
            const userInfo = await provider.getUserInfo(oauthTokens);
            if (!userInfo || !userInfo?.user) {
                c.context.logger.error("Failed to get user info", {
                    provider: c.body.provider
                });
                throw __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"].from("UNAUTHORIZED", __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BASE_ERROR_CODES"].FAILED_TO_GET_USER_INFO);
            }
            if (!userInfo.user.email) {
                c.context.logger.error((0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$oauth2$2f$errors$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["missingEmailLogMessage"])(c.body.provider, {
                    source: "id_token"
                }), {
                    provider: c.body.provider
                });
                throw __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"].from("UNAUTHORIZED", __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BASE_ERROR_CODES"].USER_EMAIL_NOT_FOUND);
            }
            const accountKey = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$oauth2$2f$account$2d$key$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["resolveOAuthAccountKeyForAPI"])(provider, oauthTokens, userInfo.data);
            const providerProfile = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$oauth2$2f$account$2d$key$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["toOAuthProfileRecord"])(userInfo.data);
            const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$oauth2$2f$link$2d$account$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["handleOAuthUserInfo"])(c, {
                userInfo: {
                    ...userInfo.user,
                    email: userInfo.user.email,
                    id: accountKey.accountId,
                    name: userInfo.user.name || "",
                    image: userInfo.user.image,
                    emailVerified: userInfo.user.emailVerified || false
                },
                account: {
                    ...accountKey,
                    accessToken: c.body.idToken.accessToken,
                    idToken: token
                },
                callbackURL: c.body.callbackURL,
                disableSignUp: provider.disableImplicitSignUp && !c.body.requestSignUp || provider.options?.disableSignUp || provider.disableSignUp,
                source: {
                    method: "oauth",
                    oauth: {
                        providerId: provider.id,
                        profile: providerProfile
                    }
                }
            });
            if (data.error) {
                if (data.error === __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$oauth2$2f$errors$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["OAUTH_CALLBACK_ERROR_CODES"].EMAIL_NOT_VERIFIED) throw __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"].from("FORBIDDEN", __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BASE_ERROR_CODES"].EMAIL_NOT_VERIFIED);
                throw __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"].from("UNAUTHORIZED", {
                    message: data.error,
                    code: "OAUTH_LINK_ERROR"
                });
            }
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["setSessionCookie"])(c, data.data);
            return c.json({
                redirect: false,
                token: data.data.session.token,
                url: void 0,
                user: (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$schema$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseUserOutput"])(c.context.options, data.data.user)
            });
        }
        const idTokenNonce = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$oauth2$2f$state$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateIdTokenNonce"])(provider);
        const { codeVerifier, state } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$oauth2$2f$state$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateState"])(c, {
            additionalData: c.body.additionalData,
            idTokenNonce
        });
        const url = await provider.createAuthorizationURL({
            state,
            codeVerifier,
            idTokenNonce,
            redirectURI: `${c.context.baseURL}${(0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$oauth2$2f$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getOAuthCallbackPath"])(provider)}`,
            scopes: c.body.scopes,
            loginHint: c.body.loginHint,
            additionalParams: c.body.additionalParams
        });
        if (!c.body.disableRedirect) c.setHeader("Location", url.toString());
        return c.json({
            url: url.toString(),
            redirect: !c.body.disableRedirect
        });
    });
const signInEmail = ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$api$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAuthEndpoint"])("/sign-in/email", {
        method: "POST",
        operationId: "signInEmail",
        use: [
            __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$middlewares$2f$origin$2d$check$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["formCsrfMiddleware"]
        ],
        cloneRequest: true,
        body: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["object"]({
            /**
		* Email of the user
		*/ email: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]().meta({
                description: "Email of the user"
            }),
            /**
		* Password of the user
		*/ password: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]().meta({
                description: "Password of the user"
            }),
            /**
		* Callback URL to use as a redirect for email
		* verification and for possible redirects
		*/ callbackURL: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]().meta({
                description: "Callback URL to use as a redirect for email verification"
            }).optional(),
            /**
		* If this is false, the session will not be remembered
		* @default true
		*/ rememberMe: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["boolean"]().meta({
                description: "If this is false, the session will not be remembered. Default is `true`."
            }).default(true).optional()
        }),
        metadata: {
            allowedMediaTypes: [
                "application/x-www-form-urlencoded",
                "application/json"
            ],
            $Infer: {
                body: {},
                returned: {}
            },
            openapi: {
                operationId: "signInEmail",
                description: "Sign in with email and password",
                responses: {
                    "200": {
                        description: "Success - Returns either session details or redirect URL",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    description: "Session response when idToken is provided",
                                    properties: {
                                        redirect: {
                                            type: "boolean",
                                            enum: [
                                                false
                                            ]
                                        },
                                        token: {
                                            type: "string",
                                            description: "Session token"
                                        },
                                        url: {
                                            type: "string",
                                            nullable: true
                                        },
                                        user: {
                                            type: "object",
                                            $ref: "#/components/schemas/User"
                                        }
                                    },
                                    required: [
                                        "redirect",
                                        "token",
                                        "user"
                                    ]
                                }
                            }
                        }
                    }
                }
            }
        }
    }, async (ctx)=>{
        if (!ctx.context.options?.emailAndPassword?.enabled) {
            ctx.context.logger.error("Email and password is not enabled. Make sure to enable it in the options on you `auth.ts` file. Check `https://better-auth.com/docs/authentication/email-password` for more!");
            throw __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"].from("BAD_REQUEST", {
                code: "EMAIL_PASSWORD_DISABLED",
                message: "Email and password is not enabled"
            });
        }
        const { email, password } = ctx.body;
        if (!__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["email"]().safeParse(email).success) throw __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"].from("BAD_REQUEST", __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BASE_ERROR_CODES"].INVALID_EMAIL);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$password$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["assertPasswordNotTooLong"])(ctx, password);
        const userRecord = await ctx.context.internalAdapter.findUserByEmail(email.toLowerCase(), {
            includeAccounts: true
        });
        const credentialAccount = userRecord?.accounts.find((account)=>account.providerId === "credential" && account.accountId === userRecord.user.id);
        if (!userRecord || !credentialAccount) {
            await ctx.context.password.hash(password);
            ctx.context.logger.warn("User not found");
            throw __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"].from("UNAUTHORIZED", __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BASE_ERROR_CODES"].INVALID_EMAIL_OR_PASSWORD);
        }
        const user = userRecord.user;
        const currentPassword = credentialAccount.password;
        if (!currentPassword) {
            await ctx.context.password.hash(password);
            ctx.context.logger.warn("Password not found");
            throw __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"].from("UNAUTHORIZED", __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BASE_ERROR_CODES"].INVALID_EMAIL_OR_PASSWORD);
        }
        if (!await ctx.context.password.verify({
            hash: currentPassword,
            password
        })) {
            ctx.context.logger.warn("Invalid password");
            throw __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"].from("UNAUTHORIZED", __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BASE_ERROR_CODES"].INVALID_EMAIL_OR_PASSWORD);
        }
        if (ctx.context.options?.emailAndPassword?.requireEmailVerification && !user.emailVerified) {
            if (!ctx.context.options?.emailVerification?.sendVerificationEmail) throw __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"].from("FORBIDDEN", __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BASE_ERROR_CODES"].EMAIL_NOT_VERIFIED);
            if (ctx.context.options?.emailVerification?.sendOnSignIn) {
                const token = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$routes$2f$email$2d$verification$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createEmailVerificationToken"])(ctx.context.secret, user.email, void 0, ctx.context.options.emailVerification?.expiresIn);
                const callbackURL = ctx.body.callbackURL ? encodeURIComponent(ctx.body.callbackURL) : encodeURIComponent("/");
                const url = `${ctx.context.baseURL}/verify-email?token=${token}&callbackURL=${callbackURL}`;
                await ctx.context.runInBackgroundOrAwait(ctx.context.options.emailVerification.sendVerificationEmail({
                    user,
                    url,
                    token
                }, (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$request$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["safeCloneRequest"])(ctx.request)));
            }
            throw __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"].from("FORBIDDEN", __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BASE_ERROR_CODES"].EMAIL_NOT_VERIFIED);
        }
        const session = await ctx.context.internalAdapter.createSession(user.id, ctx.body.rememberMe === false);
        if (!session) {
            ctx.context.logger.error("Failed to create session");
            throw __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"].from("UNAUTHORIZED", __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BASE_ERROR_CODES"].FAILED_TO_CREATE_SESSION);
        }
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["setSessionCookie"])(ctx, {
            session,
            user
        }, ctx.body.rememberMe === false);
        if (ctx.body.callbackURL) ctx.setHeader("Location", ctx.body.callbackURL);
        return ctx.json({
            redirect: !!ctx.body.callbackURL,
            token: session.token,
            url: ctx.body.callbackURL,
            user: (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$schema$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseUserOutput"])(ctx.context.options, user)
        });
    });
;
}),
"[project]/examples/nextjs/node_modules/better-auth/dist/api/routes/sign-out.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "signOut",
    ()=>signOut
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/cookies/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$api$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/api/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/zod/v4/classic/schemas.js [app-route] (ecmascript)");
;
;
;
//#region src/api/routes/sign-out.ts
const signOutBodySchema = __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["object"]({
    callbackURL: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]().meta({
        description: "The URL to redirect to after provider logout"
    }).optional(),
    disableRedirect: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["boolean"]().meta({
        description: "Return the provider logout URL without redirecting"
    }).optional(),
    state: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]().meta({
        description: "State to pass to the provider logout endpoint"
    }).optional()
}).optional();
const signOutResponse = (providerLogout)=>({
        success: true,
        url: providerLogout?.url,
        redirect: providerLogout?.redirect
    });
const signOut = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$api$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAuthEndpoint"])("/sign-out", {
    method: "POST",
    body: signOutBodySchema,
    operationId: "signOut",
    requireHeaders: true,
    metadata: {
        openapi: {
            operationId: "signOut",
            description: "Sign out the current user",
            responses: {
                "200": {
                    description: "Success",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    success: {
                                        type: "boolean"
                                    },
                                    url: {
                                        type: "string",
                                        description: "Provider logout URL when RP-initiated logout is available"
                                    },
                                    redirect: {
                                        type: "boolean",
                                        description: "Whether the client should redirect to the provider logout URL"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}, async (ctx)=>{
    const sessionCookieToken = await ctx.getSignedCookie(ctx.context.authCookies.sessionToken.name, ctx.context.secret);
    let currentSession = null;
    if (sessionCookieToken) try {
        currentSession = await ctx.context.internalAdapter.findSession(sessionCookieToken);
    } catch (e) {
        ctx.context.logger.error("Failed to read session from database", e);
    }
    if (sessionCookieToken) try {
        await ctx.context.internalAdapter.deleteSession(sessionCookieToken);
    } catch (e) {
        ctx.context.logger.error("Failed to delete session from database", e);
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["deleteSessionCookie"])(ctx);
    const providerLogoutResult = await (async ()=>{
        try {
            if (!currentSession) return null;
            const accounts = await ctx.context.internalAdapter.findAccounts(currentSession.user.id);
            const providersById = new Map(ctx.context.socialProviders.map((provider)=>[
                    provider.id,
                    provider
                ]));
            const logoutAccounts = accounts.filter((account)=>Boolean(providersById.get(account.providerId)?.createEndSessionURL)).sort((a, b)=>b.updatedAt.getTime() - a.updatedAt.getTime());
            if (logoutAccounts.length === 0) return null;
            const seenProviderIds = /* @__PURE__ */ new Set();
            const postLogoutRedirectURI = ctx.body?.callbackURL ? new URL(ctx.body.callbackURL, ctx.context.baseURL).toString() : void 0;
            for (const account of logoutAccounts){
                if (seenProviderIds.has(account.providerId)) continue;
                seenProviderIds.add(account.providerId);
                const provider = providersById.get(account.providerId);
                try {
                    const url = await provider?.createEndSessionURL?.({
                        idToken: account.idToken,
                        postLogoutRedirectURI,
                        state: ctx.body?.state
                    });
                    if (url) return url.toString();
                } catch (e) {
                    ctx.context.logger.error(`Failed to create logout URL for provider "${account.providerId}"`, e);
                }
            }
            return null;
        } catch (e) {
            ctx.context.logger.error("Failed to create provider logout URL", e);
            return null;
        }
    })();
    if (providerLogoutResult) {
        const shouldRedirect = !ctx.body?.disableRedirect;
        if (shouldRedirect) ctx.setHeader("Location", providerLogoutResult);
        return ctx.json(signOutResponse({
            url: providerLogoutResult,
            redirect: shouldRedirect
        }));
    }
    return ctx.json(signOutResponse());
});
;
}),
"[project]/examples/nextjs/node_modules/better-auth/dist/api/routes/sign-up.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "signUpEmail",
    ()=>signUpEmail
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$is$2d$api$2d$error$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/utils/is-api-error.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$middlewares$2f$origin$2d$check$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/api/middlewares/origin-check.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$schema$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/db/schema.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/cookies/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$request$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/utils/request.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$routes$2f$email$2d$verification$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/api/routes/email-verification.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$password$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/utils/password.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$transaction$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/context/transaction.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$env$2d$impl$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/env/env-impl.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/error/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/error/codes.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$id$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/utils/id.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$api$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/api/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/zod/v4/classic/schemas.js [app-route] (ecmascript)");
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
//#region src/api/routes/sign-up.ts
const signUpEmailBodySchema = __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["object"]({
    name: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"](),
    email: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["email"](),
    password: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]().nonempty(),
    image: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]().optional(),
    callbackURL: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]().optional(),
    rememberMe: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["boolean"]().optional()
}).and(__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["record"](__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"](), __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["any"]()));
const signUpEmail = ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$api$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAuthEndpoint"])("/sign-up/email", {
        method: "POST",
        operationId: "signUpWithEmailAndPassword",
        use: [
            __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$middlewares$2f$origin$2d$check$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["formCsrfMiddleware"]
        ],
        body: signUpEmailBodySchema,
        cloneRequest: true,
        metadata: {
            allowedMediaTypes: [
                "application/x-www-form-urlencoded",
                "application/json"
            ],
            $Infer: {
                body: {},
                returned: {}
            },
            openapi: {
                operationId: "signUpWithEmailAndPassword",
                description: "Sign up a user using email and password",
                requestBody: {
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    name: {
                                        type: "string",
                                        description: "The name of the user"
                                    },
                                    email: {
                                        type: "string",
                                        description: "The email of the user"
                                    },
                                    password: {
                                        type: "string",
                                        description: "The password of the user"
                                    },
                                    image: {
                                        type: "string",
                                        description: "The profile image URL of the user"
                                    },
                                    callbackURL: {
                                        type: "string",
                                        description: "The URL to use for email verification callback"
                                    },
                                    rememberMe: {
                                        type: "boolean",
                                        description: "If this is false, the session will not be remembered. Default is `true`."
                                    }
                                },
                                required: [
                                    "name",
                                    "email",
                                    "password"
                                ]
                            }
                        }
                    }
                },
                responses: {
                    "200": {
                        description: "Successfully created user",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        token: {
                                            type: "string",
                                            nullable: true,
                                            description: "Authentication token for the session"
                                        },
                                        user: {
                                            type: "object",
                                            properties: {
                                                id: {
                                                    type: "string",
                                                    description: "The unique identifier of the user"
                                                },
                                                email: {
                                                    type: "string",
                                                    format: "email",
                                                    description: "The email address of the user"
                                                },
                                                name: {
                                                    type: "string",
                                                    description: "The name of the user"
                                                },
                                                image: {
                                                    type: "string",
                                                    format: "uri",
                                                    nullable: true,
                                                    description: "The profile image URL of the user"
                                                },
                                                emailVerified: {
                                                    type: "boolean",
                                                    description: "Whether the email has been verified"
                                                },
                                                createdAt: {
                                                    type: "string",
                                                    format: "date-time",
                                                    description: "When the user was created"
                                                },
                                                updatedAt: {
                                                    type: "string",
                                                    format: "date-time",
                                                    description: "When the user was last updated"
                                                }
                                            },
                                            required: [
                                                "id",
                                                "email",
                                                "name",
                                                "emailVerified",
                                                "createdAt",
                                                "updatedAt"
                                            ]
                                        }
                                    },
                                    required: [
                                        "user"
                                    ]
                                }
                            }
                        }
                    },
                    "422": {
                        description: "Unprocessable Entity. User already exists or failed to create user.",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        message: {
                                            type: "string"
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }, async (ctx)=>{
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$transaction$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["runWithTransaction"])(ctx.context.adapter, async ()=>{
            if (!ctx.context.options.emailAndPassword?.enabled || ctx.context.options.emailAndPassword?.disableSignUp) throw __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"].from("BAD_REQUEST", {
                message: "Email and password sign up is not enabled",
                code: "EMAIL_PASSWORD_SIGN_UP_DISABLED"
            });
            const body = ctx.body;
            const { name, email, password, image, callbackURL: _callbackURL, rememberMe, ...rest } = body;
            if (!__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["email"]().safeParse(email).success) throw __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"].from("BAD_REQUEST", __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BASE_ERROR_CODES"].INVALID_EMAIL);
            if (!password || typeof password !== "string") throw __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"].from("BAD_REQUEST", __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BASE_ERROR_CODES"].INVALID_PASSWORD);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$password$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["assertPasswordNotTooShort"])(ctx, password);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$password$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["assertPasswordNotTooLong"])(ctx, password);
            const shouldReturnGenericDuplicateResponse = ctx.context.options.emailAndPassword.requireEmailVerification || ctx.context.options.emailAndPassword.autoSignIn === false;
            const shouldSkipAutoSignIn = ctx.context.options.emailAndPassword.autoSignIn === false || shouldReturnGenericDuplicateResponse;
            const additionalUserFields = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$schema$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseUserInput"])(ctx.context.options, rest, "create");
            const normalizedEmail = email.toLowerCase();
            const buildGenericDuplicateResponse = ()=>{
                const now = /* @__PURE__ */ new Date();
                const generatedId = ctx.context.generateId({
                    model: "user"
                }) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$id$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateId"])();
                const coreFields = {
                    name,
                    email: normalizedEmail,
                    emailVerified: false,
                    image: image ?? null,
                    createdAt: now,
                    updatedAt: now
                };
                const customSyntheticUser = ctx.context.options.emailAndPassword?.customSyntheticUser;
                let syntheticUser;
                if (customSyntheticUser) {
                    const additionalFieldKeys = Object.keys(ctx.context.options.user?.additionalFields ?? {});
                    const additionalFields = {};
                    for (const key of additionalFieldKeys)if (key in additionalUserFields) additionalFields[key] = additionalUserFields[key];
                    const customResult = customSyntheticUser({
                        coreFields,
                        additionalFields,
                        id: generatedId
                    });
                    syntheticUser = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$schema$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["buildSyntheticUserOutput"])(ctx.context.options, customResult);
                } else syntheticUser = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$schema$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["buildSyntheticUserOutput"])(ctx.context.options, {
                    ...coreFields,
                    ...additionalUserFields,
                    id: generatedId
                });
                return ctx.json({
                    token: null,
                    user: (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$schema$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseUserOutput"])(ctx.context.options, syntheticUser)
                });
            };
            const dbUser = await ctx.context.internalAdapter.findUserByEmail(normalizedEmail);
            if (dbUser?.user) {
                ctx.context.logger.info(`Sign-up attempt for existing email: ${email}`);
                if (shouldReturnGenericDuplicateResponse) {
                    /**
				* Hash the password to reduce timing differences
				* between existing and non-existing emails.
				*/ await ctx.context.password.hash(password);
                    if (ctx.context.options.emailAndPassword?.onExistingUserSignUp) await ctx.context.runInBackgroundOrAwait(ctx.context.options.emailAndPassword.onExistingUserSignUp({
                        user: dbUser.user
                    }, (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$request$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["safeCloneRequest"])(ctx.request)));
                    return buildGenericDuplicateResponse();
                }
                throw __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"].from("UNPROCESSABLE_ENTITY", __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BASE_ERROR_CODES"].USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL);
            }
            /**
		* Hash the password
		*
		* This is done prior to creating the user
		* to ensure that any plugin that
		* may break the hashing should break
		* before the user is created.
		*/ const hash = await ctx.context.password.hash(password);
            let createdUser;
            try {
                createdUser = await ctx.context.internalAdapter.createUser({
                    email: normalizedEmail,
                    name,
                    image,
                    ...additionalUserFields,
                    emailVerified: false
                }, {
                    method: "email-password"
                });
                if (!createdUser) throw __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"].from("BAD_REQUEST", __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BASE_ERROR_CODES"].FAILED_TO_CREATE_USER);
            } catch (e) {
                if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$is$2d$api$2d$error$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isAPIError"])(e)) {
                    if (e.statusCode === 403 && shouldReturnGenericDuplicateResponse) return buildGenericDuplicateResponse();
                    throw e;
                }
                if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$env$2d$impl$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isDevelopment"])()) ctx.context.logger.error("Failed to create user", e);
                ctx.context.logger?.error("Failed to create user", e);
                throw __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"].from("UNPROCESSABLE_ENTITY", __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BASE_ERROR_CODES"].FAILED_TO_CREATE_USER);
            }
            if (!createdUser) throw __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"].from("UNPROCESSABLE_ENTITY", __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BASE_ERROR_CODES"].FAILED_TO_CREATE_USER);
            await ctx.context.internalAdapter.linkAccount({
                userId: createdUser.id,
                providerId: "credential",
                accountId: createdUser.id,
                password: hash
            });
            if (ctx.context.options.emailVerification?.sendOnSignUp ?? ctx.context.options.emailAndPassword.requireEmailVerification) {
                const token = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$routes$2f$email$2d$verification$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createEmailVerificationToken"])(ctx.context.secret, createdUser.email, void 0, ctx.context.options.emailVerification?.expiresIn);
                const callbackURL = body.callbackURL ? encodeURIComponent(body.callbackURL) : encodeURIComponent("/");
                const url = `${ctx.context.baseURL}/verify-email?token=${token}&callbackURL=${callbackURL}`;
                if (ctx.context.options.emailVerification?.sendVerificationEmail) await ctx.context.runInBackgroundOrAwait(ctx.context.options.emailVerification.sendVerificationEmail({
                    user: createdUser,
                    url,
                    token
                }, (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$request$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["safeCloneRequest"])(ctx.request)));
            }
            if (shouldSkipAutoSignIn) return ctx.json({
                token: null,
                user: (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$schema$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseUserOutput"])(ctx.context.options, createdUser)
            });
            const session = await ctx.context.internalAdapter.createSession(createdUser.id, rememberMe === false, void 0, void 0, {
                deferSecondaryStorageWrites: true
            });
            if (!session) throw __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"].from("BAD_REQUEST", __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BASE_ERROR_CODES"].FAILED_TO_CREATE_SESSION);
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["setSessionCookie"])(ctx, {
                session,
                user: createdUser
            }, rememberMe === false);
            return ctx.json({
                token: session.token,
                user: (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$schema$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseUserOutput"])(ctx.context.options, createdUser)
            });
        });
    });
;
}),
"[project]/examples/nextjs/node_modules/better-auth/dist/api/routes/update-session.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "updateSession",
    ()=>updateSession
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$schema$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/db/schema.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/cookies/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$routes$2f$session$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/api/routes/session.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/error/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/error/codes.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$api$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/api/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/zod/v4/classic/schemas.js [app-route] (ecmascript)");
;
;
;
;
;
;
//#region src/api/routes/update-session.ts
const updateSessionBodySchema = __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["record"](__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]().meta({
    description: "Field name must be a string"
}), __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["any"]());
const updateSession = ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$api$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAuthEndpoint"])("/update-session", {
        method: "POST",
        operationId: "updateSession",
        body: updateSessionBodySchema,
        use: [
            __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$routes$2f$session$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sessionMiddleware"]
        ],
        metadata: {
            $Infer: {
                body: {}
            },
            openapi: {
                operationId: "updateSession",
                description: "Update the current session",
                responses: {
                    "200": {
                        description: "Success",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        session: {
                                            type: "object",
                                            $ref: "#/components/schemas/Session"
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }, async (ctx)=>{
        const body = ctx.body;
        if (typeof body !== "object" || Array.isArray(body)) throw __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"].from("BAD_REQUEST", __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BASE_ERROR_CODES"].BODY_MUST_BE_AN_OBJECT);
        const session = ctx.context.session;
        const additionalFields = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$schema$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseSessionInput"])(ctx.context.options, body, "update");
        if (Object.keys(additionalFields).length === 0) throw __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"].fromStatus("BAD_REQUEST", {
            message: "No fields to update"
        });
        const updatedSession = await ctx.context.internalAdapter.updateSession(session.session.token, {
            ...additionalFields,
            updatedAt: /* @__PURE__ */ new Date()
        });
        if (!updatedSession && (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$routes$2f$session$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isStateful"])(ctx)) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["deleteSessionCookie"])(ctx);
            throw __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"].from("UNAUTHORIZED", __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BASE_ERROR_CODES"].FAILED_TO_GET_SESSION);
        }
        const newSession = updatedSession ?? {
            ...session.session,
            ...additionalFields,
            updatedAt: /* @__PURE__ */ new Date()
        };
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["setSessionCookie"])(ctx, {
            session: newSession,
            user: session.user
        });
        return ctx.json({
            session: (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$schema$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseSessionOutput"])(ctx.context.options, newSession)
        });
    });
;
}),
"[project]/examples/nextjs/node_modules/better-auth/dist/api/routes/update-user.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "changeEmail",
    ()=>changeEmail,
    "changePassword",
    ()=>changePassword,
    "deleteUser",
    ()=>deleteUser,
    "deleteUserCallback",
    ()=>deleteUserCallback,
    "setPassword",
    ()=>setPassword,
    "updateUser",
    ()=>updateUser
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$middlewares$2f$origin$2d$check$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/api/middlewares/origin-check.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$schema$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/db/schema.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$crypto$2f$random$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/crypto/random.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/cookies/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$routes$2f$session$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/api/routes/session.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$routes$2f$email$2d$verification$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/api/routes/email-verification.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$password$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/utils/password.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$transaction$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/context/transaction.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/error/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/error/codes.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$api$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/api/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/zod/v4/classic/schemas.js [app-route] (ecmascript)");
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
//#region src/api/routes/update-user.ts
const updateUserBodySchema = __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["record"](__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]().meta({
    description: "Field name must be a string"
}), __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["any"]());
const updateUser = ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$api$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAuthEndpoint"])("/update-user", {
        method: "POST",
        operationId: "updateUser",
        body: updateUserBodySchema,
        use: [
            __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$routes$2f$session$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sessionMiddleware"]
        ],
        metadata: {
            $Infer: {
                body: {}
            },
            openapi: {
                operationId: "updateUser",
                description: "Update the current user",
                requestBody: {
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    name: {
                                        type: "string",
                                        description: "The name of the user"
                                    },
                                    image: {
                                        type: "string",
                                        description: "The image of the user",
                                        nullable: true
                                    }
                                }
                            }
                        }
                    }
                },
                responses: {
                    "200": {
                        description: "Success",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        user: {
                                            type: "object",
                                            $ref: "#/components/schemas/User"
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }, async (ctx)=>{
        const body = ctx.body;
        if (typeof body !== "object" || Array.isArray(body)) throw __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"].from("BAD_REQUEST", __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BASE_ERROR_CODES"].BODY_MUST_BE_AN_OBJECT);
        if (body.email) throw __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"].from("BAD_REQUEST", __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BASE_ERROR_CODES"].EMAIL_CAN_NOT_BE_UPDATED);
        const { name, image, ...rest } = body;
        const session = ctx.context.session;
        const additionalFields = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$schema$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseUserInput"])(ctx.context.options, rest, "update");
        if (image === void 0 && name === void 0 && Object.keys(additionalFields).length === 0) throw __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"].fromStatus("BAD_REQUEST", {
            message: "No fields to update"
        });
        const updatedUser = await ctx.context.internalAdapter.updateUser(session.user.id, {
            name,
            image,
            ...additionalFields
        }) ?? {
            ...session.user,
            ...name !== void 0 && {
                name
            },
            ...image !== void 0 && {
                image
            },
            ...additionalFields
        };
        /**
	* Update the session cookie with the new user data
	*/ await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["setSessionCookie"])(ctx, {
            session: session.session,
            user: updatedUser
        });
        return ctx.json({
            status: true
        });
    });
const changePassword = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$api$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAuthEndpoint"])("/change-password", {
    method: "POST",
    operationId: "changePassword",
    body: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["object"]({
        /**
		* The new password to set
		*/ newPassword: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]().meta({
            description: "The new password to set"
        }),
        /**
		* The current password of the user
		*/ currentPassword: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]().meta({
            description: "The current password is required"
        }),
        /**
		* revoke all sessions that are not the
		* current one logged in by the user
		*/ revokeOtherSessions: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["boolean"]().meta({
            description: "Must be a boolean value"
        }).optional()
    }),
    use: [
        __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$routes$2f$session$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sensitiveSessionMiddleware"]
    ],
    metadata: {
        openapi: {
            operationId: "changePassword",
            description: "Change the password of the user",
            responses: {
                "200": {
                    description: "Password successfully changed",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    token: {
                                        type: "string",
                                        nullable: true,
                                        description: "New session token if other sessions were revoked"
                                    },
                                    user: {
                                        type: "object",
                                        properties: {
                                            id: {
                                                type: "string",
                                                description: "The unique identifier of the user"
                                            },
                                            email: {
                                                type: "string",
                                                format: "email",
                                                description: "The email address of the user"
                                            },
                                            name: {
                                                type: "string",
                                                description: "The name of the user"
                                            },
                                            image: {
                                                type: "string",
                                                format: "uri",
                                                nullable: true,
                                                description: "The profile image URL of the user"
                                            },
                                            emailVerified: {
                                                type: "boolean",
                                                description: "Whether the email has been verified"
                                            },
                                            createdAt: {
                                                type: "string",
                                                format: "date-time",
                                                description: "When the user was created"
                                            },
                                            updatedAt: {
                                                type: "string",
                                                format: "date-time",
                                                description: "When the user was last updated"
                                            }
                                        },
                                        required: [
                                            "id",
                                            "email",
                                            "name",
                                            "emailVerified",
                                            "createdAt",
                                            "updatedAt"
                                        ]
                                    }
                                },
                                required: [
                                    "user"
                                ]
                            }
                        }
                    }
                }
            }
        }
    }
}, async (ctx)=>{
    const { newPassword, currentPassword, revokeOtherSessions } = ctx.body;
    const session = ctx.context.session;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$password$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["assertPasswordNotTooShort"])(ctx, newPassword);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$password$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["assertPasswordNotTooLong"])(ctx, newPassword);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$password$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["assertPasswordNotTooLong"])(ctx, currentPassword);
    const account = await ctx.context.internalAdapter.findCredentialAccount(session.user.id);
    if (!account || !account.password) throw __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"].from("BAD_REQUEST", __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BASE_ERROR_CODES"].CREDENTIAL_ACCOUNT_NOT_FOUND);
    const passwordHash = await ctx.context.password.hash(newPassword);
    if (!await ctx.context.password.verify({
        hash: account.password,
        password: currentPassword
    })) throw __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"].from("BAD_REQUEST", __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BASE_ERROR_CODES"].INVALID_PASSWORD);
    const newSession = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$transaction$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["runWithTransaction"])(ctx.context.adapter, async ()=>{
        if (revokeOtherSessions) await ctx.context.internalAdapter.deleteUserSessions(session.user.id);
        await ctx.context.internalAdapter.updateAccount(account.id, {
            password: passwordHash
        });
        if (!revokeOtherSessions) return null;
        const created = await ctx.context.internalAdapter.createSession(session.user.id, void 0, void 0, void 0, {
            deferSecondaryStorageWrites: true
        });
        if (!created) throw __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"].from("INTERNAL_SERVER_ERROR", __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BASE_ERROR_CODES"].FAILED_TO_GET_SESSION);
        return created;
    });
    let token = null;
    if (newSession) {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["setSessionCookie"])(ctx, {
            session: newSession,
            user: session.user
        });
        token = newSession.token;
    }
    return ctx.json({
        token,
        user: (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$schema$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseUserOutput"])(ctx.context.options, session.user)
    });
});
const setPassword = __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$api$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAuthEndpoint"].serverOnly({
    method: "POST",
    body: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["object"]({
        /**
	* The new password to set
	*/ newPassword: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]().meta({
            description: "The new password to set is required"
        })
    }),
    use: [
        __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$routes$2f$session$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sensitiveSessionMiddleware"]
    ]
}, async (ctx)=>{
    const { newPassword } = ctx.body;
    const session = ctx.context.session;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$password$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["assertPasswordNotTooShort"])(ctx, newPassword);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$password$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["assertPasswordNotTooLong"])(ctx, newPassword);
    const account = await ctx.context.internalAdapter.findCredentialAccount(session.user.id);
    const passwordHash = await ctx.context.password.hash(newPassword);
    if (!account) {
        await ctx.context.internalAdapter.linkAccount({
            userId: session.user.id,
            providerId: "credential",
            accountId: session.user.id,
            password: passwordHash
        });
        return ctx.json({
            status: true
        });
    }
    if (!account.password) {
        await ctx.context.internalAdapter.updateAccount(account.id, {
            password: passwordHash
        });
        return ctx.json({
            status: true
        });
    }
    throw __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"].from("BAD_REQUEST", __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BASE_ERROR_CODES"].PASSWORD_ALREADY_SET);
});
const deleteUser = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$api$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAuthEndpoint"])("/delete-user", {
    method: "POST",
    use: [
        __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$routes$2f$session$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sensitiveSessionMiddleware"]
    ],
    body: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["object"]({
        /**
		* The callback URL to redirect to after the user is deleted
		* this is only used on delete user callback
		*/ callbackURL: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]().meta({
            description: "The callback URL to redirect to after the user is deleted"
        }).optional(),
        /**
		* The password of the user. If the password isn't provided, session freshness
		* will be checked.
		*/ password: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]().meta({
            description: "The password of the user is required to delete the user"
        }).optional(),
        /**
		* The token to delete the user. If the token is provided, the user will be deleted
		*/ token: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]().meta({
            description: "The token to delete the user is required"
        }).optional()
    }),
    metadata: {
        openapi: {
            operationId: "deleteUser",
            description: "Delete the user",
            requestBody: {
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                callbackURL: {
                                    type: "string",
                                    description: "The callback URL to redirect to after the user is deleted"
                                },
                                password: {
                                    type: "string",
                                    description: "The user's password. Required if session is not fresh"
                                },
                                token: {
                                    type: "string",
                                    description: "The deletion verification token"
                                }
                            }
                        }
                    }
                }
            },
            responses: {
                "200": {
                    description: "User deletion processed successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    success: {
                                        type: "boolean",
                                        description: "Indicates if the operation was successful"
                                    },
                                    message: {
                                        type: "string",
                                        enum: [
                                            "User deleted",
                                            "Verification email sent"
                                        ],
                                        description: "Status message of the deletion process"
                                    }
                                },
                                required: [
                                    "success",
                                    "message"
                                ]
                            }
                        }
                    }
                }
            }
        }
    }
}, async (ctx)=>{
    if (!ctx.context.options.user?.deleteUser?.enabled) {
        ctx.context.logger.error("Delete user is disabled. Enable it in the options");
        throw __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"].fromStatus("NOT_FOUND");
    }
    const session = ctx.context.session;
    if (ctx.body.password) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$password$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["assertPasswordNotTooLong"])(ctx, ctx.body.password);
        const account = await ctx.context.internalAdapter.findCredentialAccount(session.user.id);
        if (!account || !account.password) throw __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"].from("BAD_REQUEST", __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BASE_ERROR_CODES"].CREDENTIAL_ACCOUNT_NOT_FOUND);
        if (!await ctx.context.password.verify({
            hash: account.password,
            password: ctx.body.password
        })) throw __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"].from("BAD_REQUEST", __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BASE_ERROR_CODES"].INVALID_PASSWORD);
    }
    if (ctx.body.token) {
        await deleteUserCallback({
            ...ctx,
            query: {
                token: ctx.body.token
            }
        });
        return ctx.json({
            success: true,
            message: "User deleted"
        });
    }
    if (ctx.context.options.user.deleteUser?.sendDeleteAccountVerification) {
        const token = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$crypto$2f$random$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateRandomString"])(32, "0-9", "a-z");
        await ctx.context.internalAdapter.createVerificationValue({
            value: session.user.id,
            identifier: `delete-account-${token}`,
            expiresAt: new Date(Date.now() + (ctx.context.options.user.deleteUser?.deleteTokenExpiresIn || 3600 * 24) * 1e3)
        });
        const url = `${ctx.context.baseURL}/delete-user/callback?token=${token}&callbackURL=${encodeURIComponent(ctx.body.callbackURL || "/")}`;
        await ctx.context.runInBackgroundOrAwait(ctx.context.options.user.deleteUser.sendDeleteAccountVerification({
            user: session.user,
            url,
            token
        }, ctx.request));
        return ctx.json({
            success: true,
            message: "Verification email sent"
        });
    }
    if (!ctx.body.password && ctx.context.sessionConfig.freshAge !== 0) {
        const createdAt = new Date(session.session.createdAt).getTime();
        const freshAge = ctx.context.sessionConfig.freshAge * 1e3;
        if (Date.now() - createdAt >= freshAge) throw __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"].from("BAD_REQUEST", __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BASE_ERROR_CODES"].SESSION_EXPIRED);
    }
    const beforeDelete = ctx.context.options.user.deleteUser?.beforeDelete;
    if (beforeDelete) await beforeDelete(session.user, ctx.request);
    await ctx.context.internalAdapter.deleteUser(session.user.id);
    await ctx.context.internalAdapter.deleteUserSessions(session.user.id);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["deleteSessionCookie"])(ctx);
    const afterDelete = ctx.context.options.user.deleteUser?.afterDelete;
    if (afterDelete) await afterDelete(session.user, ctx.request);
    return ctx.json({
        success: true,
        message: "User deleted"
    });
});
const deleteUserCallback = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$api$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAuthEndpoint"])("/delete-user/callback", {
    method: "GET",
    query: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["object"]({
        token: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]().meta({
            description: "The token to verify the deletion request"
        }),
        callbackURL: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]().meta({
            description: "The URL to redirect to after deletion"
        }).optional()
    }),
    use: [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$middlewares$2f$origin$2d$check$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["originCheck"])((ctx)=>ctx.query.callbackURL)
    ],
    metadata: {
        openapi: {
            description: "Callback to complete user deletion with verification token",
            responses: {
                "200": {
                    description: "User successfully deleted",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    success: {
                                        type: "boolean",
                                        description: "Indicates if the deletion was successful"
                                    },
                                    message: {
                                        type: "string",
                                        enum: [
                                            "User deleted"
                                        ],
                                        description: "Confirmation message"
                                    }
                                },
                                required: [
                                    "success",
                                    "message"
                                ]
                            }
                        }
                    }
                }
            }
        }
    }
}, async (ctx)=>{
    if (!ctx.context.options.user?.deleteUser?.enabled) {
        ctx.context.logger.error("Delete user is disabled. Enable it in the options");
        throw __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"].from("NOT_FOUND", {
            message: "Not found",
            code: "NOT_FOUND"
        });
    }
    const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$routes$2f$session$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getSessionFromCtx"])(ctx, {
        disableCookieCache: (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$routes$2f$session$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isStateful"])(ctx)
    });
    if (!session) throw __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"].from("NOT_FOUND", __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BASE_ERROR_CODES"].FAILED_TO_GET_USER_INFO);
    const token = await ctx.context.internalAdapter.consumeVerificationValue(`delete-account-${ctx.query.token}`);
    if (!token || token.value !== session.user.id) throw __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"].from("NOT_FOUND", __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BASE_ERROR_CODES"].INVALID_TOKEN);
    const beforeDelete = ctx.context.options.user.deleteUser?.beforeDelete;
    if (beforeDelete) await beforeDelete(session.user, ctx.request);
    await ctx.context.internalAdapter.deleteUser(session.user.id);
    await ctx.context.internalAdapter.deleteUserSessions(session.user.id);
    await ctx.context.internalAdapter.deleteAccounts(session.user.id);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["deleteSessionCookie"])(ctx);
    const afterDelete = ctx.context.options.user.deleteUser?.afterDelete;
    if (afterDelete) await afterDelete(session.user, ctx.request);
    if (ctx.query.callbackURL) throw ctx.redirect(ctx.query.callbackURL || "/");
    return ctx.json({
        success: true,
        message: "User deleted"
    });
});
const changeEmail = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$api$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAuthEndpoint"])("/change-email", {
    method: "POST",
    body: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["object"]({
        newEmail: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["email"]().meta({
            description: "The new email address to set must be a valid email address"
        }),
        callbackURL: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]().meta({
            description: "The URL to redirect to after email verification"
        }).optional()
    }),
    use: [
        __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$routes$2f$session$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sensitiveSessionMiddleware"]
    ],
    metadata: {
        openapi: {
            operationId: "changeEmail",
            responses: {
                "200": {
                    description: "Email change request processed successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    user: {
                                        type: "object",
                                        $ref: "#/components/schemas/User"
                                    },
                                    status: {
                                        type: "boolean",
                                        description: "Indicates if the request was successful"
                                    },
                                    message: {
                                        type: "string",
                                        enum: [
                                            "Email updated",
                                            "Verification email sent"
                                        ],
                                        description: "Status message of the email change process",
                                        nullable: true
                                    }
                                },
                                required: [
                                    "status"
                                ]
                            }
                        }
                    }
                }
            }
        }
    }
}, async (ctx)=>{
    if (!ctx.context.options.user?.changeEmail?.enabled) {
        ctx.context.logger.error("Change email is disabled.");
        throw __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"].from("BAD_REQUEST", __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BASE_ERROR_CODES"].CHANGE_EMAIL_DISABLED);
    }
    const newEmail = ctx.body.newEmail.toLowerCase();
    if (newEmail === ctx.context.session.user.email) {
        ctx.context.logger.warn("Email is the same");
        throw __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"].fromStatus("BAD_REQUEST", {
            message: "Email is the same"
        });
    }
    /**
	* Early config check: ensure at least one email-change flow is
	* available for the current session state. Without this, an
	* existing-email lookup would return 200 while a non-existing
	* email would later throw 400, leaking email existence.
	*/ const canUpdateWithoutVerification = ctx.context.session.user.emailVerified !== true && ctx.context.options.user.changeEmail.updateEmailWithoutVerification;
    const canSendVerification = ctx.context.options.emailVerification?.sendVerificationEmail;
    const canSendConfirmation = canSendVerification && ctx.context.session.user.emailVerified && ctx.context.options.user.changeEmail.sendChangeEmailConfirmation;
    if (!canUpdateWithoutVerification && !canSendConfirmation && !canSendVerification) {
        ctx.context.logger.error("Verification email isn't enabled.");
        throw __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"].fromStatus("BAD_REQUEST", {
            message: "Verification email isn't enabled"
        });
    }
    if (await ctx.context.internalAdapter.findUserByEmail(newEmail)) {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$routes$2f$email$2d$verification$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createEmailVerificationToken"])(ctx.context.secret, ctx.context.session.user.email, newEmail, ctx.context.options.emailVerification?.expiresIn);
        ctx.context.logger.info("Change email attempt for existing email");
        return ctx.json({
            status: true
        });
    }
    /**
	* If the email is not verified, we can update the email if the option is enabled
	*/ if (canUpdateWithoutVerification) {
        await ctx.context.internalAdapter.updateUser(ctx.context.session.user.id, {
            email: newEmail
        });
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["setSessionCookie"])(ctx, {
            session: ctx.context.session.session,
            user: {
                ...ctx.context.session.user,
                email: newEmail
            }
        });
        if (canSendVerification) {
            const token = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$routes$2f$email$2d$verification$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createEmailVerificationToken"])(ctx.context.secret, newEmail, void 0, ctx.context.options.emailVerification?.expiresIn);
            const url = `${ctx.context.baseURL}/verify-email?token=${token}&callbackURL=${encodeURIComponent(ctx.body.callbackURL || "/")}`;
            await ctx.context.runInBackgroundOrAwait(canSendVerification({
                user: {
                    ...ctx.context.session.user,
                    email: newEmail
                },
                url,
                token
            }, ctx.request));
        }
        return ctx.json({
            status: true
        });
    }
    /**
	* If the email is verified, we need to send a verification email
	*/ if (canSendConfirmation) {
        const token = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$routes$2f$email$2d$verification$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createEmailVerificationToken"])(ctx.context.secret, ctx.context.session.user.email, newEmail, ctx.context.options.emailVerification?.expiresIn, {
            requestType: "change-email-confirmation"
        });
        const url = `${ctx.context.baseURL}/verify-email?token=${token}&callbackURL=${encodeURIComponent(ctx.body.callbackURL || "/")}`;
        await ctx.context.runInBackgroundOrAwait(canSendConfirmation({
            user: ctx.context.session.user,
            newEmail,
            url,
            token
        }, ctx.request));
        return ctx.json({
            status: true
        });
    }
    if (!canSendVerification) {
        ctx.context.logger.error("Verification email isn't enabled.");
        throw __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"].fromStatus("BAD_REQUEST", {
            message: "Verification email isn't enabled"
        });
    }
    const token = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$routes$2f$email$2d$verification$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createEmailVerificationToken"])(ctx.context.secret, ctx.context.session.user.email, newEmail, ctx.context.options.emailVerification?.expiresIn, {
        requestType: "change-email-verification"
    });
    const url = `${ctx.context.baseURL}/verify-email?token=${token}&callbackURL=${encodeURIComponent(ctx.body.callbackURL || "/")}`;
    await ctx.context.runInBackgroundOrAwait(canSendVerification({
        user: {
            ...ctx.context.session.user,
            email: newEmail
        },
        url,
        token
    }, ctx.request));
    return ctx.json({
        status: true
    });
});
;
}),
"[project]/examples/nextjs/node_modules/better-auth/dist/api/state/oauth.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "addOAuthServerContext",
    ()=>addOAuthServerContext,
    "getOAuthServerContext",
    ()=>getOAuthServerContext,
    "getOAuthState",
    ()=>getOAuthState,
    "setOAuthState",
    ()=>setOAuthState
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$request$2d$state$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/context/request-state.mjs [app-route] (ecmascript)");
;
//#region src/api/state/oauth.ts
const { get: getRawOAuthState, set: setOAuthState } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$request$2d$state$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["defineRequestState"])(()=>null);
/**
* Reads the OAuth state for the current request. During a callback it holds the
* state parsed from the provider redirect; during sign-in it holds the state
* just generated.
*
* Top-level keys beyond the documented fields are client-supplied
* (`additionalData`) and must not be trusted. Server-trusted values live under
* {@link OAuthState.serverContext}.
*/ const getOAuthState = async ()=>{
    return await getRawOAuthState();
};
/**
* @internal Read accumulated server context to embed during state generation.
*/ const { get: getOAuthServerContext, set: setOAuthServerContext } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$request$2d$state$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["defineRequestState"])(()=>null);
/**
* Attaches server-trusted data to the current OAuth flow so it survives the
* provider redirect. Call this from a `before` hook on an OAuth sign-in path
* (for example `/sign-in/social` or `/sign-in/oauth2`). `generateState` embeds
* the accumulated values into the state, and they become readable on the
* callback via `getOAuthState().serverContext`.
*
* Unlike the request body's `additionalData`, values set here cannot be spoofed
* by the client. Multiple callers merge: each call adds its own keys. Values are
* stored as `unknown`, so narrow their shape when reading them back.
*/ const addOAuthServerContext = async (values)=>{
    await setOAuthServerContext({
        ...await getOAuthServerContext() ?? {},
        ...values
    });
};
;
}),
"[project]/examples/nextjs/node_modules/better-auth/dist/api/state/should-session-refresh.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getShouldSkipSessionRefresh",
    ()=>getShouldSkipSessionRefresh,
    "setShouldSkipSessionRefresh",
    ()=>setShouldSkipSessionRefresh
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$request$2d$state$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/context/request-state.mjs [app-route] (ecmascript)");
;
//#region src/api/state/should-session-refresh.ts
/**
* State for skipping session refresh
*
* In some cases, such as when using server-side rendering (SSR) or when dealing with
* certain types of requests, it may be necessary to skip session refresh to prevent
* potential inconsistencies between the session data in the database and the session
* data stored in cookies.
*/ const { get: getShouldSkipSessionRefresh, set: setShouldSkipSessionRefresh } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$request$2d$state$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["defineRequestState"])(()=>false);
;
}),
"[project]/examples/nextjs/node_modules/better-auth/dist/api/to-auth-endpoints.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "toAuthEndpoints",
    ()=>toAuthEndpoints
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$url$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/utils/url.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$context$2f$helpers$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/context/helpers.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$dispatch$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/api/dispatch.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$request$2d$state$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/context/request-state.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/error/index.mjs [app-route] (ecmascript) <locals>");
;
;
;
;
;
//#region src/api/to-auth-endpoints.ts
/**
* Resolves the per-call `AuthContext` for endpoints with a dynamic `baseURL`.
*
* - `rawCtx.baseURL` already set: HTTP handler rehydrated upstream; return as-is.
* - Direct `auth.api` call with a source or a configured `fallback`: resolve here.
* - Neither: throw `APIError` with a helpful message. Leaving `baseURL = ""`
*   would let plugins build `new URL("")` and crash cryptically downstream.
*/ async function resolveDynamicContext(rawCtx, input) {
    if (rawCtx.baseURL) return rawCtx;
    const source = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$context$2f$helpers$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pickSource"])(input);
    const config = rawCtx.options.baseURL;
    const hasFallback = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$url$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isDynamicBaseURLConfig"])(config) && Boolean(config.fallback);
    if (source === void 0 && !hasFallback) throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"]("INTERNAL_SERVER_ERROR", {
        message: "Dynamic baseURL could not be resolved for this direct auth.api call. Pass `headers: request.headers` (or `request`) to the call, or add `fallback` to your baseURL config."
    });
    try {
        return await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$context$2f$helpers$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["resolveRequestContext"])(rawCtx, source, (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$context$2f$helpers$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["resolveDynamicTrustedProxyHeaders"])(rawCtx.options));
    } catch (err) {
        if (err instanceof __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["BetterAuthError"]) throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"]("INTERNAL_SERVER_ERROR", {
            message: err.message
        });
        throw err;
    }
}
/**
* Wraps each raw endpoint so a router or `auth.api.*` call runs it through the
* configured hook pipeline. Per-call work that is specific to this entry point
* (dynamic `baseURL` resolution, request-state initialization) happens here;
* the hook pipeline itself lives in {@link dispatchAuthEndpoint}.
*/ function toAuthEndpoints(endpoints, ctx) {
    const api = {};
    for (const [key, endpoint] of Object.entries(endpoints)){
        api[key] = async (context)=>{
            const operationId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$dispatch$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getOperationId"])(endpoint, key);
            const run = async ()=>{
                const rawContext = await ctx;
                const pendingSchemaCheck = rawContext.checkSchema?.();
                if (pendingSchemaCheck) await pendingSchemaCheck;
                const authContext = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$url$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isDynamicBaseURLConfig"])(rawContext.options.baseURL) ? await resolveDynamicContext(rawContext, context) : rawContext;
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$dispatch$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["dispatchAuthEndpoint"])(endpoint, {
                    ...context,
                    context: authContext,
                    operationId,
                    asResponse: context?.asResponse ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$url$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isRequestLike"])(context?.request)
                });
            };
            if (await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$request$2d$state$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["hasRequestState"])()) return run();
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$request$2d$state$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["runWithRequestState"])(/* @__PURE__ */ new WeakMap(), run);
        };
        api[key].path = endpoint.path;
        api[key].options = endpoint.options;
    }
    return api;
}
;
}),
"[project]/examples/nextjs/node_modules/better-auth/dist/auth/base.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createBetterAuth",
    ()=>createBetterAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$url$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/utils/url.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$context$2f$helpers$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/context/helpers.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/api/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$transaction$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/context/transaction.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/error/codes.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/error/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$db$2f$schema$2d$diff$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/db/schema-diff.mjs [app-route] (ecmascript)");
;
;
;
;
;
;
//#region src/auth/base.ts
const createBetterAuth = (options, initFn)=>{
    const authContext = initFn(options).then((ctx)=>{
        const validateSchema = ctx.options.advanced?.database?.validateSchema;
        if (!ctx.checkSchema && validateSchema !== false) {
            const level = validateSchema === true ? "warn" : "debug";
            ctx.logger[level](`Schema validation is not available for adapter "${ctx.adapter.id}". Skipping schema validation. Database operations will proceed normally.`);
        }
        const pendingSchemaCheck = ctx.checkSchema?.();
        if (pendingSchemaCheck) pendingSchemaCheck.catch((error)=>{
            ctx.logger.error(error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$db$2f$schema$2d$diff$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SchemaMismatchError"] ? error.message : "Could not validate the database schema. Check your database connection.");
        });
        return ctx;
    });
    const { api } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["getEndpoints"])(authContext, options);
    const errorCodes = options.plugins?.reduce((acc, plugin)=>{
        if (plugin.$ERROR_CODES) return {
            ...acc,
            ...plugin.$ERROR_CODES
        };
        return acc;
    }, {});
    const handler = async (request)=>{
        const ctx = await authContext;
        const basePath = ctx.options.basePath || "/api/auth";
        let handlerCtx;
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$url$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isDynamicBaseURLConfig"])(options.baseURL)) handlerCtx = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$context$2f$helpers$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["resolveRequestContext"])(ctx, request, (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$context$2f$helpers$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["resolveDynamicTrustedProxyHeaders"])(ctx.options));
        else {
            handlerCtx = Object.create(Object.getPrototypeOf(ctx), Object.getOwnPropertyDescriptors(ctx));
            let trustOptions = ctx.options;
            if (!ctx.options.baseURL) {
                const baseURL = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$url$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getBaseURL"])(void 0, basePath, request, void 0, ctx.options.advanced?.trustedProxyHeaders);
                if (!baseURL) throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["BetterAuthError"]("Could not get base URL from request. Please provide a valid base URL.");
                handlerCtx.baseURL = baseURL;
                handlerCtx.options = {
                    ...ctx.options,
                    baseURL: (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$url$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getOrigin"])(baseURL) || void 0
                };
                trustOptions = handlerCtx.options;
            }
            handlerCtx.trustedOrigins = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$context$2f$helpers$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getTrustedOrigins"])(trustOptions, request);
            handlerCtx.trustedProviders = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$context$2f$helpers$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getTrustedProviders"])(trustOptions, request);
        }
        const { handler } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["router"])(handlerCtx, options);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$transaction$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["runWithAdapter"])(handlerCtx.adapter, ()=>handler(request));
    };
    return {
        handler,
        fetch: handler,
        api,
        options,
        $context: authContext,
        $ERROR_CODES: {
            ...errorCodes,
            ...__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BASE_ERROR_CODES"]
        }
    };
};
;
}),
"[project]/examples/nextjs/node_modules/better-auth/dist/auth/full.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "betterAuth",
    ()=>betterAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$context$2f$init$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/context/init.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$auth$2f$base$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/auth/base.mjs [app-route] (ecmascript)");
;
;
//#region src/auth/full.ts
/**
* Better Auth initializer for full mode (with Kysely)
*
* @example
* ```ts
* import { betterAuth } from "better-auth";
*
* const auth = betterAuth({
* 	database: new PostgresDialect({ connection: process.env.DATABASE_URL }),
* });
* ```
*
* For minimal mode (without Kysely), import from `better-auth/minimal` instead
* @example
* ```ts
* import { betterAuth } from "better-auth/minimal";
*
* const auth = betterAuth({
*	  database: drizzleAdapter(db, { provider: "pg" }),
* });
*/ const betterAuth = (options)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$auth$2f$base$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createBetterAuth"])(options, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$context$2f$init$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["init"]);
};
;
}),
"[project]/examples/nextjs/node_modules/better-auth/dist/auth/trusted-origins.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "matchesOriginPattern",
    ()=>matchesOriginPattern
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$wildcard$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/utils/wildcard.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$url$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/utils/url.mjs [app-route] (ecmascript)");
;
;
//#region src/auth/trusted-origins.ts
const CONTROL_CHARACTER_PATTERN = /[\u0000-\u001f\u007f-\u009f]/;
const RELATIVE_URL_PARSER_ORIGIN = "https://better-auth.invalid";
const ENCODED_PATH_SEPARATOR_PATTERN = /%2[fF]|%5[cC]/;
/**
* Resolves `.` and `..` segments in a path after percent-decoding so a
* path-pinned pattern cannot be bypassed with traversal: e.g.
* `myapp://host/cb/../evil` must not satisfy pattern `myapp://host/cb`.
* Returns "" for an empty or root path.
*/ const normalizePath = (path)=>{
    let decoded = path;
    try {
        decoded = decodeURIComponent(path);
    } catch  {}
    const segments = [];
    for (const segment of decoded.split("/"))if (segment === "..") segments.pop();
    else if (segment !== "." && segment !== "") segments.push(segment);
    return segments.length > 0 ? `/${segments.join("/")}` : "";
};
/**
* Splits a custom-scheme origin into its scheme, authority and path using
* plain string operations.
*
* `new URL()` is deliberately avoided here: its parsing of non-special schemes
* (e.g. `myapp://`, `exp://`) is not consistent across the runtimes Better Auth
* targets (Node, Bun, Deno, Cloudflare Workers), and the result of an origin
* check must not depend on which engine extracts the authority.
*
* Scheme and authority are lower-cased (matching how a URL canonicalizes its
* host); the path is percent-decoded and resolved so traversal cannot bypass
* a path-pinned pattern.
*/ const parseCustomSchemeOrigin = (value)=>{
    if (CONTROL_CHARACTER_PATTERN.test(value)) return null;
    const schemeEnd = value.indexOf(":");
    if (schemeEnd <= 0) return null;
    const scheme = value.slice(0, schemeEnd).toLowerCase();
    let rest = value.slice(schemeEnd + 1);
    let authority = "";
    if (rest.startsWith("//")) {
        rest = rest.slice(2);
        const authorityEnd = rest.search(/[/?#]/);
        if (authorityEnd === -1) {
            authority = rest;
            rest = "";
        } else {
            authority = rest.slice(0, authorityEnd);
            rest = rest.slice(authorityEnd);
        }
    }
    const pathEnd = rest.search(/[?#]/);
    const path = normalizePath(pathEnd === -1 ? rest : rest.slice(0, pathEnd));
    return {
        scheme,
        authority: authority.toLowerCase(),
        path
    };
};
/**
* Validates root-relative redirects against ambiguous browser and router parsing.
*
* @see https://www.rfc-editor.org/rfc/rfc3986.html#section-4.2
* @see https://url.spec.whatwg.org/#concept-basic-url-parser
*/ const isSafeRelativeURL = (value)=>{
    if (!value.startsWith("/") || value.startsWith("//") || value.includes("\\") || CONTROL_CHARACTER_PATTERN.test(value)) return false;
    const pathEnd = value.search(/[?#]/);
    const path = pathEnd === -1 ? value : value.slice(0, pathEnd);
    if (ENCODED_PATH_SEPARATOR_PATTERN.test(path)) return false;
    try {
        return new URL(value, RELATIVE_URL_PARSER_ORIGIN).origin === RELATIVE_URL_PARSER_ORIGIN;
    } catch  {
        return false;
    }
};
/**
* Matches the given url against an origin or origin pattern
* See "options.trustedOrigins" for details of supported patterns
*
* @param url The url to test
* @param pattern The origin pattern
* @param [settings] Specify supported pattern matching settings
* @returns {boolean} true if the URL matches the origin pattern, false otherwise.
*/ const matchesOriginPattern = (url, pattern, settings)=>{
    if (url.startsWith("/")) return settings?.allowRelativePaths === true && isSafeRelativeURL(url);
    if (pattern.includes("*") || pattern.includes("?")) {
        if (pattern.includes("://")) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$wildcard$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["wildcardMatch"])(pattern)((0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$url$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getOrigin"])(url) || url);
        const host = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$url$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getHost"])(url);
        if (!host) return false;
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$wildcard$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["wildcardMatch"])(pattern)(host);
    }
    const protocol = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$url$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getProtocol"])(url);
    if (protocol === "http:" || protocol === "https:" || !protocol) return pattern === (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$url$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getOrigin"])(url);
    const parsed = parseCustomSchemeOrigin(url);
    const parsedPattern = parseCustomSchemeOrigin(pattern);
    if (!parsed || !parsedPattern || parsed.scheme !== parsedPattern.scheme) return false;
    if (parsedPattern.authority && parsed.authority !== parsedPattern.authority) return false;
    if (!parsedPattern.path) return true;
    return parsed.path === parsedPattern.path || parsed.path.startsWith(`${parsedPattern.path}/`);
};
;
}),
"[project]/examples/nextjs/node_modules/better-auth/dist/context/create-context.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createAuthContext",
    ()=>createAuthContext
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$url$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/utils/url.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$auth$2f$trusted$2d$origins$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/auth/trusted-origins.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$context$2f$store$2d$capabilities$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/context/store-capabilities.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$is$2d$promise$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/utils/is-promise.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$crypto$2f$password$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/crypto/password.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/cookies/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$internal$2d$adapter$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/db/internal-adapter.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$context$2f$helpers$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/context/helpers.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$password$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/utils/password.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/api/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$constants$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/utils/constants.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$context$2f$secret$2d$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/context/secret-utils.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$global$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/context/global.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$db$2f$get$2d$tables$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/db/get-tables.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$logger$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/env/logger.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$env$2d$impl$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/env/env-impl.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/error/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$id$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/utils/id.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$db$2f$schema$2d$check$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/db/schema-check.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$social$2d$providers$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/social-providers/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$ip$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/utils/ip.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$telemetry$2f$dist$2f$node$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/telemetry/dist/node.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$defu$2f$dist$2f$defu$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/defu/dist/defu.mjs [app-route] (ecmascript)");
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
//#region src/context/create-context.ts
/**
* Estimates the entropy of a string in bits.
* This is a simple approximation that helps detect low-entropy secrets.
*/ function estimateEntropy(str) {
    const unique = new Set(str).size;
    if (unique === 0) return 0;
    return Math.log2(Math.pow(unique, str.length));
}
/**
* Validates that the secret meets minimum security requirements.
* Throws BetterAuthError if the secret is invalid.
* Skips validation for DEFAULT_SECRET in test environments only.
* Only throws for DEFAULT_SECRET in production environment.
*/ function validateSecret(secret, logger) {
    const isDefaultSecret = secret === __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$constants$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DEFAULT_SECRET"];
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$env$2d$impl$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isTest"])()) return;
    if (isDefaultSecret && __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$env$2d$impl$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isProduction"]) throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["BetterAuthError"]("You are using the default secret. Please set `BETTER_AUTH_SECRET` in your environment variables or pass `secret` in your auth config.");
    if (!secret) throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["BetterAuthError"]("BETTER_AUTH_SECRET is missing. Set it in your environment or pass `secret` to betterAuth({ secret }).");
    if (secret.length < 32) logger.warn(`[better-auth] Warning: your BETTER_AUTH_SECRET should be at least 32 characters long for adequate security. Generate one with \`npx auth secret\` or \`openssl rand -base64 32\`.`);
    if (estimateEntropy(secret) < 120) logger.warn("[better-auth] Warning: your BETTER_AUTH_SECRET appears low-entropy. Use a randomly generated secret for production.");
}
async function createAuthContext(adapter, options, getDatabaseType) {
    const isStateful = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$context$2f$store$2d$capabilities$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["hasServerSessionStore"])(options);
    if (!isStateful) options = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$defu$2f$dist$2f$defu$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])(options, {
        session: {
            cookieCache: {
                enabled: true,
                strategy: "jwe",
                refreshCache: true,
                maxAge: options.session?.expiresIn || 3600 * 24 * 7
            }
        }
    });
    if (!options.database) options = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$defu$2f$dist$2f$defu$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])(options, {
        account: {
            storeAccountCookie: true
        }
    });
    const plugins = options.plugins || [];
    const internalPlugins = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$context$2f$helpers$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getInternalPlugins"])(options);
    const logger = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$logger$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createLogger"])(options.logger);
    const isDynamicConfig = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$url$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isDynamicBaseURLConfig"])(options.baseURL);
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$url$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isDynamicBaseURLConfig"])(options.baseURL)) {
        const { allowedHosts } = options.baseURL;
        if (!allowedHosts || allowedHosts.length === 0) throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["BetterAuthError"]("baseURL.allowedHosts cannot be empty. Provide at least one allowed host pattern (e.g., [\"myapp.com\", \"*.vercel.app\"]).");
    }
    const baseURL = isDynamicConfig ? void 0 : (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$url$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getBaseURL"])(typeof options.baseURL === "string" ? options.baseURL : void 0, options.basePath);
    if (!baseURL && !isDynamicConfig) logger.warn(`[better-auth] Base URL is not set. Set the baseURL option or BETTER_AUTH_URL env, or use a dynamic baseURL with allowedHosts for multi-host setups. Without it the origin is derived from the incoming request, and callbacks and redirects may not work correctly.`);
    if (adapter.id === "memory" && options.advanced?.database?.generateId === false) logger.error(`[better-auth] Misconfiguration detected.
You are using the memory DB with generateId: false.
This will cause no id to be generated for any model.
Most of the features of Better Auth will not work correctly.`);
    const secretsArray = options.secrets ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$context$2f$secret$2d$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseSecretsEnv"])(__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$env$2d$impl$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["env"].BETTER_AUTH_SECRETS);
    const legacySecret = options.secret || __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$env$2d$impl$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["env"].BETTER_AUTH_SECRET || __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$env$2d$impl$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["env"].AUTH_SECRET || "";
    let secret;
    let secretConfig;
    if (secretsArray) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$context$2f$secret$2d$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["validateSecretsArray"])(secretsArray, logger);
        secret = secretsArray[0].value;
        secretConfig = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$context$2f$secret$2d$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["buildSecretConfig"])(secretsArray, legacySecret);
    } else {
        secret = legacySecret || "better-auth-secret-12345678901234567890";
        validateSecret(secret, logger);
        secretConfig = secret;
    }
    options = {
        ...options,
        secret,
        baseURL: isDynamicConfig ? options.baseURL : baseURL ? new URL(baseURL).origin : "",
        basePath: options.basePath || "/api/auth",
        plugins: plugins.concat(internalPlugins)
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["checkEndpointConflicts"])(options, logger);
    const trustedProxies = options.advanced?.ipAddress?.trustedProxies;
    if (trustedProxies && trustedProxies.length > 0) {
        const invalid = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$ip$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["findInvalidTrustedProxies"])(trustedProxies);
        if (invalid.length > 0) logger.warn(`Ignoring invalid \`advanced.ipAddress.trustedProxies\` entries: ${invalid.join(", ")}. Each entry must be an IP address or CIDR range.`);
    }
    const cookies = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["getCookies"])(options);
    const tables = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$db$2f$get$2d$tables$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getAuthTables"])(options);
    const providers = (await Promise.all(Object.entries(options.socialProviders || {}).map(async ([key, originalConfig])=>{
        const config = typeof originalConfig === "function" ? await originalConfig() : originalConfig;
        if (config == null) return null;
        if (config.enabled === false) return null;
        if (!config.clientId) logger.warn(`Social provider ${key} is missing clientId or clientSecret`);
        const provider = __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$social$2d$providers$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["socialProviders"][key](config);
        provider.disableImplicitSignUp = config.disableImplicitSignUp;
        return provider;
    }))).filter((x)=>x !== null);
    const generateIdFunc = ({ model, size })=>{
        if (typeof options.advanced?.generateId === "function") return options.advanced.generateId({
            model,
            size
        });
        const dbGenerateId = options?.advanced?.database?.generateId;
        if (typeof dbGenerateId === "function") return dbGenerateId({
            model,
            size
        });
        if (dbGenerateId === "uuid") return crypto.randomUUID();
        if (dbGenerateId === "serial" || dbGenerateId === false) return false;
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$id$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateId"])(size);
    };
    const { publish } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$telemetry$2f$dist$2f$node$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createTelemetry"])(options, {
        adapter: adapter.id,
        database: typeof options.database === "function" ? "adapter" : getDatabaseType(options.database)
    });
    const pluginIds = new Set(options.plugins.map((p)=>p.id));
    const getPluginFn = (id)=>options.plugins.find((p)=>p.id === id) ?? null;
    const hasPluginFn = (id)=>pluginIds.has(id);
    const trustedOrigins = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$context$2f$helpers$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getTrustedOrigins"])(options);
    const trustedProviders = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$context$2f$helpers$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getTrustedProviders"])(options);
    const ctx = {
        appName: options.appName || "Better Auth",
        baseURL: baseURL || "",
        version: (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$global$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getBetterAuthVersion"])(),
        socialProviders: providers,
        options,
        oauthConfig: {
            storeStateStrategy: options.account?.storeStateStrategy || (isStateful ? "database" : "cookie"),
            skipStateCookieCheck: !!options.account?.skipStateCookieCheck
        },
        tables,
        trustedOrigins,
        trustedProviders,
        isTrustedOrigin (url, settings) {
            return this.trustedOrigins.some((origin)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$auth$2f$trusted$2d$origins$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["matchesOriginPattern"])(url, origin, settings));
        },
        sessionConfig: {
            updateAge: options.session?.updateAge !== void 0 ? options.session.updateAge : 1440 * 60,
            expiresIn: options.session?.expiresIn || 3600 * 24 * 7,
            freshAge: options.session?.freshAge === void 0 ? 3600 * 24 : options.session.freshAge,
            cookieRefreshCache: (()=>{
                const refreshCache = options.session?.cookieCache?.refreshCache;
                const maxAge = options.session?.cookieCache?.maxAge || 300;
                if (isStateful && refreshCache) {
                    logger.warn("[better-auth] `session.cookieCache.refreshCache` is enabled while `database` or `secondaryStorage` is configured. `refreshCache` is meant for stateless (DB-less) setups. Disabling `refreshCache` — remove it from your config to silence this warning.");
                    return false;
                }
                if (refreshCache === false || refreshCache === void 0) return false;
                if (refreshCache === true) return {
                    enabled: true,
                    updateAge: Math.floor(maxAge * .2)
                };
                return {
                    enabled: true,
                    updateAge: refreshCache.updateAge !== void 0 ? refreshCache.updateAge : Math.floor(maxAge * .2)
                };
            })()
        },
        secret,
        secretConfig,
        rateLimit: {
            ...options.rateLimit,
            enabled: options.rateLimit?.enabled ?? __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$env$2d$impl$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isProduction"],
            window: options.rateLimit?.window || 10,
            max: options.rateLimit?.max || 100,
            storage: options.rateLimit?.storage || (options.secondaryStorage ? "secondary-storage" : "memory")
        },
        authCookies: cookies,
        logger,
        generateId: generateIdFunc,
        session: null,
        secondaryStorage: options.secondaryStorage,
        password: {
            hash: options.emailAndPassword?.password?.hash || __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$crypto$2f$password$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["hashPassword"],
            verify: options.emailAndPassword?.password?.verify || __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$crypto$2f$password$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["verifyPassword"],
            config: {
                minPasswordLength: options.emailAndPassword?.minPasswordLength || 8,
                maxPasswordLength: options.emailAndPassword?.maxPasswordLength || 128
            },
            checkPassword: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$password$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["checkPassword"]
        },
        setNewSession (session) {
            this.newSession = session;
        },
        newSession: null,
        adapter,
        internalAdapter: (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$internal$2d$adapter$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createInternalAdapter"])(adapter, {
            options,
            logger,
            hooks: options.databaseHooks ? [
                {
                    source: "user",
                    hooks: options.databaseHooks
                }
            ] : [],
            generateId: generateIdFunc
        }),
        createAuthCookie: (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createCookieGetter"])(options),
        async runMigrations () {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["BetterAuthError"]("runMigrations will be set by the specific init implementation");
        },
        publishTelemetry: publish,
        skipCSRFCheck: !!options.advanced?.disableCSRFCheck,
        skipOriginCheck: options.advanced?.disableOriginCheck !== void 0 ? options.advanced.disableOriginCheck : (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$env$2d$impl$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isTest"])() ? true : false,
        runInBackground: options.advanced?.backgroundTasks?.handler ?? ((p)=>{
            p.catch(()=>{});
        }),
        async runInBackgroundOrAwait (promise) {
            try {
                if (options.advanced?.backgroundTasks?.handler) {
                    if (promise instanceof Promise) options.advanced.backgroundTasks.handler(promise.catch((e)=>{
                        logger.error("Failed to run background task:", e);
                    }));
                } else await promise;
            } catch (e) {
                logger.error("Failed to run background task:", e);
            }
        },
        getPlugin: getPluginFn,
        hasPlugin: hasPluginFn
    };
    const initOrPromise = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$context$2f$helpers$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["runPluginInit"])(ctx);
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$is$2d$promise$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isPromise"])(initOrPromise)) await initOrPromise;
    ctx.checkSchema = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$db$2f$schema$2d$check$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["runtimeSchemaCheckFor"])(ctx.adapter);
    ctx.explicitSchemaCheck = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$db$2f$schema$2d$check$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["schemaCheckFor"])(ctx.adapter);
    return ctx;
}
;
}),
"[project]/examples/nextjs/node_modules/better-auth/dist/context/helpers.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getAwaitableValue",
    ()=>getAwaitableValue,
    "getInternalPlugins",
    ()=>getInternalPlugins,
    "getTrustedOrigins",
    ()=>getTrustedOrigins,
    "getTrustedProviders",
    ()=>getTrustedProviders,
    "pickSource",
    ()=>pickSource,
    "resolveDynamicTrustedProxyHeaders",
    ()=>resolveDynamicTrustedProxyHeaders,
    "resolveRequestContext",
    ()=>resolveRequestContext,
    "runPluginInit",
    ()=>runPluginInit
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$url$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/utils/url.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$is$2d$promise$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/utils/is-promise.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/cookies/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$internal$2d$adapter$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/db/internal-adapter.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$env$2d$impl$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/env/env-impl.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/error/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$defu$2f$dist$2f$defu$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/defu/dist/defu.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$host$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/utils/host.mjs [app-route] (ecmascript)");
;
;
;
;
;
;
;
;
//#region src/context/helpers.ts
async function runPluginInit(context) {
    let options = context.options;
    const plugins = options.plugins || [];
    const pluginTrustedOrigins = [];
    const dbHooks = [];
    for (const plugin of plugins)if (plugin.init) {
        const initPromise = plugin.init(context);
        let result;
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$is$2d$promise$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isPromise"])(initPromise)) result = await initPromise;
        else result = initPromise;
        if (typeof result === "object") {
            if (result.options) {
                const { databaseHooks, trustedOrigins, ...restOpts } = result.options;
                if (databaseHooks) dbHooks.push({
                    source: `plugin:${plugin.id}`,
                    hooks: databaseHooks
                });
                if (trustedOrigins) pluginTrustedOrigins.push(trustedOrigins);
                options = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$defu$2f$dist$2f$defu$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["defu"])(options, restOpts);
            }
            if (result.context) Object.assign(context, result.context);
        }
    }
    if (pluginTrustedOrigins.length > 0) {
        const allSources = [
            ...options.trustedOrigins ? [
                options.trustedOrigins
            ] : [],
            ...pluginTrustedOrigins
        ];
        const staticOrigins = allSources.filter(Array.isArray).flat();
        const dynamicOrigins = allSources.filter((s)=>typeof s === "function");
        if (dynamicOrigins.length > 0) options.trustedOrigins = async (request)=>{
            const resolved = await Promise.all(dynamicOrigins.map((fn)=>fn(request)));
            return [
                ...staticOrigins,
                ...resolved.flat()
            ].filter((v)=>typeof v === "string" && v !== "");
        };
        else options.trustedOrigins = staticOrigins;
    }
    if (options.databaseHooks) dbHooks.push({
        source: "user",
        hooks: options.databaseHooks
    });
    context.internalAdapter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$internal$2d$adapter$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createInternalAdapter"])(context.adapter, {
        options,
        logger: context.logger,
        hooks: dbHooks,
        generateId: context.generateId
    });
    context.options = options;
}
function getInternalPlugins(options) {
    const plugins = [];
    if (options.advanced?.crossSubDomainCookies?.enabled) {}
    return plugins;
}
async function getTrustedOrigins(options, request) {
    const trustedOrigins = [];
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$url$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isDynamicBaseURLConfig"])(options.baseURL)) {
        const allowedHosts = options.baseURL.allowedHosts;
        const proto = options.baseURL.protocol;
        for (const host of allowedHosts)if (!host.includes("://")) {
            if (!proto || proto === "https" || proto === "auto") trustedOrigins.push(`https://${host}`);
            if (proto === "http" || proto === "auto" || (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$host$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isLoopbackHost"])(host)) trustedOrigins.push(`http://${host}`);
        } else trustedOrigins.push(host);
        if (options.baseURL.fallback) try {
            trustedOrigins.push(new URL(options.baseURL.fallback).origin);
        } catch  {}
    } else {
        const baseURL = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$url$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getBaseURL"])(typeof options.baseURL === "string" ? options.baseURL : void 0, options.basePath, request);
        if (baseURL) trustedOrigins.push(new URL(baseURL).origin);
    }
    if (options.trustedOrigins) {
        if (Array.isArray(options.trustedOrigins)) trustedOrigins.push(...options.trustedOrigins);
        if (typeof options.trustedOrigins === "function") {
            const validOrigins = await options.trustedOrigins(request);
            trustedOrigins.push(...validOrigins);
        }
    }
    const envTrustedOrigins = __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$env$2d$impl$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["env"].BETTER_AUTH_TRUSTED_ORIGINS;
    if (envTrustedOrigins) trustedOrigins.push(...envTrustedOrigins.split(","));
    return trustedOrigins.filter((v)=>Boolean(v));
}
/**
* Picks a `Request`-like or `Headers` value from a direct `auth.api` call.
* Headers are only accepted when they carry a host: without one, host
* resolution would fall back to `null` and the caller should use `fallback`
* or pass a `Request` instead.
*/ function pickSource(input) {
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$url$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isRequestLike"])(input?.request)) return input.request;
    if (!input?.headers) return void 0;
    const headers = input.headers instanceof Headers ? input.headers : new Headers(input.headers);
    if (!headers.has("host") && !headers.has("x-forwarded-host")) return;
    return headers;
}
/**
* Returns the effective `trustedProxyHeaders` value for dynamic `baseURL`
* resolution. Proxy headers (`x-forwarded-host` / `x-forwarded-proto`) are
* ignored unless the user opts in with `advanced.trustedProxyHeaders: true`,
* matching the static-config path. Deployments behind a reverse proxy that
* only exposes the public host via `x-forwarded-host` must set the flag.
*/ function resolveDynamicTrustedProxyHeaders(options) {
    return options.advanced?.trustedProxyHeaders ?? false;
}
/**
* Per-request clone with `baseURL`, `trustedOrigins`, `trustedProviders`
* and cookies rehydrated for the resolved host. Throws `BetterAuthError`
* when the URL cannot be resolved; callers on the direct-API path convert
* this to `APIError`.
*/ async function resolveRequestContext(ctx, source, trustedProxyHeaders) {
    const dynamicBaseURLConfig = ctx.options.baseURL;
    const baseURL = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$url$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["resolveBaseURL"])(dynamicBaseURLConfig, ctx.options.basePath || "/api/auth", source, void 0, trustedProxyHeaders);
    if (!baseURL) throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["BetterAuthError"]("Could not resolve base URL from request. Check your allowedHosts config.");
    const resolved = Object.create(Object.getPrototypeOf(ctx), Object.getOwnPropertyDescriptors(ctx));
    resolved.baseURL = baseURL;
    resolved.options = {
        ...ctx.options,
        baseURL: (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$url$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getOrigin"])(baseURL) || void 0
    };
    const trustedOriginOptions = {
        ...resolved.options,
        baseURL: dynamicBaseURLConfig
    };
    const needsRequest = typeof ctx.options.trustedOrigins === "function" || typeof ctx.options.account?.accountLinking?.trustedProviders === "function";
    let callbackRequest;
    if (needsRequest) if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$url$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isRequestLike"])(source)) callbackRequest = source;
    else if (source) callbackRequest = new Request(baseURL, {
        headers: source
    });
    else callbackRequest = void 0;
    else callbackRequest = void 0;
    resolved.trustedOrigins = await getTrustedOrigins(trustedOriginOptions, callbackRequest);
    resolved.trustedProviders = await getTrustedProviders(resolved.options, callbackRequest);
    if (ctx.options.advanced?.crossSubDomainCookies?.enabled) {
        resolved.authCookies = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["getCookies"])(resolved.options);
        resolved.createAuthCookie = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createCookieGetter"])(resolved.options);
    }
    return resolved;
}
async function getAwaitableValue(arr, item) {
    if (!arr) return void 0;
    for (const val of arr){
        const value = typeof val === "function" ? await val() : val;
        if (value[item.field ?? "id"] === item.value) return value;
    }
}
async function getTrustedProviders(options, request) {
    const trustedProviders = options.account?.accountLinking?.trustedProviders;
    if (!trustedProviders) return [];
    if (Array.isArray(trustedProviders)) return trustedProviders.filter((v)=>Boolean(v));
    return (await trustedProviders(request) ?? []).filter((v)=>Boolean(v));
}
;
}),
"[project]/examples/nextjs/node_modules/better-auth/dist/context/init.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "init",
    ()=>init
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$adapter$2d$kysely$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/db/adapter-kysely.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$get$2d$migration$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/db/get-migration.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$context$2f$create$2d$context$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/context/create-context.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/error/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$kysely$2d$adapter$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/kysely-adapter/dist/index.mjs [app-route] (ecmascript)");
;
;
;
;
;
//#region src/context/init.ts
const init = async (options)=>{
    const adapter = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$adapter$2d$kysely$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getAdapter"])(options);
    const getDatabaseType = (database)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$kysely$2d$adapter$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getKyselyDatabaseType"])(database) || "unknown";
    const ctx = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$context$2f$create$2d$context$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAuthContext"])(adapter, options, getDatabaseType);
    ctx.runMigrations = async function() {
        if (!options.database || "updateMany" in options.database) throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["BetterAuthError"]("Database is not provided or it's an adapter. Migrations are only supported with a database instance.");
        const { runMigrations } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$get$2d$migration$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getMigrations"])(options);
        await runMigrations();
    };
    return ctx;
};
;
}),
"[project]/examples/nextjs/node_modules/better-auth/dist/context/secret-utils.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "buildSecretConfig",
    ()=>buildSecretConfig,
    "parseSecretsEnv",
    ()=>parseSecretsEnv,
    "validateSecretsArray",
    ()=>validateSecretsArray
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/error/index.mjs [app-route] (ecmascript) <locals>");
;
;
//#region src/context/secret-utils.ts
/**
* Estimates the entropy of a string in bits.
* This is a simple approximation that helps detect low-entropy secrets.
*/ function estimateEntropy(str) {
    const unique = new Set(str).size;
    if (unique === 0) return 0;
    return Math.log2(Math.pow(unique, str.length));
}
function parseSecretsEnv(envValue) {
    if (!envValue) return null;
    return envValue.split(",").map((entry)=>{
        entry = entry.trim();
        const colonIdx = entry.indexOf(":");
        if (colonIdx === -1) throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["BetterAuthError"](`Invalid BETTER_AUTH_SECRETS entry: "${entry}". Expected format: "<version>:<secret>"`);
        const version = parseInt(entry.slice(0, colonIdx), 10);
        if (!Number.isInteger(version) || version < 0) throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["BetterAuthError"](`Invalid version in BETTER_AUTH_SECRETS: "${entry.slice(0, colonIdx)}". Version must be a non-negative integer.`);
        const value = entry.slice(colonIdx + 1).trim();
        if (!value) throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["BetterAuthError"](`Empty secret value for version ${version} in BETTER_AUTH_SECRETS.`);
        return {
            version,
            value
        };
    });
}
function validateSecretsArray(secrets, logger) {
    if (secrets.length === 0) throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["BetterAuthError"]("`secrets` array must contain at least one entry.");
    const seen = /* @__PURE__ */ new Set();
    for (const s of secrets){
        const version = parseInt(String(s.version), 10);
        if (!Number.isInteger(version) || version < 0 || String(version) !== String(s.version).trim()) throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["BetterAuthError"](`Invalid version ${s.version} in \`secrets\`. Version must be a non-negative integer.`);
        if (!s.value) throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["BetterAuthError"](`Empty secret value for version ${version} in \`secrets\`.`);
        if (seen.has(version)) throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["BetterAuthError"](`Duplicate version ${version} in \`secrets\`. Each version must be unique.`);
        seen.add(version);
    }
    const current = secrets[0];
    if (current.value.length < 32) logger.warn(`[better-auth] Warning: the current secret (version ${current.version}) should be at least 32 characters long for adequate security.`);
    if (estimateEntropy(current.value) < 120) logger.warn("[better-auth] Warning: the current secret appears low-entropy. Use a randomly generated secret for production.");
}
function buildSecretConfig(secrets, legacySecret) {
    const keys = /* @__PURE__ */ new Map();
    for (const s of secrets)keys.set(parseInt(String(s.version), 10), s.value);
    return {
        keys,
        currentVersion: parseInt(String(secrets[0].version), 10),
        legacySecret: legacySecret && legacySecret !== "better-auth-secret-12345678901234567890" ? legacySecret : void 0
    };
}
;
}),
"[project]/examples/nextjs/node_modules/better-auth/dist/context/store-capabilities.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "hasServerSessionStore",
    ()=>hasServerSessionStore,
    "shouldBindAccountCookieToSessionUser",
    ()=>shouldBindAccountCookieToSessionUser
]);
//#region src/context/store-capabilities.ts
function hasServerSessionStore(options) {
    return !!options.database || !!options.secondaryStorage;
}
function hasServerAccountStore(options) {
    return !!options.database;
}
function shouldBindAccountCookieToSessionUser(options) {
    return hasServerAccountStore(options);
}
;
}),
"[project]/examples/nextjs/node_modules/better-auth/dist/cookies/cache.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "parseCompactCookieCache",
    ()=>parseCompactCookieCache,
    "parseCookieCachePayload",
    ()=>parseCookieCachePayload
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$db$2f$schema$2f$session$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/db/schema/session.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$db$2f$schema$2f$user$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/db/schema/user.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$logger$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/env/logger.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$json$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/utils/json.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/zod/v4/classic/schemas.js [app-route] (ecmascript)");
;
;
;
;
//#region src/cookies/cache.ts
const cookieCachePayloadSchema = __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["looseObject"]({
    session: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$db$2f$schema$2f$session$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sessionSchema"].loose(),
    user: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$db$2f$schema$2f$user$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["userSchema"].loose(),
    updatedAt: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["number"](),
    version: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]().optional()
});
const compactCookieCacheSchema = __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["object"]({
    session: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["record"](__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"](), __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["unknown"]()),
    expiresAt: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["number"](),
    signature: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]()
});
function parseCookieCachePayload(value) {
    const parsed = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$json$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["safeJSONParse"])(value);
    if (parsed === null) return null;
    const result = cookieCachePayloadSchema.safeParse(parsed);
    if (result.success) return result.data;
    __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$logger$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].warn("Cookie cache payload failed schema validation", {
        issues: result.error.issues.map(({ code, path })=>({
                code,
                path
            }))
    });
    return null;
}
function parseCompactCookieCache(value) {
    const result = compactCookieCacheSchema.safeParse(value);
    return result.success ? result.data : null;
}
;
}),
"[project]/examples/nextjs/node_modules/better-auth/dist/cookies/cookie-utils.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "HOST_COOKIE_PREFIX",
    ()=>HOST_COOKIE_PREFIX,
    "SECURE_COOKIE_PREFIX",
    ()=>SECURE_COOKIE_PREFIX,
    "applySetCookies",
    ()=>applySetCookies,
    "cookieNameRegex",
    ()=>cookieNameRegex,
    "parseCookies",
    ()=>parseCookies,
    "parseSetCookieHeader",
    ()=>parseSetCookieHeader,
    "setCookieToHeader",
    ()=>setCookieToHeader,
    "setRequestCookie",
    ()=>setRequestCookie,
    "splitSetCookieHeader",
    ()=>splitSetCookieHeader,
    "stripSecureCookiePrefix",
    ()=>stripSecureCookiePrefix,
    "toCookieOptions",
    ()=>toCookieOptions
]);
//#region src/cookies/cookie-utils.ts
function tryDecode(str) {
    if (str.indexOf("%") === -1) return str;
    try {
        return decodeURIComponent(str);
    } catch  {
        return str;
    }
}
const SECURE_COOKIE_PREFIX = "__Secure-";
const HOST_COOKIE_PREFIX = "__Host-";
/**
* Remove __Secure- or __Host- prefix from cookie name.
*/ function stripSecureCookiePrefix(cookieName) {
    if (cookieName.startsWith("__Secure-")) return cookieName.slice(9);
    if (cookieName.startsWith("__Host-")) return cookieName.slice(7);
    return cookieName;
}
/**
* Split a comma-joined `Set-Cookie` header string into individual cookies.
*/ function splitSetCookieHeader(setCookie) {
    if (!setCookie) return [];
    const result = [];
    let start = 0;
    let i = 0;
    while(i < setCookie.length){
        if (setCookie[i] === ",") {
            let j = i + 1;
            while(j < setCookie.length && setCookie[j] === " ")j++;
            while(j < setCookie.length && setCookie[j] !== "=" && setCookie[j] !== ";" && setCookie[j] !== ",")j++;
            if (j < setCookie.length && setCookie[j] === "=") {
                const part = setCookie.slice(start, i).trim();
                if (part) result.push(part);
                start = i + 1;
                while(start < setCookie.length && setCookie[start] === " ")start++;
                i = start;
                continue;
            }
        }
        i++;
    }
    const last = setCookie.slice(start).trim();
    if (last) result.push(last);
    return result;
}
function parseSetCookieHeader(setCookie) {
    const cookies = /* @__PURE__ */ new Map();
    splitSetCookieHeader(setCookie).forEach((cookieString)=>{
        const [nameValue, ...attributes] = cookieString.split(";").map((part)=>part.trim());
        const [name, ...valueParts] = (nameValue || "").split("=");
        const value = unquoteCookieValue(valueParts.join("="));
        if (!name) return;
        const attrObj = {
            value: tryDecode(value)
        };
        attributes.forEach((attribute)=>{
            const [attrName, ...attrValueParts] = attribute.split("=");
            const attrValue = attrValueParts.join("=");
            const normalizedAttrName = attrName.trim().toLowerCase();
            switch(normalizedAttrName){
                case "max-age":
                    attrObj["max-age"] = attrValue ? parseInt(attrValue.trim(), 10) : void 0;
                    break;
                case "expires":
                    attrObj.expires = attrValue ? new Date(attrValue.trim()) : void 0;
                    break;
                case "domain":
                    attrObj.domain = attrValue ? attrValue.trim() : void 0;
                    break;
                case "path":
                    attrObj.path = attrValue ? attrValue.trim() : void 0;
                    break;
                case "secure":
                    attrObj.secure = true;
                    break;
                case "httponly":
                    attrObj.httponly = true;
                    break;
                case "samesite":
                    attrObj.samesite = attrValue ? attrValue.trim().toLowerCase() : void 0;
                    break;
                case "partitioned":
                    attrObj.partitioned = true;
                    break;
                default:
                    attrObj[normalizedAttrName] = attrValue ? attrValue.trim() : true;
                    break;
            }
        });
        cookies.set(name, attrObj);
    });
    return cookies;
}
function toCookieOptions(attributes) {
    return {
        maxAge: attributes["max-age"],
        expires: attributes.expires,
        domain: attributes.domain,
        path: attributes.path,
        secure: attributes.secure,
        httpOnly: attributes.httponly,
        sameSite: attributes.samesite,
        partitioned: attributes.partitioned
    };
}
/**
* Cookie-name token char set per RFC 7230 §3.2.6.
*
* @see https://datatracker.ietf.org/doc/html/rfc7230#section-3.2.6
*/ const cookieNameRegex = /^[\x21\x23-\x27\x2A\x2B\x2D\x2E\x30-\x39\x41-\x5A\x5E\x5F\x60\x61-\x7A\x7C\x7E]+$/;
/**
* Cookie-value char set per RFC 6265 §4.1.1, plus space and comma.
*
* @see https://datatracker.ietf.org/doc/html/rfc6265#section-4.1.1
* @see https://github.com/golang/go/issues/7243
*/ const cookieValueRegex = /^[\x20\x21\x23-\x3A\x3C-\x5B\x5D-\x7E]*$/;
/**
* Strip surrounding double-quotes per RFC 6265 §4.1.1 quoted-string form.
*
* @see https://datatracker.ietf.org/doc/html/rfc6265#section-4.1.1
*/ function unquoteCookieValue(value) {
    if (value.length < 2 || !value.startsWith("\"") || !value.endsWith("\"")) return value;
    return value.slice(1, -1);
}
/**
* Trim leading/trailing OWS (space / horizontal tab) per RFC 7230 §3.2.3.
* Narrower than `String.prototype.trim()`, which strips CR/LF and other
* whitespace and would let CTLs escape `cookieValueRegex`.
*
* @see https://datatracker.ietf.org/doc/html/rfc7230#section-3.2.3
*/ function trimOWS(s) {
    let start = 0;
    let end = s.length;
    while(start < end){
        const c = s.charCodeAt(start);
        if (c !== 32 && c !== 9) break;
        start++;
    }
    while(end > start){
        const c = s.charCodeAt(end - 1);
        if (c !== 32 && c !== 9) break;
        end--;
    }
    return start === 0 && end === s.length ? s : s.slice(start, end);
}
/**
* Tolerates `;` separators without the SP that RFC 6265 §4.2.1 mandates,
* since proxies and runtimes commonly strip it. Silently drops entries
* whose name violates RFC 7230 token or whose value violates RFC 6265
* cookie-octet (plus space and comma). Strips optional surrounding
* double-quotes per RFC 6265 §4.1.1.
*/ function parseCookies(cookie) {
    const cookieMap = /* @__PURE__ */ new Map();
    if (cookie.length < 2) return cookieMap;
    for (const chunk of cookie.split(";")){
        const eq = chunk.indexOf("=");
        if (eq === -1) continue;
        const key = trimOWS(chunk.slice(0, eq));
        const val = unquoteCookieValue(trimOWS(chunk.slice(eq + 1)));
        if (cookieNameRegex.test(key) && cookieValueRegex.test(val)) cookieMap.set(key, tryDecode(val));
    }
    return cookieMap;
}
/**
* Add or replace a cookie in the request `Cookie` header.
*
* Cookie pairs are joined with `; `, but `headers.append("cookie", ...)`
* joins with `, ` in some runtimes (e.g. Deno, Cloudflare Workers) and
* breaks downstream cookie parsing. This builds the header value via
* parse-mutate-serialize.
*/ function setRequestCookie(headers, name, value) {
    const cookieMap = parseCookies(headers.get("cookie") || "");
    if (cookieNameRegex.test(name)) cookieMap.set(name, value);
    headers.set("cookie", Array.from(cookieMap, ([k, v])=>`${k}=${encodeURIComponent(v)}`).join("; "));
}
/**
* Merge `Set-Cookie` header values into the target's `Cookie` header.
* Mutates `target`.
*
* Name/value-level merge only. RFC 6265 §5 user-agent semantics
* (expiration, domain/path scoping, ordering) are out of scope. Suitable
* for single-request proxy, middleware, and test contexts.
*/ function applySetCookies(target, setCookieValues) {
    const cookieMap = parseCookies(target.get("cookie") || "");
    for (const setCookie of setCookieValues)for (const [name, attr] of parseSetCookieHeader(setCookie))if (cookieNameRegex.test(name)) cookieMap.set(name, attr.value);
    target.set("cookie", Array.from(cookieMap, ([k, v])=>`${k}=${encodeURIComponent(v)}`).join("; "));
}
function setCookieToHeader(headers) {
    return (context)=>{
        const setCookieHeader = context.response.headers.get("set-cookie");
        if (!setCookieHeader) return;
        applySetCookies(headers, [
            setCookieHeader
        ]);
    };
}
;
}),
"[project]/examples/nextjs/node_modules/better-auth/dist/cookies/index.mjs [app-route] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createCookieGetter",
    ()=>createCookieGetter,
    "decodeCookieCache",
    ()=>decodeCookieCache,
    "deleteSessionCookie",
    ()=>deleteSessionCookie,
    "expireCookie",
    ()=>expireCookie,
    "getCookieCache",
    ()=>getCookieCache,
    "getCookies",
    ()=>getCookies,
    "getSessionCookie",
    ()=>getSessionCookie,
    "setCookieCache",
    ()=>setCookieCache,
    "setSessionCookie",
    ()=>setSessionCookie
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$url$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/utils/url.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$context$2f$store$2d$capabilities$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/context/store-capabilities.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$crypto$2f$jwt$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/crypto/jwt.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$schema$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/db/schema.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$date$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/utils/date.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$is$2d$promise$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/utils/is-promise.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$time$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/utils/time.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$cache$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/cookies/cache.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$cookie$2d$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/cookies/cookie-utils.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$jwt$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/cookies/jwt.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$session$2d$store$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/cookies/session-store.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$env$2d$impl$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/env/env-impl.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/error/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$json$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/utils/json.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$db$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/utils/db.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$base64$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/utils/dist/base64.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$binary$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/utils/dist/binary.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$hmac$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/utils/dist/hmac.mjs [app-route] (ecmascript)");
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
//#region src/cookies/index.ts
function createCookieGetter(options) {
    const baseURLString = typeof options.baseURL === "string" ? options.baseURL : void 0;
    const dynamicProtocol = typeof options.baseURL === "object" && options.baseURL !== null ? options.baseURL.protocol : void 0;
    const secureCookiePrefix = (options.advanced?.useSecureCookies !== void 0 ? options.advanced?.useSecureCookies : dynamicProtocol === "https" ? true : dynamicProtocol === "http" ? false : baseURLString ? baseURLString.startsWith("https://") : __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$env$2d$impl$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isProduction"]) ? __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$cookie$2d$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SECURE_COOKIE_PREFIX"] : "";
    const crossSubdomainEnabled = !!options.advanced?.crossSubDomainCookies?.enabled;
    const domain = crossSubdomainEnabled ? options.advanced?.crossSubDomainCookies?.domain || (baseURLString ? new URL(baseURLString).hostname : void 0) : void 0;
    if (crossSubdomainEnabled && !domain && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$url$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isDynamicBaseURLConfig"])(options.baseURL)) throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["BetterAuthError"]("baseURL is required when crossSubdomainCookies are enabled.");
    function createCookie(cookieName, overrideAttributes = {}) {
        const prefix = options.advanced?.cookiePrefix || "better-auth";
        const name = options.advanced?.cookies?.[cookieName]?.name || `${prefix}.${cookieName}`;
        const attributes = options.advanced?.cookies?.[cookieName]?.attributes ?? {};
        return {
            name: `${secureCookiePrefix}${name}`,
            attributes: {
                secure: !!secureCookiePrefix,
                sameSite: "lax",
                path: "/",
                httpOnly: true,
                ...crossSubdomainEnabled ? {
                    domain
                } : {},
                ...options.advanced?.defaultCookieAttributes,
                ...overrideAttributes,
                ...attributes
            }
        };
    }
    return createCookie;
}
function getCookies(options) {
    const createCookie = createCookieGetter(options);
    const sessionToken = createCookie("session_token", {
        maxAge: options.session?.expiresIn || (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$time$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sec"])("7d")
    });
    const sessionData = createCookie("session_data", {
        maxAge: options.session?.cookieCache?.maxAge || 300
    });
    const accountData = createCookie("account_data", {
        maxAge: options.session?.cookieCache?.maxAge || 300
    });
    const dontRememberToken = createCookie("dont_remember");
    return {
        sessionToken: {
            name: sessionToken.name,
            attributes: sessionToken.attributes
        },
        /**
		* This cookie is used to store the session data in the cookie
		* This is useful for when you want to cache the session in the cookie
		*/ sessionData: {
            name: sessionData.name,
            attributes: sessionData.attributes
        },
        dontRememberToken: {
            name: dontRememberToken.name,
            attributes: dontRememberToken.attributes
        },
        accountData: {
            name: accountData.name,
            attributes: accountData.attributes
        }
    };
}
async function setCookieCache(ctx, session, dontRememberMe) {
    if (!ctx.context.options.session?.cookieCache?.enabled) return;
    const filteredSession = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$db$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["filterOutputFields"])(session.session, ctx.context.options.session?.additionalFields);
    const filteredUser = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$schema$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseUserOutput"])(ctx.context.options, session.user);
    const versionConfig = ctx.context.options.session?.cookieCache?.version;
    let version = "1";
    if (versionConfig) {
        if (typeof versionConfig === "string") version = versionConfig;
        else if (typeof versionConfig === "function") {
            const result = versionConfig(session.session, session.user);
            version = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$is$2d$promise$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isPromise"])(result) ? await result : result;
        }
    }
    const sessionData = {
        session: filteredSession,
        user: filteredUser,
        updatedAt: Date.now(),
        version
    };
    const options = {
        ...ctx.context.authCookies.sessionData.attributes,
        maxAge: dontRememberMe ? void 0 : ctx.context.authCookies.sessionData.attributes.maxAge
    };
    const expiresAtDate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$date$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getDate"])(options.maxAge || 60, "sec").getTime();
    const strategy = ctx.context.options.session?.cookieCache?.strategy || "compact";
    let data;
    if (strategy === "jwe") data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$crypto$2f$jwt$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["symmetricEncodeJWT"])(sessionData, ctx.context.secretConfig, "better-auth-session", options.maxAge || 300);
    else if (strategy === "jwt") {
        const cookieCacheSigner = ctx.context.sessionConfig.cookieCacheSigner;
        data = cookieCacheSigner ? await cookieCacheSigner.sign(ctx, sessionData, options.maxAge || 300) : await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$crypto$2f$jwt$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["signJWT"])(sessionData, ctx.context.secret, options.maxAge || 300);
    } else data = __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$base64$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["base64Url"].encode(JSON.stringify({
        session: sessionData,
        expiresAt: expiresAtDate,
        signature: await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$hmac$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createHMAC"])("SHA-256", "base64urlnopad").sign(ctx.context.secret, JSON.stringify({
            ...sessionData,
            expiresAt: expiresAtDate
        }))
    }), {
        padding: false
    });
    const sessionStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$session$2d$store$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createSessionStore"])(ctx.context.authCookies.sessionData.name, options, ctx);
    sessionStore.setCookies(sessionStore.chunk(data, options));
    if (ctx.context.options.account?.storeAccountCookie && !hasPendingSetCookie(ctx, ctx.context.authCookies.accountData.name)) {
        const accountData = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$session$2d$store$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getAccountCookie"])(ctx);
        if (accountData) if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$context$2f$store$2d$capabilities$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["shouldBindAccountCookieToSessionUser"])(ctx.context.options) || accountData.userId === session.user.id) await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$session$2d$store$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["setAccountCookie"])(ctx, accountData);
        else {
            expireCookie(ctx, ctx.context.authCookies.accountData);
            const accountStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$session$2d$store$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAccountStore"])(ctx.context.authCookies.accountData.name, ctx.context.authCookies.accountData.attributes, ctx);
            accountStore.setCookies(accountStore.clean());
        }
    }
}
async function decodeCookieCache(ctx, value) {
    const strategy = ctx.context.options.session?.cookieCache?.strategy || "compact";
    if (strategy === "jwe") {
        const decoded = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$crypto$2f$jwt$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["symmetricDecodeJWT"])(value, ctx.context.secretConfig, "better-auth-session");
        const payload = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$cache$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseCookieCachePayload"])(decoded);
        if (!payload) return null;
        return {
            session: payload,
            expiresAt: decoded?.exp ? decoded.exp * 1e3 : Date.now()
        };
    }
    if (strategy === "jwt") {
        const cookieCacheSigner = ctx.context.sessionConfig.cookieCacheSigner;
        if (cookieCacheSigner) {
            const verified = await cookieCacheSigner.verify(ctx, value);
            if (!verified) return null;
            return {
                session: verified.payload,
                expiresAt: verified.expiresAt
            };
        }
        const decoded = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$crypto$2f$jwt$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["verifyJWT"])(value, ctx.context.secret);
        const payload = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$cache$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseCookieCachePayload"])(decoded);
        if (!payload) return null;
        return {
            session: payload,
            expiresAt: decoded?.exp ? decoded.exp * 1e3 : Date.now()
        };
    }
    const parsed = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$cache$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseCompactCookieCache"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$json$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["safeJSONParse"])(__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$binary$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["binary"].decode(__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$base64$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["base64Url"].decode(value))));
    if (!parsed) return null;
    if (!await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$hmac$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createHMAC"])("SHA-256", "base64urlnopad").verify(ctx.context.secret, JSON.stringify({
        ...parsed.session,
        expiresAt: parsed.expiresAt
    }), parsed.signature)) return null;
    const payload = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$cache$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseCookieCachePayload"])(parsed.session);
    return payload ? {
        session: payload,
        expiresAt: parsed.expiresAt
    } : null;
}
async function setSessionCookie(ctx, session, dontRememberMe, overrides) {
    const dontRememberMeCookie = await ctx.getSignedCookie(ctx.context.authCookies.dontRememberToken.name, ctx.context.secret);
    dontRememberMe = dontRememberMe !== void 0 ? dontRememberMe : !!dontRememberMeCookie;
    const options = ctx.context.authCookies.sessionToken.attributes;
    const maxAge = dontRememberMe ? void 0 : ctx.context.sessionConfig.expiresIn;
    await ctx.setSignedCookie(ctx.context.authCookies.sessionToken.name, session.session.token, ctx.context.secret, {
        ...options,
        maxAge,
        ...overrides
    });
    if (dontRememberMe) await ctx.setSignedCookie(ctx.context.authCookies.dontRememberToken.name, "true", ctx.context.secret, ctx.context.authCookies.dontRememberToken.attributes);
    await setCookieCache(ctx, session, dontRememberMe);
    ctx.context.setNewSession(session);
}
/**
* Remove any prior `Set-Cookie` entries on the current response whose cookie
* name matches `cookieName` or any chunked variant (`${cookieName}.0`, etc.).
*
* Prevents a valid cookie value from leaking on the wire when the same cookie
* is set and then expired within a single request (e.g. `/sign-in/email`
* writes credential session cookies and the 2FA after-hook expires them).
* Browsers honor the expiring entry, but anything reading the raw response
* headers — proxy/LB logs, server-side SDK consumers, observability tools —
* sees the earlier valid value and could replay it (bypassing the 2FA gate
* when the cookie cache is enabled).
*
* Scrubs both the local middleware scope's `responseHeaders` and the outer
* endpoint scope's `ctx.context.responseHeaders`, because plugin after-hooks
* run in a fresh local scope while accumulated response headers live on the
* outer one. `scoped.context` is required by {@link GenericEndpointContext}
* but unit-test mocks pass a minimal object via `as any`, so we use optional
* chaining defensively. The `Set` collapses the case where both scopes
* reference the same `Headers`.
*/ function removeSetCookieEntries(ctx, cookieName) {
    const scoped = ctx;
    const targets = /* @__PURE__ */ new Set();
    if (scoped.responseHeaders) targets.add(scoped.responseHeaders);
    if (scoped.context?.responseHeaders) targets.add(scoped.context.responseHeaders);
    const exact = `${cookieName}=`;
    const chunk = `${cookieName}.`;
    for (const headers of targets){
        const existing = typeof headers.getSetCookie === "function" ? headers.getSetCookie() : (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$cookie$2d$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["splitSetCookieHeader"])(headers.get("set-cookie") || "");
        if (!existing.length) continue;
        const survivors = existing.filter((entry)=>!entry.startsWith(exact) && !entry.startsWith(chunk));
        if (survivors.length === existing.length) continue;
        headers.delete("set-cookie");
        for (const entry of survivors)headers.append("set-cookie", entry);
    }
}
/**
* Whether the response already has a pending `Set-Cookie` for `cookieName`
* or a chunked variant.
*/ function hasPendingSetCookie(ctx, cookieName) {
    const scoped = ctx;
    const targets = /* @__PURE__ */ new Set();
    if (scoped.responseHeaders) targets.add(scoped.responseHeaders);
    if (scoped.context?.responseHeaders) targets.add(scoped.context.responseHeaders);
    const exact = `${cookieName}=`;
    const chunk = `${cookieName}.`;
    for (const headers of targets)if ((typeof headers.getSetCookie === "function" ? headers.getSetCookie() : (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$cookie$2d$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["splitSetCookieHeader"])(headers.get("set-cookie") || "")).some((entry)=>entry.startsWith(exact) || entry.startsWith(chunk))) return true;
    return false;
}
/**
* Expires a cookie by setting `maxAge: 0` while preserving its attributes
*/ function expireCookie(ctx, cookie) {
    removeSetCookieEntries(ctx, cookie.name);
    ctx.setCookie(cookie.name, "", {
        ...cookie.attributes,
        maxAge: 0
    });
}
function deleteSessionCookie(ctx, skipDontRememberMe) {
    expireCookie(ctx, ctx.context.authCookies.sessionToken);
    expireCookie(ctx, ctx.context.authCookies.sessionData);
    if (ctx.context.options.account?.storeAccountCookie) {
        expireCookie(ctx, ctx.context.authCookies.accountData);
        const accountStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$session$2d$store$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAccountStore"])(ctx.context.authCookies.accountData.name, ctx.context.authCookies.accountData.attributes, ctx);
        const cleanCookies = accountStore.clean();
        accountStore.setCookies(cleanCookies);
    }
    if (ctx.context.oauthConfig.storeStateStrategy === "cookie") expireCookie(ctx, ctx.context.createAuthCookie("oauth_state"));
    const sessionStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$session$2d$store$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createSessionStore"])(ctx.context.authCookies.sessionData.name, ctx.context.authCookies.sessionData.attributes, ctx);
    const cleanCookies = sessionStore.clean();
    sessionStore.setCookies(cleanCookies);
    if (!skipDontRememberMe) expireCookie(ctx, ctx.context.authCookies.dontRememberToken);
}
function isEmbeddedSessionExpired(session) {
    if (!session?.expiresAt) return false;
    const expiresAt = new Date(session.expiresAt).getTime();
    return Number.isFinite(expiresAt) && expiresAt < Date.now();
}
const getSessionCookie = (request, config)=>{
    const cookies = (request instanceof Headers || !("headers" in request) ? request : request.headers).get("cookie");
    if (!cookies) return null;
    const { cookieName = "session_token", cookiePrefix = "better-auth" } = config || {};
    const parsedCookie = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$cookie$2d$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseCookies"])(cookies);
    const getCookie = (name)=>parsedCookie.get(`__Secure-${name}`) ?? parsedCookie.get(name);
    const sessionToken = getCookie(`${cookiePrefix}.${cookieName}`) || getCookie(`${cookiePrefix}-${cookieName}`);
    if (sessionToken) return sessionToken;
    return null;
};
async function matchesVersion(payload, version) {
    const expectedVersion = typeof version === "string" ? version : await version(payload.session, payload.user);
    return (payload.version || "1") === expectedVersion;
}
const getCookieCache = async (request, config)=>{
    const cookies = (request instanceof Headers || !("headers" in request) ? request : request.headers).get("cookie");
    if (!cookies) return null;
    const { cookieName = "session_data", cookiePrefix = "better-auth" } = config || {};
    const name = config?.isSecure !== void 0 ? config.isSecure ? `${__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$cookie$2d$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SECURE_COOKIE_PREFIX"]}${cookiePrefix}.${cookieName}` : `${cookiePrefix}.${cookieName}` : __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$env$2d$impl$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isProduction"] ? `${__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$cookie$2d$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SECURE_COOKIE_PREFIX"]}${cookiePrefix}.${cookieName}` : `${cookiePrefix}.${cookieName}`;
    const parsedCookie = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$cookie$2d$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseCookies"])(cookies);
    let sessionData = parsedCookie.get(name);
    if (!sessionData) {
        const chunks = [];
        for (const [cookieName, value] of parsedCookie.entries())if (cookieName.startsWith(name + ".")) {
            const parts = cookieName.split(".");
            const indexStr = parts[parts.length - 1];
            const index = parseInt(indexStr || "0", 10);
            if (!isNaN(index)) chunks.push({
                index,
                value
            });
        }
        if (chunks.length > 0) {
            chunks.sort((a, b)=>a.index - b.index);
            sessionData = chunks.map((c)=>c.value).join("");
        }
    }
    if (sessionData) {
        const strategy = config?.strategy || "compact";
        if (strategy === "jwe") {
            const secret = config?.secret || __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$env$2d$impl$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["env"].BETTER_AUTH_SECRET;
            if (!secret) throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["BetterAuthError"]("getCookieCache requires a secret to be provided. Either pass it as an option or set the BETTER_AUTH_SECRET environment variable");
            const payload = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$cache$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseCookieCachePayload"])(await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$crypto$2f$jwt$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["symmetricDecodeJWT"])(sessionData, secret, "better-auth-session"));
            if (!payload) return null;
            if (config?.version) {
                if (!await matchesVersion(payload, config.version)) return null;
            }
            if (isEmbeddedSessionExpired(payload.session)) return null;
            return payload;
        } else if (strategy === "jwt") {
            const jwks = config?.jwt?.jwks;
            let payload;
            if (jwks) payload = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$jwt$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["verifySessionCookieJwtWithJwks"])(sessionData, jwks, {
                issuer: config?.jwt?.issuer,
                audience: config?.jwt?.audience
            });
            else {
                const secret = config?.secret || __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$env$2d$impl$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["env"].BETTER_AUTH_SECRET;
                if (!secret) throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["BetterAuthError"]("getCookieCache requires a secret to be provided. Either pass it as an option or set the BETTER_AUTH_SECRET environment variable");
                payload = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$cache$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseCookieCachePayload"])(await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$crypto$2f$jwt$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["verifyJWT"])(sessionData, secret));
            }
            if (!payload) return null;
            if (config?.version) {
                if (!await matchesVersion(payload, config.version)) return null;
            }
            if (isEmbeddedSessionExpired(payload.session)) return null;
            return payload;
        } else {
            const secret = config?.secret || __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$env$2d$impl$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["env"].BETTER_AUTH_SECRET;
            if (!secret) throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["BetterAuthError"]("getCookieCache requires a secret to be provided. Either pass it as an option or set the BETTER_AUTH_SECRET environment variable");
            const sessionDataPayload = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$cache$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseCompactCookieCache"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$json$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["safeJSONParse"])(__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$binary$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["binary"].decode(__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$base64$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["base64Url"].decode(sessionData))));
            if (!sessionDataPayload) return null;
            if (!await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$hmac$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createHMAC"])("SHA-256", "base64urlnopad").verify(secret, JSON.stringify({
                ...sessionDataPayload.session,
                expiresAt: sessionDataPayload.expiresAt
            }), sessionDataPayload.signature)) return null;
            const payload = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$cache$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseCookieCachePayload"])(sessionDataPayload.session);
            if (!payload) return null;
            if (config?.version) {
                if (!await matchesVersion(payload, config.version)) return null;
            }
            if (typeof sessionDataPayload.expiresAt === "number" && sessionDataPayload.expiresAt < Date.now()) return null;
            if (isEmbeddedSessionExpired(payload.session)) return null;
            return payload;
        }
    }
    return null;
};
;
}),
"[project]/examples/nextjs/node_modules/better-auth/dist/cookies/jwt.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SESSION_COOKIE_JWT_AUDIENCE",
    ()=>SESSION_COOKIE_JWT_AUDIENCE,
    "SESSION_COOKIE_JWT_ISSUER",
    ()=>SESSION_COOKIE_JWT_ISSUER,
    "SESSION_COOKIE_JWT_TYPE",
    ()=>SESSION_COOKIE_JWT_TYPE,
    "getSessionCookieJwtVerifyOptions",
    ()=>getSessionCookieJwtVerifyOptions,
    "parseSessionCookieJwtPayload",
    ()=>parseSessionCookieJwtPayload,
    "verifySessionCookieJwtWithJwks",
    ()=>verifySessionCookieJwtWithJwks
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$cache$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/cookies/cache.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$decode_protected_header$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/jose/dist/webapi/util/decode_protected_header.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$key$2f$import$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/jose/dist/webapi/key/import.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$verify$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/jose/dist/webapi/jwt/verify.js [app-route] (ecmascript)");
;
;
//#region src/cookies/jwt.ts
const SESSION_COOKIE_JWT_TYPE = "better-auth.session-cache+jwt";
const SESSION_COOKIE_JWT_AUDIENCE = "better-auth:session-cache";
const SESSION_COOKIE_JWT_ISSUER = "better-auth:session-cache";
function getSessionCookieJwtVerifyOptions(options) {
    const verifyOptions = {
        clockTolerance: 15,
        audience: options?.audience ?? "better-auth:session-cache"
    };
    if (options?.issuer) verifyOptions.issuer = options.issuer;
    return verifyOptions;
}
function parseSessionCookieJwtPayload(payload) {
    const data = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$cache$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseCookieCachePayload"])(payload);
    if (!data || typeof payload.iss !== "string" || !payload.iss) return null;
    if (payload.sub !== data.user.id || payload.sid !== data.session.token) return null;
    return {
        ...payload,
        ...data
    };
}
async function verifySessionCookieJwtWithJwks(token, jwks, options) {
    try {
        const header = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$decode_protected_header$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["decodeProtectedHeader"])(token);
        if (header.typ !== "better-auth.session-cache+jwt") return null;
        const kid = header.kid;
        if (!kid) return null;
        const key = jwks.keys.find((entry)=>entry.kid === kid);
        if (!key) return null;
        const alg = key.alg ?? header.alg;
        if (!alg) return null;
        const { payload } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$verify$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jwtVerify"])(token, await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$key$2f$import$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["importJWK"])(key, alg), {
            ...getSessionCookieJwtVerifyOptions(options),
            algorithms: [
                alg
            ]
        });
        return parseSessionCookieJwtPayload(payload);
    } catch  {
        return null;
    }
}
;
}),
"[project]/examples/nextjs/node_modules/better-auth/dist/cookies/session-store.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createAccountStore",
    ()=>createAccountStore,
    "createSessionStore",
    ()=>createSessionStore,
    "getAccountCookie",
    ()=>getAccountCookie,
    "getChunkedCookie",
    ()=>getChunkedCookie,
    "getSessionQuerySchema",
    ()=>getSessionQuerySchema,
    "setAccountCookie",
    ()=>setAccountCookie
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$crypto$2f$jwt$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/crypto/jwt.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$cookie$2d$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/cookies/cookie-utils.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$json$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/utils/json.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$call$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-call/dist/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$call$2f$dist$2f$cookies$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-call/dist/cookies.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/zod/v4/classic/schemas.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$coerce$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__coerce$3e$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/zod/v4/classic/coerce.js [app-route] (ecmascript) <export * as coerce>");
;
;
;
;
;
//#region src/cookies/session-store.ts
/**
* Per-cookie byte ceiling.
* Safari's ~4093 floor is the lowest among browsers.
* Kept a little under it for attributes added after sizing.
*
* @see https://datatracker.ietf.org/doc/html/rfc6265#section-6.1
* @see https://github.com/dotnet/aspnetcore/blob/aa5493528640932601bb82ef3295e4d8ca7e11c5/src/Shared/ChunkingCookieManager/ChunkingCookieManager.cs#L40
*/ const MAX_COOKIE_SIZE = 4050;
/**
* Max chunks per cookie.
* A larger value does not belong in a cookie.
*/ const MAX_COOKIE_CHUNKS = 100;
/**
* Largest value that keeps the serialized cookie within {@link MAX_COOKIE_SIZE},
* measured with the real `serializeCookie` writer so it stays in sync with the
* wire. Non-positive when the name and attributes alone overflow.
*/ function getMaxCookieValueSize(name, options) {
    return MAX_COOKIE_SIZE - (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$call$2f$dist$2f$cookies$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["serializeCookie"])(name, "", {
        ...options
    }).length;
}
function parseCookieChunkIndex(cookieName, name) {
    const prefix = `${cookieName}.`;
    if (!name.startsWith(prefix)) return null;
    const suffix = name.slice(prefix.length);
    const index = Number(suffix);
    if (!Number.isSafeInteger(index) || index < 0 || String(index) !== suffix) return null;
    return index;
}
/**
* Read all existing chunks from cookies
*/ function readExistingChunks(cookieName, ctx) {
    const chunks = {};
    const cookies = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$cookie$2d$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseCookies"])(ctx.headers?.get("cookie") || "");
    for (const [name, value] of cookies){
        if (name !== cookieName && parseCookieChunkIndex(cookieName, name) === null) continue;
        chunks[name] = value;
    }
    return chunks;
}
/**
* Split a cookie value into chunks if needed
*/ function chunkCookie(storeName, cookie, chunks, logger) {
    const chunkSize = getMaxCookieValueSize(`${cookie.name}.${MAX_COOKIE_CHUNKS - 1}`, cookie.attributes);
    const chunkCount = chunkSize > 0 ? Math.ceil(cookie.value.length / chunkSize) : Infinity;
    if (chunkCount <= 1) {
        chunks[cookie.name] = cookie.value;
        return [
            cookie
        ];
    }
    if (chunkCount > MAX_COOKIE_CHUNKS) {
        logger.warn(`${storeName} cookie is too large to store even after chunking, so the cookie cache was skipped. Reduce the cached data size or avoid storing this data in cookies.`);
        return [];
    }
    const cookies = [];
    for(let i = 0; i < chunkCount; i++){
        const name = `${cookie.name}.${i}`;
        const start = i * chunkSize;
        const value = cookie.value.substring(start, start + chunkSize);
        cookies.push({
            ...cookie,
            name,
            value
        });
        chunks[name] = value;
    }
    logger.debug(`CHUNKING_${storeName.toUpperCase()}_COOKIE`, {
        message: `${storeName} cookie exceeds the ${MAX_COOKIE_SIZE} byte limit and was split into ${chunkCount} chunks.`,
        valueSize: cookie.value.length,
        chunkCount,
        chunkSizes: cookies.map((c)=>c.value.length)
    });
    return cookies;
}
/**
* Get all cookies that should be cleaned (removed)
*/ function getCleanCookies(chunks, cookieOptions) {
    const cleanedChunks = {};
    for(const name in chunks)cleanedChunks[name] = {
        name,
        value: "",
        attributes: {
            ...cookieOptions,
            maxAge: 0
        }
    };
    return cleanedChunks;
}
/**
* Store that splits a cookie into numbered chunks when its serialized form
* would exceed the per-cookie byte limit, expiring stale chunks as needed.
*
* @see https://github.com/nextauthjs/next-auth/blob/27b2519b84b8eb9cf053775dea29d577d2aa0098/packages/next-auth/src/core/lib/cookie.ts
*/ const storeFactory = (storeName)=>(cookieName, cookieOptions, ctx)=>{
        const chunks = readExistingChunks(cookieName, ctx);
        const logger = ctx.context.logger;
        const expireExistingChunks = ()=>{
            const expired = getCleanCookies(chunks, cookieOptions);
            for(const name in chunks)delete chunks[name];
            return expired;
        };
        return {
            chunk (value, options) {
                const cookies = expireExistingChunks();
                const chunked = chunkCookie(storeName, {
                    name: cookieName,
                    value,
                    attributes: {
                        ...cookieOptions,
                        ...options
                    }
                }, chunks, logger);
                for (const chunk of chunked)cookies[chunk.name] = chunk;
                return Object.values(cookies);
            },
            clean () {
                return Object.values(expireExistingChunks());
            },
            setCookies (cookies) {
                for (const cookie of cookies)ctx.setCookie(cookie.name, cookie.value, cookie.attributes);
            }
        };
    };
const createSessionStore = storeFactory("Session");
const createAccountStore = storeFactory("Account");
function getChunkedCookie(ctx, cookieName) {
    const value = ctx.getCookie(cookieName);
    if (value) return value;
    const chunks = [];
    const cookieHeader = ctx.headers?.get("cookie");
    if (!cookieHeader) return null;
    for (const [name, val] of (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$cookie$2d$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseCookies"])(cookieHeader)){
        const index = parseCookieChunkIndex(cookieName, name);
        if (index === null) continue;
        chunks.push({
            index,
            value: val
        });
    }
    if (chunks.length > 0) {
        chunks.sort((a, b)=>a.index - b.index);
        return chunks.map((c)=>c.value).join("");
    }
    return null;
}
async function setAccountCookie(c, accountData) {
    const accountDataCookie = c.context.authCookies.accountData;
    const options = {
        maxAge: 300,
        ...accountDataCookie.attributes
    };
    const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$crypto$2f$jwt$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["symmetricEncodeJWT"])(accountData, c.context.secretConfig, "better-auth-account", options.maxAge);
    const accountStore = createAccountStore(accountDataCookie.name, options, c);
    accountStore.setCookies(accountStore.chunk(data, options));
}
async function getAccountCookie(c) {
    const accountCookie = getChunkedCookie(c, c.context.authCookies.accountData.name);
    if (accountCookie) {
        const accountData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$json$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["safeJSONParse"])(await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$crypto$2f$jwt$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["symmetricDecodeJWT"])(accountCookie, c.context.secretConfig, "better-auth-account"));
        if (accountData) return accountData;
    }
    return null;
}
const getSessionQuerySchema = __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["optional"](__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["object"]({
    /**
	* If cookie cache is enabled, it will disable the cache
	* and fetch the session from the database
	*/ disableCookieCache: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$coerce$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__coerce$3e$__["coerce"].boolean().meta({
        description: "Disable cookie cache and fetch session from database"
    }).optional(),
    disableRefresh: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$coerce$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__coerce$3e$__["coerce"].boolean().meta({
        description: "Disable session refresh. Useful for checking session status, without updating the session"
    }).optional()
}));
;
}),
"[project]/examples/nextjs/node_modules/better-auth/dist/crypto/buffer.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "constantTimeEqual",
    ()=>constantTimeEqual
]);
//#region src/crypto/buffer.ts
/**
* Compare two buffers in constant time.
*/ function constantTimeEqual(a, b) {
    if (typeof a === "string") a = new TextEncoder().encode(a);
    if (typeof b === "string") b = new TextEncoder().encode(b);
    const aBuffer = new Uint8Array(a);
    const bBuffer = new Uint8Array(b);
    let c = aBuffer.length ^ bBuffer.length;
    const length = Math.max(aBuffer.length, bBuffer.length);
    for(let i = 0; i < length; i++)c |= (i < aBuffer.length ? aBuffer[i] : 0) ^ (i < bBuffer.length ? bBuffer[i] : 0);
    return c === 0;
}
;
}),
"[project]/examples/nextjs/node_modules/better-auth/dist/crypto/index.mjs [app-route] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "formatEnvelope",
    ()=>formatEnvelope,
    "getCryptoKey",
    ()=>getCryptoKey,
    "makeSignature",
    ()=>makeSignature,
    "parseEnvelope",
    ()=>parseEnvelope,
    "symmetricDecrypt",
    ()=>symmetricDecrypt,
    "symmetricEncrypt",
    ()=>symmetricEncrypt
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$crypto$2f$jwt$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/crypto/jwt.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$crypto$2f$buffer$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/crypto/buffer.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$crypto$2f$password$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/crypto/password.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$crypto$2f$random$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/crypto/random.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/utils/dist/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$hash$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/utils/dist/hash.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$noble$2f$ciphers$2f$chacha$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@noble/ciphers/chacha.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$noble$2f$ciphers$2f$utils$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@noble/ciphers/utils.js [app-route] (ecmascript)");
;
;
;
;
;
;
;
;
//#region src/crypto/index.ts
const algorithm = {
    name: "HMAC",
    hash: "SHA-256"
};
const ENVELOPE_PREFIX = "$ba$";
function parseEnvelope(data) {
    if (!data.startsWith(ENVELOPE_PREFIX)) return null;
    const firstSep = 4;
    const secondSep = data.indexOf("$", firstSep);
    if (secondSep === -1) return null;
    const version = parseInt(data.slice(firstSep, secondSep), 10);
    if (!Number.isInteger(version) || version < 0) return null;
    return {
        version,
        ciphertext: data.slice(secondSep + 1)
    };
}
function formatEnvelope(version, ciphertext) {
    return `${ENVELOPE_PREFIX}${version}$${ciphertext}`;
}
async function rawEncrypt(secret, data) {
    const keyAsBytes = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$hash$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createHash"])("SHA-256").digest(secret);
    const dataAsBytes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$noble$2f$ciphers$2f$utils$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["utf8ToBytes"])(data);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$noble$2f$ciphers$2f$utils$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["bytesToHex"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$noble$2f$ciphers$2f$utils$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["managedNonce"])(__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$noble$2f$ciphers$2f$chacha$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["xchacha20poly1305"])(new Uint8Array(keyAsBytes)).encrypt(dataAsBytes));
}
async function rawDecrypt(secret, hex) {
    const keyAsBytes = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$hash$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createHash"])("SHA-256").digest(secret);
    const dataAsBytes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$noble$2f$ciphers$2f$utils$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["hexToBytes"])(hex);
    const chacha = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$noble$2f$ciphers$2f$utils$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["managedNonce"])(__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$noble$2f$ciphers$2f$chacha$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["xchacha20poly1305"])(new Uint8Array(keyAsBytes));
    return new TextDecoder().decode(chacha.decrypt(dataAsBytes));
}
const symmetricEncrypt = async ({ key, data })=>{
    if (typeof key === "string") return rawEncrypt(key, data);
    const secret = key.keys.get(key.currentVersion);
    if (!secret) throw new Error(`Secret version ${key.currentVersion} not found in keys`);
    const ciphertext = await rawEncrypt(secret, data);
    return formatEnvelope(key.currentVersion, ciphertext);
};
const symmetricDecrypt = async ({ key, data })=>{
    if (typeof key === "string") return rawDecrypt(key, data);
    const envelope = parseEnvelope(data);
    if (envelope) {
        const secret = key.keys.get(envelope.version);
        if (!secret) throw new Error(`Secret version ${envelope.version} not found in keys (key may have been retired)`);
        return rawDecrypt(secret, envelope.ciphertext);
    }
    if (key.legacySecret) return rawDecrypt(key.legacySecret, data);
    throw new Error("Cannot decrypt legacy bare-hex payload: no legacy secret available. Set BETTER_AUTH_SECRET for backwards compatibility.");
};
const getCryptoKey = async (secret)=>{
    const secretBuf = typeof secret === "string" ? new TextEncoder().encode(secret) : secret;
    return await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getWebcryptoSubtle"])().importKey("raw", secretBuf, algorithm, false, [
        "sign",
        "verify"
    ]);
};
const makeSignature = async (value, secret)=>{
    const key = await getCryptoKey(secret);
    const signature = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getWebcryptoSubtle"])().sign(algorithm.name, key, new TextEncoder().encode(value));
    return btoa(String.fromCharCode(...new Uint8Array(signature)));
};
;
}),
"[project]/examples/nextjs/node_modules/better-auth/dist/crypto/jwt.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "signJWT",
    ()=>signJWT,
    "symmetricDecodeJWT",
    ()=>symmetricDecodeJWT,
    "symmetricEncodeJWT",
    ()=>symmetricEncodeJWT,
    "verifyJWT",
    ()=>verifyJWT
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$noble$2f$hashes$2f$hkdf$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@noble/hashes/hkdf.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$noble$2f$hashes$2f$sha2$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@noble/hashes/sha2.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$encrypt$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/jose/dist/webapi/jwt/encrypt.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$sign$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/jose/dist/webapi/jwt/sign.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$base64url$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__base64url__$2e$encode$3e$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/jose/dist/webapi/util/base64url.js [app-route] (ecmascript) <export * as base64url .encode>");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwk$2f$thumbprint$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/jose/dist/webapi/jwk/thumbprint.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$decode_protected_header$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/jose/dist/webapi/util/decode_protected_header.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$decrypt$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/jose/dist/webapi/jwt/decrypt.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$verify$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/jose/dist/webapi/jwt/verify.js [app-route] (ecmascript)");
;
;
;
//#region src/crypto/jwt.ts
async function signJWT(payload, secret, expiresIn = 3600) {
    return await new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$sign$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SignJWT"](payload).setProtectedHeader({
        alg: "HS256"
    }).setIssuedAt().setExpirationTime(Math.floor(Date.now() / 1e3) + expiresIn).sign(new TextEncoder().encode(secret));
}
async function verifyJWT(token, secret) {
    try {
        return (await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$verify$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jwtVerify"])(token, new TextEncoder().encode(secret))).payload;
    } catch  {
        return null;
    }
}
const info = new Uint8Array([
    66,
    101,
    116,
    116,
    101,
    114,
    65,
    117,
    116,
    104,
    46,
    106,
    115,
    32,
    71,
    101,
    110,
    101,
    114,
    97,
    116,
    101,
    100,
    32,
    69,
    110,
    99,
    114,
    121,
    112,
    116,
    105,
    111,
    110,
    32,
    75,
    101,
    121
]);
const now = ()=>Date.now() / 1e3 | 0;
const alg = "dir";
const enc = "A256CBC-HS512";
function deriveEncryptionSecret(secret, salt) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$noble$2f$hashes$2f$hkdf$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["hkdf"])(__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$noble$2f$hashes$2f$sha2$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sha256"], new TextEncoder().encode(secret), new TextEncoder().encode(salt), info, 64);
}
function getCurrentSecret(secret) {
    if (typeof secret === "string") return secret;
    const value = secret.keys.get(secret.currentVersion);
    if (!value) throw new Error(`Secret version ${secret.currentVersion} not found in keys`);
    return value;
}
function getAllSecrets(secret) {
    if (typeof secret === "string") return [
        {
            version: 0,
            value: secret
        }
    ];
    const result = [];
    for (const [version, value] of secret.keys)result.push({
        version,
        value
    });
    if (secret.legacySecret && !result.some((s)=>s.value === secret.legacySecret)) result.push({
        version: -1,
        value: secret.legacySecret
    });
    return result;
}
async function symmetricEncodeJWT(payload, secret, salt, expiresIn = 3600) {
    const encryptionSecret = deriveEncryptionSecret(getCurrentSecret(secret), salt);
    const thumbprint = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwk$2f$thumbprint$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["calculateJwkThumbprint"])({
        kty: "oct",
        k: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$base64url$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__base64url__$2e$encode$3e$__["base64url"].encode(encryptionSecret)
    }, "sha256");
    return await new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$encrypt$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["EncryptJWT"](payload).setProtectedHeader({
        alg,
        enc,
        kid: thumbprint
    }).setIssuedAt().setExpirationTime(now() + expiresIn).setJti(crypto.randomUUID()).encrypt(encryptionSecret);
}
const jwtDecryptOpts = {
    clockTolerance: 15,
    keyManagementAlgorithms: [
        alg
    ],
    contentEncryptionAlgorithms: [
        enc,
        "A256GCM"
    ]
};
async function symmetricDecodeJWT(token, secret, salt) {
    if (!token) return null;
    let hasKid = false;
    try {
        hasKid = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$decode_protected_header$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["decodeProtectedHeader"])(token).kid !== void 0;
    } catch  {
        return null;
    }
    try {
        const secrets = getAllSecrets(secret);
        const { payload } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$decrypt$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jwtDecrypt"])(token, async (protectedHeader)=>{
            const kid = protectedHeader.kid;
            if (kid !== void 0) {
                for (const s of secrets){
                    const encryptionSecret = deriveEncryptionSecret(s.value, salt);
                    if (kid === await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwk$2f$thumbprint$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["calculateJwkThumbprint"])({
                        kty: "oct",
                        k: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$util$2f$base64url$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__base64url__$2e$encode$3e$__["base64url"].encode(encryptionSecret)
                    }, "sha256")) return encryptionSecret;
                }
                throw new Error("no matching decryption secret");
            }
            if (secrets.length === 1) return deriveEncryptionSecret(secrets[0].value, salt);
            return deriveEncryptionSecret(secrets[0].value, salt);
        }, jwtDecryptOpts);
        return payload;
    } catch  {
        if (hasKid) return null;
        const secrets = getAllSecrets(secret);
        if (secrets.length <= 1) return null;
        for(let i = 1; i < secrets.length; i++)try {
            const s = secrets[i];
            const { payload } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$decrypt$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jwtDecrypt"])(token, deriveEncryptionSecret(s.value, salt), jwtDecryptOpts);
            return payload;
        } catch  {
            continue;
        }
        return null;
    }
}
;
}),
"[project]/examples/nextjs/node_modules/better-auth/dist/crypto/password.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "hashPassword",
    ()=>hashPassword$1,
    "verifyPassword",
    ()=>verifyPassword$1
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$password$2e$node$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/utils/dist/password.node.mjs [app-route] (ecmascript)");
;
//#region src/crypto/password.ts
/**
* `@better-auth/utils/password` uses the "node" export condition in package.json
* to automatically pick the right implementation:
*   - Node.js / Bun / Deno → `node:crypto scrypt` (libuv thread pool, non-blocking)
*   - Unsupported runtimes → `@noble/hashes scrypt` (pure JS fallback)
*/ const hashPassword$1 = __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$password$2e$node$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["hashPassword"];
const verifyPassword$1 = async ({ hash, password })=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$password$2e$node$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["verifyPassword"])(hash, password);
};
;
}),
"[project]/examples/nextjs/node_modules/better-auth/dist/crypto/purpose.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "derivePurposeKey",
    ()=>derivePurposeKey
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$noble$2f$hashes$2f$hkdf$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@noble/hashes/hkdf.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$noble$2f$hashes$2f$sha2$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@noble/hashes/sha2.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$noble$2f$hashes$2f$utils$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@noble/hashes/utils.js [app-route] (ecmascript)");
;
;
;
//#region src/crypto/purpose.ts
const salt = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$noble$2f$hashes$2f$utils$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["utf8ToBytes"])("better-auth:oauth-encryption:v1");
function deriveSecret(secret, purpose) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$noble$2f$hashes$2f$utils$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["bytesToHex"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$noble$2f$hashes$2f$hkdf$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["hkdf"])(__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$noble$2f$hashes$2f$sha2$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sha256"], (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$noble$2f$hashes$2f$utils$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["utf8ToBytes"])(secret), salt, (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$noble$2f$hashes$2f$utils$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["utf8ToBytes"])(`better-auth:${purpose}:v1`), 32));
}
/** Derive an isolated key for one OAuth ciphertext purpose, retaining rotation versions. */ function derivePurposeKey(secret, purpose) {
    if (typeof secret === "string") return deriveSecret(secret, purpose);
    return {
        keys: new Map(Array.from(secret.keys, ([version, value])=>[
                version,
                deriveSecret(value, purpose)
            ])),
        currentVersion: secret.currentVersion,
        ...secret.legacySecret && {
            legacySecret: deriveSecret(secret.legacySecret, purpose)
        }
    };
}
;
}),
"[project]/examples/nextjs/node_modules/better-auth/dist/crypto/random.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "generateRandomString",
    ()=>generateRandomString
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$random$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/utils/dist/random.mjs [app-route] (ecmascript)");
;
//#region src/crypto/random.ts
const generateRandomString = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$random$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createRandomStringGenerator"])("a-z", "0-9", "A-Z", "-_");
;
}),
"[project]/examples/nextjs/node_modules/better-auth/dist/db/adapter-base.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getBaseAdapter",
    ()=>getBaseAdapter
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$db$2f$get$2d$tables$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/db/get-tables.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$logger$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/env/logger.mjs [app-route] (ecmascript)");
;
;
//#region src/db/adapter-base.ts
async function getBaseAdapter(options, handleDirectDatabase) {
    let adapter;
    if (!options.database) {
        const tables = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$db$2f$get$2d$tables$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getAuthTables"])(options);
        const memoryDB = Object.keys(tables).reduce((acc, key)=>{
            acc[key] = [];
            return acc;
        }, {});
        const { memoryAdapter } = await __turbopack_context__.A("[project]/examples/nextjs/node_modules/@better-auth/memory-adapter/dist/index.mjs [app-route] (ecmascript, async loader)");
        adapter = memoryAdapter(memoryDB)(options);
    } else if (typeof options.database === "function") adapter = options.database(options);
    else adapter = await handleDirectDatabase(options);
    if (!adapter.transaction) {
        __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$logger$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logger"].warn("Adapter does not correctly implement transaction function, patching it automatically. Please update your adapter implementation.");
        adapter.transaction = async (cb)=>{
            return cb(adapter);
        };
    }
    return adapter;
}
;
}),
"[project]/examples/nextjs/node_modules/better-auth/dist/db/adapter-kysely.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getAdapter",
    ()=>getAdapter
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$adapter$2d$base$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/db/adapter-base.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/error/index.mjs [app-route] (ecmascript) <locals>");
;
;
//#region src/db/adapter-kysely.ts
async function getAdapter(options) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$adapter$2d$base$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getBaseAdapter"])(options, async (opts)=>{
        const { createKyselyAdapter, kyselyAdapter } = await __turbopack_context__.A("[project]/examples/nextjs/node_modules/better-auth/dist/adapters/kysely-adapter/index.mjs [app-route] (ecmascript, async loader)");
        const { kysely, databaseType, transaction } = await createKyselyAdapter(opts);
        if (!kysely) throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["BetterAuthError"]("Failed to initialize database adapter");
        return kyselyAdapter(kysely, {
            type: databaseType || "sqlite",
            debugLogs: opts.database && "debugLogs" in opts.database ? opts.database.debugLogs : false,
            transaction
        })(opts);
    });
}
;
}),
"[project]/examples/nextjs/node_modules/better-auth/dist/db/get-migration.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "UnsafeMigrationError",
    ()=>UnsafeMigrationError,
    "getMigrations",
    ()=>getMigrations,
    "matchType",
    ()=>matchType
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$get$2d$schema$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/db/get-schema.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$logger$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/env/logger.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/error/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$kysely$2d$adapter$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/kysely-adapter/dist/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$db$2f$adapter$2f$get$2d$field$2d$name$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/db/adapter/get-field-name.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$db$2f$adapter$2f$get$2d$model$2d$name$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/db/adapter/get-model-name.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$db$2f$schema$2d$diff$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/db/schema-diff.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$db$2f$database$2d$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/db/database-index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$db$2f$schema$2d$check$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/db/schema-check.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$kysely$2f$dist$2f$raw$2d$builder$2f$sql$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/kysely/dist/raw-builder/sql.js [app-route] (ecmascript)");
;
;
;
;
;
;
;
//#region src/db/get-migration.ts
const map = {
    postgres: {
        string: [
            "character varying",
            "varchar",
            "text",
            "uuid"
        ],
        number: [
            "int4",
            "int8",
            "integer",
            "bigint",
            "smallint",
            "numeric",
            "real",
            "double precision"
        ],
        boolean: [
            "bool",
            "boolean"
        ],
        date: [
            "timestamptz",
            "timestamp",
            "date"
        ],
        json: [
            "json",
            "jsonb"
        ]
    },
    mysql: {
        string: [
            "varchar",
            "text",
            "uuid"
        ],
        number: [
            "integer",
            "int",
            "bigint",
            "smallint",
            "decimal",
            "float",
            "double"
        ],
        boolean: [
            "boolean",
            "tinyint"
        ],
        date: [
            "timestamp",
            "datetime",
            "date"
        ],
        json: [
            "json"
        ]
    },
    sqlite: {
        string: [
            "TEXT"
        ],
        number: [
            "INTEGER",
            "REAL",
            "BIGINT"
        ],
        boolean: [
            "INTEGER",
            "BOOLEAN"
        ],
        date: [
            "DATE",
            "INTEGER"
        ],
        json: [
            "TEXT"
        ]
    },
    mssql: {
        string: [
            "varchar",
            "nvarchar",
            "uniqueidentifier"
        ],
        number: [
            "int",
            "bigint",
            "smallint",
            "decimal",
            "float",
            "double"
        ],
        boolean: [
            "bit",
            "smallint"
        ],
        date: [
            "datetime2",
            "date",
            "datetime"
        ],
        json: [
            "varchar",
            "nvarchar"
        ]
    }
};
function createDatabaseIndexKey(tableName, indexName) {
    return `${(0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$db$2f$database$2d$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getPortableDatabaseIdentifierKey"])(tableName)}\u0000${(0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$db$2f$database$2d$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getPortableDatabaseIdentifierKey"])(indexName)}`;
}
function createDatabaseColumnKey(tableName, columnName) {
    return `${tableName}\u0000${columnName}`;
}
function databaseIndexMatches(existing, configured) {
    return existing.unique === (configured.unique ?? false) && existing.validFullColumns && existing.columns.length === configured.columns.length && existing.columns.every((column, position)=>column === configured.columns[position]);
}
function databaseValueIsTrue(value) {
    if (typeof value === "boolean") return value;
    if (typeof value === "number") return value !== 0;
    return value === "1" || value?.toLowerCase() === "true" || value === "t";
}
function toDatabaseIndexMap(indexes) {
    return new Map(indexes.map((index)=>{
        const columns = [
            ...index.columns
        ].sort((left, right)=>left.position - right.position);
        return [
            createDatabaseIndexKey(index.table, index.name),
            {
                columns: columns.flatMap((column)=>column.name === null ? [] : [
                        column.name
                    ]),
                name: index.name,
                table: index.table,
                unique: index.unique,
                validFullColumns: index.valid && !index.partial && columns.length > 0 && columns.every((column)=>column.name !== null && column.fullLength)
            }
        ];
    }));
}
async function getDatabaseIndexMap(db, target, tableNames, introspectIndexes) {
    if (introspectIndexes) return toDatabaseIndexMap(await introspectIndexes(tableNames));
    let rows;
    switch(target.type){
        case "sqlite":
            rows = (await __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$kysely$2f$dist$2f$raw$2d$builder$2f$sql$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`
				SELECT
					tables.name AS "tableName",
					index_list.name AS "indexName",
					index_info.name AS "columnName",
					index_list."unique" AS "isUnique",
					index_list.partial AS "isPartial",
					index_info.seqno AS "columnPosition"
				FROM sqlite_master AS tables
				INNER JOIN pragma_index_list(tables.name) AS index_list
				INNER JOIN pragma_index_info(index_list.name) AS index_info
				WHERE tables.type = 'table'
			`.execute(db)).rows;
            break;
        case "postgres":
            rows = (await __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$kysely$2f$dist$2f$raw$2d$builder$2f$sql$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`
				SELECT
					table_class.relname AS "tableName",
					index_class.relname AS "indexName",
					index_attribute.attname AS "columnName",
					index_data.indisunique AS "isUnique",
					index_data.indisvalid AS "isValid",
					(index_data.indpred IS NOT NULL) AS "isPartial",
					index_column.ordinality AS "columnPosition"
				FROM pg_class AS table_class
				INNER JOIN pg_namespace AS table_namespace
					ON table_namespace.oid = table_class.relnamespace
				INNER JOIN pg_index AS index_data
					ON index_data.indrelid = table_class.oid
				INNER JOIN pg_class AS index_class
					ON index_class.oid = index_data.indexrelid
				INNER JOIN LATERAL unnest(index_data.indkey)
					WITH ORDINALITY AS index_column(attribute_number, ordinality)
					ON TRUE
				LEFT JOIN pg_attribute AS index_attribute
					ON index_attribute.attrelid = table_class.oid
					AND index_attribute.attnum = index_column.attribute_number
				WHERE table_namespace.nspname = ${target.schema}
					AND table_class.relkind = 'r'
					AND index_column.ordinality <= index_data.indnkeyatts
			`.execute(db)).rows;
            break;
        case "mysql":
            rows = (await __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$kysely$2f$dist$2f$raw$2d$builder$2f$sql$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`
				SELECT
					table_name AS tableName,
					index_name AS indexName,
					column_name AS columnName,
					non_unique AS nonUnique,
					seq_in_index AS columnPosition,
					sub_part AS prefixLength,
					COALESCE(LOWER(comment) = 'disabled', FALSE) AS isDisabled
				FROM information_schema.statistics
				WHERE table_schema = DATABASE()
			`.execute(db)).rows;
            break;
        case "mssql":
            rows = (await __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$kysely$2f$dist$2f$raw$2d$builder$2f$sql$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`
				SELECT
					tables.name AS "tableName",
					indexes.name AS "indexName",
					columns.name AS "columnName",
					indexes.is_unique AS "isUnique",
					indexes.is_disabled AS "isDisabled",
					indexes.is_hypothetical AS "isHypothetical",
					indexes.has_filter AS "isPartial",
					index_columns.key_ordinal AS "columnPosition"
				FROM sys.indexes AS indexes
				INNER JOIN sys.tables AS tables
					ON indexes.object_id = tables.object_id
				INNER JOIN sys.schemas AS table_schemas
					ON table_schemas.schema_id = tables.schema_id
				INNER JOIN sys.index_columns AS index_columns
					ON index_columns.object_id = indexes.object_id
					AND index_columns.index_id = indexes.index_id
				INNER JOIN sys.columns AS columns
					ON columns.object_id = index_columns.object_id
					AND columns.column_id = index_columns.column_id
				WHERE table_schemas.name = ${target.schema}
					AND indexes.name IS NOT NULL
					AND index_columns.key_ordinal > 0
			`.execute(db)).rows;
            break;
    }
    const indexMetadata = /* @__PURE__ */ new Map();
    for (const row of rows){
        const table = row.tableName ?? row.table_name ?? row.TABLE_NAME ?? row.tablename ?? row.tbl_name;
        const name = row.indexName ?? row.index_name ?? row.INDEX_NAME ?? row.name;
        const column = row.columnName ?? row.column_name ?? row.COLUMN_NAME;
        if (!table || !name) continue;
        const key = createDatabaseIndexKey(table, name);
        const nonUnique = row.nonUnique ?? row.non_unique ?? row.NON_UNIQUE;
        const unique = nonUnique === void 0 ? databaseValueIsTrue(row.isUnique ?? row.is_unique) : !databaseValueIsTrue(nonUnique);
        const position = Number(row.columnPosition ?? row.column_position ?? row.keyOrdinal ?? row.key_ordinal ?? row.ordinality ?? row.seqInIndex ?? row.seq_in_index ?? row.SEQ_IN_INDEX ?? row.seqno ?? 0);
        const indexColumn = {
            fullLength: column !== void 0 && column !== null && (row.prefixLength === void 0 || row.prefixLength === null),
            name: column ?? null,
            position
        };
        const partial = databaseValueIsTrue(row.isPartial);
        const valid = !databaseValueIsTrue(row.isDisabled) && !databaseValueIsTrue(row.isHypothetical) && (row.isValid === void 0 || databaseValueIsTrue(row.isValid));
        const existing = indexMetadata.get(key);
        indexMetadata.set(key, existing ? {
            ...existing,
            columns: [
                ...existing.columns,
                indexColumn
            ],
            partial: existing.partial || partial,
            valid: existing.valid && valid
        } : {
            columns: [
                indexColumn
            ],
            name,
            partial,
            table,
            unique,
            valid
        });
    }
    return toDatabaseIndexMap([
        ...indexMetadata.values()
    ]);
}
async function getDatabaseColumnBounds(db, target) {
    let rows;
    switch(target.type){
        case "postgres":
        case "sqlite":
            return /* @__PURE__ */ new Map();
        case "mysql":
            rows = (await __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$kysely$2f$dist$2f$raw$2d$builder$2f$sql$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`
				SELECT
					table_name AS tableName,
					column_name AS columnName,
					character_octet_length AS maxIndexBytes
				FROM information_schema.columns
				WHERE table_schema = DATABASE()
			`.execute(db)).rows;
            break;
        case "mssql":
            rows = (await __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$kysely$2f$dist$2f$raw$2d$builder$2f$sql$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`
				SELECT
					tables.name AS "tableName",
					columns.name AS "columnName",
					columns.max_length AS "maxIndexBytes"
				FROM sys.columns AS columns
				INNER JOIN sys.tables AS tables
					ON tables.object_id = columns.object_id
				INNER JOIN sys.schemas AS table_schemas
					ON table_schemas.schema_id = tables.schema_id
				WHERE table_schemas.name = ${target.schema}
			`.execute(db)).rows;
            break;
    }
    const bounds = /* @__PURE__ */ new Map();
    for (const row of rows){
        const table = row.tableName ?? row.TABLE_NAME;
        const column = row.columnName ?? row.COLUMN_NAME;
        if (!table || !column) continue;
        const maxIndexBytes = Number(row.maxIndexBytes ?? row.MAX_INDEX_BYTES ?? -1);
        bounds.set(createDatabaseColumnKey(table, column), {
            maxIndexBytes: maxIndexBytes < 0 ? null : maxIndexBytes
        });
    }
    return bounds;
}
function assertExistingTableIndexFits({ columnBounds, dbType, existingColumns, fields, indexes, index, table }) {
    const byteBudget = dbType === "mysql" ? 3072 : 1700;
    let requiredBytes = 0;
    for (const column of index.columns){
        const field = fields[column];
        if (!field) continue;
        if (field.type === "string" || Array.isArray(field.type)) {
            if (!existingColumns.has(column)) {
                const generatedLength = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$db$2f$database$2d$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getDatabaseIndexStringLength"])({
                    columnName: column,
                    dialect: dbType,
                    fields,
                    indexes
                });
                requiredBytes += (generatedLength ?? 0) * (dbType === "mysql" ? 4 : 1);
                continue;
            }
            const bound = columnBounds.get(createDatabaseColumnKey(table, column));
            if (!bound?.maxIndexBytes) throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["BetterAuthError"](`Cannot create database index "${index.name}" on existing table "${table}" because column "${column}" is not bounded for ${dbType === "mysql" ? "MySQL" : "SQL Server"}. Change it to a bounded string column, resolve oversized values, then run the migration again.`);
            requiredBytes += bound.maxIndexBytes;
        } else requiredBytes += 16;
    }
    if (requiredBytes > byteBudget) throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["BetterAuthError"](`Cannot create database index "${index.name}" on existing table "${table}" because its columns can exceed ${dbType === "mysql" ? "MySQL" : "SQL Server"}'s ${byteBudget}-byte index-key limit. Bound the indexed string columns to the generated schema lengths, resolve oversized values, then run the migration again.`);
}
/**
* Thrown when {@link getMigrations} refuses to add a required column with no
* default value to a populated table. Distinct from the plain
* {@link BetterAuthError} thrown for index-definition conflicts, so callers
* can tell the two apart without matching on message text.
*/ var UnsafeMigrationError = class extends __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["BetterAuthError"] {
};
function hasTimestampColumnDefault(field, dbType) {
    return field.type === "date" && typeof field.defaultValue === "function" && (dbType === "postgres" || dbType === "mysql" || dbType === "mssql");
}
function hasStaticColumnDefault(field) {
    return !(field.unique && field.required === false) && (field.type === "string" || field.type === "number" || field.type === "boolean") && field.defaultValue !== void 0 && field.defaultValue !== null && typeof field.defaultValue !== "function";
}
async function tableHasRows(db, dbType, table) {
    const probe = db.selectFrom(table).select(__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$kysely$2f$dist$2f$raw$2d$builder$2f$sql$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`1`.as("present"));
    return (await (dbType === "mssql" ? probe.top(1) : probe.limit(1)).execute()).length > 0;
}
function matchType(columnDataType, fieldType, dbType) {
    function normalize(type) {
        return type.toLowerCase().split("(")[0].trim();
    }
    if (fieldType === "string[]" || fieldType === "number[]") return columnDataType.toLowerCase().includes("json");
    const types = map[dbType];
    return (Array.isArray(fieldType) ? types["string"].map((t)=>t.toLowerCase()) : types[fieldType].map((t)=>t.toLowerCase())).includes(normalize(columnDataType));
}
/**
* Build the migration plan that `auth migrate` executes and `auth generate`
* prints for the Kysely adapter.
*
* Adding a required column without a default to a populated table is refused:
* existing rows have no value to backfill. `throwOnUnsafe` picks how that
* refusal is delivered: executing callers get an {@link UnsafeMigrationError},
* read-only callers get the plan plus the same message in `unsafeChanges`.
*
* @throws {UnsafeMigrationError} when a required column cannot be migrated
* safely and `throwOnUnsafe` is left on.
* @throws {BetterAuthError} when an index definition conflicts with an
* existing or already-planned index.
*/ async function getMigrations(config, { throwOnUnsafe = true } = {}) {
    const { schema: betterAuthSchema, tables: authTables, referenceKeys } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$get$2d$schema$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["buildSchema"])(config);
    const logger = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$logger$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createLogger"])(config.logger);
    const unsafeChanges = [];
    const reportUnsafeChange = (message)=>{
        if (throwOnUnsafe) throw new UnsafeMigrationError(message);
        unsafeChanges.push(message);
    };
    let { kysely: db, databaseType: dbType, introspectIndexes, schemaName } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$kysely$2d$adapter$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createKyselyAdapter"])(config);
    if (!dbType) {
        logger.warn("Could not determine database type, defaulting to sqlite. Please provide a type in the database options to avoid this.");
        dbType = "sqlite";
    }
    if (!db) {
        logger.error("Only kysely adapter is supported for migrations. You can use `generate` command to generate the schema, if you're using a different adapter.");
        process.exit(1);
    }
    const allTableMetadata = await db.introspection.getTables();
    let target;
    let tableMetadata = allTableMetadata;
    switch(dbType){
        case "postgres":
            {
                const schema = schemaName ?? await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$kysely$2d$adapter$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getPostgresSchema"])(db);
                target = {
                    type: "postgres",
                    schema
                };
                logger.debug(`PostgreSQL migration: Using schema '${schema}' (${schemaName ? "from database.schemaName" : "from search_path"})`);
                try {
                    if (!(await db.introspection.getSchemas()).some(({ name })=>name === schema)) if (schemaName) logger.debug(`Schema '${schema}' does not exist yet. The migration creates it before creating tables.`);
                    else logger.warn(`Schema '${schema}' does not exist. Create it before running migrations or check your database configuration.`);
                } catch (error) {
                    logger.debug(`Could not verify schema existence: ${error instanceof Error ? error.message : String(error)}`);
                }
                /**
			* Kysely 0.28 does not expose `isForeign`, while 0.29 adds foreign table metadata.
			* @see https://github.com/kysely-org/kysely/pull/1494
			*/ tableMetadata = allTableMetadata.filter((table)=>table.schema === schema && !table.isView && !("isForeign" in table && table.isForeign));
                logger.debug(`Found ${tableMetadata.length} table(s) in schema '${schema}': ${tableMetadata.map((table)=>table.name).join(", ") || "(none)"}`);
                break;
            }
        case "mssql":
            {
                const schema = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$kysely$2d$adapter$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getMssqlSchema"])(db);
                target = {
                    type: "mssql",
                    schema
                };
                logger.debug(`SQL Server migration: Using schema '${schema}' (from the current user's default schema)`);
                tableMetadata = allTableMetadata.filter((table)=>table.schema === schema);
                break;
            }
        case "mysql":
            target = {
                type: "mysql"
            };
            break;
        case "sqlite":
            target = {
                type: "sqlite"
            };
            break;
    }
    const databaseIndexMap = await getDatabaseIndexMap(db, target, allTableMetadata.map((table)=>table.name), introspectIndexes);
    const databaseColumnBounds = await getDatabaseColumnBounds(db, target);
    const schemaProblems = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$db$2f$schema$2d$diff$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["diffSchema"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$kysely$2d$adapter$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["toPhysicalSchema"])(db, betterAuthSchema), (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$kysely$2d$adapter$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["toIntrospectedTables"])(tableMetadata)).filter((finding)=>finding.kind === "unexpected-required-column").map((finding)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$db$2f$schema$2d$diff$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["formatSchemaFinding"])(finding, "database"));
    const toBeCreated = [];
    const toBeAdded = [];
    const toBeAddedIndexes = [];
    const plannedIndexes = /* @__PURE__ */ new Map();
    for (const [key, value] of Object.entries(betterAuthSchema)){
        if (value.disableMigrations) continue;
        const table = tableMetadata.find((table)=>table.name === key);
        for (const index of value.indexes ?? []){
            const name = index.name;
            const indexKey = createDatabaseIndexKey(key, name);
            const existingIndex = databaseIndexMap.get(indexKey);
            if (existingIndex) {
                if (!databaseIndexMatches(existingIndex, index)) throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["BetterAuthError"](`Database index "${name}" on table "${key}" does not match the configured fields and uniqueness. Rename or replace the existing index, then run the migration again.`);
                continue;
            }
            if (dbType === "sqlite" || dbType === "postgres") {
                const indexOnAnotherTable = [
                    ...databaseIndexMap.values()
                ].find((databaseIndex)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$db$2f$database$2d$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getPortableDatabaseIdentifierKey"])(databaseIndex.name) === (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$db$2f$database$2d$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getPortableDatabaseIdentifierKey"])(name) && (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$db$2f$database$2d$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getPortableDatabaseIdentifierKey"])(databaseIndex.table) !== (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$db$2f$database$2d$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getPortableDatabaseIdentifierKey"])(key));
                if (indexOnAnotherTable) throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["BetterAuthError"](`Database index name "${name}" is already used by table "${indexOnAnotherTable.table}". Index names must be unique across the schema.`);
            }
            const plannedIndex = plannedIndexes.get(indexKey);
            if (plannedIndex) {
                if (!databaseIndexMatches({
                    columns: plannedIndex.columns,
                    name: plannedIndex.name,
                    table: key,
                    unique: plannedIndex.unique ?? false,
                    validFullColumns: true
                }, index)) throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["BetterAuthError"](`Database index name "${name}" identifies more than one index on table "${key}".`);
                continue;
            }
            if (table && (dbType === "mysql" || dbType === "mssql")) assertExistingTableIndexFits({
                columnBounds: databaseColumnBounds,
                dbType,
                existingColumns: new Set(table.columns.map((column)=>column.name)),
                fields: value.fields,
                index,
                indexes: value.indexes ?? [],
                table: key
            });
            plannedIndexes.set(indexKey, index);
            toBeAddedIndexes.push({
                table: key,
                index,
                name
            });
        }
        if (!table) {
            const tIndex = toBeCreated.findIndex((t)=>t.table === key);
            const tableData = {
                table: key,
                fields: value.fields,
                order: value.order || Infinity
            };
            const insertIndex = toBeCreated.findIndex((t)=>(t.order || Infinity) > tableData.order);
            if (insertIndex === -1) if (tIndex === -1) toBeCreated.push(tableData);
            else toBeCreated[tIndex].fields = {
                ...toBeCreated[tIndex].fields,
                ...value.fields
            };
            else toBeCreated.splice(insertIndex, 0, tableData);
            continue;
        }
        const toBeAddedFields = {};
        for (const [fieldName, field] of Object.entries(value.fields)){
            const column = table.columns.find((c)=>c.name === fieldName);
            if (!column) {
                toBeAddedFields[fieldName] = field;
                continue;
            }
            if (field.required !== false && column.isNullable) logger.warn(`Column "${fieldName}" on table "${key}" stays nullable while the schema declares the field required, so existing rows can still hold null. Backfill every row for this column and enforce NOT NULL to remove the drift.`);
            if (matchType(column.dataType, field.type, dbType)) continue;
            else logger.warn(`Field ${fieldName} in table ${key} has a different type in the database. Expected ${field.type} but got ${column.dataType}.`);
        }
        if (Object.keys(toBeAddedFields).length > 0) toBeAdded.push({
            table: key,
            fields: toBeAddedFields,
            order: value.order || Infinity
        });
    }
    const migrations = [];
    if (schemaName && toBeCreated.length > 0) migrations.push(db.schema.createSchema(schemaName).ifNotExists());
    const useUUIDs = config.advanced?.database?.generateId === "uuid";
    const useNumberId = config.advanced?.database?.generateId === "serial";
    function getType(field, fieldName, tableIndexStringLength) {
        const type = field.type;
        const provider = dbType || "sqlite";
        const typeMap = {
            string: {
                sqlite: "text",
                postgres: "text",
                mysql: tableIndexStringLength ? `varchar(${tableIndexStringLength})` : field.unique ? "varchar(255)" : field.references ? "varchar(36)" : field.sortable ? "varchar(255)" : field.index ? "varchar(255)" : "text",
                mssql: tableIndexStringLength ? `varchar(${tableIndexStringLength})` : field.unique || field.sortable ? "varchar(255)" : field.references ? "varchar(36)" : "varchar(8000)"
            },
            boolean: {
                sqlite: "integer",
                postgres: "boolean",
                mysql: "boolean",
                mssql: "smallint"
            },
            number: {
                sqlite: field.bigint ? "bigint" : "integer",
                postgres: field.bigint ? "bigint" : "integer",
                mysql: field.bigint ? "bigint" : "integer",
                mssql: field.bigint ? "bigint" : "integer"
            },
            date: {
                sqlite: "date",
                postgres: "timestamptz",
                mysql: "timestamp(3)",
                mssql: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$kysely$2f$dist$2f$raw$2d$builder$2f$sql$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`datetime2(3)`
            },
            json: {
                sqlite: "text",
                postgres: "jsonb",
                mysql: "json",
                mssql: "varchar(8000)"
            },
            id: {
                postgres: useNumberId ? __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$kysely$2f$dist$2f$raw$2d$builder$2f$sql$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`integer GENERATED BY DEFAULT AS IDENTITY` : useUUIDs ? "uuid" : "text",
                mysql: useNumberId ? "integer" : useUUIDs ? "varchar(36)" : "varchar(36)",
                mssql: useNumberId ? "integer" : useUUIDs ? "varchar(36)" : "varchar(36)",
                sqlite: useNumberId ? "integer" : "text"
            },
            foreignKeyId: {
                postgres: useNumberId ? "integer" : useUUIDs ? "uuid" : "text",
                mysql: useNumberId ? "integer" : useUUIDs ? "varchar(36)" : "varchar(36)",
                mssql: useNumberId ? "integer" : useUUIDs ? "varchar(36)" : "varchar(36)",
                sqlite: useNumberId ? "integer" : "text"
            },
            "string[]": {
                sqlite: "text",
                postgres: "jsonb",
                mysql: "json",
                mssql: "varchar(8000)"
            },
            "number[]": {
                sqlite: "text",
                postgres: "jsonb",
                mysql: "json",
                mssql: "varchar(8000)"
            }
        };
        if (fieldName === "id" || field.references?.field === "id") {
            if (fieldName === "id") return typeMap.id[provider];
            return typeMap.foreignKeyId[provider];
        }
        if (Array.isArray(type)) return "text";
        if (!(type in typeMap)) throw new Error(`Unsupported field type '${String(type)}' for field '${fieldName}'. Allowed types are: string, number, boolean, date, string[], number[]. If you need to store structured data, store it as a JSON string (type: "string") or split it into primitive fields. See https://better-auth.com/docs/advanced/schema#additional-fields`);
        return typeMap[type][provider];
    }
    const getModelName = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$db$2f$adapter$2f$get$2d$model$2d$name$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["initGetModelName"])({
        schema: authTables,
        usePlural: false
    });
    const getFieldName = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$db$2f$adapter$2f$get$2d$field$2d$name$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["initGetFieldName"])({
        schema: authTables,
        usePlural: false
    });
    function getReferencePath(field) {
        const reference = field.references;
        if (!reference) throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["BetterAuthError"]("Cannot resolve a field without references.");
        const keys = referenceKeys.get(field);
        if (!keys) throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["BetterAuthError"](`Missing migration reference metadata for "${reference.model}.${reference.field}".`);
        try {
            return `${getModelName(keys.modelKey)}.${getFieldName({
                model: keys.modelKey,
                field: keys.fieldKey
            })}`;
        } catch  {
            return `${reference.model}.${reference.field}`;
        }
    }
    const deferredIndexes = [];
    const getTableIndexStringLength = (tableName, fieldName)=>{
        if (dbType !== "mysql" && dbType !== "mssql") return void 0;
        const table = betterAuthSchema[tableName];
        if (!table) return void 0;
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$db$2f$database$2d$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getDatabaseIndexStringLength"])({
            columnName: fieldName,
            dialect: dbType,
            fields: table.fields,
            indexes: table.indexes ?? []
        });
    };
    if (toBeAdded.length) {
        const populatedTables = /* @__PURE__ */ new Map();
        for (const table of toBeAdded)for (const [fieldName, field] of Object.entries(table.fields)){
            const timestampDefault = hasTimestampColumnDefault(field, dbType);
            const staticDefault = hasStaticColumnDefault(field);
            if (field.required !== false && !timestampDefault && !staticDefault) {
                let populated = populatedTables.get(table.table);
                if (populated === void 0) {
                    populated = await tableHasRows(db, dbType, table.table);
                    populatedTables.set(table.table, populated);
                }
                if (populated) {
                    const textDetail = field.type === "string" ? " For a text column, every existing row ends up with the same empty string." : "";
                    reportUnsafeChange(`Cannot add required column "${fieldName}" to populated table "${table.table}": the schema declares no default value, so existing rows have no value to backfill. MySQL accepts this statement instead of rejecting it and fills every existing row with an implicit default for the column type, reporting a successful migration over corrupted data.${textDetail} Add the column as nullable, backfill a correct value for every row, then make it NOT NULL.`);
                }
            }
            const type = getType(field, fieldName, getTableIndexStringLength(table.table, fieldName));
            const builder = db.schema.alterTable(table.table);
            if (field.index || field.unique) {
                const indexName = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$db$2f$database$2d$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getDatabaseFieldIndexName"])(table.table, fieldName, field.unique ?? false);
                let indexBuilder = db.schema.createIndex(indexName).on(table.table).columns([
                    fieldName
                ]);
                if (field.unique) {
                    indexBuilder = indexBuilder.unique();
                    if (field.required === false && dbType === "mssql") indexBuilder = indexBuilder.where(fieldName, "is not", null);
                    if (field.required !== false && field.defaultValue !== void 0 && field.defaultValue !== null && typeof field.defaultValue !== "function") logger.warn(`Adding unique column "${fieldName}" to existing table "${table.table}" backfills every existing row with its default value. If the table has more than one row, creating the unique index "${indexName}" will fail; backfill distinct values manually, then re-run the migration or create the index yourself.`);
                }
                deferredIndexes.push(indexBuilder);
            }
            const built = builder.addColumn(fieldName, type, (col)=>{
                col = field.required !== false ? col.notNull() : col;
                if (field.references) col = col.references(getReferencePath(field)).onDelete(field.references.onDelete || "cascade");
                if (timestampDefault) if (dbType === "mysql") col = col.defaultTo(__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$kysely$2f$dist$2f$raw$2d$builder$2f$sql$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`CURRENT_TIMESTAMP(3)`);
                else col = col.defaultTo(__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$kysely$2f$dist$2f$raw$2d$builder$2f$sql$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`CURRENT_TIMESTAMP`);
                else if (staticDefault) col = col.defaultTo(typeof field.defaultValue === "boolean" && (dbType === "sqlite" || dbType === "mssql") ? field.defaultValue ? 1 : 0 : field.defaultValue);
                return col;
            });
            migrations.push(built);
        }
    }
    if (toBeCreated.length) for (const table of toBeCreated){
        const idType = getType({
            type: useNumberId ? "number" : "string"
        }, "id");
        let dbT = db.schema.createTable(table.table).addColumn("id", idType, (col)=>{
            if (useNumberId) {
                if (dbType === "postgres") return col.primaryKey().notNull();
                else if (dbType === "sqlite") return col.primaryKey().notNull();
                else if (dbType === "mssql") return col.identity().primaryKey().notNull();
                return col.autoIncrement().primaryKey().notNull();
            }
            if (useUUIDs) {
                if (dbType === "postgres") return col.primaryKey().defaultTo(__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$kysely$2f$dist$2f$raw$2d$builder$2f$sql$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`pg_catalog.gen_random_uuid()`).notNull();
                return col.primaryKey().notNull();
            }
            return col.primaryKey().notNull();
        });
        for (const [fieldName, field] of Object.entries(table.fields)){
            const type = getType(field, fieldName, getTableIndexStringLength(table.table, fieldName));
            dbT = dbT.addColumn(fieldName, type, (col)=>{
                col = field.required !== false ? col.notNull() : col;
                if (field.references) col = col.references(getReferencePath(field)).onDelete(field.references.onDelete || "cascade");
                if (field.unique) col = col.unique();
                if (field.type === "date" && typeof field.defaultValue === "function" && (dbType === "postgres" || dbType === "mysql" || dbType === "mssql")) if (dbType === "mysql") col = col.defaultTo(__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$kysely$2f$dist$2f$raw$2d$builder$2f$sql$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`CURRENT_TIMESTAMP(3)`);
                else col = col.defaultTo(__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$kysely$2f$dist$2f$raw$2d$builder$2f$sql$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sql"]`CURRENT_TIMESTAMP`);
                return col;
            });
            if (field.index && !field.unique) {
                const builder = db.schema.createIndex((0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$db$2f$database$2d$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getDatabaseFieldIndexName"])(table.table, fieldName, false)).on(table.table).columns([
                    fieldName
                ]);
                deferredIndexes.push(builder);
            }
        }
        migrations.push(dbT);
    }
    for (const { table, index, name } of toBeAddedIndexes){
        let builder = db.schema.createIndex(name).on(table).columns([
            ...index.columns
        ]);
        if (index.unique) builder = builder.unique();
        deferredIndexes.push(builder);
    }
    for (const index of deferredIndexes)migrations.push(index);
    async function runMigrations() {
        try {
            for (const migration of migrations)await migration.execute();
        } finally{
            if (migrations.length && config.database) (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$db$2f$schema$2d$check$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["invalidateSchemaChecks"])(config.database);
        }
    }
    async function compileMigrations() {
        return migrations.map((m)=>m.compile().sql).join(";\n\n") + ";";
    }
    return {
        toBeCreated,
        toBeAdded,
        toBeAddedIndexes,
        unsafeChanges,
        schemaProblems,
        runMigrations,
        compileMigrations
    };
}
;
}),
"[project]/examples/nextjs/node_modules/better-auth/dist/db/get-schema.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "buildSchema",
    ()=>buildSchema,
    "getSchema",
    ()=>getSchema
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$db$2f$get$2d$tables$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/db/get-tables.mjs [app-route] (ecmascript)");
;
//#region src/db/get-schema.ts
function getSchema(config) {
    return buildSchema(config).schema;
}
/**
* @internal
*/ function buildSchema(config) {
    const { indexesByTable, tables } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$db$2f$get$2d$tables$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getAuthTablesWithResolvedIndexes"])(config);
    const referenceKeys = /* @__PURE__ */ new Map();
    const schema = {};
    for(const key in tables){
        const table = tables[key];
        const fields = table.fields;
        const actualFields = {};
        Object.entries(fields).forEach(([key, field])=>{
            const reference = field.references;
            const refTable = reference ? tables[reference.model] : void 0;
            const actualField = reference && refTable ? {
                ...field,
                references: {
                    ...reference,
                    model: refTable.modelName
                }
            } : field;
            actualFields[field.fieldName || key] = actualField;
            if (reference) referenceKeys.set(actualField, {
                modelKey: reference.model,
                fieldKey: reference.field
            });
        });
        if (schema[table.modelName]) {
            schema[table.modelName].fields = {
                ...schema[table.modelName].fields,
                ...actualFields
            };
            if (table.disableMigrations) schema[table.modelName].disableMigrations = true;
            continue;
        }
        schema[table.modelName] = {
            fields: actualFields,
            order: table.order || Infinity,
            disableMigrations: table.disableMigrations
        };
    }
    for (const [tableName, indexes] of indexesByTable)if (schema[tableName]) schema[tableName].indexes = indexes;
    return {
        schema,
        tables,
        referenceKeys
    };
}
;
}),
"[project]/examples/nextjs/node_modules/better-auth/dist/db/internal-adapter.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createInternalAdapter",
    ()=>createInternalAdapter
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$schema$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/db/schema.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$date$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/utils/date.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$validate$2d$user$2d$info$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/utils/validate-user-info.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$verification$2d$token$2d$storage$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/db/verification-token-storage.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$with$2d$hooks$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/db/with-hooks.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$transaction$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/context/transaction.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$endpoint$2d$context$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/context/endpoint-context.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/error/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$id$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/utils/id.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$json$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/utils/json.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$db$2f$adapter$2f$get$2d$id$2d$field$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/db/adapter/get-id-field.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$ip$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/utils/ip.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$hash$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/utils/dist/hash.mjs [app-route] (ecmascript)");
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
//#region src/db/internal-adapter.ts
function getTTLSeconds(expiresAt, now = Date.now()) {
    const expiresMs = typeof expiresAt === "number" ? expiresAt : expiresAt.getTime();
    return Math.max(Math.floor((expiresMs - now) / 1e3), 0);
}
const createInternalAdapter = (adapter, ctx)=>{
    const logger = ctx.logger;
    const options = ctx.options;
    const secondaryStorage = options.secondaryStorage;
    const verificationConsumeLocks = /* @__PURE__ */ new Map();
    const sessionExpiration = options.session?.expiresIn || 3600 * 24 * 7;
    const databaseSessionFallbackEnabled = !!secondaryStorage && options.session?.storeSessionInDatabase === true && options.session?.preserveSessionInDatabase !== true;
    const { createWithHooks, updateWithHooks, updateManyWithHooks, deleteWithHooks, deleteManyWithHooks, consumeOneWithHooks } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$with$2d$hooks$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getWithHooks"])(adapter, ctx);
    /**
	* Ends the live session rows matched by `where` without physically deleting
	* them.
	*
	* Used for `secondaryStorage` + `preserveSessionInDatabase`, where the row is
	* kept for audit. The session-delete hooks still run (so OAuth token
	* revocation and back-channel logout fire on session end), and the preserved
	* row's `expiresAt` is set to now so every liveness check that keys off the
	* session row (introspection, `/userinfo`) treats it as ended.
	*
	* Matching is restricted to still-live rows. The preserved row outlives the
	* session, so without this a later delete call (a repeated `deleteSession`,
	* or `deleteUserSessions` sweeping a user's accumulated preserved rows) would
	* re-match it and re-fire the hooks, re-dispatching back-channel logout.
	*/ const endPreservedSessions = (where)=>{
        const liveSessions = [
            ...where,
            {
                field: "expiresAt",
                value: /* @__PURE__ */ new Date(),
                operator: "gt"
            }
        ];
        return deleteManyWithHooks(liveSessions, "session", {
            fn: async ()=>{
                await (await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$transaction$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getCurrentAdapter"])(adapter)).updateMany({
                    model: "session",
                    where: liveSessions,
                    update: {
                        expiresAt: /* @__PURE__ */ new Date()
                    }
                });
            },
            executeMainFn: false
        });
    };
    async function refreshUserSessions(user) {
        if (!secondaryStorage) return;
        const listRaw = await secondaryStorage.get(`active-sessions-${user.id}`);
        if (!listRaw) return;
        const now = Date.now();
        const validSessions = ((0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$json$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["safeJSONParse"])(listRaw) || []).filter((s)=>s.expiresAt > now);
        await Promise.all(validSessions.map(async ({ token })=>{
            const cached = await secondaryStorage.get(token);
            if (!cached) return;
            const parsed = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$json$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["safeJSONParse"])(cached);
            if (!parsed) return;
            const sessionTTL = getTTLSeconds(parsed.session.expiresAt, now);
            await secondaryStorage.set(token, JSON.stringify({
                session: parsed.session,
                user
            }), Math.floor(sessionTTL));
        }));
    }
    async function getActiveSessionReferences(userId) {
        if (!secondaryStorage) return [];
        const activeSessions = await secondaryStorage.get(`active-sessions-${userId}`);
        return activeSessions ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$json$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["safeJSONParse"])(activeSessions) || [] : [];
    }
    async function deleteCachedUserSessions(userId, sessionReferences) {
        if (!secondaryStorage) return;
        const deletedTokens = new Set(sessionReferences.map((session)=>session.token));
        for (const { token } of sessionReferences)await secondaryStorage.delete(token);
        const activeSessionsKey = `active-sessions-${userId}`;
        const currentSessionReferences = await getActiveSessionReferences(userId);
        const now = Date.now();
        const remainingSessionReferences = currentSessionReferences.filter((session)=>session.expiresAt > now && !deletedTokens.has(session.token));
        remainingSessionReferences.sort((a, b)=>a.expiresAt - b.expiresAt);
        const furthestExpiration = remainingSessionReferences.at(-1)?.expiresAt;
        if (furthestExpiration) {
            await secondaryStorage.set(activeSessionsKey, JSON.stringify(remainingSessionReferences), getTTLSeconds(furthestExpiration, now));
            return;
        }
        await secondaryStorage.delete(activeSessionsKey);
    }
    async function queueCachedUserSessionDeletion(userId, sessionReferences) {
        if (!secondaryStorage) return;
        const references = sessionReferences ?? await getActiveSessionReferences(userId);
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$transaction$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["queueAfterTransactionHook"])(()=>deleteCachedUserSessions(userId, references), {
            onError (error) {
                logger.error("Failed to delete committed user sessions from secondary storage", error);
            }
        });
    }
    async function withVerificationConsumeLock(key, fn) {
        const previous = verificationConsumeLocks.get(key) ?? Promise.resolve();
        let release;
        const current = new Promise((resolve)=>{
            release = resolve;
        });
        const next = previous.catch(()=>{}).then(()=>current);
        verificationConsumeLocks.set(key, next);
        await previous.catch(()=>{});
        try {
            return await fn();
        } finally{
            release();
            if (verificationConsumeLocks.get(key) === next) verificationConsumeLocks.delete(key);
        }
    }
    return {
        createOAuthUser: async (user, account)=>{
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$transaction$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["runWithTransaction"])(adapter, async ()=>{
                const createdUser = await createWithHooks({
                    createdAt: /* @__PURE__ */ new Date(),
                    updatedAt: /* @__PURE__ */ new Date(),
                    ...user,
                    email: user.email?.toLowerCase()
                }, "user", void 0);
                if (!createdUser) throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"]("BAD_REQUEST", {
                    message: "Failed to create user"
                });
                return {
                    user: createdUser,
                    account: await createWithHooks({
                        ...account,
                        userId: createdUser.id,
                        createdAt: /* @__PURE__ */ new Date(),
                        updatedAt: /* @__PURE__ */ new Date()
                    }, "account", void 0)
                };
            });
        },
        createUser: async (user, source)=>{
            const data = {
                createdAt: /* @__PURE__ */ new Date(),
                updatedAt: /* @__PURE__ */ new Date(),
                ...user,
                email: user.email?.toLowerCase()
            };
            if (options.user?.validateUserInfo) {
                const validationSource = {
                    ...source,
                    action: "create-user"
                };
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$validate$2d$user$2d$info$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["assertValidUserInfoSource"])(validationSource);
                let endpointContext;
                try {
                    endpointContext = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$endpoint$2d$context$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getCurrentAuthEndpointContext"])();
                } catch (error) {
                    logger.error("Unable to run validateUserInfo: missing endpoint context", error);
                    throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"]("FORBIDDEN", {
                        code: "validation_context_missing",
                        message: "User validation requires an endpoint context"
                    });
                }
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$validate$2d$user$2d$info$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["assertValidUserInfo"])(endpointContext, {
                    user: data,
                    source: validationSource
                });
            }
            return await createWithHooks(data, "user", void 0);
        },
        createAccount: async (account)=>{
            return await createWithHooks({
                createdAt: /* @__PURE__ */ new Date(),
                updatedAt: /* @__PURE__ */ new Date(),
                ...account
            }, "account", void 0);
        },
        listSessions: async (userId, options)=>{
            if (databaseSessionFallbackEnabled) return (await (await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$transaction$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getCurrentAdapter"])(adapter)).findMany({
                model: "session",
                where: [
                    {
                        field: "userId",
                        value: userId
                    },
                    {
                        field: "expiresAt",
                        value: /* @__PURE__ */ new Date(),
                        operator: "gt"
                    }
                ]
            })).map((session)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$schema$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseSessionOutput"])(ctx.options, session));
            if (secondaryStorage) {
                const currentList = await secondaryStorage.get(`active-sessions-${userId}`);
                if (!currentList) return [];
                const list = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$json$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["safeJSONParse"])(currentList) || [];
                const now = Date.now();
                const seenTokens = /* @__PURE__ */ new Set();
                const sessions = [];
                for (const { token, expiresAt } of list){
                    if (expiresAt <= now || seenTokens.has(token)) continue;
                    seenTokens.add(token);
                    const data = await secondaryStorage.get(token);
                    if (!data) continue;
                    try {
                        const parsed = typeof data === "string" ? JSON.parse(data) : data;
                        if (!parsed?.session) continue;
                        sessions.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$schema$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseSessionOutput"])(ctx.options, {
                            ...parsed.session,
                            expiresAt: new Date(parsed.session.expiresAt)
                        }));
                    } catch  {
                        continue;
                    }
                }
                return sessions;
            }
            return await (await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$transaction$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getCurrentAdapter"])(adapter)).findMany({
                model: "session",
                where: [
                    {
                        field: "userId",
                        value: userId
                    },
                    ...options?.onlyActiveSessions ? [
                        {
                            field: "expiresAt",
                            value: /* @__PURE__ */ new Date(),
                            operator: "gt"
                        }
                    ] : []
                ]
            });
        },
        listUsers: async (limit, offset, sortBy, where)=>{
            return await (await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$transaction$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getCurrentAdapter"])(adapter)).findMany({
                model: "user",
                limit,
                offset,
                sortBy,
                where
            });
        },
        countTotalUsers: async (where)=>{
            const total = await (await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$transaction$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getCurrentAdapter"])(adapter)).count({
                model: "user",
                where
            });
            if (typeof total === "string") return parseInt(total);
            return total;
        },
        deleteUser: async (userId)=>{
            const sessionReferences = await getActiveSessionReferences(userId);
            if (!secondaryStorage || options.session?.storeSessionInDatabase) await deleteManyWithHooks([
                {
                    field: "userId",
                    value: userId
                }
            ], "session", void 0);
            await deleteManyWithHooks([
                {
                    field: "userId",
                    value: userId
                }
            ], "account", void 0);
            if (await deleteWithHooks([
                {
                    field: "id",
                    value: userId
                }
            ], "user", void 0) !== null) await queueCachedUserSessionDeletion(userId, sessionReferences);
        },
        createSession: async (userId, dontRememberMe, override, overrideAll, storageOptions)=>{
            const headers = await (async ()=>{
                const ctx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$endpoint$2d$context$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["tryGetCurrentAuthEndpointContext"])();
                return ctx?.headers || ctx?.request?.headers;
            })();
            const storeInDb = options.session?.storeSessionInDatabase;
            const deferMirror = storageOptions?.deferSecondaryStorageWrites === true && databaseSessionFallbackEnabled;
            const { id: _, ...rest } = override || {};
            let sessionId;
            if (secondaryStorage && !storeInDb) {
                const generatedId = ctx.generateId({
                    model: "session"
                });
                sessionId = generatedId !== false ? generatedId : (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$id$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateId"])();
            }
            const defaultAdditionalFields = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$schema$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getSessionDefaultFields"])(options);
            const data = {
                ...sessionId ? {
                    id: sessionId
                } : {},
                ipAddress: headers ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$ip$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getIP"])(headers, options) || "" : "",
                userAgent: headers?.get("user-agent") || "",
                ...rest,
                /**
				* If the user doesn't want to be remembered
				* set the session to expire in 1 day.
				* The cookie will be set to expire at the end of the session
				*/ expiresAt: dontRememberMe ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$date$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getDate"])(3600 * 24, "sec") : (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$date$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getDate"])(sessionExpiration, "sec"),
                userId,
                token: (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$id$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateId"])(32),
                createdAt: /* @__PURE__ */ new Date(),
                updatedAt: /* @__PURE__ */ new Date(),
                ...defaultAdditionalFields,
                ...overrideAll ? rest : {}
            };
            const mirrorSessionToSecondaryStorage = async (sessionData)=>{
                if (!secondaryStorage) return sessionData;
                const currentList = await secondaryStorage.get(`active-sessions-${userId}`);
                let list = [];
                const now = Date.now();
                if (currentList) {
                    list = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$json$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["safeJSONParse"])(currentList) || [];
                    list = list.filter((session)=>session.expiresAt > now && session.token !== data.token);
                }
                const sorted = [
                    ...list,
                    {
                        token: data.token,
                        expiresAt: data.expiresAt.getTime()
                    }
                ].sort((a, b)=>a.expiresAt - b.expiresAt);
                const furthestSessionTTL = getTTLSeconds(sorted.at(-1)?.expiresAt ?? data.expiresAt.getTime(), now);
                if (furthestSessionTTL > 0) await secondaryStorage.set(`active-sessions-${userId}`, JSON.stringify(sorted), furthestSessionTTL);
                const user = await (await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$transaction$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getCurrentAdapter"])(adapter)).findOne({
                    model: "user",
                    where: [
                        {
                            field: "id",
                            value: userId
                        }
                    ]
                });
                const sessionTTL = getTTLSeconds(data.expiresAt, now);
                if (sessionTTL > 0) await secondaryStorage.set(data.token, JSON.stringify({
                    session: sessionData,
                    user
                }), sessionTTL);
                return sessionData;
            };
            return await createWithHooks(data, "session", secondaryStorage ? {
                fn: async (sessionData)=>{
                    if (!deferMirror) return mirrorSessionToSecondaryStorage(sessionData);
                    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$transaction$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["queueAfterTransactionHook"])(async ()=>{
                        await mirrorSessionToSecondaryStorage(sessionData);
                    }, {
                        onError (error) {
                            logger.error("Failed to mirror committed session to secondary storage", error);
                        }
                    });
                    return sessionData;
                },
                executeMainFn: storeInDb
            } : void 0);
        },
        findSession: async (token)=>{
            if (secondaryStorage) {
                const sessionStringified = await secondaryStorage.get(token);
                if (!sessionStringified && (!options.session?.storeSessionInDatabase || ctx.options.session?.preserveSessionInDatabase)) return null;
                if (sessionStringified) {
                    const s = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$json$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["safeJSONParse"])(sessionStringified);
                    if (!s) return null;
                    return {
                        session: (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$schema$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseSessionOutput"])(ctx.options, {
                            ...s.session,
                            expiresAt: new Date(s.session.expiresAt),
                            createdAt: new Date(s.session.createdAt),
                            updatedAt: new Date(s.session.updatedAt)
                        }),
                        user: (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$schema$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseUserOutput"])(ctx.options, {
                            ...s.user,
                            createdAt: new Date(s.user.createdAt),
                            updatedAt: new Date(s.user.updatedAt)
                        })
                    };
                }
            }
            const result = await (await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$transaction$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getCurrentAdapter"])(adapter)).findOne({
                model: "session",
                where: [
                    {
                        value: token,
                        field: "token"
                    }
                ],
                join: {
                    user: true
                }
            });
            if (!result) return null;
            const { user, ...session } = result;
            if (!user) return null;
            return {
                session: (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$schema$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseSessionOutput"])(ctx.options, session),
                user: (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$schema$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseUserOutput"])(ctx.options, user)
            };
        },
        findSessions: async (sessionTokens, options)=>{
            const uniqueTokens = [
                ...new Set(sessionTokens)
            ];
            const sessionsByToken = /* @__PURE__ */ new Map();
            const missingTokens = [];
            if (secondaryStorage) for (const sessionToken of uniqueTokens){
                const sessionStringified = await secondaryStorage.get(sessionToken);
                if (sessionStringified) try {
                    const s = typeof sessionStringified === "string" ? JSON.parse(sessionStringified) : sessionStringified;
                    if (!s) continue;
                    const expiresAt = new Date(s.session.expiresAt);
                    if (options?.onlyActiveSessions && expiresAt <= /* @__PURE__ */ new Date()) continue;
                    const session = {
                        session: {
                            ...s.session,
                            expiresAt: new Date(s.session.expiresAt)
                        },
                        user: {
                            ...s.user,
                            createdAt: new Date(s.user.createdAt),
                            updatedAt: new Date(s.user.updatedAt)
                        }
                    };
                    sessionsByToken.set(sessionToken, session);
                } catch  {
                    continue;
                }
                else missingTokens.push(sessionToken);
            }
            const databaseTokens = secondaryStorage ? missingTokens : uniqueTokens;
            if (databaseTokens.length > 0 && (!secondaryStorage || databaseSessionFallbackEnabled)) {
                const databaseSessions = await (await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$transaction$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getCurrentAdapter"])(adapter)).findMany({
                    model: "session",
                    limit: databaseTokens.length,
                    where: [
                        {
                            field: "token",
                            value: databaseTokens,
                            operator: "in"
                        },
                        ...options?.onlyActiveSessions ? [
                            {
                                field: "expiresAt",
                                value: /* @__PURE__ */ new Date(),
                                operator: "gt"
                            }
                        ] : []
                    ],
                    join: {
                        user: true
                    }
                });
                for (const { user, ...session } of databaseSessions)if (user) sessionsByToken.set(session.token, {
                    session,
                    user
                });
            }
            return uniqueTokens.flatMap((token)=>{
                const session = sessionsByToken.get(token);
                return session ? [
                    session
                ] : [];
            });
        },
        updateSession: async (sessionToken, session)=>{
            return await updateWithHooks(session, [
                {
                    field: "token",
                    value: sessionToken
                }
            ], "session", secondaryStorage ? {
                async fn (data) {
                    const currentSession = await secondaryStorage.get(sessionToken);
                    if (!currentSession) return null;
                    const parsedSession = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$json$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["safeJSONParse"])(currentSession);
                    if (!parsedSession) return null;
                    const mergedSession = {
                        ...parsedSession.session,
                        ...data,
                        expiresAt: new Date(data.expiresAt ?? parsedSession.session.expiresAt),
                        createdAt: new Date(parsedSession.session.createdAt),
                        updatedAt: new Date(data.updatedAt ?? parsedSession.session.updatedAt)
                    };
                    const updatedSession = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$schema$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseSessionOutput"])(ctx.options, mergedSession);
                    const now = Date.now();
                    const expiresMs = new Date(updatedSession.expiresAt).getTime();
                    const sessionTTL = getTTLSeconds(expiresMs, now);
                    if (sessionTTL > 0) {
                        await secondaryStorage.set(sessionToken, JSON.stringify({
                            session: updatedSession,
                            user: parsedSession.user
                        }), sessionTTL);
                        const listKey = `active-sessions-${updatedSession.userId}`;
                        const listRaw = await secondaryStorage.get(listKey);
                        const sorted = (listRaw ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$json$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["safeJSONParse"])(listRaw) || [] : []).filter((s)=>s.token !== sessionToken && s.expiresAt > now).concat([
                            {
                                token: sessionToken,
                                expiresAt: expiresMs
                            }
                        ]).sort((a, b)=>a.expiresAt - b.expiresAt);
                        const furthestSessionExp = sorted.at(-1)?.expiresAt;
                        if (furthestSessionExp && furthestSessionExp > now) await secondaryStorage.set(listKey, JSON.stringify(sorted), getTTLSeconds(furthestSessionExp, now));
                        else await secondaryStorage.delete(listKey);
                    }
                    return updatedSession;
                },
                executeMainFn: options.session?.storeSessionInDatabase
            } : void 0);
        },
        deleteSession: async (token)=>{
            if (secondaryStorage) {
                const data = await secondaryStorage.get(token);
                if (data) {
                    const { session } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$json$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["safeJSONParse"])(data) ?? {};
                    if (!session) {
                        logger.error("Session not found in secondary storage");
                        return;
                    }
                    const userId = session.userId;
                    const currentList = await secondaryStorage.get(`active-sessions-${userId}`);
                    if (currentList) {
                        const list = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$json$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["safeJSONParse"])(currentList) || [];
                        const now = Date.now();
                        const filtered = list.filter((session)=>session.expiresAt > now && session.token !== token);
                        const furthestSessionExp = filtered.sort((a, b)=>a.expiresAt - b.expiresAt).at(-1)?.expiresAt;
                        if (filtered.length > 0 && furthestSessionExp && furthestSessionExp > Date.now()) await secondaryStorage.set(`active-sessions-${userId}`, JSON.stringify(filtered), getTTLSeconds(furthestSessionExp, now));
                        else await secondaryStorage.delete(`active-sessions-${userId}`);
                    } else logger.error("Active sessions list not found in secondary storage");
                }
                await secondaryStorage.delete(token);
                if (!options.session?.storeSessionInDatabase) return;
                if (ctx.options.session?.preserveSessionInDatabase) {
                    await endPreservedSessions([
                        {
                            field: "token",
                            value: token
                        }
                    ]);
                    return;
                }
            }
            await deleteWithHooks([
                {
                    field: "token",
                    value: token
                }
            ], "session", void 0);
        },
        deleteAccounts: async (userId)=>{
            await deleteManyWithHooks([
                {
                    field: "userId",
                    value: userId
                }
            ], "account", void 0);
        },
        /**
		* Delete an account by its primary key.
		*
		* @param id - The account row's primary key, not its accountId.
		*/ deleteAccount: async (id)=>{
            await deleteWithHooks([
                {
                    field: "id",
                    value: id
                }
            ], "account", void 0);
        },
        deleteUserSessions: async (userId)=>{
            const sessionReferences = await getActiveSessionReferences(userId);
            if (secondaryStorage) {
                if (!options.session?.storeSessionInDatabase) {
                    await queueCachedUserSessionDeletion(userId, sessionReferences);
                    return;
                }
                if (ctx.options.session?.preserveSessionInDatabase) {
                    if (await endPreservedSessions([
                        {
                            field: "userId",
                            value: userId
                        }
                    ]) !== null) await queueCachedUserSessionDeletion(userId, sessionReferences);
                    return;
                }
            }
            if (await deleteManyWithHooks([
                {
                    field: "userId",
                    value: userId
                }
            ], "session", void 0) !== null) await queueCachedUserSessionDeletion(userId, sessionReferences);
        },
        deleteSessions: async (sessionTokens)=>{
            if (secondaryStorage) {
                await Promise.all(sessionTokens.map((token)=>secondaryStorage.delete(token)));
                if (!options.session?.storeSessionInDatabase) return;
                if (ctx.options.session?.preserveSessionInDatabase) {
                    await endPreservedSessions([
                        {
                            field: "token",
                            value: sessionTokens,
                            operator: "in"
                        }
                    ]);
                    return;
                }
            }
            await deleteManyWithHooks([
                {
                    field: "token",
                    value: sessionTokens,
                    operator: "in"
                }
            ], "session", void 0);
        },
        findAccountOwnerByKey: async ({ providerId, accountId })=>{
            const accountsWithUsers = await (await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$transaction$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getCurrentAdapter"])(adapter)).findMany({
                model: "account",
                where: [
                    {
                        field: "providerId",
                        value: providerId
                    },
                    {
                        field: "accountId",
                        value: accountId
                    }
                ],
                limit: 2,
                join: {
                    user: true
                }
            });
            if (accountsWithUsers.length > 1) throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["BetterAuthError"](`Multiple accounts match the same accountId for provider ${JSON.stringify(providerId)}. Resolve duplicate account identities before continuing.`);
            const accountWithUser = accountsWithUsers[0];
            if (!accountWithUser) return null;
            const { user, ...account } = accountWithUser;
            return user ? {
                kind: "owned",
                user,
                account
            } : {
                kind: "orphaned",
                account
            };
        },
        findUserByEmail: async (email, options)=>{
            const result = await (await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$transaction$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getCurrentAdapter"])(adapter)).findOne({
                model: "user",
                where: [
                    {
                        value: email.toLowerCase(),
                        field: "email"
                    }
                ],
                join: {
                    ...options?.includeAccounts ? {
                        account: true
                    } : {}
                }
            });
            if (!result) return null;
            const { account: accounts, ...user } = result;
            return {
                user,
                accounts: accounts ?? []
            };
        },
        findUserById: async (userId)=>{
            if (!userId) return null;
            return await (await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$transaction$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getCurrentAdapter"])(adapter)).findOne({
                model: "user",
                where: [
                    {
                        field: "id",
                        value: userId
                    }
                ]
            });
        },
        linkAccount: async (account)=>{
            return await createWithHooks({
                createdAt: /* @__PURE__ */ new Date(),
                updatedAt: /* @__PURE__ */ new Date(),
                ...account
            }, "account", void 0);
        },
        updateUser: async (userId, data)=>{
            const user = await updateWithHooks({
                ...data,
                ...data.email ? {
                    email: data.email.toLowerCase()
                } : {}
            }, [
                {
                    field: "id",
                    value: userId
                }
            ], "user", void 0);
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$transaction$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["queueAfterTransactionHook"])(()=>refreshUserSessions(user), {
                onError (error) {
                    logger.error("Failed to refresh committed user sessions in secondary storage", error);
                }
            });
            return user;
        },
        updateUserByEmail: async (email, data)=>{
            const user = await updateWithHooks({
                ...data,
                ...data.email ? {
                    email: data.email.toLowerCase()
                } : {}
            }, [
                {
                    field: "email",
                    value: email.toLowerCase()
                }
            ], "user", void 0);
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$transaction$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["queueAfterTransactionHook"])(()=>refreshUserSessions(user), {
                onError (error) {
                    logger.error("Failed to refresh committed user sessions in secondary storage", error);
                }
            });
            return user;
        },
        updatePassword: async (userId, password)=>{
            await updateManyWithHooks({
                password
            }, [
                {
                    field: "userId",
                    value: userId
                },
                {
                    field: "providerId",
                    value: "credential"
                },
                {
                    field: "accountId",
                    value: userId
                }
            ], "account", void 0);
        },
        findAccounts: async (userId)=>{
            return await (await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$transaction$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getCurrentAdapter"])(adapter)).findMany({
                model: "account",
                where: [
                    {
                        field: "userId",
                        value: userId
                    }
                ]
            });
        },
        findCredentialAccount: async (userId)=>{
            return (await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$transaction$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getCurrentAdapter"])(adapter)).findOne({
                model: "account",
                where: [
                    {
                        field: "userId",
                        value: userId
                    },
                    {
                        field: "providerId",
                        value: "credential"
                    },
                    {
                        field: "accountId",
                        value: userId
                    }
                ]
            });
        },
        findAccountByKey: async ({ providerId, accountId })=>{
            const accounts = await (await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$transaction$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getCurrentAdapter"])(adapter)).findMany({
                model: "account",
                limit: 2,
                where: [
                    {
                        field: "providerId",
                        value: providerId
                    },
                    {
                        field: "accountId",
                        value: accountId
                    }
                ]
            });
            if (accounts.length > 1) throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["BetterAuthError"](`Multiple accounts match the same accountId for provider ${JSON.stringify(providerId)}. Resolve duplicate account identities before continuing.`);
            return accounts[0] ?? null;
        },
        findAccountByUserId: async (userId)=>{
            return await (await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$transaction$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getCurrentAdapter"])(adapter)).findMany({
                model: "account",
                where: [
                    {
                        field: "userId",
                        value: userId
                    }
                ]
            });
        },
        updateAccount: async (id, data)=>{
            return await updateWithHooks(data, [
                {
                    field: "id",
                    value: id
                }
            ], "account", void 0);
        },
        createVerificationValue: async (data)=>{
            const storageOption = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$verification$2d$token$2d$storage$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStorageOption"])(data.identifier, options.verification?.storeIdentifier);
            const storedIdentifier = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$verification$2d$token$2d$storage$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["processIdentifier"])(data.identifier, storageOption);
            return await createWithHooks({
                createdAt: /* @__PURE__ */ new Date(),
                updatedAt: /* @__PURE__ */ new Date(),
                ...data,
                identifier: storedIdentifier
            }, "verification", secondaryStorage ? {
                async fn (verificationData) {
                    const ttl = getTTLSeconds(verificationData.expiresAt);
                    if (ttl > 0) await secondaryStorage.set(`verification:${storedIdentifier}`, JSON.stringify(verificationData), ttl);
                    return verificationData;
                },
                executeMainFn: options.verification?.storeInDatabase
            } : void 0);
        },
        findVerificationValue: async (identifier)=>{
            const storageOption = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$verification$2d$token$2d$storage$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStorageOption"])(identifier, options.verification?.storeIdentifier);
            const storedIdentifier = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$verification$2d$token$2d$storage$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["processIdentifier"])(identifier, storageOption);
            if (secondaryStorage) {
                const cached = await secondaryStorage.get(`verification:${storedIdentifier}`);
                if (cached) {
                    const parsed = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$json$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["safeJSONParse"])(cached);
                    if (parsed) return parsed;
                }
                if (storageOption && storageOption !== "plain") {
                    const plainCached = await secondaryStorage.get(`verification:${identifier}`);
                    if (plainCached) {
                        const parsed = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$json$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["safeJSONParse"])(plainCached);
                        if (parsed) return parsed;
                    }
                }
                if (!options.verification?.storeInDatabase) return null;
            }
            const currentAdapter = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$transaction$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getCurrentAdapter"])(adapter);
            async function findByIdentifier(id) {
                return currentAdapter.findMany({
                    model: "verification",
                    where: [
                        {
                            field: "identifier",
                            value: id
                        }
                    ],
                    sortBy: {
                        field: "createdAt",
                        direction: "desc"
                    },
                    limit: 1
                });
            }
            let verification = await findByIdentifier(storedIdentifier);
            if (!verification.length && storageOption && storageOption !== "plain") verification = await findByIdentifier(identifier);
            if (!options.verification?.disableCleanup) await deleteManyWithHooks([
                {
                    field: "expiresAt",
                    value: /* @__PURE__ */ new Date(),
                    operator: "lt"
                }
            ], "verification", void 0);
            return verification[0] || null;
        },
        deleteVerificationByIdentifier: async (identifier)=>{
            const storedIdentifier = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$verification$2d$token$2d$storage$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["processIdentifier"])(identifier, (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$verification$2d$token$2d$storage$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStorageOption"])(identifier, options.verification?.storeIdentifier));
            if (secondaryStorage) await secondaryStorage.delete(`verification:${storedIdentifier}`);
            if (!secondaryStorage || options.verification?.storeInDatabase) await deleteWithHooks([
                {
                    field: "identifier",
                    value: storedIdentifier
                }
            ], "verification", void 0);
        },
        /**
		* Atomically consume a single-use verification row by `identifier` and
		* return it. The first concurrent caller receives the latest row for the
		* identifier; every other caller racing against it receives `null`.
		*
		* Race-safe replacement for the `findVerificationValue` then
		* `deleteVerificationByIdentifier` pair. Callers MUST gate any state
		* change (issue session, mint token, change password) on a non-null
		* return value, because consuming one row invalidates the whole
		* identifier and stale rows cannot be replayed.
		*
		* Rows past their `expiresAt` are treated as already invalid: the row
		* is still deleted (so it cannot be replayed later) but `null` is
		* returned. Callers do not need their own `expiresAt` gate.
		*
		* The secondary-storage-only path (`storeInDatabase: false`) consumes
		* through `getAndDelete`, which is required on `SecondaryStorage` so
		* single-use values are not read and deleted as separate operations.
		*/ consumeVerificationValue: async (identifier)=>{
            const storageOption = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$verification$2d$token$2d$storage$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStorageOption"])(identifier, options.verification?.storeIdentifier);
            const storedIdentifier = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$verification$2d$token$2d$storage$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["processIdentifier"])(identifier, storageOption);
            const identifiersToTry = storageOption && storageOption !== "plain" ? [
                storedIdentifier,
                identifier
            ] : [
                storedIdentifier
            ];
            const hydrateCachedVerification = (raw)=>{
                if (!raw) return null;
                const candidate = typeof raw === "string" ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$json$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["safeJSONParse"])(raw) : typeof raw === "object" ? raw : null;
                if (!candidate) return null;
                const expiresAt = new Date(candidate.expiresAt);
                if (!Number.isFinite(expiresAt.getTime())) return null;
                return {
                    ...candidate,
                    expiresAt
                };
            };
            let consumed = null;
            if (secondaryStorage && !options.verification?.storeInDatabase) {
                const consumeCacheKey = async (key)=>{
                    return hydrateCachedVerification(await secondaryStorage.getAndDelete(key));
                };
                for (const stored of identifiersToTry){
                    const cached = await consumeCacheKey(`verification:${stored}`);
                    if (!cached) continue;
                    await Promise.all(identifiersToTry.filter((candidate)=>candidate !== stored).map((candidate)=>secondaryStorage.delete(`verification:${candidate}`)));
                    consumed = cached;
                    break;
                }
            } else {
                const consumeByIdentifier = async (id)=>withVerificationConsumeLock(`verification:${id}`, ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$transaction$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["runWithTransaction"])(adapter, async ()=>{
                            const txAdapter = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$transaction$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getCurrentAdapter"])(adapter);
                            const where = [
                                {
                                    field: "identifier",
                                    value: id
                                }
                            ];
                            const latest = (await txAdapter.findMany({
                                model: "verification",
                                where,
                                sortBy: {
                                    field: "createdAt",
                                    direction: "desc"
                                },
                                limit: 1
                            }))[0] ?? null;
                            if (!latest) return null;
                            return consumeOneWithHooks("verification", [
                                {
                                    field: "id",
                                    value: latest.id
                                }
                            ], async ()=>{
                                const row = await txAdapter.consumeOne({
                                    model: "verification",
                                    where: [
                                        {
                                            field: "id",
                                            value: latest.id
                                        }
                                    ]
                                });
                                if (!row) return null;
                                await txAdapter.deleteMany({
                                    model: "verification",
                                    where
                                });
                                return row;
                            }, latest);
                        }));
                for (const stored of identifiersToTry){
                    consumed = await consumeByIdentifier(stored);
                    if (consumed) break;
                }
                if (consumed && secondaryStorage) await Promise.all(identifiersToTry.map((stored)=>secondaryStorage.delete(`verification:${stored}`)));
            }
            if (!consumed || consumed.expiresAt < /* @__PURE__ */ new Date()) return null;
            return consumed;
        },
        /**
		* First-writer-wins create keyed by a deterministic primary key derived
		* from `identifier`. Returns `true` when this caller created the row and
		* `false` when a row for the same identifier already existed.
		*
		* The dual of `consumeVerificationValue`: where consume races to delete a
		* marker exactly once, reserve races to create a marker exactly once. Use
		* it for replay tombstones (a SAML assertion id, a JWT `jti`) where the
		* first caller wins and every later caller must observe that the marker is
		* already taken.
		*
		* The `verification.identifier` column is non-unique, so uniqueness comes
		* from a deterministic primary key (`SHA-256` of `reserve:<identifier>`,
		* encoded by `encodeDeterministicId` so the configured id strategy keeps
		* it; see its note on `generateId: "serial"`).
		* The database path is atomic: the primary key turns the INSERT into the
		* first-writer-wins gate, and a duplicate is detected portably by
		* re-reading the row rather than matching adapter-specific errors.
		* Secondary-storage-only verification cannot enforce the deterministic
		* primary-key gate, so this operation fails closed unless verification is
		* backed by the database.
		*
		* The atomic guarantee requires the configured adapter to reject a
		* duplicate primary key on insert, which every real database enforces. The
		* in-memory adapter does not enforce primary-key uniqueness, so reservation
		* is best-effort there (it is intended for development and tests).
		*/ reserveVerificationValue: async (data)=>{
            const reservationId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$db$2f$adapter$2f$get$2d$id$2d$field$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["encodeDeterministicId"])(new Uint8Array(await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$hash$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createHash"])("SHA-256").digest(new TextEncoder().encode("reserve:" + data.identifier))), options);
            const storageOption = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$verification$2d$token$2d$storage$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStorageOption"])(data.identifier, options.verification?.storeIdentifier);
            const storedIdentifier = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$verification$2d$token$2d$storage$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["processIdentifier"])(data.identifier, storageOption);
            if (secondaryStorage && !options.verification?.storeInDatabase) throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["BetterAuthError"]("reserveVerificationValue requires database-backed verification storage. Set verification.storeInDatabase to true for flows that reserve verification values.");
            try {
                await adapter.create({
                    model: "verification",
                    data: {
                        id: reservationId,
                        identifier: storedIdentifier,
                        value: data.value,
                        expiresAt: data.expiresAt,
                        createdAt: /* @__PURE__ */ new Date(),
                        updatedAt: /* @__PURE__ */ new Date()
                    },
                    forceAllowId: true
                });
            } catch (error) {
                if (await adapter.findOne({
                    model: "verification",
                    where: [
                        {
                            field: "id",
                            value: reservationId
                        }
                    ]
                })) return false;
                throw error;
            }
            if (secondaryStorage) {
                const ttl = getTTLSeconds(data.expiresAt);
                if (ttl > 0) await secondaryStorage.set(`verification:${storedIdentifier}`, JSON.stringify({
                    id: reservationId,
                    identifier: storedIdentifier,
                    value: data.value,
                    expiresAt: data.expiresAt
                }), ttl);
            }
            return true;
        },
        updateVerificationByIdentifier: async (identifier, data)=>{
            const storedIdentifier = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$verification$2d$token$2d$storage$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["processIdentifier"])(identifier, (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$verification$2d$token$2d$storage$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStorageOption"])(identifier, options.verification?.storeIdentifier));
            if (secondaryStorage) {
                const cached = await secondaryStorage.get(`verification:${storedIdentifier}`);
                if (cached) {
                    const parsed = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$json$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["safeJSONParse"])(cached);
                    if (parsed) {
                        const updated = {
                            ...parsed,
                            ...data
                        };
                        const expiresAt = updated.expiresAt ?? parsed.expiresAt;
                        const ttl = getTTLSeconds(expiresAt instanceof Date ? expiresAt : new Date(expiresAt));
                        if (ttl > 0) await secondaryStorage.set(`verification:${storedIdentifier}`, JSON.stringify(updated), ttl);
                        if (!options.verification?.storeInDatabase) return updated;
                    }
                }
            }
            if (!secondaryStorage || options.verification?.storeInDatabase) return await updateWithHooks(data, [
                {
                    field: "identifier",
                    value: storedIdentifier
                }
            ], "verification", void 0);
            return data;
        },
        refreshUserSessions
    };
};
;
}),
"[project]/examples/nextjs/node_modules/better-auth/dist/db/schema.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "buildSyntheticUserOutput",
    ()=>buildSyntheticUserOutput,
    "getSessionDefaultFields",
    ()=>getSessionDefaultFields,
    "mergeSchema",
    ()=>mergeSchema,
    "parseAccountInput",
    ()=>parseAccountInput,
    "parseAccountOutput",
    ()=>parseAccountOutput,
    "parseAdditionalUserInput",
    ()=>parseAdditionalUserInput,
    "parseAdditionalUserInputFromProviderProfile",
    ()=>parseAdditionalUserInputFromProviderProfile,
    "parseInputData",
    ()=>parseInputData,
    "parseSessionInput",
    ()=>parseSessionInput,
    "parseSessionOutput",
    ()=>parseSessionOutput,
    "parseUserInput",
    ()=>parseUserInput,
    "parseUserOutput",
    ()=>parseUserOutput
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$db$2f$get$2d$tables$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/db/get-tables.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/error/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/error/codes.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$db$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/utils/db.mjs [app-route] (ecmascript)");
;
;
;
//#region src/db/schema.ts
const cache = /* @__PURE__ */ new WeakMap();
function getFields(options, modelName, mode) {
    const cacheKey = `${modelName}:${mode}`;
    if (!cache.has(options)) cache.set(options, /* @__PURE__ */ new Map());
    const tableCache = cache.get(options);
    if (tableCache.has(cacheKey)) return tableCache.get(cacheKey);
    const coreSchema = mode === "output" ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$db$2f$get$2d$tables$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getAuthTables"])(options)[modelName]?.fields ?? {} : {};
    const additionalFields = modelName === "user" || modelName === "session" || modelName === "account" ? options[modelName]?.additionalFields : void 0;
    let schema = {
        ...coreSchema,
        ...additionalFields ?? {}
    };
    for (const plugin of options.plugins || [])if (plugin.schema && plugin.schema[modelName]) schema = {
        ...schema,
        ...plugin.schema[modelName].fields
    };
    tableCache.set(cacheKey, schema);
    return schema;
}
function parseUserOutput(options, user) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$db$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["filterOutputFields"])(user, getFields(options, "user", "output"));
}
/**
* Builds a synthetic user object that matches the shape of a real user
* returned from the database. This ensures enumeration protection works
* correctly by making synthetic and real user responses indistinguishable.
*
* The function iterates over the user output schema and:
* - Includes all fields that should be returned (returned !== false)
* - Uses provided values when available
* - Sets optional fields to null when no value is provided
* - Applies default values where defined
* - Always includes the 'id' field (not part of schema but always present)
*/ function buildSyntheticUserOutput(options, data) {
    const schema = getFields(options, "user", "output");
    const result = {};
    for(const key in schema){
        const fieldAttr = schema[key];
        if (fieldAttr.returned === false) continue;
        if (key in data && data[key] !== void 0) result[key] = data[key];
        else if (fieldAttr.defaultValue !== void 0) result[key] = typeof fieldAttr.defaultValue === "function" ? fieldAttr.defaultValue() : fieldAttr.defaultValue;
        else if (!fieldAttr.required) result[key] = null;
    }
    if ("id" in data) result.id = data.id;
    return result;
}
function parseSessionOutput(options, session) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$db$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["filterOutputFields"])(session, getFields(options, "session", "output"));
}
function parseAccountOutput(options, account) {
    const { accessToken: _accessToken, refreshToken: _refreshToken, idToken: _idToken, accessTokenExpiresAt: _accessTokenExpiresAt, refreshTokenExpiresAt: _refreshTokenExpiresAt, password: _password, ...rest } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$db$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["filterOutputFields"])(account, getFields(options, "account", "output"));
    return rest;
}
function parseInputData(data, schema) {
    const action = schema.action || "create";
    const fields = schema.fields;
    const parsedData = Object.create(null);
    for(const key in fields){
        if (key in data) {
            if (fields[key].input === false) {
                if (fields[key].defaultValue !== void 0) {
                    if (action !== "update") {
                        parsedData[key] = fields[key].defaultValue;
                        continue;
                    }
                }
                if (data[key]) throw __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"].from("BAD_REQUEST", {
                    ...__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BASE_ERROR_CODES"].FIELD_NOT_ALLOWED,
                    message: `${key} is not allowed to be set`
                });
                continue;
            }
            if (fields[key].validator?.input && data[key] !== void 0) {
                const result = fields[key].validator.input["~standard"].validate(data[key]);
                if (result instanceof Promise) throw __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"].from("INTERNAL_SERVER_ERROR", __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BASE_ERROR_CODES"].ASYNC_VALIDATION_NOT_SUPPORTED);
                if ("issues" in result && result.issues) throw __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"].from("BAD_REQUEST", {
                    ...__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BASE_ERROR_CODES"].VALIDATION_ERROR,
                    message: result.issues[0]?.message || "Validation Error"
                });
                parsedData[key] = result.value;
                continue;
            }
            if (fields[key].transform?.input && data[key] !== void 0) {
                parsedData[key] = fields[key].transform?.input(data[key]);
                continue;
            }
            parsedData[key] = data[key];
            continue;
        }
        if (fields[key].defaultValue !== void 0 && action === "create") {
            if (typeof fields[key].defaultValue === "function") {
                parsedData[key] = fields[key].defaultValue();
                continue;
            }
            parsedData[key] = fields[key].defaultValue;
            continue;
        }
        if (fields[key].required && action === "create") throw __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"].from("BAD_REQUEST", {
            ...__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BASE_ERROR_CODES"].MISSING_FIELD,
            message: `${key} is required`
        });
    }
    return parsedData;
}
function parseUserInput(options, user = {}, action) {
    return parseInputData(user, {
        fields: getFields(options, "user", "input"),
        action
    });
}
function parseAdditionalUserInputFromProviderProfile(options, profile = {}, action) {
    const schema = getFields(options, "user", "input");
    const allowedProfileFields = Object.create(null);
    for (const key of Object.keys(profile)){
        if (schema[key]?.input === false) continue;
        allowedProfileFields[key] = profile[key];
    }
    return parseInputData(allowedProfileFields, {
        fields: schema,
        action
    });
}
function parseAdditionalUserInput(options, user) {
    const schema = getFields(options, "user", "input");
    return parseInputData(user || {}, {
        fields: schema
    });
}
function parseAccountInput(options, account) {
    return parseInputData(account, {
        fields: getFields(options, "account", "input")
    });
}
function parseSessionInput(options, session, action) {
    return parseInputData(session, {
        fields: getFields(options, "session", "input"),
        action
    });
}
function getSessionDefaultFields(options) {
    const fields = getFields(options, "session", "input");
    const defaults = {};
    for(const key in fields)if (fields[key].defaultValue !== void 0) defaults[key] = typeof fields[key].defaultValue === "function" ? fields[key].defaultValue() : fields[key].defaultValue;
    return defaults;
}
function mergeSchema(schema, newSchema) {
    if (!newSchema) return schema;
    for(const table in newSchema){
        const newModelName = newSchema[table]?.modelName;
        if (newModelName) schema[table].modelName = newModelName;
        for(const field in schema[table].fields){
            const newField = newSchema[table]?.fields?.[field];
            if (!newField) continue;
            schema[table].fields[field].fieldName = newField;
        }
    }
    return schema;
}
;
}),
"[project]/examples/nextjs/node_modules/better-auth/dist/db/verification-token-storage.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getStorageOption",
    ()=>getStorageOption,
    "processIdentifier",
    ()=>processIdentifier
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$base64$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/utils/dist/base64.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$hash$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/utils/dist/hash.mjs [app-route] (ecmascript)");
;
;
//#region src/db/verification-token-storage.ts
const defaultKeyHasher = async (identifier)=>{
    const hash = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$hash$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createHash"])("SHA-256").digest(new TextEncoder().encode(identifier));
    return __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$utils$2f$dist$2f$base64$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["base64Url"].encode(new Uint8Array(hash), {
        padding: false
    });
};
async function processIdentifier(identifier, option) {
    if (!option || option === "plain") return identifier;
    if (option === "hashed") return defaultKeyHasher(identifier);
    if (typeof option === "object" && "hash" in option) return option.hash(identifier);
    return identifier;
}
function getStorageOption(identifier, config) {
    if (!config) return;
    if (typeof config === "object" && "default" in config) {
        if (config.overrides) {
            for (const [prefix, option] of Object.entries(config.overrides))if (identifier.startsWith(prefix)) return option;
        }
        return config.default;
    }
    return config;
}
;
}),
"[project]/examples/nextjs/node_modules/better-auth/dist/db/with-hooks.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getWithHooks",
    ()=>getWithHooks
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$transaction$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/context/transaction.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$endpoint$2d$context$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/context/endpoint-context.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$instrumentation$2f$attributes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/instrumentation/attributes.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$instrumentation$2f$tracer$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/instrumentation/tracer.mjs [app-route] (ecmascript)");
;
;
//#region src/db/with-hooks.ts
function getWithHooks(adapter, ctx) {
    const withSpan = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$instrumentation$2f$tracer$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createWithSpan"])(ctx.options);
    const hooksEntries = ctx.hooks;
    async function createWithHooks(data, model, customCreateFn) {
        const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$endpoint$2d$context$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["tryGetCurrentAuthEndpointContext"])();
        let actualData = data;
        for (const { source, hooks } of hooksEntries){
            const toRun = hooks[model]?.create?.before;
            if (toRun) {
                const result = await withSpan(`db create.before ${model}`, {
                    [__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$instrumentation$2f$attributes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ATTR_HOOK_TYPE"]]: "create.before",
                    [__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$instrumentation$2f$attributes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ATTR_DB_COLLECTION_NAME"]]: model,
                    [__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$instrumentation$2f$attributes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ATTR_CONTEXT"]]: source
                }, ()=>toRun(actualData, context));
                if (result === false) return null;
                if (typeof result === "object" && "data" in result) actualData = {
                    ...actualData,
                    ...result.data
                };
            }
        }
        let created = null;
        if (!customCreateFn || customCreateFn.executeMainFn) created = await (await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$transaction$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getCurrentAdapter"])(adapter)).create({
            model,
            data: actualData,
            forceAllowId: true
        });
        if (customCreateFn?.fn) created = await customCreateFn.fn(created ?? actualData);
        for (const { source, hooks } of hooksEntries){
            const toRun = hooks[model]?.create?.after;
            if (toRun) await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$transaction$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["queueAfterTransactionHook"])(async ()=>{
                await withSpan(`db create.after ${model}`, {
                    [__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$instrumentation$2f$attributes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ATTR_HOOK_TYPE"]]: "create.after",
                    [__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$instrumentation$2f$attributes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ATTR_DB_COLLECTION_NAME"]]: model,
                    [__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$instrumentation$2f$attributes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ATTR_CONTEXT"]]: source
                }, ()=>toRun(created, context));
            });
        }
        return created;
    }
    async function updateWithHooks(data, where, model, customUpdateFn) {
        const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$endpoint$2d$context$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["tryGetCurrentAuthEndpointContext"])();
        let actualData = data;
        for (const { source, hooks } of hooksEntries){
            const toRun = hooks[model]?.update?.before;
            if (toRun) {
                const result = await withSpan(`db update.before ${model}`, {
                    [__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$instrumentation$2f$attributes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ATTR_HOOK_TYPE"]]: "update.before",
                    [__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$instrumentation$2f$attributes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ATTR_DB_COLLECTION_NAME"]]: model,
                    [__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$instrumentation$2f$attributes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ATTR_CONTEXT"]]: source
                }, ()=>toRun(data, context));
                if (result === false) return null;
                if (typeof result === "object" && "data" in result) actualData = {
                    ...actualData,
                    ...result.data
                };
            }
        }
        const customUpdated = customUpdateFn ? await customUpdateFn.fn(actualData) : null;
        const updated = !customUpdateFn || customUpdateFn.executeMainFn ? await (await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$transaction$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getCurrentAdapter"])(adapter)).update({
            model,
            update: actualData,
            where
        }) : customUpdated;
        for (const { source, hooks } of hooksEntries){
            const toRun = hooks[model]?.update?.after;
            if (toRun) await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$transaction$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["queueAfterTransactionHook"])(async ()=>{
                await withSpan(`db update.after ${model}`, {
                    [__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$instrumentation$2f$attributes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ATTR_HOOK_TYPE"]]: "update.after",
                    [__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$instrumentation$2f$attributes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ATTR_DB_COLLECTION_NAME"]]: model,
                    [__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$instrumentation$2f$attributes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ATTR_CONTEXT"]]: source
                }, ()=>toRun(updated, context));
            });
        }
        return updated;
    }
    async function updateManyWithHooks(data, where, model, customUpdateFn) {
        const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$endpoint$2d$context$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["tryGetCurrentAuthEndpointContext"])();
        let actualData = data;
        for (const { source, hooks } of hooksEntries){
            const toRun = hooks[model]?.update?.before;
            if (toRun) {
                const result = await withSpan(`db updateMany.before ${model}`, {
                    [__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$instrumentation$2f$attributes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ATTR_HOOK_TYPE"]]: "updateMany.before",
                    [__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$instrumentation$2f$attributes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ATTR_DB_COLLECTION_NAME"]]: model,
                    [__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$instrumentation$2f$attributes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ATTR_CONTEXT"]]: source
                }, ()=>toRun(data, context));
                if (result === false) return null;
                if (typeof result === "object" && "data" in result) actualData = {
                    ...actualData,
                    ...result.data
                };
            }
        }
        const customUpdated = customUpdateFn ? await customUpdateFn.fn(actualData) : null;
        const updated = !customUpdateFn || customUpdateFn.executeMainFn ? await (await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$transaction$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getCurrentAdapter"])(adapter)).updateMany({
            model,
            update: actualData,
            where
        }) : customUpdated;
        for (const { source, hooks } of hooksEntries){
            const toRun = hooks[model]?.update?.after;
            if (toRun) await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$transaction$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["queueAfterTransactionHook"])(async ()=>{
                await withSpan(`db updateMany.after ${model}`, {
                    [__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$instrumentation$2f$attributes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ATTR_HOOK_TYPE"]]: "updateMany.after",
                    [__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$instrumentation$2f$attributes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ATTR_DB_COLLECTION_NAME"]]: model,
                    [__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$instrumentation$2f$attributes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ATTR_CONTEXT"]]: source
                }, ()=>toRun(updated, context));
            });
        }
        return updated;
    }
    async function deleteWithHooks(where, model, customDeleteFn) {
        const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$endpoint$2d$context$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["tryGetCurrentAuthEndpointContext"])();
        let entityToDelete = null;
        try {
            entityToDelete = (await (await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$transaction$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getCurrentAdapter"])(adapter)).findMany({
                model,
                where,
                limit: 1
            }))[0] || null;
        } catch  {}
        if (entityToDelete) for (const { source, hooks } of hooksEntries){
            const toRun = hooks[model]?.delete?.before;
            if (toRun) {
                if (await withSpan(`db delete.before ${model}`, {
                    [__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$instrumentation$2f$attributes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ATTR_HOOK_TYPE"]]: "delete.before",
                    [__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$instrumentation$2f$attributes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ATTR_DB_COLLECTION_NAME"]]: model,
                    [__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$instrumentation$2f$attributes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ATTR_CONTEXT"]]: source
                }, ()=>toRun(entityToDelete, context)) === false) return null;
            }
        }
        const customDeleted = customDeleteFn ? await customDeleteFn.fn(where) : null;
        const deleted = (!customDeleteFn || customDeleteFn.executeMainFn) && entityToDelete ? await (await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$transaction$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getCurrentAdapter"])(adapter)).delete({
            model,
            where
        }) : customDeleted;
        if (entityToDelete) for (const { source, hooks } of hooksEntries){
            const toRun = hooks[model]?.delete?.after;
            if (toRun) await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$transaction$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["queueAfterTransactionHook"])(async ()=>{
                await withSpan(`db delete.after ${model}`, {
                    [__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$instrumentation$2f$attributes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ATTR_HOOK_TYPE"]]: "delete.after",
                    [__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$instrumentation$2f$attributes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ATTR_DB_COLLECTION_NAME"]]: model,
                    [__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$instrumentation$2f$attributes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ATTR_CONTEXT"]]: source
                }, ()=>toRun(entityToDelete, context));
            });
        }
        return deleted;
    }
    async function deleteManyWithHooks(where, model, customDeleteFn) {
        const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$endpoint$2d$context$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["tryGetCurrentAuthEndpointContext"])();
        let entitiesToDelete = [];
        try {
            entitiesToDelete = await (await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$transaction$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getCurrentAdapter"])(adapter)).findMany({
                model,
                where
            });
        } catch  {}
        for (const entity of entitiesToDelete)for (const { source, hooks } of hooksEntries){
            const toRun = hooks[model]?.delete?.before;
            if (toRun) {
                if (await withSpan(`db delete.before ${model}`, {
                    [__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$instrumentation$2f$attributes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ATTR_HOOK_TYPE"]]: "delete.before",
                    [__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$instrumentation$2f$attributes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ATTR_DB_COLLECTION_NAME"]]: model,
                    [__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$instrumentation$2f$attributes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ATTR_CONTEXT"]]: source
                }, ()=>toRun(entity, context)) === false) return null;
            }
        }
        const customDeleted = customDeleteFn ? await customDeleteFn.fn(where) : null;
        const deleted = !customDeleteFn || customDeleteFn.executeMainFn ? await (await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$transaction$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getCurrentAdapter"])(adapter)).deleteMany({
            model,
            where
        }) : customDeleted;
        for (const entity of entitiesToDelete)for (const { source, hooks } of hooksEntries){
            const toRun = hooks[model]?.delete?.after;
            if (toRun) await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$transaction$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["queueAfterTransactionHook"])(async ()=>{
                await withSpan(`db delete.after ${model}`, {
                    [__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$instrumentation$2f$attributes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ATTR_HOOK_TYPE"]]: "delete.after",
                    [__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$instrumentation$2f$attributes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ATTR_DB_COLLECTION_NAME"]]: model,
                    [__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$instrumentation$2f$attributes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ATTR_CONTEXT"]]: source
                }, ()=>toRun(entity, context));
            });
        }
        return deleted;
    }
    /**
	* Wraps an atomic consume operation in the plugin `delete.before` and
	* `delete.after` hook lifecycle. The caller supplies a `consumeFn` that
	* performs the actual single-row delete-and-return (typically the
	* adapter's `consumeOne`). The first concurrent caller wins, subsequent
	* racers resolve to `null` without firing `delete.after` hooks.
	*
	* `preSnapshot` lets the caller hand in a row it already fetched so
	* `delete.before` hooks don't trigger a second read. Without it, the
	* helper falls back to a best-effort `findMany` against `hookWhere`.
	* The snapshot only feeds `delete.before`; the `consumeFn` return value
	* is the race gate.
	*
	* Returning `false` from a `delete.before` hook aborts the consume and
	* the helper resolves to `null` (no `consumeFn` call, no after hooks).
	*/ async function consumeOneWithHooks(model, hookWhere, consumeFn, preSnapshot) {
        const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$endpoint$2d$context$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["tryGetCurrentAuthEndpointContext"])();
        const beforeHooks = hooksEntries.flatMap(({ source, hooks })=>{
            const fn = hooks[model]?.delete?.before;
            return fn ? [
                {
                    source,
                    fn
                }
            ] : [];
        });
        let snapshot = preSnapshot ?? null;
        if (beforeHooks.length) {
            if (!snapshot) try {
                snapshot = (await (await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$transaction$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getCurrentAdapter"])(adapter)).findMany({
                    model,
                    where: hookWhere,
                    limit: 1
                }))[0] || null;
            } catch  {}
            if (snapshot) {
                for (const { source, fn } of beforeHooks)if (await withSpan(`db delete.before ${model}`, {
                    [__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$instrumentation$2f$attributes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ATTR_HOOK_TYPE"]]: "delete.before",
                    [__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$instrumentation$2f$attributes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ATTR_DB_COLLECTION_NAME"]]: model,
                    [__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$instrumentation$2f$attributes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ATTR_CONTEXT"]]: source
                }, ()=>fn(snapshot, context)) === false) return null;
            }
        }
        const consumed = await consumeFn();
        if (!consumed) return null;
        for (const { source, hooks } of hooksEntries){
            const toRun = hooks[model]?.delete?.after;
            if (toRun) await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$transaction$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["queueAfterTransactionHook"])(async ()=>{
                await withSpan(`db delete.after ${model}`, {
                    [__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$instrumentation$2f$attributes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ATTR_HOOK_TYPE"]]: "delete.after",
                    [__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$instrumentation$2f$attributes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ATTR_DB_COLLECTION_NAME"]]: model,
                    [__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$instrumentation$2f$attributes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ATTR_CONTEXT"]]: source
                }, ()=>toRun(consumed, context));
            });
        }
        return consumed;
    }
    return {
        createWithHooks,
        updateWithHooks,
        updateManyWithHooks,
        deleteWithHooks,
        deleteManyWithHooks,
        consumeOneWithHooks
    };
}
;
}),
"[project]/examples/nextjs/node_modules/better-auth/dist/oauth2/account-key.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "resolveOAuthAccountKey",
    ()=>resolveOAuthAccountKey,
    "resolveOAuthAccountKeyForAPI",
    ()=>resolveOAuthAccountKeyForAPI,
    "toOAuthProfileRecord",
    ()=>toOAuthProfileRecord
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/error/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/error/codes.mjs [app-route] (ecmascript)");
;
//#region src/oauth2/account-key.ts
/**
* Exposes a provider-declared profile as the raw claim record used by
* provisioning hooks. Provider profile interfaces are object-shaped but do
* not need an index signature solely to satisfy this erased boundary.
*/ function toOAuthProfileRecord(profile) {
    return profile;
}
/**
* Resolves the stable account key established by an OAuth provider response.
*/ async function resolveOAuthAccountKey(provider, tokens, profile) {
    const accountKeyContext = {
        tokens,
        profile
    };
    const accountSubject = provider.accountSubject;
    const resolvedSubject = await accountSubject(accountKeyContext);
    const accountId = String(resolvedSubject);
    if (typeof resolvedSubject === "number" && !Number.isFinite(resolvedSubject) || accountId.trim().length === 0 || accountId === "undefined" || accountId === "null") throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["BetterAuthError"]("OAUTH_ACCOUNT_SUBJECT_INVALID");
    return {
        providerId: provider.id,
        accountId
    };
}
/**
* Resolves an OAuth account key at a direct HTTP authentication boundary.
*
* Provider resolvers are application code and can reject or return malformed
* values. Direct sign-in and linking expose all such failures as one stable
* authentication error instead of leaking implementation details or a 500.
*/ async function resolveOAuthAccountKeyForAPI(provider, tokens, profile) {
    try {
        return await resolveOAuthAccountKey(provider, tokens, profile);
    } catch  {
        throw __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"].from("UNAUTHORIZED", __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BASE_ERROR_CODES"].FAILED_TO_GET_USER_INFO);
    }
}
;
}),
"[project]/examples/nextjs/node_modules/better-auth/dist/oauth2/callback.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "exchangeOAuthCallback",
    ()=>exchangeOAuthCallback
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$oauth2$2f$account$2d$key$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/oauth2/account-key.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$oauth2$2f$errors$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/oauth2/errors.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$oauth2$2f$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/oauth2/utils.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$json$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/utils/json.mjs [app-route] (ecmascript)");
;
;
;
;
//#region src/oauth2/callback.ts
/**
* Turns a provider callback into a verified identity. It checks that the
* callback answers this authorization request, exchanges the code, and
* resolves the user and account key.
*
* Every route that completes a provider callback goes through here, so the
* routes run the same checks.
*/ async function exchangeOAuthCallback(ctx, provider, callback) {
    if (callback.iss && provider.issuer && callback.iss !== provider.issuer) {
        ctx.context.logger.error("OAuth issuer mismatch", {
            expected: provider.issuer,
            received: callback.iss
        });
        return {
            error: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$oauth2$2f$errors$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["OAUTH_CALLBACK_ERROR_CODES"].ISSUER_MISMATCH
        };
    }
    if (provider.requiresIdTokenNonce && !callback.idTokenNonce) {
        ctx.context.logger.error("OAuth id_token nonce binding required but no expected nonce was found in state", {
            providerId: provider.id
        });
        return {
            error: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$oauth2$2f$errors$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["OAUTH_CALLBACK_ERROR_CODES"].NONCE_BINDING_MISSING
        };
    }
    let tokens;
    try {
        tokens = await provider.validateAuthorizationCode({
            code: callback.code,
            codeVerifier: callback.codeVerifier,
            deviceId: callback.deviceId,
            redirectURI: `${ctx.context.baseURL}${(0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$oauth2$2f$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getOAuthCallbackPath"])(provider)}`
        });
    } catch (error) {
        ctx.context.logger.error("Failed to validate authorization code", error);
        return {
            error: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$oauth2$2f$errors$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["OAUTH_CALLBACK_ERROR_CODES"].INVALID_CODE
        };
    }
    if (!tokens) return {
        error: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$oauth2$2f$errors$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["OAUTH_CALLBACK_ERROR_CODES"].INVALID_CODE
    };
    const result = await provider.getUserInfo({
        ...tokens,
        expectedIdTokenNonce: callback.idTokenNonce,
        /**
		* The user object from the provider
		* This is only available for some providers like Apple
		*/ user: (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$json$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["safeJSONParse"])(callback.user) ?? void 0
    });
    if (!result?.user) {
        ctx.context.logger.error("Unable to get user info");
        return {
            error: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$oauth2$2f$errors$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["OAUTH_CALLBACK_ERROR_CODES"].UNABLE_TO_GET_USER_INFO
        };
    }
    const accountKey = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$oauth2$2f$account$2d$key$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["resolveOAuthAccountKey"])(provider, tokens, result.data).catch((error)=>{
        ctx.context.logger.error("Unable to derive provider account identity", {
            providerId: provider.id,
            error
        });
        return null;
    });
    if (!accountKey) return {
        error: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$oauth2$2f$errors$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["OAUTH_CALLBACK_ERROR_CODES"].UNABLE_TO_GET_USER_INFO
    };
    return {
        tokens,
        userInfo: result.user,
        providerProfile: (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$oauth2$2f$account$2d$key$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["toOAuthProfileRecord"])(result.data),
        accountKey
    };
}
;
}),
"[project]/examples/nextjs/node_modules/better-auth/dist/oauth2/errors.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "OAUTH_CALLBACK_ERROR_CODES",
    ()=>OAUTH_CALLBACK_ERROR_CODES,
    "missingEmailLogMessage",
    ()=>missingEmailLogMessage,
    "redirectOnError",
    ()=>redirectOnError
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$url$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/utils/url.mjs [app-route] (ecmascript)");
;
//#region src/oauth2/errors.ts
/**
* Error codes used in OAuth callback redirects (`?error=<code>`). These are
* URL-safe strings, not API error objects. Some also serve as the OAuth seam's
* machine-readable `result.error` value, which non-redirect callers (e.g.
* id-token sign-in) remap to an API error code.
*/ const OAUTH_CALLBACK_ERROR_CODES = {
    NO_CODE: "no_code",
    PROVIDER_NOT_FOUND: "oauth_provider_not_found",
    ISSUER_MISSING: "issuer_missing",
    ISSUER_MISMATCH: "issuer_mismatch",
    INVALID_CODE: "invalid_code",
    NONCE_BINDING_MISSING: "nonce_binding_missing",
    UNABLE_TO_GET_USER_INFO: "unable_to_get_user_info",
    NO_CALLBACK_URL: "no_callback_url",
    UNABLE_TO_LINK_ACCOUNT: "unable_to_link_account",
    EMAIL_DOES_NOT_MATCH: "email_does_not_match",
    ACCOUNT_ALREADY_LINKED_TO_DIFFERENT_USER: "account_already_linked_to_different_user",
    EMAIL_NOT_FOUND: "email_not_found",
    EMAIL_NOT_VERIFIED: "email_not_verified"
};
const HANDLING_DOCS_URL = "https://www.better-auth.com/docs/concepts/oauth#handling-providers-without-email";
/**
* Redirect the user to the OAuth error page with a machine-readable `error`
* code (and optional `error_description`).
*
* Every OAuth callback path routes its failures through this helper so the
* query parameter name, the `?`/`&` separator, and URL encoding are decided in
* one place. The error page reads the `error` query parameter, so callers must
* never hand-build the redirect with a different parameter name.
*/ function redirectOnError(ctx, errorURL, error, description) {
    const params = new URLSearchParams({
        error
    });
    if (description) params.set("error_description", description);
    const redirectURL = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$url$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["appendQueryParams"])(errorURL, params);
    throw ctx.redirect(redirectURL);
}
/**
* Build the logger message shown when an OAuth provider does not return an
* email address. Kept in one place so every rejection site points users at
* the same workaround docs.
*/ function missingEmailLogMessage(providerId, options) {
    return `${options?.source === "generic" ? `Generic OAuth provider "${providerId}"` : `Provider "${providerId}"`} did not return an email${options?.source === "id_token" ? " in the id token" : ""}. Either request the provider's email scope, or create a placeholder via \`mapProfileToUser\`. See ${HANDLING_DOCS_URL}`;
}
;
}),
"[project]/examples/nextjs/node_modules/better-auth/dist/oauth2/link-account.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "applyUpdateUserInfoOnLink",
    ()=>applyUpdateUserInfoOnLink,
    "handleOAuthUserInfo",
    ()=>handleOAuthUserInfo,
    "linkOAuthAccount",
    ()=>linkOAuthAccount
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$is$2d$api$2d$error$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/utils/is-api-error.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$schema$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/db/schema.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$session$2d$store$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/cookies/session-store.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$validate$2d$user$2d$info$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/utils/validate-user-info.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$oauth2$2f$errors$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/oauth2/errors.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$oauth2$2f$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/oauth2/utils.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$routes$2f$email$2d$verification$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/api/routes/email-verification.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$transaction$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/context/transaction.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$env$2d$impl$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/env/env-impl.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/error/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/oauth2/utils.mjs [app-route] (ecmascript)");
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
//#region src/oauth2/link-account.ts
function linkOAuthAccountFailure(code, message) {
    return {
        linked: false,
        error: {
            code,
            message
        }
    };
}
async function linkOAuthAccount(c, { link, userInfo, account, profile, scopes }) {
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$validate$2d$user$2d$info$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["assertValidUserInfo"])(c, {
            user: {
                ...userInfo,
                id: link.userId,
                email: userInfo.email ?? void 0
            },
            source: {
                action: "link-account",
                method: "oauth",
                oauth: {
                    providerId: account.providerId,
                    profile
                }
            }
        });
    } catch (error) {
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$is$2d$api$2d$error$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isAPIError"])(error) || !error.body?.code) throw error;
        return linkOAuthAccountFailure(error.body.code, error.body.message);
    }
    if (!c.context.trustedProviders.includes(account.providerId) && !userInfo.emailVerified || c.context.options.account?.accountLinking?.enabled === false) {
        c.context.logger.error("Unable to link account - untrusted provider");
        return linkOAuthAccountFailure(__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$oauth2$2f$errors$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["OAUTH_CALLBACK_ERROR_CODES"].UNABLE_TO_LINK_ACCOUNT);
    }
    if (userInfo.email?.toLowerCase() !== link.email.toLowerCase() && c.context.options.account?.accountLinking?.allowDifferentEmails !== true) return linkOAuthAccountFailure(__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$oauth2$2f$errors$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["OAUTH_CALLBACK_ERROR_CODES"].EMAIL_DOES_NOT_MATCH);
    const existingAccount = await c.context.internalAdapter.findAccountByKey(account);
    if (existingAccount) {
        if (existingAccount.userId.toString() !== link.userId.toString()) return linkOAuthAccountFailure(__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$oauth2$2f$errors$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["OAUTH_CALLBACK_ERROR_CODES"].ACCOUNT_ALREADY_LINKED_TO_DIFFERENT_USER);
        const mergedScope = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$oauth2$2f$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["mergeScopes"])(existingAccount.scope, scopes);
        const updateData = Object.fromEntries(Object.entries({
            providerId: account.providerId,
            accessToken: await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$oauth2$2f$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["setTokenUtil"])(account.accessToken, c.context),
            refreshToken: await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$oauth2$2f$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["setTokenUtil"])(account.refreshToken, c.context),
            idToken: account.idToken,
            accessTokenExpiresAt: account.accessTokenExpiresAt,
            refreshTokenExpiresAt: account.refreshTokenExpiresAt,
            scope: mergedScope || void 0
        }).filter(([_, value])=>value !== void 0));
        await c.context.internalAdapter.updateAccount(existingAccount.id, updateData);
    } else if (!await c.context.internalAdapter.createAccount({
        userId: link.userId,
        ...account,
        accessToken: await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$oauth2$2f$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["setTokenUtil"])(account.accessToken, c.context),
        refreshToken: await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$oauth2$2f$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["setTokenUtil"])(account.refreshToken, c.context),
        scope: scopes?.join(",") ?? account.scope
    })) return linkOAuthAccountFailure(__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$oauth2$2f$errors$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["OAUTH_CALLBACK_ERROR_CODES"].UNABLE_TO_LINK_ACCOUNT);
    await applyUpdateUserInfoOnLink(c, link.userId, userInfo);
    return {
        linked: true
    };
}
async function handleOAuthUserInfo(c, opts) {
    const { userInfo, account, callbackURL, disableSignUp, overrideUserInfo } = opts;
    const source = opts.source ?? {
        method: "oauth",
        oauth: {
            providerId: account.providerId
        }
    };
    const requireExactAccountBinding = !!opts.selectedUser || opts.requireExactAccountBinding === true;
    let pendingAccountCookie = null;
    const accountOwner = await c.context.internalAdapter.findAccountOwnerByKey({
        providerId: account.providerId,
        accountId: account.accountId
    }).catch((e)=>{
        c.context.logger.error("Better auth was unable to query your database.\nError: ", e);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$oauth2$2f$errors$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["redirectOnError"])(c, c.context.options.onAPIError?.errorURL || `${c.context.baseURL}/error`, "internal_server_error");
    });
    if (accountOwner?.kind === "orphaned") {
        c.context.logger.error("OAuth account references a missing user. Repair the account before retrying authentication.");
        return {
            error: "unable to link account",
            data: null,
            isRegister: false
        };
    }
    const dbUser = await (async ()=>{
        if (accountOwner?.kind === "owned") {
            if (opts.selectedUser && accountOwner.user.id !== opts.selectedUser.userId) throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"]("CONFLICT", {
                code: "account_ownership_conflict",
                message: "Account is already linked to another user"
            });
            return {
                user: accountOwner.user,
                linkedAccount: accountOwner.account,
                accounts: [
                    accountOwner.account
                ]
            };
        }
        if (opts.selectedUser) {
            const selectedUser = await c.context.internalAdapter.findUserById(opts.selectedUser.userId);
            if (!selectedUser) throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"]("NOT_FOUND", {
                code: "user_not_found",
                message: "User not found"
            });
            return {
                user: selectedUser,
                linkedAccount: null,
                accounts: []
            };
        }
        const emailMatch = await c.context.internalAdapter.findUserByEmail(userInfo.email.toLowerCase(), {
            includeAccounts: true
        });
        if (!emailMatch) return null;
        return {
            user: emailMatch.user,
            linkedAccount: null,
            accounts: emailMatch.accounts
        };
    })().catch((e)=>{
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$is$2d$api$2d$error$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isAPIError"])(e)) throw e;
        c.context.logger.error("Better auth was unable to query your database.\nError: ", e);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$oauth2$2f$errors$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["redirectOnError"])(c, c.context.options.onAPIError?.errorURL || `${c.context.baseURL}/error`, "internal_server_error");
    });
    let user = dbUser?.user;
    const isRegister = !user;
    if (dbUser) {
        const linkedAccount = dbUser.linkedAccount ?? dbUser.accounts.find((acc)=>acc.providerId === account.providerId && acc.accountId === account.accountId);
        if (!linkedAccount) {
            const accountLinking = c.context.options.account?.accountLinking;
            const isTrustedProvider = opts.isTrustedProvider || opts.trustProviderByName !== false && c.context.trustedProviders.includes(account.providerId);
            const requireLocalEmailVerified = accountLinking?.requireLocalEmailVerified ?? true;
            if (!opts.selectedUser && (!isTrustedProvider && !userInfo.emailVerified || requireLocalEmailVerified && !dbUser.user.emailVerified || accountLinking?.enabled === false || accountLinking?.disableImplicitLinking === true)) {
                if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$env$2d$impl$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isDevelopment"])()) c.context.logger.warn(`User already exist but account isn't linked to ${account.providerId}. To read more about how account linking works in Better Auth see https://www.better-auth.com/docs/concepts/users-accounts#account-linking.`);
                return {
                    error: "account not linked",
                    data: null
                };
            }
            try {
                const { id: _accountId, ...providerUserInfo } = userInfo;
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$validate$2d$user$2d$info$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["assertValidUserInfo"])(c, {
                    user: {
                        ...providerUserInfo,
                        id: dbUser.user.id,
                        email: userInfo.email.toLowerCase()
                    },
                    source: {
                        ...source,
                        action: "link-account"
                    }
                });
                const createdAccount = await c.context.internalAdapter.linkAccount({
                    providerId: account.providerId,
                    accountId: account.accountId,
                    userId: dbUser.user.id,
                    accessToken: await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$oauth2$2f$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["setTokenUtil"])(account.accessToken, c.context),
                    refreshToken: await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$oauth2$2f$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["setTokenUtil"])(account.refreshToken, c.context),
                    idToken: account.idToken,
                    accessTokenExpiresAt: account.accessTokenExpiresAt,
                    refreshTokenExpiresAt: account.refreshTokenExpiresAt,
                    scope: account.scope
                });
                if (!createdAccount) return {
                    error: "unable to link account",
                    data: null
                };
                if (requireExactAccountBinding && (createdAccount.accountId !== account.accountId || createdAccount.providerId !== account.providerId || createdAccount.userId !== dbUser.user.id)) throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"]("CONFLICT", {
                    code: "account_hook_binding_conflict",
                    message: "Account hook changed the selected authentication binding"
                });
                if (c.context.options.account?.storeAccountCookie) if (opts.deferNonDatabaseWrites) pendingAccountCookie = createdAccount;
                else await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$session$2d$store$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["setAccountCookie"])(c, createdAccount);
            } catch (e) {
                if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$is$2d$api$2d$error$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isAPIError"])(e)) throw e;
                c.context.logger.error("Unable to link account", e);
                return {
                    error: "unable to link account",
                    data: null
                };
            }
            if (!opts.selectedUser && userInfo.emailVerified && !dbUser.user.emailVerified && userInfo.email.toLowerCase() === dbUser.user.email) await c.context.internalAdapter.updateUser(dbUser.user.id, {
                emailVerified: true
            });
            if (!opts.selectedUser) user = await applyUpdateUserInfoOnLink(c, dbUser.user.id, userInfo) ?? user;
        } else {
            const { id: _accountId, ...providerUserInfo } = userInfo;
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$validate$2d$user$2d$info$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["assertValidUserInfo"])(c, {
                user: {
                    ...providerUserInfo,
                    id: dbUser.user.id,
                    email: userInfo.email.toLowerCase()
                },
                source: {
                    ...source,
                    action: "sign-in"
                }
            });
            /**
			* `scope` intentionally omitted. Updated only via linkSocial.
			*
			* @see {@link Account.scope}
			*/ const freshTokens = c.context.options.account?.updateAccountOnSignIn !== false ? Object.fromEntries(Object.entries({
                providerId: account.providerId,
                idToken: account.idToken,
                accessToken: await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$oauth2$2f$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["setTokenUtil"])(account.accessToken, c.context),
                refreshToken: await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$oauth2$2f$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["setTokenUtil"])(account.refreshToken, c.context),
                accessTokenExpiresAt: account.accessTokenExpiresAt,
                refreshTokenExpiresAt: account.refreshTokenExpiresAt
            }).filter(([_, value])=>value !== void 0)) : {};
            if (c.context.options.account?.storeAccountCookie) {
                const accountCookie = {
                    ...linkedAccount,
                    ...freshTokens
                };
                if (opts.deferNonDatabaseWrites) pendingAccountCookie = accountCookie;
                else await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$session$2d$store$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["setAccountCookie"])(c, accountCookie);
            }
            if (Object.keys(freshTokens).length > 0) {
                const updatedAccount = await c.context.internalAdapter.updateAccount(linkedAccount.id, freshTokens);
                if (!updatedAccount) return {
                    error: "unable to update account",
                    data: null
                };
                if (requireExactAccountBinding && (updatedAccount.accountId !== account.accountId || updatedAccount.providerId !== account.providerId || updatedAccount.userId !== dbUser.user.id)) throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"]("CONFLICT", {
                    code: "account_hook_binding_conflict",
                    message: "Account hook changed the selected authentication binding"
                });
                if (opts.deferNonDatabaseWrites && pendingAccountCookie) pendingAccountCookie = updatedAccount;
            }
            if (!opts.selectedUser && userInfo.emailVerified && !dbUser.user.emailVerified && userInfo.email.toLowerCase() === dbUser.user.email) await c.context.internalAdapter.updateUser(dbUser.user.id, {
                emailVerified: true
            });
        }
        if (opts.selectedUser ? opts.selectedUser.profile === "update" : overrideUserInfo) {
            const { id: _id, email: _email, emailVerified: _emailVerified, name, image, ...providerProfile } = userInfo;
            const additionalUserFields = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$schema$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseAdditionalUserInputFromProviderProfile"])(c.context.options, providerProfile, "update");
            const updatedUser = await c.context.internalAdapter.updateUser(dbUser.user.id, {
                name,
                image,
                ...additionalUserFields,
                email: userInfo.email.toLowerCase(),
                emailVerified: userInfo.email.toLowerCase() === dbUser.user.email ? dbUser.user.emailVerified || userInfo.emailVerified : userInfo.emailVerified
            });
            if (updatedUser == null) c.context.logger.warn("Could not update user info during OAuth sign in; preserving existing user for session.");
            if (opts.selectedUser && updatedUser && updatedUser.id !== opts.selectedUser.userId) throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"]("CONFLICT", {
                code: "user_hook_selection_conflict",
                message: "User hook changed the selected user"
            });
            user = updatedUser ?? user;
        }
    } else {
        if (disableSignUp) return {
            error: "signup disabled",
            data: null,
            isRegister: false
        };
        try {
            const { id: _id, email: _email, emailVerified: _emailVerified, name, image, ...providerProfile } = userInfo;
            const additionalUserFields = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$schema$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseAdditionalUserInputFromProviderProfile"])(c.context.options, providerProfile, "create");
            const accountData = {
                accessToken: await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$oauth2$2f$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["setTokenUtil"])(account.accessToken, c.context),
                refreshToken: await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$oauth2$2f$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["setTokenUtil"])(account.refreshToken, c.context),
                idToken: account.idToken,
                accessTokenExpiresAt: account.accessTokenExpiresAt,
                refreshTokenExpiresAt: account.refreshTokenExpiresAt,
                scope: account.scope,
                providerId: account.providerId,
                accountId: account.accountId
            };
            const { createdUser, createdAccount } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$transaction$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["runWithTransaction"])(c.context.adapter, async ()=>{
                const createdUser = await c.context.internalAdapter.createUser({
                    name,
                    image,
                    ...additionalUserFields,
                    email: userInfo.email.toLowerCase(),
                    emailVerified: userInfo.emailVerified
                }, source);
                return {
                    createdUser,
                    createdAccount: await c.context.internalAdapter.createAccount({
                        ...accountData,
                        userId: createdUser.id
                    })
                };
            });
            if (requireExactAccountBinding && (createdAccount.accountId !== account.accountId || createdAccount.providerId !== account.providerId || createdAccount.userId !== createdUser.id)) throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"]("CONFLICT", {
                code: "account_hook_binding_conflict",
                message: "Account hook changed the selected authentication binding"
            });
            user = createdUser;
            if (c.context.options.account?.storeAccountCookie) if (opts.deferNonDatabaseWrites) pendingAccountCookie = createdAccount;
            else await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$session$2d$store$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["setAccountCookie"])(c, createdAccount);
        } catch (e) {
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$utils$2f$is$2d$api$2d$error$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isAPIError"])(e)) throw e;
            c.context.logger.error("Unable to create OAuth user", e);
            return {
                error: "unable to create user",
                data: null,
                isRegister: false
            };
        }
    }
    if (!user) return {
        error: "unable to create user",
        data: null,
        isRegister: false
    };
    const requireEmailVerification = c.context.socialProviders.find((p)=>p.id === account.providerId)?.options?.requireEmailVerification;
    if (isRegister && !user.emailVerified && (c.context.options.emailVerification?.sendOnSignUp ?? requireEmailVerification)) await dispatchVerificationEmail(c, user, callbackURL, opts.deferNonDatabaseWrites);
    if (requireEmailVerification && !user.emailVerified) {
        if (!isRegister && c.context.options.emailVerification?.sendOnSignIn) await dispatchVerificationEmail(c, user, callbackURL, opts.deferNonDatabaseWrites);
        return {
            error: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$oauth2$2f$errors$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["OAUTH_CALLBACK_ERROR_CODES"].EMAIL_NOT_VERIFIED,
            data: null,
            isRegister
        };
    }
    const session = await c.context.internalAdapter.createSession(user.id, void 0, void 0, void 0, {
        deferSecondaryStorageWrites: opts.deferNonDatabaseWrites === true
    });
    if (!session) return {
        error: "unable to create session",
        data: null,
        isRegister: false
    };
    if (requireExactAccountBinding && session.userId !== (opts.selectedUser?.userId ?? user.id)) throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"]("CONFLICT", {
        code: "session_hook_user_conflict",
        message: "Session hook changed the selected user"
    });
    return {
        data: {
            session,
            user
        },
        error: null,
        isRegister,
        accountCookie: pendingAccountCookie
    };
}
async function dispatchVerificationEmail(c, user, callbackURL, deferUntilAfterTransaction) {
    const sendVerificationEmail = c.context.options.emailVerification?.sendVerificationEmail;
    if (!sendVerificationEmail) return;
    const send = async ()=>{
        try {
            const token = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$routes$2f$email$2d$verification$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createEmailVerificationToken"])(c.context.secret, user.email, void 0, c.context.options.emailVerification?.expiresIn);
            const url = `${c.context.baseURL}/verify-email?token=${token}&callbackURL=${encodeURIComponent(callbackURL || "/")}`;
            await c.context.runInBackgroundOrAwait(sendVerificationEmail({
                user,
                url,
                token
            }, c.request));
        } catch (e) {
            c.context.logger.error("Failed to send OAuth verification email", e);
        }
    };
    if (deferUntilAfterTransaction) await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$transaction$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["queueAfterTransactionHook"])(send);
    else await send();
}
/**
* Apply the `account.accountLinking.updateUserInfoOnLink` policy: when enabled,
* copy the freshly linked provider's profile onto the local user, matching the
* field set persisted on sign-up. The local `email` and `emailVerified` are
* never changed, so a link can't rebind the account's identity, and
* `updateUser` drops `undefined` fields, so a provider that omits one leaves
* the existing column intact.
*
* Returns the updated user so a caller that issues a session can seed the
* cookie cache with the fresh row. Returns `undefined` when the policy is
* disabled or the update fails: a failed profile sync must not abort the link.
*/ async function applyUpdateUserInfoOnLink(c, userId, userInfo) {
    if (c.context.options.account?.accountLinking?.updateUserInfoOnLink !== true) return;
    try {
        const { email: _email, emailVerified: _emailVerified, name, image, ...providerProfile } = userInfo;
        const additionalUserFields = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$db$2f$schema$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseAdditionalUserInputFromProviderProfile"])(c.context.options, providerProfile, "update");
        return await c.context.internalAdapter.updateUser(userId, {
            name,
            image,
            ...additionalUserFields
        });
    } catch (e) {
        c.context.logger.warn("Could not update user info on account link", e);
        return;
    }
}
;
}),
"[project]/examples/nextjs/node_modules/better-auth/dist/oauth2/state.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "generateIdTokenNonce",
    ()=>generateIdTokenNonce,
    "generateState",
    ()=>generateState,
    "parseState",
    ()=>parseState
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$crypto$2f$random$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/crypto/random.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$oauth2$2f$errors$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/oauth2/errors.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$state$2f$oauth$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/api/state/oauth.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$state$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/state.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/error/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/error/codes.mjs [app-route] (ecmascript)");
;
;
;
;
;
//#region src/oauth2/state.ts
/**
* Mint the OIDC `nonce` for the redirect flow, or `undefined` when the provider
* does not require ID-token nonce binding. Every redirect entrypoint (social
* sign-in, account linking, IDP-initiated bounce, and the OAuth popup) mints
* through this helper, so the value sent on the authorization URL and the value
* persisted in state are produced one way and cannot drift apart.
*/ function generateIdTokenNonce(provider) {
    return provider.requiresIdTokenNonce ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$crypto$2f$random$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateRandomString"])(32) : void 0;
}
async function generateState(c, options) {
    const callbackURL = c.body?.callbackURL || c.context.options.baseURL;
    if (!callbackURL) throw __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"].from("BAD_REQUEST", __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BASE_ERROR_CODES"].CALLBACK_URL_REQUIRED);
    const codeVerifier = options?.codeVerifier ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$crypto$2f$random$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateRandomString"])(128);
    const pendingServerContext = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$state$2f$oauth$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getOAuthServerContext"])();
    const serverContext = pendingServerContext && Object.keys(pendingServerContext).length ? pendingServerContext : void 0;
    const stateData = {
        ...options?.additionalData ? options.additionalData : {},
        callbackURL,
        codeVerifier,
        errorURL: c.body?.errorCallbackURL,
        newUserURL: c.body?.newUserCallbackURL,
        link: options?.link,
        serverContext,
        expiresAt: Date.now() + 600 * 1e3,
        requestSignUp: c.body?.requestSignUp,
        idTokenNonce: options?.idTokenNonce
    };
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$state$2f$oauth$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["setOAuthState"])(stateData);
    try {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$state$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateGenericState"])(c, stateData);
    } catch (error) {
        c.context.logger.error("Failed to create verification", error);
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"]("INTERNAL_SERVER_ERROR", {
            message: "Unable to create verification",
            cause: error
        });
    }
}
async function parseState(c) {
    const state = c.query.state || c.body?.state;
    const errorURL = c.context.options.onAPIError?.errorURL || `${c.context.baseURL}/error`;
    let parsedData;
    try {
        parsedData = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$state$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseGenericState"])(c, state);
    } catch (error) {
        c.context.logger.error("Failed to parse state", error);
        let code = "internal_server_error";
        let redirectErrorURL = errorURL;
        if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$state$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["StateError"]) {
            code = error.code === "state_security_mismatch" ? "state_mismatch" : error.code;
            redirectErrorURL = error.errorURL || errorURL;
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$oauth2$2f$errors$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["redirectOnError"])(c, redirectErrorURL, code);
    }
    if (!parsedData.errorURL) parsedData.errorURL = errorURL;
    if (parsedData) await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$api$2f$state$2f$oauth$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["setOAuthState"])(parsedData);
    return parsedData;
}
;
}),
"[project]/examples/nextjs/node_modules/better-auth/dist/oauth2/utils.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "decryptOAuthToken",
    ()=>decryptOAuthToken,
    "getOAuthCallbackPath",
    ()=>getOAuthCallbackPath,
    "setTokenUtil",
    ()=>setTokenUtil
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$crypto$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/crypto/index.mjs [app-route] (ecmascript) <locals>");
;
//#region src/oauth2/utils.ts
/**
* Check if a string looks like encrypted data
*/ function isLikelyEncrypted(token) {
    if (token.startsWith("$ba$")) return true;
    return token.length % 2 === 0 && /^[0-9a-f]+$/i.test(token);
}
function decryptOAuthToken(token, ctx) {
    if (!token) return token;
    if (ctx.options.account?.encryptOAuthTokens) {
        if (!isLikelyEncrypted(token)) return token;
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$crypto$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["symmetricDecrypt"])({
            key: ctx.secretConfig,
            data: token
        });
    }
    return token;
}
function setTokenUtil(token, ctx) {
    if (ctx.options.account?.encryptOAuthTokens && token) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$crypto$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["symmetricEncrypt"])({
        key: ctx.secretConfig,
        data: token
    });
    return token;
}
function getOAuthCallbackPath(provider) {
    if (!provider.callbackPath) return `/callback/${provider.id}`;
    return provider.callbackPath.startsWith("/") ? provider.callbackPath : `/${provider.callbackPath}`;
}
;
}),
"[project]/examples/nextjs/node_modules/better-auth/dist/state.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "INTERNAL_STATE_KEYS",
    ()=>INTERNAL_STATE_KEYS,
    "StateError",
    ()=>StateError,
    "generateGenericState",
    ()=>generateGenericState,
    "getAuthStateVerificationIdentifier",
    ()=>getAuthStateVerificationIdentifier,
    "parseGenericState",
    ()=>parseGenericState
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$crypto$2f$random$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/crypto/random.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$crypto$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/crypto/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/cookies/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$crypto$2f$purpose$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/crypto/purpose.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/error/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/zod/v4/classic/schemas.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$coerce$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__coerce$3e$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/zod/v4/classic/coerce.js [app-route] (ecmascript) <export * as coerce>");
;
;
;
;
;
;
//#region src/state.ts
const stateDataSchema = __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["looseObject"]({
    callbackURL: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"](),
    codeVerifier: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"](),
    errorURL: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]().optional(),
    newUserURL: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]().optional(),
    expiresAt: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["number"](),
    /**
	* CSRF nonce returned to the OAuth provider. When using cookie state storage,
	* this must match the callback `state` query parameter.
	*/ oauthState: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]().optional(),
    link: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["object"]({
        email: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"](),
        userId: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$coerce$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__coerce$3e$__["coerce"].string()
    }).optional(),
    requestSignUp: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["boolean"]().optional(),
    /**
	* OIDC nonce sent as the authorization request `nonce` parameter when the
	* provider requires an ID token to be bound to this redirect flow.
	*/ idTokenNonce: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"]().optional(),
    /**
	* Server-controlled values that ride the state across the provider redirect.
	* Populated only by `generateState` from `addOAuthServerContext`, never from
	* the request body, so it is safe to trust on the callback.
	*/ serverContext: __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["record"](__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"](), __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$schemas$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["unknown"]()).optional()
});
/** Verification key for database-backed OAuth and SAML relay state. */ const getAuthStateVerificationIdentifier = (state)=>`auth-state:${state}`;
const INTERNAL_STATE_KEYS = new Set(Object.keys(stateDataSchema.shape));
var StateError = class extends __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["BetterAuthError"] {
    code;
    details;
    /**
	* The per-flow `errorCallbackURL` recovered from the parsed state, when the
	* failure happened after the state was successfully parsed (for example a
	* nonce or state-cookie mismatch). It was origin-validated at sign-in, so
	* the callback can safely redirect there instead of the default error page.
	* Absent when the state could not be parsed at all.
	*/ errorURL;
    constructor(message, options){
        super(message, options);
        this.code = options.code;
        this.details = options.details;
        this.errorURL = options.errorURL;
    }
};
async function generateGenericState(c, stateData, settings) {
    const state = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$crypto$2f$random$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateRandomString"])(32);
    if (c.context.oauthConfig.storeStateStrategy === "cookie") {
        const payload = {
            ...stateData,
            oauthState: state
        };
        const encryptedData = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$crypto$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["symmetricEncrypt"])({
            key: (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$crypto$2f$purpose$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["derivePurposeKey"])(c.context.secretConfig, "oauth-state-cookie"),
            data: JSON.stringify(payload)
        });
        const stateCookie = c.context.createAuthCookie(settings?.cookieName ?? "oauth_state", {
            maxAge: 600
        });
        c.setCookie(stateCookie.name, encryptedData, stateCookie.attributes);
        return {
            state,
            codeVerifier: stateData.codeVerifier
        };
    }
    const stateCookie = c.context.createAuthCookie(settings?.cookieName ?? "state", {
        maxAge: 300
    });
    await c.setSignedCookie(stateCookie.name, state, c.context.secret, stateCookie.attributes);
    const expiresAt = /* @__PURE__ */ new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);
    if (!await c.context.internalAdapter.createVerificationValue({
        value: JSON.stringify({
            ...stateData,
            oauthState: state
        }),
        identifier: getAuthStateVerificationIdentifier(state),
        expiresAt
    })) throw new StateError("Unable to create verification. Make sure the database adapter is properly working and there is a verification table in the database", {
        code: "state_generation_error"
    });
    return {
        state,
        codeVerifier: stateData.codeVerifier
    };
}
async function parseGenericState(c, state, settings) {
    if (!state) throw new StateError("State not found in OAuth callback", {
        code: "state_not_found"
    });
    const storeStateStrategy = c.context.oauthConfig.storeStateStrategy;
    let parsedData;
    if (storeStateStrategy === "cookie") {
        const stateCookie = c.context.createAuthCookie(settings?.cookieName ?? "oauth_state");
        const encryptedData = c.getCookie(stateCookie.name);
        if (!encryptedData) throw new StateError("State mismatch: auth state cookie not found", {
            code: "state_mismatch",
            details: {
                state
            }
        });
        try {
            const decryptedData = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$crypto$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["symmetricDecrypt"])({
                key: (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$crypto$2f$purpose$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["derivePurposeKey"])(c.context.secretConfig, "oauth-state-cookie"),
                data: encryptedData
            });
            parsedData = stateDataSchema.parse(JSON.parse(decryptedData));
        } catch (error) {
            throw new StateError("State invalid: Failed to decrypt or parse auth state", {
                code: "state_invalid",
                details: {
                    state
                },
                cause: error
            });
        }
        if (!parsedData.oauthState || parsedData.oauthState !== state) throw new StateError("State mismatch: OAuth state parameter does not match stored state", {
            code: "state_security_mismatch",
            details: {
                state
            },
            errorURL: parsedData.errorURL
        });
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["expireCookie"])(c, stateCookie);
    } else {
        const data = await c.context.internalAdapter.findVerificationValue(getAuthStateVerificationIdentifier(state));
        if (!data) throw new StateError("State mismatch: verification not found", {
            code: "state_mismatch",
            details: {
                state
            }
        });
        parsedData = stateDataSchema.parse(JSON.parse(data.value));
        if (parsedData.oauthState !== void 0 && parsedData.oauthState !== state) throw new StateError("State mismatch: OAuth state parameter does not match stored state", {
            code: "state_security_mismatch",
            details: {
                state
            },
            errorURL: parsedData.errorURL
        });
        const stateCookie = c.context.createAuthCookie(settings?.cookieName ?? "state");
        const stateCookieValue = await c.getSignedCookie(stateCookie.name, c.context.secret);
        if (!(settings?.skipStateCookieCheck ?? c.context.oauthConfig.skipStateCookieCheck) && (!stateCookieValue || stateCookieValue !== state)) throw new StateError("State mismatch: State not persisted correctly", {
            code: "state_security_mismatch",
            details: {
                state
            },
            errorURL: parsedData.errorURL
        });
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$cookies$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["expireCookie"])(c, stateCookie);
        await c.context.internalAdapter.deleteVerificationByIdentifier(getAuthStateVerificationIdentifier(state));
    }
    if (parsedData.expiresAt < Date.now()) throw new StateError("Invalid state: request expired", {
        code: "state_mismatch",
        details: {
            expiresAt: parsedData.expiresAt
        },
        errorURL: parsedData.errorURL
    });
    return parsedData;
}
;
}),
"[project]/examples/nextjs/node_modules/better-auth/dist/utils/constants.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DEFAULT_SECRET",
    ()=>DEFAULT_SECRET
]);
//#region src/utils/constants.ts
const DEFAULT_SECRET = "better-auth-secret-12345678901234567890";
;
}),
"[project]/examples/nextjs/node_modules/better-auth/dist/utils/date.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getDate",
    ()=>getDate
]);
//#region src/utils/date.ts
const getDate = (span, unit = "ms")=>{
    return new Date(Date.now() + (unit === "sec" ? span * 1e3 : span));
};
;
}),
"[project]/examples/nextjs/node_modules/better-auth/dist/utils/hide-metadata.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "HIDE_METADATA",
    ()=>HIDE_METADATA
]);
//#region src/utils/hide-metadata.ts
const HIDE_METADATA = {
    scope: "server"
};
;
}),
"[project]/examples/nextjs/node_modules/better-auth/dist/utils/is-promise.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "isPromise",
    ()=>isPromise
]);
//#region src/utils/is-promise.ts
function isPromise(obj) {
    return !!obj && (typeof obj === "object" || typeof obj === "function") && typeof obj.then === "function";
}
;
}),
"[project]/examples/nextjs/node_modules/better-auth/dist/utils/password.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "assertPasswordNotTooLong",
    ()=>assertPasswordNotTooLong,
    "assertPasswordNotTooShort",
    ()=>assertPasswordNotTooShort,
    "checkPassword",
    ()=>checkPassword,
    "resetCredentialPassword",
    ()=>resetCredentialPassword,
    "shouldRequirePassword",
    ()=>shouldRequirePassword,
    "validatePassword",
    ()=>validatePassword
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$transaction$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/context/transaction.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/error/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/error/codes.mjs [app-route] (ecmascript)");
;
;
//#region src/utils/password.ts
function assertPasswordNotTooShort(ctx, password) {
    if (password.length < ctx.context.password.config.minPasswordLength) {
        ctx.context.logger.warn("Password is too short");
        throw __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"].from("BAD_REQUEST", __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BASE_ERROR_CODES"].PASSWORD_TOO_SHORT);
    }
}
function assertPasswordNotTooLong(ctx, password) {
    if (password.length > ctx.context.password.config.maxPasswordLength) {
        ctx.context.logger.warn("Password is too long");
        throw __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"].from("BAD_REQUEST", __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BASE_ERROR_CODES"].PASSWORD_TOO_LONG);
    }
}
/**
* Sets a user's credential password after a reset, revoking their sessions
* when `emailAndPassword.revokeSessionsOnPasswordReset` is enabled.
*
* `consumeResetToken` spends the single-use reset token or OTP and throws when
* it is no longer valid. It runs first inside the same transaction as
* revocation and the password write, so a failure in any of them leaves all
* three unchanged and the user can retry. Verification values held only in
* secondary storage are consumed with `getAndDelete`, which can't roll back,
* so a later failure there still spends the token. Secondary-storage sessions are
* removed by an after-commit hook, so they can't roll back with the write.
* Sessions are revoked before the write so that on an adapter without
* transactions a failure still keeps the old password rather than committing a
* new one while existing sessions stay valid.
*/ async function resetCredentialPassword(ctx, userId, passwordHash, consumeResetToken) {
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$context$2f$transaction$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["runWithTransaction"])(ctx.context.adapter, async ()=>{
        await consumeResetToken?.();
        if (ctx.context.options.emailAndPassword?.revokeSessionsOnPasswordReset) await ctx.context.internalAdapter.deleteUserSessions(userId);
        if (!await ctx.context.internalAdapter.findCredentialAccount(userId)) {
            await ctx.context.internalAdapter.createAccount({
                userId,
                providerId: "credential",
                accountId: userId,
                password: passwordHash
            });
            return;
        }
        await ctx.context.internalAdapter.updatePassword(userId, passwordHash);
    });
}
async function validatePassword(ctx, data) {
    assertPasswordNotTooLong(ctx, data.password);
    const credentialAccount = await ctx.context.internalAdapter.findCredentialAccount(data.userId);
    const currentPassword = credentialAccount?.password;
    if (!credentialAccount || !currentPassword) return false;
    return await ctx.context.password.verify({
        hash: currentPassword,
        password: data.password
    });
}
async function checkPassword(userId, c) {
    const password = c.body.password;
    if (typeof password === "string") assertPasswordNotTooLong(c, password);
    const credentialAccount = await c.context.internalAdapter.findCredentialAccount(userId);
    const currentPassword = credentialAccount?.password;
    if (!credentialAccount || !currentPassword || !password) {
        if (password) await c.context.password.hash(password);
        throw __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"].from("BAD_REQUEST", __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BASE_ERROR_CODES"].INVALID_PASSWORD);
    }
    if (!await c.context.password.verify({
        hash: currentPassword,
        password
    })) throw __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"].from("BAD_REQUEST", __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$codes$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BASE_ERROR_CODES"].INVALID_PASSWORD);
    return true;
}
async function shouldRequirePassword(ctx, userId, allowPasswordless) {
    if (!allowPasswordless) return true;
    const credentialAccount = await ctx.context.internalAdapter.findCredentialAccount(userId);
    return Boolean(credentialAccount?.password);
}
;
}),
"[project]/examples/nextjs/node_modules/better-auth/dist/utils/request.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "safeCloneRequest",
    ()=>safeCloneRequest
]);
//#region src/utils/request.ts
function safeCloneRequest(request) {
    if (!request) return;
    try {
        return request.clone();
    } catch  {
        return new Request(request.url, {
            cache: request.cache,
            credentials: request.credentials,
            headers: request.headers,
            integrity: request.integrity,
            keepalive: request.keepalive,
            method: request.method,
            mode: request.mode,
            redirect: request.redirect,
            referrer: request.referrer,
            referrerPolicy: request.referrerPolicy,
            signal: request.signal
        });
    }
}
;
}),
"[project]/examples/nextjs/node_modules/better-auth/dist/utils/time.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ms",
    ()=>ms,
    "sec",
    ()=>sec
]);
//#region src/utils/time.ts
const SEC = 1e3;
const MIN = SEC * 60;
const HOUR = MIN * 60;
const DAY = HOUR * 24;
const WEEK = DAY * 7;
const MONTH = DAY * 30;
const YEAR = DAY * 365.25;
const REGEX = /^(\+|\-)? ?(\d+|\d+\.\d+) ?(seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|months?|mo|years?|yrs?|y)(?: (ago|from now))?$/i;
function parse(value) {
    const match = REGEX.exec(value);
    if (!match || match[4] && match[1]) throw new TypeError(`Invalid time string format: "${value}". Use formats like "7d", "30m", "1 hour", etc.`);
    const n = parseFloat(match[2]);
    const unit = match[3].toLowerCase();
    let result;
    switch(unit){
        case "years":
        case "year":
        case "yrs":
        case "yr":
        case "y":
            result = n * YEAR;
            break;
        case "months":
        case "month":
        case "mo":
            result = n * MONTH;
            break;
        case "weeks":
        case "week":
        case "w":
            result = n * WEEK;
            break;
        case "days":
        case "day":
        case "d":
            result = n * DAY;
            break;
        case "hours":
        case "hour":
        case "hrs":
        case "hr":
        case "h":
            result = n * HOUR;
            break;
        case "minutes":
        case "minute":
        case "mins":
        case "min":
        case "m":
            result = n * MIN;
            break;
        case "seconds":
        case "second":
        case "secs":
        case "sec":
        case "s":
            result = n * SEC;
            break;
        default:
            throw new TypeError(`Unknown time unit: "${unit}"`);
    }
    if (match[1] === "-" || match[4] === "ago") return -result;
    return result;
}
/**
* Parse a time string and return the value in milliseconds.
*
* @param value - A time string like "7d", "30m", "1 hour", "2 hours ago"
* @returns The parsed value in milliseconds
* @throws TypeError if the string format is invalid
*
* @example
* ms("1d")          // 86400000
* ms("2 hours")     // 7200000
* ms("30s")         // 30000
* ms("2 hours ago") // -7200000
*/ function ms(value) {
    return parse(value);
}
/**
* Parse a time string and return the value in seconds.
*
* @param value - A time string like "7d", "30m", "1 hour", "2 hours ago"
* @returns The parsed value in seconds (rounded)
* @throws TypeError if the string format is invalid
*
* @example
* sec("1d")          // 86400
* sec("2 hours")     // 7200
* sec("-30s")        // -30
* sec("2 hours ago") // -7200
*/ function sec(value) {
    return Math.round(parse(value) / 1e3);
}
;
}),
"[project]/examples/nextjs/node_modules/better-auth/dist/utils/url.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getBaseURL",
    ()=>getBaseURL,
    "getHost",
    ()=>getHost,
    "getHostFromSource",
    ()=>getHostFromSource,
    "getOrigin",
    ()=>getOrigin,
    "getProtocol",
    ()=>getProtocol,
    "getProtocolFromSource",
    ()=>getProtocolFromSource,
    "isDynamicBaseURLConfig",
    ()=>isDynamicBaseURLConfig,
    "isRequestLike",
    ()=>isRequestLike,
    "matchesHostPattern",
    ()=>matchesHostPattern,
    "resolveBaseURL",
    ()=>resolveBaseURL,
    "resolveDynamicBaseURL",
    ()=>resolveDynamicBaseURL,
    "trimTrailingSlashes",
    ()=>trimTrailingSlashes
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$wildcard$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/better-auth/dist/utils/wildcard.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$env$2d$impl$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/env/env-impl.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/error/index.mjs [app-route] (ecmascript) <locals>");
;
;
;
//#region src/utils/url.ts
const SLASH_CHAR_CODE = "/".charCodeAt(0);
/**
* Minimal loopback check for dev scheme inference only. Reachable from
* `client/config.ts` via `getBaseURL`, so we MUST NOT import the full
* `@better-auth/core/utils/host` classifier here: its `utils/ip` dependency
* on zod would leak into the client bundle (see `e2e/smoke/test/vite.spec.ts`).
*
* Server-side SSRF/loopback checks (oauth redirect matching, trusted-origin
* resolution, electron fetch gate) continue to use the authoritative
* `isLoopbackHost` from `@better-auth/core/utils/host`. This helper's only
* job is picking `http` vs `https` for dev ergonomics.
*/ function isLoopbackForDevScheme(host) {
    const hostname = host.replace(/:\d+$/, "").replace(/^\[|\]$/g, "").toLowerCase();
    return hostname === "localhost" || hostname.endsWith(".localhost") || hostname === "::1" || hostname.startsWith("127.");
}
function trimTrailingSlashes(value) {
    let end = value.length;
    while(end > 0 && value.charCodeAt(end - 1) === SLASH_CHAR_CODE)end--;
    return end === value.length ? value : value.slice(0, end);
}
function checkHasPath(url) {
    try {
        return (trimTrailingSlashes(new URL(url).pathname) || "/") !== "/";
    } catch  {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["BetterAuthError"](`Invalid base URL: ${url}. Please provide a valid base URL.`);
    }
}
function assertHasProtocol(url) {
    try {
        const parsedUrl = new URL(url);
        if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["BetterAuthError"](`Invalid base URL: ${url}. URL must include 'http://' or 'https://'`);
    } catch (error) {
        if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["BetterAuthError"]) throw error;
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["BetterAuthError"](`Invalid base URL: ${url}. Please provide a valid base URL.`, {
            cause: error
        });
    }
}
function withPath(url, path = "/api/auth") {
    assertHasProtocol(url);
    if (checkHasPath(url)) return url;
    const trimmedUrl = trimTrailingSlashes(url);
    if (!path || path === "/") return trimmedUrl;
    path = path.startsWith("/") ? path : `/${path}`;
    return `${trimmedUrl}${path}`;
}
function validateProxyHeader(header, type) {
    if (!header || header.trim() === "") return false;
    if (type === "proto") return header === "http" || header === "https";
    if (type === "host") {
        if ([
            /\.\./,
            /\0/,
            /[\s]/,
            /^[.]/,
            /[<>'"]/,
            /javascript:/i,
            /file:/i,
            /data:/i
        ].some((pattern)=>pattern.test(header))) return false;
        return /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*(:[0-9]{1,5})?$/.test(header) || /^(\d{1,3}\.){3}\d{1,3}(:[0-9]{1,5})?$/.test(header) || /^\[[0-9a-fA-F:]+\](:[0-9]{1,5})?$/.test(header) || /^localhost(:[0-9]{1,5})?$/i.test(header);
    }
    return false;
}
function getBaseURL(url, path, request, loadEnv, trustedProxyHeaders) {
    if (url) return withPath(url, path);
    if (loadEnv !== false) {
        const fromEnv = __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$env$2d$impl$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["env"].BETTER_AUTH_URL || __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$env$2d$impl$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["env"].NEXT_PUBLIC_BETTER_AUTH_URL || __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$env$2d$impl$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["env"].PUBLIC_BETTER_AUTH_URL || __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$env$2d$impl$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["env"].NUXT_PUBLIC_BETTER_AUTH_URL || __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$env$2d$impl$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["env"].NUXT_PUBLIC_AUTH_URL || (__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$env$2d$impl$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["env"].BASE_URL !== "/" ? __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$env$2f$env$2d$impl$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["env"].BASE_URL : void 0);
        if (fromEnv) return withPath(fromEnv, path);
    }
    const fromRequest = request?.headers.get("x-forwarded-host");
    const fromRequestProto = request?.headers.get("x-forwarded-proto");
    if (fromRequest && fromRequestProto && trustedProxyHeaders) {
        if (validateProxyHeader(fromRequestProto, "proto") && validateProxyHeader(fromRequest, "host")) try {
            return withPath(`${fromRequestProto}://${fromRequest}`, path);
        } catch (_error) {}
    }
    if (request) {
        const url = getOrigin(request.url);
        if (!url) throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["BetterAuthError"]("Could not get origin from request. Please provide a valid base URL.");
        return withPath(url, path);
    }
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
}
function getOrigin(url) {
    try {
        const parsedUrl = new URL(url);
        return parsedUrl.origin === "null" ? null : parsedUrl.origin;
    } catch  {
        return null;
    }
}
function getProtocol(url) {
    try {
        return new URL(url).protocol;
    } catch  {
        return null;
    }
}
function getHost(url) {
    try {
        return new URL(url).host;
    } catch  {
        return null;
    }
}
/**
* Checks if the baseURL config is a dynamic config object
*/ function isDynamicBaseURLConfig(config) {
    return typeof config === "object" && config !== null && "allowedHosts" in config && Array.isArray(config.allowedHosts);
}
/**
* Check if a value is a `Request`
* - `instanceof`: works for native Request instances
* - `toString`: handles where instanceof check fails but the object is still a
*   valid Request (e.g. cross-realm, polyfills). Paired with a shape check so
*   an object that only spoofs `Symbol.toStringTag` without the real shape is
*   rejected before downstream code tries to read `.headers` / `.url`.
*
* @param value The value to check
* @returns `true` if the value is a Request instance
*/ function isRequestLike(value) {
    if (value instanceof Request) return true;
    if (typeof value !== "object" || value === null || Object.prototype.toString.call(value) !== "[object Request]") return false;
    const v = value;
    return typeof v.url === "string" && typeof v.headers === "object" && v.headers !== null && typeof v.headers.get === "function";
}
/**
* Extracts the host from a `Request` or `Headers`.
* Honors `x-forwarded-host` only when `trustedProxyHeaders` is enabled,
* then falls back to the `host` header and finally the request URL.
*/ function getHostFromSource(source, trustedProxyHeaders) {
    const headers = isRequestLike(source) ? source.headers : source;
    if (trustedProxyHeaders) {
        const forwardedHost = headers.get("x-forwarded-host");
        if (forwardedHost && validateProxyHeader(forwardedHost, "host")) return forwardedHost;
    }
    const host = headers.get("host");
    if (host && validateProxyHeader(host, "host")) return host;
    if (isRequestLike(source)) try {
        return new URL(source.url).host;
    } catch  {
        return null;
    }
    return null;
}
/**
* Extracts the protocol from a `Request` or `Headers`.
* Honors `x-forwarded-proto` only when `trustedProxyHeaders` is enabled,
* then falls back to the request URL, then to "https".
*/ function getProtocolFromSource(source, configProtocol, trustedProxyHeaders) {
    if (configProtocol === "http" || configProtocol === "https") return configProtocol;
    const headers = isRequestLike(source) ? source.headers : source;
    if (trustedProxyHeaders) {
        const forwardedProto = headers.get("x-forwarded-proto");
        if (forwardedProto && validateProxyHeader(forwardedProto, "proto")) return forwardedProto;
    }
    if (isRequestLike(source)) try {
        const url = new URL(source.url);
        if (url.protocol === "http:" || url.protocol === "https:") return url.protocol.slice(0, -1);
    } catch  {}
    const host = getHostFromSource(source, trustedProxyHeaders);
    if (host && isLoopbackForDevScheme(host)) return "http";
    return "https";
}
/**
* Matches a hostname against a host pattern.
* Supports wildcard patterns like `*.vercel.app` or `preview-*.myapp.com`.
*
* @param host The hostname to test (e.g., "myapp.com", "preview-123.vercel.app")
* @param pattern The host pattern (e.g., "myapp.com", "*.vercel.app")
* @returns {boolean} true if the host matches the pattern, false otherwise.
*
* @example
* ```ts
* matchesHostPattern("myapp.com", "myapp.com") // true
* matchesHostPattern("preview-123.vercel.app", "*.vercel.app") // true
* matchesHostPattern("preview-123.myapp.com", "preview-*.myapp.com") // true
* matchesHostPattern("evil.com", "myapp.com") // false
* ```
*/ const matchesHostPattern = (host, pattern)=>{
    if (!host || !pattern) return false;
    const normalizedHost = host.replace(/^https?:\/\//, "").split("/")[0].toLowerCase();
    const normalizedPattern = pattern.replace(/^https?:\/\//, "").split("/")[0].toLowerCase();
    if (normalizedPattern.includes("*") || normalizedPattern.includes("?")) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$better$2d$auth$2f$dist$2f$utils$2f$wildcard$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["wildcardMatch"])(normalizedPattern)(normalizedHost);
    return normalizedHost.toLowerCase() === normalizedPattern.toLowerCase();
};
/**
* Resolves the base URL from a dynamic config based on the incoming request.
* Validates the derived host against the allowedHosts allowlist.
*
* @param config The dynamic base URL config
* @param request The incoming request
* @param basePath The base path to append
* @returns The resolved base URL with path
* @throws BetterAuthError if host is not in allowedHosts and no fallback is set
*/ function resolveDynamicBaseURL(config, source, basePath, trustedProxyHeaders) {
    const host = getHostFromSource(source, trustedProxyHeaders);
    if (!host) {
        if (config.fallback) return withPath(config.fallback, basePath);
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["BetterAuthError"]("Could not determine host from request headers. Please provide a fallback URL in your baseURL config.");
    }
    if (config.allowedHosts.some((pattern)=>matchesHostPattern(host, pattern))) return withPath(`${getProtocolFromSource(source, config.protocol, trustedProxyHeaders)}://${host}`, basePath);
    if (config.fallback) return withPath(config.fallback, basePath);
    throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["BetterAuthError"](`Host "${host}" is not in the allowed hosts list. Allowed hosts: ${config.allowedHosts.join(", ")}. Add this host to your allowedHosts config or provide a fallback URL.`);
}
/**
* Resolves the base URL from any config type (static string or dynamic object).
* This is the main entry point for base URL resolution.
*
* @param config The base URL config (string or object)
* @param basePath The base path to append
* @param request Optional request for dynamic resolution
* @param loadEnv Whether to load from environment variables
* @param trustedProxyHeaders Whether to trust proxy headers (for legacy behavior)
* @returns The resolved base URL with path
*/ function resolveBaseURL(config, basePath, source, loadEnv, trustedProxyHeaders) {
    if (isDynamicBaseURLConfig(config)) {
        if (source) return resolveDynamicBaseURL(config, source, basePath, trustedProxyHeaders);
        if (config.fallback) return withPath(config.fallback, basePath);
        return getBaseURL(void 0, basePath, void 0, loadEnv, trustedProxyHeaders);
    }
    const request = isRequestLike(source) ? source : void 0;
    if (typeof config === "string") return getBaseURL(config, basePath, request, loadEnv, trustedProxyHeaders);
    return getBaseURL(void 0, basePath, request, loadEnv, trustedProxyHeaders);
}
;
}),
"[project]/examples/nextjs/node_modules/better-auth/dist/utils/validate-user-info.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "assertValidUserInfo",
    ()=>assertValidUserInfo,
    "assertValidUserInfoSource",
    ()=>assertValidUserInfoSource
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/core/dist/error/index.mjs [app-route] (ecmascript) <locals>");
;
//#region src/utils/validate-user-info.ts
function assertValidUserInfoSource(source) {
    if (!source?.method) throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"]("FORBIDDEN", {
        code: "validation_source_missing",
        message: "User validation source is required"
    });
    if (source.method === "oauth" && !source.oauth?.providerId) throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"]("FORBIDDEN", {
        code: "validation_source_missing",
        message: "OAuth user validation source requires oauth.providerId"
    });
    if ((source.method === "sso-oidc" || source.method === "sso-saml") && !source.sso?.providerId) throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"]("FORBIDDEN", {
        code: "validation_source_missing",
        message: "SSO user validation source requires sso.providerId"
    });
}
/**
* Invoke the application's `user.validateUserInfo` gate and throw a `403`
* {@link APIError} if it rejects.
*
* Fails closed: if the hook throws, provisioning is rejected rather than
* silently allowed.
*/ async function assertValidUserInfo(ctx, data) {
    const validate = ctx.context.options.user?.validateUserInfo;
    if (!validate) return;
    assertValidUserInfoSource(data.source);
    let result;
    try {
        result = await validate(data, ctx);
    } catch (error) {
        ctx.context.logger.error("validateUserInfo callback threw", error);
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"]("FORBIDDEN", {
            code: "validation_failed",
            message: "User validation failed"
        });
    }
    if (result?.error) throw new __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$core$2f$dist$2f$error$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["APIError"]("FORBIDDEN", {
        code: result.error,
        message: result.errorDescription || result.error
    });
}
;
}),
"[project]/examples/nextjs/node_modules/better-auth/dist/utils/wildcard.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "wildcardMatch",
    ()=>wildcardMatch
]);
//#region src/utils/wildcard.ts
/**
* Escapes a character if it has a special meaning in regular expressions
* and returns the character as is if it doesn't
*/ function escapeRegExpChar(char) {
    if (char === "-" || char === "^" || char === "$" || char === "+" || char === "." || char === "(" || char === ")" || char === "|" || char === "[" || char === "]" || char === "{" || char === "}" || char === "*" || char === "?" || char === "\\") return `\\${char}`;
    else return char;
}
/**
* Escapes all characters in a given string that have a special meaning in regular expressions
*/ function escapeRegExpString(str) {
    let result = "";
    for(let i = 0; i < str.length; i++)result += escapeRegExpChar(str[i]);
    return result;
}
/**
* Transforms one or more glob patterns into a RegExp pattern
*/ function transform(pattern, separator = true) {
    if (Array.isArray(pattern)) return `(?:${pattern.map((p)=>`^${transform(p, separator)}$`).join("|")})`;
    let separatorSplitter = "";
    let separatorMatcher = "";
    let wildcard = ".";
    if (separator === true) {
        separatorSplitter = "/";
        separatorMatcher = "[/\\\\]";
        wildcard = "[^/\\\\]";
    } else if (separator) {
        separatorSplitter = separator;
        separatorMatcher = escapeRegExpString(separatorSplitter);
        if (separatorMatcher.length > 1) {
            separatorMatcher = `(?:${separatorMatcher})`;
            wildcard = `((?!${separatorMatcher}).)`;
        } else wildcard = `[^${separatorMatcher}]`;
    }
    const requiredSeparator = separator ? `${separatorMatcher}+?` : "";
    const optionalSeparator = separator ? `${separatorMatcher}*?` : "";
    const segments = separator ? pattern.split(separatorSplitter) : [
        pattern
    ];
    let result = "";
    for(let s = 0; s < segments.length; s++){
        const segment = segments[s];
        const nextSegment = segments[s + 1];
        let currentSeparator = "";
        if (!segment && s > 0) continue;
        if (separator) if (s === segments.length - 1) currentSeparator = optionalSeparator;
        else if (nextSegment !== "**") currentSeparator = requiredSeparator;
        else currentSeparator = "";
        if (separator && segment === "**") {
            if (currentSeparator) {
                result += s === 0 ? "" : currentSeparator;
                result += `(?:${wildcard}*?${currentSeparator})*?`;
            }
            continue;
        }
        for(let c = 0; c < segment.length; c++){
            const char = segment[c];
            if (char === "\\") {
                if (c < segment.length - 1) {
                    result += escapeRegExpChar(segment[c + 1]);
                    c++;
                }
            } else if (char === "?") result += wildcard;
            else if (char === "*") result += `${wildcard}*?`;
            else result += escapeRegExpChar(char);
        }
        result += currentSeparator;
    }
    return result;
}
function isMatch(regexp, sample) {
    if (typeof sample !== "string") throw new TypeError(`Sample must be a string, but ${typeof sample} given`);
    return regexp.test(sample);
}
/**
* Compiles one or more glob patterns into a RegExp and returns an isMatch function.
* The isMatch function takes a sample string as its only argument and returns `true`
* if the string matches the pattern(s).
*
* ```js
* wildcardMatch('src/*.js')('src/index.js') //=> true
* ```
*
* ```js
* const isMatch = wildcardMatch('*.example.com', '.')
* isMatch('foo.example.com') //=> true
* isMatch('foo.bar.com') //=> false
* ```
*/ function wildcardMatch(pattern, options) {
    if (typeof pattern !== "string" && !Array.isArray(pattern)) throw new TypeError(`The first argument must be a single pattern string or an array of patterns, but ${typeof pattern} given`);
    if (typeof options === "string" || typeof options === "boolean") options = {
        separator: options
    };
    if (arguments.length === 2 && !(typeof options === "undefined" || typeof options === "object" && options !== null && !Array.isArray(options))) throw new TypeError(`The second argument must be an options object or a string/boolean separator, but ${typeof options} given`);
    options = options || {};
    if (options.separator === "\\") throw new Error("\\ is not a valid separator because it is used for escaping. Try setting the separator to `true` instead");
    const regexpPattern = transform(pattern, options.separator);
    const regexp = new RegExp(`^${regexpPattern}$`, options.flags);
    const fn = isMatch.bind(null, regexp);
    fn.options = options;
    fn.pattern = pattern;
    fn.regexp = regexp;
    return fn;
}
;
}),
];})()

//# sourceMappingURL=1xpz_better-auth_dist_16ybz_-y8rcqo._.js.map