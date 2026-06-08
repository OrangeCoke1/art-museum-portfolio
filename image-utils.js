/**
 * Gallery Walk — 图片路径工具
 * 展厅轨道用缩略图，modal / 高清交互仍用原路径。
 */
(function () {
  function thumbSrc(src) {
    if (!src || src.includes("/thumbs/")) return src;
    const slash = src.lastIndexOf("/");
    if (slash === -1) return `thumbs/${src}`;
    return `${src.slice(0, slash)}/thumbs/${src.slice(slash + 1)}`;
  }

  window.GalleryImages = { thumbSrc };
})();
