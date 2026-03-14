import { state } from "./state.js";
import { deleteComment } from "./api.js";
import { adminService } from "../../services/AdminService.js";

const deleteModal = document.getElementById("deleteModal");
const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");

export function registerHandlers() {
    // Action menu açma/kapama fonksiyonları (movies/categories ile aynı)
    window.toggleActionMenu = (btn, e) => {
      e.stopPropagation();
      const menu = btn.nextElementSibling;
      const isOpen = menu.classList.contains("open");
      window.closeAllActionMenus();
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
  // Expose to global scope for inline onclick in table rows
  window.showDeleteModal = (movieId, commentId) => {
    state.currentMovieId = movieId;
    state.currentId = commentId;
    deleteModal.showModal();
  };

  window.showCommentModal = (commentId) => {
    const item = state.allComments?.find((c) => c.id === commentId);
    if (!item) return;
    document.getElementById("commentModalUser").textContent = item.user?.full_name ?? "Unknown";
    document.getElementById("commentModalMovie").textContent = item.movie?.title ?? "—";
    document.getElementById("commentModalComment").textContent = item.comment || "—";
    document.getElementById("commentModal").showModal();
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

  document.getElementById("logoutBtn")?.addEventListener("click", () => {
    adminService.auth.logout();
  });
}
