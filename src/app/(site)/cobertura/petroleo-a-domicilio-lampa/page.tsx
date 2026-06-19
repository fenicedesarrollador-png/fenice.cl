import { buildComunaMetadata } from "@/components/ComunaPage";
import ComunaPage from "@/components/ComunaPage";
export const metadata = buildComunaMetadata({ nombre: "Lampa", slug: "lampa", sector: "norponiente", perfil: "agrícola-industrial", contexto: "", beneficios: [] });
const config = {
  nombre: "Lampa", slug: "lampa", sector: "norponiente",
  perfil: "agrícola-industrial",
  contexto: "Lampa es una de las zonas de mayor crecimiento industrial y logístico del norponiente de Santiago, con importantes parques industriales y una actividad agrícola sostenida. La distancia respecto al centro de la ciudad hace que el servicio de petróleo a domicilio sea especialmente valorado por las empresas de la zona.",
  beneficios: [
    "Parques industriales con alta concentración de bodegas y manufactura",
    "Empresas agrícolas con maquinaria de temporada alta",
    "Plantas de generación eléctrica de respaldo",
    "Proyectos inmobiliarios y constructoras activas en la zona",
  ],
};
export default function Page() { return <ComunaPage config={config} />; }
