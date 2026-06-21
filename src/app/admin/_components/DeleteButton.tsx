"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Trash2, AlertTriangle, X } from "lucide-react";

interface Props {
  table: string;
  id: string;
}

export default function DeleteButton({ table, id }: Props) {
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    setLoading(true);
    const supabase = createClient();
    await supabase.from(table).delete().eq("id", id);
    setLoading(false);
    setConfirming(false);
    router.refresh();
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-1.5 bg-red-50 border border-red-200 rounded-xl px-2.5 py-1.5">
        <AlertTriangle className="w-3 h-3 text-red-500 shrink-0" />
        <button
          onClick={handleDelete}
          disabled={loading}
          className="text-[11px] text-red-600 hover:text-red-800 font-bold disabled:opacity-50 transition-colors"
        >
          {loading ? "..." : "Confirmar"}
        </button>
        <span className="text-red-200">|</span>
        <button
          onClick={() => setConfirming(false)}
          className="text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
      title="Eliminar"
    >
      <Trash2 className="w-3.5 h-3.5" />
    </button>
  );
}
