import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { formatBusinessDate } from "@/lib/dates";
import type { BlogCard } from "@/lib/blog";

export default function BlogCards({ posts }: { posts: BlogCard[] }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <article key={post.slug} className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white">
          {post.imagen_destacada && (
            <Link href={`/blog/${post.slug}`} tabIndex={-1} aria-hidden="true" className="relative block aspect-[16/9]">
              <Image src={post.imagen_destacada} alt="" fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover" />
            </Link>
          )}
          <div className="flex flex-1 flex-col p-6">
            {post.categoria && <p className="text-xs font-bold uppercase tracking-wider text-[#1a6b3c] mb-3">{post.categoria}</p>}
            <h2 className="text-lg font-bold text-[#0a1628] leading-snug mb-3">
              <Link href={`/blog/${post.slug}`} className="hover:text-[#1a6b3c]">{post.titulo}</Link>
            </h2>
            <p className="flex-1 text-sm leading-relaxed text-slate-600">{post.extracto}</p>
            {post.fecha_publicacion && <time dateTime={post.fecha_publicacion} className="mt-4 text-xs text-slate-500">{formatBusinessDate(post.fecha_publicacion)}</time>}
            <Link href={`/blog/${post.slug}`} data-analytics-id={`blog_article_${post.slug}`} data-analytics-cta="content_navigation" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#1a6b3c]">
              Leer guía <span className="sr-only">: {post.titulo}</span><ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}
