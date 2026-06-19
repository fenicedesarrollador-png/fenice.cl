import { buildComunaMetadata } from "@/components/ComunaPage";
import ComunaPage from "@/components/ComunaPage";
export const metadata = buildComunaMetadata({ nombre: "Las Condes", slug: "las-condes", sector: "oriente", perfil: "corporativo y tecnológico", contexto: "", beneficios: [] });
const config = {
  nombre: "Las Condes", slug: "las-condes", sector: "oriente",
  perfil: "corporativo y tecnológico",
  contexto: "Las Condes concentra las sedes corporativas más importantes de Chile, con edificios de oficinas de alta tecnología que cuentan con sistemas de generación eléctrica de emergencia. Además, la presencia de clínicas, centros de datos y edificaciones de alta complejidad hace indispensable el abastecimiento regular de petróleo para grupos electrógenos.",
  beneficios: [
    "Torres corporativas con generadores de emergencia de alto kVA",
    "Clínicas y centros médicos con sistemas de respaldo crítico",
    "Centros de datos y empresas de telecomunicaciones",
    "Hoteles y centros de convenciones con generadores propios",
  ],
};
export default function Page() { return <ComunaPage config={config} />; }
