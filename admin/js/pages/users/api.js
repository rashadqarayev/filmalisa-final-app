import { adminService } from "../../services/AdminService.js";
import { showToast } from "../../utils/toast.js";
import { showLoading, hideLoading } from "../../utils/loading.js";
import { pager } from "./pagination.js";

export async function loadUsers() {
  showLoading();
  try {
    const res = await adminService.users.getAllUsers();
    if (res.result && res.data) {
      pager.setData(res.data);
    } else {
      showToast("Error!", res.message || "Failed to load users.", "error");
    }
  } catch (err) {
    showToast("Error!", "An error occurred while loading users.", "error");
  } finally {
    hideLoading();
  }
}

export async function deleteUser(id) {
  const res = await adminService.users.deleteUser(id);
  if (res.result) {
    showToast("Deleted!", "User deleted successfully!", "info");
    await loadUsers();
    return true;
  } else {
    showToast("Error!", res.message || "Failed to delete user.", "error");
    return false;
  }
}
