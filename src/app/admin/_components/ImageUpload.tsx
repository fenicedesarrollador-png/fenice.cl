"use client";

import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";

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
  const inputRef = useRef<HTMLInputElement>(null);

  const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
  const MAX_SIZE = 2 * 1024 * 1024; // 2 MB

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Solo se permiten imágenes JPG, PNG o WebP.");
      return;
    }
    if (file.size > MAX_SIZE) {
      setError("El archivo no puede superar 2 MB.");
      return;
    }

    setUploading(true);
    const supabase = createClient();
    const ext = file.name.split(".").pop();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error: uploadError } = await supabase.storage.from(bucket).upload(path, file, { upsert: false });
    if (uploadError) {
      setError("Error al subir la imagen. Inténtalo nuevamente.");
      setUploading(false);
      return;
    }
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    setUrl(data.publicUrl);
    setUploading(false);
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input type="hidden" name={name} value={url} />

      {url ? (
        <div className="relative">
          <img src={url} alt="Preview" className="w-full max-h-48 object-cover rounded-lg border border-gray-200" />
          <button
            type="button"
            onClick={() => { setUrl(""); if (inputRef.current) inputRef.current.value = ""; }}
            className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded"
          >
            Quitar
          </button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-orange-400 transition-colors"
        >
          {uploading ? (
            <p className="text-sm text-gray-500">Subiendo...</p>
          ) : (
            <>
              <p className="text-sm text-gray-500">Haz clic para subir imagen</p>
              <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP · máx. 2 MB</p>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleUpload}
        className="hidden"
      />
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}
