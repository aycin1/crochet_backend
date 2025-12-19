# Fibre Fantasies - Backend

This is the API for the [Fibre Fantasies](https://fibre-fantasies.vercel.app/) social platform for crochet and knitting enthusiasts. It implements user authentication, list and pattern management, social interactions, and communication with the [Ravelry API](https://www.ravelry.com/api).

The backend supports the frontend application and handles all data persistence, secure user actions, and integration with external services.

<details open>
  <summary><h3>Table of Contents</h3></summary>
  <ol>
    <li><a href="#links">Links</a></li>
    <li><a href="#features">Features</a></li>
    <li><a href="#tech-stack">Tech Stack</a></li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#how-its-made">How It's Made</a></li>
    <li><a href="#dependencies">Dependencies</a></li>
    <li><a href="#future-improvements">Future Improvements</a></li>
    <li><a href="#acknowledgements">Acknowledgements</a></li>
  </ol>
</details>

## Links

- [Deployed API](https://fibre-fantasies-backend.onrender.com)
  (Note: the Render free tier may take up to a minute to wake the API after inactivity)
- [Deployed website](https://fibre-fantasies.vercel.app/)
- [Frontend repository](https://github.com/aycin1/fibre-fantasies-frontend)

## Features

- User authentication (register, login, token refresh)
- Secure access tokens + HTTP-only cookie-based refresh tokens
- CRUD operations for posts, lists, and interactions
- Integration with the **Ravelry API** for pattern data
- Image uploading via **ImageKit**
- Full social features: posts, likes, comments, follows
- Parameterised SQL queries for security

## Tech Stack

### Backend

- Node.js / Express
- PostgreSQL
- pg
- JWT authentication
- ImageKit
- Ravelry API

### Frontend

- React and Vite
- React-Router
- CSS Modules
- Axios
- ImageKit

### Deployment

- Render (backend)
- Supabase (database)
- Vercel (frontend)

--------

<details open><summary><h2>Usage</h2></summary>

The backend is fully deployed on Render, so users can interact with the API without installation or configuration. You can test endpoints using Postman, Thunder Client, or any HTTP client.

### Base URL

https://fibre-fantasies-backend.onrender.com

Most routes of this API require authentication prior to access.

### Authentication

Handles user registration, login, and token refreshing.

#### Registration

`POST /register`

Body:

```json
{ "email": "your@email.com", "username": "username", "password": "password" }
```

The email address and username must be unique.

#### Login

`POST /login`

Body:

```json
{ "username": "username", "password": "password" }
```

Response:

- Body: access token
- Cookie: refresh token

#### Refresh

`GET /refresh`

Uses the refresh token cookie to generate a new access token.

### Lists

Handles saving, relocating, and removing patterns from a user's lists.

#### `GET /lists/`

Returns all lists and their patterns for the authenticated user.

Response example:

```json
{ 
  "data": [
    {
      "name": "wishlist",
      "patterns": [{"pattern_id": "7471498", "name": "wishlist"}, {"pattern_id": "7481615", "name": "wishlist"}, {"pattern_id": "7392714", "name": "wishlist"}]
    },
    {
      "name": "in-progress",
      "patterns": [{"pattern_id": "1258283", "name": "in-progress"}, {"pattern_id": "7371420", "name": "in-progress"}]
    },
    {
      "name": "completed",
      "patterns": []
    }
  ]
}
```

#### `POST /lists/`

Adds pattern to a list.

Body:

```json
{ "pattern_id": "123456", "list": "wishlist" }
```

#### `PATCH /lists/`

Moves pattern to a different list.

Body:

```json
{ "pattern_id": "123456", "list": "in-progress" }
```

#### `DELETE /lists/`

Removes pattern from the user's lists.

Body:

```json
{ "pattern_id": "123456" }
```

### Patterns

Endpoints for fetching pattern details from the Ravelry API.

##### `GET /patterns/filter/:id`

Returns information about a specific pattern using the pattern id (price, craft, needle/hook sizes, yardage, images, category, author, URL for purchase/download, etc.).

##### `GET /patterns/refine`

By default returns 30 patterns from the Ravelry API.

#### Refining search

For filtering the results, you can utilise the query parameters below. Various query parameters can be concatenated for advanced filtering with `&`.

##### Search using keywords

`GET /patterns/refine?query=bucket%20hat`

Returns patterns with matching keywords.

##### Filter by craft

`GET /patterns/refine?craft=crochet`

- Returns crochet patterns only
- Craft options: crochet, knitting, loom knitting (`=loom-knitting`), machine knitting (`=machine-knitting`)

##### Filter by availability

`GET /patterns/refine?availability=free`

- Returns free patterns only
- Availability options: free, purchase online (`=online`), purchase in print (`=inprint`), Ravelry download (`=ravelry`)

##### Filter by yarn weight

`GET /patterns/refine?weight=worsted`

- Returns patterns that require worsted weight yarn
- Yarn weight options: thread, cobweb, lace, light fingering, fingering, sport, DK, worsted, aran, bulky, super bulky, jumbo

##### Filter by pattern categories

`GET /patterns/refine?pc=dress`

- Returns patterns for dresses only
- Category options can be viewed [here](https://api.ravelry.com/pattern_categories/list.json) (I recommend using a JSON viewer for better readability)
- The permalink value of the desired category can be used to filter the search

##### Filter by pattern attributes

`GET /patterns/refine?pa=309`

- Returns patterns with corrugated ribbing only
- Attribute groups can be viewed [here](https://api.ravelry.com/pattern_attributes/groups.json) (I recommend using a JSON viewer for better readability)
- The id value of the desired attribute can be used to filter the search

#### Example search and response

`GET /patterns/refine?pc=throw&craft=crochet&availability=free&weight=dk&pa=186%2B242`

- Will look for throw patterns that are crochet, free, using DK weighted yarn, rectangle-shaped (242) and mosaic (186)
- If you wanted to broaden your options, you can replace `%2B` with `%7C` for patterns that are either rectangle-shaped OR mosaic

Response:

```json
{
  "patternIDs": [
    7484478, 7471498, 7487426, 7487109, 7392714, 1341831, 1258283, 1255578,
    271504, 7487281, 1204116, 7486787, 990044, 857493, 7487107, 7486861,
    7485511, 980701, 1070649, 754478, 7487278, 7487267, 7304956, 1296810,
    7455631, 7487178, 1285522, 1246632, 1279445, 7487499
  ]
}
```

The backend normalises third-party API data and exposes only pattern IDs. Detailed pattern data is fetched separately to reduce payload size and coupling.

</details>

## How It's Made

The backend is built with **Node** and **Express**, following a RESTful architecture. It handles user authentication, data persistence, image uploads, and communication with external APIs. All database queries use parameterised SQL for security.

### Architecture Highlights

- Token-based authentication using **JSON Web Tokens**
- Refresh tokens are stored in secure, HTTP-only cookies
- **ImageKit** handles image uploads and optimised delivery
- Integration with the **Ravelry API** for pattern data
- **PostgreSQL** database stores users, lists, posts, likes, comments, and follows

### Deployment

- The backend is deployed on **Render**
- The database is deployed on **Supabase**
- The frontend is deployed on **Vercel**

## Dependencies

- axios 1.7.9
- bcrypt 5.1.1
- cookie-parser 1.4.7
- cors 2.8.5
- dotenv 16.4.7
- express 4.21.2
- imagekit 6.0.0
- jsonwebtoken 9.0.2
- pg 8.13.1
- uuid 11.0.5

## Future Improvements

### Performance & UX

- Pagination for pattern search

### Enhancements

- Full CRUD for user-created custom lists
- Comment replies
- Notifications
- Direct messaging
- Sharing patterns or posts via messages

### Privacy Features

- Option for private profile
- Public lists visible on profiles

### Content Expansion

- Tutorials
- Blog posts

## Acknowledgements

- [Ravelry](https://www.ravelry.com/api)
- [Dave Gray](https://github.com/gitdagray)
- [ImageKit](https://imagekit.io/)
