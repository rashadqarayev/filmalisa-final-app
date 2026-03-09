import { favoritesService } from "../services/FavoritesService.js";
import { showToast }        from "../utils/toast.js";
import { initUserBadge }    from "../utils/userBadge.js";

// ── Auth guard ─────────────────────────────────────────────────────────────────
if (!localStorage.getItem("user_token")) {
  window.location.replace("./login.html");
}

// ── Helpers ────────────────────────────────────────────────────────────────────
function showLoading() {
  const el = document.getElementById("page-loader");
  if (el) el.classList.remove("hidden");
}
function hideLoading() {
  const el = document.getElementById("page-loader");
  if (el) el.classList.add("hidden");
}

function goToDetail(movieId) {
  sessionStorage.setItem("detail_access", "1");
  window.location.href = "./detail.html?id=" + movieId;
}

// ── IMDB stars helper ─────────────────────────────────────────────────────────
function imdbStars(imdb) {
  const score = parseFloat(imdb) || 0;
  const filled = Math.round(score / 2);
  let stars = "";
  for (let i = 1; i <= 5; i++) {
    stars += "<i class=\"fa-" + (i <= filled ? "solid" : "regular") + " fa-star\"></i>";
  }
  return "<div class=\"card-imdb\">" + stars + "<span class=\"card-imdb__score\">" + (score ? score.toFixed(1) : "—") + "</span></div>";
}

// ── Render ─────────────────────────────────────────────────────────────────────
function renderFavorites(movies) {
  const grid  = document.getElementById("favoritesGrid");
  const empty = document.getElementById("favoritesEmpty");

  if (!movies.length) {
    grid.innerHTML = "";
    empty.style.display = "block";
    return;
  }

  empty.style.display = "none";
  grid.innerHTML = movies.map(function(m) {
    return "<article class=\"action-card\" data-id=\"" + m.id + "\">" +
      "<img src=\"" + (m.cover_url || "../../assets/images/home.film1.jpg") + "\" alt=\"" + m.title + "\" loading=\"lazy\" />" +
      "<p class=\"category-name\">" + (m.category ? m.category.name : "") + "</p>" +
      imdbStars(m.imdb) +
      "<p class=\"movie-name\">" + m.title + "</p>" +
      "<button type=\"button\" class=\"card-fav-btn is-favorite\" data-id=\"" + m.id + "\" aria-pressed=\"true\" aria-label=\"Remove from favorites\">" +
      "<i class=\"fa-solid fa-heart\"></i></button>" +
      "<button type=\"button\" class=\"card-play-btn\" data-id=\"" + m.id + "\" aria-label=\"Play movie\">" +
      "<i class=\"fa-solid fa-play\"></i></button>" +
      "</article>";
  }).join("");

  // kart klik → detail
  grid.querySelectorAll(".action-card").forEach(function(card) {
    card.addEventListener("click", function(e) {
      if (e.target.closest(".card-fav-btn") || e.target.closest(".card-play-btn")) return;
      goToDetail(card.dataset.id);
    });
  });

  // play → detail
  grid.querySelectorAll(".card-play-btn").forEach(function(btn) {
    btn.addEventListener("click", function() { goToDetail(btn.dataset.id); });
  });

  // fav → toggle (remove from list)
  grid.querySelectorAll(".card-fav-btn").forEach(function(btn) {
    btn.addEventListener("click", async function(e) {
      e.stopPropagation();
      try {
        const res = await favoritesService.toggleFavorite(btn.dataset.id);
        if (res) {
          const card      = btn.closest(".action-card");
          const movieName = card.querySelector(".movie-name").textContent;
          card.remove();
          showToast("Removed from Favorites", "\"" + movieName + "\" has been removed from your favorites.", "info");
          if (!grid.querySelector(".action-card")) {
            empty.style.display = "block";
          }
        }
      } catch (err) {
        showToast("Error", "Could not update favorites.", "error");
      }
    });
  });
}

// ── Init ───────────────────────────────────────────────────────────────────────
async function init() {
  showLoading();
  try {
    const res    = await favoritesService.getFavorites();
    const movies = (res && res.data) ? res.data : [];
    renderFavorites(movies);
  } catch (err) {
    showToast("Error", "Could not load favorites.", "error");
    console.error(err);
  } finally {
    hideLoading();
  }
}

document.addEventListener("DOMContentLoaded", init);
initUserBadge();
