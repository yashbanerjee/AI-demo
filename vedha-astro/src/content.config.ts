import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const products = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/products" }),
  schema: z.object({
    title: z.string(),
    tagline: z.string(),
    description: z.string(),
    category: z.string(),
    image: z.string(),
    price: z.string().optional(),
    timeline: z.string().optional(),
    features: z.array(z.string()).default([]),
    order: z.number().default(99),
    draft: z.boolean().default(false),
  }),
});

// Blog posts now live in Postgres (see src/lib/db.ts). The markdown files in
// src/content/blog are kept only as the one-time seed for a fresh database.
export const collections = { products };
