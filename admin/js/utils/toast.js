// util/toast.js


 function createToast(title, message) {
            const container = document.getElementById('toastContainer');
            
            // Create a new toast element
            const toast = document.createElement('div');
            toast.className = 'modern-toast';
            
            toast.innerHTML = `
                <div class="toast-icon">
                    <i class="fa-solid fa-check-double"></i>
                </div>
                <div class="toast-details">
                    <span class="toast-title">${title}</span>
                    <span class="toast-msg">${message}</span>
                </div>
                <i class="fa-solid fa-xmark toast-close" onclick="this.parentElement.remove()"></i>
                <div class="toast-progress"></div>
            `;

            container.appendChild(toast);

            // Remove from DOM completely after 4.5 seconds (when animation ends)
            setTimeout(() => {
                if(toast) toast.remove();
            }, 4500);
        }


export function showToast(title, message, type = 'success') {
    


    let container = document.getElementById('toastContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toastContainer';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `modern-toast ${type}`;
    
    let icon = 'fa-check-double';
    if (type === 'error') icon = 'fa-circle-xmark';
    else if (type === 'warning') icon = 'fa-triangle-exclamation';
    else if (type === 'info') icon = 'fa-circle-info';

    toast.innerHTML = `
        <div class="toast-icon">
            <i class="fa-solid ${icon}"></i>
        </div>
        <div class="toast-details">
            <span class="toast-title">${title}</span>
            <span class="toast-msg">${message}</span>
        </div>
        <i class="fa-solid fa-xmark toast-close"></i>
        <div class="toast-progress"></div>
    `;

   
    toast.querySelector('.toast-close').onclick = () => toast.remove();

    container.appendChild(toast);

    
    setTimeout(() => {
        if (toast.parentElement) toast.remove();
    }, 4000);
}