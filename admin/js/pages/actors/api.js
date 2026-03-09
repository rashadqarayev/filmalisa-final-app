import { adminService } from "../../services/AdminService.js";
import { showToast } from "../../utils/toast.js";
import { showLoading, hideLoading } from "../../utils/loading.js";
import { pager } from "./pagination.js";
import { state } from "./state.js";

export async function loadActors() {
  showLoading();
  try {
    const res = await adminService.actors.getAllActors();
    if (res.result && res.data) {
      state.allActors = res.data;
      pager.setData(res.data);
    } else {
      showToast("Error!", res.message || "Failed to load actors.", "error");
    }
  } catch (err) {
    showToast("Error!", "An error occurred while loading actors.", "error");
  } finally {
    hideLoading();
  }
}

export async function saveActor(editingId, { name, surname, img_url }) {
  const res = editingId
    ? await adminService.actors.updateActor(editingId, {
        name,
        surname,
        img_url,
      })
    : await adminService.actors.createActor({ name, surname, img_url });

  if (res.result) {
    showToast(
      "Success!",
      editingId ? "Actor updated successfully!" : "Actor created successfully!",
      "success"
    );
    await loadActors();
    return true;
  } else {
    showToast("Error!", res.message || "Failed to save actor.", "error");
    return false;
  }
}

export async function deleteActor(deletingId) {
  const res = await adminService.actors.deleteActor(deletingId);
  if (res.result) {
    showToast("Deleted!", "Actor deleted successfully!", "info");
    await loadActors();
    return true;
  } else {
    showToast("Error!", res.message || "Failed to delete actor.", "error");
    return false;
  }
}
