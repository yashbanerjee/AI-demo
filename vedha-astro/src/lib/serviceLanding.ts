/**
 * SEO-focused landing content for every leaf service.
 * Copy is composed from pillar/category frameworks + service-specific tokens
 * so pages stay distinct without hand-authoring ~389 markdown files.
 */

export type ServiceLandingInput = {
  name: string;
  description: string;
  slug: string;
  pillar: string;
  categoryName: string;
  categorySlug: string;
  categoryDescription: string;
  path: string;
};

export type ProcessStep = { title: string; body: string };
export type FaqItem = { question: string; answer: string };

export type ServiceLandingContent = {
  seoTitle: string;
  seoDescription: string;
  h1: string;
  lede: string;
  whyImportant: string[];
  benefits: string[];
  process: ProcessStep[];
  outcomes: string[];
  faqs: FaqItem[];
  keywords: string[];
  cover: string;
};

const covers = [
  "/images/photo-dubai-aerial.jpg",
  "/images/photo-dubai-marina.jpg",
  "/images/photo-summit-dusk.jpg",
  "/images/photo-alpine-glow.jpg",
  "/images/photo-cliff-coast.jpg",
  "/images/photo-forest-light.jpg",
  "/images/photo-lake-reflection.jpg",
  "/images/photo-moraine-lake.jpg",
  "/images/photo-waterfall.jpg",
  "/images/photo-starry-peaks.jpg",
  "/images/photo-moon-peaks.jpg",
  "/images/photo-ridge-mist.jpg",
  "/images/photo-canyon-ridge.jpg",
  "/images/photo-blue-lake.jpg",
  "/images/photo-misty-forest.jpg",
  "/images/photo-vermilion-lake.jpg",
  "/images/photo-skogafoss.jpg",
  "/images/photo-lake-jetty.jpg",
  "/images/hero-slide-city.jpg",
  "/images/hero-slide-interchange.jpg",
  "/images/hero-slide-mountains.jpg",
  "/images/hero-slide-fields.jpg",
];

const hash = (s: string) =>
  [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 0);

const coverFor = (key: string) => covers[hash(key) % covers.length];

const clip = (text: string, max: number) => {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  const at = cut.lastIndexOf(" ");
  return `${(at > 40 ? cut.slice(0, at) : cut).trim()}…`;
};

const lower = (s: string) => s.toLowerCase();

type Framework = {
  process: ProcessStep[];
  benefits: string[];
  outcomes: string[];
};

