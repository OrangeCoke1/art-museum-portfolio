/**
 * Gallery Walk — Photography wall
 * 独立摄影横向展厅：相纸打印、暗房显影、中心 active。
 */

const PHOTOGRAPHS = [
  {
    id: "migrant-mother",
    title: "Migrant Mother",
    artist: "Dorothea Lange",
    year: "1936",
    catalogue: "MoMA 50989",
    medium: "Gelatin silver print, printed 1949",
    subject: "Florence Owens Thompson and her children, Nipomo, California",
    dimensions: '11 1/8 × 8 9/16" (28.3 × 21.8 cm)',
    location: "Museum of Modern Art, New York",
    accession: "331.1995",
    museumUrl: "https://www.moma.org/collection/works/50989",
    image: "images/photograph/Migrant Mother.jpg",
    story:
      "Dorothea Lange was one of the most important documentary photographers working for the Farm Security Administration during the Great Depression. Trained first as a portrait photographer, she brought a strong sense of human presence and dignity to images of poverty, displacement, and labor. Migrant Mother was made in Nipomo, California, when Lange encountered Florence Owens Thompson and her children in a pea-pickers' camp. The photograph is powerful because it does not show a dramatic event, but a suspended moment of anxiety, endurance, and care. The mother's turned gaze, the children hiding their faces, and the tight framing transform a specific family into an emblem of economic hardship. As a gelatin silver print, the image also carries the tonal directness of documentary photography: soft light, worn fabric, and the pressure of bodies close together become evidence of a historical crisis.",
  },
  {
    id: "gare-saint-lazare",
    title: "Behind the Gare Saint-Lazare",
    artist: "Henri Cartier-Bresson",
    year: "1932",
    catalogue: "MoMA 98333",
    medium: "Gelatin silver print, printed 1950s",
    subject: "A man leaping over a puddle behind the Gare Saint-Lazare, Paris",
    dimensions: '13 7/8 × 9 1/2" (35.2 × 24.1 cm)',
    location: "Museum of Modern Art, New York",
    accession: "249.2005",
    museumUrl: "https://www.moma.org/collection/works/98333",
    image: "images/photograph/Behind the Gare Saint-Lazare.jpg",
    story:
      "Henri Cartier-Bresson helped define twentieth-century street photography through the idea of the decisive moment: a fraction of time when gesture, geometry, and meaning briefly align. Behind the Gare Saint-Lazare is one of the clearest examples of that approach. The jumping figure is caught just before touching the flooded ground, while his shape echoes the dancer on the poster in the background and the ladder-like reflections in the water. The photograph is not staged like a painting, yet its composition feels tightly organized. Cartier-Bresson's Leica allowed him to work quickly and quietly, turning ordinary urban movement into a visual structure. The work asks the viewer to notice how chance and form meet in the city, and how photography can preserve an instant that would otherwise disappear.",
  },
  {
    id: "earthrise",
    title: "Earthrise",
    artist: "William Anders / NASA",
    year: "1968",
    catalogue: "NASA AS08-14-2383",
    medium: "70 mm color transparency on Ektachrome film",
    subject: "Earth rising above the lunar horizon during Apollo 8",
    location: "NASA Apollo 8 Image Archive",
    accession: "AS08-14-2383",
    museumUrl: "https://science.nasa.gov/resource/apollo-8s-iconic-earthrise/",
    image: "images/photograph/Earthrise.jpg",
    story:
      "Earthrise was photographed by astronaut William Anders during the Apollo 8 mission, the first crewed mission to orbit the Moon. Although NASA's space photography was made for exploration and documentation, this image quickly became one of the most culturally important photographs of the twentieth century. The Earth appears small, blue, and fragile above the gray lunar surface, reversing the usual human point of view. Instead of looking up at the Moon from Earth, viewers see Earth as a distant body suspended in space. The photograph helped shape environmental consciousness because it made the planet appear unified and vulnerable. Its color, horizon line, and vast emptiness give scientific imagery the emotional force of an icon, reminding viewers that photography can change how a civilization imagines its own home.",
  },
  {
    id: "lunch-atop-a-skyscraper",
    title: "Lunch Atop a Skyscraper",
    artist: "Attributed to Charles C. Ebbets",
    year: "1932",
    medium: "Glass-plate negative / press photograph",
    subject: "Eleven ironworkers eating lunch on a beam at Rockefeller Center",
    location: "Bettmann Archive",
    image: "images/photograph/Lunch Atop a Skyscraper.jpg",
    story:
      "Lunch Atop a Skyscraper is associated with Charles C. Ebbets, although the exact authorship remains debated because several photographers were present during the Rockefeller Center publicity shoot. The image shows eleven ironworkers seated casually on a steel beam high above Manhattan during the construction of the RCA Building. Its force comes from the contrast between danger and ease: the workers eat, talk, and rest as if the city below were simply part of their workplace. The photograph was made as publicity, but it has become a broader symbol of industrial labor, modern architecture, and the risks hidden behind urban growth. The long horizontal beam turns the workers into a frieze, while the distant city makes their bodies appear both heroic and vulnerable.",
  },
  {
    id: "afghan-girl",
    title: "Afghan Girl",
    artist: "Steve McCurry",
    year: "1984",
    medium: "Kodachrome 64 color-slide film",
    subject: "Sharbat Gula, Nasir Bagh refugee camp, Pakistan",
    dimensions: '20 × 24" (50 × 60 cm) paper size',
    location: "Magnum Photos / National Geographic",
    museumUrl:
      "https://store.magnumphotos.com/products/sharbat-gula-afghan-girl-nasir-bagh-refugee-camp-pakistan-1984",
    image: "images/photograph/Afghan Girl.jpg",
    story:
      "Steve McCurry is a photojournalist known for highly saturated color, direct portraiture, and images made in regions shaped by conflict and displacement. Afghan Girl was photographed in 1984 at the Nasir Bagh refugee camp in Pakistan and later appeared on the cover of National Geographic. The sitter, Sharbat Gula, was not identified by name until many years later, a fact that complicates the image's fame. The photograph is visually unforgettable because of the direct gaze, green eyes, red scarf, and shallow framing, but it also raises questions about representation, vulnerability, and the circulation of images of refugees. Its power lies in the tension between individual presence and global symbol: the viewer feels addressed by a particular person while also confronting the history of war, exile, and media attention.",
  },
  {
    id: "moon-and-half-dome",
    title: "Moon and Half Dome",
    artist: "Ansel Adams",
    year: "1960",
    catalogue: "NGA 66714",
    medium: "Gelatin silver print, printed 1980",
    subject: "Half Dome and the moon, Yosemite National Park",
    dimensions: "49.4 × 36.4 cm (19 7/16 × 14 5/16 in.)",
    location: "National Gallery of Art, Washington, D.C.",
    accession: "1986.3.35",
    museumUrl: "https://www.nga.gov/collection/art-object-page.66714.html",
    image: "images/photograph/Moon and Half Dome.jpg",
    story:
      "Ansel Adams was a central figure in American landscape photography, known for his technical precision, environmental vision, and mastery of the gelatin silver print. Moon and Half Dome was made in Yosemite, a place Adams photographed throughout his life and helped transform into an image of American wilderness. The photograph balances the monumental cliff of Half Dome with the small moon suspended above it. Strong contrast, deep shadow, and clear tonal separation give the landscape a sculptural presence. Adams's work is not only about scenery; it is about how light, exposure, and printing can turn nature into a carefully composed experience. This image invites slow looking because its drama is quiet: stone, sky, and moon are held in a moment of stillness and scale.",
  },
  {
    id: "untitled-film-stills",
    title: "Untitled Film Stills",
    artist: "Cindy Sherman",
    year: "1977-1980",
    catalogue: "MoMA 56520",
    medium: "Gelatin silver print",
    subject: "Staged female film-still personas inspired by cinema stereotypes",
    dimensions: '7 1/16 × 9 7/16" (18 × 24 cm)',
    location: "Museum of Modern Art, New York",
    accession: "812.1995",
    museumUrl: "https://www.moma.org/collection/works/56520",
    image: "images/photograph/Untitled Film Stills.jpg",
    story:
      "Cindy Sherman is an artist who uses photography to examine identity, performance, gender, and the visual codes of popular culture. In Untitled Film Stills, Sherman photographs herself in staged scenes that resemble publicity stills from imaginary films. The images are not self-portraits in a traditional sense; instead, she performs types of women shaped by cinema, advertising, and social expectation. The series is important because it shows how photographs can feel familiar even when they do not refer to a real movie. Costumes, poses, interiors, and camera angles all suggest stories that the viewer completes mentally. By making herself both model and author, Sherman exposes the constructed nature of images and asks how femininity is framed, repeated, and consumed.",
  },
  {
    id: "vj-day",
    title: "V-J Day in Times Square",
    artist: "Alfred Eisenstaedt",
    year: "1945",
    catalogue: "ICP 345.1989",
    medium: "Gelatin silver print",
    subject: "A sailor kissing a nurse in Times Square on V-J Day",
    dimensions: 'Image: 18 13/16 × 13 9/16" (47.8 × 34.4 cm)',
    location: "International Center of Photography, New York",
    accession: "345.1989",
    museumUrl: "https://www.icp.org/browse/archive/objects/v-j-day-at-times-square-new-york-city",
    image: "images/photograph/V-J Day in Times Square.jpg",
    story:
      "Alfred Eisenstaedt was a major photojournalist for Life magazine, admired for his ability to capture public events through vivid human gestures. V-J Day in Times Square was made during celebrations marking the end of World War II. The image shows a sailor kissing a nurse in the middle of a crowded street, turning a chaotic public celebration into a single iconic gesture. Its fame comes from the strong contrast between dark uniform and white dress, the diagonal movement of the bodies, and the sense of collective release after years of war. At the same time, the image is now often discussed with more complexity, including questions about consent, public memory, and how magazines turn moments into symbols. The photograph remains important because it shows both the emotional force and the ambiguity of documentary images.",
  },
];

