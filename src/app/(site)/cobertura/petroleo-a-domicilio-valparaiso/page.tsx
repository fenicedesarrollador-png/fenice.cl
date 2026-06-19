import { buildComunaMetadata } from "@/components/ComunaPage";
import ComunaPage from "@/components/ComunaPage";
export const metadata = buildComunaMetadata({ nombre: "Valparaíso", slug: "valparaiso", sector: "costa", perfil: "portuario, industrial y naviero", contexto: "", beneficios: [] });
const config = {
  nombre: "Valparaíso", slug: "valparaiso", sector: "costa",
  perfil: "portuario, industrial y naviero",
  contexto: "Valparaíso es el principal puerto de Chile y un importante polo industrial de la región costera. La actividad portuaria, naviera, pesquera e industrial genera una demanda sostenida de combustible para maquinaria de carga, generadores de instalaciones portuarias y flotas de transporte pesado que conectan el puerto con el interior del país.",
  beneficios: [
    "Empresas portuarias y terminales de carga con maquinaria pesada",
    "Industria naviera y astilleros con alta demanda de combustible",
    "Empresas pesqueras con flotas propias y plantas de proceso",
    "Industria química y manufactura del sector costero",
  ],
};
export default function Page() { return <ComunaPage config={config} />; }
