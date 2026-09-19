/**
 * Service category cover images (from Downloads service pack).
 * Filenames match category slugs under /images/services/.
 */
export const categoryCovers: Record<string, string> = {
  "enterprise-software": "/images/services/enterprise-software.png",
  "erp-solutions": "/images/services/erp-solutions.png",
  "saas-product-development": "/images/services/saas-product-development.png",
  "web-application-development": "/images/services/web-application-development.png",
  "mobile-application-development": "/images/services/mobile-application-development.png",
  "website-design-development": "/images/services/website-design-development.png",
  "e-commerce-solutions": "/images/services/e-commerce-solutions.png",
  "technology-consulting-strategy": "/images/services/technology-consulting-strategy.png",
  "ux-ui-product-design": "/images/services/ux-ui-product-design.png",
  "brand-identity": "/images/services/brand-identity.png",
  "business-automation": "/images/services/business-automation.png",
  "crm-sales-systems": "/images/services/crm-sales-systems.png",
  "marketing-technology": "/images/services/marketing-technology.png",
  "ai-solutions": "/images/services/ai-solutions.png",
  "data-business-intelligence": "/images/services/data-business-intelligence.png",
  "api-systems-integration": "/images/services/api-systems-integration.png",
  "search-ai-visibility": "/images/services/search-ai-visibility.png",
  "cloud-devops-infrastructure": "/images/services/cloud-devops-infrastructure.png",
  "cybersecurity-compliance": "/images/services/cybersecurity-compliance.png",
  "software-quality-assurance": "/images/services/software-quality-assurance.png",
  "legacy-system-modernisation": "/images/services/legacy-system-modernisation.png",
  "managed-technology-services": "/images/services/managed-technology-services.png",
  "dedicated-technology-teams": "/images/services/dedicated-technology-teams.png",
  "training-adoption-documentation": "/images/services/training-adoption-documentation.png",
};

/**
 * Fallback covers for posts without an uploaded image.
 * The slug hash keeps each post's cover stable across the homepage,
 * blog index, and article page while spreading posts over the pool.
 */
const covers = [
  "/images/photo-lake-reflection.jpg",
  "/images/photo-moraine-lake.jpg",
  "/images/photo-mountain-mist.jpg",
  "/images/photo-waterfall.jpg",
  "/images/photo-cliff-coast.jpg",
  "/images/photo-alpine-glow.jpg",
  "/images/photo-forest-light.jpg",
  "/images/photo-blue-lake.jpg",
  "/images/photo-lake-jetty.jpg",
];

const hash = (s: string) =>
  [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 0);

export function coverFor(slug: string, image: string | null): string {
  if (image) return image;
  if (categoryCovers[slug]) return categoryCovers[slug];
  return covers[hash(slug) % covers.length];
}

/** Cover for a service practice / leaf page — prefers category pack image. */
export function serviceCoverFor(categorySlug: string, servicePath?: string): string {
  if (categoryCovers[categorySlug]) return categoryCovers[categorySlug];
  return coverFor(servicePath || categorySlug, null);
}
