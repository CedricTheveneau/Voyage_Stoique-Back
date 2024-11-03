const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "The title field is required"],
    trim: true,
    unique: true,
    lowercase: true,
  },
  cover: {
    type: String,
    trim: true,
    lowercase: false,
    default: "",
  },
  content: {
    type: String,
    required: [true, "The content field is required"],
    unique: [true, "You are trying to copy an already existing post"],
    trim: true,
    lowercase: false,
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
  keywords: {
    type: [String],
    required: false,
    default: [],
  },
  category: {
    type: String,
    enum: ["méditation", "portrait", "présentation d’œuvre", "concept", "analyse"],
    required: [true, "The category field is required"],
  },
  upvotes: {
    type: [String],
    required: [true, "The upvotes field is required"],
    default: [],
  },
  comments: {
    type: [String],
    required: [true, "The comments field is required"],
    default: [],
  },
  savedNumber: {
    type: [String],
    required: [true, "The saved number field is required"],
    default: [],
  },
  author: {
    type: String,
    required: [true, "The author field is required"],
  },
  authorUsername: {
    type: String,
    required: [true, "The author username field is required"],
  },
  reads: {
    type: [String],
    required: [true, "The reads field is required"],
    default: [],
  }
});

postSchema.plugin(uniqueValidator);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;