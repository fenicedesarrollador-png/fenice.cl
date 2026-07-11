// Fallback config — overridden at runtime by configuracion_sitio table values
export const SITE_CONFIG = {
  nombre: "Fenice SPA",
  razon_social: "Sociedad Fenice SPA",
  whatsapp_numero: "56939579658",
  telefono: "+56939579658",
  email: "ventas@fenice.cl",
  horario: "Lun-Vie 09:00–19:00",
  direccion: "La Granja, Santiago, Región Metropolitana",
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

export const COMUNAS = [
  { nombre: "Maipú", slug: "maipu" },
  { nombre: "Pudahuel", slug: "pudahuel" },
  { nombre: "Quilicura", slug: "quilicura" },
  { nombre: "Puente Alto", slug: "puente-alto" },
  { nombre: "San Bernardo", slug: "san-bernardo" },
  { nombre: "Colina", slug: "colina" },
  { nombre: "Lampa", slug: "lampa" },
  { nombre: "Buin", slug: "buin" },
  { nombre: "Las Condes", slug: "las-condes" },
  { nombre: "Providencia", slug: "providencia" },
  { nombre: "Valparaíso", slug: "valparaiso" },
  { nombre: "Rancagua", slug: "rancagua" },
] as const;

export const SERVICIOS = [
  {
    nombre: "Petróleo a Domicilio Santiago",
    slug: "petroleo-a-domicilio-santiago",
    descripcion: "Despacho rápido de petróleo para empresas e industria en la RM.",
  },
  {
    nombre: "Transporte de Combustible RM",
    slug: "transporte-de-combustible-rm",
    descripcion: "Transporte seguro y certificado de combustible en la Región Metropolitana.",
  },
  {
    nombre: "Instalación de Estanques",
    slug: "instalacion-de-estanques",
    descripcion: "Instalación de estanques de petróleo certificados por la SEC.",
  },
] as const;

// Destinatarios de las notificaciones de cotización/contacto (Resend)
export const NOTIFY_EMAILS = [
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
    titulo: "Estanques certificados SEC",
    descripcion:
      "Trabajamos con estanques de combustible certificados por la Superintendencia de Electricidad y Combustibles, garantizando instalaciones seguras y normadas.",
  },
  {
    sigla: "TC4",
    titulo: "TC4 para instalaciones",
    descripcion:
      "Contamos con certificación TC4 para la instalación de tanques y sistemas de almacenamiento de combustibles líquidos.",
  },
  {
    sigla: "TC10A",
    titulo: "TC10A para camiones estanque",
    descripcion:
      "Nuestra flota de camiones estanque opera con certificación TC10A, exigida para el transporte de combustibles en Chile.",
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
