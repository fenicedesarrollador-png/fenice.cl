import Link from "next/link";
import {
  ArrowRight, Truck, Shield, Clock,
  MapPin, FileText, ChevronRight
} from "lucide-react";
import CTASection from "@/components/CTASection";
import { COMUNAS, SITE_CONFIG } from "@/lib/config";
import { buildMetadata } from "@/lib/seo";

// Intención diferenciada de la home: despacho URGENTE/PROGRAMADO (no compite con la genérica).
export const metadata = buildMetadata({
  title: "Despacho Urgente de Petróleo a Domicilio en Santiago",
  description:
    "Despacho urgente y programado de petróleo diesel a domicilio para empresas en Santiago y la RM. Coordinación directa por WhatsApp, entregas el mismo día y factura electrónica.",
  path: "/petroleo-a-domicilio",
  keywords: [
    "despacho urgente de petróleo santiago",
    "petróleo a domicilio mismo día RM",
    "diesel a domicilio empresas urgente",
    "despacho programado de combustible santiago",
  ],
});

const pageSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Petróleo a Domicilio Santiago",
  provider: {
    "@type": "LocalBusiness",
    name: "Fenice SPA",
    url: "https://fenice.cl",
    telephone: SITE_CONFIG.telefono,
    areaServed: "Región Metropolitana, Chile",
  },
  description:
    "Despacho de petróleo diesel a domicilio para empresas en la Región Metropolitana de Santiago, Chile.",
};

const faqDomicilio = [
  {
    q: "¿Hacen despacho de petróleo a domicilio el mismo día?",
    a: "Sí. Para requerimientos urgentes en la RM coordinamos despacho el mismo día hábil, sujeto a disponibilidad y horario. Contáctanos antes de las 14:00.",
  },
  {
    q: "¿Cuánto demora el despacho de petróleo a domicilio?",
    a: "Para pedidos programados, acordamos fecha y horario de entrega con 24-48 horas de anticipación. Para urgentes, evaluamos disponibilidad al momento de la solicitud.",
  },
  {
    q: "¿Qué necesito para recibir el despacho en mi empresa?",
    a: "Solo necesitas indicar la dirección de entrega, el punto de descarga (estanque, maquinaria, cisterna), y si la faena tiene restricciones de acceso para coordinar el ingreso.",
  },
  {
    q: "¿Cuál es el volumen mínimo para despacho a domicilio?",
    a: "El volumen mínimo de despacho es de 200 litros. Para contratos recurrentes, adaptamos el volumen a tus necesidades operacionales.",
  },
  {
    q: "¿En qué comunas de Santiago hacen despacho a domicilio?",
    a: "Cubrimos toda la Región Metropolitana: Maipú, Pudahuel, Quilicura, Puente Alto, San Bernardo, La Granja, Providencia, Las Condes, Lampa, Buin, Colina y más.",
  },
];

const PASOS = [
  { n: "01", title: "Solicita tu cotización", desc: "Por WhatsApp, teléfono o formulario web. Respondemos en minutos con precio y disponibilidad." },
  { n: "02", title: "Confirmamos el despacho", desc: "Coordinamos fecha, horario y punto de entrega. Sin burocracia ni call centers." },
  { n: "03", title: "Despacho en tu punto", desc: "Nuestra flota lleva el diesel directamente a tu faena, planta o flota." },
  { n: "04", title: "Documentación completa", desc: "Recibes guía de despacho y factura electrónica para tu registro y contabilidad." },
];

