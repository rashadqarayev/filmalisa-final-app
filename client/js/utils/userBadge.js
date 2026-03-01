/**
 * Renders a fixed top-right badge showing the signed-in user's
 * profile image and full name on every client page.
 * Clicking the badge toggles a logout dropdown.
 */
export async function initUserBadge() {
  const token = localStorage.getItem("user_token");
  if (!token) return;

  try {
    const res = await fetch(
      "https://api.sarkhanrahimli.dev/api/filmalisa/profile",
      { headers: { Authorization: "Bearer " + token } }
    );
    const json = await res.json();
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
    dropdown.innerHTML = `<button id="badgeLogoutBtn">Logout</button>`;

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

  } catch {
    // Silently ignore — badge is optional UI
  }
}
