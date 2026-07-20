"use client";

import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { UploadCloud, X, Loader2, CheckCircle2, Film } from "lucide-react";
import { validateVideoFile, uploadWithProgress, VideoUploadError } from "@/lib/admin/videoUpload";
import { WEBSITE_VIDEOS_BUCKET, buildWebsiteVideoPath } from "@/lib/videos";

interface Props {
  name: string;
  defaultPath?: string | null;
  label?: string;
}

/** Sube un MP4 al bucket website-videos con progreso real y guarda la RUTA (no la URL) en un input oculto. */
export default function VideoFileUpload({ name, defaultPath = "", label = "Video (MP4)" }: Props) {
  const [path, setPath] = useState(defaultPath ?? "");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [drag, setDrag] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const supabase = createClient();
  const previewUrl = path ? supabase.storage.from(WEBSITE_VIDEOS_BUCKET).getPublicUrl(path).data.publicUrl : "";

  async function upload(file: File) {
    setError("");
    try {
      validateVideoFile(file);
    } catch (e) {
      setError(e instanceof VideoUploadError ? e.message : "No se pudo validar el archivo.");
      return;
    }
    setUploading(true);
    setProgress(0);
    const newPath = buildWebsiteVideoPath("video", "mp4");
    try {
      await uploadWithProgress(supabase, WEBSITE_VIDEOS_BUCKET, newPath, file, setProgress);
      setPath(newPath);
    } catch (e) {
      setError(e instanceof VideoUploadError ? e.message : "Error al subir el video.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label className="admin-label">{label}</label>
      <input type="hidden" name={name} value={path} />

      {uploading ? (
        <div className="rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-2 mb-2.5">
            <Loader2 className="w-4 h-4 text-[#1a6b3c] animate-spin shrink-0" />
            <p className="text-sm font-semibold text-slate-700">Subiendo video… {progress}%</p>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#1a6b3c] transition-all duration-150" style={{ width: `${progress}%` }} />
          </div>
        </div>
      ) : path ? (
        <div className="relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-900 max-w-[220px]">
          <video src={previewUrl} muted playsInline controls className="w-full aspect-[9/16] object-cover" />
          <div className="absolute top-2 left-2 inline-flex items-center gap-1 bg-white/90 text-[#1a6b3c] text-[10px] font-bold px-2 py-0.5 rounded-full">
            <CheckCircle2 className="w-3 h-3" /> Video listo
          </div>
          <div className="absolute top-2 right-2 flex gap-1.5">
            <button type="button" onClick={() => inputRef.current?.click()} className="bg-white text-[#0a1628] text-[10px] font-bold px-2 py-1 rounded-lg">Cambiar</button>
            <button type="button" onClick={() => { setPath(""); if (inputRef.current) inputRef.current.value = ""; }} className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-lg inline-flex items-center gap-1"><X className="w-3 h-3" />Quitar</button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => { e.preventDefault(); setDrag(false); const f = e.dataTransfer.files?.[0]; if (f) upload(f); }}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${drag ? "border-[#1a6b3c] bg-[#1a6b3c]/10" : "border-slate-200 hover:border-[#1a6b3c]/40 hover:bg-slate-100"}`}
        >
          <div className="flex flex-col items-center gap-2">
            <div className="w-11 h-11 rounded-xl bg-[#1a6b3c]/10 flex items-center justify-center">
              <Film className="w-5 h-5 text-[#1a6b3c]" />
            </div>
            <p className="text-sm text-slate-700 font-semibold flex items-center gap-1.5"><UploadCloud className="w-3.5 h-3.5" /> Arrastra o haz clic para subir</p>
            <p className="text-[11px] text-slate-500">MP4 vertical (9:16) · máximo 20 MB</p>
          </div>
        </div>
      )}

      <input ref={inputRef} type="file" accept="video/mp4" onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); }} className="hidden" />
      {error && <p className="text-[11px] text-red-600 mt-1.5 font-medium flex items-start gap-1"><X className="w-3 h-3 shrink-0 mt-0.5" /><span>{error}</span></p>}
    </div>
  );
}
