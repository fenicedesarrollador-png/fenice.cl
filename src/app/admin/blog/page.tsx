import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import DeleteButton from "../_components/DeleteButton";
import { PageHeader, PrimaryLink, Badge, EmptyState, SiteLink } from "../_components/ui";
import { Plus, FileText, Edit2, Eye, EyeOff } from "lucide-react";

export const metadata: Metadata = { title: "Blog" };

export default async function AdminBlogPage() {
  let posts: {
    id: string; titulo: string; publicado: boolean;
    fecha_publicacion?: string; categoria?: string; slug: string; meta_description?: string;
  }[] = [];
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("blog_posts").select("id, titulo, publicado, fecha_publicacion, categoria, slug, meta_description").order("created_at", { ascending: false });
    if (data) posts = data;
  } catch {}

  const publicados = posts.filter((p) => p.publicado).length;
  const borradores = posts.length - publicados;

  return (
    <div className="p-4 sm:p-6 lg:p-7 max-w-[1100px] mx-auto admin-rise">
      <PageHeader icon={FileText} accent="indigo" title="Blog" subtitle={`${posts.length} artículo${posts.length !== 1 ? "s" : ""} · ${publicados} publicado${publicados !== 1 ? "s" : ""}`}>
        <PrimaryLink href="/admin/blog/nuevo" icon={Plus}>Nuevo post</PrimaryLink>
      </PageHeader>

      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          { label: "Total", value: posts.length, color: "text-[#0a1628]" },
          { label: "Publicados", value: publicados, color: "text-[#1a6b3c]" },
          { label: "Borradores", value: borradores, color: "text-[#d98a0e]" },
        ].map((s) => (
          <div key={s.label} className="admin-card px-4 py-3 text-center">
            <p className={`text-[26px] leading-none font-black tabular-nums ${s.color}`}>{s.value}</p>
            <p className="text-[11px] text-slate-500 font-bold mt-1.5">{s.label}</p>
          </div>
        ))}
      </div>

      {posts.length === 0 ? (
        <EmptyState icon={FileText} title="Aún no hay posts" description="Crea tu primer artículo del blog." action={{ href: "/admin/blog/nuevo", label: "Crear post" }} />
      ) : (
        <div className="space-y-2.5">
          {posts.map((p) => (
            <div key={p.id} className={`admin-card p-3.5 flex items-center gap-3 transition-all hover:shadow-md ${!p.publicado ? "opacity-75" : ""}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${p.publicado ? "bg-[#ecfdf3] text-[#1a6b3c]" : "bg-[#fff7ec] text-[#d98a0e]"}`}>
                {p.publicado ? <Eye className="w-4.5 h-4.5" /> : <EyeOff className="w-4.5 h-4.5" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-black text-[#0a1628] text-sm line-clamp-1">{p.titulo}</p>
                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                  {p.categoria && <span className="text-[10px] bg-indigo-50 text-indigo-600 font-bold px-1.5 py-0.5 rounded-md">{p.categoria}</span>}
                  {p.fecha_publicacion && <span className="text-[11px] text-slate-400">{new Date(p.fecha_publicacion).toLocaleDateString("es-CL", { dateStyle: "medium" })}</span>}
                </div>
              </div>
              <div className="hidden sm:block shrink-0">
                <Badge tone={p.publicado ? "green" : "amber"} dot>{p.publicado ? "Publicado" : "Borrador"}</Badge>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Link href={`/admin/blog/${p.id}/editar`} className="p-2 rounded-lg text-slate-400 hover:text-[#1a6b3c] hover:bg-[#ecfdf3] transition-all" title="Editar"><Edit2 className="w-4 h-4" /></Link>
                {p.publicado && <SiteLink href={`/blog/${p.slug}`} />}
                <DeleteButton table="blog_posts" id={p.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
