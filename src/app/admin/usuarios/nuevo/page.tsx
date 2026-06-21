import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import NuevoUsuarioForm from "./NuevoUsuarioForm";
import { FormPageHeader } from "../../_components/ui";

export const metadata: Metadata = { title: "Nuevo Usuario Admin" };

export default async function NuevoUsuarioPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: myProfile } = await supabase
    .from("admin_profiles")
    .select("rol")
    .eq("user_id", user!.id)
    .single();

  if (myProfile?.rol !== "superadmin") {
    redirect("/admin");
  }

  return (
    <div className="p-4 sm:p-6 lg:p-7 max-w-2xl mx-auto admin-rise">
      <FormPageHeader title="Nuevo usuario" subtitle="Crea un acceso al panel de administración" backHref="/admin/usuarios" />
      <NuevoUsuarioForm />
    </div>
  );
}
