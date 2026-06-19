"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import SeoFieldsCounter from "../_components/SeoFieldsCounter";
import ImageUpload from "../_components/ImageUpload";

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
    const metaTitle = fd.get("meta_title") as string;
    const metaDesc = fd.get("meta_description") as string;
    const publicado = fd.get("publicado") === "on";

    if (publicado && (!metaTitle || metaTitle.length > 60)) {
      setError("Para publicar, el Meta Title es obligatorio (máx. 60 caracteres).");
      setLoading(false); return;
    }
    if (publicado && (!metaDesc || metaDesc.length > 155)) {
      setError("Para publicar, la Meta Description es obligatoria (máx. 155 caracteres).");
      setLoading(false); return;
    }

    const payload = {
      titulo: fd.get("titulo") as string,
      slug: post?.slug || slugify(fd.get("titulo") as string),
      extracto: fd.get("extracto") as string,
      contenido: fd.get("contenido") as string,
      imagen_destacada: fd.get("imagen_destacada") as string,
      autor: (fd.get("autor") as string) || "Fenice SPA",
      categoria: fd.get("categoria") as string,
      palabras_clave: fd.get("palabras_clave") as string,
      publicado,
      fecha_publicacion: publicado ? (fd.get("fecha_publicacion") as string || new Date().toISOString()) : null,
      meta_title: metaTitle,
      meta_description: metaDesc,
      updated_at: new Date().toISOString(),
    };

    const supabase = createClient();
    const { error: dbError } = post
      ? await supabase.from("blog_posts").update(payload).eq("id", post.id)
      : await supabase.from("blog_posts").insert(payload);

    if (dbError) { setError(dbError.message); setLoading(false); return; }

    if (publicado) {
      await fetch(`/api/revalidate?path=/blog/${payload.slug}`, { method: "POST" }).catch(() => {});
      await fetch("/api/revalidate?path=/blog", { method: "POST" }).catch(() => {});
    }

    router.push("/admin/blog");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 bg-white border border-gray-200 rounded-xl p-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Título *</label>
        <input name="titulo" type="text" required value={titulo} onChange={(e) => setTitulo(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Extracto</label>
        <textarea name="extracto" rows={2} defaultValue={post?.extracto}
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Contenido *</label>
        <textarea name="contenido" rows={15} required defaultValue={post?.contenido}
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 resize-y font-mono" />
        <p className="text-xs text-gray-400 mt-1">Puedes usar Markdown básico: ## H2, **negrita**, - lista</p>
      </div>

      <ImageUpload bucket="blog" name="imagen_destacada" defaultUrl={post?.imagen_destacada} label="Imagen destacada" />

      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Autor</label>
          <input name="autor" type="text" defaultValue={post?.autor || "Fenice SPA"}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
          <input name="categoria" type="text" defaultValue={post?.categoria}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de publicación</label>
          <input name="fecha_publicacion" type="date" defaultValue={post?.fecha_publicacion?.slice(0, 10)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Palabras clave (SEO)</label>
        <input name="palabras_clave" type="text" defaultValue={post?.palabras_clave} placeholder="petróleo a domicilio, combustible industrial, RM"
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
      </div>

      <label className="flex items-center gap-2 text-sm cursor-pointer">
        <input name="publicado" type="checkbox" defaultChecked={post?.publicado ?? false} className="w-4 h-4 rounded accent-orange-500" />
        Publicar (visible en el sitio)
      </label>

      <hr className="border-gray-100" />
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">SEO (obligatorio para publicar)</p>

      <SeoFieldsCounter name="meta_title" label="Meta Title" defaultValue={post?.meta_title || titulo} maxLength={60} />
      <SeoFieldsCounter name="meta_description" label="Meta Description" defaultValue={post?.meta_description} maxLength={155} isTextArea />

      {error && <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">{error}</div>}

      <div className="flex gap-3">
        <button type="submit" disabled={loading}
          className="bg-orange-600 hover:bg-orange-700 disabled:opacity-60 text-white font-semibold px-6 py-2.5 rounded-lg text-sm transition-colors">
          {loading ? "Guardando..." : post ? "Guardar cambios" : "Crear post"}
        </button>
        <button type="button" onClick={() => router.back()}
          className="border border-gray-300 text-gray-700 font-semibold px-6 py-2.5 rounded-lg text-sm hover:bg-gray-50 transition-colors">
          Cancelar
        </button>
      </div>
    </form>
  );
}
