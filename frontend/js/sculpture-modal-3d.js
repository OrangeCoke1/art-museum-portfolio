const MODAL_ANIM_MS = 380;

const modal = document.getElementById("artModal");
const modalPanel = modal?.querySelector(".modal-panel");
const modalViewer = document.getElementById("modalViewer");
const modalTitle = document.getElementById("modalTitle");
const modalSubtitle = document.getElementById("modalSubtitle");
const modalMeta = modal?.querySelector(".modal-meta");
const modalInfoCard = document.getElementById("modalInfoCard");
const modalFlipToBack = document.getElementById("modalFlipToBack");
const modalFlipToFront = document.getElementById("modalFlipToFront");
const modalStoryTitle = document.getElementById("modalStoryTitle");
const modalStoryText = document.getElementById("modalStoryText");
const modalLink = document.getElementById("modalLink");

let modalCloseTimer = null;
let lastFocusedBeforeModal = null;
let currentSculptureCard = null;

function fillModal(card) {
  if (modalTitle) modalTitle.textContent = card.dataset.title || "";
  if (modalSubtitle) {
    modalSubtitle.textContent = [card.dataset.artist, card.dataset.year].filter(Boolean).join(", ");
  }
  renderModalMeta(card.dataset);
  renderModalStory(card.dataset);
  if (modalLink) {
    const museumUrl = card.dataset.museumUrl;
    modalLink.hidden = !museumUrl;
    modalLink.href = museumUrl || "#";
  }
  modalInfoCard?.classList.remove("is-flipped");
}

function renderModalStory(artwork) {
  const lang = window.GalleryI18n?.getLanguage?.() || "en";
  if (lang === "en") {
    if (modalStoryTitle) modalStoryTitle.textContent = artwork.storyTitle || artwork.title || "";
    if (modalStoryText) {
      modalStoryText.textContent =
        artwork.story ||
        "This sculpture is shown here as a 3D study object inside the Gallery Walk modal.";
    }
    return;
  }

  if (modalStoryTitle) {
    modalStoryTitle.textContent = window.GalleryI18n.format("storyInContext", {
      title: artwork.title || "",
      artist: artwork.artist || "",
    });
  }
  if (modalStoryText) {
    modalStoryText.textContent = window.GalleryI18n.format("sculptureStoryGeneric", {
      title: artwork.title || "",
      artist: artwork.artist || "",
    });
  }
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
    [t("location"), artwork.location || artwork.collection],
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

function escapeAttr(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;");
}

function buildToolbarHtml() {
  return `
    <div class="sculpture-3d-toolbar" role="toolbar" aria-label="3D viewer tools">
      <button type="button" class="modal-tool" id="sculpture3dReset" aria-label="Reset view" title="Reset view">
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <path fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" d="M5 12a7 7 0 1 0 2-4.9M5 5v4h4" />
        </svg>
      </button>
      <button type="button" class="modal-tool" id="sculpture3dFullscreen" aria-label="Fullscreen" title="Fullscreen">
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <path fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
        </svg>
      </button>
      <button type="button" class="modal-tool modal-tool--close" data-close-modal aria-label="Close" title="Close">
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <path fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>
    </div>
  `;
}

function buildSketchfabViewerHtml(card) {
  const embedSrc = card?.dataset.sketchfabEmbed || "";
  const iframeTitle = escapeAttr(card?.dataset.iframeTitle || card?.dataset.title || "Sculpture");
  return `
    <div class="sculpture-3d-viewer" id="sculpture3dViewer">
      <div class="sketchfab-embed-wrapper">
        <iframe
          title="${iframeTitle}"
          frameborder="0"
          allowfullscreen
          mozallowfullscreen="true"
          webkitallowfullscreen="true"
          allow="autoplay; fullscreen; xr-spatial-tracking"
          xr-spatial-tracking
          execution-while-out-of-viewport
          execution-while-not-rendered
          web-share
          src="${embedSrc}"
        ></iframe>
      </div>
    </div>
  `;
}

function buildGlbViewerHtml(card) {
  const modelSrc = encodeURI(card?.dataset.modelGlb || "");
  const modelTitle = escapeAttr(card?.dataset.title || "Sculpture");
  return `
    <div class="sculpture-3d-viewer sculpture-3d-viewer--glb" id="sculpture3dViewer">
      <model-viewer
        class="sculpture-glb-viewer"
        src="${modelSrc}"
        alt="${modelTitle}"
        camera-controls
        touch-action="pan-y"
        shadow-intensity="0"
        environment-image="neutral"
        exposure="1.05"
        interaction-prompt="none"
        disable-tap
        auto-rotate="false"
        tone-mapping="commerce"
      ></model-viewer>
    </div>
  `;
}

function resetGlbViewer(modelViewer) {
  if (!modelViewer?.__initialView) return;
  const { orbit, target, fieldOfView } = modelViewer.__initialView;
  modelViewer.cameraOrbit = orbit;
  modelViewer.cameraTarget = target;
  if (fieldOfView) modelViewer.fieldOfView = fieldOfView;
}

function initGlbViewer(modelViewer) {
  if (!modelViewer) return;

  const saveInitialView = () => {
    const orbit = modelViewer.getCameraOrbit();
    const target = modelViewer.getCameraTarget();
    modelViewer.__initialView = {
      orbit: `${orbit.theta}rad ${orbit.phi}rad ${orbit.radius}m`,
      target: `${target.x}m ${target.y}m ${target.z}m`,
      fieldOfView: `${modelViewer.getFieldOfView()}rad`,
    };
  };

  if (modelViewer.loaded) saveInitialView();
  else modelViewer.addEventListener("load", saveInitialView, { once: true });
}

function bindViewerControls(viewerType) {
  modalViewer
    .querySelector("[data-close-modal]")
    ?.addEventListener("click", closeSculptureModal);

  modalViewer.querySelector("#sculpture3dReset")?.addEventListener("click", () => {
    if (viewerType === "glb") {
      resetGlbViewer(modalViewer.querySelector("model-viewer"));
      return;
    }
    const iframe = modalViewer.querySelector(".sketchfab-embed-wrapper iframe");
    if (!iframe) return;
    iframe.src = iframe.src;
  });

  modalViewer.querySelector("#sculpture3dFullscreen")?.addEventListener("click", async () => {
    if (!modalPanel) return;
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await modalPanel.requestFullscreen();
    } catch (_) {
      /* noop */
    }
  });
}

