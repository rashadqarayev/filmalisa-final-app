import { handleLogin } from "./util/examples.js";





// Attach event listener when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.querySelector(".login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
  }
});





const passtoggle = document.querySelector("#pass-toggle");
const passwordInput = document.querySelector("#password");

passtoggle.addEventListener("click", () => {
  const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
  passwordInput.setAttribute("type", type);
});

