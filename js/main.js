const HOME_BUTTON_FALLBACK = "/images/home-button.png";

document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("fade-in");
  initHomeButton();
});

function initHomeButton() {
  const homeBtn = document.getElementById("home-btn");
  if (!homeBtn) return;

  const img = homeBtn.querySelector(".home-btn__img");
  if (img) {
    img.addEventListener("error", () => {
      if (img.src.endsWith(HOME_BUTTON_FALLBACK)) return;
      img.src = HOME_BUTTON_FALLBACK;
    });
  }

  const isHome = document.body.classList.contains("page-home");
  if (!isHome) return;

  homeBtn.addEventListener("click", (e) => {
    e.preventDefault();
    toggleTheme();
  });
}
