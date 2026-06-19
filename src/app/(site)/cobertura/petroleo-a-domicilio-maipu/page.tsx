import { buildComunaMetadata } from "@/components/ComunaPage";
import ComunaPage from "@/components/ComunaPage";
export const metadata = buildComunaMetadata({ nombre: "Maipú", slug: "maipu", sector: "poniente", perfil: "industrial y residencial de gran escala", contexto: "", beneficios: [] });
const config = {
  nombre: "Maipú", slug: "maipu", sector: "poniente",
  perfil: "industrial y residencial de gran escala",
  contexto: "Maipú es una de las comunas más densas e industrializadas del poniente de Santiago. Cuenta con numerosos parques industriales, empresas de logística y construcciones de gran envergadura que requieren abastecimiento constante de combustible para maquinaria, generadores y flotas. Fenice SPA cubre Maipú con despacho de petróleo a domicilio para operaciones de cualquier tamaño.",
  beneficios: [
    "Plantas industriales y fábricas con consumo regular de diesel",
    "Empresas constructoras con obras activas en la comuna",
    "Empresas de logística y transporte pesado",
    "Condominios y edificios con generadores de emergencia",
  ],
};
export default function Page() { return <ComunaPage config={config} />; }
