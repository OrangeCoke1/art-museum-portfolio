/**
 * Gallery Walk — Sculpture hall
 * 独立横向雕塑展厅：渲染 PNG、中心高亮、拖拽/滚轮横向滚动、进度条。
 */

const SKETCHFAB_EMBED_QUERY =
  "autostart=1&transparent=1&ui_animations=0&ui_infos=0&ui_stop=0&ui_watermark_link=0&ui_watermark=0&ui_hint=0&ui_ar=0&ui_help=0&ui_vr=0&ui_annotations=0&dnt=1";

function sketchfabEmbedSrc(modelId) {
  return `https://sketchfab.com/models/${modelId}/embed?${SKETCHFAB_EMBED_QUERY}`;
}

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
    image: "images/sculpture/venus-de-milo.png",
    sketchfabId: "3c1b8320b7eb4beb931dd3d9886d026a",
    iframeTitle: "Venus de Milo sculpture",
  },
  {
    id: "laocoon-and-his-sons",
    title: "Laocoön and His Sons",
    artist: "Agesander, Athenodoros and Polydorus",
    year: "1st century BCE",
    medium: "Marble",
    size: "208 cm (height)",
    museum: "Vatican Museums",
    location: "Vatican Museums, Vatican City",
    museumUrl:
      "https://www.museivaticani.va/content/museivaticani/en/collezioni/musei/museo-pio-clementino/sala-delle-muse/sala-del-laocoon.html",
    storyTitle: "Laocoön and His Sons",
    story:
      "Laocoön and His Sons depicts the Trojan priest and his two sons being crushed by sea serpents sent by the gods, a scene drawn from Virgil's Aeneid. The group is attributed to three Rhodian sculptors and is one of the most celebrated works of Hellenistic art, where agony, movement, and anatomical force are pushed to an extreme without losing clarity of form. Rediscovered in Rome in 1506 and soon acquired by Pope Julius II, the sculpture profoundly influenced Renaissance artists such as Michelangelo and Raphael, who studied its twisting bodies and compressed emotion. Each figure struggles in a different direction, creating a spiral of pain that invites the viewer to walk around the group and discover new angles of tension. The work became a benchmark for heroic suffering in Western art and remains a defining image of classical tragedy made stone.",
    image: "images/sculpture/laocoon-and-his-sons.png",
    modelGlb: "images/sculpture/models/laocoon_and_his_sons.glb",
  },
  {
    id: "bird-in-space",
    title: "Bird in Space",
    artist: "Constantin Brâncuși",
    year: "1923",
    medium: "Bronze, polished",
    size: "121.9 cm",
    museum: "Museum of Modern Art, New York",
    location: "Museum of Modern Art, New York",
    museumUrl: "https://www.moma.org/collection/works/79406",
    storyTitle: "Bird in Space",
    story:
      "Bird in Space belongs to a series in which Constantin Brâncuși stripped the idea of flight down to an elongated, polished form that suggests ascent rather than illustrating a bird's anatomy. Working between Paris and his studio in Romania, Brâncuși treated sculpture as a pursuit of essence: material, curve, and light become the subject itself. When a version of the work was shipped to the United States in 1926, customs officials classified it as metal rather than art, leading to a famous court case that helped establish modern sculpture as a legitimate artistic category. The gleaming bronze surface catches ambient light like a continuous motion, while the tapering silhouette evokes speed, spirituality, and release from gravity. It stands at the threshold between figurative tradition and modern abstraction, asking the viewer to feel flight before naming it.",
    image: "images/sculpture/Bird_in_Space.png",
    modelGlb: "images/sculpture/models/bird in space.glb",
  },
  {
    id: "david",
    title: "David",
    artist: "Michelangelo",
    year: "1501-1504",
    medium: "Marble",
    size: "517 cm",
    museum: "Galleria dell'Accademia, Florence",
    location: "Galleria dell'Accademia, Florence",
    museumUrl: "https://www.galleriaaccademiafirenze.it/gallery/michelangelos-david/",
    storyTitle: "David",
    story:
      "Michelangelo's David was carved from a massive block of marble that had been abandoned by earlier sculptors, yet he transformed it into one of the defining images of the Renaissance. The figure represents the biblical hero not after victory, but in the tense moment before action, with weight shifted in contrapposto and gaze fixed on Goliath. Commissioned by the Florentine republic, the sculpture came to symbolize civic courage, youthful strength, and humanist confidence in reason and beauty. Michelangelo's anatomical knowledge is visible in every tendon and vein, while the oversized head and hands concentrate psychological intensity in the act of decision. Originally placed outdoors in Piazza della Signoria and later moved to the Accademia for protection, David remains a monument to how a single figure can embody an entire cultural ideal.",
    image: "images/sculpture/David.png",
    sketchfabId: "49ed72e2e9624733af79b96ee02a42c6",
    iframeTitle: "David",
  },
  {
    id: "le-baiser",
    title: "Le Baiser",
    artist: "Auguste Rodin",
    year: "1882",
    medium: "Marble",
    size: "181.5 cm",
    museum: "Musée Rodin, Paris",
    location: "Musée Rodin, Paris",
    museumUrl: "https://www.musee-rodin.fr/en/oeuvres/le-baiser",
    storyTitle: "Le Baiser",
    story:
      "Le Baiser shows two lovers locked in an embrace that is at once tender and monumental, their bodies merging into a single flowing mass of marble. Rodin originally conceived the subject as part of The Gates of Hell, illustrating the tragic lovers Paolo and Francesca from Dante's Inferno, before developing it as an independent work celebrating desire rather than punishment. The sculpture's rough base and polished figures typify Rodin's method: unfinished stone anchors the eternal moment in material reality. Rodin broke with academic smoothness by leaving tool marks and asymmetry, giving the kiss a sense of living breath rather than cold perfection. First exhibited in 1898, Le Baiser became one of the most admired images of modern love in sculpture and helped establish Rodin as the central figure of nineteenth-century French art.",
    image: "images/sculpture/Le Baiser.png",
    sketchfabId: "b824901747d54a97951317e30072c905",
    iframeTitle: "Le Baiser - Auguste Rodin",
  },
  {
    id: "pieta",
    title: "Pietà",
    artist: "Michelangelo",
    year: "1498-1499",
    medium: "Marble",
    size: "174 cm",
    museum: "St. Peter's Basilica, Vatican City",
    location: "St. Peter's Basilica, Vatican City",
    museumUrl: "https://www.vatican.va/content/vatican/en.html",
    storyTitle: "Pietà",
    story:
      "Michelangelo's Pietà presents the Virgin Mary holding the body of Christ after the Crucifixion, a subject long familiar in Christian art but here renewed with startling intimacy and technical mastery. Carved when the artist was only in his early twenties, the work was commissioned for a chapel in St. Peter's Basilica and immediately admired for its balance of grief and composure. Mary appears youthful and serene, while Christ's body rests across her lap with natural weight and finely observed anatomy, as if death were only a pause in flesh. Michelangelo signed the sash across Mary's chest—the only work he ever signed—after hearing the sculpture attributed to another master. Protected today behind glass in the basilica, the Pietà remains one of the most moving statements on sorrow, devotion, and the human cost of sacrifice in Western sculpture.",
    image: "images/sculpture/pieta.png",
    sketchfabId: "f4fc939f61b241899c33af670001a9e6",
    iframeTitle: "Pietá",
  },
  {
    id: "winged-victory",
    title: "Winged Victory of Samothrace",
    artist: "Unknown Hellenistic artist",
    year: "c. 190 BCE",
    medium: "Parian marble",
    size: "244 cm (height)",
    museum: "Louvre Museum",
    location: "Louvre Museum, Paris",
    museumUrl: "https://www.louvre.fr/en/explore/the-palace/rooms/011-winged-victory-of-samothrace",
    storyTitle: "Winged Victory of Samothrace",
    story:
      "The Winged Victory of Samothrace depicts Nike, the Greek goddess of victory, alighting on the prow of a ship with wings spread and drapery whipped by wind. Created in the Hellenistic period and discovered in 1863 on the island of Samothrace, the sculpture was originally part of a sanctuary overlooking the sea, where it celebrated a naval triumph. The missing head and arms do not diminish the work's power: the body thrusts forward against invisible force, turning stone into motion and breath. Its placement at the top of the Daru staircase in the Louvre makes the figure seem to descend toward the viewer like a force of history itself. As one of the most admired masterpieces of ancient art, the Nike embodies Hellenistic drama, spatial illusion, and the idea that victory is never static—it arrives, lands, and passes.",
    image: "images/sculpture/Winged Victory of Samothrace.png",
    modelGlb: "images/sculpture/models/winged Victory of Samothrace.glb",
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

  if (item.sketchfabId || item.modelGlb) {
    article.setAttribute("data-sculpture-3d", "true");
    if (item.modelGlb) article.dataset.modelGlb = item.modelGlb;
    if (item.sketchfabId) {
      article.dataset.sketchfabEmbed = sketchfabEmbedSrc(item.sketchfabId);
      article.dataset.iframeTitle = item.iframeTitle || item.title;
    }
    if (item.medium) article.dataset.medium = item.medium;
    if (item.size) article.dataset.size = item.size;
    if (item.museum) article.dataset.collection = item.museum;
    if (item.location) article.dataset.location = item.location;
    if (item.museumUrl) article.dataset.museumUrl = item.museumUrl;
    if (item.storyTitle) article.dataset.storyTitle = item.storyTitle;
    if (item.story) article.dataset.story = item.story;
  }

  article.innerHTML = `
    <figure class="sculpture-figure">
      <img class="sculpture-image" src="${window.GalleryImages?.thumbSrc(item.image) ?? item.image}" alt="${item.title}" loading="lazy" decoding="async" draggable="false" />
    </figure>
    <div class="sculpture-label">
      <h2>${item.title}</h2>
      <p>${item.artist} · ${item.year}</p>
    </div>
  `;

  if (item.sketchfabId || item.modelGlb) {
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
