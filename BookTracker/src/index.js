const express = require("express");
const path = require("node:path");
const axios = require("axios");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.locals.dateFns = require("date-fns");

// Error handling
app.use(function (err, req, res, next) {
  console.error(err);
  res.set("Content-Type", "text/html");
  res.status(500).send("<h1>Internal Server Error</h1>");
});

async function getBooks(query) {
  const response = await axios.get(`${process.env.BOOKSERVICE_URL}/`);
  return response.data;
}

app.get("/", async (req, res, next) => {
  try {
    const results = await getBooks();
    res.render("home", {
      books: results,
    });
  } catch (err) {
    next(err);
  }
});

app.get("/add", async (req, res, next) => {
  try {
    res.render("add");
  } catch (err) {
    next(err);
  }
});

app.post("/add", async (req, res, next) => {
  try {
    const response = await axios.post(
      `${process.env.BOOKSERVICE_URL}/add`,
      req.body,
    );
    res.json(response.data);
  } catch (err) {
    next(err);
  }
});

async function searchBooks(query) {
  const response = await axios.get(
    `${process.env.BOOKSERVICE_URL}/search?q=${query}`,
  );
  return response.data;
}

app.get("/search", async (req, res, next) => {
  try {
    const searchQuery = req.query.q;
    if (!searchQuery) {
      const results = await getBooks();
      res.render("search", {
        books: results,
      });
      return;
    }

    const results = await searchBooks(searchQuery);
    res.render("search", {
      title: `Search results for ${searchQuery}`,
      books: results,
      searchQuery,
    });
  } catch (err) {
    next(err);
  }
});

app.patch("/set-status", async (req, res, next) => {
  try {
    const response = await axios.patch(
      `${process.env.BOOKSERVICE_URL}/set-status`,
      req.body,
    );
    res.json(response.data);
  } catch (err) {
    next(err);
  }
});

app.delete("/delete", async (req, res, next) => {
  try {
    const response = await axios.delete(
      `${process.env.BOOKSERVICE_URL}/delete`,
      { data: req.body },
    );
    res.send(response.data);
  } catch (err) {
    next(err);
  }
});

const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`BookTracker server started on port: ${server.address().port}`);
});
