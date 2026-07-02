// === PDF to Word Converter ===

const dropZone = document.getElementById("drop-zone");
const fileInput = document.getElementById("file-input");
const fileNameEl = document.getElementById("file-name");
const convertBtn = document.getElementById("convert-btn");
const statusEl = document.getElementById("status");

let selectedFile = null;

/** @param {string} message @param {"error"|"success"|"loading"|""} type */
function setStatus(message, type = "") {
  statusEl.textContent = message;
  statusEl.className = "status";
  if (type) statusEl.classList.add(`status--${type}`);
}

/** @param {File|null} file */
function setFile(file) {
  selectedFile = file;
  fileNameEl.textContent = file ? file.name : "";
  convertBtn.disabled = !file;
  setStatus("");
}

/** @param {File} file */
function handleFileSelection(file) {
  if (!file.name.toLowerCase().endsWith(".pdf") && file.type !== "application/pdf") {
    setFile(null);
    setStatus("Please select a PDF file.", "error");
    return;
  }
  setFile(file);
}

/** Trigger a browser download from a Blob. */
function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

async function convert() {
  if (!selectedFile) return;

  convertBtn.disabled = true;
  setStatus("Converting…", "loading");

  const formData = new FormData();
  formData.append("file", selectedFile);

  try {
    const response = await fetch("/convert", { method: "POST", body: formData });

    if (!response.ok) {
      const errorText = await response.text();
      setStatus(errorText || "Conversion failed.", "error");
      return;
    }

    const blob = await response.blob();
    const disposition = response.headers.get("Content-Disposition") || "";
    const match = disposition.match(/filename="(.+?)"/);
    const filename = match ? match[1] : "converted.docx";

    downloadBlob(blob, filename);
    setStatus("Download started!", "success");
  } catch {
    setStatus("Network error. Is the server running?", "error");
  } finally {
    convertBtn.disabled = !selectedFile;
  }
}

// === Drop zone events ===
dropZone.addEventListener("click", () => fileInput.click());

dropZone.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    fileInput.click();
  }
});

dropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropZone.classList.add("drop-zone--active");
});

dropZone.addEventListener("dragleave", () => {
  dropZone.classList.remove("drop-zone--active");
});

dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropZone.classList.remove("drop-zone--active");
  const file = e.dataTransfer?.files[0];
  if (file) handleFileSelection(file);
});

fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  if (file) handleFileSelection(file);
});

convertBtn.addEventListener("click", convert);
