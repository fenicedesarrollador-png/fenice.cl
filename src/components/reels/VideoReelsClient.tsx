"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Play, Pause, Volume2, VolumeX, ChevronLeft, ChevronRight, Film } from "lucide-react";

export type ReelVideo = {
  id: string;
  title: string | null;
  description: string | null;
  videoUrl: string;
  posterUrl: string | null;
  autoplay: boolean;
  loop: boolean;
};

const SOUND_KEY = "fenice-reels-sound";

export default function VideoReelsClient({ videos }: { videos: ReelVideo[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [loadedIds, setLoadedIds] = useState<Set<string>>(new Set());
  // Override manual: el usuario tocó play/pausa en una tarjeta puntual. Solo
  // aplica mientras esa tarjeta siga siendo la "activa"; al cambiar de
  // tarjeta enfocada, el override queda obsoleto automáticamente (no hace
  // falta un efecto para "resetearlo": el cálculo de abajo ya lo ignora).
  const [override, setOverride] = useState<{ id: string; playing: boolean } | null>(null);
  // Preferencia de sonido: lectura perezosa de sessionStorage durante el
  // primer render (no en un efecto) para no disparar un setState extra.
  const [soundOn, setSoundOn] = useState(() => typeof window !== "undefined" && sessionStorage.getItem(SOUND_KEY) === "on");

  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const videoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());
  const ratiosRef = useRef<Map<string, number>>(new Map());

  // Video que debería reproducirse por defecto: la tarjeta enfocada, solo si
  // esa tarjeta tiene autoplay activado. Calculado en cada render (sin
  // efecto) a partir de activeId + videos.
  const defaultPlayingId = (() => {
    if (!activeId) return null;
    const video = videos.find((v) => v.id === activeId);
    return video?.autoplay ? activeId : null;
  })();
  const effectivePlayingId = override && override.id === activeId ? (override.playing ? override.id : null) : defaultPlayingId;

  // Observadores: uno decide cuándo "acercar" (cargar) el <video>, otro cuál
  // tarjeta está más visible para decidir cuál reproducir automáticamente.
  // Los setState ocurren dentro de los callbacks de los observers (eventos
  // externos asíncronos), no de forma síncrona en el cuerpo del efecto.
  useEffect(() => {
    const loadObserver = new IntersectionObserver(
      (entries) => {
        const newlyVisible = entries.filter((e) => e.isIntersecting).map((e) => e.target.getAttribute("data-reel-id")).filter((id): id is string => !!id);
        if (newlyVisible.length === 0) return;
        setLoadedIds((prev) => {
          const next = new Set(prev);
          let changed = false;
          for (const id of newlyVisible) if (!next.has(id)) { next.add(id); changed = true; }
          return changed ? next : prev;
        });
      },
      { rootMargin: "600px 0px", threshold: 0 },
    );

    const playObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.getAttribute("data-reel-id");
          if (id) ratiosRef.current.set(id, entry.intersectionRatio);
        }
        let bestId: string | null = null;
        let bestRatio = 0.5;
        ratiosRef.current.forEach((ratio, id) => {
          if (ratio >= bestRatio) { bestRatio = ratio; bestId = id; }
        });
        setActiveId(bestId);
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] },
    );

    cardRefs.current.forEach((el) => { loadObserver.observe(el); playObserver.observe(el); });
    return () => { loadObserver.disconnect(); playObserver.disconnect(); };
  }, [videos]);

  // Aplica play/pause reales sobre los elementos <video> (sincroniza con el
  // DOM, sin llamar setState: es exactamente para esto que sirve un efecto).
  useEffect(() => {
    videoRefs.current.forEach((el, id) => {
      if (id === effectivePlayingId) {
        el.muted = !soundOn;
        const p = el.play();
        if (p && typeof p.catch === "function") p.catch(() => {});
      } else if (!el.paused) {
        el.pause();
      }
    });
  }, [effectivePlayingId, soundOn]);

  const toggleSound = useCallback(() => {
    setSoundOn((prev) => {
      const next = !prev;
      sessionStorage.setItem(SOUND_KEY, next ? "on" : "off");
      return next;
    });
  }, []);

  function togglePlay(id: string) {
    setOverride({ id, playing: id !== effectivePlayingId });
  }

  function scrollByCard(dir: 1 | -1) {
    trackRef.current?.scrollBy({ left: dir * 260, behavior: "smooth" });
  }

  return (
    <div className="relative">
      {/* Flechas de navegación — solo escritorio */}
      <button
        type="button"
        onClick={() => scrollByCard(-1)}
        aria-label="Ver videos anteriores"
        className="hidden lg:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg border border-slate-200 items-center justify-center text-[#0a1628] hover:bg-slate-50 transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        type="button"
        onClick={() => scrollByCard(1)}
        aria-label="Ver más videos"
        className="hidden lg:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg border border-slate-200 items-center justify-center text-[#0a1628] hover:bg-slate-50 transition-colors"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      <div
        ref={trackRef}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 px-1 scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {videos.map((video) => (
          <ReelCard
            key={video.id}
            video={video}
            loaded={loadedIds.has(video.id)}
            playing={effectivePlayingId === video.id}
            soundOn={soundOn}
            onRegisterCard={(el) => { if (el) cardRefs.current.set(video.id, el); else cardRefs.current.delete(video.id); }}
            onRegisterVideo={(el) => { if (el) videoRefs.current.set(video.id, el); else videoRefs.current.delete(video.id); }}
            onTogglePlay={() => togglePlay(video.id)}
            onToggleSound={toggleSound}
          />
        ))}
      </div>
    </div>
  );
}

