import Image from "next/image";
import Link from "next/link";
import { WishlistButton } from "@/components/wishlist-button";
import { formatPrice, stockStatus, totalStock, type Product } from "@/lib/catalog";

export function ProductCard({ product }: { product: Product }) {
  const href = `/products/${product.slug}`;
  const soldOut = stockStatus(totalStock(product)) === "sold-out";
  const badge = soldOut ? "Sold out" : product.badge;

  return (
    <article className="group relative">
      <div className="media-frame">
        <Image
          src={product.image.src}
          alt={product.image.alt}
          fill
          sizes="(min-width: 80rem) 25vw, (min-width: 48rem) 33vw, 50vw"
          className="transition-transform duration-700 ease-atelier group-hover:scale-[1.03]"
          style={{ objectPosition: product.image.position }}
        />
        {badge ? (
          <span className="absolute top-3 left-3 bg-paper px-2 py-1 text-micro font-medium uppercase tracking-[0.1em]">
            {badge}
          </span>
        ) : null}
        {/* Sits above the stretched link so it stays independently clickable. */}
        <div className="absolute top-1 right-1 z-10">
          <WishlistButton productName={product.name} />
        </div>
      </div>

      <div className="mt-3 flex flex-col gap-0.5 sm:mt-4">
        <p className="text-micro uppercase tracking-[0.1em] text-muted">
          {product.category.name}
        </p>
        <h3 className="text-small font-medium">
          <Link href={href} className="after:absolute after:inset-0">
            {product.name}
          </Link>
        </h3>
        <p className="price text-small text-muted">{formatPrice(product.priceCents)}</p>
      </div>
    </article>
  );
}
