import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import CTASection from "@/components/CTASection";

export const metadata: Metadata = {
  title: "Blog sobre Petróleo y Combustible Industrial",
  description:
    "Artículos técnicos sobre petróleo diesel, instalación de estanques, normativa SEC y gestión de combustible para empresas e industria en Chile.",
  alternates: { canonical: "https://fenice.cl/blog" },
};

const staticPosts = [
  { slug: "diferencia-entre-petroleo-y-diesel", titulo: "Diferencia entre petróleo y diésel: guía para empresas chilenas", extracto: "Muchas empresas usan ambos términos de forma intercambiable. Te explicamos qué significa cada uno en el contexto del mercado de combustibles en Chile.", fecha_publicacion: "2024-01-15", categoria: "Técnico" },
  { slug: "como-calcular-consumo-petroleo-industrial", titulo: "Cómo calcular el consumo de petróleo industrial para tu operación", extracto: "Método práctico para estimar cuánto combustible necesita tu maquinaria, generadores y flotas. Incluye tabla de consumo por tipo de equipo.", fecha_publicacion: "2024-02-10", categoria: "Guías" },
  { slug: "mantenimiento-de-estanques-de-petroleo", titulo: "Mantenimiento de estanques de petróleo: guía completa", extracto: "Checklist de mantenimiento preventivo para estanques de combustible y cómo evitar los problemas más comunes que afectan la operación.", fecha_publicacion: "2024-03-05", categoria: "Mantenimiento" },
  { slug: "normativa-sec-almacenamiento-combustible", titulo: "Normativa SEC para almacenamiento de combustible en Chile (2024)", extracto: "Todo lo que necesitas saber sobre el Decreto N° 160 y la NCh 2597 para instalar y operar estanques de combustible de forma legal en Chile.", fecha_publicacion: "2024-04-20", categoria: "Normativa" },
  { slug: "petroleo-para-generadores-guia-completa", titulo: "Petróleo para generadores eléctricos: guía completa", extracto: "Qué tipo de combustible necesitan los generadores, cuánto consumen y cómo calcular la autonomía de tu grupo electrógeno. Guía práctica para empresas.", fecha_publicacion: "2024-05-12", categoria: "Guías" },
];

export default async function BlogPage() {
  let posts = staticPosts;
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("blog_posts")
      .select("slug, titulo, extracto, fecha_publicacion, categoria")
      .eq("publicado", true)
      .order("fecha_publicacion", { ascending: false });
    if (data && data.length > 0) posts = data;
  } catch {}

  return (
    <>
      <section className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl lg:text-5xl font-extrabold mb-4">Blog de Fenice SPA</h1>
          <p className="text-xl text-gray-300 max-w-3xl">
            Artículos técnicos y guías prácticas sobre petróleo diesel, instalación de estanques,
            normativa SEC y gestión de combustible para empresas en Chile.
          </p>
        </div>
      </section>

      <section className="py-14 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group bg-gray-50 hover:bg-orange-50 border border-gray-100 hover:border-orange-200 rounded-2xl p-6 transition-all flex flex-col"
              >
                {post.categoria && (
                  <span className="text-xs font-semibold text-orange-600 uppercase tracking-wider mb-2">
                    {post.categoria}
                  </span>
                )}
                <h2 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-orange-700 leading-snug">
                  {post.titulo}
                </h2>
                {post.extracto && (
                  <p className="text-gray-500 text-sm leading-relaxed flex-1">{post.extracto}</p>
                )}
                {post.fecha_publicacion && (
                  <p className="text-xs text-gray-400 mt-4">
                    {new Date(post.fecha_publicacion).toLocaleDateString("es-CL", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
