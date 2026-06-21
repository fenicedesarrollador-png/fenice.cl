import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import CotizacionesTable from "./CotizacionesTable";
import { PageHeader, Badge } from "../_components/ui";
import { DollarSign } from "lucide-react";

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
    const { data } = await supabase.from("cotizaciones").select("*").order("created_at", { ascending: false });
    if (data) cotizaciones = data as Cotizacion[];
  } catch {}
  const nuevas = cotizaciones.filter((c) => c.estado === "nuevo").length;

  return (
    <div className="p-4 sm:p-6 lg:p-7 max-w-[1200px] mx-auto admin-rise">
      <PageHeader icon={DollarSign} accent="amber" title="Cotizaciones" subtitle="Solicitudes empresariales de combustible">
        {nuevas > 0 && <Badge tone="red" dot>{nuevas} nueva{nuevas !== 1 ? "s" : ""}</Badge>}
      </PageHeader>
      <CotizacionesTable cotizaciones={cotizaciones} />
    </div>
  );
}
