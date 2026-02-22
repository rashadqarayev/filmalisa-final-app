import { adminService } from "./services/AdminService.js";
import { setActiveNavItem } from "./util/active.js";

// Check authentication
if (!adminService.isAuthenticated()) {
  window.location.href = "/admin/html/login.html";
}

// Set active navigation
setActiveNavItem(".movieItem");

// Global variables
let currentEditId = null;
let allMovies = [];
let allCategories = [];
let allActors = [];
let currentPage = 1;
let itemsPerPage = 10;
let filteredMovies = [];

// DOM Elements
const moviesTbody = document.getElementById("moviesTbody");
const saveMovieBtn = document.getElementById("saveMovieBtn");
const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
const deleteItemName = document.getElementById("deleteItemName");
const catSelect = document.getElementById("catSelect");
const previewImg = document.getElementById("previewImg");

// Custom multi-select elements
const cmsWrapper = document.getElementById("actorsMultiSelect");
const cmsTrigger = document.getElementById("cmsTrigger");
const cmsTags = document.getElementById("cmsTags");
const cmsDropdown = document.getElementById("cmsDropdown");
const cmsSearch = document.getElementById("cmsSearch");
const cmsList = document.getElementById("cmsList");

// Tracks currently selected actor IDs (Set of numbers)
const selectedActorIds = new Set();

// ============================================
// CUSTOM MULTI-SELECT LOGIC
// ============================================

/** Toggle dropdown open/closed */
function cmsToggle(forceClose = false) {
  if (forceClose || cmsWrapper.classList.contains("open")) {
    cmsWrapper.classList.remove("open");
  } else {
    cmsWrapper.classList.add("open");
    cmsSearch.value = "";
    cmsFilterList("");
    cmsSearch.focus();
  }
}

/** Render the tag chips inside the trigger */
function cmsRenderTags() {
  // Remove all existing tags + placeholder
  cmsTags.innerHTML = "";

  if (selectedActorIds.size === 0) {
    cmsTags.innerHTML = '<span class="cms-placeholder">Select Actors</span>';
    return;
  }

  selectedActorIds.forEach((id) => {
    const actor = allActors.find((a) => a.id === id);
    if (!actor) return;
    const tag = document.createElement("span");
    tag.className = "cms-tag";
    tag.dataset.id = id;
    tag.innerHTML = `${actor.name} ${actor.surname}<span class="cms-tag-remove" data-id="${id}">×</span>`;
    cmsTags.appendChild(tag);
  });
}

/** Update .selected class on list items */
function cmsUpdateListSelection() {
  cmsList.querySelectorAll(".cms-option").forEach((li) => {
    const id = parseInt(li.dataset.id);
    li.classList.toggle("selected", selectedActorIds.has(id));
  });
}

/** Filter list items by search text */
function cmsFilterList(query) {
  const q = query.toLowerCase();
  let visibleCount = 0;
  cmsList.querySelectorAll(".cms-option").forEach((li) => {
    const text = li.textContent.toLowerCase();
    const visible = text.includes(q);
    li.style.display = visible ? "" : "none";
    if (visible) visibleCount++;
  });

  // Show/hide "no results"
  let noResult = cmsList.querySelector(".cms-no-results");
  if (visibleCount === 0) {
    if (!noResult) {
      noResult = document.createElement("li");
      noResult.className = "cms-no-results";
      noResult.textContent = "No actors found";
      cmsList.appendChild(noResult);
    }
    noResult.style.display = "";
  } else if (noResult) {
    noResult.style.display = "none";
  }
}

/** Build full option list from allActors */
function cmsBuildList() {
  cmsList.innerHTML = "";
  allActors.forEach((actor) => {
    const li = document.createElement("li");
    li.className = "cms-option";
    li.dataset.id = actor.id;
    li.textContent = `${actor.name} ${actor.surname}`;
    if (selectedActorIds.has(actor.id)) li.classList.add("selected");

    li.addEventListener("click", (e) => {
      e.stopPropagation();
      const id = parseInt(li.dataset.id);
      if (selectedActorIds.has(id)) {
        selectedActorIds.delete(id);
        li.classList.remove("selected");
      } else {
        selectedActorIds.add(id);
        li.classList.add("selected");
      }
      cmsRenderTags();
    });

    cmsList.appendChild(li);
  });
}

/** Clear all selections */
function cmsClearSelection() {
  selectedActorIds.clear();
  cmsRenderTags();
  cmsUpdateListSelection();
}

