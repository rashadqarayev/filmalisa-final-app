# Admin API Client Documentation

A comprehensive JavaScript HTTP client and API services for the Filmalisa Admin Panel.

## 📁 File Structure

```
admin/js/
├── HttpClient.js      - Core HTTP client with request handling
├── ApiServices.js     - Service classes for all API endpoints
├── AdminAPI.js        - Main API interface combining all services
└── examples.js        - Practical usage examples
```

## 🚀 Quick Start

### 1. Include Scripts in HTML

Add these scripts in your HTML files in this order:

```html
<!-- Core HTTP Client -->
<script src="/admin/js/HttpClient.js"></script>

<!-- API Services -->
<script src="/admin/js/ApiServices.js"></script>

<!-- Main API Interface -->
<script src="/admin/js/AdminAPI.js"></script>

<!-- Your page-specific code -->
<script src="/admin/js/your-page.js"></script>
```

### 2. Basic Usage

```javascript
// All API calls use the global 'adminAPI' instance

// Example: Login
async function login() {
  const response = await adminAPI.auth.login("admin@admin.com", "1234");
  console.log(response);
}

// Example: Get dashboard stats
async function loadDashboard() {
  const response = await adminAPI.dashboard.getStatistics();
  console.log(response.data);
}
```

## 📚 API Reference

### Authentication Service

```javascript
// Login
await adminAPI.auth.login(email, password);

// Logout
adminAPI.auth.logout();

// Check if authenticated
const isAuth = adminAPI.isAuthenticated();
```

### Profile Service

```javascript
// Get profile
const profile = await adminAPI.profile.getProfile();

// Update profile
await adminAPI.profile.updateProfile({
  full_name: "New Name",
  email: "new@email.com",
  password: "newpassword", // optional
});
```

### Users Service

```javascript
// Get all users
const users = await adminAPI.users.getAllUsers();

// Get user by ID
const user = await adminAPI.users.getUserById(userId);

// Delete user
await adminAPI.users.deleteUser(userId);
```

### Categories Service

```javascript
// Get all categories
const categories = await adminAPI.categories.getAllCategories();

// Create category
await adminAPI.categories.createCategory("Action");

// Update category
await adminAPI.categories.updateCategory(categoryId, "New Name");

// Delete category
await adminAPI.categories.deleteCategory(categoryId);
```

### Actors Service

```javascript
// Get all actors
const actors = await adminAPI.actors.getAllActors();

// Create actor
await adminAPI.actors.createActor({
  name: "Brad",
  surname: "Pitt",
  img_url: "https://example.com/image.jpg",
});

// Update actor
await adminAPI.actors.updateActor(actorId, {
  name: "Bradley",
  surname: "Pitt",
  img_url: "https://example.com/new-image.jpg",
});

// Delete actor
await adminAPI.actors.deleteActor(actorId);
```

### Movies Service

```javascript
// Get all movies
const movies = await adminAPI.movies.getAllMovies();

// Get movie by ID
const movie = await adminAPI.movies.getMovieById(movieId);

// Create movie
await adminAPI.movies.createMovie({
  title: "Movie Title",
  cover_url: "https://example.com/cover.jpg",
  fragman: "https://youtube.com/embed/trailer",
  watch_url: "https://example.com/watch",
  adult: false,
  run_time_min: 120,
  imdb: "8.5",
  category: 1, // category ID
  actors: [1, 2, 3], // array of actor IDs
  overview: "Movie description...",
});

// Update movie
await adminAPI.movies.updateMovie(movieId, movieData);

// Delete movie
await adminAPI.movies.deleteMovie(movieId);

// Search movies
await adminAPI.movies.searchMovies("search query");
```

### Contacts Service

```javascript
// Get all contacts
const contacts = await adminAPI.contacts.getAllContacts();

// Delete contact
await adminAPI.contacts.deleteContact(contactId);
```

### Comments Service

```javascript
// Get all comments
const comments = await adminAPI.comments.getAllComments();

// Get movie comments
const movieComments = await adminAPI.comments.getMovieComments(movieId);

// Delete comment
await adminAPI.comments.deleteComment(movieId, commentId);
```

### Dashboard Service

```javascript
// Get statistics
const stats = await adminAPI.dashboard.getStatistics();
// Returns: { users, movies, actors, categories, comments, contacts, favorites }
```

## 🎯 Common Patterns

### 1. Loading Data with Error Handling

```javascript
async function loadData() {
  try {
    adminAPI.toggleLoading(true);

    const response = await adminAPI.movies.getAllMovies();

    if (response.result) {
      // Success - update UI
      displayMovies(response.data);
    } else {
      adminAPI.showError(response.message);
    }
  } catch (error) {
    const message = adminAPI.handleError(error, "Failed to load data");
    adminAPI.showError(message);
  } finally {
    adminAPI.toggleLoading(false);
  }
}
```

### 2. Creating with Form Data

```javascript
async function handleSubmit(event) {
  event.preventDefault();

  const formData = {
    name: document.getElementById("name").value,
    surname: document.getElementById("surname").value,
    img_url: document.getElementById("img_url").value,
  };

  try {
    adminAPI.toggleLoading(true);

    const response = await adminAPI.actors.createActor(formData);

    if (response.result) {
      adminAPI.showSuccess("Actor created successfully!");
      document.getElementById("form").reset();
      loadActors(); // Refresh the list
    }
  } catch (error) {
    adminAPI.showError("Failed to create actor");
  } finally {
    adminAPI.toggleLoading(false);
  }
}
```

