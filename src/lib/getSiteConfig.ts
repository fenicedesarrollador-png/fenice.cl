import { createClient } from "@/lib/supabase/public";
import { hasUsableSupabasePublicConfig } from "@/lib/supabase/config";
import { SITE_CONFIG } from "@/lib/config";

export type SiteConfig = typeof SITE_CONFIG & Record<string, string>;

/**
 * Ejecuta una promesa (típicamente una query de Supabase) con un timeout.
 * Si tarda más de `ms`, resuelve a null para no dejar páginas SEO esperando.
 */
export async function fetchWithTimeout<T>(promise: PromiseLike<T>, ms = 2500): Promise<T | null> {
  try {
    return await Promise.race([
      Promise.resolve(promise),
      new Promise<null>((resolve) => setTimeout(() => resolve(null), ms)),
    ]);
  } catch {
    return null;
  }
}

let cache: SiteConfig | null = null;
let cacheTime = 0;
const CACHE_TTL = 60_000; // 1 minute

export async function getSiteConfig(): Promise<SiteConfig> {
  if (cache && Date.now() - cacheTime < CACHE_TTL) return cache;
  if (!hasUsableSupabasePublicConfig()) {
    return { ...SITE_CONFIG } as SiteConfig;
  }

  try {
    const supabase = await createClient();
    const result = await fetchWithTimeout(
      supabase.from("configuracion_sitio").select("clave, valor"),
      2500,
    );
    const data = result?.data;
    if (data && data.length > 0) {
      const merged: SiteConfig = { ...SITE_CONFIG } as SiteConfig;
      data.forEach(({ clave, valor }) => {
        (merged as Record<string, string>)[clave] = valor;
      });
      cache = merged;
      cacheTime = Date.now();
      return merged;
    }
  } catch {}
  return { ...SITE_CONFIG } as SiteConfig;
}
