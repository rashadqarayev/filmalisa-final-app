# Filmalisa - Movies API Documentation

A comprehensive REST API for managing and browsing movies, with separate admin and client functionalities.

## 📚 Documentation Structure

This API documentation is organized into two main sections:

### 🔐 Admin API

**Location:** [`admin/API_DOCUMENTATION.md`](./admin/API_DOCUMENTATION.md)

Full administrative control over the movie platform:

- **Authentication** - Admin login and profile management
- **User Management** - View and manage registered users
- **Categories** - Create, update, delete movie categories
- **Actors** - Manage actor database
- **Movies** - Full CRUD operations on movies
- **Contact Messages** - View and manage user contact submissions
- **Comments** - Moderate user comments
- **Dashboard** - System statistics and overview

### 👥 Client API

**Location:** [`client/API_DOCUMENTATION.md`](./client/API_DOCUMENTATION.md)

Public-facing API for end users:

- **Authentication** - User signup and login
- **Profile** - Personal profile management
- **Movies** - Browse and search movies
- **Favorites** - Personal favorite movies list
- **Comments** - Comment on movies
- **Categories** - Browse movies by category
- **Contact** - Submit support requests

---

## 🚀 Quick Start

### Base URL

```
https://api.sarkhanrahimli.dev/api/filmalisa
```

### Admin Access

```bash
POST /auth/admin/login
Content-Type: application/json

{
    "email": "admin@admin.com",
    "password": "1234"
}
```

### Client Access

```bash
POST /auth/signup
Content-Type: application/json

{
    "email": "user@example.com",
    "password": "yourpassword",
    "full_name": "Your Name"
}
```

---

## 🎯 Key Features

### For Administrators

- ✅ Complete user management
- ✅ Content management (movies, actors, categories)
- ✅ Comment moderation
- ✅ Contact message management
- ✅ Dashboard analytics

### For Clients

- ✅ Browse and search movies
- ✅ Create personal favorites list
- ✅ Comment on movies
- ✅ Filter by categories
- ✅ Profile management
- ✅ Contact support

---

## 🔑 Authentication

Both admin and client APIs use **Bearer Token** authentication:

```bash
Authorization: Bearer {access_token}
```

Tokens are obtained through login endpoints:

- **Admin:** `POST /auth/admin/login`
- **Client:** `POST /auth/login`

---

## 📊 API Response Format

All endpoints return responses in the following format:

```json
{
  "message": "Success or error message",
  "data": {},
  "result": true
}
```

### Success Response (200 OK)

```json
{
  "message": "Ok",
  "data": {
    "id": 1,
    "title": "Movie Title"
  },
  "result": true
}
```

### Error Response (4xx/5xx)

```json
{
  "message": "Error description",
  "data": null,
  "result": false
}
```

---

## 🌍 Internationalization

The API supports multiple languages through the `Accept-Language` header:

```bash
Accept-Language: en
Accept-Language: az
```

Use environment variable: `{{LANG}}`

---

## 📁 Available Resources

### Movies

Complete movie information including:

- Title, cover image, trailer link
- Watch URL
- IMDB rating
- Runtime
- Adult content flag
- Overview/description
- Associated actors
- Category

### Categories

15 predefined categories:

- Action, Comedy, Drama, Horror, Romance
- Sci-Fi, Fantasy, Documentary, Thriller
- Adventure, Animation, Mystery, Crime
- Family, Musical

### Actors

Actor database with:

- Name and surname
- Profile image
- Associated movies

### Comments

User-generated movie reviews and comments

### Favorites

Personalized favorite movie lists for each user

---

## 🛠️ Technology Stack

- **Protocol:** HTTPS
- **Authentication:** JWT Bearer Tokens
- **Format:** JSON
- **Host:** Railway (api.sarkhanrahimli.dev)

---

## 📖 Detailed Documentation

For complete endpoint documentation, request/response examples, and implementation details:

- **[Admin API Documentation](./admin/API_DOCUMENTATION.md)** - Full administrative API reference
- **[Client API Documentation](./client/API_DOCUMENTATION.md)** - Public client API reference

---

## 🧪 Testing

You can import the original Postman collection for testing:

- **File:** `Filmalisa - Movies Api's - Stage 2 Final.postman_collection.json`
- Import into Postman to test all endpoints with pre-configured examples

---

## 📞 Support

For issues or questions about the API, use the contact endpoint:

```bash
POST /contact
Content-Type: application/json

{
    "full_name": "Your Name",
    "email": "your@email.com",
    "reason": "Your message"
}
```

---

## 📝 Notes

- All timestamps are in ISO 8601 format
- Movie IDs are integers
- Bearer tokens should be kept secure
- Admin endpoints require admin authentication
- Some client endpoints work without authentication (browse movies, categories)
- Protected client endpoints (favorites, comments) require user authentication

---