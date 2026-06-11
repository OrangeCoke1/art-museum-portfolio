/**
 * 入口页滚动阶段（与 CSS 配合，三屏统一渐隐 / 滑入显隐）
 * - 滚过约 42% 视口：第一屏淡出，第二屏淡入
 * - 进入第二屏后同样滚过约 42% 视口：第二屏淡出，第三屏淡入
 */
(function () {
  const ABOUT_PHASE = 0.42;
  const COLLECTION_PHASE = 1 + ABOUT_PHASE;

  const page = document.body;

  if (!page.classList.contains("entrance-page")) return;

  function readProgress() {
    const vh = window.innerHeight || 1;
    return Math.max(window.scrollY / vh, 0);
  }

  function onScroll() {
    const progress = readProgress();
    const inAbout = progress > ABOUT_PHASE;
    const inCollection = progress > COLLECTION_PHASE;

    page.classList.toggle("is-about-phase", inAbout);
    page.classList.toggle("is-collection-phase", inCollection);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();
