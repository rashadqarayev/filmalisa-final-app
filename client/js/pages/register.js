import { authService } from "../services/AuthService.js";
import { showToast } from "../utils/toast.js";

// ── Auth guard: token varsa birbaşa home-a get ──────────────────────────────
if (localStorage.getItem("user_token")) {
  window.location.replace("./home.html");
}

// ── DOM refs ────────────────────────────────────────────────────────────────
const registerForm   = document.getElementById("registerForm");
const togglePassword = document.getElementById("togglePassword");
const passwordInput  = document.getElementById("password");
const emailInput     = document.getElementById("email");

// ── Landing page email autofill (?gmail=xxx) ────────────────────────────────
const gmailFromQuery = new URLSearchParams(window.location.search).get("gmail");
if (emailInput && gmailFromQuery) {
  emailInput.value = gmailFromQuery;
}

// ── Password toggle ──────────────────────────────────────────────────────────
if (togglePassword && passwordInput) {
  togglePassword.addEventListener("click", () => {
    passwordInput.type = passwordInput.type === "password" ? "text" : "password";
  });
}

// ── Register submit ──────────────────────────────────────────────────────────
if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const full_name = document.getElementById("fullname").value.trim();
    const email     = emailInput.value.trim();
    const password  = passwordInput.value;

    if (!full_name || !email || !password) {
      showToast("Validation Error", "Please fill in all fields.", "error");
      return;
    }

    try {
      const res = await authService.signup(full_name, email, password);
      if (res?.result) {
        showToast("Account Created", "Registration successful. Redirecting to login...", "success");
        setTimeout(() => window.location.replace("./login.html"), 1200);
      } else {
        showToast("Registration Failed", res?.message || "Please try again.", "error");
      }
    } catch (err) {
      showToast("Connection Error", err.message || "Could not reach the server.", "error");
    }
  });
}
