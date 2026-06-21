"use client";

import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { UploadCloud, X, Loader2 } from "lucide-react";

interface Props {
  bucket: string;
  name: string;
  defaultUrl?: string;
  label?: string;
}

export default function ImageUpload({ bucket, name, defaultUrl = "", label = "Imagen" }: Props) {
  const [url, setUrl] = useState(defaultUrl);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [drag, setDrag] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const ALLOWED = ["image/jpeg", "image/png", "image/webp"];
  const MAX = 2 * 1024 * 1024;

  async function upload(file: File) {
    setError("");
    if (!ALLOWED.includes(file.type)) { setError("Solo JPG, PNG o WebP."); return; }
    if (file.size > MAX) { setError("Máximo 2 MB."); return; }
    setUploading(true);
    const supabase = createClient();
    const ext = file.name.split(".").pop();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error: upErr } = await supabase.storage.from(bucket).upload(path, file, { upsert: false });
    if (upErr) { setError("Error al subir. Inténtalo de nuevo."); setUploading(false); return; }
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    setUrl(data.publicUrl);
    setUploading(false);
  }

  return (
    <div>
      <label className="admin-label">{label}</label>
      <input type="hidden" name={name} value={url} />

      {url ? (
        <div className="relative group rounded-xl overflow-hidden border border-slate-200">
          {/* eslint-disable-next-line @next/next/no-img-element -- preview de subida en panel privado */}
          <img src={url} alt="Preview" className="w-full max-h-52 object-cover" />
          <div className="absolute inset-0 bg-[#0a1628]/0 group-hover:bg-[#0a1628]/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
            <button type="button" onClick={() => inputRef.current?.click()} className="bg-white text-[#0a1628] text-xs font-bold px-3 py-1.5 rounded-lg">Cambiar</button>
            <button type="button" onClick={() => { setUrl(""); if (inputRef.current) inputRef.current.value = ""; }} className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg inline-flex items-center gap-1"><X className="w-3 h-3" />Quitar</button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => { e.preventDefault(); setDrag(false); const f = e.dataTransfer.files?.[0]; if (f) upload(f); }}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${drag ? "border-[#1a6b3c] bg-[#ecfdf3]" : "border-slate-200 hover:border-[#1a6b3c]/40 hover:bg-slate-50"}`}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-6 h-6 text-[#1a6b3c] animate-spin" />
              <p className="text-sm text-slate-500 font-medium">Subiendo imagen…</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="w-11 h-11 rounded-xl bg-[#ecfdf3] flex items-center justify-center">
                <UploadCloud className="w-5 h-5 text-[#1a6b3c]" />
              </div>
              <p className="text-sm text-slate-600 font-semibold">Arrastra o haz clic para subir</p>
              <p className="text-[11px] text-slate-400">JPG, PNG o WebP · máximo 2 MB</p>
            </div>
          )}
        </div>
      )}

      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); }} className="hidden" />
      {error && <p className="text-[11px] text-red-600 mt-1.5 font-medium flex items-center gap-1"><X className="w-3 h-3" />{error}</p>}
    </div>
  );
}
