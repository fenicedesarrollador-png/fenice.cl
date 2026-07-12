"use client";

import { useState } from "react";
import { FileSpreadsheet, Loader2 } from "lucide-react";

/**
 * Botón de descarga de Excel (.xlsx) vía /api/admin/export.
 * `params` permite pasar filtros (estado, desde, hasta).
 */
export default function ExportButton({
  tipo,
  params,
  label = "Exportar Excel",
  className = "",
}: {
  tipo: string;
  params?: Record<string, string>;
  label?: string;
  className?: string;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  async function handleDownload() {
    setLoading(true);
    setError(false);
    try {
      const qs = new URLSearchParams({ tipo, ...(params ?? {}) });
      const res = await fetch(`/api/admin/export?${qs.toString()}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const blob = await res.blob();
      const disposition = res.headers.get("content-disposition") ?? "";
      const match = disposition.match(/filename="([^"]+)"/);
      const filename = match?.[1] ?? `fenice_${tipo}_${new Date().toISOString().slice(0, 10)}.xlsx`;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setError(true);
      setTimeout(() => setError(false), 3000);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      title="Descargar Excel (.xlsx)"
      className={`admin-btn-ghost shrink-0 ${error ? "!border-red-500/40 !text-red-300" : ""} ${className}`}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileSpreadsheet className="w-4 h-4 text-[#2bbe6a]" />}
      <span className="hidden sm:inline">{error ? "Error al exportar" : loading ? "Generando…" : label}</span>
    </button>
  );
}
