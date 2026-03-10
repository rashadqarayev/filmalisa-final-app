import { categoriesService } from "../services/CategoriesService.js";
import { favoritesService }  from "../services/FavoritesService.js";
import { showToast }         from "../utils/toast.js";
import { initUserBadge }     from "../utils/userBadge.js";

function showLoading() {
  const loader = document.getElementById("page-loader");
  if (loader) loader.classList.remove("hidden");
}

function hideLoading() {
  const loader = document.getElementById("page-loader");
  if (loader) loader.classList.add("hidden");
}

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
  return '<div class="card-imdb">' + stars + '<span class="card-imdb__score">' + (score ? score.toFixed(1) : "\u2014") + '</span></div>';
}

// ── Navigate to detail ─────────────────────────────────────────────────────────
function goToDetail(movieId) {
  sessionStorage.setItem("detail_access", "1");
  window.location.href = "./detail.html?id=" + movieId;
}

// ── Hero carousel builder ──────────────────────────────────────────────────────
function buildHeroSlides(movies) {
  const carousel = document.getElementById("heroCarousel");
  if (!carousel || !movies.length) return;

  carousel.innerHTML = movies.map(function(m, i) {
    return "<div class=\"hero-slide " + (i === 0 ? "is-active" : "") + "\" data-id=\"" + m.id + "\">" +
      "<img src=\"" + (m.cover_url || "../../assets/images/home.carusel.jpg") + "\" alt=\"" + m.title + "\" />" +
      "<div class=\"hero-content\">" +
      "<span class=\"hero-genre\">" + (m.category && m.category.name ? m.category.name : "") + "</span>" +
      "<div class=\"hero-stars\">" + imdbStars(m.imdb) + "</div>" +
      "<h1 class=\"hero-title\">" + m.title + "</h1>" +
      "<p class=\"hero-desc\">" + (m.description || "").slice(0, 180) + "</p>" +
      "<button class=\"watch-btn\" data-id=\"" + m.id + "\">Watch now</button>" +
      "</div></div>";
  }).join("");

  carousel.querySelectorAll(".watch-btn").forEach(function(btn) {
    btn.addEventListener("click", function() { goToDetail(btn.dataset.id); });
  });
}

// ── Category section builder ───────────────────────────────────────────────────
function buildCategorySection(category, favIds) {
  if (!category.movies || !category.movies.length) return null;

  const wrapperId = "cat-" + category.id;
  const section   = document.createElement("section");
  section.className = "section section--action";

  section.innerHTML =
    "<div class=\"section__header\"><h2 class=\"section__title\">" + category.name +
    " <span class=\"section__chevron\"><i class=\"fa-solid fa-chevron-right\"></i></span></h2></div>" +
    "<div class=\"scroll-row\">" +
    "<button class=\"scroll-btn scroll-btn--prev\" aria-label=\"Previous\"><i class=\"fa-solid fa-chevron-left\"></i></button>" +
    "<div class=\"action__wrapper\" id=\"" + wrapperId + "\">" +
    category.movies.map(function(m) {
      const isFav = favIds.has(Number(m.id));
      return "<article class=\"action-card\" data-id=\"" + m.id + "\">" +
        "<img src=\"" + (m.cover_url || "../../assets/images/home.film1.jpg") + "\" alt=\"" + m.title + "\" loading=\"lazy\" />" +
        "<p class=\"category-name\">" + category.name + "</p>" +
        imdbStars(m.imdb) +
        "<p class=\"movie-name\">" + m.title + "</p>" +
        "<button type=\"button\" class=\"card-fav-btn " + (isFav ? "is-favorite" : "") + "\" data-id=\"" + m.id + "\" aria-pressed=\"" + isFav + "\">" +
        "<i class=\"fa-" + (isFav ? "solid" : "regular") + " fa-heart\"></i></button>" +
        "<button type=\"button\" class=\"card-play-btn\" data-id=\"" + m.id + "\">" +
        "<i class=\"fa-solid fa-play\"></i></button>" +
        "</article>";
    }).join("") + "</div>" +
    "<button class=\"scroll-btn scroll-btn--next\" aria-label=\"Next\"><i class=\"fa-solid fa-chevron-right\"></i></button>" +
    "</div>";

  // card click → detail
  section.querySelectorAll(".action-card").forEach(function(card) {
    card.addEventListener("click", function(e) {
      if (e.target.closest(".card-fav-btn") || e.target.closest(".card-play-btn")) return;
      goToDetail(card.dataset.id);
    });
  });

  // play → detail
  section.querySelectorAll(".card-play-btn").forEach(function(btn) {
    btn.addEventListener("click", function() { goToDetail(btn.dataset.id); });
  });

  // fav → API
  section.querySelectorAll(".card-fav-btn").forEach(function(btn) {
    btn.addEventListener("click", async function(e) {
      e.stopPropagation();
      try {
        const res = await favoritesService.toggleFavorite(btn.dataset.id);
        if (res) {
          const isFav = btn.classList.toggle("is-favorite");
          btn.setAttribute("aria-pressed", String(isFav));
          btn.querySelector("i").className = "fa-" + (isFav ? "solid" : "regular") + " fa-heart";
          const movieName = btn.closest(".action-card").querySelector(".movie-name").textContent;
          if (isFav) {
            showToast("Added to Favorites", "\"" + movieName + "\" added to your favorites.", "success");
          } else {
            showToast("Removed from Favorites", "\"" + movieName + "\" has been removed from your favorites.", "info");
          }
        }
      } catch (err) {
        showToast("Error", "Could not update favorites.", "error");
      }
    });
  });

  return { section: section, wrapperId: wrapperId };
}

