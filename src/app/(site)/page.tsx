import Link from "next/link";
import Image from "next/image";
import PreciosCombustible from "@/components/PreciosCombustible";
import TrustSignals from "@/components/TrustSignals";
import FuelGauge from "@/components/FuelGauge";
import Certificaciones from "@/components/Certificaciones";
import ClientesShowcase from "@/components/ClientesShowcase";
import {
  Truck, ArrowRight, Phone, CheckCircle2,
  MapPin, Clock, Building2, ShieldCheck, FileText,
  ChevronRight, Users, Award, Clipboard,
  Route, Shield, BarChart3, HeadphonesIcon, Container
} from "lucide-react";
import { COMUNAS_DESTACADAS, SITE_CONFIG } from "@/lib/config";
import { buildMetadata, faqSchema, jsonLd, CORE_KEYWORDS } from "@/lib/seo";

export const revalidate = 60;

export const metadata = buildMetadata({
  title: "Petróleo a Domicilio Santiago | Distribuidor de Combustible RM",
  titleAbsolute: true,
  description:
    "Distribuidor de petróleo diesel a domicilio para empresas en Santiago y la Región Metropolitana. Despacho rápido, flota especializada y cotización por WhatsApp en minutos.",
  path: "/",
  keywords: CORE_KEYWORDS,
});

const faqItems = [
  { q: "¿Hacen despacho de petróleo a domicilio en Santiago?", a: "Sí. Realizamos despacho de petróleo a domicilio en toda la Región Metropolitana para empresas e industria, con despachos programados o urgentes según sus necesidades." },
  { q: "¿En qué comunas de Santiago trabajan?", a: "Atendemos La Granja, Providencia, Las Condes, Maipú, Pudahuel, Quilicura, Puente Alto, San Bernardo, Lampa, Buin, Colina, además de Valparaíso y Rancagua." },
  { q: "¿Instalan estanques de combustible?", a: "Sí. Instalamos estanques certificados SEC con autorización TC4 y coordinamos la carga periódica según la necesidad de tu operación: semanal, quincenal, mensual o a demanda." },
  { q: "¿Qué tipo de empresas pueden cotizar petróleo?", a: "Industria manufacturera, construcción, minería, faenas, generadores eléctricos, flotas de maquinaria y cualquier organización con requerimiento de combustible." },
  { q: "¿Cumplen la normativa de transporte de combustible?", a: "Sí. Nuestra flota de camiones estanque opera con certificación TC10A y cumplimos el DS 160 y la normativa de transporte de carga peligrosa en cada despacho." },
  { q: "¿Cómo cotizo el precio del petróleo?", a: "Por WhatsApp al +56 9 3957 9658, mediante el formulario de cotización o al correo ventas@fenice.cl. Respondemos en minutos Lun-Vie 09:00–19:00." },
];

const homeFaqSchema = faqSchema(faqItems);

const STATS = [
  { value: "52", label: "Comunas RM", icon: MapPin },
  { value: "24h", label: "Tiempo respuesta", icon: Clock },
  { value: "B2B", label: "Especialistas", icon: Building2 },
  { value: "SEC", label: "Certificado", icon: Award },
];

const TRUST_BADGES = [
  "Despacho toda la RM",
  "Factura electrónica",
  "Estanques SEC",
  "Respuesta en minutos",
];

const SERVICIOS_HOME = [
  {
    icon: Truck,
    title: "Petróleo diesel a domicilio",
    desc: "Despacho de diesel para empresas, faenas y cualquier necesidad operativa en la RM.",
    href: "/servicios/petroleo-a-domicilio-santiago",
  },
  {
    icon: Container,
    title: "Instalación de estanques SEC",
    desc: "Estanques certificados con carga periódica según la necesidad de tu operación.",
    href: "/servicios/instalacion-de-estanques",
  },
  {
    icon: Building2,
    title: "Abastecimiento a empresas",
    desc: "Soluciones adaptadas a la operación de industrias, flotas y clientes corporativos.",
    href: "/empresas-faenas-flotas",
  },
  {
    icon: HeadphonesIcon,
    title: "Atención personalizada",
    desc: "Acompañamiento comercial y operativo según cada necesidad.",
    href: "/contacto",
  },
];

