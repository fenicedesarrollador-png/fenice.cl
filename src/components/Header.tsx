"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, ChevronDown, Phone, Fuel, Truck, Container, MapPin, ArrowRight, Waves } from "lucide-react";
import { SERVICIOS } from "@/lib/config";
import type { SiteConfig } from "@/lib/getSiteConfig";

const SERVICIO_ICONS = [Fuel, Truck, Container];

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
      <div className="hidden lg:block bg-[#0a1628] text-slate-300 text-xs border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-9">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3 h-3 text-[#f5a623]" />
              {config.direccion} — Cobertura RM, Valparaíso y Rancagua
            </span>
          </div>
          <div className="flex items-center gap-5">
            <span className="text-slate-400">{config.horario}</span>
            <a
              href={`tel:${config.telefono}`}
              data-analytics-id="header_phone"
              data-analytics-label={config.telefono}
              data-analytics-cta="phone"
              className="flex items-center gap-1.5 text-white hover:text-[#f5a623] transition-colors font-medium"
            >
              <Phone className="w-3 h-3" />
              {config.telefono}
            </a>
          </div>
        </div>
      </div>

      {/* Main header */}
      <header
        className={`sticky top-0 z-50 bg-white transition-all duration-200 ${
          scrolled ? "shadow-lg border-b border-slate-100" : "border-b border-slate-100"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-[70px]">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 shrink-0 group">
              {/* Flame + drop logo mark */}
              <div className="relative w-9 h-9 shrink-0">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1a6b3c] to-[#145530] flex items-center justify-center shadow-md group-hover:shadow-green-700/30 transition-shadow">
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
                    <path d="M12 2C12 2 7 8 7 13a5 5 0 0010 0C17 8 12 2 12 2z" fill="#f5a623"/>
                    <path d="M12 10c0 0-2 2.5-2 4a2 2 0 004 0C14 12.5 12 10 12 10z" fill="white" opacity="0.8"/>
                  </svg>
                </div>
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-xl font-extrabold text-[#0a1628] tracking-tight">Fenice</span>
                <span className="text-[10px] font-bold text-[#1a6b3c] tracking-[0.2em] uppercase leading-none">SPA</span>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden xl:flex items-center gap-0.5">
              <Link href="/" data-analytics-id="header_nav_inicio" data-analytics-label="Inicio" data-analytics-cta="primary_navigation" className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-[#0a1628] rounded-lg hover:bg-slate-50 transition-all whitespace-nowrap">
                Inicio
              </Link>

              {/* Servicios dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setServicesOpen(true)}
                onMouseLeave={() => setServicesOpen(false)}
              >
                <button type="button" data-analytics-id="header_nav_servicios" data-analytics-label="Servicios" data-analytics-cta="primary_navigation" className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-600 hover:text-[#0a1628] rounded-lg hover:bg-slate-50 transition-all whitespace-nowrap">
                  Servicios
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${servicesOpen ? "rotate-180" : ""}`} />
                </button>

                {servicesOpen && (
                  <div className="absolute top-full left-0 mt-1 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 py-3 z-50">
                    <div className="px-4 py-2 mb-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nuestros servicios</p>
                    </div>
                    {SERVICIOS.map((s, i) => {
                      const Icon = SERVICIO_ICONS[i] ?? Fuel;
                      return (
                        <Link
                          key={s.slug}
                          href={`/servicios/${s.slug}`}
                          data-analytics-id={`header_service_${s.slug}`}
                          data-analytics-label={s.nombre}
                          data-analytics-cta="service_navigation"
                          className="flex items-center gap-3 px-4 py-3 hover:bg-[#f0faf4] group transition-colors mx-2 rounded-xl"
                        >
                          <div className="w-9 h-9 rounded-xl bg-[#1a6b3c]/10 group-hover:bg-[#1a6b3c]/20 flex items-center justify-center transition-colors shrink-0">
                            <Icon className="w-4 h-4 text-[#1a6b3c]" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-800 group-hover:text-[#1a6b3c]">{s.nombre}</p>
                            <p className="text-xs text-slate-400 leading-tight mt-0.5">{s.descripcion.slice(0, 50)}…</p>
                          </div>
                        </Link>
                      );
                    })}
                    <div className="mx-4 mt-2 pt-2 border-t border-slate-100">
                      <Link href="/venta-petroleo-diesel" data-analytics-id="header_nav_venta_diesel" data-analytics-label="Venta de Petróleo Diésel" data-analytics-cta="service_navigation" className="flex items-center gap-2 text-xs font-semibold text-[#f5a623] hover:text-[#d4891a] transition-colors py-1">
                        <Fuel className="w-3.5 h-3.5" /> Venta de Petróleo Diésel
                      </Link>
                      <Link href="/petroleo-a-domicilio" data-analytics-id="header_nav_petroleo_domicilio" data-analytics-label="Petróleo a Domicilio" data-analytics-cta="service_navigation" className="flex items-center gap-2 text-xs font-semibold text-[#f5a623] hover:text-[#d4891a] transition-colors py-1 mt-0.5">
                        <Waves className="w-3.5 h-3.5" /> Petróleo a Domicilio
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <Link href="/nosotros" data-analytics-id="header_nav_nosotros" data-analytics-label="Nosotros" data-analytics-cta="primary_navigation" className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-[#0a1628] rounded-lg hover:bg-slate-50 transition-all whitespace-nowrap">
                Nosotros
              </Link>
              <Link href="/clientes" data-analytics-id="header_nav_clientes" data-analytics-label="Clientes" data-analytics-cta="primary_navigation" className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-[#0a1628] rounded-lg hover:bg-slate-50 transition-all whitespace-nowrap">
                Clientes
              </Link>
              <Link href="/cobertura" data-analytics-id="header_nav_cobertura" data-analytics-label="Cobertura" data-analytics-cta="primary_navigation" className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-[#0a1628] rounded-lg hover:bg-slate-50 transition-all whitespace-nowrap">
                Cobertura
              </Link>
              <Link href="/empresas-faenas-flotas" data-analytics-id="header_nav_empresas" data-analytics-label="Empresas / Faenas / Flotas" data-analytics-cta="primary_navigation" className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-[#0a1628] rounded-lg hover:bg-slate-50 transition-all whitespace-nowrap">
                Empresas / Faenas / Flotas
              </Link>
              <Link href="/preguntas-frecuentes" data-analytics-id="header_nav_faq" data-analytics-label="Preguntas frecuentes" data-analytics-cta="primary_navigation" className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-[#0a1628] rounded-lg hover:bg-slate-50 transition-all whitespace-nowrap">
                FAQ
              </Link>
              <Link href="/contacto" data-analytics-id="header_nav_contacto" data-analytics-label="Contacto" data-analytics-cta="primary_navigation" className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-[#0a1628] rounded-lg hover:bg-slate-50 transition-all whitespace-nowrap">
                Contacto
              </Link>
            </nav>

            {/* CTA */}
            <div className="hidden xl:flex items-center gap-3 shrink-0">
              <Link
                href="/cotizacion"
                data-analytics-id="header_cta_cotizacion"
                data-analytics-label="Solicitar cotización"
                data-analytics-cta="quote"
                className="inline-flex items-center gap-2 bg-[#f5a623] hover:bg-[#d4891a] text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all shadow-md shadow-[#f5a623]/20 hover:shadow-[#f5a623]/30"
              >
                Solicitar cotización
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Mobile toggle */}
            <button
              className="xl:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
              onClick={() => setOpen(!open)}
              aria-label={open ? "Cerrar menú" : "Abrir menú"}
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="xl:hidden border-t border-slate-100 bg-white">
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
              <Link href="/" data-analytics-id="mobile_nav_inicio" data-analytics-label="Inicio" data-analytics-cta="mobile_navigation" className="block px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50" onClick={() => setOpen(false)}>Inicio</Link>

              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 pt-2 pb-1">Servicios</p>
              {SERVICIOS.map((s, i) => {
                const Icon = SERVICIO_ICONS[i] ?? Fuel;
                return (
                  <Link
                    key={s.slug}
                    href={`/servicios/${s.slug}`}
                    data-analytics-id={`mobile_service_${s.slug}`}
                    data-analytics-label={s.nombre}
                    data-analytics-cta="mobile_service_navigation"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#f0faf4] transition-colors"
                    onClick={() => setOpen(false)}
                  >
                    <Icon className="w-4 h-4 text-[#1a6b3c] shrink-0" />
                    <span className="text-sm font-medium text-slate-700">{s.nombre}</span>
                  </Link>
                );
              })}
              <Link href="/venta-petroleo-diesel" data-analytics-id="mobile_nav_venta_diesel" data-analytics-label="Venta de Petróleo Diésel" data-analytics-cta="mobile_service_navigation" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#f0faf4]" onClick={() => setOpen(false)}>
                <Fuel className="w-4 h-4 text-[#1a6b3c] shrink-0" />
                <span className="text-sm font-medium text-slate-700">Venta de Petróleo Diésel</span>
              </Link>
              <Link href="/petroleo-a-domicilio" data-analytics-id="mobile_nav_petroleo_domicilio" data-analytics-label="Petróleo a Domicilio" data-analytics-cta="mobile_service_navigation" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#f0faf4]" onClick={() => setOpen(false)}>
                <Waves className="w-4 h-4 text-[#1a6b3c] shrink-0" />
                <span className="text-sm font-medium text-slate-700">Petróleo a Domicilio</span>
              </Link>

              <div className="h-px bg-slate-100 my-2" />
              {[
                { href: "/nosotros", label: "Nosotros" },
                { href: "/clientes", label: "Clientes y proyectos" },
                { href: "/cobertura", label: "Cobertura" },
                { href: "/empresas-faenas-flotas", label: "Empresas / Faenas / Flotas" },
                { href: "/preguntas-frecuentes", label: "Preguntas frecuentes" },
                { href: "/contacto", label: "Contacto" },
              ].map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  data-analytics-id={`mobile_nav_${l.label.toLowerCase().replaceAll(" ", "_").replaceAll("/", "_")}`}
                  data-analytics-label={l.label}
                  data-analytics-cta="mobile_navigation"
                  className="block px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </Link>
              ))}
              <div className="pt-3 space-y-2">
                <Link
                  href="/cotizacion"
                  data-analytics-id="mobile_cta_cotizacion"
                  data-analytics-label="Solicitar cotización"
                  data-analytics-cta="quote"
                  className="flex items-center justify-center gap-2 w-full bg-[#f5a623] hover:bg-[#d4891a] text-white font-bold py-3 rounded-xl text-sm transition-colors"
                  onClick={() => setOpen(false)}
                >
                  Solicitar cotización <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href={`https://wa.me/${config.whatsapp_numero}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-analytics-id="mobile_cta_whatsapp"
                  data-analytics-label="WhatsApp"
                  data-analytics-cta="whatsapp"
                  className="flex items-center justify-center gap-2 w-full bg-[#1a6b3c] hover:bg-[#145530] text-white font-semibold py-3 rounded-xl text-sm transition-colors"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.531 5.856L0 24l6.335-1.509A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.81 9.81 0 01-5.003-1.371l-.359-.214-3.754.894.954-3.652-.234-.374A9.785 9.785 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/></svg>
                  WhatsApp
                </a>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 text-sm text-slate-500">
                <Phone className="w-4 h-4 text-slate-400" />
                <a href={`tel:${config.telefono}`} data-analytics-id="mobile_phone" data-analytics-label={config.telefono} data-analytics-cta="phone" className="font-medium hover:text-[#f5a623]">{config.telefono}</a>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