const pillarFrameworks: Record<string, Framework> = {
  Build: {
    process: [
      {
        title: "Discover requirements",
        body: "We map stakeholders, constraints, and success metrics so the build targets real commercial outcomes.",
      },
      {
        title: "Architect the solution",
        body: "We define scope, stack, integrations, and delivery phases before engineering starts.",
      },
      {
        title: "Design and prototype",
        body: "Interfaces and workflows are validated early so teams align before expensive build cycles.",
      },
      {
        title: "Build and integrate",
        body: "Engineering proceeds in transparent milestones with continuous quality and integration checks.",
      },
      {
        title: "Launch and harden",
        body: "We ship, monitor, and stabilise production so go-live is controlled and measurable.",
      },
      {
        title: "Optimise and support",
        body: "Post-launch improvements, training, and support keep the solution compounding value.",
      },
    ],
    benefits: [
      "Faster path from brief to production without rework",
      "Architecture that scales with users, data, and integrations",
      "Clear ownership across product, engineering, and operations",
      "Reduced delivery risk through phased milestones",
    ],
    outcomes: [
      "A production-ready capability aligned to business goals",
      "Documented architecture and handover materials",
      "Measurable launch criteria and support model",
    ],
  },
  Consult: {
    process: [
      {
        title: "Frame the decision",
        body: "We clarify the commercial question, constraints, and what “good” looks like for leadership.",
      },
      {
        title: "Assess the current state",
        body: "Systems, teams, vendors, and processes are reviewed against readiness and risk.",
      },
      {
        title: "Analyse options",
        body: "Build, buy, and hybrid paths are compared with cost, timeline, and operating impact.",
      },
      {
        title: "Recommend a roadmap",
        body: "Priorities are sequenced into a board-ready plan with dependencies and funding stages.",
      },
      {
        title: "Align stakeholders",
        body: "Findings are socialised so sponsors, IT, and operations share one direction.",
      },
      {
        title: "Enable execution",
        body: "We leave you with briefs, criteria, and next-step actions your teams can execute.",
      },
    ],
    benefits: [
      "Independent advice before major technology spend",
      "Risk and waste surfaced early",
      "Roadmaps that match operating reality",
      "Decisions that leadership can defend",
    ],
    outcomes: [
      "A clear recommendation with trade-offs documented",
      "Prioritised initiatives and success metrics",
      "Alignment across commercial and technology stakeholders",
    ],
  },
  Design: {
    process: [
      {
        title: "Research users and context",
        body: "We study journeys, jobs-to-be-done, and brand constraints that shape the experience.",
      },
      {
        title: "Define the problem",
        body: "Insights become design principles, IA, and measurable experience goals.",
      },
      {
        title: "Explore concepts",
        body: "Multiple directions are explored so teams choose with evidence, not preference alone.",
      },
      {
        title: "Prototype and test",
        body: "Interactive prototypes validate usability and accessibility before build.",
      },
      {
        title: "Systematise the design",
        body: "Components, tokens, and guidelines keep product UI coherent at scale.",
      },
      {
        title: "Partner through delivery",
        body: "Design stays close to engineering so intent survives implementation.",
      },
    ],
    benefits: [
      "Experiences rooted in real user evidence",
      "Faster stakeholder alignment through prototypes",
      "Accessible, brand-consistent interfaces",
      "Design systems that reduce rebuild cost",
    ],
    outcomes: [
      "Validated flows and interface specifications",
      "A reusable design system where needed",
      "Handoff assets engineering can ship from",
    ],
  },
  Automate: {
    process: [
      {
        title: "Map the workflow",
        body: "We document the process, handoffs, and failure points that automation must fix.",
      },
      {
        title: "Identify automation candidates",
        body: "High-volume, rules-based work is prioritised for ROI and feasibility.",
      },
      {
        title: "Design the automation",
        body: "Triggers, systems, exceptions, and controls are specified before build.",
      },
      {
        title: "Integrate and configure",
        body: "CRM, ERP, marketing, and ops tools are connected with reliable data flows.",
      },
      {
        title: "Test edge cases",
        body: "Exceptions and rollback paths are proven so automation does not create new risk.",
      },
      {
        title: "Train and monitor",
        body: "Teams adopt the new flow with dashboards that catch drift early.",
      },
    ],
    benefits: [
      "Hours reclaimed from repetitive operational work",
      "Fewer manual errors across systems",
      "Faster cycle times for sales, marketing, and ops",
      "Audit-friendly process visibility",
    ],
    outcomes: [
      "Live automations with defined owners",
      "Documented workflows and exception handling",
      "Baseline metrics to prove efficiency gains",
    ],
  },
  Intelligence: {
    process: [
      {
        title: "Define the decision to improve",
        body: "We start from the business question so models and dashboards serve real choices.",
      },
      {
        title: "Assess data readiness",
        body: "Sources, quality, governance, and access are reviewed before investment.",
      },
      {
        title: "Design the approach",
        body: "Analytics, AI, or hybrid methods are selected against feasibility and risk.",
      },
      {
        title: "Build and validate",
        body: "Pipelines, models, and interfaces are tested against held-out evidence.",
      },
      {
        title: "Operationalise insights",
        body: "Outputs land in products, dashboards, or workflows people actually use.",
      },
      {
        title: "Govern and improve",
        body: "Monitoring, feedback loops, and policies keep intelligence trustworthy.",
      },
    ],
    benefits: [
      "Decisions grounded in reliable data",
      "AI initiatives that start from readiness, not hype",
      "Insights embedded in day-to-day tools",
      "Governance that reduces model and data risk",
    ],
    outcomes: [
      "Production analytics or AI capability",
      "Clear data ownership and quality baselines",
      "Adoption path for the teams who decide",
    ],
  },
  Connect: {
    process: [
      {
        title: "Inventory systems and contracts",
        body: "APIs, events, vendors, and data ownership are mapped across the landscape.",
      },
      {
        title: "Define integration patterns",
        body: "Sync, async, and orchestration choices are matched to latency and reliability needs.",
      },
      {
        title: "Design secure interfaces",
        body: "Auth, payloads, versioning, and error handling are specified up front.",
      },
      {
        title: "Build and harden connectors",
        body: "Integrations are delivered with retries, observability, and clear ownership.",
      },
      {
        title: "Validate end-to-end flows",
        body: "Business scenarios are tested across systems, not just unit endpoints.",
      },
      {
        title: "Operate and evolve",
        body: "Monitoring and change control keep connections stable as products change.",
      },
    ],
    benefits: [
      "Fewer brittle point-to-point integrations",
      "Reliable data movement between core systems",
      "Faster onboarding of new tools and partners",
      "Visibility when something breaks",
    ],
    outcomes: [
      "Documented integration architecture",
      "Production connectors with monitoring",
      "A pattern library for future connections",
    ],
  },
  Scale: {
    process: [
      {
        title: "Assess scale and risk",
        body: "Performance, security, compliance, and operational bottlenecks are prioritised.",
      },
      {
        title: "Define the target operating model",
        body: "Cloud, DevOps, QA, and security practices are set against growth goals.",
      },
      {
        title: "Modernise foundations",
        body: "Infrastructure, pipelines, and controls are upgraded in controlled stages.",
      },
      {
        title: "Automate delivery and assurance",
        body: "CI/CD, testing, and observability reduce manual release risk.",
      },
      {
        title: "Harden for production",
        body: "Security, compliance, and resilience controls are verified under load.",
      },
      {
        title: "Run and improve",
        body: "SLOs, runbooks, and continuous improvement keep systems healthy.",
      },
    ],
    benefits: [
      "Infrastructure that keeps pace with growth",
      "Safer, faster releases",
      "Stronger security and compliance posture",
      "Lower operational firefighting",
    ],
    outcomes: [
      "Scalable platform foundations",
      "Documented runbooks and SLOs",
      "Measurable reliability and delivery improvements",
    ],
  },
  Support: {
    process: [
      {
        title: "Understand the operating need",
        body: "We clarify coverage, SLAs, skills gaps, and which systems need steady care.",
      },
      {
        title: "Design the support model",
        body: "Roles, escalation paths, and tooling are defined for predictable response.",
      },
      {
        title: "Onboard systems and knowledge",
        body: "Access, documentation, and baselines are established before go-live support.",
      },
      {
        title: "Deliver day-to-day excellence",
        body: "Tickets, releases, and improvements are handled with transparent reporting.",
      },
      {
        title: "Train and transfer capability",
        body: "Your teams gain skills so dependency shrinks over time where desired.",
      },
      {
        title: "Review and adapt",
        body: "Regular reviews tune capacity, priorities, and commercial outcomes.",
      },
    ],
    benefits: [
      "Reliable coverage without hiring spikes",
      "Institutional knowledge retained in docs and rituals",
      "Predictable response to incidents and change",
      "Flexible capacity as demand shifts",
    ],
    outcomes: [
      "An active support or team engagement model",
      "Clear SLAs and reporting cadence",
      "Documented knowledge your organisation owns",
    ],
  },
};

