import { moviesService }   from "./services/MoviesService.js";
import { favoritesService } from "./services/FavoritesService.js";
import { commentsService }  from "./services/CommentsService.js";
import { profileService }   from "./services/ProfileService.js";
import { showToast }        from "./utils/toast.js";
import { initUserBadge }    from "./utils/userBadge.js";

// ─── Auth guard ───────────────────────────────────────────────────────────────
if (!localStorage.getItem("user_token")) {
  window.location.replace("./login.html");
}

// ─── Loading ──────────────────────────────────────────────────────────────────
const pageLoader = document.getElementById("page-loader");
function showLoading() { if (pageLoader) pageLoader.style.display = "flex"; }
function hideLoading() { if (pageLoader) pageLoader.style.display = "none"; }

// ─── DOM refs ─────────────────────────────────────────────────────────────────
const detailBannerImg  = document.getElementById("detailBannerImg");
const movieCategoryName= document.getElementById("movieCategoryName");
const movieName        = document.getElementById("movieName");
const detailMoviePoster= document.getElementById("detailMoviePoster");
const detailPlayBtn    = document.getElementById("detailPlayBtn");
const detailMovieTitle = document.getElementById("detailMovieTitle");
const watchBtn         = document.getElementById("watchBtn");
const addMyListBtn     = document.getElementById("addMyListBtn");
const detailOverview   = document.getElementById("detailOverview");
const detailRating     = document.getElementById("detailRating");
const aboutCategory    = document.getElementById("aboutCategory");
const aboutRuntime     = document.getElementById("aboutRuntime");
const aboutAdult       = document.getElementById("aboutAdult");
const aboutImdb        = document.getElementById("aboutImdb");
const genresName       = document.getElementById("genresName");
const actorsList       = document.getElementById("actorsList");
const commentInput     = document.getElementById("commentInput");
const commentBtn       = document.getElementById("commentBtn");
const commentsList     = document.getElementById("commentsList");
const similarWrapper   = document.getElementById("similarSwiperWrapper");

// ─── Modal (bootstrap) ────────────────────────────────────────────────────────
const modalEl        = document.getElementById("playModal");
const modal          = modalEl ? new bootstrap.Modal(modalEl) : null;
const closeBtn       = modalEl?.querySelector(".playModal__close");
const trailerIframe  = modalEl?.querySelector(".playModal__iframe");
const prescreen      = modalEl?.querySelector(".playModal__prescreen");
const heroScreen     = modalEl?.querySelector(".playModal__hero");
const modalTitle     = modalEl?.querySelector(".playModal__title");
const modalPoster    = modalEl?.querySelector(".playModal__poster");
const inModalPlayBtn = modalEl?.querySelector(".playModal__playbtn");

let activeTrailerUrl = "";

function resetModal() {
  if (trailerIframe) trailerIframe.src = "";
  if (prescreen)     prescreen.style.display = "";
  heroScreen?.classList.add("playModal__hero--hidden");
}

// ─── Convert any YouTube URL to embed format ──────────────────────────────────
function toEmbedUrl(url) {
  if (!url) return "";
  try {
    const u = new URL(url);
    // Already an embed URL
    if (u.pathname.startsWith("/embed/")) return url;
    // youtu.be/ID
    if (u.hostname === "youtu.be") {
      return `https://www.youtube.com/embed${u.pathname}`;
    }
    // youtube.com/watch?v=ID
    const v = u.searchParams.get("v");
    if (v) return `https://www.youtube.com/embed/${v}`;
  } catch { /* not a valid URL, return as-is */ }
  return url;
}

function openPlayModal(title, posterSrc, trailerUrl) {
  activeTrailerUrl = toEmbedUrl(trailerUrl);
  resetModal();
  if (modalTitle)  modalTitle.textContent = title || "";
  if (modalPoster) modalPoster.src = posterSrc || "";
  modal?.show();
}

inModalPlayBtn?.addEventListener("click", () => {
  if (prescreen) prescreen.style.display = "none";
  heroScreen?.classList.remove("playModal__hero--hidden");
  if (trailerIframe) trailerIframe.src = activeTrailerUrl;
});

closeBtn?.addEventListener("click", () => { resetModal(); modal?.hide(); });
modalEl?.addEventListener("hidden.bs.modal", resetModal);

