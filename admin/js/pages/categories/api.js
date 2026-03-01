import { adminService } from "../../services/AdminService.js";
import { showToast } from "../../utils/toast.js";
import { showLoading, hideLoading } from "../../utils/loading.js";
import { pager } from "./pagination.js";

export async function loadCategories() {
  showLoading();
  try {
    const res = await adminService.categories.getAllCategories();
    if (res.result && res.data) {
      pager.setData(res.data);
    } else {
      showToast("Error!", res.message || "Failed to load categories.", "error");
    }
  } catch (err) {
    showToast("Error!", "Failed to load categories.", "error");
  } finally {
    hideLoading();
  }
}

export async function saveCategory(editingId, name) {
  const res = editingId
    ? await adminService.categories.updateCategory(editingId, name)
    : await adminService.categories.createCategory(name);

  if (res.result) {
    showToast(
      "Success!",
      editingId
        ? "Category updated successfully!"
        : "Category created successfully!",
      "success"
    );
    await loadCategories();
    return true;
  } else {
    showToast("Error!", res.message || "Failed to save category.", "error");
    return false;
  }
}

export async function deleteCategory(deletingId) {
  const res = await adminService.categories.deleteCategory(deletingId);
  if (res.result) {
    showToast("Deleted!", "Category deleted successfully!", "info");
    await loadCategories();
    return true;
  } else {
    showToast("Error!", res.message || "Failed to delete category.", "error");
    return false;
  }
}
