import type { Metadata } from "next";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus, Shield, ShieldOff, ShieldCheck, Users } from "lucide-react";
import DeleteAdminUserButton from "./DeleteAdminUserButton";
import ToggleActiveButton from "./ToggleActiveButton";

export const metadata: Metadata = { title: "Usuarios Admin" };

const ROL_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  superadmin: { label: "Super Admin", color: "bg-purple-50 text-purple-700 border-purple-200", icon: ShieldCheck },
  admin: { label: "Admin", color: "bg-blue-50 text-blue-700 border-blue-200", icon: Shield },
  editor: { label: "Editor", color: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: ShieldOff },
};

const AVATAR_COLORS = [
  "bg-orange-100 text-orange-700 border-orange-200",
  "bg-blue-100 text-blue-700 border-blue-200",
  "bg-purple-100 text-purple-700 border-purple-200",
  "bg-emerald-100 text-emerald-700 border-emerald-200",
  "bg-pink-100 text-pink-700 border-pink-200",
];

export default async function UsuariosAdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: myProfile } = await supabase
    .from("admin_profiles")
    .select("rol")
    .eq("user_id", user!.id)
    .single();

  if (myProfile?.rol !== "superadmin") {
    redirect("/admin?error=sin_permiso");
  }

  const serviceClient = await createServiceClient();
  const { data: profiles } = await serviceClient
    .from("admin_profiles")
    .select("id, user_id, nombre, rol, activo, created_at")
    .order("created_at");

  const { data: authUsers } = await serviceClient.auth.admin.listUsers();
  const emailMap: Record<string, string> = {};
  const lastSignInMap: Record<string, string | null> = {};
  authUsers?.users?.forEach((u) => {
    emailMap[u.id] = u.email ?? "";
    lastSignInMap[u.id] = u.last_sign_in_at ?? null;
  });

  const total = profiles?.length ?? 0;
  const activos = profiles?.filter((p) => p.activo).length ?? 0;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1100px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-50 border border-purple-100 rounded-xl flex items-center justify-center shrink-0">
            <Users className="w-5 h-5 text-purple-500" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900">Usuarios del panel</h1>
            <p className="text-slate-400 text-xs mt-0.5 font-medium">
              {total} usuario{total !== 1 ? "s" : ""} · {activos} activo{activos !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <Link
          href="/admin/usuarios/nuevo"
          className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-colors shadow-sm shadow-orange-500/20"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Nuevo usuario</span>
          <span className="sm:hidden">Nuevo</span>
        </Link>
      </div>

      {/* Security info */}
      <div className="mb-6 flex items-start gap-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl px-5 py-4">
        <ShieldCheck className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-blue-900">Acceso controlado por doble capa</p>
          <p className="text-xs text-blue-700 mt-0.5 leading-relaxed">
            Para ingresar al panel se requiere: (1) credenciales válidas en Supabase Auth y
            (2) perfil activo en <code className="bg-blue-100 px-1.5 py-0.5 rounded-md font-mono text-blue-800">admin_profiles</code>.
            Desactivar un usuario bloquea el acceso inmediatamente sin necesidad de cambiar la contraseña.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: "Total usuarios", value: total, color: "text-slate-900" },
          { label: "Activos", value: activos, color: "text-green-600" },
          { label: "Bloqueados", value: total - activos, color: "text-red-600" },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-slate-100 rounded-xl px-4 py-3 shadow-sm text-center">
            <p className={`text-2xl font-black tabular-nums ${s.color}`}>{s.value}</p>
            <p className="text-[11px] text-slate-400 font-semibold mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="text-left px-5 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Usuario</th>
              <th className="text-left px-5 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Rol</th>
              <th className="text-left px-5 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Último acceso</th>
              <th className="text-center px-5 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Estado</th>
              <th className="text-right px-5 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {(profiles ?? []).map((p, i) => {
              const email = emailMap[p.user_id] ?? "—";
              const isSelf = p.user_id === user!.id;
              const lastSignIn = lastSignInMap[p.user_id];
              const rolCfg = ROL_CONFIG[p.rol] ?? ROL_CONFIG.admin;
              const RolIcon = rolCfg.icon;
              const avatarColor = AVATAR_COLORS[i % AVATAR_COLORS.length];

              return (
                <tr key={p.id} className={`hover:bg-slate-50/60 transition-colors ${!p.activo ? "opacity-60" : ""}`}>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl border flex items-center justify-center text-sm font-black shrink-0 ${avatarColor}`}>
                        {(p.nombre ?? email).slice(0, 1).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-slate-900 text-sm">{p.nombre ?? "Sin nombre"}</p>
                          {isSelf && (
                            <span className="text-[10px] bg-orange-100 text-orange-600 font-bold px-1.5 py-0.5 rounded-full">Tú</span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">{email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-xl border ${rolCfg.color}`}>
                      <RolIcon className="w-3 h-3" />
                      {rolCfg.label}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-xs text-slate-500">
                    {lastSignIn
                      ? new Date(lastSignIn).toLocaleDateString("es-CL", { dateStyle: "medium" }) +
                        " · " +
                        new Date(lastSignIn).toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" })
                      : <span className="text-slate-300">Nunca</span>}
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-xl border ${
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
                      <Link
                        href={`/admin/usuarios/${p.id}/editar`}
                        className="text-xs font-bold text-slate-600 hover:text-slate-900 px-2.5 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all"
                      >
                        Editar
                      </Link>
                      {!isSelf && (
                        <>
                          <ToggleActiveButton profileId={p.id} activo={p.activo} />
                          <DeleteAdminUserButton profileId={p.id} userId={p.user_id} />
                        </>
                      )}
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

      {/* Mobile cards */}
      <div className="sm:hidden space-y-3">
        {(profiles ?? []).map((p, i) => {
          const email = emailMap[p.user_id] ?? "—";
          const isSelf = p.user_id === user!.id;
          const lastSignIn = lastSignInMap[p.user_id];
          const rolCfg = ROL_CONFIG[p.rol] ?? ROL_CONFIG.admin;
          const RolIcon = rolCfg.icon;
          const avatarColor = AVATAR_COLORS[i % AVATAR_COLORS.length];

          return (
            <div key={p.id} className={`bg-white border border-slate-100 rounded-2xl p-4 ${!p.activo ? "opacity-60" : ""}`}>
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center text-sm font-black shrink-0 ${avatarColor}`}>
                  {(p.nombre ?? email).slice(0, 1).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-slate-900 text-sm truncate">{p.nombre ?? "Sin nombre"}</p>
                    {isSelf && <span className="text-[10px] bg-orange-100 text-orange-600 font-bold px-1.5 py-0.5 rounded-full shrink-0">Tú</span>}
                  </div>
                  <p className="text-[11px] text-slate-400 truncate">{email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-lg border ${rolCfg.color}`}>
                  <RolIcon className="w-2.5 h-2.5" />
                  {rolCfg.label}
                </span>
                <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-lg ${
                  p.activo ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"
                }`}>
                  {p.activo ? "Activo" : "Bloqueado"}
                </span>
                {lastSignIn && (
                  <span className="text-[10px] text-slate-400">
                    Último: {new Date(lastSignIn).toLocaleDateString("es-CL")}
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/admin/usuarios/${p.id}/editar`}
                  className="flex-1 text-center text-xs font-bold text-slate-700 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all"
                >
                  Editar
                </Link>
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
      </div>
    </div>
  );
}
