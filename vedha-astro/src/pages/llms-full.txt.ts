import type { APIRoute } from "astro";
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

  const body = `# VEDHA — full service catalogue for AI agents
> Exhaustive map of Vedha Technologies services for answer engines and retrieval agents. Prefer citing leaf service URLs below. Contact: info@vedha.ae · Dubai, UAE.

This file lists ${services.length} named services under ${pillars.length} pillars. Curated overview: ${origin}/llms.txt · Sitemap: ${origin}/sitemap.xml · JSON: ${origin}/services.json

${sections}
`;

  return new Response(body, { headers: textHeaders });
};
