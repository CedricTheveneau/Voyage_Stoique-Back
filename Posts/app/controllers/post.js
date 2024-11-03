const Post = require("../models/post");
const mongoose = require('mongoose');
require("dotenv").config();
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

exports.create = async (req, res) => {
  if (req.auth.userRole === "guest") {
    return res.status(403).json({
      message: "You do not have permission to create a post.",
    });
  }

  try {
    const {
      title,
      cover,
      content,
      keywords,
      category,
      author,
      authorUsername
    } = req.body;
    const post = new Post({
      title,
      cover,
      content,
      keywords,
      category,
      author,
      authorUsername
    });
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({
      message: err.message || "Something went wrong while creating the post.",
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
        "Something wrong happened with your request to retrieve posts.",
    });
  }
};

exports.getPostsByIds = async (req, res) => {
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

    const articles = await Post.find({ _id: { $in: validIds } });
    return res.status(200).json(articles);
  } catch (error) {
    console.error("Erreur lors de la récupération des articles :", error);
    return res.status(500).json({ message: "Erreur lors de la récupération des articles." });
  }
};

exports.getPostsByQuery = async (req, res) => {
  try {
    const { q } = req.query; // Récupère le paramètre de recherche

    if (!q) {
      return res.status(400).json({ message: "Aucun terme de recherche fourni" });
    }

    const query = {
      $or: [
        { keywords: { $regex: q, $options: "i" } },
        { category: { $regex: q, $options: "i" } },
        { title: { $regex: q, $options: "i" } },
        { content: { $regex: q, $options: "i" } },
      ],
    };

    const articles = await Post.find(query);
    return res.status(200).json(articles);
  } catch (error) {
    console.error("Erreur lors de la recherche d'articles :", error);
    return res.status(500).json({ message: "Erreur interne du serveur" });
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

exports.getPostsByKeyword = async (req, res) => {
  try {
    let posts = await Post.find({
      keyword: req.params.keyword,
    });
    if (!posts) {
      return res.status(404).json({
        message: "Didn't find the posts you were looking for.",
      });
    }
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({
      message:
        err.message ||
        "Something wrong happened with your request to retrieve your posts.",
    });
  }
};

exports.getPostsByCategory = async (req, res) => {
  try {
    let posts = await Post.find({
      category: req.params.category,
    });
    if (!posts) {
      return res.status(404).json({
        message: "Didn't find the posts you were looking for.",
      });
    }
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({
      message:
        err.message ||
        "Something wrong happened with your request to retrieve your posts.",
    });
  }
};

exports.getPostsByAuthor = async (req, res) => {
  try {
    let posts = await Post.find({
      author: req.params.id,
    });
    if (!posts) {
      return res.status(404).json({
        message: "Didn't find the posts you were looking for.",
      });
    }
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({
      message:
        err.message ||
        "Something wrong happened with your request to retrieve your posts.",
    });
  }
};

exports.addRead = async (req, res) => {
  try {
    let article = await Post.findOne({
      _id: req.params.id,
    });
    if (!article) {
      return res.status(404).json({
        message: "Didn't find the post you were looking for.",
      });
    }
    if (req.auth.userId) {
          if (!article.reads.includes(req.auth.userId)) {
          article = await Post.findOneAndUpdate(
      { _id: req.params.id },
      {
        $push: { reads: req.auth.userId },
      },
      { returnDocument: "after" }
    );
    }
    }
    res.status(200).json(article);
  } catch (err) {
    res.status(500).json({
      message:
        err.message ||
        "Something wrong happened with your request to retrieve your article.",
    });
  }
};

exports.update = async (req, res) => {
  try {
    const postCheck = await Post.findById(req.params.id);
    if (!postCheck) {
      return res.status(404).json({ message: "Post not found." });
    }

    
    if (postCheck.author.toString() !== req.auth.userId && req.auth.userRole !== "admin") {
      return res.status(403).json({ message: "You are not authorized to update this post." });
    }
    
    const {
      title,
      cover,
      content,
      keywords,
      category,
      upvotes,
      comments,
      savedNumber,
      reads
    } = req.body;
    const lastModifiedDate = Date.now();
    const post = await Post.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      {
        title,
        cover,
        content,
        keywords,
        category,
        upvotes,
        comments,
        savedNumber,
        reads,
        lastModifiedDate
      },
      { returnDocument: "after" }
    );
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({
      message: err.message || "Something went wrong with updating the post.",
    });
  }
};

exports.updateByAuthor = async (req, res) => {
  try {
    const userId = req.params.id;
    const { authorUsername } = req.body; // Récupérer le nouveau nom d'utilisateur à appliquer aux commentaires

    // Vérification de l'autorisation : seul l'utilisateur peut effectuer cette modification
    if (userId !== req.auth.userId) {
      return res.status(403).json({ message: "You are not authorized to update these posts." });
    }

    // Récupérer et mettre à jour tous les commentaires ayant l'ID utilisateur correspondant
    const updatedPosts = await Post.updateMany(
      { author: userId }, // Filtre les commentaires par l'auteur
      { authorUsername: authorUsername }, // Met à jour le nom d'utilisateur et la date de modification
      { new: true } // Renvoyer les documents mis à jour
    );

    // Vérifier si des commentaires ont été trouvés et mis à jour
    if (updatedPosts.matchedCount === 0) {
      return res.status(404).json({ message: "No posts found for this user." });
    }

    // Renvoie le nombre de commentaires modifiés
    res.status(200).json({ message: `${updatedPosts.modifiedCount} posts updated successfully.` });
  } catch (err) {
    console.error("Erreur lors de la mise à jour des posts :", err);
    res.status(500).json({
      message:
        err.message || "Something wrong happened with your request to update posts.",
    });
  }
};

exports.removeCommentsByIds = async (req, res) => {
  try {
    if (req.auth.userRole !== "admin" && req.auth.userRole !== "user") {
      return res.status(403).json({
        message: "You do not have permission to update this article.",
      });
    }
    
    const article = await Post.findById(req.body.id);
    if (!article) {
      return res.status(404).json({ message: "Post not found." });
    }

    const toDelete = req.query.ids.split(",");
    article.comments = article.comments.filter(commentId => !toDelete.includes(commentId.toString()));

    const updatedPost = await article.save();

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(500).json({
      message: err.message || "Something went wrong with updating the article.",
    });
  }
};

exports.upvote = async (req, res) => {
  try {
    if (req.auth.userRole === "guest") {
      return res.status(403).json({
        message: "You do not have permission to update this article.",
      });
    }
    const check = await Post.findById(req.params.id)
    if (!check) {
      return res.status(404).json({
        message: "Didn't find the article you were looking for.",
      });
    }
    if (check.upvotes.includes(req.auth.userId)) {
      const article = await Post.findOneAndUpdate(
        {
          _id: req.params.id,
        },
        {
          $pull: { upvotes: req.auth.userId },
        },
        { new: true }
      );
      res.status(200).json(article.upvotes);
    } else {
      const article = await Post.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      {
        $push: { upvotes: req.auth.userId },
      },
      { new: true }
    );
    res.status(200).json(article.upvotes);
    }
  } catch (err) {
    res.status(500).json({
      message:
        err.message ||
        "Something wrong happened with your request to update your article.",
    });
  }
};

