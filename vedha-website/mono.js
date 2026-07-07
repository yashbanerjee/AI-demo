/* ============================================================
   Mōno Studio — interactions & scroll-driven animation
   Vanilla JS, no dependencies. All effects respect
   prefers-reduced-motion.
   ============================================================ */

(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const clamp01 = (v) => Math.min(1, Math.max(0, v));
  // How far a section has been scrolled through, 0 → 1
  const progressOf = (el) => {
    const rect = el.getBoundingClientRect();
    const total = rect.height - window.innerHeight;
    return total <= 0 ? 0 : clamp01(-rect.top / total);
  };

  // === Preloader ===
  const preloader = document.getElementById("preloader");
  const counter = document.getElementById("preloaderCount");
  if (reduceMotion) {
    preloader.remove();
  } else {
    document.body.style.overflow = "hidden";
    const start = performance.now();
    const DURATION = 1200;
    const tick = (now) => {
      const p = clamp01((now - start) / DURATION);
      counter.textContent = String(Math.round(p * 100));
      if (p < 1) {
        requestAnimationFrame(tick);
      } else {
        preloader.classList.add("is-done");
        document.body.style.overflow = "";
        preloader.addEventListener("transitionend", () => preloader.remove(), { once: true });
      }
    };
    requestAnimationFrame(tick);
  }

  // === Header: hide on scroll down, show on scroll up ===
  const header = document.getElementById("siteHeader");
  let lastY = window.scrollY;
  window.addEventListener("scroll", () => {
    const y = window.scrollY;
    header.classList.toggle("is-hidden", y > lastY && y > 120 && !document.body.classList.contains("menu-open"));
    lastY = y;
  }, { passive: true });

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

  // === Reveal on scroll ===
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
  document.querySelectorAll("[data-reveal], .split-words").forEach((el) => revealObserver.observe(el));

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

  // === Testimonials slider ===
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

  // ============================================================
  // Scroll-driven scenes (rAF loop, no scroll-jacking)
  // ============================================================
  const hero = document.getElementById("hero");
  const heroCard = document.getElementById("heroCard");
  const vision = document.getElementById("vision");
  const visionWords = [...document.querySelectorAll(".vision__word")];
  const visionImage = document.querySelector(".vision__image");
  const showreel = document.getElementById("showreel");
  const showreelMedia = document.getElementById("showreelMedia");
  const collage = document.querySelector(".collage-grid");

  // Vision scene: words fly through 3D space one after another,
  // then the image scales up from the void.
  const VISION_STEPS = visionWords.length + 1; // words + image
  const animateVision = (p) => {
    const seg = 1 / VISION_STEPS;
    visionWords.forEach((word, i) => {
      // local progress of this word's segment, with overlap for continuity
      const local = clamp01((p - i * seg) / (seg * 1.35));
      if (local <= 0 || local >= 1) {
        word.style.opacity = "0";
        return;
      }
      // Fly from deep z toward viewer, fade in then out
      const z = -900 + local * 1400;                 // -900px → +500px
      const fade = local < 0.5 ? local * 2 : (1 - local) * 2;
      word.style.opacity = String(clamp01(fade * 1.6));
      word.style.transform = `translateZ(${z}px)`;
    });
    // Image is the final "step"
    const imgLocal = clamp01((p - (VISION_STEPS - 1) * seg) / seg);
    visionImage.style.opacity = String(clamp01(imgLocal * 1.8));
    visionImage.style.transform = `scale(${0.6 + imgLocal * 0.4})`;
  };

  const animateScenes = () => {
    // Hero: white card shrinks and rounds, collage drifts behind it
    const hp = progressOf(hero);
    const scale = 1 - hp * 0.72;
    heroCard.style.transform = `scale(${scale})`;
    heroCard.style.borderRadius = `${hp * 24}px`;
    heroCard.style.opacity = String(1 - clamp01((hp - 0.75) * 4));
    collage.style.transform = `translateY(${(1 - hp) * 6}%) scale(${1.05 - hp * 0.05})`;

    animateVision(progressOf(vision));

    // Showreel: media scales from inset card to full-bleed
    const sp = progressOf(showreel);
    const inset = (1 - sp) * 6;
    showreelMedia.style.transform = `scale(${0.86 + sp * 0.14})`;
    showreelMedia.style.borderRadius = `${(1 - sp) * 20}px`;
    showreelMedia.style.margin = `${inset}vh ${inset}vw`;
  };

  if (!reduceMotion) {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        animateScenes();
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    animateScenes();
  } else {
    // Static fallback: show final states
    visionWords.forEach((w) => { w.style.opacity = "0"; });
    visionImage.style.opacity = "1";
  }

  // === Forms (demo only — no backend) ===
  document.querySelectorAll("form").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const btn = form.querySelector("button[type='submit'] span") || form.querySelector("button span");
      if (btn) {
        const original = btn.textContent;
        btn.textContent = "Thank you!";
        setTimeout(() => { btn.textContent = original; }, 2500);
      }
      form.reset();
    });
  });
})();
