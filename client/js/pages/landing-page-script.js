import { httpClient } from "../core/HttpClient.js";

// ─── Auth redirect: removed — user stays on landing page even if logged in ───

// ─── Toast ─────────────────────────────────────────────────────────────
function showToast(title, message, type) {
  type = type || "success";
  var container = document.getElementById("toastContainer");
  if (!container) {
    container = document.createElement("div");
    container.id = "toastContainer";
    container.className = "toast-container";
    document.body.appendChild(container);
  }
  var icons = {
    success: "fa-check-double",
    error: "fa-circle-xmark",
    warning: "fa-triangle-exclamation",
    info: "fa-circle-info",
  };
  var icon = icons[type] || icons.success;
  var toast = document.createElement("div");
  toast.className = "modern-toast " + type;
  toast.innerHTML =
    '<div class="toast-icon"><i class="fa-solid ' +
    icon +
    '"></i></div>' +
    '<div class="toast-details"><span class="toast-title">' +
    title +
    '</span><span class="toast-msg">' +
    message +
    "</span></div>" +
    '<i class="fa-solid fa-xmark toast-close"></i>';
  toast.querySelector(".toast-close").onclick = function () {
    toast.remove();
  };
  container.appendChild(toast);
  setTimeout(function () {
    if (toast.parentElement) toast.remove();
  }, 4000);
}

function toggleFaq(element) {
  if (!(element instanceof Element)) return;
  const answer = element.nextElementSibling;
  const icon = element.querySelector(".faq-icon");
  if (!answer || !icon) return;

  if (answer.classList.contains("active")) {
    answer.classList.remove("active");
    icon.classList.remove("spin");
  } else {
    answer.classList.add("active");
    icon.classList.add("spin");
  }
}

document.querySelectorAll(".faq-head").forEach(function (head) {
  head.addEventListener("click", function () {
    toggleFaq(this);
  });
});

// ─── Auth button logic ────────────────────────────────────────────────────────
(function () {
  const token = localStorage.getItem("user_token");
  const authBtn = document.getElementById("authBtn");
  const dropdown = document.getElementById("userDropdown");
  const logoutBtn = document.getElementById("dropdownLogout");

  if (!token) {
    // Not signed in — show Sign In immediately
    authBtn.textContent = "Sign In";
    authBtn.style.visibility = "visible";
    authBtn.addEventListener("click", () => {
      window.location.href = "./client/html/login.html";
    });
    return;
  }

  // Signed in — fetch full name from profile API
  httpClient.get("/profile")
    .then(function (res) {
      authBtn.textContent =
        res && res.data && res.data.full_name
          ? res.data.full_name
          : "My Account";
      authBtn.style.visibility = "visible";
    })
    .catch(function () {
      authBtn.textContent = "My Account";
      authBtn.style.visibility = "visible";
    });

  // Toggle dropdown on button click
  authBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    var isVisible = dropdown.style.display === "block";
    dropdown.style.display = isVisible ? "none" : "block";
  });

  // Close dropdown when clicking anywhere outside
  document.addEventListener("click", function (e) {
    if (!e.target.closest("#userMenu")) {
      dropdown.style.display = "none";
    }
  });

  // Go to Home
  var homeBtn = document.getElementById("dropdownHome");
  if (homeBtn) {
    homeBtn.addEventListener("click", function () {
      window.location.href = "./client/html/home.html";
    });
  }

  // Logout — yalnız token silinir, landing pagədə qalır
  logoutBtn.addEventListener("click", function () {
    localStorage.removeItem("user_token");
    window.location.reload();
  });
})();

// ─── Contact form ────────────────────────────────────────────────────────────
(function () {
  var sendBtn = document.getElementById("contactSendBtn");
  var nameInput = document.getElementById("contactFullName");
  var emailInput = document.getElementById("contactEmail");
  var reasonInput = document.getElementById("contactReason");
  if (!sendBtn) return;

  function setError(el, hasError) {
    if (!el) return;
    el.style.border = hasError ? "2px solid #ea4335" : "";
  }

  [nameInput, emailInput, reasonInput].forEach(function (el) {
    if (el)
      el.addEventListener("input", function () {
        setError(el, false);
      });
  });

  sendBtn.addEventListener("click", async function () {
    var full_name = nameInput ? nameInput.value.trim() : "";
    var email = emailInput ? emailInput.value.trim() : "";
    var reason = reasonInput ? reasonInput.value.trim() : "";

    var valid = true;
    if (!full_name) {
      setError(nameInput, true);
      valid = false;
    }
    if (!email) {
      setError(emailInput, true);
      valid = false;
    }
    if (!reason) {
      setError(reasonInput, true);
      valid = false;
    }
    if (!valid) {
      showToast("Validation", "Please fill in all fields.", "error");
      return;
    }

    sendBtn.disabled = true;
    sendBtn.textContent = "Sending...";

    try {
      var data = await httpClient.post("/contact", {
        full_name: full_name,
        email: email,
        reason: reason,
      });
      if (data && data.result) {
        nameInput.value = "";
        emailInput.value = "";
        reasonInput.value = "";
        showToast(
          "Message Sent!",
          "Your message has been received. We'll get back to you soon.",
          "success"
        );
      } else {
        showToast(
          "Error",
          data && data.message
            ? data.message
            : "Failed to send. Please try again.",
          "error"
        );
      }
    } catch (e) {
      showToast(
        "Error",
        "Could not send message. Please check your connection.",
        "error"
      );
    }

    sendBtn.disabled = false;
    sendBtn.textContent = "Send";
  });
})();