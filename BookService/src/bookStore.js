var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var bookStoreSchema = new Schema({
  title: String,
  author: String,
  owner: String,
  borrower: String,
  isBorrowed: Boolean,
  datePosted: Date,
  dateBorrowed: Date,
});

module.exports = mongoose.model("bookStore", bookStoreSchema);
