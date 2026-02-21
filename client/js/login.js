// login.js

// 1. SƏHİFƏ YÜKLƏNƏNDƏ: Əgər token varsa, birbaşa home-a keç
if (localStorage.getItem("user_token")) {
    window.location.href = "home.html"; 
}

const loginUrl = "https://api.sarkhanrahimli.dev/api/filmalisa/auth/login";
const loginForm = document.getElementById("loginForm");
const warningEl = document.getElementById("warning");

// Xəta göstərmə funksiyası
function showWarning(text) {
    if (warningEl) {
        warningEl.textContent = text;
        warningEl.style.display = "block";
    } else {
        alert(text);
    }
}

async function login(event) {
    event.preventDefault();
    
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!email || !password) {
        showWarning("Email və şifrəni daxil edin.");
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
        
        console.log("API-dən gələn cavab:", responseData); // Bunu konsolda yoxla

        if (!response.ok) {
            showWarning(responseData.message || "Email və ya şifrə yanlışdır.");
            return;
        }

        // Tokeni yadda saxla (API strukturuna diqqət: data.tokens.access_token)
        if (responseData.data && responseData.data.tokens && responseData.data.tokens.access_token) {
            const accessToken = responseData.data.tokens.access_token;
            localStorage.setItem("user_token", accessToken);
            
            console.log("Token uğurla saxlanıldı. Home-a yönləndirilir...");
            window.location.href = "home.html"; 
        } else {
            showWarning("Token alınmadı. API cavabını yoxlayın.");
        }

    } catch (error) {
        console.error("Xəta baş verdi:", error);
        showWarning("Serverlə əlaqə kəsildi.");
    }
}

if (loginForm) {
    loginForm.addEventListener("submit", login);
}