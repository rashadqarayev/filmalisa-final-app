import { state } from "./state.js";
import {
  openCreateModal,
  openEditModal,
  closeActorModal,
  actorForm,
  actorNameInput,
  actorSurnameInput,
  actorImageInput,
} from "./modal.js";
import { saveActor, deleteActor } from "./api.js";
import { adminService } from "../../services/AdminService.js";

const tableBody = document.getElementById("actorsTableBody");
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

  actorForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = actorNameInput.value.trim();
    const surname = actorSurnameInput.value.trim();
    const img_url = actorImageInput.value.trim();
    if (!name || !surname) return;

    const submitBtn = actorForm.querySelector(".modalSubmit");
    submitBtn.disabled = true;
    submitBtn.textContent = "Saving…";

    try {
      const saved = await saveActor(state.editingId, {
        name,
        surname,
        img_url,
      });
      if (saved) closeActorModal();
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Save Changes";
    }
  });

  confirmDeleteBtn.addEventListener("click", async () => {
    if (!state.deletingId) return;

    confirmDeleteBtn.disabled = true;
    confirmDeleteBtn.textContent = "Deleting…";

    try {
      const deleted = await deleteActor(state.deletingId);
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
}
