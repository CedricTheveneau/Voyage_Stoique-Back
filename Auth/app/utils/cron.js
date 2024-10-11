const cron = require('node-cron');
const nodemailer = require('nodemailer');
const { getEmailsForNewsletter, generateNewsletterContent } = require('./newsletterUtils'); // Utils pour gérer les emails et le contenu

// Configurer le transporteur Nodemailer
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com', // ou autre service de mail
  port: 587, // Port pour TLS
  secure: false, // true pour 465, false pour d'autres ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS.trim(),
  },
});

// Tâche cron planifiée (ici, tous les dimanches à 9h)
cron.schedule('00 10 * * 6', async () => {
  console.log('Envoi de la newsletter démarré...');
  
  // Récupérer les emails des utilisateurs abonnés
  const recipients = await getEmailsForNewsletter();

  if (recipients.length === 0) {
    console.log('Aucun destinataire trouvé pour la newsletter.');
    return;
  }

  // Générer le contenu de la newsletter
  const newsletterContent = generateNewsletterContent();

  // Construire les options de l'email
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: recipients.join(','),
    subject: 'Voyage Stoïque | Votre newsletter hebdomadaire',
    html: newsletterContent,
  };

  // Envoyer l'email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log('Erreur lors de l’envoi de la newsletter :', error);
    }
    console.log('Newsletter envoyée avec succès :', info.response);
  });
}, {
  scheduled: true,
  timezone: "Europe/Paris"
});