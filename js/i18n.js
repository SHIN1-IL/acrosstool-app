const LANG_STORAGE_KEY = "acrosstool-lang";

const STRINGS = {
  en: {
    "nav.home": "Home",
    "nav.menu": "Main menu",
    "nav.language": "Language",
    "nav.projects": "Project",
    "nav.contact": "Contact",
    "home.subtitle": "AcrossTool Crafting Ideas through Development",
    "meta.home": "AcrossTool",
    "projects.title": "Projects",
    "projects.view": "View project →",
    "meta.projects": "Projects — AcrossTool",
    "contact.title": "Contact",
    "meta.contact": "Contact — AcrossTool",
    "coming.message":
      "Deploying Innovation: The New Standard of WebOps & SaaS is Coming Soon.",
    "meta.coming": "Coming Soon — AcrossTool",
  },
  ko: {
    "nav.home": "홈",
    "nav.menu": "주요 메뉴",
    "nav.language": "언어",
    "nav.projects": "프로젝트",
    "nav.contact": "연락처",
    "home.subtitle": "AcrossTool, 개발로 아이디어를 빚습니다",
    "meta.home": "AcrossTool",
    "projects.title": "프로젝트",
    "projects.view": "프로젝트 보기 →",
    "meta.projects": "프로젝트 — AcrossTool",
    "contact.title": "연락처",
    "meta.contact": "연락처 — AcrossTool",
    "coming.message":
      "혁신을 배포합니다. WebOps와 SaaS의 새로운 기준이 곧 공개됩니다.",
    "meta.coming": "곧 공개 — AcrossTool",
  },
};

function getLang() {
  return document.documentElement.lang === "ko" ? "ko" : "en";
}

function t(key) {
  const lang = getLang();
  return STRINGS[lang][key] || STRINGS.en[key] || key;
}

function readStoredLang() {
  try {
    const params = new URLSearchParams(location.search);
    const fromUrl = params.get("lang");
    if (fromUrl === "ko" || fromUrl === "en") {
      localStorage.setItem(LANG_STORAGE_KEY, fromUrl);
      params.delete("lang");
      const query = params.toString();
      history.replaceState(null, "", location.pathname + (query ? `?${query}` : "") + location.hash);
      return fromUrl;
    }
    return localStorage.getItem(LANG_STORAGE_KEY) === "ko" ? "ko" : "en";
  } catch {
    return "en";
  }
}

function applyI18n() {
  const lang = getLang();

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });

  document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
    el.setAttribute("aria-label", t(el.getAttribute("data-i18n-aria")));
  });

  const titleKey = document.body?.dataset.i18nTitle;
  if (titleKey) document.title = t(titleKey);

  document.querySelectorAll(".lang-switch__btn").forEach((btn) => {
    const active = btn.dataset.lang === lang;
    btn.classList.toggle("lang-switch__btn--active", active);
    btn.setAttribute("aria-pressed", active ? "true" : "false");
  });

  document.dispatchEvent(new CustomEvent("acrosstool:lang"));
}

function setLang(lang) {
  if (lang !== "en" && lang !== "ko") return;
  try {
    localStorage.setItem(LANG_STORAGE_KEY, lang);
  } catch {
    /* ignore private-mode storage failures */
  }
  document.documentElement.lang = lang;
  applyI18n();
}

function initLangSwitch() {
  document.querySelectorAll(".lang-switch__btn").forEach((btn) => {
    btn.addEventListener("click", () => setLang(btn.dataset.lang));
  });
}

document.documentElement.lang = readStoredLang();
initLangSwitch();
applyI18n();
