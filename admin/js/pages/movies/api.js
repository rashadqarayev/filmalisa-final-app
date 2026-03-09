import { adminService } from "../../services/AdminService.js";
import { showToast } from "../../utils/toast.js";
import { showLoading, hideLoading } from "../../utils/loading.js";
import { state } from "./state.js";
import { pager } from "./pagination.js";
import { renderCategoryOptions } from "./table.js";
import { cmsBuildList, cmsRenderTags } from "./actorSelect.js";

export async function loadMovies() {
  showLoading();
  try {
    const res = await adminService.movies.getAllMovies();
    if (res.result && res.data) {
      state.allMovies = res.data;
      state.filteredMovies = [...res.data];
      pager.setData(state.filteredMovies);
    } else {
      showToast("Error!", res.message || "Failed to load movies.", "error");
    }
  } catch {
    showToast("Error!", "Failed to load movies.", "error");
  } finally {
    hideLoading();
  }
}

export async function loadCategories() {
  try {
    const res = await adminService.categories.getAllCategories();
    if (res.result && res.data) {
      state.allCategories = res.data;
      renderCategoryOptions(res.data);
    }
  } catch {
    /* silently ignore */
  }
}

export async function loadActors() {
  try {
    const res = await adminService.actors.getAllActors();
    if (res.result && res.data) {
      state.allActors = res.data;
      cmsBuildList(res.data);
      cmsRenderTags(res.data);
    }
  } catch {
    /* silently ignore */
  }
}

export async function saveMovie(currentEditId, movieData) {
  const res = currentEditId
    ? await adminService.movies.updateMovie(currentEditId, movieData)
    : await adminService.movies.createMovie(movieData);

  if (res.result) {
    adminService.showSuccess(
      currentEditId
        ? "Movie updated successfully!"
        : "Movie created successfully!"
    );
    await loadMovies();
    return true;
  } else {
    adminService.showError(res.message || "Failed to save movie");
    return false;
  }
}

export async function deleteMovie(movieId) {
  const res = await adminService.movies.deleteMovie(movieId);
  if (res.result) {
    adminService.showInfo("Movie deleted successfully!");
    await loadMovies();
    return true;
  } else {
    adminService.showError(res.message || "Failed to delete movie");
    return false;
  }
}

export async function fetchMovieById(movieId) {
  const res = await adminService.movies.getMovieById(movieId);
  if (res.result && res.data) return res.data;
  throw new Error(res.message || "Failed to load movie details");
}
