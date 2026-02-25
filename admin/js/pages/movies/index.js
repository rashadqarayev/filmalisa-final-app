import { adminService } from "../../services/AdminService.js";
import { initStorageListener } from "../../utils/active.js";
import { showLoading, hideLoading } from "../../utils/loading.js";
import { loadMovies, loadCategories, loadActors } from "./api.js";
import { registerHandlers } from "./handlers.js";

if (!adminService.isAuthenticated()) {
  window.location.href = "/admin/html/login.html";
}

registerHandlers();

document.addEventListener("DOMContentLoaded", async () => {
  initStorageListener();
  showLoading();
  try {
    await Promise.all([loadMovies(), loadCategories(), loadActors()]);
  } finally {
    hideLoading();
  }
});
