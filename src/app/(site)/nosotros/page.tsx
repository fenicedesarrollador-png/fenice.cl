import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  CalendarCheck,
  ClipboardCheck,
  Factory,
  FileCheck2,
  FileText,
  Flame,
  Fuel,
  Handshake,
  Home,
  House,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ReceiptText,
  ShieldCheck,
  Sparkles,
  Truck,
  UserRound,
  Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SITE_CONFIG, whatsappUrl } from "@/lib/config";
import { buildMetadata, aboutPageSchema, teamSchema, jsonLd } from "@/lib/seo";
import { BLUR } from "@/lib/imageBlur";
import { getEquipo, type MiembroEquipo } from "@/lib/getContent";
import Breadcrumb from "@/components/Breadcrumb";
import Certificaciones from "@/components/Certificaciones";

export const revalidate = 60;

export const metadata = buildMetadata({
  title: "Nosotros | Empresa de Petróleo Diesel y Estanques Certificados SEC",
  description:
    "Conoce a Fenice SPA: empresa de distribución de petróleo diesel a domicilio e instalación de estanques certificados SEC para empresas, faenas y flotas en Santiago y la Región Metropolitana. Equipo, valores y certificaciones.",
  path: "/nosotros",
  keywords: [
    "distribuidor de combustible santiago",
    "empresa de petróleo diesel región metropolitana",
    "instalación de estanques certificados SEC",
    "empresa transporte de combustible TC10A",
    "venta de kerosene santiago",
    "quiénes somos fenice spa",
  ],
});

type IconCard = {
  icon: LucideIcon;
  title: string;
  text: string;
};

/* Navegación interna por anclas — mejora UX y profundidad de scroll (señal SEO) */
const sectionNav = [
  { href: "#quienes-somos", label: "Quiénes somos" },
  { href: "#productos", label: "Productos" },
  { href: "#clientes", label: "A quién atendemos" },
  { href: "#valores", label: "Valores" },
  { href: "#equipo", label: "Equipo" },
  { href: "#certificaciones", label: "Certificaciones" },
  { href: "#proceso", label: "Cómo trabajamos" },
];

/* Banda de confianza / impacto (E-E-A-T, contenido indexable) */
const stats = [
  { value: "2", label: "Líneas de producto", hint: "Diésel · Kerosene" },
  { value: "RM", label: "Cobertura operativa", hint: "Región Metropolitana" },
  { value: "B2B + B2C", label: "Empresas y hogares", hint: "Atención dual" },
  { value: "100%", label: "Procesos documentados", hint: "Factura electrónica" },
];

const productHighlights: IconCard[] = [
  {
    icon: Fuel,
    title: "Diésel para empresas y operaciones",
    text: "Soluciones de combustible para necesidades comerciales y operativas.",
  },
  {
    icon: Flame,
    title: "Kerosene para calefacción",
    text: "Alternativas para calefacción y requerimientos estacionales.",
  },
];

type ProductCard = IconCard & {
  href: string;
  cta: string;
};

const products: ProductCard[] = [
  {
    icon: Fuel,
    title: "Diésel",
    text: "Soluciones de diésel para empresas, flotas, maquinaria, equipos y operaciones que requieren continuidad.",
    href: "/venta-petroleo-diesel",
    cta: "Ver diésel",
  },
  {
    icon: Flame,
    title: "Kerosene",
    text: "Kerosene para calefacción y necesidades estacionales de clientes residenciales, comerciales u operativos.",
    href: "/cotizacion",
    cta: "Cotizar kerosene",
  },
];

const audiences = [
  {
    icon: Building2,
    title: "Empresas y operaciones",
    text: "Orientamos requerimientos de combustible para actividades comerciales, flotas, maquinaria, equipos, generadores y otras necesidades operativas, según disponibilidad y coordinación.",
    items: [
      { icon: Truck, label: "Flotas" },
      { icon: Wrench, label: "Maquinaria" },
      { icon: Factory, label: "Operaciones" },
      { icon: BriefcaseBusiness, label: "Empresas" },
    ],
  },
  {
    icon: House,
    title: "Clientes residenciales",
    text: "Entregamos alternativas de kerosene para hogares que requieren calefacción y atención comercial en su día a día.",
    items: [
      { icon: Home, label: "Hogares" },
      { icon: Flame, label: "Calefacción" },
      { icon: Fuel, label: "Energía" },
    ],
  },
];

