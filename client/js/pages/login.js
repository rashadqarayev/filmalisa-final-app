import { authService } from "../services/AuthService.js";
import { showToast } from "../utils/toast.js";
import { httpClient } from "../core/HttpClient.js";

// ── Auth guard: token varsa birbaşa home-a get ──────────────────────────
if (localStorage.getItem("user_token")) {
  window.location.replace("./home.html");
}

// ── DOM refs ──────────────────────────────────────────────────────────
const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const passToggle = document.getElementById("pass-toggle");

// ── Password toggle ─────────────────────────────────────────────────────
if (passToggle && passwordInput) {
  passToggle.addEventListener("click", () => {
    passwordInput.type =
      passwordInput.type === "password" ? "text" : "password";
  });
}

// ── Login submit ───────────────────────────────────────────────────────────
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
      showToast(
        "Validation Error",
        "Please enter your email and password.",
        "error"
      );
      return;
    }

    try {
      const res = await authService.login(email, password);
      if (res?.result) {
        const profile = res?.data?.profile;
        const isRegisteredClientUser = Boolean(
          profile && profile.id && profile.email
        );
        const isAdminAccount = Number(profile?.id) === 261;

        if (!isRegisteredClientUser || isAdminAccount) {
          httpClient.removeAuthToken();
          localStorage.removeItem("user_profile");
          localStorage.removeItem("user_password");
          showToast(
            "Access Denied",
            "Only registered client users can log in.",
            "error"
          );
          return;
        }

        localStorage.setItem("user_password", password);
        showToast(
          "Welcome back!",
          "Login successful. Redirecting...",
          "success"
        );
        setTimeout(() => window.location.replace("./home.html"), 1000);
      } else {
        showToast(
          "Login Failed",
          res?.message || "Email or password is incorrect.",
          "error"
        );
      }
    } catch (err) {
      showToast(
        "Connection Error",
        err.message || "Could not reach the server.",
        "error"
      );
    }
  });
}
