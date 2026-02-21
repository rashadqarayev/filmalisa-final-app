# Quick Start Guide: Using AdminAPI in Your Pages

## Basic Template

Every page-specific JavaScript file should follow this pattern:

```javascript
// 1. Import adminAPI
import { adminAPI } from './AdminAPI.js';

// 2. Check authentication (redirect if not logged in)
if (!adminAPI.isAuthenticated()) {
  window.location.href = '/admin/html/login.html';
}

// 3. Your page logic
document.addEventListener('DOMContentLoaded', async () => {
  // Initialize page
  await loadData();
  setupEventListeners();
});

// 4. Implement your functions
async function loadData() {
  try {
    const response = await adminAPI.[service].[method]();
    if (response.result) {
      // Handle success
      renderData(response.data);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

function setupEventListeners() {
  // Add event listeners
}
```

## Examples by Page

### Dashboard (dashboard.js)
```javascript
import { adminAPI } from './AdminAPI.js';

if (!adminAPI.isAuthenticated()) {
  window.location.href = '/admin/html/login.html';
}

document.addEventListener('DOMContentLoaded', async () => {
  await loadDashboardStats();
});

async function loadDashboardStats() {
  try {
    const response = await adminAPI.dashboard.getStatistics();
    
    if (response.result) {
      document.getElementById('total-users').textContent = response.data.users;
      document.getElementById('total-movies').textContent = response.data.movies;
      document.getElementById('total-actors').textContent = response.data.actors;
      document.getElementById('total-categories').textContent = response.data.categories;
      document.getElementById('total-comments').textContent = response.data.comments;
      document.getElementById('total-contacts').textContent = response.data.contacts;
    }
  } catch (error) {
    console.error('Failed to load dashboard stats:', error);
  }
}

// Logout handler
document.querySelector('.logout-text')?.addEventListener('click', () => {
  if (confirm('Are you sure you want to logout?')) {
    adminAPI.auth.logout();
    window.location.href = '/admin/html/login.html';
  }
});
```

### Categories (categories.js)
```javascript
import { adminAPI } from './AdminAPI.js';

if (!adminAPI.isAuthenticated()) {
  window.location.href = '/admin/html/login.html';
}

let categories = [];

document.addEventListener('DOMContentLoaded', async () => {
  await loadCategories();
  setupEventListeners();
});

async function loadCategories() {
  try {
    const response = await adminAPI.categories.getAllCategories();
    if (response.result) {
      categories = response.data;
      renderCategories(categories);
    }
  } catch (error) {
    console.error('Failed to load categories:', error);
  }
}

function renderCategories(data) {
  const tbody = document.getElementById('categories-tbody');
  tbody.innerHTML = data.map(cat => `
    <tr>
      <td>${cat.id}</td>
      <td>${cat.name}</td>
      <td>${new Date(cat.created_at).toLocaleDateString()}</td>
      <td>
        <button onclick="editCategory(${cat.id})">Edit</button>
        <button onclick="deleteCategory(${cat.id})">Delete</button>
      </td>
    </tr>
  `).join('');
}

function setupEventListeners() {
  document.getElementById('create-btn')?.addEventListener('click', openCreateModal);
  document.getElementById('category-form')?.addEventListener('submit', handleSubmit);
}

async function handleSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('category-name').value;
  
  try {
    const response = await adminAPI.categories.createCategory(name);
    if (response.result) {
      alert('Category created successfully!');
      await loadCategories();
      closeModal();
    }
  } catch (error) {
    alert('Failed to create category');
  }
}

async function deleteCategory(id) {
  if (!confirm('Are you sure?')) return;
  
  try {
    const response = await adminAPI.categories.deleteCategory(id);
    if (response.result) {
      alert('Category deleted!');
      await loadCategories();
    }
  } catch (error) {
    alert('Failed to delete category');
  }
}
```

