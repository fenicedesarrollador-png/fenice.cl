import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "No autenticado." }, { status: 401 });
    }

    const { data: myProfile } = await supabase
      .from("admin_profiles")
      .select("rol, activo")
      .eq("user_id", user.id)
      .single();

    if (!myProfile?.activo || myProfile.rol !== "superadmin") {
      return NextResponse.json({ error: "Sin permiso." }, { status: 403 });
    }

    const { userId, password } = await request.json() as { userId: string; password: string };

    if (!userId || !password || password.length < 8) {
      return NextResponse.json({ error: "Datos inválidos." }, { status: 400 });
    }

    const serviceClient = await createServiceClient();
    const { error } = await serviceClient.auth.admin.updateUserById(userId, { password });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[POST /api/admin/usuarios/password]", err);
    return NextResponse.json({ error: "Error interno." }, { status: 500 });
  }
}
