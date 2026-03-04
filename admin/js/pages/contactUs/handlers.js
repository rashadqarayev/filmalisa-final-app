import { state } from "./state.js";
import { deleteContact } from "./api.js";
import { adminService } from "../../services/AdminService.js";

const tableBody = document.getElementById("contactsTableBody");
const deleteModal = document.getElementById("deleteModal");
const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
const deleteItemName = document.getElementById("deleteItemName");

export function registerHandlers() {
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
    document.getElementById("contactModalText").textContent = item.reason || "—";
    document.getElementById("contactModal").showModal();
  };
}
