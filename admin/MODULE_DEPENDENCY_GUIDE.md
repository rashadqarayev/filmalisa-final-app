# ES6 Module Dependency Chain

## Visual Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         Browser                                  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  HTML Page (e.g., login.html)                            │  │
│  │  <script type="module" src="../js/newLogin.js">          │  │
│  └──────────────────┬───────────────────────────────────────┘  │
│                     │                                            │
│                     │ imports                                    │
│                     ▼                                            │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  newLogin.js                                             │  │
│  │  import { adminAPI } from './AdminAPI.js';               │  │
│  └──────────────────┬───────────────────────────────────────┘  │
│                     │                                            │
│                     │ imports                                    │
│                     ▼                                            │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  AdminAPI.js (Main API Interface)                        │  │
│  │  import { httpClient } from './HttpClient.js';           │  │
│  │  import { authService, ... } from './ApiServices.js';    │  │
│  │  export const adminAPI = new AdminAPI();                 │  │
│  └────────┬──────────────────────┬──────────────────────────┘  │
│           │                      │                               │
│           │ imports              │ imports                       │
│           ▼                      ▼                               │
│  ┌────────────────┐    ┌────────────────────────────────────┐  │
│  │ HttpClient.js  │    │ ApiServices.js                     │  │
│  │                │    │ import { httpClient } from ...     │  │
│  │ class          │◄───┤                                    │  │
│  │ HttpClient     │    │ export const authService = ...     │  │
│  │                │    │ export const profileService = ...  │  │
│  │ export const   │    │ export const usersService = ...    │  │
│  │ httpClient     │    │ ... (9 services total)             │  │
│  └────────────────┘    └────────────────────────────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Module Loading Order

When browser loads `<script type="module" src="../js/newLogin.js">`:

1. **Browser starts with:** `newLogin.js`
2. **Sees import:** `import { adminAPI } from './AdminAPI.js'`
3. **Loads:** `AdminAPI.js`
4. **Sees imports in AdminAPI.js:**
   - `import { httpClient } from './HttpClient.js'`
   - `import { authService, ... } from './ApiServices.js'`
5. **Loads:** `HttpClient.js` (first, no dependencies)
6. **Loads:** `ApiServices.js` (depends on httpClient)
7. **Executes in order:**
   - HttpClient.js creates `httpClient` instance
   - ApiServices.js creates all service instances using `httpClient`
   - AdminAPI.js creates `adminAPI` instance using all services
   - newLogin.js can now use `adminAPI`

## File Dependencies Graph

```
HttpClient.js (No dependencies)
    │
    │ imported by
    │
    ├─► ApiServices.js
    │       │
    │       │ imported by
    │       │
    │       └─► AdminAPI.js
    │               │
    │               │ imported by
    │               │
    │               ├─► newLogin.js
    │               ├─► dashboard.js
    │               ├─► categories.js
    │               ├─► actors.js
    │               ├─► movies-page.js
    │               ├─► users.js
    │               ├─► comment.js
    │               └─► contactUS-page.js
```

## What Each Module Exports

### HttpClient.js
```javascript
export const httpClient = new HttpClient();
export default HttpClient;
```
**Provides:** HTTP request methods (GET, POST, PUT, DELETE, PATCH)

### ApiServices.js
```javascript
export const authService = new AuthService(httpClient);
export const profileService = new ProfileService(httpClient);
export const usersService = new UsersService(httpClient);
export const categoriesService = new CategoriesService(httpClient);
export const actorsService = new ActorsService(httpClient);
export const moviesService = new MoviesService(httpClient);
export const contactsService = new ContactsService(httpClient);
export const commentsService = new CommentsService(httpClient);
export const dashboardService = new DashboardService(httpClient);
```
**Provides:** 9 service instances, each with domain-specific API methods

### AdminAPI.js
```javascript
export const adminAPI = new AdminAPI();
export default AdminAPI;
```
**Provides:** Unified interface to all services + helper methods

## What adminAPI Contains

```javascript
adminAPI = {
  // Core services
  auth: authService,              // login(), logout(), isAuthenticated()
  profile: profileService,        // getProfile(), updateProfile()
  users: usersService,           // getAllUsers(), getUserById(), deleteUser()
  categories: categoriesService, // CRUD for categories
  actors: actorsService,         // CRUD for actors
  movies: moviesService,         // CRUD + search for movies
  contacts: contactsService,     // getAllContacts(), deleteContact()
  comments: commentsService,     // getAllComments(), deleteComment()
  dashboard: dashboardService,   // getStatistics(), getOverview()
  
  // HTTP client
  http: httpClient,
  
  // Helper methods
  setLanguage(lang),
  isAuthenticated(),
  getToken(),
  handleError(error, defaultMsg),
  toggleLoading(show),
  showSuccess(message),
  showError(message)
}
```

