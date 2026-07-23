import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";

export const dynamic = "force-dynamic";

/** Elimina la suscripción Web Push indicada (al desactivar las alertas). */
export async function POST(request: Request) {
  const { user, supabase } = await requireAdmin();
  if (!user || !supabase) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  let endpoint: unknown;
  try {
    endpoint = (await request.json())?.endpoint;
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  if (typeof endpoint !== "string") {
    return NextResponse.json({ error: "Falta el endpoint." }, { status: 400 });
  }

  const { error } = await supabase
    .from("push_subscriptions")
    .delete()
    .eq("endpoint", endpoint)
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
