const PREVIEW_DELAY_MS = 3000;
const PREVIEW_REVEAL_MS = 2900;
const PREVIEW_HOLD_MS = 1800;
const PREVIEW_RETURN_MS = 1150;

let previewTimer = 0;

function escapePreviewHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function previewLines(value) {
  const lang = typeof getLang === "function" ? getLang() : "en";
  let picked = value;
  if (value && typeof value === "object" && !Array.isArray(value)) {
    picked = value[lang] || value.en || "";
  }
  const items = Array.isArray(picked) ? picked : [picked];
  return items.filter(Boolean);
}

function renderHomePreview() {
  const list = document.getElementById("home-preview-list");
  if (!list || typeof PROJECTS === "undefined") return;

  const settled = document.body.classList.contains("is-preview");

  const items = PROJECTS.slice(0, 3)
    .map((project) => {
      const tagline = previewLines(project.tagline)
        .map((line) => `<p class="home-preview__tagline">${escapePreviewHtml(line)}</p>`)
        .join("");
      const description = previewLines(project.description)
        .map((line) => `<p class="home-preview__desc">${escapePreviewHtml(line)}</p>`)
        .join("");
      const href = project.url || "/projects";

      return `
        <div class="home-preview__row${settled ? " is-settled" : ""}">
          <span class="home-preview__mark" aria-hidden="true"></span>
          <a class="home-preview__item" href="${escapePreviewHtml(href)}">
            <h2 class="home-preview__title">${escapePreviewHtml(project.title)}</h2>
            ${tagline}
            ${description}
          </a>
        </div>
      `;
    })
    .join("");

  list.innerHTML = `<div class="home-preview__stack">${items}</div>`;
}

function revealHomePreview() {
  const preview = document.getElementById("home-preview");
  document.body.classList.add("is-preview");
  if (!preview) return;
  preview.removeAttribute("aria-hidden");
  preview.removeAttribute("inert");
}

function concealHomePreview() {
  const preview = document.getElementById("home-preview");
  document.body.classList.remove("is-preview");
  if (!preview) return;
  preview.setAttribute("aria-hidden", "true");
  preview.setAttribute("inert", "");
}

function queuePreviewCycle() {
  window.clearTimeout(previewTimer);
  previewTimer = window.setTimeout(() => {
    revealHomePreview();
    previewTimer = window.setTimeout(() => {
      concealHomePreview();
      previewTimer = window.setTimeout(queuePreviewCycle, PREVIEW_RETURN_MS);
    }, PREVIEW_REVEAL_MS + PREVIEW_HOLD_MS);
  }, PREVIEW_DELAY_MS);
}

function initHomePreview() {
  if (!document.body.classList.contains("page-home")) return;
  if (!document.getElementById("home-preview")) return;

  revealHomePreview();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initHomePreview);
} else {
  initHomePreview();
}
