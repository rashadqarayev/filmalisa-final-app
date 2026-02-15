# Filmalisa - Admin API Documentation

## Base URL

```
https://api.sarkhanrahimli.dev/api/filmalisa
```

## Authentication

All admin endpoints require Bearer Token authentication.

**Admin Login Credentials:**

- Email: `admin@admin.com`
- Password: `1234`

---

## Table of Contents

1. [Authentication](#authentication-endpoints)
2. [Profile](#profile)
3. [Users Management](#users-management)
4. [Categories Management](#categories-management)
5. [Actors Management](#actors-management)
6. [Movies Management](#movies-management)
7. [Contact Management](#contact-management)
8. [Comments Management](#comments-management)
9. [Dashboard](#dashboard)

---

## Authentication Endpoints

### Admin Login

**Endpoint:** `POST /auth/admin/login`

**Request Body:**

```json
{
  "email": "admin@admin.com",
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
      "id": 999999,
      "full_name": "Admin",
      "email": "admin@admin.com",
      "img_url": null,
      "created_at": "2024-10-28T14:21:45.249Z"
    }
  },
  "result": true
}
```

---

## Profile

### Get Admin Profile

**Endpoint:** `GET /profile`

**Headers:**

- `Authorization: Bearer {access_token}`
- `Accept-Language: {{LANG}}` (optional)

**Response (200 OK):**

```json
{
  "message": "Ok",
  "data": {
    "id": 999999,
    "full_name": "Admin",
    "email": "admin@admin.com",
    "img_url": null,
    "created_at": "2024-10-28T14:21:45.249Z"
  },
  "result": true
}
```

---

## Users Management

### List All Users

**Endpoint:** `GET /admin/users`

**Headers:**

- `Authorization: Bearer {access_token}`
- `Accept-Language: {{LANG}}` (optional)

**Response (200 OK):**

```json
{
  "message": "Ok",
  "data": [
    {
      "id": 2,
      "full_name": "Sarkhan Rahimli",
      "email": "sarkhan@gmail.com",
      "img_url": null,
      "created_at": "2024-10-28T14:27:57.543Z"
    },
    {
      "id": 3,
      "full_name": "Sarkhan2 Rahimli",
      "email": "sarkhan2@gmail.com",
      "img_url": null,
      "created_at": "2024-11-11T16:44:27.167Z"
    }
  ],
  "result": true
}
```

---

## Categories Management

### List All Categories

**Endpoint:** `GET /admin/categories`

**Headers:**

- `Authorization: Bearer {access_token}`
- `Accept-Language: {{LANG}}` (optional)

**Response (200 OK):**

```json
{
  "message": "Ok",
  "data": [
    {
      "id": 1,
      "name": "Action",
      "created_at": "2024-10-28T14:21:45.249Z"
    },
    {
      "id": 2,
      "name": "Comedy",
      "created_at": "2024-10-28T14:21:45.249Z"
    }
  ],
  "result": true
}
```

### Create Category

**Endpoint:** `POST /admin/category`

**Headers:**

- `Authorization: Bearer {access_token}`
- `Accept-Language: {{LANG}}` (optional)

**Request Body:**

```json
{
  "name": "Comedy-1"
}
```

**Response (201 Created):**

```json
{
  "message": "Ok",
  "data": {
    "name": "Comedy-1",
    "id": 17,
    "created_at": "2024-11-11T16:57:58.320Z"
  },
  "result": true
}
```

### Update Category

**Endpoint:** `PUT /admin/category/{id}`

**Headers:**

- `Authorization: Bearer {access_token}`
- `Accept-Language: {{LANG}}` (optional)

**Request Body:**

```json
{
  "name": "Comedy-1-1"
}
```

**Response (200 OK):**

```json
{
  "message": "Ok",
  "data": {
    "id": "17",
    "name": "Comedy-1-1"
  },
  "result": true
}
```

### Delete Category

**Endpoint:** `DELETE /admin/category/{id}`

**Headers:**

- `Authorization: Bearer {access_token}`
- `Accept-Language: {{LANG}}` (optional)

**Response (200 OK):**

```json
{
  "message": "Successfully removed",
  "data": null,
  "result": true
}
```

---

## Actors Management

### List All Actors

**Endpoint:** `GET /admin/actors`

**Headers:**

- `Authorization: Bearer {access_token}`
- `Accept-Language: {{LANG}}` (optional)

**Response (200 OK):**

```json
{
  "message": "Ok",
  "data": [
    {
      "id": 1,
      "name": "Leonardo",
      "surname": "DiCaprio",
      "img_url": "https://www.themoviedb.org/t/p/w600_and_h900_bestv2/wo2hJpn04vbtmh0B9utCFdsQhxM.jpg",
      "created_at": "2024-10-28T14:21:45.249Z"
    },
    {
      "id": 2,
      "name": "Scarlett",
      "surname": "Johansson",
      "img_url": "https://www.themoviedb.org/t/p/w600_and_h900_bestv2/6NsMbJXRlDZuDzatN2akFdGuTvx.jpg",
      "created_at": "2024-10-28T14:21:45.249Z"
    }
  ],
  "result": true
}
```

### Create Actor

**Endpoint:** `POST /admin/actor`

**Headers:**

- `Authorization: Bearer {access_token}`
- `Accept-Language: {{LANG}}` (optional)

**Request Body:**

```json
{
  "name": "Bred",
  "surname": "Pitt",
  "img_url": "https://goldenglobes.com/wp-content/uploads/2023/10/brad-pitt_03_paramount-pictures.jpg?w=600?w=600"
}
```

**Response (201 Created):**

```json
{
  "message": "Ok",
  "data": {
    "name": "Bred",
    "surname": "Pitt",
    "img_url": "https://goldenglobes.com/wp-content/uploads/2023/10/brad-pitt_03_paramount-pictures.jpg?w=600?w=600",
    "id": 23,
    "created_at": "2024-11-11T17:12:10.910Z"
  },
  "result": true
}
```

### Update Actor

**Endpoint:** `PUT /admin/actor/{id}`

**Headers:**

- `Authorization: Bearer {access_token}`
- `Accept-Language: {{LANG}}` (optional)

**Request Body:**

```json
{
  "name": "Bred",
  "surname": "Pitt",
  "img_url": "https://goldenglobes.com/wp-content/uploads/2023/10/brad-pitt_03_paramount-pictures.jpg?w=600?w=600"
}
```

**Response (200 OK):**

```json
{
  "message": "Ok",
  "data": {
    "id": "23",
    "name": "Bred",
    "surname": "Pitt",
    "img_url": "https://goldenglobes.com/wp-content/uploads/2023/10/brad-pitt_03_paramount-pictures.jpg?w=600?w=600"
  },
  "result": true
}
```

### Delete Actor

**Endpoint:** `DELETE /admin/actor/{id}`

**Headers:**

- `Authorization: Bearer {access_token}`
- `Accept-Language: {{LANG}}` (optional)

**Response (200 OK):**

```json
{
  "message": "Successfully removed",
  "data": null,
  "result": true
}
```

---

## Movies Management

### List All Movies

**Endpoint:** `GET /admin/movies`

**Headers:**

- `Authorization: Bearer {access_token}`

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

**Endpoint:** `GET /admin/movies/{id}`

**Headers:**

- `Authorization: Bearer {access_token}`

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

### Create Movie

**Endpoint:** `POST /admin/movie`

**Headers:**

- `Authorization: Bearer {access_token}`

**Request Body:**

```json
{
  "title": "Mister və missis Smit",
  "cover_url": "https://fr.web.img2.acsta.net/medias/nmedia/18/35/50/84/18432356.jpg",
  "fragman": "https://www.youtube.com/embed/8Z2zSuTz-SY?si=qMyvqlu3lOqTgmDA",
  "watch_url": "https://www.dailymotion.com/video/x8qiwki",
  "adult": true,
  "run_time_min": 120,
  "imdb": "6.5",
  "category": 1,
  "actors": [22, 10],
  "overview": "Mr. & Mrs. Smith is a 2005 American action comedy film..."
}
```

**Response (201 Created):**

```json
{
    "message": "Ok",
    "data": {
        "id": 4,
        "title": "Mister və missis Smit",
        "cover_url": "https://fr.web.img2.acsta.net/medias/nmedia/18/35/50/84/18432356.jpg",
        "fragman": "https://www.youtube.com/embed/8Z2zSuTz-SY?si=qMyvqlu3lOqTgmDA",
        "watch_url": "https://www.dailymotion.com/video/x8qiwki",
        "adult": true,
        "run_time_min": 120,
        "imdb": "6.5",
        "overview": "Mr. & Mrs. Smith is a 2005 American action comedy film...",
        "created_at": "2024-11-11T17:13:48.132Z",
        "category": {
            "id": 1,
            "name": "Action",
            "created_at": "2024-10-28T14:21:45.249Z"
        },
        "actors": [...]
    },
    "result": true
}
```

### Update Movie

**Endpoint:** `PUT /admin/movie/{id}`

**Headers:**

- `Authorization: Bearer {access_token}`

**Request Body:**

```json
{
  "title": "Mister və missis Smit",
  "cover_url": "https://fr.web.img2.acsta.net/medias/nmedia/18/35/50/84/18432356.jpg",
  "fragman": "https://www.youtube.com/embed/8Z2zSuTz-SY?si=qMyvqlu3lOqTgmDA",
  "watch_url": "https://www.dailymotion.com/video/x8qiwki",
  "adult": true,
  "run_time_min": 120,
  "imdb": "6.5",
  "category": 2,
  "actors": [22, 10],
  "overview": "Mr. & Mrs. Smith is a 2005 American action comedy film..."
}
```

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
        "category": {
            "id": 2,
            "name": "Comedy",
            "created_at": "2024-10-28T14:21:45.249Z"
        },
        "actors": [...]
    },
    "result": true
}
```

### Delete Movie

**Endpoint:** `DELETE /admin/movie/{id}`

**Headers:**

- `Authorization: Bearer {access_token}`

**Response (200 OK):**

```json
{
  "message": "Successfully removed",
  "data": null,
  "result": true
}
```

---

## Contact Management

### List All Contacts

**Endpoint:** `GET /admin/contacts`

**Headers:**

- `Authorization: Bearer {access_token}`
- `Accept-Language: {{LANG}}` (optional)

**Response (200 OK):**

```json
{
  "message": "Ok",
  "data": [
    {
      "id": 2,
      "full_name": "John Doe",
      "email": "user@gmail.com",
      "reason": "I need help.Because I didnt find my the bes movies",
      "created_at": "2024-10-28T14:21:45.249Z"
    }
  ],
  "result": true
}
```

### Delete Contact

**Endpoint:** `DELETE /admin/contact/{id}`

**Headers:**

- `Authorization: Bearer {access_token}`
- `Accept-Language: {{LANG}}` (optional)

**Response (200 OK):**

```json
{
  "message": "Successfully removed",
  "data": null,
  "result": true
}
```

---

## Comments Management

### List All Comments

**Endpoint:** `GET /admin/comments`

**Headers:**

- `Authorization: Bearer {access_token}`

**Response (200 OK):**

```json
{
  "message": "Ok",
  "data": [
    {
      "id": 1,
      "comment": "I prefer!Because the movie is besteller!",
      "created_at": "2024-10-28T15:44:27.759Z",
      "movie": {
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
    }
  ],
  "result": true
}
```

### Delete Comment

**Endpoint:** `DELETE /admin/movies/{movieId}/comment/{commentId}`

**Headers:**

- `Authorization: Bearer {access_token}`

**Response (200 OK):**

```json
{
  "message": "Successfully removed",
  "data": null,
  "result": true
}
```

---

## Dashboard

### Get Dashboard Statistics

**Endpoint:** `GET /admin/dashboard`

**Headers:**

- `Authorization: Bearer {access_token}`
- `Accept-Language: {{LANG}}` (optional)

**Response (200 OK):**

```json
{
  "message": "Ok",
  "data": {
    "comments": 1,
    "users": 4,
    "favorites": 1,
    "categories": 15,
    "movies": 1,
    "actors": 21,
    "contacts": 1
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
