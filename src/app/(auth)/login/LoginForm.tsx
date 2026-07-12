"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabasePublicConfigError } from "@/lib/supabase/config";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";

function getLoginErrorMessage(message?: string) {
  const configError = getSupabasePublicConfigError();
  if (configError) {
    return configError;
  }

  const normalized = (message ?? "").trim().toLowerCase();

  if (normalized === "acceso_denegado") {
    return "Tu cuenta existe, pero no tiene acceso activo al panel.";
  }

  if (normalized.includes("email not confirmed")) {
    return "El usuario existe, pero su correo aún no está confirmado en Supabase Auth.";
  }

  if (
    normalized.includes("invalid login credentials") ||
    normalized.includes("invalid_grant")
  ) {
    return "Credenciales incorrectas. Verifica tu email y contraseña.";
  }

  if (normalized.includes("failed to fetch") || normalized.includes("fetch")) {
    return "No fue posible conectar con el servidor de acceso. Verifica la red y la configuración de Supabase.";
  }

  if (message) {
    return `Error de acceso: ${message}`;
  }

  return "No fue posible iniciar sesión.";
}

export default function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPwd, setShowPwd] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") ?? "").trim().toLowerCase();
    const password = String(fd.get("password") ?? "");

    if (getSupabasePublicConfigError()) {
      setError(getLoginErrorMessage());
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const payload = await res.json().catch(() => ({})) as { error?: string };

      if (!res.ok) {
        setError(getLoginErrorMessage(payload.error));
        setLoading(false);
        return;
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : undefined;
      console.error("Login request error:", err);
      setError(getLoginErrorMessage(message));
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
          Correo electrónico
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="w-full border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b3c] focus:border-transparent bg-slate-50"
            placeholder="admin@fenice.cl"
          />
        </div>
      </div>

      <div>
        <label htmlFor="password" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
          Contraseña
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            id="password"
            name="password"
            type={showPwd ? "text" : "password"}
            required
            autoComplete="current-password"
            className="w-full border border-slate-200 rounded-xl pl-9 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b3c] focus:border-transparent bg-slate-50"
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
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#1a6b3c] hover:bg-[#145530] disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors shadow-sm mt-2"
      >
        {loading ? "Verificando..." : "Ingresar"}
      </button>
    </form>
  );
}