### 3. Deleting with Confirmation

```javascript
async function handleDelete(id) {
  if (!confirm("Are you sure you want to delete this item?")) {
    return;
  }

  try {
    adminAPI.toggleLoading(true);

    const response = await adminAPI.categories.deleteCategory(id);

    if (response.result) {
      adminAPI.showSuccess("Deleted successfully!");
      loadCategories(); // Refresh the list
    }
  } catch (error) {
    adminAPI.showError("Failed to delete item");
  } finally {
    adminAPI.toggleLoading(false);
  }
}
```

### 4. Updating Data

```javascript
async function handleUpdate(id) {
  const newName = prompt("Enter new name:");

  if (!newName) return;

  try {
    adminAPI.toggleLoading(true);

    const response = await adminAPI.categories.updateCategory(id, newName);

    if (response.result) {
      adminAPI.showSuccess("Updated successfully!");
      loadCategories(); // Refresh the list
    }
  } catch (error) {
    adminAPI.showError("Failed to update item");
  } finally {
    adminAPI.toggleLoading(false);
  }
}
```

## 🔐 Authentication Flow

```javascript
// 1. Login page (login.html)
document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const response = await adminAPI.auth.login(email, password);

  if (response.result) {
    window.location.href = "/admin/html/dashboard.html";
  }
});

// 2. Protected pages - check auth on load
document.addEventListener("DOMContentLoaded", () => {
  if (!adminAPI.isAuthenticated()) {
    window.location.href = "/admin/html/login.html";
  }

  // Load page data
  loadPageData();
});

// 3. Logout
function handleLogout() {
  if (confirm("Are you sure you want to logout?")) {
    adminAPI.auth.logout(); // Removes token and redirects
  }
}
```

## 🌐 Language Support

```javascript
// Set language for API requests
adminAPI.setLanguage("en"); // English
adminAPI.setLanguage("az"); // Azerbaijani
```

## 📊 Response Structure

All API responses follow this structure:

```javascript
{
  message: "Ok", // or error message
  data: {}, // response data (null for deletions)
  result: true // boolean indicating success/failure
}
```

## ⚙️ Configuration

### Change Base URL

```javascript
// In HttpClient.js constructor
constructor(baseURL) {
  this.baseURL = baseURL || "https://your-api-url.com/api/filmalisa";
}
```

### Custom Headers

```javascript
// Add custom headers to a request
await adminAPI.http.get("/endpoint", {
  headers: {
    "Custom-Header": "value",
  },
});
```

## 🛠️ Helper Methods

```javascript
// Toggle loading state
adminAPI.toggleLoading(true); // Show
adminAPI.toggleLoading(false); // Hide

// Show success message
adminAPI.showSuccess("Operation successful!");

// Show error message
adminAPI.showError("Operation failed!");

// Handle errors
const message = adminAPI.handleError(error, "Default message");

// Get current token
const token = adminAPI.getToken();

// Check authentication
const isAuth = adminAPI.isAuthenticated();
```

## 📝 Best Practices

1. **Always use try-catch blocks** for async operations
2. **Show loading states** during API calls
3. **Handle errors gracefully** with user-friendly messages
4. **Validate data** before sending to API
5. **Confirm destructive actions** (delete operations)
6. **Refresh data** after create/update/delete operations
7. **Check authentication** on protected pages
8. **Use async/await** instead of promises

## 🐛 Debugging

```javascript
// Enable console logging
// All errors are automatically logged to console

// Check if token exists
console.log("Token:", adminAPI.getToken());

// Check authentication status
console.log("Is Authenticated:", adminAPI.isAuthenticated());

// Log full response
const response = await adminAPI.movies.getAllMovies();
console.log("Response:", response);
```

## 📦 Example: Complete Page Implementation

```javascript
// movies.js
document.addEventListener("DOMContentLoaded", async () => {
  // Check auth
  if (!adminAPI.isAuthenticated()) {
    window.location.href = "/admin/html/login.html";
    return;
  }

  // Load initial data
  await loadMovies();
  await loadCategories();
  await loadActors();

  // Setup event listeners
  document
    .getElementById("create-form")
    .addEventListener("submit", handleCreate);
  document.getElementById("search").addEventListener("input", handleSearch);
});

async function loadMovies() {
  try {
    adminAPI.toggleLoading(true);
    const response = await adminAPI.movies.getAllMovies();

    if (response.result) {
      renderMovies(response.data);
    }
  } catch (error) {
    adminAPI.showError("Failed to load movies");
  } finally {
    adminAPI.toggleLoading(false);
  }
}

function renderMovies(movies) {
  const container = document.getElementById("movies-container");
  container.innerHTML = movies
    .map(
      (movie) => `
    <div class="movie-card">
      <img src="${movie.cover_url}" alt="${movie.title}">
      <h3>${movie.title}</h3>
      <p>IMDB: ${movie.imdb}</p>
      <button onclick="editMovie(${movie.id})">Edit</button>
      <button onclick="deleteMovie(${movie.id})">Delete</button>
    </div>
  `
    )
    .join("");
}
```

## 🔗 Links

- [API Documentation](./API_DOCUMENTATION.md)
- [Postman Collection](../Filmalisa%20-%20Movies%20Api's%20-%20Stage%202%20Final.postman_collection.json)

## 📄 License

This project is part of the Filmalisa Admin Panel.
