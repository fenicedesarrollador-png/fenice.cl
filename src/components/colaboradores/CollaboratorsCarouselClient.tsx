"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { isSafeHttpUrl, resolveAltText, type PublicCollaborator } from "@/lib/collaborators";

/**
 * Carrusel de logos de colaboradores.
 *
 * Tiene dos modos, decididos midiendo el contenido real:
 *
 * · «fijo»: los logos caben en el ancho disponible. Se muestran centrados,
 *   una sola vez y sin animación. Es el caso de 1–5 colaboradores: repetir
 *   los mismos logos para rellenar la fila se ve como un error, no como un
 *   carrusel.
 *
 * · «marquee»: los logos desbordan. Se duplican las veces necesarias para
 *   cubrir el visor más una copia completa y se desplazan en bucle continuo.
 *
 * El desplazamiento se apoya en un contenedor con scroll nativo, así que el
 * swipe táctil y el arrastre manual funcionan sin código propio.
 */

/** Velocidad del carrusel en px/segundo — ritmo corporativo, sin prisa. */
const SPEED_PX_PER_SECOND = 32;
/** Pausa tras la última interacción del usuario. */
const RESUME_DELAY_MS = 2200;

type Layout = { mode: "midiendo" | "fijo" | "marquee"; copies: number };

