/**
 * Apply SQL migrations in db/migrations/ against DATABASE_URL (.env or env).
 * Usage: node db/migrate.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

function loadEnvFile() {
  const envPath = path.join(root, ".env");
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    // Prefer .env for migrate so a stale local DATABASE_URL does not win.
    process.env[key] = value;
  }
}

loadEnvFile();

const connectionString =
  process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5433/vedha";

const migrationsDir = path.join(root, "db", "migrations");
const files = fs
  .readdirSync(migrationsDir)
  .filter((f) => f.endsWith(".sql"))
  .sort();

console.log(
  "Migrating:",
  connectionString.replace(/:\/\/([^:]+):([^@]+)@/, "://$1:***@")
);

const pool = new pg.Pool({ connectionString, max: 2 });

await pool.query(`
  CREATE TABLE IF NOT EXISTS schema_migrations (
    id TEXT PRIMARY KEY,
    applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
  );
`);

for (const file of files) {
  const id = file.replace(/\.sql$/, "");
  const { rows } = await pool.query("SELECT 1 FROM schema_migrations WHERE id = $1", [id]);
  if (rows.length) {
    console.log(`skip  ${file}`);
    continue;
  }
  const sql = fs.readFileSync(path.join(migrationsDir, file), "utf8");
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query(sql);
    await client.query("INSERT INTO schema_migrations (id) VALUES ($1)", [id]);
    await client.query("COMMIT");
    console.log(`apply ${file}`);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(`fail  ${file}`, error);
    await pool.end();
    process.exit(1);
  } finally {
    client.release();
  }
}

const { rows: cols } = await pool.query(`
  SELECT column_name, data_type
  FROM information_schema.columns
  WHERE table_schema = 'public' AND table_name = 'contacts'
  ORDER BY ordinal_position
`);
console.log(
  "contacts columns:",
  cols.map((c) => c.column_name).join(", ") || "(missing)"
);

await pool.end();
console.log("Migrations complete.");
