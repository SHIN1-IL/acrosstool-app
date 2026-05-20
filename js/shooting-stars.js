const METEOR_DURATION_MS = 2000;
const MIN_INTERVAL_MS = 1800;
const MAX_INTERVAL_MS = 4200;

let spawnTimerId = null;
let isRunning = false;
let containerRef = null;

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

function clearSpawnTimer() {
  if (spawnTimerId !== null) {
    window.clearTimeout(spawnTimerId);
    spawnTimerId = null;
  }
}

function clearActiveMeteors() {
  if (!containerRef) return;
  containerRef.querySelectorAll(".meteor").forEach((el) => el.remove());
}

function createMeteor() {
  if (!containerRef || document.hidden) return;

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

  containerRef.appendChild(meteor);
  meteor.addEventListener("animationend", () => meteor.remove());
}

function scheduleNextMeteor() {
  clearSpawnTimer();

  if (!isRunning || !containerRef || document.hidden) return;

  const delay = randomBetween(MIN_INTERVAL_MS, MAX_INTERVAL_MS);
  spawnTimerId = window.setTimeout(() => {
    spawnTimerId = null;
    if (!isRunning || document.hidden) return;

    createMeteor();
    scheduleNextMeteor();
  }, delay);
}

function startShootingStars() {
  if (!containerRef || isRunning) return;

  isRunning = true;
  createMeteor();
  scheduleNextMeteor();
}

function stopShootingStars() {
  isRunning = false;
  clearSpawnTimer();
  clearActiveMeteors();
}

function handleVisibilityChange() {
  if (document.hidden) {
    stopShootingStars();
  } else {
    startShootingStars();
  }
}

function initShootingStars() {
  containerRef = document.getElementById("shooting-stars");
  if (!containerRef) return;

  document.addEventListener("visibilitychange", handleVisibilityChange);
  window.addEventListener("pagehide", () => stopShootingStars());
  window.addEventListener("pageshow", (e) => {
    if (!e.persisted) return;
    startShootingStars();
  });

  if (!document.hidden) {
    startShootingStars();
  }
}

document.addEventListener("DOMContentLoaded", initShootingStars);
