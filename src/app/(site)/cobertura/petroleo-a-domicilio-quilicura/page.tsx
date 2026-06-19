import { buildComunaMetadata } from "@/components/ComunaPage";
import ComunaPage from "@/components/ComunaPage";
export const metadata = buildComunaMetadata({ nombre: "Quilicura", slug: "quilicura", sector: "norte", perfil: "industrial y de parques de negocios", contexto: "", beneficios: [] });
const config = {
  nombre: "Quilicura", slug: "quilicura", sector: "norte",
  perfil: "industrial y de parques de negocios",
  contexto: "Quilicura concentra algunos de los parques industriales y logísticos más modernos del norte de Santiago. El crecimiento sostenido de la comuna ha traído consigo una gran cantidad de empresas manufactureras, bodegas y centros de distribución con alta demanda de combustible para maquinaria y generadores.",
  beneficios: [
    "Parques industriales con múltiples empresas locatarias",
    "Centros logísticos y de distribución de escala nacional",
    "Empresas de construcción activas en el sector norte",
    "Bodegas y almacenes con sistemas de generación de respaldo",
  ],
};
export default function Page() { return <ComunaPage config={config} />; }
