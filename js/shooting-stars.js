const METEOR_DURATION_MS = 2000;
const MIN_INTERVAL_MS = 1800;
const MAX_INTERVAL_MS = 4200;

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

function createMeteor(container) {
  const meteor = document.createElement("span");
  meteor.className = "meteor";

  const angle = randomBetween(-52, -38);
  const left = randomBetween(5, 95);
  const top = randomBetween(-5, 35);
  const length = randomBetween(70, 140);

  meteor.style.setProperty("--angle", `${angle}deg`);
  meteor.style.setProperty("--meteor-length", `${length}px`);
  meteor.style.left = `${left}%`;
  meteor.style.top = `${top}%`;
  meteor.style.animationDuration = `${METEOR_DURATION_MS}ms`;

  container.appendChild(meteor);
  meteor.addEventListener("animationend", () => meteor.remove());
}

function scheduleMeteor(container) {
  createMeteor(container);
  const delay = randomBetween(MIN_INTERVAL_MS, MAX_INTERVAL_MS);
  window.setTimeout(() => scheduleMeteor(container), delay);
}

function initShootingStars() {
  const container = document.getElementById("shooting-stars");
  if (!container) return;

  createMeteor(container);
  window.setTimeout(() => scheduleMeteor(container), randomBetween(400, 1200));
}

document.addEventListener("DOMContentLoaded", initShootingStars);
