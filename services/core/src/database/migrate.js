import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { getPool } from "./pool.js";

const migrationsDir = join(process.cwd(), process.env.MIGRATIONS_DIR || "src/database/migrations");
let migrationPromise;

export function migrate() {
  migrationPromise ||= runMigrations();
  return migrationPromise;
}

async function runMigrations() {
  const pool = await getPool();
  const client = await pool.connect();
  try {
    await client.query(`
      create table if not exists schema_migrations (
        name text primary key,
        applied_at timestamptz not null default now()
      )
    `);

    const appliedResult = await client.query("select name from schema_migrations");
    const applied = new Set(appliedResult.rows.map((row) => row.name));
    const files = (await readdir(migrationsDir)).filter((file) => file.endsWith(".mjs")).sort();

    for (const file of files) {
      const migration = await import(pathToFileURL(join(migrationsDir, file)).href);
      const migrationName = migration.name || file.replace(/\.mjs$/, "");
      if (applied.has(migrationName)) continue;

      await client.query("begin");
      try {
        await migration.up(client);
        await client.query("insert into schema_migrations (name) values ($1)", [migrationName]);
        await client.query("commit");
      } catch (error) {
        await client.query("rollback");
        throw error;
      }
    }
  } finally {
    client.release();
  }
}
