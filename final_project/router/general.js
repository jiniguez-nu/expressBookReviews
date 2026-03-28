const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  const {username, password } = req.body;

  // Check if both username and password are provided
  if (username && password) {
      // Check if the user does not already exist
      if (!isValid(username)) {
          // Add the new user to the users array
          users.push({"username": username, "password": password});
          return res.status(200).json({message: `User ${username} successfully registered. Now you can login`});
      } else {
          return res.status(404).json({message: "User already exists!"});
      }
  }
  // Return error if username or password is missing
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',async function (req, res) {
  //we wrap the async functions in a try to handle errors
  try {
    const getBooks = () => {
      return new Promise((resolve, reject) => {
        if (books) {
          resolve(books);
        } else {
          reject(new Error("Could not load books list"));
        }
      });
    };

    // await for promise to be resolved
    const allBooks = await getBooks();

    // Send JSON response with books data and a '200' status
    res.status(200).send(JSON.stringify(allBooks, null, 4));
  } catch (error) {
    // Error handling in case the server doesn't respond
    res.status(500).json({ message: "Error fetching books list" });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  if (req.params.isbn < 1 || req.params.isbn > 10 ) {
    res.send("That book is not on the list")
  } else {
    // Retrieve the isbn parameter from the request URL and send the corresponding book's details
    const isbn = req.params.isbn;
    res.send(books[isbn]);
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  // Get book details based on requested author
  let author = req.params.author;
  const filteredBooks = Object.entries(books)
    .filter(([id, info]) => info.author === author)
    .map(([id, info]) => ({
      isbn: id,
      ...info
    }));
  if (filteredBooks.length > 0) {
    res.send(JSON.stringify(filteredBooks[0],null,4));
  } else {
    res.status(404).json({message: "Author not found"});
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  // Get book details based on requested title
  let title = req.params.title;
  const filteredBooks = Object.entries(books)
    .filter(([id, info]) => info.title === title)
    .map(([id, info]) => ({
      isbn: id,
      ...info
    }));
  if (filteredBooks.length > 0) {
    res.send(JSON.stringify(filteredBooks[0],null,4));
  } else {
    res.status(404).json({message: "Title not found"});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  if (req.params.isbn < 1 || req.params.isbn > 10 ) {
    res.status(404).json({message: "ISBN not found"});
  } else {
    // Retrieve the isbn parameter from the request URL and send the corresponding book's details
    const isbn = req.params.isbn;
    const book = books[isbn];
    const reviews = book.reviews;
    
    res.send(JSON.stringify(reviews,null,4));
  }
});

module.exports.general = public_users;
