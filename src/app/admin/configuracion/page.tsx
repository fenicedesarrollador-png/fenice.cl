import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import ConfiguracionForm from "./ConfiguracionForm";
import Link from "next/link";
import { PageHeader } from "../_components/ui";
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
    <div className="p-4 sm:p-6 lg:p-7 max-w-3xl mx-auto admin-rise">
      <PageHeader icon={Settings} accent="navy" title="Configuración del sitio" subtitle="Datos de contacto globales del sitio web" />

      <div className="bg-[#2bbe6a]/8 border border-[#2bbe6a]/20 rounded-2xl px-5 py-4 mb-4 flex items-start gap-3">
        <Info className="w-4 h-4 text-[#2bbe6a] shrink-0 mt-0.5" />
        <p className="text-[12.5px] text-[#5fe39a] leading-relaxed">
          Los datos que guardes aquí se actualizan automáticamente en <strong>todo el sitio</strong>: header, footer, página de contacto, botones de WhatsApp y el schema JSON-LD que indexa Google. <strong>No necesitas redesplegar.</strong>
        </p>
      </div>

      <ConfiguracionForm config={config} />

      <div className="mt-6 pt-6 border-t border-white/[0.06]">
        <Link href="/admin/usuarios" className="admin-card p-5 flex items-center justify-between gap-4 hover:border-[#2bbe6a]/40 transition-colors group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#f5a623]/12 border border-[#f5a623]/20 rounded-xl flex items-center justify-center shrink-0">
              <Users className="w-5 h-5 text-[#f5a623]" />
            </div>
            <div>
              <p className="font-black text-[#e8eef7] text-sm">Gestión de usuarios admin</p>
              <p className="text-[12px] text-[#94a7c2] mt-0.5">Crea, bloquea y elimina accesos al panel</p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-[#5f739a] group-hover:text-[#2bbe6a] group-hover:translate-x-0.5 transition-all shrink-0" />
        </Link>
      </div>
    </div>
  );
}
