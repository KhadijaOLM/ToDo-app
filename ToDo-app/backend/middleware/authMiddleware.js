const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
    let token;
    
    console.log('--- Auth Middleware ---');
    console.log('Route accédée:', req.originalUrl);
    console.log('Headers complets:', JSON.stringify(req.headers));
    
    try {
        // Check header
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
            console.log('Token trouvé dans les headers:', token?.substring(0, 15) + '...');
        } 
        // Check cookie
        else if (req.cookies && req.cookies.token && req.cookies.token.startsWith('Bearer')) {
            token = req.cookies.token.split(' ')[1];
            console.log('Token trouvé dans les cookies:', token?.substring(0, 15) + '...');
        } else {
            console.log('Aucun token trouvé dans les headers ou cookies');
            console.log('Headers Authorization:', req.headers.authorization);
        }

        if (!token) {
            console.log('Token manquant - Accès non autorisé');
            return res.status(401).json({
                success: false,
                message: 'Accès non autorisé - Token manquant'
            });
        }

        // Vérifier si le token est bien formé avant de tenter de le décoder
        if (token.split('.').length !== 3) {
            console.error('Format de token JWT invalide');
            return res.status(401).json({
                success: false,
                message: 'Format de token invalide'
            });
        }

        console.log('JWT_SECRET défini:', !!process.env.JWT_SECRET);
        console.log('Tentative de vérification du token...');
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Token vérifié avec succès. ID utilisateur:', decoded.id);
        console.log('Expiration du token:', new Date(decoded.exp * 1000).toLocaleString());
        
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            console.log('Utilisateur non trouvé dans la base de données pour ID:', decoded.id);
            return res.status(404).json({
                success: false,
                message: 'Utilisateur non trouvé'
            });
        }

        console.log('Utilisateur authentifié:', user.username || user.email);
        req.user = {
            id: user._id,
            email: user.email,
            username: user.username,
            role: user.role
        };
        console.log('Req.user défini:', req.user);
        next();
    } catch (err) {
        console.error('Erreur d\'authentification détaillée:', {
            name: err.name,
            message: err.message,
            stack: err.stack
        });
        
        let errorMessage = 'Session invalide';
        if (err.name === 'TokenExpiredError') {
            errorMessage = 'Session expirée';
        } else if (err.name === 'JsonWebTokenError') {
            errorMessage = 'Token invalide: ' + err.message;
        }

        return res.status(401).json({
            success: false,
            message: errorMessage
        });
    }
};

module.exports = authMiddleware;