// Trigger click → toggle
cmsTrigger.addEventListener("click", (e) => {
  // If user clicked a tag-remove button, handle removal, don't toggle
  const removeBtn = e.target.closest(".cms-tag-remove");
  if (removeBtn) {
    const id = parseInt(removeBtn.dataset.id);
    selectedActorIds.delete(id);
    cmsRenderTags();
    cmsUpdateListSelection();
    return;
  }
  cmsToggle();
});

// Search input
cmsSearch.addEventListener("input", (e) => cmsFilterList(e.target.value));

// Close when clicking outside
document.addEventListener("click", (e) => {
  if (!cmsWrapper.contains(e.target)) {
    cmsToggle(true);
  }
});

// Form inputs
const movieTitleInput = document.getElementById("movieTitle");
const movieOverviewInput = document.getElementById("movieOverview");
const movieCoverInput = document.getElementById("movieCover");
const movieTrailerInput = document.getElementById("movieTrailer");
const movieWatchInput = document.getElementById("movieWatch");
const movieImdbInput = document.getElementById("movieImdb");
const movieRuntimeInput = document.getElementById("movieRuntime");
const movieAdultInput = document.getElementById("movieAdult");

// Bootstrap modals
const editModalElement = document.getElementById("editModal");
const editModal = new bootstrap.Modal(editModalElement);
const deleteModalElement = document.getElementById("deleteModal");
const deleteModal = new bootstrap.Modal(deleteModalElement);

// ============================================
// LOAD DATA FUNCTIONS
// ============================================

/**
 * Load all movies from API
 */
async function loadMovies() {
  try {
    const response = await adminService.movies.getAllMovies();

    console.log("Movies response:", response);

    if (response.result && response.data) {
      allMovies = response.data;
      filteredMovies = [...allMovies];
      currentPage = 1;
      renderMoviesTable();
      renderPagination();
    } else {
      console.error("Failed to load movies:", response.message);
    }
  } catch (error) {
    console.error("Error loading movies:", error);
    adminService.showError("Failed to load movies");
  }
}

/**
 * Load all categories for dropdown
 */
async function loadCategories() {
  try {
    const response = await adminService.categories.getAllCategories();

    if (response.result && response.data) {
      allCategories = response.data;
      renderCategoryOptions(allCategories);
    }
  } catch (error) {
    console.error("Error loading categories:", error);
  }
}

/**
 * Load all actors for selection
 */
async function loadActors() {
  try {
    const response = await adminService.actors.getAllActors();

    if (response.result && response.data) {
      allActors = response.data;
      renderActorOptions(allActors);
    }
  } catch (error) {
    console.error("Error loading actors:", error);
  }
}

// ============================================
// RENDER FUNCTIONS
// ============================================

/**
 * Render movies table
 */
