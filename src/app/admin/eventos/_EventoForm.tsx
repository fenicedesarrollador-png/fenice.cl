"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import ImageUpload from "../_components/ImageUpload";

function slugify(str: string) { return str.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }

interface Evento { id: string; titulo: string; slug: string; descripcion?: string; ubicacion?: string; fecha_inicio: string; fecha_fin?: string; imagen_url?: string; activo: boolean; }

export default function EventoForm({ evento }: { evento?: Evento }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setLoading(true); setError("");
    const fd = new FormData(e.currentTarget);
    const titulo = fd.get("titulo") as string;
    const payload = {
      titulo,
      slug: evento?.slug || slugify(titulo),
      descripcion: fd.get("descripcion") as string,
      ubicacion: fd.get("ubicacion") as string,
      fecha_inicio: fd.get("fecha_inicio") as string,
      fecha_fin: fd.get("fecha_fin") as string || null,
      imagen_url: fd.get("imagen_url") as string,
      activo: fd.get("activo") === "on",
    };
    const supabase = createClient();
    const { error: dbError } = evento
      ? await supabase.from("eventos").update(payload).eq("id", evento.id)
      : await supabase.from("eventos").insert(payload);
    if (dbError) { setError(dbError.message); setLoading(false); return; }
    await fetch(`/api/revalidate?path=/eventos/${payload.slug}`, { method: "POST" }).catch(() => {});
    router.push("/admin/eventos"); router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 bg-white border border-gray-200 rounded-xl p-6">
      <div><label className="block text-sm font-medium text-gray-700 mb-1">Título *</label><input name="titulo" type="text" required defaultValue={evento?.titulo} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" /></div>
      <div><label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label><textarea name="descripcion" rows={4} defaultValue={evento?.descripcion} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none" /></div>
      <div><label className="block text-sm font-medium text-gray-700 mb-1">Ubicación</label><input name="ubicacion" type="text" defaultValue={evento?.ubicacion} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" /></div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Fecha inicio *</label><input name="fecha_inicio" type="datetime-local" required defaultValue={evento?.fecha_inicio?.slice(0, 16)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" /></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Fecha fin</label><input name="fecha_fin" type="datetime-local" defaultValue={evento?.fecha_fin?.slice(0, 16)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" /></div>
      </div>
      <ImageUpload bucket="eventos" name="imagen_url" defaultUrl={evento?.imagen_url} />
      <label className="flex items-center gap-2 text-sm cursor-pointer"><input name="activo" type="checkbox" defaultChecked={evento?.activo ?? true} className="w-4 h-4 rounded accent-orange-500" />Activo (visible)</label>
      {error && <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">{error}</div>}
      <div className="flex gap-3">
        <button type="submit" disabled={loading} className="bg-orange-600 hover:bg-orange-700 disabled:opacity-60 text-white font-semibold px-6 py-2.5 rounded-lg text-sm transition-colors">{loading ? "Guardando..." : evento ? "Guardar" : "Crear evento"}</button>
        <button type="button" onClick={() => router.back()} className="border border-gray-300 text-gray-700 font-semibold px-6 py-2.5 rounded-lg text-sm hover:bg-gray-50 transition-colors">Cancelar</button>
      </div>
    </form>
  );
}
