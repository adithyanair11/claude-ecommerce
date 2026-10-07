// Sample catalogue used by `npm run db:seed`. Prices are in cents.

import { unsplash, type CatalogImage, type SizeOption } from "../lib/catalog";

export const seedCategories = [
  { slug: "bags", name: "Bags" },
  { slug: "ready-to-wear", name: "Ready-to-wear" },
  { slug: "eyewear", name: "Eyewear" },
  { slug: "jewellery", name: "Jewellery" },
  { slug: "shoes", name: "Shoes" },
  { slug: "knitwear", name: "Knitwear" },
] as const;

export type SeedProduct = {
  slug: string;
  /** Category slug from `seedCategories`. */
  category: (typeof seedCategories)[number]["slug"];
  name: string;
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
  views: CatalogImage[];
};

// The sample catalogue has one photograph per product, so extra views are
// close-ups of it. Real product data would list separate shots instead.
function closeUps(
  image: CatalogImage,
  crops: { position: string; zoom: number; alt: string }[],
): CatalogImage[] {
  return crops.map((crop) => ({ ...crop, src: image.src }));
}

const topHandleBag = {
  src: unsplash("1584917865442-de89df76afd3"),
  alt: "Scarlet leather top-handle bag with a silver clasp",
};
const bikerJacket = {
  src: unsplash("1551028719-00167b16eac5"),
  alt: "Black leather biker jacket laid flat on white fabric",
};
const sunglasses = {
  src: unsplash("1511499767150-a48a237f0083"),
  alt: "Round gold-frame sunglasses with dark green lenses",
};
const pearlNecklace = {
  src: unsplash("1515562141207-7a88fb7ce338"),
  alt: "Pearl necklace with a silver clasp displayed in an open box",
};
const bomberJacket = {
  src: unsplash("1591047139829-d91aecb6caea"),
  alt: "Tan suede bomber jacket on a hanger",
};
const stilettoPumps = {
  src: unsplash("1543163521-1bf539c55dd2"),
  alt: "Pair of blue and red floral stiletto pumps against a pale blue wall",
};
const knitPoncho = {
  src: unsplash("1434389677669-e08b4cac3105"),
  alt: "Cream open-knit poncho with fringed hem on a wooden hanger",
};
const chambrayShirt = {
  src: unsplash("1596755094514-f87e34085b2c"),
  alt: "Light blue chambray button-down shirt on a hanger",
};

