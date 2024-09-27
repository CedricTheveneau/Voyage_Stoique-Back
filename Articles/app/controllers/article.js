const Article = require("../models/article");


// exports.create = async (req, res) => {
//   upload.single("cover")(req, res, async (err) => {
//     if (err instanceof multer.MulterError) {
//       return res.status(400).json({ message: err.message });
//     } else if (err) {
//       return res.status(500).json({ message: err.message });
//     }
//     await compressImage(req, res, async (err) => {
//       if (err) {
//         return res.status(500).json({ message: err.message });
//       }
//       try {
//         const {
//           title,
//           intro,
//           content,
//           audio,
//           keywords,
//           category,
//           author,
//           readingTime
//         } = req.body;
//         const cover = req.file ? req.file.path : null;
//         const article = new Article({
//           title,
//           intro,
//           cover,
//           content,
//           audio,
//           keywords,
//           category,
//           author,
//           readingTime
//         });
//         await article.save();
//         res.status(201).json(article);
//       } catch (err) {
//         res.status(500).json({
//           message: err.message || "Something went wrong while creating the article.",
//         });
//       }
//     });
//   });
// };

exports.create = async (req, res) => {
  try {
    if (req.auth.userRole !== "admin") {
      return res.status(403).json({
        message: "You do not have permission to create an article.",
      });
    }
    if (req.fileValidationError) {
      return res.status(400).json({ message: req.fileValidationError });
    }
    const {
      title,
      intro,
      content,
      keywords,
      category,
      author,
      readingTime
    } = req.body;
    const cover = req.file ? req.file.path : null;
    const audio = req.audio ? req.audio.path : null;
    const article = new Article({
      title,
      intro,
      cover,
      content,
      audio,
      keywords,
      category,
      author,
      readingTime
    });
    await article.save();
    res.status(201).json(article);
  } catch (err) {
    res.status(500).json({
      message: err.message || "Something went wrong while creating the article.",
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
    res.status(200).json(article);
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

exports.getArticlesByAuthor = async (req, res) => {
  try {
    let articles = await Article.find({
      author: req.params.id,
    });
    if (!articles) {
      return res.status(404).json({
        message: "Didn't find the articles you were looking for.",
      });
    }
    res.status(200).json(article);
  } catch (err) {
    res.status(500).json({
      message:
        err.message ||
        "Something wrong happened with your request to retrieve your articles.",
    });
  }
};

// exports.updateAdmin = async (req, res) => {
//   upload.single("cover")(req, res, async (err) => {
//     if (err instanceof multer.MulterError) {
//       return res.status(400).json({ message: err.message });
//     } else if (err) {
//       return res.status(500).json({ message: err.message });
//     }
//     await compressImage(req, res, async (err) => {
//       if (err) {
//         return res.status(500).json({ message: err.message });
//       }
//       try {
//         const {
//           title,
//           intro,
//           content,
//           audio,
//           keywords,
//           category,
//           upvotes,
//           comments,
//           savedNumber,
//           reads,
//           readingTime
//         } = req.body;

//         const lastModifiedDate = Date.now();

//         const article = await Article.findById(req.params.id);
//         if (!article) {
//           return res.status(404).json({ message: "Article not found." });
//         }
//         if (req.file) {
//           if (article.cover) {
//             const oldImagePath = path.join(__dirname, "../..", article.cover);
//             fs.unlink(oldImagePath, (err) => {
//               if (err) console.error("Failed to delete old image:", err);
//             });
//           }
//           article.cover = req.file.path;
//         }
//         article.title = title;
//         article.intro = intro;
//         article.content = content;
//         article.audio = audio;
//         article.keywords = keywords;
//         article.category = category;
//         article.upvotes = upvotes;
//         article.comments = comments;
//         article.savedNumber = savedNumber;
//         article.reads = reads;
//         article.readingTime = readingTime;
//         article.lastModifiedDate = lastModifiedDate;
//         await article.save();
//         res.status(200).json(article);
//       } catch (err) {
//         res.status(500).json({
//           message: err.message || "Something went wrong with updating the article.",
//         });
//       }
//     });
//   });
// };

exports.updateAdmin = async (req, res) => {
  try {
    if (req.auth.userRole !== "admin") {
      return res.status(403).json({
        message: "You do not have permission to update this article.",
      });
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
      readingTime
    } = req.body;
    const lastModifiedDate = Date.now();
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ message: "Article not found." });
    }
    if (req.file) {
      if (article.cover) {
        const oldImagePath = path.join(__dirname, "../..", article.cover);
        fs.unlink(oldImagePath, (err) => {
          if (err) console.error("Failed to delete old image:", err);
        });
      }
      article.cover = req.file.path;
    }
    if (req.audio) {
      if (article.audio) {
        const oldAudioPath = path.join(__dirname, "../..", article.audio);
        fs.unlink(oldAudioPath, (err) => {
          if (err) console.error("Failed to delete old audio:", err);
        });
      }
      article.audio = req.audio.path;
    }
    article.title = title;
    article.intro = intro;
    article.content = content;
    article.keywords = keywords;
    article.category = category;
    article.upvotes = upvotes;
    article.comments = comments;
    article.savedNumber = savedNumber;
    article.reads = reads;
    article.readingTime = readingTime;
    article.lastModifiedDate = lastModifiedDate
    await article.save();
    res.status(200).json(article);
  } catch (err) {
    res.status(500).json({
      message: err.message || "Something went wrong with updating the article.",
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    if (req.auth.userRole === "guest") {
      return res.status(403).json({
        message: "You do not have permission to update this article.",
      });
    }
    const {
      upvotes,
      comments,
      savedNumber,
      reads
    } = req.body;
    const article = await Article.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      {
        upvotes,
      comments,
      savedNumber,
      reads
      },
      { returnDocument: "after" }
    );
    if (!article) {
      return res.status(404).json({
        message: "Didn't find the article you were looking for.",
      });
    }
    res.status(200).json(article);
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
  if (articleCheck.cover) {
    fs.unlink(articleCheck.cover, (err) => {
      if (err) console.error("Failed to delete old image:", err);
    });
  }
  if (articleCheck.audio) {
    fs.unlink(articleCheck.audio, (err) => {
      if (err) console.error("Failed to delete old image:", err);
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