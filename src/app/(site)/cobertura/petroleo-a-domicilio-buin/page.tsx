import { buildComunaMetadata } from "@/components/ComunaPage";
import ComunaPage from "@/components/ComunaPage";
export const metadata = buildComunaMetadata({ nombre: "Buin", slug: "buin", sector: "sur", perfil: "agrícola y vitivinícola", contexto: "", beneficios: [] });
const config = {
  nombre: "Buin", slug: "buin", sector: "sur",
  perfil: "agrícola y vitivinícola",
  contexto: "Buin es la puerta del sector vitivinícola y agrícola del sur de la Región Metropolitana. Viñedos, frutales y empresas de procesamiento agroindustrial requieren combustible para maquinaria de cosecha, irrigación y generadores eléctricos de respaldo durante períodos críticos de producción.",
  beneficios: [
    "Viñedos y bodegas de vino con maquinaria de vendimia",
    "Empresas agrícolas con necesidad de combustible en temporada",
    "Plantas de frío y procesamiento de frutas con generadores",
    "Constructoras con proyectos en el corredor sur",
  ],
};
export default function Page() { return <ComunaPage config={config} />; }
