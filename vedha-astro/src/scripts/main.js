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
    const delta = y - lastY;
    // Small dead-zone so tiny touch jitters don't flicker the header
    if (Math.abs(delta) > 6) {
      header.classList.toggle("is-hidden", delta > 0 && y > 120 && !document.body.classList.contains("menu-open"));
      lastY = y;
    }
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

  // === FAQ: smooth height animation for <details> ===
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
      if (closing) item.classList.add("is-closing"); // fades the answer out
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
  if (process && processStage && processCards.length) sceneEls.process = process;
  const hasScenes = Object.keys(sceneEls).length > 0;

  // Smoothed progress state per scene
  const scenes = { hero: 0, showreel: 0, heroVideo: 0, process: 0 };

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
  const initHeroVideo = () => {
    if (!heroVideoMedia) return;
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
    unlockHeroVideo();
  };
  if (sceneEls.heroVideo) initHeroVideo();

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

  // Video hero timing: a black intro cover fades first so the video emerges
  // from the dark, the video then scrubs over the middle of the scroll, and
  // finally the end overlay (bg colour + logo) fades in over the rest.
  const HERO_VIDEO_INTRO_END = 0.12;
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

    // Intro: black cover fades out while the video settles from a slight zoom
    const introLocal = clamp01(p / HERO_VIDEO_INTRO_END);
    if (heroVideoIntro) heroVideoIntro.style.opacity = String(1 - introLocal);
    heroVideoMedia.style.transform = `scale(${1.08 - introLocal * 0.08})`;

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
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && bookingModal && !bookingModal.hidden) {
      closeBooking();
      if (location.hash === "#book") {
        history.replaceState(null, "", location.pathname + location.search);
      }
    }
  });
  // Deep-link: /#book opens the booking popup
  const openBookingFromHash = () => {
    if (location.hash === "#book") openBooking();
  };
  openBookingFromHash();
  window.addEventListener("hashchange", openBookingFromHash);

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
