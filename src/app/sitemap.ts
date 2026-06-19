import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";
import { COMUNAS, SERVICIOS } from "@/lib/config";

const BASE_URL = "https://fenice.cl";

const staticRoutes: MetadataRoute.Sitemap = [
  { url: `${BASE_URL}/`, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
  { url: `${BASE_URL}/cobertura`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
  { url: `${BASE_URL}/nosotros`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  { url: `${BASE_URL}/preguntas-frecuentes`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
  { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
  { url: `${BASE_URL}/testimonios`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  { url: `${BASE_URL}/contacto`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
  { url: `${BASE_URL}/productos`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
  ...SERVICIOS.map((s) => ({
    url: `${BASE_URL}/servicios/${s.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.9,
  })),
  ...COMUNAS.map((c) => ({
    url: `${BASE_URL}/cobertura/petroleo-a-domicilio-${c.slug}`,
    lastModified: new Date(),
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
    lastModified: new Date(),
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
      .filter((p) => !staticBlogSlugs.includes(p.slug))
      .map((p) => ({ url: `${BASE_URL}/blog/${p.slug}`, lastModified: new Date(p.updated_at), changeFrequency: "monthly" as const, priority: 0.7 }));
    productosDynamic = (productosRes.data || []).map((p) => ({
      url: `${BASE_URL}/productos/${p.slug}`, lastModified: new Date(p.updated_at), changeFrequency: "weekly" as const, priority: 0.75,
    }));
    eventosDynamic = (eventosRes.data || []).map((e) => ({
      url: `${BASE_URL}/eventos/${e.slug}`, lastModified: new Date(e.updated_at || new Date()), changeFrequency: "weekly" as const, priority: 0.6,
    }));
  } catch {}

  return [...staticRoutes, ...blogStatic, ...blogDynamic, ...productosDynamic, ...eventosDynamic];
}
