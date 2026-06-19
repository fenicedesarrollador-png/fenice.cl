import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://fenice.cl"),
  title: {
    default: "Petróleo a Domicilio en Santiago | Despacho Rápido RM | Fenice SPA",
    template: "%s | Fenice SPA",
  },
  description:
    "Despacho de petróleo a domicilio para empresas e industria en toda la Región Metropolitana. Cotiza por WhatsApp y recibe respuesta en minutos. Cobertura RM, Valparaíso y Rancagua.",
  robots: { index: true, follow: true },
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
