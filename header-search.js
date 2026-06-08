/**
 * Header inline search — expands left from the search button with blue border.
 */
(function () {
  function initHeaderSearch({ onSearch, placeholderKey } = {}) {
    const root = document.getElementById("headerSearch");
    const toggle = document.getElementById("btnSearch");
    const input = document.getElementById("headerSearchInput");
    if (!root || !toggle || !input) return null;

    function updatePlaceholder() {
      if (!placeholderKey) return;
      const fallback = input.getAttribute("placeholder") || "";
      input.placeholder = window.GalleryI18n?.t(placeholderKey) || fallback;
    }

    function open() {
      root.classList.add("is-open");
      toggle.setAttribute("aria-expanded", "true");
      requestAnimationFrame(() => input.focus());
    }

    function close() {
      root.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      input.value = "";
    }

    function submit() {
      const query = input.value.trim();
      if (!query) return;
      if (typeof onSearch === "function") onSearch(query);
      close();
    }

    toggle.addEventListener("click", (e) => {
      e.stopPropagation();
      if (root.classList.contains("is-open")) close();
      else open();
    });

    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        submit();
      } else if (e.key === "Escape") {
        e.preventDefault();
        close();
        toggle.focus();
      }
    });

    document.addEventListener("click", (e) => {
      if (!root.classList.contains("is-open")) return;
      if (root.contains(e.target)) return;
      close();
    });

    window.addEventListener("gallery-languagechange", updatePlaceholder);
    updatePlaceholder();

    return { open, close, submit };
  }

  window.GalleryHeaderSearch = { init: initHeaderSearch };
})();
