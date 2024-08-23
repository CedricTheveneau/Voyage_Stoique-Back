const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = new User({
      email: email,
      password: password,
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
      { id: user._id, role: user.role },
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

exports.getUserInfoFromToken = (req, res) => {
  try {
    const { userId, userRole } = req.auth;
    res.status(200).json({ userId, userRole });
  } catch (err) {
    res.status(500).json({
      message:
        err.message || "An error accured while retreiving the user's data.",
    });
  }
};