const WHY_US = [
  {
    icon: Shield,
    title: "Seguridad operacional",
    desc: "Protocolos y estándares para una operación segura y controlada.",
  },
  {
    icon: FileText,
    title: "Cumplimiento y control",
    desc: "Gestión normativa, registros y trazabilidad en cada etapa.",
  },
  {
    icon: Truck,
    title: "Experiencia logística",
    desc: "Flota especializada y equipos con experiencia en el transporte de combustibles.",
  },
  {
    icon: Users,
    title: "Compromiso con el cliente",
    desc: "Relaciones de confianza y soluciones adaptadas a cada operación.",
  },
];

const HOW_WE_WORK = [
  { n: "1", icon: Clipboard, title: "Solicitud", desc: "Recepción de requerimientos y necesidades del cliente." },
  { n: "2", icon: HeadphonesIcon, title: "Coordinación", desc: "Planificación de rutas, recursos y tiempos de operación." },
  { n: "3", icon: Truck, title: "Transporte", desc: "Traslado seguro con control operativo y seguimiento en tiempo real." },
  { n: "4", icon: ShieldCheck, title: "Entrega segura", desc: "Entrega en destino cumpliendo estándares de seguridad y calidad." },
];

const SECURITY_ITEMS = [
  { icon: ShieldCheck, label: "Procedimientos y estándares" },
  { icon: Route, label: "Planificación de rutas" },
  { icon: Truck, label: "Flota especializada y segura" },
  { icon: BarChart3, label: "Monitoreo y control en tiempo real" },
];

const SECTORES = [
  "Construcción e inmobiliaria",
  "Manufactura y planta industrial",
  "Minería y extracción",
  "Generadores eléctricos",
  "Flota de maquinaria pesada",
  "Agroindustria y agricultura",
];

