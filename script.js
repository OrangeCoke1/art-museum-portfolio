/**
 * Gallery Walk — 横向艺术展厅
 * 功能：作品渲染、滚轮横向滚动、进度条、hover 显色、详情弹窗
 */

/* -------------------------------------------------------------------------- */
/* 作品数据                                                                    */
/* -------------------------------------------------------------------------- */
const ARTWORKS = [
  {
    id: "las-meninas",
    title: "Las Meninas",
    artist: "Diego Velázquez",
    year: "1656",
    medium: "Oil on canvas",
    size: "318 × 276 cm",
    museum: "Museo del Prado, Madrid",
    museumUrl:
      "https://www.museodelprado.es/en/the-collection/art-work/las-meninas/9fdc7750-aa54-1b8a-b2c5-9aa5b9af7293",
    category: "Painting",
    image: "images/las-meninas.jpg",
  },
  {
    id: "third-of-may-1808",
    title: "The Third of May 1808",
    artist: "Francisco de Goya",
    year: "1814",
    medium: "Oil on canvas",
    size: "266 × 345 cm",
    museum: "Museo del Prado, Madrid",
    museumUrl:
      "https://www.museodelprado.es/en/the-collection/art-work/the-3rd-of-may-1808-in-madras-or-the-executions/ddc7b0d2-5b3c-4eba-96c5-8a5706c99b3f",
    category: "Painting",
    image:
      "images/El_Tres_de_Mayo,_by_Francisco_de_Goya,_from_Prado_in_Google_Earth.jpg",
  },
  {
    id: "night-watch",
    title: "The Night Watch",
    artist: "Rembrandt van Rijn",
    year: "1642",
    medium: "Oil on canvas",
    size: "379.5 × 453.5 cm",
    museum: "Rijksmuseum, Amsterdam",
    museumUrl: "https://www.rijksmuseum.nl/en/collection/SK-C-5",
    category: "Painting",
    image: "images/La_ronda_de_noche,_por_Rembrandt_van_Rijn.jpg",
  },
  {
    id: "les-demoiselles-avignon",
    title: "Les Demoiselles d'Avignon",
    artist: "Pablo Picasso",
    year: "1907",
    medium: "Oil on canvas",
    size: "243.9 × 233.7 cm",
    museum: "Museum of Modern Art, New York",
    museumUrl: "https://www.moma.org/collection/works/79766",
    category: "Painting",
    image: "images/Chicks-from-avignon.jpg",
  },
  {
    id: "birth-of-venus",
    title: "The Birth of Venus",
    artist: "Sandro Botticelli",
    year: "1484–1486",
    medium: "Tempera on canvas",
    size: "172.5 × 278.5 cm",
    museum: "Uffizi Gallery, Florence",
    museumUrl: "https://www.uffizi.it/en/artworks/the-birth-of-venus",
    category: "Painting",
    image:
      "images/Sandro_Botticelli_-_La_nascita_di_Venere_-_Google_Art_Project_-_edited.jpg",
  },
  {
    id: "dejeuner-sur-herbe",
    title: "Le Déjeuner sur l'herbe",
    artist: "Édouard Manet",
    year: "1863",
    medium: "Oil on canvas",
    size: "208 × 264.5 cm",
    museum: "Musée d'Orsay, Paris",
    museumUrl:
      "https://www.musee-orsay.fr/en/artworks/le-dejeuner-sur-lherbe-77",
    category: "Painting",
    image: "images/dejeuner-sur-herbe.jpg",
  },
  {
    id: "arnolfini-portrait",
    title: "The Arnolfini Portrait",
    artist: "Jan van Eyck",
    year: "1434",
    medium: "Oil on oak panel",
    size: "82.2 × 60 cm",
    museum: "National Gallery, London",
    museumUrl:
      "https://www.nationalgallery.org.uk/paintings/jan-van-eyck-the-arnolfini-portrait",
    category: "Painting",
    image: "images/Van_Eyck_-_Arnolfini_Portrait.jpg",
  },
  {
    id: "liberty",
    title: "La Liberté guidant le peuple",
    artist: "Eugène Delacroix",
    year: "1830",
    medium: "Oil on canvas",
    size: "260 × 325 cm",
    museum: "Louvre Museum",
    museumUrl: "https://www.louvre.fr/en/explore/the-palace",
    category: "Painting",
    image: "images/liberty-color.jpg",
  },
];

/** 导航分类与作品 category 的对应 */
const NAV_CATEGORIES = {
  painting: ["Painting", "Pop Art", "Printmaking"],
  sculpture: ["Sculpture"],
  photography: ["Photography"],
  installation: ["Conceptual Art"],
};

function getNavSlug(category) {
  for (const [slug, list] of Object.entries(NAV_CATEGORIES)) {
    if (list.includes(category)) return slug;
  }
  return "installation";
}

