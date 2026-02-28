function setupHeroSlider() {
	const carousel = document.getElementById('heroCarousel');
	if (!carousel) return;

	const slides = Array.from(carousel.querySelectorAll('.hero-slide'));
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

function setupCardControls(cardSelector) {
	const cards = Array.from(document.querySelectorAll(cardSelector));

	cards.forEach((card) => {
		const legacyStar = card.querySelector('img[alt="star"]');
		if (legacyStar) legacyStar.remove();

		if (!card.querySelector('.card-play-btn')) {
			const playButton = document.createElement('button');
			playButton.type = 'button';
			playButton.className = 'card-play-btn';
			playButton.setAttribute('aria-label', 'Play movie');
			playButton.innerHTML = '<i class="fa-solid fa-play"></i>';
			card.appendChild(playButton);
		}

		if (!card.querySelector('.card-fav-btn')) {
			const favoriteButton = document.createElement('button');
			favoriteButton.type = 'button';
			favoriteButton.className = 'card-fav-btn';
			favoriteButton.setAttribute('aria-label', 'Add to favorites');
			favoriteButton.setAttribute('aria-pressed', 'false');
			favoriteButton.innerHTML = '<i class="fa-regular fa-star"></i>';

			favoriteButton.addEventListener('click', (event) => {
				event.stopPropagation();

				const isFavorite = favoriteButton.classList.toggle('is-favorite');
				favoriteButton.setAttribute('aria-pressed', String(isFavorite));
				favoriteButton.setAttribute('aria-label', isFavorite ? 'Remove from favorites' : 'Add to favorites');
				favoriteButton.innerHTML = isFavorite
					? '<i class="fa-solid fa-star"></i>'
					: '<i class="fa-regular fa-star"></i>';
			});

			card.appendChild(favoriteButton);
		}
	});
}

document.addEventListener('DOMContentLoaded', () => {
	setupCardControls('.action-card, .comedy-card');
	setupHeroSlider();
	setupCardSlider('actionWrapper', '.action-card', 2600);
	setupCardSlider('comedyWrapper', '.comedy-card', 3000);
});
