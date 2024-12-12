require('dotenv').config();
const mongoose = require('mongoose');
const slugify = require('slugify');
const Article = require('../models/article.js');

async function migrateSlugs() {
  try {
    await mongoose.connect(process.env.DB_URI, { ssl: process.env.DB_SSL });
    console.log('Connexion à MongoDB réussie.');

    const articles = await Article.find({ slug: { $exists: false } });
    console.log(`${articles.length} articles à mettre à jour...`);

    for (const article of articles) {
      article.slug = `${slugify(article.title, { lower: true, strict: true })}-${article._id}`;
      await article.save();
    }

    console.log('Migration terminée avec succès.');
    mongoose.connection.close();
  } catch (err) {
    console.error('Erreur lors de la migration des slugs :', err);
    mongoose.connection.close();
  }
}

migrateSlugs();