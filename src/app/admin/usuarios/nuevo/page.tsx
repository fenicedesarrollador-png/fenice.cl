import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import NuevoUsuarioForm from "./NuevoUsuarioForm";

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
    <div className="p-6 lg:p-8 max-w-xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Nuevo usuario</h1>
        <p className="text-slate-500 text-sm mt-0.5">Crea un acceso al panel de administración</p>
      </div>
      <NuevoUsuarioForm />
    </div>
  );
}
