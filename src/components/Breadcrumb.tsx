import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { SITE_CONFIG } from "@/lib/config";

interface Crumb {
  name: string;
  href?: string;
}

export default function Breadcrumb({ crumbs, dark = false }: { crumbs: Crumb[]; dark?: boolean }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      ...(c.href ? { item: `${SITE_CONFIG.site_url}${c.href}` } : {}),
    })),
  };

  const linkClass = dark
    ? "inline-flex items-center gap-1 text-slate-300 hover:text-white transition-colors"
    : "inline-flex items-center gap-1 text-slate-500 hover:text-[#1a6b3c] transition-colors";
  const lastClass = dark
    ? "inline-flex items-center gap-1 text-white font-semibold"
    : "inline-flex items-center gap-1 text-[#0a1628] font-semibold";
  const chevronClass = dark ? "w-3.5 h-3.5 text-slate-500 shrink-0" : "w-3.5 h-3.5 text-slate-300 shrink-0";

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <nav aria-label="Breadcrumb" className="text-sm mb-4">
        <ol className="flex flex-wrap items-center gap-1.5">
          {crumbs.map((crumb, i) => {
            const isLast = i === crumbs.length - 1;
            return (
              <li key={i} className="flex items-center gap-1.5">
                {i > 0 && <ChevronRight className={chevronClass} />}
                {crumb.href && !isLast ? (
                  <Link href={crumb.href} className={linkClass}>
                    {i === 0 && <Home className="w-3.5 h-3.5" />}
                    {crumb.name}
                  </Link>
                ) : (
                  <span className={lastClass}>
                    {i === 0 && <Home className="w-3.5 h-3.5" />}
                    {crumb.name}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
