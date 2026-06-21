import { redirect } from "next/navigation";

// Las cotizaciones se unificaron con los contactos en la bandeja de Solicitudes.
export default function CotizacionesRedirect() {
  redirect("/admin/leads?origen=cotizacion");
}
