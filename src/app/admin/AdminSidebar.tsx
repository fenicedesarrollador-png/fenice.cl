"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Inbox,
  Package,
  Building2,
  FileText,
  CalendarDays,
  Tag,
  Settings,
  Globe,
  LogOut,
  Fuel,
  ChevronRight,
  Users,
  ChartColumn,
} from "lucide-react";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/precios-combustible", label: "Precios combustible", icon: Fuel },
  { href: "/admin/cotizaciones", label: "Cotizaciones", icon: Tag },
  { href: "/admin/leads", label: "Leads", icon: Inbox },
  { href: "/admin/productos", label: "Productos", icon: Package },
  { href: "/admin/clientes", label: "Clientes", icon: Building2 },
  { href: "/admin/blog", label: "Blog", icon: FileText },
  { href: "/admin/eventos", label: "Eventos", icon: CalendarDays },
  { href: "/admin/promociones", label: "Promociones", icon: Tag },
  { href: "/admin/metricas", label: "Métricas", icon: ChartColumn },
];

const bottomLinks = [
  { href: "/admin/usuarios", label: "Usuarios", icon: Users },
  { href: "/admin/configuracion", label: "Configuración", icon: Settings },
];

export default function AdminSidebar({
  userEmail,
  userRol,
}: {
  userEmail: string;
  userRol: string;
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <aside className="w-60 bg-slate-950 text-white flex flex-col shrink-0 min-h-screen border-r border-slate-800">
      {/* Brand */}
      <div className="px-5 py-5 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center shrink-0">
            <Fuel className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <div className="leading-none">
            <p className="text-sm font-bold text-white">Fenice SPA</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Admin</p>
          </div>
        </div>
      </div>

      {/* User badge */}
      <div className="px-4 py-3 border-b border-slate-800/60">
        <div className="flex items-center gap-2.5 bg-slate-800/50 rounded-lg px-3 py-2">
          <div className="w-6 h-6 rounded-full bg-orange-500/20 border border-orange-500/30 flex items-center justify-center shrink-0">
            <span className="text-[10px] font-bold text-orange-400">
              {userEmail.slice(0, 1).toUpperCase()}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-xs text-slate-300 truncate">{userEmail}</p>
            <p className="text-[10px] text-slate-500 capitalize">{userRol}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest px-3 pb-2">Módulos</p>
        {links.map((link) => {
          const active = isActive(link.href, link.exact);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                active
                  ? "bg-orange-500/10 text-orange-400 border border-orange-500/20"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <link.icon className={`w-4 h-4 shrink-0 ${active ? "text-orange-400" : "text-slate-500 group-hover:text-slate-300"}`} />
              <span className="flex-1">{link.label}</span>
              {active && <ChevronRight className="w-3 h-3 text-orange-400/60" />}
            </Link>
          );
        })}

        <div className="h-px bg-slate-800 my-3" />
        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest px-3 pb-2">Sistema</p>
        {bottomLinks.map((link) => {
          const active = isActive(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                active
                  ? "bg-orange-500/10 text-orange-400 border border-orange-500/20"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <link.icon className={`w-4 h-4 shrink-0 ${active ? "text-orange-400" : "text-slate-500 group-hover:text-slate-300"}`} />
              <span className="flex-1">{link.label}</span>
              {active && <ChevronRight className="w-3 h-3 text-orange-400/60" />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-3 border-t border-slate-800 space-y-0.5">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all"
        >
          <Globe className="w-4 h-4 text-slate-500" />
          Ver sitio
        </a>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/5 transition-all"
        >
          <LogOut className="w-4 h-4 text-slate-500" />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
