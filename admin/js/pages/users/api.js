import { adminService } from "../../services/AdminService.js";
import { showToast } from "../../utils/toast.js";
import { showLoading, hideLoading } from "../../utils/loading.js";
import { pager } from "./pagination.js";
import { state } from "./state.js";

export async function loadUsers() {
  showLoading();
  try {
    const res = await adminService.users.getAllUsers();
    if (res.result && res.data) {
      state.allUsers = res.data;
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


