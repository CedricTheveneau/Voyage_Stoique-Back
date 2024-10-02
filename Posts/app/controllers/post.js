const Post = require("../models/post");

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
      author
    } = req.body;
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
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({
      message:
        err.message ||
        "Something wrong happened with your request to retrieve your posts.",
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

exports.delete = async (req, res) => {
  try {
    
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({
        message: "Didn't find the post you were looking for.",
      });
    }

    
    if (post.author.toString() !== req.auth.userId && req.auth.userRole !== "admin") {
      return res.status(403).json({
        message: "You do not have permission to delete this post.",
      });
    }

    
    await Post.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "The following post has been deleted successfully.",
      post: post,
    });
  } catch (err) {
    res.status(500).json({
      message:
        err.message ||
        "Something went wrong with your request to delete your post.",
    });
  }
};