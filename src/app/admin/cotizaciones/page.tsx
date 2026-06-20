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
    <div className="p-6 lg:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            Cotizaciones
            {nuevas > 0 && (
              <span className="text-sm font-bold bg-red-500 text-white px-2.5 py-0.5 rounded-full">{nuevas} nueva{nuevas !== 1 ? "s" : ""}</span>
            )}
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">Solicitudes de cotización empresarial desde /cotizacion</p>
        </div>
      </div>
      <CotizacionesTable cotizaciones={cotizaciones} />
    </div>
  );
}
