"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function EditorialPlanButton() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();
  async function load() {
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("/api/admin/blog/plan-editorial", { method: "POST" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "No se pudo cargar el plan editorial.");
      setMessage(result.created ? `${result.created} artículos cargados. Los artículos existentes se conservaron.` : "El plan editorial ya está cargado.");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Error al cargar los artículos.");
    } finally { setLoading(false); }
  }
  return (
    <div className="admin-card p-4 mb-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="max-w-xl">
          <h2 className="font-bold text-sm text-[#0a1628]">Plan editorial de abastecimiento</h2>
          <p className="mt-1 text-xs text-slate-600 leading-relaxed">8 guías para empresas: 3 de publicación inmediata y 5 programadas a las 09:00 de Santiago, a partir de tres días después de la carga y luego cada semana. Puedes editar fechas y contenido.</p>
        </div>
        <button onClick={load} disabled={loading} className="admin-btn-primary disabled:opacity-60">{loading ? "Cargando…" : "Cargar 8 guías"}</button>
      </div>
      {message && <p role="status" className="mt-3 text-sm text-slate-700">{message}</p>}
    </div>
  );
}
