// Seeds the sample catalogue. Safe to rerun: categories and products are
// upserted by slug, and each seeded product's stock rows are replaced.
// Run with `npm run db:seed`.

import { inArray, sql } from "drizzle-orm";
import { db } from "./index";
import { categories, products, productStock } from "./schema";
import { seedCategories, seedProducts } from "./seed-data";

async function main() {
  const categoryRows = await db
    .insert(categories)
    .values([...seedCategories])
    .onConflictDoUpdate({ target: categories.slug, set: { name: sql`excluded.name` } })
    .returning({ id: categories.id, slug: categories.slug });
  const categoryIds = new Map(categoryRows.map((row) => [row.slug, row.id]));

  const productQueries = seedProducts.map((product) => {
    const values = {
      categoryId: categoryIds.get(product.category)!,
      name: product.name,
      priceCents: product.priceCents,
      badge: product.badge ?? null,
      styleCode: product.styleCode,
      colour: product.colour,
      description: product.description,
      details: product.details,
      materials: product.materials,
      care: product.care,
      images: [product.image, ...product.views],
    };
    return db
      .insert(products)
      .values({ slug: product.slug, ...values })
      .onConflictDoUpdate({ target: products.slug, set: { ...values, updatedAt: new Date() } })
      .returning({ id: products.id, slug: products.slug });
  });
  const [firstProduct, ...otherProducts] = productQueries;
  const productRows = (await db.batch([firstProduct, ...otherProducts])).flat();
  const productIds = new Map(productRows.map((row) => [row.slug, row.id]));

  const stockRows = seedProducts.flatMap((product): (typeof productStock.$inferInsert)[] => {
    const productId = productIds.get(product.slug)!;
    return product.sizes
      ? product.sizes.map((size, position) => ({
          productId,
          size: size.label,
          quantity: size.stock,
          position,
        }))
      : [{ productId, size: null, quantity: product.stock ?? 0, position: 0 }];
  });
  await db.batch([
    db.delete(productStock).where(inArray(productStock.productId, [...productIds.values()])),
    db.insert(productStock).values(stockRows),
  ]);

  console.log(
    `Seeded ${categoryRows.length} categories, ${productRows.length} products, ${stockRows.length} stock rows.`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