// ─── Populate movie ───────────────────────────────────────────────────────────
function populateMovie(movie) {
  document.title = movie.title || "Detail";
  if (detailBannerImg)   detailBannerImg.src  = movie.cover_url || "";
  if (movieName)         movieName.textContent = movie.title || "";
  if (movieCategoryName) movieCategoryName.textContent = movie.category?.name || "";
  if (detailMoviePoster) detailMoviePoster.src = movie.cover_url || "";
  if (detailMovieTitle)  detailMovieTitle.textContent  = movie.title || "";
  if (detailOverview)    detailOverview.textContent = movie.overview || "";
  if (detailRating)      detailRating.innerHTML = `<i class="fa-solid fa-star"></i> ${movie.imdb || "—"}`;
  if (aboutCategory)     aboutCategory.textContent = movie.category?.name || "—";
  if (aboutRuntime)      aboutRuntime.textContent  = movie.run_time_min ? `${movie.run_time_min} min` : "—";
  if (aboutAdult)        aboutAdult.textContent    = movie.adult ? "18+" : "All ages";
  if (aboutImdb)         aboutImdb.textContent     = movie.imdb || "—";
  if (genresName)        genresName.textContent    = movie.category?.name || "";

  // Play button opens modal with fragman
  const trailerUrl = movie.fragman || "";
  detailPlayBtn?.addEventListener("click", () => {
    openPlayModal(movie.title, movie.cover_url, trailerUrl);
  });

  // Watch Link
  watchBtn?.addEventListener("click", () => {
    if (movie.watch_url) window.open(movie.watch_url, "_blank");
    else showToast("Info", "No watch link available.", "info");
  });
}

// ─── Render actors ─────────────────────────────────────────────────────────────
function renderActors(actors) {
  if (!actorsList) return;
  if (!actors?.length) { actorsList.innerHTML = "<p style='color:#888;'>No cast info.</p>"; return; }
  actorsList.innerHTML = actors.map(a => `
    <div class="actor-card">
      <img src="${a.img_url || "../../assets/images/user.png"}" alt="${a.name}" onerror="this.src='../../assets/images/user.png'" />
      <p class="actor-name">${a.name} ${a.surname}</p>
    </div>
  `).join("");
}

// ─── Render comments ──────────────────────────────────────────────────────────
function renderComments(comments, profile, myIds = new Set()) {
  if (!commentsList) return;
  if (!comments?.length) { commentsList.innerHTML = "<p style='color:#666;padding:12px 0;'>No comments yet.</p>"; return; }
  const defaultAvatar = "../../assets/images/user.png";
  commentsList.innerHTML = comments.map(c => {
    const isMine = myIds.has(c.id);
    const avatar = isMine && profile?.img_url ? profile.img_url : defaultAvatar;
    const name   = isMine && profile?.full_name ? profile.full_name : "User";
    return `
    <div class="comment-title" data-comment-id="${c.id}">
      <div class="comment-header">
        <img src="${avatar}" alt="user" class="comment-user-img" onerror="this.src='${defaultAvatar}'" />
        <p class="comment-user-name">${name}</p>
        <span class="comment-date">${new Date(c.created_at).toLocaleDateString()}</span>
      </div>
      <p class="comment-text">${c.comment}</p>
    </div>`;
  }).join("");
}

// ─── Setup comment form ────────────────────────────────────────────────────────
function setupCommentForm(movieId, profile) {
  const avatar = profile?.img_url || "../../assets/images/user.png";
  const name   = profile?.full_name || "User";

  const lsKey = `my_comments_${movieId}`;

  function saveMyCommentId(id) {
    const stored = JSON.parse(localStorage.getItem(lsKey) || "[]");
    stored.push(id);
    localStorage.setItem(lsKey, JSON.stringify(stored));
  }

  commentBtn?.addEventListener("click", async () => {
    const text = commentInput?.value.trim();
    if (!text) return;
    try {
      const res = await commentsService.createComment(movieId, text);
      if (res?.result) {
        commentInput.value = "";
        showToast("Success", "Comment added.", "success");
        const c = res.data;
        saveMyCommentId(c.id);
        const div = document.createElement("div");
        div.className = "comment-title";
        div.dataset.commentId = c.id;
        div.innerHTML = `
          <div class="comment-header">
            <img src="${avatar}" alt="user" class="comment-user-img" onerror="this.src='../../assets/images/user.png'" />
            <p class="comment-user-name">${name}</p>
            <span class="comment-date">${new Date(c.created_at).toLocaleDateString()}</span>
          </div>
          <p class="comment-text">${c.comment}</p>
        `;
        if (commentsList) {
          const empty = commentsList.querySelector(":scope > p");
          if (empty) empty.remove();
          commentsList.appendChild(div);
        }
      } else {
        showToast("Error", res?.message || "Could not post comment.", "error");
      }
    } catch { showToast("Error", "Something went wrong.", "error"); }
  });

  commentInput?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") commentBtn?.click();
  });
}

// ─── Setup favorite button ────────────────────────────────────────────────────
function setupFavButton(movieId, favIds) {
  if (!addMyListBtn) return;
  let isFav = favIds.has(movieId);

  function updateFavBtn() {
    addMyListBtn.textContent = isFav ? "✓" : "+";
    addMyListBtn.classList.toggle("is-added", isFav);
    addMyListBtn.setAttribute("aria-pressed", String(isFav));
  }
  updateFavBtn();

  addMyListBtn.addEventListener("click", async () => {
    try {
      await favoritesService.toggleFavorite(movieId);
      isFav = !isFav;
      updateFavBtn();
      showToast(isFav ? "Added to Favorites" : "Removed from Favorites", isFav ? "Added to your favorites." : "The movie has been removed from your favorites.", isFav ? "success" : "info");
    } catch { showToast("Error", "Could not update favorites.", "error"); }
  });
}

