import { showToast } from "../../utils/toast.js";
import { state } from "./state.js";
import { pager } from "./pagination.js";
import {
  openCreateModal,
  showDeleteModal,
  fillEditForm,
  resetForm,
  getFormData,
  editModal,
  editModalElement,
  deleteModal,
  movieCoverInput,
  previewImg,
} from "./modal.js";
import { saveMovie, deleteMovie, fetchMovieById } from "./api.js";
import { adminService } from "../../services/AdminService.js";
import { initCmsEvents } from "./actorSelect.js";

export function registerHandlers() {
  const DEFAULT_PREVIEW_IMG = "../../assets/images/film-image-default.png";
  const previewHint = document.getElementById("previewHint");

  const handleCoverPreview = () => {
    if (!previewImg) return;
    const url = movieCoverInput?.value?.trim();

    if (!url) {
      previewImg.src = DEFAULT_PREVIEW_IMG;
      previewImg.classList.remove("has-image");
      if (previewHint) previewHint.textContent = "Enter a URL above to see the cover";
      return;
    }

    previewImg.onerror = () => {
      previewImg.src = DEFAULT_PREVIEW_IMG;
      previewImg.classList.remove("has-image");
      if (previewHint) previewHint.textContent = "⚠️ Could not load image";
    };

    previewImg.onload = () => {
      if (previewImg.src !== DEFAULT_PREVIEW_IMG) {
        previewImg.classList.add("has-image");
        if (previewHint) previewHint.textContent = "✓ Cover loaded";
      }
    };

    previewImg.src = url;
  };

  initCmsEvents(() => state.allActors);

  document
    .querySelector(".create-btn")
    ?.addEventListener("click", openCreateModal);

  const saveMovieBtn = document.getElementById("saveMovieBtn");
  if (saveMovieBtn) {
    saveMovieBtn.addEventListener("click", async () => {
      if (saveMovieBtn.disabled) return;
      const data = getFormData();
      if (!data.title) {
        showToast("Error!", "Please enter movie title", "error");
        return;
      }
      if (!data.category) {
        showToast("Error!", "Please select a category", "error");
        return;
      }
      saveMovieBtn.disabled = true;
      const saved = await saveMovie(state.currentEditId, data);
      saveMovieBtn.disabled = false;
      if (saved) {
        editModal.hide();
        resetForm();
        state.currentEditId = null;
      }
    });
  }

  const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
  if (confirmDeleteBtn) {
    // Remove previous event listeners to avoid duplicates
    confirmDeleteBtn.onclick = null;
    // Use a variable to store the movieId to delete
    let movieIdToDelete = null;
    // Patch showDeleteModal to set movieIdToDelete
    window.showDeleteModal = (movieId, movieTitle) => {
      movieIdToDelete = parseInt(movieId);
      state.currentEditId = parseInt(movieId);
      const deleteItemName = document.getElementById("deleteItemName");
      if (deleteItemName) deleteItemName.textContent = movieTitle;
      deleteModal.showModal();
    };
    confirmDeleteBtn.addEventListener("click", async () => {
      if (!movieIdToDelete) return;
      const deleted = await deleteMovie(movieIdToDelete);
      if (deleted) {
        state.currentEditId = null;
        movieIdToDelete = null;
        deleteModal.close();
      }
    });
  }

  if (movieCoverInput) {
    movieCoverInput.addEventListener("input", handleCoverPreview);
    movieCoverInput.addEventListener("change", handleCoverPreview);
    movieCoverInput.addEventListener("paste", () => {
      requestAnimationFrame(handleCoverPreview);
    });
  }

  if (editModalElement) {
    editModalElement.addEventListener("hidden.bs.modal", () => {
      if (!state.currentEditId) resetForm();
    });
  }

  document.getElementById("logoutBtn")?.addEventListener("click", () => {
    adminService.auth.logout();
  });

  // Expose for inline onclick in table rows (required in ES modules)
  window.editMovie = async (movieId) => {
    state.currentEditId = movieId;
    try {
      const movie = await fetchMovieById(movieId);
      fillEditForm(movie);
      editModal.show();
    } catch {
      adminService.showError("Failed to load movie details");
    }
  };

  window.toggleActionMenu = (btn, e) => {
    e.stopPropagation();
    const menu = btn.nextElementSibling;
    const isOpen = menu.classList.contains("open");
    closeAllActionMenus();
    if (!isOpen) {
      menu.classList.add("open");
      const btnRect = btn.getBoundingClientRect();
      const menuWidth = menu.offsetWidth;
      const menuHeight = menu.offsetHeight;
      // place to the left of the button, vertically centered
      let top = btnRect.top + btnRect.height / 2 - menuHeight / 2;
      const left = btnRect.left - menuWidth - 4;
      // clamp so menu stays inside viewport
      const padding = 8;
      top = Math.max(padding, Math.min(top, window.innerHeight - menuHeight - padding));
      menu.style.top = top + "px";
      menu.style.left = left + "px";
    }
  };

  window.closeAllActionMenus = () => {
    document.querySelectorAll(".action-menu.open").forEach((m) => m.classList.remove("open"));
  };

  document.addEventListener("click", window.closeAllActionMenus);

  window.showOverviewModal = (movieId) => {
    const movie = state.allMovies.find((m) => m.id === movieId);
    if (!movie) return;
    document.getElementById("overviewModalTitle").textContent = movie.title || "—";
    document.getElementById("overviewModalText").textContent = movie.overview || "—";
    document.getElementById("overviewModalCategory").textContent = movie.category?.name || "N/A";
    document.getElementById("overviewModalImdb").textContent = movie.imdb || "N/A";
    const cover = document.getElementById("overviewModalCover");
    cover.src = movie.cover_url?.startsWith("http") ? movie.cover_url : "../../assets/images/table-inner-img.svg";
    cover.onerror = () => { cover.src = "../../assets/images/table-inner-img.svg"; };
    document.getElementById("overviewModal").showModal();
  };

  // Search — fires only on Enter
  const searchInput = document.getElementById("movie-search");
  if (searchInput) {
    searchInput.addEventListener("keydown", (e) => {
      if (e.key !== "Enter") return;
      const q = e.target.value.toLowerCase().trim();
      state.filteredMovies = q
        ? state.allMovies.filter(
            (m) =>
              m.title?.toLowerCase().includes(q) ||
              m.overview?.toLowerCase().includes(q) ||
              m.category?.name?.toLowerCase().includes(q) ||
              m.imdb?.toLowerCase().includes(q)
          )
        : [...state.allMovies];
      pager.setData(state.filteredMovies);
    });
  }
}