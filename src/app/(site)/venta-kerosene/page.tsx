import Link from "next/link";
import {
  ArrowRight, CheckCircle2, Flame, Shield, FileText,
  MapPin, Truck, Snowflake, Home, Building2, Factory,
} from "lucide-react";
import CTASection from "@/components/CTASection";
import Breadcrumb from "@/components/Breadcrumb";
import { COMUNAS_DESTACADAS, SITE_CONFIG } from "@/lib/config";
import { buildMetadata, faqSchema, jsonLd } from "@/lib/seo";

const BASE = SITE_CONFIG.site_url;
const PAGE_URL = `${BASE}/venta-kerosene`;

export const metadata = buildMetadata({
  title: "Venta de Kerosene a Domicilio en Santiago | Calefacción e Industrial RM",
  description:
    "Venta de kerosene a domicilio en Santiago y la Región Metropolitana para calefacción residencial, comercial e industrial. Despacho directo, factura electrónica y precio conveniente. Cotiza tu kerosene hoy.",
  path: "/venta-kerosene",
  keywords: [
    "venta de kerosene santiago",
    "kerosene a domicilio santiago",
    "kerosene para calefacción",
    "comprar kerosene región metropolitana",
    "distribuidor de kerosene RM",
    "kerosene domiciliario santiago",
    "kerosene industrial",
    "precio kerosene empresas chile",
  ],
});

const faqKerosene = [
  {
    q: "¿Venden kerosene a domicilio en Santiago?",
    a: "Sí. Realizamos venta y despacho de kerosene a domicilio en Santiago y en la Región Metropolitana, tanto para hogares como para empresas, con coordinación por WhatsApp o formulario de cotización.",
  },
  {
    q: "¿Para qué se usa el kerosene?",
    a: "El kerosene se usa principalmente en estufas y sistemas de calefacción residencial y comercial, además de aplicaciones industriales, agrícolas y de proceso. Es una alternativa habitual para calefaccionar en la temporada de invierno.",
  },
  {
    q: "¿Cuánto cuesta el kerosene?",
    a: "El precio del kerosene varía según el volumen, la frecuencia de despacho y la zona de entrega. Cotiza directamente con nosotros y te entregamos el valor más conveniente para tu hogar o empresa en la Región Metropolitana.",
  },
  {
    q: "¿Entregan factura electrónica por la venta de kerosene?",
    a: "Sí. Emitimos factura electrónica en cada venta de kerosene, ideal para clientes comerciales, industriales y empresas que requieren respaldo para su contabilidad.",
  },
  {
    q: "¿Hay volumen mínimo para comprar kerosene?",
    a: "Atendemos desde requerimientos domiciliarios hasta abastecimientos comerciales e industriales recurrentes. Coordinamos el despacho según tu consumo, sin mínimos rígidos para clientes frecuentes.",
  },
  {
    q: "¿Cómo compro kerosene para mi hogar o empresa?",
    a: "Contáctanos por WhatsApp o mediante el formulario de cotización indicando la cantidad, tu comuna y la fecha estimada. Te respondemos el mismo día con precio, disponibilidad y condiciones de entrega.",
  },
];

// Grafo JSON-LD: Producto + Oferta enriquecidos y FAQPage (rich results).
const pageSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Product",
      "@id": `${PAGE_URL}/#product`,
      name: "Kerosene a Domicilio para Calefacción e Industria",
      description:
        "Venta y despacho de kerosene a domicilio para calefacción residencial, comercial e industrial en Santiago y la Región Metropolitana de Chile.",
      category: "Combustible / Kerosene",
      brand: { "@type": "Brand", name: "Fenice SPA" },
      image: `${BASE}/images/operacion-despacho-flota.webp`,
      url: PAGE_URL,
      offers: {
        "@type": "Offer",
        priceCurrency: "CLP",
        availability: "https://schema.org/InStock",
        url: `${BASE}/cotizacion`,
        areaServed: { "@type": "AdministrativeArea", name: "Región Metropolitana de Santiago" },
        seller: { "@id": `${BASE}/#localbusiness` },
      },
      additionalProperty: [
        { "@type": "PropertyValue", name: "Uso", value: "Calefacción residencial, comercial e industrial" },
        { "@type": "PropertyValue", name: "Documentación", value: "Factura electrónica en cada entrega" },
        { "@type": "PropertyValue", name: "Cobertura", value: "Santiago y Región Metropolitana" },
      ],
    },
    faqSchema(faqKerosene),
  ],
};

const VENTAJAS = [
  { icon: Flame, title: "Kerosene para calefacción", desc: "Ideal para estufas y sistemas de calefacción de hogares, oficinas y locales comerciales." },
  { icon: FileText, title: "Factura electrónica", desc: "Emitimos factura en cada venta. Respaldo para clientes comerciales, industriales y empresas." },
  { icon: Truck, title: "Despacho a domicilio", desc: "Llevamos el kerosene directamente a tu casa, edificio, local o instalación en la RM." },
  { icon: Snowflake, title: "Abastecimiento de invierno", desc: "Coordinamos entregas periódicas para que no te quedes sin calefacción en temporada fría." },
  { icon: Shield, title: "Operación responsable", desc: "Manejo y transporte de combustible bajo normativa y con protocolos de seguridad." },
  { icon: CheckCircle2, title: "Trato directo", desc: "Coordinación directa por WhatsApp, sin intermediarios ni call center." },
];

const USOS = [
  { icon: Home, title: "Residencial", desc: "Calefacción de hogares y departamentos con estufas a kerosene durante el invierno." },
  { icon: Building2, title: "Comercial", desc: "Oficinas, locales, colegios y espacios comerciales que requieren calefacción confiable." },
  { icon: Factory, title: "Industrial y agrícola", desc: "Procesos, secado y aplicaciones industriales o agrícolas que utilizan kerosene." },
];

