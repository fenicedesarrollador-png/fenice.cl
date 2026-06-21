"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { FormPageHeader, FormSection, Field, Toggle, FormActions } from "../../_components/ui";

export default function NuevaPromoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setLoading(true); setError("");
    const fd = new FormData(e.currentTarget);
    const payload = {
      titulo: fd.get("titulo") as string,
      descripcion: fd.get("descripcion") as string,
      descuento_texto: fd.get("descuento_texto") as string,
      codigo: fd.get("codigo") as string,
      fecha_inicio: fd.get("fecha_inicio") as string,
      fecha_fin: fd.get("fecha_fin") as string,
      destacado: fd.get("destacado") === "on",
      activo: fd.get("activo") === "on",
    };
    const { error: dbError } = await createClient().from("promociones").insert(payload);
    if (dbError) { setError(dbError.message); setLoading(false); return; }
    router.push("/admin/promociones"); router.refresh();
  }

  return (
    <div className="p-4 sm:p-6 lg:p-7 max-w-3xl mx-auto admin-rise">
      <FormPageHeader title="Nueva promoción" subtitle="Crea una campaña con descuento y vigencia" backHref="/admin/promociones" />
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormSection title="Datos de la promoción">
          <Field label="Título" required>
            <input name="titulo" type="text" required className="admin-input" placeholder="Ej: Descuento de invierno" />
          </Field>
          <Field label="Descripción">
            <textarea name="descripcion" rows={3} className="admin-input" />
          </Field>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Texto de descuento" hint='Ej: "10% OFF" o "Envío gratis"'>
              <input name="descuento_texto" type="text" className="admin-input" />
            </Field>
            <Field label="Código" hint="Código promocional opcional.">
              <input name="codigo" type="text" className="admin-input" placeholder="INVIERNO10" />
            </Field>
          </div>
        </FormSection>

        <FormSection title="Vigencia">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Fecha y hora de inicio" required>
              <input name="fecha_inicio" type="datetime-local" required className="admin-input" />
            </Field>
            <Field label="Fecha y hora de fin" required>
              <input name="fecha_fin" type="datetime-local" required className="admin-input" />
            </Field>
          </div>
        </FormSection>

        <FormSection title="Visibilidad">
          <div className="flex flex-col sm:flex-row gap-5">
            <Toggle name="activo" defaultChecked label="Activa" description="Visible en el sitio" />
            <Toggle name="destacado" label="Destacada" description="Aparece en la página de inicio" />
          </div>
        </FormSection>

        <FormActions submitLabel="Crear promoción" loading={loading} onCancel={() => router.back()} error={error} />
      </form>
    </div>
  );
}
