/**
 * 滚动浮现 / 划出消失
 * - [data-reveal] 纵向滑入（默认）
 * - [data-reveal="left|right|x"] 方向
 * - [data-reveal="skip"] 跳过（保留页面已有动画）
 * - [data-reveal-once] 进入后不再划出
 * - [data-reveal-section] 整段进入视口时，统一控制内部 [data-reveal] 子元素
 */
(function (global) {
  const REDUCE = global.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  const verticalObserver = createVerticalObserver();
  const horizontalRoots = new WeakMap();
  const sectionObservers = new WeakMap();

  function createVerticalObserver() {
    if (REDUCE) return null;

    return new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target;
          const once = el.hasAttribute("data-reveal-once");

          if (entry.isIntersecting) {
            el.classList.add("is-revealed");
          } else if (!once) {
            el.classList.remove("is-revealed");
          }
        });
      },
      {
        root: null,
        rootMargin: "0px 0px -8% 0px",
        threshold: [0, 0.08, 0.18],
      },
    );
  }

  function createHorizontalObserver(root) {
    return new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target;
          const once = el.hasAttribute("data-reveal-once");

          if (entry.isIntersecting) {
            el.classList.add("is-revealed");
          } else if (!once) {
            el.classList.remove("is-revealed");
          }
        });
      },
      {
        root,
        rootMargin: "0px 12% 0px 12%",
        threshold: [0, 0.15, 0.35],
      },
    );
  }

  function isSkippable(el) {
    const mode = el.getAttribute("data-reveal");
    return mode === "skip" || el.classList.contains("reveal-skip");
  }

  function setRevealed(el, revealed) {
    if (!el || isSkippable(el)) return;
    el.classList.toggle("is-revealed", revealed);
  }

  function observeSection(section) {
    if (REDUCE) {
      section.querySelectorAll("[data-reveal]").forEach((el) => {
        setRevealed(el, true);
      });
      return;
    }

    if (sectionObservers.has(section)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const show = entry.isIntersecting;
          section.classList.toggle("is-section-revealed", show);
          section.querySelectorAll("[data-reveal]").forEach((el) => {
            setRevealed(el, show);
          });
        });
      },
      {
        root: null,
        rootMargin: "0px 0px -6% 0px",
        threshold: [0, 0.12, 0.28],
      },
    );

    sectionObservers.set(section, observer);
    observer.observe(section);
  }

  function observeElement(el) {
    if (!el || isSkippable(el)) return;

    if (el.closest("[data-reveal-section]")) {
      return;
    }

    if (REDUCE) {
      el.classList.add("is-revealed");
      return;
    }

    el.classList.remove("is-revealed");

    const mode = el.getAttribute("data-reveal") || "";

    if (mode === "x") {
      const root =
        el.closest("[data-reveal-root]") ||
        document.getElementById("galleryHall");
      if (!root) {
        verticalObserver?.observe(el);
        return;
      }

      let observer = horizontalRoots.get(root);
      if (!observer) {
        observer = createHorizontalObserver(root);
        horizontalRoots.set(root, observer);
      }
      observer.observe(el);
      return;
    }

    verticalObserver?.observe(el);
  }

  function refresh(root) {
    const scope = root || document;

    scope.querySelectorAll("[data-reveal-section]").forEach(observeSection);
    scope.querySelectorAll("[data-reveal]").forEach(observeElement);

    if (REDUCE) {
      scope.querySelectorAll("[data-reveal]").forEach((el) => {
        setRevealed(el, true);
      });
    }
  }

  function init() {
    refresh();

    global.addEventListener("load", () => refresh(), { once: true });
  }

  global.ScrollReveal = {
    refresh,
    observe: observeElement,
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})(window);
