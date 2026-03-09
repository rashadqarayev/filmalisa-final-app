import { escapeHtml } from "../../utils/helpers.js";

const commentTableBody = document.querySelector(".comment-table-body");

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function renderComments(comments) {
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
        <td class="comment-text">
          <span style="display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escapeHtml(item.comment)}</span>
        </td>
        <td>${escapeHtml(item.movie?.title ?? "—")}</td>
        <td>${formatDate(item.created_at)}</td>
        <td class="movie-image">
          <img src="${item.movie?.cover_url ?? ""}" alt="movie image" />
        </td>
        <td class="operation">
          <i class="fa-solid fa-trash op-delete"
             title="Delete"
             onclick="showDeleteModal(${item.movie?.id}, ${item.id})"
          ></i>
          <i class="fa-regular fa-eye op-view"
             onclick="showCommentModal(${item.id})"
             title="View Comment"></i>
        </td>
      </tr>`
    )
    .join("");
}
