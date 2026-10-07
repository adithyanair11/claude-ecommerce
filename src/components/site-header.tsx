import Link from "next/link";
import { BagIcon, SearchIcon, UserIcon } from "@/components/icons";
import { MobileMenu } from "@/components/mobile-menu";
import { navigation } from "@/lib/catalog";

const accountLinks = [
  { label: "Sign in", href: "/account" },
  { label: "Wishlist", href: "/wishlist" },
  { label: "Store locator", href: "/stores" },
  { label: "Client services", href: "/contact" },
];

export function SiteHeader() {
  return (
    <>
      <p className="theme-inverse px-gutter py-2.5 text-center text-micro font-medium uppercase tracking-[0.1em]">
        Complimentary express delivery and returns on every order
      </p>

      <header className="header-bar">
        <div className="container-page grid h-header grid-cols-[1fr_auto_1fr] items-center">
          <div className="-ml-3 flex items-center">
            <div className="lg:hidden">
              <MobileMenu items={navigation} secondary={accountLinks} />
            </div>
            <Link href="/search" className="btn btn-ghost btn-icon" aria-label="Search">
              <SearchIcon />
            </Link>
          </div>

          <Link
            href="/"
            className="text-[1.375rem] font-medium uppercase tracking-[0.32em] sm:text-[1.625rem]"
          >
            {/* Trailing letter-spacing would push the wordmark off-centre. */}
            <span className="-mr-[0.32em]">Atelier</span>
          </Link>

          <div className="-mr-3 flex items-center justify-end">
            <Link
              href="/account"
              className="btn btn-ghost btn-icon max-sm:hidden"
              aria-label="Account"
            >
              <UserIcon />
            </Link>
            <Link href="/bag" className="btn btn-ghost btn-icon" aria-label="Shopping bag, empty">
              <BagIcon />
            </Link>
          </div>
        </div>

        <nav aria-label="Main" className="hidden border-t lg:block">
          <ul className="container-page flex justify-center gap-10">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="nav-link">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>
    </>
  );
}