/* -------------------------------------------------------------------------- */
/* DOM 引用                                                                    */
/* -------------------------------------------------------------------------- */
const galleryHall = document.getElementById("galleryHall");
const galleryTrack = document.getElementById("galleryTrack");
const scrollProgress = document.getElementById("scrollProgress");
const scrollProgressFill = document.getElementById("scrollProgressFill");
const modal = document.getElementById("artModal");
const modalPanel = modal?.querySelector(".modal-panel");
const modalImage = document.getElementById("modalImage");
const modalTitle = document.getElementById("modalTitle");
const modalSubtitle = document.getElementById("modalSubtitle");
const modalMeta = modal?.querySelector(".modal-meta");
const modalInfoCard = document.getElementById("modalInfoCard");
const modalFlipToBack = document.getElementById("modalFlipToBack");
const modalFlipToFront = document.getElementById("modalFlipToFront");
const modalStoryTitle = document.getElementById("modalStoryTitle");
const modalStoryText = document.getElementById("modalStoryText");
const modalLink = document.getElementById("modalLink");
const modalStage = document.getElementById("modalStage");
const modalStageInner = document.getElementById("modalStageInner");
const modalBtnView = document.getElementById("modalBtnView");
const modalBtnPan = document.getElementById("modalBtnPan");
const modalBtnFit = document.getElementById("modalBtnFit");
const modalBtnFullscreen = document.getElementById("modalBtnFullscreen");
const MODAL_ANIM_MS = 380;
let lastFocusedBeforeModal = null;
let modalCloseTimer = null;
let currentModalArtId = null;

const modalView = {
  scale: 1,
  fitScale: 1,
  x: 0,
  y: 0,
  dragging: false,
  pointerId: null,
  startX: 0,
  startY: 0,
  originX: 0,
  originY: 0,
};

const MODAL_FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

const ARTWORK_STORIES = {
  "las-meninas": {
    title: "A painting about looking",
    text: "Velázquez painted Las Meninas as far more than a court portrait. The scene places the viewer inside a complex exchange of gazes: the young Infanta stands at the center, attendants move around her, the painter appears at his canvas, and the king and queen are only visible through a distant mirror. The painting turns the act of looking into the subject itself. It asks who is being painted, who is watching, and where the viewer stands inside the space. Through this layered composition, Velázquez elevates painting from documentation to intellectual performance. The work also creates uncertainty between real space and painted space, making the viewer feel temporarily included in the royal room.",
  },
  "third-of-may-1808": {
    title: "A witness to violence",
    text: "Goya created The Third of May 1808 in response to the execution of Spanish civilians by Napoleon's troops. Instead of presenting war as heroic, he shows it as brutal, anonymous, and terrifying. The central figure, dressed in white and yellow, raises his arms like both a victim and a martyr, while the soldiers become a faceless machine of violence. The strong light, dark background, and compressed composition make the scene feel immediate and unavoidable. The painting became one of the most important modern images of anti-war testimony because it focuses not on victory, but on fear, helplessness, and human suffering.",
  },
  "night-watch": {
    title: "Movement inside a group portrait",
    text: "Rembrandt transformed a formal civic guard portrait into a dramatic scene full of movement, light, and hierarchy. Rather than arranging the figures in a static row, he shows the company as if it is stepping into action. The captain and lieutenant move forward, weapons and banners create rhythm, and light falls selectively across the group. The result feels closer to theater than record-keeping. The Night Watch demonstrates Rembrandt's ability to make portraiture active, psychological, and visually complex. It also shows how light can organize social importance, directing attention through the crowd like a stage spotlight.",
  },
  "les-demoiselles-avignon": {
    title: "A fractured view of the body",
    text: "Picasso's Les Demoiselles d'Avignon marked a radical break from traditional representation. The figures are angular, compressed, and confrontational, with faces influenced by Iberian sculpture and African masks. Space no longer behaves naturally; it fractures around the bodies, turning the image into a field of tension. The painting challenges the classical nude, the stable viewpoint, and the expectation of beauty. Its importance lies in how it opened the way toward Cubism and a new modern visual language built from distortion, rupture, and multiple perspectives. The work feels aggressive because the bodies do not simply appear before us; they push back against the viewer's gaze.",
  },
  "birth-of-venus": {
    title: "Myth turned into ideal beauty",
    text: "Botticelli's Birth of Venus presents the goddess arriving on the shore as a vision of ideal beauty rather than a realistic body. The figures are elongated, weightless, and rhythmic, creating a poetic atmosphere that feels suspended outside ordinary time. The subject comes from classical mythology, but the painting reflects Renaissance humanism and the renewed interest in ancient culture. Venus becomes a symbol of beauty, love, and spiritual elevation. The work is less about physical realism than about line, grace, and the dreamlike power of myth. Its delicate movement and pale color make the scene feel like an image between nature, poetry, and sacred imagination.",
  },
  "dejeuner-sur-herbe": {
    title: "A modern challenge to tradition",
    text: "Manet's Le Déjeuner sur l'herbe shocked viewers because it placed a nude woman in a contemporary setting beside clothed modern men. Unlike mythological nudes in academic painting, this figure looks directly at the viewer, refusing to be safely placed in the past or in fantasy. The flattened space, abrupt contrasts, and casual picnic scene all disrupt traditional expectations. The painting becomes a statement about modern life, spectatorship, and social discomfort. It helped shift painting away from idealized history and toward the contradictions of the present. The work is important because it exposes the rules of looking itself: who is allowed to look, who is being looked at, and why the viewer feels uneasy.",
  },
  "arnolfini-portrait": {
    title: "A domestic scene full of symbols",
    text: "Van Eyck's Arnolfini Portrait turns a private interior into a dense field of visual signs. The convex mirror, chandelier, dog, shoes, clothing, and hand gestures all suggest wealth, status, domestic ritual, and carefully constructed identity. The painting also demonstrates extraordinary technical precision: textures, reflections, and light are rendered with jewel-like clarity. Whether read as a marriage image, a memorial, or a statement of social position, the work shows how a small domestic scene can contain complex layers of meaning. Its power comes from the tension between everyday objects and symbolic depth, making the room feel both intimate and ceremonial.",
  },
  liberty: {
    title: "Revolution as an image",
    text: "Delacroix painted Liberty Leading the People after the July Revolution of 1830 in France. The central figure of Liberty is both allegorical and physical: she carries the tricolor flag, moves through smoke and bodies, and leads people from different social classes forward. The painting combines political history, theatrical drama, and national symbolism. It does not simply record an event; it transforms revolution into an image of collective force. The contrast between idealized Liberty and the dead bodies below gives the work both energy and unease. The painting suggests that political freedom is not abstract; it is carried through bodies, risk, violence, and shared movement.",
  },
};

