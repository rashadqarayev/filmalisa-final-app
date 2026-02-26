// // js/client/checkAuth.js

// function checkAuth() {
//     const token = localStorage.getItem("user_token");
//     const path = window.location.pathname;
    
//     // Check if on Login or Register page
//     const isAuthPage = path.includes("login.html") || path.includes("register.html");
//     // Check if on Landing page (index.html)
//     const isLandingPage = path.endsWith("index.html") || path === "/";

//     // 1. If no token and on a protected page -> redirect to Landing
//     if (!token && !isAuthPage && !isLandingPage) {
//         window.location.replace("../../index.html"); // .replace is better, doesn't break the back button
//         return; // Stop function so code below doesn't run
//     }

//     // 2. If token EXISTS and user tries to access Login/Register again -> redirect to Profile
//     if (token && isAuthPage) {
//         window.location.replace("../pages/home.html"); 
//     }
// }

// // Check once when the page loads
// checkAuth();

// // React immediately when token is deleted from another tab or manually (without setInterval!)
// window.addEventListener('storage', (event) => {
//     if (event.key === 'user_token' && !event.newValue) {
//         window.location.replace("../../index.html");
//     }
// });