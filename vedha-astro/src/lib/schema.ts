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
  services: Array<{ name: string; description: string }>;
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
