import { showToast } from "../../utils/toast.js";
import { updatePreviewImage } from "../../utils/helpers.js";
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
} from "./modal.js";
import { saveMovie, deleteMovie, fetchMovieById } from "./api.js";
import { adminService } from "../../services/AdminService.js";
import { initCmsEvents } from "./actorSelect.js";

export function registerHandlers() {
  initCmsEvents(() => state.allActors);

  document
    .querySelector(".create-btn")
    ?.addEventListener("click", openCreateModal);

  const saveMovieBtn = document.getElementById("saveMovieBtn");
  if (saveMovieBtn) {
    saveMovieBtn.addEventListener("click", async () => {
      const data = getFormData();
      if (!data.title) {
        showToast("Error!", "Please enter movie title", "error");
        return;
      }
      if (!data.category) {
        showToast("Error!", "Please select a category", "error");
        return;
      }
      const saved = await saveMovie(state.currentEditId, data);
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
    movieCoverInput.addEventListener("blur", updatePreviewImage);
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

  // Search
  const searchInput = document.getElementById("movie-search");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
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