function renderMoviesTable() {
  if (!moviesTbody) return;

  // Get paginated movies
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedMovies = filteredMovies.slice(startIndex, endIndex);

  if (paginatedMovies.length === 0) {
    moviesTbody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; padding: 20px;">
          No movies found
        </td>
      </tr>
    `;
    return;
  }

  moviesTbody.innerHTML = paginatedMovies
    .map(
      (movie) => `
    <tr class="table-row">
      <th scope="row">${movie.id}</th>
      <td class="title-movie">
        <img src="${
          movie.cover_url || "../../assets/images/table-inner-img.svg"
        }" 
             alt="${movie.title}" 
             style="width: 40px; height: 60px; object-fit: cover; border-radius: 4px;">
        <p>${movie.title}</p>
      </td>
      <td>${truncateText(movie.overview, 50)}</td>
      <td>${movie.category?.name || "N/A"}</td>
      <td><span>${movie.imdb || "N/A"}</span></td>
      <td class="operation">
        <i class="fa-solid fa-pen-to-square edit-btn" 
           style="cursor: pointer; margin-right: 10px;"
           onclick="editMovie(${movie.id})"
           title="Edit"></i>
        <i class="fa-solid fa-trash delete-btn" 
           style="cursor: pointer;" 
           onclick="showDeleteModal(${movie.id}, '${escapeHtml(movie.title)}')"
           title="Delete"></i>
      </td>
    </tr>
  `
    )
    .join("");
}

/**
 * Render category options in dropdown
 */
function renderCategoryOptions(categories) {
  if (!catSelect) return;

  catSelect.innerHTML = `
    <option value="">Select Category</option>
    ${categories
      .map(
        (cat) => `
      <option value="${cat.id}">${cat.name}</option>
    `
      )
      .join("")}
  `;
}

/**
 * Render actor options in custom multi-select
 */
function renderActorOptions(actors) {
  cmsBuildList();
  cmsRenderTags();
}

/**
 * Render pagination controls
 */
function renderPagination() {
  const totalPages = Math.ceil(filteredMovies.length / itemsPerPage);

  // Find or create pagination container
  let paginationContainer = document.getElementById("pagination-container");

  if (!paginationContainer) {
    // Create pagination container after the table
    const section = document.querySelector(".section");
    paginationContainer = document.createElement("div");
    paginationContainer.id = "pagination-container";
    paginationContainer.style.cssText = `
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      margin-top: 20px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 8px;
    `;
    section.appendChild(paginationContainer);
  }

  if (totalPages <= 1) {
    paginationContainer.innerHTML = "";
    return;
  }

  // Generate pagination HTML
  paginationContainer.innerHTML = `
    <div style="color: #fff;">
      Showing ${(currentPage - 1) * itemsPerPage + 1} to ${Math.min(
    currentPage * itemsPerPage,
    filteredMovies.length
  )} of ${filteredMovies.length} movies
    </div>
    <div style="display: flex; gap: 10px; align-items: center;">
      <button 
        onclick="goToPage(${currentPage - 1})" 
        ${currentPage === 1 ? "disabled" : ""}
        style="padding: 8px 12px; background: ${
          currentPage === 1 ? "#444" : "#6c5ce7"
        }; color: #fff; border: none; border-radius: 4px; cursor: ${
    currentPage === 1 ? "not-allowed" : "pointer"
  };">
        Previous
      </button>
      
      <div style="display: flex; gap: 5px;">
        ${generatePageButtons(currentPage, totalPages)}
      </div>
      
      <button 
        onclick="goToPage(${currentPage + 1})" 
        ${currentPage === totalPages ? "disabled" : ""}
        style="padding: 8px 12px; background: ${
          currentPage === totalPages ? "#444" : "#6c5ce7"
        }; color: #fff; border: none; border-radius: 4px; cursor: ${
    currentPage === totalPages ? "not-allowed" : "pointer"
  };">
        Next
      </button>
      
      <select 
        onchange="changeItemsPerPage(this.value)" 
        style="padding: 8px; background: #2d3436; color: #fff; border: 1px solid #6c5ce7; border-radius: 4px; cursor: pointer;">
        <option value="5" ${
          itemsPerPage === 5 ? "selected" : ""
        }>5 per page</option>
        <option value="10" ${
          itemsPerPage === 10 ? "selected" : ""
        }>10 per page</option>
        <option value="20" ${
          itemsPerPage === 20 ? "selected" : ""
        }>20 per page</option>
        <option value="50" ${
          itemsPerPage === 50 ? "selected" : ""
        }>50 per page</option>
      </select>
    </div>
  `;
}

/**
 * Generate page number buttons
 */
function generatePageButtons(current, total) {
  let buttons = "";
  const maxButtons = 5;
  let startPage = Math.max(1, current - Math.floor(maxButtons / 2));
  let endPage = Math.min(total, startPage + maxButtons - 1);

  if (endPage - startPage < maxButtons - 1) {
    startPage = Math.max(1, endPage - maxButtons + 1);
  }

  // First page button
  if (startPage > 1) {
    buttons += `
      <button onclick="goToPage(1)" style="padding: 8px 12px; background: #2d3436; color: #fff; border: 1px solid #6c5ce7; border-radius: 4px; cursor: pointer;">
        1
      </button>
    `;
    if (startPage > 2) {
      buttons += '<span style="color: #fff; padding: 0 5px;">...</span>';
    }
  }

  // Page number buttons
  for (let i = startPage; i <= endPage; i++) {
    buttons += `
      <button 
        onclick="goToPage(${i})" 
        style="padding: 8px 12px; background: ${
          i === current ? "#6c5ce7" : "#2d3436"
        }; color: #fff; border: 1px solid #6c5ce7; border-radius: 4px; cursor: pointer; font-weight: ${
      i === current ? "bold" : "normal"
    };">
        ${i}
      </button>
    `;
  }

  // Last page button
  if (endPage < total) {
    if (endPage < total - 1) {
      buttons += '<span style="color: #fff; padding: 0 5px;">...</span>';
    }
    buttons += `
      <button onclick="goToPage(${total})" style="padding: 8px 12px; background: #2d3436; color: #fff; border: 1px solid #6c5ce7; border-radius: 4px; cursor: pointer;">
        ${total}
      </button>
    `;
  }

  return buttons;
}

/**
 * Go to specific page
 */
function goToPage(page) {
  const totalPages = Math.ceil(filteredMovies.length / itemsPerPage);

  if (page < 1 || page > totalPages) return;

  currentPage = page;
  renderMoviesTable();
  renderPagination();

  // Scroll to top of table
  document.querySelector(".section")?.scrollIntoView({ behavior: "smooth" });
}

/**
 * Change items per page
 */
function changeItemsPerPage(value) {
  itemsPerPage = parseInt(value);
  currentPage = 1;
  renderMoviesTable();
  renderPagination();
}

// ============================================
// MODAL FUNCTIONS
// ============================================

/**
 * Open create modal (reset form)
 */
function openCreateModal() {
  currentEditId = null;
  resetForm();
  editModal.show();
}

/**
 * Open edit modal with movie data
 */
async function editMovie(movieId) {
  currentEditId = movieId;

  try {
    const response = await adminService.movies.getMovieById(movieId);

    if (response.result && response.data) {
      const movie = response.data;

      // Fill form with movie data
      movieTitleInput.value = movie.title || "";
      movieOverviewInput.value = movie.overview || "";
      movieCoverInput.value = movie.cover_url || "";
      movieTrailerInput.value = movie.fragman || "";
      movieWatchInput.value = movie.watch_url || "";
      movieImdbInput.value = movie.imdb || "";
      movieRuntimeInput.value = movie.run_time_min || "";
      movieAdultInput.checked = movie.adult || false;
      catSelect.value = movie.category?.id || "";

      // Pre-select actors in custom multi-select
      cmsClearSelection();
      if (movie.actors && Array.isArray(movie.actors)) {
        movie.actors.forEach((actor) => {
          selectedActorIds.add(actor.id);
        });
        cmsRenderTags();
        cmsUpdateListSelection();
      }

      // Update preview image
      if (previewImg && movie.cover_url) {
        previewImg.src = movie.cover_url;
      }

      editModal.show();
    }
  } catch (error) {
    console.error("Error loading movie:", error);
    adminService.showError("Failed to load movie details");
  }
}

/**
 * Show delete confirmation modal
 */
function showDeleteModal(movieId, movieTitle) {
  currentEditId = movieId;

  if (deleteItemName) {
    deleteItemName.textContent = movieTitle;
  }

  deleteModal.show();
}

/**
 * Reset form to empty state
 */
function resetForm() {
  movieTitleInput.value = "";
  movieOverviewInput.value = "";
  movieCoverInput.value = "";
  movieTrailerInput.value = "";
  movieWatchInput.value = "";
  movieImdbInput.value = "";
  movieRuntimeInput.value = "";
  movieAdultInput.checked = false;
  catSelect.value = "";
  cmsClearSelection();

  if (previewImg) {
    previewImg.src =
      "https://qqcdnpictest.mxplay.com/pic/cc1f9610b1cc638cf9b60f305ee1b4d6/en/2x3/312x468/test_pic1759756606210_badged_1761714017652.webp";
  }
}

// ============================================
// CRUD OPERATIONS
// ============================================

/**
 * Create or Update Movie
 */
async function saveMovie() {
  // Validate required fields
  if (!movieTitleInput.value.trim()) {
    alert("Please enter movie title");
    return;
  }

  if (!catSelect.value) {
    alert("Please select a category");
    return;
  }

  // Get selected actors from custom multi-select
  const selectedActorIdsArray = Array.from(selectedActorIds);

  // Prepare movie data
  const movieData = {
    title: movieTitleInput.value.trim(),
    overview: movieOverviewInput.value.trim(),
    cover_url: movieCoverInput.value.trim(),
    fragman: movieTrailerInput.value.trim(),
    watch_url: movieWatchInput.value.trim(),
    imdb: movieImdbInput.value.trim(),
    run_time_min: parseInt(movieRuntimeInput.value) || 0,
    adult: movieAdultInput.checked,
    category: parseInt(catSelect.value),
    actors: selectedActorIdsArray,
  };

  try {
    let response;

    if (currentEditId) {
      // Update existing movie
      response = await adminService.movies.updateMovie(
        currentEditId,
        movieData
      );
    } else {
      // Create new movie
      response = await adminService.movies.createMovie(movieData);
    }

    if (response.result) {
      adminService.showSuccess(
        currentEditId
          ? "Movie updated successfully!"
          : "Movie created successfully!"
      );

      // Reload movies list
      await loadMovies();

      // Close modal and reset form
      editModal.hide();
      resetForm();
      currentEditId = null;
    } else {
      adminService.showError(response.message || "Failed to save movie");
    }
  } catch (error) {
    console.error("Error saving movie:", error);
    adminService.showError("Failed to save movie");
  }
}

/**
 * Delete Movie
 */
async function deleteMovie() {
  if (!currentEditId) return;

  try {
    const response = await adminService.movies.deleteMovie(currentEditId);

    if (response.result) {
      adminService.showSuccess("Movie deleted successfully!");

      // Reload movies list
      await loadMovies();

      // Reset current edit ID
      currentEditId = null;
    } else {
      adminService.showError(response.message || "Failed to delete movie");
    }
  } catch (error) {
    console.error("Error deleting movie:", error);
    adminService.showError("Failed to delete movie");
  }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Truncate text to specified length
 */
function truncateText(text, maxLength) {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Update preview image when cover URL changes
 */
function updatePreviewImage() {
  if (previewImg && movieCoverInput.value.trim()) {
    previewImg.src = movieCoverInput.value.trim();

    // Handle image load error
    previewImg.onerror = function () {
      this.src =
        "https://qqcdnpictest.mxplay.com/pic/cc1f9610b1cc638cf9b60f305ee1b4d6/en/2x3/312x468/test_pic1759756606210_badged_1761714017652.webp";
    };
  }
}

// ============================================
// EVENT LISTENERS
// ============================================

// Save movie button
if (saveMovieBtn) {
  saveMovieBtn.addEventListener("click", saveMovie);
}

// Confirm delete button
if (confirmDeleteBtn) {
  confirmDeleteBtn.addEventListener("click", deleteMovie);
}

// Update preview when cover URL changes
if (movieCoverInput) {
  movieCoverInput.addEventListener("blur", updatePreviewImage);
}

// Create button in header
document
  .querySelector(".create-btn")
  ?.addEventListener("click", openCreateModal);

// Reset form when modal is closed
if (editModalElement) {
  editModalElement.addEventListener("hidden.bs.modal", () => {
    if (!currentEditId) {
      resetForm();
    }
  });
}

// Logout handler
document.querySelector(".logout-text")?.addEventListener("click", () => {
  if (confirm("Are you sure you want to logout?")) {
    adminService.auth.logout();
    window.location.href = "/admin/html/login.html";
  }
});

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener("DOMContentLoaded", async () => {
  console.log("Movies page initialized");

  // Load all data
  await Promise.all([loadMovies(), loadCategories(), loadActors()]);
});

// Make functions available globally for onclick handlers
window.editMovie = editMovie;
window.showDeleteModal = showDeleteModal;
window.goToPage = goToPage;
window.changeItemsPerPage = changeItemsPerPage;

/**
 * Search/Filter movies
 */
function searchMovies(query) {
  if (!query || query.trim() === "") {
    filteredMovies = [...allMovies];
  } else {
    const searchTerm = query.toLowerCase();
    filteredMovies = allMovies.filter(
      (movie) =>
        movie.title.toLowerCase().includes(searchTerm) ||
        movie.overview?.toLowerCase().includes(searchTerm) ||
        movie.category?.name.toLowerCase().includes(searchTerm) ||
        movie.imdb?.toLowerCase().includes(searchTerm)
    );
  }

  currentPage = 1;
  renderMoviesTable();
  renderPagination();
}

// Add search input to the page if it doesn't exist
function addSearchInput() {
  const header = document.querySelector(".header");
  const leftSection = header?.querySelector(".leftHeaderSection");

  if (leftSection && !document.getElementById("movie-search")) {
    const searchContainer = document.createElement("div");
    searchContainer.style.cssText = "margin-top: 10px;";
    searchContainer.innerHTML = `
      <input 
        type="text" 
        id="movie-search" 
        placeholder="Search movies by title, overview, category, IMDB..." 
        style="
          width: 100%;
          max-width: 400px;
          padding: 10px 15px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(108, 92, 231, 0.3);
          border-radius: 8px;
          color: #fff;
          font-size: 14px;
        "
      />
    `;
    leftSection.appendChild(searchContainer);

    // Add search event listener
    const searchInput = document.getElementById("movie-search");
    searchInput?.addEventListener("input", (e) => {
      searchMovies(e.target.value);
    });
  }
}
