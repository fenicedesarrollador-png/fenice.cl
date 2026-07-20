import { Clapperboard, Film, AlertTriangle } from "lucide-react";
import { createClient } from "@/lib/supabase/public";
import { hasUsableSupabasePublicConfig } from "@/lib/supabase/config";
import { fetchWithTimeout } from "@/lib/getSiteConfig";
import { WEBSITE_VIDEOS_BUCKET, PUBLIC_VIDEO_COLUMNS, type WebsiteVideoRow } from "@/lib/videos";
import VideoReelsClient, { type ReelVideo } from "./VideoReelsClient";

type PublicVideoRow = Pick<WebsiteVideoRow, "id" | "title" | "description" | "video_path" | "poster_path" | "display_order" | "autoplay" | "loop">;

type FetchResult = { videos: PublicVideoRow[] } | null | "error";

async function getPublicVideos(): Promise<FetchResult> {
  if (!hasUsableSupabasePublicConfig()) return null;
  try {
    const supabase = await createClient();
    const result = await fetchWithTimeout(
      supabase.from("website_videos").select(PUBLIC_VIDEO_COLUMNS).eq("is_active", true).order("display_order"),
      2500,
    );
    if (result?.error) return "error";
    return { videos: (result?.data as PublicVideoRow[]) ?? [] };
  } catch {
    return "error";
  }
}

export default async function VideoReels() {
  const result = await getPublicVideos();

  // Sin Supabase configurado (solo entorno local sin credenciales): skeleton.
  if (result === null) {
    return (
      <section className="py-20 bg-white border-y border-slate-100" aria-busy="true" aria-label="Cargando videos">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader />
          <div className="flex gap-4 overflow-hidden">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="shrink-0 w-[210px] sm:w-[240px] aspect-[9/16] rounded-2xl admin-skeleton" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (result === "error") {
    return (
      <section className="py-16 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader />
          <div className="flex items-center gap-2.5 text-slate-400 text-sm">
            <AlertTriangle className="w-4 h-4" /> No pudimos cargar los videos en este momento.
          </div>
        </div>
      </section>
    );
  }

  if (result.videos.length === 0) {
    return (
      <section className="py-16 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader />
          <div className="flex items-center gap-2.5 text-slate-400 text-sm">
            <Film className="w-4 h-4" /> Muy pronto compartiremos contenido en video de nuestra operación.
          </div>
        </div>
      </section>
    );
  }

  const supabase = await createClient();
  const videos: ReelVideo[] = result.videos.map((v) => ({
    id: v.id,
    title: v.title,
    description: v.description,
    videoUrl: supabase.storage.from(WEBSITE_VIDEOS_BUCKET).getPublicUrl(v.video_path).data.publicUrl,
    posterUrl: v.poster_path
      ? (v.poster_path.startsWith("http") ? v.poster_path : supabase.storage.from(WEBSITE_VIDEOS_BUCKET).getPublicUrl(v.poster_path).data.publicUrl)
      : null,
    autoplay: v.autoplay,
    loop: v.loop,
  }));

  return (
    <section className="py-20 bg-white border-y border-slate-100" data-analytics-section="videos_operacion" aria-labelledby="videos-reels-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader />
        <div data-reveal>
          <VideoReelsClient videos={videos} />
        </div>
      </div>
    </section>
  );
}

function SectionHeader() {
  return (
    <div className="max-w-2xl mb-8" data-reveal>
      <div className="flex items-center gap-2 mb-3">
        <span className="h-px w-8 bg-[#f5a623]" />
        <p className="text-xs font-bold text-[#f5a623] uppercase tracking-widest flex items-center gap-1.5">
          <Clapperboard className="w-3.5 h-3.5" /> En video
        </p>
      </div>
      <h2 id="videos-reels-heading" className="text-3xl font-extrabold text-[#0a1628] leading-tight">
        Nuestra operación, en movimiento
      </h2>
      <p className="mt-3 text-slate-600 leading-relaxed">
        Videos cortos de despachos, carga en faena y flota en terreno.
      </p>
    </div>
  );
}
