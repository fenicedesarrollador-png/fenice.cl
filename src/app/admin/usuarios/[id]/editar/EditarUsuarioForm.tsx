"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Eye, EyeOff, User, Shield, Lock } from "lucide-react";

interface Profile {
  id: string;
  user_id: string;
  email: string;
  nombre: string;
  rol: string;
  activo: boolean;
}

export default function EditarUsuarioForm({ profile }: { profile: Profile }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const fd = new FormData(e.currentTarget);
    const nombre = fd.get("nombre") as string;
    const rol = fd.get("rol") as string;

    // Update profile in DB
    const supabase = createClient();
    const { error: dbError } = await supabase
      .from("admin_profiles")
      .update({ nombre, rol })
      .eq("id", profile.id);

    if (dbError) {
      setError(dbError.message);
      setLoading(false);
      return;
    }

    // Optionally update password via API
    if (newPassword.length > 0) {
      if (newPassword.length < 8) {
        setError("La contraseña debe tener al menos 8 caracteres.");
        setLoading(false);
        return;
      }

      const res = await fetch("/api/admin/usuarios/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: profile.user_id, password: newPassword }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Error al actualizar contraseña.");
        setLoading(false);
        return;
      }
    }

    setSuccess("Usuario actualizado correctamente.");
    setTimeout(() => router.push("/admin/usuarios"), 1200);
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-slate-100 rounded-2xl p-6 space-y-5 shadow-sm">
      <div className="bg-slate-50 rounded-xl px-4 py-3 border border-slate-100 text-sm text-slate-600">
        <span className="font-semibold">Email:</span> {profile.email}
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Nombre</label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            name="nombre"
            type="text"
            required
            defaultValue={profile.nombre}
            className="w-full border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Rol</label>
        <div className="relative">
          <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <select
            name="rol"
            defaultValue={profile.rol}
            className="w-full border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white appearance-none"
          >
            <option value="admin">Admin</option>
            <option value="editor">Editor</option>
            <option value="superadmin">Superadmin</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
          Nueva contraseña <span className="text-slate-400 font-normal normal-case">(dejar vacío para no cambiar)</span>
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type={showPwd ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Mínimo 8 caracteres"
            className="w-full border border-slate-200 rounded-xl pl-9 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPwd(!showPwd)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm">{error}</div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-green-700 text-sm">{success}</div>
      )}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors"
        >
          {loading ? "Guardando..." : "Guardar cambios"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="border border-slate-200 text-slate-700 font-semibold px-6 py-2.5 rounded-xl text-sm hover:bg-slate-50 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