const ARTIST_BACKGROUNDS = {
  "las-meninas":
    "Diego Velázquez was the leading painter at the court of King Philip IV of Spain and one of the most searching observers of power, image-making, and social presence in seventeenth-century Europe.",
  "third-of-may-1808":
    "Francisco de Goya began as a court painter, but his mature work became increasingly critical, psychological, and dark, shaped by illness, political violence, and the collapse of Enlightenment optimism in Spain.",
  "night-watch":
    "Rembrandt van Rijn was the most celebrated painter of the Dutch Golden Age, known for turning portraiture and biblical subjects into intense studies of light, personality, age, and human vulnerability.",
  "les-demoiselles-avignon":
    "Pablo Picasso was a central figure of twentieth-century modernism. His work repeatedly broke inherited visual rules, moving from academic skill to radical experiments with form, perspective, and the body.",
  "birth-of-venus":
    "Sandro Botticelli worked in Florence during the early Renaissance, close to the humanist culture of the Medici circle, where classical poetry, philosophy, and Christian symbolism often overlapped.",
  "dejeuner-sur-herbe":
    "Édouard Manet was a key painter of modern life in nineteenth-century Paris. He challenged academic painting not by rejecting tradition entirely, but by quoting it in ways that made modern society feel direct and unsettling.",
  "arnolfini-portrait":
    "Jan van Eyck was among the great innovators of Northern Renaissance painting, admired for his precise oil technique, luminous surfaces, and ability to make everyday objects carry symbolic and social meaning.",
  liberty:
    "Eugène Delacroix was the leading French Romantic painter, known for dramatic color, energetic composition, and subjects charged with emotion, violence, literature, and politics.",
};

function getArtworkStory(art) {
  const lang = window.GalleryI18n?.getLanguage?.() || "en";
  if (lang !== "en") {
    return {
      title: window.GalleryI18n.format("storyInContext", {
        title: art.title,
        artist: art.artist,
      }),
      text: window.GalleryI18n.format("artworkStoryGeneric", {
        title: art.title,
        artist: art.artist,
      }),
    };
  }

  const story =
    ARTWORK_STORIES[art.id] || {
      title: `${art.title} in context`,
      text: `${art.title} by ${art.artist} can be read through its material, scale, and museum setting. The work invites slower observation of form, surface, and the historical moment behind its image.`,
    };
  const artistBackground =
    ARTIST_BACKGROUNDS[art.id] ||
    `${art.artist} shaped the work through a specific artistic language, historical setting, and set of visual choices.`;

  return {
    title: story.title,
    text: `${artistBackground} ${story.text}`,
  };
}

function renderModalStory(art) {
  const story = getArtworkStory(art);
  if (modalStoryTitle) modalStoryTitle.textContent = story.title;
  if (modalStoryText) modalStoryText.textContent = story.text;
}

function renderModalMeta(artwork) {
  if (!modalMeta) return;
  const t = window.GalleryI18n?.t || ((key) => key);
  const detailFields = [
    [t("artist"), artwork.artist],
    [t("year"), artwork.year],
    [t("catalogue"), artwork.catalogue],
    [t("medium"), artwork.medium],
    [t("subject"), artwork.subject],
    [t("dimensions"), artwork.dimensions || artwork.size],
    [t("location"), artwork.location || artwork.collection || artwork.museum],
    [t("accession"), artwork.accession],
  ];

  modalMeta.innerHTML = detailFields
    .filter(([, value]) => value && String(value).trim() !== "")
    .map(
      ([label, value]) => `
        <div class="modal-meta__row">
          <dt>${label}</dt>
          <dd>${value}</dd>
        </div>
      `,
    )
    .join("");
}