exports.comment = async (req, res) => {
  try {
    if (req.auth.userRole === "guest") {
      return res.status(403).json({
        message: "You do not have permission to update this article.",
      });
    }
    const check = await Post.findById(req.params.id)
    if (!check) {
      return res.status(404).json({
        message: "Didn't find the article you were looking for.",
      });
    } else {
      const article = await Post.findOneAndUpdate(
        {
          _id: req.params.id,
        },
        {
          $push: { comments: req.body.commentId },
        },
        { new: true }
      );
      res.status(200).json(article.comments);
    }
  } catch (err) {
    res.status(500).json({
      message:
        err.message ||
        "Something wrong happened with your request to update your article.",
    });
  }
};

exports.save = async (req, res) => {
  try {
    if (req.auth.userRole === "guest") {
      return res.status(403).json({
        message: "You do not have permission to update this article.",
      });
    }
    const check = await Post.findById(req.params.id)
    if (!check) {
      return res.status(404).json({
        message: "Didn't find the article you were looking for.",
      });
    }
    if (check.savedNumber.includes(req.auth.userId)) {
      const article = await Post.findOneAndUpdate(
        {
          _id: req.params.id,
        },
        {
          $pull: { savedNumber: req.auth.userId },
        },
        { new: true }
      );
      res.status(200).json(article.savedNumber);
    } else {
      const article = await Post.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      {
        $push: { savedNumber: req.auth.userId },
      },
      { new: true }
    );
    res.status(200).json(article.savedNumber);
    }
    
    
    
  } catch (err) {
    res.status(500).json({
      message:
        err.message ||
        "Something wrong happened with your request to update your article.",
    });
  }
};

exports.delete = async (req, res) => {
  try {
    const articleCheck = await Post.findById(req.params.id);
    if (!articleCheck) {
      return res.status(404).json({
        message: "Didn't find the article you were looking for.",
      });
    }
    if (req.auth.userRole === "guest" || req.auth.userId !== articleCheck.author) {
      return res.status(403).json({
        message: "You do not have permission to delete this post.",
      });
    }
    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({
      message: "The fellowing article has been deleted successfully.",
      article: articleCheck,
    });
  } catch (err) {
    res.status(500).json({
      message:
        err.message ||
        "Something wrong happened with your request to delete your article.",
    });
  }
};

exports.deletePostFile = async (req, res) => {
  const { fileUrl, resourceType } = req.body;

  if (!fileUrl || !resourceType) {
    return res.status(400).json({ message: 'fileUrl et resourceType sont requis.' });
  }

  try {
    // Extraction du public_id à partir de l'URL
    const urlSegments = fileUrl.split('/');
    const publicIdWithExtension = urlSegments[urlSegments.length - 1];
    const publicId = publicIdWithExtension.split('.')[0];

    // Appel de la méthode destroy de Cloudinary
    const options = { resource_type: resourceType };
    cloudinary.uploader.destroy(publicId, options, (error, result) => {
      if (error) {
        console.error("Erreur lors de la suppression sur Cloudinary:", error.message);
        return res.status(500).json({ message: 'La suppression du fichier sur Cloudinary a échoué.' });
      }
      if (result.result === "ok") {
        return res.json({ message: 'Fichier supprimé avec succès de Cloudinary.' });
      } else {
        throw new Error('La suppression du fichier sur Cloudinary a échoué.');
      }
    });
  } catch (error) {
    console.error("Erreur lors de la suppression sur Cloudinary:", error.message);
    return res.status(500).json({ message: error.message });
  }
};