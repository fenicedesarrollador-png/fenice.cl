import type { Metadata } from "next";
import { SITE_CONFIG, COMUNAS, SERVICIOS } from "@/lib/config";

const BASE = SITE_CONFIG.site_url;
// Imagen para logo/Organization (la del camión, 1968x799).
const BRAND_IMAGE = "/images/imagen_camion_de_combustible.png";
// Imagen Open Graph dedicada 1200x630 (generada por Next en /opengraph-image).
const OG_IMAGE = "/opengraph-image";

/* ============================================================
   Helper central de metadata — uso consistente en todo el sitio
   ============================================================ */
export function buildMetadata({
  title,
  titleAbsolute = false,
  description,
  path = "/",
  keywords,
  image = OG_IMAGE,
  noindex = false,
  type = "website",
  publishedTime,
  modifiedTime,
}: {
  title: string;
  /** Si true, el título NO recibe el sufijo "| Fenice SPA" del template (evita duplicados). */
  titleAbsolute?: boolean;
  description: string;
  path?: string;
  keywords?: string[];
  image?: string;
  noindex?: boolean;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
}): Metadata {
  const url = `${BASE}${path}`;
  const absImage = image.startsWith("http") ? image : `${BASE}${image}`;

  return {
    title: titleAbsolute ? { absolute: title } : title,
    description,
    keywords: keywords?.join(", "),
    alternates: { canonical: url },
    robots: noindex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
    openGraph: {
      type,
      url,
      title,
      description,
      siteName: SITE_CONFIG.nombre,
      locale: "es_CL",
      images: [{ url: absImage, width: 1200, height: 630, alt: title }],
      ...(publishedTime ? { publishedTime } : {}),
      ...(modifiedTime ? { modifiedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [absImage],
    },
  };
}

/* ============================================================
   Keywords locales por intención comercial (RM / Santiago)
   ============================================================ */
export const CORE_KEYWORDS = [
  "petróleo a domicilio santiago",
  "petróleo a domicilio región metropolitana",
  "venta de petróleo diesel empresas",
  "distribuidor de combustible santiago",
  "despacho de petróleo RM",
  "transporte de combustible santiago",
  "abastecimiento de combustible industrial",
  "petróleo diesel para empresas",
  "combustible a domicilio Santiago",
  "instalación de estanques de combustible SEC",
];

export function comunaKeywords(comuna: string): string[] {
  return [
    `petróleo a domicilio ${comuna}`,
    `venta de petróleo ${comuna}`,
    `despacho de combustible ${comuna}`,
    `diesel a domicilio ${comuna}`,
    `distribuidor de combustible ${comuna}`,
    "petróleo a domicilio santiago",
    "petróleo a domicilio región metropolitana",
  ];
}

/* ============================================================
   Schemas JSON-LD reutilizables
   ============================================================ */

// Organización (knowledge panel)
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${BASE}/#organization`,
    name: SITE_CONFIG.razon_social,
    alternateName: SITE_CONFIG.nombre,
    url: `${BASE}/`,
    logo: { "@type": "ImageObject", url: `${BASE}${BRAND_IMAGE}`, width: 1200, height: 630 },
    image: `${BASE}${BRAND_IMAGE}`,
    email: SITE_CONFIG.email,
    telephone: SITE_CONFIG.telefono,
    address: {
      "@type": "PostalAddress",
      addressLocality: "La Granja",
      addressRegion: SITE_CONFIG.region,
      addressCountry: "CL",
    },
    sameAs: [SITE_CONFIG.instagram_url],
    areaServed: { "@type": "AdministrativeArea", name: "Región Metropolitana de Santiago" },
    knowsAbout: [
      "Distribución de petróleo diesel",
      "Transporte de combustible",
      "Abastecimiento industrial de combustible",
      "Instalación de estanques de combustible",
      "Cumplimiento normativo SEC",
    ],
  };
}

