/**
 * Gallery Walk — 图片路径工具
 * 展厅轨道用 WebP 缩略图，modal / 高清交互用 WebP 全尺寸，保留 JPG/PNG 回退。
 */
(function () {
  function escapeAttr(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;");
  }

  function webpSrc(src) {
    if (!src || !/\.(jpe?g|png)$/i.test(src)) return src;
    return src.replace(/\.(jpe?g|png)$/i, ".webp");
  }

  function thumbSrc(src) {
    if (!src || src.includes("/thumbs/")) return src;
    const slash = src.lastIndexOf("/");
    if (slash === -1) return `thumbs/${src}`;
    return `${src.slice(0, slash)}/thumbs/${src.slice(slash + 1)}`;
  }

  function trackFallbackSrc(src) {
    return thumbSrc(src);
  }

  function trackWebpSrc(src) {
    return webpSrc(thumbSrc(src));
  }

  function fullWebpSrc(src) {
    return webpSrc(src);
  }

  function pictureImg({
    webp,
    fallback,
    alt = "",
    className = "",
    attrs = "",
  }) {
    return `
      <picture>
        <source srcset="${escapeAttr(webp)}" type="image/webp" />
        <img class="${className}" src="${escapeAttr(fallback)}" alt="${escapeAttr(alt)}" ${attrs} />
      </picture>
    `.trim();
  }

  function trackPicture({ src, alt, className = "", attrs = "" }) {
    return pictureImg({
      webp: trackWebpSrc(src),
      fallback: trackFallbackSrc(src),
      alt,
      className,
      attrs,
    });
  }

  function applyWebpFallback(img, fallbackSrc) {
    if (!img) return;
    img.onerror = () => {
      img.onerror = null;
      img.src = fallbackSrc;
    };
  }

  function loadFullImage(img, src) {
    if (!img) return;
    const fallback = src;
    img.src = fullWebpSrc(src);
    applyWebpFallback(img, fallback);
  }

  function upgradeToPicture(img, { moveClasses = false, moveData = false } = {}) {
    if (!img || img.closest("picture")) return;

    const fallback = img.getAttribute("src");
    if (!fallback || !/\.(jpe?g|png)$/i.test(fallback)) return;

    const picture = document.createElement("picture");
    if (moveClasses && img.className) {
      picture.className = img.className;
      img.className = "";
    }

    if (moveData) {
      [...img.attributes].forEach((attr) => {
        if (!attr.name.startsWith("data-")) return;
        picture.setAttribute(attr.name, attr.value);
        img.removeAttribute(attr.name);
      });
    }

    const source = document.createElement("source");
    source.srcset = webpSrc(fallback);
    source.type = "image/webp";

    const parent = img.parentNode;
    if (!parent) return;
    parent.insertBefore(picture, img);
    picture.appendChild(source);
    picture.appendChild(img);
  }

  function initStaticWebpPictures() {
    document.querySelectorAll(".wall-layer, .about-layer, .subscribe-layer").forEach((img) => {
      const src = img.getAttribute("src");
      if (!src) return;
      loadFullImage(img, src);
    });

    document.querySelectorAll(".wall-frame").forEach((img) => {
      upgradeToPicture(img, { moveClasses: true });
    });

    document.querySelectorAll(".banana-part, .entrance-thinker__color, .liberty-color").forEach((img) => {
      const src = img.getAttribute("src");
      if (!src) return;
      loadFullImage(img, src);
    });
  }

  window.GalleryImages = {
    trackPicture,
    loadFullImage,
  };

  initStaticWebpPictures();
})();
