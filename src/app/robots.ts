import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/config";

export default function robots(): MetadataRoute.Robots {
  const base = SITE_CONFIG.site_url;
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // /gracias debe poder rastrearse para que Google procese su meta noindex.
        disallow: ["/admin/", "/api/", "/login"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
