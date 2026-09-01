/**
 * Crea la tabla media_kit_settings en Supabase (una sola vez).
 *
 * 1. Supabase Dashboard → Project Settings → Database → Connection string (URI)
 * 2. Añade a .env.local:
 *    SUPABASE_DB_URL=postgresql://postgres.[ref]:[PASSWORD]@db.[ref].supabase.co:5432/postgres
 * 3. npm run db:migrate-media-kit
 */

import { readFileSync, existsSync } from "fs";
import { resolve } from "path";
import pg from "pg";

function loadEnvLocal() {
  const path = resolve(process.cwd(), ".env.local");
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  }
}

loadEnvLocal();

const dbUrl = process.env.SUPABASE_DB_URL?.trim();

if (!dbUrl) {
  console.error("Falta SUPABASE_DB_URL en .env.local");
  console.error("");
  console.error("Supabase → Project Settings → Database → Connection string (URI)");
  console.error("Ejemplo:");
  console.error(
    "SUPABASE_DB_URL=postgresql://postgres.[ref]:[PASSWORD]@db.[ref].supabase.co:5432/postgres"
  );
  process.exit(1);
}

const sqlPath = resolve(process.cwd(), "supabase/migrations/20260301_media_kit_settings.sql");
const sql = readFileSync(sqlPath, "utf8");

const client = new pg.Client({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });

try {
  await client.connect();
  await client.query(sql);
  console.log("✓ Migración media_kit_settings aplicada correctamente.");
} catch (err) {
  console.error("Error al aplicar migración:", err instanceof Error ? err.message : err);
  process.exit(1);
} finally {
  await client.end();
}
