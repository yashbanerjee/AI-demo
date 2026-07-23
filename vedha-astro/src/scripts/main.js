/* ============================================================
   Mōno Studio — interactions & scroll-driven animation
   Vanilla JS, no dependencies. All effects respect
   prefers-reduced-motion.
   ============================================================ */

(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hoverCapable = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const clamp01 = (v) => Math.min(1, Math.max(0, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  // How far a section has been scrolled through, 0 → 1
  const progressOf = (el) => {
    const rect = el.getBoundingClientRect();
    const total = rect.height - window.innerHeight;
    return total <= 0 ? 0 : clamp01(-rect.top / total);
  };

  // === Preloader ===
  const preloader = document.getElementById("preloader");
  const counter = document.getElementById("preloaderCount");
  let hasSeenPreloader = false;
  try {
    hasSeenPreloader = sessionStorage.getItem("vedha-preloader-seen") === "1";
  } catch {}
  if (!preloader || reduceMotion || hasSeenPreloader) {
    preloader?.remove();
  } else {
    document.body.style.overflow = "hidden";
    const start = performance.now();
    const DURATION = 500;
    const tick = (now) => {
      const p = clamp01((now - start) / DURATION);
      if (counter) counter.textContent = String(Math.round(p * 100));
      if (p < 1) {
        requestAnimationFrame(tick);
      } else {
        try { sessionStorage.setItem("vedha-preloader-seen", "1"); } catch {}
        preloader.classList.add("is-done");
        document.body.style.overflow = "";
        preloader.addEventListener("transitionend", () => preloader.remove(), { once: true });
      }
    };
    requestAnimationFrame(tick);
  }

  // === Header: hide on scroll down, show on scroll up ===
  // Also flips to a seamless light-on-dark look over black scenes.
  const header = document.getElementById("siteHeader");
  const darkHeaderZones = [
    document.getElementById("heroVideo"),
    document.getElementById("heroSlideshow"),
    document.getElementById("showreel"),
    document.getElementById("vision"),
    document.querySelector(".site-footer"),
    ...document.querySelectorAll("[data-scene-banner]"),
  ].filter(Boolean);
  let lastY = window.scrollY;
  const syncHeaderTheme = () => {
    if (!header) return;
    const y = window.scrollY;
    header.classList.toggle("is-scrolled", y > 24);
    // Sample just below the header bar — if a dark section covers that band, go light
    const probe = header.offsetHeight + 8;
    const onDark = darkHeaderZones.some((el) => {
      if (el.classList.contains("is-light")) return false;
      const r = el.getBoundingClientRect();
      return r.top <= probe && r.bottom > probe;
    });
    header.classList.toggle("is-on-dark", onDark);
  };
  window.addEventListener("scroll", () => {
    const y = window.scrollY;
    const delta = y - lastY;
    // Small dead-zone so tiny touch jitters don't flicker the header
    if (Math.abs(delta) > 6) {
      header.classList.toggle("is-hidden", delta > 0 && y > 120 && !document.body.classList.contains("menu-open"));
      lastY = y;
    }
    syncHeaderTheme();
  }, { passive: true });
  window.addEventListener("resize", syncHeaderTheme, { passive: true });
  syncHeaderTheme();

  // === Scene banners: titles only fade in on appear (no fade-out) ===
  const sceneBanners = [...document.querySelectorAll("[data-scene-banner]")];
  const syncSceneBanners = () => {
    if (!sceneBanners.length) return;
    const vh = window.innerHeight || 1;
    sceneBanners.forEach((banner) => {
      if (banner.classList.contains("is-title-in")) return;
      if (reduceMotion) {
        banner.classList.add("is-title-in");
        return;
      }
      const rect = banner.getBoundingClientRect();
      // Trigger when the banner is meaningfully in view
      if (rect.top < vh * 0.78 && rect.bottom > vh * 0.12) {
        banner.classList.add("is-title-in");
      }
    });
  };
  window.addEventListener("scroll", syncSceneBanners, { passive: true });
  window.addEventListener("resize", syncSceneBanners, { passive: true });
  syncSceneBanners();

  // === Menu overlay ===
  const menuToggle = document.getElementById("menuToggle");
  const menuOverlay = document.getElementById("menuOverlay");
  const setMenu = (open) => {
    menuToggle.classList.toggle("is-open", open);
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    menuOverlay.classList.toggle("is-open", open);
    menuOverlay.setAttribute("aria-hidden", String(!open));
    document.body.classList.toggle("menu-open", open);
  };
  menuToggle.addEventListener("click", () => setMenu(!menuToggle.classList.contains("is-open")));
  menuOverlay.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

  // === Split words into masked spans for staggered reveals ===
  document.querySelectorAll(".split-words").forEach((el) => {
    const words = el.textContent.trim().split(/\s+/);
    el.textContent = "";
    words.forEach((word, i) => {
      const mask = document.createElement("span");
      mask.className = "w";
      const inner = document.createElement("i");
      inner.textContent = word;
      inner.style.transitionDelay = `${i * 35}ms`;
      mask.appendChild(inner);
      el.appendChild(mask);
      el.appendChild(document.createTextNode(" "));
    });
  });

  // === Reveal on scroll (with automatic stagger per batch) ===
  const revealObserver = new IntersectionObserver((entries) => {
    let batchIndex = 0;
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      // Elements entering together cascade instead of popping at once
      entry.target.style.setProperty("--stagger", `${Math.min(batchIndex, 6) * 80}ms`);
      batchIndex += 1;
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
  const startReveals = () =>
    document.querySelectorAll("[data-reveal], .split-words").forEach((el) => revealObserver.observe(el));
  if (reduceMotion) {
    startReveals();
  } else {
    // Wait for the preloader so above-the-fold content animates in view
    setTimeout(startReveals, 350);
  }

  // === Animated counters in stats ===
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      counterObserver.unobserve(entry.target);
      const el = entry.target;
      const target = Number(el.dataset.count);
      const prefix = el.dataset.prefix || "";
      const suffix = el.dataset.suffix || "";
      if (reduceMotion) return; // final text already in markup
      const start = performance.now();
      const step = (now) => {
        const p = clamp01((now - start) / 1400);
        el.textContent = prefix + Math.round(easeOut(p) * target) + suffix;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll("[data-count]").forEach((el) => counterObserver.observe(el));

  // === Services: pillar tab switching + live search ===
  const svcTabs = [...document.querySelectorAll("[data-svc-tab]")];
  const svcPanels = [...document.querySelectorAll("[data-svc-panel]")];
  const svcSearch = document.getElementById("svcSearch");
  const svcSearchClear = document.getElementById("svcSearchClear");
  const svcResults = document.getElementById("svcResults");
  const svcResultsMeta = document.getElementById("svcResultsMeta");
  const svcResultsGroups = document.getElementById("svcResultsGroups");
  const svcLayout = document.querySelector(".svc-layout");

  const exitSvcSearch = () => {
    if (svcSearch) svcSearch.value = "";
    if (svcSearchClear) svcSearchClear.hidden = true;
    if (svcResults) svcResults.hidden = true;
    svcLayout?.classList.remove("is-searching");
  };

  if (svcTabs.length && svcPanels.length) {
    svcTabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        exitSvcSearch();
        const idx = tab.dataset.svcTab;
        svcTabs.forEach((t) => {
          const active = t.dataset.svcTab === idx;
          t.classList.toggle("is-active", active);
          t.setAttribute("aria-selected", String(active));
        });
        svcPanels.forEach((p) => {
          const active = p.dataset.svcPanel === idx;
          p.classList.toggle("is-active", active);
          p.setAttribute("aria-hidden", String(!active));
        });
      });
    });
  }

  if (svcSearch && svcResults && svcLayout) {
    // Flat index built from the rendered panels: pillar → category → services
    const svcIndex = svcPanels.flatMap((panel) => {
      const pillarName = panel.dataset.svcPillarName || "";
      return [...panel.querySelectorAll(".svc-card")].map((card) => ({
        pillar: pillarName,
        category: card.querySelector(".svc-card__title")?.textContent.trim() || "",
        slug: card.dataset.svcSlug || "",
        services: [...card.querySelectorAll(".svc-ask")].map((el) => ({
          name: el.dataset.service || el.textContent.trim(),
          href: el.getAttribute("href") || "",
        })),
      }));
    });

    // Words too generic to carry intent on their own
    const svcStopwords = new Set([
      "i", "we", "a", "an", "the", "to", "for", "my", "our", "your", "of", "and",
      "or", "in", "on", "with", "want", "wants", "need", "needs", "needed", "help",
      "me", "us", "get", "that", "this", "it", "is", "are", "do", "does", "can",
      "how", "what", "some", "new", "please", "would", "like", "looking", "have",
      "has", "you", "be", "so", "at", "as", "am", "was", "will", "should", "could",
      "let", "us", "from", "by", "into", "about", "more", "very", "really", "just",
    ]);

    // Everyday language → service vocabulary
    const svcSynonyms = {
      sell: ["e-commerce", "commerce", "online store", "ordering"],
      selling: ["e-commerce", "commerce", "online store"],
      shop: ["e-commerce", "commerce", "store"],
      store: ["e-commerce", "commerce", "store"],
      online: ["e-commerce", "online", "website"],
      product: ["product", "e-commerce", "catalogue"],
      products: ["product", "e-commerce", "catalogue"],
      app: ["app", "application", "mobile"],
      apps: ["app", "application", "mobile"],
      mobile: ["mobile", "app", "ios", "android"],
      iphone: ["ios"],
      android: ["android"],
      website: ["website", "web", "landing"],
      web: ["web", "website"],
      site: ["website", "web"],
      chatbot: ["assistant", "ai", "support"],
      bot: ["assistant", "ai", "agent"],
      assistant: ["assistant", "ai"],
      ai: ["ai", "intelligence", "predictive", "assistant"],
      automate: ["automation", "workflow", "robotic"],
      automation: ["automation", "workflow"],
      manual: ["automation", "data-entry", "workflow"],
      repetitive: ["automation", "robotic", "workflow"],
      paperwork: ["document", "automation", "processing"],
      documents: ["document", "extraction", "processing"],
      report: ["report", "dashboard", "analytics"],
      reports: ["report", "dashboard", "analytics"],
      reporting: ["reporting", "dashboard"],
      insights: ["analytics", "dashboard", "intelligence"],
      analytics: ["analytics", "dashboard", "intelligence"],
      dashboard: ["dashboard"],
      dashboards: ["dashboard"],
      numbers: ["dashboard", "analytics", "reporting"],
      customers: ["customer", "crm", "support", "portal"],
      customer: ["customer", "crm", "support"],
      clients: ["customer", "crm", "account"],
      leads: ["lead", "crm", "capture"],
      sales: ["sales", "crm", "pipeline", "lead"],
      pipeline: ["pipeline", "crm", "sales"],
      followup: ["follow-up", "automation"],
      marketing: ["marketing", "campaign", "email", "lead"],
      campaign: ["campaign", "marketing", "landing"],
      email: ["email", "automation", "marketing"],
      newsletter: ["email", "marketing"],
      seo: ["seo", "search", "visibility"],
      google: ["seo", "search", "visibility"],
      ranking: ["seo", "search", "visibility"],
      traffic: ["seo", "search", "conversion"],
      visibility: ["visibility", "seo", "search"],
      cloud: ["cloud", "infrastructure", "deployment"],
      server: ["server", "infrastructure", "deployment", "hosting"],
      hosting: ["cloud", "deployment", "infrastructure"],
      deploy: ["deployment", "ci/cd", "cloud"],
      devops: ["devops", "ci/cd", "infrastructure"],
      security: ["security", "compliance", "encryption"],
      secure: ["security", "encryption", "authentication"],
      hacked: ["security", "vulnerability", "incident"],
      compliance: ["compliance", "security", "policies"],
      slow: ["performance", "optimisation", "speed"],
      fast: ["performance", "optimisation"],
      speed: ["performance", "optimisation"],
      performance: ["performance", "optimisation"],
      old: ["legacy", "modernisation", "redesign"],
      legacy: ["legacy", "modernisation", "migration"],
      outdated: ["legacy", "modernisation", "redesign"],
      modernise: ["modernisation", "legacy", "migration"],
      modernize: ["modernisation", "legacy", "migration"],
      upgrade: ["modernisation", "migration", "enhancement"],
      migrate: ["migration", "cloud"],
      integrate: ["integration", "api", "middleware"],
      integration: ["integration", "api"],
      connect: ["integration", "api", "synchronisation"],
      sync: ["synchronisation", "integration", "data"],
      api: ["api", "integration", "webhook"],
      data: ["data", "database", "analytics"],
      database: ["database", "data"],
      excel: ["data", "reporting", "dashboard", "automation"],
      spreadsheets: ["data", "reporting", "automation"],
      design: ["design", "ux", "ui"],
      redesign: ["redesign", "design", "interface"],
      ux: ["ux", "design", "usability"],
      ui: ["ui", "design", "interface"],
      prototype: ["prototyping", "wireframing"],
      brand: ["brand", "identity", "logo"],
      branding: ["brand", "identity", "logo"],
      logo: ["logo", "brand", "identity"],
      identity: ["identity", "brand"],
      erp: ["erp"],
      crm: ["crm", "sales"],
      saas: ["saas", "product", "subscription", "multi-tenant"],
      startup: ["mvp", "product", "startup", "validation"],
      mvp: ["mvp", "product discovery", "validation"],
      idea: ["product discovery", "mvp", "validation", "feasibility"],
      invoice: ["invoice", "payment", "billing"],
      invoices: ["invoice", "payment", "billing"],
      billing: ["billing", "subscription", "invoice", "payment"],
      payments: ["payment", "billing", "gateway"],
      pay: ["payment", "billing"],
      subscription: ["subscription", "billing", "membership"],
      booking: ["booking", "scheduling", "appointment"],
      bookings: ["booking", "scheduling"],
      appointment: ["booking", "scheduling"],
      schedule: ["booking", "scheduling"],
      track: ["tracking", "logistics", "monitoring"],
      tracking: ["tracking", "logistics", "delivery"],
      delivery: ["delivery", "logistics", "tracking"],
      logistics: ["logistics", "delivery", "fleet"],
      shipping: ["logistics", "delivery", "tracking"],
      inventory: ["inventory", "stock"],
      stock: ["inventory"],
      warehouse: ["inventory", "warehouse", "logistics"],
      hotel: ["hospitality", "booking"],
      restaurant: ["hospitality", "ordering"],
      clinic: ["healthcare", "booking"],
      hospital: ["healthcare"],
      healthcare: ["healthcare"],
      school: ["education", "learning"],
      education: ["education", "learning"],
      course: ["learning", "education", "membership"],
      learning: ["learning", "education", "training"],
      construction: ["construction"],
      property: ["property", "real estate"],
      retail: ["retail", "e-commerce"],
      factory: ["manufacturing"],
      manufacturing: ["manufacturing"],
      train: ["training", "adoption", "workshops"],
      training: ["training", "adoption", "documentation"],
      onboarding: ["onboarding", "adoption", "training"],
      documentation: ["documentation", "manuals", "knowledge"],
      docs: ["documentation", "knowledge"],
      team: ["team", "dedicated", "staff", "augmentation"],
      developers: ["development teams", "staff", "augmentation"],
      developer: ["development", "staff", "augmentation"],
      hire: ["dedicated", "staff", "augmentation", "fractional"],
      cto: ["cto", "fractional"],
      support: ["support", "maintenance", "monitoring"],
      maintain: ["maintenance", "support", "updates"],
      maintenance: ["maintenance", "support"],
      fix: ["bug", "maintenance", "remediation"],
      bugs: ["bug", "testing", "maintenance"],
      broken: ["bug", "maintenance", "remediation"],
      test: ["testing", "qa"],
      testing: ["testing", "qa"],
      qa: ["qa", "testing", "quality"],
      quality: ["quality", "qa", "testing"],
      portal: ["portal"],
      portals: ["portal"],
      login: ["authentication", "identity", "role"],
      users: ["user", "role", "permission"],
      permissions: ["role", "permission", "access"],
      voice: ["voice"],
      whatsapp: ["whatsapp"],
      workflow: ["workflow", "automation", "approval"],
      workflows: ["workflow", "automation", "approval"],
      approvals: ["approval", "workflow"],
      strategy: ["strategy", "roadmap", "consulting"],
      consulting: ["consulting", "strategy", "advisory"],
      advice: ["consulting", "advisory", "strategy"],
      audit: ["audit", "assessment"],
      assessment: ["assessment", "audit"],
      roadmap: ["roadmap", "strategy"],
      cost: ["cost optimisation", "pricing"],
      cheaper: ["cost optimisation"],
      grow: ["scale", "growth", "optimisation"],
      scale: ["scale", "scaling", "growth"],
      marketplace: ["marketplace"],
      membership: ["membership", "subscription"],
      event: ["event", "attendee"],
      events: ["event", "attendee"],
      loyalty: ["loyalty"],
      search: ["search", "seo"],
      recommendations: ["recommendation"],
      personalisation: ["personalisation", "recommendation"],
      predictions: ["predictive", "forecasting"],
      forecast: ["forecasting", "predictive"],
    };

    const svcTokenize = (raw) => {
      const tokens = raw
        .toLowerCase()
        .split(/[^a-z0-9/&-]+/)
        .filter((t) => t.length > 1 && !svcStopwords.has(t));
      return [...new Set(tokens)];
    };

    const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const highlightTerms = (text, regex) => {
      const span = document.createElement("span");
      if (!regex) {
        span.textContent = text;
        return span;
      }
      let last = 0;
      for (const m of text.matchAll(regex)) {
        span.append(document.createTextNode(text.slice(last, m.index)));
        span.append(Object.assign(document.createElement("mark"), { textContent: m[0] }));
        last = m.index + m[0].length;
      }
      span.append(document.createTextNode(text.slice(last)));
      return span;
    };

    const runSvcSearch = () => {
      const rawQuery = svcSearch.value.trim();
      const q = rawQuery.toLowerCase();
      svcSearchClear.hidden = q.length === 0;
      if (!q) {
        exitSvcSearch();
        return;
      }
      svcLayout.classList.add("is-searching");
      svcResults.hidden = false;
      svcResultsGroups.textContent = "";

      // Each token matches directly (weight 1) or through synonyms (weight 0.7)
      const tokens = svcTokenize(q);
      const tokenVariants = tokens.map((t) => {
        const variants = [{ term: t, weight: 1 }];
        if (t.length > 3 && t.endsWith("s")) variants.push({ term: t.slice(0, -1), weight: 1 });
        (svcSynonyms[t] || []).forEach((syn) => variants.push({ term: syn, weight: 0.7 }));
        return variants;
      });

      const scoreText = (serviceName, category, pillar) => {
        const s = serviceName.toLowerCase();
        const c = category.toLowerCase();
        const p = pillar.toLowerCase();
        let score = 0;
        if (q.length >= 5 && (s.includes(q) || c.includes(q))) score += 6;
        for (const variants of tokenVariants) {
          let best = 0;
          for (const { term, weight } of variants) {
            if (s.includes(term)) best = Math.max(best, 3 * weight);
            else if (c.includes(term)) best = Math.max(best, 2 * weight);
            else if (p.includes(term)) best = Math.max(best, 0.5 * weight);
          }
          score += best;
        }
        return score;
      };

      let serviceCount = 0;
      const groups = [];
      svcIndex.forEach((cat) => {
        const scored = cat.services
          .map((s) => ({
            name: s.name,
            href: s.href,
            score: scoreText(s.name, cat.category, cat.pillar),
          }))
          .filter((s) => s.score >= 1.4)
          .sort((a, b) => b.score - a.score);
        if (scored.length) {
          groups.push({
            ...cat,
            hits: scored,
            score: scored.reduce((n, s) => n + s.score, 0) + (cat.category.toLowerCase().includes(q) ? 8 : 0),
          });
          serviceCount += scored.length;
        }
      });
      groups.sort((a, b) => b.score - a.score);

      // Highlight both typed words and the synonyms that matched
      const highlightList = [
        ...new Set(
          tokenVariants.flat().map((v) => v.term).filter((t) => t.length >= 3)
        ),
      ];
      const markRegex = highlightList.length
        ? new RegExp(`(${highlightList.map(escapeRegex).join("|")})`, "gi")
        : null;

      if (!groups.length) {
        svcResultsMeta.textContent = "No matches";
        const empty = document.createElement("div");
        empty.className = "svc-results__empty";
        const p = document.createElement("p");
        p.append(
          document.createTextNode("Nothing found for \u201C"),
          Object.assign(document.createElement("b"), { textContent: rawQuery }),
          document.createTextNode("\u201D — but if you can describe it, we can likely build it.")
        );
        const link = document.createElement("a");
        link.className = "btn btn--dark";
        link.href = "/#contact";
        link.innerHTML = "<span>Ask us about it</span>";
        empty.append(p, link);
        svcResultsGroups.append(empty);
        return;
      }

      svcResultsMeta.textContent =
        `${serviceCount} service${serviceCount === 1 ? "" : "s"} \u00B7 ${groups.length} practice${groups.length === 1 ? "" : "s"}`;
      groups.forEach((group) => {
        const wrap = document.createElement("div");
        wrap.className = "svc-results__group";
        const h4 = document.createElement("h4");
        const catLabel = highlightTerms(group.category, markRegex);
        if (group.slug) {
          const catLink = document.createElement("a");
          catLink.href = `/services/${group.slug}/`;
          catLink.append(catLabel);
          h4.append(
            catLink,
            Object.assign(document.createElement("span"), { textContent: group.pillar })
          );
        } else {
          h4.append(
            catLabel,
            Object.assign(document.createElement("span"), { textContent: group.pillar })
          );
        }
        const ul = document.createElement("ul");
        group.hits.forEach((s) => {
          const li = document.createElement("li");
          const link = document.createElement("a");
          link.className = "svc-ask";
          link.href = s.href || (group.slug ? `/services/${group.slug}/` : "/services/");
          link.dataset.tooltip = "View service page";
          link.append(highlightTerms(s.name, markRegex));
          li.append(link);
          ul.append(li);
        });
        wrap.append(h4, ul);
        svcResultsGroups.append(wrap);
      });
    };

    // Rotate through personal prompts while the field sits empty
    const svcPrompts = [
      "What do you want to build?",
      "An AI assistant for your team?",
      "An ERP that fits how you work?",
      "A mobile app your customers love?",
      "Dashboards that answer questions?",
      "A brand that gets remembered?",
      "Workflows that run themselves?",
    ];
    let svcPromptIdx = 0;
    if (!reduceMotion) {
      setInterval(() => {
        if (svcSearch.value || document.activeElement === svcSearch) return;
        svcPromptIdx = (svcPromptIdx + 1) % svcPrompts.length;
        svcSearch.placeholder = svcPrompts[svcPromptIdx];
      }, 3200);
    }

    let svcSearchTimer;
    svcSearch.addEventListener("input", () => {
      clearTimeout(svcSearchTimer);
      svcSearchTimer = setTimeout(runSvcSearch, 120);
    });
    svcSearch.addEventListener("keydown", (e) => {
      if (e.key === "Escape") exitSvcSearch();
    });
    svcSearchClear.addEventListener("click", () => {
      exitSvcSearch();
      svcSearch.focus();
    });
  }

  // === Services index page (/services/) — filter cards by search ===
  const svcIndexPage = document.getElementById("svcIndexPage");
  const svcIndexSearch = document.getElementById("svcIndexSearch");
  const svcIndexSearchClear = document.getElementById("svcIndexSearchClear");
  const svcIndexStatus = document.getElementById("svcIndexStatus");
  if (svcIndexPage && svcIndexSearch) {
    const pillars = [...svcIndexPage.querySelectorAll("[data-svc-index-pillar]")];
    const cards = [...svcIndexPage.querySelectorAll("[data-svc-index-card]")];
    const pills = [...svcIndexPage.querySelectorAll("[data-svc-index-pill]")];
    const setActivePill = (name) => {
      pills.forEach((pill) => {
        pill.classList.toggle("is-active", pill.dataset.pillar === name);
      });
    };
    const runIndexSearch = () => {
      const q = svcIndexSearch.value.trim().toLowerCase();
      const tokens = q.split(/\s+/).filter(Boolean);
      if (svcIndexSearchClear) svcIndexSearchClear.hidden = !q;
      let visibleCards = 0;
      cards.forEach((card) => {
        const hay = card.dataset.search || "";
        const show = !tokens.length || tokens.every((t) => hay.includes(t));
        card.classList.toggle("is-hidden", !show);
        if (show) visibleCards += 1;
      });
      pillars.forEach((pillar) => {
        const any = [...pillar.querySelectorAll("[data-svc-index-card]")].some(
          (c) => !c.classList.contains("is-hidden")
        );
        pillar.classList.toggle("is-hidden", !any);
      });
      if (svcIndexStatus) {
        if (!q) {
          svcIndexStatus.hidden = true;
          svcIndexStatus.textContent = "";
        } else {
          svcIndexStatus.hidden = false;
          svcIndexStatus.textContent =
            visibleCards === 0
              ? `No matches for “${svcIndexSearch.value.trim()}”`
              : `${visibleCards} practice${visibleCards === 1 ? "" : "s"} match`;
        }
      }
    };
    let indexTimer;
    svcIndexSearch.addEventListener("input", () => {
      clearTimeout(indexTimer);
      indexTimer = setTimeout(runIndexSearch, 100);
    });
    svcIndexSearch.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      svcIndexSearch.value = "";
      runIndexSearch();
    });
    svcIndexSearchClear?.addEventListener("click", () => {
      svcIndexSearch.value = "";
      runIndexSearch();
      svcIndexSearch.focus();
    });
    pills.forEach((pill) => {
      pill.addEventListener("click", (e) => {
        const href = pill.getAttribute("href") || "";
        const target = href.startsWith("#")
          ? document.getElementById(href.slice(1))
          : null;
        if (!target) return;
        e.preventDefault();
        if (svcIndexSearch.value) {
          svcIndexSearch.value = "";
          runIndexSearch();
        }
        setActivePill(pill.dataset.pillar || "");
        const top =
          target.getBoundingClientRect().top +
          window.scrollY -
          (parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 80);
        window.scrollTo({ top, behavior: reduceMotion ? "auto" : "smooth" });
        history.replaceState(null, "", href);
      });
    });
    if (location.hash) {
      const hashPill = pills.find((p) => p.getAttribute("href") === location.hash);
      if (hashPill) setActivePill(hashPill.dataset.pillar || "");
    }
  }

  // === Smooth height animation for <details> (FAQ) ===
  document.querySelectorAll(".faq__item").forEach((item) => {
    const summary = item.querySelector("summary");
    let animating = false;
    summary.addEventListener("click", (e) => {
      if (reduceMotion) return; // native toggle
      e.preventDefault();
      if (animating) return;
      animating = true;
      const closing = item.open;
      const startH = item.offsetHeight;
      // Keep the item open during the whole animation so the content
      // stays in the layout; overflow:hidden clips it as height shrinks.
      item.open = true;
      const endH = closing ? summary.offsetHeight : item.scrollHeight;
      item.style.setProperty("--faq-height", `${startH}px`);
      item.classList.add("is-animating");
      if (closing) item.classList.add("is-closing"); // fades the content out
      requestAnimationFrame(() => {
        item.style.setProperty("--faq-height", `${endH}px`);
      });
      const finish = () => {
        item.classList.remove("is-animating", "is-closing");
        item.style.removeProperty("--faq-height");
        if (closing) item.open = false;
        animating = false;
      };
      item.addEventListener("transitionend", (ev) => {
        if (ev.propertyName === "height") finish();
      }, { once: true });
      // Safety net in case transitionend never fires
      setTimeout(() => { if (animating) finish(); }, 700);
    });
  });

  // === Testimonials slider (homepage only) ===
  const slider = document.getElementById("tSlider");
  if (slider) {
    const slides = [...document.querySelectorAll(".t-slide")];
    const dots = [...document.querySelectorAll("#tDots button")];
    const currentLabel = document.getElementById("tCurrent");
    let tIndex = 0;
    let tTimer;
    const goTo = (i) => {
      tIndex = (i + slides.length) % slides.length;
      slides.forEach((s, n) => s.classList.toggle("is-active", n === tIndex));
      dots.forEach((d, n) => d.setAttribute("aria-selected", String(n === tIndex)));
      currentLabel.textContent = String(tIndex + 1).padStart(2, "0");
    };
    const restartAuto = () => {
      clearInterval(tTimer);
      if (!reduceMotion) tTimer = setInterval(() => goTo(tIndex + 1), 5000);
    };
    dots.forEach((d, n) => d.addEventListener("click", () => { goTo(n); restartAuto(); }));
    restartAuto();

    // Swipe between testimonials on touch devices
    let touchX = null;
    let touchY = null;
    slider.addEventListener("touchstart", (e) => {
      touchX = e.touches[0].clientX;
      touchY = e.touches[0].clientY;
    }, { passive: true });
    slider.addEventListener("touchend", (e) => {
      if (touchX === null) return;
      const dx = e.changedTouches[0].clientX - touchX;
      const dy = e.changedTouches[0].clientY - touchY;
      if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.5) {
        goTo(tIndex + (dx < 0 ? 1 : -1));
        restartAuto();
      }
      touchX = touchY = null;
    }, { passive: true });
  }

  // === Magnetic buttons (fine pointers only) ===
  if (hoverCapable && !reduceMotion) {
    document.querySelectorAll(".btn").forEach((btn) => {
      btn.addEventListener("mousemove", (e) => {
        const r = btn.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) / (r.width / 2);
        const y = (e.clientY - r.top - r.height / 2) / (r.height / 2);
        btn.style.setProperty("--mx", `${x * 4}px`);
        btn.style.setProperty("--my", `${y * 3}px`);
      });
      btn.addEventListener("mouseleave", () => {
        btn.style.setProperty("--mx", "0px");
        btn.style.setProperty("--my", "0px");
      });
    });
  }

  // ============================================================
  // Scroll-driven scenes (rAF loop with lerp smoothing —
  // progress eases toward the scroll position so fast flicks
  // and touch scrolling feel fluid instead of steppy).
  // Homepage only — bail out on pages without these sections.
  // ============================================================
  const hero = document.getElementById("hero");
  const heroCard = document.getElementById("heroCard");
  const showreel = document.getElementById("showreel");
  const showreelMedia = document.getElementById("showreelMedia");
  const collage = document.querySelector(".collage-grid");
  // Alternative hero: scroll-scrubbed 3D video
  const heroVideo = document.getElementById("heroVideo");
  const heroVideoMedia = document.getElementById("heroVideoMedia");
  const heroVideoEnd = document.getElementById("heroVideoEnd");
  const heroVideoIntro = document.getElementById("heroVideoIntro");
  const heroVideoPoster = document.getElementById("heroVideoPoster");
  const heroSlideshow = document.getElementById("heroSlideshow");
  const heroSlideshowEnd = document.getElementById("heroSlideshowEnd");
  const heroSlideshowScroll = document.querySelector(".hero-slideshow__scroll");
  // Process: short 3D card stack
  const process = document.getElementById("vision");
  const processStage = document.getElementById("processStage");
  const processCards = [...document.querySelectorAll("[data-process-card]")];
  const processDots = [...document.querySelectorAll("#processDots i")];
  const processCurrent = document.getElementById("processCurrent");

  // Each scene runs independently so either hero variant can be enabled
  const sceneEls = {};
  if (hero && heroCard && collage) sceneEls.hero = hero;
  if (showreel && showreelMedia) sceneEls.showreel = showreel;
  if (heroVideo && heroVideoMedia) sceneEls.heroVideo = heroVideo;
  if (heroSlideshow && heroSlideshowEnd) sceneEls.heroSlideshow = heroSlideshow;
  if (process && processStage && processCards.length) sceneEls.process = process;
  const hasScenes = Object.keys(sceneEls).length > 0;

  // Smoothed progress state per scene
  const scenes = { hero: 0, showreel: 0, heroVideo: 0, heroSlideshow: 0, process: 0 };

  // --- Hero video: pick a lighter source on phones, unlock for iOS seeking ---
  let heroVideoReady = false;
  let heroVideoFailed = false;
  let heroSeekPending = null;
  let heroLastSeek = -1;
  const markHeroVideoReady = () => {
    if (heroVideoReady || heroVideoFailed) return;
    heroVideoReady = true;
    heroVideo?.classList.add("is-video-ready");
  };
  const showHeroFallback = () => {
    heroVideoFailed = true;
    heroVideo?.classList.add("is-video-ready");
    if (heroVideoPoster) heroVideoPoster.style.opacity = "0";
    if (heroVideoIntro) heroVideoIntro.style.opacity = "0";
    if (heroVideoEnd) {
      heroVideoEnd.style.opacity = "1";
      heroVideoEnd.classList.add("is-interactive");
      heroVideoEnd.setAttribute("aria-hidden", "false");
      const ctas = heroVideoEnd.querySelector(".hero-video__ctas");
      if (ctas) { ctas.style.opacity = "1"; ctas.style.transform = "none"; }
      const logo = heroVideoEnd.querySelector(".hero-video__logo");
      if (logo) logo.style.transform = "none";
    }
  };
  const unlockHeroVideo = async () => {
    if (!heroVideoMedia || heroVideoFailed) return;
    try {
      heroVideoMedia.muted = true;
      heroVideoMedia.defaultMuted = true;
      heroVideoMedia.playsInline = true;
      heroVideoMedia.setAttribute("playsinline", "");
      heroVideoMedia.setAttribute("webkit-playsinline", "");
      // iOS often refuses currentTime seeks until play() has been called once
      const playPromise = heroVideoMedia.play();
      if (playPromise && typeof playPromise.then === "function") {
        await playPromise;
      }
      heroVideoMedia.pause();
      if (Number.isFinite(heroVideoMedia.duration) && heroVideoMedia.duration > 0) {
        markHeroVideoReady();
      }
    } catch {
      // Autoplay may still be blocked until a gesture — retry on first touch
    }
  };
  const getHeroVideoSrc = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 3);
    const effectiveWidth = Math.round(window.innerWidth * dpr);
    // Pick the encode that best matches physical pixels (1920 desktop / 1280 mobile)
    return effectiveWidth > 1350 ? "/videos/hero-3d.mp4" : "/videos/hero-3d-mobile.mp4";
  };
  const shouldSkipHeroVideo = () => {
    // Data-saver / very slow networks: skip heavy scrub video, show end state
    const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (navigator.deviceMemory && navigator.deviceMemory <= 2) return true;
    if (!conn) return false;
    if (conn.saveData) return true;
    const type = String(conn.effectiveType || "");
    return type === "slow-2g" || type === "2g";
  };
  let heroVideoInitialized = false;
  const initHeroVideo = () => {
    if (!heroVideoMedia || heroVideoInitialized) return;
    heroVideoInitialized = true;
    if (shouldSkipHeroVideo()) {
      showHeroFallback();
      return;
    }
    const src = getHeroVideoSrc();
    if (heroVideoMedia.dataset.src !== src) {
      heroVideoMedia.dataset.src = src;
      heroVideoMedia.src = src;
      heroVideoMedia.load();
    }
    heroVideoMedia.muted = true;
    heroVideoMedia.defaultMuted = true;
    heroVideoMedia.playsInline = true;
    heroVideoMedia.setAttribute("playsinline", "");
    heroVideoMedia.setAttribute("webkit-playsinline", "");
    heroVideoMedia.setAttribute("muted", "");

    const onReady = () => {
      markHeroVideoReady();
      unlockHeroVideo();
    };
    heroVideoMedia.addEventListener("loadeddata", onReady, { once: true });
    heroVideoMedia.addEventListener("canplay", onReady, { once: true });
    heroVideoMedia.addEventListener("error", showHeroFallback, { once: true });
    // Safety net: if the file never becomes seekable, show the logo end-state
    setTimeout(() => {
      if (!heroVideoReady && heroVideoMedia.readyState < 2) showHeroFallback();
    }, 12000);

    // First user gesture unlocks scrubbing on strict mobile browsers
    const unlockOnce = () => {
      unlockHeroVideo();
      window.removeEventListener("touchstart", unlockOnce);
      window.removeEventListener("scroll", unlockOnce);
    };
    window.addEventListener("touchstart", unlockOnce, { passive: true, once: true });
    window.addEventListener("scroll", unlockOnce, { passive: true, once: true });
  };
  if (sceneEls.heroVideo) {
    // The poster is the LCP asset. Fetch the large scrub video only after the
    // visitor signals intent to explore, rather than competing on first paint.
    const startHeroVideo = () => {
      initHeroVideo();
      window.removeEventListener("scroll", startHeroVideo);
      window.removeEventListener("pointerdown", startHeroVideo);
      window.removeEventListener("touchstart", startHeroVideo);
    };
    window.addEventListener("scroll", startHeroVideo, { passive: true, once: true });
    window.addEventListener("pointerdown", startHeroVideo, { passive: true, once: true });
    window.addEventListener("touchstart", startHeroVideo, { passive: true, once: true });
  }

  // Mouse parallax for the process stage (fine pointers only)
  const processParallax = { x: 0, y: 0, tx: 0, ty: 0 };
  let wakeProcess = () => {};
  if (processStage && hoverCapable && !reduceMotion) {
    process.addEventListener("mousemove", (e) => {
      const r = process.getBoundingClientRect();
      processParallax.tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      processParallax.ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
      wakeProcess();
    }, { passive: true });
    process.addEventListener("mouseleave", () => {
      processParallax.tx = 0;
      processParallax.ty = 0;
      wakeProcess();
    }, { passive: true });
  }

  // Video hero timing: intro cover opens from the logo (radial reveal),
  // the video then scrubs over the middle of the scroll, and finally the
  // end overlay (bg colour + logo) fades in over the rest.
  const HERO_VIDEO_INTRO_END = 0.16;
  const HERO_VIDEO_SCRUB_END = 0.8;
  const seekHeroVideo = (t) => {
    if (!heroVideoMedia || heroVideoFailed) return;
    if (!Number.isFinite(t)) return;
    // Avoid hammering currentTime — mobile decoders drop frames / go blank
    if (Math.abs(t - heroLastSeek) < 0.04) return;
    if (heroVideoMedia.readyState < 2) {
      heroSeekPending = t;
      return;
    }
    try {
      heroVideoMedia.currentTime = t;
      heroLastSeek = t;
      heroSeekPending = null;
      if (heroVideoMedia.readyState >= 2) markHeroVideoReady();
    } catch {
      heroSeekPending = t;
    }
  };
  if (heroVideoMedia) {
    heroVideoMedia.addEventListener("seeked", () => {
      markHeroVideoReady();
      if (heroSeekPending != null && Math.abs(heroSeekPending - heroVideoMedia.currentTime) > 0.05) {
        const next = heroSeekPending;
        heroSeekPending = null;
        seekHeroVideo(next);
      }
    });
    heroVideoMedia.addEventListener("loadeddata", () => {
      if (heroSeekPending != null) seekHeroVideo(heroSeekPending);
    });
  }
  const animateHeroVideo = (p) => {
    if (heroVideoFailed) return;

    // Intro: mark is a video-filled portal; scroll expands that window outward
    const introLocal = clamp01(p / HERO_VIDEO_INTRO_END);
    if (heroVideoIntro) {
      // Negative start keeps the radial mask fully opaque until scroll begins
      const reveal = -45 + introLocal * 195;
      heroVideoIntro.style.setProperty("--reveal", String(reveal));
      heroVideoIntro.classList.toggle("is-revealing", introLocal > 0.02);
      heroVideoIntro.style.opacity = String(introLocal > 0.9 ? 1 - (introLocal - 0.9) / 0.1 : 1);
      const mark = heroVideoIntro.querySelector(".hero-video__intro-mark");
      const cta = heroVideoIntro.querySelector(".hero-video__intro-cta");
      const fade = 1 - clamp01((introLocal - 0.12) / 0.5);
      const bloom = 1 + introLocal * 0.35;
      if (mark) {
        mark.style.opacity = String(fade);
        mark.style.transform = `translate(-50%, -50%) scale(${bloom})`;
      }
      if (cta) cta.style.opacity = String(fade);
    }
    // Background eases out from a tighter crop centered on the mark
    const mediaScale = 1.18 - introLocal * 0.18;
    heroVideoMedia.style.transform = `scale(${mediaScale})`;
    if (heroVideoPoster) heroVideoPoster.style.transform = `scale(${mediaScale})`;

    const scrub = clamp01((p - HERO_VIDEO_INTRO_END) / (HERO_VIDEO_SCRUB_END - HERO_VIDEO_INTRO_END));
    const duration = heroVideoMedia.duration;
    if (Number.isFinite(duration) && duration > 0) {
      // Small back-off from the exact end so the final frame stays rendered
      seekHeroVideo(scrub * Math.max(0, duration - 0.05));
    }
    // End state: fade the background in, settle the logo + CTAs into place
    const endLocal = clamp01((p - HERO_VIDEO_SCRUB_END) / (1 - HERO_VIDEO_SCRUB_END));
    heroVideoEnd.style.opacity = String(endLocal);
    heroVideoEnd.classList.toggle("is-interactive", endLocal > 0.85);
    heroVideoEnd.setAttribute("aria-hidden", String(endLocal < 0.5));
    const logo = heroVideoEnd.querySelector(".hero-video__logo");
    if (logo) logo.style.transform = `scale(${0.92 + endLocal * 0.08}) translateY(${(1 - endLocal) * 1.2}rem)`;
    const ctas = heroVideoEnd.querySelector(".hero-video__ctas");
    if (ctas) {
      const ctaLocal = clamp01((endLocal - 0.35) / 0.65);
      ctas.style.opacity = String(ctaLocal);
      ctas.style.transform = `translateY(${(1 - ctaLocal) * 0.8}rem)`;
    }
  };

  // The photos progress independently; the scroll only carries the visitor
  // from the cinematic slideshow into the clean brand / CTA end state.
  const animateHeroSlideshow = (p) => {
    if (!heroSlideshowEnd) return;
    const endLocal = clamp01((p - 0.52) / 0.48);
    heroSlideshowEnd.style.opacity = String(endLocal);
    heroSlideshowEnd.style.setProperty("--transition", String(endLocal));
    heroSlideshowEnd.classList.toggle("is-interactive", endLocal > 0.85);
    heroSlideshowEnd.setAttribute("aria-hidden", String(endLocal < 0.5));
    heroSlideshow?.classList.toggle("is-light", endLocal > 0.8);
    syncHeaderTheme();
    if (heroSlideshowScroll) heroSlideshowScroll.style.opacity = String(1 - endLocal * 2);

    const logo = heroSlideshowEnd.querySelector(".hero-slideshow__wordmark");
    if (logo) {
      logo.style.transform =
        `scale(${0.94 + endLocal * 0.06}) translateY(${(1 - endLocal) * 1.2}rem)`;
    }
    const ctas = heroSlideshowEnd.querySelector(".hero-slideshow__ctas");
    if (ctas) {
      const ctaLocal = clamp01((endLocal - 0.32) / 0.68);
      ctas.style.opacity = String(ctaLocal);
      ctas.style.transform = `translateY(${(1 - ctaLocal) * 0.8}rem)`;
    }
  };

  // Process: cards slide side-to-side on scroll, then fan out into a lineup
  const PROCESS_SCRUB_END = 0.68;
  const animateProcess = (p) => {
    const n = processCards.length;
    const scrub = clamp01(p / PROCESS_SCRUB_END);
    const lineup = clamp01((p - PROCESS_SCRUB_END) / (1 - PROCESS_SCRUB_END));
    const vertical = window.innerWidth < 768;

    const raw = scrub * (n - 0.001);
    const index = Math.min(n - 1, Math.floor(raw));
    const local = raw - index;

    // Lineup geometry — shared across cards
    const mid = (n - 1) / 2;
    const lineScale = vertical ? 0.7 : 0.62;
    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    const scrubCardW = Math.min(window.innerWidth * 0.88, 34 * rem);
    const cardW = scrubCardW * lineScale;
    const pad = vertical ? window.innerHeight * 0.08 : window.innerWidth * 0.04;
    const available = vertical
      ? window.innerHeight - pad * 2
      : window.innerWidth - pad * 2;
    const centerGap = (available - cardW) / Math.max(n - 1, 1);
    // Slide just past one card width so neighbors stay close mid-transition
    const slideAmt = ((scrubCardW + window.innerWidth * 0.03) / window.innerWidth) * 100;

    processCards.forEach((card, i) => {
      const offset = i - index - local;
      const absOff = Math.abs(offset);

      // Scrub: enter from the right, exit to the left (horizontal on all sizes)
      const stackX = offset * slideAmt;
      const stackY = 0;
      const stackZ = 0;
      const stackRot = 0;
      const stackScale = 1;
      const stackOpacity = absOff < 1 ? 1 : 0;

      // Lineup: fan out from the center so paths never cross
      const lineX = vertical ? 0 : ((i - mid) * centerGap / window.innerWidth) * 100;
      const lineY = vertical ? ((i - mid) * centerGap / window.innerHeight) * 100 : 0;

      const x = lerp(stackX, lineX, lineup);
      const y = lerp(stackY, lineY, lineup);
      const z = lerp(stackZ, 0, lineup);
      const rot = lerp(stackRot, 0, lineup);
      const scale = lerp(stackScale, lineScale, lineup);
      const opacity = lerp(stackOpacity, 1, clamp01(lineup * 1.4));

      card.style.opacity = String(opacity);
      card.style.transform =
        `translate3d(${x}vw, ${y}vh, ${z}px) rotateY(${rot}deg) scale(${scale})`;
      card.classList.toggle("is-active", lineup > 0.2 || absOff < 1);
      card.style.zIndex = String(
        lineup > 0.2 ? i + 1 : Math.round((1 - absOff) * 10)
      );
    });

    if (processCurrent) {
      processCurrent.textContent = String(
        lineup > 0.5 ? n : index + 1
      ).padStart(2, "0");
    }
    processDots.forEach((dot, i) => {
      dot.classList.toggle("is-active", lineup > 0.5 || i === index);
    });

    process.classList.toggle("is-lined-up", lineup > 0.55);

    // Ease parallax toward the mouse target and tip the whole stage
    // (parallax softens once lined up so the row stays readable)
    const paraAmt = 1 - lineup * 0.85;
    processParallax.x = lerp(processParallax.x, processParallax.tx, 0.08);
    processParallax.y = lerp(processParallax.y, processParallax.ty, 0.08);
    processStage.style.transform =
      `rotateX(${(-processParallax.y * 6 * paraAmt).toFixed(2)}deg) rotateY(${(processParallax.x * 10 * paraAmt).toFixed(2)}deg)`;
  };

  const applyScenes = () => {
    if (sceneEls.hero) {
      // Hero: white card shrinks and rounds, collage drifts behind it
      const hp = scenes.hero;
      const scale = 1 - hp * 0.72;
      heroCard.style.transform = `scale(${scale})`;
      heroCard.style.borderRadius = `${hp * 24}px`;
      heroCard.style.opacity = String(1 - clamp01((hp - 0.75) * 4));
      collage.style.transform = `translateY(${(1 - hp) * 6}%) scale(${1.05 - hp * 0.05})`;
    }

    if (sceneEls.heroVideo) animateHeroVideo(scenes.heroVideo);
    if (sceneEls.heroSlideshow) animateHeroSlideshow(scenes.heroSlideshow);
    if (sceneEls.process) animateProcess(scenes.process);

    if (sceneEls.showreel) {
      // Showreel: media scales from inset card to full-bleed
      const sp = scenes.showreel;
      const inset = (1 - sp) * 6;
      showreelMedia.style.transform = `scale(${0.86 + sp * 0.14})`;
      showreelMedia.style.borderRadius = `${(1 - sp) * 20}px`;
      showreelMedia.style.margin = `${inset}vh ${inset}vw`;
    }
  };

  if (hasScenes && !reduceMotion) {
    const SMOOTH = 0.16; // catch-up factor per frame
    const EPS = 0.0004;
    let settled = false;
    const loop = () => {
      const targets = {};
      for (const key in sceneEls) targets[key] = progressOf(sceneEls[key]);
      let maxDelta = 0;
      for (const key in targets) {
        scenes[key] = lerp(scenes[key], targets[key], SMOOTH);
        const d = Math.abs(targets[key] - scenes[key]);
        if (d < EPS) scenes[key] = targets[key];
        maxDelta = Math.max(maxDelta, d);
      }
      // Keep the loop alive while process mouse-parallax eases
      if (sceneEls.process) {
        maxDelta = Math.max(
          maxDelta,
          Math.abs(processParallax.tx - processParallax.x),
          Math.abs(processParallax.ty - processParallax.y)
        );
      }
      applyScenes();
      settled = maxDelta < EPS;
      if (!settled) {
        requestAnimationFrame(loop);
      }
    };
    const wake = () => {
      if (settled) {
        settled = false;
        requestAnimationFrame(loop);
      }
    };
    wakeProcess = wake;
    // Snap to current position on load, then smooth from there
    for (const key in sceneEls) scenes[key] = progressOf(sceneEls[key]);
    applyScenes();
    settled = true;
    window.addEventListener("scroll", wake, { passive: true });
    window.addEventListener("resize", wake, { passive: true });
    window.addEventListener("touchmove", wake, { passive: true });
    // Once video metadata arrives, sync the frame to the current scroll position
    if (sceneEls.heroVideo) {
      heroVideoMedia.addEventListener("loadedmetadata", wake);
      heroVideoMedia.addEventListener("loadeddata", wake);
      heroVideoMedia.addEventListener("canplay", wake, { once: true });
    }
  } else if (hasScenes) {
    // Static fallback: show final states
    if (sceneEls.heroVideo) {
      heroVideoEnd.style.opacity = "1";
      heroVideoEnd.classList.add("is-interactive");
      heroVideoEnd.setAttribute("aria-hidden", "false");
      const ctas = heroVideoEnd.querySelector(".hero-video__ctas");
      if (ctas) { ctas.style.opacity = "1"; ctas.style.transform = "none"; }
      if (heroVideoIntro) heroVideoIntro.style.opacity = "0";
    }
    if (sceneEls.heroSlideshow) {
      heroSlideshowEnd.style.opacity = "1";
      heroSlideshowEnd.style.setProperty("--transition", "1");
      heroSlideshowEnd.classList.add("is-interactive");
      heroSlideshowEnd.setAttribute("aria-hidden", "false");
      heroSlideshow.classList.add("is-light");
      syncHeaderTheme();
      const ctas = heroSlideshowEnd.querySelector(".hero-slideshow__ctas");
      if (ctas) { ctas.style.opacity = "1"; ctas.style.transform = "none"; }
    }
    if (sceneEls.process) {
      processCards.forEach((card, i) => {
        card.style.opacity = i === 0 ? "1" : "0";
        card.style.transform = "none";
        card.classList.toggle("is-active", i === 0);
      });
      processDots.forEach((dot, i) => dot.classList.toggle("is-active", i === 0));
    }
  }

  // === Booking modal (Google Calendar) ===
  const bookingModal = document.getElementById("bookingModal");
  const bookingFrame = document.getElementById("bookingCalendar");
  let bookingLastFocus = null;
  const openBooking = () => {
    if (!bookingModal) return;
    bookingLastFocus = document.activeElement;
    // Lazy-load the calendar iframe the first time the modal opens
    if (bookingFrame && !bookingFrame.src && bookingFrame.dataset.src) {
      bookingFrame.src = bookingFrame.dataset.src;
    }
    bookingModal.hidden = false;
    bookingModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("booking-open");
    requestAnimationFrame(() => bookingModal.classList.add("is-open"));
    const closeBtn = bookingModal.querySelector("[data-booking-close].booking-modal__close");
    if (closeBtn) closeBtn.focus();
  };
  const closeBooking = () => {
    if (!bookingModal || bookingModal.hidden) return;
    bookingModal.classList.remove("is-open");
    document.body.classList.remove("booking-open");
    bookingModal.setAttribute("aria-hidden", "true");
    const finish = () => {
      bookingModal.hidden = true;
      if (bookingLastFocus && bookingLastFocus.focus) bookingLastFocus.focus();
    };
    bookingModal.addEventListener("transitionend", finish, { once: true });
    setTimeout(finish, 450);
  };
  document.querySelectorAll("[data-book-consultation], a[href$='#book']").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      openBooking();
      if (location.hash !== "#book") {
        history.pushState(null, "", "#book");
      }
    });
  });
  bookingModal?.querySelectorAll("[data-booking-close]").forEach((el) => {
    el.addEventListener("click", () => {
      closeBooking();
      if (location.hash === "#book") {
        history.replaceState(null, "", location.pathname + location.search);
      }
    });
  });
  // Deep-link: /#book opens the booking popup
  const openBookingFromHash = () => {
    if (location.hash === "#book") openBooking();
  };
  openBookingFromHash();
  window.addEventListener("hashchange", openBookingFromHash);

  // === Service enquiry modal (from list item → popup) ===
  const enquiryModal = document.getElementById("enquiryModal");
  const enquiryForm = document.getElementById("svcEnquiry");
  const enquiryCategory = document.getElementById("enquiryCategory");
  const enquiryService = document.getElementById("enquiryService");
  const enquiryCategoryLabel = document.getElementById("enquiryCategoryLabel");
  const enquiryServiceLabel = document.getElementById("enquiryServiceLabel");
  let enquiryLastFocus = null;
  const openEnquiry = (trigger) => {
    if (!enquiryModal || !enquiryForm) return;
    enquiryLastFocus = trigger || document.activeElement;
    const category = trigger?.dataset?.category || "";
    const service = trigger?.dataset?.service || "";
    if (enquiryCategory) enquiryCategory.value = category;
    if (enquiryService) enquiryService.value = service;
    if (enquiryCategoryLabel) enquiryCategoryLabel.textContent = category;
    if (enquiryServiceLabel) enquiryServiceLabel.textContent = service;
    const desc = enquiryForm.querySelector('[name="description"]');
    if (desc && !desc.value) {
      desc.placeholder = service
        ? `Tell us about your needs for ${service}`
        : "Tell us what you need";
    }
    const rect = trigger?.getBoundingClientRect?.();
    const fromX = rect ? rect.left + rect.width * 0.35 : window.innerWidth / 2;
    const fromY = rect ? rect.top + rect.height / 2 : window.innerHeight / 2;
    enquiryModal.style.setProperty("--from-x", `${fromX}px`);
    enquiryModal.style.setProperty("--from-y", `${fromY}px`);
    enquiryModal.hidden = false;
    enquiryModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("enquiry-open");
    requestAnimationFrame(() => {
      requestAnimationFrame(() => enquiryModal.classList.add("is-open"));
    });
    const nameInput = enquiryForm.querySelector('[name="name"]');
    if (nameInput) nameInput.focus();
  };
  const closeEnquiry = () => {
    if (!enquiryModal || enquiryModal.hidden) return;
    enquiryModal.classList.remove("is-open");
    document.body.classList.remove("enquiry-open");
    enquiryModal.setAttribute("aria-hidden", "true");
    const finish = () => {
      enquiryModal.hidden = true;
      if (enquiryForm) {
        const name = enquiryForm.querySelector('[name="name"]');
        const email = enquiryForm.querySelector('[name="email"]');
        const desc = enquiryForm.querySelector('[name="description"]');
        if (name) name.value = "";
        if (email) email.value = "";
        if (desc) desc.value = "";
      }
      if (enquiryLastFocus && enquiryLastFocus.focus) enquiryLastFocus.focus();
    };
    enquiryModal.addEventListener("transitionend", finish, { once: true });
    setTimeout(finish, 450);
  };
  document.addEventListener("click", (e) => {
    const trigger = e.target.closest("[data-svc-enquire]");
    if (!trigger) return;
    e.preventDefault();
    openEnquiry(trigger);
  });
  enquiryModal?.querySelectorAll("[data-enquiry-close]").forEach((el) => {
    el.addEventListener("click", closeEnquiry);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (enquiryModal && !enquiryModal.hidden) {
      closeEnquiry();
      return;
    }
    if (bookingModal && !bookingModal.hidden) {
      closeBooking();
      if (location.hash === "#book") {
        history.replaceState(null, "", location.pathname + location.search);
      }
    }
  });

  // === Forms (demo only — no backend) ===
  document.querySelectorAll("form").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const btn = form.querySelector("button[type='submit'] span") || form.querySelector("button span");
      if (btn) {
        const original = btn.textContent;
        btn.textContent = "Thank you!";
        setTimeout(() => {
          btn.textContent = original;
          if (form.id === "svcEnquiry") closeEnquiry();
        }, 1200);
      }
      if (form.id === "svcEnquiry") {
        const name = form.querySelector('[name="name"]');
        const email = form.querySelector('[name="email"]');
        const desc = form.querySelector('[name="description"]');
        if (name) name.value = "";
        if (email) email.value = "";
        if (desc) desc.value = "";
      } else {
        form.reset();
      }
    });
  });
})();
