"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Save, CheckCircle2, AlertCircle, ExternalLink } from "lucide-react";

const FIELDS = [
  {
    key: "whatsapp_numero",
    label: "WhatsApp (número sin +)",
    placeholder: "56939579658",
    hint: "Solo números, sin + ni espacios. Ej: 56939579658",
    type: "text",
    icon: "📱",
  },
  {
    key: "telefono",
    label: "Teléfono (con formato)",
    placeholder: "+56939579658",
    hint: "Con formato +56, se muestra en header, footer y contacto",
    type: "text",
    icon: "📞",
  },
  {
    key: "email",
    label: "Correo electrónico",
    placeholder: "contacto@fenice.cl",
    hint: "Se muestra en footer y página de contacto",
    type: "email",
    icon: "✉️",
  },
  {
    key: "horario",
    label: "Horario de atención",
    placeholder: "Lun-Vie 09:00–19:00",
    hint: "Se muestra en header desktop y footer",
    type: "text",
    icon: "🕘",
  },
  {
    key: "direccion",
    label: "Dirección base operativa",
    placeholder: "La Granja, Santiago, Región Metropolitana",
    hint: "Aparece en header, footer, nosotros y schema JSON-LD de Google",
    type: "text",
    icon: "📍",
  },
  {
    key: "instagram_url",
    label: "URL Instagram",
    placeholder: "https://www.instagram.com/fenice.combustible/",
    hint: "URL completa, aparece en el footer",
    type: "url",
    icon: "📸",
  },
];

const PATHS_TO_REVALIDATE = [
  "/",
  "/contacto",
  "/nosotros",
  "/servicios/petroleo-a-domicilio-santiago",
  "/servicios/transporte-de-combustible-rm",
  "/servicios/instalacion-de-estanques",
  "/cobertura",
  "/preguntas-frecuentes",
  "/blog",
  "/testimonios",
];

export default function ConfiguracionForm({ config }: { config: Record<string, string> }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError("");

    const fd = new FormData(e.currentTarget);
    const supabase = createClient();

    const updates = FIELDS.map(({ key }) => ({
      clave: key,
      valor: (fd.get(key) as string).trim() || "",
      updated_at: new Date().toISOString(),
    }));

    const { error: dbError } = await supabase
      .from("configuracion_sitio")
      .upsert(updates, { onConflict: "clave" });

    if (dbError) {
      setError(dbError.message);
      setLoading(false);
      return;
    }

    // Revalidate ALL public pages that use site config
    await Promise.allSettled(
      PATHS_TO_REVALIDATE.map((path) =>
        fetch(`/api/revalidate?path=${encodeURIComponent(path)}`, { method: "POST" })
      )
    );

    setSuccess(true);
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Info banner */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl px-5 py-4 text-sm text-blue-800">
        <p className="font-semibold mb-1">¿Para qué sirve esta sección?</p>
        <p className="text-blue-700 text-xs leading-relaxed">
          Los datos de contacto (teléfono, email, dirección, Instagram, horario) que guardes aquí se
          actualizan automáticamente en <strong>todo el sitio</strong>: header, footer, página de
          contacto, botones de WhatsApp y el schema JSON-LD que lee Google.
          No necesitas redesplegar para que los cambios se vean.
        </p>
      </div>

      <div className="bg-white border border-slate-100 rounded-2xl divide-y divide-slate-50 shadow-sm overflow-hidden">
        {FIELDS.map(({ key, label, placeholder, hint, type }) => (
          <div key={key} className="px-6 py-5">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              {label}
            </label>
            <input
              name={key}
              type={type}
              defaultValue={config[key] || ""}
              placeholder={placeholder}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            {hint && <p className="text-xs text-slate-400 mt-1.5">{hint}</p>}
          </div>
        ))}
      </div>

      {/* Preview links */}
      <div className="bg-slate-50 border border-slate-100 rounded-xl px-5 py-4">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Páginas que se actualizan</p>
        <div className="flex flex-wrap gap-2">
          {PATHS_TO_REVALIDATE.map((path) => (
            <a
              key={path}
              href={path}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs bg-white border border-slate-200 hover:border-orange-300 text-slate-600 hover:text-orange-600 px-2.5 py-1 rounded-lg transition-all"
            >
              {path === "/" ? "Inicio" : path.replace("/", "")}
              <ExternalLink className="w-3 h-3" />
            </a>
          ))}
        </div>
      </div>

      {success && (
        <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-5 py-4 text-green-700">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <div>
            <p className="font-semibold text-sm">Configuración guardada</p>
            <p className="text-xs text-green-600 mt-0.5">Todos los cambios están activos en el sitio.</p>
          </div>
        </div>
      )}
      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-5 py-4 text-red-700">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold px-7 py-3 rounded-xl text-sm transition-colors shadow-sm"
      >
        <Save className="w-4 h-4" />
        {loading ? "Guardando y actualizando..." : "Guardar configuración"}
      </button>
    </form>
  );
}
