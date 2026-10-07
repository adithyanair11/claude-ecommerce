// Server-only catalogue queries. Results are cached under the "products" tag,
// so anything that changes products or stock should call
// revalidateTag("products") (or updateTag from a server action).

import { cacheLife, cacheTag } from "next/cache";
import { sql } from "drizzle-orm";
import { db } from "@/db";
import type { categories, products, productStock } from "@/db/schema";
import type { Product } from "@/lib/catalog";

type ProductRow = typeof products.$inferSelect & {
  category: typeof categories.$inferSelect;
  stock: (typeof productStock.$inferSelect)[];
};

const withCategoryAndStock = {
  category: true,
  stock: { orderBy: (stock, { asc }) => [asc(stock.position), asc(stock.id)] },
} satisfies NonNullable<Parameters<typeof db.query.products.findMany>[0]>["with"];

function toProduct(row: ProductRow): Product {
  const [image, ...views] = row.images;
  const sized = row.stock.filter((entry) => entry.size !== null);

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: { id: row.category.id, slug: row.category.slug, name: row.category.name },
    priceCents: row.priceCents,
    badge: row.badge ?? undefined,
    styleCode: row.styleCode,
    colour: row.colour,
    description: row.description,
    details: row.details,
    materials: row.materials,
    care: row.care,
    ...(sized.length > 0
      ? { sizes: sized.map((entry) => ({ label: entry.size!, stock: entry.quantity })) }
      : { stock: row.stock[0]?.quantity ?? 0 }),
    image,
    views,
  };
}

export async function getProductSlugs() {
  "use cache";
  cacheLife("hours");
  cacheTag("products");

  const rows = await db.query.products.findMany({
    columns: { slug: true },
    orderBy: (product, { asc }) => [asc(product.id)],
  });
  return rows.map((row) => row.slug);
}

export async function getProduct(slug: string) {
  "use cache";
  cacheLife("hours");
  cacheTag("products");

  const row = await db.query.products.findFirst({
    where: (product, { eq }) => eq(product.slug, slug),
    with: withCategoryAndStock,
  });
  return row ? toProduct(row) : undefined;
}

export async function getNewArrivals(limit = 8) {
  "use cache";
  cacheLife("hours");
  cacheTag("products");

  const rows = await db.query.products.findMany({
    with: withCategoryAndStock,
    orderBy: (product, { asc, desc }) => [desc(product.createdAt), asc(product.id)],
    limit,
  });
  return rows.map(toProduct);
}

/** Up to `count` other products, same category first. */
export async function getRelatedProducts(productId: number, categoryId: number, count = 4) {
  "use cache";
  cacheLife("hours");
  cacheTag("products");

  const rows = await db.query.products.findMany({
    where: (other, { ne }) => ne(other.id, productId),
    with: withCategoryAndStock,
    orderBy: (other, { asc }) => [
      sql`${other.categoryId} = ${categoryId} desc`,
      asc(other.id),
    ],
    limit: count,
  });
  return rows.map(toProduct);
}
