import { Pagination } from "../../utils/pagination.js";
import { renderTable } from "./table.js";

const tableBody = document.getElementById("actorsTableBody");

let paginationEl = document.getElementById("actors-pagination");
if (!paginationEl) {
  paginationEl = document.createElement("div");
  paginationEl.id = "actors-pagination";
  paginationEl.className = "pagination-container";
  document.querySelector(".section")?.after(paginationEl);
}

export const pager = new Pagination({
  containerSelector: paginationEl,
  itemsPerPage: 8,
  onPageChange: (pageItems) => renderTable(tableBody, pageItems),
});
