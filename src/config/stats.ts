/**
 * Cifras corporativas de Fenice SPA — FUENTE ÚNICA para contadores y textos.
 *
 * Valores CONFIRMADOS por el cliente (julio 2026). No modificar sin confirmación:
 *   - 52 comunas: cobertura total de la Región Metropolitana (dato exacto, sin "+").
 *   - 8+ años de experiencia.
 *   - 320+ clientes activos.
 *   - ~640 despachos mensuales (aproximado).
 *
 * `value` es el número que se anima; `display` es el texto EXACTO que va escrito
 * en el HTML del servidor (para que Googlebot nunca indexe "0"). `srLabel` es el
 * texto accesible completo.
 */

export type StatItem = {
  key: string;
  value: number;
  display: string;
  label: string;
  color: string;
};

export const CORPORATE_STATS: StatItem[] = [
  { key: "comunas", value: 52, display: "52", label: "Comunas de cobertura", color: "#f5a623" },
  { key: "experiencia", value: 8, display: "8+", label: "Años de experiencia", color: "#1a6b3c" },
  { key: "clientes", value: 320, display: "320+", label: "Clientes activos", color: "#f5a623" },
  { key: "despachos", value: 640, display: "640+", label: "Despachos mensuales", color: "#1a6b3c" },
];

/** Total de comunas de la RM cubiertas. 12 tienen página dedicada (SEO). */
export const COMUNAS_COBERTURA_TOTAL = 52;
export const COMUNAS_CON_PAGINA = 12;
