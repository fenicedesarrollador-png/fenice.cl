"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { logFleetAudit } from "@/lib/admin/fleetUpload";
import { canPublishDocument, type FleetDocumentRow } from "@/lib/fleet";
import { Edit2, Copy, Archive, Trash2, Eye, EyeOff, AlertTriangle, X } from "lucide-react";

type DocRow = Pick<FleetDocumentRow, "id" | "vehicle_id" | "is_public" | "is_active" | "review_status" | "sanitized_confirmed" | "public_file_path">;

export function TogglePublicButton({ doc }: { doc: DocRow }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [warn, setWarn] = useState("");

  async function toggle() {
    setWarn("");
    if (!doc.is_public && !canPublishDocument({ ...doc, is_public: true })) {
      setWarn("No se puede publicar: falta el PDF público, la confirmación de sanitización o la aprobación de revisión.");
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from("fleet_documents").update({ is_public: !doc.is_public, updated_by: user?.id ?? null }).eq("id", doc.id);
    if (!error) {
      await logFleetAudit(supabase, { documentId: doc.id, vehicleId: doc.vehicle_id, action: doc.is_public ? "unpublish" : "publish", performedBy: user?.id });
      await fetch("/api/revalidate?path=%2F", { method: "POST" }).catch(() => {});
    }
    setLoading(false);
    router.refresh();
  }

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={toggle}
        disabled={loading}
        title={doc.is_public ? "Ocultar del sitio" : "Publicar en el sitio"}
        className={`p-1.5 rounded-lg transition-all disabled:opacity-50 ${doc.is_public ? "text-[#1a6b3c] hover:bg-[#1a6b3c]/10" : "text-slate-400 hover:bg-slate-100"}`}
      >
        {doc.is_public ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
      </button>
      {warn && (
        <div className="absolute z-20 right-0 top-8 w-56 bg-white border border-red-200 rounded-xl shadow-lg p-3 text-[11px] text-red-600 flex items-start gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          <span className="flex-1">{warn}</span>
          <button onClick={() => setWarn("")} className="shrink-0"><X className="w-3 h-3" /></button>
        </div>
      )}
    </div>
  );
}

export function ArchiveDocumentButton({ doc }: { doc: DocRow }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  async function archive() {
    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from("fleet_documents").update({ is_active: false, is_public: false, updated_by: user?.id ?? null }).eq("id", doc.id);
    await logFleetAudit(supabase, { documentId: doc.id, vehicleId: doc.vehicle_id, action: "archive", performedBy: user?.id });
    await fetch("/api/revalidate?path=%2F", { method: "POST" }).catch(() => {});
    setLoading(false);
    setConfirming(false);
    router.refresh();
  }

  if (!doc.is_active) return null;

  if (confirming) {
    return (
      <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-xl px-2.5 py-1.5">
        <button onClick={archive} disabled={loading} className="text-[11px] text-[#b87608] hover:text-[#8a5a06] font-bold disabled:opacity-50">{loading ? "..." : "Archivar"}</button>
        <span className="text-amber-300">|</span>
        <button onClick={() => setConfirming(false)} className="text-slate-500 hover:text-slate-700"><X className="w-3 h-3" /></button>
      </div>
    );
  }

  return (
    <button onClick={() => setConfirming(true)} title="Archivar" className="p-1.5 rounded-lg text-slate-500 hover:text-[#b87608] hover:bg-[#f5a623]/10 transition-all">
      <Archive className="w-3.5 h-3.5" />
    </button>
  );
}

export function FleetDocumentDeleteButton({ doc }: { doc: DocRow }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  async function remove() {
    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    await logFleetAudit(supabase, { documentId: doc.id, vehicleId: doc.vehicle_id, action: "delete", performedBy: user?.id });
    await supabase.from("fleet_documents").delete().eq("id", doc.id);
    await fetch("/api/revalidate?path=%2F", { method: "POST" }).catch(() => {});
    setLoading(false);
    setConfirming(false);
    router.refresh();
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-1.5 bg-red-50 border border-red-200 rounded-xl px-2.5 py-1.5">
        <AlertTriangle className="w-3 h-3 text-red-500 shrink-0" />
        <button onClick={remove} disabled={loading} className="text-[11px] text-red-600 hover:text-red-800 font-bold disabled:opacity-50">{loading ? "..." : "Confirmar"}</button>
        <span className="text-red-700">|</span>
        <button onClick={() => setConfirming(false)} className="text-slate-500 hover:text-slate-700"><X className="w-3 h-3" /></button>
      </div>
    );
  }

  return (
    <button onClick={() => setConfirming(true)} title="Eliminar" className="p-1.5 rounded-lg text-slate-500 hover:text-red-500 hover:bg-red-50 transition-all">
      <Trash2 className="w-3.5 h-3.5" />
    </button>
  );
}

export function FleetDocumentRowActions({ doc }: { doc: DocRow }) {
  return (
    <div className="flex items-center gap-1">
      <TogglePublicButton doc={doc} />
      <Link href={`/admin/flota/documentos/${doc.id}/editar`} title="Editar" className="p-1.5 rounded-lg text-slate-500 hover:text-[#1a6b3c] hover:bg-[#1a6b3c]/10 transition-all">
        <Edit2 className="w-3.5 h-3.5" />
      </Link>
      <Link href={`/admin/flota/documentos/nuevo?duplicateFrom=${doc.id}&vehicleId=${doc.vehicle_id}`} title="Duplicar como renovación" className="p-1.5 rounded-lg text-slate-500 hover:text-[#1a6b3c] hover:bg-[#1a6b3c]/10 transition-all">
        <Copy className="w-3.5 h-3.5" />
      </Link>
      <ArchiveDocumentButton doc={doc} />
      <FleetDocumentDeleteButton doc={doc} />
    </div>
  );
}
