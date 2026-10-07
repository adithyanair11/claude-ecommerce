import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons";
import { NewsletterForm } from "@/components/newsletter-form";
import { ProductCard } from "@/components/product-card";
import { SectionHeading } from "@/components/section-heading";
import { campaign, collections, editorial, services } from "@/lib/catalog";
import { getNewArrivals } from "@/lib/products";

export default function Home() {
  return (
    <main id="main">
      <Hero />
      <Categories />
      <NewArrivals />
      <Editorial />
      <Services />
      <Newsletter />
    </main>
  );
}

function Hero() {
  return (
    <section aria-labelledby="hero-title" className="hero-frame">
      <Image
        src={campaign.image.src}
        alt={campaign.image.alt}
        fill
        loading="eager"
        fetchPriority="high"
        sizes="100vw"
        style={{ objectPosition: campaign.image.position }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-t from-black/75 via-black/35 to-transparent md:bg-linear-to-r md:from-black/50 md:via-black/15"
      />
      <div className="absolute inset-0 flex items-end md:items-center">
        <div className="container-page pb-10 text-white md:pb-0">
          {/* Capped from tablet up so the copy stays clear of the model. */}
          <div className="flex max-w-xl flex-col items-start gap-5 md:max-w-[46%] lg:max-w-xl">
            <p className="eyebrow">{campaign.eyebrow}</p>
            <h1 id="hero-title" className="text-display md:max-lg:text-[3.25rem]">
              {campaign.title}
            </h1>
            <p className="max-w-md text-subtitle text-white/85 max-sm:text-body">
              {campaign.body}
            </p>
            <Link href={campaign.cta.href} className="btn btn-light mt-2 max-sm:w-full">
              {campaign.cta.label}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function Categories() {
  return (
    <section aria-labelledby="categories-title" className="container-page section-y">
      <SectionHeading id="categories-title" eyebrow="Explore" title="Shop by category" />
      <ul className="grid grid-cols-2 gap-x-tile gap-y-8 lg:grid-cols-4">
        {collections.map((collection) => (
          <li key={collection.slug}>
            <Link href={`/collections/${collection.slug}`} className="group block">
              <div className="media-frame aspect-portrait">
                <Image
                  src={collection.image.src}
                  alt=""
                  fill
                  sizes="(min-width: 64rem) 25vw, 50vw"
                  className="transition-transform duration-700 ease-atelier group-hover:scale-[1.03]"
                  style={{ objectPosition: collection.image.position }}
                />
              </div>
              <span className="mt-4 flex items-center gap-2 eyebrow">
                {collection.name}
                <ArrowRightIcon className="transition-transform duration-300 ease-atelier group-hover:translate-x-1" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

async function NewArrivals() {
  const newArrivals = await getNewArrivals();
  const viewAll = { label: "View all", href: "/collections/new-in" };

  return (
    <section aria-labelledby="new-arrivals-title" className="container-page pb-section">
      <SectionHeading
        id="new-arrivals-title"
        eyebrow="Just landed"
        title="New arrivals"
        action={viewAll}
      />
      <ul className="product-grid">
        {newArrivals.map((product) => (
          <li key={product.slug}>
            <ProductCard product={product} />
          </li>
        ))}
      </ul>
      <Link href={viewAll.href} className="btn btn-secondary btn-block mt-10 sm:hidden">
        {viewAll.label}
      </Link>
    </section>
  );
}

function Editorial() {
  return (
    <section aria-labelledby="editorial-title" className="grid bg-surface md:grid-cols-2">
      <div className="media-frame aspect-portrait md:aspect-auto md:min-h-[42rem]">
        <Image
          src={editorial.image.src}
          alt={editorial.image.alt}
          fill
          sizes="(min-width: 48rem) 50vw, 100vw"
        />
      </div>
      <div className="flex items-center px-gutter py-section">
        <div className="mx-auto flex max-w-md flex-col items-start gap-5">
          <p className="eyebrow text-muted">{editorial.eyebrow}</p>
          <h2 id="editorial-title" className="text-headline">
            {editorial.title}
          </h2>
          <p className="text-body text-muted">{editorial.body}</p>
          <Link href={editorial.cta.href} className="link-cta mt-2">
            {editorial.cta.label}
          </Link>
        </div>
      </div>
    </section>
  );
}

function Services() {
  return (
    <section aria-labelledby="services-title" className="container-page section-y">
      <h2 id="services-title" className="sr-only">
        Our services
      </h2>
      <ul className="grid gap-x-8 sm:grid-cols-2 lg:grid-cols-4">
        {services.map((service) => (
          <li key={service.title} className="flex flex-col gap-2 border-t py-6">
            <h3 className="eyebrow">{service.title}</h3>
            <p className="text-small text-muted">{service.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Newsletter() {
  return (
    <section aria-labelledby="newsletter-title" className="border-t">
      <div className="container-prose section-y flex flex-col gap-6 text-center">
        <p className="eyebrow text-muted">Newsletter</p>
        <h2 id="newsletter-title" className="text-title">
          First access to new collections, private sales and stories from the
          workshop.
        </h2>
        <NewsletterForm />
        <p className="text-micro text-muted">
          By subscribing you agree to receive marketing emails. Unsubscribe at
          any time.
        </p>
      </div>
    </section>
  );
}
