import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { buildEditorialPosts } from "@/lib/blogEditorial";

export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autenticado." }, { status: 401 });
  const { data: profile } = await supabase.from("admin_profiles")
    .select("rol, activo").eq("user_id", user.id).single();
  if (!profile?.activo || !["admin", "editor", "superadmin"].includes(profile.rol)) {
    return NextResponse.json({ error: "Sin permiso para gestionar el blog." }, { status: 403 });
  }
  const { data, error } = await supabase.from("blog_posts")
    .upsert(buildEditorialPosts(), { onConflict: "slug", ignoreDuplicates: true })
    .select("id");
  if (error) return NextResponse.json({ error: "No se pudo cargar el plan editorial. Revisa la conexión y los permisos del blog." }, { status: 500 });
  revalidatePath("/blog");
  revalidatePath("/blog/[slug]", "page");
  revalidatePath("/");
  revalidatePath("/sitemap.xml");
  revalidatePath("/admin/blog");
  return NextResponse.json({ created: data?.length ?? 0 });
}
