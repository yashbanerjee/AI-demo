import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { pillars, slugOf, getAllServices } from "../data/services.js";
import { listPosts } from "../lib/db";
import { textHeaders } from "../lib/sitemaps";

export const GET: APIRoute = async ({ site }) => {
  const origin = site?.origin ?? "https://vedha.ae";
  const services = getAllServices();

  let products: { id: string; title: string; description: string }[] = [];
  try {
    const collection = await getCollection("products", ({ data }) => !data.draft);
    products = collection.map((p) => ({
      id: p.id,
      title: p.data.title,
      description: p.data.description,
    }));
  } catch (error) {
    console.error("Unable to include products in llms.txt:", error);
  }

  let posts: { slug: string; title: string }[] = [];
  try {
    const list = await listPosts();
    posts = list.slice(0, 12).map((p) => ({ slug: p.slug, title: p.title }));
  } catch (error) {
    console.error("Unable to include blog posts in llms.txt:", error);
  }

  const body = `# VEDHA
> Dubai-based technology agency for strategy, product design, software engineering, automation, AI, integrations, cloud, and managed technology services.

Vedha Technologies helps organisations across the UAE clarify technology choices and deliver production systems. Primary contact: info@vedha.ae. Phone: (+971) 50 658 3342. Location: Dubai, United Arab Emirates.

## Core pages
- [Home](${origin}/): Company overview, studio, work, services, and contact
- [Services](${origin}/services/): Full service catalogue across ${pillars.length} pillars and ${services.length} named services
- [Products](${origin}/products/): Product offerings
- [Blog](${origin}/blog/): Insights on technology, product, and delivery
- [Contact](${origin}/contact/): Enquiry form and consultation booking

## Products
${
  products.length
    ? products
        .map(
          (p) =>
            `- [${p.title}](${origin}/products/${p.id}/): ${p.description}`
        )
        .join("\n")
    : `- [Products index](${origin}/products/): Vedha product offerings`
}

## Service pillars
${pillars
  .map((p) => {
    const id = `pillar-${slugOf(p.name)}`;
    return `- [${p.name}](${origin}/services/#${id}): ${p.blurb}`;
  })
  .join("\n")}

## Featured practices
${pillars
  .flatMap((p) =>
    p.categories.slice(0, 2).map((c) => {
      const slug = slugOf(c.name);
      return `- [${c.name}](${origin}/services/${slug}/): ${c.services.length} services in ${p.name}`;
    })
  )
  .slice(0, 12)
  .join("\n")}

## Example service pages
- [ERP consulting](${origin}/services/erp-solutions/erp-consulting/): Advisory on ERP scope and platform fit
- [Construction ERP](${origin}/services/erp-solutions/construction-erp/): ERP for project costing and site operations
- [Digital transformation strategy](${origin}/services/technology-consulting-strategy/digital-transformation-strategy/): Board-ready technology change plans

## Recent blog posts
${
  posts.length
    ? posts
        .map((p) => `- [${p.title}](${origin}/blog/${p.slug}/)`)
        .join("\n")
    : `- [Blog](${origin}/blog/): Latest insights from the Vedha team`
}

## AI / AEO maps
- [Full service catalogue for agents](${origin}/llms-full.txt): Complete markdown map of all ${services.length} services plus products
- [Services JSON](${origin}/services.json): Machine-readable service index
- [XML sitemap index](${origin}/sitemap.xml): Search and crawler discovery
- [Services sitemap](${origin}/sitemap-services.xml): Category and leaf service URLs only
- [Products sitemap](${origin}/sitemap-products.xml): Product detail URLs
- [Blog sitemap](${origin}/sitemap-blog.xml): Published article URLs

## Optional
- [RSS](${origin}/rss.xml): Blog feed
`;

  return new Response(body, { headers: textHeaders });
};
