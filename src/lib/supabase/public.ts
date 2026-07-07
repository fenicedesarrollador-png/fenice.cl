import { createClient as createSupabaseClient, type SupabaseClient } from "@supabase/supabase-js";
import { getSupabasePublicConfig } from "@/lib/supabase/config";

// Cliente para lecturas públicas (RLS con anon key). A diferencia de
// `server.ts`, NO usa cookies(): así las páginas públicas pueden
// prerenderizarse como estáticas/ISR en vez de renderizarse en cada request.
let client: SupabaseClient | null = null;

export async function createClient(): Promise<SupabaseClient> {
  if (client) return client;
  const { url, anonKey } = getSupabasePublicConfig();
  client = createSupabaseClient(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
  return client;
}
