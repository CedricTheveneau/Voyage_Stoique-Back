const Article = require("../models/article");

exports.create = async (req, res) => {
  try {
    if (req.auth.userRole !== "admin") {
      return res.status(403).json({
        message: "You do not have permission to create an article.",
      });
    }
    const {
      title,
      intro,
      cover,
      content,
      audio,
      keywords,
      category,
      author,
      readingTime,
    } = req.body;
    const article = new Article({
      title,
      intro,
      cover,
      content,
      audio,
      keywords,
      category,
      author,
      readingTime,
    });
    await article.save();
    res.status(201).json(article);
  } catch (err) {
    res.status(500).json({
      message:
        err.message || "Something went wrong while creating the article.",
    });
  }
};

exports.getAll = async (req, res) => {
  try {
    let articles = await Article.find();
    res.status(200).json(articles);
    if (!articles) {
      return res.status(404).json({
        message: "Didn't find any article.",
      });
    }
  } catch (err) {
    res.status(500).json({
      message:
        err.message ||
        "Something wrong happened with your request to retrieve articles.",
    });
  }
};

exports.getArticle = async (req, res) => {
  try {
    let article = await Article.findOne({
      _id: req.params.id,
    });
    if (!article) {
      return res.status(404).json({
        message: "Didn't find the article you were looking for.",
      });
    }
    const readArticle = await Article.findOneAndUpdate(
      { _id: req.params.id },
      {
        $push: { reads: req.auth.userId },
      },
      { returnDocument: "after" }
    );
    res.status(200).json(readArticle);
  } catch (err) {
    res.status(500).json({
      message:
        err.message ||
        "Something wrong happened with your request to retrieve your article.",
    });
  }
};

exports.getArticlesByKeyword = async (req, res) => {
  try {
    let articles = await Article.find({
      keyword: req.params.keyword,
    });
    if (!articles) {
      return res.status(404).json({
        message: "Didn't find the articles you were looking for.",
      });
    }
    res.status(200).json(articles);
  } catch (err) {
    res.status(500).json({
      message:
        err.message ||
        "Something wrong happened with your request to retrieve your articles.",
    });
  }
};

exports.getArticlesByCategory = async (req, res) => {
  try {
    let articles = await Article.find({
      category: req.params.category,
    });
    if (!articles) {
      return res.status(404).json({
        message: "Didn't find the articles you were looking for.",
      });
    }
    res.status(200).json(articles);
  } catch (err) {
    res.status(500).json({
      message:
        err.message ||
        "Something wrong happened with your request to retrieve your articles.",
    });
  }
};

exports.updateAdmin = async (req, res) => {
  try {
    if (req.auth.userRole !== "admin") {
      return res.status(403).json({
        message: "You do not have permission to update this article.",
      });
    }
    const articleCheck = await Article.findById(req.params.id);
    if (!articleCheck) {
      return res.status(404).json({ message: "Article not found." });
    }
    const {
      title,
      intro,
      content,
      keywords,
      category,
      upvotes,
      comments,
      savedNumber,
      reads,
      readingTime,
    } = req.body;
    const lastModifiedDate = Date.now();
    const article = await Article.findOneAndUpdate(
      { _id: req.params.id },
      {
        title,
        intro,
        content,
        keywords,
        category,
        upvotes,
        comments,
        savedNumber,
        reads,
        readingTime,
        lastModifiedDate,
      },
      { returnDocument: "after" }
    );
    res.status(200).json(article);
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
    const check = await Article.findById(req.params.id)
    if (!check) {
      return res.status(404).json({
        message: "Didn't find the article you were looking for.",
      });
    }
    if (check.upvotes.includes(req.auth.userId)) {
      const article = await Article.findOneAndUpdate(
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
      const article = await Article.findOneAndUpdate(
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
    const check = await Article.findById(req.params.id)
    if (!check) {
      return res.status(404).json({
        message: "Didn't find the article you were looking for.",
      });
    } else {
      const article = await Article.findOneAndUpdate(
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
    const check = await Article.findById(req.params.id)
    if (!check) {
      return res.status(404).json({
        message: "Didn't find the article you were looking for.",
      });
    }
    if (check.savedNumber.includes(req.auth.userId)) {
      const article = await Article.findOneAndUpdate(
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
      const article = await Article.findOneAndUpdate(
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
    if (req.auth.userRole !== "admin") {
      return res.status(403).json({
        message: "You do not have permission to delete this post.",
      });
    }
    const articleCheck = await Article.findById(req.params.id);
    if (!articleCheck) {
      return res.status(404).json({
        message: "Didn't find the article you were looking for.",
      });
    }
    await Article.findByIdAndDelete(req.params.id);
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
