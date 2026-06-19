import { buildComunaMetadata } from "@/components/ComunaPage";
import ComunaPage from "@/components/ComunaPage";
export const metadata = buildComunaMetadata({ nombre: "Providencia", slug: "providencia", sector: "centro-oriente", perfil: "comercial y corporativo", contexto: "", beneficios: [] });
const config = {
  nombre: "Providencia", slug: "providencia", sector: "centro-oriente",
  perfil: "comercial y corporativo",
  contexto: "Providencia es uno de los centros comerciales y de servicios más activos de Santiago, con una densa concentración de edificios de oficinas, hoteles, centros de salud y comercio. Los generadores de emergencia en estas instalaciones requieren mantenimiento y reabastecimiento periódico de combustible para garantizar la continuidad operacional.",
  beneficios: [
    "Edificios de oficinas y centros comerciales con generadores",
    "Hoteles y residencias de alta ocupación con sistema de respaldo",
    "Clínicas privadas y centros de salud con suministro crítico",
    "Centros educativos con sistemas de emergencia energética",
  ],
};
export default function Page() { return <ComunaPage config={config} />; }
