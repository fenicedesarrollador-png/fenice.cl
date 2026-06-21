import type { Metadata } from "next";
import Link from "next/link";
import { BarChart3, Download, FilterX } from "lucide-react";
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

  const exportQuery = buildAnalyticsQueryString(filters);

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-50 border border-orange-100 rounded-xl flex items-center justify-center shrink-0">
            <BarChart3 className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900">Métricas</h1>
            <p className="text-slate-400 text-xs mt-0.5 font-medium">
              Actividad real de fenice.cl · Tracking propio
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href={`/api/admin/metricas/export?${exportQuery}`}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50 shadow-sm"
          >
            <Download className="h-4 w-4" />
            Exportar CSV
          </Link>
          <Link
            href="/admin/metricas"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50 shadow-sm"
          >
            <FilterX className="h-4 w-4" />
            Limpiar filtros
          </Link>
        </div>
      </div>

      <form method="get" className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <label className="space-y-2 text-sm">
            <span className="font-semibold text-slate-700">Período</span>
            <select
              name="period"
              defaultValue={filters.period}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-700 outline-none transition-colors focus:border-orange-400"
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
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-700 outline-none transition-colors focus:border-orange-400"
            />
          </label>

          <label className="space-y-2 text-sm">
            <span className="font-semibold text-slate-700">Hasta</span>
            <input
              type="date"
              name="date_to"
              defaultValue={filters.dateTo}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-700 outline-none transition-colors focus:border-orange-400"
            />
          </label>

          <label className="space-y-2 text-sm">
            <span className="font-semibold text-slate-700">Fuente</span>
            <select
              name="source"
              defaultValue={filters.source}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-700 outline-none transition-colors focus:border-orange-400"
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
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-700 outline-none transition-colors focus:border-orange-400"
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
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-700 outline-none transition-colors focus:border-orange-400"
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
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-700 outline-none transition-colors focus:border-orange-400"
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
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-700 outline-none transition-colors focus:border-orange-400"
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
            className="rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-orange-600"
          >
            Aplicar filtros
          </button>
        </div>
      </form>

      {errorMessage ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          {errorMessage}
        </div>
      ) : null}

      {dashboard ? <MetricasDashboard data={dashboard} /> : null}
    </div>
  );
}

