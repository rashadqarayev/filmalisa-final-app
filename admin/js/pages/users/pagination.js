import { Pagination } from "../../utils/pagination.js";
import { renderUsers } from "./table.js";

let paginationEl = document.getElementById("users-pagination");
if (!paginationEl) {
  paginationEl = document.createElement("div");
  paginationEl.id = "users-pagination";
  paginationEl.className = "pagination-container";
  document.querySelector(".section")?.after(paginationEl);
}

export const pager = new Pagination({
  containerSelector: paginationEl,
  itemsPerPage: 8,
  onPageChange: (pageItems) => renderUsers(pageItems),
});
