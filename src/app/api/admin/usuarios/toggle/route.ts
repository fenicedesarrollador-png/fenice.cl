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

    const { profileId, activo } = await request.json() as { profileId: string; activo: boolean };
    if (!profileId) {
      return NextResponse.json({ error: "profileId requerido." }, { status: 400 });
    }

    // Cannot deactivate self
    const { data: target } = await supabase
      .from("admin_profiles")
      .select("user_id")
      .eq("id", profileId)
      .single();

    if (target?.user_id === user.id) {
      return NextResponse.json({ error: "No puedes desactivarte a ti mismo." }, { status: 400 });
    }

    const serviceClient = await createServiceClient();
    const { error } = await serviceClient
      .from("admin_profiles")
      .update({ activo: !activo })
      .eq("id", profileId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, activo: !activo });
  } catch (err) {
    console.error("[POST /api/admin/usuarios/toggle]", err);
    return NextResponse.json({ error: "Error interno." }, { status: 500 });
  }
}
