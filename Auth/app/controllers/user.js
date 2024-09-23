const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { username, email, password, birthday, newsSubscription } = req.body;
    const user = new User({
      username,
      email,
      password,
      birthday,
      newsSubscription
    });
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({
      message:
        err.message ||
        "Something wrong happened with your request to create a new user.",
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const matchingPassword = await bcrypt.compare(password, user.password);
    if (!matchingPassword) {
      return res.status(401).json({ message: "Invalid password" });
    }
    const token = jwt.sign(
      { id: user._id, role: user.role, birthday: user.birthday },
      process.env.TOKEN_SECRET,
      {
        expiresIn: Number(process.env.TOKEN_EXPIRATION),
      }
    );
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({
      message: err.message || "An error accured during login.",
    });
  }
};

exports.update = async (req, res) => {
  try {
    const {
      username, email, password, birthday, newsSubscription, lastConnected, upvotedArticles, upvotedPosts, savedArticles, savedPosts, articlesHistory, postsHistory, strikes
    } = req.body;
    const user = await User.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      {
        username, email, password, birthday, newsSubscription, lastConnected, upvotedArticles, upvotedPosts, savedArticles, savedPosts, articlesHistory, postsHistory, strikes
      },
      { returnDocument: "after" }
    );
    if (!user) {
      return res.status(404).json({
        message: "Didn't find the user you were looking for.",
      });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({
      message:
        err.message ||
        "Something wrong happened with your request to update your user.",
    });
  }
};

exports.delete = async (req, res) => {
  try {
    const user = await Article.findOneAndDelete({
      _id: req.params.id,
    });
    if (!user) {
      return res.status(404).json({
        message: "Didn't find the user you were looking for.",
      });
    }
    res.status(200).json({
      message: "The fellowing user has been deleted successfully.",
      user: user,
    });
  } catch (err) {
    res.status(500).json({
      message:
        err.message ||
        "Something wrong happened with your request to delete your user.",
    });
  }
};

exports.getUserInfoFromToken = (req, res) => {
  try {
    const { userId, userRole, userBirthday } = req.auth;
    res.status(200).json({ userId, userRole, userBirthday });
  } catch (err) {
    res.status(500).json({
      message:
        err.message || "An error accured while retreiving the user's data.",
    });
  }
};