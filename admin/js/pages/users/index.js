import { adminService } from "../../services/AdminService.js";
import "../../utils/active.js";
import { loadUsers } from "./api.js";
import { registerHandlers } from "./handlers.js";

if (!adminService.isAuthenticated()) {
  window.location.href = "/admin/html/login.html";
}

registerHandlers();

document.addEventListener("DOMContentLoaded", loadUsers);
