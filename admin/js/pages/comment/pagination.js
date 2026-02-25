import { Pagination } from "../../utils/pagination.js";
import { renderComments } from "./table.js";

let paginationEl = document.getElementById("comments-pagination");
if (!paginationEl) {
  paginationEl = document.createElement("div");
  paginationEl.id = "comments-pagination";
  paginationEl.className = "pagination-container";
  document.querySelector(".section")?.after(paginationEl);
}

export const pager = new Pagination({
  containerSelector: paginationEl,
  itemsPerPage: 7,
  onPageChange: (pageItems) => renderComments(pageItems),
});
