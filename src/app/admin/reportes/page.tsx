import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "../_components/ui";
import ExportButton from "../_components/ExportButton";
import { ChartCard, TrendChart, DonutChart, RankBars } from "../_components/charts";
import { dailySeries, countBy, inLastDays, monthDelta, isoDaysAgo, type FechaRow } from "@/lib/admin/stats";
import {
  BarChart3, DollarSign, Inbox, Building2, Package, Users,
  TrendingUp, TrendingDown, Minus, FileSpreadsheet, ChartColumn, ArrowRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const metadata: Metadata = { title: "Reportes" };

function DeltaBadge({ deltaPct }: { deltaPct: number | null }) {
  if (deltaPct === null) {
    return (
      <span className="inline-flex items-center gap-1 text-[10.5px] font-bold text-slate-400">
        <Minus className="w-3 h-3" /> sin base previa
      </span>
    );
  }
  const up = deltaPct >= 0;
  return (
    <span className={`inline-flex items-center gap-1 text-[10.5px] font-black ${up ? "text-[#1a6b3c]" : "text-red-500"}`}>
      {up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
      {up ? "+" : ""}{deltaPct}% vs mes anterior
    </span>
  );
}

export default async function ReportesPage() {
  let cotRows: FechaRow[] = [];
  let leadRows: FechaRow[] = [];
  let counts = { clientes: 0, productos: 0, equipo: 0 };

  const desde365 = isoDaysAgo(365);

  try {
    const supabase = await createClient();
    const [cotRes, leadRes, cliRes, prodRes, eqRes] = await Promise.all([
      supabase.from("cotizaciones").select("created_at, servicio_solicitado, comuna, estado, volumen_estimado, frecuencia").gte("created_at", desde365).limit(5000),
      supabase.from("leads").select("created_at, tipo_operacion, comuna, estado").gte("created_at", desde365).limit(5000),
      supabase.from("clientes").select("id", { count: "exact", head: true }),
      supabase.from("productos").select("id", { count: "exact", head: true }),
      supabase.from("equipo").select("id", { count: "exact", head: true }),
    ]);
    if (cotRes.data) cotRows = cotRes.data as FechaRow[];
    if (leadRes.data) leadRows = leadRes.data as FechaRow[];
    counts = {
      clientes: cliRes.count ?? 0,
      productos: prodRes.count ?? 0,
      equipo: eqRes.count ?? 0,
    };
  } catch {}

  const cotDelta = monthDelta(cotRows);
  const leadDelta = monthDelta(leadRows);
  const cot90 = inLastDays(cotRows, 90);
  const todas90 = [...cot90, ...inLastDays(leadRows, 90)];
  const cerradas = cotRows.filter((r) => r.estado === "cerrado").length;
  const tasaCierre = cotRows.length > 0 ? Math.round((cerradas / cotRows.length) * 100) : 0;

  const trend90 = dailySeries(
    [
      { key: "cotizaciones", rows: cotRows },
      { key: "contactos", rows: leadRows },
    ],
    90,
  );
  const porServicio = countBy(cot90, "servicio_solicitado");
  const porComuna = countBy(todas90, "comuna", "Sin comuna").filter((c) => c.label !== "Sin comuna");
  const porVolumen = countBy(cot90, "volumen_estimado", "No indicado");
  const porFrecuencia = countBy(cot90, "frecuencia", "No indicada");

  const kpis = [
    { label: "Cotizaciones este mes", value: cotDelta.actual, delta: cotDelta.deltaPct, icon: DollarSign },
    { label: "Contactos este mes", value: leadDelta.actual, delta: leadDelta.deltaPct, icon: Inbox },
    { label: "Cotizaciones últimos 90 días", value: cot90.length, delta: null, icon: BarChart3, noDelta: true },
    { label: "Tasa de cierre (12 meses)", value: `${tasaCierre}%`, delta: null, icon: TrendingUp, noDelta: true, hint: `${cerradas} cerradas de ${cotRows.length}` },
  ];

  const descargas: {
    tipo: string; titulo: string; desc: string; icon: LucideIcon; registros?: number;
  }[] = [
    { tipo: "solicitudes", titulo: "Bandeja completa", desc: "Cotizaciones + contactos unificados en una hoja", icon: Inbox },
    { tipo: "cotizaciones", titulo: "Cotizaciones", desc: "Todas las solicitudes de cotización con su detalle", icon: DollarSign },
    { tipo: "leads", titulo: "Contactos (leads)", desc: "Mensajes de contacto con notas internas", icon: Inbox },
    { tipo: "clientes", titulo: "Clientes", desc: `${counts.clientes} empresas con sector y trabajos realizados`, icon: Building2 },
    { tipo: "productos", titulo: "Productos", desc: `${counts.productos} productos del catálogo`, icon: Package },
    { tipo: "equipo", titulo: "Equipo", desc: `${counts.equipo} miembros del equipo público`, icon: Users },
  ];

  const hoy = new Date();
  const inicioMes = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, "0")}-01`;

  return (
    <div className="p-4 sm:p-6 lg:p-7 max-w-[1280px] mx-auto admin-rise space-y-5">
      <PageHeader
        icon={ChartColumn}
        accent="blue"
        title="Reportes"
        subtitle="Análisis comercial de los últimos 12 meses y centro de descargas"
      >
        <Link href="/admin/metricas" className="admin-btn-ghost">
          <BarChart3 className="w-4 h-4" />
          <span className="hidden sm:inline">Métricas web</span>
        </Link>
      </PageHeader>

      {/* KPIs con comparativa mensual */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {kpis.map((k) => (
          <div key={k.label} className="admin-card p-5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3.5">
              <k.icon className="w-5 h-5" strokeWidth={2.2} />
            </div>
            <p className="text-[28px] leading-none font-black tabular-nums text-[#0a1628]">{k.value}</p>
            <p className="text-[12px] font-bold text-slate-500 mt-2">{k.label}</p>
            <div className="mt-1.5">
              {k.noDelta ? (
                <span className="text-[10.5px] text-slate-400 font-semibold">{k.hint ?? " "}</span>
              ) : (
                <DeltaBadge deltaPct={k.delta} />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Tendencia 90 días */}
      <ChartCard title="Demanda comercial" subtitle="Cotizaciones y contactos por día · últimos 90 días">
        <TrendChart
          data={trend90}
          series={[
            { key: "cotizaciones", label: "Cotizaciones" },
            { key: "contactos", label: "Contactos" },
          ]}
          height={280}
        />
      </ChartCard>

      {/* Distribuciones */}
      <div className="grid lg:grid-cols-2 gap-4">
        <ChartCard title="Servicios más solicitados" subtitle="Cotizaciones · últimos 90 días">
          <DonutChart data={porServicio} height={185} />
        </ChartCard>
        <ChartCard title="Zonas con más demanda" subtitle="Cotizaciones + contactos · últimos 90 días">
          <RankBars data={porComuna} color="#5f8ceb" />
        </ChartCard>
        <ChartCard title="Volúmenes solicitados" subtitle="Cotizaciones · últimos 90 días">
          <RankBars data={porVolumen} color="#c4820c" />
        </ChartCard>
        <ChartCard title="Frecuencia de despacho solicitada" subtitle="Cotizaciones · últimos 90 días">
          <RankBars data={porFrecuencia} color="#d8639c" />
        </ChartCard>
      </div>

      {/* Centro de descargas */}
      <div className="admin-card overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2.5">
          <FileSpreadsheet className="w-4 h-4 text-[#1a6b3c]" />
          <div>
            <h2 className="text-sm font-black text-[#0a1628]">Centro de descargas</h2>
            <p className="text-[11.5px] text-slate-500 mt-0.5">
              Archivos Excel (.xlsx) con formato corporativo, listos para compartir o analizar.
            </p>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 divide-y sm:divide-y-0 divide-slate-100">
          {descargas.map((d) => (
            <div key={d.tipo} className="p-5 border-slate-100 sm:border-b lg:[&:nth-child(n+4)]:border-b-0 sm:[&:nth-child(n+5)]:border-b-0 sm:odd:border-r lg:odd:border-r-0 lg:[&:not(:nth-child(3n))]:border-r">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                  <d.icon className="w-4 h-4 text-slate-500" />
                </div>
                <h3 className="text-[13px] font-black text-[#0a1628]">{d.titulo}</h3>
              </div>
              <p className="text-[11.5px] text-slate-500 leading-relaxed mb-3.5">{d.desc}</p>
              <div className="flex flex-wrap gap-2">
                <ExportButton tipo={d.tipo} label="Todo" className="!text-[11.5px] !py-1.5 !px-2.5" />
                {(d.tipo === "cotizaciones" || d.tipo === "leads" || d.tipo === "solicitudes") && (
                  <ExportButton tipo={d.tipo} params={{ desde: inicioMes }} label="Este mes" className="!text-[11.5px] !py-1.5 !px-2.5" />
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="px-5 py-3.5 border-t border-slate-100 flex items-center justify-between">
          <p className="text-[11.5px] text-slate-400">¿Necesitas datos de navegación del sitio? El módulo de métricas exporta sesiones en CSV.</p>
          <Link href="/admin/metricas" className="text-[12px] font-bold text-[#1a6b3c] hover:text-[#0d4a28] flex items-center gap-1 whitespace-nowrap transition-colors">
            Ir a métricas <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
