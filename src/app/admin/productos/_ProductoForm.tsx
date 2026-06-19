"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import SeoFieldsCounter from "../_components/SeoFieldsCounter";
import ImageUpload from "../_components/ImageUpload";

function slugify(str: string) {
  return str
    .toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

interface Producto {
  id: string; nombre: string; slug: string; descripcion_corta?: string;
  descripcion?: string; imagen_url?: string; categoria?: string;
  precio_referencial?: number; destacado: boolean; activo: boolean;
  meta_title?: string; meta_description?: string;
}

export default function ProductoForm({ producto }: { producto?: Producto }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [nombre, setNombre] = useState(producto?.nombre || "");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const fd = new FormData(e.currentTarget);
    const metaTitle = fd.get("meta_title") as string;
    const metaDesc = fd.get("meta_description") as string;

    if (!metaTitle || metaTitle.length > 60) {
      setError("El Meta Title es obligatorio y debe tener 60 caracteres o menos.");
      setLoading(false); return;
    }
    if (!metaDesc || metaDesc.length > 155) {
      setError("La Meta Description es obligatoria y debe tener 155 caracteres o menos.");
      setLoading(false); return;
    }

    const payload = {
      nombre: fd.get("nombre") as string,
      slug: slugify(fd.get("nombre") as string),
      descripcion_corta: fd.get("descripcion_corta") as string,
      descripcion: fd.get("descripcion") as string,
      imagen_url: fd.get("imagen_url") as string,
      categoria: fd.get("categoria") as string,
      precio_referencial: fd.get("precio_referencial") ? Number(fd.get("precio_referencial")) : null,
      destacado: fd.get("destacado") === "on",
      activo: fd.get("activo") === "on",
      meta_title: metaTitle,
      meta_description: metaDesc,
      updated_at: new Date().toISOString(),
    };

    const supabase = createClient();
    const { error: dbError } = producto
      ? await supabase.from("productos").update(payload).eq("id", producto.id)
      : await supabase.from("productos").insert(payload);

    if (dbError) { setError(dbError.message); setLoading(false); return; }

    // Trigger ISR revalidation
    await fetch("/api/revalidate?path=/productos", { method: "POST" }).catch(() => {});
    router.push("/admin/productos");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 bg-white border border-gray-200 rounded-xl p-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
        <input name="nombre" type="text" required value={nombre} onChange={(e) => setNombre(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Descripción corta</label>
        <input name="descripcion_corta" type="text" defaultValue={producto?.descripcion_corta}
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Descripción completa</label>
        <textarea name="descripcion" rows={5} defaultValue={producto?.descripcion}
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none" />
      </div>

      <ImageUpload bucket="productos" name="imagen_url" defaultUrl={producto?.imagen_url} />

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
          <input name="categoria" type="text" defaultValue={producto?.categoria}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Precio referencial (CLP)</label>
          <input name="precio_referencial" type="number" defaultValue={producto?.precio_referencial ?? ""}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
        </div>
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input name="activo" type="checkbox" defaultChecked={producto?.activo ?? true} className="w-4 h-4 rounded accent-orange-500" />
          Activo (visible en el sitio)
        </label>
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input name="destacado" type="checkbox" defaultChecked={producto?.destacado ?? false} className="w-4 h-4 rounded accent-orange-500" />
          Destacado en Home
        </label>
      </div>

      <hr className="border-gray-100" />
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">SEO (obligatorio para publicar)</p>

      <SeoFieldsCounter name="meta_title" label="Meta Title" defaultValue={producto?.meta_title || nombre} maxLength={60} required />
      <SeoFieldsCounter name="meta_description" label="Meta Description" defaultValue={producto?.meta_description} maxLength={155} required isTextArea />

      {error && <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">{error}</div>}

      <div className="flex gap-3">
        <button type="submit" disabled={loading}
          className="bg-orange-600 hover:bg-orange-700 disabled:opacity-60 text-white font-semibold px-6 py-2.5 rounded-lg text-sm transition-colors">
          {loading ? "Guardando..." : producto ? "Guardar cambios" : "Crear producto"}
        </button>
        <button type="button" onClick={() => router.back()}
          className="border border-gray-300 text-gray-700 font-semibold px-6 py-2.5 rounded-lg text-sm hover:bg-gray-50 transition-colors">
          Cancelar
        </button>
      </div>
    </form>
  );
}
