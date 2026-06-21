import CTASection from "@/components/CTASection";
import Breadcrumb from "@/components/Breadcrumb";
import WhatsAppButton from "@/components/WhatsAppButton";
import Link from "next/link";
import { buildMetadata, serviceSchema as buildServiceSchema } from "@/lib/seo";
import { Shield, AlertTriangle, CheckCircle2, Wrench, ClipboardCheck, BookOpen, RotateCcw } from "lucide-react";

export const metadata = buildMetadata({
  title: "Instalación de Estanques de Petróleo Certificados SEC | Santiago",
  description:
    "Instalación de estanques de petróleo certificados por la SEC en Santiago y la Región Metropolitana. Cumplimiento normativo, seguridad y calidad garantizada para tu empresa. Cotiza ahora.",
  path: "/servicios/instalacion-de-estanques",
  keywords: [
    "instalación de estanques de combustible santiago",
    "estanques de petróleo certificados SEC",
    "estanque diesel empresas región metropolitana",
    "almacenamiento de combustible normativa SEC",
  ],
});

const serviceSchema = buildServiceSchema({
  name: "Instalación de Estanques de Petróleo",
  description: "Instalación de estanques de almacenamiento de petróleo certificados por la Superintendencia de Electricidad y Combustibles (SEC) para empresas en la Región Metropolitana.",
  slug: "instalacion-de-estanques",
});

const incluye = [
  { icon: ClipboardCheck, text: "Asesoría en selección de capacidad y tipo de estanque según tu consumo" },
  { icon: Wrench, text: "Instalación por técnicos certificados cumpliendo normas SEC y NCh" },
  { icon: Shield, text: "Tramitación y registro ante la Superintendencia de Electricidad y Combustibles" },
  { icon: Shield, text: "Sistema de contención secundaria y válvulas de seguridad" },
  { icon: CheckCircle2, text: "Pruebas de hermeticidad y puesta en marcha" },
  { icon: BookOpen, text: "Capacitación al personal responsable del manejo" },
  { icon: RotateCcw, text: "Mantención preventiva y revisiones periódicas" },
];

export default function InstalacionEstanquesPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />

      {/* Breadcrumb */}
      <div className="bg-slate-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <Breadcrumb crumbs={[
            { name: "Inicio", href: "/" },
            { name: "Servicios", href: "/servicios/petroleo-a-domicilio-santiago" },
            { name: "Instalación de Estanques" },
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
            Instalación de estanques de petróleo certificados por la SEC
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mb-8">
            Fenice SPA instala estanques de almacenamiento de combustible para empresas e industria
            en la Región Metropolitana, cumpliendo con toda la normativa de la SEC.
          </p>
          <WhatsAppButton
            mensaje="Hola, necesito información sobre instalación de estanques de petróleo certificados."
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
                  Estanques de petróleo certificados para tu empresa
                </h2>
                <p className="text-slate-600 leading-relaxed mb-4">
                  Contar con un <strong className="text-slate-800">estanque de petróleo instalado correctamente</strong> es fundamental
                  para la seguridad de tu instalación industrial y para cumplir con la normativa vigente en
                  Chile. La Superintendencia de Electricidad y Combustibles (SEC) regula la instalación,
                  operación y mantenimiento de estos equipos mediante normativas específicas que toda empresa
                  debe respetar.
                </p>
                <p className="text-slate-600 leading-relaxed">
                  En Fenice SPA realizamos la <strong className="text-slate-800">instalación de estanques de petróleo certificados</strong>{" "}
                  en la Región Metropolitana, desde el diseño y selección del estanque adecuado hasta la
                  tramitación de documentación ante la SEC y la puesta en marcha del sistema.
                </p>
              </div>

              {/* Qué incluye */}
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-5">¿Qué incluye nuestro servicio?</h2>
                <ul className="space-y-3">
                  {incluye.map((item, i) => (
                    <li key={i} className="flex items-start gap-4 bg-slate-50 border border-slate-100 rounded-xl p-4 hover:border-orange-200 transition-colors group">
                      <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 group-hover:border-orange-200 flex items-center justify-center shrink-0 transition-all">
                        <item.icon className="w-4 h-4 text-orange-500" />
                      </div>
                      <span className="text-slate-700 text-sm leading-relaxed pt-1">{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Normativa */}
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-4">
                  Normativa SEC para almacenamiento de combustible en Chile
                </h2>
                <p className="text-slate-600 leading-relaxed mb-4 text-sm">
                  La instalación de estanques de combustible en Chile está regulada por el Decreto N° 160
                  del Ministerio de Economía y la NCh 2597. Estos marcos normativos establecen requisitos
                  de ubicación, distancias de seguridad, materiales, señalética y certificación profesional
                  para la instalación.
                </p>
                <p className="text-slate-600 leading-relaxed text-sm">
                  Nuestro equipo se encarga de que tu instalación cumpla con todos los requisitos legales,
                  evitando multas, paralizaciones de obra y riesgos para tu personal e instalaciones.
                </p>
              </div>

              {/* Alerta regularización */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-amber-900 mb-2">¿Tienes un estanque sin certificar?</h3>
                    <p className="text-amber-800 text-sm leading-relaxed">
                      Si ya cuentas con un estanque instalado pero sin la certificación SEC correspondiente,
                      podemos asesorarte en el proceso de regularización. Contáctanos para evaluar tu caso.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-5">
              <div className="bg-slate-900 text-white rounded-2xl p-6">
                <h3 className="font-semibold mb-5 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-orange-400" />
                  Certificación SEC
                </h3>
                <ul className="space-y-4">
                  {[
                    { label: "Marco legal", val: "Decreto N° 160 + NCh 2597" },
                    { label: "Fiscaliza", val: "SEC Chile" },
                    { label: "Tramitación", val: "Incluida en el servicio" },
                    { label: "Zona de servicio", val: "Región Metropolitana" },
                    { label: "Mantención", val: "Servicio continuo disponible" },
                  ].map((item) => (
                    <li key={item.label} className="flex justify-between text-sm pb-4 border-b border-slate-800 last:border-0 last:pb-0">
                      <span className="text-slate-400">{item.label}</span>
                      <span className="font-medium text-right max-w-[55%]">{item.val}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6">
                <h3 className="font-bold text-slate-900 mb-2">Solicitar asesoría</h3>
                <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                  Cuéntanos tu caso y te asesoramos en capacidad, tipo y proceso de instalación.
                </p>
                <WhatsAppButton
                  mensaje="Hola, necesito información sobre instalación de estanques de petróleo certificados."
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

      <CTASection heading="¿Necesitas instalar un estanque de petróleo?" mensaje="Hola, quiero cotizar la instalación de un estanque de petróleo certificado." />
    </>
  );
}
