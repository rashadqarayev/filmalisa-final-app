/**
 * Practical Examples of Using Admin API
 * This file demonstrates real-world usage patterns
 */

import { AdminService } from "../services/AdminService.js";

// ============================================
// 1. LOGIN EXAMPLE
// ============================================
export async function handleLogin(event) {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const response = await AdminService.auth.login(email, password);

    console.log("response", response);

    if (response.result) {
      AdminService.showSuccess("Login successful!");
      // redirect to dashboard
      window.location.href = "/admin/html/dashboard.html";
    } else {
      AdminService.showError(response.message || "Login failed");
    }
  } catch (error) {
    const message = AdminService.handleError(
      error,
      "Login failed. Please try again."
    );
    AdminService.showError(message);
  } finally {
    AdminService.toggleLoading(false);
  }
}

// ============================================
// 2. DASHBOARD STATISTICS EXAMPLE
// ============================================

// ============================================
// 3. CATEGORIES MANAGEMENT EXAMPLE
// ============================================
async function loadCategories() {
  try {
    AdminService.toggleLoading(true);

    const response = await AdminService.categories.getAllCategories();

    if (response.result) {
      const categories = response.data;
      renderCategoriesTable(categories);
    }
  } catch (error) {
    AdminService.showError("Failed to load categories");
  } finally {
    AdminService.toggleLoading(false);
  }
}

function renderCategoriesTable(categories) {
  const tbody = document.getElementById("categories-tbody");
  tbody.innerHTML = "";

  categories.forEach((category) => {
    const row = `
      <tr>
        <td>${category.id}</td>
        <td>${category.name}</td>
        <td>${new Date(category.created_at).toLocaleDateString()}</td>
        <td>
          <button onclick="editCategory(${category.id}, '${
      category.name
    }')">Edit</button>
          <button onclick="deleteCategory(${category.id})">Delete</button>
        </td>
      </tr>
    `;
    tbody.innerHTML += row;
  });
}

async function createCategory() {
  const name = document.getElementById("category-name").value;

  if (!name.trim()) {
    AdminService.showError("Category name is required");
    return;
  }

  try {
    AdminService.toggleLoading(true);

    const response = await AdminService.categories.createCategory(name);

    if (response.result) {
      AdminService.showSuccess("Category created successfully!");
      document.getElementById("category-name").value = "";
      loadCategories(); // Reload the list
    }
  } catch (error) {
    AdminService.showError("Failed to create category");
  } finally {
    AdminService.toggleLoading(false);
  }
}

async function updateCategory(id, newName) {
  try {
    AdminService.toggleLoading(true);

    const response = await AdminService.categories.updateCategory(id, newName);

    if (response.result) {
      AdminService.showSuccess("Category updated successfully!");
      loadCategories(); // Reload the list
    }
  } catch (error) {
    AdminService.showError("Failed to update category");
  } finally {
    AdminService.toggleLoading(false);
  }
}

async function deleteCategory(id) {
  if (!confirm("Are you sure you want to delete this category?")) {
    return;
  }

  try {
    AdminService.toggleLoading(true);

    const response = await AdminService.categories.deleteCategory(id);

    if (response.result) {
      AdminService.showSuccess("Category deleted successfully!");
      loadCategories(); // Reload the list
    }
  } catch (error) {
    AdminService.showError("Failed to delete category");
  } finally {
    AdminService.toggleLoading(false);
  }
}

// ============================================
// 4. ACTORS MANAGEMENT EXAMPLE
// ============================================
async function loadActors() {
  try {
    AdminService.toggleLoading(true);

    const response = await AdminService.actors.getAllActors();

    if (response.result) {
      const actors = response.data;
      renderActorsTable(actors);
    }
  } catch (error) {
    AdminService.showError("Failed to load actors");
  } finally {
    AdminService.toggleLoading(false);
  }
}

function renderActorsTable(actors) {
  const tbody = document.getElementById("actors-tbody");
  tbody.innerHTML = "";

  actors.forEach((actor) => {
    const row = `
      <tr>
        <td>${actor.id}</td>
        <td><img src="${actor.img_url}" alt="${
      actor.name
    }" width="50" height="50"></td>
        <td>${actor.name}</td>
        <td>${actor.surname}</td>
        <td>${new Date(actor.created_at).toLocaleDateString()}</td>
        <td>
          <button onclick="editActor(${actor.id})">Edit</button>
          <button onclick="deleteActor(${actor.id})">Delete</button>
        </td>
      </tr>
    `;
    tbody.innerHTML += row;
  });
}

