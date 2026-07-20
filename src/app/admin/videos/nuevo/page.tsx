import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import VideoForm from "../_VideoForm";
import { FormPageHeader } from "../../_components/ui";
import { MAX_ACTIVE_VIDEOS } from "@/lib/videos";

export const metadata: Metadata = { title: "Nuevo video" };

export default async function NuevoVideoPage() {
  let count = 0;
  try {
    const supabase = await createClient();
    const { count: c } = await supabase.from("website_videos").select("id", { count: "exact", head: true });
    count = c ?? 0;
  } catch {}

  return (
    <div className="p-4 sm:p-6 lg:p-7 max-w-[860px] mx-auto admin-rise">
      <FormPageHeader title="Agregar video" subtitle="Aparecerá en la sección de reels de la Home." backHref="/admin/videos" />
      {count >= MAX_ACTIVE_VIDEOS ? (
        <div className="admin-card p-6 text-center">
          <p className="text-sm font-bold text-[#0a1628]">Ya tienes {MAX_ACTIVE_VIDEOS} videos.</p>
          <p className="text-[13px] text-slate-500 mt-1">Elimina uno existente antes de agregar otro.</p>
          <Link href="/admin/videos" className="admin-btn-primary mt-4 inline-flex">Volver al listado</Link>
        </div>
      ) : (
        <VideoForm />
      )}
    </div>
  );
}
