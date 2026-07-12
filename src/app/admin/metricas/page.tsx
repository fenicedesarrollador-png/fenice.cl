import type { Metadata } from "next";
import Link from "next/link";
import { BarChart3, Download, FilterX, AlertTriangle } from "lucide-react";
import MetricasDashboard from "./MetricasDashboard";
import {
  buildAnalyticsQueryString,
  loadAnalyticsDashboard,
  resolveAnalyticsFilters,
} from "@/lib/analytics/admin";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Métricas | Admin Fenice",
};

/** Detecta si el error es por RPCs/tablas de analytics inexistentes (migración pendiente). */
function isSetupError(msg: string): boolean {
  return /does not exist|could not find the function|schema cache|relation .* does not exist|function .* does not exist/i.test(msg);
}

export default async function MetricasPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const filters = resolveAnalyticsFilters(params);
  const supabase = await createClient();

  let errorMessage = "";
  let dashboard = null;

  try {
    dashboard = await loadAnalyticsDashboard(supabase, filters);
  } catch (error) {
    errorMessage = error instanceof Error ? error.message : "No se pudieron cargar las métricas.";
  }

  const setupPendiente = errorMessage !== "" && isSetupError(errorMessage);
  const exportQuery = buildAnalyticsQueryString(filters);

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-[#f5a623]/12 border border-[#f5a623]/20 rounded-2xl flex items-center justify-center shrink-0">
            <BarChart3 className="w-5 h-5 text-[#b87608]" />
          </div>
          <div>
            <h1 className="text-xl font-black text-[#0a1628]">Métricas</h1>
            <p className="text-slate-500 text-xs mt-0.5 font-medium">
              Actividad real de fenice.cl · Tracking propio
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href={`/api/admin/metricas/export?${exportQuery}`}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-bold text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-100 shadow-sm"
          >
            <Download className="h-4 w-4" />
            Exportar CSV
          </Link>
          <Link
            href="/admin/metricas"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-bold text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-100 shadow-sm"
          >
            <FilterX className="h-4 w-4" />
            Limpiar filtros
          </Link>
        </div>
      </div>

      <form method="get" className="rounded-2xl border border-slate-100 bg-slate-50 p-5 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <label className="space-y-2 text-sm">
            <span className="font-semibold text-slate-700">Período</span>
            <select
              name="period"
              defaultValue={filters.period}
              className="admin-input"
            >
              <option value="today">Hoy</option>
              <option value="last_7_days">Últimos 7 días</option>
              <option value="last_30_days">Últimos 30 días</option>
              <option value="this_month">Este mes</option>
              <option value="last_month">Mes anterior</option>
              <option value="custom">Personalizado</option>
            </select>
          </label>

          <label className="space-y-2 text-sm">
            <span className="font-semibold text-slate-700">Desde</span>
            <input
              type="date"
              name="date_from"
              defaultValue={filters.dateFrom}
              className="admin-input"
            />
          </label>

          <label className="space-y-2 text-sm">
            <span className="font-semibold text-slate-700">Hasta</span>
            <input
              type="date"
              name="date_to"
              defaultValue={filters.dateTo}
              className="admin-input"
            />
          </label>

          <label className="space-y-2 text-sm">
            <span className="font-semibold text-slate-700">Fuente</span>
            <select
              name="source"
              defaultValue={filters.source}
              className="admin-input"
            >
              <option value="">Todas</option>
              {(dashboard?.filterOptions.sources ?? []).map((source) => (
                <option key={source} value={source}>
                  {source}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2 text-sm">
            <span className="font-semibold text-slate-700">Dispositivo</span>
            <select
              name="device_type"
              defaultValue={filters.deviceType}
              className="admin-input"
            >
              <option value="">Todos</option>
              {(dashboard?.filterOptions.devices ?? []).map((device) => (
                <option key={device} value={device}>
                  {device}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2 text-sm">
            <span className="font-semibold text-slate-700">Página</span>
            <select
              name="path"
              defaultValue={filters.path}
              className="admin-input"
            >
              <option value="">Todas</option>
              {(dashboard?.filterOptions.paths ?? []).map((path) => (
                <option key={path} value={path}>
                  {path}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2 text-sm">
            <span className="font-semibold text-slate-700">Campaña</span>
            <select
              name="campaign"
              defaultValue={filters.campaign}
              className="admin-input"
            >
              <option value="">Todas</option>
              {(dashboard?.filterOptions.campaigns ?? []).map((campaign) => (
                <option key={campaign} value={campaign}>
                  {campaign}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2 text-sm">
            <span className="font-semibold text-slate-700">Estado</span>
            <select
              name="identity_state"
              defaultValue={filters.identityState}
              className="admin-input"
            >
              <option value="all">Todos</option>
              <option value="anonymous">Anónimos</option>
              <option value="identified">Identificados</option>
            </select>
          </label>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            type="submit"
            className="admin-btn-primary"
          >
            Aplicar filtros
          </button>
        </div>
      </form>

      {setupPendiente ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-5 text-sm text-amber-800">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 shrink-0 text-amber-500 mt-0.5" />
            <div>
              <p className="font-bold text-amber-900 mb-1">Las métricas aún no están activadas</p>
              <p className="leading-relaxed">
                Faltan las funciones de analítica en la base de datos. Ejecuta{" "}
                <code className="bg-amber-100 px-1.5 py-0.5 rounded font-mono text-[13px]">supabase/migration_analytics.sql</code>{" "}
                en el SQL Editor de Supabase. Una vez ejecutado, el tracking del sitio empezará a
                registrar visitas y este panel mostrará los datos.
              </p>
              <p className="mt-2 text-[12px] text-amber-700/80">Detalle técnico: {errorMessage}</p>
            </div>
          </div>
        </div>
      ) : errorMessage ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">
          {errorMessage}
        </div>
      ) : null}

      {dashboard ? <MetricasDashboard data={dashboard} /> : null}
    </div>
  );
}

