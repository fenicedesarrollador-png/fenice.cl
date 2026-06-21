import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/config";

export default function robots(): MetadataRoute.Robots {
  const base = SITE_CONFIG.site_url;
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/login", "/gracias"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
