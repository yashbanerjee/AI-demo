import { getCollection } from "astro:content";
import { getAllCategories, getAllServices } from "../data/services.js";
import { listPosts, type Post } from "./db";

export type UrlEntry = {
  loc: string;
  lastmod?: string;
  changefreq?: string;
  priority?: string;
};

const xmlEscape = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export const abs = (site: URL, path: string) => new URL(path, site).toString();

export const urlset = (urls: UrlEntry[]) => `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map((u) => {
    const parts = [`    <loc>${xmlEscape(u.loc)}</loc>`];
    if (u.lastmod) parts.push(`    <lastmod>${u.lastmod}</lastmod>`);
    if (u.changefreq) parts.push(`    <changefreq>${u.changefreq}</changefreq>`);
    if (u.priority) parts.push(`    <priority>${u.priority}</priority>`);
    return `  <url>\n${parts.join("\n")}\n  </url>`;
  })
  .join("\n")}
</urlset>`;

export const sitemapIndex = (site: URL, now = new Date().toISOString()) =>
  `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${abs(site, "/sitemap-pages.xml")}</loc>
    <lastmod>${now}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${abs(site, "/sitemap-services.xml")}</loc>
    <lastmod>${now}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${abs(site, "/sitemap-products.xml")}</loc>
    <lastmod>${now}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${abs(site, "/sitemap-blog.xml")}</loc>
    <lastmod>${now}</lastmod>
  </sitemap>
</sitemapindex>`;

async function safePosts(): Promise<Post[]> {
  try {
    return await listPosts();
  } catch (error) {
    console.error("Unable to include blog posts in sitemap:", error);
    return [];
  }
}

export function buildPagesSitemap(site: URL) {
  return urlset([
    { loc: abs(site, "/"), changefreq: "weekly", priority: "1.0" },
    { loc: abs(site, "/services/"), changefreq: "weekly", priority: "0.9" },
    { loc: abs(site, "/products/"), changefreq: "weekly", priority: "0.7" },
    { loc: abs(site, "/blog/"), changefreq: "daily", priority: "0.8" },
    { loc: abs(site, "/llms.txt"), changefreq: "weekly", priority: "0.3" },
    { loc: abs(site, "/llms-full.txt"), changefreq: "weekly", priority: "0.3" },
  ]);
}

export function buildServicesSitemap(site: URL) {
  const categories = getAllCategories();
  const services = getAllServices();
  return urlset([
    ...categories.map((c) => ({
      loc: abs(site, `/services/${c.slug}/`),
      changefreq: "weekly",
      priority: "0.8",
    })),
    ...services.map((s) => ({
      loc: abs(site, s.path),
      changefreq: "monthly",
      priority: "0.7",
    })),
  ]);
}

export async function buildProductsSitemap(site: URL) {
  const products = await getCollection("products", ({ data }) => !data.draft);
  return urlset(
    products.map((p) => ({
      loc: abs(site, `/products/${p.id}/`),
      changefreq: "monthly",
      priority: "0.6",
    }))
  );
}

export async function buildBlogSitemap(site: URL) {
  const posts = await safePosts();
  return urlset(
    posts.map((p) => ({
      loc: abs(site, `/blog/${p.slug}/`),
      lastmod: (p.updated_date ?? p.pub_date).toISOString(),
      changefreq: "monthly",
      priority: "0.6",
    }))
  );
}

export const xmlHeaders = {
  "Content-Type": "application/xml; charset=utf-8",
  "Cache-Control": "public, max-age=3600",
};

export const textHeaders = {
  "Content-Type": "text/plain; charset=utf-8",
  "Cache-Control": "public, max-age=3600",
};