// ── Hero slider ────────────────────────────────────────────────────────────────
function setupHeroSlider() {
  const carousel = document.getElementById("heroCarousel");
  if (!carousel) return;

  const slides = Array.from(carousel.querySelectorAll(".hero-slide"));
	if (slides.length === 0) return;

	let currentIndex = 0;
	let timer = null;

	function render(nextIndex) {
		const normalized = (nextIndex + slides.length) % slides.length;
		const prevIndex = currentIndex;

		slides.forEach((slide, index) => {
			slide.classList.remove('is-active', 'is-prev');

			if (index === normalized) {
				slide.classList.add('is-active');
			} else if (index === prevIndex && normalized !== prevIndex) {
				slide.classList.add('is-prev');
			}
		});

		currentIndex = normalized;
	}

	render(0);

	if (slides.length <= 1) return;

	function startAuto() {
		stopAuto();
		timer = setInterval(() => {
			render(currentIndex + 1);
		}, 4000);
	}

	function stopAuto() {
		if (!timer) return;
		clearInterval(timer);
		timer = null;
	}

	carousel.addEventListener('mouseenter', stopAuto);
	carousel.addEventListener('mouseleave', startAuto);

	startAuto();
}

function setupCardSlider(wrapperId, interval = 3000) {
	const wrapper = document.getElementById(wrapperId);
	if (!wrapper) return;

	const scrollRow = wrapper.closest('.scroll-row');
	if (!scrollRow) return;

	const prevBtn = scrollRow.querySelector('.scroll-btn--prev');
	const nextBtn = scrollRow.querySelector('.scroll-btn--next');

	const cards = Array.from(wrapper.querySelectorAll('.action-card'));

	// Hide buttons & skip auto-scroll if 4 or fewer cards
	if (cards.length <= 4) {
		if (prevBtn) prevBtn.style.display = 'none';
		if (nextBtn) nextBtn.style.display = 'none';
		return;
	}

	let autoTimer   = null;
	let currentIdx  = 0;

	function getPageSize() {
		const cardWidth = cards[0].offsetWidth + parseInt(getComputedStyle(cards[0]).marginRight || 0);
		return Math.max(1, Math.floor(wrapper.clientWidth / cardWidth));
	}

	function getFirstVisibleIndex() {
		const sl = wrapper.scrollLeft;
		let best = 0, bestDiff = Infinity;
		cards.forEach((c, i) => {
			const diff = Math.abs(c.offsetLeft - sl);
			if (diff < bestDiff) { bestDiff = diff; best = i; }
		});
		return best;
	}

  function scrollToCard(index) {
    let targetIdx = index;
    if (index < 0) {
      targetIdx = cards.length - 1;
    } else if (index >= cards.length) {
      targetIdx = 0;
    }
    currentIdx = targetIdx;
    wrapper.scrollTo({ left: cards[targetIdx].offsetLeft, behavior: 'smooth' });
  }

  function autoNext() {
    const next = currentIdx + 1;
    scrollToCard(next);
  }

	function startAuto() {
		stopAuto();
		autoTimer = setInterval(autoNext, interval);
	}

	function stopAuto() {
		if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
	}

	function updateButtons() {
		const scrollLeft = wrapper.scrollLeft;
		const maxScroll  = wrapper.scrollWidth - wrapper.clientWidth;
		if (prevBtn) {
			prevBtn.style.opacity       = scrollLeft > 4 ? '1' : '0';
			prevBtn.style.pointerEvents = scrollLeft > 4 ? 'auto' : 'none';
		}
		if (nextBtn) {
			nextBtn.style.opacity       = scrollLeft < maxScroll - 4 ? '1' : '0';
			nextBtn.style.pointerEvents = scrollLeft < maxScroll - 4 ? 'auto' : 'none';
		}
		scrollRow.classList.toggle('has-overflow-left',  scrollLeft > 4);
		scrollRow.classList.toggle('has-overflow-right', scrollLeft < maxScroll - 4);
	}

  if (prevBtn) prevBtn.addEventListener('click', () => {
    stopAuto();
    scrollToCard(getFirstVisibleIndex() - 1);
    startAuto();
  });
  if (nextBtn) nextBtn.addEventListener('click', () => {
    stopAuto();
    scrollToCard(getFirstVisibleIndex() + 1);
    startAuto();
  });

	// Pause auto-scroll on hover
	wrapper.addEventListener('mouseenter', stopAuto);
	wrapper.addEventListener('mouseleave', startAuto);

	wrapper.addEventListener('scroll', updateButtons, { passive: true });
	window.addEventListener('resize', updateButtons);

	updateButtons();
	startAuto();
}

