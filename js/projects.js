function localizeField(value) {
  const lang = typeof getLang === "function" ? getLang() : "en";
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value[lang] || value.en || "";
  }
  return value;
}

function renderProjects(projects) {
  const grid = document.getElementById("projects-grid");
  if (!grid) return;

  const viewLabel = typeof t === "function" ? t("projects.view") : "View project →";

  grid.innerHTML = projects
    .map((project) => {
      const tagline = localizeField(project.tagline);
      const description = localizeField(project.description);
      return `
    <article class="project-card" role="listitem">
      ${renderProjectMedia(project)}
      <div class="project-card__body">
        <div class="project-card__content">
          <h2 class="project-card__title">${escapeHtml(project.title)}</h2>
          ${
            tagline
              ? `<p class="project-card__tagline">${escapeHtml(tagline)}</p>`
              : ""
          }
          ${renderDescriptions(description)}
        </div>
        ${
          project.url
            ? `<div class="project-card__footer">
            <a class="project-card__link" href="${escapeHtml(project.url)}">${escapeHtml(viewLabel)}</a>
          </div>`
            : ""
        }
      </div>
    </article>
  `;
    })
    .join("");
}

function renderProjectMedia(project) {
  if (project.preview && typeof projectPreviewMarkup === "function") {
    return `<div class="project-card__image-wrap">${projectPreviewMarkup(project.preview, project.title)}</div>`;
  }

  return `
    <div class="project-card__image-wrap">
      <img
        class="project-card__image"
        src="${escapeHtml(project.image)}"
        alt="${escapeHtml(project.title)}"
        loading="lazy"
      />
    </div>
  `;
}

function renderDescriptions(description) {
  const items = Array.isArray(description) ? description : [description];
  return items
    .filter(Boolean)
    .map((text) => `<p class="project-card__desc">${escapeHtml(text)}</p>`)
    .join("");
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function renderCurrentProjects() {
  if (typeof PROJECTS !== "undefined") {
    renderProjects(PROJECTS);
  }
}

document.addEventListener("DOMContentLoaded", renderCurrentProjects);
document.addEventListener("acrosstool:lang", renderCurrentProjects);
