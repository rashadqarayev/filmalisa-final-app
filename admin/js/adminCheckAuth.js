// js/admin/adminCheckAuth.js

function verifyAdmin() {
    const token = localStorage.getItem("access_token");
    const isLoginPage = window.location.pathname.includes("login.html");

    // Əgər token yoxdursa və login səhifəsində deyilsə -> Loginə göndər
    if (!token && !isLoginPage) {
        window.location.href = "login.html"; 
    }
}

verifyAdmin();

// Token silinərsə dərhal loginə atmaq üçün
window.addEventListener('storage', (event) => {
    if (event.key === 'access_token' && !event.newValue) {
        window.location.href = "login.html";
    }
});

// Cari tabda silinməni izləmək üçün interval
setInterval(() => {
    if (!localStorage.getItem("access_token") && !window.location.pathname.includes("login.html")) {
        window.location.href = "login.html";
    }
}, 500);