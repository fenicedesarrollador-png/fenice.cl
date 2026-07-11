import { createClient } from "@/lib/supabase/public";
import { hasUsableSupabasePublicConfig } from "@/lib/supabase/config";
import { fetchWithTimeout } from "@/lib/getSiteConfig";
import { EQUIPO_FALLBACK } from "@/lib/config";

export type MiembroEquipo = {
  id: string;
  nombre: string;
  cargo: string;
  email: string | null;
  foto_url: string | null;
  bio: string | null;
  linkedin_url?: string | null;
  orden: number;
};

export type ClienteEmpresa = {
  id: string;
  nombre: string;
  logo_url: string | null;
  sitio_web: string | null;
  testimonio: string | null;
  sector: string | null;
  descripcion: string | null;
  destacado: boolean | null;
  orden: number;
};

/** Equipo visible en /nosotros — tabla `equipo`, con fallback estático. */
export async function getEquipo(): Promise<MiembroEquipo[]> {
  if (hasUsableSupabasePublicConfig()) {
    try {
      const supabase = await createClient();
      const result = await fetchWithTimeout(
        supabase
          .from("equipo")
          .select("id, nombre, cargo, email, foto_url, bio, linkedin_url, orden")
          .eq("activo", true)
          .order("orden"),
        2500,
      );
      if (result?.data && result.data.length > 0) return result.data as MiembroEquipo[];
    } catch {}
  }
  return EQUIPO_FALLBACK.map((m) => ({ ...m, linkedin_url: null }));
}

/** Empresas cliente (sección de autoridad) — tabla `clientes`. */
export async function getClientes(): Promise<ClienteEmpresa[]> {
  if (!hasUsableSupabasePublicConfig()) return [];
  try {
    const supabase = await createClient();
    const result = await fetchWithTimeout(
      supabase
        .from("clientes")
        .select("id, nombre, logo_url, sitio_web, testimonio, sector, descripcion, destacado, orden")
        .eq("activo", true)
        .order("orden"),
      2500,
    );
    return (result?.data as ClienteEmpresa[]) ?? [];
  } catch {
    return [];
  }
}
