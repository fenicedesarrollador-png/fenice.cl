import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ComunaPage, { buildComunaMetadata } from "@/components/ComunaPage";
import { COMUNAS_COBERTURA, getComunaBySlug } from "@/lib/comunas";

// Prefijo fijo de la URL de cada landing de cobertura:
//   /cobertura/petroleo-a-domicilio-{comuna}
const PREFIX = "petroleo-a-domicilio-";

type Props = { params: Promise<{ slug: string }> };

// Solo las comunas conocidas se prerenderizan; cualquier otra ruta responde 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return COMUNAS_COBERTURA.map((c) => ({ slug: `${PREFIX}${c.slug}` }));
}

function resolveComuna(fullSlug: string) {
  if (!fullSlug.startsWith(PREFIX)) return undefined;
  return getComunaBySlug(fullSlug.slice(PREFIX.length));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const comuna = resolveComuna(slug);
  if (!comuna) return {};
  return buildComunaMetadata(comuna);
}

export default async function CoberturaComunaPage({ params }: Props) {
  const { slug } = await params;
  const comuna = resolveComuna(slug);
  if (!comuna) notFound();
  return <ComunaPage config={comuna} />;
}
