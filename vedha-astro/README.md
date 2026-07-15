# Vedha — Astro site

The Vedha agency website, migrated from static HTML (`../vedha-website`) to [Astro](https://astro.build). Pages ship as plain HTML with zero framework JS — the only client script is `src/scripts/main.js` (same interactions as the original site).

## Commands

```bash
npm install      # once
cp .env.example .env   # once — then set ADMIN_PASSWORD and SESSION_SECRET
npm run db:start # start local Postgres (keep running in its own terminal)
npm run dev      # dev server at localhost:4321
npm run build    # SSR build into dist/
npm run start    # run the production server (dist/server/entry.mjs)
```

## Admin panel & database

The blog and per-page SEO settings are managed from **`/admin`** (password login,
set via `ADMIN_PASSWORD` in `.env`). Content lives in Postgres:

- `posts` — blog posts (markdown content, tags, cover image, draft flag)
- `page_seo` — per-page overrides for title / meta description / OG image
- `media` — images uploaded from the admin, served at `/media/<filename>`

Locally, `npm run db:start` runs an embedded Postgres on port 5433 (data in
`data/pg/`, git-ignored). In production point `DATABASE_URL` at any managed
Postgres (Neon, Supabase, RDS, ...). On first run with an empty database the
app seeds the `posts` table from the markdown files in `src/content/blog/`.

SEO plumbing: `/sitemap.xml` and `/rss.xml` are generated from the database on
request, `robots.txt` blocks `/admin` and `/api`, and every page carries
canonical URLs, Open Graph / Twitter tags, and JSON-LD structured data
(`Organization` site-wide, `BlogPosting` on posts).

## Structure

```
src/
  layouts/BaseLayout.astro   # <head>, preloader, header, menu, footer — shared by every page
  components/
    Header.astro, Footer.astro, MenuOverlay.astro, Preloader.astro
    home/                    # homepage sections (Hero, Work, Studio, ...)
  pages/
    index.astro              # homepage — composes the home/ sections
    products/index.astro     # product listing (auto-generated from the collection)
    products/[slug].astro    # product detail template
  content/products/*.md      # one markdown file per product
  styles/global.css          # ported from vedha-website/mono.css
  scripts/main.js            # ported from vedha-website/mono.js (page-safe)
```

## Adding a product page

Drop a markdown file into `src/content/products/`, e.g. `my-product.md`:

```md
---
title: "My Product"
tagline: "One-line pitch."
description: "Used for meta description and the sidebar card."
category: "Web Development"
image: "https://example.com/cover.jpg"
price: "From $3,000"        # optional
timeline: "2–3 weeks"       # optional
features:
  - "Feature one"
  - "Feature two"
order: 3                    # sort position on the listing page
---

Long-form body content in markdown...
```

That's it — the page appears at `/products/my-product/` and on the `/products/` listing automatically. The frontmatter is validated against the schema in `src/content.config.ts`.
