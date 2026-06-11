/**
 * About page — mobile menu + layered parallax background
 */

(function () {
  const btnMenu = document.getElementById("btnMenu");
  const mobileNav = document.getElementById("mobileNav");

  btnMenu?.addEventListener("click", () => {
    if (!mobileNav) return;
    const open = !mobileNav.classList.contains("is-open");
    mobileNav.classList.toggle("is-open", open);
    mobileNav.hidden = !open;
    btnMenu.setAttribute("aria-expanded", String(open));
  });
})();

/* about parallax redesign — 鼠标视差 + 静止时缓慢漂浮 */
function initLayerParallax({
  stage,
  layers,
  xProp = "--layer-x",
  yProp = "--layer-y",
  xMul = 2,
  yMul = 1.65,
  idleAmpScale = 0.13,
  idle = null,
  isLayerFrozen = () => false,
}) {
  if (!stage || !layers.length) return;

  const idleCfg = {
    ampScale: idleAmpScale,
    minAmp: 0,
    speed: 1,
    delayMs: 1400,
    blendIn: 0.016,
    blendOut: 0.055,
    returnEase: 0.028,
    smoothEase: 0.034,
    organic: false,
    ...idle,
  };

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;

  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;
  let idleBlend = 0;
  let animationFrame = 0;
  let isVisible = false;
  let lastPointerTime = 0;
  let orientationEnabled = false;
  let orientationPermissionAsked = false;
  const smoothIdle = layers.map(() => ({ x: 0, y: 0 }));

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function markPointerActive() {
    lastPointerTime = performance.now();
  }

  function updateTarget(event) {
    markPointerActive();
    const rect = stage.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    targetX = clamp((event.clientX - rect.left) / rect.width - 0.5, -0.5, 0.5);
    targetY = clamp((event.clientY - rect.top) / rect.height - 0.5, -0.5, 0.5);
  }

  function resetTarget() {
    targetX = 0;
    targetY = 0;
  }

  function updateTargetFromOrientation(event) {
    if (!coarsePointer || reducedMotion) return;
    markPointerActive();

    const gamma = typeof event.gamma === "number" ? event.gamma : 0;
    const beta = typeof event.beta === "number" ? event.beta : 0;
    targetX = clamp(gamma / 28, -0.5, 0.5);
    targetY = clamp((beta - 45) / 42, -0.5, 0.5);
  }

  function enableOrientationParallax() {
    if (orientationEnabled || !("DeviceOrientationEvent" in window)) return;

    orientationEnabled = true;
    window.addEventListener("deviceorientation", updateTargetFromOrientation, {
      passive: true,
    });
  }

  function requestOrientationPermissionOnce() {
    if (!coarsePointer || orientationPermissionAsked || reducedMotion) return;
    orientationPermissionAsked = true;

    const orientation = window.DeviceOrientationEvent;
    if (!orientation) return;

    if (typeof orientation.requestPermission === "function") {
      orientation
        .requestPermission()
        .then((state) => {
          if (state === "granted") enableOrientationParallax();
        })
        .catch(() => {
          orientationEnabled = false;
        });
      return;
    }

    enableOrientationParallax();
  }

  /** 二维漂移目标：X/Y 独立相位与频率，轨迹在平面内漫游 */
  function getIdleDriftTarget(shift, index, timeMs) {
    const t = timeMs * 0.001 * idleCfg.speed;
    const phaseX = index * 2.17 + shift * 0.083;
    const phaseY = index * 1.73 + shift * 0.119 + 1.9;
    const amp = Math.max(shift * idleCfg.ampScale, idleCfg.minAmp);

    if (idleCfg.organic) {
      return {
        x:
          Math.sin(t * 0.36 + phaseX) * amp * 0.5 +
          Math.sin(t * 0.19 + phaseX * 1.41) * amp * 0.32 +
          Math.cos(t * 0.11 + phaseX * 0.67) * amp * 0.18,
        y:
          Math.sin(t * 0.33 + phaseY) * amp * 0.5 +
          Math.cos(t * 0.16 + phaseY * 1.22) * amp * 0.32 +
          Math.sin(t * 0.09 + phaseY * 0.74) * amp * 0.18,
      };
    }

    return {
      x:
        Math.sin(t * 0.48 + phaseX) * amp * 0.72 +
        Math.sin(t * 0.22 + phaseX * 1.6) * amp * 0.28,
      y:
        Math.sin(t * 0.44 + phaseY) * amp * 0.72 +
        Math.cos(t * 0.2 + phaseY * 1.35) * amp * 0.28,
    };
  }

  function animate() {
    const now = performance.now();
    const wantsIdle = now - lastPointerTime > idleCfg.delayMs;
    const blendTarget = wantsIdle ? 1 : 0;
    const blendRate = wantsIdle ? idleCfg.blendIn : idleCfg.blendOut;
    idleBlend += (blendTarget - idleBlend) * blendRate;

    if (idleBlend > 0.002) {
      const ease = idleCfg.returnEase * idleBlend;
      targetX += (0 - targetX) * ease;
      targetY += (0 - targetY) * ease;
    }

    const follow = 0.08 - idleBlend * 0.025;
    currentX += (targetX - currentX) * follow;
    currentY += (targetY - currentY) * follow;

    layers.forEach((layer, index) => {
      const { el, shift } = layer;

      if (isLayerFrozen(layer)) {
        return;
      }

      const smooth = smoothIdle[index];
      const target = getIdleDriftTarget(shift, index, now);
      const ease = idleCfg.smoothEase + index * 0.002;
      smooth.x += (target.x - smooth.x) * ease;
      smooth.y += (target.y - smooth.y) * (ease * 0.92);
      const drift = {
        x: smooth.x * idleBlend,
        y: smooth.y * idleBlend,
      };
      const tx = currentX * shift * xMul + drift.x;
      const ty = currentY * shift * yMul + drift.y;
      el.style.setProperty(xProp, `${tx}px`);
      el.style.setProperty(yProp, `${ty}px`);
    });

    if (isVisible) {
      animationFrame = requestAnimationFrame(animate);
    } else {
      animationFrame = 0;
    }
  }

  function startAnimation() {
    if (!animationFrame) {
      animationFrame = requestAnimationFrame(animate);
    }
  }

  function updateTargetIfInside(event) {
    const rect = stage.getBoundingClientRect();
    const inside =
      event.clientX >= rect.left &&
      event.clientX <= rect.right &&
      event.clientY >= rect.top &&
      event.clientY <= rect.bottom;

    if (inside) updateTarget(event);
  }

  if (reducedMotion) return;

  markPointerActive();

  if (coarsePointer) {
    enableOrientationParallax();
    stage.addEventListener("pointerdown", requestOrientationPermissionOnce, {
      once: true,
      passive: true,
    });
  } else {
    stage.addEventListener("pointermove", updateTarget);
    stage.addEventListener("pointerleave", resetTarget);
    window.addEventListener("mousemove", updateTargetIfInside);
  }

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) startAnimation();
      },
      { rootMargin: "80px" },
    );
    observer.observe(stage);
  } else {
    isVisible = true;
    startAnimation();
  }
}