const valueCards: IconCard[] = [
  {
    icon: ShieldCheck,
    title: "Atención responsable",
    text: "Información clara y orientación según cada requerimiento.",
  },
  {
    icon: Handshake,
    title: "Cercanía comercial",
    text: "Atención enfocada en comprender las necesidades de cada cliente.",
  },
  {
    icon: ClipboardCheck,
    title: "Procesos claros",
    text: "Coordinación comercial y respaldo documentado cuando corresponda.",
  },
  {
    icon: Fuel,
    title: "Soluciones energéticas",
    text: "Diésel y kerosene para empresas, operaciones y hogares.",
  },
];

const principles: IconCard[] = [
  {
    icon: ShieldCheck,
    title: "Confiabilidad",
    text: "Cumplimos los compromisos y condiciones informadas.",
  },
  {
    icon: FileText,
    title: "Transparencia",
    text: "Entregamos información clara sobre productos, cotizaciones y procesos.",
  },
  {
    icon: ClipboardCheck,
    title: "Responsabilidad",
    text: "Promovemos una gestión comercial ordenada y consciente.",
  },
  {
    icon: Handshake,
    title: "Cercanía",
    text: "Escuchamos y orientamos a cada cliente según su necesidad.",
  },
  {
    icon: Fuel,
    title: "Continuidad",
    text: "Comprendemos la importancia de contar con energía para hogares y operaciones.",
  },
  {
    icon: Sparkles,
    title: "Mejora continua",
    text: "Buscamos optimizar nuestra atención y experiencia de servicio.",
  },
];

/* El equipo se administra desde /admin/equipo (tabla `equipo` en Supabase).
   Las fotos se cargan por URL. Fallback estático en EQUIPO_FALLBACK (config). */

const processSteps = [
  {
    icon: MessageCircle,
    title: "Solicitud",
    text: "El cliente solicita información, contacto o cotización.",
  },
  {
    icon: ClipboardCheck,
    title: "Validación",
    text: "Revisamos el tipo de producto, cantidad, ubicación y necesidad.",
  },
  {
    icon: CalendarCheck,
    title: "Coordinación",
    text: "Informamos condiciones y coordinamos el requerimiento según corresponda.",
  },
  {
    icon: ReceiptText,
    title: "Respaldo",
    text: "Se entrega documentación y facturación cuando aplique.",
  },
];

const responsibilityItems: IconCard[] = [
  {
    icon: ShieldCheck,
    title: "Información clara",
    text: "Comunicación directa sobre productos y condiciones aplicables.",
  },
  {
    icon: FileCheck2,
    title: "Gestión documentada",
    text: "Respaldo administrativo y facturación cuando corresponda.",
  },
  {
    icon: Handshake,
    title: "Atención cercana",
    text: "Orientación comercial según cada necesidad.",
  },
];

function SectionEyebrow({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <div className={`flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] mb-3 ${dark ? "text-[#f5a623]" : "text-[#1a6b3c]"}`}>
      <span className="h-px w-8 bg-[#f5a623]" />
      {children}
    </div>
  );
}

function IconTile({ item }: { item: IconCard }) {
  return (
    <article className="group rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#1a6b3c]/30 hover:shadow-md">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#ecfdf3] text-[#1a6b3c] transition-colors group-hover:bg-[#1a6b3c] group-hover:text-white">
        <item.icon className="h-5 w-5" />
      </div>
      <h3 className="mb-2 text-base font-bold text-[#0a1628]">{item.title}</h3>
      <p className="text-sm leading-relaxed text-slate-600">{item.text}</p>
    </article>
  );
}