### Actors (actors.js)
```javascript
import { adminAPI } from './AdminAPI.js';

if (!adminAPI.isAuthenticated()) {
  window.location.href = '/admin/html/login.html';
}

let actors = [];
let editingActorId = null;

document.addEventListener('DOMContentLoaded', async () => {
  await loadActors();
  setupEventListeners();
});

async function loadActors() {
  try {
    const response = await adminAPI.actors.getAllActors();
    if (response.result) {
      actors = response.data;
      renderActors(actors);
    }
  } catch (error) {
    console.error('Failed to load actors:', error);
  }
}

function renderActors(data) {
  const tbody = document.getElementById('actorsTableBody');
  tbody.innerHTML = data.map(actor => `
    <tr>
      <td>${actor.id}</td>
      <td>${actor.name}</td>
      <td>${actor.surname}</td>
      <td><img src="${actor.img_url}" alt="${actor.name}" width="50"></td>
      <td>
        <button onclick="editActor(${actor.id})">Edit</button>
        <button onclick="deleteActor(${actor.id})">Delete</button>
      </td>
    </tr>
  `).join('');
}

function setupEventListeners() {
  document.querySelector('.create-btn')?.addEventListener('click', openCreateModal);
  document.getElementById('actorForm')?.addEventListener('submit', handleSubmit);
}

async function handleSubmit(e) {
  e.preventDefault();
  
  const actorData = {
    name: document.getElementById('actorName').value,
    surname: document.getElementById('actorSurname').value,
    img_url: document.getElementById('actorImage').value
  };

  try {
    let response;
    if (editingActorId) {
      response = await adminAPI.actors.updateActor(editingActorId, actorData);
    } else {
      response = await adminAPI.actors.createActor(actorData);
    }

    if (response.result) {
      alert(editingActorId ? 'Actor updated!' : 'Actor created!');
      await loadActors();
      closeModal();
    }
  } catch (error) {
    alert('Operation failed');
  }
}

async function deleteActor(id) {
  if (!confirm('Are you sure?')) return;
  
  try {
    const response = await adminAPI.actors.deleteActor(id);
    if (response.result) {
      alert('Actor deleted!');
      await loadActors();
    }
  } catch (error) {
    alert('Failed to delete actor');
  }
}

// Make functions global for onclick handlers
window.editActor = editActor;
window.deleteActor = deleteActor;
```

### Movies (movies-page.js)
```javascript
import { adminAPI } from './AdminAPI.js';

if (!adminAPI.isAuthenticated()) {
  window.location.href = '/admin/html/login.html';
}

let movies = [];
let categories = [];
let actors = [];

document.addEventListener('DOMContentLoaded', async () => {
  await Promise.all([
    loadMovies(),
    loadCategories(),
    loadActors()
  ]);
  setupEventListeners();
});

async function loadMovies() {
  try {
    const response = await adminAPI.movies.getAllMovies();
    if (response.result) {
      movies = response.data;
      renderMovies(movies);
    }
  } catch (error) {
    console.error('Failed to load movies:', error);
  }
}

async function loadCategories() {
  try {
    const response = await adminAPI.categories.getAllCategories();
    if (response.result) {
      categories = response.data;
      renderCategoryOptions(categories);
    }
  } catch (error) {
    console.error('Failed to load categories:', error);
  }
}

async function loadActors() {
  try {
    const response = await adminAPI.actors.getAllActors();
    if (response.result) {
      actors = response.data;
      renderActorOptions(actors);
    }
  } catch (error) {
    console.error('Failed to load actors:', error);
  }
}

function setupEventListeners() {
  document.getElementById('search-input')?.addEventListener('input', handleSearch);
  document.getElementById('movie-form')?.addEventListener('submit', handleSubmit);
}

async function handleSearch(e) {
  const query = e.target.value;
  
  if (!query.trim()) {
    renderMovies(movies);
    return;
  }

  try {
    const response = await adminAPI.movies.searchMovies(query);
    if (response.result) {
      renderMovies(response.data);
    }
  } catch (error) {
    console.error('Search failed:', error);
  }
}

async function deleteMovie(id) {
  if (!confirm('Are you sure?')) return;
  
  try {
    const response = await adminAPI.movies.deleteMovie(id);
    if (response.result) {
      alert('Movie deleted!');
      await loadMovies();
    }
  } catch (error) {
    alert('Failed to delete movie');
  }
}

window.deleteMovie = deleteMovie;
```

### Users (users.js)
```javascript
import { adminAPI } from './AdminAPI.js';

if (!adminAPI.isAuthenticated()) {
  window.location.href = '/admin/html/login.html';
}

let users = [];

document.addEventListener('DOMContentLoaded', async () => {
  await loadUsers();
});

async function loadUsers() {
  try {
    const response = await adminAPI.users.getAllUsers();
    if (response.result) {
      users = response.data;
      renderUsers(users);
    }
  } catch (error) {
    console.error('Failed to load users:', error);
  }
}

function renderUsers(data) {
  const tbody = document.getElementById('users-tbody');
  tbody.innerHTML = data.map(user => `
    <tr>
      <td>${user.id}</td>
      <td>${user.full_name}</td>
      <td>${user.email}</td>
      <td>${user.img_url ? `<img src="${user.img_url}" width="40">` : 'No image'}</td>
      <td>${new Date(user.created_at).toLocaleDateString()}</td>
      <td>
        <button onclick="viewUser(${user.id})">View</button>
      </td>
    </tr>
  `).join('');
}

async function viewUser(id) {
  try {
    const response = await adminAPI.users.getUserById(id);
    if (response.result) {
      // Show user details modal
      console.log('User details:', response.data);
    }
  } catch (error) {
    console.error('Failed to load user:', error);
  }
}

window.viewUser = viewUser;
```

