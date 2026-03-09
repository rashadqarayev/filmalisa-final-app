import { DEFAULT_IMG } from "../../consts.js";
import { escapeHtml } from "../../utils/helpers.js";

function safeImg(url) {
  return url && url.startsWith("http") ? url : DEFAULT_IMG;
}

export function renderTable(tableBody, items) {
  if (!items.length) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align:center;padding:24px;color:#aaa;">No actors found.</td>
      </tr>`;
    return;
  }

  tableBody.innerHTML = items
    .map(
      (actor) => `
      <tr class="table-row" data-id="${actor.id}">
        <th scope="row">${actor.id}</th>
        <td>${escapeHtml(actor.name)}</td>
        <td>${escapeHtml(actor.surname)}</td>
        <td>
          <img
            src="${safeImg(actor.img_url)}"
            alt="${escapeHtml(actor.name)}"
            class="actor-image"
            onerror="this.onerror=null;this.src='${DEFAULT_IMG}';"
          />
        </td>
        <td class="operation">
          <button class="action-trigger" onclick="toggleActionMenu(this, event)">
            <i class="fa-solid fa-ellipsis-vertical"></i>
          </button>
          <div class="action-menu">
            <button class="action-menu-item" onclick="showActorDetailModal(${actor.id}); closeAllActionMenus()">
              <i class="fa-regular fa-eye"></i>
              <span>View</span>
            </button>
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
