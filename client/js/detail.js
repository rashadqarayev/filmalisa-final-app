const similarSwiperEl = document.querySelector('.similarSwiper');
const similarSlideCount = document.querySelectorAll('.similarSwiper .swiper-slide').length;
const autoplayDelay = Math.max(1200, similarSlideCount * 350);

if (similarSwiperEl) {
  similarSwiperEl.setAttribute('dir', 'ltr');
}

new Swiper('.similarSwiper', {
  direction: 'horizontal',
  initialSlide: 0,
  slidesPerView: 'auto',
  spaceBetween: 5,
  slidesOffsetBefore: 8,
  loop: similarSlideCount > 1,
  speed: 900,
  autoplay: {
    delay: autoplayDelay,
    disableOnInteraction: false,
    pauseOnMouseEnter: true,
    reverseDirection: false,
  },
  grabCursor: true,
  mousewheel: {
    forceToAxis: true,
    invert: false,
  },
  on: {
    init(swiper) {
      if (swiper.params.loop) {
        swiper.slideToLoop(0, 0, false);
      } else {
        swiper.slideTo(0, 0, false);
      }
    },
  },
});

const watchBtn = document.querySelector(".watchBtn");
const modalEl = document.getElementById("playModal");
const modal = new bootstrap.Modal(modalEl);
const closeBtn = modalEl.querySelector(".playModal__close");
const detailMovieImg = document.querySelector(".detailMovieImg");
const detailPlayBtn = document.querySelector(".detail-play-btn");
const addMyListBtn = document.querySelector(".addMyListBtn");
const trailerIframe = modalEl.querySelector(".playModal__iframe");
const defaultTrailerId = "6ZfuNTqbHE8";
const trailerVideoIds = [
  "5PSNL1qE6VY",
  "6ZfuNTqbHE8",
  "TcMBFSGVi1c",
  "QwievZ1Tx-8",
  "xjDjIWPwcPU",
  "sj9J2ecsSpo",
  "hA6hldpSTF8",
  "mqqft2x_Aa4",
];

function buildEmbedUrl(videoId) {
  return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=1`;
}

let activeTrailerUrl = buildEmbedUrl(defaultTrailerId);

function closePlayModal() {
  if (trailerIframe) {
    trailerIframe.src = "";
  }
  modal.hide();
}

closeBtn.addEventListener("click",closePlayModal);

function openPlayModal() {
  if (trailerIframe) {
    trailerIframe.src = activeTrailerUrl;
  }
  modal.show();
}

if (detailPlayBtn) {
  detailPlayBtn.addEventListener("click", () => {
    activeTrailerUrl = buildEmbedUrl(defaultTrailerId);
    openPlayModal();
  });
}

document.querySelectorAll(".action-card").forEach((card, index) => {
  const videoId = trailerVideoIds[index % trailerVideoIds.length];
  card.dataset.trailerId = videoId;

  const cardPlayBtn = card.querySelector(".card-play-btn");
  if (!cardPlayBtn) return;

  cardPlayBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    activeTrailerUrl = buildEmbedUrl(card.dataset.trailerId || defaultTrailerId);
    openPlayModal();
  });
});

if (modalEl) {
  modalEl.addEventListener("hidden.bs.modal", () => {
    if (trailerIframe) {
      trailerIframe.src = "";
    }
  });
}

if (addMyListBtn) {
  addMyListBtn.addEventListener("click", () => {
    const isAdded = addMyListBtn.classList.toggle("is-added");
    addMyListBtn.textContent = isAdded ? "✓" : "+";
    addMyListBtn.setAttribute("aria-pressed", String(isAdded));
  });
}

// ===== Similar movie card — star toggle =====
document.querySelectorAll(".card-fav-btn").forEach(btn => {
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    const icon = btn.querySelector("i");
    const isFav = btn.classList.toggle("is-favorite");
    if (isFav) {
      icon.classList.remove("fa-regular");
      icon.classList.add("fa-solid");
    } else {
      icon.classList.remove("fa-solid");
      icon.classList.add("fa-regular");
    }
  });
});