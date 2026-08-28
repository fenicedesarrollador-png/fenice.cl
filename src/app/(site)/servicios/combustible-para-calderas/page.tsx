import CTASection from "@/components/CTASection";
import Breadcrumb from "@/components/Breadcrumb";
import WhatsAppButton from "@/components/WhatsAppButton";
import Link from "next/link";
import { buildMetadata, serviceSchema as buildServiceSchema, faqSchema, jsonLd } from "@/lib/seo";
import {
  Flame, Building2, CheckCircle2, CalendarCheck, ShieldCheck, ThermometerSun,
  Hospital, Hotel, Factory, ChevronRight,
} from "lucide-react";

export const metadata = buildMetadata({
  title: "Combustible para Calderas en Santiago",
  description:
    "Suministro de combustible para calderas de edificios, clínicas, hoteles e industrias en Santiago y la RM, con despachos programados.",
  path: "/servicios/combustible-para-calderas",
  keywords: [
    "combustible para calderas",
    "petróleo para calderas de edificios",
    "diesel para calderas santiago",
    "suministro de combustible para calefacción central",
    "combustible para calderas región metropolitana",
    "kerosene para calefacción",
  ],
});

const serviceSchema = buildServiceSchema({
  name: "Combustible para Calderas",
  description:
    "Suministro de combustible para calderas instaladas en edificios, condominios, industrias, centros de salud, hoteles y otras instalaciones que requieren mantener su operación térmica en la Región Metropolitana.",
  slug: "combustible-para-calderas",
});

const faqItems = [
  {
    q: "¿Qué instalaciones con calderas abastecen?",
    a: "Suministramos combustible a calderas de edificios, condominios, clínicas y centros de salud, hoteles, establecimientos educacionales e industrias que necesitan mantener calefacción central, agua caliente sanitaria o procesos térmicos.",
  },
  {
    q: "¿Puedo programar entregas para la temporada de invierno?",
    a: "Sí. Recomendamos programar abastecimientos semanales o mensuales durante los meses de mayor consumo, así su caldera nunca se detiene por falta de combustible. Coordinamos fechas y volúmenes con anticipación.",
  },
  {
    q: "¿Cuál es la compra mínima y cómo se define el precio?",
    a: "La compra mínima es de 50 litros. Los precios se actualizan según las condiciones del mercado y se confirman antes de cada despacho.",
  },
  {
    q: "¿Cómo coordino el despacho para mi edificio?",
    a: "La administración o el encargado de mantención solicita una cotización por WhatsApp o formulario, indicando la dirección, el volumen y la fecha estimada. Confirmamos precio y condiciones, y el despacho se realiza previa coordinación de fecha y horario.",
  },
];

const calderasFaqSchema = faqSchema(faqItems);

const instalaciones = [
  { icon: Building2, label: "Edificios y condominios" },
  { icon: Hospital, label: "Clínicas y centros de salud" },
  { icon: Hotel, label: "Hoteles y centros recreativos" },
  { icon: Factory, label: "Industrias con procesos térmicos" },
  { icon: ThermometerSun, label: "Calefacción central y agua caliente" },
  { icon: Flame, label: "Instalaciones con demanda estacional" },
];

const beneficios = [
  { icon: ShieldCheck, text: "Operación térmica continua: calefacción y agua caliente sin interrupciones" },
  { icon: CalendarCheck, text: "Programación semanal o mensual, con refuerzos en temporada de invierno" },
  { icon: CheckCircle2, text: "Coordinación directa con administradores y encargados de mantención" },
  { icon: CheckCircle2, text: "Precios actualizados según mercado, confirmados antes de cada despacho" },
  { icon: CheckCircle2, text: "Despacho seguro en las instalaciones, coordinado en fecha y horario" },
  { icon: CheckCircle2, text: "Factura electrónica y respaldo documental de cada entrega" },
];

export default function CalderasPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(serviceSchema)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(calderasFaqSchema)} />

      {/* Breadcrumb */}
      <div className="bg-slate-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <Breadcrumb crumbs={[
            { name: "Inicio", href: "/" },
            { name: "Servicios", href: "/petroleo-a-domicilio" },
            { name: "Combustible para Calderas" },
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
            Combustible para calderas
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mb-8">
            Suministro de combustible para calderas de edificios, condominios, clínicas, hoteles
            e industrias en Santiago y la Región Metropolitana. Mantenga su operación térmica
            funcionando todo el año.
          </p>
          <WhatsAppButton
            mensaje="Hola, necesito cotizar combustible para una caldera."
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
                  Calefacción y procesos térmicos sin interrupciones
                </h2>
                <p className="text-slate-600 leading-relaxed mb-4">
                  Cuando una caldera se detiene por falta de combustible, se detiene la calefacción,
                  el agua caliente y —en la industria— procesos productivos completos. En FENICE
                  entregamos <strong className="text-slate-800">combustible para calderas</strong> directamente en su edificio,
                  condominio, clínica, hotel o planta, con despachos coordinados en fecha, horario
                  y cantidad.
                </p>
                <p className="text-slate-600 leading-relaxed">
                  Nuestro foco es la <strong className="text-slate-800">continuidad operacional</strong>: abastecimientos
                  programados según su consumo, refuerzos en temporada de invierno y comunicación
                  directa con la administración o el encargado de mantención durante todo el proceso.
                </p>
              </div>

              {/* Instalaciones */}
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-5">Instalaciones que abastecemos</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {instalaciones.map((item) => (
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
                  <Link href="/servicios/combustible-para-generadores-electricos" className="text-orange-600 hover:underline font-medium">Combustible para generadores →</Link>
                  <Link href="/venta-kerosene" className="text-orange-600 hover:underline font-medium">Venta de kerosene →</Link>
                  <Link href="/servicios/instalacion-de-estanques" className="text-orange-600 hover:underline font-medium">Instalación y mantención de estanques →</Link>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-5">
              <div className="bg-slate-900 text-white rounded-2xl p-6">
                <h3 className="font-semibold mb-5 flex items-center gap-2">
                  <Flame className="w-4 h-4 text-orange-400" />
                  Resumen del servicio
                </h3>
                <ul className="space-y-4">
                  {[
                    { label: "Combustible", val: "Diésel o kerosene" },
                    { label: "Compra mínima", val: "50 litros" },
                    { label: "Modalidad", val: "Programado o urgente*" },
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
                <h3 className="font-bold text-slate-900 mb-2">Planifique su temporada</h3>
                <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                  Programe con anticipación el abastecimiento de su caldera y asegure la
                  calefacción de su edificio o instalación durante todo el invierno.
                </p>
                <WhatsAppButton
                  mensaje="Hola, quiero programar el abastecimiento de combustible para una caldera."
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

      <CTASection heading="Programe su próximo abastecimiento" mensaje="Hola, quiero cotizar combustible para una caldera." />
    </>
  );
}
