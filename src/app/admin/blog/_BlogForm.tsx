"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import SeoFieldsCounter from "../_components/SeoFieldsCounter";
import ImageUpload from "../_components/ImageUpload";
import { FormSection, Field, Toggle, FormActions } from "../_components/ui";
import { businessDateTimeToIso, toBusinessDateTimeInput } from "@/lib/dates";

function slugify(str: string) {
  return str.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

interface Post {
  id: string; titulo: string; slug: string; extracto?: string; contenido: string;
  imagen_destacada?: string; autor?: string; categoria?: string; palabras_clave?: string;
  publicado: boolean; fecha_publicacion?: string; meta_title?: string; meta_description?: string;
}

export default function BlogForm({ post }: { post?: Post }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [titulo, setTitulo] = useState(post?.titulo || "");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const metaTitle = (fd.get("meta_title") as string).trim();
    const metaDesc = (fd.get("meta_description") as string).trim();
    const publicado = fd.get("publicado") === "on";
    if (publicado && (!metaTitle || metaTitle.length > 60)) { setError("Para publicar, el Meta Title es obligatorio (máx. 60 caracteres)."); setLoading(false); return; }
    if (publicado && (!metaDesc || metaDesc.length > 155)) { setError("Para publicar, la Meta Description es obligatoria (máx. 155 caracteres)."); setLoading(false); return; }

    let publicationDate: string | null = null;
    try {
      publicationDate = publicado
        ? (fd.get("fecha_publicacion") ? businessDateTimeToIso(fd.get("fecha_publicacion") as string) : new Date().toISOString())
        : null;
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Fecha de publicación no válida.");
      setLoading(false);
      return;
    }
    const slug = post?.slug || slugify((fd.get("titulo") as string).trim());
    if (!slug || !(fd.get("titulo") as string).trim() || !(fd.get("contenido") as string).trim()) {
      setError("El artículo necesita un título válido y contenido.");
      setLoading(false);
      return;
    }
    const payload = {
      titulo: (fd.get("titulo") as string).trim(),
      slug,
      extracto: fd.get("extracto") as string,
      contenido: fd.get("contenido") as string,
      imagen_destacada: fd.get("imagen_destacada") as string,
      autor: (fd.get("autor") as string) || "Fenice SPA",
      categoria: fd.get("categoria") as string,
      palabras_clave: fd.get("palabras_clave") as string,
      publicado,
      fecha_publicacion: publicationDate,
      meta_title: metaTitle,
      meta_description: metaDesc,
      updated_at: new Date().toISOString(),
    };
    try {
      const supabase = createClient();
      const { error: dbError } = post
        ? await supabase.from("blog_posts").update(payload).eq("id", post.id)
        : await supabase.from("blog_posts").insert(payload);
      if (dbError) { setError(dbError.message); setLoading(false); return; }
      await Promise.all(["/", "/blog", `/blog/${payload.slug}`].map((path) =>
        fetch(`/api/revalidate?path=${encodeURIComponent(path)}`, { method: "POST" }).catch(() => {}),
      ));
      router.push("/admin/blog");
      router.refresh();
    } catch {
      setError("No se pudieron guardar los cambios. Revisa la conexión e inténtalo nuevamente.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-3xl">
      <FormSection title="Contenido del artículo">
        <Field label="Título" required>
          <input name="titulo" type="text" required value={titulo} onChange={(e) => setTitulo(e.target.value)} className="admin-input" placeholder="Título del artículo" />
        </Field>
        <Field label="Extracto" hint="Resumen breve que aparece en el listado del blog.">
          <textarea name="extracto" rows={2} defaultValue={post?.extracto} className="admin-input" />
        </Field>
        <Field label="Contenido" required hint="Markdown: ## Subtítulo, **negrita**, listas, tablas y [texto del enlace](/cotizacion).">
          <textarea name="contenido" rows={14} required defaultValue={post?.contenido} className="admin-input font-mono !text-[13px]" />
        </Field>
      </FormSection>

      <FormSection title="Imagen destacada">
        <ImageUpload bucket="blog" name="imagen_destacada" defaultUrl={post?.imagen_destacada} label="Portada del artículo" />
      </FormSection>

      <FormSection title="Detalles">
        <div className="grid sm:grid-cols-3 gap-4">
          <Field label="Autor">
            <input name="autor" type="text" defaultValue={post?.autor || "Fenice SPA"} className="admin-input" />
          </Field>
          <Field label="Categoría">
            <input name="categoria" type="text" defaultValue={post?.categoria} className="admin-input" placeholder="Ej: Industria" />
          </Field>
          <Field label="Fecha y hora de publicación" hint="Hora de Santiago. Una fecha futura programa el artículo; vacío publica al guardar.">
            <input name="fecha_publicacion" type="datetime-local" defaultValue={toBusinessDateTimeInput(post?.fecha_publicacion)} className="admin-input" />
          </Field>
        </div>
        <Field label="Temas del artículo" hint="Separados por coma. Referencia editorial interna.">
          <input name="palabras_clave" type="text" defaultValue={post?.palabras_clave} placeholder="petróleo a domicilio, combustible industrial, RM" className="admin-input" />
        </Field>
        <div className="pt-1">
          <Toggle name="publicado" defaultChecked={post?.publicado ?? false} label="Publicar o programar artículo" description="Con fecha futura se publica automáticamente a partir de esa hora. Desactivado guarda un borrador." />
        </div>
      </FormSection>

      <FormSection title="SEO" description="Obligatorio para publicar.">
        <SeoFieldsCounter name="meta_title" label="Meta Title" defaultValue={post?.meta_title || titulo} maxLength={60} hint="Título para Google." />
        <SeoFieldsCounter name="meta_description" label="Meta Description" defaultValue={post?.meta_description} maxLength={155} isTextArea hint="Resumen para buscadores." />
      </FormSection>

      <FormActions submitLabel={post ? "Guardar cambios" : "Crear post"} loading={loading} onCancel={() => router.back()} error={error} />
    </form>
  );
}
