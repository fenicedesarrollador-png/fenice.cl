"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { CheckCircle2, AlertCircle, Save, ExternalLink, Phone, Mail, Clock, MapPin, Camera, MessageCircle } from "lucide-react";
import { FormSection, Field } from "../_components/ui";

const FIELDS = [
  { key: "whatsapp_numero", label: "WhatsApp (número sin +)", placeholder: "56939579658", hint: "Solo números, sin + ni espacios.", type: "text", icon: MessageCircle },
  { key: "telefono", label: "Teléfono (con formato)", placeholder: "+56939579658", hint: "Se muestra en header, footer y contacto.", type: "text", icon: Phone },
  { key: "email", label: "Correo electrónico", placeholder: "contacto@fenice.cl", hint: "Footer y página de contacto.", type: "email", icon: Mail },
  { key: "horario", label: "Horario de atención", placeholder: "Lun-Vie 09:00–19:00", hint: "Header desktop y footer.", type: "text", icon: Clock },
  { key: "direccion", label: "Dirección base operativa", placeholder: "La Granja, Santiago, RM", hint: "Header, footer, nosotros y schema de Google.", type: "text", icon: MapPin },
  { key: "instagram_url", label: "URL Instagram", placeholder: "https://www.instagram.com/fenice.combustible/", hint: "URL completa, aparece en el footer.", type: "url", icon: Camera },
];

const PATHS_TO_REVALIDATE = [
  "/", "/contacto", "/nosotros", "/clientes",
  "/servicios/petroleo-a-domicilio-santiago",
  "/servicios/transporte-de-combustible-rm",
  "/servicios/instalacion-de-estanques",
  "/cobertura", "/preguntas-frecuentes", "/blog", "/testimonios",
];

export default function ConfiguracionForm({ config }: { config: Record<string, string> }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true); setSuccess(false); setError("");
    const fd = new FormData(e.currentTarget);
    const supabase = createClient();
    const updates = FIELDS.map(({ key }) => ({ clave: key, valor: (fd.get(key) as string).trim() || "", updated_at: new Date().toISOString() }));
    const { error: dbError } = await supabase.from("configuracion_sitio").upsert(updates, { onConflict: "clave" });
    if (dbError) { setError(dbError.message); setLoading(false); return; }
    await Promise.allSettled(PATHS_TO_REVALIDATE.map((p) => fetch(`/api/revalidate?path=${encodeURIComponent(p)}`, { method: "POST" })));
    setSuccess(true); setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormSection title="Datos de contacto" description="Se aplican en todo el sitio sin redesplegar.">
        <div className="grid sm:grid-cols-2 gap-4">
          {FIELDS.map(({ key, label, placeholder, hint, type, icon: Icon }) => (
            <Field key={key} label={label} hint={hint} className={key === "direccion" ? "sm:col-span-2" : ""}>
              <div className="relative">
                <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a7c2]" />
                <input name={key} type={type} defaultValue={config[key] || ""} placeholder={placeholder} className="admin-input !pl-9" />
              </div>
            </Field>
          ))}
        </div>
      </FormSection>

      <FormSection title="Páginas que se actualizan" description="Estas rutas se revalidan automáticamente al guardar.">
        <div className="flex flex-wrap gap-2">
          {PATHS_TO_REVALIDATE.map((path) => (
            <a key={path} href={path} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[11px] bg-white/[0.03] border border-white/12 hover:border-[#2bbe6a]/40 text-[#cdd9ea] hover:text-[#2bbe6a] px-2.5 py-1 rounded-lg transition-all font-medium">
              {path === "/" ? "Inicio" : path.replace("/", "")}
              <ExternalLink className="w-3 h-3" />
            </a>
          ))}
        </div>
      </FormSection>

      {success && (
        <div className="flex items-center gap-3 bg-[#2bbe6a]/12 border border-[#1a6b3c]/20 rounded-xl px-5 py-4 text-[#2bbe6a]">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <div><p className="font-bold text-sm">Configuración guardada</p><p className="text-xs text-[#2bbe6a]/80 mt-0.5">Todos los cambios están activos en el sitio.</p></div>
        </div>
      )}
      {error && (
        <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/25 rounded-xl px-5 py-4 text-red-300">
          <AlertCircle className="w-5 h-5 shrink-0" /><p className="text-sm font-medium">{error}</p>
        </div>
      )}

      <button type="submit" disabled={loading} className="admin-btn-primary">
        <Save className="w-4 h-4" />
        {loading ? "Guardando y actualizando…" : "Guardar configuración"}
      </button>
    </form>
  );
}
