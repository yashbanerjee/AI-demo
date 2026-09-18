/**
 * Cost estimator catalog — fixed AED starter prices for UAE website projects.
 * Seed catalog for first run. After that, edit in /admin/estimator.
 */

export type AddonGroup =
  | "commerce"
  | "integrations"
  | "growth"
  | "content"
  | "platform"
  | "ops";

export type EstimatorBase = {
  id: string;
  name: string;
  description: string;
  priceAed: number;
  image: string;
  /** Typical delivery window for the base alone (weeks). */
  weeksMin: number;
  weeksMax: number;
};

export type EstimatorAddon = {
  id: string;
  name: string;
  description: string;
  priceAed: number;
  group: AddonGroup;
  image: string;
  /** Extra weeks added to the delivery estimate when selected. */
  weeksExtra: number;
  popular?: boolean;
};

export const ADDON_GROUPS: { id: AddonGroup | "all" | "recommended" | "popular"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "recommended", label: "Recommended" },
  { id: "popular", label: "Popular" },
  { id: "commerce", label: "Commerce" },
  { id: "integrations", label: "Integrations" },
  { id: "growth", label: "Growth" },
  { id: "content", label: "Content" },
  { id: "platform", label: "Platform" },
  { id: "ops", label: "Ops" },
];

/** Longer package blurbs for the SEO section below the calculator. */
export const estimatorBaseSeo: Record<string, string> = {
  "landing-page":
    "Focused one-page site for campaigns, offers and enquiry or booking flows.",
  "corporate-website":
    "Multi-page company site with services, about, blog-ready structure and enquiry flows for UAE businesses.",
  "portfolio-site":
    "Work-led site for studios and agencies with case studies, services and a polished brand presence.",
  "blog-content-site":
    "Editorial website with categories, search and SEO-ready article templates for regular publishing.",
  "ecommerce-store":
    "Online store with product pages, cart, checkout foundations and an admin-ready catalogue structure.",
  marketplace:
    "Multi-seller platform with listings, vendor profiles and buyer journeys built to scale.",
  "booking-site":
    "Service website with scheduling, service menus and confirmation-ready booking flows.",
  "membership-portal":
    "Member area with gated content or dashboards, account access and a public-facing website.",
  "multilingual-corporate":
    "Corporate website for Arabic, English or multilingual audiences with language switching and localised pages.",
  "custom-web-app":
    "Bespoke web application for workflows standard tools cannot cover, with defined modules, roles and data.",
};

/** Module blurbs featured below the calculator (order preserved). */
export const estimatorAddonSeo: { id: string; name: string; description: string }[] = [
  {
    id: "payment-gateway",
    name: "Payment gateway",
    description:
      "Card and local payment methods connected to checkout or invoicing with secure confirmation flows.",
  },
  {
    id: "shipping-logistics",
    name: "Shipping / logistics integration",
    description:
      "Connect courier and last-mile partners for rates, tracking and fulfilment updates.",
  },
  {
    id: "product-catalog",
    name: "Product catalogue",
    description:
      "Structured catalogue with variants, filters, search and merchandising controls for your team.",
  },
  {
    id: "loyalty-platform",
    name: "Loyalty platform",
    description:
      "Points, tiers and rewards that encourage repeat purchases and help measure retention.",
  },
  {
    id: "third-party-api",
    name: "Third-party API integration",
    description:
      "Connect an external ERP, booking engine, data provider or custom API securely.",
  },
  {
    id: "crm-integration",
    name: "CRM integration",
    description:
      "Send leads and customer events to HubSpot, Salesforce, Zoho or your CRM of choice.",
  },
  {
    id: "whatsapp-business",
    name: "WhatsApp Business",
    description:
      "Click-to-chat, enquiry routing and optional notifications through WhatsApp Business.",
  },
  {
    id: "booking-engine",
    name: "Booking engine",
    description:
      "Calendars, availability and confirmation flows for appointments, tables or resources.",
  },
  {
    id: "ads-pixels",
    name: "Google Ads and Meta Ads pixels",
    description:
      "Tracking pixels, conversion events and remarketing foundations for paid campaigns.",
  },
  {
    id: "seo-setup",
    name: "SEO setup",
    description:
      "Technical SEO foundations including metadata, sitemaps, structured data and on-page templates.",
  },
  {
    id: "analytics-ga4",
    name: "Analytics, GA4",
    description:
      "GA4 setup, key events and a clearer view of how visitors move through the site.",
  },
  {
    id: "content-writing",
    name: "Content writing",
    description:
      "Professional copy for key pages, including positioning, services and conversion-focused messaging.",
  },
  {
    id: "multilingual",
    name: "Multilingual, Arabic / English",
    description:
      "Language structure, switching and page layouts for Arabic and English experiences.",
  },
  {
    id: "cms-admin",
    name: "CMS / admin panel",
    description:
      "Editable pages, posts and media so your team can update the site without a developer.",
  },
];

