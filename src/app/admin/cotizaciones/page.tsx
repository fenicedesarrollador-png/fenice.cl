import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "../_components/ui";
import ExportButton from "../_components/ExportButton";
import { ChartCard, TrendChart, DonutChart, RankBars } from "../_components/charts";
import CotizacionesManager, { type Cotizacion } from "./CotizacionesManager";
import { dailySeries, countBy, inLastDays, monthDelta, type FechaRow } from "@/lib/admin/stats";
import { DollarSign } from "lucide-react";

export const metadata: Metadata = { title: "Cotizaciones" };

const ESTADO_LABEL: Record<string, string> = {
  nuevo: "Nuevas",
  en_proceso: "En proceso",
  cotizado: "Cotizadas",
  cerrado: "Cerradas",
};

export default async function AdminCotizacionesPage() {
  let cotizaciones: Cotizacion[] = [];
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("cotizaciones")
      .select("id, nombre, empresa, rut_empresa, email, telefono, comuna, servicio_solicitado, volumen_estimado, frecuencia, mensaje, estado, created_at")
      .order("created_at", { ascending: false })
      .limit(3000);
    if (data) cotizaciones = data as Cotizacion[];
  } catch {}

  const rows = cotizaciones as unknown as FechaRow[];
  const trend = dailySeries([{ key: "cotizaciones", rows }], 30);
  const porEstado = countBy(rows, "estado").map((d) => ({
    ...d,
    label: ESTADO_LABEL[d.label] ?? d.label,
  }));
  const porServicio = countBy(inLastDays(rows, 90), "servicio_solicitado");
  const porVolumen = countBy(inLastDays(rows, 90), "volumen_estimado", "No indicado");
  const delta = monthDelta(rows);

  return (
    <div className="p-4 sm:p-6 lg:p-7 max-w-[1280px] mx-auto admin-rise space-y-5">
      <PageHeader
        icon={DollarSign}
        accent="amber"
        title="Cotizaciones"
        subtitle={`${cotizaciones.length} solicitud${cotizaciones.length !== 1 ? "es" : ""} de cotización · ${delta.actual} este mes${delta.deltaPct !== null ? ` (${delta.deltaPct >= 0 ? "+" : ""}${delta.deltaPct}% vs mes anterior)` : ""}`}
      >
        <ExportButton tipo="cotizaciones" label="Exportar Excel" />
      </PageHeader>

      {/* ── Análisis ──────────────────────────────────────────────────── */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <ChartCard title="Cotizaciones por día" subtitle="Últimos 30 días">
            <TrendChart data={trend} series={[{ key: "cotizaciones", label: "Cotizaciones" }]} height={225} />
          </ChartCard>
        </div>
        <ChartCard title="Pipeline por estado" subtitle="Historial completo">
          <DonutChart data={porEstado} height={170} />
        </ChartCard>
      </div>
      <div className="grid lg:grid-cols-2 gap-4">
        <ChartCard title="Servicios solicitados" subtitle="Últimos 90 días">
          <RankBars data={porServicio} />
        </ChartCard>
        <ChartCard title="Volúmenes solicitados" subtitle="Últimos 90 días">
          <RankBars data={porVolumen} color="#c4820c" />
        </ChartCard>
      </div>

      {/* ── Gestión ───────────────────────────────────────────────────── */}
      <CotizacionesManager cotizaciones={cotizaciones} />
    </div>
  );
}