/* -------------------------------------------------------------------------- */
/* 循环滚动（头尾相连 · 仅手动，不自动轮播）                                    */
/* 滚轮 / 拖拽 / 进度条由用户驱动；越过边界时瞬时跳回中段，形成无缝循环。      */
/* -------------------------------------------------------------------------- */
const loopState = {
  start: 0,
  width: 0,
  isNormalizing: false,
  normalizeTimer: null,
};

function updateLoopBounds() {
  const originals = galleryTrack.querySelectorAll(
    '[data-loop-zone="original"]',
  );
  if (!originals.length) return;

  const firstOriginal = originals[0];
  const firstOriginalStart = Math.round(firstOriginal.offsetLeft);
  const afterFirst = [
    ...galleryTrack.querySelectorAll("article.artwork-card"),
  ].find((el) => el.dataset.loopZone === "after");
  if (!afterFirst) {
    const lastOriginal = originals[originals.length - 1];
    loopState.start = firstOriginalStart;
    loopState.width = Math.round(
      lastOriginal.offsetLeft +
        lastOriginal.offsetWidth -
        firstOriginalStart,
    );
    return;
  }

  loopState.start = firstOriginalStart;
  /* 真实循环周期：原版第一张左边 → After 克隆段第一张左边（含段末与克隆段之间的 gap） */
  loopState.width = Math.round(afterFirst.offsetLeft - firstOriginalStart);
}

function getArtworkCenteredScrollLeft(artwork) {
  if (!artwork || !galleryHall) return 0;
  const targetCenter = artwork.offsetLeft + artwork.offsetWidth / 2;
  return Math.max(0, Math.round(targetCenter - galleryHall.clientWidth / 2));
}

function centerArtworkOnLoad() {
  updateLoopBounds();
  if (loopState.width <= 0) return;

  const first = galleryTrack.querySelector(
    '[data-loop-zone="original"].artwork-card',
  );
  if (!first) return;

  const centered = getArtworkCenteredScrollLeft(first);
  const min = loopState.start;
  const max = Math.max(
    loopState.start,
    loopState.start + loopState.width - galleryHall.clientWidth,
  );
  galleryHall.scrollLeft = Math.min(Math.max(centered, min), max);
}

function scheduleInitialArtworkCenter() {
  const center = () => {
    centerArtworkOnLoad();
    updateProgressUI();
  };

  requestAnimationFrame(() => {
    center();
    requestAnimationFrame(center);
  });
}

function scrollToLoopStart() {
  centerArtworkOnLoad();
}

/** 循环边界校正完成后刷新中心高亮（避免与 is-loop-jump 同一帧抢布局） */
const LOOP_SETTLED = "gallery-loop-settled";

/** @returns {number} 为修正拖拽原点，返回 scrollLeft 的变化量（无跳变为 0） */
function normalizeLoopScroll() {
  if (loopState.isNormalizing || loopState.width <= 0) return 0;

  const x = galleryHall.scrollLeft;
  const { start, width } = loopState;
  let next = null;

  if (x >= start + width) {
    next = x - width;
  } else if (x < start) {
    next = x + width;
  }

  if (next === null) return 0;

  const delta = next - x;

  loopState.isNormalizing = true;
  galleryHall.classList.add("is-loop-jump");
  galleryTrack.classList.add("is-loop-jump");

  /* 跳转前先冻结显色状态，避免 original / clone 切换时 active class 重新计算产生闪烁 */
  galleryTrack
    .querySelectorAll(".artwork-card.is-active")
    .forEach((card) => card.classList.remove("is-active"));

  galleryHall.scrollLeft = next;

  /* 双 rAF：等合成层提交 scroll 后再恢复 transition，减少首尾衔接闪动 */
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      galleryHall.classList.remove("is-loop-jump");
      galleryTrack.classList.remove("is-loop-jump");
      loopState.isNormalizing = false;
      window.dispatchEvent(new CustomEvent(LOOP_SETTLED));
    });
  });

  return delta;
}

function onGalleryScroll() {
  if (!loopState.isNormalizing) {
    window.clearTimeout(loopState.normalizeTimer);
    loopState.normalizeTimer = window.setTimeout(() => {
      normalizeLoopScroll();
      updateProgressUI();
    }, 40);
  }
  updateProgressUI();
}

function getLoopScrollProgress() {
  if (loopState.width <= 0) return 0;
  let offset = galleryHall.scrollLeft - loopState.start;
  offset = ((offset % loopState.width) + loopState.width) % loopState.width;
  return offset / loopState.width;
}

function setLoopScrollProgress(ratio) {
  if (loopState.width <= 0) return;
  const safeRatio = Math.max(0, Math.min(0.999, ratio));
  galleryHall.scrollLeft = loopState.start + safeRatio * loopState.width;
}

function scrollArtworkIntoView(artId) {
  const el = galleryTrack.querySelector(
    `[data-loop-zone="original"][data-id="${artId}"]`,
  );
  if (!el) return;

  const hallRect = galleryHall.getBoundingClientRect();
  const targetRect = el.getBoundingClientRect();
  galleryHall.scrollLeft += targetRect.left - hallRect.left - 24;
  requestAnimationFrame(normalizeLoopScroll);
}

