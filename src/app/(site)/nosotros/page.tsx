import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "Fenice | Diésel, Kerosene y Gas Envasado Residencial",
  description:
    "Conozca Fenice, empresa dedicada a la comercialización de diésel, kerosene y gas envasado residencial para empresas, operaciones y hogares.",
  alternates: { canonical: "https://fenice.cl/nosotros" },
};

const corporateImage = {
  src: "/images/imagen_camion_de_combustible.png",
  alt: "Camión de combustible de Fenice en operación",
};

type IconCard = {
  icon: LucideIcon;
  title: string;
  text: string;
};

type ProductCard = IconCard & {
  href: string;
  cta: string;
  image: string;
  imageAlt: string;
};

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
  {
    icon: House,
    title: "Gas envasado residencial",
    text: "Energía para hogares y necesidades cotidianas de uso residencial.",
  },
];

const products: ProductCard[] = [
  {
    icon: Fuel,
    title: "Diésel",
    text: "Soluciones de diésel para empresas, flotas, maquinaria, equipos y operaciones que requieren continuidad.",
    href: "/venta-petroleo-diesel",
    cta: "Ver diésel",
    image: corporateImage.src,
    imageAlt: "Imagen corporativa de Fenice relacionada con soluciones de diésel",
  },
  {
    icon: Flame,
    title: "Kerosene",
    text: "Kerosene para calefacción y necesidades estacionales de clientes residenciales, comerciales u operativos.",
    href: "/productos",
    cta: "Ver productos",
    image: corporateImage.src,
    imageAlt: "Imagen corporativa de Fenice relacionada con soluciones de combustible",
  },
  {
    icon: Home,
    title: "Gas envasado residencial",
    text: "Gas envasado para hogares y necesidades cotidianas de cocción, calefacción y uso residencial.",
    href: "/productos",
    cta: "Ver productos",
    image: corporateImage.src,
    imageAlt: "Imagen corporativa de Fenice relacionada con soluciones residenciales",
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
    text: "Entregamos alternativas de kerosene y gas envasado residencial para hogares que requieren energía y calefacción en su día a día.",
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
    text: "Diésel, kerosene y gas envasado residencial en un mismo lugar.",
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

const teamMembers = [
  {
    id: "gerencia-general",
    featured: true,
    name: "Nombre por definir",
    role: "Gerente General",
    email: SITE_CONFIG.email,
    image: "",
    imageAlt: "Gerente General de Fenice",
    badge: "Dirección General",
    description:
      "Lidero la gestión estratégica y comercial de Fenice, procurando que cada cliente reciba una atención confiable y una solución adecuada para sus necesidades de combustible y energía.",
  },
  {
    id: "jefatura-comercial",
    featured: false,
    name: "Nombre por definir",
    role: "Jefatura Comercial",
    email: SITE_CONFIG.email,
    image: "",
    imageAlt: "Jefatura Comercial de Fenice",
    badge: "Área Comercial",
    description:
      "Estoy a cargo de orientar las cotizaciones y requerimientos de nuestros clientes, entregando información clara sobre diésel, kerosene y gas envasado residencial.",
  },
  {
    id: "operaciones-administracion",
    featured: false,
    name: "Nombre por definir",
    role: "Operaciones y Administración",
    email: SITE_CONFIG.email,
    image: "",
    imageAlt: "Operaciones y Administración de Fenice",
    badge: "Operaciones / Administración",
    description:
      "Coordino el seguimiento de cada solicitud y el respaldo administrativo del proceso, buscando una atención ordenada y alineada con las necesidades del cliente.",
  },
];

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

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 text-[#1a6b3c] text-xs font-bold uppercase tracking-[0.2em] mb-3">
      <span className="h-px w-8 bg-[#f5a623]" />
      {children}
    </div>
  );
}

function IconTile({ item }: { item: IconCard }) {
  return (
    <article className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#f5a623]/50 hover:shadow-md">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-[#f5a623]/10 text-[#1a6b3c]">
        <item.icon className="h-5 w-5" />
      </div>
      <h3 className="mb-2 text-base font-bold text-slate-950">{item.title}</h3>
      <p className="text-sm leading-relaxed text-slate-600">{item.text}</p>
    </article>
  );
}

function TeamCard({
  member,
  featured = false,
}: {
  member: (typeof teamMembers)[number];
  featured?: boolean;
}) {
  return (
    <article
      className={`overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm ${
        featured ? "mx-auto max-w-xl" : "h-full"
      }`}
    >
      <div className={`relative ${featured ? "h-80" : "h-72"} bg-slate-100`}>
        {member.image ? (
          <Image
            src={member.image}
            alt={member.imageAlt}
            fill
            sizes={featured ? "(min-width: 1024px) 560px, 100vw" : "(min-width: 1024px) 480px, 100vw"}
            className="object-cover object-center"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center bg-gradient-to-br from-slate-100 via-white to-[#f5a623]/10 text-slate-500">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-sm">
              <UserRound className="h-10 w-10 text-[#1a6b3c]" />
            </div>
            <p className="px-6 text-center text-sm font-medium">Fotografía real pendiente de cargar</p>
          </div>
        )}
      </div>
      <div className={featured ? "p-7" : "p-6"}>
        <span className="mb-4 inline-flex rounded-full bg-[#1a6b3c]/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#1a6b3c]">
          {member.badge}
        </span>
        <h3 className="text-xl font-extrabold text-slate-950">{member.name}</h3>
        <div className="mt-4 space-y-3 text-sm text-slate-600">
          <p className="flex items-center gap-2">
            <BriefcaseBusiness className="h-4 w-4 shrink-0 text-[#f5a623]" />
            {member.role}
          </p>
          <a
            href={`mailto:${member.email}`}
            aria-label={`Enviar correo a ${member.name}`}
            className="flex items-center gap-2 break-all font-semibold text-slate-700 transition-colors hover:text-[#1a6b3c]"
          >
            <Mail className="h-4 w-4 shrink-0 text-[#f5a623]" />
            {member.email}
          </a>
        </div>
        <p className="mt-5 text-sm leading-relaxed text-slate-600">{member.description}</p>
      </div>
    </article>
  );
}

export default function NosotrosPage() {
  const featuredMember = teamMembers.find((member) => member.featured);
  const secondaryMembers = teamMembers.filter((member) => !member.featured).slice(0, 2);
  const additionalMembers = teamMembers.filter((member) => !member.featured).slice(2);

  return (
    <>
      <section className="relative overflow-hidden bg-slate-950 text-white" data-analytics-section="nosotros_hero">
        <Image
          src={corporateImage.src}
          alt={corporateImage.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-[45%_center] opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-slate-950/25" />
        <div className="relative mx-auto grid min-h-[620px] max-w-7xl items-center px-5 py-20 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#f5a623]/30 bg-[#f5a623]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[#f5a623]">
              <Fuel className="h-4 w-4" />
              FENICE
            </div>
            <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
              Energía y combustible para empresas, operaciones y hogares
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-200 sm:text-lg">
              En Fenice comercializamos diésel, kerosene y gas envasado residencial,
              entregando una atención clara y cercana para responder a las necesidades de
              nuestros clientes.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/cotizacion"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#f5a623] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#f5a623]/20 transition-colors hover:bg-[#d4891a]"
              >
                Solicitar cotización <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/productos"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/15"
              >
                Conocer nuestros productos
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20" data-analytics-section="quienes_somos">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
          <div>
            <SectionEyebrow>Quiénes somos</SectionEyebrow>
            <h2 className="text-3xl font-extrabold leading-tight text-slate-950 sm:text-4xl">
              Una empresa orientada a soluciones de energía y combustible
            </h2>
            <div className="mt-6 space-y-5 text-base leading-relaxed text-slate-600">
              <p>
                Fenice es una empresa dedicada a la comercialización de diésel, kerosene y
                gas envasado residencial. Trabajamos para entregar alternativas de suministro
                y atención comercial a empresas, operaciones y clientes residenciales, según
                las necesidades de cada requerimiento.
              </p>
              <p>
                Entendemos que el acceso oportuno a combustible y energía es importante para
                mantener en funcionamiento hogares, negocios y operaciones. Por eso buscamos
                entregar procesos claros, orientación cercana y una coordinación responsable
                en cada solicitud.
              </p>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {productHighlights.map((item) => (
                <div key={item.title} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <item.icon className="mb-3 h-6 w-6 text-[#1a6b3c]" />
                  <h3 className="text-sm font-bold text-slate-950">{item.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-500">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative min-h-[430px] overflow-hidden rounded-2xl bg-slate-100 shadow-sm">
            <Image
              src={corporateImage.src}
              alt="Imagen corporativa de Fenice vinculada a combustible y energía"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover object-center"
            />
          </div>
        </div>
      </section>

      <section className="border-y border-slate-100 bg-slate-50 py-20" data-analytics-section="productos_energia">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-3xl">
            <SectionEyebrow>Productos</SectionEyebrow>
            <h2 className="text-3xl font-extrabold text-slate-950 sm:text-4xl">
              Soluciones de combustible para distintas necesidades
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <article
                key={product.title}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#f5a623]/60 hover:shadow-md"
              >
                <div className="relative h-52 bg-slate-100">
                  <Image
                    src={product.image}
                    alt={product.imageAlt}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/45 to-transparent" />
                  <div className="absolute bottom-4 left-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white text-[#1a6b3c] shadow-sm">
                    <product.icon className="h-6 w-6" />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-extrabold text-slate-950">{product.title}</h3>
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

      <section className="bg-white py-20" data-analytics-section="clientes">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-3xl">
            <h2 className="text-3xl font-extrabold text-slate-950 sm:text-4xl">
              Atención para empresas, operaciones y hogares
            </h2>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            {audiences.map((audience) => (
              <article key={audience.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-7">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#1a6b3c] text-white">
                  <audience.icon className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-extrabold text-slate-950">{audience.title}</h3>
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

      <section className="bg-[#0a1628] py-20 text-white" data-analytics-section="propuesta_valor">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-3xl">
            <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#f5a623]">
              <span className="h-px w-8 bg-[#f5a623]" />
              Compromiso Fenice
            </div>
            <h2 className="text-3xl font-extrabold sm:text-4xl">
              Combustible y energía para necesidades reales
            </h2>
            <p className="mt-5 text-base leading-relaxed text-slate-300">
              En Fenice buscamos entregar una atención clara, cercana y responsable para
              cada requerimiento. Nuestro enfoque está en orientar a clientes residenciales
              y empresas, facilitando el acceso a diésel, kerosene y gas envasado según el
              tipo de necesidad.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {valueCards.map((item) => (
              <article key={item.title} className="rounded-xl border border-white/10 bg-white/[0.04] p-6">
                <item.icon className="mb-4 h-7 w-7 text-[#f5a623]" />
                <h3 className="mb-2 font-bold">{item.title}</h3>
                <p className="text-sm leading-relaxed text-slate-300">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20" data-analytics-section="mision_vision_valores">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-3xl">
            <h2 className="text-3xl font-extrabold text-slate-950 sm:text-4xl">
              Nuestra forma de trabajar
            </h2>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <article className="rounded-2xl border border-slate-200 bg-slate-50 p-7">
              <h3 className="mb-4 text-xl font-extrabold text-slate-950">Misión</h3>
              <p className="leading-relaxed text-slate-600">
                Entregar soluciones confiables de diésel, kerosene y gas envasado residencial,
                atendiendo las necesidades de empresas, operaciones y hogares mediante una
                atención cercana, procesos transparentes y una coordinación eficiente.
              </p>
            </article>
            <article className="rounded-2xl border border-slate-200 bg-slate-50 p-7">
              <h3 className="mb-4 text-xl font-extrabold text-slate-950">Visión</h3>
              <p className="leading-relaxed text-slate-600">
                Ser una empresa reconocida por la confianza, cercanía y capacidad de respuesta
                en la comercialización de combustibles y energía para clientes residenciales y
                empresariales.
              </p>
            </article>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {principles.map((item) => (
              <IconTile key={item.title} item={item} />
            ))}
          </div>
        </div>
      </section>

      <section id="equipo" className="border-y border-slate-100 bg-slate-50 py-20" data-analytics-section="equipo">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <div className="mb-3 justify-center text-[#1a6b3c] text-xs font-bold uppercase tracking-[0.2em]">
              Equipo Fenice
            </div>
            <h2 className="text-3xl font-extrabold text-slate-950 sm:text-4xl">
              Las personas detrás de Fenice
            </h2>
            <p className="mt-5 text-base leading-relaxed text-slate-600">
              En Fenice contamos con un equipo comprometido con entregar una atención clara,
              responsable y cercana. Trabajamos para orientar y coordinar soluciones de diésel,
              kerosene y gas envasado residencial, según las necesidades de cada cliente,
              empresa, hogar u operación.
            </p>
          </div>
          {featuredMember && <TeamCard member={featuredMember} featured />}
          <div className="mx-auto mt-8 grid max-w-5xl gap-8 lg:grid-cols-2">
            {secondaryMembers.map((member) => (
              <TeamCard key={member.id} member={member} />
            ))}
          </div>
          {additionalMembers.length > 0 && (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {additionalMembers.map((member) => (
                <TeamCard key={member.id} member={member} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="bg-white py-20" data-analytics-section="como_trabajamos">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="mb-12 max-w-3xl">
            <h2 className="text-3xl font-extrabold text-slate-950 sm:text-4xl">
              Un proceso claro para cada requerimiento
            </h2>
          </div>
          <div className="grid gap-5 lg:grid-cols-4">
            {processSteps.map((step, index) => (
              <article key={step.title} className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f5a623]/10 text-[#1a6b3c]">
                    <step.icon className="h-6 w-6" />
                  </div>
                  <span className="text-sm font-extrabold text-slate-300">{String(index + 1).padStart(2, "0")}</span>
                </div>
                <h3 className="text-lg font-extrabold text-slate-950">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-20" data-analytics-section="compromiso_responsable">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-6 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:px-8">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-950 sm:text-4xl">
              Comprometidos con una atención responsable
            </h2>
            <p className="mt-5 text-base leading-relaxed text-slate-600">
              Fenice busca mantener una gestión comercial clara y responsable, orientando cada
              solicitud de diésel, kerosene y gas envasado residencial de acuerdo con las
              condiciones aplicables, disponibilidad y necesidades del cliente.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            {responsibilityItems.map((item) => (
              <article key={item.title} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <item.icon className="mb-4 h-7 w-7 text-[#1a6b3c]" />
                <h3 className="font-bold text-slate-950">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#0a1628] py-16 text-white" data-analytics-section="nosotros_cta">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 sm:px-6 lg:grid-cols-[1fr_auto] lg:items-center lg:px-8">
          <div>
            <h2 className="text-3xl font-extrabold sm:text-4xl">
              ¿Necesita cotizar diésel, kerosene o gas envasado residencial?
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300">
              Nuestro equipo está disponible para orientar su requerimiento según producto,
              cantidad y ubicación.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
            <Link
              href="/cotizacion"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#f5a623] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#d4891a]"
            >
              <FileText className="h-4 w-4" />
              Solicitar cotización
            </Link>
            <a
              href={whatsappUrl("Hola, necesito cotizar diésel, kerosene o gas envasado residencial.")}
              target="_blank"
              rel="noopener noreferrer"
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
