// js/client/checkAuth.js

function checkAuth() {
    const token = localStorage.getItem("user_token");
    const path = window.location.pathname;
    
    // Login və ya Register səhifəsində olub-olmadığını yoxla
    const isAuthPage = path.includes("login.html") || path.includes("register.html");
    // Landing page (index.html) olub-olmadığını yoxla
    const isLandingPage = path.endsWith("index.html") || path === "/";

    // 1. Əgər token yoxdursa və qorunan səhifədədirsə -> Landing-ə at
    if (!token && !isAuthPage && !isLandingPage) {
        window.location.replace("../../index.html"); // .replace daha yaxşıdır, geri düyməsini xarab etmir
        return; // Funksiyanı dayandır ki, aşağıdakı kodlar işləməsin
    }

    // 2. Əgər token VARSA və istifadəçi yenidən Login/Register-ə girmək istəyirsə -> Profilə at
    if (token && isAuthPage) {
        window.location.replace("../pages/home.html"); 
    }
}

// Səhifə açılan kimi bir dəfə yoxla
checkAuth();

// Token başqa tabda və ya əllə silinəndə dərhal reaksiya ver (Amma setInterval-sız!)
window.addEventListener('storage', (event) => {
    if (event.key === 'user_token' && !event.newValue) {
        window.location.replace("../../index.html");
    }
});