export const seedProducts: SeedProduct[] = [
  {
    slug: "top-handle-bag-scarlet",
    name: "Structured top-handle bag",
    category: "bags",
    priceCents: 2450_00,
    badge: "New",
    styleCode: "ATL-B0142-SCA",
    colour: "Scarlet",
    description:
      "A compact, architectural top-handle bag cut from polished calf leather. The sculpted metal clasp opens onto a suede-lined interior sized for the everyday essentials.",
    details: [
      "Polished calf leather",
      "Palladium-finish turn-lock clasp",
      "Detachable, adjustable shoulder strap",
      "Interior slip pocket",
      "W 24 × H 18 × D 10 cm",
    ],
    materials: "100% calf leather. Lining: 100% goat suede.",
    care: "Store in the dust bag provided, away from direct sunlight. Wipe with a soft dry cloth.",
    stock: 3,
    image: topHandleBag,
    views: closeUps(topHandleBag, [
      { position: "50% 55%", zoom: 2, alt: "Close-up of the palladium turn-lock clasp" },
      { position: "50% 22%", zoom: 1.8, alt: "Close-up of the rolled leather top handle" },
    ]),
  },
  {
    slug: "leather-biker-jacket",
    name: "Leather biker jacket",
    category: "ready-to-wear",
    priceCents: 3900_00,
    styleCode: "ATL-R0218-BLK",
    colour: "Black",
    description:
      "Our take on the classic biker, in supple lambskin that softens and moulds to the wearer. Asymmetric zip, notched lapels and a belted hem, cut close to the body.",
    details: [
      "Lambskin leather",
      "Asymmetric front zip",
      "Zipped cuffs and chest pocket",
      "Buckled belt at hem",
      "Regular fit, true to size",
    ],
    materials: "100% lambskin. Lining: 100% cupro.",
    care: "Specialist leather clean only. Hang on a wide, padded hanger.",
    sizes: [
      { label: "XS", stock: 0 },
      { label: "S", stock: 2 },
      { label: "M", stock: 5 },
      { label: "L", stock: 1 },
      { label: "XL", stock: 0 },
    ],
    image: bikerJacket,
    views: closeUps(bikerJacket, [
      { position: "20% 62%", zoom: 2, alt: "Close-up of the asymmetric zip and snap lapel" },
      { position: "50% 85%", zoom: 2, alt: "Close-up of the zipped pocket and leather grain" },
    ]),
  },
  {
    slug: "round-sunglasses",
    name: "Round metal sunglasses",
    category: "eyewear",
    priceCents: 465_00,
    styleCode: "ATL-E0031-GLD",
    colour: "Gold / bottle green",
    description:
      "Fine round frames in brushed gold-tone metal with bottle-green mineral lenses. Lightweight, with adjustable nose pads for an all-day fit.",
    details: [
      "Brushed gold-tone metal frame",
      "Bottle-green mineral glass lenses",
      "100% UVA/UVB protection",
      "Adjustable nose pads",
      "Includes leather case and cloth",
    ],
    materials: "Frame: stainless steel. Lenses: mineral glass.",
    care: "Clean with the cloth provided. Store in the case when not worn.",
    stock: 14,
    image: sunglasses,
    views: closeUps(sunglasses, [
      { position: "35% 55%", zoom: 2.2, alt: "Close-up of the bottle-green lens" },
      { position: "70% 45%", zoom: 2, alt: "Close-up of the temple hinge" },
    ]),
  },
  {
    slug: "pearl-strand-necklace",
    name: "Pearl strand necklace",
    category: "jewellery",
    priceCents: 1280_00,
    badge: "Limited",
    styleCode: "ATL-J0077-PRL",
    colour: "Ivory / silver",
    description:
      "A single strand of hand-knotted freshwater pearls, graduated in size and finished with a sterling silver box clasp. Made in a numbered edition of 150.",
    details: [
      "Freshwater pearls, 6–8 mm",
      "Hand-knotted on silk thread",
      "Sterling silver box clasp",
      "Length 45 cm",
      "Numbered edition of 150",
    ],
    materials: "Freshwater pearls, silk thread, 925 sterling silver.",
    care: "Put on after perfume and cosmetics. Wipe with a soft cloth and store flat.",
    stock: 0,
    image: pearlNecklace,
    views: closeUps(pearlNecklace, [
      { position: "55% 60%", zoom: 2, alt: "Close-up of the silver box clasp" },
      { position: "40% 30%", zoom: 2, alt: "Close-up of the pearl strand" },
    ]),
  },
  {
    slug: "suede-bomber-jacket",
    name: "Suede bomber jacket",
    category: "ready-to-wear",
    priceCents: 2750_00,
    badge: "New",
    styleCode: "ATL-R0233-TAN",
    colour: "Tan",
    description:
      "A relaxed bomber in brushed goat suede with a ribbed collar, cuffs and hem. Fully lined, with a two-way zip and deep welt pockets.",
    details: [
      "Brushed goat suede",
      "Ribbed wool collar, cuffs and hem",
      "Two-way front zip",
      "Welt pockets",
      "Relaxed fit — consider sizing down",
    ],
    materials: "100% goat suede. Rib: 100% wool. Lining: 100% viscose.",
    care: "Specialist suede clean only. Brush gently to restore the nap.",
    sizes: [
      { label: "XS", stock: 3 },
      { label: "S", stock: 6 },
      { label: "M", stock: 4 },
      { label: "L", stock: 2 },
      { label: "XL", stock: 1 },
    ],
    image: bomberJacket,
    views: closeUps(bomberJacket, [
      { position: "45% 30%", zoom: 2, alt: "Close-up of the ribbed collar and zip" },
      { position: "45% 70%", zoom: 1.8, alt: "Close-up of the suede texture and pocket" },
    ]),
  },
  {
    slug: "floral-stiletto-pump",
    name: "Floral stiletto pump",
    category: "shoes",
    priceCents: 895_00,
    styleCode: "ATL-S0109-FLR",
    colour: "Cobalt floral",
    description:
      "A pointed-toe pump in printed satin with a slender 100 mm stiletto. The cobalt floral print is engineered so every pair is subtly unique.",
    details: [
      "Printed silk satin upper",
      "Pointed toe",
      "100 mm stiletto heel",
      "Leather sole",
      "Made in Italy",
    ],
    materials: "Upper: 100% silk. Lining and sole: calf leather.",
    care: "Store in the dust bags provided. Avoid wearing in wet conditions.",
    sizes: [
      { label: "36", stock: 1 },
      { label: "37", stock: 0 },
      { label: "38", stock: 3 },
      { label: "39", stock: 2 },
      { label: "40", stock: 0 },
      { label: "41", stock: 1 },
    ],
    image: stilettoPumps,
    views: closeUps(stilettoPumps, [
      { position: "68% 25%", zoom: 2, alt: "Close-up of the floral satin print" },
      { position: "42% 72%", zoom: 2, alt: "Close-up of the pointed toe and stiletto heel" },
    ]),
  },
  {
    slug: "fringed-knit-poncho",
    name: "Fringed knit poncho",
    category: "knitwear",
    priceCents: 1150_00,
    styleCode: "ATL-K0056-CRM",
    colour: "Cream",
    description:
      "An open-stitch poncho hand-knitted in a cashmere and silk blend, finished with a long, swinging fringe. Layers easily over tailoring or knitwear.",
    details: [
      "Hand-knitted open stitch",
      "Cashmere and silk blend",
      "V-neck",
      "Fringed hem",
      "One size",
    ],
    materials: "70% cashmere, 30% silk.",
    care: "Hand wash cold and dry flat. Do not hang.",
    stock: 6,
    image: knitPoncho,
    views: closeUps(knitPoncho, [
      { position: "50% 45%", zoom: 2.2, alt: "Close-up of the open-knit stitch" },
      { position: "50% 85%", zoom: 1.8, alt: "Close-up of the fringed hem" },
    ]),
  },
  {
    slug: "chambray-shirt",
    name: "Chambray shirt",
    category: "ready-to-wear",
    priceCents: 590_00,
    styleCode: "ATL-R0247-BLU",
    colour: "Light blue",
    description:
      "A soft-washed cotton chambray shirt with a scattered dot pattern, a point collar and three-quarter sleeves. Easy enough for weekends, sharp enough for the office.",
    details: [
      "Washed cotton chambray",
      "Point collar",
      "Mother-of-pearl buttons",
      "Three-quarter sleeves",
      "Regular fit",
    ],
    materials: "100% cotton.",
    care: "Machine wash at 30°C. Iron on medium heat.",
    sizes: [
      { label: "XS", stock: 4 },
      { label: "S", stock: 8 },
      { label: "M", stock: 9 },
      { label: "L", stock: 5 },
      { label: "XL", stock: 3 },
    ],
    image: chambrayShirt,
    views: closeUps(chambrayShirt, [
      { position: "50% 28%", zoom: 2, alt: "Close-up of the point collar" },
      { position: "45% 60%", zoom: 2.2, alt: "Close-up of the dot pattern and buttons" },
    ]),
  },
];
