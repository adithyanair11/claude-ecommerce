import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense, type ReactNode } from "react";
import { PlusIcon } from "@/components/icons";
import { ProductCard } from "@/components/product-card";
import { ProductGallery } from "@/components/product-gallery";
import { ProductPurchase } from "@/components/product-purchase";
import { SectionHeading } from "@/components/section-heading";
import { formatPrice, stockStatus, totalStock, type Product } from "@/lib/catalog";
import { getProduct, getProductSlugs, getRelatedProducts } from "@/lib/products";

export async function generateStaticParams() {
  const slugs = await getProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return {};

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [{ url: product.image.src, alt: product.image.alt }],
    },
  };
}

// Params are read inside <Suspense> so client navigations can show the
// skeleton instantly. Every catalogue product is still fully prerendered via
// generateStaticParams; an unknown slug renders the 404 UI with noindex.
export default function ProductPage({ params }: PageProps<"/products/[slug]">) {
  return (
    <Suspense fallback={<ProductSkeleton />}>
      <ProductDetail params={params} />
    </Suspense>
  );
}

async function ProductDetail({ params }: Pick<PageProps<"/products/[slug]">, "params">) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const categoryHref = `/collections/${product.category.slug}`;

  return (
    <main id="main">
      <ProductJsonLd product={product} />

      <nav aria-label="Breadcrumb" className="container-page py-4 lg:py-6">
        <ol className="flex flex-wrap items-center gap-2 text-micro uppercase tracking-[0.1em] text-muted">
          <li>
            <Link href="/" className="hover:text-ink">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href={categoryHref} className="hover:text-ink">
              {product.category.name}
            </Link>
          </li>
          <li aria-hidden="true" className="max-sm:hidden">
            /
          </li>
          <li aria-current="page" className="text-ink max-sm:hidden">
            {product.name}
          </li>
        </ol>
      </nav>

      <div className="lg:container-page lg:grid lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:items-start lg:gap-12 xl:gap-20">
        <ProductGallery images={[product.image, ...product.views]} />

        <div className="px-gutter pt-8 lg:sticky lg:top-[calc(var(--spacing-header)+4rem)] lg:px-0 lg:pt-0">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <Link href={categoryHref} className="eyebrow text-muted hover:text-ink">
                {product.category.name}
              </Link>
              {product.badge ? (
                <span className="border px-2 py-1 text-micro font-medium uppercase tracking-[0.1em]">
                  {product.badge}
                </span>
              ) : null}
            </div>
            <h1 className="text-title">{product.name}</h1>
            <p className="price text-subtitle">{formatPrice(product.priceCents)}</p>
            <p className="text-small text-muted">
              Colour: <span className="text-ink">{product.colour}</span>
            </p>
          </div>

          <div className="mt-8">
            <ProductPurchase
              productName={product.name}
              sizes={product.sizes}
              stock={product.stock}
            />
          </div>

          <ul className="mt-8 flex flex-col gap-1 text-small text-muted">
            <li>Complimentary express delivery</li>
            <li>Free returns within 30 days</li>
            <li>Arrives in signature packaging</li>
          </ul>

          <div className="mt-8 border-t">
            <Disclosure title="Description" open>
              <p>{product.description}</p>
              <ul className="mt-4 list-disc space-y-1 pl-5">
                {product.details.map((detail) => (
                  <li key={detail}>{detail}</li>
                ))}
              </ul>
            </Disclosure>
            <Disclosure title="Materials & care">
              <p>{product.materials}</p>
              <p className="mt-3">{product.care}</p>
            </Disclosure>
            <Disclosure title="Delivery & returns">
              <p>
                Complimentary express delivery in 1–3 business days, with signature on
                arrival. Return or exchange any unworn piece within 30 days, collected
                from your door.
              </p>
            </Disclosure>
          </div>

          <p className="mt-6 text-micro uppercase tracking-[0.1em] text-muted">
            Style <span className="price">{product.styleCode}</span>
          </p>
        </div>
      </div>

      <RelatedProducts product={product} />
    </main>
  );
}

function ProductSkeleton() {
  return (
    <main id="main" aria-busy="true">
      <span className="sr-only">Loading product</span>
      <div className="container-page py-4 lg:py-6">
        <div className="h-3 w-40 bg-surface" />
      </div>
      <div className="lg:container-page lg:grid lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:items-start lg:gap-12 xl:gap-20">
        <div className="media-frame animate-pulse" />
        <div className="flex flex-col gap-4 px-gutter pt-8 lg:px-0 lg:pt-0">
          <div className="h-3 w-24 bg-surface" />
          <div className="h-8 w-3/4 bg-surface" />
          <div className="h-5 w-20 bg-surface" />
          <div className="mt-8 h-14 w-full bg-surface" />
        </div>
      </div>
    </main>
  );
}

function Disclosure({
  title,
  open,
  children,
}: {
  title: string;
  open?: boolean;
  children: ReactNode;
}) {
  return (
    <details name="product-info" open={open} className="group border-b">
      <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between eyebrow [&::-webkit-details-marker]:hidden">
        {title}
        <PlusIcon className="transition-transform duration-300 ease-atelier group-open:rotate-45" />
      </summary>
      <div className="pb-6 text-small text-muted">{children}</div>
    </details>
  );
}

async function RelatedProducts({ product }: { product: Product }) {
  const related = await getRelatedProducts(product.id, product.category.id);

  return (
    <section aria-labelledby="related-title" className="container-page section-y">
      <SectionHeading
        id="related-title"
        eyebrow="Complete the look"
        title="You may also like"
        action={{ label: "View all", href: "/collections/new-in" }}
      />
      <ul className="product-grid">
        {related.map((item) => (
          <li key={item.slug}>
            <ProductCard product={item} />
          </li>
        ))}
      </ul>
    </section>
  );
}

const availability = {
  "in-stock": "https://schema.org/InStock",
  "low-stock": "https://schema.org/LimitedAvailability",
  "sold-out": "https://schema.org/OutOfStock",
} as const;

function ProductJsonLd({ product }: { product: Product }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    sku: product.styleCode,
    color: product.colour,
    category: product.category.name,
    image: [product.image.src],
    brand: { "@type": "Brand", name: "Atelier" },
    offers: {
      "@type": "Offer",
      price: product.priceCents / 100,
      priceCurrency: "USD",
      availability: availability[stockStatus(totalStock(product))],
    },
  };

  return (
    <script
      type="application/ld+json"
      // Escape "<" so catalogue text can never close the script tag.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
    />
  );
}
