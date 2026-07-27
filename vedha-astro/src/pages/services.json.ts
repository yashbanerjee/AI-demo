import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { getAllCategories, getAllServices, pillars } from "../data/services.js";

export const GET: APIRoute = async ({ site }) => {
  const origin = site?.origin ?? "https://vedha.ae";
  const categories = getAllCategories();
  const services = getAllServices();

  let products: {
    id: string;
    title: string;
    description: string;
    category: string;
    url: string;
  }[] = [];
  try {
    const collection = await getCollection("products", ({ data }) => !data.draft);
    products = collection.map((p) => ({
      id: p.id,
      title: p.data.title,
      description: p.data.description,
      category: p.data.category,
      url: `${origin}/products/${p.id}/`,
    }));
  } catch (error) {
    console.error("Unable to include products in services.json:", error);
  }

  const payload = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "VEDHA services",
    description:
      "Machine-readable catalogue of Vedha Technologies service pillars, practices, leaf services, and products for AI agents and answer engines.",
    url: `${origin}/services/`,
    numberOfItems: services.length,
    provider: {
      "@type": "Organization",
      name: "Vedha Technologies",
      url: origin,
      email: "info@vedha.ae",
      telephone: "+971506583342",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Dubai",
        addressCountry: "AE",
      },
    },
    pages: {
      home: `${origin}/`,
      services: `${origin}/services/`,
      products: `${origin}/products/`,
      blog: `${origin}/blog/`,
      contact: `${origin}/contact/`,
    },
    maps: {
      llmsTxt: `${origin}/llms.txt`,
      llmsFullTxt: `${origin}/llms-full.txt`,
      sitemapIndex: `${origin}/sitemap.xml`,
      servicesSitemap: `${origin}/sitemap-services.xml`,
      productsSitemap: `${origin}/sitemap-products.xml`,
      blogSitemap: `${origin}/sitemap-blog.xml`,
      pagesSitemap: `${origin}/sitemap-pages.xml`,
      rss: `${origin}/rss.xml`,
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
    products,
  };

  return new Response(JSON.stringify(payload, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
