"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
export default function NuevaPromoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setLoading(true);
    const fd = new FormData(e.currentTarget);
    const payload = {
      titulo: fd.get("titulo") as string, descripcion: fd.get("descripcion") as string,
      descuento_texto: fd.get("descuento_texto") as string, codigo: fd.get("codigo") as string,
      fecha_inicio: fd.get("fecha_inicio") as string, fecha_fin: fd.get("fecha_fin") as string,
      destacado: fd.get("destacado") === "on", activo: fd.get("activo") === "on",
    };
    const supabase = createClient();
    await supabase.from("promociones").insert(payload);
    router.push("/admin/promociones"); router.refresh();
  }
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Nueva promoción</h1>
      <form onSubmit={handleSubmit} className="space-y-5 bg-white border border-gray-200 rounded-xl p-6">
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Título *</label><input name="titulo" type="text" required className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" /></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label><textarea name="descripcion" rows={3} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none" /></div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Texto de descuento (ej. "10% OFF")</label><input name="descuento_texto" type="text" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Código</label><input name="codigo" type="text" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" /></div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Fecha inicio *</label><input name="fecha_inicio" type="datetime-local" required className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Fecha fin *</label><input name="fecha_fin" type="datetime-local" required className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" /></div>
        </div>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm cursor-pointer"><input name="activo" type="checkbox" defaultChecked className="w-4 h-4 rounded accent-orange-500" />Activa</label>
          <label className="flex items-center gap-2 text-sm cursor-pointer"><input name="destacado" type="checkbox" className="w-4 h-4 rounded accent-orange-500" />Destacada en Home</label>
        </div>
        <button type="submit" disabled={loading} className="bg-orange-600 hover:bg-orange-700 disabled:opacity-60 text-white font-semibold px-6 py-2.5 rounded-lg text-sm transition-colors">{loading ? "Guardando..." : "Crear promoción"}</button>
      </form>
    </div>
  );
}
