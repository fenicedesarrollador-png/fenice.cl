import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import CTASection from "@/components/CTASection";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Productos | Combustibles y Servicios",
  description: "Catálogo de productos y servicios de Fenice SPA para despacho de combustible e instalación de estanques en la Región Metropolitana.",
  alternates: { canonical: "https://fenice.cl/productos/" },
};

export default async function ProductosPage() {
  let productos: { slug: string; nombre: string; descripcion_corta?: string; imagen_url?: string; categoria?: string }[] = [];
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("productos")
      .select("slug, nombre, descripcion_corta, imagen_url, categoria")
      .eq("activo", true)
      .order("destacado", { ascending: false });
    if (data) productos = data;
  } catch {}

  return (
    <>
      <section className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl lg:text-5xl font-extrabold mb-4">Productos y servicios</h1>
          <p className="text-xl text-gray-300 max-w-3xl">
            Catálogo de combustibles y servicios disponibles para empresas e industria en la RM.
          </p>
        </div>
      </section>

      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {productos.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-lg">Próximamente publicaremos nuestro catálogo de productos.</p>
              <p className="mt-2">Mientras tanto, cotiza directamente por WhatsApp.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {productos.map((p) => (
                <Link
                  key={p.slug}
                  href={`/productos/${p.slug}`}
                  className="group bg-gray-50 hover:bg-orange-50 border border-gray-100 hover:border-orange-200 rounded-2xl overflow-hidden transition-all"
                >
                  {p.imagen_url && (
                    <div className="aspect-video overflow-hidden bg-gray-100">
                      <img
                        src={p.imagen_url}
                        alt={p.nombre}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        loading="lazy"
                        width={400}
                        height={225}
                      />
                    </div>
                  )}
                  <div className="p-6">
                    {p.categoria && (
                      <span className="text-xs font-semibold text-orange-600 uppercase tracking-wider">
                        {p.categoria}
                      </span>
                    )}
                    <h2 className="text-lg font-bold text-gray-900 mt-1 mb-2 group-hover:text-orange-700">
                      {p.nombre}
                    </h2>
                    {p.descripcion_corta && (
                      <p className="text-gray-500 text-sm leading-relaxed">{p.descripcion_corta}</p>
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
