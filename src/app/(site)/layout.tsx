import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnalyticsProvider from "@/components/analytics/AnalyticsProvider";
import { getSiteConfig } from "@/lib/getSiteConfig";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const config = await getSiteConfig();

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Fenice SPA",
    image: "https://fenice.cl/images/imagen_camion_de_combustible.png",
    url: "https://fenice.cl/",
    telephone: config.telefono,
    email: config.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: "La Granja",
      addressRegion: "Región Metropolitana",
      addressCountry: "CL",
    },
    geo: { "@type": "GeoCoordinates", latitude: config.lat, longitude: config.lng },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "19:00",
    },
    areaServed: [
      "Región Metropolitana", "Maipú", "Pudahuel", "Quilicura", "Puente Alto",
      "San Bernardo", "Lampa", "Buin", "Colina", "Las Condes", "Providencia",
      "Valparaíso", "Rancagua", "Santa Cruz",
    ],
    sameAs: [config.instagram_url],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
      <AnalyticsProvider>
        <div className="min-h-full flex flex-col bg-white text-gray-900">
          <Header config={config} />
          <main className="flex-1">{children}</main>
          <Footer config={config} />
        </div>
      </AnalyticsProvider>
    </>
  );
}
