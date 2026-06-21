import type { Metadata } from "next";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import EditarUsuarioForm from "./EditarUsuarioForm";
import { FormPageHeader } from "../../../_components/ui";

export const metadata: Metadata = { title: "Editar Usuario" };

export default async function EditarUsuarioPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
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

  const serviceClient = await createServiceClient();
  const { data: profile } = await serviceClient
    .from("admin_profiles")
    .select("id, user_id, nombre, rol, activo")
    .eq("id", id)
    .single();

  if (!profile) redirect("/admin/usuarios");

  const { data: authUsers } = await serviceClient.auth.admin.listUsers();
  const authUser = authUsers?.users?.find((u) => u.id === profile.user_id);

  return (
    <div className="p-4 sm:p-6 lg:p-7 max-w-2xl mx-auto admin-rise">
      <FormPageHeader title="Editar usuario" subtitle={authUser?.email ?? profile.user_id} backHref="/admin/usuarios" />
      <EditarUsuarioForm profile={{ ...profile, email: authUser?.email ?? "" }} />
    </div>
  );
}
