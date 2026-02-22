import { adminService } from "./services/AdminService.js";
import { Pagination } from "./util/pagination.js";

// ── Auth guard ───────────────────────────────────────────────────────────────
if (!adminService.isAuthenticated()) {
  window.location.href = "/admin/html/login.html";
}

// ── DOM refs ─────────────────────────────────────────────────────────────────
const tableBody = document.getElementById("contactsTableBody");
const deleteModalEl = document.getElementById("deleteModal");
const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
const deleteItemName = document.getElementById("deleteItemName");
const deleteModal = new bootstrap.Modal(deleteModalEl);

// ── State ─────────────────────────────────────────────────────────────────────
let deletingId = null;

// ── Pagination ────────────────────────────────────────────────────────────────
let paginationEl = document.getElementById("contacts-pagination");
if (!paginationEl) {
  paginationEl = document.createElement("div");
  paginationEl.id = "contacts-pagination";
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

// ── Render ────────────────────────────────────────────────────────────────────
function renderTable(contacts) {
  if (!contacts.length) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align:center;padding:24px;color:#aaa;">No contacts found.</td>
      </tr>`;
    return;
  }

  tableBody.innerHTML = contacts
    .map(
      (c) => `
      <tr class="table-row" data-id="${c.id}">
        <th scope="row">${c.id}</th>
        <td>${escapeHtml(c.full_name ?? c.name ?? "—")}</td>
        <td>${escapeHtml(c.email ?? "—")}</td>
        <td>${escapeHtml(c.reason ?? c.reason ?? "—")}</td>
        <td class="operation">
          <i class="fa-solid fa-trash"
             style="cursor:pointer;color:red;"
             title="Delete"
             data-id="${c.id}"
             data-name="${escapeHtml(c.full_name ?? c.name ?? String(c.id))}">
          </i>
        </td>
      </tr>`
    )
    .join("");
}

// ── Load contacts ─────────────────────────────────────────────────────────────
async function loadContacts() {
  showPlaceholder("Loading…");
  try {
    const res = await adminService.contacts.getAllContacts();
    if (res.result && res.data) {
      pager.setData(res.data);
    } else {
      showPlaceholder(res.message || "Failed to load contacts.");
    }
  } catch (err) {
    console.error(err);
    showPlaceholder("Error loading contacts.");
  }
}

// ── Delete via table click delegation ────────────────────────────────────────
tableBody.addEventListener("click", (e) => {
  const btn = e.target.closest(".fa-trash");
  if (!btn) return;

  deletingId = parseInt(btn.dataset.id);
  if (deleteItemName) deleteItemName.textContent = btn.dataset.name;
  deleteModal.show();
});

// Keep the global function for any inline onclick still in HTML
window.showDeleteModal = (id, name = "") => {
  deletingId = id;
  if (deleteItemName) deleteItemName.textContent = name;
  deleteModal.show();
};

confirmDeleteBtn.addEventListener("click", async () => {
  if (!deletingId) return;

  confirmDeleteBtn.disabled = true;
  confirmDeleteBtn.textContent = "Deleting…";

  try {
    const res = await adminService.contacts.deleteContact(deletingId);
    if (res.result) {
      deleteModal.hide();
      deletingId = null;
      await loadContacts();
    } else {
      alert(res.message || "Failed to delete contact.");
    }
  } catch (err) {
    console.error(err);
    alert(err.message || "Failed to delete contact.");
  } finally {
    confirmDeleteBtn.disabled = false;
    confirmDeleteBtn.textContent = "Delete";
  }
});

// ── Logout ────────────────────────────────────────────────────────────────────
document.querySelector(".logout-text")?.addEventListener("click", () => {
  if (confirm("Are you sure you want to logout?")) {
    adminService.auth.logout();
  }
});

// ── Init ──────────────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", loadContacts);
