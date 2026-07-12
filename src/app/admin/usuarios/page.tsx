import type { Metadata } from "next";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus, Shield, ShieldCheck, Users } from "lucide-react";
import DeleteAdminUserButton from "./DeleteAdminUserButton";
import ToggleActiveButton from "./ToggleActiveButton";
import { PageHeader, PrimaryLink, Badge } from "../_components/ui";

export const metadata: Metadata = { title: "Usuarios Admin" };

const ROL: Record<string, { label: string; tone: "purple" | "blue" | "green" }> = {
  superadmin: { label: "Super Admin", tone: "purple" },
  admin: { label: "Admin", tone: "blue" },
  editor: { label: "Editor", tone: "green" },
};

const AVATAR = [
  "bg-[#1a6b3c]/12 text-[#1a6b3c]",
  "bg-[#f5a623]/12 text-[#b87608]",
  "bg-blue-50 text-blue-600",
  "bg-purple-50 text-purple-600",
  "bg-pink-50 text-pink-600",
];

export default async function UsuariosAdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: myProfile } = await supabase.from("admin_profiles").select("rol").eq("user_id", user!.id).single();
  if (myProfile?.rol !== "superadmin") redirect("/admin?error=sin_permiso");

  const serviceClient = await createServiceClient();
  const { data: profiles } = await serviceClient.from("admin_profiles").select("id, user_id, nombre, rol, activo, created_at").order("created_at");
  const { data: authUsers } = await serviceClient.auth.admin.listUsers();
  const emailMap: Record<string, string> = {};
  const lastMap: Record<string, string | null> = {};
  authUsers?.users?.forEach((u) => { emailMap[u.id] = u.email ?? ""; lastMap[u.id] = u.last_sign_in_at ?? null; });

  const total = profiles?.length ?? 0;
  const activos = profiles?.filter((p) => p.activo).length ?? 0;

  return (
    <div className="p-4 sm:p-6 lg:p-7 max-w-[1000px] mx-auto admin-rise">
      <PageHeader icon={Users} accent="purple" title="Usuarios del panel" subtitle={`${total} usuario${total !== 1 ? "s" : ""} · ${activos} activo${activos !== 1 ? "s" : ""}`}>
        <PrimaryLink href="/admin/usuarios/nuevo" icon={Plus}>Nuevo usuario</PrimaryLink>
      </PageHeader>

      <div className="bg-[#1a6b3c]/8 border border-[#1a6b3c]/20 rounded-2xl px-5 py-4 mb-4 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-[#1a6b3c] shrink-0 mt-0.5" />
        <p className="text-[12.5px] text-[#0d4a28] leading-relaxed">
          <strong>Acceso de doble capa:</strong> se requieren credenciales válidas en Supabase Auth <em>y</em> un perfil activo. Desactivar un usuario bloquea su acceso de inmediato.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          { label: "Total", value: total, color: "text-[#0a1628]" },
          { label: "Activos", value: activos, color: "text-[#1a6b3c]" },
          { label: "Bloqueados", value: total - activos, color: "text-red-600" },
        ].map((s) => (
          <div key={s.label} className="admin-card px-4 py-3 text-center">
            <p className={`text-[26px] leading-none font-black tabular-nums ${s.color}`}>{s.value}</p>
            <p className="text-[11px] text-slate-500 font-bold mt-1.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="space-y-2.5">
        {(profiles ?? []).map((p, i) => {
          const email = emailMap[p.user_id] ?? "—";
          const isSelf = p.user_id === user!.id;
          const last = lastMap[p.user_id];
          const rol = ROL[p.rol] ?? ROL.admin;
          return (
            <div key={p.id} className={`admin-card p-3.5 flex items-center gap-3 transition-all hover:shadow-md ${!p.activo ? "opacity-60" : ""}`}>
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-sm font-black shrink-0 ${AVATAR[i % AVATAR.length]}`}>
                {(p.nombre ?? email).slice(0, 1).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-black text-[#0a1628] text-sm truncate">{p.nombre ?? "Sin nombre"}</p>
                  {isSelf && <span className="text-[10px] bg-[#f5a623]/12 text-[#b87608] font-black px-1.5 py-0.5 rounded-full shrink-0">Tú</span>}
                </div>
                <p className="text-[11px] text-slate-500 truncate">{email}</p>
                {last && <p className="text-[10px] text-slate-500 mt-0.5">Último acceso: {new Date(last).toLocaleDateString("es-CL", { dateStyle: "medium" })}</p>}
              </div>
              <div className="hidden sm:flex items-center gap-2 shrink-0">
                <Badge tone={rol.tone}><Shield className="w-3 h-3" />{rol.label}</Badge>
                <Badge tone={p.activo ? "green" : "red"} dot>{p.activo ? "Activo" : "Bloqueado"}</Badge>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Link href={`/admin/usuarios/${p.id}/editar`} className="text-[12px] font-bold text-slate-700 hover:text-[#1a6b3c] px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-[#1a6b3c]/40 hover:bg-[#1a6b3c]/12 transition-all">Editar</Link>
                {!isSelf && (
                  <>
                    <ToggleActiveButton profileId={p.id} activo={p.activo} />
                    <DeleteAdminUserButton profileId={p.id} userId={p.user_id} />
                  </>
                )}
              </div>
            </div>
          );
        })}
        {(!profiles || profiles.length === 0) && (
          <div className="text-center py-16 admin-card border-dashed text-slate-500 text-sm">No hay usuarios registrados.</div>
        )}
      </div>
    </div>
  );
}
