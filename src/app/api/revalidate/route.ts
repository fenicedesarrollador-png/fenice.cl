import { revalidatePath } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const path = request.nextUrl.searchParams.get("path") || "/";
  if (!path.startsWith("/") || path.startsWith("//") || path.length > 1024) {
    return NextResponse.json({ error: "Ruta no válida." }, { status: 400 });
  }
  if (path === "/blog/[slug]") revalidatePath(path, "page");
  else revalidatePath(path);
  revalidatePath("/sitemap.xml");
  return NextResponse.json({ revalidated: true, path });
}
