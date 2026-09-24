const mongoose = require("mongoose");
var dbServer = "127.0.0.1:27017";
const dbPort = "27017";
const dbName = "booktracker-db";
const Book = require("./bookStore");

class BookManager {
  constructor() {}

  connect() {
    if (!process.env.DB_HOST) {
      console.log("WARNING: the environment variable DB_HOST is not set");
    } else {
      dbServer = process.env.DB_HOST + ":" + dbPort;
    }

    let connection = `mongodb://${dbServer}/${dbName}`;
    return mongoose.connect(connection).catch((err) => {
      console.error("Database connection error", dbName);
      console.error(" trying to connect to server:", connection);
    });
  }

  getBooks() {
    return Book.find();
  }

  addBook(title, author) {
    console.log(`Adding "${title}"`);
    const date = new Date();
    return new Book({
      title: title,
      author: author,
      status: "owned",
      dateAdded: date,
    })
      .save()
      .catch((err) => console.log("Error while inserting book:", err.message));
  }

  searchBooks(searchString) {
    console.log("Starting search for", searchString);
    const regex = { $regex: searchString, $options: "i" };
    const query = { $or: [{ title: regex }, { author: regex }] };
    return Book.find(query).collation({
      locale: "en",
      strength: 1,
    });
  }

  setBookStatus(bookId, status) {
    return Book.updateOne({ _id: bookId }, { $set: { status: status } });
  }

  deleteBook(bookId) {
    return Book.deleteOne({ _id: bookId });
  }
}

module.exports = BookManager;
