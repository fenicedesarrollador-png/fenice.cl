import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminShell from "./AdminShell";

export const metadata: Metadata = {
  title: { default: "Panel Admin | Fenice SPA", template: "%s | Admin Fenice" },
  robots: { index: false, follow: false, noarchive: true, nosnippet: true },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("admin_profiles")
    .select("activo, rol")
    .eq("user_id", user.id)
    .single();

  if (!profile || !profile.activo) {
    await supabase.auth.signOut();
    redirect("/login?error=acceso_denegado");
  }

  return (
    <AdminShell userEmail={user.email ?? ""} userRol={profile.rol ?? "admin"}>
      {children}
    </AdminShell>
  );
}
