import { createClient } from "@/lib/supabase/server";

/**
 * Verifica que la petición venga de un admin autenticado (cookie de Supabase).
 * Las rutas /api/admin/* NO pasan por el proxy de auth, por lo que cada
 * route handler debe llamar a esta función antes de tocar datos.
 */
export async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { user: null, supabase: null } as const;
  return { user, supabase } as const;
}
