import CTASection from "@/components/CTASection";
import Breadcrumb from "@/components/Breadcrumb";
import WhatsAppButton from "@/components/WhatsAppButton";
import Link from "next/link";
import { COMUNAS } from "@/lib/config";
import { buildMetadata, serviceSchema as buildServiceSchema } from "@/lib/seo";
import { CheckCircle2, MapPin, Clock, FileText, Truck, Building2 } from "lucide-react";

export const metadata = buildMetadata({
  title: "Petróleo a Domicilio Santiago | Despacho de Diesel para Empresas",
  description:
    "Despacho de petróleo diesel a domicilio en Santiago para empresas e industria. Coordinación por WhatsApp, despacho rápido y cobertura en toda la Región Metropolitana. Cotiza ahora.",
  path: "/servicios/petroleo-a-domicilio-santiago",
  keywords: [
    "petróleo a domicilio santiago",
    "despacho de diesel empresas santiago",
    "petróleo industrial región metropolitana",
    "distribuidor de combustible RM",
  ],
});

const serviceSchema = buildServiceSchema({
  name: "Petróleo a Domicilio Santiago",
  description: "Despacho programado y urgente de petróleo diesel para empresas e industria en la Región Metropolitana de Santiago.",
  slug: "petroleo-a-domicilio-santiago",
});

const clientes = [
  "Empresas de construcción con maquinaria pesada y generadores",
  "Plantas industriales y manufactureras con consumo regular",
  "Faenas mineras y agrícolas en sectores periurbanos de la RM",
  "Proveedores de energía con grupos electrógenos",
  "Flotas de transporte pesado y maquinaria especial",
  "Condominios y edificios con generadores de emergencia",
];

const pasos = [
  { icon: FileText, text: "Cotiza por WhatsApp o formulario indicando tu comuna, volumen requerido y fecha." },
  { icon: Clock, text: "Te respondemos con precio y disponibilidad en minutos (Lun-Vie 09:00–19:00)." },
  { icon: CheckCircle2, text: "Confirmamos la orden y coordinamos el horario de entrega." },
  { icon: Truck, text: "Nuestro camión despacha el petróleo directamente a tu instalación." },
  { icon: FileText, text: "Emitimos factura electrónica para tu contabilidad." },
];

export default function PetroleoSantiagoPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />

      {/* Breadcrumb */}
      <div className="bg-slate-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <Breadcrumb crumbs={[
            { name: "Inicio", href: "/" },
            { name: "Servicios", href: "/servicios/petroleo-a-domicilio-santiago" },
            { name: "Petróleo a Domicilio Santiago" },
          ]} />
        </div>
      </div>

      {/* Hero */}
      <section className="bg-slate-950 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "48px 48px" }} />
        <div className="absolute bottom-0 left-1/4 w-96 h-64 bg-orange-500/10 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-6 h-px bg-orange-500" />
            <span className="text-orange-400 text-xs font-semibold uppercase tracking-widest">Servicio</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight max-w-3xl">
            Petróleo a domicilio en Santiago para empresas e industria
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mb-8">
            Fenice SPA distribuye petróleo a domicilio para clientes empresariales en toda la Región
            Metropolitana. Despacho programado o urgente, con coordinación directa por WhatsApp.
          </p>
          <div className="flex flex-wrap gap-4">
            <WhatsAppButton
              mensaje="Hola, necesito cotizar petróleo a domicilio en Santiago para mi empresa."
              className="bg-orange-500 hover:bg-orange-600 text-white"
            />
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-10">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                  Despacho de petróleo para tu operación en Santiago
                </h2>
                <p className="text-slate-600 leading-relaxed mb-4">
                  El petróleo diesel es el combustible más demandado por la industria, construcción y empresas
                  con generadores eléctricos en la Región Metropolitana de Santiago. En Fenice SPA entendemos
                  que la continuidad operacional depende de contar con combustible disponible en el momento
                  preciso, sin demoras ni burocracia.
                </p>
                <p className="text-slate-600 leading-relaxed">
                  Nuestro servicio de <strong className="text-slate-800">petróleo a domicilio en Santiago</strong> está diseñado para
                  empresas que requieren despacho directo a faenas, bodegas, plantas industriales o generadores.
                  Coordinamos la entrega por WhatsApp y ajustamos el horario a las necesidades de tu operación.
                </p>
              </div>

              {/* Clientes */}
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-5">
                  ¿Para qué tipo de clientes despachamos petróleo en Santiago?
                </h2>
                <ul className="grid sm:grid-cols-2 gap-3">
                  {clientes.map((item) => (
                    <li key={item} className="flex items-start gap-3 bg-slate-50 rounded-xl p-4 border border-slate-100">
                      <CheckCircle2 className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
                      <span className="text-slate-700 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Proceso */}
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-5">
                  ¿Cómo funciona el despacho de petróleo a domicilio en Santiago?
                </h2>
                <ol className="space-y-4">
                  {pasos.map((paso, i) => (
                    <li key={i} className="flex items-start gap-4">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-500 text-white text-sm font-bold shrink-0">
                        {i + 1}
                      </div>
                      <div className="flex-1 flex items-start gap-3 bg-slate-50 rounded-xl p-4 border border-slate-100">
                        <paso.icon className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
                        <span className="text-slate-700 text-sm">{paso.text}</span>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Comunas */}
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-4">
                  Cobertura de despacho de petróleo en Santiago
                </h2>
                <p className="text-slate-600 text-sm mb-4">
                  Despachamos petróleo a domicilio en comunas de Santiago como:
                </p>
                <div className="flex flex-wrap gap-2">
                  {COMUNAS.map((c) => (
                    <Link
                      key={c.slug}
                      href={`/cobertura/petroleo-a-domicilio-${c.slug}`}
                      className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-orange-50 hover:text-orange-700 text-slate-700 border border-slate-200 hover:border-orange-200 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                    >
                      <MapPin className="w-3 h-3" />
                      {c.nombre}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-5">
              {/* Quick facts */}
              <div className="bg-slate-900 text-white rounded-2xl p-6">
                <h3 className="font-semibold mb-5 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-orange-400" />
                  Características del servicio
                </h3>
                <ul className="space-y-4">
                  {[
                    { label: "Cobertura", val: "Toda la RM" },
                    { label: "Cliente mínimo", val: "B2B empresas" },
                    { label: "Coordinación", val: "WhatsApp + formulario" },
                    { label: "Facturación", val: "Factura electrónica" },
                    { label: "Horario", val: "Lun-Vie 09:00–19:00" },
                    { label: "Urgencias", val: "Consultar disponibilidad" },
                  ].map((item) => (
                    <li key={item.label} className="flex justify-between text-sm pb-4 border-b border-slate-800 last:border-0 last:pb-0">
                      <span className="text-slate-400">{item.label}</span>
                      <span className="font-medium">{item.val}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA box */}
              <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6">
                <h3 className="font-bold text-slate-900 mb-2">¿Listo para cotizar?</h3>
                <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                  Escríbenos por WhatsApp con tu comuna, volumen aproximado y fecha requerida.
                </p>
                <WhatsAppButton
                  mensaje="Hola, necesito cotizar petróleo a domicilio en Santiago para mi empresa."
                  className="w-full justify-center"
                />
                <Link
                  href="/contacto"
                  className="mt-3 block text-center text-sm text-slate-600 hover:text-orange-600 font-medium transition-colors"
                >
                  O usa el formulario →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CTASection heading="¿Necesitas petróleo a domicilio en Santiago?" mensaje="Hola, quiero cotizar petróleo a domicilio en Santiago." />
    </>
  );
}
