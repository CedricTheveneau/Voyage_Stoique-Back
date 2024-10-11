// utils/emailUtils.js
const nodemailer = require("nodemailer");

const sendConfirmationEmail = async (userEmail, confirmationUrl) => {
  // Configuration du transporteur
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', // Assure-toi que le host est correct
  port: 587, // Port pour TLS
  secure: false, // true pour 465, false pour d'autres ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS.trim(),
    },
  });

  // Configuration de l'email
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: "Voyage Stoïque | Confirmez votre adresse e-mail",
    html: `
      <h1 style="text-align:center;color:#141414;">Bienvenue dans la communauté Voyage Stoïque !</h1>
      <h2 style="text-align:center;color:#141414;">Nous sommes plus que ravis de vous compter parmis nos membres.</h2><br/><br/>
      <p style="text-align:justify;color:#141414;">Merci de vous être inscrit. Pour confirmer votre adresse e-mail, veuillez cliquer sur le lien ci-dessous :</p>
      <a style="color:#B0ABED;text-decoration:underline;font-weight:bold;font-style:italic;font-size:18px;text-transform:uppercase;" href="${confirmationUrl}">Je confirme mon adresse e-mail !</a><br/><br/><br/>
      <h2>À très bientôt !</h2><br/><br/>
      <p style="font-weight:bold;font-style:italic;text-align:right;display:block;">L'équipe Voyage Stoïque</p>
    `,
  };

  // Envoi de l'email
  return transporter.sendMail(mailOptions);
};

module.exports = { sendConfirmationEmail };