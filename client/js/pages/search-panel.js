import { moviesService } from "../services/MoviesService.js";
import { favoritesService } from "../services/FavoritesService.js";
import { showToast } from "../utils/toast.js";
import { initUserBadge } from "../utils/userBadge.js";

// ── Auth guard ─────────────────────────────────────────────────────────────────
if (!localStorage.getItem("user_token")) {
  window.location.replace("./login.html");
}

// ── IMDB stars helper ─────────────────────────────────────────────────────────
function imdbStars(imdb) {
  const score = parseFloat(imdb) || 0;
  const filled = Math.round(score / 2);
  let stars = "";
  for (let i = 1; i <= 5; i++) {
    stars += '<i class="fa-' + (i <= filled ? "solid" : "regular") + ' fa-star"></i>';
  }
  return '<div class="card-imdb">' + stars + '<span class="card-imdb__score">' + (score ? score.toFixed(1) : "—") + '</span></div>';
}

// ── DOM refs ───────────────────────────────────────────────────────────────────
const searchInput = document.querySelector(".search-bar input");
const resultsGrid = document.getElementById("searchResults");
const searchEmpty = document.getElementById("searchEmpty");

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

// ── Render ─────────────────────────────────────────────────────────────────────
function renderMovies(movies, favIds) {
  if (!movies.length) {
    resultsGrid.innerHTML = "";
    searchEmpty.style.display = "block";
    return;
  }
  searchEmpty.style.display = "none";

  resultsGrid.innerHTML = movies
    .map(function (m) {
      const isFav = favIds.has(Number(m.id));
      return (
        '<article class="action-card" data-id="' +
        m.id +
        '">' +
        '<img src="' +
        (m.cover_url || "../../assets/images/home.film1.jpg") +
        '" alt="' +
        m.title +
        '" loading="lazy" />' +
        '<p class="category-name">' +
        (m.category ? m.category.name : "") +
        "</p>" +
        imdbStars(m.imdb) +
        '<p class="movie-name">' +
        m.title +
        "</p>" +
        '<button type="button" class="card-fav-btn ' +
        (isFav ? "is-favorite" : "") +
        '" data-id="' +
        m.id +
        '" aria-pressed="' +
        isFav +
        '">' +
        '<i class="fa-' +
        (isFav ? "solid" : "regular") +
        ' fa-heart"></i></button>' +
        '<button type="button" class="card-play-btn" data-id="' +
        m.id +
        '" aria-label="Play movie">' +
        '<i class="fa-solid fa-play"></i></button>' +
        "</article>"
      );
    })
    .join("");

  // kart klik → detail
  resultsGrid.querySelectorAll(".action-card").forEach(function (card) {
    card.addEventListener("click", function (e) {
      if (
        e.target.closest(".card-fav-btn") ||
        e.target.closest(".card-play-btn")
      )
        return;
      goToDetail(card.dataset.id);
    });
  });

  // play → detail
  resultsGrid.querySelectorAll(".card-play-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      goToDetail(btn.dataset.id);
    });
  });

  // fav → API toggle
  resultsGrid.querySelectorAll(".card-fav-btn").forEach(function (btn) {
    btn.addEventListener("click", async function (e) {
      e.stopPropagation();
      try {
        const res = await favoritesService.toggleFavorite(btn.dataset.id);
        if (res) {
          const isFav = btn.classList.toggle("is-favorite");
          btn.setAttribute("aria-pressed", String(isFav));
          btn.querySelector("i").className =
            "fa-" + (isFav ? "solid" : "regular") + " fa-heart";
          const movieName = btn
            .closest(".action-card")
            .querySelector(".movie-name").textContent;
          if (isFav) {
            showToast(
              "Added to Favorites",
              '"' + movieName + '" added to your favorites.',
              "success"
            );
          } else {
            showToast(
              "Removed from Favorites",
              '"' + movieName + '" has been removed from your favorites.',
              "info"
            );
          }
        }
      } catch (err) {
        showToast("Error", "Could not update favorites.", "error");
      }
    });
  });
}

// ── Search ─────────────────────────────────────────────────────────────────────
let favIds = new Set();

async function doSearch(query) {
  showLoading();
  try {
    const res = await moviesService.getAllMovies(query || undefined);
    const movies = res && res.data ? res.data : [];
    renderMovies(movies, favIds);
  } catch (err) {
    showToast("Error", "Could not load movies.", "error");
  } finally {
    hideLoading();
  }
}

// ── Init ───────────────────────────────────────────────────────────────────────
async function init() {
  showLoading();
  try {
    const [moviesRes, favRes] = await Promise.all([
      moviesService.getAllMovies(),
      favoritesService.getFavorites().catch(function () {
        return { data: [] };
      }),
    ]);
    favIds = new Set(
      (favRes && favRes.data ? favRes.data : []).map(function (m) {
        return Number(m.id);
      })
    );
    const movies = moviesRes && moviesRes.data ? moviesRes.data : [];
    renderMovies(movies, favIds);
  } catch (err) {
    showToast("Error", "Could not load movies.", "error");
  } finally {
    hideLoading();
  }
}

// ── Input: Enter key only ──────────────────────────────────────────────────────
if (searchInput) {
  searchInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      doSearch(searchInput.value.trim());
    }
  });
}

document.addEventListener("DOMContentLoaded", init);
initUserBadge();
