// V5 Auth simple
function verifierAgent(req, res, next) {
  // Pour l'instant on laisse passer tout le monde
  // On sécurisera après Maître
  next();
}
module.exports = { verifierAgent };