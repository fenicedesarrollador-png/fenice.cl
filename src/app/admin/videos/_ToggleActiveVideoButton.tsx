"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Eye, EyeOff } from "lucide-react";

export default function ToggleActiveVideoButton({ id, isActive }: { id: string; isActive: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function toggle() {
    setLoading(true);
    const supabase = createClient();
    await supabase.from("website_videos").update({ is_active: !isActive }).eq("id", id);
    await fetch("/api/revalidate?path=%2F", { method: "POST" }).catch(() => {});
    setLoading(false);
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={loading}
      title={isActive ? "Ocultar del sitio" : "Publicar en el sitio"}
      className={`p-1.5 rounded-lg transition-all disabled:opacity-50 ${isActive ? "text-[#1a6b3c] hover:bg-[#1a6b3c]/10" : "text-slate-400 hover:bg-slate-100"}`}
    >
      {isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
    </button>
  );
}
