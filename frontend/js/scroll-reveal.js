/**
 * 滚动浮现 / 划出消失
 * - [data-reveal="x"] 横向滑入（画廊）
 * - [data-reveal="skip"] 跳过（保留页面已有动画）
 * - [data-reveal-once] 进入后不再划出
 */
(function (global) {
  const REDUCE = global.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  const horizontalRoots = new WeakMap();

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

  function revealIfVisibleInHorizontalRoot(el, root) {
    const rootRect = root.getBoundingClientRect();
    if (rootRect.width <= 0 || rootRect.height <= 0) return;

    const elRect = el.getBoundingClientRect();
    const marginX = rootRect.width * 0.12;
    const inView =
      elRect.right >= rootRect.left - marginX &&
      elRect.left <= rootRect.right + marginX;

    if (inView) {
      el.classList.add("is-revealed");
    }
  }

  function observeElement(el) {
    if (!el || isSkippable(el)) return;

    if (REDUCE) {
      el.classList.add("is-revealed");
      return;
    }

    const once = el.hasAttribute("data-reveal-once");
    if (!once || !el.classList.contains("is-revealed")) {
      el.classList.remove("is-revealed");
    }

    const root =
      el.closest("[data-reveal-root]") ||
      document.getElementById("galleryHall");
    if (!root) {
      el.classList.add("is-revealed");
      return;
    }

    let observer = horizontalRoots.get(root);
    if (!observer) {
      observer = createHorizontalObserver(root);
      horizontalRoots.set(root, observer);
    }
    observer.observe(el);
    revealIfVisibleInHorizontalRoot(el, root);
  }

  function refresh(root) {
    const scope = root || document;
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

  global.ScrollReveal = { refresh };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})(window);
