import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/gracias"],
      },
    ],
    sitemap: "https://fenice.cl/sitemap.xml",
  };
}
