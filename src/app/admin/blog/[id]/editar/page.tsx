import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import BlogForm from "../../_BlogForm";

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
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Editar post</h1>
      <BlogForm post={post} />
    </div>
  );
}
