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
  if (!req.query.q) return res.send("EMPTY");
  console.log("hi");
  let searchTerm = req.query.q.replaceAll("+", " ").trim();
  let bookManager = new BookManager();
  console.log("Searching for:", searchTerm);
  return bookManager
    .connect()
    .then(() => bookManager.searchBooks(searchTerm))
    .then((result) =>
      result.flat().map((r) => {
        return {
          _id: r._id,
          title: r.title,
          author: r.author,
          owner: r.owner,
          borrower: r.borrower,
          isBorrowed: r.isBorrowed,
          datePosted: r.datePosted,
          dateBorrowed: r.dateBorrowed,
        };
      }),
    )
    .then((cleaned) => res.send(cleaned));
}

async function addBook(req, res) {
  const book = req.body;
  console.log("body:", book);
  const bookManager = new BookManager();
  return bookManager
    .connect()
    .then(() => bookManager.addBook(book.title, book.author, book.owner))
    .then((book) => res.send(book));
}

const server = app.listen(process.env.PORT || 3001, () => {
  console.log(`BookService is running on port: ${server.address().port}`);
});
