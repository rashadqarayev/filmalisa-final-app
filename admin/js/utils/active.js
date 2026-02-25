/**
 * Active Navigation Tab Handler
 * Automatically highlights the current page in the sidebar
 */

function setActiveNavItem() {
  const sidebarItems = document.querySelectorAll(".sideBar-item");

  const dashboardItem = document.querySelector(".dashBoardItem");
  const movieItem = document.querySelector(".movieItem");
  const categoriesItem = document.querySelector(".categoriesItem");
  const usersItem = document.querySelector(".usersItem");
  const commentsItem = document.querySelector(".commentsItem");
  const contactItem = document.querySelector(".contactItem");
  const actorItem = document.querySelector(".actorItem");

  // Remove active class from all items
  sidebarItems.forEach((item) => item.classList.remove("active"));

  // Get current page path
  const currentPage = window.location.pathname.toLowerCase();

  // Add active class based on current page
  if (currentPage.includes("dashboard")) {
    dashboardItem?.classList.add("active");
  } else if (currentPage.includes("movie")) {
    movieItem?.classList.add("active");
  } else if (currentPage.includes("categor")) {
    categoriesItem?.classList.add("active");
  } else if (currentPage.includes("user")) {
    usersItem?.classList.add("active");
  } else if (currentPage.includes("comment")) {
    commentsItem?.classList.add("active");
  } else if (currentPage.includes("contact")) {
    contactItem?.classList.add("active");
  } else if (currentPage.includes("actor")) {
    actorItem?.classList.add("active");
  }
}

// Export the function
export { setActiveNavItem };

/**
 * Storage Event Listener
 * Automatically redirects to login if token is removed from another tab
 */
export function initStorageListener() {
  window.addEventListener("storage", (event) => {
    if (event.key === "admin_access_token" && !event.newValue) {
      window.location.href = "/admin/html/login.html";
    }
  });
}

// Auto-run when imported (for backward compatibility)
if (typeof window !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      setActiveNavItem();
      initStorageListener();
    });
  } else {
    setActiveNavItem();
    initStorageListener();
  }
}