function buildViewer(card) {
  const t = window.GalleryI18n?.t || ((key) => key);
  const viewerType = card?.dataset.modelGlb ? "glb" : "sketchfab";
  const viewerHtml = viewerType === "glb" ? buildGlbViewerHtml(card) : buildSketchfabViewerHtml(card);

  modalViewer.innerHTML = `
    ${buildToolbarHtml()}
    ${viewerHtml}
    <p class="modal-hint">
      ${t("hintSculpture")}
    </p>
  `;

  bindViewerControls(viewerType);

  if (viewerType === "glb") {
    customElements.whenDefined("model-viewer").then(() => {
      initGlbViewer(modalViewer.querySelector("model-viewer"));
    });
  }
}

function openSculptureModal(card) {
  if (!modal || !modalViewer) return;
  currentSculptureCard = card;

  lastFocusedBeforeModal = document.activeElement;
  if (modalCloseTimer) {
    window.clearTimeout(modalCloseTimer);
    modalCloseTimer = null;
  }

  modal.hidden = false;
  document.body.classList.add("modal-open");
  modal.classList.remove("is-open");

  fillModal(card);
  buildViewer(card);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => modal.classList.add("is-open"));
  });
}

window.openSculpture3dModal = openSculptureModal;

function closeSculptureModal() {
  if (!modal || modal.hidden) return;

  if (document.fullscreenElement === modalPanel) {
    document.exitFullscreen().catch(() => {});
  }

  modal.classList.remove("is-open");
  document.body.classList.remove("modal-open");

  if (modalCloseTimer) window.clearTimeout(modalCloseTimer);
  modalCloseTimer = window.setTimeout(() => {
    modal.hidden = true;
    modalViewer.innerHTML = "";
    currentSculptureCard = null;
    modalCloseTimer = null;
  }, MODAL_ANIM_MS);

  if (lastFocusedBeforeModal?.focus) lastFocusedBeforeModal.focus();
}

function initFlipCard() {
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
}

function initModalEvents() {
  modal?.querySelector(".modal-backdrop")?.addEventListener("click", closeSculptureModal);

  modal?.addEventListener(
    "wheel",
    (e) => {
      if (modal.hidden) return;
      e.stopPropagation();
    },
    { passive: true },
  );

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal && !modal.hidden) closeSculptureModal();
  });

  window.addEventListener("gallery-languagechange", () => {
    if (modal?.hidden || !currentSculptureCard) return;
    fillModal(currentSculptureCard);
    buildViewer(currentSculptureCard);
  });
}

initFlipCard();
initModalEvents();