async function createActor(event) {
  event.preventDefault();

  const actorData = {
    name: document.getElementById("actor-name").value,
    surname: document.getElementById("actor-surname").value,
    img_url: document.getElementById("actor-img-url").value,
  };

  try {
    AdminService.toggleLoading(true);

    const response = await AdminService.actors.createActor(actorData);

    if (response.result) {
      AdminService.showSuccess("Actor created successfully!");
      document.getElementById("actor-form").reset();
      loadActors(); // Reload the list
    }
  } catch (error) {
    AdminService.showError("Failed to create actor");
  } finally {
    AdminService.toggleLoading(false);
  }
}

async function deleteActor(id) {
  if (!confirm("Are you sure you want to delete this actor?")) {
    return;
  }

  try {
    AdminService.toggleLoading(true);

    const response = await AdminService.actors.deleteActor(id);

    if (response.result) {
      AdminService.showSuccess("Actor deleted successfully!");
      loadActors(); // Reload the list
    }
  } catch (error) {
    AdminService.showError("Failed to delete actor");
  } finally {
    AdminService.toggleLoading(false);
  }
}

// ============================================
// 5. MOVIES MANAGEMENT EXAMPLE
// ============================================
async function loadMovies() {
  try {
    AdminService.toggleLoading(true);

    const response = await AdminService.movies.getAllMovies();

    if (response.result) {
      const movies = response.data;
      renderMoviesGrid(movies);
    }
  } catch (error) {
    AdminService.showError("Failed to load movies");
  } finally {
    AdminService.toggleLoading(false);
  }
}

function renderMoviesGrid(movies) {
  const container = document.getElementById("movies-container");
  container.innerHTML = "";

  movies.forEach((movie) => {
    const card = `
      <div class="movie-card">
        <img src="${movie.cover_url}" alt="${movie.title}">
        <h3>${movie.title}</h3>
        <p>IMDB: ${movie.imdb}</p>
        <p>Runtime: ${movie.run_time_min} min</p>
        <button onclick="viewMovie(${movie.id})">View</button>
        <button onclick="editMovie(${movie.id})">Edit</button>
        <button onclick="deleteMovie(${movie.id})">Delete</button>
      </div>
    `;
    container.innerHTML += card;
  });
}

async function createMovie(event) {
  event.preventDefault();

  // Get selected actor IDs
  const actorSelects = document.querySelectorAll(".actor-select:checked");
  const actors = Array.from(actorSelects).map((select) =>
    parseInt(select.value)
  );

  const movieData = {
    title: document.getElementById("movie-title").value,
    cover_url: document.getElementById("movie-cover").value,
    fragman: document.getElementById("movie-trailer").value,
    watch_url: document.getElementById("movie-watch").value,
    adult: document.getElementById("movie-adult").checked,
    run_time_min: parseInt(document.getElementById("movie-runtime").value),
    imdb: document.getElementById("movie-imdb").value,
    category: parseInt(document.getElementById("movie-category").value),
    actors: actors,
    overview: document.getElementById("movie-overview").value,
  };

  try {
    AdminService.toggleLoading(true);

    const response = await AdminService.movies.createMovie(movieData);

    if (response.result) {
      AdminService.showSuccess("Movie created successfully!");
      document.getElementById("movie-form").reset();
      loadMovies(); // Reload the list
    }
  } catch (error) {
    AdminService.showError("Failed to create movie");
  } finally {
    AdminService.toggleLoading(false);
  }
}

async function deleteMovie(id) {
  if (!confirm("Are you sure you want to delete this movie?")) {
    return;
  }

  try {
    AdminService.toggleLoading(true);

    const response = await AdminService.movies.deleteMovie(id);

    if (response.result) {
      AdminService.showSuccess("Movie deleted successfully!");
      loadMovies(); // Reload the list
    }
  } catch (error) {
    AdminService.showError("Failed to delete movie");
  } finally {
    AdminService.toggleLoading(false);
  }
}

async function searchMovies() {
  const query = document.getElementById("search-input").value;

  if (!query.trim()) {
    loadMovies(); // Load all movies if search is empty
    return;
  }

  try {
    AdminService.toggleLoading(true);

    const response = await AdminService.movies.searchMovies(query);

    if (response.result) {
      renderMoviesGrid(response.data);
    }
  } catch (error) {
    AdminService.showError("Failed to search movies");
  } finally {
    AdminService.toggleLoading(false);
  }
}

// ============================================
// 6. USERS MANAGEMENT EXAMPLE
// ============================================
async function loadUsers() {
  try {
    AdminService.toggleLoading(true);

    const response = await AdminService.users.getAllUsers();

    if (response.result) {
      const users = response.data;
      renderUsersTable(users);
    }
  } catch (error) {
    AdminService.showError("Failed to load users");
  } finally {
    AdminService.toggleLoading(false);
  }
}

