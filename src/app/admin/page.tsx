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
  TrendingUp,
  AlertCircle,
  Plus,
  ExternalLink,
  Settings,
} from "lucide-react";

export const metadata: Metadata = { title: "Dashboard | Admin Fenice" };

export default async function AdminDashboard() {
  let stats = { leads: 0, leadsNuevos: 0, productos: 0, posts: 0, eventosActivos: 0, promoActivas: 0 };

  try {
    const supabase = await createClient();
    const [leadsRes, leadsNuevosRes, prodRes, blogRes, eventosRes, promosRes] = await Promise.all([
      supabase.from("leads").select("id", { count: "exact", head: true }),
      supabase.from("leads").select("id", { count: "exact", head: true }).eq("estado", "nuevo"),
      supabase.from("productos").select("id", { count: "exact", head: true }).eq("activo", true),
      supabase.from("blog_posts").select("id", { count: "exact", head: true }).eq("publicado", true),
      supabase.from("eventos").select("id", { count: "exact", head: true }).eq("activo", true),
      supabase.from("promociones").select("id", { count: "exact", head: true }).eq("activo", true),
    ]);
    stats = {
      leads: leadsRes.count ?? 0,
      leadsNuevos: leadsNuevosRes.count ?? 0,
      productos: prodRes.count ?? 0,
      posts: blogRes.count ?? 0,
      eventosActivos: eventosRes.count ?? 0,
      promoActivas: promosRes.count ?? 0,
    };
  } catch {}

  const kpis = [
    {
      label: "Leads nuevos",
      value: stats.leadsNuevos,
      sub: `${stats.leads} total`,
      href: "/admin/leads",
      icon: Inbox,
      alert: stats.leadsNuevos > 0,
    },
    {
      label: "Productos activos",
      value: stats.productos,
      sub: "en catálogo",
      href: "/admin/productos",
      icon: Package,
      alert: false,
    },
    {
      label: "Posts publicados",
      value: stats.posts,
      sub: "en blog",
      href: "/admin/blog",
      icon: FileText,
      alert: false,
    },
    {
      label: "Eventos activos",
      value: stats.eventosActivos,
      sub: "programados",
      href: "/admin/eventos",
      icon: CalendarDays,
      alert: false,
    },
    {
      label: "Promociones",
      value: stats.promoActivas,
      sub: "activas",
      href: "/admin/promociones",
      icon: Tag,
      alert: false,
    },
    {
      label: "Leads contactados",
      value: stats.leads - stats.leadsNuevos,
      sub: "en seguimiento",
      href: "/admin/leads",
      icon: TrendingUp,
      alert: false,
    },
  ];

  const quickActions = [
    { href: "/admin/leads", label: "Ver leads", icon: Inbox },
    { href: "/admin/productos/nuevo", label: "Nuevo producto", icon: Plus },
    { href: "/admin/blog/nuevo", label: "Nuevo post", icon: Plus },
    { href: "/admin/configuracion", label: "Configuración", icon: Settings },
  ];

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-0.5">Resumen de actividad · Fenice SPA</p>
        </div>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 border border-slate-200 hover:border-slate-300 px-3 py-1.5 rounded-lg transition-all"
        >
          <ExternalLink className="w-3 h-3" />
          Ver sitio
        </a>
      </div>

      {/* Alert leads nuevos */}
      {stats.leadsNuevos > 0 && (
        <div className="flex items-start gap-3 bg-orange-50 border border-orange-200 rounded-xl px-5 py-4">
          <AlertCircle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-orange-800 text-sm">
              {stats.leadsNuevos} lead{stats.leadsNuevos > 1 ? "s nuevos" : " nuevo"} sin revisar
            </p>
            <p className="text-orange-700 text-xs mt-0.5">Revisa y asigna estado para no perder oportunidades comerciales.</p>
          </div>
          <Link
            href="/admin/leads"
            className="shrink-0 inline-flex items-center gap-1 text-xs font-semibold text-orange-600 hover:text-orange-800 transition-colors"
          >
            Revisar <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      )}

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {kpis.map((kpi) => (
          <Link
            key={kpi.label}
            href={kpi.href}
            className="group bg-white border border-slate-100 hover:border-orange-200 hover:shadow-md rounded-xl p-5 transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${kpi.alert ? "bg-orange-100" : "bg-slate-100"}`}>
                <kpi.icon className={`w-4 h-4 ${kpi.alert ? "text-orange-500" : "text-slate-500"}`} />
              </div>
              {kpi.alert && (
                <span className="text-[10px] bg-orange-500 text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">
                  Nuevo
                </span>
              )}
            </div>
            <p className="text-2xl font-bold text-slate-900 mb-0.5">{kpi.value}</p>
            <p className="text-xs text-slate-500 font-medium">{kpi.label}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">{kpi.sub}</p>
          </Link>
        ))}
      </div>

      {/* Quick actions + Site status */}
      <div className="grid lg:grid-cols-2 gap-5">
        {/* Acciones rápidas */}
        <div className="bg-white border border-slate-100 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-50">
            <h2 className="text-sm font-semibold text-slate-900">Acciones rápidas</h2>
          </div>
          <div className="divide-y divide-slate-50">
            {quickActions.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 transition-colors group"
              >
                <div className="w-7 h-7 rounded-lg bg-slate-100 group-hover:bg-orange-50 flex items-center justify-center transition-colors">
                  <item.icon className="w-3.5 h-3.5 text-slate-500 group-hover:text-orange-500 transition-colors" />
                </div>
                <span className="text-sm text-slate-700 group-hover:text-slate-900 font-medium">{item.label}</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-orange-400 ml-auto transition-colors" />
              </Link>
            ))}
          </div>
        </div>

        {/* Estado del sitio */}
        <div className="bg-white border border-slate-100 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-50">
            <h2 className="text-sm font-semibold text-slate-900">Estado del sitio</h2>
          </div>
          <div className="divide-y divide-slate-50">
            {[
              { label: "Sitio público", href: "https://fenice.cl", val: "fenice.cl", color: "text-green-600" },
              { label: "Sitemap", href: "https://fenice.cl/sitemap.xml", val: "sitemap.xml", color: "text-blue-600" },
              { label: "Robots.txt", href: "https://fenice.cl/robots.txt", val: "robots.txt", color: "text-blue-600" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between px-5 py-3.5">
                <span className="text-sm text-slate-600">{item.label}</span>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-xs font-semibold ${item.color} flex items-center gap-1 hover:underline`}
                >
                  {item.val}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            ))}
            <div className="px-5 py-3.5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
              <span className="text-xs text-slate-500">Sistema operativo</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
