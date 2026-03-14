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

    window.openEditModalFromTable = function(btn) {
      const row = btn.closest("tr");
      if (row) openEditModal(row);
    }

    window.openDeleteModalFromTable = function(btn) {
      const row = btn.closest("tr");
      if (row) {
        state.deletingId = parseInt(row.dataset.id);
        deleteModal.showModal();
      }
    }
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

window.showActorDetailModal = (actorId) => {
  const actor = state.allActors?.find((a) => a.id === actorId);
  if (!actor) return;
  document.getElementById("actorDetailName").textContent = actor.name ?? "—";
  document.getElementById("actorDetailSurname").textContent = actor.surname ?? "—";
  const img = document.getElementById("actorDetailImg");
  if (img) {
    img.src = actor.img_url && actor.img_url.startsWith("http")
      ? actor.img_url
      : "../../assets/images/table-inner-img.svg";
    img.alt = actor.name ?? "actor";
  }
  document.getElementById("actorDetailModal").showModal();
};