export const estimatorBases: EstimatorBase[] = [
  {
    id: "landing-page",
    name: "Landing page",
    description: "A focused one-page site for campaigns, launches and enquiries.",
    priceAed: 10000,
    image: "/images/photo-lake-jetty.jpg",
    weeksMin: 2,
    weeksMax: 4,
  },
  {
    id: "corporate-website",
    name: "Corporate website",
    description: "A professional website for your business, services and enquiries.",
    priceAed: 22000,
    image: "/images/photo-dubai-marina.jpg",
    weeksMin: 4,
    weeksMax: 6,
  },
  {
    id: "portfolio-site",
    name: "Portfolio / agency site",
    description: "A visual site for agencies, studios and creative businesses.",
    priceAed: 18000,
    image: "/images/photo-canyon-ridge.jpg",
    weeksMin: 3,
    weeksMax: 5,
  },
  {
    id: "blog-content-site",
    name: "Blog / content site",
    description: "A content-led site for publishing articles, insights and updates.",
    priceAed: 16000,
    image: "/images/photo-forest-light.jpg",
    weeksMin: 3,
    weeksMax: 5,
  },
  {
    id: "ecommerce-store",
    name: "Ecommerce store",
    description: "An online store for products, payments and customer orders.",
    priceAed: 45000,
    image: "/images/photo-blue-lake.jpg",
    weeksMin: 6,
    weeksMax: 10,
  },
  {
    id: "marketplace",
    name: "Marketplace",
    description: "A platform connecting multiple sellers with customers online.",
    priceAed: 85000,
    image: "/images/photo-dubai-aerial.jpg",
    weeksMin: 10,
    weeksMax: 16,
  },
  {
    id: "booking-site",
    name: "Booking / appointments site",
    description: "A website for services, scheduling and customer bookings.",
    priceAed: 28000,
    image: "/images/photo-alpine-glow.jpg",
    weeksMin: 5,
    weeksMax: 8,
  },
  {
    id: "membership-portal",
    name: "Membership / portal",
    description: "A secure member area for accounts, content and customer access.",
    priceAed: 38000,
    image: "/images/photo-moon-peaks.jpg",
    weeksMin: 6,
    weeksMax: 10,
  },
  {
    id: "multilingual-corporate",
    name: "Multilingual corporate",
    description: "A bilingual website for businesses serving regional audiences.",
    priceAed: 32000,
    image: "/images/photo-ridge-mist.jpg",
    weeksMin: 5,
    weeksMax: 8,
  },
  {
    id: "custom-web-app",
    name: "Custom web application",
    description: "A tailored web application for your business workflows.",
    priceAed: 65000,
    image: "/images/hero-slide-interchange.jpg",
    weeksMin: 8,
    weeksMax: 14,
  },
];
const addonImages = [
  "/images/photo-moraine-lake.jpg",
  "/images/photo-waterfall.jpg",
  "/images/photo-cliff-coast.jpg",
  "/images/photo-misty-forest.jpg",
  "/images/photo-vermilion-lake.jpg",
  "/images/photo-starry-peaks.jpg",
  "/images/photo-skogafoss.jpg",
  "/images/photo-summit-dusk.jpg",
  "/images/photo-moonlit-jetty.jpg",
  "/images/photo-lake-reflection.jpg",
  "/images/photo-mountain-mist.jpg",
  "/images/hero-slide-city.jpg",
  "/images/hero-slide-fields.jpg",
  "/images/hero-slide-mountains.jpg",
];

