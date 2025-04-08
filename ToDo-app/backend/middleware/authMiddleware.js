
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
    let token;
    
    // Check header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    } 
    // Check cookie
    else if (req.cookies.token && req.cookies.token.startsWith('Bearer')) {
        token = req.cookies.token.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            error: 'Accès non autorisé - Token manquant'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'Utilisateur non trouvé'
            });
        }

        req.user = user.toObject(); // Convert Mongoose doc to plain object
        next();
    } catch (err) {
        console.error('Auth middleware error:', err.message);
        
        let errorMessage = 'Session invalide';
        if (err.name === 'TokenExpiredError') {
            errorMessage = 'Session expirée';
        } else if (err.name === 'JsonWebTokenError') {
            errorMessage = 'Token invalide';
        }

        return res.status(401).json({
            success: false,
            error: errorMessage
        });
    }
};
module.exports = authMiddleware;
