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

- Render (backend and database)
- Vercel (frontend)

## Usage

The backend is fully deployed on Render, so users can interact with the API without installation or configuration. You can test endpoints using Postman, Thunder Client, or any HTTP client.

### Base URL

https://fibre-fantasies-backend.onrender.com

### Authentication

Most routes of this API require authentication prior to access.

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

- body: access token
- cookie: refresh token

#### Refresh

`GET /refresh`

Uses the refresh token cookie to generate a new access token

### Lists

`GET /lists/`

Returns lists and their patterns for the authenticated user.

<br/>

`POST /lists/`

Adds pattern to a list

Body:

```json
{ "pattern_id": "123456", "list": "wishlist" }
```

<br/>

`PATCH /lists/`

Moves pattern to a different list

Body:

```json
{ "pattern_id": "123456", "list": "in-progress" }
```

<br/>

`DELETE /lists/`

Removes pattern from your lists

Body:

```json
{ "pattern_id": "123456" }
```

### Patterns (via Ravelry API)

`GET /patterns/filter/:id`

Returns information about a specific pattern (price, craft, needle/hook sizes, yardage, gauge, images, category, author, URL for purchase/download, etc.)

<br/>

`GET /patterns/refine`

// unfinished

## How It's Made

The backend is built with **Node** and **Express**, following a RESTful architecture. It handles user authentication, data persistence, image uploads, and communication with external APIs. All database queries use parameterised SQL for security.

### Architecture Highlights

- Token-based authentication using **JSON Web Tokens**
- Refresh tokens are stored in secure, HTTP-only cookies
- **ImageKit** handles image uploads and optimised delivery
- Integration with the **Ravelry API** for pattern data
- **PostgreSQL** database stores users, lists, posts, likes, comments, and follows

### Deployment

The backend and database are deployed on **Render** and the frontend is deployed on **Vercel**.

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
- Lazy loading of images

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
