/**
 * Utility Helpers for Admin Panel
 * Common utility functions for UI operations and data handling
 */

/**
 * Format date to readable string
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date
 */
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Format date and time
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date and time
 */
function formatDateTime(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
function truncateText(text, maxLength = 100) {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}

/**
 * Escape HTML to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Debounce function for search inputs
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @returns {Function} Debounced function
 */
function debounce(func, wait = 300) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Show loading spinner
 * @param {boolean} show - Show or hide
 * @param {string} targetId - Target element ID (optional)
 */
function toggleLoading(show, targetId = "loader") {
  const loader = document.getElementById(targetId);
  if (loader) {
    loader.style.display = show ? "flex" : "none";
  }
}

/**
 * Show toast notification
 * @param {string} message - Message to display
 * @param {string} type - Type: 'success', 'error', 'warning', 'info'
 * @param {number} duration - Duration in ms
 */
function showToast(message, type = "info", duration = 3000) {
  // Remove existing toast if any
  const existingToast = document.querySelector(".toast");
  if (existingToast) {
    existingToast.remove();
  }

  // Create toast element
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.textContent = message;

  // Add styles
  Object.assign(toast.style, {
    position: "fixed",
    top: "20px",
    right: "20px",
    padding: "16px 24px",
    borderRadius: "8px",
    color: "#fff",
    fontSize: "14px",
    fontWeight: "500",
    zIndex: "10000",
    animation: "slideInRight 0.3s ease-out",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  });

  // Set background color based on type
  const colors = {
    success: "#4CAF50",
    error: "#f44336",
    warning: "#ff9800",
    info: "#2196F3",
  };
  toast.style.backgroundColor = colors[type] || colors.info;

  // Add to body
  document.body.appendChild(toast);

  // Remove after duration
  setTimeout(() => {
    toast.style.animation = "slideOutRight 0.3s ease-out";
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

/**
 * Confirm dialog wrapper
 * @param {string} message - Confirmation message
 * @returns {Promise<boolean>} User's choice
 */
async function confirmDialog(message) {
  return new Promise((resolve) => {
    const result = confirm(message);
    resolve(result);
  });
}

/**
 * Prompt dialog wrapper
 * @param {string} message - Prompt message
 * @param {string} defaultValue - Default value
 * @returns {Promise<string|null>} User's input
 */
async function promptDialog(message, defaultValue = "") {
  return new Promise((resolve) => {
    const result = prompt(message, defaultValue);
    resolve(result);
  });
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} Is valid
 */
function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * Validate URL format
 * @param {string} url - URL to validate
 * @returns {boolean} Is valid
 */
function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Format number with commas
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * Get query parameter from URL
 * @param {string} param - Parameter name
 * @returns {string|null} Parameter value
 */
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

/**
 * Set query parameter in URL
 * @param {string} param - Parameter name
 * @param {string} value - Parameter value
 */
function setQueryParam(param, value) {
  const url = new URL(window.location);
  url.searchParams.set(param, value);
  window.history.pushState({}, "", url);
}

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} Success status
 */
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    showToast("Copied to clipboard!", "success");
    return true;
  } catch (err) {
    showToast("Failed to copy", "error");
    return false;
  }
}

/**
 * Download data as JSON file
 * @param {Object} data - Data to download
 * @param {string} filename - File name
 */
function downloadJSON(data, filename = "data.json") {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Generate random ID
 * @returns {string} Random ID
 */
function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

/**
 * Sort array of objects by key
 * @param {Array} array - Array to sort
 * @param {string} key - Key to sort by
 * @param {string} order - 'asc' or 'desc'
 * @returns {Array} Sorted array
 */
function sortBy(array, key, order = "asc") {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];

    if (order === "asc") {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });
}

/**
 * Filter array of objects by search term
 * @param {Array} array - Array to filter
 * @param {string} searchTerm - Search term
 * @param {Array<string>} keys - Keys to search in
 * @returns {Array} Filtered array
 */
function filterBySearch(array, searchTerm, keys) {
  const term = searchTerm.toLowerCase();
  return array.filter((item) => {
    return keys.some((key) => {
      const value = item[key];
      if (typeof value === "string") {
        return value.toLowerCase().includes(term);
      }
      return false;
    });
  });
}

/**
 * Group array by key
 * @param {Array} array - Array to group
 * @param {string} key - Key to group by
 * @returns {Object} Grouped object
 */
