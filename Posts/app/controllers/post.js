const Post = require("../models/post");
const { upload, compressImage } = require("../middlewares/imgUpload");

exports.create = async (req, res) => {
  upload.single("cover")(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: err.message });
    } else if (err) {
      return res.status(500).json({ message: err.message });
    }
    await compressImage(req, res, async (err) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }
      try {
        const {
          title,
      content,
      keywords,
      category,
      author
        } = req.body;
        const cover = req.file ? req.file.path : null;
        const post = new Post({
          title,
      cover,
      content,
      keywords,
      category,
      author
        });
        await post.save();
        res.status(201).json(post);
      } catch (err) {
        res.status(500).json({
          message: err.message || "Something went wrong while creating the post.",
        });
      }
    });
  });
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
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({
      message:
        err.message ||
        "Something wrong happened with your request to retrieve your posts.",
    });
  }
};

exports.update = async (req, res) => {
  upload.single("cover")(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: err.message });
    } else if (err) {
      return res.status(500).json({ message: err.message });
    }
    await compressImage(req, res, async (err) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }
      try {
        const {
          title,
      content,
      keywords,
      category,
      upvotes,
      comments,
      savedNumber,
      reads
        } = req.body;

        const lastModifiedDate = Date.now();

        const post = await Post.findById(req.params.id);
        if (!post) {
          return res.status(404).json({ message: "Post not found." });
        }
        if (req.file) {
          if (post.cover) {
            const oldImagePath = path.join(__dirname, "../..", post.cover);
            fs.unlink(oldImagePath, (err) => {
              if (err) console.error("Failed to delete old image:", err);
            });
          }
          post.cover = req.file.path;
        }
        post.title = title,
      post.content = content,
      post.keywords = keywords,
      post.category = category,
      post.upvotes = upvotes,
      post.comments = comments,
      post.savedNumber = savedNumber,
      post.reads = reads,
        post.lastModifiedDate = lastModifiedDate;
        await post.save();
        res.status(200).json(post);
      } catch (err) {
        res.status(500).json({
          message: err.message || "Something went wrong with updating the post.",
        });
      }
    });
  });
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