const categoryTweaks: Record<
  string,
  { processTitleHints?: string[]; extraBenefits?: string[]; focus?: string }
> = {
  "ERP Solutions": {
    focus: "ERP selection, configuration, and industry fit",
    processTitleHints: [
      "Assess ERP readiness",
      "Select and design the ERP blueprint",
      "Configure and customise modules",
      "Integrate finance and operations data",
      "Train users and cut over",
      "Optimise live ERP performance",
    ],
    extraBenefits: [
      "Industry-specific ERP patterns for construction, retail, and operations",
      "Cleaner financial and operational reporting from day one",
    ],
  },
  "Enterprise Software": {
    focus: "bespoke enterprise platforms and workflows",
  },
  "SaaS & Product Development": {
    focus: "multi-tenant product engineering and commercialisation",
  },
  "Web Application Development": {
    focus: "secure, scalable web applications and portals",
  },
  "Mobile Application Development": {
    focus: "native and cross-platform mobile products",
  },
  "Website Design & Development": {
    focus: "high-performing marketing and corporate sites",
  },
  "E-commerce Solutions": {
    focus: "conversion-led commerce platforms and operations",
  },
  "Technology Consulting & Strategy": {
    focus: "independent technology strategy and investment clarity",
  },
  "UX/UI & Product Design": {
    focus: "research-led product experience design",
  },
  "Brand Identity": {
    focus: "cohesive brand systems for digital products",
  },
  "Business Automation": {
    focus: "workflow automation across operations",
  },
  "CRM & Sales Systems": {
    focus: "CRM implementation and revenue process design",
  },
  "Marketing Technology": {
    focus: "marketing stack orchestration and measurement",
  },
  "AI Solutions": {
    focus: "practical AI use cases with governance",
  },
  "Data & Business Intelligence": {
    focus: "trusted data platforms and decision dashboards",
  },
  "API & Systems Integration": {
    focus: "resilient APIs and system connectivity",
  },
  "Search & AI Visibility": {
    focus: "discoverability across search and AI surfaces",
  },
  "Cloud, DevOps & Infrastructure": {
    focus: "cloud foundations and delivery automation",
  },
  "Cybersecurity & Compliance": {
    focus: "security controls and regulatory readiness",
  },
  "Software Quality Assurance": {
    focus: "test strategy that protects release quality",
  },
  "Legacy System Modernisation": {
    focus: "safe modernisation of ageing platforms",
  },
  "Managed Technology Services": {
    focus: "ongoing platform care and optimisation",
  },
  "Dedicated Technology Teams": {
    focus: "embedded engineering capacity",
  },
  "Training, Adoption & Documentation": {
    focus: "adoption programmes that stick",
  },
};

