import type { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/config";

export const metadata: Metadata = {
  title: "Aviso Legal",
  description: "Aviso legal y términos de uso del sitio web de Fenice SPA.",
  alternates: { canonical: "https://fenice.cl/aviso-legal" },
};

export default function AvisoLegalPage() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-gray">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Aviso Legal</h1>

        <h2>Identificación del titular</h2>
        <ul>
          <li><strong>Razón social:</strong> Fenice SPA</li>
          <li><strong>Domicilio:</strong> {SITE_CONFIG.direccion}</li>
          <li><strong>Correo:</strong> {SITE_CONFIG.email}</li>
          <li><strong>Teléfono:</strong> {SITE_CONFIG.telefono}</li>
        </ul>

        <h2>Propiedad intelectual</h2>
        <p>
          Los contenidos de este sitio web (textos, imágenes, logotipos, diseño) son propiedad de
          Fenice SPA y están protegidos por la legislación de propiedad intelectual chilena. Queda
          prohibida su reproducción total o parcial sin autorización expresa.
        </p>

        <h2>Responsabilidad</h2>
        <p>
          Fenice SPA no se hace responsable de los daños que puedan derivarse del uso de la
          información contenida en este sitio web. Los precios y disponibilidad de los servicios
          son referenciales y pueden variar sin previo aviso.
        </p>

        <h2>Legislación aplicable</h2>
        <p>
          El presente aviso legal se rige por la legislación chilena vigente. Cualquier
          controversia derivada del uso de este sitio web se someterá a los tribunales competentes
          de la ciudad de Santiago, Chile.
        </p>
      </div>
    </section>
  );
}
