/**
 * Gallery Walk — Sculpture hall
 * 独立横向雕塑展厅：渲染 PNG、中心高亮、拖拽/滚轮横向滚动、进度条。
 */

const SCULPTURES = [
  {
    id: "venus-de-milo",
    title: "Vénus de Milo",
    artist: "Alexandros of Antioch",
    year: "c. 150-125 BCE",
    medium: "Marble",
    size: "204 cm",
    museum: "Louvre Museum",
    location: "Louvre Museum, Paris",
    museumUrl: "https://www.louvre.fr/en/explore/the-palace",
    storyTitle: "Vénus de Milo",
    story:
      "The Vénus de Milo is generally attributed to Alexandros of Antioch, a sculptor active in the Hellenistic period, though very little is known about his life. Unlike the better-documented artists of the Renaissance, ancient sculptors often survive through inscriptions, fragments, and later historical reconstruction rather than biography. This uncertainty is part of the work's aura: the sculpture is famous, but its maker remains partly hidden behind the object itself. Discovered on the island of Melos in 1820, the marble figure quickly became one of the Louvre's defining icons. Its missing arms, poised contrapposto, and twisting torso place it between fragment and ideal form. The body appears calm, but the turned posture creates movement, inviting viewers to imagine the lost gesture. The sculpture also reflects Hellenistic taste for elegance, sensuality, and complex viewing angles, where meaning unfolds as the viewer moves around the figure.",
    image: "images/sculpture/Vénus_de_Milo.png",
    modelSrc: "images/sculpture/models/Ve%CC%81nus_de_Milo.stl",
  },
  {
    id: "laocoon-and-his-sons",
    title: "Laocoön and His Sons",
    artist: "Agesander, Athenodoros and Polydorus",
    year: "1st century BCE",
    image: "images/sculpture/Laocoön and His Sons.png",
  },
  {
    id: "bird-in-space",
    title: "Bird in Space",
    artist: "Constantin Brâncuși",
    year: "1923",
    image: "images/sculpture/Bird_in_Space.png",
  },
  {
    id: "david",
    title: "David",
    artist: "Michelangelo",
    year: "1501-1504",
    image: "images/sculpture/David.png",
  },
  {
    id: "le-baiser",
    title: "Le Baiser",
    artist: "Auguste Rodin",
    year: "1882",
    image: "images/sculpture/Le Baiser.png",
  },
  {
    id: "pieta",
    title: "Pietà",
    artist: "Michelangelo",
    year: "1498-1499",
    image: "images/sculpture/Pietà.png",
  },
  {
    id: "winged-victory",
    title: "Winged Victory of Samothrace",
    artist: "Unknown Hellenistic artist",
    year: "c. 190 BCE",
    image: "images/sculpture/Winged Victory of Samothrace.png",
  },
];

const hall = document.getElementById("sculptureHall");
const track = document.getElementById("sculptureTrack");
const progress = document.getElementById("scrollProgress");
const progressFill = document.getElementById("scrollProgressFill");
const btnMenu = document.getElementById("btnMenu");
const mobileNav = document.getElementById("mobileNav");
const btnSearch = document.getElementById("btnSearch");

const loop = {
  start: 0,
  width: 0,
  normalizing: false,
  timer: null,
};

function createSculptureCard(item, loopZone = "original") {
  const article = document.createElement("article");
  const isClone = loopZone !== "original";

  article.className = "sculpture-card";
  article.dataset.id = item.id;
  article.dataset.loopZone = loopZone;
  article.dataset.title = item.title;
  article.dataset.artist = item.artist;
  article.dataset.year = item.year;
  article.tabIndex = isClone ? -1 : 0;
  article.setAttribute("aria-label", `${item.title}, ${item.artist}`);
  if (isClone) article.setAttribute("aria-hidden", "true");

  if (item.id === "venus-de-milo") {
    article.setAttribute("data-sculpture-3d", "true");
    article.dataset.modelSrc = item.modelSrc;
    article.dataset.medium = item.medium;
    article.dataset.size = item.size;
    article.dataset.collection = item.museum;
    article.dataset.location = item.location;
    article.dataset.museumUrl = item.museumUrl;
    article.dataset.storyTitle = item.storyTitle;
    article.dataset.story = item.story;
  }

  article.innerHTML = `
    <figure class="sculpture-figure">
      <img class="sculpture-image" src="${item.image}" alt="${item.title}" loading="lazy" draggable="false" />
    </figure>
    <div class="sculpture-label">
      <h2>${item.title}</h2>
      <p>${item.artist} · ${item.year}</p>
    </div>
  `;

  if (item.id === "venus-de-milo") {
    article.addEventListener("keydown", (e) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      e.preventDefault();
      if (typeof window.openSculpture3dModal === "function") {
        window.openSculpture3dModal(article);
      } else {
        console.error("[Sculpture 3D] Modal module is not ready");
      }
    });
  }

  return article;
}

