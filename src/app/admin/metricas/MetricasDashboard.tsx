"use client";

import Link from "next/link";
import {
  BarChart,
  Bar,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatDuration, type AnalyticsDashboardData } from "@/lib/analytics/admin";

function EmptyState({ label }: { label: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-5 py-8 text-center text-sm text-slate-500">
      {label}
    </div>
  );
}

function Card({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">{label}</p>
      <p className="mt-3 text-2xl font-extrabold text-slate-900">{value}</p>
      {hint ? <p className="mt-1 text-xs text-slate-400">{hint}</p> : null}
    </div>
  );
}

export default function MetricasDashboard({ data }: { data: AnalyticsDashboardData }) {
  const overview = data.overview;
  const hasSessions = Number(overview.sessions ?? 0) > 0;
  const totalPages = Math.max(1, Math.ceil((data.totalSessions || 0) / 20));

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <Card label="Visitantes únicos" value={Number(overview.unique_visitors ?? 0)} />
        <Card label="Sesiones" value={Number(overview.sessions ?? 0)} />
        <Card label="Páginas vistas" value={Number(overview.page_views ?? 0)} />
        <Card
          label="Páginas por sesión"
          value={Number(overview.pages_per_session ?? 0)}
          hint={`Duración media: ${formatDuration(Number(overview.avg_session_duration_seconds ?? 0))}`}
        />
        <Card
          label="Conversión"
          value={`${Number(overview.conversion_rate ?? 0)}%`}
          hint={`${Number(overview.form_submit_success ?? 0)} formularios + ${Number(overview.quote_submissions ?? 0)} cotizaciones`}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <Card label="CTA clicks" value={Number(overview.cta_clicks ?? 0)} />
        <Card label="Formularios iniciados" value={Number(overview.form_starts ?? 0)} />
        <Card label="Formularios enviados" value={Number(overview.form_submit_success ?? 0)} />
        <Card label="Cotizaciones enviadas" value={Number(overview.quote_submissions ?? 0)} />
        <Card
          label="Compras"
          value={overview.purchase_integrated ? Number(overview.purchase_completed ?? 0) : "No integrado"}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="mb-5">
            <h2 className="text-lg font-bold text-slate-900">Tendencia de tráfico</h2>
            <p className="text-sm text-slate-500">Visitantes, sesiones y páginas vistas por día.</p>
          </div>
          {hasSessions ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.traffic}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="bucket_date" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip />
                  <Line type="monotone" dataKey="visitors" stroke="#1a6b3c" strokeWidth={2} />
                  <Line type="monotone" dataKey="sessions" stroke="#f5a623" strokeWidth={2} />
                  <Line type="monotone" dataKey="page_views" stroke="#0f172a" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyState label="Aún no hay datos para este período." />
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="mb-5">
            <h2 className="text-lg font-bold text-slate-900">Fuentes de tráfico</h2>
            <p className="text-sm text-slate-500">Sesiones, visitantes y conversión por fuente.</p>
          </div>
          {data.sources.length ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.sources.slice(0, 8)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="source" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip />
                  <Bar dataKey="sessions" fill="#1a6b3c" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyState label="Aún no hay datos de fuentes para este período." />
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="mb-5">
          <h2 className="text-lg font-bold text-slate-900">Embudo de conversión</h2>
          <p className="text-sm text-slate-500">Etapas reales medidas sobre sesiones filtradas.</p>
        </div>
        {data.funnel.stages.length ? (
          <div className="grid gap-4 md:grid-cols-5">
            {data.funnel.stages.map((stage) => (
              <div key={stage.key} className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">{stage.label}</p>
                <p className="mt-2 text-2xl font-extrabold text-slate-900">{stage.count}</p>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState label="Aún no hay etapas registradas." />
        )}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="text-lg font-bold text-slate-900">Páginas más vistas</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-slate-500">
                  <th className="pb-3 pr-4 font-semibold">Ruta</th>
                  <th className="pb-3 pr-4 font-semibold">Vistas</th>
                  <th className="pb-3 pr-4 font-semibold">Visitantes</th>
                  <th className="pb-3 pr-4 font-semibold">Tiempo</th>
                  <th className="pb-3 font-semibold">Conversión</th>
                </tr>
              </thead>
              <tbody>
                {data.pages.length ? (
                  data.pages.slice(0, 8).map((page) => (
                    <tr key={page.path} className="border-b border-slate-50">
                      <td className="py-3 pr-4">
                        <div className="font-medium text-slate-900">{page.path}</div>
                        <div className="text-xs text-slate-400">{page.page_title}</div>
                      </td>
                      <td className="py-3 pr-4 text-slate-700">{page.views}</td>
                      <td className="py-3 pr-4 text-slate-700">{page.visitors}</td>
                      <td className="py-3 pr-4 text-slate-700">{formatDuration(page.avg_time_seconds)}</td>
                      <td className="py-3 text-slate-700">{page.conversion_rate}%</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8">
                      <EmptyState label="Aún no hay páginas registradas para este período." />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="text-lg font-bold text-slate-900">Botones y CTA</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-slate-500">
                  <th className="pb-3 pr-4 font-semibold">Elemento</th>
                  <th className="pb-3 pr-4 font-semibold">Página</th>
                  <th className="pb-3 pr-4 font-semibold">Clics</th>
                  <th className="pb-3 pr-4 font-semibold">% clics</th>
                  <th className="pb-3 font-semibold">Conv.</th>
                </tr>
              </thead>
              <tbody>
                {data.ctas.length ? (
                  data.ctas.slice(0, 8).map((cta) => (
                    <tr key={`${cta.element_id}-${cta.path}`} className="border-b border-slate-50">
                      <td className="py-3 pr-4">
                        <div className="font-medium text-slate-900">{cta.element_label}</div>
                        <div className="text-xs text-slate-400">{cta.element_id}</div>
                      </td>
                      <td className="py-3 pr-4 text-slate-700">{cta.path}</td>
                      <td className="py-3 pr-4 text-slate-700">{cta.clicks}</td>
                      <td className="py-3 pr-4 text-slate-700">{cta.click_percentage}%</td>
                      <td className="py-3 text-slate-700">{cta.conversion_rate}%</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8">
                      <EmptyState label="Aún no hay clics importantes registrados." />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="text-lg font-bold text-slate-900">Secciones más vistas</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-slate-500">
                  <th className="pb-3 pr-4 font-semibold">Página</th>
                  <th className="pb-3 pr-4 font-semibold">Sección</th>
                  <th className="pb-3 pr-4 font-semibold">Vistas</th>
                  <th className="pb-3 font-semibold">% de página</th>
                </tr>
              </thead>
              <tbody>
                {data.sections.length ? (
                  data.sections.slice(0, 10).map((section) => (
                    <tr key={`${section.path}-${section.section_id}`} className="border-b border-slate-50">
                      <td className="py-3 pr-4 text-slate-700">{section.path}</td>
                      <td className="py-3 pr-4 font-medium text-slate-900">{section.section_id}</td>
                      <td className="py-3 pr-4 text-slate-700">{section.views}</td>
                      <td className="py-3 text-slate-700">{section.page_percentage}%</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-8">
                      <EmptyState label="Aún no hay secciones visibles registradas." />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="text-lg font-bold text-slate-900">Profundidad de scroll</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-slate-500">
                  <th className="pb-3 pr-4 font-semibold">Página</th>
                  <th className="pb-3 pr-4 font-semibold">25%</th>
                  <th className="pb-3 pr-4 font-semibold">50%</th>
                  <th className="pb-3 pr-4 font-semibold">75%</th>
                  <th className="pb-3 font-semibold">100%</th>
                </tr>
              </thead>
              <tbody>
                {data.scrollDepth.length ? (
                  data.scrollDepth.map((row) => (
                    <tr key={row.path} className="border-b border-slate-50">
                      <td className="py-3 pr-4 text-slate-700">{row.path}</td>
                      <td className="py-3 pr-4 text-slate-700">{row.depth_25}</td>
                      <td className="py-3 pr-4 text-slate-700">{row.depth_50}</td>
                      <td className="py-3 pr-4 text-slate-700">{row.depth_75}</td>
                      <td className="py-3 text-slate-700">{row.depth_100}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8">
                      <EmptyState label="Aún no hay scroll depth registrado." />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="text-lg font-bold text-slate-900">Dispositivos</h2>
          <div className="mt-4 space-y-6">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-500">Tipos</p>
              {data.devices.devices.length ? (
                <div className="space-y-2">
                  {data.devices.devices.map((device) => (
                    <div key={device.device_type} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                      <span className="font-medium text-slate-900">{device.device_type}</span>
                      <span className="text-sm text-slate-600">{device.sessions} sesiones</span>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState label="Sin datos de dispositivos." />
              )}
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-500">Navegadores</p>
              {data.devices.browsers.length ? (
                <div className="space-y-2">
                  {data.devices.browsers.slice(0, 5).map((browser) => (
                    <div key={browser.browser_name} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                      <span className="font-medium text-slate-900">{browser.browser_name}</span>
                      <span className="text-sm text-slate-600">{browser.sessions}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState label="Sin datos de navegadores." />
              )}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="text-lg font-bold text-slate-900">Campañas UTM</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-slate-500">
                  <th className="pb-3 pr-4 font-semibold">Campaign</th>
                  <th className="pb-3 pr-4 font-semibold">Source</th>
                  <th className="pb-3 pr-4 font-semibold">Medium</th>
                  <th className="pb-3 pr-4 font-semibold">Sesiones</th>
                  <th className="pb-3 font-semibold">Conv.</th>
                </tr>
              </thead>
              <tbody>
                {data.campaigns.length ? (
                  data.campaigns.map((campaign) => (
                    <tr key={`${campaign.campaign}-${campaign.source}-${campaign.medium}`} className="border-b border-slate-50">
                      <td className="py-3 pr-4 text-slate-900">{campaign.campaign}</td>
                      <td className="py-3 pr-4 text-slate-700">{campaign.source}</td>
                      <td className="py-3 pr-4 text-slate-700">{campaign.medium}</td>
                      <td className="py-3 pr-4 text-slate-700">{campaign.sessions}</td>
                      <td className="py-3 text-slate-700">{campaign.conversions}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8">
                      <EmptyState label="Aún no hay campañas UTM registradas." />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Sesiones recientes</h2>
            <p className="text-sm text-slate-500">Detalle paginado de navegación y conversión.</p>
          </div>
          <p className="text-xs text-slate-400">
            Página {data.filters.page} de {totalPages}
          </p>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-slate-500">
                <th className="pb-3 pr-4 font-semibold">Inicio</th>
                <th className="pb-3 pr-4 font-semibold">Visitante</th>
                <th className="pb-3 pr-4 font-semibold">Estado</th>
                <th className="pb-3 pr-4 font-semibold">Fuente</th>
                <th className="pb-3 pr-4 font-semibold">Entrada</th>
                <th className="pb-3 pr-4 font-semibold">Última</th>
                <th className="pb-3 pr-4 font-semibold">Duración</th>
                <th className="pb-3 font-semibold">Detalle</th>
              </tr>
            </thead>
            <tbody>
              {data.recentSessions.length ? (
                data.recentSessions.map((session) => (
                  <tr key={session.session_id} className="border-b border-slate-50">
                    <td className="py-3 pr-4 text-slate-700">{new Date(session.started_at).toLocaleString("es-CL")}</td>
                    <td className="py-3 pr-4 font-medium text-slate-900">{session.visitor_label}</td>
                    <td className="py-3 pr-4 text-slate-700">{session.identity_state}</td>
                    <td className="py-3 pr-4 text-slate-700">{session.source}</td>
                    <td className="py-3 pr-4 text-slate-700">{session.landing_path}</td>
                    <td className="py-3 pr-4 text-slate-700">{session.last_path}</td>
                    <td className="py-3 pr-4 text-slate-700">{formatDuration(session.duration_seconds)}</td>
                    <td className="py-3">
                      <Link href={`/admin/metricas/${session.session_id}`} className="font-semibold text-[#1a6b3c] hover:text-[#145530]">
                        Ver sesión
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-8">
                    <EmptyState label="Aún no hay sesiones registradas para este período." />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

