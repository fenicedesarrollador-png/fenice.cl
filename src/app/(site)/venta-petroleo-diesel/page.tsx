import Link from "next/link";
import {
  ArrowRight, CheckCircle2, Fuel, Shield, FileText,
  MapPin, Truck, Zap, TrendingUp
} from "lucide-react";
import CTASection from "@/components/CTASection";
import Breadcrumb from "@/components/Breadcrumb";
import { COMUNAS_DESTACADAS, SITE_CONFIG } from "@/lib/config";
import { buildMetadata, faqSchema, jsonLd } from "@/lib/seo";

const BASE = SITE_CONFIG.site_url;
const PAGE_URL = `${BASE}/venta-petroleo-diesel`;

// Intención diferenciada: COMPRA / PRECIO / SUMINISTRO (no "a domicilio" genérico).
export const metadata = buildMetadata({
  title: "Venta de Petróleo Diésel para Empresas",
  description:
    "Compra diésel por volumen para flotas, plantas y faenas en Santiago. Despacho programado, factura electrónica y contratos de suministro.",
  path: "/venta-petroleo-diesel",
  keywords: [
    "venta de petróleo diesel santiago",
    "venta de diesel para empresas",
    "comprar petróleo diesel RM",
    "precio petróleo diesel empresa chile",
    "distribuidor de petróleo diesel con documentación",
    "diesel industrial santiago",
    "petróleo diesel para maquinaria y generadores",
    "proveedor de diesel región metropolitana",
  ],
});

const faqVenta = [
  {
    q: "¿Cuánto cuesta el litro de petróleo diésel para empresas?",
    a: "El precio del petróleo diésel varía según el volumen contratado, la frecuencia de despacho y las condiciones de entrega. Cotiza directamente con nosotros y te entregamos el valor por litro más conveniente para tu operación en la Región Metropolitana.",
  },
  {
    q: "¿Qué tipos de diésel venden?",
    a: "Distribuimos petróleo diésel para uso industrial, maquinaria, transporte de carga y generación eléctrica. Consulta la especificación, disponibilidad y volumen requeridos para tu operación.",
  },
  {
    q: "¿Entregan factura electrónica en la venta de diésel?",
    a: "Sí. Emitimos factura electrónica en cada venta de petróleo diésel, con los antecedentes necesarios para compras y contabilidad.",
  },
  {
    q: "¿Hay un volumen mínimo para comprar petróleo diésel?",
    a: "El pedido mínimo informado es de 50 litros. El volumen final y las condiciones de entrega se confirman según comuna, acceso y disponibilidad operacional.",
  },
  {
    q: "¿En cuánto tiempo despachan el diésel?",
    a: "Los despachos se coordinan según volumen, comuna, acceso y disponibilidad de flota. Para requerimientos urgentes evaluamos la alternativa más rápida dentro del horario de atención.",
  },
  {
    q: "¿Cómo compro petróleo diésel para mi empresa?",
    a: "Contáctanos por WhatsApp o mediante el formulario de cotización indicando volumen, comuna, fecha y frecuencia. Confirmamos precio, disponibilidad y condiciones dentro del horario de atención.",
  },
];

// Grafo JSON-LD: servicio comercial real + preguntas frecuentes.
const pageSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      "@id": `${PAGE_URL}/#service`,
      name: "Petróleo Diésel para Empresas",
      description:
        "Venta y distribución de petróleo diésel para industria, construcción, minería, transporte y generación eléctrica en la Región Metropolitana de Chile.",
      serviceType: "Venta y despacho de petróleo diésel para empresas",
      provider: { "@id": `${BASE}/#localbusiness` },
      image: `${BASE}/images/operacion-central.webp`,
      url: PAGE_URL,
      areaServed: { "@type": "AdministrativeArea", name: "Región Metropolitana de Santiago" },
      termsOfService: `${BASE}/cotizacion`,
    },
    faqSchema(faqVenta),
  ],
};