const WA_URL = `https://wa.me/${SITE_CONFIG.whatsapp_numero}?text=${encodeURIComponent("Hola, quiero cotizar petróleo a domicilio para mi empresa.")}`;
const WA_ICON = (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current shrink-0">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.531 5.856L0 24l6.335-1.509A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.81 9.81 0 01-5.003-1.371l-.359-.214-3.754.894.954-3.652-.234-.374A9.785 9.785 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z" />
  </svg>
);

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(homeFaqSchema)} />

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#0a1628]" data-analytics-section="hero">

        {/* Imagen de fondo — desktop centrada al camión, móvil apuntada a izquierda */}
        <Image
          src="/images/portada-fenice.webp"
          alt="Camión de despacho de petróleo a domicilio de Fenice SPA en Santiago, con la cordillera de fondo"
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          className="object-cover sm:object-[55%_center] object-[35%_center]"
        />

        {/* Overlay desktop: oscuro solo en la franja izquierda donde va el texto; el resto se ve claro */}
        <div className="absolute inset-0 hidden sm:block bg-gradient-to-r from-[#0a1628]/80 via-[#0a1628]/30 to-transparent" />

        {/* Overlay móvil: apenas oscurece la parte superior (texto) y deja ver la foto clara abajo */}
        <div className="absolute inset-0 sm:hidden"
          style={{ background: "linear-gradient(to bottom, rgba(10,22,40,0.82) 0%, rgba(10,22,40,0.5) 48%, rgba(10,22,40,0.05) 100%)" }}
        />

        {/* Línea inferior */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#1a6b3c] via-[#f5a623] to-[#1a6b3c] z-10" />

        {/* CONTENIDO */}
        <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-14 items-center">

            {/* Texto — ocupa todo el alto en móvil para que la imagen se vea abajo del overlay */}
            <div className="py-10 sm:py-20 lg:py-28 min-h-[70vw] sm:min-h-0 flex flex-col justify-center">
              <div className="hero-rise inline-flex items-center gap-2 bg-[#f5a623]/10 border border-[#f5a623]/25 text-[#f5a623] text-[11px] sm:text-xs font-bold px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-5 uppercase tracking-wider w-fit">
                <span className="w-1.5 h-1.5 rounded-full bg-[#f5a623] animate-pulse" />
                Distribución industrial · Región Metropolitana
              </div>
              <h1 className="hero-rise-1 text-3xl sm:text-5xl lg:text-[3.2rem] font-extrabold text-white leading-[1.15] sm:leading-[1.1] tracking-tight mb-5">
                Petróleo a Domicilio<br />
                en <span className="text-[#f5a623]">Santiago</span> para<br />
                <span className="text-[#f5a623]">Empresas e Industria</span>
              </h1>
              <p className="hero-rise-2 text-sm sm:text-base text-slate-300 leading-relaxed mb-7 max-w-xl">
                Fenice SPA distribuye petróleo diesel a domicilio en toda la Región Metropolitana
                e instala estanques certificados SEC con carga periódica según tu operación.
                Flota especializada, despacho rápido y respaldo en cada entrega.
              </p>
              <div className="hero-rise-3 flex flex-col sm:flex-row gap-3 mb-7">
                <Link href="/cotizacion" data-analytics-id="hero_cotizar" data-analytics-label="Solicitar cotización" data-analytics-cta="quote" className="inline-flex items-center justify-center gap-2 bg-[#f5a623] hover:bg-[#d4891a] text-white font-bold px-7 py-3.5 rounded-xl transition-all shadow-lg shadow-[#f5a623]/25 text-sm">
                  Solicitar cotización <ArrowRight className="w-4 h-4" />
                </Link>
                <a href={WA_URL} target="_blank" rel="noopener noreferrer" data-analytics-id="hero_whatsapp" data-analytics-label="Cotizar por WhatsApp" data-analytics-cta="whatsapp" className="inline-flex items-center justify-center gap-2.5 bg-[#1a6b3c] hover:bg-[#145530] text-white font-semibold px-7 py-3.5 rounded-xl transition-all text-sm border border-[#1a6b3c]/50">
                  {WA_ICON} Cotizar por WhatsApp
                </a>
              </div>
              <div className="hero-rise-3 grid grid-cols-3 gap-2 sm:gap-3 max-w-sm">
                {[
                  { icon: Truck, label: "Flota especializada" },
                  { icon: MapPin, label: "Cobertura operativa" },
                  { icon: ShieldCheck, label: "Seguridad y trazabilidad" },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex flex-col items-center gap-1.5 bg-white/10 border border-white/20 rounded-xl p-2.5 sm:p-3 text-center backdrop-blur-sm">
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-[#f5a623]" />
                    <span className="text-[10px] sm:text-xs text-slate-300 font-medium leading-tight">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats card — solo desktop */}
            <div className="hidden lg:block py-28">
              <div className="hero-rise-3 bg-[#0d2040]/30 border border-white/15 rounded-2xl p-8 backdrop-blur-md">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">Cobertura operativa</p>
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {STATS.map(({ value, label, icon: Icon }) => (
                    <div key={label} className="bg-white/10 rounded-xl p-4 border border-white/15 backdrop-blur-sm">
                      <Icon className="w-4 h-4 text-[#f5a623] mb-2" />
                      <p className="text-2xl font-extrabold text-white">{value}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{label}</p>
                    </div>
                  ))}
                </div>
                <div className="border-t border-white/10 pt-6">
                  <p className="text-xs text-slate-400 mb-3 font-medium">Sectores que atendemos</p>
                  <div className="flex flex-wrap gap-2">
                    {SECTORES.map((s) => (
                      <span key={s} className="text-xs bg-white/10 text-slate-200 border border-white/20 px-2.5 py-1 rounded-full">{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── SEÑALES DE CONFIANZA ─────────────────────────────────────────────── */}
      <TrustSignals />

      {/* ── EMPRESAS QUE CONFÍAN (logos, editable en /admin/clientes) ────────── */}
      <ClientesShowcase />

      {/* ── PRECIOS DE COMBUSTIBLE Y PRODUCTOS ───────────────────────────────── */}
      <PreciosCombustible />

      {/* ── QUIÉNES SOMOS ────────────────────────────────────────────────────── */}
      <section className="py-16 bg-white" data-analytics-section="nosotros">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            {/* Medidor de combustible interactivo */}
            <div className="flex items-center justify-center" data-reveal="left">
              <div className="w-full max-w-sm bg-[#f8fafc] border border-slate-100 rounded-3xl p-8 shadow-sm">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-2 h-2 rounded-full bg-[#1a6b3c] animate-pulse" />
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Monitor de abastecimiento</span>
                </div>
                <FuelGauge />
              </div>
            </div>
            <div data-reveal="right">
              <p className="text-xs font-bold text-[#1a6b3c] uppercase tracking-widest mb-3">Quiénes somos</p>
              <h2 className="text-3xl font-extrabold text-[#0a1628] mb-4 leading-tight">
                Fenice SPA
              </h2>
              <div className="w-12 h-1 bg-[#f5a623] rounded-full mb-5" />
              <p className="text-slate-600 leading-relaxed mb-4">
                Fenice SPA es una empresa orientada a la logística y transporte de combustible,
                enfocada en entregar un servicio profesional, seguro y eficiente para empresas
                que requieren continuidad operacional y abastecimiento confiable.
              </p>
              <p className="text-slate-600 leading-relaxed mb-6">
                Operamos con flota especializada y cumplimiento normativo SEC en toda la
                Región Metropolitana, con cobertura adicional en Valparaíso y Rancagua.
              </p>
              <div className="flex flex-wrap gap-x-6 gap-y-2 mb-6">
                {TRUST_BADGES.map((t) => (
                  <span key={t} className="flex items-center gap-1.5 text-sm text-slate-700 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-[#1a6b3c] shrink-0" />
                    {t}
                  </span>
                ))}
              </div>
              <Link href="/nosotros" data-analytics-id="home_nosotros" data-analytics-label="Conocer más sobre nosotros" data-analytics-cta="secondary_navigation" className="inline-flex items-center gap-2 text-sm font-bold text-[#1a6b3c] hover:text-[#0d4a28] transition-colors">
                Conocer más sobre nosotros <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── NUESTROS SERVICIOS ───────────────────────────────────────────────── */}
      <section className="py-20 bg-[#0a1628]" data-analytics-section="servicios">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-px w-12 bg-[#f5a623]" />
              <p className="text-xs font-bold text-[#f5a623] uppercase tracking-widest">Nuestros servicios</p>
              <div className="h-px w-12 bg-[#f5a623]" />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {SERVICIOS_HOME.map(({ icon: Icon, title, desc, href }, i) => (
              <Link
                key={title}
                href={href}
                data-reveal
                data-reveal-delay={String(i * 90)}
                data-analytics-id={`home_service_${title.toLowerCase().replaceAll(" ", "_").replaceAll("/", "_")}`}
                data-analytics-label={title}
                data-analytics-cta="service_card"
                className="group bg-white/5 border border-white/10 hover:border-[#f5a623]/40 rounded-2xl p-6 transition-all hover:bg-white/8 hover:-translate-y-1"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#1a6b3c]/20 border border-[#1a6b3c]/30 group-hover:bg-[#1a6b3c]/30 flex items-center justify-center mb-5 transition-colors">
                  <Icon className="w-6 h-6 text-[#1a6b3c] group-hover:text-white transition-colors" strokeWidth={1.8} />
                </div>
                <h3 className="text-base font-bold text-white mb-2 leading-tight">{title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed mb-4">{desc}</p>
                <div className="h-0.5 w-8 bg-[#f5a623] group-hover:w-full transition-all duration-300 rounded-full" />
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/servicios/petroleo-a-domicilio-santiago" data-analytics-id="home_ver_servicios" data-analytics-label="Ver todos los servicios" data-analytics-cta="service_navigation" className="inline-flex items-center gap-2 text-sm font-semibold text-[#f5a623] hover:text-[#d4891a] transition-colors">
              Ver todos los servicios <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── ¿POR QUÉ ELEGIRNOS? ──────────────────────────────────────────────── */}
      <section className="py-20 bg-white" data-analytics-section="beneficios">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-px w-12 bg-[#f5a623]" />
              <p className="text-xs font-bold text-[#f5a623] uppercase tracking-widest">¿Por qué elegirnos?</p>
              <div className="h-px w-12 bg-[#f5a623]" />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHY_US.map(({ icon: Icon, title, desc }, i) => (
              <div key={title} className="text-center group" data-reveal data-reveal-delay={String(i * 90)}>
                <div className="w-16 h-16 rounded-2xl bg-[#1a6b3c]/10 border border-[#1a6b3c]/20 group-hover:bg-[#1a6b3c]/20 flex items-center justify-center mx-auto mb-4 transition-colors">
                  <Icon className="w-7 h-7 text-[#1a6b3c]" strokeWidth={1.8} />
                </div>
                <h3 className="font-bold text-[#0a1628] mb-2">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ¿CÓMO TRABAJAMOS? ────────────────────────────────────────────────── */}
      <section className="py-20 bg-slate-50" data-analytics-section="proceso">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-px w-12 bg-[#f5a623]" />
              <p className="text-xs font-bold text-[#f5a623] uppercase tracking-widest">¿Cómo trabajamos?</p>
              <div className="h-px w-12 bg-[#f5a623]" />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {/* Connector line desktop */}
            <div className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-[#1a6b3c] via-[#f5a623] to-[#1a6b3c] z-0" style={{top: '2.5rem'}} />

            {HOW_WE_WORK.map(({ n, icon: Icon, title, desc }, i) => (
              <div key={n} className="relative z-10 flex flex-col items-center text-center" data-reveal data-reveal-delay={String(i * 110)}>
                <div className="w-20 h-20 rounded-full bg-white border-2 border-[#1a6b3c] flex items-center justify-center mb-4 shadow-md relative">
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#f5a623] text-white text-xs font-extrabold flex items-center justify-center">{n}</span>
                  <Icon className="w-8 h-8 text-[#1a6b3c]" strokeWidth={1.6} />
                </div>
                <h3 className="font-bold text-[#0a1628] mb-2">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── OPERACIÓN EN TERRENO (galería) ───────────────────────────────────── */}
      <section className="py-20 bg-slate-50 border-y border-slate-100" data-analytics-section="operacion">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-10" data-reveal>
            <div className="flex items-center gap-2 mb-3">
              <span className="h-px w-6 bg-[#f5a623]" />
              <span className="text-xs font-bold text-[#f5a623] uppercase tracking-widest">En terreno</span>
            </div>
            <h2 className="text-3xl font-extrabold text-[#0a1628] leading-tight">
              Abastecemos tu operación donde la necesites
            </h2>
            <p className="mt-3 text-slate-600 leading-relaxed">
              Desde maquinaria en faena hasta flotas y estanques en planta: despachamos petróleo
              con equipo propio y protocolos de seguridad en cada carga.
            </p>
          </div>

          {/* 3 imágenes verticales */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5" data-reveal>
            {[
              {
                src: "/images/operacion-carga-maquinaria.webp",
                alt: "Operario de Fenice SPA cargando petróleo diesel directamente al estanque de una maquinaria",
                cap: "Carga directa a maquinaria",
              },
              {
                src: "/images/operacion-faena-excavadora.webp",
                alt: "Trabajador de Fenice SPA abasteciendo de combustible una excavadora en faena",
                cap: "Abastecimiento en faena",
              },
              {
                src: "/images/operacion-despacho-flota.webp",
                alt: "Operario de Fenice SPA despachando combustible desde un camión estanque a un estanque de empresa",
                cap: "Despacho a flotas y estanques",
              },
            ].map((im) => (
              <figure key={im.src} className="group relative overflow-hidden rounded-2xl shadow-sm ring-1 ring-slate-900/5">
                <div className="relative aspect-[4/5]">
                  <Image
                    src={im.src}
                    alt={im.alt}
                    fill
                    sizes="(min-width: 640px) 33vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628]/80 via-[#0a1628]/10 to-transparent" />
                </div>
                <figcaption className="absolute inset-x-0 bottom-0 flex items-center gap-2 p-4 text-white">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#f5a623] shrink-0" />
                  <span className="text-sm font-semibold leading-tight">{im.cap}</span>
                </figcaption>
              </figure>
            ))}
          </div>

          {/* Imagen horizontal (flota / planta) */}
          <figure className="group relative mt-4 sm:mt-5 overflow-hidden rounded-2xl shadow-sm ring-1 ring-slate-900/5" data-reveal>
            <div className="relative aspect-[16/10] sm:aspect-[21/9]">
              <Image
                src="/images/operacion-central.webp"
                alt="Camión estanque de Fenice SPA cargando combustible en planta, con la cordillera de Santiago al fondo"
                fill
                sizes="100vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0a1628]/85 via-[#0a1628]/35 to-transparent" />
            </div>
            <figcaption className="absolute inset-y-0 left-0 flex max-w-md flex-col justify-center gap-2 p-6 sm:p-10 text-white">
              <span className="text-xs font-bold uppercase tracking-widest text-[#f5a623]">Flota propia</span>
              <p className="text-xl sm:text-2xl font-extrabold leading-tight">
                Camiones estanque con certificación TC10A
              </p>
              <p className="text-sm text-slate-200">Carga controlada y trazabilidad en cada despacho.</p>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* ── COMPROMISO CON LA SEGURIDAD ──────────────────────────────────────── */}
      <section className="py-16 bg-white" data-analytics-section="seguridad">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div data-reveal="left">
              <p className="text-xs font-bold text-[#f5a623] uppercase tracking-widest mb-3">Seguridad</p>
              <h2 className="text-3xl font-extrabold text-[#0a1628] mb-4 leading-tight">
                Compromiso con<br />la seguridad
              </h2>
              <div className="w-12 h-1 bg-[#f5a623] rounded-full mb-5" />
              <p className="text-slate-600 leading-relaxed mb-6">
                Nuestra operación prioriza procedimientos, control de flota, planificación
                y estándares de trabajo orientados a una operación segura y confiable.
                Cumplimos toda la normativa SEC exigida para el transporte e instalación
                de combustibles en Chile.
              </p>
              <Link href="/nosotros" data-analytics-id="home_seguridad_mas_info" data-analytics-label="Conocer más" data-analytics-cta="secondary_navigation" className="inline-flex items-center gap-2 bg-[#0a1628] hover:bg-[#0d2040] text-white font-semibold px-6 py-3 rounded-xl text-sm transition-colors">
                Conocer más <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {SECURITY_ITEMS.map(({ icon: Icon, label }, i) => (
                <div key={label} data-reveal data-reveal-delay={String(i * 80)} className="flex flex-col items-center gap-3 bg-slate-50 border border-slate-200 hover:border-[#1a6b3c]/30 rounded-2xl p-6 text-center transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-[#1a6b3c]/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-[#1a6b3c]" strokeWidth={1.8} />
                  </div>
                  <span className="text-sm font-semibold text-[#0a1628] leading-tight">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CERTIFICACIONES Y CUMPLIMIENTO NORMATIVO ─────────────────────────── */}
      <Certificaciones />

      {/* ── COBERTURA ────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-[#0a1628]" data-analytics-section="cobertura">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-px w-8 bg-[#f5a623]" />
                <p className="text-xs font-bold text-[#f5a623] uppercase tracking-widest">Cobertura</p>
              </div>
              <h2 className="text-3xl font-extrabold text-white">Despacho en toda la Región Metropolitana</h2>
            </div>
            <Link href="/cobertura" data-analytics-id="home_ver_cobertura" data-analytics-label="Ver todas las zonas" data-analytics-cta="secondary_navigation" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#f5a623] hover:text-[#d4891a] whitespace-nowrap transition-colors">
              Ver todas las zonas <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3" data-reveal>
            {COMUNAS_DESTACADAS.map((c) => (
              <Link
                key={c.slug}
                href={`/cobertura/petroleo-a-domicilio-${c.slug}`}
                data-analytics-id={`home_cobertura_${c.slug}`}
                data-analytics-label={c.nombre}
                data-analytics-cta="coverage_navigation"
                className="group flex items-center justify-between bg-white/5 hover:bg-[#1a6b3c]/20 border border-white/10 hover:border-[#1a6b3c]/40 rounded-xl px-4 py-3 transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-3.5 h-3.5 text-[#f5a623] shrink-0" />
                  <span className="text-sm font-medium text-slate-300 group-hover:text-white">{c.nombre}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-[#f5a623] transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-slate-50" data-analytics-section="faq">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-px w-12 bg-[#f5a623]" />
              <p className="text-xs font-bold text-[#f5a623] uppercase tracking-widest">Preguntas frecuentes</p>
              <div className="h-px w-12 bg-[#f5a623]" />
            </div>
          </div>
          <div className="space-y-3">
            {faqItems.map((item, i) => (
              <details key={i} data-reveal data-reveal-delay={String(i * 60)} className="group bg-white border border-slate-200 hover:border-[#1a6b3c]/30 rounded-2xl overflow-hidden transition-colors">
                <summary className="flex items-center justify-between px-6 py-5 cursor-pointer list-none select-none">
                  <span className="font-bold text-[#0a1628] text-sm pr-4">{item.q}</span>
                  <ChevronRight className="w-4 h-4 text-[#f5a623] shrink-0 group-open:rotate-90 transition-transform" />
                </summary>
                <p className="px-6 pb-5 text-sm text-slate-500 leading-relaxed border-t border-slate-100 pt-4">{item.a}</p>
              </details>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/preguntas-frecuentes" data-analytics-id="home_ver_faq" data-analytics-label="Ver todas las preguntas" data-analytics-cta="secondary_navigation" className="inline-flex items-center gap-1.5 text-sm font-bold text-[#1a6b3c] hover:text-[#0d4a28] transition-colors">
              Ver todas las preguntas <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ────────────────────────────────────────────────────────── */}
      <section className="py-16 bg-gradient-to-br from-[#0a1628] via-[#0d2040] to-[#0a1628] relative overflow-hidden" data-analytics-section="contacto">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#1a6b3c] via-[#f5a623] to-[#1a6b3c]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-extrabold text-white mb-4 leading-tight">
                Impulsamos tu operación<br />
                <span className="text-[#f5a623]">con un servicio confiable</span>
              </h2>
              <p className="text-slate-400 leading-relaxed">
                Solicita una propuesta y conoce cómo Fenice SPA puede apoyar el transporte
                y abastecimiento de combustible de tu empresa.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-4 lg:justify-end">
              <Link
                href="/cotizacion"
                data-analytics-id="home_final_cotizacion"
                data-analytics-label="Solicitar cotización"
                data-analytics-cta="quote"
                className="inline-flex items-center justify-center gap-2 bg-[#f5a623] hover:bg-[#d4891a] text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg shadow-[#f5a623]/20 text-sm"
              >
                Solicitar cotización <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href={WA_URL}
                target="_blank"
                rel="noopener noreferrer"
                data-analytics-id="home_final_whatsapp"
                data-analytics-label="Hablar con un asesor"
                data-analytics-cta="whatsapp"
                className="inline-flex items-center justify-center gap-2.5 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold px-8 py-4 rounded-xl transition-all text-sm"
              >
                {WA_ICON}
                Hablar con un asesor
              </a>
            </div>
          </div>

          {/* Contact strip */}
          <div className="mt-12 pt-8 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: MapPin, label: "Sitio web", value: "www.fenice.cl" },
              { icon: FileText, label: "Correo corporativo", value: SITE_CONFIG.email },
              { icon: Phone, label: "Atención comercial", value: SITE_CONFIG.telefono },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3 text-slate-300">
                <div className="w-10 h-10 rounded-xl bg-white/8 border border-white/10 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-[#f5a623]" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">{label}</p>
                  <p className="text-sm font-semibold">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
