import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import {
  Inbox,
  Package,
  FileText,
  CalendarDays,
  Tag,
  ArrowRight,
  AlertCircle,
  Plus,
  ExternalLink,
  Settings,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Activity,
  Zap,
  CheckCircle2,
  Clock,
} from "lucide-react";

export const metadata: Metadata = { title: "Dashboard | Admin Fenice" };

function StatCard({
  label,
  value,
  sub,
  href,
  icon: Icon,
  alert,
  trend,
  trendLabel,
}: {
  label: string;
  value: number;
  sub: string;
  href: string;
  icon: React.ElementType;
  alert?: boolean;
  trend?: "up" | "down" | "neutral";
  trendLabel?: string;
}) {
  return (
    <Link
      href={href}
      className="group bg-white border border-slate-100 hover:border-orange-200 hover:shadow-lg hover:shadow-orange-500/5 rounded-2xl p-5 transition-all duration-200 relative overflow-hidden"
    >
      {alert && (
        <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full m-3 animate-pulse" />
      )}
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
          alert
            ? "bg-red-50 group-hover:bg-red-100"
            : "bg-slate-50 group-hover:bg-orange-50"
        }`}>
          <Icon className={`w-5 h-5 ${alert ? "text-red-500" : "text-slate-500 group-hover:text-orange-500"} transition-colors`} />
        </div>
        {trend && trendLabel && (
          <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full ${
            trend === "up"
              ? "bg-green-50 text-green-600"
              : trend === "down"
              ? "bg-red-50 text-red-600"
              : "bg-slate-50 text-slate-500"
          }`}>
            {trend === "up" ? <TrendingUp className="w-3 h-3" /> : trend === "down" ? <TrendingDown className="w-3 h-3" /> : null}
            {trendLabel}
          </span>
        )}
      </div>
      <p className="text-3xl font-black text-slate-900 tabular-nums mb-1">{value}</p>
      <p className="text-xs font-semibold text-slate-600">{label}</p>
      <p className="text-[11px] text-slate-400 mt-0.5">{sub}</p>
      <div className="mt-3 flex items-center gap-1 text-[11px] font-semibold text-slate-400 group-hover:text-orange-500 transition-colors">
        Ver detalle <ArrowRight className="w-3 h-3" />
      </div>
    </Link>
  );
}

