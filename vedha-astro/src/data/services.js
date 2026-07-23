// Vedha service taxonomy — pillars → categories → services.
// Homepage Services.astro and category pages both consume this data; keep names and slugs in sync.

const servicePillars = [
  {
    name: "Consult",
    blurb: "Clarity before code — strategy, audits, and roadmaps that de-risk every build.",
    categories: [
      {
        name: "Technology Consulting & Strategy",
        description:
          "Independent advice that clarifies technology choices before investment. We assess readiness, shape roadmaps, and align platforms with commercial goals.",
        services: [
          {
            name: "Digital transformation strategy",
            description:
              "A board-ready plan that sequences technology change against commercial priorities and operating constraints.",
          },
          {
            name: "Technology audits",
            description:
              "Structured reviews of systems, architecture, and vendor stack to surface risk, waste, and quick wins.",
          },
          {
            name: "Digital maturity assessments",
            description:
              "Benchmarks of people, process, and platform capability that show where the organisation stands today.",
          },
          {
            name: "AI-readiness assessments",
            description:
              "Evaluation of data, process, and governance readiness before AI initiatives are funded.",
          },
          {
            name: "Software feasibility studies",
            description:
              "Evidence-based analysis of whether a proposed build is viable technically, commercially, and operationally.",
          },
          {
            name: "Product and platform strategy",
            description:
              "Direction for product portfolios and shared platforms so investment compounds rather than fragments.",
          },
          {
            name: "Technology roadmaps",
            description:
              "Phased delivery plans that sequence initiatives, dependencies, and funding across quarters.",
          },
          {
            name: "Build-versus-buy analysis",
            description:
              "Decision frameworks comparing custom development against packaged software for a given capability.",
          },
          {
            name: "Software and vendor selection",
            description:
              "Structured evaluation and shortlisting of platforms and vendors against defined business criteria.",
          },
          {
            name: "Legacy modernisation planning",
            description:
              "Migration and replacement strategies that de-risk ageing systems without disrupting operations.",
          },
          {
            name: "Technology cost optimisation",
            description:
              "Identification of licence, infrastructure, and delivery savings while protecting service levels.",
          },
          {
            name: "Fractional CTO services",
            description:
              "Part-time technology leadership for architecture decisions, vendor oversight, and delivery governance.",
          },
        ],
      },
    ],
  },
  {
    name: "Design",
    blurb: "Research-led product design and brand identities built to carry the business.",
    categories: [
      {
        name: "UX/UI & Product Design",
        description:
          "Research-led product design that turns complex workflows into clear, usable interfaces. From discovery through design systems, we shape experiences teams can build and ship with confidence.",
        services: [
          {
            name: "User research",
            description:
              "Direct study of end-user behaviour, needs, and pain points to ground design decisions in evidence.",
          },
          {
            name: "Stakeholder research",
            description:
              "Interviews and workshops that capture business constraints, success metrics, and internal priorities.",
          },
          {
            name: "Customer journey mapping",
            description:
              "End-to-end maps of how customers move across channels, revealing friction and opportunity.",
          },
          {
            name: "Information architecture",
            description:
              "Organisation of content and navigation so users can find what they need without cognitive overload.",
          },
          {
            name: "User-flow design",
            description:
              "Step-by-step paths through critical tasks, designed for clarity, completion, and fewer drop-offs.",
          },
          {
            name: "Wireframing",
            description:
              "Low-fidelity structural layouts that align teams on hierarchy and interaction before visual design.",
          },
          {
            name: "Interactive prototyping",
            description:
              "Clickable models used to validate flows, gather feedback, and reduce rework before engineering.",
          },
          {
            name: "Usability testing",
            description:
              "Observed task testing with real users to measure comprehension, efficiency, and failure points.",
          },
          {
            name: "UX audits",
            description:
              "Expert reviews of existing products against heuristics, accessibility, and task performance.",
          },
          {
            name: "UI design",
            description:
              "High-fidelity interface design covering layout, components, states, and visual consistency.",
          },
          {
            name: "Mobile-app design",
            description:
              "Native-feeling mobile interfaces tailored to iOS and Android patterns and device constraints.",
          },
          {
            name: "Web-application design",
            description:
              "Interface design for complex browser applications where density, clarity, and speed matter.",
          },
          {
            name: "Enterprise-software design",
            description:
              "UX for internal tools that prioritises efficiency, role clarity, and high-volume daily use.",
          },
          {
            name: "Dashboard design",
            description:
              "Data-dense screens that surface the right metrics, filters, and actions for each audience.",
          },
          {
            name: "Design systems",
            description:
              "Reusable component libraries, tokens, and guidelines that keep product UI coherent at scale.",
          },
          {
            name: "Accessibility design",
            description:
              "Inclusive interface design aligned to WCAG practices so products work for a broader user base.",
          },
          {
            name: "Developer handover",
            description:
              "Specs, assets, and interaction notes structured so engineering can implement designs accurately.",
          },
          {
            name: "Design quality assurance",
            description:
              "Post-build design review that checks visual and interaction fidelity against approved designs.",
          },
        ],
      },
      {
        name: "Brand Identity",
        description:
          "Brand systems that give products and organisations a consistent visual and verbal presence. Strategy, naming, and identity assets are built to travel across digital and print touchpoints.",
        services: [
          {
            name: "Brand strategy",
            description:
              "Positioning foundations that define audience, personality, and competitive differentiation.",
          },
          {
            name: "Market positioning",
            description:
              "Clear placement of the brand relative to competitors and buyer expectations.",
          },
          {
            name: "Competitor analysis",
            description:
              "Structured review of rival brands, messaging, and visual language to find white space.",
          },
          {
            name: "Brand naming",
            description:
              "Name development and shortlisting that balances distinctiveness, clarity, and trademark practicality.",
          },
          {
            name: "Brand messaging",
            description:
              "Core narrative, taglines, and tone-of-voice guidance for consistent communication.",
          },
          {
            name: "Value propositions",
            description:
              "Concise statements of customer value that sales, product, and marketing can share.",
          },
          {
            name: "Logo design",
            description:
              "Primary mark and lockups engineered for digital, print, and small-scale use.",
          },
          {
            name: "Visual identity systems",
            description:
              "Cohesive visual language spanning colour, type, imagery, and graphic devices.",
          },
          {
            name: "Colour and typography systems",
            description:
              "Defined palettes and type hierarchies that keep brand expression consistent across channels.",
          },
          {
            name: "Brand guidelines",
            description:
              "Practical rules and examples teams use to apply the brand correctly day to day.",
          },
          {
            name: "Product-brand architecture",
            description:
              "Naming and hierarchy models for product families under a parent brand.",
          },
          {
            name: "Corporate stationery",
            description:
              "Business cards, letterheads, and document templates aligned to the identity system.",
          },
          {
            name: "Proposal and presentation templates",
            description:
              "Slide and proposal layouts that make pitches look intentional and on-brand.",
          },
          {
            name: "Social media systems",
            description:
              "Templates and visual rules for consistent presence across social channels.",
          },
          {
            name: "Website art direction",
            description:
              "Creative direction that sets visual tone, photography style, and layout character for the site.",
          },
          {
            name: "Motion identity",
            description:
              "Motion principles and animated brand moments for digital and video touchpoints.",
          },
          {
            name: "Brand launch support",
            description:
              "Asset packs, rollout sequencing, and application guidance for a controlled brand launch.",
          },
        ],
      },
    ],
  },
  {
    name: "Build",
    blurb: "Software engineered end to end — enterprise platforms, products, apps, and sites.",
    categories: [
      {
        name: "Enterprise Software",
        description:
          "Purpose-built applications that run core operations across people, assets, procurement, and compliance. Each system is tailored to how the organisation actually works.",
        services: [
          {
            name: "Custom enterprise applications",
            description:
              "Bespoke software built around specific operating models that off-the-shelf tools cannot cover.",
          },
          {
            name: "Internal operations platforms",
            description:
              "Central systems that coordinate internal processes, handoffs, and operational data.",
          },
          {
            name: "Employee management systems",
            description:
              "Platforms for workforce records, roles, and HR-related operational workflows.",
          },
          {
            name: "Customer and partner portals",
            description:
              "Secure self-service portals where customers and partners access data, requests, and status.",
          },
          {
            name: "Vendor and contractor portals",
            description:
              "Portals for supplier onboarding, submissions, compliance docs, and collaboration.",
          },
          {
            name: "Procurement systems",
            description:
              "Software that manages requisitions, approvals, purchase orders, and supplier workflows.",
          },
          {
            name: "Asset-management systems",
            description:
              "Tracking and lifecycle control for physical and digital assets across locations.",
          },
          {
            name: "Inventory-management systems",
            description:
              "Stock visibility, movements, and replenishment controls across warehouses and sites.",
          },
          {
            name: "Maintenance-management systems",
            description:
              "Work-order and maintenance scheduling platforms for facilities and equipment.",
          },
          {
            name: "Field-service platforms",
            description:
              "Systems that dispatch, guide, and report on field technicians and on-site work.",
          },
          {
            name: "Document-management systems",
            description:
              "Controlled storage, versioning, and retrieval of business documents and records.",
          },
          {
            name: "Approval-management systems",
            description:
              "Configurable approval chains that route requests to the right owners with audit history.",
          },
          {
            name: "Compliance-management platforms",
            description:
              "Tools that track obligations, evidence, and controls for regulatory and internal policy needs.",
          },
          {
            name: "Property-management systems",
            description:
              "Software for portfolios, leases, tenants, and property operations.",
          },
          {
            name: "Role and permission systems",
            description:
              "Fine-grained access models that define who can see and change what across applications.",
          },
        ],
      },
      {
        name: "ERP Solutions",
        description:
          "End-to-end ERP programmes covering readiness, implementation, integration, and industry-specific modules. We configure, customise, and optimise platforms so finance and operations share one source of truth.",
        services: [
          {
            name: "ERP consulting",
            description:
              "Advisory on ERP scope, platform fit, and programme approach before major spend.",
          },
          {
            name: "ERP-readiness assessments",
            description:
              "Gap analysis of process, data, and organisational readiness ahead of ERP change.",
          },
          {
            name: "ERP implementation",
            description:
              "Full implementation delivery covering configuration, data, training, and go-live.",
          },
          {
            name: "ERP configuration",
            description:
              "Setup of modules, workflows, and master data to match how the business operates.",
          },
          {
            name: "ERP customisation",
            description:
              "Controlled extensions where standard ERP capability cannot meet critical requirements.",
          },
          {
            name: "Custom ERP modules",
            description:
              "Purpose-built modules that extend the ERP for industry or company-specific processes.",
          },
          {
            name: "ERP integrations",
            description:
              "Connections between ERP and surrounding finance, CRM, logistics, and operational systems.",
          },
          {
            name: "ERP migration",
            description:
              "Planned moves of data and processes from legacy ERPs or spreadsheets into the target platform.",
          },
          {
            name: "ERP interface redesign",
            description:
              "Usability improvements to ERP screens and journeys so daily users work faster with fewer errors.",
          },
          {
            name: "ERP dashboards and reporting",
            description:
              "Operational and financial reporting layers that make ERP data actionable for managers.",
          },
          {
            name: "ERP user training",
            description:
              "Role-based training that prepares staff to use the ERP correctly from day one.",
          },
          {
            name: "ERP maintenance and optimisation",
            description:
              "Post-go-live tuning, fixes, and process improvements that keep the ERP performing.",
          },
          {
            name: "Construction ERP",
            description:
              "ERP configurations for project costing, subcontractors, materials, and site operations.",
          },
          {
            name: "Property-management ERP",
            description:
              "ERP setups for property portfolios, leasing, facilities, and tenant billing.",
          },
          {
            name: "Logistics ERP",
            description:
              "ERP capability for warehousing, transport, inventory, and fulfilment operations.",
          },
          {
            name: "Manufacturing ERP",
            description:
              "ERP for production planning, bill of materials, shop-floor control, and inventory.",
          },
          {
            name: "Retail ERP",
            description:
              "ERP covering merchandising, store operations, inventory, and omnichannel retail.",
          },
          {
            name: "Healthcare ERP",
            description:
              "ERP adapted to healthcare operations, inventory, procurement, and administrative controls.",
          },
          {
            name: "Education ERP",
            description:
              "ERP for academic institutions covering finance, administration, and operational workflows.",
          },
          {
            name: "Hospitality ERP",
            description:
              "ERP for hotels and hospitality groups spanning properties, procurement, and finance.",
          },
          {
            name: "Facility-management ERP",
            description:
              "ERP for FM providers managing sites, assets, work orders, and service contracts.",
          },
          {
            name: "Professional-services ERP",
            description:
              "ERP for project-based firms covering utilisation, billing, resources, and delivery.",
          },
        ],
      },
      {
        name: "SaaS & Product Development",
        description:
          "Full-lifecycle product engineering for multi-tenant SaaS and commercial platforms. Discovery, architecture, billing, and ongoing product management sit in one delivery model.",
        services: [
          {
            name: "Product discovery",
            description:
              "Structured exploration of problems, users, and opportunities before committing to a build.",
          },
          {
            name: "Market validation",
            description:
              "Evidence gathering on demand, willingness to pay, and competitive context for a product idea.",
          },
          {
            name: "Product strategy",
            description:
              "Definition of vision, positioning, and capability sequence for a commercial product.",
          },
          {
            name: "MVP planning",
            description:
              "Scope and sequencing for a first release that tests the core value with real users.",
          },
          {
            name: "Product requirements",
            description:
              "Clear functional and non-functional requirements that engineering and design can execute against.",
          },
          {
            name: "UX/UI design",
            description:
              "Product interface design covering flows, components, and visual system for the SaaS experience.",
          },
          {
            name: "Interactive prototyping",
            description:
              "Clickable product prototypes used to validate UX and align stakeholders before development.",
          },
          {
            name: "Technical architecture",
            description:
              "System design covering services, data, tenancy, security, and scalability for the product.",
          },
          {
            name: "SaaS platform development",
            description:
              "Engineering of multi-tenant SaaS applications from core features through production release.",
          },
          {
            name: "Multi-tenant architecture",
            description:
              "Tenant isolation, shared infrastructure, and configuration models for SaaS at scale.",
          },
          {
            name: "Subscription and billing systems",
            description:
              "Plans, invoicing, renewals, and payment flows that monetise the product reliably.",
          },
          {
            name: "Admin portals",
            description:
              "Operator consoles for managing tenants, users, configuration, and support tasks.",
          },
          {
            name: "Product analytics",
            description:
              "Instrumentation and dashboards that show activation, retention, and feature usage.",
          },
          {
            name: "Product launch support",
            description:
              "Go-to-market technical readiness covering environments, onboarding, and launch checklists.",
          },
          {
            name: "Product optimisation",
            description:
              "Iterative improvements to conversion, performance, and feature effectiveness after launch.",
          },
          {
            name: "Ongoing product management",
            description:
              "Continuous prioritisation, backlog ownership, and release planning for the live product.",
          },
          {
            name: "Product modernisation",
            description:
              "Upgrades to ageing product stacks, UX, and architecture while preserving existing customers.",
          },
        ],
      },
      {
        name: "Web Application Development",
        description:
          "Browser-based applications for portals, workflows, bookings, and collaboration. We build secure, scalable web systems that staff and customers rely on daily.",
        services: [
          {
            name: "Customer portals",
            description:
              "Authenticated web experiences where customers manage accounts, requests, and service status.",
          },
          {
            name: "Employee portals",
            description:
              "Internal web hubs for HR, knowledge, tools, and day-to-day employee self-service.",
          },
          {
            name: "Admin platforms",
            description:
              "Back-office web applications for configuration, oversight, and operational control.",
          },
          {
            name: "Booking systems",
            description:
              "Scheduling and reservation applications with availability, confirmations, and payments.",
          },
          {
            name: "Marketplace platforms",
            description:
              "Multi-sided web platforms connecting buyers and sellers with listings, orders, and trust controls.",
          },
          {
            name: "Membership platforms",
            description:
              "Applications for member registration, entitlements, renewals, and gated content or services.",
          },
          {
            name: "Learning-management systems",
            description:
              "Web platforms for courses, enrolments, progress tracking, and assessments.",
          },
          {
            name: "Workflow applications",
            description:
              "Task-routing web apps that encode business processes with statuses, owners, and SLAs.",
          },
          {
            name: "Project-management systems",
            description:
              "Web tools for plans, tasks, resources, and delivery tracking across teams.",
          },
          {
            name: "Financial applications",
            description:
              "Browser-based tools for finance workflows such as invoicing, expenses, or reconciliations.",
          },
          {
            name: "Reporting portals",
            description:
              "Secure portals where stakeholders access curated reports and operational metrics.",
          },
          {
            name: "Self-service platforms",
            description:
              "Applications that let users complete service requests without contacting support.",
          },
          {
            name: "Progressive web applications",
            description:
              "Installable web apps that deliver app-like speed, offline resilience, and mobile reach.",
          },
          {
            name: "Real-time collaborative applications",
            description:
              "Multi-user web apps with live updates for co-editing, messaging, or shared workspaces.",
          },
        ],
      },
      {
        name: "Mobile Application Development",
        description:
          "Native and cross-platform mobile products for consumers, field teams, and employees. Design, engineering, store deployment, and maintenance are covered end to end.",
        services: [
          {
            name: "iOS applications",
            description:
              "Native iPhone and iPad apps built to Apple platform standards and store requirements.",
          },
          {
            name: "Android applications",
            description:
              "Native Android apps engineered for device diversity, performance, and Play Store release.",
          },
          {
            name: "Cross-platform applications",
            description:
              "Shared-codebase mobile apps that deliver native-quality experiences on iOS and Android.",
          },
          {
            name: "Consumer mobile apps",
            description:
              "Public-facing apps focused on engagement, retention, and smooth consumer journeys.",
          },
          {
            name: "Enterprise mobile apps",
            description:
              "Secure mobile tools for workforce productivity, approvals, and internal operations.",
          },
          {
            name: "Field-service apps",
            description:
              "Mobile apps for technicians capturing jobs, checklists, photos, and status from site.",
          },
          {
            name: "Employee apps",
            description:
              "Mobile workplaces for communications, HR self-service, and internal tools on the go.",
          },
          {
            name: "Event and attendee apps",
            description:
              "Apps for agendas, networking, check-in, and attendee engagement around events.",
          },
          {
            name: "E-commerce apps",
            description:
              "Mobile shopping experiences with catalogues, carts, checkout, and order tracking.",
          },
          {
            name: "Loyalty apps",
            description:
              "Apps that manage rewards, points, offers, and member engagement programmes.",
          },
          {
            name: "Booking apps",
            description:
              "Mobile scheduling for appointments, services, or resources with notifications and payments.",
          },
          {
            name: "Delivery and tracking apps",
            description:
              "Apps for couriers and customers covering assignments, live location, and proof of delivery.",
          },
          {
            name: "Existing application redesign",
            description:
              "UX and technical refresh of an ageing mobile app without discarding core product value.",
          },
          {
            name: "App Store and Play Store deployment",
            description:
              "Release preparation, store listing setup, and submission through Apple and Google review.",
          },
          {
            name: "Application maintenance",
            description:
              "Ongoing fixes, OS updates, and dependency care that keep mobile apps stable after launch.",
          },
        ],
      },
      {
        name: "Website Design & Development",
        description:
          "Marketing and corporate websites engineered for clarity, performance, and content ownership. Design, CMS, SEO foundations, and ongoing maintenance are delivered as one practice.",
        services: [
          {
            name: "Corporate websites",
            description:
              "Company sites that present brand, capability, and credibility with clear information architecture.",
          },
          {
            name: "Technology company websites",
            description:
              "Sites for technology firms that explain complex offerings without burying the value proposition.",
          },
          {
            name: "Startup websites",
            description:
              "Lean, conversion-focused sites that communicate product story and capture early demand.",
          },
          {
            name: "Product websites",
            description:
              "Marketing sites that showcase product features, use cases, and paths to trial or purchase.",
          },
          {
            name: "Service-business websites",
            description:
              "Sites for professional and service firms that generate enquiries and explain delivery clearly.",
          },
          {
            name: "Campaign landing pages",
            description:
              "Focused pages built for a single campaign goal with tight messaging and conversion paths.",
          },
          {
            name: "E-commerce websites",
            description:
              "Storefront websites with catalogue, cart, and checkout tailored to brand and merchandising needs.",
          },
          {
            name: "Membership websites",
            description:
              "Sites with gated areas, member accounts, and content or benefit access controls.",
          },
          {
            name: "Multilingual websites",
            description:
              "Sites structured for multiple languages with content workflows and locale-aware UX.",
          },
          {
            name: "Recruitment websites",
            description:
              "Careers sites and job experiences that attract candidates and streamline applications.",
          },
          {
            name: "Investor websites",
            description:
              "Sites for investor relations covering disclosures, updates, and institutional information needs.",
          },
          {
            name: "Website redesign",
            description:
              "Full redesign of an existing site to improve structure, design, and conversion performance.",
          },
          {
            name: "Website migration",
            description:
              "Planned moves between platforms or hosts with URL integrity, content transfer, and SEO care.",
          },
          {
            name: "CMS implementation",
            description:
              "Content management setup so marketing teams can publish and update without engineering.",
          },
          {
            name: "Website performance optimisation",
            description:
              "Speed and Core Web Vitals improvements that reduce load time and improve user experience.",
          },
          {
            name: "Technical SEO",
            description:
              "Crawlability, indexing, schema, and site-structure work that supports organic discovery.",
          },
          {
            name: "Website maintenance",
            description:
              "Ongoing updates, content support, and technical care that keep the site secure and current.",
          },
        ],
      },
      {
        name: "E-commerce Solutions",
        description:
          "Online commerce platforms spanning strategy, storefronts, catalogues, payments, and fulfilment integrations. Built for B2C and B2B revenue, with analytics that show what converts.",
        services: [
          {
            name: "E-commerce strategy",
            description:
              "Commercial and channel strategy for how products, pricing, and fulfilment should work online.",
          },
          {
            name: "Online store development",
            description:
              "End-to-end build of storefronts covering catalogue, cart, checkout, and order management.",
          },
          {
            name: "Shopify implementation",
            description:
              "Shopify store setup, theme customisation, and app configuration for launch-ready commerce.",
          },
          {
            name: "Custom commerce platforms",
            description:
              "Bespoke commerce engines when catalogue, pricing, or workflow needs exceed packaged tools.",
          },
          {
            name: "B2B ordering portals",
            description:
              "Account-based ordering experiences with negotiated pricing, bulk orders, and approval flows.",
          },
          {
            name: "Marketplace development",
            description:
              "Multi-vendor marketplace platforms with listings, commissions, and seller operations.",
          },
          {
            name: "Subscription commerce",
            description:
              "Recurring commerce models with plans, renewals, dunning, and subscriber management.",
          },
          {
            name: "Product catalogue systems",
            description:
              "Structured product data, variants, and merchandising controls for large catalogues.",
          },
          {
            name: "Inventory integrations",
            description:
              "Connections between storefronts and warehouse or ERP stock so availability stays accurate.",
          },
          {
            name: "Payment integrations",
            description:
              "Secure payment gateway connections covering cards, local methods, and settlement flows.",
          },
          {
            name: "Logistics integrations",
            description:
              "Links to carriers and fulfilment partners for rates, labels, tracking, and returns.",
          },
          {
            name: "Customer-account portals",
            description:
              "Self-service areas for orders, addresses, invoices, and account preferences.",
          },
          {
            name: "Loyalty integrations",
            description:
              "Connections between commerce platforms and loyalty or rewards programmes.",
          },
          {
            name: "Recommendation systems",
            description:
              "Product recommendation engines that surface relevant items across browse and checkout.",
          },
          {
            name: "Abandoned-cart automation",
            description:
              "Triggered recovery journeys that re-engage shoppers who leave before purchase.",
          },
          {
            name: "E-commerce analytics",
            description:
              "Commerce measurement covering conversion funnels, product performance, and revenue drivers.",
          },
          {
            name: "Conversion optimisation",
            description:
              "Experimentation and UX improvements focused on increasing completed purchases.",
          },
        ],
      },
    ],
  },
  {
    name: "Automate",
    blurb: "Workflows, CRM, and marketing systems that run the busywork for you.",
    categories: [
      {
        name: "Business Automation",
        description:
          "Process automation that removes repetitive work from approvals, documents, finance, and support. We map workflows, implement bots and AI assist, then monitor what runs in production.",
        services: [
          {
            name: "Workflow analysis and optimisation",
            description:
              "Mapping and redesign of business processes to remove waste before automation is applied.",
          },
          {
            name: "Approval workflow automation",
            description:
              "Digitised approval chains that route requests, capture decisions, and retain audit trails.",
          },
          {
            name: "Data-entry automation",
            description:
              "Rules and bots that move structured data between systems without manual rekeying.",
          },
          {
            name: "Document-processing automation",
            description:
              "Extraction and routing of information from invoices, forms, and other documents.",
          },
          {
            name: "Sales and follow-up automation",
            description:
              "Triggered sequences that keep leads and opportunities moving without manual chasing.",
          },
          {
            name: "Invoice and payment automation",
            description:
              "Automated invoicing, reminders, and payment status updates across finance workflows.",
          },
          {
            name: "Employee onboarding automation",
            description:
              "Orchestrated provisioning, checklists, and notifications for new-hire setup.",
          },
          {
            name: "Customer-support automation",
            description:
              "Ticket routing, macros, and self-service flows that reduce repetitive support load.",
          },
          {
            name: "Reporting automation",
            description:
              "Scheduled report generation and distribution from operational and financial systems.",
          },
          {
            name: "Notification automation",
            description:
              "Event-driven alerts across email, SMS, or chat when business conditions change.",
          },
          {
            name: "Robotic process automation",
            description:
              "Software robots that execute repetitive UI or system tasks across existing applications.",
          },
          {
            name: "AI-assisted automation",
            description:
              "Automation augmented with AI for classification, extraction, and decision support.",
          },
          {
            name: "Cross-department workflow integration",
            description:
              "End-to-end process wiring across teams so handoffs do not stall between systems.",
          },
          {
            name: "Automation monitoring and support",
            description:
              "Runtime oversight, exception handling, and fixes that keep automations reliable.",
          },
        ],
      },
      {
        name: "CRM & Sales Systems",
        description:
          "CRM platforms configured around how your sales team wins deals. Pipelines, lead routing, forecasting, and channel integrations keep customer data in one operational system.",
        services: [
          {
            name: "CRM consulting and strategy",
            description:
              "Advice on CRM operating model, platform choice, and adoption approach before implementation.",
          },
          {
            name: "CRM implementation",
            description:
              "Configuration and rollout of CRM platforms around pipelines, objects, and team processes.",
          },
          {
            name: "Custom CRM development",
            description:
              "Bespoke CRM applications when packaged tools cannot match the sales operating model.",
          },
          {
            name: "CRM migration",
            description:
              "Controlled transfer of accounts, contacts, history, and pipelines into a new CRM.",
          },
          {
            name: "Sales pipeline configuration",
            description:
              "Stage definitions, required fields, and governance that make pipeline data trustworthy.",
          },
          {
            name: "Lead capture and routing",
            description:
              "Inbound lead intake with ownership rules that get the right rep involved quickly.",
          },
          {
            name: "Lead-scoring systems",
            description:
              "Scoring models that prioritise leads based on fit and engagement signals.",
          },
          {
            name: "Opportunity management",
            description:
              "Structured deal tracking covering stages, stakeholders, products, and forecasts.",
          },
          {
            name: "Proposal and quotation systems",
            description:
              "Tools that generate quotes and proposals from CRM data with approval controls.",
          },
          {
            name: "Sales follow-up automation",
            description:
              "Automated reminders and sequences that keep reps on schedule after every touch.",
          },
          {
            name: "Customer lifecycle management",
            description:
              "CRM processes spanning acquisition, retention, expansion, and renewal moments.",
          },
          {
            name: "Account-management systems",
            description:
              "Tools for strategic accounts covering relationships, plans, and service history.",
          },
          {
            name: "Sales forecasting",
            description:
              "Pipeline-based forecasting models and views that support management planning.",
          },
          {
            name: "CRM dashboards",
            description:
              "Role-based dashboards for pipeline health, activity, and revenue performance.",
          },
          {
            name: "WhatsApp, email and telephony integrations",
            description:
              "Channel connections that log conversations and calls against CRM records.",
          },
          {
            name: "CRM and ERP integrations",
            description:
              "Synchronisation of customers, orders, and finance data between CRM and ERP.",
          },
        ],
      },
      {
        name: "Marketing Technology",
        description:
          "Martech stacks that connect capture, nurture, attribution, and personalisation. Audits, automation, and data integration keep campaigns measurable and sales-aligned.",
        services: [
          {
            name: "Marketing technology audits",
            description:
              "Reviews of the martech stack to find gaps, overlap, and integration weaknesses.",
          },
          {
            name: "CRM implementation",
            description:
              "CRM setup oriented to marketing and sales handoffs, attribution, and lead lifecycle.",
          },
          {
            name: "Marketing automation",
            description:
              "Campaign orchestration across channels with triggers, nurtures, and audience rules.",
          },
          {
            name: "Lead-capture systems",
            description:
              "Forms, tracking, and routing that convert website interest into actionable leads.",
          },
          {
            name: "Landing-page systems",
            description:
              "Reusable landing-page infrastructure for rapid campaign launches and testing.",
          },
          {
            name: "Email automation",
            description:
              "Triggered and scheduled email programmes with segmentation and deliverability hygiene.",
          },
          {
            name: "Lead-scoring models",
            description:
              "Marketing-led scoring that ranks prospects by engagement and demographic fit.",
          },
          {
            name: "Campaign tracking",
            description:
              "UTM, pixel, and event instrumentation that attributes activity to campaigns correctly.",
          },
          {
            name: "Analytics implementation",
            description:
              "Web and product analytics setup with events, goals, and reporting foundations.",
          },
          {
            name: "Attribution dashboards",
            description:
              "Views that show which channels and campaigns contribute to pipeline and revenue.",
          },
          {
            name: "Customer segmentation",
            description:
              "Audience models based on behaviour, value, and lifecycle stage for targeted outreach.",
          },
          {
            name: "Personalisation systems",
            description:
              "Content and offer personalisation driven by profile, behaviour, or segment data.",
          },
          {
            name: "Sales and marketing integration",
            description:
              "Shared definitions, SLAs, and data flows that align marketing output with sales intake.",
          },
          {
            name: "A/B testing infrastructure",
            description:
              "Experimentation tooling and process for testing pages, creatives, and journeys.",
          },
          {
            name: "Conversion-rate optimisation",
            description:
              "Systematic improvements to funnels based on analytics, testing, and UX findings.",
          },
          {
            name: "Marketing data integration",
            description:
              "Pipelines that unify CRM, ads, web, and product data for a coherent marketing view.",
          },
        ],
      },
    ],
  },
  {
    name: "Intelligence",
    blurb: "AI assistants, analytics, and data platforms working quietly behind the business.",
    categories: [
      {
        name: "AI Solutions",
        description:
          "Applied AI for assistants, search, extraction, and decision support inside enterprise workflows. Strategy, private deployment options, and governance sit alongside the build.",
        services: [
          {
            name: "AI strategy and consulting",
            description:
              "Practical guidance on where AI creates value, what to build first, and how to govern it.",
          },
          {
            name: "AI opportunity assessments",
            description:
              "Prioritised use-case reviews weighing impact, feasibility, data readiness, and risk.",
          },
          {
            name: "Custom AI assistants",
            description:
              "Task-specific assistants trained or prompted on your workflows, tools, and policies.",
          },
          {
            name: "Enterprise knowledge assistants",
            description:
              "Secure assistants that answer from approved internal documents and knowledge bases.",
          },
          {
            name: "AI customer-support systems",
            description:
              "AI layers for ticket triage, suggested replies, and self-service answer retrieval.",
          },
          {
            name: "AI sales assistants",
            description:
              "Assistants that draft outreach, summarise accounts, and support next-best-action guidance.",
          },
          {
            name: "AI workflow agents",
            description:
              "Agents that execute multi-step business tasks across systems under defined controls.",
          },
          {
            name: "Document extraction and processing",
            description:
              "AI that pulls structured fields from invoices, contracts, forms, and other documents.",
          },
          {
            name: "AI-powered search",
            description:
              "Semantic and hybrid search over enterprise content that improves findability.",
          },
          {
            name: "Recommendation engines",
            description:
              "Models that suggest products, content, or actions based on user and item signals.",
          },
          {
            name: "Predictive analytics",
            description:
              "Models that forecast demand, risk, churn, or outcomes from historical operational data.",
          },
          {
            name: "Natural-language data querying",
            description:
              "Interfaces that let users ask business questions in plain language against governed data.",
          },
          {
            name: "Voice AI applications",
            description:
              "Speech-driven assistants and IVR experiences for support, intake, or internal tools.",
          },
          {
            name: "Private and on-premise AI",
            description:
              "AI deployments that keep models and data inside private cloud or on-premise environments.",
          },
          {
            name: "AI governance and monitoring",
            description:
              "Policies, evaluation, and runtime monitoring that keep AI outputs safe and accountable.",
          },
        ],
      },
      {
        name: "Data & Business Intelligence",
        description:
          "Data platforms and analytics that turn operational systems into reliable insight. Architecture, pipelines, warehouses, and role-specific dashboards give leaders a trusted view of performance.",
        services: [
          {
            name: "Data strategy",
            description:
              "A practical plan for what data to collect, own, and use to support decisions and products.",
          },
          {
            name: "Data architecture",
            description:
              "Structural design of sources, models, and platforms that keep data consistent and usable.",
          },
          {
            name: "Database design",
            description:
              "Schema and storage design optimised for integrity, query patterns, and growth.",
          },
          {
            name: "Data integration",
            description:
              "Connections that bring data from multiple systems into coherent, usable datasets.",
          },
          {
            name: "Data pipelines",
            description:
              "Automated flows that extract, transform, and load data on reliable schedules or events.",
          },
          {
            name: "Data warehouses",
            description:
              "Analytical stores structured for reporting, history, and cross-system analysis.",
          },
          {
            name: "Data lakes",
            description:
              "Flexible storage layers for raw and semi-structured data used in analytics and AI.",
          },
          {
            name: "ETL and ELT development",
            description:
              "Transformation pipelines that prepare source data for analytics and operational use.",
          },
          {
            name: "Data cleaning",
            description:
              "Rules and processes that fix duplicates, nulls, and inconsistencies before data is trusted.",
          },
          {
            name: "Data migration",
            description:
              "Planned transfers of datasets between systems with validation and cutover controls.",
          },
          {
            name: "Master-data management",
            description:
              "Golden-record approaches for customers, products, and other critical shared entities.",
          },
          {
            name: "Data-quality monitoring",
            description:
              "Ongoing checks and alerts that detect quality drift before it reaches reports.",
          },
          {
            name: "Real-time data synchronisation",
            description:
              "Near-real-time sync patterns that keep operational systems aligned as events happen.",
          },
          {
            name: "Business intelligence implementation",
            description:
              "BI platform setup covering models, semantic layers, and governed reporting access.",
          },
          {
            name: "Embedded analytics",
            description:
              "Analytics experiences built into products so users see insight in context of their work.",
          },
          {
            name: "Predictive analytics",
            description:
              "Forecasting and scoring models delivered through dashboards or operational systems.",
          },
          {
            name: "Executive dashboards",
            description:
              "Leadership views of KPIs, trends, and exceptions designed for quick decision-making.",
          },
          {
            name: "Financial dashboards",
            description:
              "Finance-focused views covering P&L, cash, margins, and related control metrics.",
          },
          {
            name: "Sales dashboards",
            description:
              "Pipeline, revenue, and activity dashboards for sales leaders and account teams.",
          },
          {
            name: "Operations dashboards",
            description:
              "Live operational metrics that track throughput, SLAs, bottlenecks, and capacity.",
          },
          {
            name: "Marketing dashboards",
            description:
              "Campaign, funnel, and channel performance views for marketing decision-makers.",
          },
          {
            name: "HR dashboards",
            description:
              "Workforce analytics covering headcount, attrition, hiring, and related people metrics.",
          },
          {
            name: "Inventory dashboards",
            description:
              "Stock, movement, and availability views that support replenishment and fulfilment.",
          },
          {
            name: "Project dashboards",
            description:
              "Delivery views for progress, budget burn, risks, and resource utilisation.",
          },
          {
            name: "Customer-service dashboards",
            description:
              "Support metrics covering volume, SLA, resolution quality, and backlog health.",
          },
          {
            name: "Custom reporting portals",
            description:
              "Secure portals where stakeholders access tailored reports without raw-database access.",
          },
        ],
      },
    ],
  },
  {
    name: "Connect",
    blurb: "APIs, middleware, and integrations that make every system talk to every other.",
    categories: [
      {
        name: "API & Systems Integration",
        description:
          "Integration engineering that connects ERPs, CRMs, payments, and legacy platforms through APIs and middleware. Secure interfaces, sync patterns, and monitoring keep data moving reliably.",
        services: [
          {
            name: "Custom API development",
            description:
              "Purpose-built APIs that expose business capabilities securely to apps and partners.",
          },
          {
            name: "REST APIs",
            description:
              "RESTful interfaces designed for predictable resources, auth, and client consumption.",
          },
          {
            name: "GraphQL APIs",
            description:
              "GraphQL schemas and resolvers that let clients fetch exactly the data they need.",
          },
          {
            name: "Third-party integrations",
            description:
              "Connections to external SaaS and vendor platforms for data and process continuity.",
          },
          {
            name: "Legacy-system integrations",
            description:
              "Bridges that let modern applications work with older systems without full replacement.",
          },
          {
            name: "ERP integrations",
            description:
              "Interfaces that sync ERP master data, transactions, and statuses with surrounding tools.",
          },
          {
            name: "CRM integrations",
            description:
              "Bi-directional CRM links for leads, accounts, activities, and commercial records.",
          },
          {
            name: "Payment-gateway integrations",
            description:
              "Secure payment processing connections with reconciliation and status handling.",
          },
          {
            name: "Accounting integrations",
            description:
              "Links between operational systems and accounting platforms for invoices and ledgers.",
          },
          {
            name: "Government-platform integrations",
            description:
              "Integrations with official portals and APIs for filings, identity, or compliance data.",
          },
          {
            name: "Logistics integrations",
            description:
              "Carrier and WMS connections for rates, shipments, tracking, and delivery events.",
          },
          {
            name: "Authentication integrations",
            description:
              "SSO, OAuth, and identity-provider connections that centralise sign-in.",
          },
          {
            name: "Email, SMS and WhatsApp integrations",
            description:
              "Messaging channel integrations for transactional and operational communications.",
          },
          {
            name: "Maps and location integrations",
            description:
              "Mapping, geocoding, and location services embedded into applications and workflows.",
          },
          {
            name: "Middleware development",
            description:
              "Integration layers that orchestrate transformations, routing, and system mediation.",
          },
          {
            name: "Webhook implementation",
            description:
              "Event callbacks that notify downstream systems when business events occur.",
          },
          {
            name: "Data synchronisation",
            description:
              "Reliable sync jobs and patterns that keep records consistent across applications.",
          },
          {
            name: "API security and documentation",
            description:
              "Auth, rate limits, and developer docs that make APIs safe and usable.",
          },
          {
            name: "Integration monitoring",
            description:
              "Observability for integrations covering failures, latency, and data-volume anomalies.",
          },
        ],
      },
    ],
  },
  {
    name: "Scale",
    blurb: "Visibility, infrastructure, security, and quality engineering for growth.",
    categories: [
      {
        name: "Search & AI Visibility",
        description:
          "Search and AI-visibility work that improves how brands appear in classic search and answer engines. Technical SEO, structured content, and reporting keep discovery measurable.",
        services: [
          {
            name: "Technical SEO audits",
            description:
              "Crawl, index, and site-health reviews that identify technical blockers to organic visibility.",
          },
          {
            name: "Keyword research",
            description:
              "Search-demand analysis that maps topics and intent to content and product opportunities.",
          },
          {
            name: "Competitor-gap analysis",
            description:
              "Comparison of competitor search coverage to find missing topics and ranking opportunities.",
          },
          {
            name: "Content opportunity mapping",
            description:
              "Prioritised content themes and page types that can realistically capture demand.",
          },
          {
            name: "On-page SEO",
            description:
              "Title, heading, internal-link, and content structure work that improves page relevance.",
          },
          {
            name: "Structured data",
            description:
              "Schema markup that helps search engines understand entities, products, and page types.",
          },
          {
            name: "Local search optimisation",
            description:
              "Local presence work across listings, NAP consistency, and location-focused pages.",
          },
          {
            name: "Search Console setup",
            description:
              "Configuration and verification of Search Console for monitoring and issue resolution.",
          },
          {
            name: "Website performance improvement",
            description:
              "Speed and technical performance work that supports both UX and search rankings.",
          },
          {
            name: "AI-search visibility audits",
            description:
              "Reviews of how the brand appears in AI answers and generative search experiences.",
          },
          {
            name: "AI brand-mention monitoring",
            description:
              "Tracking of brand references across AI and answer surfaces to catch gaps and risks.",
          },
          {
            name: "Entity and knowledge optimisation",
            description:
              "Strengthening of brand entities, attributes, and corroborating sources for AI retrieval.",
          },
          {
            name: "AI-readable content structuring",
            description:
              "Content organisation that machines can parse accurately for summaries and answers.",
          },
          {
            name: "Answer-engine optimisation",
            description:
              "Tactics that improve inclusion and accuracy in answer engines and AI overviews.",
          },
          {
            name: "Search and AI visibility reporting",
            description:
              "Recurring reporting on rankings, visibility, and AI mention trends with clear actions.",
          },
        ],
      },
      {
        name: "Cloud, DevOps & Infrastructure",
        description:
          "Cloud and infrastructure engineering for reliable deployment, scaling, and recovery. Architecture, CI/CD, monitoring, and cost control keep environments production-ready.",
        services: [
          {
            name: "Cloud architecture",
            description:
              "Design of cloud environments covering services, networking, security boundaries, and scale.",
          },
          {
            name: "Cloud migration",
            description:
              "Planned moves of applications and data to cloud platforms with cutover and rollback plans.",
          },
          {
            name: "Application deployment",
            description:
              "Release processes and tooling that get applications into production safely and repeatedly.",
          },
          {
            name: "Server setup",
            description:
              "Provisioning and hardening of servers for application, database, and supporting services.",
          },
          {
            name: "Containerisation",
            description:
              "Packaging applications with Docker or equivalent for consistent build and runtime behaviour.",
          },
          {
            name: "CI/CD pipelines",
            description:
              "Automated build, test, and deploy pipelines that shorten release cycles with quality gates.",
          },
          {
            name: "Infrastructure automation",
            description:
              "Infrastructure-as-code and automation that make environments reproducible and auditable.",
          },
          {
            name: "Environment configuration",
            description:
              "Consistent setup of development, staging, and production with secrets and config managed safely.",
          },
          {
            name: "Database deployment",
            description:
              "Provisioned database environments with backups, access controls, and migration support.",
          },
          {
            name: "Monitoring and logging",
            description:
              "Observability stacks that surface errors, latency, and infrastructure health early.",
          },
          {
            name: "Backup and disaster recovery",
            description:
              "Backup strategies and recovery plans tested against defined recovery objectives.",
          },
          {
            name: "Performance optimisation",
            description:
              "Infrastructure and application tuning that improves response times and resource efficiency.",
          },
          {
            name: "Cloud cost optimisation",
            description:
              "Rightsizing, reserved capacity, and waste reduction that lower cloud spend without outages.",
          },
          {
            name: "Application scaling",
            description:
              "Horizontal and vertical scaling patterns that keep applications stable under load.",
          },
          {
            name: "Reliability engineering",
            description:
              "Practices and tooling that improve uptime, fault tolerance, and incident recovery.",
          },
          {
            name: "On-premise deployment",
            description:
              "Infrastructure and application deployment inside customer-controlled data centres.",
          },
          {
            name: "Hybrid infrastructure",
            description:
              "Architectures that combine cloud and on-premise systems under unified operations.",
          },
        ],
      },
      {
        name: "Cybersecurity & Compliance",
        description:
          "Security and compliance practices that harden applications, identities, and data handling. Assessments, controls, remediation, and readiness support reduce operational risk.",
        services: [
          {
            name: "Security assessments",
            description:
              "Structured reviews of systems and controls that identify vulnerabilities and exposure.",
          },
          {
            name: "Application security reviews",
            description:
              "Code and architecture reviews focused on common application attack surfaces.",
          },
          {
            name: "Access-control architecture",
            description:
              "Design of authentication and authorisation models that enforce least privilege.",
          },
          {
            name: "Identity and authentication systems",
            description:
              "Implementation of identity providers, SSO, and secure sign-in for users and admins.",
          },
          {
            name: "Multi-factor authentication",
            description:
              "MFA rollout that adds a second factor without creating unusable login friction.",
          },
          {
            name: "Role and permission management",
            description:
              "Role models and permission matrices that keep sensitive actions limited to the right people.",
          },
          {
            name: "Data encryption",
            description:
              "Encryption in transit and at rest configured to protect sensitive business data.",
          },
          {
            name: "Security logging and audit trails",
            description:
              "Logging designs that capture security-relevant events for investigation and compliance.",
          },
          {
            name: "Backup and recovery planning",
            description:
              "Security-aware backup plans that support recovery after ransomware or data loss.",
          },
          {
            name: "Security policies",
            description:
              "Practical policy documents covering acceptable use, access, and incident expectations.",
          },
          {
            name: "Vendor-risk assessments",
            description:
              "Reviews of third-party security posture before and during commercial relationships.",
          },
          {
            name: "Secure development practices",
            description:
              "Engineering habits, reviews, and tooling that reduce vulnerabilities before release.",
          },
          {
            name: "Compliance-readiness support",
            description:
              "Preparation for frameworks and audits with evidence, control mapping, and gap closure.",
          },
          {
            name: "Vulnerability remediation",
            description:
              "Prioritised fixing of identified vulnerabilities with verification that issues are closed.",
          },
          {
            name: "Incident-response planning",
            description:
              "Playbooks and roles that guide containment, communication, and recovery during incidents.",
          },
          {
            name: "Security-awareness training",
            description:
              "Practical training that helps staff recognise phishing, social engineering, and unsafe habits.",
          },
        ],
      },
      {
        name: "Software Quality Assurance",
        description:
          "Quality engineering across functional, performance, accessibility, and release readiness. Manual and automated testing protect releases before customers see them.",
        services: [
          {
            name: "QA strategy",
            description:
              "A testing approach that matches risk, release cadence, and product complexity.",
          },
          {
            name: "Functional testing",
            description:
              "Verification that features behave according to requirements across primary user paths.",
          },
          {
            name: "Regression testing",
            description:
              "Repeatable checks that confirm existing behaviour still works after changes.",
          },
          {
            name: "Cross-browser testing",
            description:
              "Validation of critical journeys across supported browsers and rendering engines.",
          },
          {
            name: "Mobile-device testing",
            description:
              "Device and OS matrix testing for layout, performance, and interaction issues on mobile.",
          },
          {
            name: "API testing",
            description:
              "Contract and behaviour testing of APIs for correctness, errors, and edge cases.",
          },
          {
            name: "Integration testing",
            description:
              "End-to-end checks that connected systems exchange data and trigger processes correctly.",
          },
          {
            name: "Usability testing",
            description:
              "Task-based evaluation of whether users can complete journeys without confusion.",
          },
          {
            name: "Accessibility testing",
            description:
              "Checks against accessibility standards so interfaces remain usable with assistive tech.",
          },
          {
            name: "Performance testing",
            description:
              "Load and stress testing that reveals bottlenecks before users hit them in production.",
          },
          {
            name: "Automated testing",
            description:
              "Automated test suites wired into CI so regressions are caught early and often.",
          },
          {
            name: "User acceptance testing",
            description:
              "Structured UAT facilitation so business owners can sign off against real scenarios.",
          },
          {
            name: "Bug tracking",
            description:
              "Defect lifecycle management from discovery through triage, fix, and verification.",
          },
          {
            name: "Release-readiness assessments",
            description:
              "Go/no-go evaluations of quality, risk, and open defects before a release ships.",
          },
          {
            name: "Quality dashboards",
            description:
              "Visibility into test coverage, defect trends, and release health for delivery teams.",
          },
        ],
      },
      {
        name: "Legacy System Modernisation",
        description:
          "Modernisation programmes that retire brittle platforms without freezing the business. Audits, reengineering, migrations, and phased rollouts move systems onto maintainable foundations.",
        services: [
          {
            name: "Legacy-system audits",
            description:
              "Technical and operational reviews that document risk, dependencies, and modernisation options.",
          },
          {
            name: "Architecture assessments",
            description:
              "Evaluation of current architecture against maintainability, scale, and security needs.",
          },
          {
            name: "Application reengineering",
            description:
              "Restructuring of ageing applications into cleaner, maintainable architectures.",
          },
          {
            name: "Interface redesign",
            description:
              "UX and UI renewal of legacy screens so users can work faster on the same core system.",
          },
          {
            name: "Database modernisation",
            description:
              "Upgrades to schemas, engines, and access patterns that improve reliability and performance.",
          },
          {
            name: "Codebase migration",
            description:
              "Moves to modern languages, frameworks, or repositories with controlled behaviour parity.",
          },
          {
            name: "Cloud migration",
            description:
              "Relocation of legacy workloads to cloud infrastructure with updated operating models.",
          },
          {
            name: "API enablement",
            description:
              "Exposure of legacy capabilities through APIs so new channels can integrate safely.",
          },
          {
            name: "Mobile enablement",
            description:
              "Mobile access layers or apps that extend legacy systems to field and on-the-go users.",
          },
          {
            name: "Performance improvements",
            description:
              "Targeted fixes that reduce latency and resource strain in ageing platforms.",
          },
          {
            name: "Security improvements",
            description:
              "Hardening of legacy systems through patching, access fixes, and safer configuration.",
          },
          {
            name: "Module replacement",
            description:
              "Incremental replacement of high-risk modules while the surrounding system stays live.",
          },
          {
            name: "Data migration",
            description:
              "Validated transfer of historical and operational data into modernised platforms.",
          },
          {
            name: "Parallel rollout planning",
            description:
              "Cutover strategies that run old and new systems side by side until confidence is proven.",
          },
          {
            name: "Complete platform rebuilds",
            description:
              "Greenfield replacements of legacy platforms when incremental change is no longer viable.",
          },
        ],
      },
    ],
  },
  {
    name: "Support",
    blurb: "Teams, training, and managed care that keep everything improving after launch.",
    categories: [
      {
        name: "Managed Technology Services",
        description:
          "Ongoing technical care for applications, websites, and integrations after go-live. Monitoring, updates, support, and advisory keep systems healthy month to month.",
        services: [
          {
            name: "Application monitoring",
            description:
              "Continuous health checks and alerting for application errors, uptime, and critical journeys.",
          },
          {
            name: "Website maintenance",
            description:
              "Content, dependency, and platform upkeep that keeps websites secure and current.",
          },
          {
            name: "Software updates",
            description:
              "Planned updates to frameworks, libraries, and platforms with regression awareness.",
          },
          {
            name: "Bug fixing",
            description:
              "Prioritised defect resolution for production issues affecting users or operations.",
          },
          {
            name: "Infrastructure monitoring",
            description:
              "Watching servers, containers, and cloud services for capacity, failures, and anomalies.",
          },
          {
            name: "User support",
            description:
              "Tiered technical support for end users encountering issues in production systems.",
          },
          {
            name: "Access management",
            description:
              "Ongoing administration of accounts, roles, and access requests across systems.",
          },
          {
            name: "Integration monitoring",
            description:
              "Surveillance of sync jobs and API links so broken integrations are caught early.",
          },
          {
            name: "Backup verification",
            description:
              "Regular restore tests and checks that confirm backups are actually recoverable.",
          },
          {
            name: "Security checks",
            description:
              "Recurring reviews of patches, access, and configuration hygiene in live environments.",
          },
          {
            name: "Performance optimisation",
            description:
              "Ongoing tuning of applications and infrastructure when performance degrades in production.",
          },
          {
            name: "Feature enhancements",
            description:
              "Small, controlled product improvements delivered under a managed-service cadence.",
          },
          {
            name: "Vendor coordination",
            description:
              "Liaison with software and infrastructure vendors when issues or renewals need ownership.",
          },
          {
            name: "Monthly technical reporting",
            description:
              "Clear monthly summaries of incidents, changes, risks, and recommended next actions.",
          },
          {
            name: "Ongoing technology advisory",
            description:
              "Retainer advice on roadmap, vendors, and technical decisions as the business evolves.",
          },
        ],
      },
      {
        name: "Dedicated Technology Teams",
        description:
          "Embedded engineering and product capacity that extends your internal team. Dedicated squads, staff augmentation, and fractional leadership plug into your delivery cadence.",
        services: [
          {
            name: "Dedicated development teams",
            description:
              "Full engineering squads embedded with your product owners for continuous delivery.",
          },
          {
            name: "Dedicated product teams",
            description:
              "Cross-functional product squads covering discovery, design, engineering, and delivery.",
          },
          {
            name: "Staff augmentation",
            description:
              "Individual specialists who join your existing teams under your process and tools.",
          },
          {
            name: "Fractional CTO",
            description:
              "Part-time technology leadership for architecture, hiring guidance, and delivery oversight.",
          },
          {
            name: "Fractional product manager",
            description:
              "Part-time product management for backlog ownership, prioritisation, and stakeholder alignment.",
          },
          {
            name: "Fractional product designer",
            description:
              "Part-time product design capacity for research, UX, and interface delivery.",
          },
          {
            name: "Front-end development support",
            description:
              "Specialist front-end engineers for UI implementation, performance, and component work.",
          },
          {
            name: "Back-end development support",
            description:
              "Specialist back-end engineers for APIs, services, data models, and server logic.",
          },
          {
            name: "Mobile development support",
            description:
              "iOS, Android, or cross-platform engineers embedded for mobile product delivery.",
          },
          {
            name: "AI engineering support",
            description:
              "Engineers focused on model integration, RAG, evaluation, and AI feature delivery.",
          },
          {
            name: "QA support",
            description:
              "Dedicated testers who own test planning, execution, and release quality.",
          },
          {
            name: "DevOps support",
            description:
              "Engineers who own CI/CD, environments, observability, and deployment reliability.",
          },
          {
            name: "Managed technical project teams",
            description:
              "Delivery teams with project leadership that own scope, schedule, and technical outcomes.",
          },
        ],
      },
      {
        name: "Training, Adoption & Documentation",
        description:
          "Adoption programmes that help people use the systems you have invested in. Training, SOPs, documentation, and refreshers turn launches into lasting operational change.",
        services: [
          {
            name: "Software user training",
            description:
              "Role-based training sessions that teach staff how to complete real tasks in the software.",
          },
          {
            name: "Administrator training",
            description:
              "Deeper training for system admins covering configuration, users, and operational controls.",
          },
          {
            name: "AI productivity training",
            description:
              "Practical sessions that help teams use AI tools safely and effectively in daily work.",
          },
          {
            name: "Software adoption programmes",
            description:
              "Structured programmes that drive usage, habits, and measurable uptake after launch.",
          },
          {
            name: "Change-management support",
            description:
              "Communications and stakeholder work that reduce resistance during system change.",
          },
          {
            name: "Standard operating procedures",
            description:
              "Written SOPs that define how processes should run consistently across teams.",
          },
          {
            name: "Process documentation",
            description:
              "Clear documentation of as-is and to-be processes for operations and training use.",
          },
          {
            name: "Technical documentation",
            description:
              "Engineering documentation covering architecture, APIs, environments, and runbooks.",
          },
          {
            name: "User manuals",
            description:
              "Step-by-step guides that explain common tasks for non-technical users.",
          },
          {
            name: "Video tutorials",
            description:
              "Short recorded walkthroughs that demonstrate key workflows for self-paced learning.",
          },
          {
            name: "Knowledge-base creation",
            description:
              "Searchable help centres with articles, FAQs, and troubleshooting paths.",
          },
          {
            name: "Adoption monitoring",
            description:
              "Measurement of usage and completion rates so adoption gaps can be addressed.",
          },
          {
            name: "Refresher workshops",
            description:
              "Follow-up sessions that reinforce skills and cover changes after the initial rollout.",
          },
        ],
      },
    ],
  },
];

