const HOME_BUTTON_FALLBACK = "images/home-button.svg";
const BURST_RAY_COUNT = 20;
const BURST_DURATION_MS = 2000;

/* 짧은/긴 줄기를 번갈아 배치 (vmin) — 더 넓게 퍼짐 */
const RAY_LENGTHS_VMIN = [
  26, 62, 30, 58, 28, 66, 34, 54, 32, 64,
  36, 60, 28, 68, 38, 56, 30, 62, 34, 58,
];

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

  buildHeroBurst();

  homeBtn.addEventListener("click", (e) => {
    e.preventDefault();
    playHeroBurst();
  });
}

function buildHeroBurst() {
  const burst = document.getElementById("hero-burst");
  if (!burst || burst.childElementCount > 0) return;

  const step = 360 / BURST_RAY_COUNT;

  for (let i = 0; i < BURST_RAY_COUNT; i++) {
    const ray = document.createElement("span");
    const length = RAY_LENGTHS_VMIN[i];
    const isLong = length >= 56;

    ray.className = "hero-ray";
    ray.style.setProperty("--angle", `${step * i}deg`);
    ray.style.setProperty("--ray-length", `${length}vmin`);
    ray.style.setProperty("--delay", `${(i % 4) * 0.06 + (isLong ? 0.08 : 0)}s`);
    burst.appendChild(ray);
  }
}

function playHeroBurst() {
  const title = document.getElementById("hero-title");
  const burst = document.getElementById("hero-burst");
  if (!title || !burst) return;

  if (burst.classList.contains("is-active")) return;

  title.classList.add("is-beaming");
  burst.classList.add("is-active");

  window.setTimeout(() => {
    title.classList.remove("is-beaming");
    burst.classList.remove("is-active");
  }, BURST_DURATION_MS);
}
