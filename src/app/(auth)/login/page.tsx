import type { Metadata } from "next";
import LoginForm from "./LoginForm";
import BrandLogo from "@/components/BrandLogo";

export const metadata: Metadata = {
  title: "Acceso Admin",
  robots: { index: false, follow: false, noarchive: true, nosnippet: true },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const errorMsg =
    resolvedSearchParams.error === "acceso_denegado"
      ? "Tu cuenta no tiene acceso activo al panel. Contacta al administrador."
      : undefined;

  return (
    <div className="min-h-screen bg-[#f3f5f9] flex items-center justify-center p-4">
      {/* Background grid */}
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(#0a1628 1px, transparent 1px), linear-gradient(90deg, #0a1628 1px, transparent 1px)", backgroundSize: "48px 48px" }} />
      <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#1a6b3c]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-sm">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="flex justify-center">
            <BrandLogo className="h-16 w-[219px]" priority />
          </div>
          <p className="text-slate-500 text-sm mt-3">Panel de administración</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-xl shadow-slate-900/5">
          <h2 className="text-lg font-bold text-[#0a1628] mb-1">Iniciar sesión</h2>
          <p className="text-slate-500 text-sm mb-6">Acceso restringido al equipo autorizado.</p>

          {errorMsg && (
            <div className="mb-5 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm">
              {errorMsg}
            </div>
          )}

          <LoginForm />
        </div>

        <p className="text-center text-slate-400 text-xs mt-6">
          Fenice SPA · Panel interno · Acceso restringido
        </p>
      </div>
    </div>
  );
}
