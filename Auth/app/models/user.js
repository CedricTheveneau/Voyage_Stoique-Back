const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "The username field is required"],
    unique: [true, "The username must be unique"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "The email field is required"],
    unique: [true, "The email must be unique"],
    trim: true,
    lowercase: true,
    validate: {
      validator: function (email) {
        const regex = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
        return regex.test(email);
      },
      message: "Please fill in a valid email adress",
    },
  },
  emailConfirmed: {
    type: Boolean,
    default: false
  },
  confirmationToken: String,
  password: {
    type: String,
    required: [true, "The password field is required"],
    validate: {
      validator: function (password) {
        const regex =
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?\/\\~\-]).{8,}$/;
        return regex.test(password);
      },
      message:
        "Please fill in a valid password, which must contain at least an uppercase letter, a lowercase letter, a number, a special character and be at least 8 characters long",
    },
  },
  birthday: {
    type: Date,
    required: [true, "The birthday field is required"],
  },
  newsSubscription: {
    type: Boolean,
    default: 0,
    required: [true, "The news subscription field is required"],
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
    required: [true, "The role field is required"],
  },
  registrationDate: {
    type: Date,
    required: [true, "The registration date is required"],
    default: Date.now(),
  },
  lastConnected: {
    type: Date,
    required: [true, "The last connected date is required"],
    default: Date.now(),
  },
  upvotedArticles: {
    type: Array,
    required: [true, "The upvoted articles field is required"],
    default: [],
  },
  upvotedPosts: {
    type: Array,
    required: [true, "The upvoted posts field is required"],
    default: [],
  },
  savedArticles: {
    type: Array,
    required: [true, "The saved articles field is required"],
    default: [],
  },
  savedPosts: {
    type: Array,
    required: [true, "The saved posts field is required"],
    default: [],
  },
  articlesHistory: {
    type: Array,
    required: [true, "The articles history field is required"],
    default: [],
  },
  postsHistory: {
    type: Array,
    required: [true, "The posts history field is required"],
    default: [],
  },
  strikes: {
    type: Number,
    required: [true, "The strikes field is required"],
    default: 0,
    max: 3,
  }
  // transactions: [
  //   {
  //     transactionId: { type: String, required: true },
  //     amount: { type: Number, required: true }, // Montant en cents
  //     currency: { type: String, required: true, default: "EUR" },
  //     receiptUrl: { type: String },
  //     status: { type: String, required: true },
  //     paymentMethod: {
  //       type: { type: String },
  //       brand: { type: String },
  //       last4: { type: String },
  //     },
  //     createdAt: { type: Number, default: () => Math.floor(Date.now() / 1000) },
  //   },
  // ],
});

userSchema.plugin(uniqueValidator);

userSchema.pre("save", async function (next) {
  try {
    if (this.isModified("password")) {
      const hashedPassword = await bcrypt.hash(this.password, 10);
      this.password = hashedPassword;
    }
    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;