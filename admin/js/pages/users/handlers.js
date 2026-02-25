import { deleteUser } from "./api.js";
import { adminService } from "../../services/AdminService.js";

const tableBody = document.getElementById("usersTableBody");

export function registerHandlers() {
  tableBody.addEventListener("click", async (e) => {
    if (!e.target.classList.contains("delete-btn")) return;

    const row = e.target.closest("tr");
    const id = parseInt(row?.dataset.id);
    if (!id) return;

    if (!confirm("Are you sure you want to delete this user?")) return;

    e.target.classList.replace("fa-trash", "fa-spinner");
    e.target.style.animation = "spin 1s linear infinite";

    try {
      const deleted = await deleteUser(id);
      if (!deleted) {
        e.target.classList.replace("fa-spinner", "fa-trash");
        e.target.style.animation = "";
      }
    } catch (err) {
      e.target.classList.replace("fa-spinner", "fa-trash");
      e.target.style.animation = "";
    }
  });

  document.querySelector(".logout-text")?.addEventListener("click", () => {
    adminService.auth.logout();
  });
}
