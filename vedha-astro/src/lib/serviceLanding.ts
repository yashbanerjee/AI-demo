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
};
