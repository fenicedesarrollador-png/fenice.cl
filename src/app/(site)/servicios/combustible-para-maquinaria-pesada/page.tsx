import CTASection from "@/components/CTASection";
import Breadcrumb from "@/components/Breadcrumb";
import WhatsAppButton from "@/components/WhatsAppButton";
import Link from "next/link";
import Image from "next/image";
import { buildMetadata, serviceSchema as buildServiceSchema, faqSchema, jsonLd } from "@/lib/seo";
import { BLUR } from "@/lib/imageBlur";
import {
  Truck, CheckCircle2, CalendarCheck, ShieldCheck, Tractor,
  Construction, Mountain, Factory, ChevronRight, Fuel,
} from "lucide-react";

export const metadata = buildMetadata({
  title: "Diésel para Maquinaria Pesada en Faena",
  description:
    "Despacho de diésel en faena para excavadoras, cargadores y equipos de movimiento de tierra en Santiago, Valparaíso y O'Higgins.",
  path: "/servicios/combustible-para-maquinaria-pesada",
  keywords: [
    "diesel para maquinaria pesada",
    "combustible para movimiento de tierra",
    "petróleo para excavadoras",
    "combustible para faenas de construcción",
    "combustible para maquinaria agrícola",
    "abastecimiento de combustible en terreno",
    "carga de petróleo industrial",
  ],
});

const serviceSchema = buildServiceSchema({
  name: "Combustible para Maquinaria Pesada",
  description:
    "Abastecimiento de petróleo diésel en terreno para maquinaria de movimiento de tierra, excavadoras, retroexcavadoras, cargadores frontales, grúas, maquinaria agrícola y equipos industriales en faena.",
  slug: "combustible-para-maquinaria-pesada",
});

const faqItems = [
  {
    q: "¿Cargan la maquinaria directamente en la faena o terreno?",
    a: "Sí. Nuestros camiones llegan a la faena, obra o terreno y cargan cada equipo directamente en su estanque: excavadoras, retroexcavadoras, cargadores frontales, grúas y maquinaria agrícola, sin que usted deba mover los equipos.",
  },
  {
    q: "¿Puedo programar abastecimientos periódicos para mi faena?",
    a: "Sí. Puede programar despachos semanales o mensuales según el avance y consumo de la faena. También atendemos requerimientos urgentes, previa coordinación telefónica y sujetos a disponibilidad.",
  },
  {
    q: "¿En qué zonas abastecen faenas?",
    a: "Cubrimos toda la Región Metropolitana —con foco en zonas de alta actividad como Lampa, Colina, Buin, Melipilla, Curacaví, Talagante e Isla de Maipo— además de la Región de Valparaíso, Los Andes y la Región de O'Higgins.",
  },
  {
    q: "¿Cómo se cotiza y cuál es la compra mínima?",
    a: "La compra mínima es de 50 litros. Indíquenos el volumen, la ubicación de la faena y la fecha estimada; confirmamos precio actualizado y condiciones antes de cada despacho.",
  },
];

const maqFaqSchema = faqSchema(faqItems);

const equipos = [
  { icon: Construction, label: "Excavadoras y retroexcavadoras" },
  { icon: Truck, label: "Cargadores frontales y grúas" },
  { icon: Mountain, label: "Maquinaria de movimiento de tierra" },
  { icon: Factory, label: "Equipos industriales en terreno" },
  { icon: Tractor, label: "Maquinaria agrícola" },
  { icon: Fuel, label: "Equipos en faenas mineras" },
];

const beneficios = [
  { icon: ShieldCheck, text: "Su maquinaria nunca se detiene: combustible en faena cuando la operación lo necesita" },
  { icon: CalendarCheck, text: "Despachos programados semanales o mensuales según el avance de la obra" },
  { icon: CheckCircle2, text: "Carga directa al estanque de cada equipo, sin traslados ni tiempos muertos" },
  { icon: CheckCircle2, text: "Atención de urgencias en terreno, previa coordinación y según disponibilidad" },
  { icon: CheckCircle2, text: "Precios actualizados según mercado, confirmados antes de cada despacho" },
  { icon: CheckCircle2, text: "Flota especializada y protocolos de seguridad en cada carga" },
];

