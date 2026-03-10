import { httpClient } from "../core/HttpClient.js";

/**
 * Renders a fixed top-right badge showing the signed-in user's
 * profile image and full name on every client page.
 * Clicking the badge toggles a logout dropdown.
 */
export async function initUserBadge() {
  const token = localStorage.getItem("user_token");
  if (!token) return;

  // Cross-tab: if user_token is removed in another tab → redirect to landing
  window.addEventListener("storage", function (e) {
    if (e.key === "user_token" && !e.newValue) {
      const depth = window.location.pathname.includes("/client/html/") ? "../../" : "./";
      window.location.replace(depth + "index.html");
    }
  });

  try {
    const json = await httpClient.get("/profile");
    const profile = json?.data;
    if (!profile) return;

    // Badge
    const badge = document.createElement("div");
    badge.id = "userBadge";
    badge.className = "user-badge";
    badge.innerHTML = `
      ${profile.img_url
        ? `<img class="user-badge__avatar" src="${profile.img_url}" alt="avatar" />`
        : `<span class="user-badge__avatar user-badge__avatar--placeholder"></span>`
      }
      <span class="user-badge__name">${profile.full_name || ""}</span>
    `;

    // Dropdown
    const dropdown = document.createElement("div");
    dropdown.className = "user-badge__dropdown";
    dropdown.innerHTML = `
      <div class="ubd-header">
        ${
          profile.img_url
            ? `<img class="ubd-avatar" src="${profile.img_url}" alt="avatar" />`
            : `<span class="ubd-avatar ubd-avatar--placeholder"></span>`
        }
        <div class="ubd-info">
          <span class="ubd-name">${profile.full_name || ""}</span>
          <span class="ubd-email">${profile.email || ""}</span>
        </div>
      </div>
      <div class="ubd-divider"></div>
      <button id="badgeLogoutBtn" class="ubd-logout-btn">
        <span class="ubd-logout-icon"><i class="fa-solid fa-right-from-bracket"></i></span>
        <span class="ubd-logout-label">Logout</span>
        <i class="fa-solid fa-chevron-right ubd-logout-arrow"></i>
      </button>
    `;

    document.body.appendChild(badge);
    document.body.appendChild(dropdown);

    // Toggle dropdown on badge click
    badge.addEventListener("click", function (e) {
      e.stopPropagation();
      dropdown.classList.toggle("open");
    });

    // Close when clicking outside
    document.addEventListener("click", function () {
      dropdown.classList.remove("open");
    });

    // Logout
    document.getElementById("badgeLogoutBtn").addEventListener("click", function () {
      localStorage.removeItem("user_token");
      // Navigate to landing page (two levels up from client/html/)
      const depth = window.location.pathname.includes("/client/html/") ? "../../" : "./";
      window.location.href = depth + "index.html";
    });

    // Kullanıcı adı tıklanınca account.html'e yönlendir
    const userName = dropdown.querySelector(".ubd-name");
    if (userName) {
      userName.style.cursor = "pointer";
      userName.addEventListener("click", function (e) {
        e.stopPropagation();
        const depth = window.location.pathname.includes("/client/html/") ? "./" : "client/html/";
        window.location.href = depth + "account.html";
      });
    }

  } catch {
    // Silently ignore — badge is optional UI
  }
}
