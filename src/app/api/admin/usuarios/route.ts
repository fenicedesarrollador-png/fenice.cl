import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    // 1. Verify the requester is authenticated and is superadmin
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
      return NextResponse.json({ error: "Sin permiso para crear usuarios." }, { status: 403 });
    }

    // 2. Parse and validate body
    const body = await request.json();
    const { email, password, nombre, rol } = body as {
      email?: string;
      password?: string;
      nombre?: string;
      rol?: string;
    };

    if (!email || !password || !nombre || !rol) {
      return NextResponse.json({ error: "Faltan campos requeridos." }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "La contraseña debe tener al menos 8 caracteres." }, { status: 400 });
    }
    const validRoles = ["admin", "editor", "superadmin"];
    if (!validRoles.includes(rol)) {
      return NextResponse.json({ error: "Rol inválido." }, { status: 400 });
    }

    // 3. Create auth user with service role (bypasses email confirmation)
    const serviceClient = await createServiceClient();
    const { data: newUser, error: createError } = await serviceClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // auto-confirmed, no email needed
    });

    if (createError || !newUser.user) {
      return NextResponse.json(
        { error: createError?.message ?? "Error al crear el usuario en Auth." },
        { status: 500 }
      );
    }

    // 4. Create admin_profiles row
    const { error: profileError } = await serviceClient.from("admin_profiles").insert({
      user_id: newUser.user.id,
      nombre,
      rol,
      activo: true,
    });

    if (profileError) {
      // Rollback: delete the auth user
      await serviceClient.auth.admin.deleteUser(newUser.user.id);
      return NextResponse.json(
        { error: "Error al crear el perfil. Usuario revertido." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, userId: newUser.user.id });
  } catch (err) {
    console.error("[POST /api/admin/usuarios]", err);
    return NextResponse.json({ error: "Error interno del servidor." }, { status: 500 });
  }
}
