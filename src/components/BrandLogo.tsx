import Image from "next/image";

// Usa el logo ya recortado (sin el enorme margen en blanco del original), por lo
// que llena su caja de forma limpia con object-contain: nada de trucos de scale
// ni overflow-hidden. Relacion de aspecto del arte ~3.42:1.
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
      <div className="relative h-full w-full">
        <Image
          src="/brand/fenice-logo-trim.png"
          alt="Fenice SPA — Petróleo a domicilio"
          fill
          priority={priority}
          sizes="(max-width: 640px) 220px, 300px"
          className={`object-contain ${imageClassName}`.trim()}
        />
      </div>
    </div>
  );
}
