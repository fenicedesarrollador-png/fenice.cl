/**
 * Agregaciones de datos para los gráficos del panel admin.
 * Todas trabajan sobre filas ya traídas de Supabase (server components).
 */

export type FechaRow = { created_at: string; [key: string]: unknown };

const DAY_MS = 86_400_000;

function dayKey(date: Date): string {
  // Clave YYYY-MM-DD en horario de Chile
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Santiago" }).format(date);
}

function dayLabel(date: Date): string {
  return new Intl.DateTimeFormat("es-CL", {
    day: "2-digit",
    month: "short",
    timeZone: "America/Santiago",
  }).format(date);
}

/** Serie diaria de conteos para los últimos `days` días (huecos rellenos con 0). */
export function dailySeries(
  datasets: { key: string; rows: FechaRow[] }[],
  days: number,
): { fecha: string; [serie: string]: string | number }[] {
  const counts: Record<string, Record<string, number>> = {};
  for (const { key, rows } of datasets) {
    counts[key] = {};
    for (const row of rows) {
      const k = dayKey(new Date(row.created_at));
      counts[key][k] = (counts[key][k] ?? 0) + 1;
    }
  }

  const out: { fecha: string; [serie: string]: string | number }[] = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today.getTime() - i * DAY_MS);
    const k = dayKey(d);
    const point: { fecha: string; [serie: string]: string | number } = { fecha: dayLabel(d) };
    for (const { key } of datasets) point[key] = counts[key][k] ?? 0;
    out.push(point);
  }
  return out;
}

/** Conteo por valor de un campo (para donuts y rankings). */
export function countBy(
  rows: Record<string, unknown>[],
  field: string,
  emptyLabel = "Sin especificar",
): { label: string; value: number }[] {
  const map = new Map<string, number>();
  for (const row of rows) {
    const raw = (row[field] as string | null | undefined)?.trim();
    const label = raw || emptyLabel;
    map.set(label, (map.get(label) ?? 0) + 1);
  }
  return [...map.entries()]
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);
}

/** Filas dentro de los últimos `days` días. */
export function inLastDays(rows: FechaRow[], days: number): FechaRow[] {
  const cutoff = Date.now() - days * DAY_MS;
  return rows.filter((r) => new Date(r.created_at).getTime() >= cutoff);
}

/** Fecha ISO de hace `days` días (para filtros .gte de Supabase). */
export function isoDaysAgo(days: number): string {
  return new Date(Date.now() - days * DAY_MS).toISOString();
}

/** Comparativa mes actual vs mes anterior (variación %). */
export function monthDelta(rows: FechaRow[]): {
  actual: number;
  anterior: number;
  deltaPct: number | null;
} {
  const now = new Date();
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
  const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).getTime();

  let actual = 0;
  let anterior = 0;
  for (const row of rows) {
    const t = new Date(row.created_at).getTime();
    if (t >= thisMonthStart) actual++;
    else if (t >= prevMonthStart) anterior++;
  }
  const deltaPct = anterior > 0 ? Math.round(((actual - anterior) / anterior) * 100) : null;
  return { actual, anterior, deltaPct };
}
