const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendConfirmationEmail } = require("../utils/emailUtils");
const crypto = require("crypto");

exports.register = async (req, res) => {
  try {
    const { username, email, password, birthday, newsSubscription } = req.body;

    // Génération d'un token de confirmation unique
    const confirmationToken = crypto.randomBytes(32).toString("hex");

    const user = new User({
      username,
      email,
      password,
      birthday,
      newsSubscription,
      confirmationToken, // ajout du token
      emailConfirmed: false, // email non confirmé par défaut
    });
    await user.save();

    // Envoie de l'email de confirmation
    const confirmationUrl = `${process.env.FRONTEND_URL}/confirm-email/${confirmationToken}`;
    sendConfirmationEmail(user.email, confirmationUrl);

    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({
      message:
        err.message ||
        "Something wrong happened with your request to create a new user.",
    });
  }
};

exports.confirmEmail = async (req, res) => {
  try {
    const { token } = req.params;

    // Trouver l'utilisateur avec le token de confirmation
    const user = await User.findOne({ confirmationToken: token });

    if (!user) {
      return res.status(404).json({ message: "Invalid or expired token" });
    }

    // Mettre à jour l'état de confirmation de l'email
    user.emailConfirmed = true;
    user.confirmationToken = undefined; // supprimer le token après validation
    await user.save();

    res.status(200).json({ message: "Email confirmed! You can now log in." });
  } catch (err) {
    res.status(500).json({ message: "Error during email confirmation." });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!user.emailConfirmed) {
      return res
        .status(403)
        .json({
          message:
            "Please confirm your email before logging in. We've sent an email to the email adress associated with your account.",
        });
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
    const updatedUser = await User.findOneAndUpdate(
      {
        _id: user._id,
      },
      {
        lastConnected: Date.now(),
      },
      { returnDocument: "after" }
    );
    res.status(200).json({ token, updatedUser });
  } catch (err) {
    res.status(500).json({
      message: err.message || "An error accured during login.",
    });
  }
};

exports.saveArticle = async (req, res) => {
  try {
    const userCheck = await User.findById(req.params.id);

    if (!userCheck) {
      return res.status(404).json({ message: "User not found." });
    }

    if (userCheck.id !== req.auth.userId && req.auth.userRole !== "admin") {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this user." });
    }

    if (userCheck.savedArticles.includes(req.body.savedArticles)) {
      const user = await User.findOneAndUpdate(
        {
          _id: req.params.id,
        },
        {
          $pull: { savedArticles: req.body.savedArticles },
        },
        { new: true }
      );
      res.status(200).json(user.savedArticles);
    } else {
      const user = await User.findOneAndUpdate(
        {
          _id: req.params.id,
        },
        {
          $push: { savedArticles: req.body.savedArticles },
        },
        { new: true }
      );
      res.status(200).json(user.savedArticles);
    }
  } catch (err) {
    res.status(500).json({
      message:
        err.message ||
        "Something wrong happened with your request to update your user.",
    });
  }
};

exports.upvoteArticle = async (req, res) => {
  try {
    const userCheck = await User.findById(req.params.id);

    if (!userCheck) {
      return res.status(404).json({ message: "User not found." });
    }

    if (userCheck.id !== req.auth.userId && req.auth.userRole !== "admin") {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this user." });
    }

    if (userCheck.upvotedArticles.includes(req.body.upvotedArticles)) {
      const user = await User.findOneAndUpdate(
        {
          _id: req.params.id,
        },
        {
          $pull: { upvotedArticles: req.body.upvotedArticles },
        },
        { new: true }
      );
      res.status(200).json(user.upvotedArticles);
    } else {
      const user = await User.findOneAndUpdate(
        {
          _id: req.params.id,
        },
        {
          $push: { upvotedArticles: req.body.upvotedArticles },
        },
        { new: true }
      );
      res.status(200).json(user.upvotedArticles);
    }
  } catch (err) {
    res.status(500).json({
      message:
        err.message ||
        "Something wrong happened with your request to update your user.",
    });
  }
};

exports.articlesHistory = async (req, res) => {
  try {
    const userCheck = await User.findById(req.params.id);

    if (!userCheck) {
      return res.status(404).json({ message: "User not found." });
    }

    if (userCheck.id !== req.auth.userId && req.auth.userRole !== "admin") {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this user." });
    }

    let user = await User.findOneAndUpdate(
      { _id: req.params.id },
      { $pull: { articlesHistory: req.body.articlesHistory } }
    );

    user = await User.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      {
        $push: { articlesHistory: req.body.articlesHistory },
      },
      { new: true }
    );
    res.status(200).json(user.articlesHistory);
  } catch (err) {
    res.status(500).json({
      message:
        err.message ||
        "Something wrong happened with your request to update your user.",
    });
  }
};

exports.update = async (req, res) => {
  try {
    const userCheck = await User.findById(req.params.id);

    if (!userCheck) {
      return res.status(404).json({ message: "User not found." });
    }

    if (userCheck.id !== req.auth.userId && req.auth.userRole !== "admin") {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this user." });
    }

    const {
      username,
      email,
      password,
      birthday,
      newsSubscription,
      lastConnected,
      upvotedArticles,
      upvotedPosts,
      savedArticles,
      savedPosts,
      articlesHistory,
      postsHistory,
      strikes,
    } = req.body;
    const user = await User.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      {
        username,
        email,
        password,
        birthday,
        newsSubscription,
        lastConnected,
        upvotedArticles,
        upvotedPosts,
        savedArticles,
        savedPosts,
        articlesHistory,
        postsHistory,
        strikes,
      },
      { returnDocument: "after" }
    );
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
    const userCheck = await User.findById(req.params.id);
    if (!userCheck) {
      return res.status(404).json({
        message: "Didn't find the user you were looking for.",
      });
    }

    if (userCheck.id !== req.auth.userId && req.auth.userRole !== "admin") {
      return res.status(403).json({
        message: "You do not have permission to delete this user.",
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "The fellowing user has been deleted successfully.",
      user: userCheck,
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

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({
      message:
        err.message || "An error accured while retreiving the user's data.",
    });
  }
};
