# Fibre fantasies backend

This is the API for the Fibre Fantasies website.

### Link

[Frontend source code](https://github.com/aycin1/hooks)
[Deployed website]()

## How it's made

The backend is built with **Node** and **Express**, structured around a RESTful API that handles all data flow between the client and database.

User authentication is achieved with **JSON web tokens**, which are issued by the server on login and are verified for protected routes.

Image uploading is handled by **ImageKit**. After a user uploads an image on the frontend, the server sends them to ImageKit, stores the URL in the database, and provides that URL to the frontend for rendering.

The backend also communicates with the [Ravelry API](https://www.ravelry.com/api) for fetching pattern data.

The server is connected to a **PostgreSQL** database that stores users, lists, posts, follows, and post interactions. Data is fetched from the database using parameterised queries to prevent SQL injection.

# Usage

# Installation

## Dependencies

- axios 1.7.9
- bcrypt 5.1.1
- cookie-parser 1.4.7
- cors 2.8.5
- dotenv 16.4.7
- express 4.21.2
- imagekit 6.0.0
- jsonwebtoken 9.0.2
- nodemon 3.1.9
- pg 8.13.1
- uuid 11.0.5

# Improvements

# Acknowledgements

[Ravelry](https://www.ravelry.com/api)

[Dave Gray](https://github.com/gitdagray)

[ImageKit](https://imagekit.io/)
