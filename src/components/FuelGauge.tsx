"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { CORPORATE_STATS } from "@/config/stats";

/** Detecta prefers-reduced-motion sin romper la hidratación (default false = SSR). */
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = () => setReduced(mq.matches);
    mq.addEventListener("change", handler);
    // Chequeo inicial en rAF (no síncrono en el cuerpo del effect).
    const id = requestAnimationFrame(handler);
    return () => {
      mq.removeEventListener("change", handler);
      cancelAnimationFrame(id);
    };
  }, []);
  return reduced;
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
    <svg viewBox="0 0 200 110" className="w-full" aria-hidden="true" focusable="false">
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <path
        d={`M ${cx - R} ${cy} A ${R} ${R} 0 0 1 ${cx + R} ${cy}`}
        fill="none" stroke="#e2e8f0" strokeWidth="14" strokeLinecap="round"
      />
      <path
        d={`M ${cx - R} ${cy} A ${R} ${R} 0 0 1 ${cx + R} ${cy}`}
        fill="none" stroke={color} strokeWidth="14" strokeLinecap="round"
        strokeDasharray={`${dash} ${gap + 0.1}`}
        filter="url(#glow)"
        style={{ transition: "stroke-dasharray 0.12s ease-out, stroke 0.4s ease" }}
      />
      <circle
        cx={nx} cy={ny} r="9" fill={color} stroke="white" strokeWidth="3" filter="url(#glow)"
        style={{ transition: "cx 0.12s ease-out, cy 0.12s ease-out, fill 0.4s ease" }}
      />
      <circle cx={cx} cy={cy} r="5" fill="white" stroke="#e2e8f0" strokeWidth="2" />
    </svg>
  );
}

function AnimatedStat({
  stat,
  active,
  reduced,
  delay,
}: {
  stat: (typeof CORPORATE_STATS)[number];
  active: boolean;
  reduced: boolean;
  delay: number;
}) {
  // `null` = mostrar el valor REAL (stat.display) escrito en el HTML del servidor.
  // Al entrar en viewport (active) y si se permite movimiento, se anima 0→valor.
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    if (!active || reduced) return;
    let start: number | null = null;
    let raf = 0;
    const duration = 1600;
    const begin = () => {
      raf = requestAnimationFrame(function step(ts) {
        if (start === null) start = ts;
        const progress = Math.min((ts - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setCount(Math.round(eased * stat.value));
        if (progress < 1) raf = requestAnimationFrame(step);
        else setCount(null); // vuelve al display real exacto ("320+")
      });
    };
    const t = setTimeout(begin, delay);
    return () => {
      clearTimeout(t);
      cancelAnimationFrame(raf);
    };
  }, [active, reduced, stat.value, delay]);

  // Durante la animación mostramos número + "+"; el resto del tiempo, el display real.
  const suffix = stat.display.replace(/[0-9]/g, "");
  const text = count === null ? stat.display : `${count}${suffix}`;

  return (
    <div className="flex flex-col items-center gap-1">
      <span
        data-count-to={stat.value}
        className="text-3xl font-black leading-none tabular-nums"
        style={{ color: stat.color }}
      >
        {text}
      </span>
      <span className="text-xs text-slate-400 text-center leading-tight">{stat.label}</span>
    </div>
  );
}

export default function FuelGauge() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const [level, setLevel] = useState(reduced ? 100 : 0);
  const [inView, setInView] = useState(false);
  const [statsActive, setStatsActive] = useState(false);
  const rafRef = useRef<number | null>(null);

  // Scroll → nivel 0-100 según la posición de la sección en el viewport.
  const onScroll = useCallback(() => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const vh = window.innerHeight;
    const start = vh;
    const end = vh * 0.15;
    const sectionCenter = rect.top + rect.height / 2;
    const raw = 1 - (sectionCenter - end) / (start - end);
    const target = Math.round(Math.max(0, Math.min(1, raw)) * 100);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      setLevel(target);
      if (target > 30) setStatsActive(true);
    });
  }, []);

  // IntersectionObserver: activa el trabajo SOLO cuando el medidor está en pantalla.
  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          setInView(entry.isIntersecting);
          if (entry.isIntersecting) setStatsActive(true);
        }
      },
      { threshold: 0.2 },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  // Con reduced-motion no hay animación por scroll: se muestra un nivel fijo
  // "operativo" y los contadores en su valor real, sin movimiento.
  useEffect(() => {
    if (!reduced) return;
    const id = requestAnimationFrame(() => {
      setLevel(100);
      setStatsActive(true);
    });
    return () => cancelAnimationFrame(id);
  }, [reduced]);

  // El listener de scroll (passive) solo vive mientras el medidor está en viewport
  // y no hay reduced-motion. Fuera de vista, cero trabajo en el hilo principal.
  useEffect(() => {
    if (reduced || !inView) return;
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [reduced, inView, onScroll]);

  const gaugeColor = level < 25 ? "#ef4444" : level < 50 ? "#f5a623" : "#1a6b3c";
  const statusLabel =
    level === 0 ? "Esperando carga…"
    : level < 25 ? "Nivel crítico — ¡despacho urgente!"
    : level < 50 ? "Nivel bajo — solicita reposición"
    : level < 80 ? "Nivel operativo — abastecido"
    : level < 100 ? "Tanque lleno — operación asegurada"
    : "¡100% — listo para operar!";

  return (
    <div ref={sectionRef} className="flex flex-col items-center gap-5 select-none">
      {/* Medidor semántico: legible por Google y lectores de pantalla. */}
      <div
        role="meter"
        aria-valuenow={level}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Nivel de abastecimiento de combustible"
        aria-live="off"
        className="relative w-full max-w-[280px]"
        style={{ willChange: inView ? "transform" : "auto" }}
      >
        <GaugeArc pct={level} color={gaugeColor} />
        <div className="absolute bottom-3 left-0 right-0 flex flex-col items-center pointer-events-none">
          <span className="text-5xl font-black tabular-nums leading-none" style={{ color: gaugeColor, transition: "color 0.4s ease" }}>
            {level}
            <span className="text-2xl font-bold">%</span>
          </span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">
            Nivel de combustible
          </span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 flex justify-between px-1">
          <span className="text-[10px] font-bold text-red-400">0</span>
          <span className="text-[10px] font-bold text-slate-300">50</span>
          <span className="text-[10px] font-bold text-green-500">100</span>
        </div>
      </div>

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

      <p className="text-[10px] text-slate-400 text-center">↕ El nivel sube y baja al hacer scroll</p>

      {/* Contadores: el valor real va escrito en el HTML (nunca 0 para Googlebot). */}
      <div className="grid grid-cols-2 gap-x-8 gap-y-4 pt-4 border-t border-slate-100 w-full mt-1">
        {CORPORATE_STATS.map((s, i) => (
          <AnimatedStat key={s.key} stat={s} active={statsActive} reduced={reduced} delay={i * 150} />
        ))}
      </div>

      {/* Párrafo indexable: da contexto de negocio real al bloque del medidor. */}
      <p className="text-xs text-slate-500 leading-relaxed text-center border-t border-slate-100 pt-4 mt-1">
        Monitoreamos el nivel de tus estanques certificados SEC para programar la carga
        periódica de petróleo diésel y parafina (kerosene) antes de que se agote, asegurando
        la continuidad operacional de empresas, faenas, edificios y condominios en la Región
        Metropolitana, Valparaíso y O&apos;Higgins.
      </p>
    </div>
  );
}
