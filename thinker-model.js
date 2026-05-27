/**
 * Thinker 3D — Google Model Viewer
 * 首屏与 PNG 绘制框重合；滚动至第二屏左侧并旋转 180°
 */
(function () {
  const GLB_CANDIDATES = [
    "models/thinker.glb",
    "model/thinker.glb",
    "assets/thinker.glb",
    "thinker.glb",
    "images/thinker.glb",
  ];

  const SCROLL_THRESHOLD = 0.04;
  const ABOUT_PHASE = 0.42;
  const ORBIT_PITCH = "75deg";
  const ORBIT_RADIUS = "auto";

  const pngEl = document.querySelector(".entrance-thinker__color");
  const endAnchor = document.getElementById("thinkerEndAnchor");
  const model = document.getElementById("thinker-3d");
  const page = document.body;

  if (!pngEl || !model) {
    console.warn("[thinker-model] 缺少 .entrance-thinker__color 或 #thinker-3d");
    return;
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  /** 自动检测 GLB 路径 */
  async function resolveGlbSrc() {
    for (const path of GLB_CANDIDATES) {
      try {
        const res = await fetch(path, { method: "HEAD" });
        if (res.ok) {
          console.info("[thinker-model] 使用模型路径:", path);
          return path;
        }
      } catch {
        /* 继续尝试下一个 */
      }
    }
    console.warn(
      "[thinker-model] 未找到 thinker.glb，请将文件放到 models/thinker.glb",
    );
    return "models/thinker.glb";
  }

  /** object-fit: contain 的真实绘制区域 */
  function getContainPaintRect(el) {
    const box = el.getBoundingClientRect();
    const nw = el.naturalWidth || box.width;
    const nh = el.naturalHeight || box.height;
    if (!nw || !nh) {
      return {
        width: box.width,
        height: box.height,
        centerX: box.left + box.width * 0.5,
        centerY: box.top + box.height * 0.5,
      };
    }
    const ir = nw / nh;
    const cr = box.width / box.height;
    let dw;
    let dh;
    let ox;
    let oy;
    if (ir > cr) {
      dw = box.width;
      dh = box.width / ir;
      ox = 0;
      oy = (box.height - dh) * 0.5;
    } else {
      dh = box.height;
      dw = box.height * ir;
      ox = (box.width - dw) * 0.5;
      oy = 0;
    }
    return {
      width: dw,
      height: dh,
      centerX: box.left + ox + dw * 0.5,
      centerY: box.top + oy + dh * 0.5,
    };
  }

  /** 第二屏：文案列左侧区域 */
  function getEndRect() {
    const vh = window.innerHeight;
    const vw = window.innerWidth;
    if (endAnchor) {
      const inner = endAnchor.getBoundingClientRect();
      const width = Math.max(1, inner.left);
      return {
        width,
        height: vh,
        centerX: width * 0.5,
        centerY: vh * 0.5,
      };
    }
    return {
      width: vw * 0.52,
      height: vh,
      centerX: vw * 0.26,
      centerY: vh * 0.5,
    };
  }

  function lerpRect(a, b, t) {
    return {
      width: lerp(a.width, b.width, t),
      height: lerp(a.height, b.height, t),
      centerX: lerp(a.centerX, b.centerX, t),
      centerY: lerp(a.centerY, b.centerY, t),
    };
  }

  function applyRect(rect) {
    model.style.width = `${rect.width}px`;
    model.style.height = `${rect.height}px`;
    model.style.left = `${rect.centerX}px`;
    model.style.top = `${rect.centerY}px`;
    model.style.transform = "translate(-50%, -50%)";
  }

  function readProgress() {
    const vh = window.innerHeight || 1;
    return Math.min(Math.max(window.scrollY / vh, 0), 1);
  }

  function onScroll() {
    const progress = readProgress();

    page.classList.toggle("is-thinker-scrolled", progress > SCROLL_THRESHOLD);
    page.classList.toggle("is-about-phase", progress > ABOUT_PHASE);

    const start = getContainPaintRect(pngEl);
    const end = getEndRect();
    const rect = lerpRect(start, end, progress);
    applyRect(rect);

    const angle = progress * 180;
    model.setAttribute(
      "camera-orbit",
      `${angle}deg ${ORBIT_PITCH} ${ORBIT_RADIUS}`,
    );
  }

  async function init() {
    const src = await resolveGlbSrc();
    model.src = src;

    model.addEventListener("load", () => {
      console.info("[thinker-model] 模型加载成功");
      onScroll();
    });

    model.addEventListener("error", (e) => {
      console.error("[thinker-model] 模型加载失败:", src, e);
    });

    if (pngEl.complete) onScroll();
    else pngEl.addEventListener("load", onScroll);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    customElements.whenDefined("model-viewer").then(onScroll);
  }

  init();
})();
