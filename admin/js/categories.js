// filepath: /Users/rashad/Desktop/course-final-project/admin/js/categories.js
import { adminService } from "./services/AdminService.js";
import { Pagination } from "./util/pagination.js";
import { showToast } from "./util/toast.js";
import "./util/active.js";
import { showLoading, hideLoading } from "./util/loading.js";

// ── Auth guard ───────────────────────────────────────────────────────────────
if (!adminService.isAuthenticated()) {
  window.location.href = "/admin/html/login.html";
}

// ── DOM refs ─────────────────────────────────────────────────────────────────
const categoryModal = document.getElementById("categoryModal");
const deleteModal = document.getElementById("deleteModal");
const categoryForm = document.getElementById("categoryForm");
const modalInput = document.querySelector(".modalInput");
const modalTitle = document.getElementById("modalTitle");
const tableBody = document.getElementById("categoryTableBody");
const createBtn = document.querySelector(".create-btn");
const confirmDeleteBtn = document.getElementById("confirmDelete");

// ── State ────────────────────────────────────────────────────────────────────
let editingId = null; // ID being edited (null = create mode)
let deletingId = null; // ID to delete

// ── Pagination ────────────────────────────────────────────────────────────────
let paginationEl = document.getElementById("categories-pagination");
if (!paginationEl) {
  paginationEl = document.createElement("div");
  paginationEl.id = "categories-pagination";
  paginationEl.className = "pagination-container";
  document.querySelector(".section")?.after(paginationEl);
}

const pager = new Pagination({
  containerSelector: paginationEl,
  itemsPerPage: 8,
  onPageChange: (pageItems) => renderTable(pageItems),
});

// ── Helpers ──────────────────────────────────────────────────────────────────
function showPlaceholder(msg) {
  tableBody.innerHTML = `
    <tr>
      <td colspan="3" style="text-align:center;padding:24px;color:#aaa;">${msg}</td>
    </tr>`;
  paginationEl.innerHTML = "";
}

function escapeHtml(text) {
  const d = document.createElement("div");
  d.textContent = text;
  return d.innerHTML;
}

// ── Render table ─────────────────────────────────────────────────────────────
function renderTable(categories) {
  if (!categories.length) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="3" style="text-align:center;padding:24px;color:#aaa;">No categories found.</td>
      </tr>`;
    return;
  }
  tableBody.innerHTML = categories
    .map(
      (cat) => `
      <tr data-id="${cat.id}">
        <th scope="row">${cat.id}</th>
        <td>${escapeHtml(cat.name)}</td>
        <td class="operation">
          <i class="fa-solid fa-pen-to-square edit-btn"   style="cursor:pointer;" title="Edit"></i>
          <i class="fa-solid fa-trash            delete-btn" style="cursor:pointer;" title="Delete"></i>
        </td>
      </tr>`
    )
    .join("");
}

// ── Load all categories from API ──────────────────────────────────────────────
async function loadCategories() {
  showPlaceholder("Loading…");
  showLoading();
  try {
    const res = await adminService.categories.getAllCategories();
    if (res.result && res.data) {
      pager.setData(res.data); // hands off to pagination → triggers renderTable
    } else {
      showPlaceholder(res.message || "Failed to load categories.");
    }
  } catch (err) {
    showToast("Error!", "Failed to load categories.", "error");
    showPlaceholder("Error loading categories.");
  } finally {
    hideLoading();
  }
}

// ── Open CREATE modal ─────────────────────────────────────────────────────────
createBtn.addEventListener("click", () => {
  editingId = null;
  modalTitle.innerText = "Create New Category";
  modalInput.value = "";
  categoryModal.showModal();
});

// ── Table delegation → EDIT / DELETE ─────────────────────────────────────────
tableBody.addEventListener("click", (e) => {
  const row = e.target.closest("tr");
  if (!row) return;
  const id = parseInt(row.dataset.id);

  if (e.target.classList.contains("edit-btn")) {
    editingId = id;
    modalTitle.innerText = "Edit Category";
    modalInput.value = row.cells[1].innerText;
    categoryModal.showModal();
  }

  if (e.target.classList.contains("delete-btn")) {
    deletingId = id;
    deleteModal.showModal();
  }
});

// ── Form submit → POST (create) or PUT (update) ───────────────────────────────
categoryForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = modalInput.value.trim();
  if (!name) return;

  const btn = categoryForm.querySelector(".modalSubmit");
  btn.disabled = true;
  btn.textContent = "Saving…";

  try {
    const res = editingId
      ? await adminService.categories.updateCategory(editingId, name)
      : await adminService.categories.createCategory(name);

    if (res.result) {
      categoryModal.close();
      const successMsg = editingId ? "Category updated successfully!" : "Category created successfully!";
      showToast("Success!", successMsg, "success");
      await loadCategories();
    } else {
      showToast("Error!", res.message || "Failed to save category.", "error");
    }
  } catch (err) {
    showToast("Error!", err.message || "Failed to save category.", "error");
  } finally {
    btn.disabled = false;
    btn.textContent = "Save Changes";
  }
});

// ── Confirm DELETE ────────────────────────────────────────────────────────────
confirmDeleteBtn.addEventListener("click", async () => {
  if (!deletingId) return;

  confirmDeleteBtn.disabled = true;
  confirmDeleteBtn.textContent = "Deleting…";

  try {
    const res = await adminService.categories.deleteCategory(deletingId);
    if (res.result) {
      deleteModal.close();
      deletingId = null;
      showToast("Success!", "Category deleted successfully!", "success");
      await loadCategories();
    } else {
      showToast("Error!", res.message || "Failed to delete category.", "error");
    }
  } catch (err) {
    showToast("Error!", err.message || "Failed to delete category.", "error");
  } finally {
    confirmDeleteBtn.disabled = false;
    confirmDeleteBtn.textContent = "Yes, Delete";
  }
});

// ── Logout ────────────────────────────────────────────────────────────────────
document.querySelector(".logout-text")?.addEventListener("click", () => {
  adminService.auth.logout();
});

// ── Init ──────────────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", loadCategories);
