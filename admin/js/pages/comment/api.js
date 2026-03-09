import { adminService } from "../../services/AdminService.js";
import { showToast } from "../../utils/toast.js";
import { showLoading, hideLoading } from "../../utils/loading.js";
import { pager } from "./pagination.js";
import { state } from "./state.js";

export async function loadComments() {
  showLoading();
  try {
    const res = await adminService.comments.getAllComments();
    if (res.result && res.data) {
      state.allComments = res.data;
      pager.setData(res.data);
    } else {
      showToast("Error!", res.message || "Failed to load comments.", "error");
    }
  } catch (err) {
    showToast("Error!", "An error occurred while loading comments.", "error");
  } finally {
    hideLoading();
  }
}

export async function deleteComment(movieId, commentId) {
  const res = await adminService.comments.deleteComment(movieId, commentId);
  if (res.result) {
    showToast("Deleted!", "Comment deleted successfully!", "info");
    await loadComments();
    return true;
  } else {
    showToast("Error!", res.message || "Failed to delete comment.", "error");
    return false;
  }
}
