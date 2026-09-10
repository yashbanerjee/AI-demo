const siteUrl = "https://vedha.ae";

export const absoluteUrl = (path: string) =>
  new URL(path, siteUrl).toString();

export const breadcrumbSchema = (
  items: Array<{ name: string; path: string }>,
) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: absoluteUrl(item.path),
  })),
});

export const serviceSchema = ({
  name,
  description,
  path,
  services,
}: {
  name: string;
  description: string;
  path: string;
  services?: Array<{ name: string; description: string }>;
}) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  name,
  description,
  url: absoluteUrl(path),
  provider: {
    "@type": "Organization",
    name: "Vedha Technologies",
    url: siteUrl,
  },
  areaServed: [
    { "@type": "City", name: "Dubai" },
    { "@type": "Country", name: "United Arab Emirates" },
  ],
  ...(services?.length
    ? {
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: `${name} services`,
          itemListElement: services.map((service) => ({
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: service.name,
              description: service.description,
            },
          })),
        },
      }
    : {}),
});

export const leafServiceSchema = ({
  name,
  description,
  path,
  category,
  image,
}: {
  name: string;
  description: string;
  path: string;
  category: string;
  image?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  name,
  description,
  url: absoluteUrl(path),
  category,
  ...(image ? { image: absoluteUrl(image) } : {}),
  provider: {
    "@type": "Organization",
    name: "Vedha Technologies",
    url: siteUrl,
  },
  areaServed: [
    { "@type": "City", name: "Dubai" },
    { "@type": "Country", name: "United Arab Emirates" },
  ],
  offers: {
    "@type": "Offer",
    availability: "https://schema.org/InStock",
    url: absoluteUrl(path),
  },
});

export const faqPageSchema = (
  questions: Array<{ question: string; answer: string }>,
) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: questions.map(({ question, answer }) => ({
    "@type": "Question",
    name: question,
    acceptedAnswer: {
      "@type": "Answer",
      text: answer,
    },
  })),
});

export const webApplicationSchema = ({
  name,
  description,
  path,
  lowPrice,
  highPrice,
  offerCount,
}: {
  name: string;
  description: string;
  path: string;
  lowPrice: number;
  highPrice: number;
  offerCount: number;
}) => ({
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name,
  description,
  url: absoluteUrl(path),
  applicationCategory: "BusinessApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires JavaScript",
  inLanguage: "en",
  isAccessibleForFree: true,
  provider: {
    "@type": "Organization",
    name: "Vedha Technologies",
    url: siteUrl,
  },
  areaServed: [
    { "@type": "City", name: "Dubai" },
    { "@type": "Country", name: "United Arab Emirates" },
  ],
  offers: {
    "@type": "AggregateOffer",
    priceCurrency: "AED",
    lowPrice: String(lowPrice),
    highPrice: String(highPrice),
    offerCount,
  },
});

export const offerCatalogSchema = ({
  name,
  description,
  path,
  offers,
}: {
  name: string;
  description: string;
  path: string;
  offers: Array<{ name: string; description: string; price: number; url?: string }>;
}) => ({
  "@context": "https://schema.org",
  "@type": "OfferCatalog",
  name,
  description,
  url: absoluteUrl(path),
  itemListElement: offers.map((offer, index) => ({
    "@type": "Offer",
    position: index + 1,
    name: offer.name,
    description: offer.description,
    price: offer.price,
    priceCurrency: "AED",
    availability: "https://schema.org/InStock",
    url: absoluteUrl(offer.url ?? path),
    itemOffered: {
      "@type": "Service",
      name: offer.name,
      description: offer.description,
      provider: {
        "@type": "Organization",
        name: "Vedha Technologies",
        url: siteUrl,
      },
      areaServed: {
        "@type": "Country",
        name: "United Arab Emirates",
      },
    },
  })),
});

export const howToSchema = ({
  name,
  description,
  path,
  steps,
}: {
  name: string;
  description: string;
  path: string;
  steps: Array<{ name: string; text: string }>;
}) => ({
  "@context": "https://schema.org",
  "@type": "HowTo",
  name,
  description,
  url: absoluteUrl(path),
  step: steps.map((step, index) => ({
    "@type": "HowToStep",
    position: index + 1,
    name: step.name,
    text: step.text,
  })),
});

export const productSchema = ({
  name,
  description,
  image,
  path,
  category,
}: {
  name: string;
  description: string;
  image: string;
  path: string;
  category: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  name,
  description,
  image: absoluteUrl(image),
  url: absoluteUrl(path),
  category,
  brand: {
    "@type": "Brand",
    name: "VEDHA",
  },
});
