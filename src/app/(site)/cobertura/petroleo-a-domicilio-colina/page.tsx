import { buildComunaMetadata } from "@/components/ComunaPage";
import ComunaPage from "@/components/ComunaPage";
export const metadata = buildComunaMetadata({ nombre: "Colina", slug: "colina", sector: "norte", perfil: "agrícola, industrial y minero", contexto: "", beneficios: [] });
const config = {
  nombre: "Colina", slug: "colina", sector: "norte",
  perfil: "agrícola, industrial y minero",
  contexto: "Colina es una comuna de creciente actividad industrial y agrícola al norte de Santiago, con presencia de empresas de extracción, faenas de construcción y un sector rural que demanda combustible para maquinaria agrícola y generadores. La distancia al centro urbano hace del servicio a domicilio una necesidad operacional clave.",
  beneficios: [
    "Empresas agrícolas y viñedos con maquinaria de temporada",
    "Proyectos de construcción en la zona norte de la RM",
    "Empresas de extracción de áridos y material pétreo",
    "Condominios rurales con generadores de respaldo",
  ],
};
export default function Page() { return <ComunaPage config={config} />; }
