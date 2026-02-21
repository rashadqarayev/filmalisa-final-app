// Import adminAPI

import { handleLogin } from "./examples.js";

// Attach event listener when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.querySelector(".login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
  }
});
