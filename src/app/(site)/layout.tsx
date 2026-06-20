import Header from "@/components/Header";
import Footer from "@/components/Footer";
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
      {/* GTM — replace GTM-XXXXXXX */}
      <script dangerouslySetInnerHTML={{ __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-XXXXXXX');` }} />
      {/* gtag.js */}
      <script async src="https://www.googletagmanager.com/gtag/js?id=AW-XXXXXXXXX" />
      <script dangerouslySetInnerHTML={{ __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','AW-XXXXXXXXX');gtag('config','G-XXXXXXXXXX');` }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
      <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXX" height="0" width="0" style={{ display: "none", visibility: "hidden" }} /></noscript>

      <div className="min-h-full flex flex-col bg-white text-gray-900">
        <Header config={config} />
        <main className="flex-1">{children}</main>
        <Footer config={config} />
      </div>
    </>
  );
}
