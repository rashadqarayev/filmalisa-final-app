import { adminService } from "./services/AdminService.js";
import { Pagination } from "./util/pagination.js";

// ── Auth guard ───────────────────────────────────────────────────────────────
if (!adminService.isAuthenticated()) {
  window.location.href = "/admin/html/login.html";
}

// ── DOM refs ─────────────────────────────────────────────────────────────────
const tableBody = document.getElementById("usersTableBody");
const DEFAULT_IMG = "../../assets/images/adminman.svg";

// ── Pagination ────────────────────────────────────────────────────────────────
// Container is injected right after the <table> section
let paginationEl = document.getElementById("users-pagination");
if (!paginationEl) {
  paginationEl = document.createElement("div");
  paginationEl.id = "users-pagination";
  paginationEl.className = "pagination-container";
  document.querySelector(".section")?.after(paginationEl);
}

const pager = new Pagination({
  containerSelector: paginationEl,
  itemsPerPage: 8,
  onPageChange: (pageItems) => renderUsers(pageItems),
});

// ── Helpers ──────────────────────────────────────────────────────────────────
function showPlaceholder(msg) {
  tableBody.innerHTML = `
    <tr>
      <td colspan="5" style="text-align:center;padding:24px;color:#aaa;">${msg}</td>
    </tr>`;
  paginationEl.innerHTML = "";
}

function safeImg(url) {
  if (!url || url === "null" || url.startsWith("null")) return DEFAULT_IMG;
  return url;
}

function escapeHtml(text) {
  const d = document.createElement("div");
  d.textContent = text ?? "";
  return d.innerHTML;
}

// ── Render ────────────────────────────────────────────────────────────────────
function renderUsers(users) {
  if (!users.length) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align:center;padding:24px;color:#aaa;">No users found.</td>
      </tr>`;
    return;
  }

  tableBody.innerHTML = users
    .map(
      (user) => `
      <tr class="table-row" data-id="${user.id}">
        <th scope="row">${user.id}</th>
        <td>${escapeHtml(user.full_name)}</td>
        <td>${escapeHtml(user.email)}</td>
        <td>
          <img
            src="${safeImg(user.img_url)}"
            alt="user"
            onerror="this.onerror=null;this.src='${DEFAULT_IMG}';"
            style="width:45px;height:45px;border-radius:50%;object-fit:cover;"
          />
        </td>
        <td class="operation">
          <i class="fa-solid fa-trash delete-btn" style="cursor:pointer;color:red;" title="Delete"></i>
        </td>
      </tr>`
    )
    .join("");
}

// ── Load all users ────────────────────────────────────────────────────────────
async function loadUsers() {
  showPlaceholder("Loading…");
  try {
    const res = await adminService.users.getAllUsers();
    if (res.result && res.data) {
      pager.setData(res.data); // hands off to pagination → triggers renderUsers
    } else {
      showPlaceholder(res.message || "Failed to load users.");
    }
  } catch (err) {
    console.error(err);
    showPlaceholder("Error loading users.");
  }
}

// ── Delete (table click delegation) ──────────────────────────────────────────
tableBody.addEventListener("click", async (e) => {
  if (!e.target.classList.contains("delete-btn")) return;

  const row = e.target.closest("tr");
  const id = parseInt(row?.dataset.id);
  if (!id) return;

  if (!confirm("Are you sure you want to delete this user?")) return;

  e.target.classList.replace("fa-trash", "fa-spinner");
  e.target.style.animation = "spin 1s linear infinite";

  try {
    const res = await adminService.users.deleteUser(id);
    if (res.result) {
      await loadUsers();
    } else {
      alert(res.message || "Failed to delete user.");
      e.target.classList.replace("fa-spinner", "fa-trash");
      e.target.style.animation = "";
    }
  } catch (err) {
    console.error(err);
    alert(err.message || "Failed to delete user.");
    e.target.classList.replace("fa-spinner", "fa-trash");
    e.target.style.animation = "";
  }
});

// ── Logout ────────────────────────────────────────────────────────────────────
document.querySelector(".logout-text")?.addEventListener("click", () => {
  if (confirm("Are you sure you want to logout?")) {
    adminService.auth.logout();
  }
});

// ── Init ──────────────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", loadUsers);
