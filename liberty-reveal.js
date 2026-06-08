/**
 * 自由女神作品：白膜 + 光标柔光显色（与 liberty.html 相同逻辑，适配展厅尺寸）
 */
(function (global) {
  const CORE_STOP = 0.22;
  const MID_STOP = 0.52;
  const SOFT_STOP = 0.88;
  const TRAIL_MIN_DIST = 2.2;

  function holeRadiusPx(cssW) {
    return Math.max(24, Math.min(cssW * 0.22, 80));
  }

  function initLibertyReveal(viewer) {
    if (!viewer || viewer.dataset.libertyReady === "1") return;

    const canvas = viewer.querySelector(".liberty-veil");
    const whiteSrc = viewer.dataset.whiteSrc || "images/liberty-white.png";
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    const whiteImg = new Image();
    if (window.GalleryImages?.loadFullImage) {
      window.GalleryImages.loadFullImage(whiteImg, whiteSrc);
    } else {
      whiteImg.src = whiteSrc;
    }

    let reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let lightFadeMs = reduceMotion ? 320 : 1100;

    let mouseIn = false;
    let curCX = 0;
    let curCY = 0;
    const trails = [];
    let cssW = 1;
    let cssH = 1;
    let raf = 0;
    let whiteReady = false;

    whiteImg.onload = () => {
      whiteReady = true;
      requestPaintLoop();
    };

    function syncCanvasSize() {
      const rect = viewer.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
      cssW = Math.max(1, rect.width);
      cssH = Math.max(1, rect.height);
      const bw = Math.round(cssW * dpr);
      const bh = Math.round(cssH * dpr);
      if (canvas.width !== bw || canvas.height !== bh) {
        canvas.width = bw;
        canvas.height = bh;
      }
      canvas.style.width = cssW + "px";
      canvas.style.height = cssH + "px";
    }

    function clientToCanvas(cx, cy) {
      const rect = viewer.getBoundingClientRect();
      return {
        x: ((cx - rect.left) / rect.width) * cssW,
        y: ((cy - rect.top) / rect.height) * cssH,
      };
    }

    function drawImageContain(img, w, h) {
      if (!img.naturalWidth) return;
      const ir = img.naturalWidth / img.naturalHeight;
      const cr = w / h;
      let dw, dh, dx, dy;
      if (ir > cr) {
        dw = w;
        dh = w / ir;
        dx = 0;
        dy = (h - dh) * 0.5;
      } else {
        dh = h;
        dw = h * ir;
        dx = (w - dw) * 0.5;
        dy = 0;
      }
      ctx.drawImage(img, dx, dy, dw, dh);
    }

    function punchSoftHole(px, py, radius, strength) {
      if (strength <= 0.001) return;
      const g = ctx.createRadialGradient(px, py, 0, px, py, radius);
      const s = strength;
      g.addColorStop(0, `rgba(0,0,0,${(0.985 * s).toFixed(4)})`);
      g.addColorStop(CORE_STOP, `rgba(0,0,0,${(0.9 * s).toFixed(4)})`);
      g.addColorStop(MID_STOP, `rgba(0,0,0,${(0.48 * s).toFixed(4)})`);
      g.addColorStop(SOFT_STOP, `rgba(0,0,0,${(0.14 * s).toFixed(4)})`);
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(px, py, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    function fadeStrength(t0, now) {
      const u = (now - t0) / lightFadeMs;
      if (u >= 1) return 0;
      if (u <= 0) return 1;
      const v = u * u * (3 - 2 * u);
      return 1 - v;
    }

    function frame(now) {
      syncCanvasSize();
      const dpr = canvas.width / cssW;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "#f8f4e3";
      ctx.fillRect(0, 0, cssW, cssH);

      if (whiteReady) drawImageContain(whiteImg, cssW, cssH);

      const R = holeRadiusPx(cssW);
      ctx.globalCompositeOperation = "destination-out";

      for (let i = trails.length - 1; i >= 0; i--) {
        const tr = trails[i];
        const st = fadeStrength(tr.t0, now);
        if (st <= 0.008) {
          trails.splice(i, 1);
          continue;
        }
        punchSoftHole(tr.cx, tr.cy, R, st);
      }

      if (mouseIn && whiteReady) {
        const m = clientToCanvas(curCX, curCY);
        punchSoftHole(m.x, m.y, R, 1);
      }

      if (mouseIn || trails.length > 0 || !whiteReady) {
        raf = requestAnimationFrame(frame);
      } else {
        raf = 0;
      }
    }

    function requestPaintLoop() {
      if (!raf) raf = requestAnimationFrame(frame);
    }

    function onPointerEnter(e) {
      mouseIn = true;
      curCX = e.clientX;
      curCY = e.clientY;
      requestPaintLoop();
    }

    function onPointerMove(e) {
      if (!mouseIn) return;
      const prevX = curCX;
      const prevY = curCY;
      curCX = e.clientX;
      curCY = e.clientY;
      if (whiteReady) {
        const d = Math.hypot(curCX - prevX, curCY - prevY);
        if (d >= TRAIL_MIN_DIST) {
          const p = clientToCanvas(prevX, prevY);
          trails.push({ cx: p.x, cy: p.y, t0: performance.now() });
        }
      }
      requestPaintLoop();
    }

    function onPointerLeave() {
      if (mouseIn && whiteReady) {
        const p = clientToCanvas(curCX, curCY);
        trails.push({ cx: p.x, cy: p.y, t0: performance.now() });
      }
      mouseIn = false;
      requestPaintLoop();
    }

    viewer.addEventListener("pointerenter", onPointerEnter);
    viewer.addEventListener("pointermove", onPointerMove);
    viewer.addEventListener("pointerleave", onPointerLeave);
    viewer.addEventListener("pointerdown", (e) => e.stopPropagation());

    const ro = new ResizeObserver(requestPaintLoop);
    ro.observe(viewer);

    viewer.dataset.libertyReady = "1";
    requestPaintLoop();
  }

  function initAllLibertyReveal() {
    document.querySelectorAll(".liberty-viewer").forEach(initLibertyReveal);
  }

  global.initAllLibertyReveal = initAllLibertyReveal;
})(window);
