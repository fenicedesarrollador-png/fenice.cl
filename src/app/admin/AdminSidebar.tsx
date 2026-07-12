"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import {
  LayoutDashboard, Inbox, Package, Building2, FileText,
  CalendarDays, Tag, Settings, Globe, LogOut, Fuel,
  Users, ChartColumn, X, ArrowUpRight, ChevronRight,
  DollarSign, BarChart3,
} from "lucide-react";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/precios-combustible", label: "Precios combustible", icon: Fuel },
  { href: "/admin/leads", label: "Solicitudes", icon: Inbox },
  { href: "/admin/cotizaciones", label: "Cotizaciones", icon: DollarSign },
  { href: "/admin/reportes", label: "Reportes", icon: BarChart3 },
  { href: "/admin/productos", label: "Productos", icon: Package },
  { href: "/admin/clientes", label: "Clientes", icon: Building2 },
  { href: "/admin/equipo", label: "Equipo", icon: Users },
  { href: "/admin/blog", label: "Blog", icon: FileText },
  { href: "/admin/eventos", label: "Eventos", icon: CalendarDays },
  { href: "/admin/promociones", label: "Promociones", icon: Tag },
  { href: "/admin/metricas", label: "Métricas", icon: ChartColumn },
];

const bottomLinks = [
  { href: "/admin/usuarios", label: "Usuarios", icon: Users },
  { href: "/admin/configuracion", label: "Configuración", icon: Settings },
];

/* Logo de marca: gota verde con llama ámbar */
function BrandMark() {
  return (
    <div className="relative w-9 h-9 shrink-0">
      <div className="absolute inset-0 rounded-xl bg-[#2bbe6a]/30 blur-md" />
      <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-[#2bbe6a] to-[#149c52] flex items-center justify-center shadow-lg shadow-[#2bbe6a]/30">
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
          <path d="M12 2C12 2 7 8 7 13a5 5 0 0010 0C17 8 12 2 12 2z" fill="#f5a623" />
          <path d="M12 10c0 0-2 2.5-2 4a2 2 0 004 0C14 12.5 12 10 12 10z" fill="white" opacity="0.85" />
        </svg>
      </div>
    </div>
  );
}

function NavLink({
  href, label, icon: Icon, exact, onClick,
}: {
  href: string; label: string; icon: React.ElementType; exact?: boolean; onClick?: () => void;
}) {
  const pathname = usePathname();
  const active = exact ? pathname === href : pathname.startsWith(href);
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13.5px] font-semibold transition-all group relative ${
        active
          ? "bg-gradient-to-r from-[#2bbe6a]/15 to-transparent text-white"
          : "text-[#94a7c2] hover:text-white hover:bg-white/[0.04]"
      }`}
    >
      {active && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#2bbe6a] rounded-r-full shadow-[0_0_14px_rgba(43,190,106,0.8)]" />
      )}
      <Icon
        className={`w-[18px] h-[18px] shrink-0 transition-colors ${
          active ? "text-[#2bbe6a]" : "text-[#5f739a] group-hover:text-slate-200"
        }`}
        strokeWidth={2.1}
      />
      <span className="flex-1 truncate">{label}</span>
      {active && <ChevronRight className="w-3.5 h-3.5 text-[#2bbe6a]/70 shrink-0" />}
    </Link>
  );
}

function SidebarContent({
  userEmail, userRol, onClose,
}: {
  userEmail: string; userRol: string; onClose?: () => void;
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
  const shortEmail = userEmail.length > 24 ? userEmail.slice(0, 21) + "…" : userEmail;

  return (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="px-5 py-[18px] flex items-center justify-between shrink-0 border-b border-white/[0.06]">
        <Link href="/admin" onClick={onClose} className="flex items-center gap-3 group">
          <BrandMark />
          <div className="leading-none">
            <p className="text-[15px] font-black text-white tracking-tight">Fenice <span className="text-[#f5a623]">SPA</span></p>
            <p className="text-[10px] text-[#5f739a] mt-1 font-bold tracking-[0.18em] uppercase">Panel Admin</p>
          </div>
        </Link>
        {onClose && (
          <button onClick={onClose} className="lg:hidden p-1.5 rounded-lg text-[#5f739a] hover:text-white hover:bg-white/5 transition-all">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* User */}
      <div className="px-4 py-3 shrink-0 border-b border-white/[0.06]">
        <div className="flex items-center gap-3 bg-white/[0.04] rounded-xl px-3 py-2.5 ring-1 ring-white/5">
          <div className="relative shrink-0">
            <div className="absolute inset-0 rounded-xl bg-[#f5a623]/25 blur-sm" />
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-[#f5a623] to-[#d98a0e] flex items-center justify-center shadow-md shadow-[#f5a623]/20">
              <span className="text-[13px] font-black text-[#2a1a00]">{initials}</span>
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[12.5px] font-bold text-slate-100 truncate">{shortEmail}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2bbe6a] shadow-[0_0_6px_rgba(43,190,106,0.9)] admin-glow-dot" />
              <p className="text-[10px] text-[#94a7c2] capitalize font-semibold tracking-wide">{userRol}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto admin-nav-scroll">
        <p className="text-[10px] font-black text-[#5f739a] uppercase tracking-[0.14em] px-3 pb-2.5">Módulos</p>
        {links.map((link) => (
          <NavLink key={link.href} {...link} onClick={onClose} />
        ))}
        <div className="h-px bg-white/[0.06] my-4 mx-1" />
        <p className="text-[10px] font-black text-[#5f739a] uppercase tracking-[0.14em] px-3 pb-2.5">Sistema</p>
        {bottomLinks.map((link) => (
          <NavLink key={link.href} {...link} onClick={onClose} />
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-3 border-t border-white/[0.06] space-y-0.5 shrink-0">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] text-[#94a7c2] hover:text-white hover:bg-white/[0.04] transition-all group"
        >
          <Globe className="w-[18px] h-[18px] text-[#5f739a] group-hover:text-slate-200 transition-colors" />
          <span className="flex-1 font-semibold">Ver sitio web</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-[#5f739a]" />
        </a>
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] text-[#94a7c2] hover:text-red-300 hover:bg-red-500/[0.08] transition-all group disabled:opacity-50"
        >
          <LogOut className="w-[18px] h-[18px] text-[#5f739a] group-hover:text-red-400 transition-colors" />
          <span className="font-semibold">{loggingOut ? "Cerrando…" : "Cerrar sesión"}</span>
        </button>
      </div>
    </div>
  );
}

const SIDEBAR_BG = "bg-[#070d18]/95 backdrop-blur-xl border-r border-white/[0.06]";

export default function AdminSidebar({ userEmail, userRol }: { userEmail: string; userRol: string }) {
  return (
    <aside className={`w-[244px] shrink-0 hidden lg:flex flex-col sticky top-0 ${SIDEBAR_BG}`} style={{ height: "100dvh" }}>
      <SidebarContent userEmail={userEmail} userRol={userRol} />
    </aside>
  );
}

export function AdminSidebarMobile({
  userEmail, userRol, open, onClose,
}: {
  userEmail: string; userRol: string; open: boolean; onClose: () => void;
}) {
  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" onClick={onClose} />
      )}
      <aside
        className={`fixed top-0 left-0 w-[272px] z-50 lg:hidden transition-transform duration-300 ease-out shadow-2xl ${SIDEBAR_BG} ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ height: "100dvh" }}
      >
        <SidebarContent userEmail={userEmail} userRol={userRol} onClose={onClose} />
      </aside>
    </>
  );
}
