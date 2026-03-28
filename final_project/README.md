# 📚 Express Book Reviews API

This project is a REST API built with Node.js and Express that allows managing book reviews. It is part of a practice exercise focused on learning routing, basic authentication, and data handling in an Express server.

---

## 🚀 Features

- 📖 Get a list of available books
- 🔍 Search books by:
  - ISBN
  - Author
  - Title
- 📝 User registration and login
- ⭐ Add, update, and delete book reviews
- 🔐 Basic authentication for protected operations

---

## 🛠️ Technologies Used

- Node.js
- Express.js
- JavaScript (ES6)
- JSON as simple data storage

---

## 📂 Project Structure
project-root/
│
├── final_project/
│ ├── router/
│ │ ├── general.js # public routes
│ │ └── auth_users.js # authenticated routes
│ ├── index.js # entry point
│ └── package.json
│
└── README.md

---

## ⚙️ Installation

1. Clone the repository:

```bash
git clone https://github.com/jiniguez-nu/expressBookReviews.git
cd expressBookReviews/final_project

2. Install dependencies:
npm install

3. Run the server:
npm start 

🌐 Main Endpoints
📚 Books
GET / → Get all books
GET /isbn/:isbn → Search by ISBN
GET /author/:author → Search by author
GET /title/:title → Search by title
👤 Users
POST /register → Register user
POST /login → Login
⭐ Reviews (requires authentication)
PUT /auth/review/:isbn → Add or update a review
DELETE /auth/review/:isbn → Delete a review
🔐 Authentication

The system uses basic authentication with sessions to protect routes that require authenticated users.

📌 Notes
This project is intended for educational purposes.
It does not use a persistent database (data is stored in memory/JSON).
It serves as a base for building more complete APIs.
🚀 Possible Improvements
Integrate a database (MongoDB, PostgreSQL)
Implement JWT instead of sessions
Add data validation
Document the API using Swagger
📄 License

This project is distributed under the Apache 2.0 license.