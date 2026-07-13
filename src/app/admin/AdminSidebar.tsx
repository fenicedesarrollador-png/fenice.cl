"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import BrandLogo from "@/components/BrandLogo";
import {
  LayoutDashboard, Inbox, Building2, FileText,
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
          ? "bg-gradient-to-r from-[#1a6b3c]/10 to-transparent text-[#0a1628]"
          : "text-slate-500 hover:text-[#0a1628] hover:bg-slate-50"
      }`}
    >
      {active && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#1a6b3c] rounded-r-full" />
      )}
      <Icon
        className={`w-[18px] h-[18px] shrink-0 transition-colors ${
          active ? "text-[#1a6b3c]" : "text-slate-400 group-hover:text-slate-700"
        }`}
        strokeWidth={2.1}
      />
      <span className="flex-1 truncate">{label}</span>
      {active && <ChevronRight className="w-3.5 h-3.5 text-[#1a6b3c]/70 shrink-0" />}
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
      <div className="px-5 py-[18px] flex items-center justify-between shrink-0 border-b border-slate-100">
        <Link href="/admin" onClick={onClose} className="flex flex-col items-start gap-1.5 group">
          <BrandLogo className="h-10 w-[137px]" />
          <p className="text-[10px] text-slate-400 font-bold tracking-[0.18em] uppercase">Panel Admin</p>
        </Link>
        {onClose && (
          <button onClick={onClose} className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-[#0a1628] hover:bg-slate-100 transition-all">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* User */}
      <div className="px-4 py-3 shrink-0 border-b border-slate-100">
        <div className="flex items-center gap-3 bg-slate-50 rounded-xl px-3 py-2.5 ring-1 ring-slate-100">
          <div className="relative shrink-0">
            <div className="absolute inset-0 rounded-xl bg-[#f5a623]/25 blur-sm" />
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-[#f5a623] to-[#d98a0e] flex items-center justify-center shadow-md shadow-[#f5a623]/20">
              <span className="text-[13px] font-black text-[#2a1a00]">{initials}</span>
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[12.5px] font-bold text-[#0a1628] truncate">{shortEmail}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1a6b3c] admin-glow-dot" />
              <p className="text-[10px] text-slate-500 capitalize font-semibold tracking-wide">{userRol}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto admin-nav-scroll">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.14em] px-3 pb-2.5">Módulos</p>
        {links.map((link) => (
          <NavLink key={link.href} {...link} onClick={onClose} />
        ))}
        <div className="h-px bg-slate-100 my-4 mx-1" />
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.14em] px-3 pb-2.5">Sistema</p>
        {bottomLinks.map((link) => (
          <NavLink key={link.href} {...link} onClick={onClose} />
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-3 border-t border-slate-100 space-y-0.5 shrink-0">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] text-slate-500 hover:text-[#0a1628] hover:bg-slate-50 transition-all group"
        >
          <Globe className="w-[18px] h-[18px] text-slate-400 group-hover:text-slate-700 transition-colors" />
          <span className="flex-1 font-semibold">Ver sitio web</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
        </a>
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] text-slate-500 hover:text-red-600 hover:bg-red-50 transition-all group disabled:opacity-50"
        >
          <LogOut className="w-[18px] h-[18px] text-slate-400 group-hover:text-red-500 transition-colors" />
          <span className="font-semibold">{loggingOut ? "Cerrando…" : "Cerrar sesión"}</span>
        </button>
      </div>
    </div>
  );
}

const SIDEBAR_BG = "bg-white border-r border-slate-200";

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
