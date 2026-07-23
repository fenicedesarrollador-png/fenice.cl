/**
 * Cifras corporativas de Fenice SPA — FUENTE ÚNICA para contadores y textos.
 *
 * Valores CONFIRMADOS por el cliente (julio 2026). No modificar sin confirmación:
 *   - 52 comunas: cobertura total de la Región Metropolitana (dato exacto, sin "+").
 *   - 8+ años de experiencia.
 *   - 80+ clientes activos.
 *   - 50+ despachos mensuales.
 *   - 350.000+ litros de movimiento mensual.
 *
 * `value` es el número que se anima; `display` es el texto EXACTO escrito en el
 * HTML del servidor (para que Googlebot nunca indexe "0"). `suffix` es lo que se
 * agrega al número durante la animación (los miles se formatean con separador).
 */

export type StatItem = {
  key: string;
  value: number;
  suffix: string;
  display: string;
  label: string;
  color: string;
  /** Ocupa las dos columnas (para el número destacado grande). */
  full?: boolean;
};

export const CORPORATE_STATS: StatItem[] = [
  { key: "comunas", value: 52, suffix: "", display: "52", label: "Comunas de cobertura", color: "#f5a623" },
  { key: "experiencia", value: 8, suffix: "+", display: "8+", label: "Años de experiencia", color: "#1a6b3c" },
  { key: "clientes", value: 80, suffix: "+", display: "80+", label: "Clientes activos", color: "#f5a623" },
  { key: "despachos", value: 50, suffix: "+", display: "50+", label: "Despachos mensuales", color: "#1a6b3c" },
  { key: "litros", value: 350000, suffix: "+", display: "350.000+", label: "Litros de movimiento mensual", color: "#f5a623", full: true },
];

/** Total de comunas de la RM cubiertas. 12 tienen página dedicada (SEO). */
export const COMUNAS_COBERTURA_TOTAL = 52;
export const COMUNAS_CON_PAGINA = 12;
