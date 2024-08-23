const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const postSchema = new mongoose.Schema({
  profilePic: {
    type: String,
    required: [true, "The profile picture field is required"],
    unique: [true, "This image URL is already in use"],
    trim: true,
    lowercase: false,
  },
  firstName: {
    type: String,
    required: [true, "The first name field is required"],
    unique: false,
    trim: true,
    lowercase: true,
  },
  lastName: {
    type: String,
    required: [true, "The last name field is required"],
    unique: false,
    trim: true,
    lowercase: true,
  },
  job: {
    type: String,
    required: [true, "The job field is required"],
    trim: true,
    unique: false,
    lowercase: true,
  },
  currentCompany: {
    type: String,
    required: false,
    trim: true,
    unique: false,
    lowercase: true,
  },
  currentCompanyAdress: {
    type: String,
    required: false,
    unique: false,
    trim: true,
    lowercase: true,
  },
  skills: {
    type: [String],
    required: false,
  },
  qrCode: {
    type: String,
    required: false,
    trim: true,
    lowercase: true,
    unique: true,
  },
  contactEmail: {
    type: String,
    required: [true, "The contact email field is required"],
    trim: true,
    lowercase: true,
    unique: false,
  },
  contactTel: {
    type: Number,
    required: [true, "The contact number field is required"],
  },
  ctaText: {
    type: String,
    required: false,
    unique: false,
    trim: true,
    lowercase: false,
    default: "Let's work together !",
  },
  ctalink: {
    type: String,
    required: [true, "The button link field is required"],
    unique: false,
    trim: true,
    lowercase: false,
  },
});

postSchema.plugin(uniqueValidator);

const Article = mongoose.model("Article", postSchema);

module.exports = Article;