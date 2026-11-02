import Link from "next/link";
import { getPublishedPosts } from "@/lib/blog";
import BlogCards from "./BlogCards";

export default async function LatestArticles() {
  // La portada comercial sigue disponible aunque falle el contenido secundario.
  const posts = await getPublishedPosts().catch(() => []);
  if (!posts.length) return null;
  return (
    <section className="py-16 bg-slate-50" data-analytics-section="blog">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-between items-end gap-4 mb-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#1a6b3c] mb-3">Guías para tu operación</p>
            <h2 className="text-3xl font-extrabold text-[#0a1628]">Planifica tu abastecimiento de combustible</h2>
          </div>
          <Link href="/blog" className="text-sm font-bold text-[#1a6b3c]">Ver todas las guías →</Link>
        </div>
        <BlogCards posts={posts.slice(0, 3)} />
      </div>
    </section>
  );
}