// Keep Build as the lead practice wherever the shared service taxonomy is rendered.
export const pillars = [
  ...servicePillars.filter((pillar) => pillar.name === "Build"),
  ...servicePillars.filter((pillar) => pillar.name !== "Build"),
];

export const slugOf = (name) =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export function getAllCategories() {
  return pillars.flatMap((pillar) =>
    pillar.categories.map((category) => ({
      ...category,
      pillar: pillar.name,
      pillarBlurb: pillar.blurb,
      slug: slugOf(category.name),
    }))
  );
}

export function getCategoryBySlug(slug) {
  return getAllCategories().find((c) => c.slug === slug) ?? null;
}

export function servicePath(categorySlug, serviceSlug) {
  return `/services/${categorySlug}/${serviceSlug}/`;
}

export function getAllServices() {
  return getAllCategories().flatMap((category) =>
    category.services.map((service, index) => {
      const slug = slugOf(service.name);
      return {
        ...service,
        slug,
        index,
        pillar: category.pillar,
        pillarBlurb: category.pillarBlurb,
        categoryName: category.name,
        categorySlug: category.slug,
        categoryDescription: category.description,
        path: servicePath(category.slug, slug),
      };
    })
  );
}

export function getServiceBySlugs(categorySlug, serviceSlug) {
  return (
    getAllServices().find(
      (s) => s.categorySlug === categorySlug && s.slug === serviceSlug
    ) ?? null
  );
}

export function getSiblingServices(categorySlug, serviceSlug, limit = 6) {
  return getAllServices()
    .filter(
      (s) => s.categorySlug === categorySlug && s.slug !== serviceSlug
    )
    .slice(0, limit);
}
