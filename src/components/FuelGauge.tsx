"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const STATS = [
  { label: "Comunas atendidas", value: 12, suffix: "+", color: "#f5a623" },
  { label: "Años de experiencia", value: 8, suffix: "+", color: "#1a6b3c" },
  { label: "Clientes activos", value: 200, suffix: "+", color: "#f5a623" },
  { label: "Despachos mensuales", value: 500, suffix: "+", color: "#1a6b3c" },
];

function useCountUp(target: number, active: boolean, duration = 1600) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start: number | null = null;
    const raf = requestAnimationFrame(function step(ts) {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    });
    return () => cancelAnimationFrame(raf);
  }, [active, target, duration]);
  return count;
}

function GaugeArc({ pct, color }: { pct: number; color: string }) {
  const R = 80;
  const cx = 100;
  const cy = 100;
  const total = Math.PI * R;
  const dash = (pct / 100) * total;
  const gap = total - dash;

  const angle = Math.PI - (pct / 100) * Math.PI;
  const nx = cx + R * Math.cos(angle);
  const ny = cy - R * Math.sin(angle);

  return (
    <svg viewBox="0 0 200 110" className="w-full" aria-hidden="true">
      {/* Glow filter */}
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Track */}
      <path
        d={`M ${cx - R} ${cy} A ${R} ${R} 0 0 1 ${cx + R} ${cy}`}
        fill="none"
        stroke="#e2e8f0"
        strokeWidth="14"
        strokeLinecap="round"
      />

      {/* Fill arc */}
      <path
        d={`M ${cx - R} ${cy} A ${R} ${R} 0 0 1 ${cx + R} ${cy}`}
        fill="none"
        stroke={color}
        strokeWidth="14"
        strokeLinecap="round"
        strokeDasharray={`${dash} ${gap + 0.1}`}
        filter="url(#glow)"
        style={{ transition: "stroke-dasharray 0.12s ease-out, stroke 0.4s ease" }}
      />

      {/* Needle dot */}
      <circle
        cx={nx}
        cy={ny}
        r="9"
        fill={color}
        stroke="white"
        strokeWidth="3"
        filter="url(#glow)"
        style={{ transition: "cx 0.12s ease-out, cy 0.12s ease-out, fill 0.4s ease" }}
      />

      {/* Center hub */}
      <circle cx={cx} cy={cy} r="5" fill="white" stroke="#e2e8f0" strokeWidth="2" />
    </svg>
  );
}

function AnimatedStat({ stat, active, delay }: { stat: typeof STATS[0]; active: boolean; delay: number }) {
  const [started, setStarted] = useState(false);
  const count = useCountUp(stat.value, started);
  useEffect(() => {
    if (!active) return;
    const t = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(t);
  }, [active, delay]);
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-3xl font-black leading-none tabular-nums" style={{ color: stat.color }}>
        {count}{stat.suffix}
      </span>
      <span className="text-xs text-slate-400 text-center leading-tight">{stat.label}</span>
    </div>
  );
}

export default function FuelGauge() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [level, setLevel] = useState(0);
  const [statsActive, setStatsActive] = useState(false);
  const rafRef = useRef<number | null>(null);
  const levelRef = useRef(0);

  // Scroll-driven: map section's position in viewport to 0-100%
  const onScroll = useCallback(() => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const vh = window.innerHeight;

    // Section enters from bottom (rect.bottom = vh) → exits top (rect.top = 0)
    // Map: bottom touching viewport bottom → 0%, top at 30% of viewport → 100%
    const start = vh;                  // element bottom at viewport bottom
    const end = vh * 0.15;            // element top at 15% from top = full

    // Use the center of the section for a smoother feel
    const sectionCenter = rect.top + rect.height / 2;
    const raw = 1 - (sectionCenter - end) / (start - end);
    const clamped = Math.max(0, Math.min(1, raw));
    const target = Math.round(clamped * 100);

    // Smooth with RAF
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      levelRef.current = target;
      setLevel(target);
      if (target > 30) setStatsActive(true);
    });
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // run once on mount
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [onScroll]);

  const gaugeColor =
    level < 25 ? "#ef4444"
    : level < 50 ? "#f5a623"
    : "#1a6b3c";

  const statusLabel =
    level === 0 ? "Esperando carga…"
    : level < 25 ? "Nivel crítico — ¡despacho urgente!"
    : level < 50 ? "Nivel bajo — solicita reposición"
    : level < 80 ? "Nivel operativo — abastecido"
    : level < 100 ? "Tanque lleno — operación asegurada"
    : "¡100% — listo para operar!";

  return (
    <div ref={sectionRef} className="flex flex-col items-center gap-5 select-none">

      {/* Gauge */}
      <div className="relative w-full max-w-[280px]">
        <GaugeArc pct={level} color={gaugeColor} />

        {/* Center readout */}
        <div className="absolute bottom-3 left-0 right-0 flex flex-col items-center pointer-events-none">
          <span
            className="text-5xl font-black tabular-nums leading-none"
            style={{ color: gaugeColor, transition: "color 0.4s ease" }}
          >
            {level}
            <span className="text-2xl font-bold">%</span>
          </span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">
            Nivel de combustible
          </span>
        </div>

        {/* Scale labels */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between px-1">
          <span className="text-[10px] font-bold text-red-400">0</span>
          <span className="text-[10px] font-bold text-slate-300">50</span>
          <span className="text-[10px] font-bold text-green-500">100</span>
        </div>
      </div>

      {/* Status chip */}
      <div
        className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold border"
        style={{
          background: `${gaugeColor}15`,
          borderColor: `${gaugeColor}35`,
          color: gaugeColor,
          transition: "background 0.4s ease, border-color 0.4s ease, color 0.4s ease",
        }}
      >
        <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: gaugeColor }} />
        {statusLabel}
      </div>

      {/* Hint */}
      <p className="text-[10px] text-slate-400 text-center">
        ↕ El nivel sube y baja al hacer scroll
      </p>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-x-8 gap-y-4 pt-4 border-t border-slate-100 w-full mt-1">
        {STATS.map((s, i) => (
          <AnimatedStat key={s.label} stat={s} active={statsActive} delay={i * 150} />
        ))}
      </div>
    </div>
  );
}
