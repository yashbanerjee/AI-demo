/* ============================================================
   Smooth scroll (Lenis)
   Inertia-smoothed wheel/trackpad scrolling on pointer devices.
   Touch keeps native momentum scrolling (syncTouch is off), and
   prefers-reduced-motion disables the effect entirely. Scroll
   position is still the real window scroll, so every existing
   scroll listener (header, scenes, reveals) keeps working.
   ============================================================ */

import Lenis from "lenis";

(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion || window.__lenis) return;

  // Containers that manage their own scrolling; wheel events inside them
  // must never be hijacked, even while the page is locked behind a modal.
  const OWN_SCROLLERS =
    ".booking-modal, .enquiry-modal, .menu-overlay, .estimator-sheet, [data-estimator-main], [data-lenis-prevent]";

  const headerOffset = () =>
    -(parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 80);

  const lenis = new Lenis({
    // Lower = more glide. 0.09 reads as "expensive" without feeling laggy.
    lerp: 0.09,
    wheelMultiplier: 0.95,
    smoothWheel: true,
    syncTouch: false,
    allowNestedScroll: true,
    anchors: false, // handled below so modal links (#book) stay untouched
    prevent: (node) => Boolean(node.closest && node.closest(OWN_SCROLLERS)),
  });

  // In-page anchors glide with the same easing. Links another script has
  // already claimed (e.g. #book opens the booking popup) are left alone.
  document.addEventListener("click", (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey) return;
    const link = event.target instanceof Element ? event.target.closest("a[href*='#']") : null;
    if (!link) return;
    const url = new URL(link.href, location.href);
    if (url.origin !== location.origin || url.pathname !== location.pathname || !url.hash) return;
    if (url.hash === "#book" || url.hash === "#") return;
    let target = null;
    try { target = document.querySelector(decodeURIComponent(url.hash)); } catch { return; }
    if (!target) return;
    event.preventDefault();
    lenis.scrollTo(target, { offset: headerOffset() });
    history.pushState(null, "", url.hash);
  });

  window.__lenis = lenis;
  document.documentElement.classList.add("has-smooth-scroll");

  const raf = (time) => {
    lenis.raf(time);
    requestAnimationFrame(raf);
  };
  requestAnimationFrame(raf);

  // Pause while the page is scroll-locked (menu / modals / preloader set
  // overflow:hidden on <body>), resume as soon as it's released.
  const body = document.body;
  let wasLocked = false;
  const syncLock = () => {
    const locked = getComputedStyle(body).overflow === "hidden";
    if (locked === wasLocked) return;
    wasLocked = locked;
    if (locked) lenis.stop();
    else lenis.start();
  };
  new MutationObserver(syncLock).observe(body, {
    attributes: true,
    attributeFilter: ["class", "style"],
  });
  syncLock();

})();
