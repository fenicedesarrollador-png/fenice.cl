import Link from "next/link";
import { BadgeCheck, ShieldCheck, Truck, Container, FileCheck2, ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { CERTIFICACIONES } from "@/lib/config";

const CERT_ICONS: Record<string, LucideIcon> = {
  SEC: ShieldCheck,
  TC4: Container,
  TC10A: Truck,
  "DS 160": FileCheck2,
};

/**
 * Documentación y cumplimiento normativo — señal de confianza verificable.
 * Se usa en Home y Nosotros. `variant="dark"` para fondos navy.
 */
export default function Certificaciones({ variant = "light" }: { variant?: "light" | "dark" }) {
  const dark = variant === "dark";

  return (
    <section
      className={dark ? "py-20 bg-[#0a1628]" : "py-20 bg-slate-50"}
      data-analytics-section="certificaciones"
      aria-labelledby="certificaciones-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1fr_1.4fr] gap-12 items-center">
          {/* Texto */}
          <div data-reveal="left">
            <div className="flex items-center gap-2 mb-3">
              <span className="h-px w-8 bg-[#f5a623]" />
              <p className="text-xs font-bold text-[#f5a623] uppercase tracking-widest">
                Documentación
              </p>
            </div>
            <h2
              id="certificaciones-heading"
              className={`text-3xl sm:text-4xl font-extrabold leading-tight mb-5 ${dark ? "text-white" : "text-[#0a1628]"}`}
            >
              Operación documentada y{" "}
              <span className="text-[#f5a623]">cumplimiento normativo</span>
            </h2>
            <p className={`leading-relaxed mb-6 ${dark ? "text-slate-400" : "text-slate-600"}`}>
              En Fenice SPA respaldamos instalaciones y despachos con la documentación aplicable:
              declaraciones TC4 y TC10A cuando corresponden, certificados técnicos de los equipos
              y cumplimiento del DS 160.
            </p>
            <ul className="space-y-2.5 mb-8">
              {CERTIFICACIONES.map((c) => (
                <li key={c.sigla} className="flex items-center gap-2.5">
                  <BadgeCheck className="w-5 h-5 text-[#1a6b3c] shrink-0" />
                  <span className={`text-sm font-semibold ${dark ? "text-slate-200" : "text-slate-700"}`}>
                    {c.titulo}
                  </span>
                </li>
              ))}
            </ul>
            <Link
              href="/servicios/instalacion-de-estanques"
              data-analytics-id="certificaciones_estanques"
              data-analytics-label="Instalación y declaración de estanques"
              data-analytics-cta="service_navigation"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#f5a623] hover:text-[#d4891a] transition-colors"
            >
              Instalación y declaración de estanques <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Tarjetas */}
          <div className="grid sm:grid-cols-2 gap-4">
            {CERTIFICACIONES.map((c, i) => {
              const Icon = CERT_ICONS[c.sigla] ?? ShieldCheck;
              return (
                <article
                  key={c.sigla}
                  data-reveal
                  data-reveal-delay={String(i * 90)}
                  className={`group rounded-2xl p-6 border transition-all hover:-translate-y-1 ${
                    dark
                      ? "bg-white/5 border-white/10 hover:border-[#f5a623]/40 hover:bg-white/8"
                      : "bg-white border-slate-200 hover:border-[#1a6b3c]/40 shadow-sm hover:shadow-lg"
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-[#1a6b3c]/10 border border-[#1a6b3c]/20 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-[#1a6b3c]" strokeWidth={1.8} />
                    </div>
                    <span className="text-[11px] font-black tracking-wider text-[#f5a623] bg-[#f5a623]/10 border border-[#f5a623]/25 px-2.5 py-1 rounded-full uppercase">
                      {c.sigla}
                    </span>
                  </div>
                  <h3 className={`font-bold mb-2 leading-tight ${dark ? "text-white" : "text-[#0a1628]"}`}>
                    {c.titulo}
                  </h3>
                  <p className={`text-sm leading-relaxed ${dark ? "text-slate-400" : "text-slate-500"}`}>
                    {c.descripcion}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
