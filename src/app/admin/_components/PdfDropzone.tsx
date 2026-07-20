"use client";

import { useRef, useState } from "react";
import { UploadCloud, X, FileText, CheckCircle2, AlertTriangle } from "lucide-react";
import { validatePdfFile, FleetUploadError } from "@/lib/admin/fleetUpload";

interface Props {
  label: string;
  hint?: string;
  /** Nombre del archivo ya guardado (si estamos editando y existe un PDF previo). */
  existingFilename?: string | null;
  /** Se llama cuando el usuario selecciona/quita un archivo. El upload real ocurre al enviar el formulario. */
  onFileChange: (file: File | null) => void;
}

/**
 * Selector de PDF controlado: NO sube el archivo al elegirlo (la ruta de
 * storage requiere el id del documento, que puede no existir aún si se
 * está creando uno nuevo). El formulario padre sube el archivo al enviar.
 */
export default function PdfDropzone({ label, hint, existingFilename, onFileChange }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [drag, setDrag] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(f: File) {
    setError("");
    try {
      validatePdfFile(f);
    } catch (e) {
      setError(e instanceof FleetUploadError ? e.message : "No se pudo validar el archivo.");
      return;
    }
    setFile(f);
    onFileChange(f);
  }

  function clear() {
    setFile(null);
    setError("");
    onFileChange(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div>
      <label className="admin-label">{label}</label>

      {file ? (
        <div className="flex items-center gap-3 rounded-xl border border-[#1a6b3c]/30 bg-[#1a6b3c]/5 px-4 py-3">
          <CheckCircle2 className="w-4 h-4 text-[#1a6b3c] shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-bold text-[#0a1628] truncate">{file.name}</p>
            <p className="text-[11px] text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB · se subirá al guardar</p>
          </div>
          <button type="button" onClick={clear} className="p-1.5 rounded-lg text-slate-500 hover:text-red-500 hover:bg-red-50 transition-all shrink-0">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => { e.preventDefault(); setDrag(false); const f = e.dataTransfer.files?.[0]; if (f) handleFile(f); }}
          className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${drag ? "border-[#1a6b3c] bg-[#1a6b3c]/10" : "border-slate-200 hover:border-[#1a6b3c]/40 hover:bg-slate-50"}`}
        >
          <div className="flex flex-col items-center gap-1.5">
            {existingFilename ? (
              <>
                <FileText className="w-5 h-5 text-slate-400" />
                <p className="text-[12.5px] text-slate-600 font-semibold">PDF actual: {existingFilename}</p>
                <p className="text-[11px] text-slate-400">Haz clic o arrastra para reemplazarlo</p>
              </>
            ) : (
              <>
                <UploadCloud className="w-5 h-5 text-[#1a6b3c]" />
                <p className="text-[12.5px] text-slate-600 font-semibold">Arrastra o haz clic para subir el PDF</p>
                <p className="text-[11px] text-slate-400">Solo PDF · máximo 15 MB</p>
              </>
            )}
          </div>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
        className="hidden"
      />
      {hint && !error && <p className="text-[11px] text-slate-400 mt-1.5">{hint}</p>}
      {error && (
        <p className="text-[11px] text-red-600 mt-1.5 font-medium flex items-start gap-1">
          <AlertTriangle className="w-3 h-3 shrink-0 mt-0.5" /><span>{error}</span>
        </p>
      )}
    </div>
  );
}