/* -------------------------------------------------------------------------- */
/* 渲染展厅作品                                                                */
/* -------------------------------------------------------------------------- */
function createArtworkCard(art, { loopZone = "original" } = {}) {
  const article = document.createElement("article");
  const isClone = loopZone !== "original";

  article.className = "artwork artwork-card";
  article.dataset.id = art.id;
  article.dataset.navCategory = getNavSlug(art.category);
  article.dataset.loopZone = loopZone;
  article.setAttribute("role", "button");
  article.setAttribute(
    "aria-label",
    `${art.title}, ${art.artist}, 点击查看详情`,
  );

  if (isClone) {
    article.setAttribute("aria-hidden", "true");
    article.tabIndex = -1;
  } else {
    article.tabIndex = 0;
    article.setAttribute("data-reveal", "x");
    article.setAttribute("data-reveal-once", "");
  }

  const labelHtml = `
    <div class="artwork-label">
      <h3>${art.title}</h3>
      <p>${art.artist} · ${art.year}</p>
    </div>
  `;

  article.innerHTML = `
    <div class="framed-artwork">
      <div class="mat-board">
        <img class="artwork-image" src="${art.image}" alt="${art.title}" loading="lazy" />
      </div>
    </div>
    ${labelHtml}
  `;

  article.addEventListener("mouseenter", () =>
    article.classList.add("is-hovered"),
  );
  article.addEventListener("mouseleave", () =>
    article.classList.remove("is-hovered"),
  );

  article.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openModal(art.id);
    }
  });

  return article;
}

/** 保证原版作品卡可见（scroll-reveal load refresh 曾会卸掉 is-revealed） */
function ensureGalleryArtworksVisible() {
  if (!galleryTrack) return;
  galleryTrack
    .querySelectorAll('[data-loop-zone="original"].artwork-card')
    .forEach((card) => {
      card.classList.add("is-revealed");
    });
}

function renderGallery() {
  galleryTrack.replaceChildren();

  ARTWORKS.forEach((art) => {
    galleryTrack.appendChild(createArtworkCard(art, { loopZone: "before" }));
  });
  ARTWORKS.forEach((art) => {
    galleryTrack.appendChild(createArtworkCard(art, { loopZone: "original" }));
  });
  ARTWORKS.forEach((art) => {
    galleryTrack.appendChild(createArtworkCard(art, { loopZone: "after" }));
  });

  if (window.ScrollReveal) {
    window.ScrollReveal.refresh(galleryTrack);
  }

  ensureGalleryArtworksVisible();
}

function initLoopGallery() {
  let didSetStart = false;

  const settle = (resetStart = false) => {
    updateLoopBounds();
    if (resetStart || !didSetStart) {
      scrollToLoopStart();
      didSetStart = true;
    }
    normalizeLoopScroll();
    updateProgressUI();
  };

  settle(true);
  requestAnimationFrame(() => settle(true));

  galleryHall.addEventListener("scroll", onGalleryScroll, { passive: true });

  window.addEventListener("resize", () => settle(false));

  galleryTrack.querySelectorAll(".artwork-image").forEach((img) => {
    if (img.complete) return;
    img.addEventListener(
      "load",
      () => {
        settle(false);
        scheduleInitialArtworkCenter();
      },
      { once: true },
    );
  });

  const onGalleryReady = () => {
    ensureGalleryArtworksVisible();
    scheduleInitialArtworkCenter();
  };

  window.addEventListener("load", onGalleryReady, { once: true });
  window.addEventListener("pageshow", onGalleryReady);
}

function updateProgressUI() {
  if (!scrollProgress || !scrollProgressFill) return;
  const ratio = getLoopScrollProgress();
  const percent = Math.round(ratio * 100);
  scrollProgress.value = String(percent);
  scrollProgress.setAttribute("aria-valuenow", String(percent));
  scrollProgressFill.style.width = `${percent}%`;
}

/** 垂直滚轮 → 横向滚动（整页无纵向滚动） */
function initWheelScroll() {
  const onWheel = (e) => {
    if (!modal || !modal.hidden) return;
    if (loopState.width <= 0) return;

    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;

    e.preventDefault();
    galleryHall.scrollLeft += e.deltaY;
    window.clearTimeout(loopState.normalizeTimer);
    loopState.normalizeTimer = window.setTimeout(() => {
      normalizeLoopScroll();
      updateProgressUI();
    }, 40);
  };

  document.addEventListener("wheel", onWheel, { passive: false });
}

