// app/utils/newsletterUtils.js
const User = require('../models/user'); // Modèle utilisateur

// Récupérer les emails des utilisateurs abonnés
const getEmailsForNewsletter = async () => {
  try {
    const users = await User.find({ newsSubscription: true }).select('email');
    return users.map(user => user.email);
  } catch (error) {
    console.error('Erreur lors de la récupération des emails :', error);
    return [];
  }
};

// Générer le contenu de la newsletter
const generateNewsletterContent = () => {
  // Gérer la génération du contenu de la newsletter ici
  return `
    <h1>Bonjour à tous !</h1>
    <p>Voici les dernières nouvelles de notre site.</p>
    <p>Profitez de nos nouveaux articles et plus encore.</p>
    <p>À bientôt !</p>
  `;
};

module.exports = { getEmailsForNewsletter, generateNewsletterContent };