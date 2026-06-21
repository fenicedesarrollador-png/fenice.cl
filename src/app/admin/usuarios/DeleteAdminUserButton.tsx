"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export default function DeleteAdminUserButton({
  profileId,
  userId,
}: {
  profileId: string;
  userId: string;
}) {
  const router = useRouter();
  const [confirm, setConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    const res = await fetch("/api/admin/usuarios/eliminar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profileId, userId }),
    });

    if (res.ok) {
      router.refresh();
    }
    setLoading(false);
    setConfirm(false);
  }

  if (confirm) {
    return (
      <div className="flex items-center gap-1.5">
        <button
          onClick={handleDelete}
          disabled={loading}
          className="text-[10px] font-bold text-white bg-red-500 hover:bg-red-600 px-2 py-1 rounded-lg disabled:opacity-50 transition-colors"
        >
          {loading ? "..." : "Confirmar"}
        </button>
        <button
          onClick={() => setConfirm(false)}
          className="text-[10px] font-semibold text-[#94a7c2] hover:text-[#cdd9ea] px-2 py-1 rounded-lg border border-white/12"
        >
          No
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirm(true)}
      title="Eliminar usuario"
      className="p-1.5 rounded-lg border border-white/[0.06] text-[#94a7c2] hover:text-red-500 hover:border-red-100 hover:bg-red-50 transition-all"
    >
      <Trash2 className="w-3.5 h-3.5" />
    </button>
  );
}