function renderSculptures() {
  track.replaceChildren();
  ["before", "original", "after"].forEach((zone) => {
    SCULPTURES.forEach((item) => track.appendChild(createSculptureCard(item, zone)));
  });
}

function updateLoopBounds() {
  const originals = track.querySelectorAll('[data-loop-zone="original"]');
  if (!originals.length) return;

  const firstOriginal = originals[0];
  const afterFirst = [...track.querySelectorAll(".sculpture-card")].find(
    (el) => el.dataset.loopZone === "after",
  );

  loop.start = Math.round(firstOriginal.offsetLeft);
  loop.width = afterFirst
    ? Math.round(afterFirst.offsetLeft - firstOriginal.offsetLeft)
    : Math.round(
        originals[originals.length - 1].offsetLeft +
          originals[originals.length - 1].offsetWidth -
          firstOriginal.offsetLeft,
      );
}

function scrollToLoopStart() {
  updateLoopBounds();
  if (loop.width > 0) hall.scrollLeft = loop.start;
}

function normalizeLoopScroll() {
  if (loop.normalizing || loop.width <= 0) return 0;

  const x = hall.scrollLeft;
  let next = null;
  if (x >= loop.start + loop.width) next = x - loop.width;
  else if (x < loop.start) next = x + loop.width;
  if (next === null) return 0;

  const delta = next - x;
  loop.normalizing = true;
  hall.scrollLeft = next;
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      loop.normalizing = false;
      updateActiveSculpture();
      updateProgress();
    });
  });
  return delta;
}

function loopProgress() {
  if (loop.width <= 0) return 0;
  const offset = ((hall.scrollLeft - loop.start) % loop.width + loop.width) % loop.width;
  return offset / loop.width;
}

function setLoopProgress(value) {
  if (loop.width <= 0) return;
  const safe = Math.max(0, Math.min(0.999, value));
  hall.scrollLeft = loop.start + loop.width * safe;
  updateProgress();
  updateActiveSculpture();
}

function updateProgress() {
  if (!progress || !progressFill) return;
  const percent = Math.round(loopProgress() * 100);
  progress.value = String(percent);
  progress.setAttribute("aria-valuenow", String(percent));
  progressFill.style.width = `${percent}%`;
}

function updateActiveSculpture() {
  if (loop.normalizing) return;

  const cards = track.querySelectorAll(".sculpture-card");
  const viewportCenter = window.innerWidth / 2;
  let closest = null;
  let closestDistance = Infinity;

  cards.forEach((card) => {
    const rect = card.getBoundingClientRect();
    const center = rect.left + rect.width / 2;
    const distance = Math.abs(center - viewportCenter);
    if (distance < closestDistance) {
      closest = card;
      closestDistance = distance;
    }
  });

  const threshold = window.innerWidth * 0.32;
  cards.forEach((card) => {
    card.classList.toggle("is-active", card === closest && closestDistance < threshold);
  });
}

function scrollSculptureIntoView(id) {
  const card = track.querySelector(
    `[data-loop-zone="original"][data-id="${CSS.escape(id)}"]`,
  );
  if (!card) return;
  const hallRect = hall.getBoundingClientRect();
  const rect = card.getBoundingClientRect();
  hall.scrollLeft += rect.left - hallRect.left - (hallRect.width - rect.width) / 2;
  requestAnimationFrame(() => {
    normalizeLoopScroll();
    updateActiveSculpture();
    updateProgress();
  });
}