export default function MaquinariaPesadaPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(serviceSchema)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(maqFaqSchema)} />

      {/* Breadcrumb */}
      <div className="bg-slate-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <Breadcrumb crumbs={[
            { name: "Inicio", href: "/" },
            { name: "Servicios", href: "/petroleo-a-domicilio" },
            { name: "Combustible para Maquinaria Pesada" },
          ]} />
        </div>
      </div>

      {/* Hero */}
      <section className="bg-slate-950 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "48px 48px" }} />
        <div className="absolute top-0 right-0 w-96 h-64 bg-orange-500/10 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-6 h-px bg-orange-500" />
            <span className="text-orange-400 text-xs font-semibold uppercase tracking-widest">Servicio</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight max-w-3xl">
            Diésel para maquinaria pesada en faena
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mb-8">
            Abastecemos excavadoras, retroexcavadoras, cargadores frontales y equipos de
            movimiento de tierra directamente en su faena, obra o terreno. Su maquinaria
            trabaja; nosotros llevamos el combustible.
          </p>
          <WhatsAppButton
            mensaje="Hola, necesito cotizar diésel para maquinaria pesada en faena."
            className="bg-orange-500 hover:bg-orange-600 text-white"
          />
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-10">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                  Combustible donde trabaja su maquinaria
                </h2>
                <p className="text-slate-600 leading-relaxed mb-4">
                  Cada hora que una excavadora o un cargador frontal está detenido por falta de
                  combustible es una hora de faena perdida. En FENICE despachamos{" "}
                  <strong className="text-slate-800">petróleo diésel para maquinaria pesada</strong> directamente en
                  la obra, faena o terreno, cargando cada equipo en su propio estanque.
                </p>
                <p className="text-slate-600 leading-relaxed">
                  Trabajamos con <strong className="text-slate-800">empresas de movimiento de tierra, constructoras,
                  faenas mineras y empresas agrícolas</strong> que necesitan mantener sus equipos operando
                  sin interrupciones, con despachos programados según el avance de la obra y
                  capacidad de respuesta ante urgencias, previa coordinación.
                </p>
              </div>

              {/* Foto real de operación */}
              <figure className="relative overflow-hidden rounded-2xl ring-1 ring-slate-900/5">
                <div className="relative aspect-[16/9]">
                  <Image
                    src="/images/operacion-faena-excavadora.webp"
                    alt="Operario de Fenice SPA abasteciendo de petróleo diésel una excavadora en plena faena"
                    fill
                    sizes="(min-width: 1024px) 66vw, 100vw"
                    placeholder="blur"
                    blurDataURL={BLUR["operacion-faena-excavadora"]}
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                </div>
                <figcaption className="absolute inset-x-0 bottom-0 p-4 text-white text-sm font-semibold">
                  Carga directa a excavadora en faena — operación real de FENICE
                </figcaption>
              </figure>

              {/* Equipos */}
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-5">Equipos que abastecemos</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {equipos.map((item) => (
                    <div key={item.label} className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-xl p-4 hover:border-orange-200 transition-colors">
                      <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0">
                        <item.icon className="w-4 h-4 text-orange-500" />
                      </div>
                      <span className="text-slate-700 text-sm font-medium">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Beneficios */}
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-5">Beneficios del servicio</h2>
                <ul className="space-y-3">
                  {beneficios.map((item, i) => (
                    <li key={i} className="flex items-start gap-4 bg-slate-50 border border-slate-100 rounded-xl p-4 hover:border-orange-200 transition-colors group">
                      <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 group-hover:border-orange-200 flex items-center justify-center shrink-0 transition-all">
                        <item.icon className="w-4 h-4 text-orange-500" />
                      </div>
                      <span className="text-slate-700 text-sm leading-relaxed pt-1">{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* FAQ */}
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-5">Preguntas frecuentes</h2>
                <div className="space-y-3">
                  {faqItems.map((item, i) => (
                    <details key={i} className="group bg-white border border-slate-200 hover:border-orange-200 rounded-xl overflow-hidden transition-colors">
                      <summary className="flex items-center justify-between px-5 py-4 cursor-pointer list-none select-none">
                        <span className="font-semibold text-slate-900 text-sm pr-4">{item.q}</span>
                        <ChevronRight className="w-4 h-4 text-orange-500 shrink-0 group-open:rotate-90 transition-transform" />
                      </summary>
                      <p className="px-5 pb-4 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">{item.a}</p>
                    </details>
                  ))}
                </div>
              </div>

              {/* Cross-links */}
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-6">
                <h3 className="font-bold text-slate-900 mb-3">Servicios relacionados</h3>
                <div className="flex flex-wrap gap-3 text-sm">
                  <Link href="/venta-petroleo-diesel" className="text-orange-600 hover:underline font-medium">Venta de petróleo diésel →</Link>
                  <Link href="/empresas-faenas-flotas" className="text-orange-600 hover:underline font-medium">Empresas, faenas y flotas →</Link>
                  <Link href="/servicios/instalacion-de-estanques" className="text-orange-600 hover:underline font-medium">Instalación y mantención de estanques →</Link>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-5">
              <div className="bg-slate-900 text-white rounded-2xl p-6">
                <h3 className="font-semibold mb-5 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-orange-400" />
                  Resumen del servicio
                </h3>
                <ul className="space-y-4">
                  {[
                    { label: "Combustible", val: "Petróleo diésel" },
                    { label: "Compra mínima", val: "50 litros" },
                    { label: "Modalidad", val: "En faena, programado o urgente*" },
                    { label: "Cobertura", val: "RM, Valparaíso y O'Higgins" },
                    { label: "Pago", val: "Transferencia, tarjetas, cheque" },
                  ].map((item) => (
                    <li key={item.label} className="flex justify-between text-sm pb-4 border-b border-slate-800 last:border-0 last:pb-0">
                      <span className="text-slate-400">{item.label}</span>
                      <span className="font-medium text-right max-w-[55%]">{item.val}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-[11px] text-slate-500 mt-4 leading-relaxed">
                  *Urgencias sujetas a disponibilidad operacional y coordinación previa.
                </p>
              </div>

              <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6">
                <h3 className="font-bold text-slate-900 mb-2">Cotice para su faena</h3>
                <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                  Indíquenos los equipos, el volumen estimado y la ubicación de la faena.
                  Le respondemos con precio actualizado y propuesta de programación.
                </p>
                <WhatsAppButton
                  mensaje="Hola, quiero cotizar diésel para maquinaria de movimiento de tierra."
                  className="w-full justify-center"
                />
                <Link
                  href="/cotizacion"
                  className="mt-3 block text-center text-sm text-slate-600 hover:text-orange-600 font-medium transition-colors"
                >
                  O solicite una cotización →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CTASection heading="Mantenga su faena en movimiento" mensaje="Hola, quiero cotizar diésel para maquinaria pesada." />
    </>
  );
}
