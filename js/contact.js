function localizeField(value) {
  const lang = typeof getLang === "function" ? getLang() : "en";
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value[lang] || value.en || "";
  }
  return value;
}

function renderContact(methods) {
  const list = document.getElementById("contact-list");
  if (!list) return;

  list.innerHTML = methods
    .map((method) => {
      const label = localizeField(method.label);
      const valueContent = method.href
        ? `<a href="${escapeHtml(method.href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(method.value)}</a>`
        : escapeHtml(method.value);

      return `
    <li class="contact-item">
      <span class="contact-item__label">${escapeHtml(label)}</span>
      <span class="contact-item__value">${valueContent}</span>
    </li>
  `;
    })
    .join("");
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function renderCurrentContact() {
  if (typeof CONTACT_METHODS !== "undefined") {
    renderContact(CONTACT_METHODS);
  }
}

document.addEventListener("DOMContentLoaded", renderCurrentContact);
document.addEventListener("acrosstool:lang", renderCurrentContact);
