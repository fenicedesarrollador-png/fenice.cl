import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" },
      { protocol: "https", hostname: "*.supabase.in", pathname: "/storage/v1/object/public/**" },
    ],
  },
  async redirects() {
    // URLs antiguas del sitio anterior → destinos canónicos (evita 404 y conserva link equity).
    return [
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/index", destination: "/", permanent: true },
      { source: "/home", destination: "/", permanent: true },
      { source: "/service.html", destination: "/servicios/petroleo-a-domicilio-santiago", permanent: true },
      { source: "/service", destination: "/servicios/petroleo-a-domicilio-santiago", permanent: true },
      { source: "/servicios", destination: "/servicios/petroleo-a-domicilio-santiago", permanent: true },
      { source: "/contacto.html", destination: "/contacto", permanent: true },
      { source: "/contact", destination: "/contacto", permanent: true },
      { source: "/contact.html", destination: "/contacto", permanent: true },
      { source: "/about.html", destination: "/nosotros", permanent: true },
      { source: "/about", destination: "/nosotros", permanent: true },
      // Sección de productos retirada → redirigir a inicio (evita 404 e indexación muerta).
      { source: "/productos", destination: "/", permanent: true },
      { source: "/productos/:slug", destination: "/", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
        ],
      },
      {
        // La pantalla de carga se incrusta en un <iframe> del mismo origen.
        // Debe permitir embebido same-origin; DENY global lo bloquearía.
        source: "/loader/:path*",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
      {
        // Admin routes — no-cache, no-index, strict CSP
        source: "/admin(.*)",
        headers: [
          { key: "Cache-Control", value: "no-store, no-cache, must-revalidate" },
          { key: "Pragma", value: "no-cache" },
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive, nosnippet" },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https://*.supabase.co https://*.supabase.in",
              "connect-src 'self' https://*.supabase.co https://*.supabase.in",
              "frame-ancestors 'none'",
            ].join("; "),
          },
        ],
      },
      {
        source: "/api/admin(.*)",
        headers: [
          { key: "Cache-Control", value: "no-store" },
          { key: "X-Robots-Tag", value: "noindex" },
        ],
      },
    ];
  },
};

export default nextConfig;