export const estimatorAddons: EstimatorAddon[] = [
  {
    id: "payment-gateway",
    name: "Payment gateway",
    description:
      "Card and local payment methods connected to checkout or invoicing with secure confirmation flows.",
    priceAed: 6500,
    group: "commerce",
    image: addonImages[0],
    weeksExtra: 1,
    popular: true,
  },
  {
    id: "shipping-logistics",
    name: "Shipping / logistics integration",
    description:
      "Connect courier and last-mile partners for rates, tracking and fulfilment updates.",
    priceAed: 7500,
    group: "commerce",
    image: addonImages[1],
    weeksExtra: 1,
    popular: true,
  },
  {
    id: "product-catalog",
    name: "Product catalogue",
    description:
      "Structured catalogue with variants, filters, search and merchandising controls for your team.",
    priceAed: 9000,
    group: "commerce",
    image: addonImages[2],
    weeksExtra: 1,
    popular: true,
  },
  {
    id: "inventory",
    name: "Inventory management",
    description: "Stock levels, low-stock alerts, and sync-ready inventory states across channels.",
    priceAed: 8500,
    group: "commerce",
    image: addonImages[3],
    weeksExtra: 1,
  },
  {
    id: "loyalty-platform",
    name: "Loyalty platform",
    description:
      "Points, tiers and rewards that encourage repeat purchases and help measure retention.",
    priceAed: 12000,
    group: "commerce",
    image: addonImages[4],
    weeksExtra: 2,
    popular: true,
  },
  {
    id: "subscriptions-billing",
    name: "Subscriptions / recurring billing",
    description: "Plans, renewals, and recurring payment handling for membership or SaaS-style offers.",
    priceAed: 11000,
    group: "commerce",
    image: addonImages[5],
    weeksExtra: 2,
  },
  {
    id: "wishlist",
    name: "Wishlist",
    description: "Save-for-later lists that keep shoppers engaged and give you remarketing signals.",
    priceAed: 2500,
    group: "commerce",
    image: addonImages[6],
    weeksExtra: 0,
  },
  {
    id: "reviews-ratings",
    name: "Reviews & ratings",
    description: "Collect and display customer reviews to build trust on product and service pages.",
    priceAed: 3500,
    group: "commerce",
    image: addonImages[7],
    weeksExtra: 0,
  },
  {
    id: "multi-vendor",
    name: "Multi-vendor module",
    description: "Vendor onboarding, listings, and split commerce flows for marketplace-style operations.",
    priceAed: 18000,
    group: "commerce",
    image: addonImages[8],
    weeksExtra: 3,
  },
  {
    id: "third-party-api",
    name: "Third-party API integration",
    description:
      "Connect an external ERP, booking engine, data provider or custom API securely.",
    priceAed: 8000,
    group: "integrations",
    image: addonImages[9],
    weeksExtra: 1,
    popular: true,
  },
  {
    id: "crm-integration",
    name: "CRM integration",
    description:
      "Send leads and customer events to HubSpot, Salesforce, Zoho or your CRM of choice.",
    priceAed: 5500,
    group: "integrations",
    image: addonImages[10],
    weeksExtra: 1,
    popular: true,
  },
  {
    id: "whatsapp-business",
    name: "WhatsApp Business",
    description:
      "Click-to-chat, enquiry routing and optional notifications through WhatsApp Business.",
    priceAed: 3500,
    group: "integrations",
    image: addonImages[11],
    weeksExtra: 0,
    popular: true,
  },
  {
    id: "email-marketing",
    name: "Email marketing integration",
    description: "Connect Klaviyo, Mailchimp, or similar for lists, automations, and campaign triggers.",
    priceAed: 4000,
    group: "integrations",
    image: addonImages[12],
    weeksExtra: 0,
  },
  {
    id: "booking-engine",
    name: "Booking engine",
    description:
      "Calendars, availability and confirmation flows for appointments, tables or resources.",
    priceAed: 9500,
    group: "integrations",
    image: addonImages[13],
    weeksExtra: 2,
    popular: true,
  },
  {
    id: "live-chat",
    name: "Live chat",
    description: "On-site chat widget with handoff-ready setup so visitors can reach your team instantly.",
    priceAed: 2500,
    group: "integrations",
    image: addonImages[0],
    weeksExtra: 0,
  },
  {
    id: "ads-pixels",
    name: "Google Ads and Meta Ads pixels",
    description:
      "Tracking pixels, conversion events and remarketing foundations for paid campaigns.",
    priceAed: 3000,
    group: "growth",
    image: addonImages[1],
    weeksExtra: 0,
    popular: true,
  },
  {
    id: "seo-setup",
    name: "SEO setup",
    description:
      "Technical SEO foundations including metadata, sitemaps, structured data and on-page templates.",
    priceAed: 4500,
    group: "growth",
    image: addonImages[2],
    weeksExtra: 0,
    popular: true,
  },
  {
    id: "analytics-ga4",
    name: "Analytics, GA4",
    description:
      "GA4 setup, key events and a clearer view of how visitors move through the site.",
    priceAed: 2500,
    group: "growth",
    image: addonImages[3],
    weeksExtra: 0,
    popular: true,
  },
  {
    id: "content-writing",
    name: "Content writing",
    description:
      "Professional copy for key pages, including positioning, services and conversion-focused messaging.",
    priceAed: 5000,
    group: "content",
    image: addonImages[4],
    weeksExtra: 1,
    popular: true,
  },
  {
    id: "multilingual",
    name: "Multilingual, Arabic / English",
    description:
      "Language structure, switching and page layouts for Arabic and English experiences.",
    priceAed: 9000,
    group: "content",
    image: addonImages[5],
    weeksExtra: 2,
    popular: true,
  },
  {
    id: "cms-admin",
    name: "CMS / admin panel",
    description:
      "Editable pages, posts and media so your team can update the site without a developer.",
    priceAed: 7500,
    group: "platform",
    image: addonImages[6],
    weeksExtra: 1,
    popular: true,
  },
  {
    id: "auth-accounts",
    name: "User accounts / auth",
    description: "Secure sign-up, login, and account areas for members, customers, or internal users.",
    priceAed: 8500,
    group: "platform",
    image: addonImages[7],
    weeksExtra: 1,
  },
  {
    id: "design-system",
    name: "Custom design system",
    description: "Reusable UI components, tokens, and patterns so the product stays consistent as it grows.",
    priceAed: 10000,
    group: "platform",
    image: addonImages[8],
    weeksExtra: 2,
  },
  {
    id: "perf-security",
    name: "Performance & security hardening",
    description: "Speed, caching, HTTPS, hardening baselines, and production readiness checks before launch.",
    priceAed: 5500,
    group: "ops",
    image: addonImages[9],
    weeksExtra: 1,
  },
  {
    id: "training-handover",
    name: "Training & handover",
    description: "Team walkthrough, documentation, and a clean handover so you can run the site confidently.",
    priceAed: 3000,
    group: "ops",
    image: addonImages[10],
    weeksExtra: 0,
  },
];

