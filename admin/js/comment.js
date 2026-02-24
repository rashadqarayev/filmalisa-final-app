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
const commentTableBody = document.querySelector(".comment-table-body");
const modalEl = document.getElementById("deleteModal");
const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
const modal = modalEl;

// ── State ────────────────────────────────────────────────────────────────────
let currentMovieId = null;
let currentId = null;

// ── Pagination ────────────────────────────────────────────────────────────────
let paginationEl = document.getElementById("comments-pagination");
if (!paginationEl) {
  paginationEl = document.createElement("div");
  paginationEl.id = "comments-pagination";
  paginationEl.className = "pagination-container";
  document.querySelector(".section")?.after(paginationEl);
}

const pager = new Pagination({
  containerSelector: paginationEl,
  itemsPerPage: 7,
  onPageChange: (pageItems) => renderComments(pageItems),
});

// ── Helpers ───────────────────────────────────────────────────────────────────
function showPlaceholder(msg) {
  commentTableBody.innerHTML = `
    <tr>
      <td colspan="6" style="text-align:center;padding:24px;color:#aaa;">${msg}</td>
    </tr>`;
  paginationEl.innerHTML = "";
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function escapeHtml(text) {
  const d = document.createElement("div");
  d.textContent = text ?? "";
  return d.innerHTML;
}

// ── Render ────────────────────────────────────────────────────────────────────
function renderComments(comments) {
  if (!comments.length) {
    commentTableBody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align:center;padding:24px;color:#aaa;">No comments found.</td>
      </tr>`;
    return;
  }

  commentTableBody.innerHTML = comments
    .map(
      (item) => `
      <tr class="table-row">
        <td class="comment-user">
          <span>${escapeHtml(item.user?.full_name ?? "Unknown")}</span>
        </td>
        <td class="comment-text">${escapeHtml(item.comment)}</td>
        <td>${escapeHtml(item.movie?.title ?? "—")}</td>
        <td>${formatDate(item.created_at)}</td>
        <td class="movie-image">
          <img src="${item.movie?.cover_url ?? ""}" alt="movie image" />
        </td>
        <td class="operation">
          <i
            class="fa-solid fa-trash"
            style="cursor:pointer;color:red;"
            title="Delete"
            onclick="showDeleteModal(${item.movie?.id}, ${item.id})"
          ></i>
        </td>
      </tr>`
    )
    .join("");
}

// ── Load comments ─────────────────────────────────────────────────────────────
async function loadComments() {
  showPlaceholder("Loading…");
  showLoading();
  try {
    const res = await adminService.comments.getAllComments();
    if (res.result && res.data) {
      pager.setData(res.data);
    } else {
      showToast("Error!", res.message || "Failed to load comments.", "error");
      showPlaceholder(res.message || "Failed to load comments.");
    }
  } catch (err) {
    showToast("Error!", "An error occurred while loading comments.", "error");
    showPlaceholder("Error loading comments.");
  } finally {
    hideLoading();
  }
}

// ── Delete modal ──────────────────────────────────────────────────────────────
window.showDeleteModal = function (movieId, commentId) {
  currentMovieId = movieId;
  currentId = commentId;
  modal.showModal();
};

confirmDeleteBtn.addEventListener("click", async () => {
  if (!currentMovieId || !currentId) return;

  confirmDeleteBtn.disabled = true;
  confirmDeleteBtn.textContent = "Deleting…";

  try {
    const res = await adminService.comments.deleteComment(
      currentMovieId,
      currentId
    );
    if (res.result) {
      modal.close();
      currentMovieId = null;
      currentId = null;
      showToast("Success!", "Comment deleted successfully!", "success");
      await loadComments();
    } else {
      showToast("Error!", res.message || "Failed to delete comment.", "error");
    }
  } catch (err) {
    showToast("Error!", err.message || "Failed to delete comment.", "error");
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
document.addEventListener("DOMContentLoaded", loadComments);
