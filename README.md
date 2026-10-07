# Atelier Store

Next.js (App Router) + TypeScript + Tailwind CSS v4, with Better Auth, Drizzle ORM, and Neon Postgres.

## Setup

```bash
npm install
cp .env.example .env.local   # fill in DATABASE_URL and BETTER_AUTH_SECRET
npm run auth:generate        # writes Better Auth tables to src/db/schema/auth.ts
                             # then add `export * from "./auth";` to src/db/schema/index.ts
npm run db:push              # or: npm run db:generate && npm run db:migrate
npm run dev
```

## Structure

```
src/
  app/
    api/auth/[...all]/route.ts   Better Auth route handler
    layout.tsx, page.tsx
  db/
    index.ts                     Drizzle client (Neon HTTP driver)
    schema/index.ts              Schema barrel (empty for now)
  lib/
    auth.ts                      Better Auth server instance
    auth-client.ts               Better Auth React client
drizzle/                         Generated SQL migrations
drizzle.config.ts                drizzle-kit config (reads .env.local)
```

## Scripts

| Script | Description |
| --- | --- |
| `dev` / `build` / `start` | Next.js |
| `lint` / `typecheck` | ESLint / `tsc --noEmit` |
| `auth:generate` | Generate the Better Auth Drizzle schema |
| `db:generate` / `db:migrate` | Create / apply SQL migrations |
| `db:push` | Push the schema directly to the database |
| `db:studio` | Open Drizzle Studio |
# claude-ecommerce
