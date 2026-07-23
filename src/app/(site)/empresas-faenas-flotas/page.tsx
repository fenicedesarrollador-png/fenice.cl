import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight, CheckCircle2, Truck, Building2, Shield,
  Zap, FileText, Users, MapPin, Phone,
  HardHat, Factory, Cpu, Tractor, BarChart3
} from "lucide-react";
import CTASection from "@/components/CTASection";
import { SITE_CONFIG } from "@/lib/config";

export const metadata: Metadata = {
  title: "Combustible para Empresas, Faenas y Flotas",
  description:
    "Abastecimiento de petróleo diesel para empresas, faenas industriales y flotas de vehículos en la Región Metropolitana. Contratos de suministro, factura electrónica y atención comercial directa. Cotiza ahora.",
  alternates: { canonical: "https://fenice.cl/empresas-faenas-flotas" },
  openGraph: {
    type: "website",
    url: "https://fenice.cl/empresas-faenas-flotas",
    title: "Combustible para Empresas, Faenas y Flotas | Fenice SPA",
    description:
      "Abastecimiento de petróleo diésel para empresas, faenas industriales y flotas en la RM. Contratos de suministro, factura electrónica y atención comercial directa.",
    siteName: "Fenice SPA",
  },
};

const pageSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Abastecimiento de Combustible para Empresas y Flotas",
  provider: {
    "@type": "LocalBusiness",
    name: "Fenice SPA",
    url: "https://fenice.cl",
    telephone: SITE_CONFIG.telefono,
  },
  areaServed: "Región Metropolitana, Chile",
  description:
    "Servicio de abastecimiento de petróleo diesel para empresas, faenas y flotas en la Región Metropolitana de Chile.",
};

const SECTORES = [
  {
    icon: HardHat,
    title: "Construcción e infraestructura",
    desc: "Abastecimiento para maquinaria pesada, grupos electrógenos y vehículos de obra. Despacho en faenas activas con coordinación de acceso.",
    items: ["Retroexcavadoras y niveladoras", "Grúas y equipos de izaje", "Grupos electrógenos de obra", "Camiones y vehículos de carga"],
  },
  {
    icon: Factory,
    title: "Industria y manufactura",
    desc: "Suministro regular para plantas industriales con contratos de abastecimiento programado y trazabilidad completa.",
    items: ["Calderas y hornos industriales", "Generadores eléctricos de planta", "Montacargas y equipos de bodega", "Flotas de distribución"],
  },
  {
    icon: Tractor,
    title: "Minería y extracción",
    desc: "Cobertura para faenas periurbanas y proyectos de extracción que requieren abastecimiento confiable y documentación completa.",
    items: ["Equipos de extracción", "Generación eléctrica en faena", "Flota de transporte de mineral", "Instalaciones temporales"],
  },
  {
    icon: Cpu,
    title: "Generación eléctrica y energía",
    desc: "Mantenimiento de autonomía para generadores críticos con alertas de nivel y despacho preventivo.",
    items: ["Grupos electrógenos industriales", "UPS de respaldo energético", "Plantas de cogeneración", "Sistemas de energía de emergencia"],
  },
  {
    icon: Truck,
    title: "Flotas de transporte",
    desc: "Abastecimiento masivo para flotas de camiones, buses y vehículos especializados con gestión de consumo.",
    items: ["Flotas de camiones de carga", "Buses y transporte de personal", "Vehículos especializados", "Flota propia y de terceros"],
  },
  {
    icon: Building2,
    title: "Agroindustria y agricultura",
    desc: "Suministro para equipos agrícolas, bombas de riego y maquinaria en faenas temporales con despacho a campo.",
    items: ["Tractores y cosechadoras", "Bombas de riego", "Generadores de campo", "Vehículos de faena agrícola"],
  },
];

