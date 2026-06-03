/**
 * 第三页墙面：透视容器 + Z 轴分层 + 摄像机式 orbit（非平面平移）
 */
(function () {
  const scene = document.getElementById("wallParallax");
  if (!scene) return;

  const stage = scene.closest(".entrance-collection__wall");
  if (!stage) return;

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const tiltHint = document.querySelector(".entrance-collection__tilt-hint");

  /** 1 最前 → 7 最后（Z 越大越靠近镜头）；7 仍最靠后但参与视差 */
  const LAYER_Z = [150, 112, 78, 52, 32, 16, 10];

  const layers = LAYER_Z.map((z, index) => ({
    el: scene.querySelector(`.wall-layer--${index + 1}`),
    z,
  }));

  layers.forEach(({ el, z }) => {
    if (!el) return;
    el.style.setProperty("--layer-z", `${z}px`);
  });

  /** 绕垂直轴：一侧离你更近、另一侧明显地退回景深（rotateY） */
  const MAX_ROT_Y = reducedMotion ? 0 : coarsePointer ? 10 : 26;
  /** 绕水平轴：上边略翘起或下边离你更近（rotateX） */
  const MAX_ROT_X = reducedMotion ? 0 : coarsePointer ? 7 : 18;
  const MAX_SHIFT = reducedMotion ? 0 : coarsePointer ? 16 : 36;
  const SCENE_PULL_Z = -200;
  /** 透视中心紧跟鼠标，加强「铰链」感 */
  const PERSPECTIVE_SHIFT = 54;

  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;
  let animationFrame = 0;
  let isVisible = false;
  let orientationEnabled = false;
  let orientationPermissionPending = false;

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function updateTarget(event) {
    const rect = stage.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    targetX = clamp((event.clientX - rect.left) / rect.width - 0.5, -0.5, 0.5);
    targetY = clamp((event.clientY - rect.top) / rect.height - 0.5, -0.5, 0.5);
  }

  function resetTarget() {
    targetX = 0;
    targetY = 0;
  }

  function needsOrientationPermission() {
    return (
      typeof DeviceOrientationEvent !== "undefined" &&
      typeof DeviceOrientationEvent.requestPermission === "function"
    );
  }

  /* mobile: subtle phone tilt for the third-page parallax */
  function updateTargetFromOrientation(event) {
    if (!coarsePointer || reducedMotion) return;

    const gamma = typeof event.gamma === "number" ? event.gamma : 0;
    const beta = typeof event.beta === "number" ? event.beta : 0;
    targetX = clamp(gamma / 28, -0.5, 0.5);
    targetY = clamp((beta - 45) / 42, -0.5, 0.5);
  }

  function enableOrientationParallax() {
    if (orientationEnabled || !("DeviceOrientationEvent" in window)) return;

    orientationEnabled = true;
    tiltHint?.classList.add("is-tilt-active");
    window.addEventListener("deviceorientation", updateTargetFromOrientation, {
      passive: true,
    });
  }

  function requestOrientationAccess() {
    if (!coarsePointer || reducedMotion || orientationEnabled) return;
    if (orientationPermissionPending) return;

    if (needsOrientationPermission()) {
      orientationPermissionPending = true;
      DeviceOrientationEvent.requestPermission()
        .then((state) => {
          orientationPermissionPending = false;
          if (state === "granted") enableOrientationParallax();
        })
        .catch(() => {
          orientationPermissionPending = false;
        });
      return;
    }

    enableOrientationParallax();
  }

  function bindMobileTiltTriggers() {
    if (tiltHint) {
      tiltHint.addEventListener("pointerup", requestOrientationAccess, {
        passive: true,
      });
    }

    if (!needsOrientationPermission()) {
      enableOrientationParallax();
    }
  }

  function animate() {
    currentX += (targetX - currentX) * 0.08;
    currentY += (targetY - currentY) * 0.08;

    const rotY = currentX * MAX_ROT_Y;
    const rotX = -currentY * MAX_ROT_X;

    scene.style.setProperty("--wall-rotate-y", `${rotY}deg`);
    scene.style.setProperty("--wall-rotate-x", `${rotX}deg`);
    scene.style.setProperty("--wall-depth", `${SCENE_PULL_Z}px`);

    const originX = 50 + currentX * PERSPECTIVE_SHIFT;
    const originY = 50 + currentY * PERSPECTIVE_SHIFT;
    stage.style.setProperty("--wall-perspective-x", `${originX}%`);
    stage.style.setProperty("--wall-perspective-y", `${originY}%`);

    const frontZ = LAYER_Z[0] || 1;

    layers.forEach(({ el, z }) => {
      if (!el) return;

      const depthFactor = z / frontZ;
      const tx = currentX * MAX_SHIFT * depthFactor;
      const ty = currentY * MAX_SHIFT * 0.82 * depthFactor;

      el.style.setProperty("--layer-x", `${tx}px`);
      el.style.setProperty("--layer-y", `${ty}px`);
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

  if (coarsePointer) {
    bindMobileTiltTriggers();
  } else {
    scene.addEventListener("pointermove", updateTarget);
    scene.addEventListener("pointerleave", resetTarget);
    stage.addEventListener("pointerleave", resetTarget);
    window.addEventListener("mousemove", updateTargetIfInside);
  }

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) startAnimation();
      },
      { rootMargin: "160px" },
    );
    observer.observe(stage);
  } else {
    isVisible = true;
    startAnimation();
  }
})();
