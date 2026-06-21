import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import DeleteButton from "../_components/DeleteButton";
import { Plus, FileText, ExternalLink, Edit2, Eye, EyeOff } from "lucide-react";

export const metadata: Metadata = { title: "Blog" };

export default async function AdminBlogPage() {
  let posts: {
    id: string; titulo: string; publicado: boolean;
    fecha_publicacion?: string; categoria?: string; slug: string;
    meta_description?: string;
  }[] = [];

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("blog_posts")
      .select("id, titulo, publicado, fecha_publicacion, categoria, slug, meta_description")
      .order("created_at", { ascending: false });
    if (data) posts = data;
  } catch {}

  const publicados = posts.filter((p) => p.publicado).length;
  const borradores = posts.filter((p) => !p.publicado).length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1200px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5 text-indigo-500" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900">Blog</h1>
            <p className="text-slate-400 text-xs mt-0.5 font-medium">
              {posts.length} post{posts.length !== 1 ? "s" : ""} · {publicados} publicado{publicados !== 1 ? "s" : ""} · {borradores} borrador{borradores !== 1 ? "es" : ""}
            </p>
          </div>
        </div>
        <Link
          href="/admin/blog/nuevo"
          className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-colors shadow-sm shadow-orange-500/20"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Nuevo post</span>
          <span className="sm:hidden">Nuevo</span>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: "Total posts", value: posts.length, color: "text-slate-900" },
          { label: "Publicados", value: publicados, color: "text-green-600" },
          { label: "Borradores", value: borradores, color: "text-amber-600" },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-slate-100 rounded-xl px-4 py-3 shadow-sm text-center">
            <p className={`text-2xl font-black tabular-nums ${s.color}`}>{s.value}</p>
            <p className="text-[11px] text-slate-400 font-semibold mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-20 bg-white border border-dashed border-slate-200 rounded-2xl">
          <FileText className="w-8 h-8 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-semibold text-sm">No hay posts aún</p>
          <Link href="/admin/blog/nuevo" className="mt-3 inline-flex items-center gap-2 text-orange-500 text-sm font-bold hover:underline">
            <Plus className="w-4 h-4" /> Crear el primero
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
          {/* Desktop table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="text-left px-5 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Título</th>
                  <th className="text-left px-5 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Categoría</th>
                  <th className="text-left px-5 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Fecha</th>
                  <th className="text-center px-5 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Estado</th>
                  <th className="text-right px-5 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {posts.map((p) => (
                  <tr key={p.id} className={`hover:bg-slate-50/60 transition-colors ${!p.publicado ? "opacity-70" : ""}`}>
                    <td className="px-5 py-4 max-w-xs">
                      <p className="font-bold text-slate-900 text-sm line-clamp-1">{p.titulo}</p>
                      {p.meta_description && (
                        <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{p.meta_description}</p>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      {p.categoria ? (
                        <span className="text-xs bg-indigo-50 text-indigo-600 font-semibold px-2.5 py-1 rounded-lg border border-indigo-100">
                          {p.categoria}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-300">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-500 whitespace-nowrap">
                      {p.fecha_publicacion
                        ? new Date(p.fecha_publicacion).toLocaleDateString("es-CL", { dateStyle: "medium" })
                        : "—"}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-xl border ${
                        p.publicado
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      }`}>
                        {p.publicado ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        {p.publicado ? "Publicado" : "Borrador"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/blog/${p.id}/editar`}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 px-2.5 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all"
                        >
                          <Edit2 className="w-3 h-3" />
                          Editar
                        </Link>
                        {p.publicado && (
                          <a
                            href={`/blog/${p.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all"
                            title="Ver en sitio"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                        <DeleteButton table="blog_posts" id={p.id} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="sm:hidden divide-y divide-slate-50">
            {posts.map((p) => (
              <div key={p.id} className={`px-4 py-4 ${!p.publicado ? "opacity-70" : ""}`}>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900 text-sm line-clamp-2">{p.titulo}</p>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      {p.categoria && (
                        <span className="text-[10px] bg-indigo-50 text-indigo-600 font-bold px-2 py-0.5 rounded-lg">{p.categoria}</span>
                      )}
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${
                        p.publicado ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"
                      }`}>
                        {p.publicado ? "Publicado" : "Borrador"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/admin/blog/${p.id}/editar`}
                    className="flex-1 text-center text-xs font-bold text-slate-700 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all"
                  >
                    Editar
                  </Link>
                  <DeleteButton table="blog_posts" id={p.id} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
