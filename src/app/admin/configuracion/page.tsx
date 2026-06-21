import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import ConfiguracionForm from "./ConfiguracionForm";
import Link from "next/link";
import { Users, ArrowRight, Settings, Info } from "lucide-react";

export const metadata: Metadata = { title: "Configuración del sitio" };

export default async function ConfiguracionPage() {
  const config: Record<string, string> = {};
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("configuracion_sitio").select("clave, valor");
    if (data) data.forEach(({ clave, valor }) => { config[clave] = valor; });
  } catch {}

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-center shrink-0">
          <Settings className="w-5 h-5 text-slate-600" />
        </div>
        <div>
          <h1 className="text-xl font-black text-slate-900">Configuración del sitio</h1>
          <p className="text-slate-400 text-xs mt-0.5 font-medium">
            Datos de contacto globales — se aplican en todo el sitio sin redesplegar
          </p>
        </div>
      </div>

      {/* Info card */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl px-5 py-4 mb-6 flex items-start gap-3">
        <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-blue-900">¿Para qué sirve esta sección?</p>
          <p className="text-xs text-blue-700 mt-1 leading-relaxed">
            Los datos de contacto que guardes aquí se actualizan automáticamente en <strong>todo el sitio</strong>:
            header, footer, página de contacto, botones de WhatsApp y el schema JSON-LD que indexa Google.
            No necesitas redesplegar para que los cambios sean visibles.
          </p>
        </div>
      </div>

      <ConfiguracionForm config={config} />

      {/* Separator */}
      <div className="mt-8 pt-8 border-t border-slate-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white border border-slate-100 rounded-2xl shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-orange-50 border border-orange-100 rounded-xl flex items-center justify-center shrink-0">
              <Users className="w-4.5 h-4.5 text-orange-500" />
            </div>
            <div>
              <p className="font-bold text-slate-900 text-sm">Gestión de usuarios admin</p>
              <p className="text-xs text-slate-500 mt-0.5">Crea, bloquea y elimina accesos al panel</p>
            </div>
          </div>
          <Link
            href="/admin/usuarios"
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-colors shadow-sm shadow-orange-500/20 shrink-0"
          >
            Gestionar usuarios
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
