import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/public";
import { fetchWithTimeout } from "@/lib/getSiteConfig";
import { COMUNAS, SERVICIOS, SITE_CONFIG } from "@/lib/config";

const BASE_URL = SITE_CONFIG.site_url;

const staticRoutes: MetadataRoute.Sitemap = [
  // No se inventa lastModified en cada build. Las rutas dinámicas sí usan
  // updated_at real desde Supabase más abajo.
  { url: BASE_URL, changeFrequency: "weekly", priority: 1.0 },
  { url: `${BASE_URL}/petroleo-a-domicilio`, changeFrequency: "weekly", priority: 0.9 },
  { url: `${BASE_URL}/venta-petroleo-diesel`, changeFrequency: "weekly", priority: 0.95 },
  { url: `${BASE_URL}/venta-kerosene`, changeFrequency: "weekly", priority: 0.95 },
  { url: `${BASE_URL}/empresas-faenas-flotas`, changeFrequency: "weekly", priority: 0.9 },
  { url: `${BASE_URL}/cotizacion`, changeFrequency: "weekly", priority: 0.95 },
  { url: `${BASE_URL}/contacto`, changeFrequency: "monthly", priority: 0.9 },
  { url: `${BASE_URL}/cobertura`, changeFrequency: "monthly", priority: 0.85 },
  { url: `${BASE_URL}/preguntas-frecuentes`, changeFrequency: "monthly", priority: 0.8 },
  { url: `${BASE_URL}/blog`, changeFrequency: "weekly", priority: 0.8 },
  { url: `${BASE_URL}/nosotros`, changeFrequency: "monthly", priority: 0.7 },
  { url: `${BASE_URL}/clientes`, changeFrequency: "monthly", priority: 0.75 },
  { url: `${BASE_URL}/politica-de-privacidad`, changeFrequency: "yearly", priority: 0.2 },
  { url: `${BASE_URL}/aviso-legal`, changeFrequency: "yearly", priority: 0.2 },
  ...SERVICIOS.filter((service) => service.href.startsWith("/servicios/")).map((service) => ({
    url: `${BASE_URL}${service.href}`,
    changeFrequency: "monthly" as const,
    priority: 0.9,
  })),
  ...COMUNAS.map((comuna) => ({
    url: `${BASE_URL}/cobertura/petroleo-a-domicilio-${comuna.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.7,
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

  // /blog emite noindex mientras no tenga artículos → se EXCLUYE del sitemap
  // hasta que exista al menos un post publicado (evita listar una URL noindex).
  const hasBlogPosts = blogDynamic.length > 0;
  const routes = hasBlogPosts
    ? staticRoutes
    : staticRoutes.filter((r) => r.url !== `${BASE_URL}/blog`);

  return [...routes, ...blogDynamic, ...eventosDynamic];
}