const VENTAJAS = [
  {
    icon: FileText,
    title: "Contratos de suministro",
    desc: "Definimos frecuencia, volumen y condiciones de entrega para garantizar continuidad operacional sin interrupciones.",
  },
  {
    icon: Zap,
    title: "Coordinación directa",
    desc: "Sin call centers. Tu coordinador comercial responde directamente por WhatsApp o teléfono en horario laboral.",
  },
  {
    icon: Shield,
    title: "Cumplimiento normativo",
    desc: "Toda la documentación exigida por la SEC, facturas electrónicas y registros de despacho disponibles.",
  },
  {
    icon: BarChart3,
    title: "Trazabilidad total",
    desc: "Control de cada despacho: volumen, fecha, vehículo y responsable. Ideal para auditorías y gestión de costos.",
  },
  {
    icon: MapPin,
    title: "Cobertura RM completa",
    desc: "Llegamos a todas las comunas de la Región Metropolitana, Valparaíso y Rancagua con tiempos de respuesta acordados.",
  },
  {
    icon: Users,
    title: "Atención empresarial",
    desc: "Facturas electrónicas para tu área de compras, órdenes de compra y condiciones de pago adaptadas a tu empresa.",
  },
];

const FAQ_B2B = [
  {
    q: "¿Pueden abastecer faenas en lugares de difícil acceso?",
    a: "Sí. Coordinamos previamente el acceso, requerimientos de seguridad y documentación necesaria para ingresar a faenas industriales y mineras.",
  },
  {
    q: "¿Qué documentos entregan en cada despacho?",
    a: "Factura electrónica, guía de despacho, certificado de calidad del combustible y documentación del conductor/vehículo para registro de empresa.",
  },
  {
    q: "¿Tienen contrato de suministro mensual?",
    a: "Sí. Ofrecemos contratos de abastecimiento periódico con volumen, frecuencia y precio acordado, con revisiones trimestrales de condiciones.",
  },
  {
    q: "¿Cuál es el volumen mínimo de despacho para empresas?",
    a: "El volumen mínimo para empresas es de 200 litros por despacho. Para contratos de suministro regular, definimos el volumen según las necesidades de tu operación.",
  },
];

