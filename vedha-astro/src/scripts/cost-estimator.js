/**
 * Cost estimator wizard + cart (page-only).
 * Steps: 1 base → 2 modules → 3 details / send
 */
(function () {
  const root = document.getElementById("costEstimator");
  if (!root) return;

  const catalogEl = document.getElementById("estimator-catalog");
  let catalog = { bases: [], addons: [], recommendedByBase: {}, groups: [] };
  try {
    catalog = JSON.parse(catalogEl?.textContent || "{}");
  } catch {
    return;
  }

  const state = {
    step: 1,
    baseId: null,
    addonIds: new Set(),
    filter: "all",
    lastAdded: null,
    sent: false,
  };

  const $ = (sel) => root.querySelector(sel);
  const $$ = (sel) => [...root.querySelectorAll(sel)];

  const baseButtons = $$("[data-base-id]");
  const addonButtons = $$("[data-addon-id]");
  const chips = $$("[data-addon-chips] [data-filter]");
  const emptyMsg = $("[data-addons-empty]");
  const dock = $("[data-cart-dock]");
  const sheet = $("[data-cart-sheet]");
  const form = $("[data-estimator-form]");
  const submitBtn = $("[data-submit-estimate]");
  const successBox = $("[data-estimator-success]");
  const detailsBox = $(".estimator-details");
  const stepNextButtons = $$("[data-next-step]");
  const stepPrevButtons = $$("[data-prev-step]");
  const cartContinueButtons = $$("[data-cart-continue]");
  const cartBack = $("[data-cart-back]");
  const stepButtons = $$("[data-go-step]");
  const announce = $("[data-cart-announce]");
  const mainScroller = $("[data-estimator-main]");

  const fieldBase = $("[data-field-base]");
  const fieldAddons = $("[data-field-addons]");
  const fieldTotal = $("[data-field-total]");
  const fieldDescription = $("[data-field-description]");
  const fieldDelivery = $("[data-field-delivery]");

  const isDesktop = () => window.matchMedia("(min-width: 64rem)").matches;
  const prefersReduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const formatAed = (n) => `AED ${Number(n || 0).toLocaleString("en-AE")}`;

  function say(text) {
    if (!announce) return;
    announce.textContent = "";
    requestAnimationFrame(() => {
      announce.textContent = text;
    });
  }

  function estimateDelivery(base, addons) {
    if (!base) return { weeksMin: 0, weeksMax: 0, label: "—" };
    const extra = addons.reduce((sum, a) => sum + Number(a.weeksExtra || 0), 0);
    const weeksMin = base.weeksMin + Math.floor(extra * 0.5);
    const weeksMax = base.weeksMax + extra;
    const label =
      weeksMin === weeksMax
        ? `${weeksMin} week${weeksMin === 1 ? "" : "s"}`
        : `${weeksMin}–${weeksMax} weeks`;
    return { weeksMin, weeksMax, label };
  }

  function recommendedIds() {
    if (!state.baseId) return new Set();
    return new Set(catalog.recommendedByBase?.[state.baseId] || []);
  }

  function totals() {
    const base = catalog.bases.find((b) => b.id === state.baseId);
    const basePrice = base ? base.priceAed : 0;
    const addons = catalog.addons.filter((a) => state.addonIds.has(a.id));
    const addonsTotal = addons.reduce((sum, a) => sum + a.priceAed, 0);
    const delivery = estimateDelivery(base, addons);
    return {
      base,
      addons,
      total: basePrice + addonsTotal,
      count: (base ? 1 : 0) + addons.length,
      delivery,
    };
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function lineItemsHtml() {
    const { base, addons } = totals();
    if (!base && addons.length === 0) {
      return `<li class="estimator-cart__empty" data-cart-empty>Select a base to begin.</li>`;
    }
    const rows = [];
    if (base) {
      const isNew = state.lastAdded === `base:${base.id}`;
      rows.push(`
        <li class="estimator-cart__line estimator-cart__line--base${isNew ? " is-new" : ""}" data-line="base:${base.id}">
          <span class="estimator-cart__thumb"><img src="${escapeHtml(base.image)}" alt="" width="80" height="80" loading="lazy" /></span>
          <strong>${escapeHtml(base.name)}</strong>
          <span class="estimator-cart__price">${formatAed(base.priceAed)}</span>
          <button type="button" class="estimator-cart__remove" data-remove-base aria-label="Change base package">Change base</button>
        </li>`);
    }
    for (const addon of addons) {
      const isNew = state.lastAdded === `addon:${addon.id}`;
      rows.push(`
        <li class="estimator-cart__line${isNew ? " is-new" : ""}" data-line="addon:${addon.id}">
          <span class="estimator-cart__thumb"><img src="${escapeHtml(addon.image)}" alt="" width="80" height="80" loading="lazy" /></span>
          <strong>${escapeHtml(addon.name)}</strong>
          <span class="estimator-cart__price">${formatAed(addon.priceAed)}</span>
          <button type="button" class="estimator-cart__remove" data-remove-addon="${addon.id}" aria-label="Remove ${escapeHtml(addon.name)}">Remove</button>
        </li>`);
    }
    return rows.join("");
  }

  function buildDescription() {
    const { base, addons, total, delivery } = totals();
    if (!base) return "";
    const pref = String(form?.querySelector('[name="deliveryPreference"]')?.value || "").trim();
    return [
      `Cost estimator submission`,
      ``,
      `Base: ${base.name} — ${formatAed(base.priceAed)}`,
      ``,
      addons.length ? "Modules:" : "Modules: none",
      ...addons.map((a) => `- ${a.name} — ${formatAed(a.priceAed)}`),
      ``,
      `Total: ${formatAed(total)}`,
      `Estimated delivery: ${delivery.label}`,
      pref ? `Preferred timing: ${pref}` : "",
    ]
      .filter(Boolean)
      .join("\n");
  }

  const maxReachableStep = () => (state.baseId ? 3 : 1);

  function continueLabelFor(step) {
    if (step === 1) return "Continue to modules";
    if (step === 2) return "Continue to details";
    return "Send estimate";
  }

  function syncButtons() {
    const hasBase = Boolean(state.baseId);
    stepNextButtons.forEach((btn) => {
      if (btn.closest('[data-panel="1"]')) btn.disabled = !hasBase;
    });
    cartContinueButtons.forEach((btn) => {
      btn.disabled = !hasBase || (state.step === 3 && state.sent);
    });
    if (submitBtn) submitBtn.disabled = !hasBase;
    if (cartBack) cartBack.hidden = state.step === 1;

    const max = maxReachableStep();
    stepButtons.forEach((btn) => {
      const id = Number(btn.getAttribute("data-go-step"));
      btn.disabled = id > max;
      btn.classList.toggle("is-active", id === state.step);
      btn.classList.toggle("is-done", id < state.step);
      if (id === state.step) btn.setAttribute("aria-current", "step");
      else btn.removeAttribute("aria-current");
    });
  }

  function scrollToTop(target) {
    if (isDesktop() && mainScroller) {
      mainScroller.scrollTo({ top: 0, behavior: prefersReduced() ? "auto" : "smooth" });
    } else {
      target?.scrollIntoView({ behavior: prefersReduced() ? "auto" : "smooth", block: "start" });
    }
  }

  function setStep(step, { focus = true } = {}) {
    step = Math.max(1, Math.min(3, step));
    if (step > maxReachableStep()) step = maxReachableStep();
    state.step = step;
    root.dataset.step = String(step);

    let activePanel = null;
    $$("[data-panel]").forEach((panel) => {
      const id = Number(panel.getAttribute("data-panel"));
      const active = id === step;
      panel.classList.toggle("is-active", active);
      panel.hidden = !active;
      if (active) activePanel = panel;
    });

    const label = continueLabelFor(step);
    const cl = $("[data-cart-continue-label]");
    if (cl) cl.textContent = label;
    $$("[data-dock-continue] span").forEach((el) => {
      el.textContent = step === 1 ? "Next" : step === 2 ? "Details" : "Send";
    });
    $$("[data-cart-sheet] [data-cart-continue] span").forEach((el) => {
      el.textContent = label;
    });

    syncButtons();
    scrollToTop(activePanel);

    if (focus && activePanel) {
      const heading = activePanel.querySelector("h2[tabindex='-1']");
      heading?.focus({ preventScroll: true });
    }
  }

  function goNext() {
    if (state.step === 1 && !state.baseId) return;
    if (state.step < 3) setStep(state.step + 1);
    else form?.requestSubmit();
  }

  function goPrev() {
    if (state.step > 1) setStep(state.step - 1);
  }

  let bumpTimer = 0;
  function bumpTotal() {
    const els = $$("[data-cart-total], [data-cart-total-mobile]");
    els.forEach((el) => el.classList.add("is-bump"));
    clearTimeout(bumpTimer);
    bumpTimer = setTimeout(() => els.forEach((el) => el.classList.remove("is-bump")), 260);
  }

  function renderCart({ announceText } = {}) {
    const { base, addons, total, count, delivery } = totals();

    $$("[data-cart-lines], [data-cart-lines-mobile]").forEach((el) => {
      el.innerHTML = lineItemsHtml();
    });
    $$("[data-cart-total], [data-cart-total-mobile], [data-dock-total], [data-summary-total]").forEach((el) => {
      el.textContent = formatAed(total);
    });
    $$("[data-delivery-label], [data-delivery-label-cart], [data-delivery-label-mobile]").forEach((el) => {
      el.textContent = delivery.label;
    });
    const countLabel = count === 1 ? "1 item" : `${count} items`;
    $$("[data-dock-count], [data-cart-count]").forEach((el) => {
      el.textContent = countLabel;
    });
    const sBase = $("[data-summary-base]");
    if (sBase) sBase.textContent = base ? base.name : "—";
    const sMods = $("[data-summary-modules]");
    if (sMods) sMods.textContent = String(addons.length);

    dock?.classList.toggle("is-visible", count > 0);

    if (fieldBase) fieldBase.value = base ? base.name : "";
    if (fieldAddons) fieldAddons.value = addons.map((a) => a.name).join(", ");
    if (fieldTotal) fieldTotal.value = String(total);
    if (fieldDelivery) fieldDelivery.value = delivery.label;
    if (fieldDescription) fieldDescription.value = buildDescription();

    syncButtons();
    if (announceText) say(`${announceText} Total ${formatAed(total)}.`);

    // Scroll the newest line into view inside the cart list
    if (state.lastAdded) {
      const line = $(`[data-cart-lines] [data-line="${state.lastAdded}"]`);
      line?.scrollIntoView({ block: "nearest", behavior: prefersReduced() ? "auto" : "smooth" });
    }
  }

  function matchesFilter(btn, rec) {
    const id = btn.getAttribute("data-addon-id");
    const group = btn.getAttribute("data-addon-group");
    const popular = btn.getAttribute("data-addon-popular") === "1";
    if (state.filter === "all") return true;
    if (state.filter === "recommended") return rec.has(id);
    if (state.filter === "popular") return popular;
    return group === state.filter;
  }

  function syncFilterChips() {
    chips.forEach((chip) => {
      const active = chip.getAttribute("data-filter") === state.filter;
      chip.classList.toggle("is-active", active);
      chip.setAttribute("aria-selected", active ? "true" : "false");
      chip.tabIndex = active ? 0 : -1;
    });
  }

  function applyAddonFilter(id) {
    const next = chips.some((c) => c.getAttribute("data-filter") === id) ? id : "all";
    state.filter = next;
    syncFilterChips();
    sortAndFilterAddons();
    const label = chips.find((c) => c.getAttribute("data-filter") === next)?.textContent?.trim() || next;
    say(`Showing ${label} modules.`);
  }

  function sortAndFilterAddons() {
    const rec = recommendedIds();
    const grid = $("[data-addon-grid]");
    if (!grid) return;

    const visible = [];
    const hidden = [];
    for (const btn of addonButtons) {
      const id = btn.getAttribute("data-addon-id");
      const isRec = rec.has(id);
      const badge = btn.querySelector("[data-rec-badge]");
      if (badge) badge.hidden = !isRec;
      btn.classList.toggle("is-recommended", isRec);

      const show = matchesFilter(btn, rec);
      btn.hidden = !show;
      btn.classList.toggle("is-filtered-out", !show);
      if (show) visible.push(btn);
      else hidden.push(btn);
    }

    visible.sort((a, b) => {
      const aRec = rec.has(a.getAttribute("data-addon-id")) ? 0 : 1;
      const bRec = rec.has(b.getAttribute("data-addon-id")) ? 0 : 1;
      if (aRec !== bRec) return aRec - bRec;
      const aPop = a.getAttribute("data-addon-popular") === "1" ? 0 : 1;
      const bPop = b.getAttribute("data-addon-popular") === "1" ? 0 : 1;
      return aPop - bPop;
    });

    for (const btn of visible) grid.appendChild(btn);
    for (const btn of hidden) grid.appendChild(btn);
    if (emptyMsg) {
      emptyMsg.hidden = visible.length > 0;
      if (!visible.length) {
        const label = chips.find((c) => c.getAttribute("data-filter") === state.filter)?.textContent?.trim() || "this filter";
        emptyMsg.textContent =
          state.filter === "recommended" && !state.baseId
            ? "Pick a base first to see recommended modules."
            : `No modules in ${label}. Try another filter.`;
      }
    }
  }

  function paintBases() {
    for (const btn of baseButtons) {
      const selected = btn.getAttribute("data-base-id") === state.baseId;
      btn.setAttribute("aria-checked", selected ? "true" : "false");
      btn.tabIndex = state.baseId ? (selected ? 0 : -1) : 0;
      const stateEl = btn.querySelector("[data-base-state]");
      if (stateEl) stateEl.textContent = selected ? "Selected" : "Select";
    }
    // Roving tabindex fallback: if nothing selected, first card is tabbable
    if (!state.baseId && baseButtons[0]) baseButtons.forEach((b, i) => (b.tabIndex = i === 0 ? 0 : -1));
  }

  function paintAddons() {
    for (const btn of addonButtons) {
      const on = state.addonIds.has(btn.getAttribute("data-addon-id"));
      btn.setAttribute("aria-pressed", on ? "true" : "false");
      const action = btn.querySelector("[data-addon-action]");
      if (action) action.textContent = on ? "Added" : "Add";
    }
  }

  function selectBase(id) {
    const base = catalog.bases.find((b) => b.id === id);
    if (!base) return;
    const changed = state.baseId !== id;
    state.baseId = id;
    state.lastAdded = `base:${id}`;
    state.sent = false;
    paintBases();
    sortAndFilterAddons();
    renderCart({ announceText: changed ? `${base.name} selected as base.` : "" });
    if (changed) bumpTotal();
  }

  function toggleAddon(id) {
    const addon = catalog.addons.find((a) => a.id === id);
    if (!addon) return;
    const adding = !state.addonIds.has(id);
    if (adding) state.addonIds.add(id);
    else state.addonIds.delete(id);
    state.lastAdded = adding ? `addon:${id}` : null;
    paintAddons();
    renderCart({ announceText: adding ? `${addon.name} added.` : `${addon.name} removed.` });
    bumpTotal();
  }

  function resetAll({ toStep = 1 } = {}) {
    state.baseId = null;
    state.addonIds.clear();
    state.lastAdded = null;
    state.sent = false;
    state.filter = "all";
    paintBases();
    paintAddons();
    syncFilterChips();
    sortAndFilterAddons();
    if (successBox) successBox.hidden = true;
    if (detailsBox) detailsBox.hidden = false;
    const note = form?.querySelector("[data-form-note]");
    if (note) {
      note.hidden = true;
      note.textContent = "";
      note.classList.remove("is-error");
    }
    form?.reset();
    renderCart({ announceText: "Estimate cleared." });
    setStep(toStep);
  }

  /* ---------- Events ---------- */

  baseButtons.forEach((btn) => {
    btn.addEventListener("click", () => selectBase(btn.getAttribute("data-base-id")));
  });

  // Arrow-key navigation inside the radiogroup
  $("[data-base-group]")?.addEventListener("keydown", (e) => {
    const keys = ["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp", "Home", "End"];
    if (!keys.includes(e.key)) return;
    const current = document.activeElement;
    const idx = baseButtons.indexOf(current);
    if (idx === -1) return;
    e.preventDefault();
    let next = idx;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (idx + 1) % baseButtons.length;
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (idx - 1 + baseButtons.length) % baseButtons.length;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = baseButtons.length - 1;
    baseButtons[next].focus();
    selectBase(baseButtons[next].getAttribute("data-base-id"));
  });

  addonButtons.forEach((btn) => {
    btn.addEventListener("click", () => toggleAddon(btn.getAttribute("data-addon-id")));
  });

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      applyAddonFilter(chip.getAttribute("data-filter") || "all");
    });
  });
  $("[data-addon-chips]")?.addEventListener("keydown", (e) => {
    if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(e.key)) return;
    const idx = chips.indexOf(document.activeElement);
    if (idx === -1) return;
    e.preventDefault();
    let next = idx;
    if (e.key === "ArrowRight") next = (idx + 1) % chips.length;
    if (e.key === "ArrowLeft") next = (idx - 1 + chips.length) % chips.length;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = chips.length - 1;
    chips[next].focus();
    applyAddonFilter(chips[next].getAttribute("data-filter") || "all");
  });

  stepNextButtons.forEach((btn) => btn.addEventListener("click", goNext));
  stepPrevButtons.forEach((btn) => btn.addEventListener("click", goPrev));
  cartBack?.addEventListener("click", goPrev);
  cartContinueButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (state.step < 3) goNext();
      else form?.requestSubmit();
    });
  });
  stepButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.getAttribute("data-go-step"));
      if (id <= maxReachableStep()) setStep(id);
    });
  });

  root.addEventListener("click", (e) => {
    const removeAddon = e.target.closest("[data-remove-addon]");
    if (removeAddon) {
      toggleAddon(removeAddon.getAttribute("data-remove-addon"));
      return;
    }
    if (e.target.closest("[data-remove-base]")) {
      resetAll({ toStep: 1 });
      closeSheet();
      return;
    }
    if (e.target.closest("[data-reset-estimator]")) {
      resetAll({ toStep: 1 });
    }
  });

  /* ---------- Mobile sheet ---------- */
  let lastFocus = null;
  function openSheet() {
    if (!sheet) return;
    lastFocus = document.activeElement;
    sheet.hidden = false;
    $("[data-cart-open]")?.setAttribute("aria-expanded", "true");
    sheet.querySelector(".estimator-sheet__close")?.focus();
    document.addEventListener("keydown", onSheetKey);
  }
  function closeSheet() {
    if (!sheet || sheet.hidden) return;
    sheet.hidden = true;
    $("[data-cart-open]")?.setAttribute("aria-expanded", "false");
    document.removeEventListener("keydown", onSheetKey);
    if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus({ preventScroll: true });
  }
  function onSheetKey(e) {
    if (e.key === "Escape") closeSheet();
  }
  $("[data-cart-open]")?.addEventListener("click", openSheet);
  $$("[data-cart-close]").forEach((el) => el.addEventListener("click", closeSheet));

  /* ---------- Form sync ---------- */
  form?.querySelector('[name="deliveryPreference"]')?.addEventListener("change", () => {
    if (fieldDescription) fieldDescription.value = buildDescription();
  });

  form?.addEventListener(
    "submit",
    (e) => {
      // Native-style validation on our own terms (form is novalidate)
      if (!form.checkValidity()) {
        e.preventDefault();
        e.stopImmediatePropagation();
        const firstInvalid = form.querySelector(":invalid");
        firstInvalid?.focus();
        firstInvalid?.reportValidity?.();
        return;
      }
      if (fieldDescription) fieldDescription.value = buildDescription();
      if (fieldDelivery) fieldDelivery.value = totals().delivery.label;
    },
    true
  );

  // main.js calls form.reset() after a successful send → hidden fields are wiped.
  // Re-sync them and show the success card.
  form?.addEventListener("reset", () => {
    requestAnimationFrame(() => {
      const note = form.querySelector("[data-form-note]");
      const succeeded = note && !note.hidden && !note.classList.contains("is-error");
      renderCart();
      if (succeeded && !state.sent) {
        state.sent = true;
        if (detailsBox) detailsBox.hidden = true;
        if (successBox) {
          successBox.hidden = false;
          successBox.querySelector(".btn")?.focus({ preventScroll: true });
        }
        syncButtons();
        say("Estimate sent. We will reply within 48 hours.");
      }
    });
  });

  /* ---------- Init ---------- */
  paintBases();
  paintAddons();
  syncFilterChips();
  sortAndFilterAddons();
  renderCart();
  setStep(1, { focus: false });
})();