### Comments (comment.js)
```javascript
import { adminAPI } from './AdminAPI.js';

if (!adminAPI.isAuthenticated()) {
  window.location.href = '/admin/html/login.html';
}

let comments = [];

document.addEventListener('DOMContentLoaded', async () => {
  await loadComments();
});

async function loadComments() {
  try {
    const response = await adminAPI.comments.getAllComments();
    if (response.result) {
      comments = response.data;
      renderComments(comments);
    }
  } catch (error) {
    console.error('Failed to load comments:', error);
  }
}

function renderComments(data) {
  const tbody = document.getElementById('comments-tbody');
  tbody.innerHTML = data.map(comment => `
    <tr>
      <td>${comment.id}</td>
      <td>${comment.movie.title}</td>
      <td>${comment.comment}</td>
      <td>${new Date(comment.created_at).toLocaleDateString()}</td>
      <td>
        <button onclick="deleteComment(${comment.movie.id}, ${comment.id})">Delete</button>
      </td>
    </tr>
  `).join('');
}

async function deleteComment(movieId, commentId) {
  if (!confirm('Are you sure?')) return;
  
  try {
    const response = await adminAPI.comments.deleteComment(movieId, commentId);
    if (response.result) {
      alert('Comment deleted!');
      await loadComments();
    }
  } catch (error) {
    alert('Failed to delete comment');
  }
}

window.deleteComment = deleteComment;
```

### Contacts (contactUS-page.js)
```javascript
import { adminAPI } from './AdminAPI.js';

if (!adminAPI.isAuthenticated()) {
  window.location.href = '/admin/html/login.html';
}

let contacts = [];

document.addEventListener('DOMContentLoaded', async () => {
  await loadContacts();
});

async function loadContacts() {
  try {
    const response = await adminAPI.contacts.getAllContacts();
    if (response.result) {
      contacts = response.data;
      renderContacts(contacts);
    }
  } catch (error) {
    console.error('Failed to load contacts:', error);
  }
}

function renderContacts(data) {
  const tbody = document.getElementById('contacts-tbody');
  tbody.innerHTML = data.map(contact => `
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
  `).join('');
}

async function deleteContact(id) {
  if (!confirm('Are you sure?')) return;
  
  try {
    const response = await adminAPI.contacts.deleteContact(id);
    if (response.result) {
      alert('Contact deleted!');
      await loadContacts();
    }
  } catch (error) {
    alert('Failed to delete contact');
  }
}

window.deleteContact = deleteContact;
```

## Key Points

1. **Always import adminAPI first**
2. **Check authentication immediately**
3. **Use async/await for all API calls**
4. **Handle errors with try/catch**
5. **Make onclick functions global with `window.functionName = functionName`**
6. **Load data when DOM is ready**

## Common Patterns

### Loading Data
```javascript
async function loadData() {
  try {
    const response = await adminAPI.[service].[method]();
    if (response.result) {
      // Success
      processData(response.data);
    } else {
      console.error(response.message);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}
```

### Creating/Updating
```javascript
async function handleSubmit(e) {
  e.preventDefault();
  const data = getFormData();
  
  try {
    const response = editingId 
      ? await adminAPI.[service].update[Resource](editingId, data)
      : await adminAPI.[service].create[Resource](data);
    
    if (response.result) {
      alert('Success!');
      await loadData();
      closeModal();
    }
  } catch (error) {
    alert('Failed!');
  }
}
```

### Deleting
```javascript
async function deleteItem(id) {
  if (!confirm('Are you sure?')) return;
  
  try {
    const response = await adminAPI.[service].delete[Resource](id);
    if (response.result) {
      alert('Deleted!');
      await loadData();
    }
  } catch (error) {
    alert('Failed to delete');
  }
}
```

## Debugging Tips

1. Open browser console (F12)
2. Check for module loading errors
3. Verify API responses in Network tab
4. Use `console.log()` to track data flow
5. Check if `adminAPI` is defined: `console.log(adminAPI)`
