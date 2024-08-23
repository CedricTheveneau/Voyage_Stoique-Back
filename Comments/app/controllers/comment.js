const Comment = require("../models/comment");

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
    const comment = new Comment({
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
    await comment.save();
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({
      message:
        err.message ||
        "Something wrong happened with your request to create a new comment.",
    });
  }
};

exports.getAll = async (req, res) => {
  try {
    let comments = await Comment.find();
    res.status(200).json(comments);
    if (!comments) {
      return res.status(404).json({
        message: "Didn't find any comment.",
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

exports.getComment = async (req, res) => {
  try {
    let comment = await Comment.findOne({
      _id: req.params.id,
    });
    if (!comment) {
      return res.status(404).json({
        message: "Didn't find the comment you were looking for.",
      });
    }
    res.status(200).json(comment);
  } catch (err) {
    res.status(500).json({
      message:
        err.message ||
        "Something wrong happened with your request to retrieve your comment.",
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
    const comment = await Comment.findOneAndUpdate(
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
    if (!comment) {
      return res.status(404).json({
        message: "Didn't find the comment you were looking for.",
      });
    }
    res.status(200).json(comment);
  } catch (err) {
    res.status(500).json({
      message:
        err.message ||
        "Something wrong happened with your request to update your comment.",
    });
  }
};

exports.delete = async (req, res) => {
  try {
    const comment = await Comment.findOneAndDelete({
      _id: req.params.id,
    });
    if (!comment) {
      return res.status(404).json({
        message: "Didn't find the comment you were looking for.",
      });
    }
    res.status(200).json({
      message: "The fellowing comment has been deleted successfully.",
      comment: comment,
    });
  } catch (err) {
    res.status(500).json({
      message:
        err.message ||
        "Something wrong happened with your request to delete your comment.",
    });
  }
};