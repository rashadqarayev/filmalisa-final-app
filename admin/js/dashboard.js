import { adminService } from "./services/AdminService.js";
import { setActiveNavItem, initStorageListener } from "./util/active.js";
import { showToast } from "./util/toast.js";
import { showLoading, hideLoading } from "./util/loading.js";

// Check authentication
if (!adminService.isAuthenticated()) {
  window.location.href = "/admin/html/login.html";
}

// Get DOM elements
const favoriteCountElement = document.getElementById(
  "dashboard-favorite-count"
);
const usersCountElement = document.getElementById("dashboard-users-count");
const moviesCountElement = document.getElementById("dashboard-movies-count");
const commentsCountElement = document.getElementById(
  "dashboard-comments-count"
);
const categoriesCountElement = document.getElementById(
  "dashboard-categories-count"
);
const actorsCountElement = document.getElementById("dashboard-actors-count");
const contactsCountElement = document.getElementById(
  "dashboard-contacts-count"
);

function animateCounter(element, targetValue, duration = 1000) {
  if (!element) return;

  const endValue = parseInt(targetValue) || 0;
  if (endValue === 0) {
    element.textContent = "0";
    return;
  }

  let startTime = null;

  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    const progress = timestamp - startTime;
    const percentage = Math.min(progress / duration, 1);

    // Ease-out effect (slows down at the end)
    const easeOut = 1 - Math.pow(1 - percentage, 3);

    element.textContent = Math.floor(easeOut * endValue);

    if (progress < duration) {
      window.requestAnimationFrame(step);
    } else {
      element.textContent = endValue;
    }
  }

  window.requestAnimationFrame(step);
}

// Load dashboard statistics
async function loadDashboardStats() {
  showLoading();
  try {
    const response = await adminService.dashboard.getStatistics();

    if (response.result && response.data) {
      const stats = response.data;

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
  loadDashboardStats();
});

// Logout handler
document.querySelector(".logout-text")?.addEventListener("click", () => {
  adminService.auth.logout();
});
