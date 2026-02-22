import { adminService } from "./services/AdminService.js";
import { Pagination } from "./util/pagination.js";

// ── Auth guard ───────────────────────────────────────────────────────────────
if (!adminService.isAuthenticated()) {
  window.location.href = "/admin/html/login.html";
}

// ── DOM refs ─────────────────────────────────────────────────────────────────
const actorModal = document.getElementById("actorModal");
const deleteModal = document.getElementById("deleteModal");
const actorForm = document.getElementById("actorForm");
const modalTitle = document.getElementById("modalTitle");
const createBtn = document.querySelector(".create-btn");
const tableBody = document.getElementById("actorsTableBody");
const confirmDeleteBtn = document.getElementById("confirmDelete");

const actorIdInput = document.getElementById("actorId");
const actorNameInput = document.getElementById("actorName");
const actorSurnameInput = document.getElementById("actorSurname");
const actorImageInput = document.getElementById("actorImage");

const DEFAULT_IMG = "../../assets/images/adminman.svg";

// ── State ────────────────────────────────────────────────────────────────────
let editingId = null;
let deletingId = null;

// ── Pagination ────────────────────────────────────────────────────────────────
let paginationEl = document.getElementById("actors-pagination");
if (!paginationEl) {
  paginationEl = document.createElement("div");
  paginationEl.id = "actors-pagination";
  paginationEl.className = "pagination-container";
  document.querySelector(".section")?.after(paginationEl);
}

const pager = new Pagination({
  containerSelector: paginationEl,
  itemsPerPage: 8,
  onPageChange: (pageItems) => renderTable(pageItems),
});

// ── Helpers ───────────────────────────────────────────────────────────────────
function showPlaceholder(msg) {
  tableBody.innerHTML = `
    <tr>
      <td colspan="5" style="text-align:center;padding:24px;color:#aaa;">${msg}</td>
    </tr>`;
  paginationEl.innerHTML = "";
}

function escapeHtml(text) {
  const d = document.createElement("div");
  d.textContent = text ?? "";
  return d.innerHTML;
}

function safeImg(url) {
  if (!url || url === "null") return DEFAULT_IMG;
  return url;
}

// ── Render ────────────────────────────────────────────────────────────────────
function renderTable(actors) {
  if (!actors.length) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align:center;padding:24px;color:#aaa;">No actors found.</td>
      </tr>`;
    return;
  }

  tableBody.innerHTML = actors
    .map(
      (a) => `
      <tr class="table-row" data-id="${a.id}">
        <th scope="row">${a.id}</th>
        <td>${escapeHtml(a.name)}</td>
        <td>${escapeHtml(a.surname)}</td>
        <td>
          <img
            src="${safeImg(a.img_url)}"
            alt="${escapeHtml(a.name)}"
            class="actor-image"
            onerror="this.onerror=null;this.src='${DEFAULT_IMG}';"
          />
        </td>
        <td class="operation">
          <i class="fa-solid fa-pen-to-square edit-btn" style="cursor:pointer;" title="Edit"></i>
          <i class="fa-solid fa-trash delete-btn"       style="cursor:pointer;" title="Delete"></i>
        </td>
      </tr>`
    )
    .join("");
}

// ── Load actors ───────────────────────────────────────────────────────────────
async function loadActors() {
  showPlaceholder("Loading…");
  try {
    const res = await adminService.actors.getAllActors();
    if (res.result && res.data) {
      pager.setData(res.data);
    } else {
      showPlaceholder(res.message || "Failed to load actors.");
    }
  } catch (err) {
    console.error(err);
    showPlaceholder("Error loading actors.");
  }
}

// ── Open CREATE modal ─────────────────────────────────────────────────────────
createBtn.addEventListener("click", () => {
  editingId = null;
  modalTitle.innerText = "Create New Actor";
  actorForm.reset();
  actorIdInput.value = "";
  actorModal.showModal();
});

// ── Table click → EDIT or DELETE ─────────────────────────────────────────────
tableBody.addEventListener("click", (e) => {
  const row = e.target.closest("tr");
  if (!row) return;
  const id = parseInt(row.dataset.id);

  if (e.target.classList.contains("edit-btn")) {
    editingId = id;
    modalTitle.innerText = "Edit Actor";
    actorNameInput.value = row.cells[1].innerText;
    actorSurnameInput.value = row.cells[2].innerText;
    actorImageInput.value = row.querySelector("img")?.src ?? "";
    actorIdInput.value = id;
    actorModal.showModal();
  }

  if (e.target.classList.contains("delete-btn")) {
    deletingId = id;
    deleteModal.showModal();
  }
});

// ── Form submit → POST (create) or PUT (update) ───────────────────────────────
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
    const res = editingId
      ? await adminService.actors.updateActor(editingId, {
          name,
          surname,
          img_url,
        })
      : await adminService.actors.createActor({ name, surname, img_url });

    if (res.result) {
      actorModal.close();
      await loadActors();
    } else {
      alert(res.message || "Failed to save actor.");
    }
  } catch (err) {
    console.error(err);
    alert(err.message || "Failed to save actor.");
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Save Changes";
  }
});

// ── Confirm DELETE ────────────────────────────────────────────────────────────
confirmDeleteBtn.addEventListener("click", async () => {
  if (!deletingId) return;

  confirmDeleteBtn.disabled = true;
  confirmDeleteBtn.textContent = "Deleting…";

  try {
    const res = await adminService.actors.deleteActor(deletingId);
    if (res.result) {
      deleteModal.close();
      deletingId = null;
      await loadActors();
    } else {
      alert(res.message || "Failed to delete actor.");
    }
  } catch (err) {
    console.error(err);
    alert(err.message || "Failed to delete actor.");
  } finally {
    confirmDeleteBtn.disabled = false;
    confirmDeleteBtn.textContent = "Bəli, Sil";
  }
});

// ── Logout ────────────────────────────────────────────────────────────────────
document.querySelector(".logout-text")?.addEventListener("click", () => {
  if (confirm("Are you sure you want to logout?")) {
    adminService.auth.logout();
  }
});

// ── Init ──────────────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", loadActors);
