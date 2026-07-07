import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// Solo rutas que necesitan sesión: /admin y /login. Las páginas públicas se
// sirven directo desde la caché estática, sin pasar por Supabase Auth.
export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: ["/admin/:path*", "/admin", "/login"],
};
