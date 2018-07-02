var mongoose = require("mongoose");

var CommentSchema = new mongoose.Schema({
  author: {
    type: String,
    required: true
  },
  comment: {
    type: String,
    required: true
  },
  authorId: {
    type: String,
  },
  article: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Article"
    }
  ]
});
var Library = mongoose.model("Comment", CommentSchema);

module.exports = Library;
