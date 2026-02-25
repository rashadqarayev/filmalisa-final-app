import { state } from "./state.js";
import {
  openCreateModal,
  openEditModal,
  closeCategoryModal,
  modalInput,
} from "./modal.js";
import { saveCategory, deleteCategory } from "./api.js";
import { adminService } from "../../services/AdminService.js";

const tableBody = document.getElementById("categoryTableBody");
const categoryForm = document.getElementById("categoryForm");
const createBtn = document.querySelector(".create-btn");
const confirmDeleteBtn = document.getElementById("confirmDelete");
const deleteModal = document.getElementById("deleteModal");

export function registerHandlers() {
  createBtn.addEventListener("click", openCreateModal);

  tableBody.addEventListener("click", (e) => {
    const row = e.target.closest("tr");
    if (!row) return;

    if (e.target.classList.contains("edit-btn")) {
      openEditModal(row);
    }

    if (e.target.classList.contains("delete-btn")) {
      state.deletingId = parseInt(row.dataset.id);
      deleteModal.showModal();
    }
  });

  categoryForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = modalInput.value.trim();
    if (!name) return;

    const btn = categoryForm.querySelector(".modalSubmit");
    btn.disabled = true;
    btn.textContent = "Saving…";

    try {
      const saved = await saveCategory(state.editingId, name);
      if (saved) closeCategoryModal();
    } finally {
      btn.disabled = false;
      btn.textContent = "Save Changes";
    }
  });

  confirmDeleteBtn.addEventListener("click", async () => {
    if (!state.deletingId) return;

    confirmDeleteBtn.disabled = true;
    confirmDeleteBtn.textContent = "Deleting…";

    try {
      const deleted = await deleteCategory(state.deletingId);
      if (deleted) {
        deleteModal.close();
        state.deletingId = null;
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
