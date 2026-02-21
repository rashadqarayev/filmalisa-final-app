const API_URL = "https://api.sarkhanrahimli.dev/api/filmalisa/admin/users";
const tableBody = document.getElementById("usersTableBody");
const DEFAULT_IMAGE = "../../assets/images/adminman.svg";

async function getAllUsers() {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    try {
        const response = await fetch(API_URL, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (response.ok) {
            const result = await response.json();
            renderUsers(result.data);
        }
    } catch (error) {
        console.error("Məlumat çəkilərkən xəta:", error);
    }
}


// Şəkil linkini yoxlayan funksiya
function getCleanImage(imgUrl) {
    // const defaultPic = "../../assets/images/adminman.svg";

    // Əgər link yoxdursa, null-dursa və ya içində "null" sözü varsa
    if (!imgUrl || imgUrl === "null" || typeof imgUrl !== "string") {
        return DEFAULT_IMAGE;
    }

    // Əgər link səhvən "nullhttp" ilə başlayırsa, onu düzəlt və ya default qoy
    if (imgUrl.startsWith("null")) {
        return DEFAULT_IMAGE;
    }

    return imgUrl;
}

function renderUsers(users) {
    tableBody.innerHTML = "";

    users.forEach(user => {
        
        // Əgər url null-dursa və ya içində səhvən "null" sözü varsa, default şəkli seç
        let safeImg = (user.img_url && user.img_url !== "null") ? user.img_url : DEFAULT_IMAGE;

        const row = `
            <tr class="table-row">
                <th scope="row">${user.id}</th>
                <td>${user.full_name}</td>
                <td>${user.email}</td>
                <td>
                    <img src="${getCleanImage(user.img_url)}" 
                         alt="user"
                         onerror="this.onerror=null; this.src='${DEFAULT_IMAGE}';"
                         style="width: 45px; height: 45px; border-radius: 50%; object-fit: cover;">
                </td>
            </tr>
        `;
        tableBody.insertAdjacentHTML("beforeend", row);
    });
}

document.addEventListener("DOMContentLoaded", getAllUsers);