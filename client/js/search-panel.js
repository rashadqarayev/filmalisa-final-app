function setupCardControls(cardSelector) {
  const cards = Array.from(document.querySelectorAll(cardSelector));

  cards.forEach((card) => {
    if (!card.querySelector('.card-play-btn')) {
      const playButton = document.createElement('button');
      playButton.type = 'button';
      playButton.className = 'card-play-btn';
      playButton.setAttribute('aria-label', 'Play movie');
      playButton.innerHTML = '<i class="fa-solid fa-play"></i>';
      card.appendChild(playButton);
    }

    const favoriteButton = card.querySelector('.card-fav-btn');
    if (!favoriteButton) return;

    favoriteButton.setAttribute('aria-pressed', 'false');
    favoriteButton.setAttribute('aria-label', 'Add to favorites');

    favoriteButton.addEventListener('click', (event) => {
      event.stopPropagation();

      const isFavorite = favoriteButton.classList.toggle('is-favorite');
      favoriteButton.setAttribute('aria-pressed', String(isFavorite));
      favoriteButton.setAttribute('aria-label', isFavorite ? 'Remove from favorites' : 'Add to favorites');
      favoriteButton.innerHTML = isFavorite
        ? '<i class="fa-solid fa-star"></i>'
        : '<i class="fa-regular fa-star"></i>';
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setupCardControls('.action-card');
});
