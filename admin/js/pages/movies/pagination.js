import { Pagination } from "../../utils/pagination.js";
import { renderMoviesTable } from "./table.js";

let paginationEl = document.getElementById("movies-pagination");
if (!paginationEl) {
  paginationEl = document.createElement("div");
  paginationEl.id = "movies-pagination";
  paginationEl.className = "pagination-container";
  document.querySelector(".section")?.after(paginationEl);
}

export const pager = new Pagination({
  containerSelector: paginationEl,
  itemsPerPage: 6,
  onPageChange: (pageItems) => renderMoviesTable(pageItems),
});
