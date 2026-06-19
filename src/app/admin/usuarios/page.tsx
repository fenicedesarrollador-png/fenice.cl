import type { Metadata } from "next";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus, Shield, ShieldOff } from "lucide-react";
import DeleteAdminUserButton from "./DeleteAdminUserButton";
import ToggleActiveButton from "./ToggleActiveButton";

export const metadata: Metadata = { title: "Usuarios Admin" };

export default async function UsuariosAdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Only superadmin can manage users
  const { data: myProfile } = await supabase
    .from("admin_profiles")
    .select("rol")
    .eq("user_id", user!.id)
    .single();

  if (myProfile?.rol !== "superadmin") {
    redirect("/admin?error=sin_permiso");
  }

  // Fetch all admin profiles with auth user data via service client
  const serviceClient = await createServiceClient();
  const { data: profiles } = await serviceClient
    .from("admin_profiles")
    .select("id, user_id, nombre, rol, activo, created_at")
    .order("created_at");

  // Get auth users to cross-reference emails
  const { data: authUsers } = await serviceClient.auth.admin.listUsers();
  const emailMap: Record<string, string> = {};
  authUsers?.users?.forEach((u) => { emailMap[u.id] = u.email ?? ""; });

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Usuarios del panel</h1>
          <p className="text-slate-500 text-sm mt-0.5">Gestiona quién puede acceder al admin</p>
        </div>
        <Link
          href="/admin/usuarios/nuevo"
          className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2.5 rounded-lg text-sm transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Nuevo usuario
        </Link>
      </div>

      {/* Security note */}
      <div className="mb-6 flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl px-5 py-4">
        <Shield className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-blue-900">Acceso controlado por doble capa</p>
          <p className="text-xs text-blue-700 mt-0.5">
            Para ingresar al panel se requiere: (1) credenciales válidas en Supabase Auth y (2) perfil activo en la tabla <code className="bg-blue-100 px-1 rounded">admin_profiles</code>. Desactivar un usuario bloquea el acceso inmediatamente sin necesidad de cambiar contraseña.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Usuario</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Rol</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Estado</th>
              <th className="text-right px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {(profiles ?? []).map((p) => {
              const email = emailMap[p.user_id] ?? "—";
              const isSelf = p.user_id === user!.id;
              return (
                <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center text-xs font-bold text-orange-600 shrink-0">
                        {(p.nombre ?? email).slice(0, 1).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 text-sm">{p.nombre ?? "Sin nombre"}</p>
                        <p className="text-xs text-slate-400">{email}</p>
                      </div>
                    </div>
                    {isSelf && (
                      <span className="mt-1 inline-block text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">Tú</span>
                    )}
                  </td>
                  <td className="px-5 py-4 hidden sm:table-cell">
                    <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg font-semibold border ${
                      p.rol === "superadmin"
                        ? "bg-purple-50 text-purple-700 border-purple-200"
                        : "bg-slate-50 text-slate-600 border-slate-200"
                    }`}>
                      {p.rol === "superadmin" ? (
                        <Shield className="w-3 h-3" />
                      ) : (
                        <ShieldOff className="w-3 h-3" />
                      )}
                      {p.rol}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg font-semibold border ${
                      p.activo
                        ? "bg-green-50 text-green-700 border-green-200"
                        : "bg-red-50 text-red-600 border-red-200"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${p.activo ? "bg-green-500" : "bg-red-500"}`} />
                      {p.activo ? "Activo" : "Bloqueado"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      {!isSelf && (
                        <>
                          <ToggleActiveButton profileId={p.id} activo={p.activo} />
                          <DeleteAdminUserButton profileId={p.id} userId={p.user_id} />
                        </>
                      )}
                      <Link
                        href={`/admin/usuarios/${p.id}/editar`}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-800 px-2.5 py-1 rounded-lg border border-blue-100 hover:bg-blue-50 transition-all"
                      >
                        Editar
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {(!profiles || profiles.length === 0) && (
          <div className="text-center py-16 text-slate-400 text-sm">No hay usuarios registrados.</div>
        )}
      </div>
    </div>
  );
}
