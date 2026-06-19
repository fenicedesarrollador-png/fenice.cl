"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface Props {
  table: string;
  id: string;
  label?: string;
}

export default function DeleteButton({ table, id, label = "Eliminar" }: Props) {
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
      <div className="flex items-center gap-1">
        <button onClick={handleDelete} disabled={loading} className="text-xs text-red-600 hover:text-red-800 font-semibold">
          {loading ? "..." : "Confirmar"}
        </button>
        <button onClick={() => setConfirming(false)} className="text-xs text-gray-400 hover:text-gray-600">
          Cancelar
        </button>
      </div>
    );
  }

  return (
    <button onClick={() => setConfirming(true)} className="text-red-400 hover:text-red-600 text-xs font-medium">
      {label}
    </button>
  );
}
