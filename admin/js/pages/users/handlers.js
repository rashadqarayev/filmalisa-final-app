import { adminService } from "../../services/AdminService.js";
import { state } from "./state.js";

export function registerHandlers() {
  document.querySelector(".logout-text")?.addEventListener("click", () => {
    adminService.auth.logout();
  });

  document.getElementById("logoutBtn")?.addEventListener("click", () => {
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