/** Recommended addon ids per base — surfaced first after a base is selected. */
export const recommendedByBase: Record<string, string[]> = {
  "landing-page": ["seo-setup", "ads-pixels", "analytics-ga4", "whatsapp-business", "content-writing", "crm-integration"],
  "corporate-website": ["cms-admin", "seo-setup", "content-writing", "whatsapp-business", "analytics-ga4", "crm-integration", "multilingual"],
  "portfolio-site": ["cms-admin", "seo-setup", "content-writing", "analytics-ga4", "whatsapp-business"],
  "blog-content-site": ["cms-admin", "seo-setup", "analytics-ga4", "content-writing", "email-marketing", "multilingual"],
  "ecommerce-store": [
    "payment-gateway",
    "product-catalog",
    "shipping-logistics",
    "loyalty-platform",
    "ads-pixels",
    "seo-setup",
    "analytics-ga4",
    "cms-admin",
    "inventory",
  ],
  marketplace: [
    "multi-vendor",
    "payment-gateway",
    "product-catalog",
    "auth-accounts",
    "shipping-logistics",
    "reviews-ratings",
    "cms-admin",
    "seo-setup",
  ],
  "booking-site": [
    "booking-engine",
    "payment-gateway",
    "whatsapp-business",
    "crm-integration",
    "seo-setup",
    "analytics-ga4",
    "content-writing",
  ],
  "membership-portal": [
    "auth-accounts",
    "subscriptions-billing",
    "payment-gateway",
    "cms-admin",
    "email-marketing",
    "analytics-ga4",
  ],
  "multilingual-corporate": [
    "multilingual",
    "cms-admin",
    "seo-setup",
    "content-writing",
    "whatsapp-business",
    "analytics-ga4",
    "crm-integration",
  ],
  "custom-web-app": [
    "auth-accounts",
    "cms-admin",
    "third-party-api",
    "crm-integration",
    "perf-security",
    "design-system",
    "training-handover",
  ],
};

export function formatAed(amount: number): string {
  return `AED ${amount.toLocaleString("en-AE")}`;
}

export function formatWeeks(min: number, max: number): string {
  if (min === max) return `${min} week${min === 1 ? "" : "s"}`;
  return `${min}–${max} weeks`;
}

export function estimateDelivery(
  base: EstimatorBase | undefined,
  addons: EstimatorAddon[]
): { weeksMin: number; weeksMax: number; label: string } {
  if (!base) return { weeksMin: 0, weeksMax: 0, label: "—" };
  const extra = addons.reduce((sum, a) => sum + (a.weeksExtra || 0), 0);
  const weeksMin = base.weeksMin + Math.floor(extra * 0.5);
  const weeksMax = base.weeksMax + extra;
  return { weeksMin, weeksMax, label: formatWeeks(weeksMin, weeksMax) };
}

export function getBase(id: string): EstimatorBase | undefined {
  return estimatorBases.find((b) => b.id === id);
}

export function getAddon(id: string): EstimatorAddon | undefined {
  return estimatorAddons.find((a) => a.id === id);
}
