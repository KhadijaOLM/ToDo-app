const jwt = require('jsonwebtoken');
const User = require('../models/User');
const JWT_SECRET = "b74553890072f29c35b4eb869dc895acff4f863262ddd82c796a98f91acc5039";


const authMiddleware = async (req, res, next) => {
  try {
    // Récupérer le token du header
    const token = req.header('Authorization').replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'Pas de token, autorisation refusée' });
    }

    // Vérifier le token
    const decoded = jwt.verify(token,JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'Utilisateur non trouvé' });
    }

    // Ajouter l'utilisateur à la requête
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token invalide' });
  }
};

module.exports = authMiddleware;