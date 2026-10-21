module.exports = [
"[project]/examples/nextjs/node_modules/@better-auth/kysely-adapter/dist/bun-sqlite-dialect-DoOVo4ja.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BunSqliteDialect",
    ()=>BunSqliteDialect
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$kysely$2d$adapter$2f$dist$2f$sqlite$2d$introspector$2d$DSCAP82F$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/kysely-adapter/dist/sqlite-introspector-DSCAP82F.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$kysely$2f$dist$2f$query$2d$compiler$2f$compiled$2d$query$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/kysely/dist/query-compiler/compiled-query.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$kysely$2f$dist$2f$query$2d$compiler$2f$default$2d$query$2d$compiler$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/kysely/dist/query-compiler/default-query-compiler.js [app-rsc] (ecmascript)");
;
;
//#region src/bun-sqlite-dialect.ts
var BunSqliteAdapter = class {
    get supportsCreateIfNotExists() {
        return true;
    }
    get supportsTransactionalDdl() {
        return false;
    }
    get supportsReturning() {
        return true;
    }
    async acquireMigrationLock() {}
    async releaseMigrationLock() {}
    get supportsOutput() {
        return true;
    }
};
var BunSqliteDriver = class {
    #config;
    #connectionMutex = new ConnectionMutex();
    #db;
    #connection;
    constructor(config){
        this.#config = {
            ...config
        };
    }
    async init() {
        this.#db = this.#config.database;
        this.#connection = new BunSqliteConnection(this.#db);
        if (this.#config.onCreateConnection) await this.#config.onCreateConnection(this.#connection);
    }
    async acquireConnection() {
        await this.#connectionMutex.lock();
        return this.#connection;
    }
    async beginTransaction(connection) {
        await connection.executeQuery(__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$kysely$2f$dist$2f$query$2d$compiler$2f$compiled$2d$query$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CompiledQuery"].raw("begin"));
    }
    async commitTransaction(connection) {
        await connection.executeQuery(__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$kysely$2f$dist$2f$query$2d$compiler$2f$compiled$2d$query$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CompiledQuery"].raw("commit"));
    }
    async rollbackTransaction(connection) {
        await connection.executeQuery(__TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$kysely$2f$dist$2f$query$2d$compiler$2f$compiled$2d$query$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CompiledQuery"].raw("rollback"));
    }
    async releaseConnection() {
        this.#connectionMutex.unlock();
    }
    async destroy() {
        this.#db?.close();
    }
};
var BunSqliteConnection = class {
    #db;
    constructor(db){
        this.#db = db;
    }
    executeQuery(compiledQuery) {
        const { sql, parameters } = compiledQuery;
        const stmt = this.#db.prepare(sql);
        const params = parameters;
        if (stmt.columnNames.length > 0) return Promise.resolve({
            rows: stmt.all(...params)
        });
        const { changes, lastInsertRowid } = stmt.run(...params);
        return Promise.resolve({
            rows: [],
            numAffectedRows: BigInt(changes),
            insertId: typeof lastInsertRowid === "bigint" ? lastInsertRowid : BigInt(lastInsertRowid)
        });
    }
    async *streamQuery() {
        throw new Error("Streaming query is not supported by SQLite driver.");
    }
};
var ConnectionMutex = class {
    #promise;
    #resolve;
    async lock() {
        while(this.#promise !== void 0)await this.#promise;
        this.#promise = new Promise((resolve)=>{
            this.#resolve = resolve;
        });
    }
    unlock() {
        const resolve = this.#resolve;
        this.#promise = void 0;
        this.#resolve = void 0;
        resolve?.();
    }
};
var BunSqliteQueryCompiler = class extends __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$kysely$2f$dist$2f$query$2d$compiler$2f$default$2d$query$2d$compiler$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DefaultQueryCompiler"] {
    getCurrentParameterPlaceholder() {
        return "?";
    }
    getLeftIdentifierWrapper() {
        return "\"";
    }
    getRightIdentifierWrapper() {
        return "\"";
    }
    getAutoIncrement() {
        return "autoincrement";
    }
};
var BunSqliteDialect = class {
    #config;
    constructor(config){
        this.#config = {
            ...config
        };
    }
    createDriver() {
        return new BunSqliteDriver(this.#config);
    }
    createQueryCompiler() {
        return new BunSqliteQueryCompiler();
    }
    createAdapter() {
        return new BunSqliteAdapter();
    }
    createIntrospector(db) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$kysely$2d$adapter$2f$dist$2f$sqlite$2d$introspector$2d$DSCAP82F$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["t"])(db);
    }
};
;
}),
];

//# sourceMappingURL=1xpz_%40better-auth_kysely-adapter_dist_bun-sqlite-dialect-DoOVo4ja_mjs_0bgvtlg3zv-ge._.js.map