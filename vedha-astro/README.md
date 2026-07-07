# Vedha — Astro site

The Vedha agency website, migrated from static HTML (`../vedha-website`) to [Astro](https://astro.build). Pages ship as plain HTML with zero framework JS — the only client script is `src/scripts/main.js` (same interactions as the original site).

## Commands

```bash
npm install      # once
npm run dev      # dev server at localhost:4321
npm run build    # static build into dist/
npm run preview  # preview the production build
```

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
