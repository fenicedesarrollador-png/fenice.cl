import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import BlogForm from "../../_BlogForm";
import { FormPageHeader } from "../../../_components/ui";

export const metadata: Metadata = { title: "Editar Post" };

export default async function EditarPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let post = null;
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("blog_posts").select("*").eq("id", id).single();
    if (data) post = data;
  } catch {}
  if (!post) notFound();
  return (
    <div className="p-4 sm:p-6 lg:p-7 max-w-3xl mx-auto admin-rise">
      <FormPageHeader title="Editar post" subtitle={post.titulo} backHref="/admin/blog" />
      <BlogForm post={post} />
    </div>
  );
}
