import { state } from "./state.js";
import { deleteContact } from "./api.js";
import { adminService } from "../../services/AdminService.js";

const tableBody = document.getElementById("contactsTableBody");
const deleteModal = document.getElementById("deleteModal");
const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
const deleteItemName = document.getElementById("deleteItemName");

export function registerHandlers() {
      // Action-menu'dan silme için event listener
      window.addEventListener('deleteContact', (e) => {
        const { id, name } = e.detail;
        state.deletingId = id;
        if (deleteItemName) deleteItemName.textContent = name;
        deleteModal.showModal();
      });
    // Action menu açma/kapama fonksiyonları (movies/comments ile aynı)
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
  tableBody.addEventListener("click", (e) => {
    const btn = e.target.closest(".fa-trash");
    if (!btn) return;
    state.deletingId = parseInt(btn.dataset.id);
    if (deleteItemName) deleteItemName.textContent = btn.dataset.name;
    deleteModal.showModal();
  });

  confirmDeleteBtn.addEventListener("click", async () => {
    if (!state.deletingId) return;

    confirmDeleteBtn.disabled = true;
    confirmDeleteBtn.textContent = "Deleting…";

    try {
      const deleted = await deleteContact(state.deletingId);
      if (deleted) {
        deleteModal.close();
        state.deletingId = null;
      }
    } finally {
      confirmDeleteBtn.disabled = false;
      confirmDeleteBtn.textContent = "Yes, Delete";
    }
  });

  document.getElementById("logoutBtn")?.addEventListener("click", () => {
    adminService.auth.logout();
  });

  window.showContactModal = (id) => {
    const item = state.allContacts?.find((c) => c.id === id);
    if (!item) return;
    document.getElementById("contactModalName").textContent = item.full_name ?? item.name ?? "—";
    document.getElementById("contactModalEmail").textContent = item.email ?? "—";
    document.getElementById("contactModalComment").textContent = item.reason || "—";
    document.getElementById("contactModal").showModal();
  };
}
