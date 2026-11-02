import Link from "next/link";
import Image from "next/image";
import PreciosCombustible from "@/components/PreciosCombustible";
import FuelGauge from "@/components/FuelGauge";
import Certificaciones from "@/components/Certificaciones";
import ClientesShowcase from "@/components/ClientesShowcase";
import LatestArticles from "@/components/blog/LatestArticles";
import QuickLeadForm from "@/components/QuickLeadForm";
import GeneratorToolLink from "@/components/GeneratorToolLink";
import VideoReels from "@/components/reels/VideoReels";
import CollaboratorsSection from "@/components/colaboradores/CollaboratorsSection";
import HomeMotion from "@/components/home/HomeMotion";
import {
  Truck, ArrowRight, ArrowUpRight, Phone, CheckCircle2,
  MapPin, Clock, Building2, ShieldCheck, FileText,
  ChevronRight, Users, Award, Clipboard, Plus,
  Route, Shield, BarChart3, HeadphonesIcon, Container,
  Construction, Zap, Flame, Mail, Globe,
} from "lucide-react";
import { COMUNAS_DESTACADAS, SITE_CONFIG } from "@/lib/config";
import { CORPORATE_STATS } from "@/config/stats";
import { buildMetadata, faqSchema, jsonLd, CORE_KEYWORDS } from "@/lib/seo";
import { BLUR } from "@/lib/imageBlur";

export const revalidate = 60;

export const metadata = buildMetadata({
  title: "Petróleo a Domicilio para Empresas en Santiago | Fenice",
  titleAbsolute: true,
  description:
    "Despacho de diésel y kerosene para empresas, faenas, edificios y generadores en Santiago y la RM. Cotiza por WhatsApp con factura electrónica.",
  path: "/",
  keywords: CORE_KEYWORDS,
});

const faqItems = [
  { q: "¿Hacen despacho de petróleo a domicilio en Santiago?", a: "Sí. Realizamos despacho de petróleo diésel y parafina (kerosene) a domicilio en toda la Región Metropolitana para empresas e instituciones, con despachos programados o urgentes previa coordinación." },
  { q: "¿Cuál es la cantidad mínima de combustible?", a: "La compra mínima es de 50 litros. Puedes programar abastecimientos semanales o mensuales, o solicitar despachos puntuales según tu operación." },
  { q: "¿En qué comunas trabajan?", a: "Cubrimos las 52 comunas de la Región Metropolitana —incluyendo Santiago, Lampa, Colina, Buin, Melipilla, Curacaví y Talagante— además de Valparaíso, Los Andes, Rancagua y Santa Cruz." },
  { q: "¿Despachan combustible para generadores y calderas?", a: "Sí, son servicios prioritarios: abastecemos generadores eléctricos y calderas de edificios, condominios, clínicas, hoteles e industrias, con despachos programados o urgentes previa coordinación." },
  { q: "¿Qué formas de pago aceptan?", a: "Transferencia bancaria, tarjetas de débito, tarjetas de crédito y cheque previa evaluación. Emitimos factura electrónica por cada despacho. Los precios se confirman antes de cada entrega según el mercado." },
  { q: "¿Cómo cotizo el precio del petróleo?", a: "Por WhatsApp al +56 9 3957 9658, mediante el formulario de cotización o al correo notifica@fenice.cl. Confirmamos precio y disponibilidad dentro del horario Lun-Vie 09:00–19:00." },
];

const homeFaqSchema = faqSchema(faqItems);

const STATS = [
  { value: "52", label: "Comunas RM", icon: MapPin },
  { value: "L–V", label: "09:00–19:00", icon: Clock },
  { value: "B2B", label: "Especialistas", icon: Building2 },
  { value: "SEC", label: "Normativa", icon: Award },
];

const TRUST_BADGES = [
  "Despacho toda la RM",
  "Factura electrónica",
  "Instalaciones DS 160",
  "Coordinación directa",
];

// Señales de confianza (E-E-A-T) en texto real e indexable, mostradas como cinta bajo el hero.
const SIGNALS = [
  { icon: MapPin, value: "52 comunas", label: "Cobertura total en la RM" },
  { icon: Clock, value: "Lun–Vie", label: "Atención 09:00–19:00" },
  { icon: ShieldCheck, value: "Normativa SEC", label: "Operación documentada" },
  { icon: Truck, value: "Flota propia", label: "Despacho especializado" },
  { icon: FileText, value: "Factura electrónica", label: "Para empresas" },
  { icon: Phone, value: "Trato directo", label: "Sin call centers" },
];

