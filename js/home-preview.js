const PREVIEW_DELAY_MS = 3000;

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

function initHomePreview() {
  if (!document.body.classList.contains("page-home")) return;
  if (!document.getElementById("home-preview")) return;

  renderHomePreview();
  document.addEventListener("acrosstool:lang", renderHomePreview);
  window.setTimeout(revealHomePreview, PREVIEW_DELAY_MS);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initHomePreview);
} else {
  initHomePreview();
}
