"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import ImageUpload from "../_components/ImageUpload";
import VideoFileUpload from "../_components/VideoFileUpload";
import { FormSection, Field, Toggle, FormActions } from "../_components/ui";
import { removeWebsiteVideoFile } from "@/lib/admin/videoUpload";
import { WEBSITE_VIDEOS_BUCKET, type WebsiteVideoRow } from "@/lib/videos";

export default function VideoForm({ video }: { video?: WebsiteVideoRow }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const videoPath = (fd.get("video_path") as string) || "";
    if (!videoPath) { setError("Debes subir un video MP4."); setLoading(false); return; }

    const payload = {
      title: (fd.get("title") as string).trim() || null,
      description: (fd.get("description") as string).trim() || null,
      video_path: videoPath,
      poster_path: (fd.get("poster_path") as string) || null,
      display_order: Number(fd.get("display_order")) || 0,
      is_active: fd.get("is_active") === "on",
      autoplay: fd.get("autoplay") === "on",
      loop: fd.get("loop") === "on",
    };

    // Si se reemplazó el video o la portada, borra el archivo anterior solo
    // después de que Supabase ya confirmó el nuevo valor (evita perder el
    // archivo si el usuario cancela a mitad de camino: el nuevo path ya
    // está subido en el bucket antes de llegar aquí).
    const previousVideoPath = video?.video_path;
    const previousPosterPath = video?.poster_path;

    const { error: dbError } = video
      ? await supabase.from("website_videos").update(payload).eq("id", video.id)
      : await supabase.from("website_videos").insert({ ...payload, created_by: user?.id ?? null });

    if (dbError) { setError(dbError.message); setLoading(false); return; }

    if (previousVideoPath && previousVideoPath !== payload.video_path) {
      await removeWebsiteVideoFile(supabase, WEBSITE_VIDEOS_BUCKET, previousVideoPath);
    }
    if (previousPosterPath && previousPosterPath !== payload.poster_path && !previousPosterPath.startsWith("http")) {
      await removeWebsiteVideoFile(supabase, WEBSITE_VIDEOS_BUCKET, previousPosterPath);
    }

    await fetch("/api/revalidate?path=%2F", { method: "POST" }).catch(() => {});
    router.push("/admin/videos");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
      <FormSection title="Contenido">
        <Field label="Título" hint="Opcional. No se muestra de forma prominente, es referencial para el panel.">
          <input name="title" type="text" defaultValue={video?.title ?? ""} className="admin-input" placeholder="Ej: Carga en faena" />
        </Field>
        <Field label="Descripción">
          <textarea name="description" rows={2} defaultValue={video?.description ?? ""} className="admin-input" />
        </Field>
      </FormSection>

      <FormSection title="Archivos" description="Formato vertical 9:16 recomendado.">
        <VideoFileUpload name="video_path" defaultPath={video?.video_path} />
        <ImageUpload bucket={WEBSITE_VIDEOS_BUCKET} name="poster_path" defaultUrl={video?.poster_path ?? ""} label="Imagen de portada" />
      </FormSection>

      <FormSection title="Reproducción">
        <div className="grid sm:grid-cols-2 gap-5 items-center">
          <Field label="Orden de aparición" hint="Menor número aparece primero.">
            <input name="display_order" type="number" defaultValue={video?.display_order ?? 0} className="admin-input" />
          </Field>
          <div className="sm:pt-6">
            <Toggle name="is_active" defaultChecked={video?.is_active ?? true} label="Activo" description="Visible en la Home" />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-5">
          <Toggle name="autoplay" defaultChecked={video?.autoplay ?? true} label="Reproducción automática" description="Se reproduce solo al hacerse visible" />
          <Toggle name="loop" defaultChecked={video?.loop ?? true} label="En bucle" description="Se repite automáticamente" />
        </div>
      </FormSection>

      <FormActions submitLabel={video ? "Guardar cambios" : "Agregar video"} loading={loading} onCancel={() => router.back()} error={error} />
    </form>
  );
}
