"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, ChevronDown, Phone, Fuel, Truck, Container, MapPin } from "lucide-react";
import { SERVICIOS } from "@/lib/config";
import type { SiteConfig } from "@/lib/getSiteConfig";

const SERVICIO_ICONS = [Fuel, Truck, Container];

const NAV_LINKS = [
  { href: "/cobertura", label: "Cobertura" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/blog", label: "Blog" },
  { href: "/contacto", label: "Contacto" },
];

export default function Header({ config }: { config: SiteConfig }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Top bar */}
      <div className="hidden lg:block bg-slate-900 text-slate-300 text-xs">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-9">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3 h-3 text-orange-400" />
              {config.direccion} — Cobertura RM, Valparaíso y Rancagua
            </span>
          </div>
          <div className="flex items-center gap-5">
            <span>{config.horario}</span>
            <a
              href={`tel:${config.telefono}`}
              className="flex items-center gap-1.5 text-white hover:text-orange-400 transition-colors font-medium"
            >
              <Phone className="w-3 h-3" />
              {config.telefono}
            </a>
          </div>
        </div>
      </div>

      {/* Main header */}
      <header
        className={`sticky top-0 z-50 bg-white transition-shadow duration-200 ${
          scrolled ? "shadow-md border-b border-slate-100" : "border-b border-slate-100"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-18">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 shrink-0 group">
              <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center shadow-sm group-hover:bg-orange-600 transition-colors">
                <Fuel className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-lg font-bold text-slate-900 tracking-tight">Fenice</span>
                <span className="text-[10px] font-semibold text-orange-500 tracking-widest uppercase leading-none">SPA</span>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1">
              <div
                className="relative"
                onMouseEnter={() => setServicesOpen(true)}
                onMouseLeave={() => setServicesOpen(false)}
              >
                <button className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-50 transition-all">
                  Servicios
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${servicesOpen ? "rotate-180" : ""}`} />
                </button>

                {servicesOpen && (
                  <div className="absolute top-full left-0 mt-1 w-72 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50">
                    <div className="px-3 py-2 mb-1 border-b border-slate-50">
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Nuestros servicios</p>
                    </div>
                    {SERVICIOS.map((s, i) => {
                      const Icon = SERVICIO_ICONS[i] ?? Fuel;
                      return (
                        <Link
                          key={s.slug}
                          href={`/servicios/${s.slug}`}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-orange-50 group transition-colors"
                        >
                          <div className="w-8 h-8 rounded-lg bg-orange-100 group-hover:bg-orange-200 flex items-center justify-center transition-colors shrink-0">
                            <Icon className="w-4 h-4 text-orange-600" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-800 group-hover:text-orange-700">{s.nombre}</p>
                            <p className="text-xs text-slate-400 leading-tight mt-0.5">{s.descripcion.slice(0, 48)}…</p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>

              {NAV_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-50 transition-all"
                >
                  {l.label}
                </Link>
              ))}
            </nav>

            {/* CTA */}
            <div className="hidden lg:flex items-center gap-3">
              <a
                href={`https://wa.me/${config.whatsapp_numero}?text=${encodeURIComponent("Hola, quiero cotizar petróleo a domicilio para mi empresa.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors shadow-sm"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.531 5.856L0 24l6.335-1.509A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.81 9.81 0 01-5.003-1.371l-.359-.214-3.754.894.954-3.652-.234-.374A9.785 9.785 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/></svg>
                Cotizar ahora
              </a>
            </div>

            {/* Mobile toggle */}
            <button
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
              onClick={() => setOpen(!open)}
              aria-label={open ? "Cerrar menú" : "Abrir menú"}
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="lg:hidden border-t border-slate-100 bg-white">
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-3 pb-1">Servicios</p>
              {SERVICIOS.map((s, i) => {
                const Icon = SERVICIO_ICONS[i] ?? Fuel;
                return (
                  <Link
                    key={s.slug}
                    href={`/servicios/${s.slug}`}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-50 transition-colors"
                    onClick={() => setOpen(false)}
                  >
                    <Icon className="w-4 h-4 text-orange-500 shrink-0" />
                    <span className="text-sm font-medium text-slate-700">{s.nombre}</span>
                  </Link>
                );
              })}
              <div className="h-px bg-slate-100 my-2" />
              {NAV_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="block px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </Link>
              ))}
              <div className="pt-3">
                <a
                  href={`https://wa.me/${config.whatsapp_numero}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg text-sm transition-colors"
                >
                  Cotizar por WhatsApp
                </a>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 text-sm text-slate-500">
                <Phone className="w-4 h-4 text-slate-400" />
                <a href={`tel:${config.telefono}`} className="font-medium hover:text-orange-500">{config.telefono}</a>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
