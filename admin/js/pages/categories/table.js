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
          <button class="action-trigger" onclick="toggleActionMenu(this, event)">
            <i class="fa-solid fa-ellipsis-vertical"></i>
          </button>
          <div class="action-menu">
            <button class="action-menu-item" onclick="openEditModalFromTable(this)">
              <i class="fa-solid fa-pen-to-square"></i>
              <span>Edit</span>
            </button>
            <button class="action-menu-item action-menu-item--delete" onclick="openDeleteModalFromTable(this)">
              <i class="fa-solid fa-trash"></i>
              <span>Delete</span>
            </button>
          </div>
        </td>
      </tr>`
    )
    .join("");
}
