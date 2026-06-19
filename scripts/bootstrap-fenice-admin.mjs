import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const EMAIL = "fenice@fenice.cl";
const PASSWORD = "Fenice2026!";
const NOMBRE = "Fenice";
const ROL = "superadmin";

function readEnvFile(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  const env = {};

  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    const value = trimmed.slice(idx + 1).trim();
    env[key] = value;
  }

  return env;
}

async function main() {
  const envPath = path.resolve(".env.local");
  if (!fs.existsSync(envPath)) {
    throw new Error(`No existe ${envPath}`);
  }

  const env = readEnvFile(envPath);
  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error("Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env.local");
  }

  if (url.includes("YOUR_PROJECT") || serviceRoleKey.includes("YOUR_SERVICE_ROLE_KEY")) {
    throw new Error("Tu .env.local tiene placeholders. Reemplaza las credenciales reales de Supabase antes de ejecutar este script.");
  }

  const supabase = createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: listedUsers, error: listError } = await supabase.auth.admin.listUsers();
  if (listError) {
    throw listError;
  }

  let user = listedUsers.users.find((item) => item.email?.toLowerCase() === EMAIL);

  if (!user) {
    const { data, error } = await supabase.auth.admin.createUser({
      email: EMAIL,
      password: PASSWORD,
      email_confirm: true,
      user_metadata: { nombre: NOMBRE },
    });

    if (error || !data.user) {
      throw error ?? new Error("No se pudo crear el usuario en Supabase Auth");
    }

    user = data.user;
    console.log(`Usuario Auth creado: ${user.id}`);
  } else {
    const { data, error } = await supabase.auth.admin.updateUserById(user.id, {
      password: PASSWORD,
      email_confirm: true,
      user_metadata: { ...(user.user_metadata ?? {}), nombre: NOMBRE },
    });

    if (error || !data.user) {
      throw error ?? new Error("No se pudo actualizar el usuario existente");
    }

    user = data.user;
    console.log(`Usuario Auth existente actualizado: ${user.id}`);
  }

  const { error: profileError } = await supabase.from("admin_profiles").upsert(
    {
      user_id: user.id,
      nombre: NOMBRE,
      rol: ROL,
      activo: true,
    },
    { onConflict: "user_id" }
  );

  if (profileError) {
    throw profileError;
  }

  console.log(`Perfil admin listo para ${EMAIL}`);
  console.log(`Password temporal: ${PASSWORD}`);
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
