const Article = require("../models/article");

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
    const article = new Article({
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
    await article.save();
    res.status(201).json(article);
  } catch (err) {
    res.status(500).json({
      message:
        err.message ||
        "Something wrong happened with your request to create a new article.",
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
        "Something wrong happened with your request to retrieve your accounts.",
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
    const article = await Article.findOneAndUpdate(
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
    const article = await Article.findOneAndDelete({
      _id: req.params.id,
    });
    if (!article) {
      return res.status(404).json({
        message: "Didn't find the article you were looking for.",
      });
    }
    res.status(200).json({
      message: "The fellowing article has been deleted successfully.",
      article: article,
    });
  } catch (err) {
    res.status(500).json({
      message:
        err.message ||
        "Something wrong happened with your request to delete your article.",
    });
  }
};