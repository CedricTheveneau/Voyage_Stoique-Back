const Comment = require("../models/comment");
const mongoose = require("mongoose");

exports.create = async (req, res) => {  
  try {
    if (req.auth.userRole === "guest") {
      return res.status(403).json({
        message: "You do not have permission to create a comment.",
      });
    }
    const {
      author,
      authorUsername,
      content,
      parentComment,
    } = req.body;
    const comment = new Comment({
      author,
      authorUsername,
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
    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({
      message:
        err.message ||
        "Something wrong happened with your request to retrieve your comments.",
    });
  }
};

exports.getCommentsByIds = async (req, res) => {
  const ids = req.query.ids;
  
  if (!ids) {
    return res.status(400).json({ message: "Aucun ID fourni." });
  }

  const idArray = Array.isArray(ids) ? ids : ids.split(',');

  try {
    const validIds = idArray.map(id => {
      if (mongoose.Types.ObjectId.isValid(id)) {
        return new mongoose.Types.ObjectId(id);
      } else {
        throw new Error(`ID non valide : ${id}`);
      }
    });

    const comments = await Comment.find({ _id: { $in: validIds } });
    return res.status(200).json(comments);
  } catch (error) {
    console.error("Erreur lors de la récupération des commentaires :", error);
    return res.status(500).json({ message: "Erreur lors de la récupération des commentaires." });
  }
};

exports.upvote = async (req, res) => {
  try {
    if (req.auth.userRole === "guest") {
      return res.status(403).json({
        message: "You do not have permission to update this comment.",
      });
    }
    const check = await Comment.findById(req.params.id)
    if (!check) {
      return res.status(404).json({
        message: "Didn't find the comment you were looking for.",
      });
    }
    if (check.upvotes.includes(req.auth.userId)) {
      const comment = await Comment.findOneAndUpdate(
        {
          _id: req.params.id,
        },
        {
          $pull: { upvotes: req.auth.userId },
        },
        { new: true }
      );
      res.status(200).json(comment.upvotes);
    } else {
      const comment = await Comment.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      {
        $push: { upvotes: req.auth.userId },
      },
      { new: true }
    );
    res.status(200).json(comment.upvotes);
    }
  } catch (err) {
    res.status(500).json({
      message:
        err.message ||
        "Something wrong happened with your request to update your comment.",
    });
  }
};

exports.update = async (req, res) => {
  try {

    const commentCheck = await Comment.findById(req.params.id);

    if (!commentCheck) {
      return res.status(404).json({ message: "Comment not found." });
    }
  
    if (commentCheck.author !== req.auth.userId && req.auth.userRole !== "admin") {
      return res.status(403).json({ message: "You are not authorized to update this comment." });
    }

    const {
      content,
      authorUsername,
      upvotes
    } = req.body;
    const lastModifiedDate = Date.now();
    const comment = await Comment.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      {
      content,
      authorUsername,
      lastModifiedDate,
      upvotes
      },
      { returnDocument: "after" }
    );
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
    const commentCheck = await Comment.findById(req.params.id);
    if (!commentCheck) {
      return res.status(404).json({
        message: "Didn't find the comment you were looking for.",
      });
    }

    if (commentCheck.author !== req.auth.userId && req.auth.userRole !== "admin") {
      return res.status(403).json({
        message: "You do not have permission to delete this comment.",
      });
    }
    const childComments = await Comment.find({ parentComment: req.params.id });
    if (childComments.length > 0) {
      await Comment.deleteMany({ parentComment: req.params.id });
    }
    await Comment.findByIdAndDelete(req.params.id);
    res.status(200).json({
      message: "The fellowing comment has been deleted successfully.",
      comment: commentCheck,
      childComments: childComments
    });
  } catch (err) {
    res.status(500).json({
      message:
        err.message ||
        "Something wrong happened with your request to delete your comment.",
    });
  }
};