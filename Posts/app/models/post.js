const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const slugify = require("slugify");

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
  slug: {
    type: String,
    required: [true, "The slug field is required"],
    unique: [true, "You are trying to copy an already existing slug"],
    trim: true,
    lowercase: true,
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
    enum: ["méditation", "portrait", "présentation d’œuvre", "concept", "analyse", "mise à jour / nouvelle fonctionnalité"],
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

postSchema.pre("validate", function (next) {
  if (!this.slug && this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

postSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  if (update.title) {
    update.slug = slugify(update.title, { lower: true, strict: true });
    if (this._conditions._id) {
      update.slug = `${update.slug}-${this._conditions._id}`;
    }
  }
  next();
});

postSchema.post("save", async function () {
  if (!this.slug.includes(this._id)) {
    this.slug = `${this.slug}-${this._id}`;
    await this.save();
  }
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;