export default function VentaKerosenePage() {
  const WA_URL = `https://wa.me/${SITE_CONFIG.whatsapp_numero}?text=${encodeURIComponent("Hola, quiero cotizar venta de kerosene.")}`;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(pageSchema)} />

      <div className="bg-[#0a1628]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <Breadcrumb
            crumbs={[
              { name: "Inicio", href: "/" },
              { name: "Venta de Kerosene" },
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
                Venta de <span className="text-[#f5a623]">Kerosene</span><br />
                a Domicilio en Santiago
              </h1>
              <p className="text-slate-300 leading-relaxed mb-8 text-base max-w-xl">
                Despachamos kerosene para calefacción residencial, comercial e industrial en toda la
                Región Metropolitana. Entrega directa en tu domicilio o instalación, con factura
                electrónica y coordinación simple.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <Link href="/cotizacion" className="inline-flex items-center justify-center gap-2 bg-[#f5a623] hover:bg-[#d4891a] text-white font-bold px-8 py-4 rounded-xl text-sm transition-all shadow-lg shadow-[#f5a623]/20">
                  Cotizar kerosene <ArrowRight className="w-4 h-4" />
                </Link>
                <a href={WA_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-[#1a6b3c] hover:bg-[#145530] text-white font-semibold px-8 py-4 rounded-xl text-sm transition-all border border-[#1a6b3c]/50">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current shrink-0"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.531 5.856L0 24l6.335-1.509A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.81 9.81 0 01-5.003-1.371l-.359-.214-3.754.894.954-3.652-.234-.374A9.785 9.785 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/></svg>
                  Consultar por WhatsApp
                </a>
              </div>
              <div className="flex flex-wrap gap-x-5 gap-y-2">
                {["Kerosene domiciliario", "Uso industrial", "Factura electrónica", "Despacho RM"].map((t) => (
                  <span key={t} className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#1a6b3c] shrink-0" /> {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="hidden lg:block">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">¿Por qué comprar kerosene con Fenice?</p>
                <ul className="space-y-4">
                  {[
                    "Despacho a domicilio en toda la Región Metropolitana",
                    "Precio conveniente para hogar, comercio o industria",
                    "Factura electrónica en cada entrega",
                    "Entregas periódicas coordinadas para el invierno",
                    "Atención directa por WhatsApp, sin call center",
                    "También distribuimos petróleo diésel",
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
            <h2 className="text-3xl font-extrabold text-[#0a1628]">Qué incluye nuestra venta de kerosene</h2>
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

      {/* Usos del kerosene */}
      <section className="py-16 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="h-px w-10 bg-[#f5a623]" />
              <p className="text-xs font-bold text-[#f5a623] uppercase tracking-widest">Aplicaciones</p>
              <div className="h-px w-10 bg-[#f5a623]" />
            </div>
            <h2 className="text-3xl font-extrabold text-[#0a1628]">¿Para qué se usa el kerosene?</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {USOS.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white border border-slate-200 rounded-2xl p-7 text-center">
                <div className="w-12 h-12 rounded-xl bg-[#f5a623]/10 flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-[#f5a623]" strokeWidth={1.8} />
                </div>
                <h3 className="font-bold text-[#0a1628] mb-2">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contenido semántico (profundidad temática para SEO) */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-px w-8 bg-[#f5a623]" />
            <p className="text-xs font-bold text-[#f5a623] uppercase tracking-widest">Venta de kerosene</p>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0a1628] mb-5 leading-tight">
            Distribuidor de kerosene en Santiago y la Región Metropolitana
          </h2>
          <div className="space-y-4 text-slate-600 leading-relaxed text-[15px]">
            <p>
              En <strong className="text-[#0a1628]">Fenice SPA</strong> realizamos
              <strong className="text-[#0a1628]"> venta de kerosene a domicilio</strong> en Santiago y toda la
              Región Metropolitana, para clientes residenciales, comerciales e industriales. Llevamos el
              combustible directamente a tu domicilio, edificio o instalación, con factura electrónica y una
              coordinación simple por WhatsApp.
            </p>
            <p>
              El <strong className="text-[#0a1628]">kerosene</strong> es uno de los combustibles más utilizados
              para la <strong className="text-[#0a1628]">calefacción</strong> en Chile, especialmente en la
              temporada de invierno: alimenta estufas y sistemas de calefacción en hogares, oficinas, colegios
              y locales comerciales. También tiene aplicaciones industriales y agrícolas de proceso y secado.
            </p>
            <p>
              Comprar kerosene con un distribuidor directo te asegura
              <strong className="text-[#0a1628]"> precio conveniente</strong>, disponibilidad y la posibilidad
              de coordinar <strong className="text-[#0a1628]">entregas periódicas</strong> para no quedarte sin
              calefacción cuando más la necesitas. Atendemos desde pedidos domiciliarios hasta abastecimientos
              comerciales e industriales recurrentes.
            </p>
            <p>
              ¿Necesitas otro combustible para tu operación? Revisa también nuestra
              <Link href="/venta-petroleo-diesel" className="text-[#1a6b3c] font-semibold hover:underline"> venta de petróleo diésel</Link> para
              empresas, faenas y flotas.
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
              <h2 className="text-2xl font-extrabold text-[#0a1628]">Vendemos kerosene en toda la RM</h2>
              <p className="text-slate-500 text-sm mt-1">Despacho a domicilio en tu comuna</p>
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
            <h2 className="text-2xl font-extrabold text-[#0a1628]">Preguntas sobre la venta de kerosene</h2>
          </div>
          <div className="space-y-3">
            {faqKerosene.map((item, i) => (
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
