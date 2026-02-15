# Filmalisa - Client API Documentation

## Base URL

```
https://api.sarkhanrahimli.dev/api/filmalisa
```

## Authentication

Some client endpoints require Bearer Token authentication (obtained after login/signup).

---

## Table of Contents

1. [Authentication](#authentication-endpoints)
2. [Profile Management](#profile-management)
3. [Movies](#movies)
4. [Categories](#categories)
5. [Contact](#contact)

---

## Authentication Endpoints

### User Login

**Endpoint:** `POST /auth/login`

**Headers:**

- `Accept-Language: {{LANG}}` (optional)

**Request Body:**

```json
{
  "email": "sarkhan@gmail.com",
  "password": "1234"
}
```

**Response (200 OK):**

```json
{
  "message": "Ok",
  "data": {
    "tokens": {
      "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    },
    "profile": {
      "id": 2,
      "full_name": "Sarkhan Rahimli",
      "email": "sarkhan@gmail.com",
      "img_url": null,
      "created_at": "2024-10-28T14:27:57.543Z"
    }
  },
  "result": true
}
```

### User Signup

**Endpoint:** `POST /auth/signup`

**Headers:**

- `Accept-Language: {{LANG}}` (optional)

**Request Body:**

```json
{
  "password": "1234",
  "full_name": "Sarkhan2 Rahimli",
  "email": "sarkhan2@gmail.com"
}
```

**Response (201 Created):**

```json
{
  "message": "Successfully registered",
  "data": null,
  "result": true
}
```

---

## Profile Management

### Get User Profile

**Endpoint:** `GET /profile`

**Headers:**

- `Authorization: Bearer {access_token}`
- `Accept-Language: {{LANG}}` (optional)

**Response (200 OK):**

```json
{
  "message": "Ok",
  "data": {
    "id": 1,
    "full_name": "John Doe",
    "email": "john1@gmail.com",
    "img_url": "https://avatars.githubusercontent.com/u/61918721?v=4?s=400",
    "created_at": "2024-10-28T14:21:45.249Z"
  },
  "result": true
}
```

### Update User Profile

**Endpoint:** `PUT /profile`

**Headers:**

- `Authorization: Bearer {access_token}`
- `Accept-Language: {{LANG}}` (optional)

**Request Body:**

```json
{
  "full_name": "John Doe",
  "email": "john1@gmail.com",
  "img_url": "https://avatars.githubusercontent.com/u/61918721?v=4?s=400",
  "password": "12345"
}
```

**Response (200 OK):**

```json
{
  "message": "Ok",
  "data": {
    "id": 1,
    "full_name": "John Doe",
    "email": "john1@gmail.com",
    "img_url": "https://avatars.githubusercontent.com/u/61918721?v=4?s=400",
    "created_at": "2024-10-28T14:21:45.249Z"
  },
  "result": true
}
```

---

## Movies

### List All Movies

**Endpoint:** `GET /movies`

**Headers:**

- `Authorization: Bearer {access_token}` (optional)
- `Accept-Language: {{LANG}}` (optional)

**Query Parameters:**

- `search` (optional) - Search by title and description

**Example:**

```
GET /movies?search=smit
```

**Response (200 OK):**

```json
{
  "message": "Ok",
  "data": [
    {
      "id": 1,
      "title": "Mister və missis Smit",
      "cover_url": "https://fr.web.img2.acsta.net/medias/nmedia/18/35/50/84/18432356.jpg",
      "fragman": "https://www.youtube.com/embed/8Z2zSuTz-SY?si=qMyvqlu3lOqTgmDA",
      "watch_url": "https://www.dailymotion.com/video/x8qiwki",
      "adult": true,
      "run_time_min": 120,
      "imdb": "6.5",
      "overview": "Mr. & Mrs. Smith is a 2005 American action comedy film...",
      "created_at": "2024-10-28T14:21:45.249Z"
    }
  ],
  "result": true
}
```

### Get Movie by ID

**Endpoint:** `GET /movies/{id}`

**Headers:**

- `Authorization: Bearer {access_token}` (optional)

**Response (200 OK):**

```json
{
  "message": "Ok",
  "data": {
    "id": 1,
    "title": "Mister və missis Smit",
    "cover_url": "https://fr.web.img2.acsta.net/medias/nmedia/18/35/50/84/18432356.jpg",
    "fragman": "https://www.youtube.com/embed/8Z2zSuTz-SY?si=qMyvqlu3lOqTgmDA",
    "watch_url": "https://www.dailymotion.com/video/x8qiwki",
    "adult": true,
    "run_time_min": 120,
    "imdb": "6.5",
    "overview": "Mr. & Mrs. Smith is a 2005 American action comedy film...",
    "created_at": "2024-10-28T14:21:45.249Z",
    "actors": [
      {
        "id": 10,
        "name": "Angelina",
        "surname": "Jolie",
        "img_url": "https://www.themoviedb.org/t/p/w600_and_h900_bestv2/gxRmL8SvQGZt7ZJ68ZJv8QfTiMI.jpg",
        "created_at": "2024-10-28T14:21:45.249Z"
      },
      {
        "id": 22,
        "name": "Bred",
        "surname": "Pitt",
        "img_url": "https://goldenglobes.com/wp-content/uploads/2023/10/brad-pitt_03_paramount-pictures.jpg?w=600?w=600",
        "created_at": "2024-10-28T14:21:45.249Z"
      }
    ],
    "category": {
      "id": 2,
      "name": "Comedy",
      "created_at": "2024-10-28T14:21:45.249Z"
    }
  },
  "result": true
}
```

---

## Favorites

### Get Favorite Movies

**Endpoint:** `GET /movies/favorites`

**Headers:**

- `Authorization: Bearer {access_token}` (required)

**Response (200 OK):**

```json
{
  "message": "Ok",
  "data": [
    {
      "id": 1,
      "title": "Mister və missis Smit",
      "cover_url": "https://fr.web.img2.acsta.net/medias/nmedia/18/35/50/84/18432356.jpg",
      "fragman": "https://www.youtube.com/embed/8Z2zSuTz-SY?si=qMyvqlu3lOqTgmDA",
      "watch_url": "https://www.dailymotion.com/video/x8qiwki",
      "adult": true,
      "run_time_min": 120,
      "imdb": "6.5",
      "overview": "Mr. & Mrs. Smith is a 2005 American action comedy film...",
      "created_at": "2024-10-28T14:21:45.249Z"
    }
  ],
  "result": true
}
```

### Toggle Favorite (Add/Remove)

**Endpoint:** `POST /movie/{id}/favorite`

**Headers:**

- `Authorization: Bearer {access_token}` (required)

**Response - Add (201 Created):**

```json
{
  "message": "Successfully added favorites",
  "data": null,
  "result": true
}
```

**Response - Remove (201 Created):**

```json
{
  "message": "Successfully removed favorites",
  "data": null,
  "result": true
}
```

> **Note:** This endpoint acts as a toggle. If the movie is already in favorites, it will be removed. If not, it will be added.

---

## Comments

### Get Movie Comments

**Endpoint:** `GET /movies/{movieId}/comments`

**Headers:**

- `Authorization: Bearer {access_token}` (optional)

**Response (200 OK):**

```json
{
  "message": "Ok",
  "data": [
    {
      "id": 1,
      "comment": "I prefer!Because the movie is besteller!",
      "created_at": "2024-10-28T15:44:27.759Z"
    },
    {
      "id": 4,
      "comment": "I prefer! Because the movie is besteller!!!",
      "created_at": "2024-10-28T16:28:46.940Z"
    }
  ],
  "result": true
}
```

### Create Comment

**Endpoint:** `POST /movies/{movieId}/comment`

**Headers:**

- `Authorization: Bearer {access_token}` (required)

**Request Body:**

```json
{
  "comment": "I prefer! Because the movie is besteller!!!"
}
```

**Response (201 Created):**

```json
{
  "message": "Ok",
  "data": {
    "comment": "I prefer! Because the movie is besteller!!!",
    "id": 5,
    "created_at": "2024-11-11T16:46:50.347Z"
  },
  "result": true
}
```

### Delete Comment

**Endpoint:** `DELETE /movies/{movieId}/comment/{commentId}`

**Headers:**

- `Authorization: Bearer {access_token}` (required)

**Response (200 OK):**

```json
{
  "message": "Successfully removed",
  "data": null,
  "result": true
}
```

---

## Categories

### List All Categories (with Movies)

**Endpoint:** `GET /categories`

**Headers:**

- `Authorization: Bearer {access_token}` (optional)
- `Accept-Language: {{LANG}}` (optional)

**Response (200 OK):**

```json
{
  "message": "Ok",
  "data": [
    {
      "id": 2,
      "name": "Comedy",
      "created_at": "2024-10-28T14:21:45.249Z",
      "movies": [
        {
          "id": 1,
          "title": "Mister və missis Smit",
          "cover_url": "https://fr.web.img2.acsta.net/medias/nmedia/18/35/50/84/18432356.jpg",
          "fragman": "https://www.youtube.com/embed/8Z2zSuTz-SY?si=qMyvqlu3lOqTgmDA",
          "watch_url": "https://www.dailymotion.com/video/x8qiwki",
          "adult": true,
          "run_time_min": 120,
          "imdb": "6.5",
          "overview": "Mr. & Mrs. Smith is a 2005 American action comedy film...",
          "created_at": "2024-10-28T14:21:45.249Z",
          "category": {
            "id": 2,
            "name": "Comedy",
            "created_at": "2024-10-28T14:21:45.249Z"
          }
        }
      ]
    },
    {
      "id": 10,
      "name": "Adventure",
      "created_at": "2024-10-28T14:21:45.249Z",
      "movies": []
    }
  ],
  "result": true
}
```

**Available Categories:**

- Action
- Comedy
- Drama
- Horror
- Romance
- Sci-Fi
- Fantasy
- Documentary
- Thriller
- Adventure
- Animation
- Mystery
- Crime
- Family
- Musical

---

## Contact

### Submit Contact Form

**Endpoint:** `POST /contact`

**Headers:**

- `Authorization: Bearer {access_token}` (optional)
- `Accept-Language: {{LANG}}` (optional)

**Request Body:**

```json
{
  "full_name": "John Doe",
  "email": "user@gmail.com",
  "reason": "I need help.Because I didnt find my the bes movies"
}
```

**Response (201 Created):**

```json
{
  "message": "Ok",
  "data": {
    "full_name": "John Doe",
    "email": "user@gmail.com",
    "reason": "I need help.Because I didnt find my the bes movies",
    "id": 3,
    "created_at": "2024-11-11T16:45:04.890Z"
  },
  "result": true
}
```

---

## Response Structure

All API responses follow this structure:

```json
{
  "message": "string", // Success or error message
  "data": {}, // Response data (null for deletions)
  "result": true // Boolean indicating success/failure
}
```

## Error Responses

Standard HTTP status codes are used:

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

## Movie Object Structure

```json
{
  "id": 1,
  "title": "string",
  "cover_url": "string",
  "fragman": "string (YouTube embed URL)",
  "watch_url": "string (Video streaming URL)",
  "adult": true,
  "run_time_min": 120,
  "imdb": "string",
  "overview": "string",
  "created_at": "ISO 8601 date string",
  "category": {
    "id": 1,
    "name": "string",
    "created_at": "ISO 8601 date string"
  },
  "actors": [
    {
      "id": 1,
      "name": "string",
      "surname": "string",
      "img_url": "string",
      "created_at": "ISO 8601 date string"
    }
  ]
}
```

## Authentication Flow

1. **Sign Up:** `POST /auth/signup` - Register a new user
2. **Log In:** `POST /auth/login` - Get access token
3. **Use Token:** Add `Authorization: Bearer {access_token}` header to authenticated requests
4. **Access Protected Routes:** Use the token for favorites, comments, and profile management

## Features Summary

### 🎬 Movies

- Browse all movies
- Search movies by title/description
- View movie details with actors and category
- Watch trailers and full movies

### ❤️ Favorites

- Add/remove movies to favorites
- View all favorite movies

### 💬 Comments

- View movie comments
- Post comments on movies
- Delete your own comments

### 👤 Profile

- View profile information
- Update profile details
- Change password

### 📧 Contact

- Submit contact/support requests

### 🎭 Categories

- Browse movies by category
- View all available categories
