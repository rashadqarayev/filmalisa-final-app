// js/admin/login.js

// 1. Giriş yoxlanışı: Əgər admin artıq daxil olubsa, birbaşa dashboard-a at
if (localStorage.getItem("access_token")) {
    window.location.href = "dashboard.html"; 
}

const warningEl = document.getElementById("warning");
const loginUrl = "https://api.sarkhanrahimli.dev/api/filmalisa/auth/admin/login";
const form = document.querySelector(".login-form");

function showWarning(text) {
    if (warningEl) {
        warningEl.textContent = text;
        warningEl.style.display = "block";
    }
}

async function login(event) {
    event.preventDefault(); 

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!email || !password) {
        showWarning("Məlumatlar boş ola bilməz");
        return;
    }

    const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    };

    try {
        const response = await fetch(loginUrl, options);
        const responseData = await response.json();

        if (!responseData.result) {
            showWarning(responseData.message || "Giriş rədd edildi");
            return;
        }

        // Admin üçün 'access_token' istifadə edirik
        const accessToken = responseData.data.tokens.access_token;
        localStorage.setItem("access_token", accessToken);

        // Dashboard ilə login eyni qovluqdadırsa:
        window.location.href = "dashboard.html";
    } catch (error) {
        showWarning("Server xətası");
    }
}

form.addEventListener("submit", login);