/** 第一屏 / 第二屏订阅区共用的静止漂浮参数 */
const ABOUT_IDLE_FLOAT = {
  ampScale: 0.38,
  minAmp: 7,
  speed: 0.95,
  delayMs: 1800,
  blendIn: 0.014,
  blendOut: 0.06,
  returnEase: 0.018,
  smoothEase: 0.055,
  organic: true,
};

/* about parallax redesign — About 第一屏 */
(function () {
  const scene = document.getElementById("aboutParallax");
  if (!scene) return;

  const LAYER_SHIFT = { 1: 36, 2: 20, 3: 10, 4: 6 };
  const layers = [4, 3, 2, 1]
    .map((index) => ({
      el: scene.querySelector(`.about-layer--${index}`),
      shift: LAYER_SHIFT[index],
    }))
    .filter((layer) => layer.el);

  initLayerParallax({
    stage: document.querySelector(".about-hero"),
    layers,
    idle: ABOUT_IDLE_FLOAT,
  });
})();

/* about subscribe cover section */
(function () {
  const SUBSCRIBE_API =
    window.GALLERY_SUBSCRIBE_API || "http://localhost:3000/api/subscribe";

  const subscribeSection = document.getElementById("about-subscribe");
  if (!subscribeSection) return;

  const form = subscribeSection.querySelector("[data-subscribe-form]");
  const input = subscribeSection.querySelector("[data-subscribe-input]");
  const button = subscribeSection.querySelector("[data-subscribe-button]");
  const message = subscribeSection.querySelector("[data-subscribe-message]");
  const subscribeTitle = document.getElementById("subscribeTitle");
  const titleDefault = subscribeTitle?.querySelector(
    ".subscribe-title__group--default",
  );
  const titleThanks = subscribeTitle?.querySelector(
    ".subscribe-title__group--thanks",
  );
  const layers = Array.from(
    subscribeSection.querySelectorAll("[data-subscribe-layer]"),
  );

  let lastMessageKey = "";

  function tr(key) {
    return window.GalleryI18n?.t(key) ?? key;
  }

  function trOr(key, fallback) {
    const value = tr(key);
    return value === key ? fallback : value;
  }

  function setMessage(text, type) {
    if (!message) return;
    lastMessageKey = "";
    message.textContent = text;
    message.dataset.state = type || "neutral";
  }

  function setMessageKey(key, type) {
    if (!message) return;
    lastMessageKey = key;
    message.textContent = tr(key);
    message.dataset.state = type || "neutral";
  }

  function syncSubscribeDynamicCopy() {
    if (button?.classList.contains("is-subscribed")) {
      button.textContent = tr("subscribeButtonDone");
    } else if (button && !button.disabled) {
      button.textContent = tr("subscribeButton");
    }
    if (lastMessageKey && message?.dataset.state) {
      message.textContent = tr(lastMessageKey);
    }
  }

  window.addEventListener("gallery-languagechange", syncSubscribeDynamicCopy);

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  }

  function resetSubmitButton(defaultButtonLabel) {
    if (!button) return;
    button.disabled = false;
    button.textContent = defaultButtonLabel;
  }

  function isCloudLayer(el) {
    return (
      el.classList.contains("subscribe-layer--cloud-left") ||
      el.classList.contains("subscribe-layer--cloud-top") ||
      el.classList.contains("subscribe-layer--cloud-bottom")
    );
  }

  function isCharacterLayer(el) {
    return (
      el.classList.contains("subscribe-layer--adam-line") ||
      el.classList.contains("subscribe-layer--god-line") ||
      el.classList.contains("subscribe-layer--adam-paint") ||
      el.classList.contains("subscribe-layer--god-paint")
    );
  }

  function getSubscribeLayerShift(el) {
    const depth = Number(el.dataset.depth || 8);
    if (isCloudLayer(el)) return depth * 1.42;
    if (isCharacterLayer(el)) return depth * 0.46;
    return depth;
  }

  const subscribeLayers = layers.map((el) => ({
    el,
    shift: getSubscribeLayerShift(el),
    isCharacter: isCharacterLayer(el),
  }));

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const BUTTON_PRESS_MS = 300;
  const REVEAL_START_MS = 380;
  const CHARACTER_REVEAL_MS = 4200;

  function showThanksTitle() {
    titleDefault?.setAttribute("aria-hidden", "true");
    titleThanks?.setAttribute("aria-hidden", "false");
  }

  function startCharacterReveal() {
    showThanksTitle();
    subscribeLayers
      .filter((layer) => layer.isCharacter)
      .forEach(({ el }) => {
        el.style.setProperty("--subscribe-layer-x", "0px");
        el.style.setProperty("--subscribe-layer-y", "0px");
      });
    subscribeSection.classList.add("is-subscribe-revealing");
    requestAnimationFrame(() => {
      subscribeSection.classList.add("is-subscribed");
    });
    window.setTimeout(() => {
      subscribeSection.classList.remove("is-subscribe-revealing");
    }, CHARACTER_REVEAL_MS);
  }

  function animateSubscribeSuccess() {
    if (!button || !input) return;

    button.disabled = true;
    input.setAttribute("readonly", "readonly");

    if (prefersReducedMotion) {
      button.classList.add("is-subscribed");
      button.textContent = tr("subscribeButtonDone");
      startCharacterReveal();
      setMessageKey("subscribeSuccessMessage", "success");
      return;
    }

    button.classList.add("is-submitting");

    window.setTimeout(() => {
      button.classList.remove("is-submitting");
      button.classList.add("is-subscribed");
      button.textContent = tr("subscribeButtonDone");
    }, BUTTON_PRESS_MS);

    window.setTimeout(() => {
      startCharacterReveal();
      setMessageKey("subscribeSuccessMessage", "success");
    }, REVEAL_START_MS);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!input || !button) return;
    if (button.classList.contains("is-subscribed")) return;

    const email = input.value.trim();

    if (!email) {
      setMessageKey("subscribeErrorEmpty", "error");
      input.focus();
      return;
    }

    if (!isValidEmail(email)) {
      setMessageKey("subscribeErrorInvalid", "error");
      input.focus();
      return;
    }

    const defaultButtonLabel = tr("subscribeButton");
    button.disabled = true;
    button.textContent = trOr("subscribeButtonSending", "SENDING...");
    setMessage("", "neutral");

    try {
      const response = await fetch(SUBSCRIBE_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          source: "website",
        }),
      });

      const result = await response.json().catch(() => ({}));

      if (response.ok && result.success) {
        animateSubscribeSuccess();
        return;
      }

      if (
        response.status === 409 ||
        result.message === "This email is already subscribed."
      ) {
        resetSubmitButton(defaultButtonLabel);
        setMessageKey("subscribeAlreadySubscribed", "error");
        return;
      }

      if (
        response.status === 400 ||
        result.message === "Invalid email format."
      ) {
        resetSubmitButton(defaultButtonLabel);
        setMessageKey("subscribeErrorInvalid", "error");
        input.focus();
        return;
      }

      resetSubmitButton(defaultButtonLabel);
      setMessageKey("subscribeErrorServer", "error");
    } catch (error) {
      console.error(error);
      resetSubmitButton(defaultButtonLabel);
      setMessageKey("subscribeErrorServer", "error");
    }
  }

  form?.addEventListener("submit", handleSubmit);

  const maxSubscribeDepth = subscribeLayers.reduce(
    (max, layer) => Math.max(max, layer.shift),
    1,
  );
  const heroMaxShift = 36;
  const depthScale = heroMaxShift / maxSubscribeDepth;

  initLayerParallax({
    stage: subscribeSection,
    layers: subscribeLayers,
    xProp: "--subscribe-layer-x",
    yProp: "--subscribe-layer-y",
    xMul: 2.15,
    yMul: 1.62,
    idle: {
      ...ABOUT_IDLE_FLOAT,
      ampScale: ABOUT_IDLE_FLOAT.ampScale * depthScale * 1.12,
    },
    isLayerFrozen: (layer) =>
      layer.isCharacter &&
      subscribeSection.classList.contains("is-subscribe-revealing"),
  });
})();
/* about subscribe cover section — 滚动驱动第二屏自下而上覆盖 */
(function initAboutCoverScroll() {
  const pin = document.getElementById("aboutCoverPin");
  const subscribe = document.getElementById("about-subscribe");
  if (!pin || !subscribe) return;

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  function viewportHeight() {
    return window.innerHeight || document.documentElement.clientHeight || 1;
  }

  const hero = document.querySelector(".about-hero");

  function updateCover() {
    const rect = pin.getBoundingClientRect();
    const vh = viewportHeight();
    const progress = Math.min(Math.max(-rect.top / vh, 0), 1);
    const offsetPercent = (1 - progress) * 100;
    const inPin = rect.bottom > 0 && rect.top < vh;

    if (!reducedMotion) {
      subscribe.style.setProperty("--cover-y", `${offsetPercent}%`);
      subscribe.style.transform = `translate3d(0, ${offsetPercent}%, 0)`;
    }

    pin.style.setProperty("--cover-progress", String(progress));

    if (hero) {
      hero.hidden = !inPin && rect.bottom <= 0;
    }
    subscribe.hidden = !inPin && rect.bottom <= 0;
  }

  window.addEventListener("scroll", updateCover, { passive: true });
  window.addEventListener("resize", updateCover);
  updateCover();

  window.scrollToAboutSubscribe = function scrollToAboutSubscribe(smooth = true) {
    const top = Math.max(0, pin.offsetTop + viewportHeight() - 1);
    window.scrollTo({ top, behavior: smooth ? "smooth" : "auto" });
  };

  document.querySelectorAll('a[href="#about-subscribe"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      window.scrollToAboutSubscribe(true);
    });
  });

  if (location.hash === "#about-subscribe") {
    requestAnimationFrame(() => window.scrollToAboutSubscribe(false));
  }

  window.GalleryHeaderSearch?.init({
    placeholderKey: "searchPromptPainting",
    onSearch(query) {
      sessionStorage.setItem("gallerySearchQuery", query);
      window.location.href = "gallery.html";
    },
  });
})();
