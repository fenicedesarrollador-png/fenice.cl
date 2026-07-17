import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/public";
import { fetchWithTimeout } from "@/lib/getSiteConfig";
import { COMUNAS, SERVICIOS, SITE_CONFIG } from "@/lib/config";

const BASE_URL = SITE_CONFIG.site_url;
const NOW = new Date();

const staticRoutes: MetadataRoute.Sitemap = [
  { url: BASE_URL, lastModified: NOW, changeFrequency: "weekly", priority: 1.0 },
  { url: `${BASE_URL}/petroleo-a-domicilio`, lastModified: NOW, changeFrequency: "weekly", priority: 0.95 },
  { url: `${BASE_URL}/venta-petroleo-diesel`, lastModified: NOW, changeFrequency: "weekly", priority: 0.95 },
  { url: `${BASE_URL}/venta-kerosene`, lastModified: NOW, changeFrequency: "weekly", priority: 0.95 },
  { url: `${BASE_URL}/empresas-faenas-flotas`, lastModified: NOW, changeFrequency: "weekly", priority: 0.9 },
  { url: `${BASE_URL}/cotizacion`, lastModified: NOW, changeFrequency: "weekly", priority: 0.95 },
  { url: `${BASE_URL}/contacto`, lastModified: NOW, changeFrequency: "monthly", priority: 0.9 },
  { url: `${BASE_URL}/cobertura`, lastModified: NOW, changeFrequency: "monthly", priority: 0.85 },
  { url: `${BASE_URL}/preguntas-frecuentes`, lastModified: NOW, changeFrequency: "monthly", priority: 0.8 },
  { url: `${BASE_URL}/blog`, lastModified: NOW, changeFrequency: "weekly", priority: 0.8 },
  { url: `${BASE_URL}/nosotros`, lastModified: NOW, changeFrequency: "monthly", priority: 0.7 },
  { url: `${BASE_URL}/clientes`, lastModified: NOW, changeFrequency: "weekly", priority: 0.75 },
  { url: `${BASE_URL}/testimonios`, lastModified: NOW, changeFrequency: "monthly", priority: 0.6 },
  { url: `${BASE_URL}/politica-de-privacidad`, lastModified: NOW, changeFrequency: "yearly", priority: 0.2 },
  { url: `${BASE_URL}/aviso-legal`, lastModified: NOW, changeFrequency: "yearly", priority: 0.2 },
  ...SERVICIOS.map((service) => ({
    url: `${BASE_URL}/servicios/${service.slug}`,
    lastModified: NOW,
    changeFrequency: "monthly" as const,
    priority: 0.9,
  })),
  ...COMUNAS.map((comuna) => ({
    url: `${BASE_URL}/cobertura/petroleo-a-domicilio-${comuna.slug}`,
    lastModified: NOW,
    changeFrequency: "monthly" as const,
    priority: 0.85,
  })),
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // El blog vive solo en Supabase (administrado desde /admin/blog).
  let blogDynamic: MetadataRoute.Sitemap = [];
  let eventosDynamic: MetadataRoute.Sitemap = [];

  try {
    const supabase = await createClient();
    // Timeout corto: si Supabase tarda, el sitemap igual responde con lo estático.
    const [blogRes, eventosRes] = await Promise.all([
      fetchWithTimeout(supabase.from("blog_posts").select("slug, updated_at").eq("publicado", true), 3000),
      fetchWithTimeout(supabase.from("eventos").select("slug, updated_at").eq("activo", true), 3000),
    ]);

    blogDynamic = (blogRes?.data || [])
      .map((post) => ({
        url: `${BASE_URL}/blog/${post.slug}`,
        lastModified: post.updated_at ? new Date(post.updated_at) : undefined,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      }));

    eventosDynamic = (eventosRes?.data || []).map((event) => ({
      url: `${BASE_URL}/eventos/${event.slug}`,
      lastModified: event.updated_at ? new Date(event.updated_at) : undefined,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));
  } catch {}

  return [...staticRoutes, ...blogDynamic, ...eventosDynamic];
}
