import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/public";
import { fetchWithTimeout } from "@/lib/getSiteConfig";
import { buildMetadata, jsonLd } from "@/lib/seo";
import { SITE_CONFIG } from "@/lib/config";
import CTASection from "@/components/CTASection";
import Breadcrumb from "@/components/Breadcrumb";
import Link from "next/link";

export const revalidate = 60;

// Los artículos del blog viven ÚNICAMENTE en Supabase (tabla blog_posts) y se
// administran desde /admin/blog. No agregar contenido estático aquí: todo
// artículo publicado debe ser creado y validado por el equipo de Fenice.

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const supabase = await createClient();
    const result = await fetchWithTimeout(
      supabase
        .from("blog_posts")
        .select("titulo, extracto, meta_title, meta_description, imagen_destacada, fecha_publicacion, updated_at")
        .eq("slug", slug)
        .eq("publicado", true)
        .single(),
      2500,
    );
    const data = result?.data;
    if (data) {
      return buildMetadata({
        title: data.meta_title || data.titulo,
        description: data.meta_description || data.extracto,
        path: `/blog/${slug}`,
        type: "article",
        image: data.imagen_destacada || undefined,
        publishedTime: data.fecha_publicacion || undefined,
        modifiedTime: data.updated_at || data.fecha_publicacion || undefined,
      });
    }
  } catch {}

  return { title: "Post no encontrado", robots: { index: false, follow: false } };
}

export async function generateStaticParams() {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("blog_posts").select("slug").eq("publicado", true);
    return (data || []).map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  let post: { titulo: string; contenido: string; extracto: string; fecha_publicacion: string; categoria: string; autor: string; imagen_destacada?: string; updated_at?: string } | null = null;

  try {
    const supabase = await createClient();
    const result = await fetchWithTimeout(
      supabase.from("blog_posts").select("*").eq("slug", slug).eq("publicado", true).single(),
      2500,
    );
    if (result?.data) post = result.data;
  } catch {}

  if (!post) notFound();

  const base = SITE_CONFIG.site_url;
  const postUrl = `${base}/blog/${slug}`;
  const postImage = post.imagen_destacada || `${base}/opengraph-image`;

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.titulo,
    description: post.extracto,
    image: postImage,
    author: { "@type": "Organization", name: post.autor || "Fenice SPA", url: `${base}/` },
    publisher: { "@id": `${base}/#organization` },
    datePublished: post.fecha_publicacion,
    dateModified: post.updated_at || post.fecha_publicacion,
    url: postUrl,
    mainEntityOfPage: { "@type": "WebPage", "@id": postUrl },
    inLanguage: "es-CL",
    ...(post.categoria ? { articleSection: post.categoria } : {}),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(blogSchema)} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb crumbs={[
          { name: "Inicio", href: "/" },
          { name: "Blog", href: "/blog" },
          { name: post.titulo },
        ]} />
      </div>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {post.categoria && (
          <span className="text-xs font-semibold text-orange-600 uppercase tracking-wider">
            {post.categoria}
          </span>
        )}
        <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mt-2 mb-4 leading-tight">
          {post.titulo}
        </h1>
        {post.fecha_publicacion && (
          <p className="text-gray-400 text-sm mb-8">
            Publicado el{" "}
            {new Date(post.fecha_publicacion).toLocaleDateString("es-CL", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}{" "}
            · {post.autor || "Fenice SPA"}
          </p>
        )}

        {/* Render markdown-ish content */}
        <div className="prose prose-gray max-w-none">
          {post.contenido.split("\n").map((line, i) => {
            if (line.startsWith("## ")) return <h2 key={i} className="text-2xl font-bold text-gray-900 mt-8 mb-3">{line.slice(3)}</h2>;
            if (line.startsWith("### ")) return <h3 key={i} className="text-xl font-bold text-gray-900 mt-6 mb-2">{line.slice(4)}</h3>;
            if (line.startsWith("- ")) return <li key={i} className="ml-4 text-gray-600">{line.slice(2)}</li>;
            if (line.startsWith("| ")) return <div key={i} className="text-sm text-gray-600 font-mono">{line}</div>;
            if (line.startsWith("1. ") || line.startsWith("2. ") || line.startsWith("3. ") || line.startsWith("4. ")) return <li key={i} className="ml-4 text-gray-600 list-decimal">{line.slice(3)}</li>;
            if (line.startsWith("**")) return <p key={i} className="text-gray-700 font-semibold mb-2">{line.replace(/\*\*/g, "")}</p>;
            if (line.trim() === "") return <br key={i} />;
            return <p key={i} className="text-gray-600 leading-relaxed mb-3">{line.replace(/\*\*([^*]+)\*\*/g, "$1")}</p>;
          })}
        </div>

        <div className="mt-12 border-t border-gray-100 pt-8">
          <Link href="/blog" className="text-orange-600 hover:underline font-semibold">
            ← Volver al blog
          </Link>
        </div>
      </article>

      <CTASection />
    </>
  );
}
