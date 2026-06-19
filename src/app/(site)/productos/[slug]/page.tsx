import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import CTASection from "@/components/CTASection";
import Breadcrumb from "@/components/Breadcrumb";
import WhatsAppButton from "@/components/WhatsAppButton";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("productos").select("nombre, descripcion_corta, meta_title, meta_description").eq("slug", slug).eq("activo", true).single();
    if (data) {
      return {
        title: data.meta_title || data.nombre,
        description: data.meta_description || data.descripcion_corta,
        alternates: { canonical: `https://fenice.cl/productos/${slug}` },
      };
    }
  } catch {}
  return { title: "Producto" };
}

export async function generateStaticParams() {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("productos").select("slug").eq("activo", true);
    return (data || []).map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export default async function ProductoPage({ params }: Props) {
  const { slug } = await params;
  let producto: { nombre: string; descripcion?: string; descripcion_corta?: string; imagen_url?: string; categoria?: string; precio_referencial?: number; meta_title?: string } | null = null;

  try {
    const supabase = await createClient();
    const { data } = await supabase.from("productos").select("*").eq("slug", slug).eq("activo", true).single();
    if (data) producto = data;
  } catch {}

  if (!producto) notFound();

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: producto.nombre,
    description: producto.descripcion || producto.descripcion_corta,
    ...(producto.imagen_url ? { image: producto.imagen_url } : {}),
    brand: { "@type": "Brand", name: "Fenice SPA" },
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      seller: { "@type": "Organization", name: "Fenice SPA" },
      ...(producto.precio_referencial ? { price: producto.precio_referencial, priceCurrency: "CLP" } : {}),
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb crumbs={[
          { name: "Inicio", href: "/" },
          { name: "Productos", href: "/productos" },
          { name: producto.nombre },
        ]} />
      </div>

      <section className="pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {producto.imagen_url && (
              <div className="rounded-2xl overflow-hidden bg-gray-100">
                <img
                  src={producto.imagen_url}
                  alt={producto.nombre}
                  className="w-full object-cover"
                  width={600}
                  height={450}
                />
              </div>
            )}
            <div>
              {producto.categoria && (
                <span className="text-xs font-semibold text-orange-600 uppercase tracking-wider">
                  {producto.categoria}
                </span>
              )}
              <h1 className="text-3xl font-extrabold text-gray-900 mt-2 mb-4">{producto.nombre}</h1>
              {producto.descripcion_corta && (
                <p className="text-gray-600 text-lg mb-6">{producto.descripcion_corta}</p>
              )}
              {producto.descripcion && (
                <div className="prose prose-gray max-w-none mb-8">
                  <p className="text-gray-600 leading-relaxed">{producto.descripcion}</p>
                </div>
              )}
              <WhatsAppButton
                mensaje={`Hola, quiero cotizar el producto: ${producto.nombre}`}
                className="text-base px-8 py-4"
              />
            </div>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
