// filepath: /Users/rashad/Desktop/course-final-project/admin/js/categories.js
import { adminService } from "./services/AdminService.js";
import { Pagination } from "./util/pagination.js";
import { showToast } from "./util/toast.js";

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
  try {
    const res = await adminService.categories.getAllCategories();
    if (res.result && res.data) {
      pager.setData(res.data); // hands off to pagination → triggers renderTable
    } else {
      showPlaceholder(res.message || "Failed to load categories.");
    }
  } catch (err) {
    console.error(err);
    showToast("Error!", "Failed to load categories.", "error");
    showPlaceholder("Error loading categories.");
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
    showToast("Warning!", "Are you sure you want to delete this category?", "error");
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
  console.log(editingId ? `Updating category ${editingId}...` : "Creating new category...");
  showToast("Saving...", "Please wait while we save the category.", "success");

  try {
    const res = editingId
      ? await adminService.categories.updateCategory(editingId, name)
      : await adminService.categories.createCategory(name);

    if (res.result) {
      categoryModal.close();
      const successMsg = editingId ? "Kateqoriya uğurla güncəlləndi!" : "Kateqoriya uğurla yaradıldı!";
      showToast("Uğurlu!", successMsg, "success");
      await loadCategories();
    } else {
      showToast("Xəta!", res.message || "Kateqoriya saxlanmadı.", "error");
    }
  } catch (err) {
    console.error(err);
    showToast("Xəta!", err.message || "Kateqoriya saxlanmadı.", "error");
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
  showToast("Siliniyor...", "Kateqoriya siliniyor, lütfen bekleyiniz.", "success");

  try {
    const res = await adminService.categories.deleteCategory(deletingId);
    if (res.result) {
      deleteModal.close();
      deletingId = null;
      showToast("Uğurlu!", "Kateqoriya uğurla silindi!", "success");
      await loadCategories();
    } else {
      showToast("Xəta!", res.message || "Kateqoriya silinərkən problem yarandı.", "error");
    }
  } catch (err) {
    console.error(err);
    showToast("Xəta!", err.message || "Kateqoriya silinərkən problem yarandı.", "error");
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
document.addEventListener("DOMContentLoaded", loadCategories);
