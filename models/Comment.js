var mongoose = require("mongoose");

var CommentSchema = new mongoose.Schema({
  // `name` must be of type String
  // `name` must be unique, the default mongoose error message is thrown if a duplicate value is given
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

// This creates our model from the above schema, using mongoose's model method
var Library = mongoose.model("Comment", CommentSchema);

// Export the Library model
module.exports = Library;