/** 拖拽横向滑动（桌面增强） */
function initDragScroll() {
  let isDown = false;
  let didDrag = false;
  let startX = 0;
  let startY = 0;
  let scrollStart = 0;
  let pressedArtworkId = null;

  galleryHall.addEventListener("pointerdown", (e) => {
    if (e.button !== 0) return;
    const pressedCard = e.target.closest(".artwork-card");
    isDown = true;
    didDrag = false;
    pressedArtworkId = pressedCard?.dataset.id || null;
    startX = e.clientX;
    startY = e.clientY;
    scrollStart = galleryHall.scrollLeft;
    galleryHall.setPointerCapture(e.pointerId);
  });

  galleryHall.addEventListener("pointermove", (e) => {
    if (!isDown) return;
    if (
      Math.abs(e.clientX - startX) > 12 ||
      Math.abs(e.clientY - startY) > 12
    ) {
      didDrag = true;
      galleryHall.classList.add("is-dragging");
    }

    if (!didDrag) return;

    galleryHall.scrollLeft = scrollStart - (e.clientX - startX);
    const jump = normalizeLoopScroll();
    if (jump !== 0) scrollStart += jump;
  });

  const endDrag = (e) => {
    if (!isDown) return;
    isDown = false;
    galleryHall.classList.remove("is-dragging");
    onGalleryScroll();
    try {
      galleryHall.releasePointerCapture(e.pointerId);
    } catch (_) {}

    if (!didDrag && pressedArtworkId) {
      openModal(pressedArtworkId);
    }

    if (didDrag) {
      galleryHall.dataset.suppressClick = "1";
      setTimeout(() => delete galleryHall.dataset.suppressClick, 80);
    }

    pressedArtworkId = null;
  };

  galleryHall.addEventListener("pointerup", endDrag);
  galleryHall.addEventListener("pointercancel", endDrag);
}

