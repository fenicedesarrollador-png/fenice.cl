import Image from "next/image";

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
      className={`${onDark ? "rounded-xl bg-white/95 shadow-sm ring-1 ring-white/10" : ""} ${className}`.trim()}
    >
      <div className="relative h-full w-full overflow-hidden">
        <Image
          src="/brand/fenice-logo.png"
          alt="Fenice SPA"
          fill
          priority={priority}
          sizes="(max-width: 640px) 180px, 240px"
          className={`object-contain scale-[1.48] ${imageClassName}`.trim()}
        />
      </div>
    </div>
  );
}
