import { handleLogin } from "./util/examples.js";





// Attach event listener when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.querySelector(".login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
  }
});



