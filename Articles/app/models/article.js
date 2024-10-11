const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "The title field is required"],
    trim: true,
    unique: true,
    lowercase: true,
  },
  intro: {
    type: String,
    required: [true, "The intro field is required"],
    trim: true,
    unique: true,
    lowercase: false,
  },
  cover: {
    type: String,
    required: [true, "The cover field is required"],
    unique: [true, "This image is already used by an existing article"],
    trim: true,
    lowercase: false,
  },
  content: {
    type: String,
    required: [true, "The content field is required"],
    unique: [true, "You are trying to copy an already existing article"],
    trim: true,
    lowercase: false,
  },
  audio: {
    type: String,
    required: false,
    default: null,
    unique: [true, "This audio file is already used by an existing article"],
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
    enum: ["user", "admin"],
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
  reads: {
    type: [String],
    required: [true, "The reads field is required"],
    default: [],
  },
  readingTime: {
    type: Number,
    required: [true, "The readingTime field is required"],
  },
});

articleSchema.plugin(uniqueValidator);

const Article = mongoose.model("Article", articleSchema);

module.exports = Article;