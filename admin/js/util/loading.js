
export function showLoading() {
  const loader = document.getElementById("page-loader");
  if (loader) loader.classList.remove("hidden");
}


export function hideLoading() {
  const loader = document.getElementById("page-loader");
  if (loader) loader.classList.add("hidden");
}
