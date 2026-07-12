import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import PromoForm from "../../_PromoForm";
import { FormPageHeader } from "../../../_components/ui";

export const metadata: Metadata = { title: "Editar promoción" };

export default async function EditarPromoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let promo = null;
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("promociones").select("*").eq("id", id).single();
    if (data) promo = data;
  } catch {}
  if (!promo) notFound();
  return (
    <div className="p-4 sm:p-6 lg:p-7 max-w-3xl mx-auto admin-rise">
      <FormPageHeader title="Editar promoción" subtitle={promo.titulo} backHref="/admin/promociones" />
      <PromoForm promo={promo} />
    </div>
  );
}
