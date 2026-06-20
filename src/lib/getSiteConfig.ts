import { createClient } from "@/lib/supabase/server";
import { hasUsableSupabasePublicConfig } from "@/lib/supabase/config";
import { SITE_CONFIG } from "@/lib/config";

export type SiteConfig = typeof SITE_CONFIG & Record<string, string>;

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
    const { data } = await supabase.from("configuracion_sitio").select("clave, valor");
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
