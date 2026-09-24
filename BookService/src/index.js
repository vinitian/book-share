const express = require("express");
// const cors = require("cors");
const BookManager = require("./bookManager");

const app = express();

app.use(function (err, req, res, next) {
  console.error(err);
  res.set("Content-Type", "text/html");
  res.status(500).send("<h1>Internal Server Error</h1>");
});

// const corsOptions = {
//   origin: "http://localhost:3000",
// };
// app.use(cors(corsOptions));

// -- parse requests of content-type - application/json
app.use(express.json());

// For parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// -- parse requests of content-type - application/x-www-form-urlencoded
// app.use(express.urlencoded({ extended: true }));

const router = express.Router();
router.get("/", getBooks);
router.get("/search", searchBooks);
router.post("/add", addBook);
router.post("/set-status", setBookStatus);
app.use("/", router);

function getBooks(req, res) {
  const bookManager = new BookManager();
  return bookManager
    .connect()
    .then(() => bookManager.getBooks())
    .then((r) => {
      console.log("Number of results:", r.length);
      return r;
    })
    .then((cleaned) => res.send(cleaned));
}

function searchBooks(req, res) {
  // TODO: handle the EMPTY case?
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
          dateModified: r.dateModified,
        };
      }),
    )
    .then((cleaned) => res.send(cleaned));
}

async function addBook(req, res) {
  const book = req.body;
  const bookManager = new BookManager();
  return bookManager
    .connect()
    .then(() => bookManager.addBook(book.title, book.author))
    .then((book) => res.send(book));
}

async function setBookStatus(req, res) {
  const bookId = req.body.id;
  const status = req.body.newStatus;
  const bookManager = new BookManager();
  return bookManager
    .connect()
    .then(() => bookManager.setBookStatus(bookId, status))
    .then((result) => res.send(result));
}

const server = app.listen(process.env.PORT || 3001, () => {
  console.log(`BookService is running on port: ${server.address().port}`);
});
