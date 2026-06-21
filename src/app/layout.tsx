import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SITE_CONFIG } from "@/lib/config";
import FirstVisitLoader from "@/components/FirstVisitLoader";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.site_url),
  title: {
    default: SITE_CONFIG.nombre,
    template: "%s | Fenice SPA",
  },
  description:
    "Despacho de petróleo a domicilio para empresas e industria en toda la Región Metropolitana. Cotiza por WhatsApp y recibe respuesta en minutos. Cobertura RM, Valparaíso y Rancagua.",
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "es_CL",
    siteName: SITE_CONFIG.nombre,
    images: [
      {
        url: "/images/imagen_camion_de_combustible.png",
        alt: "Camión de combustible de Fenice SPA",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/images/imagen_camion_de_combustible.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-CL" className={`${inter.variable} h-full`}>
      <body className="min-h-full antialiased" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
        <FirstVisitLoader />
        {children}
      </body>
    </html>
  );
}
