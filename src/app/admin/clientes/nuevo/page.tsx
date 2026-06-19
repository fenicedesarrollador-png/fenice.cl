import type { Metadata } from "next";
import ClienteForm from "../_ClienteForm";
export const metadata: Metadata = { title: "Nuevo Cliente" };
export default function NuevoClientePage() {
  return <div className="max-w-2xl"><h1 className="text-2xl font-bold text-gray-900 mb-6">Agregar cliente</h1><ClienteForm /></div>;
}