## How to Use in Your Pages

### Import Pattern
```javascript
// At the top of your JS file
import { adminAPI } from './AdminAPI.js';

// Now you have access to everything!
await adminAPI.auth.login(email, password);
await adminAPI.movies.getAllMovies();
await adminAPI.dashboard.getStatistics();
```

### No Need to Import Separately
❌ **DON'T DO THIS:**
```javascript
import { httpClient } from './HttpClient.js';
import { authService } from './ApiServices.js';
import { adminAPI } from './AdminAPI.js';
```

✅ **DO THIS:**
```javascript
import { adminAPI } from './AdminAPI.js';
// adminAPI already has everything!
```

## Data Flow Example: Login

```
┌─────────────┐
│   User      │ Clicks "Login" button
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────────┐
│  newLogin.js                            │
│  handleLogin(event)                     │
│    ↓                                    │
│  adminAPI.auth.login(email, password)   │
└────────┬────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│  AdminAPI.js                            │
│  this.auth → authService                │
└────────┬────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│  ApiServices.js                         │
│  authService.login(email, password)     │
│    ↓                                    │
│  this.http.post('/auth/admin/login')    │
└────────┬────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│  HttpClient.js                          │
│  post(endpoint, data)                   │
│    ↓                                    │
│  fetch(baseURL + endpoint, options)     │
│    ↓                                    │
│  Add Bearer token if exists             │
│    ↓                                    │
│  Send HTTP POST request                 │
└────────┬────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│  API Server                             │
│  Validates credentials                  │
│  Returns access_token + profile         │
└────────┬────────────────────────────────┘
         │
         ▼ (Response flows back up)
┌─────────────────────────────────────────┐
│  HttpClient.js                          │
│  Receives response                      │
│  Returns JSON                           │
└────────┬────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│  ApiServices.js                         │
│  authService.login()                    │
│    ↓                                    │
│  httpClient.setAuthToken(token)         │
│  Save to localStorage                   │
│  Return response                        │
└────────┬────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│  AdminAPI.js                            │
│  Pass response through                  │
└────────┬────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│  newLogin.js                            │
│  if (response.result)                   │
│    → redirect to dashboard              │
│  else                                   │
│    → show error message                 │
└─────────────────────────────────────────┘
```

## Key Concepts

### 1. Single Source of Truth
- `adminAPI` is the ONLY thing you import in page files
- It gives you access to everything you need

### 2. Automatic Dependencies
- Browser handles loading dependencies
- You don't need to worry about load order
- Modules load only once and are cached

### 3. No Global Pollution
- No more `window.adminAPI` or global variables
- Each module has its own scope
- Only exported values are accessible

### 4. Clear Dependencies
- Easy to see what each file needs
- Better for code maintenance
- Helps with debugging

## Comparison: Old vs New

### Old Way (Global Scripts)
```html
<!-- HTML -->
<script src="../js/HttpClient.js"></script>      <!-- 1 -->
<script src="../js/ApiServices.js"></script>     <!-- 2 -->
<script src="../js/AdminAPI.js"></script>        <!-- 3 -->
<script src="../js/helpers.js"></script>         <!-- 4 -->
<script src="../js/page.js"></script>            <!-- 5 -->
```
```javascript
// page.js (no imports, uses globals)
// Hopes that adminAPI is defined
const response = await adminAPI.auth.login(email, password);
```
**Problems:**
- ❌ Must load in exact order
- ❌ Pollutes global namespace
- ❌ Hard to track dependencies
- ❌ Easy to make mistakes

### New Way (ES6 Modules)
```html
<!-- HTML -->
<script type="module" src="../js/page.js"></script>
```
```javascript
// page.js
import { adminAPI } from './AdminAPI.js';
const response = await adminAPI.auth.login(email, password);
```
**Benefits:**
- ✅ Browser handles load order
- ✅ Clean namespace
- ✅ Clear dependencies
- ✅ Modern standard

## Browser Support

ES6 modules work in all modern browsers:
- ✅ Chrome 61+
- ✅ Firefox 60+
- ✅ Safari 11+
- ✅ Edge 16+

**Note:** Requires serving files via HTTP (not file://)
- Use Live Server, http-server, or similar
- Local web server required for development

---

*This diagram shows how everything connects in your admin panel!*
