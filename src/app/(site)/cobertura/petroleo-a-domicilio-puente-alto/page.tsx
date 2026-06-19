import { buildComunaMetadata } from "@/components/ComunaPage";
import ComunaPage from "@/components/ComunaPage";
export const metadata = buildComunaMetadata({ nombre: "Puente Alto", slug: "puente-alto", sector: "sur-oriente", perfil: "industrial, residencial y minero", contexto: "", beneficios: [] });
const config = {
  nombre: "Puente Alto", slug: "puente-alto", sector: "sur-oriente",
  perfil: "industrial, residencial y minero",
  contexto: "Puente Alto es la comuna más poblada de Chile y tiene un perfil dual: residencial masivo y puerta de entrada a la actividad minera y construcción del sector cordillerano. La demanda de combustible es alta tanto para generadores residenciales de emergencia como para maquinaria de construcción y empresas de servicios.",
  beneficios: [
    "Empresas de construcción con proyectos inmobiliarios activos",
    "Proveedores de servicios para la minería del sector cordillerano",
    "Condominios y edificios de alto consumo energético",
    "Flotas de maquinaria para movimiento de tierra",
  ],
};
export default function Page() { return <ComunaPage config={config} />; }
