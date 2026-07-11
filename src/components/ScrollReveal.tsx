"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Observador global de scroll-reveal.
 * Las páginas (server components) solo marcan elementos con `data-reveal`
 * (variantes: "up" | "left" | "right" | "zoom") y opcionalmente
 * `data-reveal-delay="150"` (ms). Este componente los anima al entrar en viewport.
 *
 * Los estilos viven en globals.css y solo se activan cuando <html> recibe
 * la clase `reveal-ready`, de modo que sin JS el contenido siempre es visible
 * (crítico para SEO y accesibilidad).
 */
export default function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || typeof IntersectionObserver === "undefined") return;

    document.documentElement.classList.add("reveal-ready");

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const delay = el.dataset.revealDelay;
            if (delay) el.style.transitionDelay = `${delay}ms`;
            el.classList.add("is-revealed");
            observer.unobserve(el);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );

    const scan = () => {
      document
        .querySelectorAll<HTMLElement>("[data-reveal]:not(.is-revealed)")
        .forEach((el) => observer.observe(el));
    };

    scan();

    // Contenido que llega después (navegación, streaming, ISR): re-escanear.
    const mutations = new MutationObserver(() => scan());
    mutations.observe(document.body, { childList: true, subtree: true });

    return () => {
      mutations.disconnect();
      observer.disconnect();
    };
  }, [pathname]);

  return null;
}
