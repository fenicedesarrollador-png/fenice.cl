"use client";

import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";

/* ============================================================
   Gráficos del panel admin — tema dark Fenice.
   Paleta categórica validada (CVD-safe sobre #0d1626), orden fijo:
   verde → ámbar → azul → rosa. Más de 4 categorías se agrupan en "Otros".
   ============================================================ */

export const CHART_PALETTE = ["#27a95d", "#c4820c", "#5f8ceb", "#d8639c"] as const;
const SURFACE = "#0d1626";
const GRID = "rgba(255,255,255,0.07)";
const AXIS = "#5f739a";

const TOOLTIP_STYLE = {
  background: "#111d31",
  border: "1px solid rgba(255,255,255,0.14)",
  borderRadius: "0.75rem",
  color: "#e8eef7",
  fontSize: "12px",
  padding: "8px 12px",
} as const;

/* ---------- Contenedor de gráfico ---------- */
export function ChartCard({
  title,
  subtitle,
  children,
  actions,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <div className="admin-card p-5 overflow-hidden">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h2 className="text-sm font-black text-[#e8eef7]">{title}</h2>
          {subtitle && <p className="text-[11.5px] text-[#94a7c2] mt-0.5">{subtitle}</p>}
        </div>
        {actions}
      </div>
      {children}
    </div>
  );
}

export function ChartEmpty({ label = "Aún no hay datos para este período." }: { label?: string }) {
  return (
    <div className="rounded-xl border border-dashed border-white/12 bg-white/[0.02] px-5 py-10 text-center text-[12.5px] text-[#94a7c2]">
      {label}
    </div>
  );
}

/* ---------- Tendencia diaria (área, 1–2 series) ---------- */
export type TrendPoint = { fecha: string; [serie: string]: string | number };

export function TrendChart({
  data,
  series,
  height = 260,
}: {
  data: TrendPoint[];
  series: { key: string; label: string }[];
  height?: number;
}) {
  const hasData = data.some((d) => series.some((s) => Number(d[s.key]) > 0));
  if (!hasData) return <ChartEmpty />;

  return (
    <div>
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 6, right: 8, left: -18, bottom: 0 }}>
            <defs>
              {series.map((s, i) => (
                <linearGradient key={s.key} id={`grad-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={CHART_PALETTE[i]} stopOpacity={0.28} />
                  <stop offset="100%" stopColor={CHART_PALETTE[i]} stopOpacity={0.02} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={GRID} vertical={false} />
            <XAxis dataKey="fecha" stroke={AXIS} tick={{ fontSize: 10.5 }} tickLine={false} axisLine={{ stroke: GRID }} minTickGap={24} />
            <YAxis stroke={AXIS} tick={{ fontSize: 10.5 }} tickLine={false} axisLine={false} allowDecimals={false} width={42} />
            <Tooltip contentStyle={TOOLTIP_STYLE} labelStyle={{ color: "#94a7c2", fontWeight: 700 }} cursor={{ stroke: "rgba(255,255,255,0.18)", strokeWidth: 1 }} />
            {series.map((s, i) => (
              <Area
                key={s.key}
                type="monotone"
                dataKey={s.key}
                name={s.label}
                stroke={CHART_PALETTE[i]}
                strokeWidth={2}
                fill={`url(#grad-${s.key})`}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 2, stroke: SURFACE }}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
      {series.length > 1 && (
        <div className="flex flex-wrap gap-x-5 gap-y-1.5 mt-3 px-1">
          {series.map((s, i) => (
            <span key={s.key} className="inline-flex items-center gap-2 text-[11.5px] font-semibold text-[#94a7c2]">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: CHART_PALETTE[i] }} />
              {s.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------- Distribución (donut + leyenda con valores) ---------- */
export type DonutDatum = { label: string; value: number };

/** Agrupa a máximo 4 categorías: las menores se pliegan en "Otros". */
export function foldDonut(data: DonutDatum[], max = 4): DonutDatum[] {
  const sorted = [...data].sort((a, b) => b.value - a.value);
  if (sorted.length <= max) return sorted;
  const top = sorted.slice(0, max - 1);
  const resto = sorted.slice(max - 1).reduce((acc, d) => acc + d.value, 0);
  return [...top, { label: "Otros", value: resto }];
}

export function DonutChart({ data, height = 210 }: { data: DonutDatum[]; height?: number }) {
  const folded = foldDonut(data.filter((d) => d.value > 0));
  const total = folded.reduce((acc, d) => acc + d.value, 0);
  if (total === 0) return <ChartEmpty />;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4">
      <div className="relative shrink-0" style={{ width: height, height }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip
              contentStyle={TOOLTIP_STYLE}
              formatter={(value, name) => {
                const v = Number(value);
                return [`${v} (${Math.round((v / total) * 100)}%)`, String(name)];
              }}
            />
            <Pie
              data={folded}
              dataKey="value"
              nameKey="label"
              innerRadius="62%"
              outerRadius="94%"
              paddingAngle={2}
              stroke={SURFACE}
              strokeWidth={2}
            >
              {folded.map((d, i) => (
                <Cell key={d.label} fill={CHART_PALETTE[i] ?? CHART_PALETTE[3]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <p className="text-[22px] leading-none font-black text-[#e8eef7] tabular-nums">{total}</p>
          <p className="text-[9.5px] text-[#5f739a] font-bold uppercase tracking-wide mt-1">Total</p>
        </div>
      </div>
      <ul className="flex-1 w-full space-y-2 min-w-0">
        {folded.map((d, i) => (
          <li key={d.label} className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: CHART_PALETTE[i] ?? CHART_PALETTE[3] }} />
            <span className="flex-1 text-[12px] font-semibold text-[#cdd9ea] truncate" title={d.label}>{d.label}</span>
            <span className="text-[12px] font-black text-[#e8eef7] tabular-nums">{d.value}</span>
            <span className="text-[10.5px] text-[#5f739a] tabular-nums w-9 text-right">{Math.round((d.value / total) * 100)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- Ranking horizontal (una medida → un solo tono) ---------- */
export type RankDatum = { label: string; value: number };

export function RankBars({ data, height, color = CHART_PALETTE[0] }: { data: RankDatum[]; height?: number; color?: string }) {
  const items = data.filter((d) => d.value > 0).slice(0, 7);
  if (items.length === 0) return <ChartEmpty />;
  const h = height ?? Math.max(items.length * 38 + 12, 120);

  return (
    <div style={{ height: h }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={items} layout="vertical" margin={{ top: 0, right: 34, left: 0, bottom: 0 }} barCategoryGap="32%">
          <CartesianGrid strokeDasharray="3 3" stroke={GRID} horizontal={false} />
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="label"
            width={132}
            stroke={AXIS}
            tick={{ fontSize: 11, fill: "#cdd9ea" }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v: string) => (v.length > 18 ? `${v.slice(0, 17)}…` : v)}
          />
          <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
          <Bar dataKey="value" name="Solicitudes" fill={color} radius={[0, 4, 4, 0]} maxBarSize={14} label={{ position: "right", fill: "#94a7c2", fontSize: 11, fontWeight: 700 }} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
