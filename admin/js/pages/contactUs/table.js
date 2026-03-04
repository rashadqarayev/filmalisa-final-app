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
          <i class="fa-solid fa-trash op-delete"
             title="Delete"
             data-id="${c.id}"
             data-name="${escapeHtml(c.full_name ?? c.name ?? String(c.id))}">
          </i>
          <i class="fa-regular fa-eye op-view"
             onclick="showContactModal(${c.id})"
             title="View Message"></i>
        </td>
      </tr>`
    )
    .join("");
}
