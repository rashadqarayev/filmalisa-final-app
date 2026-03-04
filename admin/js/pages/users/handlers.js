import { adminService } from "../../services/AdminService.js";
import { state } from "./state.js";

export function registerHandlers() {
<<<<<<< HEAD
  document.querySelector(".logout-text")?.addEventListener("click", () => {
=======
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

  document.getElementById("logoutBtn")?.addEventListener("click", () => {
>>>>>>> 63462a41f20df5b03d41b50485453cdaae4650c5
    adminService.auth.logout();
  });
}

window.showUserDetailModal = (userId) => {
  const user = state.allUsers?.find((u) => u.id === userId);
  if (!user) return;
  document.getElementById("userDetailName").textContent = user.full_name ?? "—";
  document.getElementById("userDetailEmail").textContent = user.email ?? "—";
  const img = document.getElementById("userDetailImg");
  if (img) {
    const src = user.img_url && !user.img_url.startsWith("null") && user.img_url !== "null"
      ? user.img_url
      : "../../assets/images/adminman.svg";
    img.src = src;
    img.alt = user.full_name ?? "user";
  }
  document.getElementById("userDetailModal").showModal();
};