function personaliseProcess(
  base: ProcessStep[],
  service: ServiceLandingInput,
  hints?: string[]
): ProcessStep[] {
  const name = service.name;
  const desc = service.description;
  return base.map((step, i) => {
    const title = hints?.[i] ?? step.title;
    const body =
      i === 0
        ? `${step.body} For ${name}, we start from ${clip(desc, 110).replace(/\.$/, "")}.`
        : i === base.length - 1
          ? `${step.body} ${name} stays measurable after handover with clear owners and next actions.`
          : `${step.body} This stage is tailored to how ${name.toLowerCase()} lands inside ${service.categoryName}.`;
    return { title, body };
  });
}

function buildFaqs(service: ServiceLandingInput): FaqItem[] {
  const n = service.name;
  const cat = service.categoryName;
  return [
    {
      question: `What is included in ${n} with VEDHA?`,
      answer: `${n} covers discovery, delivery, and handover aligned to ${cat}. ${service.description} Engagements are scoped to your systems, stakeholders, and commercial goals in Dubai and the wider UAE.`,
    },
    {
      question: `How long does ${n} typically take?`,
      answer: `Timelines depend on scope, integrations, and decision speed. Most ${n.toLowerCase()} engagements begin with a focused discovery, then proceed in clear milestones so leadership can track progress and investment.`,
    },
    {
      question: `Who is ${n} for?`,
      answer: `Organisations that need ${n.toLowerCase()} as part of ${cat.toLowerCase()} — from growing companies to enterprises modernising operations. We tailor depth for founders, IT leaders, and transformation sponsors.`,
    },
    {
      question: `How does ${n} differ from a generic ${cat} project?`,
      answer: `${n} is a defined service with a specific outcome path inside ${cat}. Instead of a vague project label, you get a named process, success criteria, and specialists who deliver this capability repeatedly.`,
    },
    {
      question: `Can VEDHA combine ${n} with other services?`,
      answer: `Yes. ${n} often sits alongside related ${cat} work and neighbouring pillars such as ${service.pillar === "Build" ? "Consult or Scale" : "Build or Support"}. We sequence work so dependencies are clear and spend compounds.`,
    },
  ];
}

