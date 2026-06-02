/**
 * Gallery Walk — Subscribe page (frontend only)
 * Saves emails to localStorage key: galleryWalkSubscribers
 */

const STORAGE_KEY = "galleryWalkSubscribers";

const form = document.getElementById("subscribeForm");
const formWrap = document.getElementById("subscribeFormWrap");
const emailInput = document.getElementById("subscribeEmail");
const submitBtn = document.getElementById("subscribeBtn");
const errorEl = document.getElementById("subscribeError");
const successEl = document.getElementById("subscribeSuccess");
const btnMenu = document.getElementById("btnMenu");
const mobileNav = document.getElementById("mobileNav");

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

const FORM_LEAVE_MS = 450;

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim());
}

function getSubscribers() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveSubscriber(email) {
  const normalized = email.trim().toLowerCase();
  const list = getSubscribers();
  if (!list.includes(normalized)) {
    list.push(normalized);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }
}

function showError(message) {
  if (!errorEl) return;
  errorEl.textContent = message;
  errorEl.hidden = false;
}

function clearError() {
  if (!errorEl) return;
  errorEl.textContent = "";
  errorEl.hidden = true;
}

function setSubscribedControls() {
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = "Subscribed";
    submitBtn.classList.add("is-subscribed");
  }
  if (emailInput) emailInput.disabled = true;
}

function revealSuccessInstant() {
  if (!successEl) return;
  successEl.setAttribute("aria-hidden", "false");
  successEl.classList.add("is-visible", "is-shown");
}

function revealSuccessAnimated() {
  if (!successEl) return;
  successEl.setAttribute("aria-hidden", "false");
  successEl.classList.add("is-visible");
  requestAnimationFrame(() => {
    requestAnimationFrame(() => successEl.classList.add("is-shown"));
  });
}

function showSuccessState() {
  setSubscribedControls();

  if (prefersReducedMotion || !formWrap) {
    formWrap?.classList.remove("is-leaving");
    formWrap?.classList.add("is-hidden");
    revealSuccessInstant();
    return;
  }

  formWrap.classList.remove("is-hidden");
  formWrap.classList.add("is-leaving");

  let done = false;
  const finishFormLeave = () => {
    if (done) return;
    done = true;
    formWrap.classList.remove("is-leaving");
    formWrap.classList.add("is-hidden");
    revealSuccessAnimated();
  };

  const onTransitionEnd = (e) => {
    if (e.target !== formWrap || e.propertyName !== "opacity") return;
    formWrap.removeEventListener("transitionend", onTransitionEnd);
    finishFormLeave();
  };

  formWrap.addEventListener("transitionend", onTransitionEnd);
  window.setTimeout(finishFormLeave, FORM_LEAVE_MS);
}

function showDefaultState() {
  formWrap?.classList.remove("is-leaving", "is-hidden");
  formWrap?.style.removeProperty("opacity");
  formWrap?.style.removeProperty("visibility");
  formWrap?.style.removeProperty("transform");
  formWrap?.style.removeProperty("pointer-events");

  if (successEl) {
    successEl.setAttribute("aria-hidden", "true");
    successEl.classList.remove("is-visible", "is-shown");
    successEl.style.removeProperty("opacity");
    successEl.style.removeProperty("visibility");
    successEl.style.removeProperty("transform");
  }

  if (submitBtn) {
    submitBtn.disabled = false;
    submitBtn.textContent = "Subscribe";
    submitBtn.classList.remove("is-subscribed");
  }
  if (emailInput) {
    emailInput.disabled = false;
  }
}

function initResetControl() {
  document
    .getElementById("subscribeReset")
    ?.addEventListener("click", resetSubscribeForm);
}

function initMobileMenu() {
  btnMenu?.addEventListener("click", () => {
    if (!mobileNav) return;
    const open = !mobileNav.classList.contains("is-open");
    mobileNav.classList.toggle("is-open", open);
    mobileNav.hidden = !open;
    btnMenu.setAttribute("aria-expanded", String(open));
  });
}

function initLanguageMenu() {
  const toggle = document.querySelector(".language-toggle");
  const menu = document.getElementById("languageMenu");
  if (!toggle || !menu) return;

  toggle.addEventListener("click", (e) => {
    e.stopPropagation();
    const open = menu.classList.toggle("is-open");
    menu.hidden = !open;
    toggle.setAttribute("aria-expanded", String(open));
  });

  document.addEventListener("click", (e) => {
    if (e.target.closest(".language-switcher")) return;
    menu.classList.remove("is-open");
    menu.hidden = true;
    toggle.setAttribute("aria-expanded", "false");
  });
}

/** 清除旧版脚本可能留下的内联隐藏样式 */
function ensurePageVisible() {
  const nodes = document.querySelectorAll(
    ".subscribe-main, .subscribe-hero, .subscribe-title, .subscribe-title__line, .subscribe-lead, .subscribe-form-wrap, .subscribe-preview, .subscribe-footer",
  );
  nodes.forEach((el) => {
    el.style.removeProperty("opacity");
    el.style.removeProperty("visibility");
    el.style.removeProperty("transform");
    el.style.removeProperty("display");
  });
}

function clearLegacySubscribeFlags() {
  sessionStorage.removeItem("galleryWalkSubscribedSession");
  localStorage.removeItem("galleryWalkSubscribed");
}

function resetSubscribeForm() {
  showDefaultState();
  if (emailInput) emailInput.value = "";
  ensurePageVisible();
  emailInput?.focus();
}

function bootSubscribePage() {
  clearLegacySubscribeFlags();
  ensurePageVisible();
  showDefaultState();
  initMobileMenu();
  initLanguageMenu();
  initResetControl();
}

form?.addEventListener("submit", (e) => {
  e.preventDefault();
  clearError();

  const email = emailInput?.value?.trim() ?? "";

  if (!email) {
    showError("Please enter your email.");
    emailInput?.focus();
    return;
  }

  if (!isValidEmail(email)) {
    showError("Please enter a valid email address.");
    emailInput?.focus();
    return;
  }

  saveSubscriber(email);
  showSuccessState();
});

emailInput?.addEventListener("input", () => {
  if (!errorEl?.hidden) clearError();
});

bootSubscribePage();
