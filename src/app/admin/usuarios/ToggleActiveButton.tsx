"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserCheck, UserX } from "lucide-react";

export default function ToggleActiveButton({
  profileId,
  activo,
}: {
  profileId: string;
  activo: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleToggle() {
    setLoading(true);
    const res = await fetch("/api/admin/usuarios/toggle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profileId, activo }),
    });

    if (res.ok) {
      router.refresh();
    }
    setLoading(false);
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      title={activo ? "Bloquear acceso" : "Activar acceso"}
      className={`p-1.5 rounded-lg border transition-all disabled:opacity-50 ${
        activo
          ? "border-red-100 text-red-500 hover:bg-red-50"
          : "border-green-100 text-green-600 hover:bg-green-50"
      }`}
    >
      {activo ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
    </button>
  );
}
