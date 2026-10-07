# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Stack

Next.js 16.4 (App Router, Turbopack) + React 19.3 + TypeScript (strict) + Tailwind CSS v4, with Better Auth for authentication and Drizzle ORM on Neon Postgres. The project is an early-stage e-commerce scaffold.

Per AGENTS.md, this Next.js version differs from older releases: consult `node_modules/next/dist/docs/` (`01-app/` for App Router guides and API reference) before writing Next.js code. In particular, `next.config.ts` enables `cacheComponents` and `partialPrefetching`, which change caching, data fetching and prefetching behavior. Read `01-app/01-getting-started/08-caching.md` and `09-revalidating.md` before adding data fetching. Route types are global helpers (for example, `LayoutProps<"/">` in `src/app/layout.tsx`).

## Commands

```bash
npm run dev          # dev server (http://localhost:3000)
npm run build        # production build
npm run lint         # ESLint (flat config: next core-web-vitals + typescript)
npm run typecheck    # tsc --noEmit

npm run db:generate  # generate SQL migrations from src/db/schema into drizzle/
npm run db:migrate   # apply migrations
npm run db:push      # push schema directly (no migration files)
npm run db:studio    # Drizzle Studio
npm run db:seed      # upsert the sample catalogue (src/db/seed-data.ts); safe to rerun
npm run auth:generate  # Better Auth CLI -> src/db/schema/auth.ts
```

There is no test framework set up yet.

`auth:generate` calls an `auth` binary that is not in `devDependencies`, so install the Better Auth CLI before running it.

## Environment

Copy `.env.example` to `.env.local`. It needs `DATABASE_URL` (the Neon **pooled** connection string), `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` and `NEXT_PUBLIC_APP_URL`. `drizzle.config.ts` loads `.env.local` explicitly through dotenv. `src/db/index.ts` throws at import time when `DATABASE_URL` is unset, so any module that imports `@/db` or `@/lib/auth` needs it, and that includes `next build`.

## Architecture

- **Database:** `src/db/index.ts` exports a single `db` client that uses the Neon **HTTP** driver (`drizzle-orm/neon-http`). All tables are defined under `src/db/schema/` and re-exported from the barrel `src/db/schema/index.ts`. Both drizzle-kit (`schema: "./src/db/schema"`) and the Drizzle client and auth adapter read from that barrel, so a new table must be exported there.
  - **No interactive transactions:** the HTTP driver can't run them. Use `db.batch([...])` when several statements must succeed together.
  - **Migrations:** change the schema, run `db:generate`, review the SQL, then run `db:migrate`, and commit `drizzle/`. Don't use `db:push`, because it would drift from the migration history.
  - **Casing:** `casing: "snake_case"` is set in both `src/db/index.ts` and `drizzle.config.ts`, and the two must stay in sync. Write camelCase schema keys without explicit column names. Drizzle builds default `.unique()` constraint names from the TS key (so `styleCode` gives `products_styleCode_unique`), so pass a snake_case name.
  - **Keys and money:** primary keys are `integer` identity columns, and `slug` is the unique public key. Money is an integer in cents (`priceCents`), never a float. `formatPrice()` takes cents.
  - **Catalogue tables** live in `src/db/schema/catalog.ts`: `categories`, `products` and `product_stock`. Stock is one `product_stock` row per size, and a one-size product has a single row with `size = null` (a unique constraint with `NULLS NOT DISTINCT` enforces this). A size has no SKU or price of its own, so sizes are not variants.
  - **Reading the catalogue:** read it only through `src/lib/products.ts`. Every function there is `"use cache"` with `cacheLife("hours")` and `cacheTag("products")`, and returns the `Product` type from `src/lib/catalog.ts`. Call `revalidateTag("products")` after writing catalogue data. Client components import `catalog.ts`, so it must never import `@/db`.
  - **Seeding:** `db:seed` (`src/db/seed.ts`) upserts by slug and replaces stock rows, so keep it safe to rerun. `next build` queries the database in `generateStaticParams`, so the database must be migrated and seeded before a build.
- **Auth:** `src/lib/auth.ts` is the server-side Better Auth instance. It uses the Drizzle adapter (`provider: "pg"`) with the full schema and the `nextCookies()` plugin, which lets server actions set cookies. It is served by the catch-all handler `src/app/api/auth/[...all]/route.ts`. `src/lib/auth-client.ts` is the React client (`authClient`) for client components.
- **Auth tables:** these do not exist yet. Create them with `npm run auth:generate`, then uncomment `export * from "./auth";` in `src/db/schema/index.ts`, then run `db:generate` + `db:migrate`. Rerun this step after you add Better Auth plugins that need new tables.
- **Styling:** Tailwind v4 is CSS-first. There is no `tailwind.config`. The whole design system lives in `src/app/globals.css`, and Turbopack processes CSS with `@tailwindcss/turbopack` (configured in `next.config.ts`). The visual language is monochrome and editorial, with square edges:
  - **Colour:** the default Tailwind palette is removed (`--color-*: initial`). Use only the semantic tokens: `ink`, `paper`, `surface`, `muted`, `subtle`, `line`, `line-strong`, `hover`, `scrim`, `sale`, `success` and `error`.
  - **Type:** use `text-display|headline|title|subtitle|body|small|label|micro`. Each step already sets its leading, tracking and weight. Use `eyebrow` for uppercase labels and `price` for tabular digits.
  - **Layout:** use `container-page`, `container-content` and `container-prose`, plus `bleed`, `section-y`, `grid-auto`, `product-grid`, `media-frame`, `hero-frame` and `header-bar`. Fluid spacing tokens are `gutter`, `section`, `tile` and `header` (for example `px-gutter` or `py-section`).
  - **Controls:** buttons combine `btn` with a variant (`btn-primary`, `btn-secondary`, `btn-light` or `btn-ghost`), plus optional `btn-sm`, `btn-lg`, `btn-icon` or `btn-block`. Variants only set `--btn-*` custom properties, so keep that pattern. Links use `link`, `link-cta` or `nav-link`, and inputs use `field`.
  - **Borders and dark sections:** a bare `border` is a hairline in `line`. `theme-inverse` swaps the tokens for black sections, and there is no automatic dark mode.
- **Storefront:**
  - The site header and footer are rendered in `src/app/layout.tsx`. Components live in `src/components/`, and only the interactive ones (`mobile-menu`, `wishlist-button`, `newsletter-form`) are client components.
  - Products come from the database (see **Database**). `src/lib/catalog.ts` holds the shared types and helpers and the static site content (navigation, campaign, collections). Most linked routes (`/collections/*`, `/bag`) don't exist yet.
  - Remote images are Unsplash only. Build URLs with `unsplash()`: its query string must exactly match `images.remotePatterns[].search` in `next.config.ts`, or `next/image` returns 400.
  - Next 16 deprecates `priority`; above-the-fold images use `loading="eager"` plus `fetchPriority="high"`.
  - The product page (`src/app/products/[slug]/page.tsx`) prerenders every product with `generateStaticParams`. It reads `params` inside `<Suspense>`, because Cache Components flags `params` awaited outside Suspense as blocking instant navigation. A side effect is that unknown slugs return status 200 with `noindex` rather than a 404 status. `dynamicParams` isn't available with Cache Components.
  - Stock state comes from `stockStatus()` and `totalStock()` in `catalog.ts` (sold out at 0, low stock at 3 or fewer). Products with `sizes` keep stock per size.
  - After adding a route, run `npx next typegen` before `npm run typecheck`, so that `PageProps<"/route">` exists.
- **Imports:** the `@/*` alias maps to `src/*`.
