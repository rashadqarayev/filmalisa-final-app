import { state } from "./state.js";
import { deleteComment } from "./api.js";
import { adminService } from "../../services/AdminService.js";

const deleteModal = document.getElementById("deleteModal");
const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");

export function registerHandlers() {
  // Expose to global scope for inline onclick in table rows
  window.showDeleteModal = (movieId, commentId) => {
    state.currentMovieId = movieId;
    state.currentId = commentId;
    deleteModal.showModal();
  };

  confirmDeleteBtn.addEventListener("click", async () => {
    if (!state.currentMovieId || !state.currentId) return;

    confirmDeleteBtn.disabled = true;
    confirmDeleteBtn.textContent = "Deleting…";

    try {
      const deleted = await deleteComment(
        state.currentMovieId,
        state.currentId
      );
      if (deleted) {
        deleteModal.close();
        state.currentMovieId = null;
        state.currentId = null;
      }
    } finally {
      confirmDeleteBtn.disabled = false;
      confirmDeleteBtn.textContent = "Yes, Delete";
    }
  });

  document.querySelector(".logout-text")?.addEventListener("click", () => {
    adminService.auth.logout();
  });
}