// ── Init ───────────────────────────────────────────────────────────────────────
async function init() {
  showLoading();
  try {
    const [catRes, favRes] = await Promise.all([
      categoriesService.getAllCategories(),
      favoritesService.getFavorites().catch(function() { return { data: [] }; })
    ]);

    const categories = (catRes && catRes.data) ? catRes.data : [];
    const favIds     = new Set((favRes && favRes.data ? favRes.data : []).map(function(m) { return Number(m.id); }));

    // Hero: Thriller xaric butun filmler
    const heroMovies = categories
      .filter(function(c) { return !c.name || c.name.toLowerCase() !== 'thriller'; })
      .flatMap(function(c) { return c.movies || []; });
    buildHeroSlides(heroMovies);
    setupHeroSlider();

    // Statik seksiyaları sil, dinamik çək
    const main = document.querySelector(".page-main");
    main.querySelectorAll("section:not(#section1)").forEach(function(s) { s.remove(); });
    main.querySelectorAll(".categories-container").forEach(function(c) { c.remove(); });

    const container = document.createElement("div");
    container.className = "categories-container";
    main.appendChild(container);

    categories.forEach(function(category) {
      const result = buildCategorySection(category, favIds);
      if (!result) return;
      container.appendChild(result.section);
      setupCardSlider(result.wrapperId, 2800);
    });
    hideLoading();
  } catch (err) {
    showToast("Error", "Could not load movies.", "error");
    hideLoading();
    console.error(err);
  }
}

document.addEventListener("DOMContentLoaded", init);
initUserBadge();

