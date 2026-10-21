import Database from "better-sqlite3";
import type { Tenant } from "better-auth-multi-tenant";

/** One SQLite file holds Better Auth's tables and the app's own `tenant` table. */
export const db = new Database("example.db");

export function ensureTenants() {
  db.exec(`CREATE TABLE IF NOT EXISTS tenant (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'active'
  )`);
  const insert = db.prepare(
    "INSERT OR IGNORE INTO tenant (id, slug, name, status) VALUES (?, ?, ?, ?)",
  );
  insert.run("t_acme", "acme", "Acme Corp", "active");
  insert.run("t_globex", "globex", "Globex", "active");
  insert.run("t_initech", "initech", "Initech", "suspended");
}

export function findTenant(slug: string): (Tenant & { name: string }) | null {
  return (
    (db.prepare("SELECT id, slug, name, status FROM tenant WHERE slug = ?").get(slug) as
      | (Tenant & { name: string })
      | undefined) ?? null
  );
}

export function listTenants() {
  return db.prepare("SELECT slug, name, status FROM tenant ORDER BY slug").all() as {
    slug: string;
    name: string;
    status: string;
  }[];
}
