"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { UserRound } from "lucide-react";
import { FormSection, Field, Toggle, FormActions } from "../_components/ui";

interface Miembro {
  id: string;
  nombre: string;
  cargo: string;
  email?: string;
  foto_url?: string;
  bio?: string;
  linkedin_url?: string;
  orden: number;
  activo: boolean;
}

export default function EquipoForm({ miembro }: { miembro?: Miembro }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fotoUrl, setFotoUrl] = useState(miembro?.foto_url ?? "");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setLoading(true); setError("");
    const fd = new FormData(e.currentTarget);
    const payload = {
      nombre: (fd.get("nombre") as string).trim(),
      cargo: (fd.get("cargo") as string).trim(),
      email: (fd.get("email") as string).trim() || null,
      foto_url: (fd.get("foto_url") as string).trim() || null,
      bio: (fd.get("bio") as string).trim() || null,
      linkedin_url: (fd.get("linkedin_url") as string).trim() || null,
      orden: Number(fd.get("orden")) || 0,
      activo: fd.get("activo") === "on",
    };
    const supabase = createClient();
    const { error: dbError } = miembro
      ? await supabase.from("equipo").update(payload).eq("id", miembro.id)
      : await supabase.from("equipo").insert(payload);
    if (dbError) { setError(dbError.message); setLoading(false); return; }
    await fetch("/api/revalidate?path=/nosotros", { method: "POST" }).catch(() => {});
    router.push("/admin/equipo"); router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
      <FormSection title="Datos del miembro">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Nombre completo" required>
            <input name="nombre" type="text" required defaultValue={miembro?.nombre} className="admin-input" placeholder="Ej: Rubén Pierattini" />
          </Field>
          <Field label="Cargo" required>
            <input name="cargo" type="text" required defaultValue={miembro?.cargo} className="admin-input" placeholder="Ej: CEO" />
          </Field>
          <Field label="Correo electrónico" hint="Se muestra públicamente en /nosotros.">
            <input name="email" type="email" defaultValue={miembro?.email} className="admin-input" placeholder="nombre@fenice.cl" />
          </Field>
          <Field label="LinkedIn" hint="Opcional. URL completa del perfil.">
            <input name="linkedin_url" type="url" defaultValue={miembro?.linkedin_url} className="admin-input" placeholder="https://www.linkedin.com/in/…" />
          </Field>
        </div>
        <Field label="Descripción / bio" hint="Breve descripción del rol dentro de Fenice (2–3 líneas).">
          <textarea name="bio" rows={3} defaultValue={miembro?.bio} className="admin-input" />
        </Field>
      </FormSection>

      <FormSection title="Fotografía" description="Pega la URL pública de la foto (Supabase Storage, Drive público, CDN, etc.). Recomendado: retrato vertical, mínimo 600×800 px.">
        <Field label="URL de la foto">
          <input
            name="foto_url"
            type="url"
            defaultValue={miembro?.foto_url}
            onChange={(e) => setFotoUrl(e.target.value.trim())}
            className="admin-input"
            placeholder="https://…/foto.jpg"
          />
        </Field>
        <div className="flex items-center gap-4">
          <div className="w-28 h-36 rounded-xl overflow-hidden border border-white/12 bg-white/[0.03] flex items-center justify-center shrink-0">
            {fotoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element -- vista previa en panel privado
              <img src={fotoUrl} alt="Vista previa" className="w-full h-full object-cover object-top" />
            ) : (
              <UserRound className="w-8 h-8 text-[#5f739a]" />
            )}
          </div>
          <p className="text-[12px] text-[#94a7c2] leading-relaxed">
            Vista previa de cómo se recorta la foto en la tarjeta del equipo.
            Si no se carga, revisa que la URL sea pública y termine en .jpg, .png o .webp.
          </p>
        </div>
      </FormSection>

      <FormSection title="Configuración">
        <div className="grid sm:grid-cols-2 gap-5 items-center">
          <Field label="Orden de aparición" hint="Menor número aparece primero (1 = destacado).">
            <input name="orden" type="number" defaultValue={miembro?.orden ?? 0} className="admin-input" />
          </Field>
          <div className="sm:pt-6">
            <Toggle name="activo" defaultChecked={miembro?.activo ?? true} label="Visible" description="Aparece en la página Nosotros" />
          </div>
        </div>
      </FormSection>

      <FormActions submitLabel={miembro ? "Guardar cambios" : "Agregar miembro"} loading={loading} onCancel={() => router.back()} error={error} />
    </form>
  );
}
