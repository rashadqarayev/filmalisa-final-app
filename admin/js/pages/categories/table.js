import { escapeHtml } from "../../utils/helpers.js";

const tableBody = document.getElementById("categoryTableBody");

export function renderTable(categories) {
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
          <i class="fa-solid fa-pen-to-square edit-btn" style="cursor:pointer;" title="Edit"></i>
          <i class="fa-solid fa-trash delete-btn" style="cursor:pointer;" title="Delete"></i>
        </td>
      </tr>`
    )
    .join("");
}
