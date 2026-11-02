import { getPublishedPosts } from "@/lib/blog";
import BlogCards from "./BlogCards";

export default async function ServiceGuides({ categories }: { categories: string[] }) {
  const posts = (await getPublishedPosts().catch(() => []))
    .filter((post) => categories.includes(post.categoria ?? "")).slice(0, 3);
  if (!posts.length) return null;
  return (
    <section className="py-14 bg-slate-50" data-analytics-section="guias_servicio">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-extrabold text-[#0a1628] mb-7">Prepara tu compra de combustible</h2>
        <BlogCards posts={posts} />
      </div>
    </section>
  );
}