export default function PetroleoADomicilioPage() {
  const WA_URL = `https://wa.me/${SITE_CONFIG.whatsapp_numero}?text=${encodeURIComponent("Hola, quiero cotizar petróleo a domicilio para mi empresa en Santiago.")}`;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }} />

      {/* Hero */}
      <section className="bg-[#0a1628] py-20 lg:py-28 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "48px 48px" }} />
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#f5a623]/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#1a6b3c]/10 rounded-full blur-[80px]" />
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#1a6b3c] via-[#f5a623] to-[#1a6b3c]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-5">
              <div className="h-px w-8 bg-[#f5a623]" />
              <span className="text-[#f5a623] text-xs font-bold uppercase tracking-widest">Despacho a domicilio · RM</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-extrabold text-white leading-[1.1] mb-5">
              Despacho Urgente de<br />
              <span className="text-[#f5a623]">Petróleo a Domicilio</span><br />
              en Santiago
            </h1>
            <p className="text-slate-300 leading-relaxed mb-8 text-base max-w-2xl">
              Distribuimos petróleo diesel directamente en tu faena, planta o punto de descarga.
              Despacho programado o urgente en toda la Región Metropolitana, con coordinación
              directa y factura electrónica en cada entrega.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mb-10">
              <Link href="/cotizacion" className="inline-flex items-center justify-center gap-2 bg-[#f5a623] hover:bg-[#d4891a] text-white font-bold px-8 py-4 rounded-xl text-sm transition-all shadow-lg shadow-[#f5a623]/20">
                Cotizar despacho <ArrowRight className="w-4 h-4" />
              </Link>
              <a href={WA_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-[#1a6b3c] hover:bg-[#145530] text-white font-semibold px-8 py-4 rounded-xl text-sm transition-all border border-[#1a6b3c]/50">
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current shrink-0"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.531 5.856L0 24l6.335-1.509A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.81 9.81 0 01-5.003-1.371l-.359-.214-3.754.894.954-3.652-.234-.374A9.785 9.785 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/></svg>
                WhatsApp directo
              </a>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { icon: Truck, label: "Despacho a tu punto" },
                { icon: Clock, label: "Urgente disponible" },
                { icon: FileText, label: "Factura electrónica" },
                { icon: Shield, label: "Normativa SEC" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-2 bg-white/5 border border-white/8 rounded-xl p-3 text-center">
                  <Icon className="w-5 h-5 text-[#f5a623]" strokeWidth={1.8} />
                  <span className="text-xs text-slate-300 font-medium leading-tight">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="h-px w-10 bg-[#f5a623]" />
              <p className="text-xs font-bold text-[#f5a623] uppercase tracking-widest">Proceso</p>
              <div className="h-px w-10 bg-[#f5a623]" />
            </div>
            <h2 className="text-3xl font-extrabold text-[#0a1628]">¿Cómo funciona el despacho a domicilio?</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PASOS.map(({ n, title, desc }) => (
              <div key={n} className="relative">
                <div className="text-5xl font-extrabold text-[#1a6b3c]/10 mb-3 leading-none">{n}</div>
                <h3 className="font-extrabold text-[#0a1628] mb-2">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cobertura */}
      <section className="py-20 bg-[#0a1628]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="h-px w-8 bg-[#f5a623]" />
                <p className="text-xs font-bold text-[#f5a623] uppercase tracking-widest">Cobertura</p>
              </div>
              <h2 className="text-2xl font-extrabold text-white">Despacho a domicilio en toda la RM</h2>
            </div>
            <Link href="/cobertura" className="text-sm font-semibold text-[#f5a623] hover:text-[#d4891a] inline-flex items-center gap-1 whitespace-nowrap">
              Ver cobertura completa <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {COMUNAS.map((c) => (
              <Link
                key={c.slug}
                href={`/cobertura/petroleo-a-domicilio-${c.slug}`}
                className="group flex items-center gap-2.5 bg-white/5 hover:bg-[#1a6b3c]/20 border border-white/10 hover:border-[#1a6b3c]/40 rounded-xl px-4 py-3 transition-all"
              >
                <MapPin className="w-3.5 h-3.5 text-[#f5a623] shrink-0" />
                <span className="text-sm font-medium text-slate-300 group-hover:text-white">{c.nombre}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="h-px w-10 bg-[#f5a623]" />
              <p className="text-xs font-bold text-[#f5a623] uppercase tracking-widest">FAQ</p>
              <div className="h-px w-10 bg-[#f5a623]" />
            </div>
            <h2 className="text-2xl font-extrabold text-[#0a1628]">Preguntas frecuentes sobre el despacho</h2>
          </div>
          <div className="space-y-3">
            {faqDomicilio.map((item, i) => (
              <details key={i} className="group bg-white border border-slate-200 hover:border-[#1a6b3c]/30 rounded-2xl overflow-hidden">
                <summary className="flex items-center justify-between px-6 py-5 cursor-pointer list-none select-none">
                  <span className="font-bold text-[#0a1628] text-sm pr-4">{item.q}</span>
                  <ArrowRight className="w-4 h-4 text-[#f5a623] shrink-0 group-open:rotate-90 transition-transform" />
                </summary>
                <p className="px-6 pb-5 text-sm text-slate-500 leading-relaxed border-t border-slate-100 pt-4">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