const SERVICIOS_HOME = [
  {
    icon: Truck,
    title: "Petróleo diesel a domicilio",
    desc: "Despacho de diésel y parafina (kerosene) para empresas e instituciones en toda la RM.",
    href: "/petroleo-a-domicilio",
  },
  {
    icon: Construction,
    title: "Combustible para maquinaria pesada",
    desc: "Carga directa en faena a excavadoras, cargadores y equipos de movimiento de tierra.",
    href: "/servicios/combustible-para-maquinaria-pesada",
  },
  {
    icon: Zap,
    title: "Combustible para generadores",
    desc: "Abastecimiento programado o urgente para generadores de edificios, clínicas e industrias.",
    href: "/servicios/combustible-para-generadores-electricos",
  },
  {
    icon: Flame,
    title: "Combustible para calderas",
    desc: "Suministro para calderas de edificios, condominios, hoteles y procesos térmicos.",
    href: "/servicios/combustible-para-calderas",
  },
  {
    icon: Container,
    title: "Instalación de estanques",
    desc: "Diseño, instalación, mantención y declaración TC4 cuando corresponde.",
    href: "/servicios/instalacion-de-estanques",
  },
  {
    icon: Building2,
    title: "Abastecimiento a empresas",
    desc: "Despachos programados semanales o mensuales para industrias, flotas y faenas.",
    href: "/empresas-faenas-flotas",
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
  "Movimiento de tierra y construcción",
  "Generadores eléctricos",
  "Calderas y calefacción central",
  "Edificios y condominios",
  "Clínicas y centros de salud",
  "Agroindustria y faenas mineras",
];

const OPERACION_IMAGES = [
  {
    src: "/images/operacion-carga-maquinaria.webp",
    alt: "Operario de Fenice SPA cargando petróleo diésel directamente al estanque de una maquinaria",
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
];

// Nodos del mapa decorativo "Red de abastecimiento" del hero (viewBox 360×190).
const NETWORK_ORIGIN = { x: 58, y: 100 };
const NETWORK_NODES = [
  { id: "faenas", label: "Faenas", x: 300, y: 30 },
  { id: "generadores", label: "Generadores", x: 190, y: 36 },
  { id: "edificios", label: "Edificios", x: 316, y: 104 },
  { id: "industria", label: "Industria", x: 270, y: 166 },
];

const WA_URL = `https://wa.me/${SITE_CONFIG.whatsapp_numero}?text=${encodeURIComponent("Hola, quiero cotizar petróleo a domicilio para mi empresa.")}`;
const WA_ICON = (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current shrink-0" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.531 5.856L0 24l6.335-1.509A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.81 9.81 0 01-5.003-1.371l-.359-.214-3.754.894.954-3.652-.234-.374A9.785 9.785 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z" />
  </svg>
);

/** Encabezado de sección: índice + rótulo ("02 — Servicios"). */
function SectionLabel({ index, children, dark = false, center = false }: {
  index: string;
  children: React.ReactNode;
  dark?: boolean;
  center?: boolean;
}) {
  return (
    <div className={`flex items-center gap-3 mb-5 ${center ? "justify-center" : ""}`}>
      <span className="font-mono text-[11px] font-semibold text-[#f5a623]">{index}</span>
      <span className={`h-px w-10 ${dark ? "bg-white/25" : "bg-[#0a1628]/20"}`} />
      <span className={`text-[11px] font-bold uppercase tracking-[0.22em] ${dark ? "text-slate-300" : "text-slate-500"}`}>{children}</span>
    </div>
  );
}

function SupplyNetwork() {
  return (
    <svg viewBox="0 0 360 190" className="w-full h-auto" aria-hidden="true" focusable="false">
      <defs>
        <pattern id="net-dots" width="14" height="14" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="1" fill="rgba(255,255,255,0.09)" />
        </pattern>
        <radialGradient id="net-glow">
          <stop offset="0%" stopColor="#f5a623" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#f5a623" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="360" height="190" fill="url(#net-dots)" />
      {NETWORK_NODES.map((n, i) => {
        const mx = (NETWORK_ORIGIN.x + n.x) / 2;
        const d = `M ${NETWORK_ORIGIN.x} ${NETWORK_ORIGIN.y} C ${mx} ${NETWORK_ORIGIN.y}, ${mx} ${n.y}, ${n.x} ${n.y}`;
        return (
          <g key={n.id}>
            <path d={d} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
            <path id={`net-${n.id}`} d={d} fill="none" stroke="#1a6b3c" strokeWidth="1.5" className="home-flow" />
            <circle r="3" fill="#f5a623" className="home-network-pulse">
              <animateMotion dur={`${2.6 + i * 0.5}s`} repeatCount="indefinite" begin={`${i * 0.4}s`}>
                <mpath href={`#net-${n.id}`} />
              </animateMotion>
            </circle>
            <circle cx={n.x} cy={n.y} r="9" fill="rgba(26,107,60,0.25)" />
            <circle cx={n.x} cy={n.y} r="4" fill="#fff" />
            <text x={n.x} y={n.y + 22} textAnchor="middle" fontSize="10" fontWeight="600" fill="rgba(226,232,240,0.85)">{n.label}</text>
          </g>
        );
      })}
      <circle cx={NETWORK_ORIGIN.x} cy={NETWORK_ORIGIN.y} r="30" fill="url(#net-glow)" />
      <circle cx={NETWORK_ORIGIN.x} cy={NETWORK_ORIGIN.y} r="11" fill="#f5a623" />
      <circle cx={NETWORK_ORIGIN.x} cy={NETWORK_ORIGIN.y} r="4" fill="#0a1628" />
      <text x={NETWORK_ORIGIN.x} y={NETWORK_ORIGIN.y + 30} textAnchor="middle" fontSize="10" fontWeight="700" fill="#f5a623">Fenice</text>
    </svg>
  );
}

export default function HomePage() {
  const [featured, ...restServices] = SERVICIOS_HOME;
  const FeaturedIcon = featured.icon;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(homeFaqSchema)} />
      <HomeMotion />

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section
        className="home-hero relative isolate overflow-hidden bg-[#060e1a] text-white"
        data-analytics-section="hero"
        data-progress="exit"
      >
        {/* Fotografía completa y centrada detrás del contenido en todos los tamaños. */}
        <div className="absolute inset-0 -z-20 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <Image
              src="/images/portada-fenice-santiago.webp"
              alt="Camión de despacho de petróleo a domicilio de Fenice SPA en Santiago, con la cordillera de fondo"
              width={1600}
              height={900}
              priority
              fetchPriority="high"
              // Ya es un webp liviano y pre-optimizado: se sirve DIRECTO (sin el
              // optimizador `/_next/image`), para que Cloudflare lo cachee y no
              // dependa de un round-trip lento del origen en la imagen LCP.
              unoptimized
              sizes="100vw"
              placeholder="blur"
              blurDataURL={BLUR["portada-fenice"]}
              className="h-auto w-auto max-h-full max-w-full"
              style={{
                maskImage: "linear-gradient(to right, transparent, #000 8%, #000 92%, transparent), linear-gradient(to bottom, transparent, #000 8%, #000 92%, transparent)",
                maskComposite: "intersect",
              }}
            />
          </div>
        </div>

        {/* Overlays de contraste */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#060e1a] from-40% via-[#060e1a]/40 via-60% to-[#060e1a]/10 sm:hidden" />
        <div className="absolute inset-0 -z-10 hidden sm:block bg-gradient-to-r from-[#060e1a] via-[#060e1a]/80 via-45% to-[#060e1a]/10" />
        <div className="absolute inset-x-0 bottom-0 h-48 -z-10 bg-gradient-to-t from-[#060e1a] to-transparent" />
        <div className="absolute inset-0 -z-10 home-grid-bg opacity-70" />
        <div className="absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-[#1a6b3c]/25 blur-[120px] -z-10" />

        <div className="home-hero__content relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-12 xl:gap-16 items-center min-h-[calc(100svh-4rem)] lg:min-h-[min(880px,calc(100svh-106px))] pt-12 pb-28 sm:pt-20 sm:pb-36 lg:pt-14 lg:pb-28">

            <div>
              <div className="hero-rise inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.06] pl-1.5 pr-4 py-1.5 mb-7 backdrop-blur-md">
                <span className="rounded-full bg-[#f5a623] px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-[#0a1628]">B2B</span>
                <span className="text-[11px] sm:text-xs font-semibold text-slate-200 tracking-wide">Distribución industrial · Región Metropolitana</span>
              </div>

              <h1 className="text-[2.15rem] leading-[1.06] sm:text-6xl lg:text-[3.3rem] xl:text-[3.85rem] font-extrabold tracking-[-0.035em] mb-6">
                <span className="home-line"><span style={{ "--i": 0 } as React.CSSProperties}>Petróleo a Domicilio</span></span>
                <span className="home-line"><span style={{ "--i": 1 } as React.CSSProperties}>en <span className="home-gradient-text">Santiago</span> para</span></span>
                <span className="home-line"><span style={{ "--i": 2 } as React.CSSProperties} className="home-gradient-text">Empresas e Industrias</span></span>
              </h1>

              <p className="hero-rise-2 text-[15px] sm:text-[17px] text-slate-300 leading-relaxed mb-9 max-w-xl">
                Combustible confiable para mantener su operación en movimiento: despachamos
                petróleo diésel y parafina (kerosene) directamente en empresas, faenas, edificios y
                centros de operación de la Región Metropolitana, Valparaíso y O&apos;Higgins.
                Despachos programados, precios actualizados y comunicación directa.
              </p>

              <div className="hero-rise-3 flex flex-col sm:flex-row gap-3 mb-10">
                <Link href="/cotizacion" data-analytics-id="hero_cotizar" data-analytics-label="Solicitar cotización" data-analytics-cta="quote" className="home-btn-shine group inline-flex items-center justify-center gap-2 bg-[#f5a623] hover:bg-[#ffb83d] text-[#0a1628] font-bold px-7 py-4 rounded-2xl transition-colors shadow-[0_18px_40px_-12px_rgba(245,166,35,0.7)] text-sm">
                  Solicitar cotización <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <a href={WA_URL} target="_blank" rel="noopener noreferrer" data-analytics-id="hero_whatsapp" data-analytics-label="Cotizar por WhatsApp" data-analytics-cta="whatsapp" className="inline-flex items-center justify-center gap-2.5 bg-white/[0.07] hover:bg-white/[0.14] border border-white/20 text-white font-semibold px-7 py-4 rounded-2xl transition-colors text-sm backdrop-blur-md">
                  {WA_ICON} Cotizar por WhatsApp
                </a>
              </div>

              <ul className="hero-rise-3 flex flex-wrap gap-x-6 gap-y-3 text-[13px] text-slate-300">
                {[
                  { icon: Truck, label: "Flota especializada" },
                  { icon: MapPin, label: "Cobertura operativa" },
                  { icon: ShieldCheck, label: "Seguridad y trazabilidad" },
                ].map(({ icon: Icon, label }) => (
                  <li key={label} className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-[#f5a623]" strokeWidth={2} />
                    {label}
                  </li>
                ))}
              </ul>
            </div>

            {/* Panel de operación — solo desktop */}
            <div className="hidden lg:block" data-parallax="-0.06">
              <div className="hero-rise-3 home-glass rounded-[28px] p-7">
                <div className="flex items-center justify-between mb-5">
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-300">Cobertura operativa</p>
                  <span className="inline-flex items-center gap-2 rounded-full bg-[#1a6b3c]/25 border border-[#1a6b3c]/40 px-3 py-1 text-[11px] font-semibold text-emerald-200">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                    </span>
                    Operativo L–V
                  </span>
                </div>

                <div className="rounded-2xl border border-white/10 bg-[#060e1a]/50 p-3 mb-5">
                  <SupplyNetwork />
                </div>

                <div className="grid grid-cols-4 gap-2 mb-5">
                  {STATS.map(({ value, label, icon: Icon }) => (
                    <div key={label} className="rounded-xl border border-white/10 bg-white/[0.05] px-2 py-3 text-center">
                      <Icon className="w-3.5 h-3.5 text-[#f5a623] mx-auto mb-1.5" />
                      <p className="text-lg font-extrabold leading-none">{value}</p>
                      <p className="mt-1 text-[10px] text-slate-400 leading-tight">{label}</p>
                    </div>
                  ))}
                </div>

                <p className="mb-2.5 text-[11px] font-semibold text-slate-400">Sectores que atendemos</p>
                <div className="flex flex-wrap gap-1.5">
                  {SECTORES.map((s) => (
                    <span key={s} className="rounded-full border border-white/12 bg-white/[0.04] px-2.5 py-1 text-[11px] text-slate-200">{s}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cinta de señales de confianza */}
        <div className="home-signals relative border-t border-white/10 bg-[#060e1a]/60 backdrop-blur-md" aria-label="Por qué elegir a Fenice SPA para despacho de combustible en la Región Metropolitana">
          <div className="relative overflow-hidden py-4">
            <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#060e1a] to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#060e1a] to-transparent z-10 pointer-events-none" />
            <ul className="logo-marquee items-center gap-12 px-6">
              {[...SIGNALS, ...SIGNALS].map(({ icon: Icon, value, label }, i) => (
                <li key={`${value}-${i}`} className="flex items-center gap-3 shrink-0" aria-hidden={i >= SIGNALS.length}>
                  <Icon className="w-4 h-4 text-[#f5a623]" />
                  <span className="text-sm font-bold text-white whitespace-nowrap">{value}</span>
                  <span className="text-xs text-slate-400 whitespace-nowrap">{label}</span>
                  <span className="ml-9 h-1 w-1 rounded-full bg-white/25" />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── INDICADORES ──────────────────────────────────────────────────────── */}
      <section className="relative bg-[#060e1a] text-white border-b border-white/5" data-analytics-section="indicadores" aria-label="Fenice SPA en cifras">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-16 sm:py-20">
          <dl className="grid grid-cols-2 lg:grid-cols-5 gap-y-10">
            {CORPORATE_STATS.map((s, i) => (
              <div
                key={s.key}
                data-reveal
                data-reveal-delay={String(i * 90)}
                className={`flex flex-col px-4 sm:px-6 ${s.full ? "col-span-2 lg:col-span-1" : ""} ${i > 0 ? "lg:border-l lg:border-white/10" : ""}`}
              >
                <dt className="order-2 mt-2 text-xs sm:text-sm text-slate-400">{s.label}</dt>
                <dd className="text-4xl sm:text-5xl font-extrabold tracking-tight tabular-nums">
                  <span className="sr-only">{s.display}</span>
                  <span aria-hidden="true" data-count={s.value} data-suffix={s.suffix} className={i % 2 === 0 ? "home-gradient-text" : "text-white"}>{s.display}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── SOLICITUD RÁPIDA ─────────────────────────────────────────────────── */}
      <section className="relative py-20 sm:py-24 bg-slate-50 overflow-hidden" data-analytics-section="solicitud_rapida">
        <div className="absolute inset-0 home-grid-bg home-grid-bg--light" />
        <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 grid lg:grid-cols-[0.9fr_1.1fr] gap-12 items-center">
          <div data-reveal="left">
            <SectionLabel index="01">Cotización rápida</SectionLabel>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0a1628] mb-4 leading-[1.1]">¿Necesitas precio y disponibilidad?</h2>
            <p className="text-slate-600 leading-relaxed mb-8">Indica tu comuna y el combustible que necesitas. Te contactamos para confirmar litros, acceso y fecha de despacho. Atención de lunes a viernes, de 09:00 a 19:00.</p>
            <ol className="space-y-4 mb-8">
              {["Envías tu comuna y servicio", "Confirmamos precio, litros y acceso", "Programamos el despacho"].map((step, i) => (
                <li key={step} className="flex items-center gap-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white border border-slate-200 font-mono text-xs font-bold text-[#1a6b3c] shadow-sm">0{i + 1}</span>
                  <span className="text-sm font-semibold text-[#0a1628]">{step}</span>
                </li>
              ))}
            </ol>
            <div className="flex flex-col gap-2 text-sm">
              <Link href="/cotizacion" className="inline-flex items-center gap-1.5 font-bold text-[#1a6b3c] hover:text-[#0d4a28]">Cotizar con el detalle completo <ArrowRight className="w-4 h-4" /></Link>
              <p className="text-slate-600"><strong>Parafina (kerosene) a domicilio:</strong> consulta despachos en Santiago, Maipú, Puente Alto y la RM.{" "}
                <Link href="/venta-kerosene" data-analytics-id="home_parafina" data-analytics-cta="service_navigation" className="font-bold text-[#1a6b3c] hover:text-[#0d4a28] whitespace-nowrap">Consultar parafina a domicilio →</Link>
              </p>
            </div>
          </div>
          <div data-reveal="right" className="relative">
            <div className="absolute -inset-4 rounded-[32px] bg-gradient-to-br from-[#1a6b3c]/15 via-transparent to-[#f5a623]/20 blur-2xl" />
            <div className="relative rounded-3xl bg-white p-1.5 shadow-[0_40px_80px_-30px_rgba(10,22,40,0.35)] ring-1 ring-slate-900/5">
              <QuickLeadForm />
            </div>
          </div>
        </div>
      </section>

      {/* ── COLABORADORES (carrusel de logos, editable en /admin/colaboradores) ── */}
      <CollaboratorsSection />

      {/* ── EMPRESAS QUE CONFÍAN (logos, editable en /admin/clientes) ────────── */}
      <ClientesShowcase />

      {/* ── PRECIOS DE COMBUSTIBLE Y PRODUCTOS ───────────────────────────────── */}
      <PreciosCombustible />

      {/* ── QUIÉNES SOMOS ────────────────────────────────────────────────────── */}
      <section className="py-24 lg:py-32 bg-white overflow-hidden" data-analytics-section="nosotros">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
            <div className="relative flex items-center justify-center order-2 lg:order-1" data-reveal="zoom">
              <div className="absolute inset-8 rounded-full bg-gradient-to-tr from-[#1a6b3c]/15 to-[#f5a623]/20 blur-3xl" />
              <div className="relative w-full max-w-sm" data-parallax="-0.05">
                <div className="bg-white border border-slate-200/80 rounded-[28px] p-8 shadow-[0_40px_90px_-40px_rgba(10,22,40,0.45)]">
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-2 h-2 rounded-full bg-[#1a6b3c] animate-pulse" />
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Monitor de abastecimiento</span>
                  </div>
                  <FuelGauge />
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2" data-reveal="right">
              <SectionLabel index="02">Quiénes somos</SectionLabel>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#0a1628] mb-6 leading-[1.08]">
                Fenice SPA: logística de combustible para <span className="text-[#1a6b3c]">operaciones que no se detienen</span>
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed mb-4">
                Fenice SPA es una empresa orientada a la logística y transporte de combustible,
                enfocada en entregar un servicio profesional, seguro y eficiente para empresas
                que requieren continuidad operacional y abastecimiento confiable.
              </p>
              <p className="text-slate-600 leading-relaxed mb-8">
                Operamos con flota especializada y cumplimiento normativo SEC en toda la
                Región Metropolitana, con cobertura adicional en Valparaíso y Rancagua.
              </p>
              <div className="grid sm:grid-cols-2 gap-3 mb-8">
                {TRUST_BADGES.map((t) => (
                  <span key={t} className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-[#1a6b3c] shrink-0" />
                    {t}
                  </span>
                ))}
              </div>
              <Link href="/nosotros" data-analytics-id="home_nosotros" data-analytics-label="Conocer más sobre nosotros" data-analytics-cta="secondary_navigation" className="group inline-flex items-center gap-2 text-sm font-bold text-[#1a6b3c] hover:text-[#0d4a28] transition-colors">
                Conocer más sobre nosotros <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── NUESTROS SERVICIOS (bento) ───────────────────────────────────────── */}
      <section className="relative py-24 lg:py-32 bg-[#060e1a] text-white overflow-hidden" data-analytics-section="servicios">
        <div className="absolute inset-0 home-grid-bg opacity-60" />
        <div className="absolute right-[-10%] top-[-10%] h-[600px] w-[600px] rounded-full bg-[#f5a623]/10 blur-[140px]" />
        <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 items-end mb-14" data-reveal>
            <div>
              <SectionLabel index="03" dark>Nuestros servicios</SectionLabel>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-[1.08]">
                Combustible y soluciones para <span className="home-gradient-text">cada operación</span>
              </h2>
            </div>
            <div className="lg:justify-self-end lg:max-w-md">
              <p className="text-slate-400 leading-relaxed mb-4">
                Desde un despacho puntual hasta contratos de abastecimiento programado: diésel,
                parafina y estanques con la documentación que exige tu operación.
              </p>
              <Link href="/petroleo-a-domicilio" data-analytics-id="home_ver_servicios" data-analytics-label="Ver todos los servicios" data-analytics-cta="service_navigation" className="group inline-flex items-center gap-2 text-sm font-semibold text-[#f5a623] hover:text-[#ffb83d] transition-colors">
                Ver todos los servicios <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Destacado con fotografía */}
            <Link
              href={featured.href}
              data-reveal
              data-spotlight
              data-analytics-id={`home_service_${featured.title.toLowerCase().replaceAll(" ", "_").replaceAll("/", "_")}`}
              data-analytics-label={featured.title}
              data-analytics-cta="service_card"
              className="home-card group relative sm:col-span-2 min-h-[340px] overflow-hidden rounded-3xl border border-white/10 p-7 sm:p-9 flex flex-col justify-end"
            >
              <Image
                src="/images/operacion-central.webp"
                alt=""
                fill
                sizes="(min-width: 1024px) 66vw, 100vw"
                placeholder="blur"
                blurDataURL={BLUR["operacion-central"]}
                className="object-cover -z-20 transition-transform duration-[1.2s] ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#060e1a] via-[#060e1a]/60 to-[#060e1a]/10" />
              <span className="absolute right-7 top-7 font-mono text-xs text-white/50">01</span>
              <div className="w-12 h-12 rounded-2xl bg-[#f5a623] text-[#0a1628] flex items-center justify-center mb-5">
                <FeaturedIcon className="w-6 h-6" strokeWidth={2} />
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold mb-2 tracking-tight">{featured.title}</h3>
              <p className="text-slate-300 max-w-lg mb-5">{featured.desc}</p>
              <span className="inline-flex items-center gap-2 text-sm font-bold text-[#f5a623]">
                Ver servicio <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </Link>

            {restServices.map(({ icon: Icon, title, desc, href }, i) => (
              <Link
                key={title}
                href={href}
                data-reveal
                data-reveal-delay={String((i + 1) * 80)}
                data-spotlight
                data-analytics-id={`home_service_${title.toLowerCase().replaceAll(" ", "_").replaceAll("/", "_")}`}
                data-analytics-label={title}
                data-analytics-cta="service_card"
                className={`home-card group flex flex-col rounded-3xl border border-white/10 bg-white/[0.03] hover:border-white/25 p-7 min-h-[260px] transition-colors ${i === 4 ? "lg:col-span-2" : ""}`}
              >
                <div className="flex items-start justify-between mb-10">
                  <div className="w-12 h-12 rounded-2xl bg-[#1a6b3c]/25 border border-[#1a6b3c]/40 flex items-center justify-center transition-colors group-hover:bg-[#1a6b3c]">
                    <Icon className="w-5 h-5 text-emerald-300 group-hover:text-white transition-colors" strokeWidth={1.8} />
                  </div>
                  <span className="font-mono text-xs text-white/30">0{i + 2}</span>
                </div>
                <h3 className="mt-auto text-lg font-bold mb-2 leading-tight">{title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed mb-5">{desc}</p>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-white/50 group-hover:text-[#f5a623] transition-colors">
                  Ver servicio <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </Link>
            ))}

            {/* Tarjeta de asesoría */}
            <a
              href={WA_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-reveal
              data-reveal-delay="480"
              data-analytics-id="home_service_asesor_whatsapp"
              data-analytics-label="Hablar con un asesor"
              data-analytics-cta="whatsapp"
              className="group flex flex-col justify-between rounded-3xl bg-gradient-to-br from-[#1a6b3c] to-[#0d4a28] p-7 min-h-[260px] shadow-[0_30px_60px_-30px_rgba(26,107,60,0.8)]"
            >
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-200">¿No sabes cuál necesitas?</p>
              <div>
                <p className="text-2xl font-extrabold leading-tight mb-5">Un asesor te orienta según tu operación.</p>
                <span className="inline-flex items-center gap-2 rounded-xl bg-white text-[#0a1628] px-4 py-2.5 text-sm font-bold">
                  {WA_ICON} Hablar por WhatsApp
                </span>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* ── ¿POR QUÉ ELEGIRNOS? ──────────────────────────────────────────────── */}
      <section className="py-24 lg:py-32 bg-white" data-analytics-section="beneficios">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-14" data-reveal>
            <SectionLabel index="04">¿Por qué elegirnos?</SectionLabel>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#0a1628] leading-[1.08]">
              Una operación diseñada para dar <span className="text-[#1a6b3c]">continuidad</span> a la tuya
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {WHY_US.map(({ icon: Icon, title, desc }, i) => (
              <div
                key={title}
                data-reveal
                data-reveal-delay={String(i * 90)}
                data-spotlight
                className="home-card home-card--light group relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-50/60 p-7 hover:border-[#1a6b3c]/30 hover:bg-white hover:shadow-[0_30px_60px_-35px_rgba(10,22,40,0.4)] transition-[background-color,border-color,box-shadow] duration-300"
              >
                <span className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-gradient-to-r from-[#1a6b3c] to-[#f5a623] transition-transform duration-500 group-hover:scale-x-100" />
                <span className="absolute right-5 top-3 text-[5.5rem] font-black leading-none text-[#0a1628]/[0.04] select-none" aria-hidden="true">{i + 1}</span>
                <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center mb-8 transition-colors group-hover:bg-[#1a6b3c] group-hover:border-[#1a6b3c]">
                  <Icon className="w-6 h-6 text-[#1a6b3c] group-hover:text-white transition-colors" strokeWidth={1.8} />
                </div>
                <h3 className="text-lg font-bold text-[#0a1628] mb-2">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ¿CÓMO TRABAJAMOS? (scroll guiado) ────────────────────────────────── */}
      <section className="py-24 lg:py-32 bg-slate-50 border-y border-slate-100" data-analytics-section="proceso">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-14 lg:gap-24">
          <div className="lg:sticky lg:top-36 self-start" data-reveal="left">
            <SectionLabel index="05">¿Cómo trabajamos?</SectionLabel>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#0a1628] leading-[1.08] mb-6">
              De la solicitud a la <span className="text-[#1a6b3c]">entrega segura</span>
            </h2>
            <p className="text-slate-600 leading-relaxed mb-8 max-w-md">
              Un proceso simple para ti y controlado de punta a punta para nosotros: cada despacho
              se coordina, se transporta y se entrega bajo estándares de seguridad.
            </p>
            <Link href="/cotizacion" className="home-btn-shine inline-flex items-center gap-2 bg-[#0a1628] hover:bg-[#13284a] text-white font-semibold px-6 py-3.5 rounded-2xl text-sm transition-colors">
              Iniciar una solicitud <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <ol className="relative" data-progress="center">
            <span className="absolute left-7 top-2 bottom-2 w-px bg-slate-200" aria-hidden="true" />
            <span className="home-rail-fill absolute left-7 top-2 bottom-2 w-px bg-gradient-to-b from-[#1a6b3c] to-[#f5a623]" aria-hidden="true" />
            {HOW_WE_WORK.map(({ n, icon: Icon, title, desc }) => (
              <li key={n} className="home-step relative flex gap-6 pb-14 last:pb-0" data-reveal>
                <div className="home-step__node relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border-2 border-slate-200 bg-white text-[#1a6b3c]">
                  <Icon className="w-6 h-6" strokeWidth={1.7} />
                </div>
                <div className="pt-1">
                  <p className="font-mono text-xs font-semibold text-[#f5a623] mb-1">Paso 0{n}</p>
                  <h3 className="text-xl font-bold text-[#0a1628] mb-2">{title}</h3>
                  <p className="text-slate-500 leading-relaxed">{desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── OPERACIÓN EN TERRENO (galería) ───────────────────────────────────── */}
      <section className="py-24 lg:py-32 bg-white" data-analytics-section="operacion">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-6 items-end mb-12" data-reveal>
            <div>
              <SectionLabel index="06">En terreno</SectionLabel>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#0a1628] leading-[1.08]">
                Abastecemos tu operación donde la necesites
              </h2>
            </div>
            <p className="text-slate-600 leading-relaxed lg:max-w-md lg:justify-self-end">
              Desde maquinaria en faena hasta flotas y estanques en planta: despachamos petróleo
              con equipo propio y protocolos de seguridad en cada carga.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
            {OPERACION_IMAGES.map((im, i) => (
              <figure key={im.src} className={`home-clip group relative overflow-hidden rounded-3xl ${i === 1 ? "sm:mt-12" : ""}`} data-progress>
                <div className="relative aspect-[4/5] overflow-hidden">
                  <div className="home-clip__img absolute inset-0">
                    <Image
                      src={im.src}
                      alt={im.alt}
                      fill
                      sizes="(min-width: 640px) 33vw, 100vw"
                      placeholder="blur"
                      blurDataURL={BLUR[im.src.replace("/images/", "").replace(".webp", "")]}
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#060e1a]/85 via-[#060e1a]/10 to-transparent" />
                </div>
                <figcaption className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 p-5 text-white">
                  <span className="text-base font-bold leading-tight">{im.cap}</span>
                  <span className="font-mono text-xs text-white/60">0{i + 1}</span>
                </figcaption>
              </figure>
            ))}
          </div>

          <figure className="home-clip--wide group relative mt-5 overflow-hidden rounded-3xl" data-progress>
            <div className="relative aspect-[4/5] sm:aspect-[21/9] overflow-hidden">
              <div className="absolute inset-[-10%_0]" data-parallax="-0.1">
                <Image
                  src="/images/operacion-central.webp"
                  alt="Camión estanque de Fenice SPA cargando combustible en planta, con la cordillera de Santiago al fondo"
                  fill
                  sizes="100vw"
                  placeholder="blur"
                  blurDataURL={BLUR["operacion-central"]}
                  className="object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-[#060e1a]/90 via-[#060e1a]/45 to-transparent" />
            </div>
            <figcaption className="absolute inset-x-0 bottom-0 sm:inset-y-0 sm:right-auto flex max-w-lg flex-col justify-end sm:justify-center gap-3 p-7 sm:p-12 text-white">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#f5a623]">Flota propia</span>
              <p className="text-2xl sm:text-4xl font-extrabold leading-tight tracking-tight">
                Camiones tanque con declaración TC10A y documentación vigente
              </p>
              <p className="text-sm sm:text-base text-slate-300">Carga controlada y trazabilidad en cada despacho.</p>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* ── VIDEOS CORTOS TIPO REEL ───────────────────────────────────────────── */}
      <VideoReels />

      {/* ── COMPROMISO CON LA SEGURIDAD ──────────────────────────────────────── */}
      <section className="relative py-24 lg:py-32 bg-[#0a1628] text-white overflow-hidden" data-analytics-section="seguridad">
        <div className="home-orb absolute -left-32 bottom-[-30%] h-[520px] w-[520px] rounded-full bg-[#1a6b3c]/30 blur-[130px]" />
        <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <div data-reveal="left">
              <SectionLabel index="07" dark>Seguridad</SectionLabel>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-6 leading-[1.08]">
                Compromiso con <span className="home-gradient-text">la seguridad</span>
              </h2>
              <p className="text-slate-300 text-lg leading-relaxed mb-8">
                Nuestra operación prioriza procedimientos, control de flota, planificación
                y estándares de trabajo orientados a una operación segura y confiable.
                Cumplimos toda la normativa SEC exigida para el transporte e instalación
                de combustibles en Chile.
              </p>
              <Link href="/nosotros" data-analytics-id="home_seguridad_mas_info" data-analytics-label="Conocer más" data-analytics-cta="secondary_navigation" className="home-btn-shine inline-flex items-center gap-2 bg-white text-[#0a1628] hover:bg-slate-100 font-bold px-6 py-3.5 rounded-2xl text-sm transition-colors">
                Conocer más <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {SECURITY_ITEMS.map(({ icon: Icon, label }, i) => (
                <div
                  key={label}
                  data-reveal
                  data-reveal-delay={String(i * 90)}
                  data-spotlight
                  className={`home-card home-glass flex flex-col gap-6 rounded-3xl p-6 sm:p-7 ${i % 2 === 1 ? "sm:mt-8 sm:-mb-8" : ""}`}
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#f5a623]/15 border border-[#f5a623]/30 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-[#f5a623]" strokeWidth={1.8} />
                  </div>
                  <span className="text-base sm:text-lg font-bold leading-tight">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CERTIFICACIONES Y CUMPLIMIENTO NORMATIVO ─────────────────────────── */}
      <Certificaciones />

      {/* ── COBERTURA ────────────────────────────────────────────────────────── */}
      <section className="relative py-24 lg:py-32 bg-[#060e1a] text-white overflow-hidden" data-analytics-section="cobertura">
        {/* Radar decorativo */}
        <div className="pointer-events-none absolute right-[-260px] top-1/2 h-[760px] w-[760px] -translate-y-1/2 opacity-70 lg:right-[-120px]" aria-hidden="true">
          {[1, 0.75, 0.5, 0.25].map((s) => (
            <div key={s} className="absolute inset-0 m-auto rounded-full border border-white/[0.07]" style={{ width: `${s * 100}%`, height: `${s * 100}%` }} />
          ))}
          <div className="home-radar-sweep absolute inset-0 rounded-full" style={{ background: "conic-gradient(from 0deg, rgba(26,107,60,0.45), transparent 22%)" }} />
          {[
            { t: "28%", l: "34%" }, { t: "62%", l: "24%" }, { t: "44%", l: "66%" }, { t: "74%", l: "58%" }, { t: "20%", l: "58%" },
          ].map((p, i) => (
            <span key={i} className="absolute flex h-2.5 w-2.5" style={{ top: p.t, left: p.l }}>
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#f5a623] opacity-60" style={{ animationDelay: `${i * 0.5}s` }} />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#f5a623]" />
            </span>
          ))}
        </div>

        <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12" data-reveal>
            <div className="max-w-2xl">
              <SectionLabel index="08" dark>Cobertura</SectionLabel>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-[1.08]">
                Despacho en toda la <span className="home-gradient-text">Región Metropolitana</span>
              </h2>
            </div>
            <Link href="/cobertura" data-analytics-id="home_ver_cobertura" data-analytics-label="Ver todas las zonas" data-analytics-cta="secondary_navigation" className="group inline-flex items-center gap-1.5 text-sm font-semibold text-[#f5a623] hover:text-[#ffb83d] whitespace-nowrap transition-colors">
              Ver todas las zonas <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 lg:max-w-4xl" data-reveal>
            {COMUNAS_DESTACADAS.map((c) => (
              <Link
                key={c.slug}
                href={`/cobertura/petroleo-a-domicilio-${c.slug}`}
                data-analytics-id={`home_cobertura_${c.slug}`}
                data-analytics-label={c.nombre}
                data-analytics-cta="coverage_navigation"
                className="group flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-sm px-4 py-3.5 transition-colors hover:border-[#1a6b3c]/60 hover:bg-[#1a6b3c]/20"
              >
                <span className="flex items-center gap-2.5 min-w-0">
                  <MapPin className="w-3.5 h-3.5 text-[#f5a623] shrink-0" />
                  <span className="text-sm font-medium text-slate-200 group-hover:text-white truncate">{c.nombre}</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-[#f5a623] transition-colors shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────────── */}
      <section className="py-24 lg:py-32 bg-white" data-analytics-section="faq">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 grid lg:grid-cols-[0.8fr_1.2fr] gap-12 lg:gap-20">
          <div className="lg:sticky lg:top-36 self-start" data-reveal="left">
            <SectionLabel index="09">Preguntas frecuentes</SectionLabel>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#0a1628] leading-[1.08] mb-6">
              Resolvemos tus dudas antes del despacho
            </h2>
            <Link href="/preguntas-frecuentes" data-analytics-id="home_ver_faq" data-analytics-label="Ver todas las preguntas" data-analytics-cta="secondary_navigation" className="group inline-flex items-center gap-1.5 text-sm font-bold text-[#1a6b3c] hover:text-[#0d4a28] transition-colors">
              Ver todas las preguntas <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <div className="home-faq divide-y divide-slate-200 border-y border-slate-200">
            {faqItems.map((item, i) => (
              <details key={i} data-reveal data-reveal-delay={String(i * 60)} className="group">
                <summary className="flex items-center justify-between gap-6 py-6 cursor-pointer list-none select-none">
                  <span className="text-base sm:text-lg font-bold text-[#0a1628] group-hover:text-[#1a6b3c] transition-colors">{item.q}</span>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 text-[#1a6b3c] transition-[transform,background-color,color] duration-300 group-open:rotate-45 group-open:bg-[#1a6b3c] group-open:text-white">
                    <Plus className="w-4 h-4" />
                  </span>
                </summary>
                <p className="pb-6 pr-14 text-slate-500 leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pb-16" data-reveal><GeneratorToolLink /></div>
      </div>
      <LatestArticles />

      {/* ── CTA FINAL ────────────────────────────────────────────────────────── */}
      <section className="relative py-24 lg:py-32 bg-[#060e1a] text-white overflow-hidden" data-analytics-section="contacto">
        <div className="absolute inset-0 home-grid-bg opacity-70" />
        <div className="home-orb absolute left-1/2 top-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f5a623]/15 blur-[140px]" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#f5a623] to-transparent" />

        <div className="relative max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 text-center">
          <div data-reveal>
            <SectionLabel index="10" dark center>Contacto comercial</SectionLabel>
            <h2 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-[-0.035em] leading-[1.02] mb-6">
              Impulsamos tu operación<br />
              <span className="home-gradient-text">con un servicio confiable</span>
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed max-w-2xl mx-auto mb-10">
              Solicita una propuesta y conoce cómo Fenice SPA puede apoyar el transporte
              y abastecimiento de combustible de tu empresa.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/cotizacion"
                data-analytics-id="home_final_cotizacion"
                data-analytics-label="Solicitar cotización"
                data-analytics-cta="quote"
                className="home-btn-shine group inline-flex items-center justify-center gap-2 bg-[#f5a623] hover:bg-[#ffb83d] text-[#0a1628] font-bold px-8 py-4 rounded-2xl transition-colors shadow-[0_18px_40px_-12px_rgba(245,166,35,0.7)] text-sm"
              >
                Solicitar cotización <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href={WA_URL}
                target="_blank"
                rel="noopener noreferrer"
                data-analytics-id="home_final_whatsapp"
                data-analytics-label="Hablar con un asesor"
                data-analytics-cta="whatsapp"
                className="inline-flex items-center justify-center gap-2.5 bg-white/[0.07] hover:bg-white/[0.14] border border-white/20 text-white font-semibold px-8 py-4 rounded-2xl transition-colors text-sm backdrop-blur-md"
              >
                {WA_ICON}
                Hablar con un asesor
              </a>
            </div>
          </div>

          {/* Contact strip */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-3 text-left" data-reveal>
            {[
              { icon: Globe, label: "Sitio web", value: "www.fenice.cl" },
              { icon: Mail, label: "Correo corporativo", value: SITE_CONFIG.email },
              { icon: Phone, label: "Atención comercial", value: SITE_CONFIG.telefono },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="home-glass flex items-center gap-3 rounded-2xl p-4">
                <div className="w-10 h-10 rounded-xl bg-[#f5a623]/15 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-[#f5a623]" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-slate-400 font-medium">{label}</p>
                  <p className="text-sm font-semibold truncate">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