function initScroll() {
  let didSetStart = false;

  function settle(resetStart = false) {
    updateLoopBounds();
    if (resetStart || !didSetStart) {
      scrollToLoopStart();
      didSetStart = true;
    }
    normalizeLoopScroll();
    updateActiveSculpture();
    updateProgress();
  }

  settle(true);
  requestAnimationFrame(() => settle(true));
  window.addEventListener("resize", () => settle(false));

  hall.addEventListener(
    "scroll",
    () => {
      if (!loop.normalizing) {
        window.clearTimeout(loop.timer);
        loop.timer = window.setTimeout(() => {
          normalizeLoopScroll();
          updateProgress();
        }, 40);
      }
      updateActiveSculpture();
      updateProgress();
    },
    { passive: true },
  );

  document.addEventListener(
    "wheel",
    (e) => {
      if (document.body.classList.contains("modal-open")) return;
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      e.preventDefault();
      hall.scrollLeft += e.deltaY;
      updateActiveSculpture();
      updateProgress();
    },
    { passive: false },
  );

  track.querySelectorAll(".sculpture-image").forEach((img) => {
    if (img.complete) return;
    img.addEventListener("load", () => settle(false), { once: true });
  });
}

function initDrag() {
  let isDown = false;
  let didDrag = false;
  let startX = 0;
  let startScroll = 0;
  let pressedCard = null;

  hall.addEventListener("pointerdown", (e) => {
    if (e.button !== 0) return;
    isDown = true;
    didDrag = false;
    pressedCard = e.target.closest(".sculpture-card");
    startX = e.clientX;
    startScroll = hall.scrollLeft;
    hall.classList.add("is-dragging");
    hall.setPointerCapture(e.pointerId);
  });

  hall.addEventListener("pointermove", (e) => {
    if (!isDown) return;
    if (Math.abs(e.clientX - startX) > 12) didDrag = true;
    hall.scrollLeft = startScroll - (e.clientX - startX);
    const delta = normalizeLoopScroll();
    if (delta !== 0) startScroll += delta;
    updateActiveSculpture();
    updateProgress();
  });

  function endDrag(e) {
    if (!isDown) return;
    isDown = false;
    hall.classList.remove("is-dragging");
    try {
      hall.releasePointerCapture(e.pointerId);
    } catch (_) {
      /* noop */
    }

    if (
      !didDrag &&
      pressedCard?.getAttribute("data-sculpture-3d") === "true" &&
      typeof window.openSculpture3dModal === "function"
    ) {
      window.openSculpture3dModal(pressedCard);
    }

    if (didDrag) {
      hall.dataset.suppressClick = "1";
      setTimeout(() => delete hall.dataset.suppressClick, 80);
    }
    pressedCard = null;
    normalizeLoopScroll();
  }

  hall.addEventListener("pointerup", endDrag);
  hall.addEventListener("pointercancel", endDrag);
}

function initHeader() {
  btnMenu?.addEventListener("click", () => {
    if (!mobileNav) return;
    const open = !mobileNav.classList.contains("is-open");
    mobileNav.classList.toggle("is-open", open);
    mobileNav.hidden = !open;
    btnMenu.setAttribute("aria-expanded", String(open));
  });

  document.querySelectorAll('a[data-nav="about"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href") || "";
      if (href && !href.startsWith("#")) return;

      e.preventDefault();
      const last = track.querySelector('[data-loop-zone="original"]:last-child');
      if (last) {
        const hallRect = hall.getBoundingClientRect();
        const rect = last.getBoundingClientRect();
        hall.scrollLeft += rect.left - hallRect.left;
      }
      if (mobileNav) {
        mobileNav.classList.remove("is-open");
        mobileNav.hidden = true;
        btnMenu?.setAttribute("aria-expanded", "false");
      }
    });
  });

  btnSearch?.addEventListener("click", () => {
    const query = window.prompt(window.GalleryI18n?.t("searchPromptSculpture") || "Search sculptures", "");
    if (!query) return;
    const q = query.trim().toLowerCase();
    const hit = SCULPTURES.find(
      (item) =>
        item.title.toLowerCase().includes(q) || item.artist.toLowerCase().includes(q),
    );
    if (hit) scrollSculptureIntoView(hit.id);
  });
}

function initProgressInput() {
  progress?.addEventListener("input", () => {
    setLoopProgress(Number(progress.value) / 100);
  });
}

function init() {
  if (!hall || !track) return;
  renderSculptures();
  initScroll();
  initDrag();
  initHeader();
  initProgressInput();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
