"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { isSafeHttpUrl, resolveAltText, type PublicCollaborator } from "@/lib/collaborators";

/**
 * Carrusel de logos con desplazamiento automático continuo.
 *
 * Implementado sobre un contenedor con scroll nativo (`overflow-x: auto`) más
 * un bucle de requestAnimationFrame que avanza `scrollLeft`. Sin dependencias
 * externas, y a cambio se obtiene:
 *   · loop infinito sin saltos (se envuelve el scroll al ancho de una copia)
 *   · swipe táctil y desplazamiento manual nativos del navegador
 *   · pausa al pasar el mouse y al interactuar (touch, rueda, teclado)
 *   · respeto de `prefers-reduced-motion`
 *   · animación detenida cuando la sección no está en pantalla
 */

/** Velocidad del carrusel en px/segundo — ritmo corporativo, sin prisa. */
const SPEED_PX_PER_SECOND = 32;
/** Tiempo que permanece pausado tras la última interacción puntual. */
const RESUME_DELAY_MS = 2200;

export default function CollaboratorsCarouselClient({
  collaborators,
}: {
  collaborators: PublicCollaborator[];
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const setRef = useRef<HTMLUListElement>(null);

  // Nº de copias de la lista renderizadas. Se ajusta tras medir para que el
  // carril siempre sea más ancho que el visor + una copia completa; así el
  // "wrap" nunca deja hueco, ni siquiera con un único colaborador.
  const [copies, setCopies] = useState(2);
  const [reduceMotion, setReduceMotion] = useState(false);

  const setWidthRef = useRef(0);
  const pausedUntilRef = useRef(0);
  const hoveringRef = useRef(false);
  const visibleRef = useRef(true);
  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef(0);
  // Distingue el scroll que provocamos nosotros del que hace el usuario.
  const selfScrollRef = useRef(false);

  /* ---------- prefers-reduced-motion ---------- */
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduceMotion(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  /* ---------- medir y decidir cuántas copias hacen falta ---------- */
  const measure = useCallback(() => {
    const scroller = scrollerRef.current;
    const set = setRef.current;
    if (!scroller || !set) return;

    // El <ul> lleva un padding-end igual al gap, de modo que su ancho ya
    // incluye la separación con la copia siguiente: el patrón se repite
    // exactamente cada `setWidth` píxeles.
    const width = set.getBoundingClientRect().width;
    setWidthRef.current = width;

    if (width > 0) {
      const needed = Math.ceil(scroller.clientWidth / width) + 1;
      setCopies((prev) => (Math.max(2, needed) === prev ? prev : Math.max(2, needed)));
    }
  }, []);

  useLayoutEffect(() => {
    measure();
    const scroller = scrollerRef.current;
    if (!scroller || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => measure());
    ro.observe(scroller);
    if (setRef.current) ro.observe(setRef.current);
    return () => ro.disconnect();
  }, [measure, collaborators.length]);

  /* ---------- pausa temporal por interacción puntual ---------- */
  const pause = useCallback(() => {
    pausedUntilRef.current = Date.now() + RESUME_DELAY_MS;
  }, []);

  /* ---------- pausa mientras la sección no está en pantalla ---------- */
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => { visibleRef.current = entry.isIntersecting; },
      { threshold: 0 },
    );
    io.observe(scroller);
    return () => io.disconnect();
  }, []);

  /* ---------- bucle de animación + envoltura infinita ---------- */
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    // Mantiene scrollLeft dentro de [0, anchoDeUnaCopia). El contenido es
    // idéntico cada `setWidth` px, así que el salto resulta invisible.
    const wrap = () => {
      const w = setWidthRef.current;
      if (w <= 0) return;
      if (scroller.scrollLeft >= w) {
        selfScrollRef.current = true;
        scroller.scrollLeft -= w;
      } else if (scroller.scrollLeft < 0) {
        selfScrollRef.current = true;
        scroller.scrollLeft += w;
      }
    };

    const onScroll = () => {
      // Scroll no provocado por el bucle ⇒ lo movió el usuario: pausar.
      if (selfScrollRef.current) selfScrollRef.current = false;
      else pause();
      wrap();
    };
    scroller.addEventListener("scroll", onScroll, { passive: true });

    if (reduceMotion) {
      return () => scroller.removeEventListener("scroll", onScroll);
    }

    const step = (ts: number) => {
      rafRef.current = requestAnimationFrame(step);
      const last = lastTsRef.current || ts;
      // Delta acotado: una pestaña en segundo plano no debe provocar un salto.
      const dt = Math.min(64, ts - last);
      lastTsRef.current = ts;

      if (!visibleRef.current || hoveringRef.current) return;
      if (Date.now() < pausedUntilRef.current) return;
      if (setWidthRef.current <= 0) return;

      selfScrollRef.current = true;
      scroller.scrollLeft += (SPEED_PX_PER_SECOND * dt) / 1000;
      wrap();
    };

    rafRef.current = requestAnimationFrame(step);
    return () => {
      scroller.removeEventListener("scroll", onScroll);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastTsRef.current = 0;
    };
  }, [reduceMotion, pause, copies]);

  if (collaborators.length === 0) return null;

  const sets = reduceMotion ? 1 : copies;

  return (
    <div className="relative">
      {/* Difuminado en los bordes: sugiere continuidad sin cortar en seco. */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-slate-50 to-transparent sm:w-20"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-slate-50 to-transparent sm:w-20"
        aria-hidden="true"
      />

      <div
        ref={scrollerRef}
        onPointerEnter={(e) => { if (e.pointerType === "mouse") hoveringRef.current = true; }}
        onPointerLeave={(e) => { if (e.pointerType === "mouse") hoveringRef.current = false; }}
        onPointerDown={pause}
        onTouchStart={pause}
        onWheel={pause}
        onFocusCapture={pause}
        className="scrollbar-none overflow-x-auto overscroll-x-contain px-4 py-2 sm:px-6 lg:px-8"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <div className={reduceMotion ? "flex flex-wrap justify-center gap-4" : "flex w-max"}>
          {Array.from({ length: sets }).map((_, copy) => (
            <ul
              key={copy}
              ref={copy === 0 ? setRef : undefined}
              // Sólo la primera copia se expone a lectores de pantalla y al
              // orden de tabulación; el resto es relleno visual del loop.
              aria-hidden={copy > 0 ? "true" : undefined}
              className={
                reduceMotion
                  ? "contents"
                  : // `pe-*` iguala el gap para que el patrón se repita exactamente cada
                    // `setWidth` px y la costura del loop sea invisible.
                    "flex list-none gap-4 pe-4 sm:gap-5 sm:pe-5 lg:gap-6 lg:pe-6"
              }
            >
              {collaborators.map((c) => (
                <CollaboratorCard
                  key={`${copy}-${c.id}`}
                  collaborator={c}
                  interactive={copy === 0}
                />
              ))}
            </ul>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   Tarjeta de logo
   ============================================================ */

// Anchos fijos por breakpoint: ~2 logos en móvil, 3-5 en tablet y 5-7 en
// escritorio (contenedor max-w-7xl). Alto fijo ⇒ sin CLS, y tarjetas
// visualmente uniformes aunque los logos tengan proporciones distintas.
const CARD =
  "flex h-[104px] w-[136px] shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-[0_1px_2px_rgba(10,22,40,0.04)] transition-all duration-300 sm:h-[116px] sm:w-[158px] sm:px-6 lg:h-[124px] lg:w-[172px] " +
  "hover:-translate-y-1 hover:border-[#1a6b3c]/30 hover:shadow-[0_10px_24px_-12px_rgba(10,22,40,0.28)] focus-visible:-translate-y-1 focus-visible:border-[#1a6b3c]/40";

// Escala de grises discreta que recupera el color al enfocar/pasar el mouse.
const LOGO =
  "max-h-full max-w-full object-contain opacity-70 grayscale transition-all duration-300 group-hover:opacity-100 group-hover:grayscale-0 group-focus-visible:opacity-100 group-focus-visible:grayscale-0";

function CollaboratorCard({
  collaborator: c,
  interactive,
}: {
  collaborator: PublicCollaborator;
  interactive: boolean;
}) {
  const alt = resolveAltText(c.name, c.alt_text);
  // Sin URL válida ⇒ no se genera enlace (y nunca para esquemas no http/https).
  const linkable = interactive && isSafeHttpUrl(c.website_url);

  const logo = (
    /* eslint-disable-next-line @next/next/no-img-element -- logo servido desde Storage y ya optimizado a WebP en la subida; el <img> nativo preserva la transparencia del logo */
    <img
      src={c.logo_url}
      alt={interactive ? alt : ""}
      width={172}
      height={92}
      loading="lazy"
      decoding="async"
      draggable={false}
      className={LOGO}
    />
  );

  return (
    <li className="list-none">
      {linkable ? (
        <a
          href={c.website_url as string}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Visitar sitio web de ${c.name}`}
          data-analytics-id="colaborador_logo"
          data-analytics-label={c.name}
          className={`group ${CARD}`}
        >
          {logo}
        </a>
      ) : (
        <div className={`group ${CARD}`} title={interactive ? c.name : undefined}>
          {logo}
        </div>
      )}
    </li>
  );
}
