import { state } from "./state.js";

const categoryModal = document.getElementById("categoryModal");
const modalTitle = document.getElementById("modalTitle");
const modalInput = document.querySelector(".modalInput");

export function openCreateModal() {
  state.editingId = null;
  modalTitle.innerText = "Create New Category";
  modalInput.value = "";
  categoryModal.showModal();
  categoryModal.focus();
}

export function openEditModal(row) {
  state.editingId = parseInt(row.dataset.id);
  modalTitle.innerText = "Edit Category";
  modalInput.value = row.cells[1].innerText;
  categoryModal.showModal();
  categoryModal.focus();
}

export function closeCategoryModal() {
  categoryModal.close();
}

export { modalInput };