function pickVariant<T>(items: T[], key: string): T {
  return items[hash(key) % items.length];
}

export function buildServiceLanding(
  service: ServiceLandingInput
): ServiceLandingContent {
  const framework =
    pillarFrameworks[service.pillar] ?? pillarFrameworks.Build;
  const tweak = categoryTweaks[service.categoryName] ?? {};
  const focus =
    tweak.focus ?? lower(service.categoryName);
  const name = service.name;
  const nameLower = lower(name);

  const ledeVariants = [
    `${name} from VEDHA helps Dubai and UAE organisations turn ${focus} into a clear, deliverable programme — not an open-ended project.`,
    `Need ${nameLower} that leadership can trust? VEDHA delivers ${name} inside ${service.categoryName} with a defined process, measurable outcomes, and specialists who stay accountable.`,
    `${name} is how teams under ${service.categoryName} reduce risk and move faster. ${clip(service.description, 140)}`,
  ];

  const whyVariants = [
    [
      `${name} matters because technology spend only pays off when capability, process, and people move together. Without a focused ${nameLower} engagement, teams often buy tools or start builds that never reach adoption.`,
      `As part of ${service.categoryName}, ${nameLower} gives you a named path: clarity on scope, a delivery sequence, and outcomes your organisation can operate. ${service.description}`,
      `VEDHA runs ${nameLower} for organisations across Dubai and the UAE that need commercial discipline as much as technical craft — so investment compounds instead of fragmenting.`,
    ],
    [
      `Skipping dedicated ${nameLower} work usually shows up later as rework, stalled adoption, or integrations that never stabilise. A structured service prevents that drift.`,
      `${clip(service.description, 180)} That is why ${name} sits inside our ${service.categoryName} practice under the ${service.pillar} pillar.`,
      `Whether you are validating a decision or shipping a live capability, ${nameLower} creates shared language between sponsors, operators, and delivery teams.`,
    ],
    [
      `Leaders ask for ${nameLower} when the cost of ambiguity is higher than the cost of a focused engagement. Clear process and ownership shorten that ambiguity.`,
      `Within ${service.categoryName}, ${name} is designed around ${focus}. ${service.description}`,
      `Based in Dubai, VEDHA combines regional operating context with delivery discipline so ${nameLower} lands in real environments — not slide decks alone.`,
    ],
  ];

  const process = personaliseProcess(
    framework.process,
    service,
    tweak.processTitleHints
  );

  const benefits = [
    ...framework.benefits.slice(0, 3),
    ...(tweak.extraBenefits ?? []),
    `Specialist delivery for ${nameLower} — not a generic project team`,
  ].slice(0, 5);

  const outcomes = [
    ...framework.outcomes,
    `A defined next-step plan for ${nameLower} after launch or recommendation`,
  ].slice(0, 4);

  const keywords = [
    name,
    `${name} Dubai`,
    `${name} UAE`,
    service.categoryName,
    `${service.categoryName} services`,
    service.pillar,
    focus,
    "Vedha Technologies",
  ];

  const seoDescription = clip(
    `${name} in Dubai from VEDHA — ${service.description} Part of our ${service.categoryName} practice. Book a free consultation.`,
    158
  );

  return {
    seoTitle: `${name} in Dubai | ${service.categoryName} — VEDHA`,
    seoDescription,
    h1: name,
    lede: pickVariant(ledeVariants, service.path),
    whyImportant: pickVariant(whyVariants, `${service.path}-why`),
    benefits,
    process,
    outcomes,
    faqs: buildFaqs(service),
    keywords,
    cover: coverFor(service.path),
  };
}
