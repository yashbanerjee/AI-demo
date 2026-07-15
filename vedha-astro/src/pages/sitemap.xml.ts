import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { listPosts } from "../lib/db";

export const GET: APIRoute = async ({ site }) => {
  const staticPaths = ["/", "/products/", "/blog/"];
  const products = await getCollection("products", ({ data }) => !data.draft);
  const posts = await listPosts();

  const urls = [
    ...staticPaths.map((p) => ({ loc: p })),
    ...products.map((p) => ({ loc: `/products/${p.id}/` })),
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
