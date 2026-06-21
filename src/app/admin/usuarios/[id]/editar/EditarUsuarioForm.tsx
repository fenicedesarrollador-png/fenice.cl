"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Eye, EyeOff, User, Shield, Lock, Mail } from "lucide-react";
import { FormSection, Field, FormActions } from "../../../_components/ui";

interface Profile { id: string; user_id: string; email: string; nombre: string; rol: string; activo: boolean; }

export default function EditarUsuarioForm({ profile }: { profile: Profile }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true); setError(""); setSuccess("");
    const fd = new FormData(e.currentTarget);
    const nombre = fd.get("nombre") as string;
    const rol = fd.get("rol") as string;
    const supabase = createClient();
    const { error: dbError } = await supabase.from("admin_profiles").update({ nombre, rol }).eq("id", profile.id);
    if (dbError) { setError(dbError.message); setLoading(false); return; }
    if (newPassword.length > 0) {
      if (newPassword.length < 8) { setError("La contraseña debe tener al menos 8 caracteres."); setLoading(false); return; }
      const res = await fetch("/api/admin/usuarios/password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId: profile.user_id, password: newPassword }) });
      if (!res.ok) { const data = await res.json(); setError(data.error ?? "Error al actualizar contraseña."); setLoading(false); return; }
    }
    setSuccess("Usuario actualizado correctamente.");
    setTimeout(() => router.push("/admin/usuarios"), 1200);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormSection title="Datos del usuario">
        <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-4 py-2.5 border border-slate-100">
          <Mail className="w-4 h-4 text-slate-400" />
          <span className="text-[13px] text-slate-600"><span className="font-bold">Email:</span> {profile.email}</span>
        </div>
        <Field label="Nombre" required>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input name="nombre" type="text" required defaultValue={profile.nombre} className="admin-input !pl-9" />
          </div>
        </Field>
        <Field label="Rol" required>
          <div className="relative">
            <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />
            <select name="rol" defaultValue={profile.rol} className="admin-input !pl-9">
              <option value="admin">Admin</option>
              <option value="editor">Editor</option>
              <option value="superadmin">Superadmin</option>
            </select>
          </div>
        </Field>
      </FormSection>

      <FormSection title="Seguridad">
        <Field label="Nueva contraseña" hint="Dejar vacío para no cambiarla.">
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type={showPwd ? "text" : "password"} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Mínimo 8 caracteres" className="admin-input !pl-9 !pr-10" />
            <button type="button" tabIndex={-1} onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </Field>
      </FormSection>

      {success && <div className="bg-[#ecfdf3] border border-[#1a6b3c]/20 rounded-xl px-4 py-3 text-[#1a6b3c] text-sm font-medium">{success}</div>}
      <FormActions submitLabel="Guardar cambios" loading={loading} onCancel={() => router.back()} error={error} />
    </form>
  );
}
