/**
 * 订阅 API 地址配置
 *
 * 本地开发：about.js 默认 http://localhost:3000/api/subscribe
 * 线上：在 about.html 设置 meta，指向 Render 等公网 API
 *
 * 示例：
 * <meta name="gallery-subscribe-api" content="https://your-api.onrender.com/api/subscribe" />
 */
(function () {
  const meta = document.querySelector('meta[name="gallery-subscribe-api"]');
  const fromMeta = meta?.getAttribute("content")?.trim();

  if (fromMeta) {
    window.GALLERY_SUBSCRIBE_API = fromMeta;
  }
})();
