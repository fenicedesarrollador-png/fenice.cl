"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

function hasPlaceholderConfig() {
  return (
    supabaseUrl.includes("YOUR_PROJECT") ||
    supabaseAnonKey.includes("YOUR_ANON_KEY")
  );
}

function getSupabaseUrlError() {
  if (!supabaseUrl) return "Falta NEXT_PUBLIC_SUPABASE_URL.";
  if (hasPlaceholderConfig()) {
    return "La app no está conectada a tu proyecto Supabase. Revisa NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY.";
  }

  try {
    const parsed = new URL(supabaseUrl);

    if (parsed.protocol !== "https:") {
      return "NEXT_PUBLIC_SUPABASE_URL debe usar https.";
    }

    if (!parsed.hostname.endsWith(".supabase.co") && !parsed.hostname.endsWith(".supabase.in")) {
      return "NEXT_PUBLIC_SUPABASE_URL debe ser el dominio base de Supabase.";
    }
  } catch {
    return "NEXT_PUBLIC_SUPABASE_URL no es una URL valida.";
  }

  return "";
}

function hasSupabaseConfigError() {
  return !supabaseAnonKey || !!getSupabaseUrlError();
}

function getLoginErrorMessage(message?: string) {
  const urlError = getSupabaseUrlError();
  if (urlError) {
    return urlError;
  }

  if (!supabaseAnonKey) {
    return "Falta NEXT_PUBLIC_SUPABASE_ANON_KEY.";
  }

  const normalized = (message ?? "").toLowerCase();

  if (normalized.includes("email not confirmed")) {
    return "El usuario existe, pero su correo aún no está confirmado en Supabase Auth.";
  }

  if (
    normalized.includes("invalid login credentials") ||
    normalized.includes("invalid_grant")
  ) {
    return "Credenciales incorrectas. Verifica tu email y contraseña.";
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

    if (hasSupabaseConfigError()) {
      setError(getLoginErrorMessage());
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      console.error("Supabase login error:", authError);
      setError(getLoginErrorMessage(authError.message));
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
            className="w-full border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-slate-50"
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
            className="w-full border border-slate-200 rounded-xl pl-9 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-slate-50"
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
        className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors shadow-sm mt-2"
      >
        {loading ? "Verificando..." : "Ingresar"}
      </button>
    </form>
  );
}
