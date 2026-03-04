import { escapeHtml } from "../../utils/helpers.js";
import { DEFAULT_IMG } from "../../consts.js";

const tableBody = document.getElementById("usersTableBody");

function safeImg(url) {
  if (!url || url === "null" || url.startsWith("null")) return DEFAULT_IMG;
  return url;
}

export function renderUsers(users) {
  if (!users.length) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align:center;padding:24px;color:#aaa;">No users found.</td>
      </tr>`;
    return;
  }

  tableBody.innerHTML = users
    .map(
      (user) => `
      <tr class="table-row" data-id="${user.id}">
        <th scope="row">${user.id}</th>
        <td>${escapeHtml(user.full_name)}</td>
        <td>${escapeHtml(user.email)}</td>
        <td>
          <img
            src="${safeImg(user.img_url)}"
            alt="user"
            onerror="this.onerror=null;this.src='${DEFAULT_IMG}';"
            style="width:45px;height:45px;border-radius:50%;object-fit:cover;"
          />
        </td>
        <td class="operation">
          <i class="fa-regular fa-eye op-view" onclick="showUserDetailModal(${user.id})" title="View"></i>
        </td>
      </tr>`
    )
    .join("");
}
