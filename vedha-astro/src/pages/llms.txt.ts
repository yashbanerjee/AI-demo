import type { APIRoute } from "astro";
import { pillars, slugOf, getAllServices } from "../data/services.js";
import { textHeaders } from "../lib/sitemaps";

export const GET: APIRoute = async ({ site }) => {
  const origin = site?.origin ?? "https://vedha.ae";
  const services = getAllServices();
  const body = `# VEDHA
> Dubai-based technology agency for strategy, product design, software engineering, automation, AI, integrations, cloud, and managed technology services.

Vedha Technologies helps organisations across the UAE clarify technology choices and deliver production systems. Primary contact: info@vedha.ae. Location: Dubai, United Arab Emirates.

## Core pages
- [Home](${origin}/): Company overview, studio, work, services, and contact
- [Services](${origin}/services/): Full service catalogue across ${pillars.length} pillars and ${services.length} named services
- [Products](${origin}/products/): Product offerings
- [Blog](${origin}/blog/): Insights on technology, product, and delivery
- [Contact](${origin}/#contact): Book a consultation

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

## AI / AEO maps
- [Full service catalogue for agents](${origin}/llms-full.txt): Complete markdown map of all ${services.length} services
- [Services JSON](${origin}/services.json): Machine-readable service index
- [XML sitemap index](${origin}/sitemap.xml): Search and crawler discovery
- [Services sitemap](${origin}/sitemap-services.xml): Category and leaf service URLs only

## Optional
- [RSS](${origin}/rss.xml): Blog feed
`;

  return new Response(body, { headers: textHeaders });
};
