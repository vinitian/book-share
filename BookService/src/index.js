const express = require("express");
const BookManager = require("./bookManager");

const app = express();

app.use(function (err, req, res, next) {
  console.error(err);
  res.set("Content-Type", "text/html");
  res.status(500).send("<h1>Internal Server Error</h1>");
});

app.use(express.json());

const router = express.Router();
router.get("/", getBooks);
router.get("/search", searchBooks);
router.post("/add", addBook);
router.patch("/set-status", setBookStatus);
router.delete("/delete", deleteBook);
app.use("/", router);

function getBooks(req, res) {
  const bookManager = new BookManager();
  return bookManager
    .connect()
    .then(() => bookManager.getBooks())
    .then((r) => {
      console.log(`Fetched ${r.length} book(s)`);
      return r;
    })
    .then((cleaned) => res.send(cleaned));
}

function searchBooks(req, res) {
  if (!req.query.q) return res.send("EMPTY");
  let searchTerm = req.query.q.replaceAll("+", " ").trim();
  let bookManager = new BookManager();
  return bookManager
    .connect()
    .then(() => bookManager.searchBooks(searchTerm))
    .then((result) =>
      result.flat().map((r) => {
        return {
          _id: r._id,
          title: r.title,
          author: r.author,
          status: r.status,
          dateAdded: r.dateAdded,
        };
      }),
    )
    .then((r) => {
      console.log(`Fetched ${r.length} book(s) with query "${searchTerm}"`);
    })
    .then((cleaned) => res.send(cleaned));
}

async function addBook(req, res) {
  const book = req.body;
  const bookManager = new BookManager();
  return bookManager
    .connect()
    .then(() => bookManager.addBook(book.title, book.author))
    .then((r) => {
      console.log(`Added "${book.title}" by ${book.author}`);
    })
    .then((book) => res.send(book));
}

async function setBookStatus(req, res) {
  const bookId = req.body.id;
  const status = req.body.newStatus;
  const bookManager = new BookManager();
  return bookManager
    .connect()
    .then(() => bookManager.setBookStatus(bookId, status))
    .then((r) =>
      console.log(`Changed status of book ID ${bookId} to "${status}"`),
    )
    .then((result) => res.send(result));
}

async function deleteBook(req, res) {
  const bookId = req.body.id;
  const bookManager = new BookManager();
  return bookManager
    .connect()
    .then(() => bookManager.deleteBook(bookId))
    .then((r) => {
      console.log(`Deleted "${book.title}" by ${book.author} || ${r}`);
    })
    .then((result) => res.send(result));
}

const server = app.listen(process.env.PORT || 3001, () => {
  console.log(`BookService is running on port: ${server.address().port}`);
});
