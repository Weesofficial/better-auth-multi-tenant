module.exports = [
"[project]/examples/nextjs/node_modules/@better-auth/kysely-adapter/dist/d1-sqlite-dialect-m0f01-4z.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "D1SqliteDialect",
    ()=>D1SqliteDialect,
    "createD1IndexIntrospector",
    ()=>createD1IndexIntrospector
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$kysely$2d$adapter$2f$dist$2f$sqlite$2d$introspector$2d$DSCAP82F$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/@better-auth/kysely-adapter/dist/sqlite-introspector-DSCAP82F.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$kysely$2f$dist$2f$dialect$2f$sqlite$2f$sqlite$2d$adapter$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/kysely/dist/dialect/sqlite/sqlite-adapter.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$kysely$2f$dist$2f$dialect$2f$sqlite$2f$sqlite$2d$query$2d$compiler$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/examples/nextjs/node_modules/kysely/dist/dialect/sqlite/sqlite-query-compiler.js [app-route] (ecmascript)");
;
;
//#region src/d1-sqlite-dialect.ts
function quoteSqliteStringLiteral(value) {
    return `'${value.replaceAll("'", "''")}'`;
}
function createD1IndexIntrospector(database) {
    return async (tableNames)=>{
        if (tableNames.length === 0) return [];
        const indexes = (await database.batch(tableNames.map((tableName)=>database.prepare(`PRAGMA index_list(${quoteSqliteStringLiteral(tableName)})`)))).flatMap((indexList, tablePosition)=>{
            const tableName = tableNames[tablePosition];
            if (!tableName) return [];
            return indexList.results.map((index)=>({
                    ...index,
                    tableName
                }));
        });
        if (indexes.length === 0) return [];
        const indexColumns = await database.batch(indexes.map((index)=>database.prepare(`PRAGMA index_info(${quoteSqliteStringLiteral(index.name)})`)));
        return indexes.map((index, indexPosition)=>({
                columns: (indexColumns[indexPosition]?.results ?? []).map((column)=>({
                        fullLength: column.name !== null,
                        name: column.name,
                        position: column.seqno
                    })),
                name: index.name,
                partial: index.partial !== 0,
                table: index.tableName,
                unique: index.unique !== 0,
                valid: true
            }));
    };
}
var D1SqliteAdapter = class extends __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$kysely$2f$dist$2f$dialect$2f$sqlite$2f$sqlite$2d$adapter$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SqliteAdapter"] {
    get supportsMultipleConnections() {
        return true;
    }
};
var D1SqliteDriver = class {
    #config;
    #connection;
    constructor(config){
        this.#config = {
            ...config
        };
    }
    async init() {
        this.#connection = new D1SqliteConnection(this.#config.database);
        if (this.#config.onCreateConnection) await this.#config.onCreateConnection(this.#connection);
    }
    async acquireConnection() {
        return this.#connection;
    }
    async beginTransaction() {
        throw new Error("D1 does not support interactive transactions. Use the D1 batch() API instead.");
    }
    async commitTransaction() {
        throw new Error("D1 does not support interactive transactions. Use the D1 batch() API instead.");
    }
    async rollbackTransaction() {
        throw new Error("D1 does not support interactive transactions. Use the D1 batch() API instead.");
    }
    async releaseConnection() {}
    async destroy() {}
};
var D1SqliteConnection = class {
    #db;
    constructor(db){
        this.#db = db;
    }
    async executeQuery(compiledQuery) {
        const results = await this.#db.prepare(compiledQuery.sql).bind(...compiledQuery.parameters).all();
        const numAffectedRows = results.meta.changes != null ? BigInt(results.meta.changes) : void 0;
        return {
            insertId: results.meta.last_row_id === void 0 || results.meta.last_row_id === null ? void 0 : BigInt(results.meta.last_row_id),
            rows: results?.results || [],
            numAffectedRows
        };
    }
    async *streamQuery() {
        throw new Error("D1 does not support streaming queries.");
    }
};
var D1SqliteIntrospector = class {
    #db;
    #d1;
    constructor(db, d1){
        this.#db = db;
        this.#d1 = d1;
    }
    async getSchemas() {
        return [];
    }
    async getTables(options = {
        withInternalKyselyTables: false
    }) {
        let query = this.#db.selectFrom("sqlite_master").where("type", "in", [
            "table",
            "view"
        ]).where("name", "not like", "sqlite_%").where("name", "not like", "_cf_%").select([
            "name",
            "type"
        ]).$castTo();
        if (!options.withInternalKyselyTables) query = query.where("name", "!=", __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$kysely$2d$adapter$2f$dist$2f$sqlite$2d$introspector$2d$DSCAP82F$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["o"]).where("name", "!=", __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$kysely$2d$adapter$2f$dist$2f$sqlite$2d$introspector$2d$DSCAP82F$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["a"]);
        const tables = await query.execute();
        if (tables.length === 0) return [];
        const statements = tables.map((table)=>this.#d1.prepare("SELECT * FROM pragma_table_info(?)").bind(table.name));
        const batchResults = await this.#d1.batch(statements);
        const rowidCandidates = tables.flatMap((table, index)=>{
            const column = (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$kysely$2d$adapter$2f$dist$2f$sqlite$2d$introspector$2d$DSCAP82F$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["r"])(batchResults[index]?.results ?? []);
            return column ? [
                {
                    index,
                    tableName: table.name,
                    column
                }
            ] : [];
        });
        const indexResults = rowidCandidates.length ? await this.#d1.batch(rowidCandidates.map(({ tableName })=>this.#d1.prepare(`PRAGMA index_list(${quoteSqliteStringLiteral(tableName)})`))) : [];
        const generatedColumns = new Map(rowidCandidates.filter((_, index)=>!indexResults[index]?.results?.some((row)=>row.origin === "pk")).map(({ index, column })=>[
                index,
                column
            ]));
        return tables.map((table, index)=>{
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f40$better$2d$auth$2f$kysely$2d$adapter$2f$dist$2f$sqlite$2d$introspector$2d$DSCAP82F$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["i"])(table, batchResults[index]?.results ?? [], generatedColumns.get(index));
        });
    }
    async getMetadata(options) {
        return {
            tables: await this.getTables(options)
        };
    }
};
var D1SqliteQueryCompiler = class extends __TURBOPACK__imported__module__$5b$project$5d2f$examples$2f$nextjs$2f$node_modules$2f$kysely$2f$dist$2f$dialect$2f$sqlite$2f$sqlite$2d$query$2d$compiler$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SqliteQueryCompiler"] {
};
var D1SqliteDialect = class {
    #config;
    constructor(config){
        this.#config = {
            ...config
        };
    }
    createDriver() {
        return new D1SqliteDriver(this.#config);
    }
    createQueryCompiler() {
        return new D1SqliteQueryCompiler();
    }
    createAdapter() {
        return new D1SqliteAdapter();
    }
    createIntrospector(db) {
        return new D1SqliteIntrospector(db, this.#config.database);
    }
};
;
}),
];

//# sourceMappingURL=1xpz_%40better-auth_kysely-adapter_dist_d1-sqlite-dialect-m0f01-4z_mjs_18gpz68g-ydlj._.js.map