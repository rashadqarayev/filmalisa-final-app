/**
 * showToast — client-side toast notification
 * @param {string} title   - Bold heading
 * @param {string} message - Body text
 * @param {'success'|'error'|'warning'|'info'} type
 */
export function showToast(title, message, type = 'success') {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const icons = {
    success: 'fa-check-double',
    error:   'fa-circle-xmark',
    warning: 'fa-triangle-exclamation',
    info:    'fa-circle-info',
  };
  const icon = icons[type] || icons.success;

  const toast = document.createElement('div');
  toast.className = `modern-toast ${type}`;
  toast.innerHTML = `
    <div class="toast-icon"><i class="fa-solid ${icon}"></i></div>
    <div class="toast-details">
      <span class="toast-title">${title}</span>
      <span class="toast-msg">${message}</span>
    </div>
    <i class="fa-solid fa-xmark toast-close"></i>
    <div class="toast-progress"></div>
  `;

  toast.querySelector('.toast-close').onclick = () => toast.remove();
  container.appendChild(toast);
  setTimeout(() => { if (toast.parentElement) toast.remove(); }, 4000);
}
