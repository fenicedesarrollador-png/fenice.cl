import { MapPin, Clock, ShieldCheck, FileText, Truck, Phone } from "lucide-react";

/**
 * Barra de señales de confianza (E-E-A-T). Refuerza autoridad local y
 * mejora conversión + SEO al exponer datos clave del negocio en texto real
 * (indexable) bajo el hero.
 */
const SIGNALS = [
  { icon: MapPin, value: "52 comunas", label: "Cobertura total en la RM" },
  { icon: Clock, value: "Mismo día", label: "Respuesta a cotizaciones" },
  { icon: ShieldCheck, value: "Normativa SEC", label: "Operación certificada" },
  { icon: Truck, value: "Flota propia", label: "Despacho especializado" },
  { icon: FileText, value: "Factura electrónica", label: "Para empresas" },
  { icon: Phone, value: "Trato directo", label: "Sin call centers" },
];

export default function TrustSignals() {
  return (
    <section
      className="bg-[#0a1628] border-b border-white/5"
      aria-label="Por qué elegir a Fenice SPA para despacho de combustible en la Región Metropolitana"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {SIGNALS.map(({ icon: Icon, value, label }) => (
            <div
              key={label}
              className="flex items-center gap-3 bg-white/[0.04] hover:bg-white/[0.07] border border-white/10 rounded-xl px-3.5 py-3 transition-colors"
            >
              <div className="w-9 h-9 rounded-lg bg-[#1a6b3c]/20 border border-[#1a6b3c]/30 flex items-center justify-center shrink-0">
                <Icon className="w-4.5 h-4.5 text-[#f5a623]" strokeWidth={2} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-extrabold text-white leading-none">{value}</p>
                <p className="text-[11px] text-slate-400 leading-tight mt-1">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
