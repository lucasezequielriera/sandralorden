/**
 * Cambia la contraseña de un usuario en Supabase Auth (sin email).
 *
 * Uso:
 *   npm run admin:reset-password -- sandralordenfit@gmail.com "TuNuevaContraseña"
 *
 * Requiere .env.local con NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY.
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

function loadEnvLocal() {
  const path = resolve(process.cwd(), ".env.local");
  if (!existsSync(path)) return;
  const lines = readFileSync(path, "utf8").split("\n");
  for (const line of lines) {
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

const email = process.argv[2]?.trim().toLowerCase();
const password = process.argv[3];

if (!email || !password) {
  console.error("Uso: npm run admin:reset-password -- <email> <nueva-contraseña>");
  console.error("Ej:  npm run admin:reset-password -- sandralordenfit@gmail.com \"Lucas03122025\"");
  process.exit(1);
}

if (password.length < 8) {
  console.error("La contraseña debe tener al menos 8 caracteres.");
  process.exit(1);
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env.local");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const { data: listData, error: listError } = await supabase.auth.admin.listUsers({ perPage: 1000 });

if (listError) {
  console.error("Error al listar usuarios:", listError.message);
  process.exit(1);
}

const user = listData.users.find((u) => u.email?.toLowerCase() === email);

if (!user) {
  console.error(`No hay usuario con email: ${email}`);
  console.error("Usuarios en el proyecto:", listData.users.map((u) => u.email).join(", ") || "(ninguno)");
  process.exit(1);
}

const { data: updated, error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
  password,
});

if (updateError) {
  console.error("Error al actualizar:", updateError.message);
  process.exit(1);
}

console.log(`✓ Contraseña actualizada para ${updated.user.email}`);
console.log("  Inicio admin: /admin/login");
console.log("  Inicio cliente: /login");
