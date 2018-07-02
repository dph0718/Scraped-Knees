const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
  author: {
    type: String,
    default: "Unknown Author"
  },
  title: {
    type: String,
    unique: true,
    required: "Title Required"
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  link: {
    type: String,
    required: "link Required"
  },
  content: {
    type: String,
    default: "No Content Provided"
  },
  source: {
    type: String,
    default: "Unknown Source"
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment'
    }
  ],
});

const Article = mongoose.model("Article", ArticleSchema);
module.exports = Article;
