import type { APIRoute } from "astro";
import { getAllCategories, getAllServices, pillars } from "../data/services.js";

export const GET: APIRoute = async ({ site }) => {
  const origin = site?.origin ?? "https://vedha.ae";
  const categories = getAllCategories();
  const services = getAllServices();

  const payload = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "VEDHA services",
    description:
      "Machine-readable catalogue of Vedha Technologies service pillars, practices, and leaf services for AI agents and answer engines.",
    url: `${origin}/services/`,
    numberOfItems: services.length,
    provider: {
      "@type": "Organization",
      name: "Vedha Technologies",
      url: origin,
      email: "info@vedha.ae",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Dubai",
        addressCountry: "AE",
      },
    },
    maps: {
      llmsTxt: `${origin}/llms.txt`,
      llmsFullTxt: `${origin}/llms-full.txt`,
      sitemapIndex: `${origin}/sitemap.xml`,
      servicesSitemap: `${origin}/sitemap-services.xml`,
    },
    pillars: pillars.map((p) => ({
      name: p.name,
      blurb: p.blurb,
      categories: p.categories.map((c) => c.name),
    })),
    categories: categories.map((c) => ({
      name: c.name,
      slug: c.slug,
      pillar: c.pillar,
      url: `${origin}/services/${c.slug}/`,
      serviceCount: c.services.length,
    })),
    services: services.map((s) => ({
      name: s.name,
      slug: s.slug,
      description: s.description,
      pillar: s.pillar,
      category: s.categoryName,
      categorySlug: s.categorySlug,
      url: `${origin}${s.path}`,
    })),
  };

  return new Response(JSON.stringify(payload, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