const VENTAJAS = [
  { icon: Fuel, title: "Diésel con documentación", desc: "Combustible para uso industrial, con respaldo de origen y documentación disponible según la entrega." },
  { icon: FileText, title: "Factura electrónica", desc: "Emitimos factura en cada venta. Integración simple con tu área de compras y sistema ERP." },
  { icon: Shield, title: "Cumplimiento normativo", desc: "Operación con los registros y antecedentes aplicables ante la SEC." },
  { icon: Truck, title: "Entrega en tu punto", desc: "Llevamos el diesel directamente a tu faena, planta, bodega o flota." },
  { icon: Zap, title: "Coordinación directa", desc: "Evaluamos requerimientos programados o urgentes según zona y disponibilidad de flota." },
  { icon: TrendingUp, title: "Contratos de suministro", desc: "Precio y volumen acordado mensual o trimestralmente para tu planificación financiera." },
];

export default function VentaPetroleoPage() {
  const WA_URL = `https://wa.me/${SITE_CONFIG.whatsapp_numero}?text=${encodeURIComponent("Hola, quiero cotizar venta de petróleo diesel para mi empresa.")}`;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(pageSchema)} />

      <div className="bg-[#0a1628]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <Breadcrumb
            crumbs={[
              { name: "Inicio", href: "/" },
              { name: "Venta de Petróleo Diésel" },
            ]}
            dark
          />
        </div>
      </div>

      {/* Hero */}
      <section className="bg-[#0a1628] pt-8 pb-20 lg:pb-28 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "48px 48px" }} />
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#f5a623]/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#1a6b3c]/10 rounded-full blur-[80px]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-2 mb-5">
                <div className="h-px w-8 bg-[#f5a623]" />
                <span className="text-[#f5a623] text-xs font-bold uppercase tracking-widest">Venta de combustible</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-extrabold text-white leading-[1.1] mb-5">
                Venta de Petróleo<br />
                <span className="text-[#f5a623]">Diésel para Empresas</span><br />
                en Santiago
              </h1>
              <p className="text-slate-300 leading-relaxed mb-8 text-base max-w-xl">
                Distribuimos petróleo diesel con documentación de respaldo para industria, construcción,
                generación eléctrica y flotas en toda la Región Metropolitana. Factura electrónica
                en cada entrega.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <Link href="/cotizacion" className="inline-flex items-center justify-center gap-2 bg-[#f5a623] hover:bg-[#d4891a] text-white font-bold px-8 py-4 rounded-xl text-sm transition-all shadow-lg shadow-[#f5a623]/20">
                  Cotizar diesel <ArrowRight className="w-4 h-4" />
                </Link>
                <a href={WA_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-[#1a6b3c] hover:bg-[#145530] text-white font-semibold px-8 py-4 rounded-xl text-sm transition-all border border-[#1a6b3c]/50">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current shrink-0"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.531 5.856L0 24l6.335-1.509A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.81 9.81 0 01-5.003-1.371l-.359-.214-3.754.894.954-3.652-.234-.374A9.785 9.785 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/></svg>
                  Consultar por WhatsApp
                </a>
              </div>
              <div className="flex flex-wrap gap-x-5 gap-y-2">
                {["Diésel documentado", "Factura electrónica", "Despacho RM", "Trato directo"].map((t) => (
                  <span key={t} className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#1a6b3c] shrink-0" /> {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="hidden lg:block">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">¿Por qué comprar diesel con Fenice?</p>
                <ul className="space-y-4">
                  {[
                    "Precio competitivo para empresa y volumen",
                    "Documentación completa en cada entrega",
                    "Sin mínimo de despacho para clientes recurrentes",
                    "Contrato de suministro disponible",
                    "Despacho urgente disponible en la RM",
                    "Coordinación directa, sin call center",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-[#1a6b3c] mt-0.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ventajas */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="h-px w-10 bg-[#f5a623]" />
              <p className="text-xs font-bold text-[#f5a623] uppercase tracking-widest">Ventajas</p>
              <div className="h-px w-10 bg-[#f5a623]" />
            </div>
            <h2 className="text-3xl font-extrabold text-[#0a1628]">Qué incluye nuestra venta de diesel</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {VENTAJAS.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex gap-4 p-6 bg-slate-50 border border-slate-200 hover:border-[#1a6b3c]/30 rounded-2xl transition-colors group">
                <div className="w-11 h-11 rounded-xl bg-[#1a6b3c]/10 group-hover:bg-[#1a6b3c]/20 flex items-center justify-center shrink-0 transition-colors">
                  <Icon className="w-5 h-5 text-[#1a6b3c]" strokeWidth={1.8} />
                </div>
                <div>
                  <h3 className="font-bold text-[#0a1628] mb-1.5 text-sm">{title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contenido semántico (profundidad temática para SEO) */}
      <section className="py-16 bg-white border-t border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-px w-8 bg-[#f5a623]" />
            <p className="text-xs font-bold text-[#f5a623] uppercase tracking-widest">Venta de petróleo diésel</p>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0a1628] mb-5 leading-tight">
            Proveedor de petróleo diésel para empresas en la Región Metropolitana
          </h2>
          <div className="space-y-4 text-slate-600 leading-relaxed text-[15px]">
            <p>
              En <strong className="text-[#0a1628]">Fenice SPA</strong> nos especializamos en la
              <strong className="text-[#0a1628]"> venta de petróleo diésel</strong> para empresas, faenas y
              flotas en Santiago y toda la Región Metropolitana. Distribuimos combustible de calidad
              documentada directamente en tu punto de operación, con respaldo de entrega y factura
              electrónica en cada entrega, para que tu área de compras trabaje sin fricciones.
            </p>
            <p>
              El <strong className="text-[#0a1628]">petróleo diésel</strong> —también conocido simplemente
              como petróleo o diésel B— es el combustible estándar para motores de ciclo diésel: alimenta
              maquinaria de construcción, camiones y flotas de transporte, grupos electrógenos y generadores
              de respaldo, calderas industriales y equipos agrícolas. Por eso lo distribuimos a sectores tan
              distintos como la construcción, la minería, la agroindustria, la logística y la manufactura.
            </p>
            <p>
              Comprar diésel con un distribuidor directo te permite acceder a un
              <strong className="text-[#0a1628]"> precio competitivo por volumen</strong>, coordinar
              despachos programados o urgentes y, si tu consumo es recurrente, cerrar un
              <strong className="text-[#0a1628]"> contrato de suministro</strong> con precio y volumen
              acordados para planificar tu operación. Complementamos la venta con
              <Link href="/servicios/instalacion-de-estanques" className="text-[#1a6b3c] font-semibold hover:underline"> instalación y declaración de estanques</Link> y
              <Link href="/petroleo-a-domicilio" className="text-[#1a6b3c] font-semibold hover:underline"> despacho de petróleo a domicilio</Link> con
              carga periódica según tu necesidad.
            </p>
            <p>
              ¿Buscas otro combustible? También realizamos
              <Link href="/venta-kerosene" className="text-[#1a6b3c] font-semibold hover:underline"> venta de kerosene</Link> para
              calefacción y uso industrial.
            </p>
          </div>
        </div>
      </section>

      {/* Cobertura comunas */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="h-px w-8 bg-[#f5a623]" />
                <p className="text-xs font-bold text-[#f5a623] uppercase tracking-widest">Cobertura</p>
              </div>
              <h2 className="text-2xl font-extrabold text-[#0a1628]">Vendemos diesel en toda la RM</h2>
              <p className="text-slate-500 text-sm mt-1">Entrega directa en tu faena, planta o punto de carga</p>
            </div>
            <Link href="/cobertura" className="text-sm font-semibold text-[#1a6b3c] hover:text-[#0d4a28] inline-flex items-center gap-1 whitespace-nowrap transition-colors">
              Ver cobertura completa <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {COMUNAS_DESTACADAS.map((c) => (
              <Link
                key={c.slug}
                href={`/cobertura/petroleo-a-domicilio-${c.slug}`}
                className="group flex items-center gap-2.5 bg-white hover:bg-[#f0faf4] border border-slate-200 hover:border-[#1a6b3c]/30 rounded-xl px-4 py-3 transition-all"
              >
                <MapPin className="w-3.5 h-3.5 text-[#f5a623] shrink-0" />
                <span className="text-sm font-medium text-slate-700 group-hover:text-[#1a6b3c]">{c.nombre}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="h-px w-10 bg-[#f5a623]" />
              <p className="text-xs font-bold text-[#f5a623] uppercase tracking-widest">FAQ</p>
              <div className="h-px w-10 bg-[#f5a623]" />
            </div>
            <h2 className="text-2xl font-extrabold text-[#0a1628]">Preguntas sobre la venta de diesel</h2>
          </div>
          <div className="space-y-3">
            {faqVenta.map((item, i) => (
              <details key={i} className="group bg-slate-50 border border-slate-200 hover:border-[#1a6b3c]/30 rounded-2xl overflow-hidden">
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

      <CTASection />
    </>
  );
}
