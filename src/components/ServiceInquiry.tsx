import Link from "next/link";
import { CheckCircle2, Clock, MapPin } from "lucide-react";
import QuickLeadForm from "@/components/QuickLeadForm";
import { QUOTE_SERVICES, type QuoteService } from "@/lib/supplyPlanning";

export default function ServiceInquiry({ service, heading, comuna = "" }: {
  service: QuoteService;
  heading: string;
  comuna?: string;
}) {
  return (
    <section className="bg-[#f0faf4] border-y border-[#1a6b3c]/10 py-14" data-analytics-section={`consulta_${service}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-8 lg:gap-14 items-center">
        <div>
          <p className="text-xs font-bold tracking-widest uppercase text-[#1a6b3c] mb-3">Precio y disponibilidad</p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0a1628] leading-tight mb-4">{heading}</h2>
          <p className="text-slate-600 leading-relaxed mb-5">Indica tu nombre, teléfono y comuna. {service === "estanque" ? "El equipo comercial te contactará para revisar el tipo de instalación, capacidad y ubicación del estanque." : "El equipo comercial te contactará para confirmar litros, acceso y fecha de despacho."}</p>
          <ul className="space-y-3 text-sm text-slate-700 mb-6">
            <li className="flex items-center gap-2"><Clock className="w-4 h-4 text-[#1a6b3c] shrink-0" />Atención de lunes a viernes, de 09:00 a 19:00.</li>
            <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-[#1a6b3c] shrink-0" />{comuna ? `Coordinación de entrega en ${comuna}.` : "Cobertura en la Región Metropolitana; otras zonas previa coordinación."}</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#1a6b3c] shrink-0" />{service === "estanque" ? "Precio y alcance del trabajo confirmados antes de contratar." : "Precio y condiciones confirmados antes de cada entrega."}</li>
          </ul>
          <Link href={`/cotizacion?servicio=${service}`} data-analytics-id={`detalle_${service}`} data-analytics-cta="quote" className="text-sm font-bold text-[#1a6b3c] underline underline-offset-4">{service === "estanque" ? "Describe los detalles de tu instalación →" : "¿Ya tienes litros y fecha? Completa la cotización →"}</Link>
        </div>
        <QuickLeadForm defaultService={QUOTE_SERVICES[service].quick} defaultComuna={comuna} formName={comuna ? `cobertura_${service}` : `servicio_${service}`} context={comuna ? `${QUOTE_SERVICES[service].quick} en ${comuna}` : QUOTE_SERVICES[service].quote} />
      </div>
    </section>
  );
}
