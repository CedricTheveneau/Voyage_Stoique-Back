require('dotenv').config();
const mongoose = require('mongoose');
const slugify = require('slugify');
const Post = require('../models/post.js');

async function migrateSlugs() {
  try {
    await mongoose.connect(process.env.DB_URI, { ssl: process.env.DB_SSL });
    console.log('Connexion à MongoDB réussie.');

    const posts = await Post.find({ slug: { $exists: false } });
    console.log(`${posts.length} posts à mettre à jour...`);

    for (const post of posts) {
      post.slug = `${slugify(post.title, { lower: true, strict: true })}-${post._id}`;
      await post.save();
    }

    console.log('Migration terminée avec succès.');
    mongoose.connection.close();
  } catch (err) {
    console.error('Erreur lors de la migration des slugs :', err);
    mongoose.connection.close();
  }
}

migrateSlugs();