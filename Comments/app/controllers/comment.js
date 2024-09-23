const Comment = require("../models/comment");

exports.create = async (req, res) => {
  try {
    const {
      author,
      content,
      parentComment,
    } = req.body;
    const comment = new Comment({
      author,
      content,
      parentComment,
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
        "Something wrong happened with your request to retrieve comments.",
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

exports.getCommentsByAuthor = async (req, res) => {
  try {
    let comments = await Comment.find({
      author: req.params.id,
    });
    if (!comments) {
      return res.status(404).json({
        message: "Didn't find the comments you were looking for.",
      });
    }
    res.status(200).json(comment);
  } catch (err) {
    res.status(500).json({
      message:
        err.message ||
        "Something wrong happened with your request to retrieve your comments.",
    });
  }
};

exports.update = async (req, res) => {
  try {
    const {
      author,
      content,
      parentComment,
      upvotes
    } = req.body;
    const lastModifiedDate = Date.now();
    const comment = await Comment.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      {
        author,
      content,
      parentComment,
      lastModifiedDate,
      upvotes
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