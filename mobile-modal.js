/* mobile modal repair — pinch zoom + mobile fit scale (gallery & photography) */

(function initMobileModal() {
  const MQ = "(max-width: 768px)";
  const mq = window.matchMedia(MQ);

  let pinching = false;
  let pinchStartDist = 0;
  let pinchStartScale = 1;
  let stageApi = null;

  function isMobile() {
    return mq.matches;
  }

  function touchDistance(touches) {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.hypot(dx, dy);
  }

  function touchCenter(touches, stage) {
    const rect = stage.getBoundingClientRect();
    const x = (touches[0].clientX + touches[1].clientX) / 2;
    const y = (touches[0].clientY + touches[1].clientY) / 2;
    return {
      cx: x - rect.left - rect.width / 2,
      cy: y - rect.top - rect.height / 2,
    };
  }

  function updateZoomedClass() {
    if (!stageApi?.stage) return;
    const view = stageApi.getView();
    const fit = view.fitScale || 1;
    stageApi.stage.classList.toggle(
      "is-mobile-zoomed",
      view.scale > fit * 1.02,
    );
  }

  function setPanelScrollLocked(locked) {
    const panel = document.querySelector(".modal-panel");
    if (!panel || !isMobile()) return;
    panel.style.overflowY = locked ? "hidden" : "";
  }

  function onTouchStart(e) {
    if (!isMobile() || !stageApi?.stage) return;
    const modal = document.getElementById("artModal");
    if (!modal || modal.hidden) return;
    if (e.target.closest(".modal-toolbar, .sculpture-3d-toolbar")) return;

    if (e.touches.length === 2) {
      pinching = true;
      setPanelScrollLocked(true);
      const view = stageApi.getView();
      pinchStartDist = touchDistance(e.touches);
      pinchStartScale = view.scale;
    }
  }

  function onTouchMove(e) {
    if (!pinching || e.touches.length < 2 || !stageApi) return;
    e.preventDefault();

    const view = stageApi.getView();
    const minScale = Math.max(0.04, (view.fitScale || 0.04) * 0.85);
    const maxScale = Math.max(4, (view.fitScale || 1) * 12);
    const dist = touchDistance(e.touches);
    const next = Math.min(
      maxScale,
      Math.max(minScale, pinchStartScale * (dist / Math.max(1, pinchStartDist))),
    );
    const scaleRatio = next / view.scale;
    const { cx, cy } = touchCenter(e.touches, stageApi.stage);

    view.x -= cx * (scaleRatio - 1);
    view.y -= cy * (scaleRatio - 1);
    view.scale = next;

    stageApi.applyTransform();
    updateZoomedClass();
  }

  function onTouchEnd(e) {
    if (e.touches.length < 2) {
      pinching = false;
      setPanelScrollLocked(false);
      updateZoomedClass();
    }
  }

  function bindPinchListeners(stage) {
    if (!stage || stage.dataset.mobileModalPinch === "1") return;
    stage.dataset.mobileModalPinch = "1";
    stage.addEventListener("touchstart", onTouchStart, { passive: true });
    stage.addEventListener("touchmove", onTouchMove, { passive: false });
    stage.addEventListener("touchend", onTouchEnd, { passive: true });
    stage.addEventListener("touchcancel", onTouchEnd, { passive: true });
  }

  window.GalleryModalMobile = {
    isMobile,
    isPinching() {
      return pinching;
    },

    /* mobile modal repair: larger initial fit from ~90vw width */
    applyMobileFit(view, stage, image) {
      if (!isMobile() || !view || !stage || !image?.naturalWidth) return false;

      const targetW = Math.min(window.innerWidth * 0.9, 520);
      const stageH = Math.max(200, stage.clientHeight || window.innerHeight * 0.38);
      const imgW = image.naturalWidth;
      const imgH = image.naturalHeight;
      const fitScale = Math.min(
        1,
        (targetW / imgW) * 0.98,
        (stageH / imgH) * 0.95,
      );

      view.fitScale = Math.max(0.04, fitScale);
      view.scale = view.fitScale;
      view.x = 0;
      view.y = 0;
      return true;
    },

    shouldSkipStagePointer(e, view) {
      if (!isMobile()) return false;
      if (e.pointerType !== "touch") return false;
      if (pinching) return true;
      const fit = view.fitScale || 1;
      const zoomed = view.scale > fit * 1.02;
      const panMode = document
        .getElementById("modalStage")
        ?.classList.contains("is-pan-mode");
      return !zoomed && !panMode;
    },

    bindImageStage(api) {
      stageApi = api;
      if (!api?.stage) return;
      bindPinchListeners(api.stage);
      const prevApply = api.applyTransform;
      api.applyTransform = function applyWithMobileClass() {
        prevApply();
        updateZoomedClass();
      };
      updateZoomedClass();
    },
  };
})();
