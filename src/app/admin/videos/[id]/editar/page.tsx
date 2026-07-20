import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import VideoForm from "../../_VideoForm";
import { FormPageHeader } from "../../../_components/ui";
import type { WebsiteVideoRow } from "@/lib/videos";

export const metadata: Metadata = { title: "Editar video" };

export default async function EditarVideoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let video: WebsiteVideoRow | null = null;
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("website_videos").select("*").eq("id", id).single();
    if (data) video = data as WebsiteVideoRow;
  } catch {}
  if (!video) notFound();

  return (
    <div className="p-4 sm:p-6 lg:p-7 max-w-[860px] mx-auto admin-rise">
      <FormPageHeader title="Editar video" subtitle={video.title || "Sin título"} backHref="/admin/videos" />
      <VideoForm video={video} />
    </div>
  );
}
