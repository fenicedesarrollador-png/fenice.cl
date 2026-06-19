import type { Metadata } from "next";
import EventoForm from "../_EventoForm";
export const metadata: Metadata = { title: "Nuevo Evento" };
export default function NuevoEventoPage() {
  return <div className="max-w-2xl"><h1 className="text-2xl font-bold text-gray-900 mb-6">Nuevo evento</h1><EventoForm /></div>;
}
