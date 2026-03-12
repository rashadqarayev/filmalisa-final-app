import { truncateText, escapeHtml } from "../../utils/helpers.js";

const moviesTbody = document.getElementById("moviesTbody");

export function renderMoviesTable(pageItems) {
  if (!moviesTbody) return;

  if (!pageItems || pageItems.length === 0) {
    moviesTbody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align:center;padding:20px;">No movies found</td>
      </tr>`;
    return;
  }

  moviesTbody.innerHTML = pageItems
    .map(
      (movie) => `
      <tr class="table-row">
        <th scope="row">${movie.id}</th>
        <td class="title-movie">
          <img src="${
            movie.cover_url?.startsWith("http")
              ? movie.cover_url
              : "../../assets/images/table-inner-img.svg"
          }"
               alt="${movie.title}"
               style="width:40px;height:60px;object-fit:cover;border-radius:4px;">
          <p>${movie.title}</p>
        </td>
        <td style="max-width:220px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${truncateText(movie.overview, 50)}</td>
        <td>${movie.category?.name || "N/A"}</td>
        <td><span>${movie.imdb || "N/A"}</span></td>
        <td class="operation">
          <button class="action-trigger" onclick="toggleActionMenu(this, event)">
            <i class="fa-solid fa-ellipsis-vertical"></i>
          </button>
          <div class="action-menu">
            <button class="action-menu-item" onclick="showOverviewModal(${movie.id}); closeAllActionMenus()">
              <i class="fa-regular fa-eye"></i>
              <span>View</span>
            </button>
            <button class="action-menu-item" onclick="editMovie(${movie.id}); closeAllActionMenus()">
              <i class="fa-solid fa-pen-to-square"></i>
              <span>Edit</span>
            </button>
            <button class="action-menu-item action-menu-item--delete" data-id="${movie.id}" data-title="${escapeHtml(movie.title)}" onclick="showDeleteModal(this.dataset.id, this.dataset.title); closeAllActionMenus()">
              <i class="fa-solid fa-trash"></i>
              <span>Delete</span>
            </button>
          </div>
        </td>
      </tr>`
    )
    .join("");
}

export function renderCategoryOptions(categories) {
  const catSelect = document.getElementById("catSelect");
  if (!catSelect) return;
  catSelect.innerHTML = `
    <option value="">Select Category</option>
    ${categories
      .map((cat) => `<option value="${cat.id}">${cat.name}</option>`)
      .join("")}
  `;
}