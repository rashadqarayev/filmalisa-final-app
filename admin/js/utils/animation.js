export function animateCounter(element, targetValue, duration = 1000) {
  if (!element) return;

  const endValue = parseInt(targetValue) || 0;
  if (endValue === 0) {
    element.textContent = "0";
    return;
  }

  let startTime = null;

  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    const progress = timestamp - startTime;
    const percentage = Math.min(progress / duration, 1);

    // Ease-out effect (slows down at the end)
    const easeOut = 1 - Math.pow(1 - percentage, 3);

    element.textContent = Math.floor(easeOut * endValue);

    if (progress < duration) {
      window.requestAnimationFrame(step);
    } else {
      element.textContent = endValue;
    }
  }

  window.requestAnimationFrame(step);
}
