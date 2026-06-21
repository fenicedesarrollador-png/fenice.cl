import { ImageResponse } from "next/og";

// Imagen Open Graph generada 1200x630 con identidad de marca Fenice.
export const runtime = "edge";
export const alt = "Fenice SPA — Petróleo a domicilio para empresas en la Región Metropolitana";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #0a1628 0%, #112137 60%, #0a1628 100%)",
          padding: "64px 72px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Top: marca */}
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 18,
              background: "linear-gradient(135deg, #1a6b3c, #145530)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{ display: "flex", fontSize: 38 }}>🔥</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 34, fontWeight: 800, color: "#ffffff", lineHeight: 1 }}>
              Fenice <span style={{ color: "#f5a623" }}>SPA</span>
            </span>
            <span style={{ fontSize: 16, color: "#94a3b8", letterSpacing: 3, marginTop: 6 }}>
              DISTRIBUCIÓN DE COMBUSTIBLE
            </span>
          </div>
        </div>

        {/* Centro: título */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: 62, fontWeight: 800, color: "#ffffff", lineHeight: 1.1, maxWidth: 980 }}>
            Petróleo a Domicilio en Santiago
          </span>
          <span style={{ fontSize: 38, fontWeight: 700, color: "#f5a623", marginTop: 8 }}>
            para empresas e industria · Región Metropolitana
          </span>
        </div>

        {/* Bottom: features + url */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: 14 }}>
            {["Despacho rápido", "Flota propia", "Normativa SEC"].map((t) => (
              <span
                key={t}
                style={{
                  fontSize: 20,
                  color: "#cbd5e1",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  padding: "10px 20px",
                  borderRadius: 999,
                }}
              >
                {t}
              </span>
            ))}
          </div>
          <span style={{ fontSize: 26, fontWeight: 800, color: "#ffffff" }}>fenice.cl</span>
        </div>
      </div>
    ),
    size,
  );
}
