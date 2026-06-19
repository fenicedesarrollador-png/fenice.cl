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

    const { profileId, userId } = await request.json() as { profileId: string; userId: string };

    if (!profileId || !userId) {
      return NextResponse.json({ error: "profileId y userId requeridos." }, { status: 400 });
    }

    // Cannot delete self
    if (userId === user.id) {
      return NextResponse.json({ error: "No puedes eliminarte a ti mismo." }, { status: 400 });
    }

    const serviceClient = await createServiceClient();

    // Delete profile first, then auth user
    await serviceClient.from("admin_profiles").delete().eq("id", profileId);
    const { error: deleteError } = await serviceClient.auth.admin.deleteUser(userId);

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[POST /api/admin/usuarios/eliminar]", err);
    return NextResponse.json({ error: "Error interno." }, { status: 500 });
  }
}
