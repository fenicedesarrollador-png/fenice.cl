import type { Metadata } from "next";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import EditarUsuarioForm from "./EditarUsuarioForm";

export const metadata: Metadata = { title: "Editar Usuario" };

export default async function EditarUsuarioPage({ params }: { params: { id: string } }) {
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
    .eq("id", params.id)
    .single();

  if (!profile) redirect("/admin/usuarios");

  const { data: authUsers } = await serviceClient.auth.admin.listUsers();
  const authUser = authUsers?.users?.find((u) => u.id === profile.user_id);

  return (
    <div className="p-6 lg:p-8 max-w-xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Editar usuario</h1>
        <p className="text-slate-500 text-sm mt-0.5">{authUser?.email ?? profile.user_id}</p>
      </div>
      <EditarUsuarioForm profile={{ ...profile, email: authUser?.email ?? "" }} />
    </div>
  );
}
