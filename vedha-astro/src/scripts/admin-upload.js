/**
 * Shared admin image uploader. Buttons: [data-upload-target="inputId"]
 * Optional preview: [data-upload-preview="imgId"]
 */
(function () {
  const picker = document.getElementById("filePicker");
  if (!picker) return;
  let targetId = "";
  let previewId = "";

  document.querySelectorAll("[data-upload-target]").forEach((btn) => {
    btn.addEventListener("click", () => {
      targetId = btn.getAttribute("data-upload-target") || "";
      previewId = btn.getAttribute("data-upload-preview") || "";
      picker.click();
    });
  });

  picker.addEventListener("change", async () => {
    const file = picker.files?.[0];
    const target = document.getElementById(targetId);
    if (!file || !(target instanceof HTMLInputElement)) return;

    const body = new FormData();
    body.append("file", file);
    const res = await fetch("/api/admin/upload/", { method: "POST", body });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: "Upload failed" }));
      alert(err.error || "Upload failed");
      picker.value = "";
      return;
    }
    const { url } = await res.json();
    target.value = url;
    const preview = previewId ? document.getElementById(previewId) : null;
    if (preview instanceof HTMLImageElement) {
      preview.src = url;
      preview.style.display = "";
    }
    picker.value = "";
  });
})();
