const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
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
public_users.get('/', async function (req, res) {
    try {
      const response = await axios.get('/');
      const allBooksData = response.data;
      res.send(JSON.stringify(allBooksData, null, 4));
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'No books have been found.' });
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    try {
      const isbn = req.params.isbn;
      const book = await getBookByISBN(isbn);
  
      if (book) {
        res.send(book);
      } else {
        res.status(404).json({ message: 'Book not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'No books available.' });
    }
  });
  
  async function getBookByISBN(isbn) {
    try {
      const response = await axios.get(`/isbn/${isbn}`);
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return null; // Book not found
      }
      throw new Error('No books have been found.');
    }
};
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    try {
      const nameOfAuthor = req.params.author;
      const response = await axios.get('/author/:author');
      const books = response.data;
  
      const writtenByAuthor = books.filter(book => book.author === nameOfAuthor);
  
      if (writtenByAuthor.length === 0) {
        return res.status(404).json({ message: 'No books found.' });
      }
  
      res.status(200).json(writtenByAuthor);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'No books have been found by this author.' });
    }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    try {
      const titleName = req.params.title;
      const response = await axios.get('/title/:title');
      const books = response.data;
  
      const booksWithTitle = books.filter(book => book.title === titleName);
  
      if (booksWithTitle.length === 0) {
        return res.status(404).json({ message: 'No books found.' });
      }
  
      res.status(200).json(booksWithTitle);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'No books have been found by this title.' });
    }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
  if(isbn === isbn){
    res.status(200).json(books[isbn])};
});

module.exports.general = public_users;
