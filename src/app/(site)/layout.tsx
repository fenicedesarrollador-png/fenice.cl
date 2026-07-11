import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnalyticsProvider from "@/components/analytics/AnalyticsProvider";
import FirstVisitLoader from "@/components/FirstVisitLoader";
import ScrollReveal from "@/components/ScrollReveal";
import { getSiteConfig } from "@/lib/getSiteConfig";
import { organizationSchema, websiteSchema, localBusinessSchema, jsonLd } from "@/lib/seo";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const config = await getSiteConfig();

  // Grafo de schemas que sostiene todo el SEO del sitio.
  const seoGraph = {
    "@context": "https://schema.org",
    "@graph": [
      organizationSchema(),
      websiteSchema(),
      localBusinessSchema({
        telefono: config.telefono,
        email: config.email,
        instagram_url: config.instagram_url,
        lat: config.lat,
        lng: config.lng,
      }),
    ],
  };

  return (
    <>
      <FirstVisitLoader />
      <ScrollReveal />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(seoGraph)} />
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