const hall = document.getElementById("photographyHall");
const track = document.getElementById("photographyTrack");
const progress = document.getElementById("scrollProgress");
const progressFill = document.getElementById("scrollProgressFill");
const btnMenu = document.getElementById("btnMenu");
const mobileNav = document.getElementById("mobileNav");
const btnSearch = document.getElementById("btnSearch");
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

const loop = {
  start: 0,
  width: 0,
  normalizing: false,
  timer: null,
};

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

let lastFocusedBeforeModal = null;
let modalCloseTimer = null;
let currentPhotoModalId = null;

function createPhotoCard(photo, loopZone = "original") {
  const article = document.createElement("article");
  const isClone = loopZone !== "original";

  article.className = "artwork-card photo-card";
  article.dataset.id = photo.id;
  article.dataset.loopZone = loopZone;
  article.dataset.title = photo.title;
  article.dataset.artist = photo.artist;
  article.dataset.year = photo.year;
  article.tabIndex = isClone ? -1 : 0;
  article.setAttribute("aria-label", `${photo.title}, ${photo.artist}`);
  if (isClone) article.setAttribute("aria-hidden", "true");

  article.innerHTML = `
    <div class="photo-print">
      <div class="photo-light"></div>
      <img class="photo-image" src="${window.GalleryImages?.thumbSrc(photo.image) ?? photo.image}" alt="${photo.title}" loading="lazy" decoding="async" draggable="false" />
      <div class="artwork-label photo-label">
        <h3>${photo.title}</h3>
        <p>${photo.artist} · ${photo.year}</p>
      </div>
    </div>
  `;

  if (!isClone) {
    article.addEventListener("keydown", (e) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      e.preventDefault();
      openPhotoModal(photo.id);
    });
  }

  return article;
}

