import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { SITE_CONFIG } from "@/lib/config";
import { CORE_KEYWORDS } from "@/lib/seo";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.site_url),
  title: {
    default: "Petróleo a Domicilio Santiago | Distribuidor de Combustible RM — Fenice SPA",
    template: "%s | Fenice SPA",
  },
  description:
    "Distribuidor de petróleo a domicilio para empresas e industria en Santiago y toda la Región Metropolitana. Despacho rápido de diesel, flota especializada y respuesta en minutos por WhatsApp. Cobertura RM, Valparaíso y Rancagua.",
  keywords: CORE_KEYWORDS,
  applicationName: "Fenice SPA",
  authors: [{ name: "Fenice SPA", url: SITE_CONFIG.site_url }],
  creator: "Fenice SPA",
  publisher: "Fenice SPA",
  category: "Distribución de combustible",
  alternates: { canonical: "/" },
  formatDetection: { telephone: true, email: true, address: true },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "es_CL",
    url: SITE_CONFIG.site_url,
    siteName: SITE_CONFIG.nombre,
    title: "Petróleo a Domicilio Santiago | Distribuidor de Combustible RM",
    description:
      "Despacho de petróleo diesel a domicilio para empresas e industria en toda la Región Metropolitana. Cotiza por WhatsApp y recibe respuesta en minutos.",
    images: [
      {
        url: "/images/imagen_camion_de_combustible.png",
        width: 1200,
        height: 630,
        alt: "Camión de combustible de Fenice SPA en la Región Metropolitana",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Petróleo a Domicilio Santiago | Fenice SPA",
    description:
      "Distribuidor de combustible a domicilio para empresas en la Región Metropolitana. Despacho rápido y cotización por WhatsApp.",
    images: ["/images/imagen_camion_de_combustible.png"],
  },
  // Cuando tengas el código de Google Search Console, pégalo aquí:
  // verification: { google: "TU_CODIGO_DE_VERIFICACION" },
};

export const viewport: Viewport = {
  themeColor: "#0a1628",
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-CL" className={`${inter.variable} h-full`}>
      <body className="min-h-full antialiased" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
