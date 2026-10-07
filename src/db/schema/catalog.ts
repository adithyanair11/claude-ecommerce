import { relations, sql } from "drizzle-orm";
import {
  check,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";
import type { CatalogImage } from "../../lib/catalog";

export const categories = pgTable("categories", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  slug: text().notNull().unique(),
  name: text().notNull(),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
});

export const productBadge = pgEnum("product_badge", ["New", "Limited"]);

export const products = pgTable(
  "products",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    slug: text().notNull().unique(),
    categoryId: integer()
      .notNull()
      .references(() => categories.id, { onDelete: "restrict" }),
    name: text().notNull(),
    /** Price in the store currency's minor unit (cents). */
    priceCents: integer().notNull(),
    badge: productBadge(),
    styleCode: text().notNull().unique("products_style_code_unique"),
    colour: text().notNull(),
    description: text().notNull(),
    details: text().array().notNull().default(sql`'{}'::text[]`),
    materials: text().notNull(),
    care: text().notNull(),
    /** Lead image first, then additional views. */
    images: jsonb().$type<CatalogImage[]>().notNull(),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp({ withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("products_category_id_idx").on(table.categoryId),
    check("products_price_cents_nonnegative", sql`${table.priceCents} >= 0`),
  ],
);

// Units on hand. One-size products have a single row with a null `size`;
// sized products have one row per size, ordered by `position`.
export const productStock = pgTable(
  "product_stock",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    productId: integer()
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    size: text(),
    quantity: integer().notNull().default(0),
    position: integer().notNull().default(0),
  },
  (table) => [
    unique("product_stock_product_size_key")
      .on(table.productId, table.size)
      .nullsNotDistinct(),
    check("product_stock_quantity_nonnegative", sql`${table.quantity} >= 0`),
  ],
);

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  stock: many(productStock),
}));

export const productStockRelations = relations(productStock, ({ one }) => ({
  product: one(products, {
    fields: [productStock.productId],
    references: [products.id],
  }),
}));
