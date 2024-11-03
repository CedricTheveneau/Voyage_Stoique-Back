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

exports.updateByAuthor = async (req, res) => {
  try {
    const userId = req.params.id;
    const { authorUsername } = req.body; // Récupérer le nouveau nom d'utilisateur à appliquer aux commentaires

    // Vérification de l'autorisation : seul l'utilisateur ou un admin peut effectuer cette modification
    if (userId !== req.auth.userId && req.auth.userRole !== "admin") {
      return res.status(403).json({ message: "You are not authorized to update these comments." });
    }

    // Récupérer et mettre à jour tous les commentaires ayant l'ID utilisateur correspondant
    const updatedComments = await Comment.updateMany(
      { author: userId }, // Filtre les commentaires par l'auteur
      { authorUsername: authorUsername }, // Met à jour le nom d'utilisateur et la date de modification
      { new: true } // Renvoyer les documents mis à jour
    );

    // Vérifier si des commentaires ont été trouvés et mis à jour
    if (updatedComments.matchedCount === 0) {
      return res.status(404).json({ message: "No comments found for this user." });
    }

    // Renvoie le nombre de commentaires modifiés
    res.status(200).json({ message: `${updatedComments.modifiedCount} comments updated successfully.` });
  } catch (err) {
    console.error("Erreur lors de la mise à jour des commentaires :", err);
    res.status(500).json({
      message:
        err.message || "Something wrong happened with your request to update comments.",
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

exports.deleteByIds = async (req, res) => {
  const commentIds = req.query.ids ? req.query.ids.split(',') : []; // Récupère les IDs de la query

  if (commentIds.length === 0) {
    return res.status(400).json({ message: "Aucun ID fourni." });
  }

  try {
    // Vérifie si les commentaires existent
    const comments = await Comment.find({ _id: { $in: commentIds } });
    
    if (comments.length === 0) {
      return res.status(404).json({ message: "Aucun commentaire trouvé pour les IDs fournis." });
    }

    // Vérification des permissions
    for (const comment of comments) {
      if (comment.author !== req.auth.userId && req.auth.userRole === "guest") {
        return res.status(403).json({
          message: "Vous n'avez pas la permission de supprimer un ou plusieurs commentaires.",
        });
      }
    }

    // Suppression des commentaires et de leurs réponses
    const childCommentsPromises = comments.map(comment =>
      Comment.find({ parentComment: comment._id }).then(childComments => {
        if (childComments.length > 0) {
          return Comment.deleteMany({ parentComment: comment._id });
        }
        return null;
      })
    );

    await Promise.all(childCommentsPromises); // Attend que toutes les suppressions de réponses soient terminées
    await Comment.deleteMany({ _id: { $in: commentIds } }); // Supprime tous les commentaires

    res.status(200).json({
      message: "Les commentaires suivants ont été supprimés avec succès.",
      deletedComments: comments,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message || "Une erreur s'est produite lors de la suppression des commentaires.",
    });
  }
};