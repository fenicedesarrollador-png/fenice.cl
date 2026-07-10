import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  getSupabasePublicConfig,
  getSupabasePublicConfigError,
} from "@/lib/supabase/config";

function buildJsonResponse(body: { error: string } | { ok: true }, status = 200) {
  return NextResponse.json(body, { status });
}

export async function POST(request: Request) {
  const configError = getSupabasePublicConfigError();
  if (configError) {
    return buildJsonResponse({ error: configError }, 500);
  }

  let email = "";
  let password = "";

  try {
    const body = await request.json() as { email?: string; password?: string };
    email = String(body.email ?? "").trim().toLowerCase();
    password = String(body.password ?? "");
  } catch {
    return buildJsonResponse({ error: "Solicitud invalida." }, 400);
  }

  if (!email || !password) {
    return buildJsonResponse({ error: "Ingresa tu email y contraseña." }, 400);
  }

  const cookieStore = await cookies();
  const { url, anonKey } = getSupabasePublicConfig();
  let response = buildJsonResponse({ ok: true });

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookieStore.set(name, value, options);
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    return buildJsonResponse(
      { error: error?.message ?? "No fue posible iniciar sesión." },
      401,
    );
  }

  const { data: profile, error: profileError } = await supabase
    .from("admin_profiles")
    .select("activo")
    .eq("user_id", data.user.id)
    .maybeSingle();

  if (profileError) {
    response = buildJsonResponse(
      { error: "No se pudo verificar el perfil administrador." },
      500,
    );
    await supabase.auth.signOut();
    return response;
  }

  if (!profile?.activo) {
    response = buildJsonResponse({ error: "acceso_denegado" }, 403);
    await supabase.auth.signOut();
    return response;
  }

  return response;
}
