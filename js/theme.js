const THEME_STORAGE_KEY = "acrosstool-theme";

function getTheme() {
  return localStorage.getItem(THEME_STORAGE_KEY) === "light" ? "light" : "dark";
}

function applyTheme(theme) {
  document.documentElement.setAttribute(
    "data-theme",
    theme === "light" ? "light" : "dark"
  );
}

function toggleTheme() {
  const next = getTheme() === "light" ? "dark" : "light";
  localStorage.setItem(THEME_STORAGE_KEY, next);
  applyTheme(next);
}

applyTheme(getTheme());
