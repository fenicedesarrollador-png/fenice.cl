"use client";

import { useEffect, useRef } from "react";

/**
 * Motor de animación de la portada (sin dependencias).
 * Las secciones (server components) solo declaran atributos y este componente
 * escribe variables CSS que globals.css convierte en movimiento:
 *   data-progress="through|exit|center" → --p (0→1) según su posición en viewport.
 *   data-parallax="0.08"                → desplazamiento vertical relativo al padre (solo ≥768px).
 *   data-count="350000" data-suffix="+" → contador animado al entrar en pantalla.
 *   data-spotlight                      → --mx/--my siguen al puntero (brillo de tarjetas).
 *
 * El HTML del servidor ya trae el estado final: sin JS o con
 * prefers-reduced-motion el contenido se ve completo y estático.
 */

const clamp = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const numberFormat = new Intl.NumberFormat("es-CL");

function measure(el: HTMLElement, vh: number): number {
  const r = el.getBoundingClientRect();
  switch (el.dataset.progress) {
    case "exit":
      return clamp(-r.top / r.height);
    case "center":
      return clamp((vh * 0.6 - r.top) / r.height);
    default:
      return clamp((vh - r.top) / (vh + r.height));
  }
}

export default function HomeMotion() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || typeof IntersectionObserver === "undefined") return;

    const wide = window.matchMedia("(min-width: 768px)");
    const progressEls = Array.from(document.querySelectorAll<HTMLElement>("[data-progress]"));
    const parallaxEls = Array.from(document.querySelectorAll<HTMLElement>("[data-parallax]"));
    let frame = 0;
    const counterFrames = new Set<number>();

    const update = () => {
      frame = 0;
      const vh = window.innerHeight;
      const max = document.documentElement.scrollHeight - vh;
      barRef.current?.style.setProperty("--home-scroll", (max > 0 ? clamp(window.scrollY / max) : 0).toFixed(4));

      for (const el of progressEls) el.style.setProperty("--p", measure(el, vh).toFixed(4));

      for (const el of parallaxEls) {
        if (!wide.matches) {
          el.style.transform = "";
          continue;
        }
        // Se mide el padre (no el propio elemento) para no realimentar la transformación.
        const r = (el.parentElement ?? el).getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) continue;
        const offset = (r.top + r.height / 2 - vh / 2) * Number(el.dataset.parallax || 0);
        el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
      }
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    // Contadores: arrancan en 0 y suben con easing al entrar en pantalla.
    const counters = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          counters.unobserve(el);
          const target = Number(el.dataset.count);
          const suffix = el.dataset.suffix ?? "";
          const start = performance.now();
          let counterFrame = 0;
          const queueTick = () => {
            counterFrame = requestAnimationFrame(tick);
            counterFrames.add(counterFrame);
          };
          const tick = (now: number) => {
            counterFrames.delete(counterFrame);
            const t = clamp((now - start) / 1800);
            const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
            el.textContent = numberFormat.format(Math.round(target * eased)) + suffix;
            if (t < 1) queueTick();
          };
          queueTick();
        }
      },
      { threshold: 0.5 },
    );
    document.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => {
      el.textContent = `0${el.dataset.suffix ?? ""}`;
      counters.observe(el);
    });

    const onPointer = (e: PointerEvent) => {
      const card = (e.target as Element | null)?.closest<HTMLElement>("[data-spotlight]");
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - r.left}px`);
      card.style.setProperty("--my", `${e.clientY - r.top}px`);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    document.addEventListener("pointermove", onPointer, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      counterFrames.forEach(cancelAnimationFrame);
      counters.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      document.removeEventListener("pointermove", onPointer);
    };
  }, []);

  return <div ref={barRef} className="home-progress" aria-hidden="true" />;
}
