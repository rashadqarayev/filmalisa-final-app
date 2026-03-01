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

// ── Navigate to detail ─────────────────────────────────────────────────────────
function goToDetail(movieId) {
  sessionStorage.setItem("detail_access", "1");
  window.location.href = "./detail.html?id=" + movieId;
}

// ── Hero carousel builder ──────────────────────────────────────────────────────
function buildHeroSlides(movies) {
  const carousel = document.getElementById("heroCarousel");
  if (!carousel || !movies.length) return;

  carousel.innerHTML = movies.slice(0, 5).map(function(m, i) {
    return "<div class=\"hero-slide " + (i === 0 ? "is-active" : "") + "\" data-id=\"" + m.id + "\">" +
      "<img src=\"" + (m.cover_url || "../../assets/images/home.carusel.jpg") + "\" alt=\"" + m.title + "\" />" +
      "<div class=\"hero-content\">" +
      "<span class=\"hero-genre\">" + (m.category && m.category.name ? m.category.name : "") + "</span>" +
      "<div class=\"hero-stars\">&#9733;&#9733;&#9733;&#9733;&#9733;</div>" +
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
    " <span class=\"section__chevron\">&gt;</span></h2></div>" +
    "<div class=\"action__wrapper\" id=\"" + wrapperId + "\">" +
    category.movies.map(function(m) {
      const isFav = favIds.has(Number(m.id));
      return "<article class=\"action-card\" data-id=\"" + m.id + "\">" +
        "<img src=\"" + (m.cover_url || "../../assets/images/home.film1.jpg") + "\" alt=\"" + m.title + "\" loading=\"lazy\" />" +
        "<p class=\"category-name\">" + category.name + "</p>" +
        "<p class=\"movie-name\">" + m.title + "</p>" +
        "<button type=\"button\" class=\"card-fav-btn " + (isFav ? "is-favorite" : "") + "\" data-id=\"" + m.id + "\" aria-pressed=\"" + isFav + "\">" +
        "<i class=\"fa-" + (isFav ? "solid" : "regular") + " fa-star\"></i></button>" +
        "<button type=\"button\" class=\"card-play-btn\" data-id=\"" + m.id + "\">" +
        "<i class=\"fa-solid fa-play\"></i></button>" +
        "</article>";
    }).join("") + "</div>";

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
          btn.querySelector("i").className = "fa-" + (isFav ? "solid" : "regular") + " fa-star";
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

function setupCardSlider(wrapperId, cardSelector, interval = 3000) {
	const wrapper = document.getElementById(wrapperId);
	if (!wrapper) return;

	const cards = Array.from(wrapper.querySelectorAll(cardSelector));
	if (cards.length <= 1) return;

	let currentIndex = 0;
	let timer = null;

	function moveTo(index, smooth = true) {
		currentIndex = (index + cards.length) % cards.length;

		wrapper.scrollTo({
			left: cards[currentIndex].offsetLeft,
			behavior: smooth ? 'smooth' : 'auto'
		});
	}

	function startAuto() {
		stopAuto();
		timer = setInterval(() => {
			moveTo(currentIndex + 1);
		}, interval);
	}

	function stopAuto() {
		if (!timer) return;
		clearInterval(timer);
		timer = null;
	}

	wrapper.addEventListener('mouseenter', stopAuto);
	wrapper.addEventListener('mouseleave', startAuto);

	window.addEventListener('resize', () => moveTo(currentIndex, false));

  moveTo(0, false);
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

    // Hero: ilk 5 film
    const heroMovies = categories.flatMap(function(c) { return c.movies || []; }).slice(0, 5);
    buildHeroSlides(heroMovies);
    setupHeroSlider();

    // Statik seksiyaları sil, dinamik çək
    const main = document.querySelector(".page-main");
    main.querySelectorAll("section:not(#section1)").forEach(function(s) { s.remove(); });

    categories.forEach(function(category) {
      const result = buildCategorySection(category, favIds);
      if (!result) return;
      main.appendChild(result.section);
      setupCardSlider(result.wrapperId, ".action-card", 2600);
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
