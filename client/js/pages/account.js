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
      profilePreview.src = loadEvent.target?.result || "";
    };
    reader.readAsDataURL(selectedFile);
  });
}

// ─── URL input → live preview ─────────────────────────────────────────────────
if (profileImageUrlInput && profilePreview) {
  profileImageUrlInput.addEventListener("input", (event) => {
    const url = event.target.value.trim();
    profilePreview.src = url || "";
  });
}

// ─── Form submit → update profile ─────────────────────────────────────────────
accountForm?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const typedUrl = profileImageUrlInput?.value.trim() || "";

  const payload = {
    full_name: fullNameInput?.value.trim() || "",
    img_url: typedUrl,
    email: emailInput?.value.trim() || "",
  };

  const pass = passwordInput?.value.trim();
  if (pass) payload.password = pass;

  console.log("Sending payload:", JSON.stringify(payload));

  try {
    const res = await profileService.updateProfile(payload);
    console.log("API response:", JSON.stringify(res));
    if (res?.result) {
      if (pass) localStorage.setItem("user_password", pass);
      if (profilePreview && typedUrl) profilePreview.src = typedUrl;
      showToast("Saved", "Profile updated successfully.", "success");
    } else {
      showToast("Error", res?.message || "Could not update profile.", "error");
    }
  } catch (err) {
    console.error("Update error:", err);
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
    if (profileImageUrlInput) profileImageUrlInput.value = data.img_url || "";
    if (profilePreview && data.img_url) profilePreview.src = data.img_url;
  } catch {
    showToast("Error", "Failed to load profile.", "error");
  } finally {
    hideLoading();
  }
}

init();
initUserBadge();
