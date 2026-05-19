function renderProjects(projects) {
  const grid = document.getElementById("projects-grid");
  if (!grid) return;

  grid.innerHTML = projects
    .map(
      (project) => `
    <article class="project-card" role="listitem">
      <div class="project-card__image-wrap">
        <img
          class="project-card__image"
          src="${escapeHtml(project.image)}"
          alt="${escapeHtml(project.title)}"
          loading="lazy"
        />
      </div>
      <div class="project-card__body">
        <div class="project-card__content">
          <h2 class="project-card__title">${escapeHtml(project.title)}</h2>
          ${
            project.tagline
              ? `<p class="project-card__tagline">${escapeHtml(project.tagline)}</p>`
              : ""
          }
          ${renderDescriptions(project.description)}
        </div>
        ${
          project.url
            ? `<div class="project-card__footer">
            <a class="project-card__link" href="${escapeHtml(project.url)}">View project →</a>
          </div>`
            : ""
        }
      </div>
    </article>
  `
    )
    .join("");
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

document.addEventListener("DOMContentLoaded", () => {
  if (typeof PROJECTS !== "undefined") {
    renderProjects(PROJECTS);
  }
});
