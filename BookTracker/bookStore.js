var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var bookStoreSchema = new Schema({
  title: String,
  author: String,
  status: {
    type: String,
    enum: ["owned", "reading", "finished", "will_not_finish"],
    default: "owned",
  },
  dateAdded: Date,
});

module.exports = mongoose.model("bookStore", bookStoreSchema);
