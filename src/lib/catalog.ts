// Shared catalogue types and helpers, plus static storefront content.
// Products, categories and stock live in Postgres: query them through
// src/lib/products.ts. This module is imported by client components, so it
// must never import @/db.

export type CatalogImage = {
  src: string;
  alt: string;
  /** CSS object-position, for keeping the subject in frame when cropped. */
  position?: string;
  /** Magnification for close-up views cut from the same photograph. */
  zoom?: number;
};

export type SizeOption = {
  label: string;
  stock: number;
};

export type Product = {
  id: number;
  slug: string;
  name: string;
  category: { id: number; slug: string; name: string };
  /** Price in cents. */
  priceCents: number;
  badge?: "New" | "Limited";
  styleCode: string;
  colour: string;
  description: string;
  details: string[];
  materials: string;
  care: string;
  /** Units on hand for one-size products. Ignored when `sizes` is set. */
  stock?: number;
  sizes?: SizeOption[];
  image: CatalogImage;
  /** Additional views shown after `image` on the product page. */
  views: CatalogImage[];
};

export type Collection = {
  slug: string;
  name: string;
  image: CatalogImage;
};

// Must match images.remotePatterns[].search in next.config.ts.
const UNSPLASH_QUERY = "?auto=format&fit=max&w=2400&q=80";

export function unsplash(id: string) {
  return `https://images.unsplash.com/photo-${id}${UNSPLASH_QUERY}`;
}

export const navigation = [
  { label: "New In", href: "/collections/new-in" },
  { label: "Women", href: "/collections/women" },
  { label: "Men", href: "/collections/men" },
  { label: "Bags", href: "/collections/bags" },
  { label: "Jewellery", href: "/collections/jewellery" },
  { label: "Gifts", href: "/collections/gifts" },
];

export const campaign = {
  eyebrow: "Autumn / Winter 2026",
  title: "Colour, considered.",
  body: "A season of sharp tailoring, saturated tones and pieces made to be worn for years.",
  cta: { label: "Discover the collection", href: "/collections/new-in" },
  image: {
    src: unsplash("1509631179647-0177331693ae"),
    alt: "Model in striped wide-leg trousers and a white top posing against a teal wall",
    position: "60% 30%",
  },
};

export const collections: Collection[] = [
  {
    slug: "women",
    name: "Women",
    image: {
      src: unsplash("1483985988355-763728e1935b"),
      alt: "Woman in a burgundy coat and sunglasses carrying shopping bags",
      position: "50% 25%",
    },
  },
  {
    slug: "men",
    name: "Men",
    image: {
      src: unsplash("1617137984095-74e4e5e3613f"),
      alt: "Man in a navy suit and white shirt standing outside a glass building",
      position: "50% 20%",
    },
  },
  {
    slug: "bags",
    name: "Bags",
    image: {
      src: unsplash("1591561954557-26941169b49e"),
      alt: "Floral printed top-handle bag on a dark background",
    },
  },
  {
    slug: "jewellery",
    name: "Jewellery",
    image: {
      src: unsplash("1535632066927-ab7c9ab60908"),
      alt: "Pair of sapphire and crystal drop earrings resting on a green leaf",
    },
  },
];

export type StockStatus = "in-stock" | "low-stock" | "sold-out";

export const LOW_STOCK_THRESHOLD = 3;

export function stockStatus(units: number): StockStatus {
  if (units <= 0) return "sold-out";
  if (units <= LOW_STOCK_THRESHOLD) return "low-stock";
  return "in-stock";
}

export function totalStock(product: Product) {
  return product.sizes
    ? product.sizes.reduce((sum, size) => sum + size.stock, 0)
    : (product.stock ?? 0);
}

export const editorial = {
  eyebrow: "The knitwear edit",
  title: "Made to be lived in",
  body: "Cashmere, merino and hand-finished cable knits in a palette of oat, camel and chocolate. Pieces that soften with every wear.",
  cta: { label: "Shop knitwear", href: "/collections/knitwear" },
  image: {
    src: unsplash("1558769132-cb1aea458c5e"),
    alt: "Rail of neutral-toned knitwear beside dried pampas grass",
  },
};

export const services = [
  {
    title: "Complimentary delivery",
    body: "Free express shipping on every order, with signature on arrival.",
  },
  {
    title: "Returns within 30 days",
    body: "Return or exchange any unworn piece, collected from your door.",
  },
  {
    title: "Signature packaging",
    body: "Every order arrives wrapped, with a handwritten note on request.",
  },
  {
    title: "Book an appointment",
    body: "Shop one-to-one with a client advisor, in store or by video.",
  },
];

export const footerLinks = [
  {
    heading: "Client services",
    links: [
      { label: "Contact us", href: "/contact" },
      { label: "Shipping", href: "/shipping" },
      { label: "Returns", href: "/returns" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  {
    heading: "The house",
    links: [
      { label: "About Atelier", href: "/about" },
      { label: "Craftsmanship", href: "/craftsmanship" },
      { label: "Sustainability", href: "/sustainability" },
      { label: "Careers", href: "/careers" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy policy", href: "/privacy" },
      { label: "Terms of sale", href: "/terms" },
      { label: "Cookie settings", href: "/cookies" },
      { label: "Accessibility", href: "/accessibility" },
    ],
  },
];

const priceFormat = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

/** Formats a price given in cents. */
export function formatPrice(cents: number) {
  return priceFormat.format(cents / 100);
}