/** 中心作品自动显色 + 开灯 */
function initCenterSpotlight() {
  let ticking = false;

  function updateActiveArtwork() {
    if (loopState.isNormalizing) return;

    const cards = document.querySelectorAll(".artwork-card");
    const viewportCenterX = window.innerWidth / 2;
    const activeThreshold = window.innerWidth * 0.28;

    let closestCard = null;
    let closestDistance = Infinity;

    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      const cardCenterX = rect.left + rect.width / 2;
      const distance = Math.abs(cardCenterX - viewportCenterX);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestCard = card;
      }
    });

    const activeId =
      closestCard && closestDistance < activeThreshold
        ? closestCard.dataset.id
        : null;

    cards.forEach((card) => {
      card.classList.toggle("is-active", card === closestCard && !!activeId);
    });
  }

  function requestActiveArtworkUpdate() {
    if (loopState.isNormalizing) return;
    if (!ticking) {
      window.requestAnimationFrame(() => {
        if (loopState.isNormalizing) {
          ticking = false;
          return;
        }
        updateActiveArtwork();
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener(LOOP_SETTLED, () => {
    updateActiveArtwork();
  });

  galleryHall.addEventListener("scroll", requestActiveArtworkUpdate, {
    passive: true,
  });
  window.addEventListener("resize", updateActiveArtwork);
  updateActiveArtwork();
}

function initProgressBar() {
  if (!scrollProgress) return;

  galleryHall.addEventListener("scroll", updateProgressUI, { passive: true });

  scrollProgress.addEventListener("input", () => {
    setLoopScrollProgress(Number(scrollProgress.value) / 100);
    updateProgressUI();
  });
}

/* -------------------------------------------------------------------------- */
/* 弹窗 + 查看器（缩放 / 平移 / 旋转）                                          */
/* -------------------------------------------------------------------------- */
function applyModalTransform() {
  if (!modalStageInner) return;
  const { x, y, scale } = modalView;
  modalStageInner.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
}

function resetModalView() {
  modalView.x = 0;
  modalView.y = 0;
  fitModalView();
}

function fitModalView() {
  if (!modalStage || !modalImage.naturalWidth) return;

  if (
    window.GalleryModalMobile?.applyMobileFit?.(
      modalView,
      modalStage,
      modalImage,
    )
  ) {
    applyModalTransform();
    return;
  }

  const stageRect = modalStage.getBoundingClientRect();
  const stageW = Math.max(1, stageRect.width);
  const stageH = Math.max(1, stageRect.height);
  const imgW = modalImage.naturalWidth;
  const imgH = modalImage.naturalHeight;
  const fitScale = Math.min(stageW / imgW, stageH / imgH) * 0.86;

  modalView.fitScale = Math.min(1, fitScale);
  modalView.scale = modalView.fitScale;
  modalView.x = 0;
  modalView.y = 0;
  applyModalTransform();
}

function setModalToolActive(tool) {
  [modalBtnView, modalBtnPan, modalBtnFit].forEach((btn) => {
    if (!btn) return;
    const active = btn.dataset.tool === tool;
    btn.classList.toggle("is-active", active);
    btn.setAttribute("aria-pressed", String(active));
  });
  modalStage?.classList.toggle("is-pan-mode", tool === "pan");
}

function zoomModalAt(delta, clientX, clientY) {
  if (!modalStage) return;

  const rect = modalStage.getBoundingClientRect();
  const cx = clientX - rect.left - rect.width / 2;
  const cy = clientY - rect.top - rect.height / 2;
  const prev = modalView.scale;
  const minScale = Math.max(0.04, modalView.fitScale || 0.04);
  const maxScale = Math.max(4, minScale * 12);
  const zoomFactor = delta > 0 ? 1.08 : 0.92;
  const next = Math.min(maxScale, Math.max(minScale, prev * zoomFactor));
  const ratio = next / prev;

  modalView.x -= cx * (ratio - 1);
  modalView.y -= cy * (ratio - 1);
  modalView.scale = next;
  applyModalTransform();
}

function initModalViewer() {
  if (!modalStage || !modalStageInner || !modalImage) return;

  modalImage.addEventListener("load", () => {
    if (!modal.hidden) fitModalView();
  });

  modalStage.addEventListener(
    "wheel",
    (e) => {
      if (modal.hidden) return;
      e.preventDefault();
      zoomModalAt(-e.deltaY, e.clientX, e.clientY);
    },
    { passive: false },
  );

  modalStage.addEventListener("dblclick", () => resetModalView());

  let lastMobileTap = 0;
  modalStage.addEventListener(
    "touchend",
    (e) => {
      if (!window.GalleryModalMobile?.isMobile?.()) return;
      if (e.touches.length > 0 || window.GalleryModalMobile?.isPinching?.())
        return;
      const now = Date.now();
      if (now - lastMobileTap < 320) {
        e.preventDefault();
        resetModalView();
        lastMobileTap = 0;
        return;
      }
      lastMobileTap = now;
    },
    { passive: false },
  );

  modalStage.addEventListener("pointerdown", (e) => {
    if (e.button !== 0 || e.target.closest(".modal-toolbar")) return;
    if (window.GalleryModalMobile?.shouldSkipStagePointer?.(e, modalView)) return;
    modalView.dragging = true;
    modalView.pointerId = e.pointerId;
    modalView.startX = e.clientX;
    modalView.startY = e.clientY;
    modalView.originX = modalView.x;
    modalView.originY = modalView.y;
    modalStage.classList.add("is-dragging");
    modalStage.setPointerCapture(e.pointerId);
  });

  modalStage.addEventListener("pointermove", (e) => {
    if (!modalView.dragging || e.pointerId !== modalView.pointerId) return;
    const dx = e.clientX - modalView.startX;
    const dy = e.clientY - modalView.startY;

    modalView.x = modalView.originX + dx;
    modalView.y = modalView.originY + dy;
    applyModalTransform();
  });

  const endDrag = (e) => {
    if (e.pointerId !== modalView.pointerId) return;
    modalView.dragging = false;
    modalView.pointerId = null;
    modalStage.classList.remove("is-dragging");
    try {
      modalStage.releasePointerCapture(e.pointerId);
    } catch (_) {
      /* noop */
    }
  };

  modalStage.addEventListener("pointerup", endDrag);
  modalStage.addEventListener("pointercancel", endDrag);

  modalBtnView?.addEventListener("click", () => {
    setModalToolActive("view");
    resetModalView();
  });

  modalBtnPan?.addEventListener("click", () => {
    setModalToolActive("pan");
  });

  modalBtnFit?.addEventListener("click", () => {
    setModalToolActive("fit");
    resetModalView();
  });

  modalBtnFullscreen?.addEventListener("click", async () => {
    if (!modalPanel) return;
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await modalPanel.requestFullscreen();
      }
    } catch (_) {
      /* noop */
    }
  });

  setModalToolActive("view");

  window.GalleryModalMobile?.bindImageStage?.({
    stage: modalStage,
    getView: () => modalView,
    applyTransform: applyModalTransform,
  });
}

function openModal(artId) {
  if (!modal || !modalImage) return;
  const art = ARTWORKS.find((a) => a.id === artId);
  if (!art) return;
  currentModalArtId = artId;

  modalImage.src = art.image;
  modalImage.alt = art.title;
  if (modalTitle) modalTitle.textContent = art.title;
  if (modalSubtitle) modalSubtitle.textContent = `${art.artist}, ${art.year}`;
  renderModalMeta(art);
  renderModalStory(art);
  modalInfoCard?.classList.remove("is-flipped");
  if (modalLink) {
    modalLink.href = art.museumUrl;
    modalLink.target = "_blank";
    modalLink.rel = "noopener noreferrer";
  }

  lastFocusedBeforeModal = document.activeElement;
  if (modalCloseTimer) {
    window.clearTimeout(modalCloseTimer);
    modalCloseTimer = null;
  }

  modal.hidden = false;
  document.body.classList.add("modal-open");
  modal.classList.remove("is-open");
  setModalToolActive("view");

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      modal.classList.add("is-open");
      requestAnimationFrame(fitModalView);
    });
  });

  if (modalImage.complete) {
    requestAnimationFrame(() => requestAnimationFrame(fitModalView));
  }

  modalBtnView?.focus();
}

function closeModal() {
  if (!modal || modal.hidden) return;
  if (document.fullscreenElement === modalPanel) {
    document.exitFullscreen().catch(() => {});
  }

  modal.classList.remove("is-open");
  document.body.classList.remove("modal-open");
  modalView.dragging = false;
  modalView.pointerId = null;
  modalStage?.classList.remove("is-dragging");

  if (modalCloseTimer) window.clearTimeout(modalCloseTimer);
  modalCloseTimer = window.setTimeout(() => {
    modal.hidden = true;
    currentModalArtId = null;
    modalCloseTimer = null;
  }, MODAL_ANIM_MS);

  if (lastFocusedBeforeModal?.focus) lastFocusedBeforeModal.focus();
}

