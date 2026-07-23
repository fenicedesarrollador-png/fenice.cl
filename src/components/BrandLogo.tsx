// Logo de marca. Se sirve como archivo estático DIRECTO (sin pasar por el
// optimizador de Next `/_next/image`): el arte ya viene recortado y liviano, y
// así el logo carga siempre —incluso con el origen lento/frío— y Cloudflare
// puede cachearlo como asset estático inmutable. Relación de aspecto ~3.42:1.
type BrandLogoProps = {
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  onDark?: boolean;
};

export default function BrandLogo({
  className = "",
  imageClassName = "",
  priority = false,
  onDark = false,
}: BrandLogoProps) {
  return (
    <div
      className={`${onDark ? "rounded-xl bg-white/95 px-3 py-2 shadow-sm ring-1 ring-black/5" : ""} ${className}`.trim()}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- asset estático servido directo, sin optimizador (más robusto y cacheable) */}
      <img
        src="/brand/fenice-logo-trim.png"
        alt="Fenice SPA — Petróleo a domicilio"
        width={198}
        height={58}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        decoding="async"
        className={`h-full w-full object-contain ${imageClassName}`.trim()}
      />
    </div>
  );
}
