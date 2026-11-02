import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getPublishedPost, getPublishedPosts } from "@/lib/blog";
import { buildMetadata, jsonLd } from "@/lib/seo";
import { formatBusinessDate } from "@/lib/dates";
import { SITE_CONFIG } from "@/lib/config";
import CTASection from "@/components/CTASection";
import Breadcrumb from "@/components/Breadcrumb";
import BlogContent from "@/components/blog/BlogContent";
import BlogCards from "@/components/blog/BlogCards";
import GeneratorToolLink from "@/components/GeneratorToolLink";

export const revalidate = 60;
type Props = { params: Promise<{ slug: string }> };

function modifiedTime(post: { updated_at: string | null; fecha_publicacion: string | null }) {
  if (!post.updated_at) return post.fecha_publicacion || undefined;
  if (!post.fecha_publicacion) return post.updated_at;
  return Date.parse(post.updated_at) >= Date.parse(post.fecha_publicacion) ? post.updated_at : post.fecha_publicacion;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  if (!post) notFound();
  return buildMetadata({
    title: post.meta_title || post.titulo,
    description: post.meta_description || post.extracto || post.titulo,
    path: `/blog/${slug}`, type: "article", image: post.imagen_destacada || undefined,
    publishedTime: post.fecha_publicacion || undefined,
    modifiedTime: modifiedTime(post),
  });
}

export async function generateStaticParams() {
  return (await getPublishedPosts()).map(({ slug }) => ({ slug }));
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  if (!post) notFound();
  const posts = await getPublishedPosts();
  const related = posts.filter((p) => p.slug !== slug)
    .sort((a, b) => Number(b.categoria === post.categoria) - Number(a.categoria === post.categoria)).slice(0, 3);
  const base = SITE_CONFIG.site_url;
  const postUrl = `${base}/blog/${slug}`;
  const image = new URL(post.imagen_destacada || "/opengraph-image", base).href;
  const readingMinutes = Math.max(1, Math.ceil(post.contenido.split(/\s+/).length / 220));
  const schema = {
    "@context": "https://schema.org", "@type": "BlogPosting", "@id": `${postUrl}/#article`,
    headline: post.titulo, description: post.extracto, image,
    author: { "@type": "Organization", name: post.autor || "Fenice SPA", url: `${base}/nosotros` },
    publisher: { "@id": `${base}/#organization` },
    ...(post.fecha_publicacion ? { datePublished: post.fecha_publicacion } : {}),
    ...(post.updated_at || post.fecha_publicacion ? { dateModified: modifiedTime(post) } : {}),
    url: postUrl, mainEntityOfPage: { "@type": "WebPage", "@id": postUrl },
    isPartOf: { "@id": `${base}/blog/#blog` }, inLanguage: "es-CL",
    ...(post.categoria ? { articleSection: post.categoria } : {}),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(schema)} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb crumbs={[{ name: "Inicio", href: "/" }, { name: "Blog", href: "/blog" }, { name: post.titulo }]} />
      </div>
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <header>
          {post.categoria && <p className="text-xs font-bold text-[#1a6b3c] uppercase tracking-wider">{post.categoria}</p>}
          <h1 className="text-3xl lg:text-4xl font-extrabold text-[#0a1628] mt-3 mb-5 leading-tight">{post.titulo}</h1>
          <p className="text-sm text-slate-500 mb-6">
            <Link href="/nosotros" rel="author" className="text-[#1a6b3c] font-semibold">{post.autor || "Fenice SPA"}</Link>
            {post.fecha_publicacion && <> · <time dateTime={post.fecha_publicacion}>{formatBusinessDate(post.fecha_publicacion)}</time></>}
            {` · ${readingMinutes} min de lectura`}
          </p>
          {post.extracto && <p className="text-lg text-slate-600 leading-relaxed mb-8">{post.extracto}</p>}
          {post.imagen_destacada && <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-8"><Image src={post.imagen_destacada} alt={post.titulo} fill priority sizes="(max-width: 896px) 100vw, 896px" className="object-cover" /></div>}
        </header>
        <aside className="rounded-xl border border-[#1a6b3c]/20 bg-[#f0faf4] p-5 mb-8" aria-label="Cotización de combustible">
          <p className="font-bold text-[#0a1628] mb-2">¿Estás planificando una compra de combustible?</p>
          <p className="text-sm text-slate-600 mb-3">Indica comuna, litros y fecha para confirmar precio y disponibilidad de despacho.</p>
          <Link href="/cotizacion" data-analytics-id="blog_inline_quote" data-analytics-cta="quote" className="text-sm font-bold text-[#1a6b3c] underline underline-offset-4">Cotizar con FENICE →</Link>
        </aside>
        <BlogContent content={post.contenido} />
        {slug === "calcular-consumo-diesel-generador-electrico" && <div className="mt-8"><GeneratorToolLink /></div>}
        <div className="mt-10 border-t border-slate-200 pt-6"><Link href="/blog" className="text-[#1a6b3c] font-semibold">← Ver todas las guías</Link></div>
      </article>
      {related.length > 0 && <section className="bg-slate-50 py-14"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><h2 className="text-2xl font-extrabold text-[#0a1628] mb-7">Sigue planificando tu abastecimiento</h2><BlogCards posts={related} /></div></section>}
      <CTASection heading="Cotiza el abastecimiento de tu operación" mensaje={`Hola, leí la guía «${post.titulo}» en fenice.cl y quiero cotizar combustible para mi operación.`} />
    </>
  );
}
