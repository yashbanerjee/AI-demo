(() => {
  const toastEl = document.querySelector("[data-toast]");
  let toastTimer;
  const toast = (message) => {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("is-visible"), 3200);
  };

  // —— Slides 2–4 load after the page is idle, staggered like vedha.ae ——
  const loadSlide = (slide) => {
    slide.querySelectorAll("[data-srcset]").forEach((el) => {
      el.srcset = el.dataset.srcset;
      el.removeAttribute("data-srcset");
    });
    slide.querySelectorAll("img[data-src]").forEach((img) => {
      img.src = img.dataset.src;
      img.removeAttribute("data-src");
    });
  };
  const lazySlides = [...document.querySelectorAll("[data-lazy-slide]")];
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const start = () => {
      lazySlides.forEach((slide, i) => setTimeout(() => loadSlide(slide), 2500 + i * 8000));
    };
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
  }

  // —— Share ——
  document.querySelector("[data-share]")?.addEventListener("click", async () => {
    const data = {
      title: "Vedha Technologies",
      text: "Custom software development in Dubai — call, email or book a free consultation.",
      url: location.href.split("#")[0],
    };
    if (navigator.share) {
      try { await navigator.share(data); } catch { /* dismissed */ }
      return;
    }
    try {
      await navigator.clipboard.writeText(data.url);
      toast("Link copied");
    } catch {
      toast(data.url);
    }
  });

  // —— Save contact ——
  // Social in-app browsers (Instagram, Facebook, TikTok…) often can't hand
  // a .vcf to the Contacts app, so point people to their real browser.
  const inAppBrowser = /Instagram|FBAN|FBAV|FB_IAB|Line\/|TikTok|Snapchat|LinkedInApp/i.test(navigator.userAgent);
  document.querySelector("[data-save-contact]")?.addEventListener("click", () => {
    if (inAppBrowser) {
      toast("If nothing opens, tap ⋯ and choose “Open in browser”");
    } else if (/Android/i.test(navigator.userAgent)) {
      toast("Downloading contact — tap it to add to Contacts");
    }
  });
})();
