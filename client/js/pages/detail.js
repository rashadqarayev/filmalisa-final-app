import { moviesService }   from "../services/MoviesService.js";
import { favoritesService } from "../services/FavoritesService.js";
import { commentsService }  from "../services/CommentsService.js";
import { profileService }   from "../services/ProfileService.js";
import { showToast }        from "../utils/toast.js";
import { initUserBadge }    from "../utils/userBadge.js";

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
const aboutYear        = document.getElementById("aboutYear");
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
  url = url.trim();

  // ── 1. Extract YouTube video ID from ANY known format ─────────────────────
  // Covers: youtube.com/watch?v=, youtu.be/, youtube.com/embed/,
  //         youtube.com/shorts/, youtube.com/v/, m.youtube.com,
  //         music.youtube.com, with or without https://, with extra params
  const ytMatch = url.match(
    /(?:youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/
  );
  if (ytMatch) {
    return `https://www.youtube.com/embed/${ytMatch[1]}?rel=0&modestbranding=1&enablejsapi=1`;
  }

  // ── 2. Already a bare video ID (11 chars, no slashes) ────────────────────
  if (/^[A-Za-z0-9_-]{11}$/.test(url)) {
    return `https://www.youtube.com/embed/${url}?rel=0&modestbranding=1&enablejsapi=1`;
  }

  // ── 3. Non-YouTube URL (Vimeo, direct mp4, etc.) — return as-is ─────────
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
  if (detailRating) {
    const _score  = parseFloat(movie.imdb) || 0;
    const _filled = Math.round(_score / 2);
    let _stars = "";
    for (let i = 1; i <= 5; i++) {
      _stars += `<i class="fa-${i <= _filled ? "solid" : "regular"} fa-star"></i>`;
    }
    detailRating.innerHTML = _stars + `<span class="detail-rating__score">${_score ? _score.toFixed(1) : "—"}</span>`;
  }
  if (aboutCategory)     aboutCategory.textContent = movie.category?.name || "—";
  if (aboutRuntime)      aboutRuntime.textContent  = movie.run_time_min ? `${movie.run_time_min} min` : "—";
  if (aboutAdult)        aboutAdult.textContent    = movie.adult ? "18+" : "All ages";
  if (aboutImdb)         aboutImdb.textContent     = movie.imdb || "—";
  if (aboutYear)         aboutYear.textContent     = movie.created_at ? new Date(movie.created_at).getFullYear() : "—";
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
      <img src="${a.img_url || "../../assets/images/user.svg"}" alt="${a.name}" onerror="this.onerror=null;this.src='../../assets/images/user.svg'" />
      <p class="actor-name">${a.name} ${a.surname}</p>
    </div>
  `).join("");
}

// ─── Render comments ──────────────────────────────────────────────────────────
function renderComments(comments, profile, myIds = new Set()) {
  if (!commentsList) return;
  if (!comments?.length) { commentsList.innerHTML = "<p style='color:#666;padding:12px 0;'>No comments yet.</p>"; return; }
  const defaultAvatar = "../../assets/images/sarkhanmuellim.svg";
  commentsList.innerHTML = comments.map(c => {
    const isMine = (profile?.id && c.user_id && Number(c.user_id) === Number(profile.id))
                || myIds.has(c.id);
    const avatar = isMine
      ? (profile?.img_url || defaultAvatar)
      : (c.user?.img_url || defaultAvatar);
    const name = isMine
      ? (profile?.full_name || "User")
      : (c.user?.full_name || "User");
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

// ─── Emoji picker ─────────────────────────────────────────────────────────────
function setupEmojiPicker() {
  const btn   = document.getElementById("emojiPickerBtn");
  const panel = document.getElementById("emojiPickerPanel");
  const grid  = document.getElementById("emojiGrid");
  if (!btn || !panel || !grid || !commentInput) return;

  const EMOJIS = [
    "😀","😁","😂","🤣","😃","😄","😅","😆",
    "😇","😉","😊","🙂","🙃","😋","😌","😍",
    "🥰","😘","😗","😙","😚","😜","🤪","😝",
    "😛","🤑","😎","🤓","🧐","🥸","🤩","😏",
    "😒","😞","😔","😟","😕","🙁","☹️","😣",
    "😖","😫","😩","🥺","😢","😭","😤","😠",
    "😡","🤬","😳","🥵","🥶","😱","😨","😰",
    "😥","😓","🤗","🤭","🫢","🫣","🤫","🤔",
    "🫡","🤐","🤨","😐","😑","😶","😶‍🌫️","😬",
    "🙄","😯","😦","😧","😮","😲","🥱","😴",
    "🤤","😪","😵","🫥","🤯","🤠","🥳","🥸",
    "😷","🤒","🤕","🤢","🤮","🤧","🥴","😈",
    "👿","💀","☠️","💩","🤡","👹","👺","👻",
    "👽","👾","🤖","😺","😸","😹","😻","😼",
    "😽","🙀","😿","😾","👋","🤚","🖐️","✋",
    "🖖","🫱","🫲","🫳","🫴","👌","🤌","🤏",
    "✌️","🤞","🫰","🤟","🤘","🤙","👈","👉",
    "👆","🖕","👇","☝️","🫵","👍","👎","✊",
    "👊","🤛","🤜","👏","🙌","🫶","👐","🤲",
    "🤝","🙏","❤️","🧡","💛","💚","💙","💜",
    "🖤","🤍","🤎","💔","❣️","💕","💞","💓",
    "💗","💖","💘","💝","💟","☮️","✝️","☯️",
    "🔥","⭐","🌟","💫","✨","🎉","🎊","🎈",
    "🎁","🏆","🥇","🙌","💯","✅","❌","⚡",
  ];

  grid.innerHTML = EMOJIS.map(e =>
    `<button type="button" data-emoji="${e}">${e}</button>`
  ).join("");

  grid.addEventListener("click", (e) => {
    const emoji = e.target.closest("[data-emoji]")?.dataset.emoji;
    if (!emoji) return;
    const start = commentInput.selectionStart;
    const end   = commentInput.selectionEnd;
    const val   = commentInput.value;
    commentInput.value = val.slice(0, start) + emoji + val.slice(end);
    commentInput.setSelectionRange(start + emoji.length, start + emoji.length);
    commentInput.focus();
    panel.hidden = true;
  });

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    panel.hidden = !panel.hidden;
  });

  document.addEventListener("click", (e) => {
    if (!panel.hidden && !panel.contains(e.target) && e.target !== btn) {
      panel.hidden = true;
    }
  });
}

// ─── Setup comment form ────────────────────────────────────────────────────────
function setupCommentForm(movieId, profile) {
  setupEmojiPicker();
  const avatar = profile?.img_url || "../../assets/images/user.svg";
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
            <img src="${avatar}" alt="user" class="comment-user-img" onerror="this.onerror=null;this.src='../../assets/images/user.svg'" />
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
          <div class="card-meta">
            <span class="category-name">${m.category?.name || ""}</span>
            <div class="card-imdb">${(() => { const s = parseFloat(m.imdb)||0; const f = Math.round(s/2); return Array.from({length:5},(_,i)=>`<i class="fa-${i<f?'solid':'regular'} fa-star"></i>`).join('')+'<span class="card-imdb__score">'+(s?s.toFixed(1):'—')+'</span>'; })()}</div>
            <h3 class="movie-name">${m.title}</h3>
          </div>
          <button class="card-play-btn" aria-label="Play movie"><i class="fa-solid fa-play"></i></button>
          <button class="card-fav-btn ${isFav ? "is-favorite" : ""}" aria-label="Favorites">
            <i class="${isFav ? "fa-solid" : "fa-regular"} fa-heart"></i>
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
      sessionStorage.setItem("detail_access", "1");
      window.location.href = `./detail.html?id=${id}`;
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
          icon.className = adding ? "fa-solid fa-heart" : "fa-regular fa-heart";
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
  const swiper = new Swiper(".similarSwiper", {
    direction: "horizontal",
    slidesPerView: "auto",
    spaceBetween: 22,
    loop: false,
    cssMode: true,
    speed: 900,
    autoplay: { delay: 3000, disableOnInteraction: false, pauseOnMouseEnter: true },
    grabCursor: true,
    mousewheel: { forceToAxis: true },
  });

  document.querySelector(".similar-scroll-btn--prev")?.addEventListener("click", () => swiper.slidePrev());
  document.querySelector(".similar-scroll-btn--next")?.addEventListener("click", () => swiper.slideNext());

  // Update button visibility based on swiper position
  function updateSimilarBtns() {
    const prevBtn = document.querySelector(".similar-scroll-btn--prev");
    const nextBtn = document.querySelector(".similar-scroll-btn--next");
    if (prevBtn) {
      prevBtn.style.display = swiper.isBeginning ? "none" : "";
    }
    if (nextBtn) {
      nextBtn.style.display = swiper.isEnd ? "none" : "";
    }
  }
  swiper.on("slideChange", updateSimilarBtns);
  swiper.on("reachBeginning", updateSimilarBtns);
  swiper.on("reachEnd", updateSimilarBtns);
  swiper.on("fromEdge", updateSimilarBtns);
  updateSimilarBtns();
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