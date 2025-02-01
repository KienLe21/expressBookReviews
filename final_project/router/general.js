const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if (isValid(username)) {
    return res.status(400).json({message: "Username already exists"});
  }
  users.push({username: username, password: password});
  return res.status(200).json({message: "User successfully registered"});
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  //Write your code here
  new Promise((resolve, reject) => {
    resolve(books);
  })
  .then((books) => {
    return res.status(200).json(books);
  })
  .catch((err) => {
    return res.status(500).json({message: "Internal Server Error"});
  });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject("Book not found");
    }
  })
  .then((book) => {
    return res.status(200).json(book);
  })
  .catch((err) => {
    return res.status(404).json({message: err});
  });
});
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  //Write your code here
  const author = req.params.author.trim().toLowerCase();
  new Promise((resolve, reject) => {
    let author_books = {};
    for (let isbn in books) {
      if (books[isbn].author.trim().toLowerCase() === author) {
        author_books[isbn] = books[isbn];
      }
    }
    resolve(author_books);
  })
  .then((author_books) => {
    return res.status(200).json(author_books);
  })
  .catch((err) => {
    return res.status(500).json({message: "Internal Server Error"});
  });
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  //Write your code here
  const title = req.params.title.trim().toLowerCase();
  new Promise((resolve, reject) => {
    let title_books = {};
    for (let isbn in books) {
      if (books[isbn].title.trim().toLowerCase() === title) {
        title_books[isbn] = books[isbn];
      }
    }
    resolve(title_books);
  })
  .then((title_books) => {
    return res.status(200).json(title_books);
  })
  .catch((err) => {
    return res.status(500).json({message: "Internal Server Error"});
  });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});

module.exports.general = public_users;
