import type { Metadata } from "next";
import Link from "next/link";
import { SERVICIOS } from "@/lib/config";

export const metadata: Metadata = {
  title: "Página no encontrada | Fenice SPA",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section className="min-h-[70vh] flex items-center justify-center py-20 bg-white">
      <div className="max-w-xl mx-auto px-4 text-center">
        <p className="text-8xl font-extrabold text-orange-200 mb-4">404</p>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">Página no encontrada</h1>
        <p className="text-gray-500 mb-8">
          La página que buscas no existe o fue movida. Puedes navegar desde aquí:
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
          <Link href="/" className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors">
            Ir al inicio
          </Link>
          <Link href="/contacto" className="border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-semibold px-6 py-3 rounded-lg transition-colors">
            Contacto
          </Link>
        </div>
        <div className="text-sm text-gray-400">
          <p className="mb-2 font-medium text-gray-600">Nuestros servicios:</p>
          {SERVICIOS.map((s) => (
            <div key={s.slug}>
              <Link href={`/servicios/${s.slug}`} className="text-orange-600 hover:underline">
                {s.nombre}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
