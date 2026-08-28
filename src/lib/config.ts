// Fallback config — overridden at runtime by configuracion_sitio table values
export const SITE_CONFIG = {
  nombre: "Fenice SPA",
  razon_social: "Sociedad de Transportes y Diesel SpA",
  rut: "76.710.961-K",
  // Año de constitución de la razón social vigente.
  fundacion: "2023",
  whatsapp_numero: "56939579658",
  telefono: "+56939579658",
  email: "notifica@fenice.cl",
  email_finanzas: "finanzas@fenice.cl",
  horario: "Lun-Vie 09:00–19:00",
  direccion: "Calle La Granja 8396, San Ramón, Región Metropolitana",
  comuna: "San Ramón",
  region: "Región Metropolitana",
  ciudad: "Santiago",
  pais: "Chile",
  instagram_url: "https://www.instagram.com/fenice.combustible/",
  site_url: "https://fenice.cl",
  lat: -33.5447,
  lng: -70.6354,
  // Rango de precio referencial para schema (no muestra valores, solo nivel)
  price_range: "$$",
  // Reseñas — ACTUALIZAR con valores reales de Google Business Profile.
  // Mientras no haya reseñas verificables, dejar review_count en 0 para
  // que el schema NO incluya estrellas (Google penaliza ratings inventados).
  rating_value: 5.0,
  review_count: 0,
} as const;

// Cobertura de comunas: la fuente de verdad vive en "./comunas". Se re-exporta
// aquí para mantener retrocompatibilidad con todos los imports existentes.
export { COMUNAS, COMUNAS_DESTACADAS } from "./comunas";

export const SERVICIOS = [
  {
    nombre: "Petróleo a Domicilio Santiago",
    slug: "petroleo-a-domicilio-santiago",
    href: "/petroleo-a-domicilio",
    descripcion: "Despacho rápido de petróleo diésel para empresas e industria en la RM.",
  },
  {
    nombre: "Parafina a Domicilio Santiago",
    slug: "parafina-a-domicilio-santiago",
    href: "/venta-kerosene",
    descripcion: "Venta y despacho de parafina (kerosene) para calefacción de edificios, condominios, hoteles y calderas.",
  },
  {
    nombre: "Combustible para Maquinaria Pesada",
    slug: "combustible-para-maquinaria-pesada",
    href: "/servicios/combustible-para-maquinaria-pesada",
    descripcion: "Diésel en terreno para excavadoras, retroexcavadoras, cargadores y faenas de movimiento de tierra.",
  },
  {
    nombre: "Combustible para Generadores Eléctricos",
    slug: "combustible-para-generadores-electricos",
    href: "/servicios/combustible-para-generadores-electricos",
    descripcion: "Abastecimiento programado o urgente de diésel para generadores de edificios, clínicas, industrias y hoteles.",
  },
  {
    nombre: "Combustible para Calderas",
    slug: "combustible-para-calderas",
    href: "/servicios/combustible-para-calderas",
    descripcion: "Suministro de combustible para calderas de edificios, condominios, centros de salud e industrias.",
  },
  {
    nombre: "Instalación de Estanques",
    slug: "instalacion-de-estanques",
    href: "/servicios/instalacion-de-estanques",
    descripcion: "Instalación y mantención de estanques conforme al DS 160 y declaración TC4 cuando corresponde.",
  },
  {
    nombre: "Transporte de Combustible RM",
    slug: "transporte-de-combustible-rm",
    href: "/servicios/transporte-de-combustible-rm",
    descripcion: "Transporte de combustible con documentación y cumplimiento normativo en la Región Metropolitana.",
  },
] as const;

// Destinatarios de las notificaciones de cotización/contacto (Resend)
export const NOTIFY_EMAILS = [
  "notifica@fenice.cl",
  "ventas@fenice.cl",
  "ruben.pierattini@fenice.cl",
  "cecilia.moya@fenice.cl",
  "erika.pierattini@fenice.cl",
] as const;

// Equipo — fallback si la tabla `equipo` está vacía. Editable desde /admin/equipo.
export const EQUIPO_FALLBACK = [
  {
    id: "ruben-pierattini",
    nombre: "Rubén Pierattini",
    cargo: "CEO",
    email: "ruben.pierattini@fenice.cl",
    foto_url: "",
    bio: "Lidera la dirección estratégica y comercial de Fenice SPA, asegurando que cada operación de abastecimiento de combustible cumpla los más altos estándares de servicio, seguridad y confiabilidad.",
    orden: 1,
  },
  {
    id: "cecilia-moya",
    nombre: "Cecilia Moya",
    cargo: "Ejecutiva de Negocios",
    email: "cecilia.moya@fenice.cl",
    foto_url: "",
    bio: "Gestiona la relación comercial con empresas, faenas y flotas: cotizaciones, contratos de suministro y acompañamiento permanente a cada cliente para asegurar continuidad operacional.",
    orden: 2,
  },
  {
    id: "erika-pierattini",
    nombre: "Erika Pierattini",
    cargo: "Gerente de Administración y Finanzas",
    email: "erika.pierattini@fenice.cl",
    foto_url: "",
    bio: "Responsable de la gestión administrativa y financiera: facturación electrónica, respaldo documental y procesos claros que dan confianza y trazabilidad a cada despacho.",
    orden: 3,
  },
] as const;

// Certificaciones y cumplimiento normativo
export const CERTIFICACIONES = [
  {
    sigla: "SEC",
    titulo: "Estanques con respaldo técnico",
    descripcion:
      "Trabajamos con estanques que cuentan con los certificados de fabricación o inspección aplicables y documentación técnica verificable.",
  },
  {
    sigla: "TC4",
    titulo: "TC4 para instalaciones",
    descripcion:
      "Gestionamos la declaración de instalaciones de combustibles líquidos mediante el trámite TC4, cuando corresponde.",
  },
  {
    sigla: "TC10A",
    titulo: "TC10A para camiones estanque",
    descripcion:
      "Nuestra flota mantiene la declaración TC10A y la documentación técnica aplicable a camiones tanque.",
  },
  {
    sigla: "DS 160",
    titulo: "Cumplimiento DS 160",
    descripcion:
      "Cumplimos el Decreto Supremo 160 y la normativa de transporte de carga peligrosa en cada despacho de petróleo diesel.",
  },
] as const;

export function whatsappUrl(mensaje?: string) {
  const base = `https://wa.me/${SITE_CONFIG.whatsapp_numero}`;
  if (mensaje) return `${base}?text=${encodeURIComponent(mensaje)}`;
  return base;
}
