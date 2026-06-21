// Fallback config — overridden at runtime by configuracion_sitio table values
export const SITE_CONFIG = {
  nombre: "Fenice SPA",
  razon_social: "Sociedad Fenice SPA",
  whatsapp_numero: "56939579658",
  telefono: "+56939579658",
  email: "Erika.pierattini@fenicespa.cl",
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

export function whatsappUrl(mensaje?: string) {
  const base = `https://wa.me/${SITE_CONFIG.whatsapp_numero}`;
  if (mensaje) return `${base}?text=${encodeURIComponent(mensaje)}`;
  return base;
}
