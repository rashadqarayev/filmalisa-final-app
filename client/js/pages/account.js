import { profileService } from "../services/ProfileService.js";
import { showToast } from "../utils/toast.js";
import { initUserBadge } from "../utils/userBadge.js";

// ─── Auth guard ───────────────────────────────────────────────────────────────
if (!localStorage.getItem("user_token")) {
  window.location.replace("./login.html");
}

// ─── Loading helpers ──────────────────────────────────────────────────────────
const pageLoader = document.getElementById("page-loader");
function showLoading() { if (pageLoader) pageLoader.style.display = "flex"; }
function hideLoading() { if (pageLoader) pageLoader.style.display = "none"; }

// ─── DOM refs ─────────────────────────────────────────────────────────────────
const passwordInput         = document.getElementById("passwordInput");
const togglePassword        = document.getElementById("togglePassword");
const profileImageFileInput = document.getElementById("profileImageFileInput");
const profileImageUrlInput  = document.getElementById("profileImageUrlInput");
const profilePreview        = document.getElementById("profilePreview");
const avatarWrapper         = document.getElementById("avatarWrapper");
const accountForm           = document.querySelector(".account-form");
const fullNameInput         = document.getElementById("fullNameInput");
const emailInput            = document.getElementById("emailInput");

// Tracks the last valid API-saved image URL so it isn't lost when browsing local files
let currentImgUrl = "";

// ─── Password toggle ──────────────────────────────────────────────────────────
if (togglePassword && passwordInput) {
  togglePassword.addEventListener("click", () => {
    passwordInput.type = passwordInput.type === "password" ? "text" : "password";
  });
}

// ─── Avatar click → file input ────────────────────────────────────────────────
if (avatarWrapper && profileImageFileInput) {
  avatarWrapper.addEventListener("click", () => {
    profileImageFileInput.click();
  });
}

// ─── File input → local preview ───────────────────────────────────────────────
if (profileImageFileInput && profilePreview) {
  profileImageFileInput.addEventListener("change", (event) => {
    const selectedFile = event.target.files && event.target.files[0];
    if (!selectedFile || !selectedFile.type.startsWith("image/")) {
      profileImageFileInput.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      // Show local preview only — do NOT clear the URL input so the
      // saved img_url is not lost when the form is submitted.
      profilePreview.src = loadEvent.target?.result || "";
    };
    reader.readAsDataURL(selectedFile);
  });
}

// ─── URL input → live preview ─────────────────────────────────────────────────
if (profileImageUrlInput && profilePreview) {
  profileImageUrlInput.addEventListener("input", (event) => {
    const url = event.target.value.trim();
    if (!url) { profilePreview.src = ""; return; }
    const img = new Image();
    img.onload = () => {
      profilePreview.src = url;
      currentImgUrl = url;                                    // keep in sync
      if (profileImageFileInput) profileImageFileInput.value = "";
    };
    img.src = url;
  });
}

// ─── Logout ───────────────────────────────────────────────────────────────────
// (logout button removed)

// ─── Form submit → update profile ─────────────────────────────────────────────
accountForm?.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Prefer what the user typed; fall back to the last URL loaded from the API
  const typedUrl = profileImageUrlInput?.value.trim();
  const payload = {
    full_name: fullNameInput?.value.trim() || "",
    img_url:   typedUrl || currentImgUrl,
  };

  const pass = passwordInput?.value.trim();
  if (pass) payload.password = pass;

  try {
    const res = await profileService.updateProfile(payload);
    if (res?.result) {
      if (pass) localStorage.setItem("user_password", pass);
      showToast("Saved", "Profile updated successfully.", "success");
      if (passwordInput) passwordInput.value = pass || localStorage.getItem("user_password") || "";
    } else {
      showToast("Error", res?.message || "Could not update profile.", "error");
    }
  } catch {
    showToast("Error", "Something went wrong.", "error");
  }
});

// ─── Init: load profile from API ─────────────────────────────────────────────
async function init() {
  showLoading();
  try {
    const res  = await profileService.getProfile();
    const data = res?.data;
    if (!data) throw new Error("No profile data");

    if (fullNameInput)        fullNameInput.value        = data.full_name || "";
    if (emailInput)           emailInput.value           = data.email     || "";
    if (passwordInput)        passwordInput.value        = localStorage.getItem("user_password") || "";
    currentImgUrl = data.img_url || "";
    if (profileImageUrlInput) profileImageUrlInput.value = currentImgUrl;
    if (profilePreview && currentImgUrl) profilePreview.src = currentImgUrl;
  } catch {
    showToast("Error", "Failed to load profile.", "error");
  } finally {
    hideLoading();
  }
}

init();
initUserBadge();

