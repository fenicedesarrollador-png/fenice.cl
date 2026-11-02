import { cache } from "react";
import { createClient } from "@/lib/supabase/public";
import { hasUsableSupabasePublicConfig } from "@/lib/supabase/config";
import { publicationFilter } from "@/lib/blogPublication";

export type BlogPost = {
  id: string; slug: string; titulo: string; contenido: string;
  extracto: string | null; fecha_publicacion: string | null; updated_at: string | null;
  categoria: string | null; autor: string | null; imagen_destacada: string | null;
  meta_title: string | null; meta_description: string | null;
};

export type BlogCard = Omit<BlogPost, "contenido" | "meta_title" | "meta_description">;

export const getPublishedPosts = cache(async (): Promise<BlogCard[]> => {
  if (!hasUsableSupabasePublicConfig()) return [];
  const supabase = await createClient();
  const { data, error } = await supabase.from("blog_posts")
    .select("id, slug, titulo, extracto, fecha_publicacion, updated_at, categoria, autor, imagen_destacada")
    .eq("publicado", true).or(publicationFilter())
    .order("fecha_publicacion", { ascending: false, nullsFirst: false })
    .abortSignal(AbortSignal.timeout(4000));
  // Una caída de la base no debe reemplazar artículos indexados por un blog vacío.
  if (error) throw new Error("No se pudo consultar el blog.");
  return data ?? [];
});

export const getPublishedPost = cache(async (slug: string): Promise<BlogPost | null> => {
  if (!hasUsableSupabasePublicConfig()) return null;
  const supabase = await createClient();
  const { data, error } = await supabase.from("blog_posts")
    .select("id, slug, titulo, contenido, extracto, fecha_publicacion, updated_at, categoria, autor, imagen_destacada, meta_title, meta_description")
    .eq("slug", slug).eq("publicado", true).or(publicationFilter())
    .abortSignal(AbortSignal.timeout(4000)).maybeSingle();
  if (error) throw new Error("No se pudo consultar el artículo.");
  return data;
});
