import type { Metadata } from "next";
import BlogForm from "../_BlogForm";
import { FormPageHeader } from "../../_components/ui";

export const metadata: Metadata = { title: "Nuevo Post" };

export default function NuevoPostPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-7 max-w-3xl mx-auto admin-rise">
      <FormPageHeader title="Nuevo post" subtitle="Redacta un nuevo artículo para el blog" backHref="/admin/blog" />
      <BlogForm />
    </div>
  );
}
