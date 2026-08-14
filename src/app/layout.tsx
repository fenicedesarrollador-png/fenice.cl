import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { SITE_CONFIG } from "@/lib/config";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.site_url),
  title: {
    default: "Petróleo a Domicilio para Empresas en Santiago | Fenice",
    template: "%s | Fenice SPA",
  },
  description:
    "Despacho de diésel y kerosene para empresas, faenas, edificios y generadores en Santiago y la RM. Cotiza por WhatsApp con factura electrónica.",
  applicationName: "Fenice SPA",
  authors: [{ name: "Fenice SPA", url: SITE_CONFIG.site_url }],
  creator: "Fenice SPA",
  publisher: "Fenice SPA",
  category: "Distribución de combustible",
  formatDetection: { telephone: true, email: true, address: true },
  openGraph: {
    type: "website",
    locale: "es_CL",
    url: SITE_CONFIG.site_url,
    siteName: SITE_CONFIG.nombre,
    title: "Petróleo a Domicilio para Empresas en Santiago | Fenice",
    description:
      "Despacho de diésel y kerosene para empresas, faenas, edificios y generadores en Santiago y la RM. Cotiza por WhatsApp.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Fenice SPA — Petróleo a domicilio para empresas en la Región Metropolitana",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Petróleo a Domicilio para Empresas en Santiago | Fenice",
    description:
      "Diésel y kerosene para empresas, faenas, edificios y generadores en Santiago y la Región Metropolitana.",
    images: ["/opengraph-image"],
  },
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
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
