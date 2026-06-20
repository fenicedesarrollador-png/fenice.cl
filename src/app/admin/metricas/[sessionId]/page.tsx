import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatDuration } from "@/lib/analytics/admin";

export const metadata: Metadata = {
  title: "Detalle de sesión | Admin Fenice",
};

export default async function SessionDetailPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("analytics_get_session_detail", {
    p_session_id: sessionId,
  });

  if (error || !data?.session) {
    notFound();
  }

  const session = data.session as {
    id: string;
    visitor_label: string;
    identified: boolean;
    started_at: string;
    last_seen_at: string;
    source: string | null;
    medium: string | null;
    campaign: string | null;
    referrer_host: string | null;
    landing_path: string;
    last_path: string | null;
    device_type: string | null;
    browser_name: string | null;
    os_name: string | null;
    language: string | null;
    screen_group: string | null;
    country_code: string | null;
    duration_seconds: number;
  };

  const identityLinks = (data.identity_links ?? []) as Array<{
    lead_id: string | null;
    client_id: string | null;
    cotizacion_id: string | null;
    identified_at: string;
  }>;

  return (
    <div className="space-y-6 p-6 lg:p-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <Link href="/admin/metricas" className="text-sm font-semibold text-orange-600 hover:text-orange-700">
            Volver a métricas
          </Link>
          <h1 className="mt-2 text-2xl font-bold text-slate-900">{session.visitor_label}</h1>
          <p className="mt-1 text-sm text-slate-500">
            {session.identified ? "Visitante identificado" : "Visitante anónimo"} · {formatDuration(session.duration_seconds)}
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Inicio", value: new Date(session.started_at).toLocaleString("es-CL") },
          { label: "Última actividad", value: new Date(session.last_seen_at).toLocaleString("es-CL") },
          { label: "Fuente", value: session.source || "direct" },
          { label: "Campaña", value: session.campaign || "Sin campaña" },
          { label: "Entrada", value: session.landing_path },
          { label: "Última página", value: session.last_path || session.landing_path },
          { label: "Dispositivo", value: session.device_type || "unknown" },
          { label: "Navegador / SO", value: `${session.browser_name || "Desconocido"} · ${session.os_name || "Desconocido"}` },
        ].map((item) => (
          <div key={item.label} className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">{item.label}</p>
            <p className="mt-3 text-sm font-semibold text-slate-900">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="text-lg font-bold text-slate-900">Páginas visitadas</h2>
          <div className="mt-4 space-y-3">
            {((data.pages ?? []) as Array<{ path: string; page_title: string | null; occurred_at: string }>).length ? (
              ((data.pages ?? []) as Array<{ path: string; page_title: string | null; occurred_at: string }>).map((page, index) => (
                <div key={`${page.path}-${page.occurred_at}-${index}`} className="rounded-xl bg-slate-50 px-4 py-3">
                  <p className="font-semibold text-slate-900">{page.path}</p>
                  <p className="text-xs text-slate-500">{page.page_title || "Sin título"}</p>
                  <p className="mt-1 text-xs text-slate-400">{new Date(page.occurred_at).toLocaleString("es-CL")}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">Sin páginas registradas.</p>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="text-lg font-bold text-slate-900">Secciones y scroll</h2>
          <div className="mt-4 space-y-3">
            {((data.sections ?? []) as Array<{ path: string; section_id: string; occurred_at: string }>).map((section, index) => (
              <div key={`${section.path}-${section.section_id}-${index}`} className="rounded-xl bg-slate-50 px-4 py-3">
                <p className="font-semibold text-slate-900">{section.section_id}</p>
                <p className="text-xs text-slate-500">{section.path}</p>
                <p className="mt-1 text-xs text-slate-400">{new Date(section.occurred_at).toLocaleString("es-CL")}</p>
              </div>
            ))}
            {((data.scrolls ?? []) as Array<{ path: string; max_scroll_depth: number }>).map((scroll) => (
              <div key={`${scroll.path}-${scroll.max_scroll_depth}`} className="rounded-xl border border-dashed border-slate-200 px-4 py-3">
                <p className="font-semibold text-slate-900">{scroll.path}</p>
                <p className="text-xs text-slate-500">Scroll máximo: {scroll.max_scroll_depth}%</p>
              </div>
            ))}
            {!(data.sections?.length || data.scrolls?.length) ? (
              <p className="text-sm text-slate-500">Sin secciones ni scroll registrados.</p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="text-lg font-bold text-slate-900">Clics y CTA</h2>
          <div className="mt-4 space-y-3">
            {((data.clicks ?? []) as Array<{ path: string; element_id: string | null; element_label: string | null; event_type: string; occurred_at: string }>).length ? (
              ((data.clicks ?? []) as Array<{ path: string; element_id: string | null; element_label: string | null; event_type: string; occurred_at: string }>).map((click, index) => (
                <div key={`${click.path}-${click.element_id}-${index}`} className="rounded-xl bg-slate-50 px-4 py-3">
                  <p className="font-semibold text-slate-900">{click.element_label || click.element_id || "Sin etiqueta"}</p>
                  <p className="text-xs text-slate-500">{click.event_type} · {click.path}</p>
                  <p className="mt-1 text-xs text-slate-400">{new Date(click.occurred_at).toLocaleString("es-CL")}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">Sin clics relevantes registrados.</p>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="text-lg font-bold text-slate-900">Formularios y conversión</h2>
          <div className="mt-4 space-y-3">
            {((data.forms ?? []) as Array<{ event_type: string; form_name: string | null; occurred_at: string }>).length ? (
              ((data.forms ?? []) as Array<{ event_type: string; form_name: string | null; occurred_at: string }>).map((form, index) => (
                <div key={`${form.event_type}-${form.occurred_at}-${index}`} className="rounded-xl bg-slate-50 px-4 py-3">
                  <p className="font-semibold text-slate-900">{form.form_name || "Formulario"}</p>
                  <p className="text-xs text-slate-500">{form.event_type}</p>
                  <p className="mt-1 text-xs text-slate-400">{new Date(form.occurred_at).toLocaleString("es-CL")}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">Sin formularios registrados.</p>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-bold text-slate-900">Vinculación real</h2>
        <div className="mt-4 space-y-3">
          {identityLinks.length ? (
            identityLinks.map((link, index) => (
              <div key={`${link.identified_at}-${index}`} className="rounded-xl bg-slate-50 px-4 py-3">
                <p className="font-semibold text-slate-900">
                  {link.cotizacion_id ? "Cotización vinculada" : link.lead_id ? "Lead vinculado" : "Registro vinculado"}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {link.cotizacion_id ? `Cotización: ${link.cotizacion_id}` : null}
                  {link.lead_id ? ` ${link.cotizacion_id ? "·" : ""} Lead: ${link.lead_id}` : null}
                  {link.client_id ? ` ${(link.cotizacion_id || link.lead_id) ? "·" : ""} Cliente: ${link.client_id}` : null}
                </p>
                <div className="mt-2 flex gap-3 text-xs font-semibold text-orange-600">
                  {link.lead_id ? <Link href="/admin/leads">Ir a Leads</Link> : null}
                  {link.cotizacion_id ? <Link href="/admin/cotizaciones">Ir a Cotizaciones</Link> : null}
                  {link.client_id ? <Link href="/admin/clientes">Ir a Clientes</Link> : null}
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-500">Esta sesión aún no está vinculada a un lead, cotización o cliente real.</p>
          )}
        </div>
      </div>
    </div>
  );
}

