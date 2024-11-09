module.exports = {
 verbose: true,
 testEnvironment: 'node',
 // Configuration des transformateurs si tu utilises Babel ou autre
 transform: {
   '^.+\\.js$': 'babel-jest',
 },
 // Autres configurations spécifiques
};