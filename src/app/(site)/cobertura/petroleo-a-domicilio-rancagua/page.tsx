import { buildComunaMetadata } from "@/components/ComunaPage";
import ComunaPage from "@/components/ComunaPage";
export const metadata = buildComunaMetadata({ nombre: "Rancagua", slug: "rancagua", sector: "región de ohiggins", perfil: "minero e industrial", contexto: "", beneficios: [] });
const config = {
  nombre: "Rancagua", slug: "rancagua", sector: "región de ohiggins",
  perfil: "minero e industrial",
  contexto: "Rancagua es la capital de la Región de O'Higgins y uno de los centros industriales y mineros más importantes de Chile, sede de empresas que abastecen a la gran minería del cobre y al sector agroindustrial de la región. La demanda de combustible es alta y constante para las faenas mineras, la maquinaria agrícola y las plantas de procesamiento.",
  beneficios: [
    "Proveedores de la gran minería del cobre en la región",
    "Empresas agroindustriales con flota de maquinaria propia",
    "Constructoras con faenas activas en la zona central",
    "Plantas de generación y empresas energéticas regionales",
  ],
};
export default function Page() { return <ComunaPage config={config} />; }
