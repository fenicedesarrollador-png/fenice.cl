import type { Metadata } from "next";
import BlogForm from "../_BlogForm";

export const metadata: Metadata = { title: "Nuevo Post" };

export default function NuevoPostPage() {
  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Nuevo post</h1>
      <BlogForm />
    </div>
  );
}
