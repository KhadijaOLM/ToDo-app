const adminMiddleware = (req, res, next) => {
    try {
      // Vérifier si l'utilisateur a le rôle "admin"
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Accès refusé, admin seulement' });
      }
  
      next(); // Passer au middleware ou au contrôleur suivant
    } catch (err) {
      res.status(500).json({ message: 'Erreur du serveur' });
    }
  };
  
  module.exports = adminMiddleware;