export default function EmpresasFaenasFlotasPage() {
  const WA_URL = `https://wa.me/${SITE_CONFIG.whatsapp_numero}?text=${encodeURIComponent("Hola, necesito cotizar combustible para mi empresa/faena/flota.")}`;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }} />

      {/* Hero */}
      <section className="relative bg-[#0a1628] overflow-hidden py-20 lg:py-28">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "48px 48px" }} />
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#f5a623]/8 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#1a6b3c]/10 rounded-full blur-[80px]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-5">
              <div className="h-px w-8 bg-[#f5a623]" />
              <span className="text-[#f5a623] text-xs font-bold uppercase tracking-widest">Soluciones B2B</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-extrabold text-white leading-[1.1] mb-5">
              Combustible para<br />
              <span className="text-[#f5a623]">Empresas, Faenas y Flotas</span>
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed mb-8 max-w-2xl">
              Abastecemos industrias, faenas activas y flotas de vehículos con petróleo diesel
              de calidad, trazabilidad completa y coordinación directa. Sin intermediarios,
              con factura electrónica en cada despacho.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/cotizacion"
                className="inline-flex items-center justify-center gap-2 bg-[#f5a623] hover:bg-[#d4891a] text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg shadow-[#f5a623]/20 text-sm"
              >
                Cotizar abastecimiento <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href={WA_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#1a6b3c] hover:bg-[#145530] text-white font-semibold px-8 py-4 rounded-xl transition-all text-sm border border-[#1a6b3c]/50"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current shrink-0"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.531 5.856L0 24l6.335-1.509A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.81 9.81 0 01-5.003-1.371l-.359-.214-3.754.894.954-3.652-.234-.374A9.785 9.785 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/></svg>
                Hablar con un asesor
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Sectores */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="h-px w-10 bg-[#f5a623]" />
              <p className="text-xs font-bold text-[#f5a623] uppercase tracking-widest">Sectores que atendemos</p>
              <div className="h-px w-10 bg-[#f5a623]" />
            </div>
            <h2 className="text-3xl font-extrabold text-[#0a1628]">Soluciones para cada industria</h2>
            <p className="text-slate-500 mt-3 max-w-xl mx-auto text-sm leading-relaxed">
              Adaptamos el abastecimiento a los requisitos específicos de cada operación,
              sector y volumen requerido.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SECTORES.map(({ icon: Icon, title, desc, items }) => (
              <div key={title} className="bg-slate-50 border border-slate-200 hover:border-[#1a6b3c]/30 rounded-2xl p-7 transition-all hover:shadow-lg group">
                <div className="w-12 h-12 rounded-xl bg-[#1a6b3c]/10 group-hover:bg-[#1a6b3c]/20 flex items-center justify-center mb-5 transition-colors">
                  <Icon className="w-6 h-6 text-[#1a6b3c]" strokeWidth={1.8} />
                </div>
                <h3 className="font-extrabold text-[#0a1628] mb-2 text-base">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-4">{desc}</p>
                <ul className="space-y-1.5">
                  {items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-xs text-slate-600">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#1a6b3c] shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ventajas */}
      <section className="py-20 bg-[#0a1628]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="h-px w-10 bg-[#f5a623]" />
              <p className="text-xs font-bold text-[#f5a623] uppercase tracking-widest">Ventajas empresariales</p>
              <div className="h-px w-10 bg-[#f5a623]" />
            </div>
            <h2 className="text-3xl font-extrabold text-white">¿Por qué elegir Fenice SPA?</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {VENTAJAS.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white/5 border border-white/10 hover:border-[#f5a623]/30 rounded-2xl p-6 transition-all group">
                <div className="w-11 h-11 rounded-xl bg-[#1a6b3c]/20 group-hover:bg-[#1a6b3c]/30 flex items-center justify-center mb-4 transition-colors">
                  <Icon className="w-5 h-5 text-[#f5a623]" strokeWidth={1.8} />
                </div>
                <h3 className="font-bold text-white mb-2">{title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ B2B */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="h-px w-10 bg-[#f5a623]" />
              <p className="text-xs font-bold text-[#f5a623] uppercase tracking-widest">Preguntas empresariales</p>
              <div className="h-px w-10 bg-[#f5a623]" />
            </div>
            <h2 className="text-2xl font-extrabold text-[#0a1628]">Preguntas frecuentes para empresas</h2>
          </div>
          <div className="space-y-3">
            {FAQ_B2B.map((item, i) => (
              <details key={i} className="group bg-slate-50 border border-slate-200 hover:border-[#1a6b3c]/30 rounded-2xl overflow-hidden transition-colors">
                <summary className="flex items-center justify-between px-6 py-5 cursor-pointer list-none select-none">
                  <span className="font-bold text-[#0a1628] text-sm pr-4">{item.q}</span>
                  <ArrowRight className="w-4 h-4 text-[#f5a623] shrink-0 group-open:rotate-90 transition-transform" />
                </summary>
                <p className="px-6 pb-5 text-sm text-slate-500 leading-relaxed border-t border-slate-200 pt-4">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Contact strip */}
      <section className="py-12 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-3 gap-6 items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#1a6b3c]/10 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5 text-[#1a6b3c]" />
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-0.5">Atención comercial</p>
                <a href={`tel:${SITE_CONFIG.telefono}`} className="font-bold text-[#0a1628] hover:text-[#1a6b3c] transition-colors">{SITE_CONFIG.telefono}</a>
              </div>
            </div>
            <div className="text-center sm:text-left">
              <p className="text-sm text-slate-500 mb-1">Horario de atención</p>
              <p className="font-bold text-[#0a1628]">{SITE_CONFIG.horario}</p>
            </div>
            <div className="flex justify-center sm:justify-end">
              <Link
                href="/cotizacion"
                className="inline-flex items-center gap-2 bg-[#f5a623] hover:bg-[#d4891a] text-white font-bold px-7 py-3.5 rounded-xl transition-all shadow-md text-sm"
              >
                Solicitar cotización <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
