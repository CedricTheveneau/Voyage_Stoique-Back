const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const commentSchema = new mongoose.Schema({
  author: {
    type: String,
    required: [true, "The author field is required"],
  },
  authorUsername: {
    type: String,
    required: [true, "The author username field is required"],
  },
  content: {
    type: String,
    required: [true, "The content field is required"],
    trim: true,
    lowercase: false,
  },
  parentComment: {
    type: String,
    default: null,
  },
  publishDate: {
    type: Date,
    required: [true, "The publish date field is required"],
    default: Date.now(),
  },
  lastModifiedDate: {
    type: Date,
    required: [true, "The last modified date field is required"],
    default: Date.now(),
  },
  upvotes: {
    type: [String],
    required: [true, "The upvotes field is required"],
    default: [],
  }
});

commentSchema.plugin(uniqueValidator);

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;