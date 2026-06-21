import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import CotizacionesTable from "./CotizacionesTable";

export const metadata: Metadata = { title: "Cotizaciones — Admin Fenice" };

export default async function CotizacionesPage() {
  type Cotizacion = {
    id: string; nombre: string; empresa: string; rut_empresa?: string;
    email: string; telefono: string; comuna?: string; servicio_solicitado: string;
    volumen_estimado?: string; frecuencia?: string; mensaje?: string;
    estado: string; created_at: string;
  };

  let cotizaciones: Cotizacion[] = [];

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("cotizaciones")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) cotizaciones = data as Cotizacion[];
  } catch {}

  const nuevas = cotizaciones.filter((c) => c.estado === "nuevo").length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1200px] mx-auto">
      <div className="mb-6 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center shrink-0">
            <span className="text-blue-500 font-black text-lg">$</span>
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 flex items-center gap-2.5">
              Cotizaciones
              {nuevas > 0 && (
                <span className="text-xs font-black bg-red-500 text-white px-2 py-0.5 rounded-full">{nuevas}</span>
              )}
            </h1>
            <p className="text-slate-400 text-xs mt-0.5 font-medium">Solicitudes empresariales desde /cotizacion</p>
          </div>
        </div>
      </div>
      <CotizacionesTable cotizaciones={cotizaciones} />
    </div>
  );
}
