"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import ImageUpload from "../_components/ImageUpload";

interface Cliente { id: string; nombre: string; logo_url?: string; sitio_web?: string; testimonio?: string; orden: number; activo: boolean; }

export default function ClienteForm({ cliente }: { cliente?: Cliente }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setLoading(true); setError("");
    const fd = new FormData(e.currentTarget);
    const payload = {
      nombre: fd.get("nombre") as string,
      logo_url: fd.get("logo_url") as string,
      sitio_web: fd.get("sitio_web") as string,
      testimonio: fd.get("testimonio") as string,
      orden: Number(fd.get("orden")) || 0,
      activo: fd.get("activo") === "on",
    };
    const supabase = createClient();
    const { error: dbError } = cliente
      ? await supabase.from("clientes").update(payload).eq("id", cliente.id)
      : await supabase.from("clientes").insert(payload);
    if (dbError) { setError(dbError.message); setLoading(false); return; }
    await fetch("/api/revalidate?path=/testimonios", { method: "POST" }).catch(() => {});
    router.push("/admin/clientes"); router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 bg-white border border-gray-200 rounded-xl p-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la empresa *</label>
        <input name="nombre" type="text" required defaultValue={cliente?.nombre}
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
      </div>
      <ImageUpload bucket="clientes" name="logo_url" defaultUrl={cliente?.logo_url} label="Logo (JPG/PNG/WebP, máx. 2MB)" />
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Sitio web</label>
        <input name="sitio_web" type="url" defaultValue={cliente?.sitio_web}
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Testimonio</label>
        <textarea name="testimonio" rows={3} defaultValue={cliente?.testimonio}
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Orden de aparición</label>
          <input name="orden" type="number" defaultValue={cliente?.orden ?? 0}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
        </div>
        <div className="flex items-end pb-2.5">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input name="activo" type="checkbox" defaultChecked={cliente?.activo ?? true} className="w-4 h-4 rounded accent-orange-500" />
            Activo (visible)
          </label>
        </div>
      </div>
      {error && <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">{error}</div>}
      <div className="flex gap-3">
        <button type="submit" disabled={loading} className="bg-orange-600 hover:bg-orange-700 disabled:opacity-60 text-white font-semibold px-6 py-2.5 rounded-lg text-sm transition-colors">
          {loading ? "Guardando..." : cliente ? "Guardar cambios" : "Agregar cliente"}
        </button>
        <button type="button" onClick={() => router.back()} className="border border-gray-300 text-gray-700 font-semibold px-6 py-2.5 rounded-lg text-sm hover:bg-gray-50 transition-colors">Cancelar</button>
      </div>
    </form>
  );
}
