import { adminService } from "../../services/AdminService.js";
import { showToast } from "../../utils/toast.js";
import { showLoading, hideLoading } from "../../utils/loading.js";
import { pager } from "./pagination.js";
import { state } from "./state.js";

export async function loadContacts() {
  showLoading();
  try {
    const res = await adminService.contacts.getAllContacts();
    if (res.result && res.data) {
      state.allContacts = res.data;
      pager.setData(res.data);
    } else {
      showToast("Error!", res.message || "Failed to load contacts.", "error");
    }
  } catch (err) {
    showToast("Error!", "An error occurred while loading contacts.", "error");
  } finally {
    hideLoading();
  }
}

export async function deleteContact(deletingId) {
  const res = await adminService.contacts.deleteContact(deletingId);
  if (res.result) {
    showToast("Deleted!", "Contact deleted successfully!", "info");
    await loadContacts();
    return true;
  } else {
    showToast("Error!", res.message || "Failed to delete contact.", "error");
    return false;
  }
}
