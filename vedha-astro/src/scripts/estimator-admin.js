/**
 * Slide-over editor for the estimator admin list.
 */
(function () {
  const root = document.getElementById("estimatorDrawer");
  const catalogEl = document.getElementById("estimator-admin-catalog");
  if (!root || !catalogEl) return;

  let catalog = { bases: [], addons: [], recommendedByBase: {}, tags: [] };
  try {
    catalog = JSON.parse(catalogEl.textContent || "{}");
  } catch {
    return;
  }

  const panel = root.querySelector("[data-drawer-panel]");
  const titleEl = root.querySelector("[data-drawer-title]");
  const noteEl = root.querySelector("[data-drawer-note]");
  const baseForm = root.querySelector("[data-form-base]");
  const addonForm = root.querySelector("[data-form-addon]");
  const picker = document.getElementById("filePicker");
  let lastFocus = null;

  function say(text, isError) {
    if (!noteEl) return;
    noteEl.hidden = !text;
    noteEl.textContent = text || "";
    noteEl.classList.toggle("notice--error", Boolean(isError));
    noteEl.classList.toggle("notice--ok", Boolean(text) && !isError);
  }

  function fillChecks(form, name, ids) {
    const set = new Set(ids || []);
    form.querySelectorAll(`input[name="${name}"]`).forEach((box) => {
      box.checked = set.has(box.value);
    });
  }

  function setImage(form, url) {
    const input = form.querySelector('input[name="image"]');
    const preview = form.querySelector("[data-image-preview]");
    if (input) input.value = url || "";
    if (preview instanceof HTMLImageElement) {
      if (url) {
        preview.src = url;
        preview.hidden = false;
      } else {
        preview.removeAttribute("src");
        preview.hidden = true;
      }
    }
  }

  function showForm(kind) {
    baseForm.hidden = kind !== "base";
    addonForm.hidden = kind !== "addon";
  }

  function open() {
    lastFocus = document.activeElement;
    root.hidden = false;
    requestAnimationFrame(() => root.classList.add("is-open"));
    document.body.style.overflow = "hidden";
    titleEl?.focus();
  }

  function close() {
    root.classList.remove("is-open");
    document.body.style.overflow = "";
    say("");
    window.setTimeout(() => {
      if (!root.classList.contains("is-open")) root.hidden = true;
    }, 220);
    if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
  }

  function openBase(id) {
    const isNew = !id;
    const base = catalog.bases.find((item) => item.id === id);
    showForm("base");
    titleEl.textContent = isNew ? "New base" : `Edit ${base?.name || "base"}`;
    baseForm.querySelector("[name=_action]").value = isNew ? "create-base" : "update-base";
    const idField = baseForm.querySelector("[name=id]");
    const idWrap = baseForm.querySelector("[data-id-field]");
    idField.value = base?.id || "";
    idField.readOnly = !isNew;
    if (idWrap) idWrap.hidden = false;
    const idHint = baseForm.querySelector("[data-id-hint]");
    if (idHint) idHint.textContent = isNew ? "(leave empty to generate from the name)" : "";
    baseForm.querySelector("[name=name]").value = base?.name || "";
    baseForm.querySelector("[name=description]").value = base?.description || "";
    baseForm.querySelector("[name=priceAed]").value = base ? base.priceAed : 10000;
    baseForm.querySelector("[name=weeksMin]").value = base ? base.weeksMin : 2;
    baseForm.querySelector("[name=weeksMax]").value = base ? base.weeksMax : 4;
    baseForm.querySelector("[name=sortOrder]").value = base?.sortOrder ?? 99;
    setImage(baseForm, base?.image || "");
    fillChecks(baseForm, "recommended", catalog.recommendedByBase[id] || []);
    baseForm.querySelector("[data-delete]")?.toggleAttribute("hidden", isNew);
    say("");
    open();
  }

  function recommendForAddon(addonId) {
    return Object.entries(catalog.recommendedByBase)
      .filter(([, ids]) => (ids || []).includes(addonId))
      .map(([baseId]) => baseId);
  }

  function openAddon(id) {
    const isNew = !id;
    const addon = catalog.addons.find((item) => item.id === id);
    showForm("addon");
    titleEl.textContent = isNew ? "New module" : `Edit ${addon?.name || "module"}`;
    addonForm.querySelector("[name=_action]").value = isNew ? "create-addon" : "update-addon";
    const idField = addonForm.querySelector("[name=id]");
    const idWrap = addonForm.querySelector("[data-id-field]");
    idField.value = addon?.id || "";
    idField.readOnly = !isNew;
    if (idWrap) idWrap.hidden = false;
    const idHint = addonForm.querySelector("[data-id-hint]");
    if (idHint) idHint.textContent = isNew ? "(leave empty to generate from the name)" : "";
    addonForm.querySelector("[name=name]").value = addon?.name || "";
    addonForm.querySelector("[name=description]").value = addon?.description || "";
    addonForm.querySelector("[name=priceAed]").value = addon ? addon.priceAed : 2500;
    addonForm.querySelector("[name=weeksExtra]").value = addon ? addon.weeksExtra : 0;
    addonForm.querySelector("[name=sortOrder]").value = addon?.sortOrder ?? 99;
    addonForm.querySelector("[name=group]").value = addon?.group || "platform";
    addonForm.querySelector("[name=popular]").checked = Boolean(addon?.popular);
    setImage(addonForm, addon?.image || "");
    fillChecks(addonForm, "recommendFor", recommendForAddon(id));
    addonForm.querySelector("[data-delete]")?.toggleAttribute("hidden", isNew);
    say("");
    open();
  }

  async function submitForm(form) {
    say("");
    const submit = form.querySelector("[type=submit]");
    if (submit) submit.disabled = true;
    try {
      const res = await fetch("/api/admin/estimator/", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok || body.ok === false) {
        const map = {
          missing: "Name is required.",
          exists: "That id already exists.",
          save: "Could not save. Try again.",
        };
        throw new Error(map[body.error] || body.error || "Could not save.");
      }
      say("Saved.");
      window.setTimeout(() => {
        window.location.assign("/admin/estimator/?saved=1");
      }, 180);
    } catch (err) {
      say(err.message || "Could not save.", true);
    } finally {
      if (submit) submit.disabled = false;
    }
  }

  async function destroy(kind, id) {
    if (!id) return;
    const label = kind === "base" ? "base" : "module";
    if (!window.confirm(`Delete this ${label} permanently?`)) return;
    const data = new FormData();
    data.set("_action", kind === "base" ? "delete-base" : "delete-addon");
    data.set("id", id);
    const res = await fetch("/api/admin/estimator/", {
      method: "POST",
      headers: { Accept: "application/json" },
      body: data,
    });
    if (!res.ok) {
      say("Could not delete.", true);
      return;
    }
    window.location.assign("/admin/estimator/?saved=1");
  }

  document.addEventListener("click", (e) => {
    const openBtn = e.target.closest("[data-open-drawer]");
    if (openBtn) {
      e.preventDefault();
      const kind = openBtn.getAttribute("data-open-drawer");
      const id = openBtn.getAttribute("data-id") || "";
      if (kind === "base") openBase(id);
      else openAddon(id);
      return;
    }
    if (e.target.closest("[data-drawer-close]")) close();
  });

  root.addEventListener("click", (e) => {
    if (e.target === root.querySelector("[data-drawer-backdrop]")) close();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && root.classList.contains("is-open")) close();
  });

  [baseForm, addonForm].forEach((form) => {
    form?.addEventListener("submit", (e) => {
      e.preventDefault();
      submitForm(form);
    });
  });

  baseForm?.querySelector("[data-delete]")?.addEventListener("click", () => {
    destroy("base", baseForm.querySelector("[name=id]")?.value);
  });
  addonForm?.querySelector("[data-delete]")?.addEventListener("click", () => {
    destroy("addon", addonForm.querySelector("[name=id]")?.value);
  });

  picker?.addEventListener("change", async () => {
    const file = picker.files?.[0];
    const form = root.querySelector("form:not([hidden])");
    const input = form?.querySelector('input[name="image"]');
    if (!file || !(input instanceof HTMLInputElement)) return;
    const body = new FormData();
    body.append("file", file);
    const res = await fetch("/api/admin/upload/", { method: "POST", body });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: "Upload failed" }));
      say(err.error || "Upload failed", true);
      picker.value = "";
      return;
    }
    const { url } = await res.json();
    setImage(form, url);
    picker.value = "";
  });

  root.querySelectorAll("[data-upload]").forEach((btn) => {
    btn.addEventListener("click", () => picker?.click());
  });
})();
