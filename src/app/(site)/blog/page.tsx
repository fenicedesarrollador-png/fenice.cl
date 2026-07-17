import type { Metadata } from "next";
import Link from "next/link";
import { Newspaper } from "lucide-react";
import { createClient } from "@/lib/supabase/public";
import CTASection from "@/components/CTASection";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Blog sobre Petróleo Diésel y Kerosene para Empresas",
  description:
    "Artículos y guías sobre abastecimiento de petróleo diésel y kerosene, despachos programados, generadores, calderas y continuidad operacional para empresas en Chile.",
  alternates: { canonical: "https://fenice.cl/blog" },
};

type PostCard = {
  slug: string;
  titulo: string;
  extracto: string | null;
  fecha_publicacion: string | null;
  categoria: string | null;
};

// El blog se administra exclusivamente desde /admin/blog (tabla blog_posts en
// Supabase). No mantener artículos estáticos en el código: todo contenido
// publicado debe ser creado y validado por el equipo de Fenice.
export default async function BlogPage() {
  let posts: PostCard[] = [];
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("blog_posts")
      .select("slug, titulo, extracto, fecha_publicacion, categoria")
      .eq("publicado", true)
      .order("fecha_publicacion", { ascending: false });
    if (data) posts = data;
  } catch {}

  return (
    <>
      <section className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl lg:text-5xl font-extrabold mb-4">Blog de Fenice SPA</h1>
          <p className="text-xl text-gray-300 max-w-3xl">
            Guías prácticas sobre abastecimiento de petróleo diésel y kerosene,
            despachos programados y continuidad operacional para empresas e instituciones.
          </p>
        </div>
      </section>

      <section className="py-14 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {posts.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto mb-5">
                <Newspaper className="w-7 h-7 text-[#1a6b3c]" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Muy pronto publicaremos contenido</h2>
              <p className="text-gray-500 text-sm max-w-md mx-auto mb-8">
                Estamos preparando artículos sobre abastecimiento de combustible,
                despachos programados y continuidad operacional. Mientras tanto,
                puedes cotizar tu combustible o resolver dudas en nuestras preguntas frecuentes.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/cotizacion" className="inline-flex items-center justify-center gap-2 bg-[#f5a623] hover:bg-[#d4891a] text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors">
                  Solicitar cotización
                </Link>
                <Link href="/preguntas-frecuentes" className="inline-flex items-center justify-center gap-2 border border-slate-200 hover:border-[#1a6b3c]/40 text-slate-700 font-semibold px-6 py-3 rounded-xl text-sm transition-colors">
                  Ver preguntas frecuentes
                </Link>
              </div>
            </div>
          ) : (
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
          )}
        </div>
      </section>

      <CTASection />
    </>
  );
}
