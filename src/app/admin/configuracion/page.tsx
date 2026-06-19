import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import ConfiguracionForm from "./ConfiguracionForm";
import Link from "next/link";
import { Users, ArrowRight } from "lucide-react";

export const metadata: Metadata = { title: "Configuración del sitio" };

export default async function ConfiguracionPage() {
  let config: Record<string, string> = {};
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("configuracion_sitio").select("clave, valor");
    if (data) data.forEach(({ clave, valor }) => { config[clave] = valor; });
  } catch {}

  return (
    <div className="p-6 lg:p-8 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Configuración del sitio</h1>
        <p className="text-slate-500 text-sm mt-0.5">
          Datos de contacto globales — aplican a todo el sitio sin redesplegar
        </p>
      </div>

      <ConfiguracionForm config={config} />

      {/* Divider */}
      <div className="mt-8 pt-8 border-t border-slate-100">
        <div className="flex items-center justify-between p-5 bg-white border border-slate-100 rounded-xl shadow-sm">
          <div>
            <p className="font-semibold text-slate-900 text-sm">Gestión de usuarios admin</p>
            <p className="text-xs text-slate-500 mt-0.5">Crea, bloquea y elimina accesos al panel</p>
          </div>
          <Link
            href="/admin/usuarios"
            className="inline-flex items-center gap-2 text-sm font-semibold text-orange-600 hover:text-orange-700 transition-colors"
          >
            <Users className="w-4 h-4" />
            Gestionar
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
