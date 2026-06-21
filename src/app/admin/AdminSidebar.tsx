"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
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
  X,
  DollarSign,
  ChevronDown,
  ExternalLink,
} from "lucide-react";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/precios-combustible", label: "Precios combustible", icon: Fuel },
  { href: "/admin/cotizaciones", label: "Cotizaciones", icon: DollarSign },
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

function NavLink({
  href,
  label,
  icon: Icon,
  exact,
  onClick,
}: {
  href: string;
  label: string;
  icon: React.ElementType;
  exact?: boolean;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const active = exact ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative ${
        active
          ? "bg-gradient-to-r from-orange-500/15 to-orange-500/5 text-orange-400 shadow-sm"
          : "text-slate-400 hover:text-white hover:bg-slate-800/60"
      }`}
    >
      {active && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-orange-400 rounded-r-full" />
      )}
      <Icon
        className={`w-4 h-4 shrink-0 transition-colors ${
          active ? "text-orange-400" : "text-slate-500 group-hover:text-slate-300"
        }`}
      />
      <span className="flex-1 truncate">{label}</span>
      {active && <ChevronRight className="w-3 h-3 text-orange-400/60 shrink-0" />}
    </Link>
  );
}

function SidebarContent({
  userEmail,
  userRol,
  onClose,
}: {
  userEmail: string;
  userRol: string;
  onClose?: () => void;
}) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  const initials = userEmail.slice(0, 2).toUpperCase();
  const shortEmail = userEmail.length > 22 ? userEmail.slice(0, 19) + "…" : userEmail;

  return (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="px-5 py-4 border-b border-slate-800/80 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/20 shrink-0">
            <Fuel className="w-4.5 h-4.5 text-white" strokeWidth={2.5} />
          </div>
          <div className="leading-none">
            <p className="text-sm font-bold text-white tracking-tight">Fenice SPA</p>
            <p className="text-[10px] text-orange-400/70 mt-0.5 font-medium tracking-wider uppercase">Panel Admin</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition-all">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* User card */}
      <div className="px-4 py-3 border-b border-slate-800/50 shrink-0">
        <div className="flex items-center gap-2.5 bg-slate-800/40 hover:bg-slate-800/60 rounded-xl px-3 py-2.5 transition-colors cursor-default">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500/30 to-orange-600/20 border border-orange-500/30 flex items-center justify-center shrink-0">
            <span className="text-xs font-bold text-orange-300">{initials}</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-slate-200 truncate">{shortEmail}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 shrink-0" />
              <p className="text-[10px] text-slate-400 capitalize font-medium">{userRol}</p>
            </div>
          </div>
          <ChevronDown className="w-3 h-3 text-slate-600 shrink-0" />
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto scrollbar-none">
        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.12em] px-3 pb-2.5">Módulos</p>
        {links.map((link) => (
          <NavLink key={link.href} {...link} onClick={onClose} />
        ))}

        <div className="h-px bg-slate-800/80 my-4 mx-1" />

        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.12em] px-3 pb-2.5">Sistema</p>
        {bottomLinks.map((link) => (
          <NavLink key={link.href} {...link} onClick={onClose} />
        ))}
      </nav>

      {/* Bottom actions */}
      <div className="px-3 py-3 border-t border-slate-800/80 space-y-0.5 shrink-0">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all group"
        >
          <Globe className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-colors" />
          <span className="flex-1 font-medium">Ver sitio</span>
          <ExternalLink className="w-3 h-3 text-slate-600" />
        </a>
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-red-300 hover:bg-red-500/8 transition-all group disabled:opacity-50"
        >
          <LogOut className="w-4 h-4 text-slate-500 group-hover:text-red-400 transition-colors" />
          <span className="font-medium">{loggingOut ? "Cerrando..." : "Cerrar sesión"}</span>
        </button>
      </div>
    </div>
  );
}

export default function AdminSidebar({
  userEmail,
  userRol,
}: {
  userEmail: string;
  userRol: string;
}) {
  return (
    <aside className="w-60 bg-slate-950 text-white flex flex-col shrink-0 border-r border-slate-800/80 hidden lg:flex" style={{ minHeight: "100dvh" }}>
      <SidebarContent userEmail={userEmail} userRol={userRol} />
    </aside>
  );
}

export function AdminSidebarMobile({
  userEmail,
  userRol,
  open,
  onClose,
}: {
  userEmail: string;
  userRol: string;
  open: boolean;
  onClose: () => void;
}) {
  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      {/* Drawer */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-slate-950 text-white z-50 lg:hidden transition-transform duration-300 ease-out shadow-2xl border-r border-slate-800/80 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ height: "100dvh" }}
      >
        <SidebarContent userEmail={userEmail} userRol={userRol} onClose={onClose} />
      </aside>
    </>
  );
}
