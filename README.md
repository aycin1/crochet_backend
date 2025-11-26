# Fibre fantasies backend

This is the API for the Fibre Fantasies website.

### Link

[Frontend source code](https://github.com/aycin1/fibre-fantasies-frontend)

<!-- [Deployed website]() -->

## How it's made

The backend is built with **Node** and **Express**, structured around a RESTful API that handles all data flow between the client and database.

User authentication is achieved with **JSON web tokens**, which are issued by the server on user login and are verified via custom middleware for protected routes.

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

- I intend to implement pagination within the pattern search endpoint for faster loading of data on the frontend received from the third party API via the backend.

- Currently, three custom lists are created upon user registration on the backend. I would like to establish the appropriate endpoints for users to be able to create, edit, and delete their own lists.

- I aim to add privacy features such as making your profile private and having the ability to approve or deny follow requests from other users, as well as the option to make any list public and therefore visible on the users profile.

- Furthermore, I hope to collate informative blogs and tutorials for an educational section for those who would like to learn or advance their skills.

# Acknowledgements

- [Ravelry](https://www.ravelry.com/api)

- [Dave Gray](https://github.com/gitdagray)

- [ImageKit](https://imagekit.io/)
