import { adminService } from "../../services/AdminService.js";
import { showToast } from "../../utils/toast.js";

// If admin is already logged in, go straight to dashboard
if (localStorage.getItem("admin_access_token")) {
  window.location.replace("/admin/html/dashboard.html");
}

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.querySelector(".login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
  }
});

const passtoggle = document.querySelector("#pass-toggle");
const passwordInput = document.querySelector("#password");

passtoggle?.addEventListener("click", () => {
  const type =
    passwordInput.getAttribute("type") === "password" ? "text" : "password";
  passwordInput.setAttribute("type", type);
});

async function handleLogin(event) {
  event.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const btn = event.target.querySelector("button[type=submit]");
  const warning = document.getElementById("warning");

  if (warning) warning.textContent = "";

  if (!email || !password) {
    if (warning) warning.textContent = "Please enter email and password.";
    return;
  }

  if (btn) {
    btn.disabled = true;
    btn.textContent = "Logging in…";
  }

  try {
    const response = await adminService.auth.login(email, password);

    if (response.result) {
      // API docs: admin profile always has id 999999
      // Regular client users have different IDs → block them
      const profile = response.data?.profile;
      if (!profile || profile.id !== 261) {
        adminService.http.removeAuthToken();
        showToast("Access Denied", "You do not have permission to access the admin panel.", "error");
        return;
      }

      showToast("Success", "Login successful!", "success");
      setTimeout(() => {
        window.location.href = "/admin/html/dashboard.html";
      }, 1000);
    } else {
      showToast("Login Failed", response.message || "Email or password is incorrect.", "error");
    }
  } catch (error) {
    showToast("Connection Error", error.message || "Could not reach the server.", "error");
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.textContent = "login";
    }
  }
}