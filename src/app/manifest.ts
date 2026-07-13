import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Fenice SPA — Petróleo a Domicilio Santiago",
    short_name: "Fenice SPA",
    description:
      "Distribuidor de petróleo y combustible a domicilio para empresas en la Región Metropolitana de Santiago.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0a1628",
    lang: "es-CL",
    categories: ["business", "utilities"],
    icons: [
      { src: "/favicon.ico", sizes: "48x48", type: "image/x-icon" },
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
    ],
  };
}
