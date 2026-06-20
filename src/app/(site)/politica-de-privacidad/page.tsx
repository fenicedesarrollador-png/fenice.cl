import type { Metadata } from "next";
import ConsentPreferencesButton from "@/components/analytics/ConsentPreferencesButton";
import { SITE_CONFIG } from "@/lib/config";

export const metadata: Metadata = {
  title: "Política de Privacidad",
  description: "Política de privacidad y tratamiento de datos personales de Fenice SPA.",
  alternates: { canonical: "https://fenice.cl/politica-de-privacidad" },
};

export default function PoliticaPrivacidadPage() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-gray">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Política de Privacidad</h1>
        <p className="text-gray-500 text-sm mb-8">Última actualización: enero 2025</p>

        <h2>1. Responsable del tratamiento</h2>
        <p>
          Fenice SPA, con domicilio en {SITE_CONFIG.direccion}, es responsable del tratamiento de
          los datos personales recopilados a través de este sitio web ({SITE_CONFIG.site_url}).
        </p>

        <h2>2. Datos que recopilamos</h2>
        <p>Recopilamos los siguientes datos personales cuando utilizas nuestro formulario de contacto:</p>
        <ul>
          <li>Nombre o razón social</li>
          <li>Teléfono de contacto</li>
          <li>Correo electrónico</li>
          <li>Información sobre tu requerimiento (comuna, tipo de servicio, volumen estimado)</li>
        </ul>

        <h2>3. Finalidad del tratamiento</h2>
        <p>Los datos recopilados se utilizan exclusivamente para:</p>
        <ul>
          <li>Responder a tu solicitud de cotización o información</li>
          <li>Coordinar el servicio de despacho de petróleo o instalación de estanques</li>
          <li>Mejorar nuestros servicios y atención al cliente</li>
        </ul>

        <h2>4. Base legal</h2>
        <p>
          El tratamiento de tus datos se basa en tu consentimiento expreso al enviar el formulario
          de contacto, de acuerdo con la Ley N° 19.628 sobre Protección de la Vida Privada de Chile.
        </p>

        <h2>5. Compartición de datos</h2>
        <p>
          No vendemos ni cedemos tus datos personales a terceros. Los datos pueden compartirse
          exclusivamente con proveedores de servicios tecnológicos (hosting, base de datos) bajo
          estrictas obligaciones de confidencialidad.
        </p>

        <h2>6. Derechos del titular</h2>
        <p>
          De acuerdo con la legislación chilena vigente, puedes ejercer tus derechos de acceso,
          rectificación, cancelación y oposición contactándonos en{" "}
          <a href={`mailto:${SITE_CONFIG.email}`}>{SITE_CONFIG.email}</a>.
        </p>

        <h2>7. Cookies y analítica</h2>
        <p>
          Este sitio utiliza un sistema propio de medición de primera parte para registrar páginas,
          secciones visibles, profundidad de scroll, clics importantes y conversiones reales
          después de tu consentimiento explícito. No guardamos datos personales dentro de los
          eventos analíticos ni exponemos la IP a los administradores.
        </p>
        <p>
          Puedes cambiar tu decisión en cualquier momento desde aquí:
          {" "}
          <ConsentPreferencesButton className="font-semibold text-[#1a6b3c] underline underline-offset-4">
            administrar preferencias de medición
          </ConsentPreferencesButton>
          .
        </p>

        <h2>8. Contacto</h2>
        <p>
          Para consultas sobre privacidad: <a href={`mailto:${SITE_CONFIG.email}`}>{SITE_CONFIG.email}</a>
        </p>
      </div>
    </section>
  );
}
