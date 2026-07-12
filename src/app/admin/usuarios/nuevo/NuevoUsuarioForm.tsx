"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, User, Shield } from "lucide-react";
import { FormSection, Field, FormActions } from "../../_components/ui";

export default function NuevoUsuarioForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPwd, setShowPwd] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true); setError(""); setSuccess("");
    const fd = new FormData(e.currentTarget);
    const payload = {
      email: fd.get("email") as string,
      password: fd.get("password") as string,
      nombre: fd.get("nombre") as string,
      rol: fd.get("rol") as string,
    };
    if (payload.password.length < 8) { setError("La contraseña debe tener al menos 8 caracteres."); setLoading(false); return; }
    const res = await fetch("/api/admin/usuarios", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const data = await res.json();
    if (!res.ok) { setError(data.error ?? "Error al crear el usuario."); setLoading(false); return; }
    setSuccess("Usuario creado correctamente.");
    setTimeout(() => router.push("/admin/usuarios"), 1200);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormSection title="Datos del usuario">
        <Field label="Nombre completo" required>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input name="nombre" type="text" required placeholder="Ej: Erika Pierattini" className="admin-input !pl-9" />
          </div>
        </Field>
        <Field label="Correo electrónico" required>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input name="email" type="email" required placeholder="usuario@fenice.cl" className="admin-input !pl-9" />
          </div>
        </Field>
        <Field label="Contraseña" required hint="Mínimo 8 caracteres. Usa mayúsculas, números y símbolos.">
          <div className="relative">
            <input name="password" type={showPwd ? "text" : "password"} required minLength={8} placeholder="Mínimo 8 caracteres" className="admin-input !pr-10" />
            <button type="button" tabIndex={-1} onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700">
              {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </Field>
        <Field label="Rol" required>
          <div className="relative">
            <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 z-10" />
            <select name="rol" defaultValue="admin" className="admin-input !pl-9">
              <option value="admin">Admin — acceso completo al panel</option>
              <option value="editor">Editor — solo blog y productos</option>
              <option value="superadmin">Superadmin — incluye gestión de usuarios</option>
            </select>
          </div>
        </Field>
      </FormSection>

      {success && <div className="bg-[#1a6b3c]/12 border border-[#1a6b3c]/20 rounded-xl px-4 py-3 text-[#1a6b3c] text-sm font-medium">{success}</div>}
      <FormActions submitLabel="Crear usuario" loading={loading} onCancel={() => router.back()} error={error} />
    </form>
  );
}