function renderPhotography() {
  track.replaceChildren();
  ["before", "original", "after"].forEach((zone) => {
    PHOTOGRAPHS.forEach((photo) => {
      track.appendChild(createPhotoCard(photo, zone));
    });
  });
}

function updateLoopBounds() {
  const originals = track.querySelectorAll('[data-loop-zone="original"]');
  if (!originals.length) return;

  const firstOriginal = originals[0];
  const afterFirst = [...track.querySelectorAll(".photo-card")].find(
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

function centerInitialPhoto() {
  updateLoopBounds();
  if (loop.width <= 0) return;

  const first = track.querySelector('[data-loop-zone="original"]');
  if (!first) {
    hall.scrollLeft = loop.start;
    return;
  }

  const targetCenter = first.offsetLeft + first.offsetWidth / 2;
  const centered = Math.max(0, Math.round(targetCenter - hall.clientWidth / 2));
  const min = loop.start;
  const max = Math.max(loop.start, loop.start + loop.width - hall.clientWidth);
  hall.scrollLeft = Math.min(Math.max(centered, min), max);
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
      updateActivePhoto();
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
  updateActivePhoto();
}

function updateProgress() {
  if (!progress || !progressFill) return;
  const percent = Math.round(loopProgress() * 100);
  progress.value = String(percent);
  progress.setAttribute("aria-valuenow", String(percent));
  progressFill.style.width = `${percent}%`;
}

function updateActivePhoto() {
  if (loop.normalizing) return;

  const cards = track.querySelectorAll(".photo-card");
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

function scrollPhotoIntoView(id) {
  const card = track.querySelector(
    `[data-loop-zone="original"][data-id="${CSS.escape(id)}"]`,
  );
  if (!card) return;
  const hallRect = hall.getBoundingClientRect();
  const rect = card.getBoundingClientRect();
  hall.scrollLeft += rect.left - hallRect.left - (hallRect.width - rect.width) / 2;
  requestAnimationFrame(() => {
    normalizeLoopScroll();
    updateActivePhoto();
    updateProgress();
  });
}

function initScroll() {
  let didSetStart = false;

  function settle(resetStart = false) {
    updateLoopBounds();
    if (resetStart || !didSetStart) {
      centerInitialPhoto();
      didSetStart = true;
    }
    normalizeLoopScroll();
    updateActivePhoto();
    updateProgress();
  }

  settle(true);
  requestAnimationFrame(() => settle(true));
  window.addEventListener("resize", () => settle(false));
  window.addEventListener("pageshow", () => requestAnimationFrame(() => settle(true)));

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
      updateActivePhoto();
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
      updateActivePhoto();
      updateProgress();
    },
    { passive: false },
  );

  track.querySelectorAll(".photo-image").forEach((img) => {
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
    startX = e.clientX;
    startScroll = hall.scrollLeft;
    pressedCard = e.target.closest(".photo-card");
    hall.classList.add("is-dragging");
    hall.setPointerCapture(e.pointerId);
  });

  hall.addEventListener("pointermove", (e) => {
    if (!isDown) return;
    if (Math.abs(e.clientX - startX) > 12) didDrag = true;
    hall.scrollLeft = startScroll - (e.clientX - startX);
    const delta = normalizeLoopScroll();
    if (delta !== 0) startScroll += delta;
    updateActivePhoto();
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
    if (didDrag) {
      hall.dataset.suppressClick = "1";
      setTimeout(() => delete hall.dataset.suppressClick, 80);
    } else if (pressedCard?.dataset.id) {
      openPhotoModal(pressedCard.dataset.id);
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
    const query = window.prompt(window.GalleryI18n?.t("searchPromptPhotography") || "Search photographs", "");
    if (!query) return;
    const q = query.trim().toLowerCase();
    const hit = PHOTOGRAPHS.find(
      (item) =>
        item.title.toLowerCase().includes(q) || item.artist.toLowerCase().includes(q),
    );
    if (hit) scrollPhotoIntoView(hit.id);
  });
}

function initProgressInput() {
  progress?.addEventListener("input", () => {
    setLoopProgress(Number(progress.value) / 100);
  });
}

function renderModalMeta(photo) {
  if (!modalMeta) return;
  const t = window.GalleryI18n?.t || ((key) => key);
  const detailFields = [
    [t("artist"), photo.artist],
    [t("year"), photo.year],
    [t("catalogue"), photo.catalogue],
    [t("medium"), photo.medium],
    [t("subject"), photo.subject],
    [t("dimensions"), photo.dimensions || photo.size],
    [t("location"), photo.location || photo.collection],
    [t("accession"), photo.accession],
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

function renderModalStory(photo) {
  const lang = window.GalleryI18n?.getLanguage?.() || "en";
  if (lang === "en" && photo.story) {
    modalStoryTitle.textContent = `${photo.title} in context`;
    modalStoryText.textContent = photo.story;
    return;
  }

  modalStoryTitle.textContent = window.GalleryI18n?.format
    ? window.GalleryI18n.format("storyInContext", {
        title: photo.title,
        artist: photo.artist,
      })
    : `${photo.title} in context`;
  modalStoryText.textContent = window.GalleryI18n?.format
    ? window.GalleryI18n.format("photographyStoryGeneric", {
        title: photo.title,
        artist: photo.artist,
      })
    : `${photo.title} by ${photo.artist} is presented here as a museum photographic print. The image can be read through its subject, tonal range, cropping, and the historical moment it records or constructs.`;
}

function applyModalTransform() {
  if (!modalStageInner) return;
  modalStageInner.style.transform = `translate(${modalView.x}px, ${modalView.y}px) scale(${modalView.scale})`;
}

function fitModalView() {
  if (!modalStage || !modalImage?.naturalWidth) return;

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

  const padding = 32;
  const stageW = Math.max(1, modalStage.clientWidth - padding);
  const stageH = Math.max(1, modalStage.clientHeight - padding);
  const fitScale =
    Math.min(stageW / modalImage.naturalWidth, stageH / modalImage.naturalHeight) * 0.92;
  modalView.fitScale = fitScale;
  modalView.scale = fitScale;
  modalView.x = 0;
  modalView.y = 0;
  applyModalTransform();
}

function resetModalView() {
  modalView.x = 0;
  modalView.y = 0;
  modalView.scale = modalView.fitScale || 1;
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
  const next = Math.min(4, Math.max(0.35, prev * (delta > 0 ? 1.1 : 0.9)));
  const ratio = next / prev;
  modalView.x -= cx * (ratio - 1);
  modalView.y -= cy * (ratio - 1);
  modalView.scale = next;
  applyModalTransform();
}

function openPhotoModal(photoId) {
  if (!modal || !modalImage) return;
  const photo = PHOTOGRAPHS.find((item) => item.id === photoId);
  if (!photo) return;
  currentPhotoModalId = photoId;

  modalImage.src = photo.image;
  modalImage.alt = photo.title;
  modalTitle.textContent = photo.title;
  modalSubtitle.textContent = `${photo.artist}, ${photo.year}`;
  renderModalMeta(photo);
  renderModalStory(photo);
  modalInfoCard?.classList.remove("is-flipped");
  if (modalLink) {
    modalLink.href = photo.museumUrl || "#";
    modalLink.toggleAttribute("hidden", !photo.museumUrl);
  }

  lastFocusedBeforeModal = document.activeElement;
  if (modalCloseTimer) window.clearTimeout(modalCloseTimer);
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
}

function closePhotoModal() {
  if (!modal || modal.hidden) return;
  if (document.fullscreenElement === modalPanel) document.exitFullscreen().catch(() => {});
  modal.classList.remove("is-open");
  document.body.classList.remove("modal-open");
  modalView.dragging = false;
  modalView.pointerId = null;
  modalStage?.classList.remove("is-dragging");
  if (modalCloseTimer) window.clearTimeout(modalCloseTimer);
  modalCloseTimer = window.setTimeout(() => {
    modal.hidden = true;
    currentPhotoModalId = null;
    modalCloseTimer = null;
  }, MODAL_ANIM_MS);
  if (lastFocusedBeforeModal?.focus) lastFocusedBeforeModal.focus();
}

function initModal() {
  if (!modal || !modalStage || !modalImage) return;

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

  modalStage.addEventListener("dblclick", resetModalView);

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
    modalView.x = modalView.originX + e.clientX - modalView.startX;
    modalView.y = modalView.originY + e.clientY - modalView.startY;
    applyModalTransform();
  });

  const endDrag = (e) => {
    if (e.pointerId !== modalView.pointerId) return;
    modalView.dragging = false;
    modalView.pointerId = null;
    modalStage.classList.remove("is-dragging");
    try {
      modalStage.releasePointerCapture(e.pointerId);
    } catch (_) {}
  };
  modalStage.addEventListener("pointerup", endDrag);
  modalStage.addEventListener("pointercancel", endDrag);

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
  modal.querySelectorAll("[data-close-modal]").forEach((el) => {
    el.addEventListener("click", closePhotoModal);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.hidden) closePhotoModal();
  });
  modalBtnView?.addEventListener("click", () => {
    setModalToolActive("view");
    resetModalView();
  });
  modalBtnPan?.addEventListener("click", () => setModalToolActive("pan"));
  modalBtnFit?.addEventListener("click", () => {
    setModalToolActive("fit");
    fitModalView();
  });
  modalBtnFullscreen?.addEventListener("click", async () => {
    if (!modalPanel) return;
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await modalPanel.requestFullscreen();
    } catch (_) {}
  });

  window.addEventListener("gallery-languagechange", () => {
    if (!modal?.hidden && currentPhotoModalId) {
      const photo = PHOTOGRAPHS.find((item) => item.id === currentPhotoModalId);
      if (photo) {
        renderModalMeta(photo);
        renderModalStory(photo);
      }
    }
  });

  window.GalleryModalMobile?.bindImageStage?.({
    stage: modalStage,
    getView: () => modalView,
    applyTransform: applyModalTransform,
    fit: fitModalView,
  });
}

function init() {
  if (!hall || !track) return;
  renderPhotography();
  initScroll();
  initDrag();
  initHeader();
  initProgressInput();
  initModal();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
