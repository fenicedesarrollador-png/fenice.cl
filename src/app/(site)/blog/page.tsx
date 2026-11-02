import type { Metadata } from "next";
import Link from "next/link";
import { Newspaper } from "lucide-react";
import { getPublishedPosts } from "@/lib/blog";
import { buildMetadata, jsonLd } from "@/lib/seo";
import { SITE_CONFIG } from "@/lib/config";
import BlogCards from "@/components/blog/BlogCards";
import Breadcrumb from "@/components/Breadcrumb";
import CTASection from "@/components/CTASection";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const posts = await getPublishedPosts();
  return buildMetadata({
    title: "Guías de Diésel y Combustible para Empresas",
    description: "Planifica tu compra de diésel y kerosene en Santiago: cotizaciones, consumo de generadores, abastecimiento en faena y despachos para empresas.",
    path: "/blog",
    noindex: posts.length === 0,
  });
}

export default async function BlogPage() {
  const posts = await getPublishedPosts();
  const schema = {
    "@context": "https://schema.org", "@type": "Blog",
    "@id": `${SITE_CONFIG.site_url}/blog/#blog`, url: `${SITE_CONFIG.site_url}/blog`,
    name: "Guías de abastecimiento de combustible de Fenice SPA", inLanguage: "es-CL",
    publisher: { "@id": `${SITE_CONFIG.site_url}/#organization` },
    blogPost: posts.map((post) => ({ "@type": "BlogPosting", headline: post.titulo, url: `${SITE_CONFIG.site_url}/blog/${post.slug}` })),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(schema)} />
      <section className="bg-[#0a1628] text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb dark crumbs={[{ name: "Inicio", href: "/" }, { name: "Blog" }]} />
          <h1 className="text-3xl lg:text-5xl font-extrabold mt-6 mb-4">Guías de combustible para empresas</h1>
          <p className="text-lg text-slate-300 max-w-3xl">Cotizaciones, consumo y planificación de diésel y kerosene para generadores, maquinaria, flotas y calefacción en Santiago y la Región Metropolitana.</p>
          <div className="flex flex-wrap gap-3 mt-7 text-sm">
            <Link className="rounded-full border border-white/30 px-4 py-2 hover:bg-white/10" href="/venta-petroleo-diesel">Diésel para empresas</Link>
            <Link className="rounded-full border border-white/30 px-4 py-2 hover:bg-white/10" href="/servicios/combustible-para-generadores-electricos">Generadores</Link>
            <Link className="rounded-full border border-white/30 px-4 py-2 hover:bg-white/10" href="/venta-kerosene">Kerosene y parafina</Link>
          </div>
        </div>
      </section>
      <section className="py-14 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {posts.length ? <BlogCards posts={posts} /> : (
            <div className="text-center py-12">
              <Newspaper className="mx-auto h-10 w-10 text-[#1a6b3c] mb-5" />
              <h2 className="text-xl font-bold mb-3">Guías de abastecimiento en preparación</h2>
              <p className="text-slate-600 mb-6">Resuelve tus dudas de despacho o solicita una propuesta para tu operación.</p>
              <Link href="/cotizacion" className="inline-block rounded-xl bg-[#1a6b3c] text-white font-bold px-6 py-3">Solicitar cotización</Link>
            </div>
          )}
        </div>
      </section>
      <CTASection />
    </>
  );
}
