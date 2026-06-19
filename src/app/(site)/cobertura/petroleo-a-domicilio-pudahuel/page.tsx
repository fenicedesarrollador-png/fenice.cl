import { buildComunaMetadata } from "@/components/ComunaPage";
import ComunaPage from "@/components/ComunaPage";
export const metadata = buildComunaMetadata({ nombre: "Pudahuel", slug: "pudahuel", sector: "poniente-norte", perfil: "logístico e industrial", contexto: "", beneficios: [] });
const config = {
  nombre: "Pudahuel", slug: "pudahuel", sector: "poniente-norte",
  perfil: "logístico e industrial",
  contexto: "Pudahuel es el corazón logístico de Santiago, sede del Aeropuerto Internacional Comodoro Arturo Merino Benítez y de los principales centros de distribución de la RM. La alta concentración de empresas de carga, transporte y bodegas hace de esta zona un área de alta demanda de combustible industrial.",
  beneficios: [
    "Empresas de transporte de carga y logística aeroportuaria",
    "Centros de distribución y bodegas de gran volumen",
    "Plantas de manufactura en el parque industrial de Pudahuel",
    "Contratistas de obra con maquinaria pesada",
  ],
};
export default function Page() { return <ComunaPage config={config} />; }
