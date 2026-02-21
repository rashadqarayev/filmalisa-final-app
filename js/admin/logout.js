
function handleLogout() {
   
    localStorage.removeItem("access_token");

}


const logoutBtn = document.querySelector(".lowerAside");

if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
        e.preventDefault();
        
      
        if (confirm("Sistemdən çıxış etmək istədiyinizə əminsiniz?")) {
            handleLogout();
        }
    });
}