import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { fetchWithTimeout } from "@/lib/getSiteConfig";
import CTASection from "@/components/CTASection";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 60;

export const metadata = buildMetadata({
  title: "Productos | Petróleo Diesel y Combustibles para Empresas",
  description:
    "Catálogo de combustibles de Fenice SPA: petróleo diesel, kerosene y soluciones de abastecimiento a domicilio para empresas e industria en la Región Metropolitana de Santiago.",
  path: "/productos",
  keywords: [
    "venta de petróleo diesel santiago",
    "productos de combustible empresas",
    "catálogo de combustibles RM",
    "petróleo diesel a domicilio",
  ],
});

export default async function ProductosPage() {
  let productos: { slug: string; nombre: string; descripcion_corta?: string; imagen_url?: string; categoria?: string }[] = [];
  try {
    const supabase = await createClient();
    const result = await fetchWithTimeout(
      supabase
        .from("productos")
        .select("slug, nombre, descripcion_corta, imagen_url, categoria")
        .eq("activo", true)
        .order("destacado", { ascending: false }),
      2500,
    );
    if (result?.data) productos = result.data;
  } catch {}

  return (
    <>
      <section className="bg-[#0a1628] text-white py-16 relative overflow-hidden">
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#1a6b3c] via-[#f5a623] to-[#1a6b3c]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="inline-flex items-center gap-2 bg-[#f5a623]/10 border border-[#f5a623]/25 text-[#f5a623] text-xs font-bold px-3 py-1.5 rounded-full mb-5 uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-[#f5a623]" />
            Catálogo de combustibles
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold mb-4 leading-tight">
            Productos de combustible para empresas e industria
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl">
            Petróleo diesel, kerosene y soluciones de abastecimiento a domicilio en toda la
            Región Metropolitana de Santiago, con despacho rápido y factura electrónica.
          </p>
        </div>
      </section>

      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Intro de contenido SEO */}
          <div className="max-w-3xl mb-10">
            <h2 className="text-2xl font-bold text-[#0a1628] mb-3">
              Combustibles disponibles para tu operación
            </h2>
            <p className="text-slate-600 leading-relaxed">
              En Fenice SPA distribuimos combustible a empresas, faenas, flotas e industrias de la
              Región Metropolitana. Cada producto se despacha directamente en tu instalación, con
              coordinación por WhatsApp, horarios flexibles y documentación tributaria completa.
              Si no encuentras lo que buscas, escríbenos y te asesoramos según tu consumo y frecuencia.
            </p>
          </div>

          {productos.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <p className="text-lg">Próximamente publicaremos nuestro catálogo completo de productos.</p>
              <p className="mt-2">Mientras tanto, cotiza directamente por WhatsApp y te asesoramos.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {productos.map((p) => (
                <Link
                  key={p.slug}
                  href={`/productos/${p.slug}`}
                  className="group bg-slate-50 hover:bg-[#ecfdf3] border border-slate-100 hover:border-[#1a6b3c]/30 rounded-2xl overflow-hidden transition-all"
                >
                  {p.imagen_url && (
                    <div className="aspect-video overflow-hidden bg-slate-100 relative">
                      <Image
                        src={p.imagen_url}
                        alt={`${p.nombre} — Fenice SPA`}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    {p.categoria && (
                      <span className="text-xs font-semibold text-[#1a6b3c] uppercase tracking-wider">
                        {p.categoria}
                      </span>
                    )}
                    <h3 className="text-lg font-bold text-[#0a1628] mt-1 mb-2 group-hover:text-[#1a6b3c]">
                      {p.nombre}
                    </h3>
                    {p.descripcion_corta && (
                      <p className="text-slate-500 text-sm leading-relaxed">{p.descripcion_corta}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <CTASection />
    </>
  );
}
