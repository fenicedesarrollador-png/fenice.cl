import type { Metadata } from "next";
import { CheckCircle2, Phone, Clock, Shield } from "lucide-react";
import CotizacionForm from "./CotizacionForm";
import { SITE_CONFIG } from "@/lib/config";

export const metadata: Metadata = {
  title: "Solicitar Cotización de Combustible",
  description:
    "Cotiza petróleo diesel para tu empresa, faena o flota. Respuesta rápida, factura electrónica y trato directo. Completa el formulario y te contactamos en minutos.",
  alternates: { canonical: "https://fenice.cl/cotizacion" },
};

const GARANTIAS = [
  { icon: Clock, text: "Respuesta en el mismo día hábil" },
  { icon: CheckCircle2, text: "Factura electrónica incluida" },
  { icon: Shield, text: "Operación bajo normativa SEC" },
  { icon: Phone, text: "Coordinación directa sin call center" },
];

export default function CotizacionPage() {
  return (
    <>
      {/* Hero strip */}
      <section className="bg-[#0a1628] py-14 relative overflow-hidden">
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#1a6b3c] via-[#f5a623] to-[#1a6b3c]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-px w-8 bg-[#f5a623]" />
            <span className="text-[#f5a623] text-xs font-bold uppercase tracking-widest">Cotización</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-extrabold text-white mb-3">
            Solicitar cotización
          </h1>
          <p className="text-slate-400 max-w-xl text-sm leading-relaxed">
            Completa el formulario y un asesor de Fenice SPA te contactará a la brevedad con
            una propuesta adaptada a tu operación.
          </p>
        </div>
      </section>

      {/* Main */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-10">
            {/* Form */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
              <CotizacionForm />
            </div>

            {/* Sidebar */}
            <div className="space-y-5">
              {/* Guarantees */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <h3 className="font-extrabold text-[#0a1628] mb-4 text-sm uppercase tracking-wider">¿Qué incluye tu cotización?</h3>
                <ul className="space-y-3">
                  {GARANTIAS.map(({ icon: Icon, text }) => (
                    <li key={text} className="flex items-center gap-3 text-sm text-slate-700">
                      <div className="w-7 h-7 rounded-lg bg-[#1a6b3c]/10 flex items-center justify-center shrink-0">
                        <Icon className="w-3.5 h-3.5 text-[#1a6b3c]" />
                      </div>
                      {text}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Direct contact */}
              <div className="bg-[#0a1628] rounded-2xl p-6 text-white">
                <h3 className="font-extrabold mb-1 text-sm uppercase tracking-wider text-[#f5a623]">¿Prefieres contactar directo?</h3>
                <p className="text-slate-400 text-xs mb-4 leading-relaxed">Nuestro equipo comercial atiende Lun-Vie 09:00–19:00</p>
                <div className="space-y-3">
                  <a
                    href={`https://wa.me/${SITE_CONFIG.whatsapp_numero}?text=${encodeURIComponent("Hola, quiero cotizar combustible para mi empresa.")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 bg-[#1a6b3c] hover:bg-[#145530] rounded-xl px-4 py-3 transition-colors"
                  >
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current text-white shrink-0"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.531 5.856L0 24l6.335-1.509A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.81 9.81 0 01-5.003-1.371l-.359-.214-3.754.894.954-3.652-.234-.374A9.785 9.785 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/></svg>
                    <span className="text-sm font-semibold">WhatsApp directo</span>
                  </a>
                  <a
                    href={`tel:${SITE_CONFIG.telefono}`}
                    className="flex items-center gap-3 bg-white/8 hover:bg-white/12 border border-white/10 rounded-xl px-4 py-3 transition-colors"
                  >
                    <Phone className="w-4 h-4 text-[#f5a623] shrink-0" />
                    <span className="text-sm font-semibold">{SITE_CONFIG.telefono}</span>
                  </a>
                </div>
              </div>

              {/* Trust */}
              <div className="bg-[#f0faf4] border border-[#1a6b3c]/20 rounded-2xl p-6">
                <p className="text-xs font-bold text-[#1a6b3c] uppercase tracking-wider mb-3">¿Por qué Fenice SPA?</p>
                <ul className="space-y-2 text-sm text-slate-700">
                  {[
                    "Distribuidor B2B especializado",
                    "Cobertura toda la RM",
                    "Despacho programado o urgente",
                    "Contratos de suministro disponibles",
                    "Trazabilidad en cada entrega",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#1a6b3c] shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
