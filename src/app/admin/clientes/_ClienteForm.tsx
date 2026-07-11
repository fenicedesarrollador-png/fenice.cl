"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import ImageUpload from "../_components/ImageUpload";
import { FormSection, Field, Toggle, FormActions } from "../_components/ui";

interface Cliente { id: string; nombre: string; logo_url?: string; sitio_web?: string; testimonio?: string; sector?: string; descripcion?: string; orden: number; activo: boolean; }

const SECTORES_SUGERIDOS = [
  "Construcción e inmobiliaria",
  "Manufactura e industria",
  "Minería y faenas",
  "Generación eléctrica",
  "Flotas y maquinaria",
  "Agroindustria",
  "Transporte y logística",
];

export default function ClienteForm({ cliente }: { cliente?: Cliente }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setLoading(true); setError("");
    const fd = new FormData(e.currentTarget);
    const payload = {
      nombre: fd.get("nombre") as string,
      logo_url: fd.get("logo_url") as string,
      sitio_web: fd.get("sitio_web") as string,
      testimonio: fd.get("testimonio") as string,
      sector: (fd.get("sector") as string).trim() || null,
      descripcion: (fd.get("descripcion") as string).trim() || null,
      orden: Number(fd.get("orden")) || 0,
      activo: fd.get("activo") === "on",
    };
    const supabase = createClient();
    const { error: dbError } = cliente
      ? await supabase.from("clientes").update(payload).eq("id", cliente.id)
      : await supabase.from("clientes").insert(payload);
    if (dbError) { setError(dbError.message); setLoading(false); return; }
    await Promise.allSettled(
      ["/testimonios", "/clientes", "/"].map((p) =>
        fetch(`/api/revalidate?path=${encodeURIComponent(p)}`, { method: "POST" }),
      ),
    );
    router.push("/admin/clientes"); router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
      <FormSection title="Datos de la empresa">
        <Field label="Nombre de la empresa" required>
          <input name="nombre" type="text" required defaultValue={cliente?.nombre} className="admin-input" placeholder="Ej: Constructora ABC" />
        </Field>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Sitio web" hint="Opcional. URL completa con https://">
            <input name="sitio_web" type="url" defaultValue={cliente?.sitio_web} className="admin-input" placeholder="https://empresa.cl" />
          </Field>
          <Field label="Sector / rubro" hint="Se muestra como etiqueta en la página Clientes.">
            <input name="sector" type="text" list="sectores-sugeridos" defaultValue={cliente?.sector} className="admin-input" placeholder="Ej: Construcción e inmobiliaria" />
            <datalist id="sectores-sugeridos">
              {SECTORES_SUGERIDOS.map((s) => <option key={s} value={s} />)}
            </datalist>
          </Field>
        </div>
        <Field label="Trabajos realizados" hint="Describe el servicio entregado (despachos, estanque instalado, carga periódica, etc.). Aparece en la página pública /clientes.">
          <textarea name="descripcion" rows={3} defaultValue={cliente?.descripcion} className="admin-input" placeholder="Ej: Abastecimiento quincenal de 5.000 L de diesel para su flota de maquinaria e instalación de estanque de 10.000 L certificado SEC." />
        </Field>
        <Field label="Testimonio" hint="Cita opcional que aparece en /clientes y /testimonios.">
          <textarea name="testimonio" rows={3} defaultValue={cliente?.testimonio} className="admin-input" />
        </Field>
      </FormSection>

      <FormSection title="Logo">
        <ImageUpload bucket="clientes" name="logo_url" defaultUrl={cliente?.logo_url} label="Logo de la empresa" />
      </FormSection>

      <FormSection title="Configuración">
        <div className="grid sm:grid-cols-2 gap-5 items-center">
          <Field label="Orden de aparición" hint="Menor número aparece primero.">
            <input name="orden" type="number" defaultValue={cliente?.orden ?? 0} className="admin-input" />
          </Field>
          <div className="sm:pt-6">
            <Toggle name="activo" defaultChecked={cliente?.activo ?? true} label="Activo" description="Visible en el sitio web" />
          </div>
        </div>
      </FormSection>

      <FormActions submitLabel={cliente ? "Guardar cambios" : "Agregar cliente"} loading={loading} onCancel={() => router.back()} error={error} />
    </form>
  );
}
