import { state } from "./state.js";

const actorModal = document.getElementById("actorModal");
const modalTitle = document.getElementById("modalTitle");
const actorForm = document.getElementById("actorForm");
const actorIdInput = document.getElementById("actorId");
const actorNameInput = document.getElementById("actorName");
const actorSurnameInput = document.getElementById("actorSurname");
const actorImageInput = document.getElementById("actorImage");

export function openCreateModal() {
  state.editingId = null;
  modalTitle.innerText = "Create New Actor";
  actorForm.reset();
  actorIdInput.value = "";
  actorModal.showModal();
  actorModal.focus();
}

export function openEditModal(row) {
  const id = parseInt(row.dataset.id);
  state.editingId = id;
  modalTitle.innerText = "Edit Actor";
  actorNameInput.value = row.cells[1].innerText;
  actorSurnameInput.value = row.cells[2].innerText;
  actorImageInput.value = row.querySelector("img")?.src ?? "";
  actorIdInput.value = id;
  actorModal.showModal();
  actorModal.focus();
}

export function closeActorModal() {
  actorModal.close();
}

export { actorForm, actorNameInput, actorSurnameInput, actorImageInput };
