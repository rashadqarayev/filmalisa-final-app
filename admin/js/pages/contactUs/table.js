import { escapeHtml } from "../../utils/helpers.js";

const tableBody = document.getElementById("contactsTableBody");

export function renderTable(contacts) {
  if (!contacts.length) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align:center;padding:24px;color:#aaa;">No contacts found.</td>
      </tr>`;
    return;
  }

  tableBody.innerHTML = contacts
    .map(
      (c) => `
      <tr class="table-row" data-id="${c.id}">
        <th scope="row">${c.id}</th>
        <td>${escapeHtml(c.full_name ?? c.name ?? "—")}</td>
        <td>${escapeHtml(c.email ?? "—")}</td>
        <td class="contact-reason">
          <span style="display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escapeHtml(c.reason ?? "—")}</span>
        </td>
        <td class="operation">
          <button class="action-trigger" onclick="toggleActionMenu(this, event)">
            <i class="fa-solid fa-ellipsis-vertical"></i>
          </button>
          <div class="action-menu">
            <button class="action-menu-item" onclick="showContactModal(${c.id}); closeAllActionMenus()">
              <i class="fa-regular fa-eye"></i>
              <span>View</span>
            </button>
            <button class="action-menu-item action-menu-item--delete" onclick="window.dispatchEvent(new CustomEvent('deleteContact',{detail:{id:${c.id},name:'${escapeHtml(c.full_name ?? c.name ?? String(c.id))}'}})); closeAllActionMenus()">
              <i class="fa-solid fa-trash"></i>
              <span>Delete</span>
            </button>
          </div>
        </td>
      </tr>`
    )
    .join("");
}