export default async function AdminDashboard() {
  let stats = {
    leads: 0, leadsNuevos: 0, leadsContactados: 0,
    cotizaciones: 0, cotizacionesNuevas: 0,
    productos: 0, posts: 0, eventosActivos: 0,
    promoActivas: 0, clientes: 0,
  };

  let recentLeads: { id: string; nombre: string; email?: string; estado: string; created_at: string; comuna?: string }[] = [];
  let recentCotizaciones: { id: string; nombre: string; empresa: string; estado: string; created_at: string }[] = [];

  try {
    const supabase = await createClient();
    const [
      leadsRes, leadsNuevosRes, leadsContactadosRes,
      cotRes, cotNuevasRes,
      prodRes, blogRes, eventosRes, promosRes, clientesRes,
      recentLeadsRes, recentCotRes,
    ] = await Promise.all([
      supabase.from("leads").select("id", { count: "exact", head: true }),
      supabase.from("leads").select("id", { count: "exact", head: true }).eq("estado", "nuevo"),
      supabase.from("leads").select("id", { count: "exact", head: true }).eq("estado", "contactado"),
      supabase.from("cotizaciones").select("id", { count: "exact", head: true }),
      supabase.from("cotizaciones").select("id", { count: "exact", head: true }).eq("estado", "nuevo"),
      supabase.from("productos").select("id", { count: "exact", head: true }).eq("activo", true),
      supabase.from("blog_posts").select("id", { count: "exact", head: true }).eq("publicado", true),
      supabase.from("eventos").select("id", { count: "exact", head: true }).eq("activo", true),
      supabase.from("promociones").select("id", { count: "exact", head: true }).eq("activo", true),
      supabase.from("clientes").select("id", { count: "exact", head: true }).eq("activo", true),
      supabase.from("leads").select("id, nombre, email, estado, created_at, comuna").order("created_at", { ascending: false }).limit(5),
      supabase.from("cotizaciones").select("id, nombre, empresa, estado, created_at").order("created_at", { ascending: false }).limit(5),
    ]);

    stats = {
      leads: leadsRes.count ?? 0,
      leadsNuevos: leadsNuevosRes.count ?? 0,
      leadsContactados: leadsContactadosRes.count ?? 0,
      cotizaciones: cotRes.count ?? 0,
      cotizacionesNuevas: cotNuevasRes.count ?? 0,
      productos: prodRes.count ?? 0,
      posts: blogRes.count ?? 0,
      eventosActivos: eventosRes.count ?? 0,
      promoActivas: promosRes.count ?? 0,
      clientes: clientesRes.count ?? 0,
    };

    if (recentLeadsRes.data) recentLeads = recentLeadsRes.data;
    if (recentCotRes.data) recentCotizaciones = recentCotRes.data;
  } catch {}

  const totalAlertas = stats.leadsNuevos + stats.cotizacionesNuevas;

  const kpis = [
    {
      label: "Leads nuevos",
      value: stats.leadsNuevos,
      sub: `${stats.leads} total · ${stats.leadsContactados} en seguimiento`,
      href: "/admin/leads",
      icon: Inbox,
      alert: stats.leadsNuevos > 0,
      trend: stats.leadsNuevos > 0 ? ("up" as const) : ("neutral" as const),
      trendLabel: stats.leadsNuevos > 0 ? `${stats.leadsNuevos} sin atender` : "Al día",
    },
    {
      label: "Cotizaciones nuevas",
      value: stats.cotizacionesNuevas,
      sub: `${stats.cotizaciones} total recibidas`,
      href: "/admin/cotizaciones",
      icon: DollarSign,
      alert: stats.cotizacionesNuevas > 0,
      trend: stats.cotizacionesNuevas > 0 ? ("up" as const) : ("neutral" as const),
      trendLabel: stats.cotizacionesNuevas > 0 ? `${stats.cotizacionesNuevas} pendientes` : "Al día",
    },
    {
      label: "Productos activos",
      value: stats.productos,
      sub: "en catálogo público",
      href: "/admin/productos",
      icon: Package,
      trend: "neutral" as const,
    },
    {
      label: "Posts publicados",
      value: stats.posts,
      sub: "artículos en blog",
      href: "/admin/blog",
      icon: FileText,
      trend: "neutral" as const,
    },
    {
      label: "Clientes activos",
      value: stats.clientes,
      sub: "logos en sitio",
      href: "/admin/clientes",
      icon: Users,
      trend: "neutral" as const,
    },
    {
      label: "Promociones activas",
      value: stats.promoActivas,
      sub: "campañas vigentes",
      href: "/admin/promociones",
      icon: Tag,
      trend: stats.promoActivas > 0 ? ("up" as const) : ("neutral" as const),
      trendLabel: stats.promoActivas > 0 ? "En curso" : undefined,
    },
  ];

  const ESTADO_COLOR: Record<string, string> = {
    nuevo: "bg-red-100 text-red-700",
    contactado: "bg-amber-100 text-amber-700",
    cerrado: "bg-green-100 text-green-700",
    en_proceso: "bg-blue-100 text-blue-700",
    cotizado: "bg-purple-100 text-purple-700",
  };

  const quickActions = [
    { href: "/admin/leads", label: "Gestionar leads", icon: Inbox, badge: stats.leadsNuevos > 0 ? stats.leadsNuevos : undefined },
    { href: "/admin/cotizaciones", label: "Ver cotizaciones", icon: DollarSign, badge: stats.cotizacionesNuevas > 0 ? stats.cotizacionesNuevas : undefined },
    { href: "/admin/productos/nuevo", label: "Nuevo producto", icon: Plus, badge: undefined },
    { href: "/admin/blog/nuevo", label: "Nuevo post", icon: Plus, badge: undefined },
    { href: "/admin/precios-combustible", label: "Actualizar precios", icon: Zap, badge: undefined },
    { href: "/admin/configuracion", label: "Configuración", icon: Settings, badge: undefined },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Dashboard</h1>
          <p className="text-slate-400 text-sm mt-0.5">
            Resumen operativo · Fenice SPA ·{" "}
            <span className="font-medium">
              {new Date().toLocaleDateString("es-CL", { weekday: "long", day: "numeric", month: "long" })}
            </span>
          </p>
        </div>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-xs text-slate-500 hover:text-slate-900 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 px-3.5 py-2 rounded-xl transition-all self-start sm:self-auto font-medium"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 shrink-0" />
          Ver sitio
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Alert banner */}
      {totalAlertas > 0 && (
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3 shadow-lg shadow-orange-500/20">
          <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
            <AlertCircle className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-white text-sm">
              {totalAlertas} solicitud{totalAlertas > 1 ? "es" : ""} requieren atención
            </p>
            <p className="text-orange-100 text-xs mt-0.5">
              {stats.leadsNuevos > 0 && `${stats.leadsNuevos} lead${stats.leadsNuevos > 1 ? "s" : ""} nuevo${stats.leadsNuevos > 1 ? "s" : ""}`}
              {stats.leadsNuevos > 0 && stats.cotizacionesNuevas > 0 && " · "}
              {stats.cotizacionesNuevas > 0 && `${stats.cotizacionesNuevas} cotización${stats.cotizacionesNuevas > 1 ? "es" : ""} sin procesar`}
            </p>
          </div>
          <div className="flex gap-2 shrink-0 flex-wrap">
            {stats.leadsNuevos > 0 && (
              <Link
                href="/admin/leads"
                className="inline-flex items-center gap-1.5 bg-white text-orange-600 text-xs font-bold px-3.5 py-2 rounded-xl hover:bg-orange-50 transition-colors"
              >
                Ver leads <ArrowRight className="w-3 h-3" />
              </Link>
            )}
            {stats.cotizacionesNuevas > 0 && (
              <Link
                href="/admin/cotizaciones"
                className="inline-flex items-center gap-1.5 bg-white/20 text-white text-xs font-bold px-3.5 py-2 rounded-xl hover:bg-white/30 transition-colors border border-white/30"
              >
                Ver cotizaciones <ArrowRight className="w-3 h-3" />
              </Link>
            )}
          </div>
        </div>
      )}

      {/* KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 lg:gap-4">
        {kpis.map((kpi) => (
          <StatCard key={kpi.label} {...kpi} />
        ))}
      </div>

      {/* Middle row: Recent activity + Quick actions */}
      <div className="grid lg:grid-cols-5 gap-4 lg:gap-6">
        {/* Recent leads */}
        <div className="lg:col-span-3 bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-slate-50 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Actividad reciente</h2>
              <p className="text-[11px] text-slate-400 mt-0.5">Últimos leads y cotizaciones</p>
            </div>
            <Activity className="w-4 h-4 text-slate-300" />
          </div>

          {recentLeads.length === 0 && recentCotizaciones.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-slate-400 text-sm">Sin actividad reciente.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {recentLeads.slice(0, 3).map((lead) => (
                <Link
                  key={`lead-${lead.id}`}
                  href="/admin/leads"
                  className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[11px] font-black text-orange-500 shrink-0">
                    {lead.nombre.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{lead.nombre}</p>
                    <p className="text-[11px] text-slate-400 truncate">
                      Lead{lead.comuna ? ` · ${lead.comuna}` : ""} ·{" "}
                      {new Date(lead.created_at).toLocaleDateString("es-CL", { day: "2-digit", month: "short" })}
                    </p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${ESTADO_COLOR[lead.estado] ?? "bg-slate-100 text-slate-500"}`}>
                    {lead.estado}
                  </span>
                </Link>
              ))}
              {recentCotizaciones.slice(0, 2).map((cot) => (
                <Link
                  key={`cot-${cot.id}`}
                  href="/admin/cotizaciones"
                  className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[11px] font-black text-blue-500 shrink-0">
                    <DollarSign className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{cot.empresa}</p>
                    <p className="text-[11px] text-slate-400 truncate">
                      Cotización · {cot.nombre} ·{" "}
                      {new Date(cot.created_at).toLocaleDateString("es-CL", { day: "2-digit", month: "short" })}
                    </p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${ESTADO_COLOR[cot.estado] ?? "bg-slate-100 text-slate-500"}`}>
                    {cot.estado}
                  </span>
                </Link>
              ))}
            </div>
          )}

          <div className="px-5 py-3 border-t border-slate-50">
            <Link href="/admin/leads" className="text-xs text-orange-500 hover:text-orange-600 font-semibold flex items-center gap-1 transition-colors">
              Ver todos los leads <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Quick actions */}
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-slate-50 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Acciones rápidas</h2>
              <p className="text-[11px] text-slate-400 mt-0.5">Accesos directos</p>
            </div>
            <Zap className="w-4 h-4 text-slate-300" />
          </div>
          <div className="divide-y divide-slate-50">
            {quickActions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50 transition-colors group"
              >
                <div className="w-7 h-7 rounded-lg bg-slate-50 group-hover:bg-orange-50 border border-slate-100 group-hover:border-orange-100 flex items-center justify-center transition-all shrink-0">
                  <action.icon className="w-3.5 h-3.5 text-slate-400 group-hover:text-orange-500 transition-colors" />
                </div>
                <span className="flex-1 text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">{action.label}</span>
                {action.badge != null && (
                  <span className="w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center shrink-0">
                    {action.badge > 9 ? "9+" : action.badge}
                  </span>
                )}
                <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-orange-400 transition-colors shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row: Status + Módulos summary */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Estado sitio */}
        <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-slate-50">
            <h2 className="text-sm font-bold text-slate-900">Estado del sitio</h2>
          </div>
          <div className="px-5 py-3 space-y-2.5">
            {[
              { label: "Sitio público", href: "https://fenice.cl", status: "online" },
              { label: "Sitemap", href: "https://fenice.cl/sitemap.xml", status: "online" },
              { label: "Robots.txt", href: "https://fenice.cl/robots.txt", status: "online" },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between py-1 hover:text-orange-600 group transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-400 shrink-0" />
                  <span className="text-xs text-slate-600 group-hover:text-orange-600 transition-colors font-medium">{item.label}</span>
                </div>
                <ExternalLink className="w-3 h-3 text-slate-300 group-hover:text-orange-400 transition-colors" />
              </a>
            ))}
            <div className="pt-1 border-t border-slate-50">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                <span className="text-[11px] text-slate-400 font-medium">Todos los sistemas operativos</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content summary */}
        <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-slate-50">
            <h2 className="text-sm font-bold text-slate-900">Contenido publicado</h2>
          </div>
          <div className="px-5 py-3 space-y-2.5">
            {[
              { label: "Productos", value: stats.productos, href: "/admin/productos", icon: Package },
              { label: "Posts blog", value: stats.posts, href: "/admin/blog", icon: FileText },
              { label: "Eventos activos", value: stats.eventosActivos, href: "/admin/eventos", icon: CalendarDays },
              { label: "Promociones", value: stats.promoActivas, href: "/admin/promociones", icon: Tag },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center justify-between py-1 group"
              >
                <div className="flex items-center gap-2">
                  <item.icon className="w-3.5 h-3.5 text-slate-400 group-hover:text-orange-500 transition-colors" />
                  <span className="text-xs text-slate-600 group-hover:text-slate-900 transition-colors font-medium">{item.label}</span>
                </div>
                <span className="text-xs font-black text-slate-900 tabular-nums">{item.value}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Pipeline CRM */}
        <div className="sm:col-span-2 bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-slate-700/50">
            <h2 className="text-sm font-bold text-white">Pipeline comercial</h2>
            <p className="text-[11px] text-slate-400 mt-0.5">Estado global de oportunidades</p>
          </div>
          <div className="px-5 py-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Leads nuevos", value: stats.leadsNuevos, color: "text-red-400", bg: "bg-red-500/10 border-red-500/20" },
              { label: "En contacto", value: stats.leadsContactados, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
              { label: "Cotizaciones", value: stats.cotizaciones, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
              { label: "Total leads", value: stats.leads, color: "text-green-400", bg: "bg-green-500/10 border-green-500/20" },
            ].map((item) => (
              <div key={item.label} className={`rounded-xl border p-3 ${item.bg}`}>
                <p className={`text-2xl font-black tabular-nums ${item.color}`}>{item.value}</p>
                <p className="text-[10px] text-slate-400 font-medium mt-1 leading-tight">{item.label}</p>
              </div>
            ))}
          </div>
          <div className="px-5 pb-4 flex items-center gap-3">
            <Link
              href="/admin/leads"
              className="text-xs text-orange-400 hover:text-orange-300 font-semibold flex items-center gap-1 transition-colors"
            >
              Gestionar leads <ArrowRight className="w-3 h-3" />
            </Link>
            <span className="text-slate-700">·</span>
            <Link
              href="/admin/cotizaciones"
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 transition-colors"
            >
              Ver cotizaciones <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