function ReelCard({
  video, loaded, playing, soundOn, onRegisterCard, onRegisterVideo, onTogglePlay, onToggleSound,
}: {
  video: ReelVideo;
  loaded: boolean;
  playing: boolean;
  soundOn: boolean;
  onRegisterCard: (el: HTMLDivElement | null) => void;
  onRegisterVideo: (el: HTMLVideoElement | null) => void;
  onTogglePlay: () => void;
  onToggleSound: () => void;
}) {
  return (
    <div
      ref={onRegisterCard}
      data-reel-id={video.id}
      className="relative shrink-0 w-[210px] sm:w-[240px] aspect-[9/16] snap-center rounded-2xl overflow-hidden bg-slate-900 shadow-lg ring-1 ring-black/5"
    >
      {!loaded && (
        video.posterUrl ? (
          <Image src={video.posterUrl} alt={video.title ?? "Video de la operación de Fenice SPA"} fill sizes="240px" className="object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
            <Film className="w-10 h-10 text-white/20" />
          </div>
        )
      )}

      {loaded && (
        <video
          ref={onRegisterVideo}
          src={video.videoUrl}
          poster={video.posterUrl ?? undefined}
          muted={!soundOn}
          playsInline
          loop={video.loop}
          preload="none"
          onClick={onTogglePlay}
          className="absolute inset-0 w-full h-full object-cover cursor-pointer"
        />
      )}

      {/* Scrim + título */}
      {(video.title || video.description) && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0a1628]/90 via-[#0a1628]/20 to-transparent p-3 pt-10">
          {video.title && <p className="text-white text-[13px] font-bold leading-snug">{video.title}</p>}
          {video.description && <p className="text-slate-200 text-[11px] leading-snug line-clamp-2 mt-0.5">{video.description}</p>}
        </div>
      )}

      {/* Botón reproducir/pausar */}
      <button
        type="button"
        onClick={onTogglePlay}
        aria-label={playing ? "Pausar video" : "Reproducir video"}
        className={`absolute inset-0 flex items-center justify-center transition-opacity ${playing ? "opacity-0 hover:opacity-100" : "opacity-100"}`}
      >
        <span className="w-12 h-12 rounded-full bg-black/45 backdrop-blur-sm flex items-center justify-center">
          {playing ? <Pause className="w-5 h-5 text-white" fill="currentColor" /> : <Play className="w-5 h-5 text-white ml-0.5" fill="currentColor" />}
        </span>
      </button>

      {/* Botón de sonido — global, visible en cada tarjeta. suppressHydrationWarning:
          el estado inicial se lee de sessionStorage (solo disponible en cliente),
          por lo que puede diferir del render de servidor en la primera pintura. */}
      <button
        type="button"
        onClick={onToggleSound}
        aria-label={soundOn ? "Silenciar videos" : "Activar sonido"}
        suppressHydrationWarning
        className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-black/45 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-colors"
      >
        {soundOn ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
}
