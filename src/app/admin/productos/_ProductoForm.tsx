"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import SeoFieldsCounter from "../_components/SeoFieldsCounter";
import ImageUpload from "../_components/ImageUpload";
import { FormSection, Field, Toggle, FormActions } from "../_components/ui";

function slugify(str: string) {
  return str.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
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
    if (!metaTitle || metaTitle.length > 60) { setError("El Meta Title es obligatorio y debe tener 60 caracteres o menos."); setLoading(false); return; }
    if (!metaDesc || metaDesc.length > 155) { setError("La Meta Description es obligatoria y debe tener 155 caracteres o menos."); setLoading(false); return; }

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
    await fetch("/api/revalidate?path=/productos", { method: "POST" }).catch(() => {});
    router.push("/admin/productos");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-3xl">
      <FormSection title="Información del producto">
        <Field label="Nombre" required hint="Se usa para generar la URL automáticamente.">
          <input name="nombre" type="text" required value={nombre} onChange={(e) => setNombre(e.target.value)} className="admin-input" placeholder="Ej: Petróleo Diesel B" />
        </Field>
        <Field label="Descripción corta">
          <input name="descripcion_corta" type="text" defaultValue={producto?.descripcion_corta} className="admin-input" placeholder="Resumen breve para listados" />
        </Field>
        <Field label="Descripción completa">
          <textarea name="descripcion" rows={5} defaultValue={producto?.descripcion} className="admin-input" placeholder="Detalle completo del producto…" />
        </Field>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Categoría">
            <input name="categoria" type="text" defaultValue={producto?.categoria} className="admin-input" placeholder="Ej: Combustibles" />
          </Field>
          <Field label="Precio referencial (CLP)" hint="Opcional. Solo informativo.">
            <input name="precio_referencial" type="number" defaultValue={producto?.precio_referencial ?? ""} className="admin-input" placeholder="0" />
          </Field>
        </div>
      </FormSection>

      <FormSection title="Imagen">
        <ImageUpload bucket="productos" name="imagen_url" defaultUrl={producto?.imagen_url} label="Imagen del producto" />
      </FormSection>

      <FormSection title="Visibilidad">
        <div className="flex flex-col sm:flex-row gap-5">
          <Toggle name="activo" defaultChecked={producto?.activo ?? true} label="Activo" description="Visible en el sitio público" />
          <Toggle name="destacado" defaultChecked={producto?.destacado ?? false} label="Destacado" description="Aparece en la página de inicio" />
        </div>
      </FormSection>

      <FormSection title="SEO" description="Obligatorio para publicar — mejora el posicionamiento en Google.">
        <SeoFieldsCounter name="meta_title" label="Meta Title" defaultValue={producto?.meta_title || nombre} maxLength={60} required hint="Título que ve Google. Ideal 50-60 caracteres." />
        <SeoFieldsCounter name="meta_description" label="Meta Description" defaultValue={producto?.meta_description} maxLength={155} required isTextArea hint="Resumen que aparece bajo el título en buscadores." />
      </FormSection>

      <FormActions submitLabel={producto ? "Guardar cambios" : "Crear producto"} loading={loading} onCancel={() => router.back()} error={error} />
    </form>
  );
}