// ─── Render similar movies ────────────────────────────────────────────────────
function renderSimilarMovies(movies, currentId, categoryId, favIds) {
  if (!similarWrapper) return;
  const slides = movies
    .filter(m => m.id !== currentId && m.category?.id === categoryId)
    .slice(0, 12)
    .map(m => {
      const isFav = favIds.has(m.id);
      return `
        <article class="swiper-slide action-card" data-movie-id="${m.id}" data-trailer="${m.fragman || ""}">
          <img src="${m.cover_url || ""}" alt="${m.title}" />
          <span class="category-name">${m.category?.name || ""}</span>
          <h3 class="movie-name">${m.title}</h3>
          <button class="card-play-btn" aria-label="Play movie"><i class="fa-solid fa-play"></i></button>
          <button class="card-fav-btn ${isFav ? "is-favorite" : ""}" aria-label="Favorites">
            <i class="${isFav ? "fa-solid" : "fa-regular"} fa-star"></i>
          </button>
        </article>
      `;
    }).join("");
  similarWrapper.innerHTML = slides;

  // Events on similar cards
  similarWrapper.querySelectorAll(".action-card").forEach(card => {
    const id = Number(card.dataset.movieId);

    card.querySelector(".card-play-btn")?.addEventListener("click", (e) => {
      e.stopPropagation();
      openPlayModal(
        card.querySelector(".movie-name")?.textContent,
        card.querySelector("img")?.src,
        card.dataset.trailer
      );
    });

    card.querySelector(".card-fav-btn")?.addEventListener("click", async (e) => {
      e.stopPropagation();
      const btn  = e.currentTarget;
      const icon = btn.querySelector("i");
      try {
        const res = await favoritesService.toggleFavorite(id);
        if (res) {
          const adding = !btn.classList.contains("is-favorite");
          btn.classList.toggle("is-favorite", adding);
          icon.className = adding ? "fa-solid fa-star" : "fa-regular fa-star";
          const movieTitle = card.querySelector(".movie-name")?.textContent || "Movie";
          showToast(adding ? "Added to Favorites" : "Removed from Favorites", adding ? `"${movieTitle}" has been added to your favorites.` : `"${movieTitle}" has been removed from your favorites.`, adding ? "success" : "info");
        }
      } catch { showToast("Error", "Could not update favorites.", "error"); }
    });

    card.addEventListener("click", () => {
      sessionStorage.setItem("detail_access", "1");
      window.location.href = `./detail.html?id=${id}`;
    });
  });

  // Init Swiper after DOM is ready
  new Swiper(".similarSwiper", {
    direction: "horizontal",
    slidesPerView: 4,
    spaceBetween: 12,
    loop: similarWrapper.querySelectorAll(".swiper-slide").length >= 4,
    speed: 900,
    autoplay: { delay: 3000, disableOnInteraction: false, pauseOnMouseEnter: true },
    grabCursor: true,
    mousewheel: { forceToAxis: true },
    breakpoints: {
      320:  { slidesPerView: 1, spaceBetween: 8 },
      640:  { slidesPerView: 2, spaceBetween: 10 },
      900:  { slidesPerView: 3, spaceBetween: 12 },
      1200: { slidesPerView: 4, spaceBetween: 12 },
    },
  });
}

// ─── Init ─────────────────────────────────────────────────────────────────────
async function init() {
  const params  = new URLSearchParams(window.location.search);
  const movieId = Number(params.get("id"));
  if (!movieId || isNaN(movieId)) {
    window.location.replace("./404.html");
    return;
  }

  showLoading();
  try {
    const [movieRes, commentsRes, favRes, allMoviesRes, profileRes] = await Promise.all([
      moviesService.getMovieById(movieId),
      commentsService.getComments(movieId).catch(() => ({ data: [] })),
      favoritesService.getFavorites().catch(() => ({ data: [] })),
      moviesService.getAllMovies().catch(() => ({ data: [] })),
      profileService.getProfile().catch(() => ({ data: null })),
    ]);

    const movie      = movieRes?.data;
    const comments   = commentsRes?.data || [];
    const favIds     = new Set((favRes?.data || []).map(m => m.id));
    const allMovies  = allMoviesRes?.data || [];
    const profile    = profileRes?.data;

    if (!movie) {
      window.location.replace("./404.html");
      return;
    }

    const myIds = new Set(JSON.parse(localStorage.getItem(`my_comments_${movieId}`) || "[]"));

    populateMovie(movie);
    renderActors(movie.actors);
    renderComments(comments, profile, myIds);
    setupCommentForm(movieId, profile);
    setupFavButton(movieId, favIds);
    renderSimilarMovies(allMovies, movieId, movie.category?.id, favIds);

  } catch (err) {
    console.error(err);
    showToast("Error", "Failed to load movie.", "error");
  } finally {
    hideLoading();
  }
}

init();
initUserBadge();
