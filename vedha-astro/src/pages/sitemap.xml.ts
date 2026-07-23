import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { getAllCategories, getAllServices } from "../data/services.js";
import { listPosts, type Post } from "../lib/db";

export const GET: APIRoute = async ({ site }) => {
  if (!site) {
    return new Response("Site URL is not configured.", { status: 500 });
  }
  const staticPaths = ["/", "/products/", "/services/", "/blog/"];
  const products = await getCollection("products", ({ data }) => !data.draft);
  const categories = getAllCategories();
  const services = getAllServices();
  let posts: Post[] = [];
  try {
    posts = await listPosts();
  } catch (error) {
    console.error("Unable to include blog posts in sitemap:", error);
  }

  const urls = [
    ...staticPaths.map((p) => ({ loc: p })),
    ...products.map((p) => ({ loc: `/products/${p.id}/` })),
    ...categories.map((c) => ({ loc: `/services/${c.slug}/` })),
    ...services.map((s) => ({ loc: s.path })),
    ...posts.map((p) => ({
      loc: `/blog/${p.slug}/`,
      lastmod: (p.updated_date ?? p.pub_date).toISOString(),
    })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) =>
      `  <url><loc>${new URL(u.loc, site).toString()}</loc>${
        "lastmod" in u && u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ""
      }</url>`
  )
  .join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
};
