import { adminService } from "../../services/AdminService.js";
import { setActiveNavItem, initStorageListener } from "../../utils/active.js";
import { showToast } from "../../utils/toast.js";
import { showLoading, hideLoading } from "../../utils/loading.js";
import { animateCounter } from "../../utils/animation.js";

// Set active navigation
setActiveNavItem(".dashboard");

// Check authentication
if (!adminService.isAuthenticated()) {
  window.location.href = "/admin/html/login.html";
}

// Get DOM elements
const favoriteCountElement = document.getElementById("dashboard-favorite-count");
const usersCountElement = document.getElementById("dashboard-users-count");
const moviesCountElement = document.getElementById("dashboard-movies-count");
const commentsCountElement = document.getElementById("dashboard-comments-count");
const categoriesCountElement = document.getElementById("dashboard-categories-count");
const actorsCountElement = document.getElementById("dashboard-actors-count");
const contactsCountElement = document.getElementById("dashboard-contacts-count");

// Load dashboard statistics
async function loadDashboardStats() {
  showLoading();
  try {
    const { data, result } = await adminService.dashboard.getStatistics();

    if (result && data) {
      const stats = data;

      // Animate all counters
      animateCounter(favoriteCountElement, stats.favorites);
      animateCounter(usersCountElement, stats.users);
      animateCounter(moviesCountElement, stats.movies);
      animateCounter(commentsCountElement, stats.comments);
      animateCounter(categoriesCountElement, stats.categories);
      animateCounter(actorsCountElement, stats.actors);
      animateCounter(contactsCountElement, stats.contacts);
    }
  } catch (error) {
    showToast("Error!", "Failed to load dashboard statistics.", "error");
  } finally {
    hideLoading();
  }
}

// Load data when page is ready
document.addEventListener("DOMContentLoaded", () => {
  initStorageListener();
  loadDashboardStats();

  document.getElementById("favoriteCardBtn")?.addEventListener("click", () => {
    const count = document.getElementById("dashboard-favorite-count")?.textContent?.trim() || "—";
    document.getElementById("favModalCount").textContent = count;
    document.getElementById("favoritesModal").showModal();
  });
});

// Logout handler
document.getElementById("logoutBtn")?.addEventListener("click", () => {
  adminService.auth.logout();
});
