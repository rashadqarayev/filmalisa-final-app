// // login.js

// // 1. ON PAGE LOAD: If token exists, redirect directly to home
// if (localStorage.getItem("user_token")) {
//     window.location.href = "home.html"; 
// }

// const loginUrl = "https://api.sarkhanrahimli.dev/api/filmalisa/auth/login";
// const loginForm = document.getElementById("loginForm");
// const warningEl = document.getElementById("warning");

// // Error display function
// function showWarning(text) {
//     if (warningEl) {
//         warningEl.textContent = text;
//         warningEl.style.display = "block";
//     } else {
//         alert(text);
//     }
// }

// async function login(event) {
//     event.preventDefault();
    
//     const email = document.getElementById("email").value.trim();
//     const password = document.getElementById("password").value;

//     if (!email || !password) {
//         showWarning("Please enter your email and password.");
//         return;
//     }

//     const options = {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password }),
//     };

//     try {
//         const response = await fetch(loginUrl, options);
//         const responseData = await response.json();
        
//         console.log("Response from API:", responseData); // Check this in the console

//         if (!response.ok) {
//             showWarning(responseData.message || "Email or password is incorrect.");
//             return;
//         }

//         // Save the token (note API structure: data.tokens.access_token)
//         if (responseData.data && responseData.data.tokens && responseData.data.tokens.access_token) {
//             const accessToken = responseData.data.tokens.access_token;
//             localStorage.setItem("user_token", accessToken);
            
//             console.log("Token saved successfully. Redirecting to home...");
//             window.location.href = "home.html"; 
//         } else {
//             showWarning("Token not received. Check the API response.");
//         }

//     } catch (error) {
//         console.error("An error occurred:", error);
//         showWarning("Connection to server lost.");
//     }
// }

// if (loginForm) {
//     loginForm.addEventListener("submit", login);
// }





const passToggle = document.getElementById("pass-toggle");
const passwordInput = document.getElementById("password");

passToggle.addEventListener("click", () => {
  const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
  passwordInput.setAttribute("type", type);
});
