/**
 * Warhol Banana — DOM drag + simple gravity
 * 不依赖 Matter.js。
 */
(function () {
  const stage = document.getElementById("bananaPhysicsStage");
  const peelEl = document.getElementById("bananaPeel");
  const fleshEl = document.getElementById("bananaFlesh");

  if (!stage || !peelEl || !fleshEl) {
    console.warn("[banana-physics] Missing elements", {
      stage,
      peelEl,
      fleshEl,
    });
    return;
  }

  const GRAVITY = 0.55;
  const FRICTION = 0.985;
  const BOUNCE = 0.22;
  const UNLOCK_DISTANCE = 130;
  const SNAP_DISTANCE = 105;

  const peel = createPart(peelEl, false);
  const flesh = createPart(fleshEl, true);

  let active = null;
  let activePointerId = null;
  let offsetX = 0;
  let offsetY = 0;
  let lastX = 0;
  let lastY = 0;
  let lastTime = 0;
  let fleshUnlocked = false;
  let animationFrame = 0;
  let isVisible = false;
  const alphaMaps = new WeakMap();
  const ALPHA_HIT_THRESHOLD = 3;
  const ALPHA_HIT_RADIUS = 4;

  function isMobileIndexView() {
    return window.matchMedia("(max-width: 768px), (pointer: coarse)").matches;
  }

  function createPart(el, locked) {
    return {
      el,
      locked,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      angle: 0,
      av: 0,
      w: 420,
      h: 512,
      dragging: false,
    };
  }

  function rect() {
    return stage.getBoundingClientRect();
  }

  function pointer(event) {
    const r = rect();
    return {
      x: event.clientX - r.left,
      y: event.clientY - r.top,
    };
  }

  function measure(part) {
    const r = part.el.getBoundingClientRect();
    if (r.width > 10) part.w = r.width;
    if (r.height > 10) part.h = r.height;
  }

  function buildAlphaMap(part) {
    const img = part.el;
    if (alphaMaps.has(img)) return;
    if (!img.complete || !img.naturalWidth || !img.naturalHeight) return;

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) return;

    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    try {
      context.drawImage(img, 0, 0);
      const imageData = context.getImageData(
        0,
        0,
        canvas.width,
        canvas.height,
      ).data;
      let minX = canvas.width;
      let minY = canvas.height;
      let maxX = 0;
      let maxY = 0;
      let hasOpaquePixel = false;

      for (let y = 0; y < canvas.height; y += 1) {
        for (let x = 0; x < canvas.width; x += 1) {
          const alpha = imageData[(y * canvas.width + x) * 4 + 3];
          if (alpha > ALPHA_HIT_THRESHOLD) {
            hasOpaquePixel = true;
            minX = Math.min(minX, x);
            minY = Math.min(minY, y);
            maxX = Math.max(maxX, x);
            maxY = Math.max(maxY, y);
          }
        }
      }

      alphaMaps.set(img, {
        width: canvas.width,
        height: canvas.height,
        data: imageData,
        opaqueBounds: hasOpaquePixel
          ? { minX, minY, maxX, maxY }
          : { minX: 0, minY: 0, maxX: canvas.width, maxY: canvas.height },
      });
    } catch (error) {
      console.warn("[banana-physics] Could not read PNG alpha data", error);
    }
  }

  function distance(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return Math.hypot(dx, dy);
  }

  function hit(part, x, y) {
    // 将鼠标坐标从舞台坐标转换到香蕉自身坐标。
    // 香蕉会 rotate，所以这里必须做一次反向旋转。
    const dx = x - part.x;
    const dy = y - part.y;
    const cos = Math.cos(-part.angle);
    const sin = Math.sin(-part.angle);
    const rotatedX = dx * cos - dy * sin;
    const rotatedY = dx * sin + dy * cos;
    const localX = rotatedX + part.w / 2;
    const localY = rotatedY + part.h / 2;

    if (localX < 0 || localX > part.w || localY < 0 || localY > part.h) {
      return false;
    }

    return hitOpaquePixel(part, localX, localY);
  }

  function hitOpaquePixel(part, localX, localY) {
    const map = alphaMaps.get(part.el);

    // 透明部分不参与拖拽命中。
    // alpha map 没建立成功时，不再使用整张 PNG 的透明矩形作为命中区域。
    if (!map) return false;

    const imageX = Math.floor((localX / part.w) * map.width);
    const imageY = Math.floor((localY / part.h) * map.height);

    if (
      imageX < 0 ||
      imageX >= map.width ||
      imageY < 0 ||
      imageY >= map.height
    ) {
      return false;
    }

    for (
      let y = imageY - ALPHA_HIT_RADIUS;
      y <= imageY + ALPHA_HIT_RADIUS;
      y += 1
    ) {
      for (
        let x = imageX - ALPHA_HIT_RADIUS;
        x <= imageX + ALPHA_HIT_RADIUS;
        x += 1
      ) {
        if (x < 0 || x >= map.width || y < 0 || y >= map.height) continue;
        const alphaIndex = (y * map.width + x) * 4 + 3;
        if (map.data[alphaIndex] > ALPHA_HIT_THRESHOLD) return true;
      }
    }

    return false;
  }

  function getOpaqueWorldBounds(part) {
    const map = alphaMaps.get(part.el);

    if (!map || !map.opaqueBounds) {
      return {
        left: part.x - part.w / 2,
        right: part.x + part.w / 2,
        top: part.y - part.h / 2,
        bottom: part.y + part.h / 2,
      };
    }

    const scaleX = part.w / map.width;
    const scaleY = part.h / map.height;
    const bounds = map.opaqueBounds;

    return {
      left: part.x - part.w / 2 + bounds.minX * scaleX,
      right: part.x - part.w / 2 + bounds.maxX * scaleX,
      top: part.y - part.h / 2 + bounds.minY * scaleY,
      bottom: part.y - part.h / 2 + bounds.maxY * scaleY,
    };
  }

  function pick(event) {
    const p = pointer(event);

    if (hit(peel, p.x, p.y)) return peel;
    if (fleshUnlocked && hit(flesh, p.x, p.y)) return flesh;

    return null;
  }

  function sync(part) {
    part.el.style.transform = `translate(${part.x}px, ${part.y}px) translate(-50%, -50%) rotate(${part.angle}rad)`;
  }

  function syncAll() {
    sync(flesh);
    sync(peel);
  }

  function reset() {
    const r = rect();
    measure(peel);
    measure(flesh);
    buildAlphaMap(peel);
    buildAlphaMap(flesh);

    /* mobile section 02 redesign: place the banana in the reserved mid-page device area */
    const mobile = isMobileIndexView();
    const x = r.width * (mobile ? 0.52 : 0.32);
    const y = r.height * (mobile ? 0.41 : 0.44);

    [peel, flesh].forEach((part) => {
      part.x = x;
      part.y = y;
      part.vx = 0;
      part.vy = 0;
      part.angle = 0;
      part.av = 0;
      part.dragging = false;
    });

    flesh.locked = true;
    // 初始状态下香蕉皮也锁住，避免进入页面后自动受重力掉落。
    // 用户第一次按下香蕉皮时再解锁。
    peel.locked = true;
    fleshUnlocked = false;

    peelEl.classList.remove("is-dragging");
    fleshEl.classList.remove("is-dragging", "is-unlocked");
    syncAll();
  }

  function unlockFleshIfNeeded() {
    if (fleshUnlocked) return;

    if (distance(peel, flesh) > UNLOCK_DISTANCE) {
      fleshUnlocked = true;
      flesh.locked = false;
      fleshEl.classList.add("is-unlocked");
      fleshEl.style.pointerEvents = "auto";
    }
  }

  function attachBack() {
    peel.x = flesh.x;
    peel.y = flesh.y;
    peel.vx = 0;
    peel.vy = 0;
    peel.angle = flesh.angle;
    peel.av = 0;

    flesh.vx = 0;
    flesh.vy = 0;
    flesh.angle = 0;
    flesh.av = 0;
    flesh.locked = true;
    // 挂回去后重新锁住香蕉皮，避免再次自动掉落。
    peel.locked = true;

    fleshUnlocked = false;
    fleshEl.classList.remove("is-unlocked");
    fleshEl.style.pointerEvents = "none";
    syncAll();
  }

  function onPointerDown(event) {
    if (event.button !== undefined && event.button > 0) return;

    const target = pick(event);
    if (!target) return;

    // 香蕉肉在未解锁前不能拖；香蕉皮即使处于锁定状态，也允许第一次点击后解锁拖动。
    if (target.locked && target !== peel) return;

    target.locked = false;

    event.preventDefault();

    active = target;
    activePointerId = event.pointerId;
    active.dragging = true;
    active.el.classList.add("is-dragging");

    const p = pointer(event);
    offsetX = p.x - active.x;
    offsetY = p.y - active.y;
    lastX = p.x;
    lastY = p.y;
    lastTime = performance.now();

    active.vx = 0;
    active.vy = 0;
    active.av = 0;

    if (stage.setPointerCapture) {
      stage.setPointerCapture(activePointerId);
    }
  }

  function onPointerMove(event) {
    if (!active || event.pointerId !== activePointerId) return;

    event.preventDefault();

    const now = performance.now();
    const p = pointer(event);
    const dt = Math.max((now - lastTime) / 16.67, 1);

    active.vx = (p.x - lastX) / dt;
    active.vy = (p.y - lastY) / dt;
    active.x = p.x - offsetX;
    active.y = p.y - offsetY;
    active.angle += active.vx * 0.0025;
    active.av = active.vx * 0.0018;

    lastX = p.x;
    lastY = p.y;
    lastTime = now;

    unlockFleshIfNeeded();
    syncAll();
  }

  function onPointerUp(event) {
    if (!active || event.pointerId !== activePointerId) return;

    event.preventDefault();

    active.dragging = false;
    active.el.classList.remove("is-dragging");

    if (active === peel && distance(peel, flesh) < SNAP_DISTANCE) {
      attachBack();
    }

    if (stage.releasePointerCapture) {
      try {
        stage.releasePointerCapture(activePointerId);
      } catch (_) {}
    }

    active = null;
    activePointerId = null;
  }

  function physics(part) {
    if (part.dragging || part.locked) return;

    const r = rect();

    part.vy += GRAVITY;
    part.vx *= FRICTION;
    part.vy *= FRICTION;
    part.av *= FRICTION;

    part.x += part.vx;
    part.y += part.vy;
    part.angle += part.av;

    const bounds = getOpaqueWorldBounds(part);

    if (bounds.left < 0) {
      part.x += -bounds.left;
      part.vx *= -BOUNCE;
    }

    if (bounds.right > r.width) {
      part.x -= bounds.right - r.width;
      part.vx *= -BOUNCE;
    }

    if (bounds.top < 0) {
      part.y += -bounds.top;
      part.vy *= -BOUNCE;
    }

    if (bounds.bottom > r.height) {
      part.y -= bounds.bottom - r.height;
      part.vy *= -BOUNCE;
      part.vx *= 0.88;
      part.av *= 0.82;
    }
  }

  function tick() {
    physics(flesh);
    physics(peel);
    syncAll();
    if (isVisible) {
      animationFrame = requestAnimationFrame(tick);
    } else {
      animationFrame = 0;
    }
  }

  function startTick() {
    if (!animationFrame) {
      animationFrame = requestAnimationFrame(tick);
    }
  }

  function init() {
    /* mobile section 02 redesign: the full-screen banana layer must not block page scroll */
    const mobile = isMobileIndexView();
    stage.style.pointerEvents = mobile ? "none" : "auto";
    stage.style.touchAction = mobile ? "pan-y" : "none";
    peelEl.style.pointerEvents = "auto";
    fleshEl.style.pointerEvents = "none";

    reset();

    stage.addEventListener("pointerdown", onPointerDown, { passive: false });
    stage.addEventListener("pointermove", onPointerMove, { passive: false });
    stage.addEventListener("pointerup", onPointerUp, { passive: false });
    stage.addEventListener("pointercancel", onPointerUp, { passive: false });

    window.addEventListener("resize", () => {
      window.clearTimeout(stage._bananaResizeTimer);
      stage._bananaResizeTimer = window.setTimeout(reset, 180);
    });

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          isVisible = entry.isIntersecting;
          if (isVisible) startTick();
        },
        { rootMargin: "160px" },
      );
      observer.observe(stage);
    } else {
      isVisible = true;
      startTick();
    }
  }

  function waitForImages() {
    const images = [peelEl, fleshEl];

    if (images.every((img) => img.complete)) {
      requestAnimationFrame(() => requestAnimationFrame(init));
      return;
    }

    let pending = images.length;
    function done() {
      pending -= 1;
      if (pending <= 0)
        requestAnimationFrame(() => requestAnimationFrame(init));
    }

    images.forEach((img) => {
      if (img.complete) done();
      else {
        img.addEventListener("load", done, { once: true });
        img.addEventListener("error", done, { once: true });
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", waitForImages);
  } else {
    waitForImages();
  }
})();
