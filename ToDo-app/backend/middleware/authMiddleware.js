const jwt = require('jsonwebtoken');
const User = require('../models/User');
const JWT_SECRET = "b74553890072f29c35b4eb869dc895acff4f863262ddd82c796a98f91acc5039";

const authMiddleware = async (req, res, next) => {
  try {
    console.log("Headers reçus:", req.headers);

    
    const authHeader = req.header('Authorization');
    console.log("Authorization Header:", authHeader);
    if (!authHeader) {
      return res.status(401).json({ message: 'Pas de token, autorisation refusée' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Format du token invalide' });
    }

    // Vérifier le token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
      console.log("Token décodé:", decoded);
    } catch (err) {
      return res.status(401).json({ message: 'Token invalide ou expiré' });
    }

    // Vérifier si l'utilisateur existe
    const user = await User.findById(decoded.id).select('-password');
    console.log("Utilisateur trouvé:", user);
    if (!user) {
      return res.status(401).json({ message: 'Utilisateur non trouvé' });
    }

    // Ajouter l'utilisateur à la requête
    req.user = user;
    next();
  } catch (error) {
    console.error('Erreur authMiddleware:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

module.exports = authMiddleware;