// WebSite con SearchAction (sitelinks searchbox)
export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${BASE}/#website`,
    url: `${BASE}/`,
    name: SITE_CONFIG.nombre,
    inLanguage: "es-CL",
    publisher: { "@id": `${BASE}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${BASE}/blog?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };
}

// LocalBusiness rico (distribuidor de combustible)
export function localBusinessSchema(config?: {
  telefono?: string;
  email?: string;
  direccion?: string;
  instagram_url?: string;
  lat?: number;
  lng?: number;
}) {
  const telefono = config?.telefono ?? SITE_CONFIG.telefono;
  const email = config?.email ?? SITE_CONFIG.email;
  const instagram = config?.instagram_url ?? SITE_CONFIG.instagram_url;
  const lat = config?.lat ?? SITE_CONFIG.lat;
  const lng = config?.lng ?? SITE_CONFIG.lng;

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${BASE}/#localbusiness`,
    name: SITE_CONFIG.nombre,
    legalName: SITE_CONFIG.razon_social,
    description:
      "Distribuidor de petróleo diesel y combustible a domicilio para empresas e industria en la Región Metropolitana de Santiago. Despacho rápido, flota especializada y cumplimiento normativo SEC.",
    url: `${BASE}/`,
    image: `${BASE}${BRAND_IMAGE}`,
    logo: `${BASE}${BRAND_IMAGE}`,
    telephone: telefono,
    email,
    priceRange: SITE_CONFIG.price_range,
    currenciesAccepted: "CLP",
    paymentAccepted: "Transferencia, Factura electrónica",
    address: {
      "@type": "PostalAddress",
      addressLocality: "La Granja",
      addressRegion: SITE_CONFIG.region,
      addressCountry: "CL",
    },
    geo: { "@type": "GeoCoordinates", latitude: lat, longitude: lng },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "19:00",
    },
    areaServed: [
      { "@type": "AdministrativeArea", name: "Región Metropolitana de Santiago" },
      ...COMUNAS.map((c) => ({ "@type": "City", name: c.nombre })),
    ],
    sameAs: [instagram],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Servicios de combustible",
      itemListElement: SERVICIOS.map((s) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: s.nombre,
          description: s.descripcion,
          url: `${BASE}/servicios/${s.slug}`,
        },
      })),
    },
  };

  // Solo incluir estrellas si hay reseñas reales (evita penalización de Google)
  if (SITE_CONFIG.review_count > 0) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: SITE_CONFIG.rating_value,
      reviewCount: SITE_CONFIG.review_count,
      bestRating: 5,
      worstRating: 1,
    };
  }

  return schema;
}

// Servicio específico
export function serviceSchema({
  name,
  description,
  slug,
}: {
  name: string;
  description: string;
  slug: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    serviceType: name,
    url: `${BASE}/servicios/${slug}`,
    provider: { "@id": `${BASE}/#localbusiness` },
    areaServed: { "@type": "AdministrativeArea", name: "Región Metropolitana de Santiago" },
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: `${BASE}/cotizacion`,
      servicePhone: SITE_CONFIG.telefono,
    },
  };
}

// AboutPage (página Nosotros). El BreadcrumbList lo emite el componente Breadcrumb.
export function aboutPageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": `${BASE}/nosotros/#aboutpage`,
    url: `${BASE}/nosotros`,
    name: "Sobre Fenice SPA — Distribuidor de combustible en la Región Metropolitana",
    description:
      "Conoce a Fenice SPA: empresa dedicada a la distribución de diésel, kerosene y gas envasado residencial para empresas, operaciones y hogares en Santiago y la Región Metropolitana.",
    inLanguage: "es-CL",
    about: { "@id": `${BASE}/#organization` },
    isPartOf: { "@id": `${BASE}/#website` },
  };
}

// FAQ
export function faqSchema(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

// Helper para inyectar JSON-LD en JSX
export function jsonLd(schema: object) {
  return { __html: JSON.stringify(schema) };
}