function TeamCard({
  member,
  featured = false,
  revealDelay = 0,
}: {
  member: MiembroEquipo;
  featured?: boolean;
  revealDelay?: number;
}) {
  return (
    <article
      data-reveal
      data-reveal-delay={String(revealDelay)}
      className={`group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:border-[#1a6b3c]/30 ${
        featured ? "mx-auto max-w-xl" : "h-full"
      }`}
    >
      <div className={`relative overflow-hidden ${featured ? "h-80" : "h-72"} bg-slate-100`}>
        {member.foto_url ? (
          /* eslint-disable-next-line @next/next/no-img-element -- foto cargada por URL desde el admin (host variable) */
          <img
            src={member.foto_url}
            alt={`${member.nombre}, ${member.cargo} de Fenice SPA`}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center bg-gradient-to-br from-slate-100 via-white to-[#ecfdf3] text-slate-500">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-sm">
              <UserRound className="h-10 w-10 text-[#1a6b3c]" />
            </div>
            <p className="px-6 text-center text-sm font-medium">Fotografía pendiente de cargar</p>
          </div>
        )}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#0a1628]/45 to-transparent" />
      </div>
      <div className={featured ? "p-7" : "p-6"}>
        <span className="mb-4 inline-flex rounded-full bg-[#1a6b3c]/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#1a6b3c]">
          {member.cargo}
        </span>
        <h3 className="text-xl font-extrabold text-[#0a1628]">{member.nombre}</h3>
        <div className="mt-4 space-y-3 text-sm text-slate-600">
          <p className="flex items-center gap-2">
            <BriefcaseBusiness className="h-4 w-4 shrink-0 text-[#f5a623]" />
            {member.cargo}
          </p>
          {member.email && (
            <a
              href={`mailto:${member.email}`}
              aria-label={`Enviar correo a ${member.nombre}, ${member.cargo} de Fenice SPA`}
              className="flex items-center gap-2 break-all font-semibold text-slate-700 transition-colors hover:text-[#1a6b3c]"
            >
              <Mail className="h-4 w-4 shrink-0 text-[#f5a623]" />
              {member.email}
            </a>
          )}
        </div>
        {member.bio && <p className="mt-5 text-sm leading-relaxed text-slate-600">{member.bio}</p>}
      </div>
    </article>
  );
}

export default async function NosotrosPage() {
  const equipo = await getEquipo();
  const [featuredMember, ...restMembers] = equipo;
  const secondaryMembers = restMembers.slice(0, 2);
  const additionalMembers = restMembers.slice(2);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(aboutPageSchema())} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(teamSchema(equipo))} />

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#0a1628] text-white" data-analytics-section="nosotros_hero">
        {/* Fondo de marca sin imagen (rápido). Slot libre para una imagen futura del cliente. */}
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "48px 48px" }} />
        <div className="absolute -right-24 top-0 h-96 w-96 rounded-full bg-[#f5a623]/10 blur-3xl" />
        <div className="absolute -left-16 bottom-0 h-80 w-80 rounded-full bg-[#1a6b3c]/15 blur-3xl" />
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#1a6b3c] via-[#f5a623] to-[#1a6b3c]" />
        <div className="relative mx-auto max-w-7xl px-5 pt-6 sm:px-6 lg:px-8">
          <Breadcrumb crumbs={[{ name: "Inicio", href: "/" }, { name: "Nosotros" }]} />
        </div>
        <div className="relative mx-auto grid min-h-[560px] max-w-7xl items-center px-5 pb-20 sm:px-6 lg:grid-cols-12 lg:px-8">
          <div className="lg:col-span-8 xl:col-span-7">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#f5a623]/30 bg-[#f5a623]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[#f5a623]">
              <Fuel className="h-4 w-4" />
              Sobre Fenice SPA
            </div>
            <h1 className="hero-rise text-4xl font-extrabold leading-[1.1] sm:text-5xl lg:text-[3.4rem]">
              Distribuidor de combustible y energía en la{" "}
              <span className="text-[#f5a623]">Región Metropolitana</span>
            </h1>
            <p className="hero-rise-1 mt-6 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
              En Fenice SPA distribuimos petróleo diesel a domicilio para empresas, faenas
              y flotas, e instalamos estanques certificados SEC con carga periódica según
              la necesidad de cada operación. Complementamos con kerosene en Santiago y
              toda la Región Metropolitana.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/cotizacion"
                data-analytics-id="nosotros_hero_cotizar"
                data-analytics-cta="quote"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#f5a623] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#f5a623]/20 transition-colors hover:bg-[#d4891a]"
              >
                Solicitar cotización <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/servicios/instalacion-de-estanques"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/15"
              >
                Conocer nuestros servicios
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── SUB-NAV ANCLAS (sticky) ───────────────────────────────────────── */}
      <nav
        aria-label="Secciones de Nosotros"
        className="sticky top-16 z-30 border-b border-slate-100 bg-white/90 backdrop-blur lg:top-[70px]"
      >
        <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-3 py-2 sm:px-6 lg:px-8 scrollbar-none">
          {sectionNav.map((s) => (
            <a
              key={s.href}
              href={s.href}
              className="shrink-0 rounded-lg px-3.5 py-2 text-[13px] font-semibold text-slate-500 transition-colors hover:bg-slate-50 hover:text-[#1a6b3c]"
            >
              {s.label}
            </a>
          ))}
        </div>
      </nav>

      {/* ── BANDA DE ESTADÍSTICAS ─────────────────────────────────────────── */}
      <section className="border-b border-slate-100 bg-[#0a1628]" aria-label="Datos clave de Fenice SPA">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px overflow-hidden px-5 sm:px-6 lg:grid-cols-4 lg:px-8">
          {stats.map((s) => (
            <div key={s.label} className="px-4 py-7 text-center">
              <p className="text-3xl font-black text-[#f5a623] sm:text-4xl">{s.value}</p>
              <p className="mt-2 text-sm font-bold text-white">{s.label}</p>
              <p className="mt-0.5 text-xs text-slate-400">{s.hint}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── QUIÉNES SOMOS ─────────────────────────────────────────────────── */}
      <section id="quienes-somos" className="scroll-mt-32 bg-white py-16 sm:py-20" data-analytics-section="quienes_somos">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
          <div data-reveal="left">
            <SectionEyebrow>Quiénes somos</SectionEyebrow>
            <h2 className="text-3xl font-extrabold leading-tight text-[#0a1628] sm:text-4xl">
              Una empresa orientada a soluciones de energía y combustible
            </h2>
            <div className="mt-6 space-y-5 text-base leading-relaxed text-slate-600">
              <p>
                Fenice SPA es una empresa dedicada a la distribución de diésel y kerosene,
                con atención comercial a empresas, operaciones y clientes residenciales, según
                las necesidades de cada requerimiento.
              </p>
              <p>
                Entendemos que el acceso oportuno a combustible y energía es importante para
                mantener en funcionamiento hogares, negocios y operaciones. Por eso buscamos
                entregar procesos claros, orientación cercana y una coordinación responsable
                en cada solicitud, con cobertura en Santiago y la Región Metropolitana.
              </p>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {productHighlights.map((item) => (
                <div key={item.title} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <item.icon className="mb-3 h-6 w-6 text-[#1a6b3c]" />
                  <h3 className="text-sm font-bold text-[#0a1628]">{item.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-500">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
          {/* Imagen de presentación de Nosotros */}
          <div data-reveal="right" className="relative min-h-[320px] overflow-hidden rounded-2xl bg-slate-100 shadow-sm lg:min-h-[440px]">
            <Image
              src="/images/nosotros-fenice.webp"
              alt="Camión cisterna de Fenice SPA distribuyendo combustible en Santiago, con la cordillera al atardecer"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              placeholder="blur"
              blurDataURL={BLUR["nosotros-fenice"]}
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628]/30 to-transparent" />
          </div>
        </div>
      </section>

      {/* ── PRODUCTOS ─────────────────────────────────────────────────────── */}
      <section id="productos" className="scroll-mt-32 border-y border-slate-100 bg-slate-50 py-16 sm:py-20" data-analytics-section="productos_energia">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-3xl">
            <SectionEyebrow>Productos</SectionEyebrow>
            <h2 className="text-3xl font-extrabold text-[#0a1628] sm:text-4xl">
              Soluciones de combustible para distintas necesidades
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {products.map((product) => (
              <article
                key={product.title}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#1a6b3c]/40 hover:shadow-md"
              >
                {/* Header con icono profesional (sin imagen, carga instantánea) */}
                <div className="relative flex h-40 items-center justify-center overflow-hidden bg-gradient-to-br from-[#0a1628] to-[#123056]">
                  <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "18px 18px" }} />
                  <div className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-[#1a6b3c] via-[#f5a623] to-[#1a6b3c]" />
                  <span className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15 backdrop-blur-sm transition-transform duration-300 group-hover:scale-105">
                    <product.icon className="h-9 w-9 text-[#f5a623]" strokeWidth={1.75} />
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-extrabold text-[#0a1628]">{product.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{product.text}</p>
                  <Link
                    href={product.href}
                    className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#1a6b3c] transition-colors hover:text-[#0d4a28]"
                  >
                    {product.cta} <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── A QUIÉN ATENDEMOS ─────────────────────────────────────────────── */}
      <section id="clientes" className="scroll-mt-32 bg-white py-16 sm:py-20" data-analytics-section="clientes">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-3xl">
            <SectionEyebrow>A quién atendemos</SectionEyebrow>
            <h2 className="text-3xl font-extrabold text-[#0a1628] sm:text-4xl">
              Atención para empresas, operaciones y hogares
            </h2>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            {audiences.map((audience) => (
              <article key={audience.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-7">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#1a6b3c] text-white">
                  <audience.icon className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-extrabold text-[#0a1628]">{audience.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-slate-600">{audience.text}</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  {audience.items.map((item) => (
                    <span
                      key={item.label}
                      className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700"
                    >
                      <item.icon className="h-4 w-4 text-[#f5a623]" />
                      {item.label}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROPUESTA DE VALOR ────────────────────────────────────────────── */}
      <section className="bg-[#0a1628] py-16 text-white sm:py-20" data-analytics-section="propuesta_valor">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-3xl">
            <SectionEyebrow dark>Compromiso Fenice</SectionEyebrow>
            <h2 className="text-3xl font-extrabold sm:text-4xl">
              Combustible y energía para necesidades reales
            </h2>
            <p className="mt-5 text-base leading-relaxed text-slate-300">
              En Fenice SPA buscamos entregar una atención clara, cercana y responsable para
              cada requerimiento. Nuestro enfoque está en orientar a clientes residenciales
              y empresas, facilitando el acceso a diésel y kerosene según el
              tipo de necesidad.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {valueCards.map((item) => (
              <article key={item.title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition-colors hover:border-[#f5a623]/30 hover:bg-white/[0.07]">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#f5a623]/15 text-[#f5a623]">
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className="mb-2 font-bold">{item.title}</h3>
                <p className="text-sm leading-relaxed text-slate-300">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── MISIÓN / VISIÓN / VALORES ─────────────────────────────────────── */}
      <section id="valores" className="scroll-mt-32 bg-white py-16 sm:py-20" data-analytics-section="mision_vision_valores">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-3xl">
            <SectionEyebrow>Misión, visión y valores</SectionEyebrow>
            <h2 className="text-3xl font-extrabold text-[#0a1628] sm:text-4xl">
              Nuestra forma de trabajar
            </h2>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <article className="rounded-2xl border border-[#1a6b3c]/15 bg-[#ecfdf3] p-7">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#1a6b3c] text-white">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="mb-4 text-xl font-extrabold text-[#0a1628]">Misión</h3>
              <p className="leading-relaxed text-slate-600">
                Entregar soluciones confiables de diésel y kerosene,
                atendiendo las necesidades de empresas, operaciones y hogares mediante una
                atención cercana, procesos transparentes y una coordinación eficiente.
              </p>
            </article>
            <article className="rounded-2xl border border-[#f5a623]/20 bg-[#fff7ec] p-7">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#f5a623] text-white">
                <ArrowRight className="h-5 w-5" />
              </div>
              <h3 className="mb-4 text-xl font-extrabold text-[#0a1628]">Visión</h3>
              <p className="leading-relaxed text-slate-600">
                Ser una empresa reconocida por la confianza, cercanía y capacidad de respuesta
                en la distribución de combustibles y energía para clientes residenciales y
                empresariales de la Región Metropolitana.
              </p>
            </article>
          </div>
          <h3 className="mt-12 mb-6 text-lg font-bold text-[#0a1628]">Nuestros valores</h3>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {principles.map((item) => (
              <IconTile key={item.title} item={item} />
            ))}
          </div>
        </div>
      </section>

      {/* ── EQUIPO ────────────────────────────────────────────────────────── */}
      <section id="equipo" className="scroll-mt-32 border-y border-slate-100 bg-slate-50 py-16 sm:py-20" data-analytics-section="equipo">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-3xl text-center" data-reveal>
            <div className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#1a6b3c]">
              Equipo Fenice
            </div>
            <h2 className="text-3xl font-extrabold text-[#0a1628] sm:text-4xl">
              Las personas detrás de Fenice
            </h2>
            <p className="mt-5 text-base leading-relaxed text-slate-600">
              Un equipo directivo con experiencia en distribución de combustible, gestión
              comercial y administración, comprometido con la continuidad operacional de
              cada cliente: desde el primer contacto hasta la carga periódica de su estanque.
            </p>
          </div>
          {featuredMember && <TeamCard member={featuredMember} featured />}
          <div className="mx-auto mt-8 grid max-w-5xl gap-8 lg:grid-cols-2">
            {secondaryMembers.map((member, i) => (
              <TeamCard key={member.id} member={member} revealDelay={i * 120} />
            ))}
          </div>
          {additionalMembers.length > 0 && (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {additionalMembers.map((member, i) => (
                <TeamCard key={member.id} member={member} revealDelay={i * 100} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── CERTIFICACIONES ───────────────────────────────────────────────── */}
      <div id="certificaciones" className="scroll-mt-32">
        <Certificaciones variant="dark" />
      </div>

      {/* ── CÓMO TRABAJAMOS ───────────────────────────────────────────────── */}
      <section id="proceso" className="scroll-mt-32 bg-white py-16 sm:py-20" data-analytics-section="como_trabajamos">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="mb-12 max-w-3xl">
            <SectionEyebrow>Cómo trabajamos</SectionEyebrow>
            <h2 className="text-3xl font-extrabold text-[#0a1628] sm:text-4xl">
              Un proceso claro para cada requerimiento
            </h2>
          </div>
          <div className="grid gap-5 lg:grid-cols-4">
            {processSteps.map((step, index) => (
              <article key={step.title} className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#ecfdf3] text-[#1a6b3c]">
                    <step.icon className="h-6 w-6" />
                  </div>
                  <span className="text-2xl font-black text-slate-200">{String(index + 1).padStart(2, "0")}</span>
                </div>
                <h3 className="text-lg font-extrabold text-[#0a1628]">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMPROMISO RESPONSABLE ────────────────────────────────────────── */}
      <section className="bg-slate-50 py-16 sm:py-20" data-analytics-section="compromiso_responsable">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-6 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:px-8">
          <div>
            <SectionEyebrow>Responsabilidad</SectionEyebrow>
            <h2 className="text-3xl font-extrabold text-[#0a1628] sm:text-4xl">
              Comprometidos con una atención responsable
            </h2>
            <p className="mt-5 text-base leading-relaxed text-slate-600">
              Fenice SPA busca mantener una gestión comercial clara y responsable, orientando cada
              solicitud de diésel y kerosene de acuerdo con las
              condiciones aplicables, disponibilidad y necesidades del cliente.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            {responsibilityItems.map((item) => (
              <article key={item.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#ecfdf3] text-[#1a6b3c]">
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-[#0a1628]">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#0a1628] py-16 text-white" data-analytics-section="nosotros_cta">
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#1a6b3c] via-[#f5a623] to-[#1a6b3c]" />
        <div className="mx-auto grid max-w-7xl gap-8 px-5 sm:px-6 lg:grid-cols-[1fr_auto] lg:items-center lg:px-8">
          <div>
            <h2 className="text-3xl font-extrabold sm:text-4xl">
              ¿Necesitas cotizar diésel o kerosene?
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300">
              Nuestro equipo está disponible para orientar tu requerimiento según producto,
              cantidad y ubicación en la Región Metropolitana.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-400">
              <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4 text-[#f5a623]" />{SITE_CONFIG.direccion}</span>
              <span className="inline-flex items-center gap-2"><Phone className="h-4 w-4 text-[#f5a623]" />{SITE_CONFIG.telefono}</span>
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
            <Link
              href="/cotizacion"
              data-analytics-id="nosotros_cta_cotizar"
              data-analytics-cta="quote"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#f5a623] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#d4891a]"
            >
              <FileText className="h-4 w-4" />
              Solicitar cotización
            </Link>
            <a
              href={whatsappUrl("Hola, necesito cotizar diésel o kerosene.")}
              target="_blank"
              rel="noopener noreferrer"
              data-analytics-id="nosotros_cta_whatsapp"
              data-analytics-cta="whatsapp"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/15"
            >
              <Phone className="h-4 w-4" />
              Hablar con Fenice
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
