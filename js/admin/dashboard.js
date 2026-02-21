
const favoriteCountElement = document.getElementById("dashboard-favorite-count");
const usersCountElement = document.getElementById("dashboard-users-count");
const moviesCountElement = document.getElementById("dashboard-movies-count");
const commentsCountElement = document.getElementById("dashboard-comments-count");
const categoriesCountElement = document.getElementById("dashboard-categories-count");
const actorsCountElement = document.getElementById("dashboard-actors-count");
const contactsCountElement = document.getElementById("dashboard-contacts-count");


function animateCounter(element, targetValue, duration = 1000) {
    if (!element) return;
    
    const endValue = parseInt(targetValue) || 0;
    if (endValue === 0) {
        element.textContent = "0";
        return;
    }

    let startTime = null;

    function step(timestamp) {
        if (!startTime) startTime = timestamp;
        const progress = timestamp - startTime;
        const percentage = Math.min(progress / duration, 1);
        
        // Ease-out effekti (Sonda yavaşlayan hərəkət)
        const easeOut = 1 - Math.pow(1 - percentage, 3);
        
        element.textContent = Math.floor(easeOut * endValue);

        if (progress < duration) {
            window.requestAnimationFrame(step);
        } else {
            element.textContent = endValue;
        }
    }

    window.requestAnimationFrame(step);
}

async function getDashboardData() {
    const API_URL = "https://api.sarkhanrahimli.dev/api/filmalisa/admin/dashboard";
    const token = localStorage.getItem("access_token"); 

    if (!token) {
        console.warn("Token tapılmadı!");
        return;
    }

    try {
        const response = await fetch(API_URL, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        const result = await response.json();

        if (response.ok && result.data) {
            
           
            animateCounter(favoriteCountElement, result.data.favorites);
            animateCounter(usersCountElement, result.data.users);
            animateCounter(moviesCountElement, result.data.movies);
            animateCounter(commentsCountElement, result.data.comments);
            animateCounter(categoriesCountElement, result.data.categories);
            animateCounter(actorsCountElement, result.data.actors);
            animateCounter(contactsCountElement, result.data.contacts);
        }
    } catch (error) {
        console.error("Dashboard data error:", error);
    }
}


getDashboardData();