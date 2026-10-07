import Link from "next/link";
import { footerLinks } from "@/lib/catalog";

export function SiteFooter() {
  return (
    <footer className="theme-inverse mt-auto">
      <div className="container-page grid gap-12 pt-16 pb-10 md:grid-cols-[2fr_repeat(3,1fr)] md:gap-8 lg:pt-24">
        <div className="flex flex-col gap-4">
          <p className="text-[1.375rem] font-medium uppercase tracking-[0.32em]">
            Atelier
          </p>
          <p className="max-w-xs text-small text-muted">
            Contemporary luxury, made in small runs by the workshops we know by
            name.
          </p>
        </div>

        {footerLinks.map((group) => (
          <nav key={group.heading} aria-label={group.heading}>
            <h2 className="eyebrow text-muted">{group.heading}</h2>
            <ul className="mt-3 flex flex-col">
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex min-h-10 items-center text-small transition-opacity hover:opacity-60"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="container-page flex flex-col gap-2 border-t py-6 text-micro text-muted sm:flex-row sm:justify-between">
        <p>© 2026 Atelier. Sample storefront.</p>
        <p>United States · English · USD</p>
      </div>
    </footer>
  );
}
