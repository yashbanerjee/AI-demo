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
  whyHeading?: string;
  benefits: string[];
  howHelpsIntro?: string;
  howHelpsHeading?: string;
  howHelps?: ProcessStep[];
  process: ProcessStep[];
  processHeading?: string;
  processIntro?: string;
  outcomes: string[];
  outcomesHeading?: string;
  outcomesIntro?: string;
  whyUsHeading?: string;
  whyUs?: string[];
  faqs: FaqItem[];
  faqHeading?: string;
  keywords: string[];
  cover: string;
  ctaTitle?: string;
  ctaBody?: string;
  ctaPrimaryLabel?: string;
  ctaPrimaryHref?: string;
  ctaSecondaryLabel?: string;
  ctaSecondaryHref?: string;
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

  const generated: ServiceLandingContent = {
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

  const custom = customLandings[service.slug];
  return custom ? { ...generated, ...custom } : generated;
}

const customLandings: Record<string, Partial<ServiceLandingContent>> = {
  "digital-transformation-strategy": {
    seoTitle: "Digital Transformation Consulting and Strategy in Dubai, UAE | Vedha",
    seoDescription:
      "Digital transformation consulting in Dubai and the UAE. Assess systems and processes, prioritise initiatives, and get a practical roadmap from strategy to implementation.",
    h1: "Digital Transformation Consulting and Strategy in Dubai, UAE",
    lede: "Digital transformation consulting helps businesses in Dubai and the UAE make smarter technology decisions, improve how they operate, and build a practical roadmap for sustainable growth.",
    whyHeading: "What is digital transformation consulting?",
    whyImportant: [
      "Digital transformation consulting helps an organisation improve performance, customer experience, and long-term growth through better use of technology. It involves reviewing current processes, systems, data, and capabilities, then setting priorities for improvement.",
      "The goal is to create a practical path forward. This may include modernising legacy applications, automating manual workflows, improving data visibility, integrating business systems, adopting AI, or improving digital customer journeys.",
      "Vedha provides digital transformation consulting in Dubai and across the UAE for organisations that need to connect technology decisions with commercial objectives, operational needs, and the resources available to deliver change.",
    ],
    benefits: [],
    howHelpsIntro:
      "Every organisation has a different starting point. You may be managing disconnected systems, repetitive manual work, limited reporting, ageing technology, or digital experiences that no longer meet customer expectations. Vedha begins with the business problem. We work with leadership, operational, and technology teams to understand what needs to improve and what a successful outcome looks like. Our approach supports both immediate priorities and long-term change.",
    howHelpsHeading: "How Vedha helps businesses transform",
    howHelps: [
      {
        title: "Modernise systems and operations",
        body: "We identify where outdated applications, manual work, and disconnected tools are slowing teams down, then recommend improvements, integrations, modernisation, or phased replacement.",
      },
      {
        title: "Identify practical AI and automation opportunities",
        body: "We assess use cases, data readiness, feasibility, governance, and expected value to identify AI and automation initiatives that solve real business problems.",
      },
      {
        title: "Improve digital experiences",
        body: "We identify opportunities to improve customer, employee, supplier, and partner journeys across websites, eCommerce platforms, customer portals, mobile applications, and internal tools.",
      },
      {
        title: "Support implementation",
        body: "We define requirements, delivery phases, and success measures, then support delivery through custom software, web development, AI, automation, and integration services.",
      },
    ],
    processHeading: "What our digital transformation consulting includes",
    processIntro:
      "Vedha works with you to assess your current position, identify the most valuable opportunities, and create a practical plan for change. Our approach is tailored to your business goals, existing technology, internal capabilities, and delivery constraints.",
    process: [
      {
        title: "Understand your priorities",
        body: "We begin with your business model, growth plans, customer needs, operational challenges, and leadership goals.",
      },
      {
        title: "Assess your current environment",
        body: "We review key processes, systems, data, digital touchpoints, internal capabilities, and risks to establish a clear baseline.",
      },
      {
        title: "Identify improvement opportunities",
        body: "We look for opportunities to modernise systems, automate workflows, improve data visibility, integrate platforms, adopt AI, or strengthen digital customer experiences.",
      },
      {
        title: "Prioritise the right initiatives",
        body: "We assess opportunities against business value, urgency, feasibility, effort, cost, and dependencies, so investment focuses on what matters most.",
      },
      {
        title: "Create your digital transformation roadmap",
        body: "We develop a phased plan covering recommended initiatives, ownership, milestones, risks, success measures, and the steps required to begin delivery.",
      },
    ],
    outcomesHeading: "Digital transformation strategy deliverables",
    outcomesIntro:
      "Depending on the scope, your digital transformation consulting engagement may include the items below. These deliverables give leadership, operations, and technology teams a shared basis for making investment and delivery decisions.",
    outcomes: [
      "Digital maturity assessment and current-state summary",
      "Business process and technology gap analysis",
      "Stakeholder requirements and findings",
      "Prioritised transformation opportunity register",
      "AI and automation use-case recommendations",
      "Technology, data, and integration recommendations",
      "Target-state technology direction",
      "Phased digital transformation roadmap",
      "Risks, dependencies, ownership, and governance considerations",
      "KPIs and success measures",
      "Implementation briefs or vendor evaluation criteria",
    ],
    whyUsHeading: "Why Vedha?",
    whyUs: [
      "Vedha combines digital transformation consulting with hands-on delivery across AI, automation, custom software, web platforms, and system integration. We help UAE organisations turn business priorities into a practical roadmap, then provide the technical support needed to deliver it.",
      "Our approach brings strategy and execution together, helping teams make informed technology decisions and move forward with a clear plan. For organisations planning business transformation in Dubai, this creates a more direct route from strategy to implementation.",
    ],
    faqHeading: "Frequently asked questions",
    faqs: [
      {
        question: "What is the difference between digital transformation strategy and consulting?",
        answer:
          "Digital transformation consulting is the advisory work used to assess your current position, opportunities, technology options, and priorities. A digital transformation strategy is the resulting plan, including target outcomes, recommended initiatives, sequencing, and measures of success.",
      },
      {
        question: "How long does digital transformation consulting take?",
        answer:
          "A focused assessment and roadmap can take several weeks. Larger engagements may take longer where they involve several departments, complex legacy systems, extensive stakeholder input, or detailed business cases.",
      },
      {
        question: "Who needs digital transformation consulting?",
        answer:
          "It can help startups, SMEs, and enterprise organisations that need to improve inefficient processes, modernise outdated systems, connect disconnected platforms, adopt AI, or improve digital customer experiences.",
      },
      {
        question: "Can Vedha implement the roadmap?",
        answer:
          "Yes. Vedha can support roadmap implementation through custom software development, web development, AI solutions, automation, system integration, customer portals, and digital platforms.",
      },
      {
        question: "Can legacy systems be improved without replacing everything?",
        answer:
          "Often, yes. A phased approach may include system integration, workflow automation, user experience improvements, data consolidation, selected cloud migration, or replacement of the highest-risk components first.",
      },
      {
        question: "How much does digital transformation consulting cost in Dubai?",
        answer:
          "Cost depends on the scope, systems involved, stakeholder requirements, research needed, and depth of the final roadmap. Vedha will define the engagement scope and provide a clear proposal before work begins.",
      },
    ],
    ctaTitle: "Ready to discuss your digital transformation strategy?",
    ctaBody:
      "Tell us about your business goals, current systems, and transformation priorities. Our Dubai-based consultants will help you define a clear scope and identify the right next step for your organisation.",
    ctaPrimaryLabel: "Discuss your transformation strategy",
    ctaPrimaryHref: "/#book",
    ctaSecondaryLabel: "Explore technology consulting and strategy",
    ctaSecondaryHref: "/services/technology-consulting-strategy/",
    keywords: [
      "digital transformation consulting UAE",
      "digital transformation consulting Dubai",
      "digital transformation strategy UAE",
      "digital transformation Dubai",
      "business transformation Dubai",
      "Technology Consulting & Strategy",
      "Vedha",
    ],
  },
  "inventory-management-systems": {
    seoTitle: "Inventory Management Software in Dubai, UAE | Vedha",
    seoDescription:
      "Custom inventory management software in Dubai and the UAE. Track stock across warehouses, stores and branches with stronger controls, replenishment and system integrations.",
    h1: "Inventory Management Software in Dubai, UAE",
    lede: "Vedha designs and develops inventory management systems that give businesses clearer stock visibility, stronger controls, and a more reliable way to manage inventory across warehouses, stores, and branches.",
    whyHeading: "What is inventory management software?",
    whyImportant: [
      "Inventory management software in the UAE helps businesses track, control, and optimise stock throughout its lifecycle. It brings product records, stock movements, purchase orders, sales activity, warehouse transfers, adjustments, and replenishment information into one central system.",
      "For businesses using spreadsheets, paper-based counts, or disconnected software, it can be difficult to know what is available, where stock is located, what has moved, and when items need to be reordered. An inventory management system gives teams a more accurate, real-time view of stock across their operations.",
      "Vedha provides inventory management software in Dubai and the UAE for organisations that need a solution aligned with their workflows, locations, users, and existing business systems. We also support businesses looking for inventory management software in Sharjah and other UAE locations.",
    ],
    benefits: [],
    howHelpsHeading: "How Vedha helps manage inventory",
    howHelpsIntro:
      "Vedha works with retailers, distributors, and manufacturers to improve stock visibility, control, and decision-making across branches, warehouses, and sales channels.",
    howHelps: [
      {
        title: "Track stock across locations",
        body: "Give authorised teams a central view of inventory by warehouse, store, or storage location with our multi-branch inventory software in the UAE.",
      },
      {
        title: "Control stock movements",
        body: "Record receipts, issues, transfers, returns, adjustments, and stock counts with clear movement history and accountability.",
      },
      {
        title: "Improve replenishment decisions",
        body: "Set reorder levels and identify slow-moving, overstocked, or low-stock items before they affect sales, fulfilment, or production.",
      },
      {
        title: "Connect inventory to the wider business",
        body: "Link inventory data with ERP, accounting, POS, eCommerce, CRM, procurement, logistics, and barcode-scanning tools.",
      },
    ],
    processHeading: "What our inventory management services include",
    processIntro:
      "Vedha provides inventory management services in Dubai for organisations that need a new platform, a tailored enterprise module, or an improvement plan for an existing inventory process.",
    process: [
      {
        title: "Discovery and requirements",
        body: "We map your inventory workflows, product types, locations, stock ownership, approval needs, reporting requirements, and operational challenges.",
      },
      {
        title: "System and data assessment",
        body: "We review the systems and data that affect stock control, including ERP, accounting, purchasing, sales, POS, eCommerce, logistics, and warehouse tools.",
      },
      {
        title: "Solution design",
        body: "We define the appropriate inventory features, user roles, controls, workflows, interfaces, and integrations for your organisation.",
      },
      {
        title: "Development and integration",
        body: "We build or configure the inventory solution, connect relevant business systems, and prepare product, supplier, customer, warehouse, and stock data for migration.",
      },
      {
        title: "Testing, training, and launch",
        body: "We test critical workflows, support user acceptance testing, train relevant teams, and manage a controlled go-live.",
      },
      {
        title: "Post-launch support",
        body: "We provide ongoing support, performance monitoring, enhancements, and further integration work as your operations evolve.",
      },
    ],
    outcomesHeading: "Inventory management system deliverables",
    outcomesIntro:
      "Your project scope will depend on the number of locations, stock complexity, required integrations, and business priorities. A typical engagement for an inventory management system in Dubai may include:",
    outcomes: [
      "Inventory process and requirements assessment",
      "Product, warehouse, branch, and user-role data model",
      "Inventory system architecture and integration plan",
      "Defined workflows for stock receipt, issue, transfer, return, and adjustment",
      "Wireframes or interface designs for key user journeys",
      "Custom inventory management software or tailored enterprise module",
      "ERP, accounting, POS, eCommerce, or logistics integrations",
      "Data migration and validation plan",
      "Test scenarios and launch criteria",
      "User training and operational handover materials",
      "Post-launch support and improvement plan",
    ],
    whyUsHeading: "Why Vedha?",
    whyUs: [
      "Vedha combines enterprise software expertise with practical product delivery. We design inventory management software around how your business operates rather than forcing your teams to work around a rigid, one-size-fits-all platform.",
      "For organisations managing inventory across Dubai, Sharjah, or multiple UAE locations, we can support the full journey from requirements and system design through to development, integration, launch, and ongoing improvement.",
    ],
    faqHeading: "Frequently asked questions",
    faqs: [
      {
        question: "What is multi branch inventory software?",
        answer:
          "Multi branch inventory software gives businesses a central view of stock across multiple branches, stores, warehouses, or other locations. It allows authorised users to monitor quantities by location, transfer stock between sites, and review movement history from one system.",
      },
      {
        question: "Can you integrate inventory management software with our existing systems?",
        answer:
          "Yes. Vedha can integrate inventory software with relevant ERP, accounting, POS, eCommerce, CRM, procurement, logistics, or reporting systems. The integration scope depends on your current platforms, data structure, and the workflows that need to be connected.",
      },
      {
        question: "Can the system support barcode, batch, serial, and expiry tracking?",
        answer:
          "Yes. These features can be included where they are relevant to your stock controls and operational processes. During discovery, we define the identifiers, scanning requirements, stock locations, and reporting needed for your business.",
      },
      {
        question: "Is inventory management software suitable for businesses with several UAE locations?",
        answer:
          "Yes. A multi-location inventory system can help organisations manage stock across branches, warehouses, stores, and distribution points from one central platform. It is particularly useful where teams need clear visibility, controlled transfers, and consistent reporting across locations.",
      },
      {
        question: "How long does it take to build an inventory management system?",
        answer:
          "Timelines depend on the required features, number of locations, existing systems, integration needs, data quality, and rollout approach. A focused solution can be delivered in phases, while a larger enterprise inventory platform may require a longer programme of discovery, development, testing, migration, training, and deployment.",
      },
      {
        question: "Can Vedha support the system after launch?",
        answer:
          "Yes. We can provide post-launch support, user training, enhancements, performance monitoring, and further integration work as your inventory requirements develop.",
      },
    ],
    ctaTitle: "Ready to improve inventory control across your business?",
    ctaBody:
      "Tell us about your branches, warehouses, existing systems, and inventory challenges. Our team will help you define the right scope for inventory management software in Dubai, Sharjah, or across the UAE.",
    ctaPrimaryLabel: "Discuss your inventory management needs",
    ctaPrimaryHref: "/#book",
    ctaSecondaryLabel: "Explore enterprise software solutions",
    ctaSecondaryHref: "/services/enterprise-software/",
    keywords: [
      "inventory management software Dubai",
      "inventory management software UAE",
      "multi branch inventory software UAE",
      "inventory management system Dubai",
      "inventory management software Sharjah",
      "Enterprise Software",
      "Vedha",
    ],
  },
  "erp-consulting": {
    seoTitle: "ERP Consulting in Dubai, UAE | Vedha",
    seoDescription:
      "ERP consulting in Dubai and the UAE. Assess ERP strategy, system selection, implementation planning, integrations, and optimisation with practical guidance from Vedha.",
    h1: "ERP Consulting in Dubai, UAE",
    lede: "Vedha provides ERP consulting in Dubai and the UAE to help organisations make confident decisions about ERP strategy, system selection, implementation, and optimisation.",
    whyHeading: "What is ERP consulting?",
    whyImportant: [
      "ERP consulting helps businesses assess, select, plan, implement, and improve enterprise resource planning systems. It connects operational requirements with the right technology approach, so finance, procurement, inventory, sales, projects, HR, and reporting can work from more reliable and connected information.",
      "An ERP consultant reviews your current processes, systems, data, reporting needs, and business objectives. The outcome is a practical plan for improving the way teams manage core operations, rather than adopting software without a clear fit.",
      "Vedha provides ERP consultation in Dubai for organisations replacing fragmented tools, modernising legacy systems, improving visibility across departments, or preparing for growth. Our ERP consulting services in Dubai are designed around your business model, industry requirements, current technology, and delivery priorities.",
    ],
    benefits: [],
    howHelpsHeading: "How Vedha helps businesses get more from ERP",
    howHelpsIntro:
      "Vedha helps businesses use ERP to create a more connected, visible, and manageable operation. We work with leadership, finance, operations, and technology teams to ensure the ERP programme supports real business priorities, not just a software rollout.",
    howHelps: [
      {
        title: "Improve visibility and control",
        body: "Connect finance, sales, procurement, inventory, and operational data to support clearer reporting and faster decisions.",
      },
      {
        title: "Reduce manual work",
        body: "Replace spreadsheets, duplicated data entry, and fragmented handovers with consistent workflows and shared information.",
      },
      {
        title: "Connect essential systems",
        body: "Integrate ERP with CRM, POS, eCommerce, payroll, logistics, inventory, and custom applications.",
      },
      {
        title: "Support growth",
        body: "Build an ERP foundation for new users, locations, product lines, sales channels, and reporting needs. As an ERP consultant for retail in Dubai, Vedha can also help connect store operations, purchasing, inventory, POS, eCommerce, finance, and supplier management.",
      },
    ],
    processHeading: "What our ERP consulting includes",
    processIntro:
      "Vedha provides ERP consulting in the UAE for businesses that need independent advice before selecting a platform, a clearer plan for an ERP programme, or expert support during an existing implementation.",
    process: [
      {
        title: "Discovery and requirements",
        body: "We work with leadership, finance, operations, IT, and end users to understand workflows, pain points, reporting gaps, compliance needs, approval structures, and priorities.",
      },
      {
        title: "Process and system assessment",
        body: "We review how information moves across finance, procurement, sales, inventory, projects, and customer management to identify inefficiencies, manual work, duplicated data, and disconnected systems.",
      },
      {
        title: "ERP selection and solution design",
        body: "We define the right ERP requirements, including modules, user roles, workflows, integrations, data, reporting, implementation approach, and evaluation criteria.",
      },
      {
        title: "Integration and data planning",
        body: "We identify the systems that need to connect with the ERP and plan data cleansing, migration, validation, and ownership.",
      },
      {
        title: "Delivery governance and change readiness",
        body: "We establish responsibilities, decision-making, training, testing, risk management, and post-launch support requirements.",
      },
    ],
    outcomesHeading: "ERP consulting deliverables",
    outcomesIntro:
      "Your ERP consulting engagement will be tailored to the scale of your organisation, existing systems, industry needs, and programme objectives. Typical deliverables may include:",
    outcomes: [
      "ERP readiness assessment and current-state findings",
      "Business process and system gap analysis",
      "Stakeholder requirements and functional needs",
      "ERP strategy and programme roadmap",
      "Platform evaluation criteria and vendor-selection support",
      "Recommended modules, workflows, user roles, and approval controls",
      "Integration architecture and data-migration plan",
      "Implementation scope, milestones, governance, and risk register",
      "Reporting, dashboard, and KPI requirements",
      "Training, testing, cutover, and post-go-live support plan",
      "Implementation briefs or vendor evaluation materials",
    ],
    whyUsHeading: "Why Vedha?",
    whyUs: [
      "Vedha combines ERP consulting with hands-on technical delivery across custom software, integrations, web platforms, AI, automation, and enterprise systems. We help businesses turn their ERP requirements into a practical programme, then provide the technical support needed to deliver connected workflows and reliable data across the organisation.",
      "For companies looking for ERP consulting services in the UAE, our approach brings strategy and execution together. We focus on practical outcomes, clear ownership, and a delivery plan that works for your teams. We can also support your organisation with ERP implementation, helping turn the agreed strategy and requirements into a successful rollout.",
    ],
    faqHeading: "Frequently asked questions",
    faqs: [
      {
        question: "What is the difference between ERP consulting and ERP implementation?",
        answer:
          "ERP consulting helps define requirements, assess options, and plan the programme. ERP implementation covers configuring, integrating, testing, training, and launching the selected system.",
      },
      {
        question: "How long does ERP consulting take?",
        answer:
          "A focused ERP consultation in Dubai can take several weeks, depending on the number of stakeholders, business functions, systems, and decisions involved. Broader programmes that include detailed process mapping, vendor selection, data assessment, and implementation planning may take longer.",
      },
      {
        question: "Can Vedha help us choose an ERP platform?",
        answer:
          "Yes. We help organisations define evaluation criteria, compare platform options, review functional and technical fit, assess integration needs, and select a delivery approach that supports their budget, operations, and long-term goals.",
      },
      {
        question: "Can ERP integrate with our existing systems?",
        answer:
          "Yes. ERP systems can be integrated with CRM, accounting, POS, inventory, eCommerce, payroll, procurement, logistics, data platforms, and custom applications. The appropriate integration approach depends on the systems involved, the data required, and the workflows that need to be connected.",
      },
      {
        question: "Is ERP consulting suitable for retail businesses?",
        answer:
          "Yes. ERP consulting is particularly useful for retailers that need better visibility across stores, inventory, suppliers, sales channels, finance, procurement, and reporting. Vedha can assess retail requirements and define a practical ERP roadmap for multi-location and omnichannel operations.",
      },
      {
        question: "Can Vedha support our ERP after launch?",
        answer:
          "Yes. We can support ERP optimisation after go-live through workflow improvements, reporting enhancements, integration support, user training, performance monitoring, and further development as your business requirements change.",
      },
    ],
    ctaTitle: "Ready to discuss your ERP requirements?",
    ctaBody:
      "Tell us about your current systems, operating challenges, and ERP goals. Our Dubai-based team will help you define a clear scope and identify the right next step for your ERP programme.",
    ctaPrimaryLabel: "Discuss your ERP strategy",
    ctaPrimaryHref: "/#book",
    ctaSecondaryLabel: "Explore ERP solutions",
    ctaSecondaryHref: "/services/erp-solutions/",
    keywords: [
      "ERP consulting Dubai",
      "ERP consulting UAE",
      "ERP consultant Dubai",
      "ERP consultation Dubai",
      "ERP consulting services UAE",
      "ERP consultant retail Dubai",
      "ERP Solutions",
      "Vedha",
    ],
  },
  "erp-implementation": {
    seoTitle: "ERP Implementation in Dubai, UAE | Vedha Tech",
    seoDescription:
      "Vedha Tech delivers ERP implementation services in UAE for finance, operations, and HR. Learn how structured ERP implementation in Dubai reduces risk and drives adoption.",
    h1: "ERP implementation in Dubai, UAE",
    lede: "Vedha delivers end-to-end ERP implementation in UAE that transforms selected platforms into production-ready systems with configured modules, migrated data, trained users, and stabilised go-live. Structured delivery for finance, operations, and HR modules across industries.",
    whyHeading: "What is ERP implementation?",
    whyImportant: [
      "ERP implementation is the process of configuring, customising, integrating, and launching an enterprise resource planning system so it supports real business workflows. It covers finance, procurement, inventory, sales, projects, HR, and reporting modules. Successful ERP implementation in Dubai requires clear ownership, disciplined milestones, and integration with existing systems.",
      "Vedha Tech provides ERP implementation services in UAE for organisations that need expert support to configure, integrate, test, and launch the system.",
    ],
    benefits: [],
    howHelpsHeading: "How Vedha Tech helps businesses get more from ERP implementation",
    howHelpsIntro:
      "ERP implementations fail when scope is unclear, data is poor, or users are unprepared. Vedha Tech manages ERP implementation services in Dubai to prevent these issues by enforcing disciplined project management, data quality, and change readiness.",
    howHelps: [
      {
        title: "Reduce implementation risk",
        body: "Manage scope, timeline, and budget with clear milestones, decision gates, and risk registers to prevent costly rework and delays.",
      },
      {
        title: "Ensure data quality and integrity",
        body: "Cleanse, migrate, and validate master data (customers, vendors, items, employees) so the ERP launches with accurate, reliable information.",
      },
      {
        title: "Integrate with existing systems",
        body: "Connect ERP with CRM, POS, ecommerce, payroll, logistics, and custom applications so data flows automatically between systems.",
      },
      {
        title: "Drive user adoption and productivity",
        body: "Train end users, super users, and administrators with role-based materials so teams can work effectively from day one.",
      },
    ],
    processHeading: "What our ERP implementation includes",
    processIntro:
      "Vedha Tech provides ERP implementation services in UAE for businesses that need a structured delivery approach, expert configuration support, or experienced project management during an existing implementation.",
    process: [
      {
        title: "Assess ERP readiness and project setup",
        body: "We map stakeholders, constraints, success metrics, and governance structure so the implementation targets real business outcomes. We review current processes, systems, and data quality to identify risks and dependencies.",
      },
      {
        title: "Design ERP blueprint and configuration plan",
        body: "We define scope, modules, workflows, integrations, data migration approach, and delivery phases before configuration starts. This includes ERP finance implementation UAE requirements and ERP HR implementation in Dubai where applicable.",
      },
      {
        title: "Configure and customise ERP modules",
        body: "We build and configure the ERP platform, with custom modules and workflows, and approval hierarchies as needed.",
      },
      {
        title: "Integrate systems and migrate data",
        body: "We identify the systems that need to connect with the ERP and plan data migration and ownership for master and transactional data.",
      },
      {
        title: "Test, train, and cut over to production",
        body: "We manage user acceptance testing, performance testing, role-based training, cutover planning, and production launch to ensure a stable and adopted system.",
      },
      {
        title: "Post-launch support and optimisation",
        body: "We monitor system performance, user adoption, and process compliance, then refine configurations, add integrations, and support new requirements as your ERP environment evolves.",
      },
    ],
    outcomesHeading: "ERP implementation deliverables",
    outcomesIntro:
      "Your ERP implementation engagement will be tailored to your organisation's scale, existing systems, and programme objectives. Typical deliverables may include:",
    outcomes: [
      "ERP readiness assessment and project governance framework",
      "Business process mapping and gap analysis documentation",
      "ERP blueprint with module scope and workflow designs",
      "Configuration specifications and custom development documents",
      "Data migration plan with cleansing, validation, and ownership rules",
      "Integration architecture for ERP, CRM, eCommerce, and other systems",
      "Test plans, user acceptance scripts, and performance benchmarks",
      "Role-based training materials and user documentation",
      "Cutover plan and go-live support checklist",
      "Production-ready ERP system in Dubai or the wider UAE",
    ],
    whyUsHeading: "Why Vedha Tech?",
    whyUs: [
      "Vedha Tech combines ERP consulting with hands-on technical delivery across custom software, integrations, Dubai ERP platforms, and enterprise systems. For companies looking for ERP implementation services in UAE, we bring strategy and execution together with a focus on practical outcomes and clear ownership.",
      "Vedha Tech can also support your organisation with ongoing ERP enhancements, additional module rollouts, and extended integrations as your business requirements change.",
    ],
    faqHeading: "Frequently asked questions",
    faqs: [
      {
        question: "What is the difference between ERP consulting and ERP implementation?",
        answer:
          "ERP consulting focuses on planning, selection, and strategy before implementation begins. ERP implementation in Dubai focuses on configuring, building, integrating, migrating data, testing, training users, and launching the selected ERP system into production.",
      },
      {
        question: "How long does ERP implementation typically take?",
        answer:
          "ERP implementation in UAE timelines depend on scope, number of modules, integrations, data complexity, and decision speed. Most engagements begin with focused discovery, then proceed in clear milestones so leadership can track progress and investment.",
      },
      {
        question: "Can ERP implementation integrate with our existing systems?",
        answer:
          "Yes. ERP systems can integrate with CRM, accounting, POS, inventory, eCommerce, payroll, procurement, logistics, and custom applications. The integration approach depends on your existing stack, data requirements, and workflows that must be connected.",
      },
      {
        question: "What industries do you support for ERP implementation?",
        answer:
          "We support ERP implementation across retail, distribution, manufacturing, construction, professional services, and healthcare. Our team has experience with ERP finance and HR implementation across these sectors.",
      },
      {
        question: "Can Vedha Tech support our ERP after go-live?",
        answer:
          "Yes. We can support ERP optimisation after go-live through configuration improvements, reporting enhancements, integration support, user training, performance monitoring, and further development as your business requirements change.",
      },
    ],
    ctaTitle: "Ready to discuss your ERP implementation requirements?",
    ctaBody:
      "Tell us about your selected ERP platform, current systems, implementation challenges, and ERP goals. Our Dubai-based team will help you define a clear scope and identify the right next step for your programme.",
    ctaPrimaryLabel: "Discuss your ERP implementation",
    ctaPrimaryHref: "/#book",
    ctaSecondaryLabel: "Explore ERP Solutions",
    ctaSecondaryHref: "/services/erp-solutions/",
    keywords: [
      "ERP implementation Dubai",
      "ERP implementation UAE",
      "ERP implementation services UAE",
      "ERP finance implementation UAE",
      "ERP HR implementation Dubai",
      "ERP Solutions",
      "Vedha Tech",
    ],
  },
  "document-management-systems": {
    seoTitle: "Document Management Systems in Dubai, UAE | Vedha Tech",
    seoDescription:
      "Vedha Tech builds document management systems in Dubai and the UAE for centralised control, faster retrieval, and stronger compliance across teams and locations.",
    h1: "Document-management systems in Dubai, UAE",
    lede: "Vedha designs and develops document management systems that give organisations centralised control, faster retrieval, and stronger compliance for documents, records, and approvals across teams and locations. Secure, searchable document control for regulated, multi-location operations.",
    whyHeading: "What is document-management systems?",
    whyImportant: [
      "Document-management systems help businesses manage documents, records, and approvals in a structured and secure way. They connect operational requirements with the right technology approach. This ensures policies, contracts, invoices, patient files, and project records work from reliable and connected information.",
      "Vedha Tech builds document management system in Dubai and across the UAE for teams moving away from scattered drives, outdated tools, and manual handovers. We shape each engagement around your operating model, sector-specific requirements, existing stack, and delivery timelines.",
    ],
    benefits: [],
    howHelpsHeading: "How Vedha Tech helps businesses get more from document-management systems",
    howHelpsIntro:
      "Our team designs and deploys document-management systems that turn scattered files into a controlled, searchable, and auditable environment. We partner with leadership, operations, compliance, and IT to ensure the solution supports day-to-day work and long-term priorities, not just a technology launch.",
    howHelps: [
      {
        title: "Improve visibility and control",
        body: "Centralise documents with structured metadata, version control, and audit trails to support clearer reporting and faster decisions.",
      },
      {
        title: "Reduce manual work",
        body: "Replace scattered drives, email attachments, and duplicated uploads with consistent workflows and shared repositories.",
      },
      {
        title: "Connect essential systems",
        body: "Integrate document management software in UAE with ERP, CRM, HR, accounting, project management, and custom applications.",
      },
      {
        title: "Support growth and compliance",
        body: "Build a document-management system in Dubai or the wider UAE that scales with users, data volume, and regulatory requirements. As a partner for government document management in UAE and healthcare document management in UAE, Vedha Tech can also help connect records, approvals, retention policies, and compliance reporting.",
      },
    ],
    processHeading: "What our document-management systems includes",
    processIntro:
      "Vedha Tech provides document management services in UAE for businesses that need a tailored document-management platform, a clearer plan, or expert support during development and implementation.",
    process: [
      {
        title: "Discovery, requirements, and assessment",
        body: "We work with leadership, operations, compliance, IT, and end users to understand document types, workflows, pain points, and compliance needs. We review how documents move across departments, locations, and systems to identify inefficiencies, manual work, and disconnected repositories.",
      },
      {
        title: "Platform selection and solution design",
        body: "We define the right requirements for a document management system in UAE, including modules, user roles, workflows, integrations, data, reporting, implementation approach, and evaluation criteria.",
      },
      {
        title: "Custom development and configuration",
        body: "We build and configure the document-management platform, including custom workflows, metadata structures, access controls, and integrations with existing business systems.",
      },
      {
        title: "Integration and data migration",
        body: "We identify the systems that need to connect with the document-management system and plan data cleansing, migration, validation, and ownership.",
      },
      {
        title: "Implementation, testing, and go-live",
        body: "We manage user acceptance testing, training, cutover planning, and production launch to ensure a stable and adopted system.",
      },
      {
        title: "Post-launch support and optimisation",
        body: "We monitor usage, refine workflows, add integrations, and support new requirements as your document environment evolves.",
      },
    ],
    outcomesHeading: "Document-management systems deliverables",
    outcomesIntro:
      "Your document-management systems engagement will be tailored to the scale of your organisation, existing systems, and programme objectives. Typical deliverables may include:",
    outcomes: [
      "Document-management readiness assessment and current-state findings",
      "Business process and system gap analysis",
      "Stakeholder requirements and functional needs",
      "Document-management strategy and programme roadmap",
      "Platform evaluation criteria and vendor-selection support (where applicable)",
      "Recommended modules, workflows, user roles, and approval controls",
      "Custom development specifications and configuration documents",
      "Integration architecture and data-migration plan",
      "Test plans, user acceptance scripts, and training materials",
      "Production-ready document-management system in Dubai or the wider UAE",
      "Post-go-live support and optimisation plan",
    ],
    whyUsHeading: "Why Vedha Tech?",
    whyUs: [
      "Vedha Tech combines document-management consulting with hands-on technical delivery across custom software, integrations, and enterprise systems. For companies looking for document management system in Dubai or document management software in UAE, we bring strategy and execution together with a focus on practical outcomes and clear ownership.",
      "Vedha Tech can also support your organisation with ongoing document-management enhancements, additional integrations, and extended modules as your business requirements change.",
    ],
    faqHeading: "Frequently asked questions",
    faqs: [
      {
        question: "What is the difference between document-management consulting and implementation?",
        answer:
          "Document-management consulting focuses on planning and decision-making for a document-management programme, including readiness, process analysis, platform selection, and integration planning. Implementation focuses on configuring, building, integrating, migrating data, testing, training users, and launching the selected system.",
      },
      {
        question: "How long does document-management consulting take?",
        answer:
          "A focused document management system in Dubai engagement can take several weeks, depending on stakeholders, business functions, systems, and decisions involved. Broader programmes with detailed process mapping, vendor selection, and implementation planning may take longer.",
      },
      {
        question: "Can document-management systems integrate with our existing systems?",
        answer:
          "Yes. Document management systems can be integrated with ERP, CRM, accounting, HR, project management, procurement, logistics, data platforms, and custom applications. The appropriate integration approach depends on the systems involved, the data required, and the workflows that need to be connected.",
      },
      {
        question: "Is document-management consulting suitable for government and healthcare organisations?",
        answer:
          "Yes. Document-management consulting is particularly useful for government and healthcare organisations that need better control over records, approvals, retention, compliance, and reporting. Vedha Tech can assess requirements and define a practical roadmap for regulated environments.",
      },
      {
        question: "Can Vedha Tech support our document-management system after launch?",
        answer:
          "Yes. We can support document-management optimisation after go-live through workflow improvements, reporting enhancements, integration support, user training, and further development as your business requirements change.",
      },
    ],
    ctaTitle: "Ready to discuss your document-management requirements?",
    ctaBody:
      "Tell us about your current repositories, operating challenges, and document-management goals. Our Dubai-based team will help you define a clear scope and identify the right next step for your programme.",
    ctaPrimaryLabel: "Discuss your document-management strategy",
    ctaPrimaryHref: "/#book",
    ctaSecondaryLabel: "Explore Enterprise Software solutions",
    ctaSecondaryHref: "/services/enterprise-software/",
    keywords: [
      "document management system Dubai",
      "document management software UAE",
      "document management system UAE",
      "government document management UAE",
      "healthcare document management UAE",
      "Enterprise Software",
      "Vedha Tech",
    ],
  },
  "procurement-systems": {
    seoTitle: "Procurement Systems in Dubai, UAE | Vedha Tech",
    seoDescription:
      "Vedha Tech builds procurement management software in UAE for centralised purchasing, approvals, and supplier oversight. Learn more about how to streamline operations with a unified procurement platform software.",
    h1: "Procurement systems in Dubai, UAE",
    lede: "Vedha designs and develops procurement management software in UAE that gives organisations centralised control, faster approvals, and stronger supplier oversight for purchasing, contracts, and spend across teams and locations. Unified procurement software for streamlined purchasing and supplier management.",
    whyHeading: "What is procurement management software?",
    whyImportant: [
      "Procurement management software in Dubai turns fragmented purchasing into a controlled, auditable workflow. Requisitions, approvals, purchase orders, supplier onboarding, contracts, and spend analytics move through a single platform instead of scattered emails and spreadsheets. This gives teams a shared view of commitments, budgets, and supplier performance.",
      "Vedha Tech provides procurement software in Dubai and the wider UAE for organisations that need tighter control over spend, clearer approval trails, and better supplier visibility. Our procurement systems are built to fit your approval hierarchies, compliance requirements, existing stack, and growth plans.",
    ],
    benefits: [],
    howHelpsHeading: "How Vedha Tech helps businesses get more from procurement systems",
    howHelpsIntro:
      "Procurement failures show up as maverick spend, stalled approvals, and suppliers working from outdated terms. Vedha Tech builds procurement platform software that prevents these issues by enforcing approval hierarchies, budget checks, and supplier controls in every transaction.",
    howHelps: [
      {
        title: "Enforce spend controls and approval hierarchies",
        body: "Route every requisition and purchase order through defined approval chains with budget checks, delegation rules, and audit trails to prevent maverick spend.",
      },
      {
        title: "Accelerate procurement cycles",
        body: "Move from email chains and paper forms to digital workflows that track requisitions, quotes, POs, goods receipt, and invoices in one system.",
      },
      {
        title: "Connect procurement to finance and operations",
        body: "Integrate procurement portal software with ERP, accounting, inventory, project management, and custom applications so purchasing data flows into budgets, projects, and financial reports.",
      },
      {
        title: "Scale supplier management and compliance",
        body: "Build a procurement management software in Dubai or the wider UAE that supports supplier onboarding, performance scorecards, contract renewals, and compliance documentation. As a partner for supplier management software in Dubai, Vedha Tech can also help connect supplier records, approvals, and risk tracking.",
      },
    ],
    processHeading: "What our procurement systems includes",
    processIntro:
      "Vedha Tech provides procurement systems providers services in UAE for businesses that need a tailored procurement platform, a clearer plan for a procurement programme, or expert support during development and implementation.",
    process: [
      {
        title: "Discovery, requirements, and assessment",
        body: "We work with internal teams and end users to understand purchasing workflows, approval structures, pain points, and compliance needs. We review how procurement moves across departments, locations, and systems to identify inefficiencies and disconnected processes.",
      },
      {
        title: "Platform selection and solution design",
        body: "We define the right procurement software in Dubai requirements, including modules, user roles, workflows, integrations, data, reporting, implementation approach, and evaluation criteria.",
      },
      {
        title: "Custom development and configuration",
        body: "We build and configure the procurement platform, including custom workflows, approval hierarchies, supplier portals, and integrations with existing business systems.",
      },
      {
        title: "Integration and data migration",
        body: "We identify the systems that need to connect with the procurement system and plan data cleansing, migration, validation, and ownership.",
      },
      {
        title: "Implementation, testing, and go-live",
        body: "We manage user acceptance testing, training, cutover planning, and production launch to ensure a stable and adopted system.",
      },
      {
        title: "Post-launch support and optimisation",
        body: "We monitor usage, refine workflows, add integrations, and support new requirements as your procurement environment evolves.",
      },
    ],
    outcomesHeading: "Procurement systems deliverables",
    outcomesIntro:
      "Your procurement systems engagement will be tailored to your organisation's scale, existing systems, and programme objectives. Typical deliverables may include:",
    outcomes: [
      "Procurement readiness assessment and current-state findings",
      "Business process and system gap analysis",
      "Stakeholder requirements and functional needs",
      "Procurement strategy and programme roadmap",
      "Platform evaluation criteria and vendor-selection support (where applicable)",
      "Recommended modules, workflows, user roles, and approval controls",
      "Custom development specifications and configuration documents",
      "Integration architecture and data-migration plan",
      "Test plans, user acceptance scripts, and training materials",
      "Production-ready procurement management software in Dubai or the wider UAE",
    ],
    whyUsHeading: "Why Vedha Tech?",
    whyUs: [
      "Vedha Tech combines procurement consulting with hands-on technical delivery across custom software, integrations, and enterprise systems. For companies looking for procurement software in Dubai or procurement management software in UAE, we bring strategy and execution together with a focus on practical outcomes and clear ownership.",
    ],
    faqHeading: "Frequently asked questions",
    faqs: [
      {
        question: "What does a procurement management system do?",
        answer:
          "A procurement management system handles the entire source-to-pay or procure-to-pay lifecycle. It automates requisitions, approvals, purchase orders, goods receipt, invoice verification, and supplier management while maintaining a central record of vendors, contracts, and spend.",
      },
      {
        question: "Is a procurement system different from ERP?",
        answer:
          "Yes. A procurement system manages workflow, risk, and communication for buying from vendors, including approvals, supplier onboarding, and contract tracking. An ERP manages accounting, finance, and broader operations. The two systems often integrate so procurement data flows into financial reports.",
      },
      {
        question: "How does procurement software reduce costs?",
        answer:
          "Procurement software reduces costs by preventing maverick spend through approval controls, catching invoice errors, and providing spend analytics that help negotiate better vendor deals.",
      },
      {
        question: "Can procurement systems integrate with our existing ERP and accounting software?",
        answer:
          "Yes. Procurement management software can integrate with ERP, CRM, accounting, inventory, project management, and logistics systems. The integration approach depends on your existing stack, data requirements, and workflows that must be connected.",
      },
      {
        question: "What procurement processes can be automated?",
        answer:
          "Common automated processes include purchase requisitions, approval workflows, request-to-quote, purchase order creation, goods receipt, invoice verification, supplier onboarding, contract renewals, and spend reporting. Automation reduces manual errors and speeds up the procure-to-pay cycle.",
      },
    ],
    ctaTitle: "Ready to discuss your procurement requirements?",
    ctaBody:
      "Tell us about your current purchasing processes, operating challenges, and procurement goals. Our Dubai-based team will help you define a clear scope and identify the right next step for your programme.",
    ctaPrimaryLabel: "Discuss your procurement strategy",
    ctaPrimaryHref: "/#book",
    ctaSecondaryLabel: "Explore Enterprise Software solutions",
    ctaSecondaryHref: "/services/enterprise-software/",
    keywords: [
      "procurement management software in dubai",
      "procurement software Dubai",
      "procurement management software UAE",
      "procurement platform software",
      "supplier management software Dubai",
      "Enterprise Software",
      "Vedha Tech",
    ],
  },
  "custom-commerce-platforms": {
    seoTitle: "Custom Commerce Platforms in Dubai, UAE | Vedha Tech",
    seoDescription:
      "Vedha Tech builds custom commerce platforms and headless commerce solutions in UAE for complex catalogues, pricing, and omnichannel experiences. Learn more about bespoke commerce with Vedha.",
    h1: "Custom commerce platforms in Dubai, UAE",
    lede: "Vedha designs and develops custom commerce platforms that give businesses complete control over customer experience, catalogues, pricing, and workflows across web, mobile, and omnichannel touchpoints. Built for B2B, B2C, and omnichannel retailers with complex requirements.",
    whyHeading: "What is custom commerce?",
    whyImportant: [
      "Custom commerce platforms are tailored e-commerce solutions built when standard platforms cannot handle complex product catalogues, dynamic pricing rules, or unique customer workflows. Many custom commerce projects use headless commerce architecture, separating the frontend presentation layer from backend commerce logic to enable completely custom user experiences across channels.",
      "Vedha Tech provides custom commerce solutions in Dubai and the wider UAE for organisations replacing rigid platforms, modernising legacy systems, improving customer experience across channels, or preparing for growth. Our platforms are designed around your business model, industry requirements, current technology, and delivery priorities.",
    ],
    benefits: [],
    howHelpsHeading: "How Vedha Tech helps businesses get more from custom commerce",
    howHelpsIntro:
      "Generic e-commerce platforms often break when faced with complex product configurations, B2B pricing tiers, or multi-channel fulfilment. Vedha Tech builds custom commerce platforms that handle these complexities while maintaining fast performance and seamless user experience.",
    howHelps: [
      {
        title: "Handle complex product and pricing models",
        body: "Support configurable products, B2B tiered pricing, contract-based discounts, and dynamic promotions that standard platforms cannot manage.",
      },
      {
        title: "Deliver seamless omnichannel experience",
        body: "Build headless commerce in UAE that serves web, mobile apps, marketplaces, POS, and IoT devices from a single commerce engine.",
      },
      {
        title: "Integrate with existing business systems",
        body: "Connect custom commerce platforms with ERP, CRM, PIM, WMS, and other systems so orders, inventory, and customer data flow automatically.",
      },
      {
        title: "Scale for growth and performance",
        body: "Build headless commerce platforms in Dubai or the wider UAE that handle high traffic volumes, large catalogues, and complex transactions without performance degradation.",
      },
    ],
    processHeading: "What our custom commerce platforms includes",
    processIntro:
      "Vedha Tech provides custom commerce platforms services in UAE for businesses that need a tailored commerce solution, a clearer plan for a commerce programme, or expert support during development and implementation.",
    process: [
      {
        title: "Discovery, requirements, and assessment",
        body: "We start by understanding customer journeys, product complexity, pricing rules, integration needs, and growth plans. We review how commerce currently works across channels and systems to identify limitations and opportunities.",
      },
      {
        title: "Platform architecture and solution design",
        body: "We define the right custom commerce requirements, including tech stack, headless commerce in UAE approach, integrations, data models, performance targets, and scalability needs.",
      },
      {
        title: "Custom development and configuration",
        body: "We build and configure the commerce platform, including product catalogues, pricing engines, checkout workflows, user accounts, and integrations with existing business systems.",
      },
      {
        title: "Integration and data migration",
        body: "We identify the systems that need to connect with the commerce platform and plan data migration and ownership for products, customers, and orders.",
      },
      {
        title: "Implementation, testing, and go-live",
        body: "We manage user acceptance testing, performance testing, training, cutover planning, and production launch to ensure a stable and adopted platform.",
      },
      {
        title: "Post-launch support and optimisation",
        body: "We monitor performance, conversion rates, and system health, then refine features, add integrations, and support new requirements as your commerce environment evolves.",
      },
    ],
    outcomesHeading: "Custom commerce platforms deliverables",
    outcomesIntro:
      "Your custom commerce platforms engagement will be tailored to your organisation's scale, existing systems, and programme objectives. Typical deliverables may include:",
    outcomes: [
      "Commerce readiness assessment and current-state findings",
      "Customer journey mapping and user experience requirements",
      "Platform architecture and technology stack recommendations",
      "Headless commerce in UAE implementation strategy and roadmap",
      "Custom product catalogue and pricing engine specifications",
      "Checkout, payment, and fulfilment workflow designs",
      "Integration architecture for ERP, CRM, PIM, and WMS systems",
      "Performance benchmarks and scalability testing results",
      "Test plans, user acceptance scripts, and training materials",
      "Production-ready custom commerce platform in Dubai or the wider UAE",
    ],
    whyUsHeading: "Why Vedha Tech?",
    whyUs: [
      "Vedha Tech combines commerce consulting with hands-on technical delivery across custom software, integrations, headless commerce solutions in UAE, and enterprise systems. For companies looking for custom commerce platforms in Dubai or headless commerce solutions in Dubai, we bring strategy and execution together with a focus on practical outcomes and clear ownership.",
    ],
    faqHeading: "Frequently asked questions",
    faqs: [
      {
        question: "What is the difference between custom commerce and standard e-commerce platforms?",
        answer:
          "Custom commerce platforms are built from scratch or heavily customised to handle complex product catalogues, pricing rules, and workflows that standard platforms like Shopify or WooCommerce cannot support. They offer complete flexibility but require more investment in development and maintenance.",
      },
      {
        question: "When should we consider headless commerce in UAE?",
        answer:
          "Headless commerce in UAE is suitable when you need to serve multiple channels (web, mobile apps, marketplaces, IoT devices) from a single commerce backend, or when your frontend needs to be completely customised for brand experience. It separates the frontend presentation layer from the backend commerce logic.",
      },
      {
        question: "Can custom commerce platforms integrate with our existing ERP and CRM?",
        answer:
          "Yes. Custom commerce platforms can integrate with ERP, CRM, PIM, WMS, accounting, logistics, and payment systems. The integration approach depends on your existing stack, data requirements, and the workflows that must be connected.",
      },
      {
        question: "How does custom commerce improve customer experience?",
        answer:
          "Custom commerce allows you to design every aspect of the customer journey, from product discovery and configuration to checkout and post-purchase support. This enables faster load times, personalised experiences, and workflows that match how your customers actually buy.",
      },
      {
        question: "Can Vedha Tech support our commerce platform after launch?",
        answer:
          "Yes. We can support commerce platform optimisation after go-live through performance improvements, feature enhancements, integration support, user training, and further development as your business requirements change.",
      },
    ],
    ctaTitle: "Ready to discuss your commerce requirements?",
    ctaBody:
      "Tell us about your current e-commerce setup, customer experience challenges, and commerce goals. Our Dubai-based team will help you define a clear scope and identify the right next step for your programme.",
    ctaPrimaryLabel: "Discuss your commerce strategy",
    ctaPrimaryHref: "/#book",
    ctaSecondaryLabel: "Explore E-commerce Solutions",
    ctaSecondaryHref: "/services/e-commerce-solutions/",
    keywords: [
      "custom commerce platforms Dubai",
      "headless commerce UAE",
      "headless commerce solutions Dubai",
      "custom commerce solutions Dubai",
      "bespoke commerce UAE",
      "E-commerce Solutions",
      "Vedha Tech",
    ],
  },
  "retail-erp": {
    seoTitle: "Retail ERP in Dubai, UAE | Vedha Tech",
    seoDescription:
      "Vedha Tech delivers retail ERP in UAE for multi-store and omnichannel retailers. Learn how retail ERP software in Dubai unifies POS, inventory, and finance.",
    h1: "Retail ERP in Dubai, UAE",
    lede: "Vedha delivers retail ERP in UAE that connects merchandising, store operations, inventory, purchasing, and finance into a single system for multi-location retailers and omnichannel businesses. Unified retail ERP software for stores, warehouses, and online channels.",
    whyHeading: "What is retail ERP?",
    whyImportant: [
      "Retail ERP is an enterprise resource planning system designed specifically for retail operations. It integrates point-of-sale, inventory management, purchasing, merchandising, customer data, and financial reporting across all sales channels. Successful retail ERP in Dubai requires deep understanding of retail workflows, seasonal demand, and omnichannel fulfilment.",
      "Vedha Tech provides retail ERP solutions for retailers in Dubai and the wider UAE that need to replace fragmented systems, modernise legacy platforms, improve visibility across stores and warehouses, or prepare for expansion. Our approach is designed around your retail model, product complexity, existing technology, and growth plans.",
    ],
    benefits: [],
    howHelpsHeading: "How Vedha Tech helps retailers get more from retail ERP",
    howHelpsIntro:
      "Retail ERP implementations fail when they treat retail like generic distribution or manufacturing. Vedha Tech manages retail ERP projects with deep understanding of POS integration, store replenishment, seasonal buying, and customer experience.",
    howHelps: [
      {
        title: "Unify omnichannel operations",
        body: "Connect physical stores, eCommerce, marketplaces, and warehouses so inventory, pricing, and customer data are consistent across all touchpoints.",
      },
      {
        title: "Improve inventory accuracy and turnover",
        body: "Implement real-time stock visibility, automated replenishment, and demand forecasting to reduce stockouts and excess inventory.",
      },
      {
        title: "Streamline merchandising and buying",
        body: "Centralise supplier management, purchase orders, range planning, and pricing decisions with workflows built for retail buying cycles.",
      },
      {
        title: "Enhance financial and operational reporting",
        body: "Gain real-time visibility into sales performance, gross margin, sell-through rates, and store profitability across all locations.",
      },
    ],
    processHeading: "What our retail ERP includes",
    processIntro:
      "Vedha Tech provides retail ERP in UAE for businesses that need a tailored retail platform, expert configuration support, or experienced project management during an existing implementation.",
    process: [
      {
        title: "Assess retail ERP readiness and requirements",
        body: "We map stakeholders, systems, pain points, and success metrics. We review POS, inventory, eCommerce, and finance processes to identify gaps.",
      },
      {
        title: "Design retail ERP blueprint and architecture",
        body: "We define scope, modules, integrations, data migration, and delivery phases. This includes retail ERP software in Dubai requirements for POS, inventory, merchandising, and finance.",
      },
      {
        title: "Configure and customise retail modules",
        body: "We build the ERP platform, including merchandising, store operations, inventory, purchasing, customer management, and finance modules with retail-specific workflows.",
      },
      {
        title: "Integrate POS, eCommerce, and warehouse systems",
        body: "We identify systems to connect and plan integrations for POS terminals, eCommerce platforms, warehouse management, and third-party logistics.",
      },
      {
        title: "Migrate data, test, and train retail teams",
        body: "We manage data cleansing, migration, and validation for products, customers, suppliers, and transactions. We also conduct UAT and role-based training.",
      },
      {
        title: "Go-live support and post-launch optimisation",
        body: "We monitor system performance, user adoption, and data accuracy during and after go-live, then refine configurations and support new store rollouts.",
      },
    ],
    outcomesHeading: "Retail ERP deliverables",
    outcomesIntro:
      "Your retail ERP engagement will be tailored to your organisation's scale, number of stores, existing systems, and programme objectives. Typical deliverables may include:",
    outcomes: [
      "Retail ERP readiness assessment and current-state findings",
      "Business process mapping for merchandising, stores, and supply chain",
      "Retail ERP blueprint with module scope and workflow designs",
      "POS, eCommerce, and warehouse integration architecture",
      "Data migration plan with product, customer, and supplier cleansing rules",
      "Configuration specifications and retail-specific customisations",
      "Test plans, user acceptance scripts, and performance benchmarks",
      "Role-based training materials for store, warehouse, and head office teams",
      "Go-live support plan and stabilisation checklist",
      "Production-ready retail ERP system in Dubai or the wider UAE",
    ],
    whyUsHeading: "Why Vedha Tech?",
    whyUs: [
      "Vedha Tech combines retail ERP consulting with hands-on technical delivery across custom software, integrations, POS systems, eCommerce platforms, and enterprise systems. As an ERP consultant for retail in UAE, we bring industry-specific knowledge and execution capability together with a focus on practical outcomes and clear ownership.",
      "Vedha Tech can also support your organisation with ongoing retail ERP enhancements, additional store rollouts, new channel integrations, and extended modules as your business requirements change.",
    ],
    faqHeading: "Frequently asked questions",
    faqs: [
      {
        question: "What is the difference between retail ERP and standard ERP?",
        answer:
          "Retail ERP includes modules and workflows specifically designed for retail operations, such as POS integration, store inventory management, merchandising, range planning, and omnichannel fulfillment. Standard ERP lacks these retail-specific capabilities and requires extensive customisation.",
      },
      {
        question: "How long does retail ERP implementation typically take?",
        answer:
          "Retail ERP in UAE timelines depend on number of stores, integrations, data complexity, and decision speed. Most engagements begin with focused discovery, then proceed in clear milestones so leadership can track progress and investment across store rollouts.",
      },
      {
        question: "Can retail ERP integrate with our existing POS and eCommerce platforms?",
        answer:
          "Yes. Retail ERP systems can integrate with major POS systems, eCommerce platforms (Shopify, Magento, WooCommerce), marketplaces, warehouse management, and third-party logistics. The integration approach depends on your existing stack and the data that must flow between systems.",
      },
      {
        question: "What retail business types do you support?",
        answer:
          "We support retail ERP across fashion and apparel, electronics, home and furniture, beauty and cosmetics, FMCG, specialty retail, and omnichannel retailers.",
      },
      {
        question: "Can Vedha Tech support our retail ERP after go-live?",
        answer:
          "Yes. We can support retail ERP optimisation after go-live through configuration improvements, additional store rollouts, new channel integrations, reporting enhancements, user training, and further development as your retail business expands.",
      },
    ],
    ctaTitle: "Ready to discuss your retail ERP requirements?",
    ctaBody:
      "Tell us about your current retail systems, number of stores, sales channels, and retail ERP goals. Our Dubai-based team will help you define a clear scope and identify the right next step for your programme.",
    ctaPrimaryLabel: "Discuss your retail ERP strategy",
    ctaPrimaryHref: "/#book",
    ctaSecondaryLabel: "Explore ERP Solutions",
    ctaSecondaryHref: "/services/erp-solutions/",
    keywords: [
      "retail ERP Dubai",
      "retail ERP UAE",
      "retail ERP software Dubai",
      "ERP consultant retail Dubai",
      "omnichannel retail ERP UAE",
      "ERP Solutions",
      "Vedha Tech",
    ],
  },
};
