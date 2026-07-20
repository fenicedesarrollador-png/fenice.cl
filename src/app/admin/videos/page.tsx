import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import DeleteButton from "../_components/DeleteButton";
import { PageHeader, PrimaryLink, EmptyState, Badge } from "../_components/ui";
import { Clapperboard, Plus, Edit2, Volume2, Repeat } from "lucide-react";
import { WEBSITE_VIDEOS_BUCKET, MAX_ACTIVE_VIDEOS, type WebsiteVideoRow } from "@/lib/videos";
import ToggleActiveVideoButton from "./_ToggleActiveVideoButton";

export const metadata: Metadata = { title: "Videos de la web" };

type Row = { video: WebsiteVideoRow; videoUrl: string; posterUrl: string | undefined };

export default async function AdminVideosPage() {
  let rows: Row[] = [];
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("website_videos").select("*").order("display_order");
    const videos = (data as WebsiteVideoRow[] | null) ?? [];
    rows = videos.map((v) => ({
      video: v,
      videoUrl: supabase.storage.from(WEBSITE_VIDEOS_BUCKET).getPublicUrl(v.video_path).data.publicUrl,
      posterUrl: v.poster_path
        ? (v.poster_path.startsWith("http") ? v.poster_path : supabase.storage.from(WEBSITE_VIDEOS_BUCKET).getPublicUrl(v.poster_path).data.publicUrl)
        : undefined,
    }));
  } catch {}

  const videos = rows.map((r) => r.video);
  const activos = videos.filter((v) => v.is_active).length;
  const alLimite = videos.length >= MAX_ACTIVE_VIDEOS;

  return (
    <div className="p-4 sm:p-6 lg:p-7 max-w-[1200px] mx-auto admin-rise">
      <PageHeader
        icon={Clapperboard}
        accent="green"
        title="Videos de la web"
        subtitle={`${videos.length} de ${MAX_ACTIVE_VIDEOS} videos · ${activos} activo${activos !== 1 ? "s" : ""} en el sitio`}
      >
        {alLimite ? (
          <span className="text-[12px] font-semibold text-slate-400">Límite de {MAX_ACTIVE_VIDEOS} videos alcanzado</span>
        ) : (
          <PrimaryLink href="/admin/videos/nuevo" icon={Plus}>Agregar video</PrimaryLink>
        )}
      </PageHeader>

      {videos.length === 0 ? (
        <EmptyState icon={Clapperboard} title="Aún no hay videos" description="Sube hasta 5 videos cortos verticales para la sección de reels de la Home." action={{ href: "/admin/videos/nuevo", label: "Agregar video" }} />
      ) : (
        <div className="flex flex-wrap gap-4">
          {rows.map(({ video: v, videoUrl, posterUrl }) => {
            return (
              <div key={v.id} className={`admin-card overflow-hidden w-full sm:w-[220px] ${!v.is_active ? "opacity-60" : ""}`}>
                <div className="relative bg-slate-900 aspect-[9/16]">                  <video src={videoUrl} poster={posterUrl} muted playsInline controls preload="none" className="w-full h-full object-cover" />
                  <span className="absolute top-2 left-2 text-[10px] font-black text-white bg-black/50 px-1.5 py-0.5 rounded">#{v.display_order}</span>
                </div>
                <div className="p-3">
                  <p className="font-black text-[#0a1628] text-[13px] leading-snug truncate">{v.title || "Sin título"}</p>
                  {v.description && <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">{v.description}</p>}
                  <div className="flex items-center gap-1.5 flex-wrap mt-2">
                    {v.autoplay && <Badge tone="green">Autoplay</Badge>}
                    {v.loop && <span title="En bucle" className="inline-flex items-center text-slate-400"><Repeat className="w-3.5 h-3.5" /></span>}
                    <span title="Con audio disponible" className="inline-flex items-center text-slate-400"><Volume2 className="w-3.5 h-3.5" /></span>
                  </div>
                  <div className="flex items-center gap-1.5 pt-3 mt-3 border-t border-slate-100">
                    <ToggleActiveVideoButton id={v.id} isActive={v.is_active} />
                    <Link href={`/admin/videos/${v.id}/editar`} className="p-1.5 rounded-lg text-slate-500 hover:text-[#1a6b3c] hover:bg-[#1a6b3c]/10 transition-all" title="Editar"><Edit2 className="w-3.5 h-3.5" /></Link>
                    <div className="ml-auto"><DeleteButton table="website_videos" id={v.id} /></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
