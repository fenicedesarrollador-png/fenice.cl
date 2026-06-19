import { buildComunaMetadata } from "@/components/ComunaPage";
import ComunaPage from "@/components/ComunaPage";
export const metadata = buildComunaMetadata({ nombre: "San Bernardo", slug: "san-bernardo", sector: "sur", perfil: "industrial y de manufactura", contexto: "", beneficios: [] });
const config = {
  nombre: "San Bernardo", slug: "san-bernardo", sector: "sur",
  perfil: "industrial y de manufactura",
  contexto: "San Bernardo es un polo industrial consolidado al sur de Santiago, con una larga tradición manufacturera y presencia de empresas de mediana y gran escala. La zona cuenta con plantas de producción, talleres de maquinaria y empresas de logística que requieren abastecimiento regular de combustible.",
  beneficios: [
    "Plantas industriales con consumo continuo de diesel",
    "Talleres y empresas de mantenimiento de maquinaria pesada",
    "Empresas de reciclaje y gestión de residuos con flota propia",
    "Constructoras con proyectos en el sector sur de Santiago",
  ],
};
export default function Page() { return <ComunaPage config={config} />; }
