import { Pagination } from "../../utils/pagination.js";
import { renderTable } from "./table.js";

let paginationEl = document.getElementById("categories-pagination");
if (!paginationEl) {
  paginationEl = document.createElement("div");
  paginationEl.id = "categories-pagination";
  paginationEl.className = "pagination-container";
  document.querySelector(".section")?.after(paginationEl);
}

export const pager = new Pagination({
  containerSelector: paginationEl,
  itemsPerPage: 8,
  onPageChange: (pageItems) => renderTable(pageItems),
});
