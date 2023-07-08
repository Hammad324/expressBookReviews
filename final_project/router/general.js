const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  
  if (username && password) {
    if (!isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({ message: "User successfully registred. "});
    } else {
      return res.status(404).json({ message: "User already exists!" });    
    }
  } 
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    //res.send(JSON.stringify(books, null, 4));
    allBooks()
      .then(function (booksData) {
        res.send(JSON.stringify(booksData, null, 4));
      })
      .catch(function (error) {
        console.error(error);
        res.status(404).json({ message: 'Cannot find books data.' });
      });
  });
  
  function allBooks() {
    return axios
      .get('/')
      .then(function (response) {
        return response.data;
      })
      .catch(function (error) {
        throw error;
      });
  }

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
  
    getByISBN(isbn)
      .then(function (book) {
        if (book) {
          res.send(book);
        } else {
          res.status(404).json({ message: 'Book not found.' });
        }
      })
      .catch(function (error) {
        console.error(error);
        res.status(500).json({ message: 'Cannot find details.' });
      });
  });
  
  function getByISBN(isbn) {
    return axios
      .get(`/isbn/${isbn}`)
      .then(function (response) {
        return response.data;
      })
      .catch(function (error) {
        if (error.response && error.response.status === 404) {
          return null; // Book not found
        }
        throw error;
      });
}
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const nameOfAuthor = req.params.author;
  
    bookByAuthor(nameOfAuthor)
      .then(function (writtenByAuthor) {
        if (writtenBy.length === 0) {
          return res.status(404).json({ message: 'No books found.' });
        }
  
        res.status(200).json(writtenBy);
      })
      .catch(function (error) {
        console.error(error);
        res.status(500).json({ message: 'No such books available.' });
      });
  });
  
  function bookByAuthor(author) {
    return axios
      .get('/author?author=' + author)
      .then(function (response) {
        return response.data;
      })
      .catch(function (error) {
        throw error;
      });
  }

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const titleName = req.params.title;
  
    BookByTitle(titleName)
      .then(function (bookWithTitle) {
        if (bookWithTitle.length === 0) {
          return res.status(404).json({ message: 'No books found.' });
        }
  
        res.status(200).json(booksWithTitle);
      })
      .catch(function (error) {
        console.error(error);
        res.status(500).json({ message: 'No such books available' });
      });
  });
  
  function BookByTitle(title) {
    return axios
      .get('/title?title=' + title)
      .then(function (response) {
        return response.data;
      })
      .catch(function (error) {
        throw error;
      });
  }

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
  
    getByISBN(isbn)
      .then(function (book) {
        if (book) {
          res.status(200).json(book);
        } else {
          res.status(404).json({ message: 'This book is not available.' });
        }
      })
      .catch(function (error) {
        res.status(500).json({ message: 'No reviews available' });
      });
  });
  
  function getByISBN(isbn) {
    return axios
      .get(`/review/${isbn}`)
      .then(function (response) {
        return response.data;
      })
      .catch(function (error) {
        if (error.response && error.response.status === 404) {
          return null; // Book not found
        }
        throw error;
      });
}

module.exports.general = public_users;
