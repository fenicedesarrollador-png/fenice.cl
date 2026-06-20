import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";
import { COMUNAS, SERVICIOS } from "@/lib/config";

const BASE_URL = "https://fenice.cl";

const staticRoutes: MetadataRoute.Sitemap = [
  { url: BASE_URL, changeFrequency: "weekly", priority: 1.0 },
  { url: `${BASE_URL}/petroleo-a-domicilio`, changeFrequency: "weekly", priority: 0.95 },
  { url: `${BASE_URL}/venta-petroleo-diesel`, changeFrequency: "weekly", priority: 0.95 },
  { url: `${BASE_URL}/empresas-faenas-flotas`, changeFrequency: "weekly", priority: 0.9 },
  { url: `${BASE_URL}/cotizacion`, changeFrequency: "weekly", priority: 0.95 },
  { url: `${BASE_URL}/contacto`, changeFrequency: "monthly", priority: 0.9 },
  { url: `${BASE_URL}/cobertura`, changeFrequency: "monthly", priority: 0.85 },
  { url: `${BASE_URL}/preguntas-frecuentes`, changeFrequency: "monthly", priority: 0.8 },
  { url: `${BASE_URL}/blog`, changeFrequency: "weekly", priority: 0.8 },
  { url: `${BASE_URL}/productos`, changeFrequency: "weekly", priority: 0.8 },
  { url: `${BASE_URL}/nosotros`, changeFrequency: "monthly", priority: 0.7 },
  { url: `${BASE_URL}/testimonios`, changeFrequency: "monthly", priority: 0.6 },
  { url: `${BASE_URL}/politica-de-privacidad`, changeFrequency: "yearly", priority: 0.2 },
  { url: `${BASE_URL}/aviso-legal`, changeFrequency: "yearly", priority: 0.2 },
  ...SERVICIOS.map((service) => ({
    url: `${BASE_URL}/servicios/${service.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.9,
  })),
  ...COMUNAS.map((comuna) => ({
    url: `${BASE_URL}/cobertura/petroleo-a-domicilio-${comuna.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.85,
  })),
];

const staticBlogSlugs = [
  "diferencia-entre-petroleo-y-diesel",
  "como-calcular-consumo-petroleo-industrial",
  "mantenimiento-de-estanques-de-petroleo",
  "normativa-sec-almacenamiento-combustible",
  "petroleo-para-generadores-guia-completa",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const blogStatic = staticBlogSlugs.map((slug) => ({
    url: `${BASE_URL}/blog/${slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  let blogDynamic: MetadataRoute.Sitemap = [];
  let productosDynamic: MetadataRoute.Sitemap = [];
  let eventosDynamic: MetadataRoute.Sitemap = [];

  try {
    const supabase = await createClient();
    const [blogRes, productosRes, eventosRes] = await Promise.all([
      supabase.from("blog_posts").select("slug, updated_at").eq("publicado", true),
      supabase.from("productos").select("slug, updated_at").eq("activo", true),
      supabase.from("eventos").select("slug, updated_at").eq("activo", true),
    ]);

    blogDynamic = (blogRes.data || [])
      .filter((post) => !staticBlogSlugs.includes(post.slug))
      .map((post) => ({
        url: `${BASE_URL}/blog/${post.slug}`,
        lastModified: post.updated_at ? new Date(post.updated_at) : undefined,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      }));

    productosDynamic = (productosRes.data || []).map((product) => ({
      url: `${BASE_URL}/productos/${product.slug}`,
      lastModified: product.updated_at ? new Date(product.updated_at) : undefined,
      changeFrequency: "weekly" as const,
      priority: 0.75,
    }));

    eventosDynamic = (eventosRes.data || []).map((event) => ({
      url: `${BASE_URL}/eventos/${event.slug}`,
      lastModified: event.updated_at ? new Date(event.updated_at) : undefined,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));
  } catch {}

  return [...staticRoutes, ...blogStatic, ...blogDynamic, ...productosDynamic, ...eventosDynamic];
}