function renderUsersTable(users) {
  const tbody = document.getElementById("users-tbody");
  tbody.innerHTML = "";

  users.forEach((user) => {
    const row = `
      <tr>
        <td>${user.id}</td>
        <td>${user.full_name}</td>
        <td>${user.email}</td>
        <td>${
          user.img_url
            ? '<img src="' + user.img_url + '" width="40" height="40">'
            : "No image"
        }</td>
        <td>${new Date(user.created_at).toLocaleDateString()}</td>
        <td>
          <button onclick="viewUser(${user.id})">View</button>
        </td>
      </tr>
    `;
    tbody.innerHTML += row;
  });
}

// ============================================
// 7. COMMENTS MANAGEMENT EXAMPLE
// ============================================
async function loadComments() {
  try {
    AdminService.toggleLoading(true);

    const response = await AdminService.comments.getAllComments();

    if (response.result) {
      const comments = response.data;
      renderCommentsTable(comments);
    }
  } catch (error) {
    AdminService.showError("Failed to load comments");
  } finally {
    AdminService.toggleLoading(false);
  }
}

function renderCommentsTable(comments) {
  const tbody = document.getElementById("comments-tbody");
  tbody.innerHTML = "";

  comments.forEach((comment) => {
    const row = `
      <tr>
        <td>${comment.id}</td>
        <td>${comment.movie.title}</td>
        <td>${comment.comment}</td>
        <td>${new Date(comment.created_at).toLocaleDateString()}</td>
        <td>
          <button onclick="deleteComment(${comment.movie.id}, ${
      comment.id
    })">Delete</button>
        </td>
      </tr>
    `;
    tbody.innerHTML += row;
  });
}

async function deleteComment(movieId, commentId) {
  if (!confirm("Are you sure you want to delete this comment?")) {
    return;
  }

  try {
    AdminService.toggleLoading(true);

    const response = await AdminService.comments.deleteComment(
      movieId,
      commentId
    );

    if (response.result) {
      AdminService.showSuccess("Comment deleted successfully!");
      loadComments(); // Reload the list
    }
  } catch (error) {
    AdminService.showError("Failed to delete comment");
  } finally {
    AdminService.toggleLoading(false);
  }
}

// ============================================
// 8. CONTACTS MANAGEMENT EXAMPLE
// ============================================
async function loadContacts() {
  try {
    AdminService.toggleLoading(true);

    const response = await AdminService.contacts.getAllContacts();

    if (response.result) {
      const contacts = response.data;
      renderContactsTable(contacts);
    }
  } catch (error) {
    AdminService.showError("Failed to load contacts");
  } finally {
    AdminService.toggleLoading(false);
  }
}

function renderContactsTable(contacts) {
  const tbody = document.getElementById("contacts-tbody");
  tbody.innerHTML = "";

  contacts.forEach((contact) => {
    const row = `
      <tr>
        <td>${contact.id}</td>
        <td>${contact.full_name}</td>
        <td>${contact.email}</td>
        <td>${contact.reason}</td>
        <td>${new Date(contact.created_at).toLocaleDateString()}</td>
        <td>
          <button onclick="deleteContact(${contact.id})">Delete</button>
        </td>
      </tr>
    `;
    tbody.innerHTML += row;
  });
}

async function deleteContact(id) {
  if (!confirm("Are you sure you want to delete this contact?")) {
    return;
  }

  try {
    AdminService.toggleLoading(true);

    const response = await AdminService.contacts.deleteContact(id);

    if (response.result) {
      AdminService.showSuccess("Contact deleted successfully!");
      loadContacts(); // Reload the list
    }
  } catch (error) {
    AdminService.showError("Failed to delete contact");
  } finally {
    AdminService.toggleLoading(false);
  }
}

// ============================================
// 9. PROFILE MANAGEMENT EXAMPLE
// ============================================
async function loadProfile() {
  try {
    const response = await AdminService.profile.getProfile();

    if (response.result) {
      const profile = response.data;

      // Update profile UI
      document.getElementById("profile-name").textContent = profile.full_name;
      document.getElementById("profile-email").textContent = profile.email;

      if (profile.img_url) {
        document.getElementById("profile-img").src = profile.img_url;
      }
    }
  } catch (error) {
    console.error("Failed to load profile");
  }
}

// ============================================
// 10. LOGOUT EXAMPLE
// ============================================
function handleLogout() {
  if (confirm("Are you sure you want to logout?")) {
    AdminService.auth.logout();
  }
}

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener("DOMContentLoaded", () => {
  // Check authentication
  if (
    !AdminService.isAuthenticated() &&
    !window.location.pathname.includes("login.html")
  ) {
    window.location.href = "/admin/html/login.html";
  }

  // Set language (optional)
  AdminService.setLanguage("en"); // or 'az'
});
