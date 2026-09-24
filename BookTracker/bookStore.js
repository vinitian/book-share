var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var bookStoreSchema = new Schema({
  title: String,
  author: String,
  status: String,
  dateAdded: Date,
  dateModified: Date,
});

module.exports = mongoose.model("bookStore", bookStoreSchema);
