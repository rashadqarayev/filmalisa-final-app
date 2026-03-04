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

  const handleCoverPreview = () => {
    if (!previewImg) return;
    const url = movieCoverInput?.value?.trim();

    if (!url) {
      previewImg.src = DEFAULT_PREVIEW_IMG;
      return;
    }

    previewImg.onerror = () => {
      previewImg.src = DEFAULT_PREVIEW_IMG;
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
    confirmDeleteBtn.addEventListener("click", async () => {
      if (!state.currentEditId) return;
      const deleted = await deleteMovie(state.currentEditId);
      if (deleted) {
        state.currentEditId = null;
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

  document.querySelector(".logout-text")?.addEventListener("click", () => {
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

  window.showDeleteModal = showDeleteModal;

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