function groupBy(array, key) {
  return array.reduce((result, item) => {
    const groupKey = item[key];
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {});
}

/**
 * Paginate array
 * @param {Array} array - Array to paginate
 * @param {number} page - Current page (1-based)
 * @param {number} perPage - Items per page
 * @returns {Object} Paginated data with metadata
 */
function paginate(array, page = 1, perPage = 10) {
  const start = (page - 1) * perPage;
  const end = start + perPage;
  const totalPages = Math.ceil(array.length / perPage);

  return {
    data: array.slice(start, end),
    currentPage: page,
    perPage: perPage,
    total: array.length,
    totalPages: totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
}

/**
 * Create pagination controls
 * @param {Object} paginationData - Data from paginate function
 * @param {Function} onPageChange - Callback function
 * @returns {string} HTML string for pagination
 */
function createPaginationHTML(paginationData, onPageChange) {
  const { currentPage, totalPages, hasNext, hasPrev } = paginationData;

  let html = '<div class="pagination">';

  // Previous button
  html += `<button onclick="${onPageChange}(${currentPage - 1})" ${
    !hasPrev ? "disabled" : ""
  }>Previous</button>`;

  // Page numbers
  for (let i = 1; i <= totalPages; i++) {
    const active = i === currentPage ? "active" : "";
    html += `<button class="${active}" onclick="${onPageChange}(${i})">${i}</button>`;
  }

  // Next button
  html += `<button onclick="${onPageChange}(${currentPage + 1})" ${
    !hasNext ? "disabled" : ""
  }>Next</button>`;

  html += "</div>";
  return html;
}

/**
 * Format file size
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size
 */
function formatFileSize(bytes) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

/**
 * Validate form data
 * @param {Object} data - Form data
 * @param {Object} rules - Validation rules
 * @returns {Object} Validation result { isValid, errors }
 */
function validateForm(data, rules) {
  const errors = {};

  for (const field in rules) {
    const rule = rules[field];
    const value = data[field];

    if (rule.required && !value) {
      errors[field] = `${field} is required`;
      continue;
    }

    if (rule.minLength && value.length < rule.minLength) {
      errors[field] = `${field} must be at least ${rule.minLength} characters`;
      continue;
    }

    if (rule.maxLength && value.length > rule.maxLength) {
      errors[field] = `${field} must be less than ${rule.maxLength} characters`;
      continue;
    }

    if (rule.email && !isValidEmail(value)) {
      errors[field] = `${field} must be a valid email`;
      continue;
    }

    if (rule.url && !isValidUrl(value)) {
      errors[field] = `${field} must be a valid URL`;
      continue;
    }

    if (rule.pattern && !rule.pattern.test(value)) {
      errors[field] = rule.message || `${field} is invalid`;
      continue;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Create table from data
 * @param {Array} data - Array of objects
 * @param {Array} columns - Column configuration
 * @param {Object} options - Table options
 * @returns {string} HTML table
 */
function createTable(data, columns, options = {}) {
  let html = `<table class="${options.className || "data-table"}">`;

  // Header
  html += "<thead><tr>";
  columns.forEach((col) => {
    html += `<th>${col.label}</th>`;
  });
  if (options.actions) {
    html += "<th>Actions</th>";
  }
  html += "</tr></thead>";

  // Body
  html += "<tbody>";
  data.forEach((row) => {
    html += "<tr>";
    columns.forEach((col) => {
      let value = row[col.key];
      if (col.format) {
        value = col.format(value, row);
      }
      html += `<td>${value}</td>`;
    });
    if (options.actions) {
      html += `<td>${options.actions(row)}</td>`;
    }
    html += "</tr>";
  });
  html += "</tbody>";

  html += "</table>";
  return html;
}

/**
 * Local storage helpers
 */
const storage = {
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
  get(key) {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  },
  remove(key) {
    localStorage.removeItem(key);
  },
  clear() {
    localStorage.clear();
  },
};

/**
 * Session storage helpers
 */
const session = {
  set(key, value) {
    sessionStorage.setItem(key, JSON.stringify(value));
  },
  get(key) {
    const value = sessionStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  },
  remove(key) {
    sessionStorage.removeItem(key);
  },
  clear() {
    sessionStorage.clear();
  },
};

/**
 * Add CSS animation styles to document
 */
function addAnimationStyles() {
  if (document.getElementById("helper-animations")) return;

  const style = document.createElement("style");
  style.id = "helper-animations";
  style.textContent = `
    @keyframes slideInRight {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    
    @keyframes slideOutRight {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(100%);
        opacity: 0;
      }
    }
    
    .fade-in {
      animation: fadeIn 0.3s ease-in;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `;
  document.head.appendChild(style);
}

// Initialize animations on load
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", addAnimationStyles);
} else {
  addAnimationStyles();
}
