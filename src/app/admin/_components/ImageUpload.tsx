"use client";

import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { UploadCloud, X, Loader2, Link2, CheckCircle2 } from "lucide-react";

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
  const [mode, setMode] = useState<"upload" | "url">("upload");
  const [urlDraft, setUrlDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const ALLOWED = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  const MAX = 5 * 1024 * 1024; // 5 MB — coincide con el límite del bucket

  async function upload(file: File) {
    setError("");
    if (!ALLOWED.includes(file.type)) {
      setError(`Formato no permitido (${file.type || "desconocido"}). Usa JPG, PNG o WebP.`);
      return;
    }
    if (file.size > MAX) {
      setError(`La imagen pesa ${(file.size / 1024 / 1024).toFixed(1)} MB. El máximo es 5 MB.`);
      return;
    }
    setUploading(true);
    const supabase = createClient();
    const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from(bucket)
      .upload(path, file, { upsert: false, contentType: file.type });

    if (upErr) {
      // Mostrar el error REAL de Supabase para poder diagnosticar.
      const msg = upErr.message || "";
      if (/bucket not found/i.test(msg)) {
        setError(`El bucket "${bucket}" no existe en Storage. Ejecuta supabase/migration_storage_buckets.sql. Mientras tanto, pega una URL de imagen abajo.`);
      } else if (/row-level security|policy|not authorized|permission/i.test(msg)) {
        setError(`Sin permiso para subir al bucket "${bucket}". Ejecuta supabase/migration_storage_buckets.sql. Mientras tanto, pega una URL de imagen abajo.`);
      } else if (/exceeded|maximum size|too large/i.test(msg)) {
        setError(`Supabase rechazó el archivo por tamaño. Revisa el límite del bucket "${bucket}".`);
      } else {
        setError(`Error al subir: ${msg}. Puedes pegar una URL de imagen abajo.`);
      }
      setUploading(false);
      setMode("url");
      return;
    }
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    setUrl(data.publicUrl);
    setUploading(false);
  }

  function applyUrl() {
    const v = urlDraft.trim();
    if (!v) return;
    if (!/^https?:\/\//i.test(v)) {
      setError("La URL debe comenzar con http:// o https://");
      return;
    }
    setError("");
    setUrl(v);
    setUrlDraft("");
  }

  return (
    <div>
      <label className="admin-label">{label}</label>
      <input type="hidden" name={name} value={url} />

      {url ? (
        <div className="relative group rounded-xl overflow-hidden border border-slate-200">
          {/* eslint-disable-next-line @next/next/no-img-element -- preview de subida en panel privado */}
          <img src={url} alt="Preview" className="w-full max-h-52 object-cover" />
          <div className="absolute inset-0 bg-[#0a1628]/0 group-hover:bg-[#0a1628]/45 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
            <button type="button" onClick={() => inputRef.current?.click()} className="bg-white text-[#0a1628] text-xs font-bold px-3 py-1.5 rounded-lg">Cambiar</button>
            <button type="button" onClick={() => { setUrl(""); setMode("upload"); if (inputRef.current) inputRef.current.value = ""; }} className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg inline-flex items-center gap-1"><X className="w-3 h-3" />Quitar</button>
          </div>
          <span className="absolute top-2 left-2 inline-flex items-center gap-1 bg-white/90 text-[#1a6b3c] text-[10px] font-bold px-2 py-0.5 rounded-full">
            <CheckCircle2 className="w-3 h-3" /> Imagen lista
          </span>
        </div>
      ) : (
        <>
          {/* Selector de modo */}
          <div className="inline-flex items-center gap-1 bg-slate-100 border border-slate-200 rounded-lg p-1 mb-2.5">
            <button type="button" onClick={() => { setMode("upload"); setError(""); }} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-bold transition-all ${mode === "upload" ? "bg-white text-[#0a1628] shadow-sm" : "text-slate-500 hover:text-[#0a1628]"}`}>
              <UploadCloud className="w-3.5 h-3.5" /> Subir archivo
            </button>
            <button type="button" onClick={() => { setMode("url"); setError(""); }} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-bold transition-all ${mode === "url" ? "bg-white text-[#0a1628] shadow-sm" : "text-slate-500 hover:text-[#0a1628]"}`}>
              <Link2 className="w-3.5 h-3.5" /> Pegar URL
            </button>
          </div>

          {mode === "upload" ? (
            <div
              onClick={() => inputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
              onDragLeave={() => setDrag(false)}
              onDrop={(e) => { e.preventDefault(); setDrag(false); const f = e.dataTransfer.files?.[0]; if (f) upload(f); }}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${drag ? "border-[#1a6b3c] bg-[#1a6b3c]/10" : "border-slate-200 hover:border-[#1a6b3c]/40 hover:bg-slate-100"}`}
            >
              {uploading ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="w-6 h-6 text-[#1a6b3c] animate-spin" />
                  <p className="text-sm text-slate-500 font-medium">Subiendo imagen…</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-11 h-11 rounded-xl bg-[#1a6b3c]/10 flex items-center justify-center">
                    <UploadCloud className="w-5 h-5 text-[#1a6b3c]" />
                  </div>
                  <p className="text-sm text-slate-700 font-semibold">Arrastra o haz clic para subir</p>
                  <p className="text-[11px] text-slate-500">JPG, PNG o WebP · máximo 5 MB</p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="url"
                value={urlDraft}
                onChange={(e) => setUrlDraft(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); applyUrl(); } }}
                placeholder="https://…/imagen.jpg"
                className="admin-input flex-1"
              />
              <button type="button" onClick={applyUrl} className="admin-btn-primary shrink-0">
                Usar imagen
              </button>
            </div>
          )}
        </>
      )}

      <input ref={inputRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp" onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); }} className="hidden" />
      {error && <p className="text-[11px] text-red-600 mt-1.5 font-medium flex items-start gap-1"><X className="w-3 h-3 shrink-0 mt-0.5" /><span>{error}</span></p>}
    </div>
  );
}