export default function CollaboratorsCarouselClient({
  collaborators,
}: {
  collaborators: PublicCollaborator[];
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const setRef = useRef<HTMLUListElement>(null);

  const [layout, setLayout] = useState<Layout>({ mode: "midiendo", copies: 1 });
  const [reduceMotion, setReduceMotion] = useState(false);

  /**
   * Posición del scroll en punto flotante.
   *
   * Es deliberado NO hacer `scrollLeft += delta`: a 32 px/s cada fotograma
   * avanza ~0,5 px y varios navegadores redondean `scrollLeft` a enteros al
   * almacenarlo, de modo que el incremento se pierde en cada lectura y el
   * carrusel queda inmóvil. Acumulando aparte y asignando el valor absoluto,
   * el avance es real aunque el navegador redondee al pintar.
   */
  const posRef = useRef(0);
  const setWidthRef = useRef(0);
  const pausedUntilRef = useRef(0);
  const hoveringRef = useRef(false);
  const draggingRef = useRef(false);
  const visibleRef = useRef(true);
  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef(0);

  const animated = layout.mode === "marquee" && !reduceMotion;
  // Durante la medición hay que maquetar en UNA línea: con `flex-wrap` los
  // logos bajarían de fila y jamás se detectaría el desbordamiento.
  const inline = animated || layout.mode === "midiendo";

  /* ---------- prefers-reduced-motion ---------- */
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduceMotion(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  /* ---------- medición: ¿cabe todo, o hay que hacer marquee? ---------- */
  const measure = useCallback(() => {
    const scroller = scrollerRef.current;
    const set = setRef.current;
    if (!scroller || !set) return;

    // En marquee el <ul> lleva un `pe-*` igual al gap, para que su ancho
    // incluya la separación con la copia siguiente: el patrón se repite
    // exactamente cada `setWidth` px y la costura resulta invisible. Ese
    // relleno hay que descontarlo para saber cuánto ocupan los logos de verdad.
    const setWidth = set.getBoundingClientRect().width;
    const padEnd = parseFloat(getComputedStyle(set).paddingInlineEnd || "0") || 0;
    const contentWidth = setWidth - padEnd;

    const scrollerStyle = getComputedStyle(scroller);
    const available =
      scroller.clientWidth -
      (parseFloat(scrollerStyle.paddingLeft) || 0) -
      (parseFloat(scrollerStyle.paddingRight) || 0);

    setLayout((prev) => {
      // Los logos caben enteros: se muestran una sola vez y centrados.
      // Repetirlos para rellenar la fila se lee como un error, no como un
      // carrusel.
      if (contentWidth <= 0 || contentWidth <= available + 1) {
        return prev.mode === "fijo" ? prev : { mode: "fijo", copies: 1 };
      }

      setWidthRef.current = setWidth;
      const copies = Math.max(2, Math.ceil(available / setWidth) + 1);
      if (prev.mode === "marquee" && prev.copies === copies) return prev;
      return { mode: "marquee", copies };
    });
  }, []);

  useLayoutEffect(() => {
    measure();
    const scroller = scrollerRef.current;
    if (!scroller || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => measure());
    ro.observe(scroller);
    if (setRef.current) ro.observe(setRef.current);
    return () => ro.disconnect();
  }, [measure, collaborators.length, layout.mode]);

  /* ---------- pausa por interacción explícita ---------- */
  // Se detecta con eventos de entrada reales (puntero, touch, rueda, foco) en
  // lugar de deducirla del evento `scroll`: el propio bucle genera scroll y
  // distinguir ambos por heurística acababa congelando el carrusel.
  const pause = useCallback(() => {
    pausedUntilRef.current = Date.now() + RESUME_DELAY_MS;
  }, []);

  /* ---------- no animar fuera de pantalla ---------- */
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

  /* ---------- bucle de animación ---------- */
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller || !animated) return;

    posRef.current = scroller.scrollLeft;

    const idle = () =>
      !visibleRef.current ||
      hoveringRef.current ||
      draggingRef.current ||
      Date.now() < pausedUntilRef.current;

    // Mientras manda el usuario, la posición se resincroniza desde el DOM
    // para que al reanudar no dé un salto hacia atrás.
    const onScroll = () => { if (idle()) posRef.current = scroller.scrollLeft; };
    scroller.addEventListener("scroll", onScroll, { passive: true });

    const step = (ts: number) => {
      rafRef.current = requestAnimationFrame(step);
      const last = lastTsRef.current || ts;
      // Delta acotado: al volver de una pestaña en segundo plano no debe
      // producirse un salto grande.
      const dt = Math.min(64, ts - last);
      lastTsRef.current = ts;

      const setWidth = setWidthRef.current;
      if (setWidth <= 0 || idle()) return;

      let pos = posRef.current + (SPEED_PX_PER_SECOND * dt) / 1000;
      // Envuelve al ancho de UNA copia: el contenido es idéntico cada
      // `setWidth` px, así que el salto no se ve.
      if (pos >= setWidth || pos < 0) pos = ((pos % setWidth) + setWidth) % setWidth;
      posRef.current = pos;
      scroller.scrollLeft = pos;
    };

    rafRef.current = requestAnimationFrame(step);
    return () => {
      scroller.removeEventListener("scroll", onScroll);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastTsRef.current = 0;
    };
  }, [animated, layout.copies]);

  if (collaborators.length === 0) return null;

  const sets = animated ? layout.copies : 1;

  return (
    <div className="relative">
      {/* Difuminado en los bordes: sólo tiene sentido si el contenido sigue
          más allá del borde visible. */}
      {animated && (
        <>
          <div
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-slate-50 to-transparent sm:w-20"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-slate-50 to-transparent sm:w-20"
            aria-hidden="true"
          />
        </>
      )}

      <div
        ref={scrollerRef}
        onPointerEnter={(e) => { if (e.pointerType === "mouse") hoveringRef.current = true; }}
        onPointerLeave={(e) => { if (e.pointerType === "mouse") hoveringRef.current = false; }}
        onPointerDown={() => { draggingRef.current = true; pause(); }}
        onPointerUp={() => { draggingRef.current = false; pause(); }}
        onPointerCancel={() => { draggingRef.current = false; pause(); }}
        onTouchStart={() => { draggingRef.current = true; pause(); }}
        onTouchEnd={() => { draggingRef.current = false; pause(); }}
        onWheel={pause}
        onKeyDown={pause}
        onFocusCapture={pause}
        className={`scrollbar-none overscroll-x-contain px-4 py-2 sm:px-6 lg:px-8 ${
          inline ? "overflow-x-auto" : "overflow-x-hidden"
        }`}
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <div className={inline ? "flex w-max" : "flex flex-wrap justify-center gap-4 sm:gap-5 lg:gap-6"}>
          {Array.from({ length: sets }).map((_, copy) => (
            <ul
              key={copy}
              ref={copy === 0 ? setRef : undefined}
              // Sólo la primera copia se expone a lectores de pantalla y al
              // orden de tabulación; el resto es relleno visual del bucle.
              aria-hidden={copy > 0 ? "true" : undefined}
              className={
                animated
                  ? "flex list-none gap-4 pe-4 sm:gap-5 sm:pe-5 lg:gap-6 lg:pe-6"
                  : inline
                    ? "flex list-none gap-4 sm:gap-5 lg:gap-6"
                    : "contents"
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

// Alto y ancho fijos por breakpoint: ~2 logos en móvil, 3-5 en tablet y 5-7
// en escritorio (contenedor max-w-7xl). Al reservar el espacio no hay CLS, y
// las tarjetas quedan uniformes aunque los logos tengan proporciones distintas.
const CARD =
  "flex h-[104px] w-[136px] shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-[0_1px_2px_rgba(10,22,40,0.04)] transition-all duration-300 sm:h-[116px] sm:w-[158px] sm:px-6 lg:h-[124px] lg:w-[172px] " +
  "hover:-translate-y-1 hover:border-[#1a6b3c]/30 hover:shadow-[0_10px_24px_-12px_rgba(10,22,40,0.28)] focus-visible:-translate-y-1 focus-visible:border-[#1a6b3c]/40";

// Escala de grises discreta que recupera el color al enfocar o pasar el mouse.
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
  // Sin URL válida no se genera enlace (y nunca para esquemas no http/https).
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
