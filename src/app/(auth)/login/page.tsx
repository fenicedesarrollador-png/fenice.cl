import type { Metadata } from "next";
import LoginForm from "./LoginForm";
import { Fuel } from "lucide-react";

export const metadata: Metadata = {
  title: "Acceso Admin | Fenice SPA",
  robots: { index: false, follow: false, noarchive: true, nosnippet: true },
};

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const errorMsg =
    searchParams.error === "acceso_denegado"
      ? "Tu cuenta no tiene acceso activo al panel. Contacta al administrador."
      : undefined;

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      {/* Background grid */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "48px 48px" }} />
      <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-sm">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-orange-500 mb-4">
            <Fuel className="w-6 h-6 text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-2xl font-bold text-white">Fenice SPA</h1>
          <p className="text-slate-400 text-sm mt-1">Panel de administración</p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-2xl shadow-black/30">
          <h2 className="text-lg font-bold text-slate-900 mb-1">Iniciar sesión</h2>
          <p className="text-slate-500 text-sm mb-6">Acceso restringido al equipo autorizado.</p>

          {errorMsg && (
            <div className="mb-5 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm">
              {errorMsg}
            </div>
          )}

          <LoginForm />
        </div>

        <p className="text-center text-slate-600 text-xs mt-6">
          Fenice SPA · Panel interno · Acceso restringido
        </p>
      </div>
    </div>
  );
}
