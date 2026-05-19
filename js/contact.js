function renderContact(methods) {
  const list = document.getElementById("contact-list");
  if (!list) return;

  list.innerHTML = methods
    .map((method) => {
      const valueContent = method.href
        ? `<a href="${escapeHtml(method.href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(method.value)}</a>`
        : escapeHtml(method.value);

      return `
    <li class="contact-item">
      <span class="contact-item__label">${escapeHtml(method.label)}</span>
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

document.addEventListener("DOMContentLoaded", () => {
  if (typeof CONTACT_METHODS !== "undefined") {
    renderContact(CONTACT_METHODS);
  }
});