function initModal() {
  if (!modal) return;
  initModalViewer();

  modal.querySelectorAll("[data-close-modal]").forEach((el) => {
    el.addEventListener("click", closeModal);
  });

  modalInfoCard?.addEventListener("click", () => {
    modalInfoCard.classList.toggle("is-flipped");
  });

  modalInfoCard?.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    e.preventDefault();
    modalInfoCard.classList.toggle("is-flipped");
  });

  modalFlipToBack?.addEventListener("click", (e) => {
    e.stopPropagation();
    modalInfoCard?.classList.add("is-flipped");
  });

  modalFlipToFront?.addEventListener("click", (e) => {
    e.stopPropagation();
    modalInfoCard?.classList.remove("is-flipped");
  });

  document.addEventListener("keydown", (e) => {
    if (!modal || modal.hidden) return;

    if (e.key === "Escape") {
      closeModal();
      return;
    }

    if (e.key !== "Tab") return;

    const focusable = [
      ...modal.querySelectorAll(MODAL_FOCUSABLE_SELECTOR),
    ].filter((el) => !el.hasAttribute("disabled") && el.offsetParent !== null);
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });
}

/* -------------------------------------------------------------------------- */
/* 顶部导航                                                                    */
/* -------------------------------------------------------------------------- */
function setActiveNav(slug) {
  document.querySelectorAll(".site-nav__link").forEach((link) => {
    const match = link.dataset.nav === slug;
    link.classList.toggle("is-active", match);
  });
}

function scrollToNavTarget(slug) {
  if (slug === "about") {
    const last = galleryTrack.querySelector(
      '[data-loop-zone="original"]:last-child',
    );
    if (!last) return;
    const hallRect = galleryHall.getBoundingClientRect();
    const targetRect = last.getBoundingClientRect();
    galleryHall.scrollLeft += targetRect.left - hallRect.left - 24;
    requestAnimationFrame(normalizeLoopScroll);
    return;
  }

  const first = galleryTrack.querySelector(
    `[data-loop-zone="original"][data-nav-category="${slug}"]`,
  );
  if (!first) return;

  const hallRect = galleryHall.getBoundingClientRect();
  const targetRect = first.getBoundingClientRect();
  galleryHall.scrollLeft += targetRect.left - hallRect.left - 24;
  requestAnimationFrame(normalizeLoopScroll);
}

function initHeaderNav() {
  const btnMenu = document.getElementById("btnMenu");
  const mobileNav = document.getElementById("mobileNav");
  const btnSearch = document.getElementById("btnSearch");

  document.querySelectorAll(".site-nav__link").forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href") || "";
      if (href && !href.startsWith("#")) return;

      e.preventDefault();
      const slug = link.dataset.nav;
      if (!slug) return;
      setActiveNav(slug);
      scrollToNavTarget(slug);
      if (mobileNav) {
        mobileNav.classList.remove("is-open");
        mobileNav.hidden = true;
        btnMenu?.setAttribute("aria-expanded", "false");
      }
    });
  });

  btnMenu?.addEventListener("click", () => {
    if (!mobileNav) return;
    const open = !mobileNav.classList.contains("is-open");
    mobileNav.classList.toggle("is-open", open);
    mobileNav.hidden = !open;
    btnMenu.setAttribute("aria-expanded", String(open));
  });

  btnSearch?.addEventListener("click", () => {
    const query = window.prompt(window.GalleryI18n?.t("searchPromptPainting") || "Search artworks", "");
    if (!query) return;
    const q = query.trim().toLowerCase();
    const hit = ARTWORKS.find(
      (a) =>
        a.title.toLowerCase().includes(q) || a.artist.toLowerCase().includes(q),
    );
    if (hit) {
      openModal(hit.id);
      scrollArtworkIntoView(hit.id);
    }
  });

  window.addEventListener("gallery-languagechange", () => {
    if (!modal?.hidden && currentModalArtId) {
      const art = ARTWORKS.find((a) => a.id === currentModalArtId);
      if (art) {
        renderModalMeta(art);
        renderModalStory(art);
      }
    }
  });
}

/* -------------------------------------------------------------------------- */
/* 初始化                                                                      */
/* -------------------------------------------------------------------------- */
function initEntranceDeepLink() {
  const slug = window.location.hash.slice(1);
  if (!slug) return;
  const valid = slug === "about" || NAV_CATEGORIES[slug];
  if (!valid) return;

  setActiveNav(slug);
  requestAnimationFrame(() => {
    requestAnimationFrame(() => scrollToNavTarget(slug));
  });
}

function init() {
  if (!galleryHall || !galleryTrack || !modal || !modalImage) {
    console.warn(
      "[Gallery] 缺少必要 DOM（galleryHall / galleryTrack / artModal / modalImage），跳过初始化",
    );
    return;
  }

  try {
    renderGallery();
    initLoopGallery();
    initHeaderNav();
    initWheelScroll();
    initDragScroll();
    initCenterSpotlight();
    initProgressBar();
    initModal();
    initEntranceDeepLink();
  } catch (err) {
    console.error("[Gallery] 初始化失败:", err);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
