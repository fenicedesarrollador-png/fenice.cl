import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import {
  Inbox, Package, FileText, CalendarDays, Tag, ArrowRight,
  Plus, DollarSign, Users, Activity, Zap, Fuel, Settings,
  TrendingUp, Sparkles, Clock,
} from "lucide-react";

export const metadata: Metadata = { title: "Dashboard | Admin Fenice" };

export default async function AdminDashboard() {
  let stats = {
    leads: 0, leadsNuevos: 0, leadsContactados: 0, leadsCerrados: 0,
    cotizaciones: 0, cotizacionesNuevas: 0,
    productos: 0, posts: 0, eventosActivos: 0, promoActivas: 0, clientes: 0,
  };
  let recentLeads: { id: string; nombre: string; estado: string; created_at: string; comuna?: string }[] = [];
  let recentCotizaciones: { id: string; nombre: string; empresa: string; estado: string; created_at: string }[] = [];

  try {
    const supabase = await createClient();
    const [
      leadsRes, leadsNuevosRes, leadsContactadosRes, leadsCerradosRes,
      cotRes, cotNuevasRes,
      prodRes, blogRes, eventosRes, promosRes, clientesRes,
      recentLeadsRes, recentCotRes,
    ] = await Promise.all([
      supabase.from("leads").select("id", { count: "exact", head: true }),
      supabase.from("leads").select("id", { count: "exact", head: true }).eq("estado", "nuevo"),
      supabase.from("leads").select("id", { count: "exact", head: true }).eq("estado", "contactado"),
      supabase.from("leads").select("id", { count: "exact", head: true }).eq("estado", "cerrado"),
      supabase.from("cotizaciones").select("id", { count: "exact", head: true }),
      supabase.from("cotizaciones").select("id", { count: "exact", head: true }).eq("estado", "nuevo"),
      supabase.from("productos").select("id", { count: "exact", head: true }).eq("activo", true),
      supabase.from("blog_posts").select("id", { count: "exact", head: true }).eq("publicado", true),
      supabase.from("eventos").select("id", { count: "exact", head: true }).eq("activo", true),
      supabase.from("promociones").select("id", { count: "exact", head: true }).eq("activo", true),
      supabase.from("clientes").select("id", { count: "exact", head: true }).eq("activo", true),
      supabase.from("leads").select("id, nombre, estado, created_at, comuna").order("created_at", { ascending: false }).limit(4),
      supabase.from("cotizaciones").select("id, nombre, empresa, estado, created_at").order("created_at", { ascending: false }).limit(3),
    ]);
    stats = {
      leads: leadsRes.count ?? 0,
      leadsNuevos: leadsNuevosRes.count ?? 0,
      leadsContactados: leadsContactadosRes.count ?? 0,
      leadsCerrados: leadsCerradosRes.count ?? 0,
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
  const tasaCierre = stats.leads > 0 ? Math.round((stats.leadsCerrados / stats.leads) * 100) : 0;

  const ESTADO_TONE: Record<string, string> = {
    nuevo: "bg-red-500/15 text-red-300",
    contactado: "bg-[#f5a623]/15 text-[#f8c46a]",
    cerrado: "bg-[#2bbe6a]/15 text-[#5fe39a]",
    en_proceso: "bg-blue-400/15 text-blue-200",
    cotizado: "bg-purple-400/15 text-purple-200",
  };

  const kpis = [
    { label: "Contactos", value: stats.leads, sub: `${stats.leadsNuevos} nuevos`, href: "/admin/leads?origen=contacto", icon: Inbox, color: "green", alert: stats.leadsNuevos > 0 },
    { label: "Cotizaciones", value: stats.cotizaciones, sub: `${stats.cotizacionesNuevas} sin procesar`, href: "/admin/leads?origen=cotizacion", icon: DollarSign, color: "amber", alert: stats.cotizacionesNuevas > 0 },
    { label: "Productos activos", value: stats.productos, sub: "en catálogo", href: "/admin/productos", icon: Package, color: "navy", alert: false },
    { label: "Tasa de cierre", value: `${tasaCierre}%`, sub: `${stats.leadsCerrados} cerrados`, href: "/admin/leads", icon: TrendingUp, color: "green", alert: false },
  ];

  const colorMap: Record<string, { ring: string; iconBg: string; val: string; glow: string }> = {
    green: { ring: "ring-[#2bbe6a]/20", iconBg: "bg-[#2bbe6a]/15 text-[#2bbe6a]", val: "text-[#e8eef7]", glow: "from-[#2bbe6a]/20" },
    amber: { ring: "ring-[#f5a623]/20", iconBg: "bg-[#f5a623]/15 text-[#f5a623]", val: "text-[#e8eef7]", glow: "from-[#f5a623]/20" },
    navy: { ring: "ring-white/10", iconBg: "bg-white/8 text-slate-300", val: "text-[#e8eef7]", glow: "from-white/10" },
  };

  const modules = [
    { label: "Posts blog", value: stats.posts, href: "/admin/blog", icon: FileText },
    { label: "Clientes activos", value: stats.clientes, href: "/admin/clientes", icon: Users },
    { label: "Eventos activos", value: stats.eventosActivos, href: "/admin/eventos", icon: CalendarDays },
    { label: "Promociones", value: stats.promoActivas, href: "/admin/promociones", icon: Tag },
  ];

  const quickActions = [
    { href: "/admin/precios-combustible", label: "Actualizar precios", icon: Fuel },
    { href: "/admin/productos/nuevo", label: "Nuevo producto", icon: Plus },
    { href: "/admin/blog/nuevo", label: "Nuevo post", icon: Plus },
    { href: "/admin/configuracion", label: "Configuración", icon: Settings },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-7 max-w-[1280px] mx-auto space-y-5 admin-rise">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3.5">
          <div className="relative shrink-0">
            <div className="absolute inset-0 rounded-2xl bg-[#2bbe6a]/30 blur-lg" />
            <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-[#2bbe6a] to-[#149c52] flex items-center justify-center shadow-lg shadow-[#2bbe6a]/30">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#e8eef7] tracking-tight">Buen día 👋</h1>
            <p className="text-[#94a7c2] text-[13px] font-medium capitalize">
              {new Date().toLocaleDateString("es-CL", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
        </div>
      </div>

      {/* Alert */}
      {totalAlertas > 0 && (
        <div className="admin-card !bg-gradient-to-r !from-[#f5a623]/[0.12] !to-transparent !border-[#f5a623]/25 px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-4 relative overflow-hidden">
          <div className="absolute -right-8 -top-8 w-40 h-40 bg-[#f5a623]/15 rounded-full blur-3xl" />
          <div className="w-10 h-10 bg-gradient-to-br from-[#f5a623] to-[#e08a0a] rounded-xl flex items-center justify-center shrink-0 relative shadow-lg shadow-[#f5a623]/30">
            <Zap className="w-5 h-5 text-[#2a1a00]" fill="currentColor" />
          </div>
          <div className="flex-1 relative">
            <p className="font-black text-[#e8eef7] text-sm">{totalAlertas} solicitud{totalAlertas > 1 ? "es" : ""} requieren tu atención</p>
            <p className="text-[#94a7c2] text-xs mt-0.5">
              {stats.leadsNuevos > 0 && `${stats.leadsNuevos} lead${stats.leadsNuevos > 1 ? "s" : ""} nuevo${stats.leadsNuevos > 1 ? "s" : ""}`}
              {stats.leadsNuevos > 0 && stats.cotizacionesNuevas > 0 && " · "}
              {stats.cotizacionesNuevas > 0 && `${stats.cotizacionesNuevas} cotización${stats.cotizacionesNuevas > 1 ? "es" : ""} pendiente${stats.cotizacionesNuevas > 1 ? "s" : ""}`}
            </p>
          </div>
          <div className="flex gap-2 shrink-0 relative flex-wrap">
            {stats.leadsNuevos > 0 && (
              <Link href="/admin/leads" className="admin-btn-amber !text-xs !py-2 !px-3.5">
                Ver leads <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
            {stats.cotizacionesNuevas > 0 && (
              <Link href="/admin/leads?origen=cotizacion" className="admin-btn-ghost !text-xs !py-2 !px-3.5">
                Ver cotizaciones <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        </div>
      )}

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {kpis.map((kpi, i) => {
          const c = colorMap[kpi.color];
          return (
            <Link
              key={kpi.label}
              href={kpi.href}
              style={{ animationDelay: `${i * 60}ms` }}
              className={`admin-card admin-card-hover admin-rise p-5 group relative overflow-hidden ring-1 ${c.ring}`}
            >
              <div className={`absolute -right-10 -top-10 w-28 h-28 rounded-full blur-2xl bg-gradient-to-br ${c.glow} to-transparent opacity-0 group-hover:opacity-100 transition-opacity`} />
              <div className="flex items-start justify-between mb-3.5 relative">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${c.iconBg}`}>
                  <kpi.icon className="w-5 h-5" strokeWidth={2.2} />
                </div>
                {kpi.alert && (
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                  </span>
                )}
              </div>
              <p className={`text-[28px] leading-none font-black tabular-nums relative ${c.val}`}>{kpi.value}</p>
              <p className="text-[12.5px] font-bold text-[#94a7c2] mt-2 relative">{kpi.label}</p>
              <p className="text-[11px] text-[#5f739a] mt-0.5 relative">{kpi.sub}</p>
              <ArrowRight className="w-4 h-4 text-[#5f739a] group-hover:text-[#2bbe6a] absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all -translate-x-1 group-hover:translate-x-0" />
            </Link>
          );
        })}
      </div>

      {/* Main grid */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Actividad reciente */}
        <div className="lg:col-span-2 admin-card overflow-hidden">
          <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Activity className="w-4 h-4 text-[#2bbe6a]" />
              <h2 className="text-sm font-black text-[#e8eef7]">Actividad reciente</h2>
            </div>
            <Link href="/admin/leads" className="text-[12px] font-bold text-[#2bbe6a] hover:text-[#5fe39a] flex items-center gap-1 transition-colors">
              Ver todo <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {recentLeads.length === 0 && recentCotizaciones.length === 0 ? (
            <div className="py-14 text-center">
              <Clock className="w-7 h-7 text-[#33415c] mx-auto mb-2" />
              <p className="text-[#94a7c2] text-sm font-medium">Sin actividad reciente todavía.</p>
            </div>
          ) : (
            <div className="divide-y divide-white/[0.05]">
              {recentLeads.map((lead) => (
                <Link key={`l-${lead.id}`} href="/admin/leads" className="flex items-center gap-3 px-5 py-3 hover:bg-white/[0.03] transition-colors">
                  <div className="w-9 h-9 rounded-xl bg-[#2bbe6a]/12 flex items-center justify-center text-[11px] font-black text-[#2bbe6a] shrink-0">
                    {lead.nombre.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-bold text-[#e8eef7] truncate">{lead.nombre}</p>
                    <p className="text-[11px] text-[#5f739a] truncate">
                      Lead{lead.comuna ? ` · ${lead.comuna}` : ""} · {new Date(lead.created_at).toLocaleDateString("es-CL", { day: "2-digit", month: "short" })}
                    </p>
                  </div>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full shrink-0 capitalize ${ESTADO_TONE[lead.estado] ?? "bg-white/8 text-slate-400"}`}>
                    {lead.estado}
                  </span>
                </Link>
              ))}
              {recentCotizaciones.map((cot) => (
                <Link key={`c-${cot.id}`} href="/admin/leads?origen=cotizacion" className="flex items-center gap-3 px-5 py-3 hover:bg-white/[0.03] transition-colors">
                  <div className="w-9 h-9 rounded-xl bg-[#f5a623]/12 flex items-center justify-center shrink-0">
                    <DollarSign className="w-4 h-4 text-[#f5a623]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-bold text-[#e8eef7] truncate">{cot.empresa}</p>
                    <p className="text-[11px] text-[#5f739a] truncate">
                      Cotización · {cot.nombre} · {new Date(cot.created_at).toLocaleDateString("es-CL", { day: "2-digit", month: "short" })}
                    </p>
                  </div>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full shrink-0 capitalize ${ESTADO_TONE[cot.estado] ?? "bg-white/8 text-slate-400"}`}>
                    {cot.estado.replace("_", " ")}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Acciones + pipeline */}
        <div className="space-y-4">
          {/* Pipeline mini */}
          <div className="admin-card overflow-hidden p-5 relative">
            <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-[#2bbe6a]/8 rounded-full blur-2xl" />
            <div className="flex items-center gap-2 mb-4 relative">
              <div className="w-1.5 h-1.5 rounded-full bg-[#f5a623] admin-glow-dot" />
              <h2 className="text-xs font-black text-[#e8eef7] uppercase tracking-wider">Pipeline comercial</h2>
            </div>
            <div className="grid grid-cols-3 gap-2.5 relative">
              {[
                { label: "Nuevos", value: stats.leadsNuevos, color: "text-red-400" },
                { label: "Contacto", value: stats.leadsContactados, color: "text-[#f5a623]" },
                { label: "Cerrados", value: stats.leadsCerrados, color: "text-[#2bbe6a]" },
              ].map((s) => (
                <div key={s.label} className="bg-white/[0.04] border border-white/[0.06] rounded-xl p-2.5 text-center">
                  <p className={`text-xl font-black tabular-nums ${s.color}`}>{s.value}</p>
                  <p className="text-[9px] text-[#5f739a] font-bold mt-1 uppercase tracking-wide">{s.label}</p>
                </div>
              ))}
            </div>
            <Link href="/admin/leads" className="mt-4 flex items-center justify-center gap-1.5 text-[12px] font-bold text-[#f5a623] hover:text-[#f8c46a] transition-colors relative">
              Gestionar pipeline <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Quick actions */}
          <div className="admin-card overflow-hidden">
            <div className="px-5 py-3.5 border-b border-white/[0.06] flex items-center gap-2.5">
              <Zap className="w-4 h-4 text-[#f5a623]" />
              <h2 className="text-sm font-black text-[#e8eef7]">Acciones rápidas</h2>
            </div>
            <div className="divide-y divide-white/[0.05]">
              {quickActions.map((a) => (
                <Link key={a.href} href={a.href} className="flex items-center gap-3 px-5 py-2.5 hover:bg-white/[0.03] transition-colors group">
                  <div className="w-7 h-7 rounded-lg bg-white/5 group-hover:bg-[#2bbe6a]/12 flex items-center justify-center transition-colors shrink-0">
                    <a.icon className="w-3.5 h-3.5 text-[#94a7c2] group-hover:text-[#2bbe6a] transition-colors" />
                  </div>
                  <span className="flex-1 text-[13px] font-semibold text-[#94a7c2] group-hover:text-[#e8eef7]">{a.label}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#5f739a] group-hover:text-[#2bbe6a] transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Módulos resumen */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {modules.map((m) => (
          <Link key={m.label} href={m.href} className="admin-card admin-card-hover px-4 py-4 flex items-center gap-3.5 group">
            <div className="w-10 h-10 rounded-xl bg-white/5 group-hover:bg-[#2bbe6a]/12 flex items-center justify-center shrink-0 transition-colors">
              <m.icon className="w-5 h-5 text-[#94a7c2] group-hover:text-[#2bbe6a] transition-colors" />
            </div>
            <div>
              <p className="text-xl font-black text-[#e8eef7] tabular-nums leading-none">{m.value}</p>
              <p className="text-[11px] text-[#94a7c2] font-semibold mt-1">{m.label}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
