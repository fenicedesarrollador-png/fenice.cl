import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Breadcrumb from "@/components/Breadcrumb";
import CTASection from "@/components/CTASection";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("eventos").select("titulo, descripcion").eq("slug", slug).eq("activo", true).single();
    if (data) return { title: data.titulo, description: data.descripcion?.slice(0, 155), alternates: { canonical: `https://fenice.cl/eventos/${slug}` } };
  } catch {}
  return { title: "Evento" };
}

export async function generateStaticParams() {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("eventos").select("slug").eq("activo", true);
    return (data || []).map((e) => ({ slug: e.slug }));
  } catch { return []; }
}

export default async function EventoPage({ params }: Props) {
  const { slug } = await params;
  let evento: { titulo: string; descripcion?: string; ubicacion?: string; fecha_inicio: string; fecha_fin?: string; imagen_url?: string } | null = null;
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("eventos").select("*").eq("slug", slug).eq("activo", true).single();
    if (data) evento = data;
  } catch {}
  if (!evento) notFound();

  const eventSchema = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: evento.titulo,
    description: evento.descripcion,
    startDate: evento.fecha_inicio,
    ...(evento.fecha_fin ? { endDate: evento.fecha_fin } : {}),
    ...(evento.ubicacion ? { location: { "@type": "Place", name: evento.ubicacion } } : {}),
    organizer: { "@type": "Organization", name: "Fenice SPA", url: "https://fenice.cl/" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb crumbs={[{ name: "Inicio", href: "/" }, { name: evento.titulo }]} />
      </div>
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {evento.imagen_url && (
          <div className="rounded-2xl overflow-hidden mb-8 bg-gray-100">
            <img src={evento.imagen_url} alt={evento.titulo} className="w-full object-cover" width={800} height={400} />
          </div>
        )}
        <h1 className="text-3xl font-extrabold text-gray-900 mb-4">{evento.titulo}</h1>
        <div className="flex gap-4 text-sm text-gray-500 mb-6">
          <span>📅 {new Date(evento.fecha_inicio).toLocaleDateString("es-CL", { dateStyle: "long" })}</span>
          {evento.ubicacion && <span>📍 {evento.ubicacion}</span>}
        </div>
        {evento.descripcion && <p className="text-gray-600 leading-relaxed">{evento.descripcion}</p>}
      </section>
      <CTASection />
    </>
  );
}
