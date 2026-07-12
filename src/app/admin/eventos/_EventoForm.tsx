"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import ImageUpload from "../_components/ImageUpload";
import { FormSection, Field, Toggle, FormActions } from "../_components/ui";

function slugify(str: string) { return str.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }

interface Evento { id: string; titulo: string; slug: string; descripcion?: string; ubicacion?: string; fecha_inicio: string; fecha_fin?: string; imagen_url?: string; activo: boolean; }

export default function EventoForm({ evento }: { evento?: Evento }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setLoading(true); setError("");
    const fd = new FormData(e.currentTarget);
    const titulo = (fd.get("titulo") as string).trim();
    const slug = evento?.slug || slugify(titulo);
    if (!titulo || !slug) { setError("El título es obligatorio."); setLoading(false); return; }
    if (!(fd.get("fecha_inicio") as string)) { setError("La fecha de inicio es obligatoria."); setLoading(false); return; }
    const payload = {
      titulo,
      slug,
      descripcion: (fd.get("descripcion") as string).trim() || null,
      ubicacion: (fd.get("ubicacion") as string).trim() || null,
      fecha_inicio: fd.get("fecha_inicio") as string,
      fecha_fin: (fd.get("fecha_fin") as string) || null,
      imagen_url: (fd.get("imagen_url") as string).trim() || null,
      activo: fd.get("activo") === "on",
    };
    const supabase = createClient();
    const { error: dbError } = evento
      ? await supabase.from("eventos").update(payload).eq("id", evento.id)
      : await supabase.from("eventos").insert(payload);
    if (dbError) { setError(dbError.message); setLoading(false); return; }
    await fetch(`/api/revalidate?path=/eventos/${payload.slug}`, { method: "POST" }).catch(() => {});
    router.push("/admin/eventos"); router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
      <FormSection title="Información del evento">
        <Field label="Título" required>
          <input name="titulo" type="text" required defaultValue={evento?.titulo} className="admin-input" placeholder="Nombre del evento" />
        </Field>
        <Field label="Descripción">
          <textarea name="descripcion" rows={4} defaultValue={evento?.descripcion} className="admin-input" />
        </Field>
        <Field label="Ubicación">
          <input name="ubicacion" type="text" defaultValue={evento?.ubicacion} className="admin-input" placeholder="Ej: Espacio Riesco, Santiago" />
        </Field>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Fecha y hora de inicio" required>
            <input name="fecha_inicio" type="datetime-local" required defaultValue={evento?.fecha_inicio?.slice(0, 16)} className="admin-input" />
          </Field>
          <Field label="Fecha y hora de fin">
            <input name="fecha_fin" type="datetime-local" defaultValue={evento?.fecha_fin?.slice(0, 16)} className="admin-input" />
          </Field>
        </div>
      </FormSection>

      <FormSection title="Imagen">
        <ImageUpload bucket="eventos" name="imagen_url" defaultUrl={evento?.imagen_url} label="Imagen del evento" />
      </FormSection>

      <FormSection title="Visibilidad">
        <Toggle name="activo" defaultChecked={evento?.activo ?? true} label="Activo" description="Visible en el sitio web" />
      </FormSection>

      <FormActions submitLabel={evento ? "Guardar cambios" : "Crear evento"} loading={loading} onCancel={() => router.back()} error={error} />
    </form>
  );
}
