import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { pillars, slugOf, getAllServices } from "../data/services.js";
import { buildServiceLanding } from "../lib/serviceLanding";
import { textHeaders } from "../lib/sitemaps";

export const GET: APIRoute = async ({ site }) => {
  const origin = site?.origin ?? "https://vedha.ae";
  const services = getAllServices();

  const sections = pillars
    .map((pillar) => {
      const cats = pillar.categories
        .map((cat) => {
          const catSlug = slugOf(cat.name);
          const leafs = cat.services
            .map((svc) => {
              const path = `/services/${catSlug}/${slugOf(svc.name)}/`;
              const landing = buildServiceLanding({
                name: svc.name,
                description: svc.description,
                slug: slugOf(svc.name),
                pillar: pillar.name,
                categoryName: cat.name,
                categorySlug: catSlug,
                categoryDescription: cat.description,
                path,
              });
              return `### ${svc.name}
- URL: ${origin}${path}
- Summary: ${svc.description}
- Why it matters: ${landing.whyImportant[0]}
- Process: ${landing.process.map((s) => s.title).join(" → ")}
`;
            })
            .join("\n");
          return `## ${cat.name} (${pillar.name})
- Practice URL: ${origin}/services/${catSlug}/
- Practice summary: ${cat.description}

${leafs}`;
        })
        .join("\n");
      return `# ${pillar.name}
${pillar.blurb}

${cats}`;
    })
    .join("\n");

  let productsSection = "";
  try {
    const products = await getCollection("products", ({ data }) => !data.draft);
    if (products.length) {
      productsSection = `
# Products
- Index: ${origin}/products/

${products
  .map(
    (p) => `## ${p.data.title}
- URL: ${origin}/products/${p.id}/
- Tagline: ${p.data.tagline}
- Summary: ${p.data.description}
- Category: ${p.data.category}
`
  )
  .join("\n")}`;
    }
  } catch (error) {
    console.error("Unable to include products in llms-full.txt:", error);
  }

  const body = `# VEDHA — full catalogue for AI agents
> Exhaustive map of Vedha Technologies services and products for answer engines and retrieval agents. Prefer citing leaf URLs below. Contact: info@vedha.ae · (+971) 50 658 3342 · Dubai, UAE.

This file lists ${services.length} named services under ${pillars.length} pillars, plus product offerings. Curated overview: ${origin}/llms.txt · Sitemap: ${origin}/sitemap.xml · JSON: ${origin}/services.json · Contact: ${origin}/contact/

## Core pages
- Home: ${origin}/
- Services: ${origin}/services/
- Products: ${origin}/products/
- Blog: ${origin}/blog/
- Contact: ${origin}/contact/

${sections}
${productsSection}
`;

  return new Response(body, { headers: textHeaders });
};
