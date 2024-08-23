const Post = require("../models/post");

exports.create = async (req, res) => {
  try {
    const {
      profilePic,
      firstName,
      lastName,
      job,
      currentCompany,
      currentCompanyAdress,
      skills,
      qrCode,
      contactEmail,
      contactTel,
      ctaText,
      ctalink,
    } = req.body;
    const post = new Post({
      profilePic,
      firstName,
      lastName,
      job,
      currentCompany,
      currentCompanyAdress,
      skills,
      qrCode,
      contactEmail,
      contactTel,
      ctaText,
      ctalink,
    });
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({
      message:
        err.message ||
        "Something wrong happened with your request to create a new post.",
    });
  }
};

exports.getAll = async (req, res) => {
  try {
    let posts = await Post.find();
    res.status(200).json(posts);
    if (!posts) {
      return res.status(404).json({
        message: "Didn't find any post.",
      });
    }
  } catch (err) {
    res.status(500).json({
      message:
        err.message ||
        "Something wrong happened with your request to retrieve your accounts.",
    });
  }
};

exports.getPost = async (req, res) => {
  try {
    let post = await Post.findOne({
      _id: req.params.id,
    });
    if (!post) {
      return res.status(404).json({
        message: "Didn't find the post you were looking for.",
      });
    }
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({
      message:
        err.message ||
        "Something wrong happened with your request to retrieve your post.",
    });
  }
};

exports.update = async (req, res) => {
  try {
    const {
      profilePic,
      firstName,
      lastName,
      job,
      currentCompany,
      currentCompanyAdress,
      skills,
      qrCode,
      contactEmail,
      contactTel,
      ctaText,
      ctalink,
    } = req.body;
    const post = await Post.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      {
        profilePic,
        firstName,
        lastName,
        job,
        currentCompany,
        currentCompanyAdress,
        skills,
        qrCode,
        contactEmail,
        contactTel,
        ctaText,
        ctalink,
      },
      { returnDocument: "after" }
    );
    if (!post) {
      return res.status(404).json({
        message: "Didn't find the post you were looking for.",
      });
    }
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({
      message:
        err.message ||
        "Something wrong happened with your request to update your post.",
    });
  }
};

exports.delete = async (req, res) => {
  try {
    const post = await Post.findOneAndDelete({
      _id: req.params.id,
    });
    if (!post) {
      return res.status(404).json({
        message: "Didn't find the post you were looking for.",
      });
    }
    res.status(200).json({
      message: "The fellowing post has been deleted successfully.",
      post: post,
    });
  } catch (err) {
    res.status(500).json({
      message:
        err.message ||
        "Something wrong happened with your request to delete your post.",
    });
  }
};