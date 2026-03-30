const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  // Filter the users array for any user with the same username and password
  let validuser = users.filter((user) => {
      return (user.username === username);
  });
  // Return true if any valid user is found, otherwise false
  if (validuser.length > 0) {
      return true;
  } else {
      return false;
  }
}

const authenticatedUser = (username,password)=>{ //returns boolean
  // Filter the users array for any user with the same username and password
  if (!isValid(username)) return false;

  let validusers = users.filter((user) => {
      return (user.username === username && user.password === password);
  });
  // Return true if any valid user is found, otherwise false
  if (validusers.length > 0) {
      return true;
  } else {
      return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const { username, password }= req.body;

    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });

        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send(`User ${username} successfully logged in`);
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  // Extract isbn parameter from request URL
  const isbn = req.params.isbn;
  let book = books[isbn];  // Retrieve book object associated with isbn

  if (book) {
    let review = req.body.review;

    // Get the username from the session
    const username = req.session.authorization?.username || req.session.username;
    
    // Check if user is logged in
    if (!username || !isValid(username)) {
      return res.status(403).json({ message: "You must login to delete a review" });
    }
          
    // Update review if provided in request body
    if (review) {
        book["reviews"] = {...book["reviews"], [username]: review};
    }

    books[isbn] = book;  // Update book details in 'books' object
    res.send(`The review "${review}" by "${username}" for book ${isbn} has been updated.`);
  } else {
      // Respond if friend with specified email is not found
      res.send("Unable to find book!");
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  // Extract isbn and username parameters from request URL
  const isbn = req.params.isbn;
  // Get the username from the session
  const username = req.session.authorization?.username || req.session.username;

  if (!username || !isValid(username)) {
    return res.status(403).json({ message: "You must login to delete a review" });
  }

  if (books[isbn]) {
    let book = books[isbn];

    // Check if a review exists for that user in books
    if (book.reviews && book.reviews[username]) {
      
      // if a review exists for user, we permanently delete that review only
      delete book.reviews[username];
     
      // Send response confirming deletion of review   
      return res.status(200).send(`Review for ISBN ${isbn} posted by ${username} has been Successfully deleted.`);
    } else {
      // Send response letting the user know a review wasn't found
      return res.status(404).json({ message: "No review found for this user on this book." });
    }
  } else {
    // Send response letting the user know there's no such book
    return res.status(404).json({ message: "Book not found!" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
