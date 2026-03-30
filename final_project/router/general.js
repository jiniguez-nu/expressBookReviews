const express = require('express');
// Requiring axios module for making HTTP requests
const axios = require('axios').default;
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

  //fetch All books list endpoint for axios
public_users.get('/fetchallwithaxios',async function (req, res) {
  try {
    if (books) {
      return res.status(200).json(books);
    } else {
      return res.status(404).json({ message: "Could not load books list" });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Get the book list available in the shop
public_users.get('/',async function (req, res) {
  //we wrap the async functions in a try to handle errors
  try {
    // await for promise to be resolved
    const allBooks = await axios.get('http://localhost:5000/fetchallwithaxios');

    // Send JSON response with books data and a '200' status
    res.status(200).send(JSON.stringify(allBooks.data, null, 4));
  } catch (error) {
    // Error handling in case the server doesn't respond
    res.status(500).json({ message: "Error fetching books list"+error });
  }
});

// Get book details based on ISBN for axios
public_users.get('/isbnwithaxios/:isbn',async function (req, res) {
  const isbn = req.params.isbn;
  try {
    if (books[isbn]) {
      return res.status(200).json(books[isbn]);
    } else {
      return res.status(404).json({ message: "Could not find a book with that ISBN" });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
  if (req.params.isbn < 1 || req.params.isbn > 10 ) {
    res.send("That book is not on the list")
  } else {
    // Retrieve the isbn parameter from the request URL and send the corresponding book's details
    const isbn = req.params.isbn;

    try {
      const bookDetails = await axios.get(`http://localhost:5000/isbnwithaxios/${isbn}`);
      res.status(200).json(bookDetails.data);
    } catch (error) {
      // Error handling in case the server doesn't respond
    res.status(404).json({ message: error.message });
    }
  }
 });

 
// get book details based on author for axios
public_users.get('/authorforaxios/:author',async function (req, res) {
  const author = req.params.author;
  const filteredBooks = Object.entries(books)
    .filter(([id, info]) => info.author === author)
    .map(([id, info]) => ({
      isbn: id,
      ...info
    }));
  try {
    if (filteredBooks.length > 0) {
      return res.status(200).json(filteredBooks[0]);
    } else {
      return res.status(404).json({ message: `No books were found for ${author}` });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
  // Get book details based on requested author
  let author = req.params.author;

  try {
    // Await for the response
    const booksFound = await axios.get(`http://localhost:5000/authorforaxios/${author}`);

    // return the response with a 200 status
    res.status(200).send(JSON.stringify(booksFound.data));
  } catch (error) {
    // Handle error
    res.status(404).json({message: "Author not found"});
  } 
});

// Get all books based on title for axios
public_users.get('/titleforaxios/:title',async function (req, res) {
  const title = req.params.title;
  const filteredBooks = Object.entries(books)
    .filter(([id, info]) => info.title === title)
    .map(([id, info]) => ({
      isbn: id,
      ...info
    }));

  try {
    if (filteredBooks.length > 0) {
      return res.status(200).json(filteredBooks[0]);
    } else {
      return res.status(404).json({ message: `Title ${title} not found` });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
  // Get title from params
  let title = req.params.title;
  try {
    // Await for the response
    const booksFound = await axios.get(`http://localhost:5000/titleforaxios/${title}`);

    // return the response with a 200 status
    res.status(200).send(booksFound.data);
  } catch (error) {
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
